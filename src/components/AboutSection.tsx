import React, { useState } from 'react';
import { Heart, Sun, Feather, Camera, ImageIcon } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { QuickEditPhotoModal } from './AdminEditorModal';
import { EditableText } from './EditableText';
import { resolveImageUrl } from '../utils/imageHelper';

export const AboutSection: React.FC = () => {
  const { content, isAdminMode, updateAbout } = useSiteContent();
  const { about } = content;

  const [activePhotoModal, setActivePhotoModal] = useState<'photo1' | 'photo2' | 'directorPhoto' | null>(null);

  const pillars = [
    {
      icon: Heart,
      number: '01',
      title: '자연스러운 찰나의 순간',
      englishTitle: 'Natural Fleeting Moments',
      description:
        '억지로 꾸며낸 포즈보다는, 신랑신부님과 하객분들이 나누는 진실된 웃음, 감격스러운 눈물, 서로를 향한 따뜻한 눈빛을 있는 그대로 정갈하게 담습니다.',
    },
    {
      icon: Sun,
      number: '02',
      title: '따뜻하고 기품 있는 색감',
      englishTitle: 'Warm & Timeless Tones',
      description:
        '시간이 지나 10년, 20년 뒤에 다시 꺼내어 보아도 질리지 않는 여백스튜디오만의 시그니처 웜톤 파스텔 조색 기법을 적용합니다.',
    },
    {
      icon: Feather,
      number: '03',
      title: '연출되지 않은 진심',
      englishTitle: 'Unstaged Sincerity',
      description:
        '본식 진행을 방해하지 않는 고요하고 절제된 움직임 속에서, 가장 극적이고 감동적인 순간을 놓치지 않는 다큐멘터리식 디렉팅을 추구합니다.',
    },
    {
      icon: Camera,
      number: '04',
      title: '섬세한 여백과 입체적 구도',
      englishTitle: 'Delicate Detail & Space',
      description:
        '피사체에만 치우치지 않고 웨딩홀의 웅장한 아키텍처, 꽃장식, 조명의 텍스처, 그리고 인물 간의 거리가 만드는 여백의 미를 완성합니다.',
    },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#F5F3EF] relative overflow-hidden">
      {/* Quick Photo Modals for About Photos */}
      <QuickEditPhotoModal
        isOpen={activePhotoModal === 'photo1'}
        onClose={() => setActivePhotoModal(null)}
        currentUrl={about.photo1}
        title="스튜디오 대표 소개 사진 1"
        onSave={(newUrl) => updateAbout({ photo1: newUrl })}
      />

      <QuickEditPhotoModal
        isOpen={activePhotoModal === 'photo2'}
        onClose={() => setActivePhotoModal(null)}
        currentUrl={about.photo2}
        title="스튜디오 대표 소개 사진 2"
        onSave={(newUrl) => updateAbout({ photo2: newUrl })}
      />

      <QuickEditPhotoModal
        isOpen={activePhotoModal === 'directorPhoto'}
        onClose={() => setActivePhotoModal(null)}
        currentUrl={about.directorPhoto}
        title="대표작가 프로필 사진"
        onSave={(newUrl) => updateAbout({ directorPhoto: newUrl })}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          <span className="font-serif-en text-xs sm:text-sm tracking-[0.3em] uppercase text-[#A68F7E] font-medium block mb-3">
            <EditableText
              value={about.tagline}
              onSave={(val) => updateAbout({ tagline: val })}
              label="태그라인"
            />
          </span>
          <h2 className="font-serif-kr text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1A1A] tracking-tight leading-snug mb-6">
            <EditableText
              value={about.title}
              onSave={(val) => updateAbout({ title: val })}
              label="소개 타이틀"
            />
          </h2>
          <div className="text-sm sm:text-base text-[#555555] font-light leading-relaxed max-w-2xl mx-auto">
            <EditableText
              value={about.description}
              onSave={(val) => updateAbout({ description: val })}
              label="소개 설명글"
              multiline
            />
          </div>
        </div>

        {/* Bento Grid Layout Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-20">
          {/* Left Large Photo Bento Box */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 bento-card p-4 rounded-xl bg-white">
            <div className="space-y-4 flex flex-col justify-between">
              <div className="overflow-hidden rounded-lg group h-64 sm:h-72 relative">
                <img
                  src={resolveImageUrl(about.photo1)}
                  alt="여백스튜디오 베일 컷"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover img-zoom"
                />
                {isAdminMode && (
                  <button
                    onClick={() => setActivePhotoModal('photo1')}
                    className="absolute inset-0 bg-black/50 opacity-90 hover:opacity-100 flex items-center justify-center text-white text-xs font-medium space-x-1 transition-opacity"
                  >
                    <ImageIcon className="w-4 h-4 text-amber-300" />
                    <span>📷 사진 변경</span>
                  </button>
                )}
              </div>
              <div className="p-5 bg-[#EAE7E2]/50 rounded-lg border border-black/5">
                <p className="font-serif-en text-2xl text-[#1A1A1A] mb-2 font-light">"Yeobaek"</p>
                <p className="text-xs sm:text-sm text-[#555555] font-light leading-relaxed">
                  '여백'은 여유롭고 한적한 공간을 의미합니다. 인물과 인물 사이, 마음과 마음이 이어지는 공간을 차분하게 기록합니다.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between h-full">
              <div className="overflow-hidden rounded-lg group h-full min-h-[300px] relative">
                <img
                  src={resolveImageUrl(about.photo2)}
                  alt="여백스튜디오 세레머니 컷"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover img-zoom"
                />
                {isAdminMode && (
                  <button
                    onClick={() => setActivePhotoModal('photo2')}
                    className="absolute inset-0 bg-black/50 opacity-90 hover:opacity-100 flex items-center justify-center text-white text-xs font-medium space-x-1 transition-opacity"
                  >
                    <ImageIcon className="w-4 h-4 text-amber-300" />
                    <span>📷 사진 변경</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Text Description Bento Box */}
          <div className="lg:col-span-5 bento-card p-8 rounded-xl bg-white flex flex-col justify-between space-y-6 relative">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-[#EAE7E2] text-[#1A1A1A] text-[11px] font-serif-en tracking-[0.2em] uppercase rounded-xs">
                About Yeobaek Studio
              </div>

              <h3 className="font-serif-kr text-2xl sm:text-3xl font-light text-[#1A1A1A] leading-snug">
                <EditableText
                  value={about.aboutQuote}
                  onSave={(val) => updateAbout({ aboutQuote: val })}
                  label="스튜디오 대표 문구"
                  multiline
                />
              </h3>

              <div className="text-sm text-[#555555] font-light leading-relaxed">
                <EditableText
                  value={about.aboutDesc1}
                  onSave={(val) => updateAbout({ aboutDesc1: val })}
                  label="철학 설명 1"
                  multiline
                />
              </div>

              <div className="text-sm text-[#555555] font-light leading-relaxed">
                <EditableText
                  value={about.aboutDesc2}
                  onSave={(val) => updateAbout({ aboutDesc2: val })}
                  label="철학 설명 2"
                  multiline
                />
              </div>
            </div>

            <div className="pt-5 border-t border-black/5 flex items-center justify-between">
              <div>
                <div className="font-serif-kr text-base font-medium text-[#1A1A1A]">
                  <EditableText
                    value={about.directorName}
                    onSave={(val) => updateAbout({ directorName: val })}
                    label="대표작가 이름"
                  />
                </div>
                <div className="font-serif-en text-xs text-[#888888] tracking-wider uppercase">
                  <EditableText
                    value={about.directorTitle}
                    onSave={(val) => updateAbout({ directorTitle: val })}
                    label="대표작가 직함"
                  />
                </div>
              </div>

              <div className="relative group cursor-pointer" onClick={() => isAdminMode && setActivePhotoModal('directorPhoto')}>
                <img
                  src={resolveImageUrl(about.directorPhoto)}
                  alt="대표작가 프로필"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-[#A68F7E]/40"
                />
                {isAdminMode && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-[9px] text-amber-300 font-bold">
                    수정
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="bento-card p-8 rounded-xl bg-white flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif-en text-2xl text-[#A68F7E] font-light">{pillar.number}</span>
                    <div className="p-2.5 rounded-full bg-[#EAE7E2] text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <h4 className="font-serif-kr text-lg font-medium text-[#1A1A1A] mb-1">
                    {pillar.title}
                  </h4>
                  <p className="font-serif-en text-xs text-[#999999] uppercase tracking-wider mb-4">
                    {pillar.englishTitle}
                  </p>

                  <p className="text-xs sm:text-sm text-[#666666] font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
