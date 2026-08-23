import React, { useState } from 'react';
import { useSiteContent } from '../context/ContentContext';
import { compressImageFile } from '../utils/storageHelper';
import { uploadImageToVercelBlob } from '../utils/blobStorage';
import { resolveImageUrl } from '../utils/imageHelper';
import {
  Edit3,
  X,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Type,
  Layout,
  Layers,
  Settings,
  Sparkles,
  HelpCircle,
  PhoneCall,
  Sliders,
  CheckCircle,
  Upload,
  ArrowUp,
  ArrowDown,
  Loader2,
  CloudUpload
} from 'lucide-react';

interface QuickEditPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  title: string;
  onSave: (newUrl: string) => void;
}

// Quick modal for editing a single photo
export const QuickEditPhotoModal: React.FC<QuickEditPhotoModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  title,
  onSave,
}) => {
  const [url, setUrl] = useState(currentUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [userUploadedPhotos, setUserUploadedPhotos] = useState<{ name: string; url: string; isBlob?: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem('yeobaek_uploaded_photos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync state with currentUrl prop when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setUrl(currentUrl);
      setUploadMessage('');
    }
  }, [isOpen, currentUrl]);

  // Preset sample wedding photography photos for fast 1-click replacement
  const PRESET_WEDDING_PHOTOS = [
    { name: '더라움 체임버 홀 베일 컷', url: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=1200' },
    { name: '로맨틱 메인 버진로드', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200' },
    { name: '부케 & 신부대기실 컷', url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=1200' },
    { name: '서약 및 반지 교환 컷', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200' },
    { name: '플라워샤워 피날레 컷', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200' },
    { name: '신부대기실 창가 클로즈업', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1200' },
    { name: '가족 및 원판 기념 스냅', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1200' },
    { name: '반딧불이 라이팅 컷', url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=1200' },
  ];

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadMessage('내 컴퓨터 사진 서버 저장 및 최적화 중...');
      const { url: persistentUrl } = await uploadImageToVercelBlob(file, (msg) => setUploadMessage(msg));
      setUrl(persistentUrl);

      // Add uploaded photo to recent uploads list
      const newItem = {
        name: file.name || '내 업로드 사진',
        url: persistentUrl,
        isBlob: true,
      };
      const updatedList = [newItem, ...userUploadedPhotos.filter((p) => p.url !== persistentUrl)];
      setUserUploadedPhotos(updatedList);
      try {
        localStorage.setItem('yeobaek_uploaded_photos', JSON.stringify(updatedList));
      } catch (e) {
        console.error('Failed to store uploaded photo history:', e);
      }

      setUploadMessage('✓ 사진이 안전하게 저장되었습니다! [이 사진으로 변경하기] 버튼을 누르면 즉시 웹사이트에 반영됩니다.');
    } catch (err) {
      console.error('이미지 업로드 오류:', err);
      setUploadMessage('사진 불러오기 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await processFile(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-black/10 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#A68F7E]/20 text-[#A68F7E] rounded-lg">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-kr text-lg font-medium text-[#1A1A1A]">사진 변경</h3>
              <p className="text-xs text-[#888888] font-light">{title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-[#888888] hover:text-[#1A1A1A] hover:bg-[#F5F3EF]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag and Drop / File Select Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
            isDragging
              ? 'border-amber-500 bg-amber-50/70 scale-[1.01]'
              : 'border-[#A68F7E]/40 hover:border-[#A68F7E] bg-[#FBF9F6]'
          }`}
        >
          <label className="cursor-pointer block">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[#A68F7E]/15 text-[#A68F7E] flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>
            <p className="text-sm font-medium text-[#1A1A1A] mb-1">
              내 컴퓨터에서 원하는 사진을 여기에 끌어다 놓거나 클릭하세요
            </p>
            <p className="text-xs text-[#888888]">
              JPG, PNG, WebP 지원 (선택 즉시 자동 적용 준비)
            </p>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {uploadMessage && (
          <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 text-center font-medium">
            {uploadMessage}
          </div>
        )}

        {/* Current / Selected Image Live Preview */}
        <div>
          <label className="block text-xs font-semibold text-[#555555] mb-1.5">선택된 사진 미리보기</label>
          <div className="h-48 rounded-xl overflow-hidden bg-[#1A1A1A] border border-black/10 relative shadow-inner">
            <img
              src={url}
              alt="미리보기"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800';
              }}
            />
            <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/80 text-white text-[10px] rounded-md font-serif-en tracking-wider">
              READY TO APPLY
            </div>
          </div>
        </div>

        {/* Image URL Direct Input (Optional) */}
        <div className="space-y-1">
          <label className="block text-[11px] text-[#777777]">또는 이미지 웹 주소(URL) 직접 입력:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 bg-[#F5F3EF] border border-black/10 rounded-lg text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#A68F7E]"
          />
        </div>

        {/* User Recently Uploaded Photos */}
        {userUploadedPhotos.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="block text-[11px] text-[#A68F7E] font-semibold">
                내가 최근에 등록한 사진들 ({userUploadedPhotos.length}개)
              </span>
              <button
                onClick={() => {
                  setUserUploadedPhotos([]);
                  localStorage.removeItem('yeobaek_uploaded_photos');
                }}
                className="text-[10px] text-gray-400 hover:text-red-500"
              >
                비우기
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 max-h-24 overflow-y-auto pr-1">
              {userUploadedPhotos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setUrl(p.url)}
                  className={`h-14 rounded-lg overflow-hidden border-2 transition-all relative ${
                    url === p.url ? 'border-[#A68F7E] ring-2 ring-[#A68F7E]/40 scale-[1.02]' : 'border-black/10 opacity-80 hover:opacity-100'
                  }`}
                  title={p.name}
                >
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-black/10 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-[#F5F3EF] hover:bg-[#EAE7E2] text-[#555555] rounded-xl text-xs font-medium transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => {
              onSave(resolveImageUrl(url));
              onClose();
            }}
            className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#A68F7E] text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>이 사진으로 즉시 변경하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Full Content Manager Modal / Drawer
export const AdminEditorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const {
    content,
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
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'gallery' | 'packages' | 'testimonials' | 'faq' | 'footer'>('hero');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const triggerSaveNotice = () => {
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#1A1A1A] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#A68F7E]">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif-kr text-lg font-semibold">여백스튜디오 실시간 콘텐츠 편집기</h3>
              <p className="font-serif-en text-[11px] text-[#A68F7E] uppercase tracking-wider">Site Content Management Panel</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (window.confirm('모든 글자와 사진을 초기 상태로 복원하시겠습니까?')) {
                  resetAllToDefault();
                  triggerSaveNotice();
                }
              }}
              className="p-2 text-white/70 hover:text-amber-400 text-xs flex items-center space-x-1"
              title="기본값으로 복원"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">초기화</span>
            </button>

            <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex border-b border-black/10 bg-[#F5F3EF] overflow-x-auto text-xs font-medium text-[#555555] scrollbar-none">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-3 border-b-2 font-serif-kr whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'hero' ? 'border-[#A68F7E] text-[#1A1A1A] bg-white' : 'border-transparent hover:text-[#1A1A1A]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>히어로 슬라이드</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-3 border-b-2 font-serif-kr whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'about' ? 'border-[#A68F7E] text-[#1A1A1A] bg-white' : 'border-transparent hover:text-[#1A1A1A]'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>브랜드 소개</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-3 border-b-2 font-serif-kr whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'gallery' ? 'border-[#A68F7E] text-[#1A1A1A] bg-white' : 'border-transparent hover:text-[#1A1A1A]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>갤러리 포트폴리오</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-3 border-b-2 font-serif-kr whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'packages' ? 'border-[#A68F7E] text-[#1A1A1A] bg-white' : 'border-transparent hover:text-[#1A1A1A]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>상품 & 가격</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-3 border-b-2 font-serif-kr whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'testimonials' ? 'border-[#A68F7E] text-[#1A1A1A] bg-white' : 'border-transparent hover:text-[#1A1A1A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>고객 후기</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-3 border-b-2 font-serif-kr whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'faq' ? 'border-[#A68F7E] text-[#1A1A1A] bg-white' : 'border-transparent hover:text-[#1A1A1A]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ</span>
          </button>

          <button
            onClick={() => setActiveTab('footer')}
            className={`px-4 py-3 border-b-2 font-serif-kr whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'footer' ? 'border-[#A68F7E] text-[#1A1A1A] bg-white' : 'border-transparent hover:text-[#1A1A1A]'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>연락처 & 푸터</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {saveSuccessNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center space-x-2 border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>수정 사항이 화면과 자동 저장소에 실시간 반영되었습니다!</span>
            </div>
          )}

          {/* TAB 1: HERO SLIDES */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-kr text-base font-medium text-[#1A1A1A]">메인 히어로 슬라이드 ({content.heroSlides.length}개)</h4>
                <button
                  onClick={() => {
                    addHeroSlide({
                      title: '새로운 순간, 빛나는 약속',
                      subtitle: '자연스러운 웨딩 감성 스냅',
                      tagline: 'Yeobaek Custom Snapshot',
                      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=85&w=1920',
                      venue: '웨딩 홀 이름',
                    });
                    triggerSaveNotice();
                  }}
                  className="px-3 py-1.5 bg-[#1A1A1A] text-white rounded-lg text-xs font-medium flex items-center space-x-1 hover:bg-[#A68F7E]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>슬라이드 추가</span>
                </button>
              </div>

              {content.heroSlides.map((slide, idx) => (
                <div key={slide.id} className="p-4 bg-[#F5F3EF] rounded-xl border border-black/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-black/5 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif-en text-xs font-semibold text-[#A68F7E]">SLIDE #{idx + 1}</span>
                      <div className="flex items-center space-x-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => {
                            reorderHeroSlides(idx, idx - 1);
                            triggerSaveNotice();
                          }}
                          className="p-1 rounded bg-white border border-black/10 text-xs text-[#555] hover:bg-[#A68F7E] hover:text-white disabled:opacity-30"
                          title="위로 이동"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={idx === content.heroSlides.length - 1}
                          onClick={() => {
                            reorderHeroSlides(idx, idx + 1);
                            triggerSaveNotice();
                          }}
                          className="p-1 rounded bg-white border border-black/10 text-xs text-[#555] hover:bg-[#A68F7E] hover:text-white disabled:opacity-30"
                          title="아래로 이동"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        deleteHeroSlide(slide.id);
                        triggerSaveNotice();
                      }}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>삭제</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[#666666] mb-1">메인 제목</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          updateHeroSlide(slide.id, { title: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3 py-2 bg-white rounded-md border border-black/10"
                      />
                    </div>

                    <div>
                      <label className="block text-[#666666] mb-1">부제목</label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => {
                          updateHeroSlide(slide.id, { subtitle: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3 py-2 bg-white rounded-md border border-black/10"
                      />
                    </div>

                    <div>
                      <label className="block text-[#666666] mb-1">웨딩홀 이름</label>
                      <input
                        type="text"
                        value={slide.venue}
                        onChange={(e) => {
                          updateHeroSlide(slide.id, { venue: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3 py-2 bg-white rounded-md border border-black/10"
                      />
                    </div>

                    <div>
                      <label className="block text-[#666666] mb-1">영문 태그라인</label>
                      <input
                        type="text"
                        value={slide.tagline}
                        onChange={(e) => {
                          updateHeroSlide(slide.id, { tagline: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3 py-2 bg-white rounded-md border border-black/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs text-[#666666]">배경 사진 URL 및 업로드</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={slide.imageUrl}
                        onChange={(e) => {
                          updateHeroSlide(slide.id, { imageUrl: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="flex-1 px-3 py-2 bg-white rounded-md border border-black/10 text-xs"
                      />
                      <label className="px-3 py-2 bg-[#EAE7E2] hover:bg-[#A68F7E] hover:text-white text-[#1A1A1A] rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center space-x-1 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>내 사진</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const { url: uploadedUrl } = await uploadImageToVercelBlob(file);
                                updateHeroSlide(slide.id, { imageUrl: uploadedUrl });
                                triggerSaveNotice();
                              } catch (err) {
                                console.error('Image upload error:', err);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-serif-kr text-base font-medium text-[#1A1A1A] mb-2">브랜드 소개 문구 & 사진 수정</h4>

              <div>
                <label className="block text-[#666666] mb-1">섹션 대표 메인 제목</label>
                <input
                  type="text"
                  value={content.about.title}
                  onChange={(e) => {
                    updateAbout({ title: e.target.value });
                    triggerSaveNotice();
                  }}
                  className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10 text-sm"
                />
              </div>

              <div>
                <label className="block text-[#666666] mb-1">상단 간략 설명</label>
                <textarea
                  rows={2}
                  value={content.about.description}
                  onChange={(e) => {
                    updateAbout({ description: e.target.value });
                    triggerSaveNotice();
                  }}
                  className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10"
                />
              </div>

              <div>
                <label className="block text-[#666666] mb-1">핵심 인용문 (Quote)</label>
                <input
                  type="text"
                  value={content.about.aboutQuote}
                  onChange={(e) => {
                    updateAbout({ aboutQuote: e.target.value });
                    triggerSaveNotice();
                  }}
                  className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#666666] mb-1">소개 본문 1</label>
                  <textarea
                    rows={3}
                    value={content.about.aboutDesc1}
                    onChange={(e) => {
                      updateAbout({ aboutDesc1: e.target.value });
                      triggerSaveNotice();
                    }}
                    className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10"
                  />
                </div>

                <div>
                  <label className="block text-[#666666] mb-1">소개 본문 2</label>
                  <textarea
                    rows={3}
                    value={content.about.aboutDesc2}
                    onChange={(e) => {
                      updateAbout({ aboutDesc2: e.target.value });
                      triggerSaveNotice();
                    }}
                    className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-black/10 space-y-3">
                <h5 className="font-medium text-[#1A1A1A]">대표 작가 정보 & 사진</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#666666] mb-1">대표작가 이름</label>
                    <input
                      type="text"
                      value={content.about.directorName}
                      onChange={(e) => {
                        updateAbout({ directorName: e.target.value });
                        triggerSaveNotice();
                      }}
                      className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1">작가 직함</label>
                    <input
                      type="text"
                      value={content.about.directorTitle}
                      onChange={(e) => {
                        updateAbout({ directorTitle: e.target.value });
                        triggerSaveNotice();
                      }}
                      className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#666666] mb-1">소개 대표 사진 1 URL</label>
                  <input
                    type="text"
                    value={content.about.photo1}
                    onChange={(e) => {
                      updateAbout({ photo1: e.target.value });
                      triggerSaveNotice();
                    }}
                    className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10"
                  />
                </div>

                <div>
                  <label className="block text-[#666666] mb-1">소개 대표 사진 2 URL</label>
                  <input
                    type="text"
                    value={content.about.photo2}
                    onChange={(e) => {
                      updateAbout({ photo2: e.target.value });
                      triggerSaveNotice();
                    }}
                    className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-kr text-base font-medium text-[#1A1A1A]">갤러리 포트폴리오 항목 ({content.galleryItems.length}개)</h4>
                <button
                  onClick={() => {
                    addGalleryItem({
                      title: '새로운 본식 스냅 컷',
                      category: 'BRIDAL_ROOM',
                      categoryLabel: '신부대기실',
                      imageUrl: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=1000',
                      venue: '웨딩홀 이름',
                      description: '아름다운 순간을 기록한 사진 설명입니다.',
                      aspectRatio: 'portrait',
                    });
                    triggerSaveNotice();
                  }}
                  className="px-3 py-1.5 bg-[#1A1A1A] text-white rounded-lg text-xs font-medium flex items-center space-x-1 hover:bg-[#A68F7E]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>사진 항목 추가</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.galleryItems.map((item, idx) => (
                  <div key={item.id} className="p-4 bg-[#F5F3EF] rounded-xl border border-black/10 flex flex-col sm:flex-row gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 rounded-lg object-cover border border-black/10 shrink-0"
                    />

                    <div className="flex-1 space-y-2 text-xs">
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center space-x-1.5 flex-1">
                          <span className="font-mono text-[10px] text-[#A68F7E] font-bold">#{idx + 1}</span>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              updateGalleryItem(item.id, { title: e.target.value });
                              triggerSaveNotice();
                            }}
                            className="font-medium text-[#1A1A1A] bg-white px-2 py-1 rounded-md border border-black/10 w-full"
                          />
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              reorderGalleryItems(idx, idx - 1);
                              triggerSaveNotice();
                            }}
                            className="p-1 rounded bg-white border border-black/10 text-xs text-[#555] hover:bg-[#A68F7E] hover:text-white disabled:opacity-30"
                            title="위로 이동"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={idx === content.galleryItems.length - 1}
                            onClick={() => {
                              reorderGalleryItems(idx, idx + 1);
                              triggerSaveNotice();
                            }}
                            className="p-1 rounded bg-white border border-black/10 text-xs text-[#555] hover:bg-[#A68F7E] hover:text-white disabled:opacity-30"
                            title="아래로 이동"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              deleteGalleryItem(item.id);
                              triggerSaveNotice();
                            }}
                            className="text-red-500 hover:text-red-700 text-xs flex items-center space-x-0.5 ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>삭제</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-[#888888] block">카테고리</label>
                          <select
                            value={item.category}
                            onChange={(e) => {
                              const cat = e.target.value as any;
                              const labelMap: Record<string, string> = {
                                BRIDAL_ROOM: '신부대기실',
                                CEREMONY: '본식 진행',
                                FLOWER_SHOWER: '원판 & 플라워샤워',
                              };
                              updateGalleryItem(item.id, { category: cat, categoryLabel: labelMap[cat] || '전체' });
                              triggerSaveNotice();
                            }}
                            className="w-full bg-white px-2 py-1 rounded-md border border-black/10"
                          >
                            <option value="BRIDAL_ROOM">신부대기실</option>
                            <option value="CEREMONY">본식 진행</option>
                            <option value="FLOWER_SHOWER">원판 & 플라워샤워</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-[#888888] block">웨딩홀 이름</label>
                          <input
                            type="text"
                            value={item.venue}
                            onChange={(e) => {
                              updateGalleryItem(item.id, { venue: e.target.value });
                              triggerSaveNotice();
                            }}
                            className="w-full bg-white px-2 py-1 rounded-md border border-black/10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-[#888888] block">사진 URL 및 클라우드 업로드</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.imageUrl}
                            onChange={(e) => {
                              updateGalleryItem(item.id, { imageUrl: e.target.value });
                              triggerSaveNotice();
                            }}
                            className="flex-1 bg-white px-2 py-1 rounded-md border border-black/10 text-[11px]"
                          />
                          <label className="px-2.5 py-1 bg-[#EAE7E2] hover:bg-[#A68F7E] hover:text-white text-[#1A1A1A] rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center space-x-1 shrink-0">
                            <Upload className="w-3 h-3" />
                            <span>업로드</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const { url: uploadedUrl } = await uploadImageToVercelBlob(file);
                                    updateGalleryItem(item.id, { imageUrl: uploadedUrl });
                                    triggerSaveNotice();
                                  } catch (err) {
                                    console.error('Gallery image upload error:', err);
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PACKAGES */}
          {activeTab === 'packages' && (
            <div className="space-y-6 text-xs">
              <h4 className="font-serif-kr text-base font-medium text-[#1A1A1A]">상품 패키지 & 가격 관리</h4>

              {content.packages.map((pkg) => (
                <div key={pkg.id} className="p-4 bg-[#F5F3EF] rounded-xl border border-black/10 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#666666] mb-1">상품명</label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => {
                          updatePackage(pkg.id, { name: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3 py-1.5 bg-white rounded-md border border-black/10 font-medium text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[#666666] mb-1">표시 가격</label>
                      <input
                        type="text"
                        value={pkg.price}
                        onChange={(e) => {
                          updatePackage(pkg.id, { price: e.target.value });
                          triggerSaveNotice();
                        }}
                        className="w-full px-3 py-1.5 bg-white rounded-md border border-black/10 font-semibold text-[#A68F7E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1">상품 설명 서브타이틀</label>
                    <input
                      type="text"
                      value={pkg.subtitle}
                      onChange={(e) => {
                        updatePackage(pkg.id, { subtitle: e.target.value });
                        triggerSaveNotice();
                      }}
                      className="w-full px-3 py-1.5 bg-white rounded-md border border-black/10"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1">촬영 작가 구성</label>
                    <input
                      type="text"
                      value={pkg.photographerConfig}
                      onChange={(e) => {
                        updatePackage(pkg.id, { photographerConfig: e.target.value });
                        triggerSaveNotice();
                      }}
                      className="w-full px-3 py-1.5 bg-white rounded-md border border-black/10"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1">제공 품목 안내</label>
                    <input
                      type="text"
                      value={pkg.deliverables}
                      onChange={(e) => {
                        updatePackage(pkg.id, { deliverables: e.target.value });
                        triggerSaveNotice();
                      }}
                      className="w-full px-3 py-1.5 bg-white rounded-md border border-black/10"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-kr text-base font-medium text-[#1A1A1A]">고객 생생 후기 ({content.testimonials.length}개)</h4>
                <button
                  onClick={() => {
                    addTestimonial({
                      coupleNames: '신규 신랑신부',
                      weddingDate: '2026.07.10',
                      venue: '웨딩홀 이름',
                      content: '스냅 사진이 너무 마음에 들었습니다. 대표작가님의 센스에 감사드립니다!',
                      rating: 5,
                      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=200',
                    });
                    triggerSaveNotice();
                  }}
                  className="px-3 py-1.5 bg-[#1A1A1A] text-white rounded-lg text-xs font-medium flex items-center space-x-1 hover:bg-[#A68F7E]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>후기 추가</span>
                </button>
              </div>

              {content.testimonials.map((t) => (
                <div key={t.id} className="p-4 bg-[#F5F3EF] rounded-xl border border-black/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={t.coupleNames}
                      onChange={(e) => {
                        updateTestimonial(t.id, { coupleNames: e.target.value });
                        triggerSaveNotice();
                      }}
                      className="font-medium bg-white px-2 py-1 rounded-md border border-black/10"
                    />

                    <button
                      onClick={() => {
                        deleteTestimonial(t.id);
                        triggerSaveNotice();
                      }}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>삭제</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={t.venue}
                      onChange={(e) => {
                        updateTestimonial(t.id, { venue: e.target.value });
                        triggerSaveNotice();
                      }}
                      placeholder="웨딩홀"
                      className="bg-white px-2 py-1 rounded-md border border-black/10"
                    />
                    <input
                      type="text"
                      value={t.weddingDate}
                      onChange={(e) => {
                        updateTestimonial(t.id, { weddingDate: e.target.value });
                        triggerSaveNotice();
                      }}
                      placeholder="예식일"
                      className="bg-white px-2 py-1 rounded-md border border-black/10"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={t.content}
                    onChange={(e) => {
                      updateTestimonial(t.id, { content: e.target.value });
                      triggerSaveNotice();
                    }}
                    className="w-full bg-white px-2 py-1 rounded-md border border-black/10"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-kr text-base font-medium text-[#1A1A1A]">자주 묻는 질문 FAQ ({content.faqItems.length}개)</h4>
                <button
                  onClick={() => {
                    addFaq({
                      question: '새로운 질문 항목',
                      answer: '해당 질문에 대한 친절한 답변 내용입니다.',
                    });
                    triggerSaveNotice();
                  }}
                  className="px-3 py-1.5 bg-[#1A1A1A] text-white rounded-lg text-xs font-medium flex items-center space-x-1 hover:bg-[#A68F7E]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>질문 추가</span>
                </button>
              </div>

              {content.faqItems.map((faq) => (
                <div key={faq.id} className="p-4 bg-[#F5F3EF] rounded-xl border border-black/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        updateFaq(faq.id, { question: e.target.value });
                        triggerSaveNotice();
                      }}
                      className="font-medium bg-white px-3 py-1.5 rounded-md border border-black/10 w-full mr-2 text-sm"
                    />

                    <button
                      onClick={() => {
                        deleteFaq(faq.id);
                        triggerSaveNotice();
                      }}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center space-x-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => {
                      updateFaq(faq.id, { answer: e.target.value });
                      triggerSaveNotice();
                    }}
                    className="w-full bg-white px-3 py-2 rounded-md border border-black/10"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: FOOTER & STUDIO INFO */}
          {activeTab === 'footer' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-serif-kr text-base font-medium text-[#1A1A1A]">스튜디오 대표 정보 & 푸터 연락처</h4>

              <div>
                <label className="block text-[#666666] mb-1">상호명 / 스튜디오 이름</label>
                <input
                  type="text"
                  value={content.studioInfo.brandName}
                  onChange={(e) => {
                    updateStudioInfo({ brandName: e.target.value });
                    triggerSaveNotice();
                  }}
                  className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#666666] mb-1">대표 전화</label>
                  <input
                    type="text"
                    value={content.studioInfo.phone}
                    onChange={(e) => {
                      updateStudioInfo({ phone: e.target.value });
                      triggerSaveNotice();
                    }}
                    className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10"
                  />
                </div>

                <div>
                  <label className="block text-[#666666] mb-1">직통 핸드폰</label>
                  <input
                    type="text"
                    value={content.studioInfo.mobile}
                    onChange={(e) => {
                      updateStudioInfo({ mobile: e.target.value });
                      triggerSaveNotice();
                    }}
                    className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#666666] mb-1">이메일</label>
                  <input
                    type="text"
                    value={content.studioInfo.email}
                    onChange={(e) => {
                      updateStudioInfo({ email: e.target.value });
                      triggerSaveNotice();
                    }}
                    className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10"
                  />
                </div>

                <div>
                  <label className="block text-[#666666] mb-1">카카오톡 ID</label>
                  <input
                    type="text"
                    value={content.studioInfo.kakao}
                    onChange={(e) => {
                      updateStudioInfo({ kakao: e.target.value });
                      triggerSaveNotice();
                    }}
                    className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#666666] mb-1">스튜디오 오프라인 주소</label>
                <input
                  type="text"
                  value={content.studioInfo.address}
                  onChange={(e) => {
                    updateStudioInfo({ address: e.target.value });
                    triggerSaveNotice();
                  }}
                  className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10"
                />
              </div>

              <div>
                <label className="block text-[#666666] mb-1">푸터 슬로건 설명 문구</label>
                <textarea
                  rows={2}
                  value={content.studioInfo.subSlogan}
                  onChange={(e) => {
                    updateStudioInfo({ subSlogan: e.target.value });
                    triggerSaveNotice();
                  }}
                  className="w-full px-3 py-2 bg-[#F5F3EF] rounded-md border border-black/10"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F5F3EF] border-t border-black/10 flex items-center justify-between">
          <span className="text-[11px] text-[#777777]">
            실시간 브라우저 저장 완료 (Refresh 후에도 편집 내용 유지)
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#A68F7E] text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 shadow-md transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>편집 완료 및 닫기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
