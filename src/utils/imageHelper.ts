// Utility to resolve image URLs reliably across all environments (Vercel, Local, Custom Domain)

const POSTIMG_DIRECT_MAP: Record<string, string> = {
  'Wh2Ptnbq': 'https://i.postimg.cc/WbZpWWB8/about-1.jpg',
  'PPtkN4rZ': 'https://i.postimg.cc/L6P4CCcy/about-2.jpg',
  'Yhpwj3qQ': 'https://i.postimg.cc/CL8MPP3r/profile.jpg',
  '1VKhJgM5': 'https://i.postimg.cc/qqPJBy3n/mein-1.jpg',
  'rR9XQdgs': 'https://i.postimg.cc/1XkmRwqG/mein-2.jpg',
  '2LxR2qT4': 'https://i.postimg.cc/zvszDKgP/mein-3.jpg',
  'q6GVjtQ3': 'https://i.postimg.cc/FzMrF3LD/mein-4.jpg',
  '4H1kBKwt': 'https://i.postimg.cc/7hFHP02B/poteupollio-1.jpg',
  'Z0PSTgZ5': 'https://i.postimg.cc/8k9PbQ0M/poteupollio-10.jpg',
  's1PrV8y3': 'https://i.postimg.cc/NGSfxqz2/poteupollio-11.jpg',
  'QHXrVbxF': 'https://i.postimg.cc/PrDf33gQ/poteupollio-12.jpg',
  'ctcyXKTw': 'https://i.postimg.cc/C53hMkqP/poteupollio-2.jpg',
  'Hj0gpKmS': 'https://i.postimg.cc/nVgc1bPt/poteupollio-3.jpg',
  '6TVX9SK1': 'https://i.postimg.cc/3rVJZ5c7/poteupollio-4.jpg',
  'DmQT2DhH': 'https://i.postimg.cc/NGSfxqzs/poteupollio-5.jpg',
  'Thj6RSxB': 'https://i.postimg.cc/L4w6VKb4/poteupollio-6.jpg',
  'gryWY5p5': 'https://i.postimg.cc/bYWNRcBz/poteupollio-7.jpg',
  'vD7sQjyJ': 'https://i.postimg.cc/Y2ZqxKsC/poteupollio-8.jpg',
  'LnHMhT6n': 'https://i.postimg.cc/ZKNY77GF/poteupollio-9.jpg',
};

export function resolveImageUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Check if it's a postimg.cc page link
  for (const [key, directUrl] of Object.entries(POSTIMG_DIRECT_MAP)) {
    if (trimmed.includes(key)) {
      return directUrl;
    }
  }

  // If it's a generic postimg.cc viewer link
  if (trimmed.includes('postimg.cc/') && !trimmed.includes('i.postimg.cc/')) {
    const match = trimmed.match(/postimg\.cc\/([A-Za-z0-9]+)/);
    if (match && match[1] && POSTIMG_DIRECT_MAP[match[1]]) {
      return POSTIMG_DIRECT_MAP[match[1]];
    }
  }

  return trimmed;
}
