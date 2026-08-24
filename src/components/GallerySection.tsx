import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, MapPin, Tag, ImageIcon, Plus, Trash2, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { GalleryCategory, GalleryItem } from '../types';
import { useSiteContent } from '../context/ContentContext';
import { QuickEditPhotoModal } from './AdminEditorModal';
import { compressImageFile } from '../utils/storageHelper';
import { uploadImageToVercelBlob } from '../utils/blobStorage';
import { resolveImageUrl } from '../utils/imageHelper';

export const GallerySection: React.FC = () => {
  const { content, isAdminMode, updateGalleryItem, addGalleryItem, deleteGalleryItem } = useSiteContent();
  const galleryItems = content.galleryItems;

  const INITIAL_DISPLAY_COUNT = 12;
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('ALL');
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_DISPLAY_COUNT);
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);
  const [editingPhotoItem, setEditingPhotoItem] = useState<GalleryItem | null>(null);

  // Add Photo Modal States
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GalleryCategory>('DIRECTING');
  const [newVenue, setNewVenue] = useState('여백스튜디오 익산');
  const [newDescription, setNewDescription] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const [sizeInfo, setSizeInfo] = useState<{ orig: number; comp: number } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: { key: GalleryCategory; label: string; enLabel: string }[] = [
    { key: 'ALL', label: '전체보기', enLabel: 'ALL' },
    { key: 'DIRECTING', label: '연출', enLabel: 'DIRECTING' },
    { key: 'BRIDAL_ROOM', label: '신부대기실', enLabel: 'BRIDAL ROOM' },
    { key: 'CEREMONY', label: '본식', enLabel: 'CEREMONY' },
    { key: 'FLOWER_SHOWER', label: '식마무리&플라워샤워', enLabel: 'FLOWER SHOWER' },
  ];

  const categoryLabelMap: Record<GalleryCategory, string> = {
    ALL: '전체보기',
    DIRECTING: '연출',
    BRIDAL_ROOM: '신부대기실',
    CEREMONY: '본식',
    FLOWER_SHOWER: '식마무리&플라워샤워',
  };

  const filteredItems =
    selectedCategory === 'ALL'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  const displayedItems = filteredItems.slice(0, visibleCount);

  // Handle category change: reset visible count to initial 12
  const handleCategoryChange = (cat: GalleryCategory) => {
    setSelectedCategory(cat);
    setVisibleCount(INITIAL_DISPLAY_COUNT);
  };

  // Lightbox navigation
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

  // Handle File Selection with Auto Vercel Blob Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const { url, isBlobStorage } = await uploadImageToVercelBlob(file);
      setPreviewDataUrl(url);
      if (!isBlobStorage) {
        const { originalKb, compressedKb } = await compressImageFile(file, 1200, 1200, 0.82);
        setSizeInfo({ orig: originalKb, comp: compressedKb });
      } else {
        setSizeInfo({ orig: Math.round(file.size / 1024), comp: Math.round(file.size / 1024) });
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지를 업로드하는데 실패했습니다.');
    } finally {
      setIsCompressing(false);
    }
  };

  // Handle Add Gallery Photo Submit
  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewDataUrl) {
      alert('사진을 선택해 주세요.');
      return;
    }

    addGalleryItem({
      title: newTitle.trim() || '여백스튜디오 본식 스냅',
      category: newCategory,
      categoryLabel: categoryLabelMap[newCategory] || '연출',
      imageUrl: previewDataUrl,
      venue: newVenue.trim() || '여백스튜디오 익산',
      description: newDescription.trim() || '여백스튜디오의 깊이 있고 따스한 시그니처 감성을 담아낸 컷입니다.',
      aspectRatio: 'portrait',
    });

    // Reset and Close
    setPreviewDataUrl('');
    setNewTitle('');
    setNewVenue('여백스튜디오 익산');
    setNewDescription('');
    setSizeInfo(null);
    setIsAddPhotoOpen(false);
  };

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#F5F3EF] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-serif-en text-xs sm:text-sm tracking-[0.3em] uppercase text-[#A68F7E] font-medium block mb-3">
            PORTFOLIO GALLERY
          </span>
          <h2 className="font-serif-kr text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1A1A] tracking-tight leading-snug mb-6">
            여백스튜디오 본식 스냅 갤러리
          </h2>
          <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed">
            실제 신랑신부님들의 소중한 예식 현장을 카테고리별로 감상하실 수 있습니다.
            각 이미지를 클릭하시면 확대 사진과 함께 상세 연출 포인트를 확인하실 수 있습니다.
          </p>

          {/* Admin Photo Upload CTA Button */}
          {isAdminMode && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsAddPhotoOpen(true)}
                className="px-5 py-2.5 bg-[#1A1A1A] text-amber-300 border border-amber-400/50 rounded-full text-xs font-semibold tracking-wider hover:bg-[#A68F7E] hover:text-white transition-all shadow-md flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>📷 갤러리 신규 사진 직접 추가 (자동 용량 최적화)</span>
              </button>
            </div>
          )}
        </div>

      {/* Quick Edit Photo Modal for Gallery Card */}
      {editingPhotoItem && (
        <QuickEditPhotoModal
          isOpen={!!editingPhotoItem}
          onClose={() => setEditingPhotoItem(null)}
          currentUrl={editingPhotoItem.imageUrl}
          title={editingPhotoItem.title}
          onSave={(newUrl) => {
            updateGalleryItem(editingPhotoItem.id, { imageUrl: newUrl });
          }}
        />
      )}

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mb-10 sm:mb-16">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full text-[11px] sm:text-sm tracking-wider uppercase font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                    : 'bg-white text-[#555555] hover:bg-[#EAE7E2] hover:text-[#1A1A1A] border border-black/5'
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-1 sm:ml-1.5 text-[9px] sm:text-[10px] opacity-70 font-serif-en">({cat.enLabel})</span>
              </button>
            );
          })}
        </div>

        {/* Gallery Masonry Grid (Preserves natural horizontal/vertical aspect ratios for mobile & desktop) */}
        <div className="columns-2 lg:columns-3 gap-3.5 sm:gap-6 [column-fill:_balance]">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid mb-3.5 sm:mb-6 bento-card group relative cursor-pointer overflow-hidden rounded-xl bg-white p-1.5 sm:p-2 border border-black/5 shadow-xs hover:shadow-md transition-all duration-300"
            >
              {/* Image Container with Natural Aspect Ratio */}
              <div
                onClick={() => {
                  if (isAdminMode) {
                    setEditingPhotoItem(item);
                  } else {
                    setActiveLightboxItem(item);
                  }
                }}
                className={`overflow-hidden rounded-lg sm:rounded-xl relative bg-[#F3EFEA] ${
                  item.aspectRatio === 'landscape' ? 'aspect-[4/3]' : 'aspect-[3/4]'
                }`}
              >
                <img
                  src={resolveImageUrl(item.imageUrl)}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full block object-cover img-zoom"
                />

                {/* Subtle Ratio & Category Badge on Desktop Hover */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <span className="px-2 py-0.5 rounded-sm bg-black/75 text-white text-[10px] font-light backdrop-blur-xs">
                    {item.venue}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-sm bg-black/60 text-[#E2CBA9] text-[9px] font-serif-en uppercase tracking-wider">
                    {item.categoryLabel}
                  </span>
                </div>

                {isAdminMode && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 bg-black/85 text-amber-300 border border-amber-400/40 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-medium flex items-center space-x-1 shadow-md">
                    <ImageIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>📷 사진 변경</span>
                  </div>
                )}
              </div>

              {/* Admin Delete Action */}
              {isAdminMode && (
                <div className="p-1.5 sm:p-2 mt-1 border-t border-black/5 flex justify-between items-center bg-[#FAFAFA] rounded-b-lg">
                  <span className="text-[10px] sm:text-[11px] text-[#777777] truncate font-medium max-w-[120px] sm:max-w-none">
                    [{item.categoryLabel}] {item.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`'${item.title}' 사진을 갤러리에서 삭제하시겠습니까?`)) {
                        deleteGalleryItem(item.id);
                      }
                    }}
                    className="p-1 sm:p-1.5 text-red-500 hover:bg-red-50 rounded-md text-[11px] sm:text-xs flex items-center space-x-1 transition-colors"
                    title="사진 삭제"
                  >
                    <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>삭제</span>
                  </button>
                </div>
              )}

              {/* Hover Overlay - Pure Minimal Effect */}
              {!isAdminMode && (
                <div
                  onClick={() => setActiveLightboxItem(item)}
                  className="absolute inset-1.5 sm:inset-2 rounded-lg sm:rounded-xl bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
              )}
            </div>
          ))}
        </div>

        {/* Load More Button (> 더보기) */}
        {filteredItems.length > INITIAL_DISPLAY_COUNT && (
          <div className="mt-10 sm:mt-16 flex flex-col items-center justify-center space-y-3">
            {visibleCount < filteredItems.length ? (
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="group inline-flex items-center space-x-2.5 px-8 py-3.5 sm:px-10 sm:py-4 bg-[#1A1A1A] text-white hover:bg-[#A68F7E] rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <span>사진 더보기</span>
                <span className="text-[11px] sm:text-xs text-[#E2CBA9] font-serif-en font-normal">
                  ({Math.min(visibleCount, filteredItems.length)} / {filteredItems.length})
                </span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setVisibleCount(INITIAL_DISPLAY_COUNT);
                  const el = document.getElementById('gallery');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-2 px-6 py-2.5 sm:px-8 sm:py-3 bg-white text-[#666666] hover:text-[#1A1A1A] hover:bg-[#EAE7E2] border border-black/10 rounded-full text-xs sm:text-sm font-medium tracking-wider transition-all shadow-xs cursor-pointer"
              >
                <span>처음 12장으로 접기</span>
              </button>
            )}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-[#888888] bg-white rounded-2xl border border-black/5">
            <p className="font-serif-kr text-base mb-2">해당 카테고리의 사진이 준비 중입니다.</p>
            {isAdminMode && (
              <button
                onClick={() => setIsAddPhotoOpen(true)}
                className="mt-2 inline-flex items-center space-x-1 text-xs text-[#A68F7E] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>이 카테고리에 신규 사진 등록하기</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add New Gallery Photo Modal (with Auto Compression) */}
      {isAddPhotoOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-black/10 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsAddPhotoOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-serif-en tracking-widest text-[#A68F7E] uppercase block mb-1">
                YEOBAEK GALLERY MANAGER
              </span>
              <h3 className="font-serif-kr text-2xl font-semibold text-[#1A1A1A]">
                갤러리 신규 사진 등록
              </h3>
              <p className="text-xs text-[#777777] mt-1">
                고화질 원본 사진도 크기가 자동으로 웹 최적화되어 용량 부족 없이 빠르게 업로드됩니다.
              </p>
            </div>

            <form onSubmit={handleAddPhotoSubmit} className="space-y-4">
              {/* File Upload Zone */}
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1.5">
                  사진 파일 선택 (자동 용량 최적화)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#CCCCCC] hover:border-[#A68F7E] bg-[#FAFAFA] rounded-xl p-5 text-center cursor-pointer transition-colors"
                >
                  {isCompressing ? (
                    <div className="py-4 text-xs text-[#A68F7E] font-medium animate-pulse">
                      ⚡ 이미지를 고화질로 자동 최적화하는 중입니다...
                    </div>
                  ) : previewDataUrl ? (
                    <div className="space-y-2">
                      <img
                        src={previewDataUrl}
                        alt="미리보기"
                        className="max-h-48 mx-auto rounded-lg object-contain shadow-sm"
                      />
                      {sizeInfo && (
                        <div className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-medium border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            용량 최적화 완료: {sizeInfo.orig > 1024 ? `${(sizeInfo.orig / 1024).toFixed(1)}MB` : `${sizeInfo.orig}KB`} → 약 {sizeInfo.comp}KB
                          </span>
                        </div>
                      )}
                      <p className="text-[11px] text-[#888888]">클릭하여 다른 사진으로 재선택</p>
                    </div>
                  ) : (
                    <div className="py-4 flex flex-col items-center justify-center space-y-2 text-[#777777]">
                      <Upload className="w-8 h-8 text-[#A68F7E]" />
                      <span className="text-xs font-medium">클릭하여 스마트폰/컴퓨터에서 사진 선택</span>
                      <span className="text-[11px] text-[#A68F7E]">JPG, PNG, WebP 지원 (자동 리사이징)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  사진 제목 / 설명 타이틀
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 시그니처 햇살 연출 컷"
                  className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg text-xs focus:ring-2 focus:ring-[#A68F7E] outline-none"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  갤러리 카테고리 (4개 영역)
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as GalleryCategory)}
                  className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg text-xs focus:ring-2 focus:ring-[#A68F7E] outline-none bg-white font-medium"
                >
                  <option value="DIRECTING">연출 (DIRECTING)</option>
                  <option value="BRIDAL_ROOM">신부대기실 (BRIDAL ROOM)</option>
                  <option value="CEREMONY">본식 (CEREMONY)</option>
                  <option value="FLOWER_SHOWER">식마무리&플라워샤워 (FLOWER SHOWER)</option>
                </select>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  웨딩홀 / 예식 장소
                </label>
                <input
                  type="text"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  placeholder="예: 여백스튜디오 익산"
                  className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg text-xs focus:ring-2 focus:ring-[#A68F7E] outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  상세 연출 포인트 설명 (선택사항)
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={2}
                  placeholder="예: 자연광과 실크 베일의 조화가 돋보이는 연출컷입니다."
                  className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg text-xs focus:ring-2 focus:ring-[#A68F7E] outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddPhotoOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-black/10 text-xs font-medium text-[#555555] hover:bg-gray-100"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!previewDataUrl || isCompressing}
                  className="px-5 py-2.5 rounded-lg bg-[#1A1A1A] text-white text-xs font-medium hover:bg-[#A68F7E] transition-colors disabled:opacity-50"
                >
                  갤러리에 추가 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={() => setActiveLightboxItem(null)}
            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 text-white/90 hover:text-white hover:bg-white/20 transition-all focus:outline-hidden"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={handlePrevLightbox}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 text-white/90 hover:text-white hover:bg-white/20 transition-all focus:outline-hidden"
            aria-label="이전 사진"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNextLightbox}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 text-white/90 hover:text-white hover:bg-white/20 transition-all focus:outline-hidden"
            aria-label="다음 사진"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Lightbox Content */}
          <div className="max-w-5xl w-full max-h-[90vh] flex flex-col lg:flex-row bg-[#181818] rounded-xs border border-white/10 overflow-hidden shadow-2xl">
            {/* Image Box */}
            <div className="lg:w-3/5 bg-black flex items-center justify-center p-2 min-h-[300px] sm:min-h-[450px]">
              <img
                src={resolveImageUrl(activeLightboxItem.imageUrl)}
                alt={activeLightboxItem.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xs"
              />
            </div>

            {/* Photo Info Side Panel */}
            <div className="lg:w-2/5 p-6 sm:p-8 text-white flex flex-col justify-between bg-[#1C1C1C]">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <span className="px-3 py-1 bg-[#C5A880]/20 text-[#E2CBA9] text-xs font-serif-en uppercase tracking-wider rounded-xs">
                    {activeLightboxItem.categoryLabel}
                  </span>
                  <span className="text-xs text-white/50 font-serif-en">
                    {currentLightboxIndex + 1} / {filteredItems.length}
                  </span>
                </div>

                <h3 className="font-serif-kr text-2xl font-light text-white mb-3">
                  {activeLightboxItem.title}
                </h3>

                <p className="flex items-center text-xs text-[#E2CBA9] font-light mb-6">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  <span>{activeLightboxItem.venue}</span>
                </p>

                <p className="text-sm text-white/80 font-light leading-relaxed mb-8">
                  {activeLightboxItem.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <span className="font-serif-en uppercase tracking-widest">Yeobaek Studio Signature Snap</span>
                <span className="text-white/40">Use Arrow keys to navigate</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
