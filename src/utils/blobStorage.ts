import { compressImageFile } from './storageHelper';

export const isVercelBlobConfigured = (): boolean => {
  return true;
};

export const dataUrlToFile = (dataUrl: string, fileName = 'uploaded_image.jpg'): File => {
  try {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  } catch (e) {
    console.error('Failed to convert dataUrl to File:', e);
    return new File([], fileName, { type: 'image/jpeg' });
  }
};

export const syncAllSiteImagesToVercelBlob = async (
  content: any,
  _onProgress?: (msg: string) => void
): Promise<{ updatedContent: any; uploadedCount: number }> => {
  return { updatedContent: content, uploadedCount: 0 };
};

// Upload photo directly to server disk & return persistent permanent URL
export const uploadImageToVercelBlob = async (
  rawFile: File,
  onProgress?: (status: string) => void,
  targetFileName?: string
): Promise<{ url: string; isBlobStorage: boolean }> => {
  if (onProgress) onProgress('사진 최적화 및 서버 영구 저장 중...');
  try {
    const { dataUrl } = await compressImageFile(rawFile, 2400, 2400, 0.90);
    
    // Attempt backend direct upload
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl,
          filename: rawFile.name,
          targetName: targetFileName,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.url) {
          if (onProgress) onProgress('✓ 사진이 안전하게 영구 저장되었습니다!');
          return { url: `${json.url}?t=${Date.now()}`, isBlobStorage: true };
        }
      }
    } catch (apiErr) {
      console.warn('Backend upload api failed, fallback to local dataUrl:', apiErr);
    }

    return { url: dataUrl, isBlobStorage: false };
  } catch (err) {
    console.error('Image compression or upload failed:', err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ url: e.target?.result as string, isBlobStorage: false });
      };
      reader.readAsDataURL(rawFile);
    });
  }
};

