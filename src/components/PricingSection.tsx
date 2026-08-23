import React, { useState } from 'react';
import { Check, Star, Sparkles, Building2, Gift, PhoneCall, Globe, CreditCard, HeartHandshake, ArrowRight, Award } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { EditableText } from './EditableText';

interface PricingSectionProps {
  onSelectPackage: (packageId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPackage }) => {
  const { content, updatePackage } = useSiteContent();
  const packages = content.packages;
  const [priceMode, setPriceMode] = useState<'standard' | 'western'>('western');

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-[#F5F3EF] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Western Life Partnership Banner */}
        <div className="mb-10 p-4 sm:p-6 bg-[#1A1A1A] text-white rounded-2xl border border-[#A68F7E]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#A68F7E]/20 text-[#A68F7E] flex items-center justify-center shrink-0 border border-[#A68F7E]/40">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#A68F7E] text-white text-[10px] font-serif-en font-medium tracking-wider uppercase">
                  OFFICIAL PARTNER
                </span>
                <span className="text-xs text-[#A68F7E] font-medium tracking-widest">WESTERN LIFE HOTEL</span>
              </div>
              <h3 className="font-serif-kr text-lg sm:text-xl font-normal text-white mt-1">
                익산 웨스턴라이프 호텔 공식 제휴 스튜디오
              </h3>
              <p className="text-xs text-white/70 font-light mt-0.5">
                웨스턴라이프 예약 고객님께만 제공되는 전용 제휴 할인 혜택 및 특별 연계 이벤트
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setPriceMode('western')}
              className={`px-4 py-2.5 rounded-xl text-xs font-serif-kr transition-all duration-300 flex items-center space-x-2 ${
                priceMode === 'western'
                  ? 'bg-[#A68F7E] text-white shadow-md font-medium ring-2 ring-[#A68F7E]/50'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>웨스턴라이프 제휴가 보기</span>
            </button>
            <button
              onClick={() => setPriceMode('standard')}
              className={`px-4 py-2.5 rounded-xl text-xs font-serif-kr transition-all duration-300 ${
                priceMode === 'standard'
                  ? 'bg-white text-[#1A1A1A] shadow-md font-medium'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <span>일반 스냅 가격표</span>
            </button>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-serif-en text-xs sm:text-sm tracking-[0.3em] uppercase text-[#A68F7E] font-medium block mb-3">
            {priceMode === 'western' ? 'WESTERN LIFE PARTNERSHIP PRICING' : 'STANDARD PACKAGES & PRICING'}
          </span>
          <h2 className="font-serif-kr text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1A1A] tracking-tight leading-snug mb-4">
            {priceMode === 'western' ? '웨스턴 & 여백 스튜디오 본식스냅' : '여백 스튜디오 본식스냅 가격안내'}
          </h2>
          <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed">
            {priceMode === 'western'
              ? '웨스턴라이프 제휴 고객님을 위한 4가지 특가 패키지 구성입니다.'
              : '불필요한 옵션 강요 없이, 정직하고 투명한 4가지 본식 스냅 패키지 안내입니다.'}
          </p>

          {/* Toggle Switch Tabs inside section */}
          <div className="inline-flex items-center p-1.5 bg-[#EAE7E2] rounded-2xl border border-black/5 mt-6 shadow-inner">
            <button
              onClick={() => setPriceMode('western')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif-kr font-medium transition-all duration-300 flex items-center space-x-2 ${
                priceMode === 'western'
                  ? 'bg-[#1A1A1A] text-white shadow-md'
                  : 'text-[#666666] hover:text-[#1A1A1A]'
              }`}
            >
              <Award className="w-4 h-4 text-[#A68F7E]" />
              <span>웨스턴라이프 제휴 혜택가</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-[#A68F7E] text-white text-[10px]">특가</span>
            </button>
            <button
              onClick={() => setPriceMode('standard')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif-kr font-medium transition-all duration-300 ${
                priceMode === 'standard'
                  ? 'bg-white text-[#1A1A1A] shadow-md'
                  : 'text-[#666666] hover:text-[#1A1A1A]'
              }`}
            >
              <span>일반 스냅 가격표</span>
            </button>
          </div>
        </div>

        {/* Western Life Special Benefit Banner Notice */}
        {priceMode === 'western' && (
          <div className="mb-10 p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-[#1A1A1A] animate-fadeIn">
            <div className="flex items-center space-x-3">
              <Gift className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="font-serif-kr text-sm font-semibold text-amber-900">
                  🎁 웨스턴 예약자 추가 이벤트 (특전 혜택)
                </h4>
                <p className="text-xs text-amber-800 font-light mt-0.5">
                  웨스턴 제휴 업체 여백스튜디오 촬영 상품 예약시 <strong className="font-medium underline">웨딩 네일아트 10% 할인</strong> (네일 상품 5만원 이상 결제시 적용)
                </p>
              </div>
            </div>
            <div className="px-3 py-1 bg-amber-600 text-white rounded-full text-[11px] font-medium shrink-0">
              웨스턴 전용 혜택
            </div>
          </div>
        )}

        {/* 4-Column Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
          {packages.map((pkg) => {
            const isRec = pkg.isRecommended;

            return (
              <div
                key={pkg.id}
                className={`bento-card relative rounded-2xl transition-all duration-300 flex flex-col justify-between ${
                  isRec
                    ? 'bg-[#FFFDF9] text-[#1A1A1A] border-2 border-[#A68F7E] shadow-xl scale-[1.02] z-10'
                    : 'bg-white text-[#1A1A1A] border border-black/10 hover:border-[#A68F7E]/50 shadow-xs hover:shadow-md'
                } p-6 sm:p-7`}
              >
                {/* Recommended Choice Badge */}
                {isRec && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#A68F7E] text-white text-[10px] font-serif-en tracking-[0.2em] uppercase rounded-full shadow-md flex items-center space-x-1 whitespace-nowrap">
                    <Star className="w-3 h-3 fill-current text-amber-200" />
                    <span>BEST POPULAR</span>
                  </div>
                )}

                <div>
                  {/* Header Info */}
                  <div className="border-b border-black/10 pb-5 mb-5">
                    <span className="text-[11px] font-serif-en uppercase tracking-wider block mb-1 text-[#A68F7E] font-medium">
                      <EditableText
                        value={pkg.subtitle}
                        onSave={(val) => updatePackage(pkg.id, { subtitle: val })}
                        label="상품 부제목"
                      />
                    </span>

                    <h3 className="font-serif-kr text-xl sm:text-2xl font-bold mb-3 text-[#1A1A1A]">
                      <EditableText
                        value={pkg.name}
                        onSave={(val) => updatePackage(pkg.id, { name: val })}
                        label="상품명"
                      />
                    </h3>

                    {/* Price Display */}
                    <div className="pt-2">
                      {priceMode === 'western' ? (
                        <div>
                          <div className="text-xs text-[#888888] line-through mb-0.5">
                            일반가{' '}
                            <EditableText
                              value={pkg.price}
                              onSave={(val) => updatePackage(pkg.id, { price: val })}
                              label="일반가"
                            />
                          </div>
                          <div className="flex items-baseline space-x-1.5">
                            <span className="text-[11px] font-bold text-[#A68F7E] uppercase">웨스턴 혜택가</span>
                            <span className="font-serif-kr text-2xl sm:text-3xl font-bold text-rose-600 tracking-tight">
                              <EditableText
                                value={pkg.westernPrice}
                                onSave={(val) => updatePackage(pkg.id, { westernPrice: val })}
                                label="웨스턴 제휴가"
                              />
                            </span>
                          </div>
                          <span className="text-[10px] text-[#777777] font-light block mt-0.5">
                            (VAT 별도)
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline space-x-1.5">
                            <span className="font-serif-kr text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                              <EditableText
                                value={pkg.price}
                                onSave={(val) => updatePackage(pkg.id, { price: val })}
                                label="가격"
                              />
                            </span>
                          </div>
                          <span className="text-[10px] text-[#777777] font-light block mt-0.5">
                            (VAT 별도)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photographer Config Badge */}
                  <div className="p-3 rounded-xl mb-5 text-xs font-semibold bg-[#F5F3EF] text-[#1A1A1A] border border-black/5">
                    <span className="block font-serif-en uppercase text-[9px] tracking-wider mb-0.5 text-[#888888]">
                      PHOTOGRAPHER
                    </span>
                    <EditableText
                      value={pkg.photographerConfig}
                      onSave={(val) => updatePackage(pkg.id, { photographerConfig: val })}
                      label="작가 구성"
                    />
                  </div>

                  {/* Deliverables */}
                  <div className="mb-5">
                    <span className="text-[10px] font-serif-en tracking-wider uppercase block mb-1 text-[#888888] font-medium">
                      DELIVERABLES
                    </span>
                    <div className="text-xs font-medium leading-relaxed text-[#222222]">
                      <EditableText
                        value={pkg.deliverables}
                        onSave={(val) => updatePackage(pkg.id, { deliverables: val })}
                        label="제공 내역"
                        multiline
                      />
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 mb-6 border-t border-black/10 pt-4">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start text-xs font-normal">
                        <Check className="w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 text-emerald-600" />
                        <span className="text-[#333333]">
                          <EditableText
                            value={feat}
                            onSave={(newFeat) => {
                              const updatedFeatures = [...pkg.features];
                              updatedFeatures[idx] = newFeat;
                              updatePackage(pkg.id, { features: updatedFeatures });
                            }}
                            label={`세부항목 ${idx + 1}`}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => onSelectPackage(pkg.id)}
                  className={`w-full py-3.5 rounded-xl text-xs font-medium tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-1.5 active:scale-[0.98] ${
                    isRec
                      ? 'bg-[#A68F7E] hover:bg-[#1A1A1A] text-white shadow-md'
                      : 'bg-[#1A1A1A] hover:bg-[#A68F7E] text-white shadow-xs'
                  }`}
                >
                  <span>{pkg.name} 예약 문의</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* 追加項目 & 참고사항 (Additional Options & Notes - Matching the image board) */}
        <div className="bento-card bg-white rounded-2xl border border-black/10 p-8 sm:p-10 shadow-lg">
          <div className="text-center max-w-xl mx-auto mb-8 border-b border-black/10 pb-6">
            <span className="font-serif-en text-xs tracking-[0.25em] text-[#A68F7E] uppercase block mb-1">
              ADDITIONAL OPTIONS & INFORMATION
            </span>
            <h3 className="font-serif-kr text-2xl sm:text-3xl font-light text-[#1A1A1A]">
              추가항목 & 참고사항
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. 추가 옵션 */}
            <div className="space-y-3 bg-[#F5F3EF]/60 p-5 rounded-xl border border-black/5">
              <h4 className="font-serif-kr text-sm font-semibold text-[#1A1A1A] flex items-center space-x-2 border-b border-black/10 pb-2">
                <Sparkles className="w-4 h-4 text-[#A68F7E]" />
                <span>추가 옵션 항목</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#444444] font-light">
                <li className="flex justify-between items-center">
                  <span>대표 지정시</span>
                  <strong className="font-medium text-[#1A1A1A]">+200,000원</strong>
                </li>
                <li className="flex justify-between items-center">
                  <span>서브작가 추가시</span>
                  <strong className="font-medium text-[#1A1A1A]">+200,000원</strong>
                </li>
                <li className="flex justify-between items-center">
                  <span>폐백 촬영 추가시</span>
                  <strong className="font-medium text-[#1A1A1A]">+150,000원</strong>
                </li>
                <li className="flex justify-between items-center">
                  <span>연회장 촬영 추가시</span>
                  <strong className="font-medium text-[#1A1A1A]">+150,000원</strong>
                </li>
                <li className="flex justify-between items-center">
                  <span>11*14 앨범(동일상품) 추가 1권</span>
                  <strong className="font-medium text-[#1A1A1A]">+150,000원</strong>
                </li>
                <li className="flex justify-between items-center">
                  <span>원판추가시 (11*14 10P 앨범 3권)</span>
                  <strong className="font-medium text-[#1A1A1A]">+450,000원</strong>
                </li>
                <li className="flex justify-between items-center text-[#777777] pt-1 border-t border-black/5">
                  <span>액자 추가시</span>
                  <span>사이즈별 가격 별도문의</span>
                </li>
              </ul>
            </div>

            {/* 2. 결제 & 정산 안내 */}
            <div className="space-y-3 bg-[#F5F3EF]/60 p-5 rounded-xl border border-black/5">
              <h4 className="font-serif-kr text-sm font-semibold text-[#1A1A1A] flex items-center space-x-2 border-b border-black/10 pb-2">
                <CreditCard className="w-4 h-4 text-[#A68F7E]" />
                <span>잔금 결제 안내</span>
              </h4>
              <div className="text-xs text-[#555555] font-light leading-relaxed space-y-2">
                <div className="bg-white p-3.5 rounded-lg border border-black/5 text-[#333333] space-y-1.5">
                  <p className="font-medium text-[#1A1A1A]">
                    촬영 일주일전까지 최종 잔금 결제, 계좌이체 또는 스튜디오 방문 후 카드결제, 현금결제 진행.
                  </p>
                  <p className="text-[11px] text-[#777777] font-normal">
                    • 현금영수증 발행가능 (vat 별도)
                  </p>
                </div>
              </div>
            </div>

            {/* 3. 이벤트 혜택 (후기 & 짝꿍) */}
            <div className="space-y-3 bg-[#F5F3EF]/60 p-5 rounded-xl border border-black/5">
              <h4 className="font-serif-kr text-sm font-semibold text-[#1A1A1A] flex items-center space-x-2 border-b border-black/10 pb-2">
                <HeartHandshake className="w-4 h-4 text-[#A68F7E]" />
                <span>이벤트 혜택</span>
              </h4>
              <div className="space-y-3 text-xs text-[#444444] font-light">
                <div className="bg-white p-3 rounded-lg border border-black/5">
                  <span className="font-semibold text-[#1A1A1A] block mb-1">
                    🎉 후기 이벤트 참여시 5만원 페이백
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#666666]">
                    <li>식후 5일 이내 10매 베스트컷 전송</li>
                    <li>블로그 or 인스타그램 게시물 작성 후 태그!</li>
                  </ul>
                </div>

                <div className="bg-white p-3 rounded-lg border border-black/5">
                  <span className="font-semibold text-[#1A1A1A] block mb-1">
                    🤝 짝꿍 할인 이벤트
                  </span>
                  <p className="text-[11px] text-[#666666]">
                    짝꿍 이벤트 이용자 전체 10% 할인 (최대 3명 할인 적용)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Contact Details matching the photo banner */}
          <div className="mt-8 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#555555]">
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-[#A68F7E]" />
              <span>카카오톡 친구검색창: <strong className="text-[#1A1A1A] font-semibold">"여백스튜디오 익산"</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#A68F7E]" />
              <a
                href="https://www.yeobaekstudioiksan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif-en text-stone-700 hover:text-[#A68F7E] font-medium tracking-wider"
              >
                WWW.YEOBAEKSTUDIOIKSAN.COM
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
