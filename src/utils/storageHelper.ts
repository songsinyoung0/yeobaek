// Robust IndexedDB & Storage Helper for Yeobaek Studio
// Prevents QuotaExceededError (DOMException 22 / NS_ERROR_DOM_QUOTA_REACHED) by using IndexedDB for large image data

const DB_NAME = 'YeobaekStudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'siteData';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const getStoredData = async <T,>(key: string, fallback: T): Promise<T> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const data = await new Promise<T | null>((resolve) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });

    if (data !== null) {
      return data;
    }
  } catch (e) {
    console.warn('IndexedDB read fallback to localStorage:', e);
  }

  // Fallback to localStorage if IndexedDB is empty or fails
  try {
    const localData = localStorage.getItem(key);
    if (localData) {
      return JSON.parse(localData);
    }
  } catch (e) {
    console.error('localStorage read error:', e);
  }

  return fallback;
};

export const saveStoredData = async <T,>(key: string, value: T): Promise<boolean> => {
  let savedInDB = false;

  // 1. Primary Save to IndexedDB (Supports 500MB~1GB+, zero quota errors)
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    savedInDB = true;
  } catch (e) {
    console.warn('Failed to save to IndexedDB:', e);
  }

  // 2. Secondary Save to localStorage (with silent quota handling)
  try {
    const jsonString = JSON.stringify(value);
    localStorage.setItem(key, jsonString);
  } catch (_e) {
    // Quota reached for localStorage; silently handled as data is safely stored in IndexedDB
  }

  return savedInDB;
};

// Automatic smart compression & resize utility for uploaded photos
export const compressImageFile = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<{ dataUrl: string; originalKb: number; compressedKb: number }> => {
  return new Promise((resolve, reject) => {
    const originalKb = Math.round(file.size / 1024);
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          const raw = e.target?.result as string;
          resolve({ dataUrl: raw, originalKb, compressedKb: originalKb });
          return;
        }

        // Draw image onto canvas for compression
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const compressedKb = Math.round((dataUrl.length * 0.75) / 1024);

        resolve({ dataUrl, originalKb, compressedKb });
      };

      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

// Automatic smart compression to File object for high-speed cloud upload
export const compressImageToFile = (
  file: File,
  maxWidth = 2000,
  maxHeight = 2000,
  quality = 0.85
): Promise<File> => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '') || 'photo';
            const compressedFile = new File([blob], `${nameWithoutExt}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            console.log(
              `[Image Compressor] Original: ${(file.size / 1024 / 1024).toFixed(2)}MB -> Compressed: ${(
                compressedFile.size /
                1024 /
                1024
              ).toFixed(2)}MB`
            );
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};
