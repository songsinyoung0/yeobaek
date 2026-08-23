export type GalleryCategory = 'ALL' | 'DIRECTING' | 'BRIDAL_ROOM' | 'CEREMONY' | 'FLOWER_SHOWER';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  categoryLabel: string;
  imageUrl: string;
  venue: string;
  description: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
}

export interface PackageOption {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  westernPrice: string;
  priceValue: number;
  westernPriceValue: number;
  isRecommended?: boolean;
  features: string[];
  photographerConfig: string;
  deliverables: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  imageUrl: string;
  venue: string;
}

export interface ReservationFormData {
  groomName: string;
  brideName: string;
  phone: string;
  email: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  selectedPackage: string;
  priceType: 'NORMAL' | 'WESTERN';
  reviewEvent: 'JOIN' | 'NONE';
  specialRequests: string;
  agreeToTerms: boolean;
}

export interface InquiryItem {
  id: string;
  referenceNumber: string;
  submittedAt: string;
  status: 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'CANCELLED';
  data: ReservationFormData;
}

export interface InquiryResult {
  referenceNumber: string;
  submittedAt: string;
  data: ReservationFormData;
}

export interface Testimonial {
  id: string;
  coupleNames: string;
  weddingDate: string;
  venue: string;
  content: string;
  rating: number;
  imageUrl: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
