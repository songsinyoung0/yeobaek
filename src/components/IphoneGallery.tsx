import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Instagram,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MapPin,
  Tag,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  Clock,
  Heart,
} from 'lucide-react';
import { GalleryCategory, GalleryItem } from '../types';
import { useSiteContent } from '../context/ContentContext';
import { IPHONE_GALLERY_ITEMS } from '../data/weddingData';
import { uploadImageToVercelBlob } from '../utils/blobStorage';
import { resolveImageUrl } from '../utils/imageHelper';

interface IphoneGalleryProps {
  onNavigateToPricing?: () => void;
  onNavigateToReservation?: () => void;
}

export const IphoneGallery: React.FC<IphoneGalleryProps> = ({
  onNavigateToPricing,
  onNavigateToReservation,
}) => {
  const { content, isAdminMode, updateIphoneGalleryItem, addIphoneGalleryItem, deleteIphoneGalleryItem } =
    useSiteContent();
  const items: GalleryItem[] = content.iphoneGalleryItems || IPHONE_GALLERY_ITEMS;
  const { studioInfo } = content;

  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('ALL');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  // Add Photo Modal States for iPhone Snap
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GalleryCategory>('BRIDAL_ROOM');
  const [newVenue, setNewVenue] = useState('익산 웨스턴라이프');
  const [newDescription, setNewDescription] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: { key: GalleryCategory; label: string; enLabel: string }[] = [
    { key: 'ALL', label: '전체보기', enLabel: 'ALL' },
    { key: 'BRIDAL_ROOM', label: '신부대기실', enLabel: 'BRIDAL ROOM' },
    { key: 'CEREMONY', label: '본식 순간', enLabel: 'CEREMONY' },
    { key: 'FLOWER_SHOWER', label: '플라워샤워&퇴장', enLabel: 'FLOWER SHOWER' },
    { key: 'DIRECTING', label: '감성 연출', enLabel: 'DIRECTING' },
  ];

  const filteredItems =
    selectedCategory === 'ALL'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  // Lightbox Navigation
  const currentLightboxIndex = activeLightboxItem
    ? filteredItems.findIndex((item) => item.id === activeLightboxItem.id)
    : -1;

  const handleNextLightbox = () => {
    if (currentLightboxIndex !== -1) {
      const nextIdx = (currentLightboxIndex + 1) % filteredItems.length;
      setActiveLightboxItem(filteredItems[nextIdx]);
    }
  };

  const handlePrevLightbox = () => {
    if (currentLightboxIndex !== -1) {
      const prevIdx = (currentLightboxIndex - 1 + filteredItems.length) % filteredItems.length;
      setActiveLightboxItem(filteredItems[prevIdx]);
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeLightboxItem) return;
      if (e.key === 'Escape') setActiveLightboxItem(null);
      if (e.key === 'ArrowRight') handleNextLightbox();
      if (e.key === 'ArrowLeft') handlePrevLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxItem, currentLightboxIndex, filteredItems]);

  // Handle Photo File Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { url } = await uploadImageToVercelBlob(file);
      setPreviewDataUrl(url);
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveNewPhoto = () => {
    if (!previewDataUrl) {
      alert('업로드할 사진을 선택해 주세요.');
      return;
    }

    addIphoneGalleryItem({
      title: newTitle.trim() || '아이폰 스냅 감성 컷',
      category: newCategory,
      categoryLabel: categories.find((c) => c.key === newCategory)?.label || '신부대기실',
      imageUrl: previewDataUrl,
      venue: newVenue.trim() || '여백스튜디오',
      description: newDescription.trim() || '아이폰 최신 Pro 기종으로 포착한 자연스러운 순간의 기록.',
      aspectRatio: 'portrait',
    });

    setIsAddPhotoOpen(false);
    setNewTitle('');
    setPreviewDataUrl('');
    setNewDescription('');
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Editorial Header & Instagram Link Bar */}
      <div className="bg-gradient-to-r from-rose-50/70 via-stone-50 to-amber-50/40 rounded-3xl p-6 sm:p-8 border border-rose-200/60 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif-en text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                iPHONE SNAP GALLERY
              </span>
              <span className="text-xs text-rose-700 font-medium">최신 Pro 기종 촬영</span>
            </div>
            <h3 className="font-serif-kr text-xl sm:text-2xl font-light text-stone-900 mt-1">
              결혼식의 순간을 조금 더 가까이, 자연스럽게
            </h3>
            <p className="text-xs text-stone-600 font-light mt-0.5">
              서브스냅만의 다정한 시선으로 신부대기실과 본식의 숨은 떨림까지 생생하게 기록합니다.
            </p>
          </div>
        </div>

        {/* Instagram Follow Button */}
        <div className="flex items-center space-x-3 shrink-0">
          <a
            href={studioInfo.instagramIphone || 'https://www.instagram.com/yeobaek_iphone_iksan/'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-500 hover:text-white transition-all text-xs font-serif-en flex items-center space-x-2 shadow-xs group"
          >
            <Instagram className="w-4 h-4 text-rose-500 group-hover:text-white transition-colors" />
            <span className="font-semibold">@yeobaek_iphone_iksan</span>
          </a>

          {/* Add iPhone Photo Button */}
          <button
            onClick={() => setIsAddPhotoOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-serif-kr flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>아이폰 사진 추가하기</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-serif-kr transition-all duration-300 flex items-center space-x-1.5 ${
                isSelected
                  ? 'bg-rose-600 text-white font-semibold shadow-md scale-105'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] opacity-70 font-mono`}>
                (
                {cat.key === 'ALL'
                  ? items.length
                  : items.filter((i) => i.category === cat.key).length}
                )
              </span>
            </button>
          );
        })}
      </div>

      {/* iPhone Snapshot Grid (9:16 Vertical Aspect Ratio Feel) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-500 aspect-[3/4] cursor-pointer"
            onClick={() => setActiveLightboxItem(item)}
          >
            <img
              src={resolveImageUrl(item.imageUrl)}
              alt="아이폰 스냅"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Hover overlay with subtle zoom and expand icon */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-stone-900 shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <Maximize2 className="w-5 h-5" />
              </div>
            </div>

            {/* Subtle iPhone Badge */}
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-serif-en flex items-center space-x-1 pointer-events-none">
              <Smartphone className="w-2.5 h-2.5 text-rose-300" />
              <span>iPhone Snap</span>
            </div>

            {/* Admin delete button */}
            {isAdminMode && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('이 사진을 갤러리에서 삭제하시겠습니까?')) {
                    deleteIphoneGalleryItem(item.id);
                  }
                }}
                className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors z-20"
                title="사진 삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
          <Smartphone className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <p className="text-sm text-stone-500 font-light">
            해당 카테고리에 등록된 아이폰 스냅 사진이 없습니다.
          </p>
        </div>
      )}

      {/* Bottom CTA & Notice */}
      <div className="bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <span className="text-xs font-serif-kr font-bold text-stone-900 block">
            아이폰으로 완성하는 또 하나의 특별한 기록
          </span>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            본식스냅과 아이폰스냅을 함께 예약하시면 <strong className="font-semibold text-rose-600">5만원 동시할인 혜택</strong>이 적용됩니다.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          {onNavigateToPricing && (
            <button
              onClick={onNavigateToPricing}
              className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 text-xs font-serif-kr transition-all shadow-2xs"
            >
              가격표 보기
            </button>
          )}

          {onNavigateToReservation && (
            <button
              onClick={onNavigateToReservation}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-serif-kr transition-all shadow-xs flex items-center space-x-1"
            >
              <span>아이폰 스냅 예약 문의</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[95vh] flex flex-col items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-2 right-2 sm:-top-10 sm:right-0 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors z-20"
              aria-label="닫기"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev button */}
            <button
              onClick={handlePrevLightbox}
              className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors z-20"
              aria-label="이전 사진"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next button */}
            <button
              onClick={handleNextLightbox}
              className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors z-20"
              aria-label="다음 사진"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Image */}
            <div className="relative max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl bg-black/40">
              <img
                src={resolveImageUrl(activeLightboxItem.imageUrl)}
                alt={activeLightboxItem.title}
                className="max-h-[75vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>

            {/* Minimal Photo Counter */}
            <div className="mt-3 text-center text-white/70 text-xs font-serif-en flex items-center justify-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-xs font-medium">
                {currentLightboxIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Photo Modal */}
      {isAddPhotoOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setIsAddPhotoOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-serif-kr text-lg font-bold text-stone-900 mb-4 flex items-center">
              <Smartphone className="w-5 h-5 text-rose-500 mr-2" />
              <span>아이폰 스냅 사진 추가</span>
            </h4>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">사진 파일 선택</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                />
                {isUploading && (
                  <p className="text-rose-600 text-xs mt-1 flex items-center">
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                    <span>이미지 업로드 및 최적화 중...</span>
                  </p>
                )}
                {previewDataUrl && (
                  <div className="mt-2 w-24 h-32 rounded-lg overflow-hidden border border-stone-200">
                    <img src={previewDataUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">사진 제목</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 신부대기실 감성 미러 샷"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">카테고리</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as GalleryCategory)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                >
                  <option value="BRIDAL_ROOM">신부대기실</option>
                  <option value="CEREMONY">본식 순간</option>
                  <option value="FLOWER_SHOWER">플라워샤워 & 퇴장</option>
                  <option value="DIRECTING">감성 연출</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">예식 장소 (웨딩홀)</label>
                <input
                  type="text"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  placeholder="예: 익산 웨스턴라이프"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">설명</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="사진에 대한 설명을 자유롭게 작성해 주세요."
                  rows={2}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl resize-none"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSaveNewPhoto}
                  disabled={!previewDataUrl || isUploading}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors"
                >
                  갤러리에 저장하기
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddPhotoOpen(false)}
                  className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
