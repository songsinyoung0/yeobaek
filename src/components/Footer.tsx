import React from 'react';
import { Instagram, ArrowUp, Phone, Mail, MapPin, MessageCircle, Edit3, ExternalLink } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { EditableText } from './EditableText';
import { KakaoIcon } from './KakaoIcon';

export const Footer: React.FC = () => {
  const { content, updateStudioInfo, isAdminMode, toggleAdminMode } = useSiteContent();
  const { studioInfo } = content;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getInstagramHandle = (url: string) => {
    if (!url) return '@yeobaek_studio_iksan';
    if (url.startsWith('@')) return url;
    const match = url.match(/instagram\.com\/([^/]+)/);
    if (match && match[1]) return `@${match[1]}`;
    return url;
  };

  return (
    <footer className="bg-[#1A1A1A] text-[#EAE7E2] border-t border-white/10 pt-20 pb-12 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif-kr text-2xl font-semibold text-white tracking-widest uppercase">
                <EditableText
                  value={studioInfo.brandName}
                  onSave={(val) => updateStudioInfo({ brandName: val })}
                  label="상호명"
                />
              </span>
              <span className="font-serif-en text-xs tracking-[0.25em] text-[#A68F7E] uppercase mt-1">
                Yeobaek Studio Wedding Photography
              </span>
            </div>

            <div className="text-xs text-[#AAAAAA] font-light leading-relaxed max-w-sm pt-2 space-y-1">
              <p>
                <EditableText
                  value={studioInfo.slogan}
                  onSave={(val) => updateStudioInfo({ slogan: val })}
                  label="슬로건"
                />
              </p>
              <p>
                <EditableText
                  value={studioInfo.subSlogan}
                  onSave={(val) => updateStudioInfo({ subSlogan: val })}
                  label="서브 슬로건"
                  multiline
                />
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <EditableText
                value={studioInfo.instagram}
                onSave={(val) => updateStudioInfo({ instagram: val })}
                isLink
                linkUrl={studioInfo.instagram}
                onSaveLinkUrl={(newUrl) => updateStudioInfo({ instagram: newUrl })}
                label="인스타그램 링크"
                tag="div"
              >
                <div
                  className="p-2.5 rounded-full bg-white/10 text-white hover:bg-[#A68F7E] transition-colors flex items-center space-x-2 text-xs font-serif-en"
                  aria-label="여백스튜디오 인스타그램"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>인스타그램 ({getInstagramHandle(studioInfo.instagram)})</span>
                </div>
              </EditableText>

              <a
                href={studioInfo.kakaoLink || "https://pf.kakao.com/_AxdWxgn"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#FFE812] text-[#3B1E1E] hover:bg-yellow-300 font-bold transition-all flex items-center space-x-2 text-xs font-serif-kr shadow-sm active:scale-95"
                title="카카오톡 채널 1:1 문의 바로가기"
              >
                <KakaoIcon className="w-4 h-4 fill-current" />
                <span>카카오톡 채널 1:1 상담 바로가기</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          </div>

          {/* Business Information */}
          <div className="md:col-span-4 space-y-3 text-xs text-[#AAAAAA] font-light">
            <p className="font-serif-en text-xs text-[#A68F7E] uppercase tracking-widest font-medium mb-3">
              BUSINESS INFO
            </p>
            <p className="text-white font-medium">
              상호명: {' '}
              <EditableText
                value={studioInfo.brandName}
                onSave={(val) => updateStudioInfo({ brandName: val })}
                label="상호명"
              />
            </p>
            <p>
              대표자: {' '}
              <EditableText
                value={studioInfo.ceoName}
                onSave={(val) => updateStudioInfo({ ceoName: val })}
                label="대표자명"
              />
            </p>
            <p>
              사업자등록번호: {' '}
              <EditableText
                value={studioInfo.businessNumber}
                onSave={(val) => updateStudioInfo({ businessNumber: val })}
                label="사업자등록번호"
              />
            </p>
            <p className="flex items-center text-[#CCCCCC]">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E] shrink-0" />
              <span>
                <EditableText
                  value={studioInfo.address}
                  onSave={(val) => updateStudioInfo({ address: val })}
                  label="스튜디오 주소"
                />
              </span>
            </p>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3 text-xs text-[#AAAAAA] font-light">
            <p className="font-serif-en text-xs text-[#A68F7E] uppercase tracking-widest font-medium mb-3">
              CONTACT & HOURS
            </p>
            <p className="flex items-center text-white font-medium">
              <Phone className="w-3.5 h-3.5 mr-2 text-[#A68F7E]" />
              <span>
                전화:{' '}
                <EditableText
                  value={studioInfo.phone}
                  onSave={(val) => updateStudioInfo({ phone: val, mobile: val })}
                  label="대표 전화번호"
                />
              </span>
            </p>
            <p className="flex items-center">
              <Mail className="w-3.5 h-3.5 mr-2 text-[#A68F7E]" />
              <span>
                이메일: {' '}
                <EditableText
                  value={studioInfo.email}
                  onSave={(val) => updateStudioInfo({ email: val })}
                  label="대표 이메일"
                />
              </span>
            </p>
            <div className="pt-2 text-[#888888]">
              상담시간:{' '}
              <EditableText
                value={studioInfo.workingHours}
                onSave={(val) => updateStudioInfo({ workingHours: val })}
                label="운영 시간"
                multiline
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#888888] font-light">
          <div className="flex items-center space-x-3">
            <p
              onDoubleClick={toggleAdminMode}
              title="관리자 전용: 더블클릭 시 편집 모드가 토글됩니다"
              className="cursor-default select-none"
            >
              © 2025 Yeobaek Studio. All rights reserved.
            </p>
            {isAdminMode && (
              <button
                onClick={toggleAdminMode}
                className="px-2.5 py-1 rounded-full text-[10px] bg-amber-500 text-black font-semibold shadow-sm flex items-center space-x-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>편집 모드 ON</span>
              </button>
            )}
          </div>

          <button
            onClick={scrollToTop}
            className="mt-4 sm:mt-0 flex items-center space-x-2 text-[#AAAAAA] hover:text-[#A68F7E] transition-colors focus:outline-hidden"
          >
            <span className="font-serif-en tracking-widest uppercase">TOP OF PAGE</span>
            <div className="p-1.5 rounded-full bg-white/10">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
