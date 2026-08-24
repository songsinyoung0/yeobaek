import React, { createContext, useContext, useState, useEffect } from 'react';
import { HeroSlide, GalleryItem, PackageOption, Testimonial, FaqItem, InquiryItem, ReservationFormData } from '../types';
import { HERO_SLIDES, GALLERY_ITEMS, PACKAGES, TESTIMONIALS, FAQ_ITEMS } from '../data/weddingData';
import { getStoredData, saveStoredData } from '../utils/storageHelper';

export interface AboutContent {
  tagline: string;
  title: string;
  description: string;
  aboutQuote: string;
  aboutDesc1: string;
  aboutDesc2: string;
  directorName: string;
  directorTitle: string;
  directorPhoto: string;
  photo1: string;
  photo2: string;
}

export interface StudioInfo {
  brandName: string;
  ceoName: string;
  slogan: string;
  subSlogan: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  businessNumber: string;
  workingHours: string;
  instagram: string;
  kakao: string;
  kakaoLink: string;
}

export interface SiteContent {
  heroSlides: HeroSlide[];
  about: AboutContent;
  galleryItems: GalleryItem[];
  packages: PackageOption[];
  testimonials: Testimonial[];
  faqItems: FaqItem[];
  studioInfo: StudioInfo;
}

const DEFAULT_ABOUT: AboutContent = {
  tagline: 'Brand Philosophy',
  title: '가장 특별한 날, 여백의 미(美)로 완성하는 서사',
  description: '여백스튜디오는 화려하게 부풀려진 프레임보다, 눈부신 순간들 사이에 흐르는 고요한 온기와 진심에 집중합니다. 비워낼수록 채워지는 감동의 깊이를 웨딩 본식 스냅으로 증명합니다.',
  aboutQuote: '"결혼식은 연출된 연극이 아닌, 사랑하는 이들과의 가장 진실된 만남입니다."',
  aboutDesc1: "수백 번의 결혼식을 스케치하면서 저희가 깨달은 단 하나의 진리는 '가장 예쁜 사진은 가장 편안한 순간에서 나온다'는 사실입니다.",
  aboutDesc2: '여백스튜디오의 작가진은 현장에서 지나치게 개입하기보다, 두 사람의 호흡과 하객분들의 온정 어린 축복을 관조하듯 기품 있게 포착합니다.',
  directorName: '송신영 대표작가',
  directorTitle: 'Head Photographer & Director',
  directorPhoto: 'https://i.postimg.cc/CL8MPP3r/profile.jpg',
  photo1: 'https://i.postimg.cc/WbZpWWB8/about-1.jpg',
  photo2: 'https://i.postimg.cc/L6P4CCcy/about-2.jpg',
};

const DEFAULT_STUDIO_INFO: StudioInfo = {
  brandName: '여백스튜디오 (Yeobaek Studio)',
  ceoName: '송신영',
  slogan: '가장 눈부신 순간, 여백으로 담다.',
  subSlogan: '감성적이고 모던하며 깊이 있는 본식 스냅으로 인생의 가장 특별한 날을 완성해 드립니다.',
  phone: '010-9855-5795',
  mobile: '010-9855-5795',
  email: 'yeobaek5795@naver.com',
  address: '익산시 동서로 49길 23-19, 2층(여백스튜디오)',
  businessNumber: '580-54-00931',
  workingHours: '수~월요일 11:00 ~ 19:00 (화요일 휴무)',
  instagram: 'https://www.instagram.com/yeobaek_studio_iksan/',
  kakao: '여백스튜디오 익산',
  kakaoLink: 'https://pf.kakao.com/_AxdWxgn',
};

const STORAGE_KEY = 'yeobaek_site_content_v51';
const INQUIRIES_STORAGE_KEY = 'yeobaek_inquiries_v1';

interface ContentContextType {
  content: SiteContent;
  inquiries: InquiryItem[];
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  toggleAdminMode: () => void;
  addInquiry: (data: ReservationFormData, refNum: string) => InquiryItem;
  updateInquiryStatus: (id: string, status: InquiryItem['status']) => void;
  deleteInquiry: (id: string) => void;
  updateAbout: (fields: Partial<AboutContent>) => void;
  updateStudioInfo: (fields: Partial<StudioInfo>) => void;
  updateHeroSlide: (id: string, slide: Partial<HeroSlide>) => void;
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  deleteHeroSlide: (id: string) => void;
  reorderHeroSlides: (fromIndex: number, toIndex: number) => void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  reorderGalleryItems: (fromIndex: number, toIndex: number) => void;
  updatePackage: (id: string, pkg: Partial<PackageOption>) => void;
  updateTestimonial: (id: string, t: Partial<Testimonial>) => void;
  addTestimonial: (t: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  updateFaq: (id: string, faq: Partial<FaqItem>) => void;
  addFaq: (faq: Omit<FaqItem, 'id'>) => void;
  deleteFaq: (id: string) => void;
  resetAllToDefault: () => void;
  syncBrowserStorageToBlob: (onProgress?: (msg: string) => void) => Promise<{ updatedContent: SiteContent; uploadedCount: number }>;
}

const syncGalleryOrder = (items: GalleryItem[]): GalleryItem[] => {
  if (!items || items.length === 0) return GALLERY_ITEMS;
  return items;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || params.get('edit') === 'true' || params.has('admin')) {
        return true;
      }
    }
    return false;
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const loadedPackages = parsed.packages || PACKAGES;
        const hasLegacyPackages = loadedPackages.some(
          (p: PackageOption) => p.id === 'type-a' || p.id === 'type-b' || p.id === 'type-c'
        );
        const validPackages = hasLegacyPackages ? PACKAGES : loadedPackages;

        const rawSlides: HeroSlide[] = parsed.heroSlides || HERO_SLIDES;
        const normalizedSlides = rawSlides.map((slide, idx) => {
          const defaultSlide = HERO_SLIDES[idx] || HERO_SLIDES[0];
          if (!slide.imageUrl || slide.imageUrl.includes('photo-1544078751-58fee2d8a03b')) {
            return {
              ...slide,
              imageUrl: defaultSlide.imageUrl,
            };
          }
          return slide;
        });

        return {
          heroSlides: normalizedSlides,
          about: { ...DEFAULT_ABOUT, ...parsed.about },
          galleryItems: syncGalleryOrder(parsed.galleryItems || GALLERY_ITEMS),
          packages: validPackages,
          testimonials: parsed.testimonials || TESTIMONIALS,
          faqItems: parsed.faqItems || FAQ_ITEMS,
          studioInfo: { ...DEFAULT_STUDIO_INFO, ...parsed.studioInfo },
        };
      }
    } catch (e) {
      console.error('Failed to parse site content from localStorage:', e);
    }
    return {
      heroSlides: HERO_SLIDES,
      about: DEFAULT_ABOUT,
      galleryItems: GALLERY_ITEMS,
      packages: PACKAGES,
      testimonials: TESTIMONIALS,
      faqItems: FAQ_ITEMS,
      studioInfo: DEFAULT_STUDIO_INFO,
    };
  });

  const [inquiries, setInquiries] = useState<InquiryItem[]>(() => {
    try {
      const saved = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse inquiries from localStorage:', e);
    }
    return [];
  });

  // Load IndexedDB persisted content on mount
  useEffect(() => {
    let isMounted = true;
    
    Promise.all([
      getStoredData<SiteContent | null>(STORAGE_KEY, null),
      getStoredData<InquiryItem[]>(INQUIRIES_STORAGE_KEY, [])
    ]).then(([asyncData, asyncInquiries]) => {
      if (!isMounted) return;

      if (asyncData) {
        const loadedPackages = asyncData.packages || PACKAGES;
        const hasLegacyPackages = loadedPackages.some(
          (p: PackageOption) => p.id === 'type-a' || p.id === 'type-b' || p.id === 'type-c'
        );
        const validPackages = hasLegacyPackages ? PACKAGES : loadedPackages;

        const rawAsyncSlides: HeroSlide[] = asyncData.heroSlides || HERO_SLIDES;
        const normalizedAsyncSlides = rawAsyncSlides.map((slide, idx) => {
          if (!slide.imageUrl) {
            const defaultSlide = HERO_SLIDES[idx] || HERO_SLIDES[0];
            return {
              ...slide,
              imageUrl: defaultSlide.imageUrl,
            };
          }
          return slide;
        });

        setContent({
          heroSlides: normalizedAsyncSlides,
          about: { ...DEFAULT_ABOUT, ...asyncData.about },
          galleryItems: syncGalleryOrder(asyncData.galleryItems || GALLERY_ITEMS),
          packages: validPackages,
          testimonials: asyncData.testimonials || TESTIMONIALS,
          faqItems: asyncData.faqItems || FAQ_ITEMS,
          studioInfo: { ...DEFAULT_STUDIO_INFO, ...asyncData.studioInfo },
        });
      }

      if (asyncInquiries && asyncInquiries.length > 0) {
        setInquiries(asyncInquiries);
      }

      setIsInitialized(true);
    }).catch((err) => {
      console.error('Error loading stored site data:', err);
      if (isMounted) setIsInitialized(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Save content automatically using IndexedDB & quota-protected localStorage ONLY after initialization
  useEffect(() => {
    if (!isInitialized) return;
    saveStoredData(STORAGE_KEY, content);
  }, [content, isInitialized]);

  // Save inquiries automatically ONLY after initialization
  useEffect(() => {
    if (!isInitialized) return;
    saveStoredData(INQUIRIES_STORAGE_KEY, inquiries);
  }, [inquiries, isInitialized]);

  const addInquiry = (data: ReservationFormData, refNum: string): InquiryItem => {
    const now = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newInquiry: InquiryItem = {
      id: 'inq-' + Date.now(),
      referenceNumber: refNum,
      submittedAt: now,
      status: 'NEW',
      data,
    };

    setInquiries((prev) => [newInquiry, ...prev]);
    return newInquiry;
  };

  const updateInquiryStatus = (id: string, status: InquiryItem['status']) => {
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleAdminMode = () => setIsAdminMode((prev) => !prev);

  const updateAbout = (fields: Partial<AboutContent>) => {
    setContent((prev) => ({
      ...prev,
      about: { ...prev.about, ...fields },
    }));
  };

  const updateStudioInfo = (fields: Partial<StudioInfo>) => {
    setContent((prev) => ({
      ...prev,
      studioInfo: { ...prev.studioInfo, ...fields },
    }));
  };

  const updateHeroSlide = (id: string, slide: Partial<HeroSlide>) => {
    setContent((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((item) => (item.id === id ? { ...item, ...slide } : item)),
    }));
  };

  const addHeroSlide = (slide: Omit<HeroSlide, 'id'>) => {
    const newSlide: HeroSlide = {
      ...slide,
      id: 'slide-' + Date.now(),
    };
    setContent((prev) => ({
      ...prev,
      heroSlides: [...prev.heroSlides, newSlide],
    }));
  };

  const deleteHeroSlide = (id: string) => {
    setContent((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((item) => item.id !== id),
    }));
  };

  const reorderHeroSlides = (fromIndex: number, toIndex: number) => {
    setContent((prev) => {
      if (fromIndex < 0 || fromIndex >= prev.heroSlides.length || toIndex < 0 || toIndex >= prev.heroSlides.length) {
        return prev;
      }
      const updated = [...prev.heroSlides];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return {
        ...prev,
        heroSlides: updated,
      };
    });
  };

  const updateGalleryItem = (id: string, item: Partial<GalleryItem>) => {
    setContent((prev) => ({
      ...prev,
      galleryItems: prev.galleryItems.map((g) => (g.id === id ? { ...g, ...item } : g)),
    }));
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: 'g-' + Date.now(),
    };
    setContent((prev) => ({
      ...prev,
      galleryItems: [newItem, ...prev.galleryItems],
    }));
  };

  const deleteGalleryItem = (id: string) => {
    setContent((prev) => ({
      ...prev,
      galleryItems: prev.galleryItems.filter((g) => g.id !== id),
    }));
  };

  const reorderGalleryItems = (fromIndex: number, toIndex: number) => {
    setContent((prev) => {
      if (fromIndex < 0 || fromIndex >= prev.galleryItems.length || toIndex < 0 || toIndex >= prev.galleryItems.length) {
        return prev;
      }
      const updated = [...prev.galleryItems];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return {
        ...prev,
        galleryItems: updated,
      };
    });
  };

  const updatePackage = (id: string, pkg: Partial<PackageOption>) => {
    setContent((prev) => ({
      ...prev,
      packages: prev.packages.map((p) => (p.id === id ? { ...p, ...pkg } : p)),
    }));
  };

  const updateTestimonial = (id: string, t: Partial<Testimonial>) => {
    setContent((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((item) => (item.id === id ? { ...item, ...t } : item)),
    }));
  };

  const addTestimonial = (t: Omit<Testimonial, 'id'>) => {
    const newItem: Testimonial = {
      ...t,
      id: 't-' + Date.now(),
    };
    setContent((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, newItem],
    }));
  };

  const deleteTestimonial = (id: string) => {
    setContent((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((item) => item.id !== id),
    }));
  };

  const updateFaq = (id: string, faq: Partial<FaqItem>) => {
    setContent((prev) => ({
      ...prev,
      faqItems: prev.faqItems.map((f) => (f.id === id ? { ...f, ...faq } : f)),
    }));
  };

  const addFaq = (faq: Omit<FaqItem, 'id'>) => {
    const newItem: FaqItem = {
      ...faq,
      id: 'faq-' + Date.now(),
    };
    setContent((prev) => ({
      ...prev,
      faqItems: [...prev.faqItems, newItem],
    }));
  };

  const deleteFaq = (id: string) => {
    setContent((prev) => ({
      ...prev,
      faqItems: prev.faqItems.filter((f) => f.id !== id),
    }));
  };

  const syncBrowserStorageToBlob = async (onProgress?: (msg: string) => void) => {
    const { syncAllSiteImagesToVercelBlob } = await import('../utils/blobStorage');
    const { updatedContent, uploadedCount } = await syncAllSiteImagesToVercelBlob(content, onProgress);
    if (uploadedCount > 0) {
      setContent(updatedContent);
      saveStoredData(STORAGE_KEY, updatedContent);
    }
    return { updatedContent, uploadedCount };
  };

  const resetAllToDefault = () => {
    const defaultData: SiteContent = {
      heroSlides: HERO_SLIDES,
      about: DEFAULT_ABOUT,
      galleryItems: GALLERY_ITEMS,
      packages: PACKAGES,
      testimonials: TESTIMONIALS,
      faqItems: FAQ_ITEMS,
      studioInfo: DEFAULT_STUDIO_INFO,
    };
    setContent(defaultData);
    saveStoredData(STORAGE_KEY, defaultData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('localStorage clear error:', e);
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        inquiries,
        isAdminMode,
        setIsAdminMode,
        toggleAdminMode,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        updateAbout,
        updateStudioInfo,
        updateHeroSlide,
        addHeroSlide,
        deleteHeroSlide,
        reorderHeroSlides,
        updateGalleryItem,
        addGalleryItem,
        deleteGalleryItem,
        reorderGalleryItems,
        updatePackage,
        updateTestimonial,
        addTestimonial,
        deleteTestimonial,
        updateFaq,
        addFaq,
        deleteFaq,
        resetAllToDefault,
        syncBrowserStorageToBlob,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used within a ContentProvider');
  }
  return ctx;
};
