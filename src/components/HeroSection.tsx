import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight, ShieldCheck, Sparkles, Award, Camera, Edit3, Image as ImageIcon } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { QuickEditPhotoModal } from './AdminEditorModal';
import { EditableText } from './EditableText';

const DEFAULT_SLIDE_IMAGES = [
  'https://i.postimg.cc/qqPJBy3n/mein-1.jpg',
  'https://i.postimg.cc/1XkmRwqG/mein-2.jpg',
  'https://i.postimg.cc/zvszDKgP/mein-3.jpg',
  'https://i.postimg.cc/FzMrF3LD/mein-4.jpg',
];

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { content, isAdminMode, updateHeroSlide } = useSiteContent();
  const slides = content.heroSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [editingPhotoModalOpen, setEditingPhotoModalOpen] = useState(false);

  useEffect(() => {
    if (isPaused || isAdminMode) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length, isAdminMode]);

  const activeSlide = slides[currentSlide] || slides[0];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#121212]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Quick Edit Photo Modal */}
      {activeSlide && (
        <QuickEditPhotoModal
          isOpen={editingPhotoModalOpen}
          onClose={() => setEditingPhotoModalOpen(false)}
          currentUrl={activeSlide.imageUrl}
          title={`슬라이드 #${currentSlide + 1} (${activeSlide.venue})`}
          onSave={(newUrl) => {
            updateHeroSlide(activeSlide.id, { imageUrl: newUrl });
          }}
        />
      )}

      {/* Admin Mode Quick Edit Overlay Banner for Hero */}
      {isAdminMode && (
        <div className="absolute top-24 right-6 z-40 bg-amber-500/90 text-white px-4 py-2 rounded-xl shadow-lg backdrop-blur-md flex items-center space-x-2 text-xs">
          <Edit3 className="w-4 h-4" />
          <span>현재 배경 사진 변경:</span>
          <button
            onClick={() => setEditingPhotoModalOpen(true)}
            className="px-3 py-1 bg-black text-white hover:bg-white hover:text-black rounded-lg font-medium transition-colors flex items-center space-x-1"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>📷 이 사진 수정</span>
          </button>
        </div>
      )}

      {/* Background Image Carousel with Zoom Transition */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        const defaultImg = DEFAULT_SLIDE_IMAGES[index] || DEFAULT_SLIDE_IMAGES[0];
        const displayUrl = (slide.imageUrl && slide.imageUrl.trim() !== '') ? slide.imageUrl : defaultImg;

        return (
          <div
            key={`${slide.id}-${displayUrl}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={displayUrl}
              alt={slide.title || '여백스튜디오 웨딩 스냅'}
              loading={isActive ? 'eager' : 'lazy'}
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedKorean) {
                  target.dataset.triedKorean = '1';
                  // If /images/main-1.jpg failed, try /images/메인-1.jpg or vice versa
                  if (displayUrl.includes('main-')) {
                    target.src = displayUrl.replace('main-', '메인-');
                    return;
                  } else if (displayUrl.includes('메인-')) {
                    target.src = displayUrl.replace('메인-', 'main-');
                    return;
                  }
                }
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = '1';
                  target.src = `/images/gallery-0${(index % 12) + 1}.jpg`;
                }
              }}
              className={`w-full h-full object-cover object-center transition-transform duration-[8000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Cinematic Gradient Overlays - Optimized for mobile clarity */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/30 to-black/50" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/15 to-black/60" />
          </div>
        );
      })}

      {/* Hero Content Overlay */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white pt-20 sm:pt-28 pb-32 sm:pb-36">
        {/* Tagline Badge */}
        <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 mb-2.5 sm:mb-6 animate-fadeIn">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#EAE7E2]" />
          <span className="font-serif-en text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#EAE7E2]">
            <EditableText
              value={activeSlide.tagline}
              onSave={(val) => updateHeroSlide(activeSlide.id, { tagline: val })}
              label="태그라인"
            />
          </span>
        </div>

        {/* Sub Copy */}
        <div className="font-serif-en text-[11px] sm:text-base md:text-lg tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/90 mb-1.5 sm:mb-3 font-light drop-shadow-xs">
          <EditableText
            value={activeSlide.subtitle}
            onSave={(val) => updateHeroSlide(activeSlide.id, { subtitle: val })}
            label="서브 타이틀"
          />
        </div>

        {/* Main Copy (Heading) */}
        <h1 className="font-serif-kr text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.3] sm:leading-[1.2] mb-2 sm:mb-6 text-balance tracking-tight drop-shadow-md">
          <EditableText
            value={activeSlide.title}
            onSave={(val) => updateHeroSlide(activeSlide.id, { title: val })}
            label="메인 헤드라인"
            multiline
          />
        </h1>

        {/* Venue Information Pill */}
        <div className="text-[10.5px] sm:text-sm text-white/75 font-light tracking-widest mb-5 sm:mb-10 drop-shadow-xs">
          LOCATION:{' '}
          <span className="text-[#E2CBA9] font-normal">
            <EditableText
              value={activeSlide.venue}
              onSave={(val) => updateHeroSlide(activeSlide.id, { venue: val })}
              label="촬영 장소/웨딩홀"
            />
          </span>
        </div>

        {/* CTA Buttons - Compact & Side-by-Side on Mobile */}
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-6 max-w-sm sm:max-w-md mx-auto px-2">
          <button
            onClick={() => onNavigate('reservation')}
            className="flex-1 sm:flex-none px-3.5 py-2.5 sm:px-8 sm:py-4 bg-[#1A1A1A]/90 hover:bg-[#A68F7E] text-white border border-white/20 rounded-full sm:rounded-xs text-[11px] sm:text-xs font-medium tracking-wider sm:tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center space-x-1.5 sm:space-x-3 group active:scale-[0.98] whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 text-[#E2CBA9] group-hover:text-white shrink-0" />
            <span>예약 문의하기</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform shrink-0 hidden xs:inline-block" />
          </button>

          <button
            onClick={() => onNavigate('gallery')}
            className="flex-1 sm:flex-none px-3.5 py-2.5 sm:px-8 sm:py-4 bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md rounded-full sm:rounded-xs text-[11px] sm:text-xs font-medium tracking-wider sm:tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center space-x-1.5 active:scale-[0.98] whitespace-nowrap"
          >
            <span>포트폴리오 감상</span>
          </button>
        </div>
      </div>

      {/* Manual Slide Controls */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-xs border border-white/10 transition-all focus:outline-hidden"
        aria-label="이전 사진 보기"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-xs border border-white/10 transition-all focus:outline-hidden"
        aria-label="다음 사진 보기"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 sm:space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentSlide
                ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-[#E2CBA9]'
                : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`슬라이드 ${idx + 1}로 이동`}
          />
        ))}
      </div>

      {/* Bottom Brand Key Metrics / Feature Highlights Pill */}
      <div className="absolute bottom-0 inset-x-0 z-20 bg-[#1A1A1A]/95 text-white pt-3.5 pb-3 sm:pt-5 sm:pb-4 border-t border-white/10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-3 md:gap-6 text-white/90 text-center text-[10px] sm:text-sm">
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 py-0.5 sm:py-1">
            <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-[#A68F7E] shrink-0" />
            <span className="font-medium text-white truncate">본식 전문 <strong className="text-[#E2CBA9] font-semibold">500+ 팀</strong></span>
          </div>
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 py-0.5 sm:py-1">
            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-[#A68F7E] shrink-0" />
            <span className="font-medium text-white truncate"><strong className="text-[#E2CBA9] font-semibold">100%</strong> 시그니처 색감</span>
          </div>
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 py-0.5 sm:py-1">
            <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-[#A68F7E] shrink-0" />
            <span className="font-medium text-white truncate">대표/실장 촬영 시스템</span>
          </div>
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 py-0.5 sm:py-1">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#A68F7E] shrink-0" />
            <span className="font-medium text-white truncate">이벤트용 <strong className="text-[#E2CBA9] font-semibold">7일 초고속</strong> 전송</span>
          </div>
        </div>
      </div>
    </section>
  );
};
