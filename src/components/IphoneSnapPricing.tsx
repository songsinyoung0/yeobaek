import React, { useState } from 'react';
import { Smartphone, Check, Sparkles, HeartHandshake, ShieldCheck, Video, Image as ImageIcon, Send, Clock, Gift, Instagram, ArrowRight, ZoomIn, X } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

interface IphoneSnapPricingProps {
  onSelectPackage: (packageId: string) => void;
}

export const IphoneSnapPricing: React.FC<IphoneSnapPricingProps> = ({ onSelectPackage }) => {
  const { content } = useSiteContent();
  const { studioInfo } = content;
  const [showOriginalPoster, setShowOriginalPoster] = useState(false);

  const iphonePackages = [
    {
      id: 'iphone-a',
      typeCode: 'A',
      name: 'SIGNATURE',
      krName: '시그니처',
      originalPrice: '250,000원',
      originalPriceNum: 250000,
      discountedPrice: '150,000원',
      discountedPriceText: '15만원',
      timeText: '예식 60분 전 촬영',
      coverage: '신부대기실 · 본식 · 플라워샤워 · 원판',
      isPopular: false,
      retouchedCount: 5,
      featuresCol1: [
        '원본 사진 + 짧은 영상 촬영',
        '작가별 보정본 5장',
        '전체 원본 제공',
      ],
      featuresCol2: [
        '예식 당일 원본 전달',
        '예식 후 땡큐카드 전송',
        '짧은 영상 촬영 (갯수 제한 없음)',
      ],
    },
    {
      id: 'iphone-b',
      typeCode: 'B',
      name: 'PREMIUM',
      krName: '프리미엄',
      originalPrice: '300,000원',
      originalPriceNum: 300000,
      discountedPrice: '200,000원',
      discountedPriceText: '20만원',
      timeText: '예식 90분 전 촬영',
      coverage: '신부대기실 · 본식 · 플라워샤워 · 원판',
      isPopular: true,
      retouchedCount: 10,
      featuresCol1: [
        '원본 사진 + 짧은 영상 촬영',
        '작가별 보정본 10장',
        '전체 원본 제공',
      ],
      featuresCol2: [
        '예식 당일 원본 전달',
        '예식 후 땡큐카드 전송',
        '짧은 영상 촬영 (갯수 제한 없음)',
      ],
    },
  ];

  const additionalOptions = [
    { title: '원판 촬영 추가', price: '+ 30,000원' },
    { title: '연회장 촬영 추가', price: '+ 30,000원' },
    { title: '폐백 촬영 추가', price: '+ 30,000원' },
  ];

  const discountBenefits = [
    { title: '초상권 동의 할인', discount: '- 20,000원', desc: 'SNS 포트폴리오 공개 동의시' },
    { title: '후기 이벤트 할인', discount: '- 20,000원', desc: '웨딩 카페/블로그 후기 작성' },
    { title: '짝꿍 할인', discount: '- 10,000원', desc: '짝꿍 코드 입력시 각각 할인' },
  ];

  return (
    <div className="space-y-12">
      {/* Editorial Title Banner (Inspired by the poster typography) */}
      <div className="relative bg-gradient-to-b from-[#FAF8F5] to-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 shadow-sm text-center overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#A68F7E_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        {/* Top Header metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-8 border-b border-stone-200 text-xs font-serif-en text-stone-500 tracking-widest relative z-10">
          <div className="text-left">
            <span className="font-semibold text-stone-800 tracking-[0.25em] uppercase block">
              Y E O B A E K &nbsp; S T U D I O
            </span>
            <span className="text-[10px] text-stone-400 tracking-[0.2em] uppercase">
              WEDDING PHOTOGRAPHY
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={studioInfo.instagramIphone || "https://www.instagram.com/yeobaek_iphone_iksan/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 hover:bg-rose-100 transition-colors text-[11px] font-sans font-medium"
            >
              <Instagram className="w-3.5 h-3.5 text-rose-500" />
              <span>@yeobaek_iphone_iksan</span>
            </a>

            <button
              onClick={() => setShowOriginalPoster(true)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-sans transition-colors"
              title="공식 포스터 원본 이미지 보기"
            >
              <ZoomIn className="w-3.5 h-3.5 text-stone-500" />
              <span>포스터 원본</span>
            </button>
          </div>

          <div className="text-right hidden sm:block font-serif-kr text-[11px] text-stone-600">
            소중한 순간을<br />
            가장 자연스럽게, <strong className="font-normal text-stone-800">여백스튜디오</strong>
          </div>
        </div>

        {/* Main Title Center */}
        <div className="py-8 relative z-10">
          <span className="font-serif-en text-xs sm:text-sm tracking-[0.4em] uppercase text-[#A68F7E] font-medium block mb-2">
            W E D D I N G
          </span>
          <h3 className="font-serif-en text-4xl sm:text-5xl lg:text-6xl font-light text-stone-900 tracking-tight mb-4">
            <span className="italic font-normal">i</span>PHONE SNAP
          </h3>
          <p className="font-serif-kr text-base sm:text-lg text-stone-700 font-light max-w-xl mx-auto leading-relaxed">
            결혼식의 순간을 조금 더 가까이, 자연스럽게.
          </p>
          <div className="w-8 h-[1px] bg-stone-300 mx-auto my-3" />
          <p className="font-serif-kr text-xs sm:text-sm text-stone-500 font-light tracking-wide">
            아이폰으로 담아내는 또 하나의 특별한 기록
          </p>
        </div>

        {/* VAT Notice */}
        <div className="inline-block px-3 py-1 bg-stone-100 rounded-full text-[11px] text-stone-500 font-medium">
          ※ 모든 금액은 부가세(VAT) 미포함 금액입니다.
        </div>
      </div>

      {/* Package Comparison Grid (A Signature vs B Premium) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {iphonePackages.map((pkg) => {
          const isRec = pkg.isPopular;

          return (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl p-7 sm:p-9 transition-all duration-300 relative flex flex-col justify-between border ${
                isRec
                  ? 'border-[#A68F7E] shadow-xl ring-2 ring-[#A68F7E]/20 scale-[1.01]'
                  : 'border-stone-200/90 shadow-sm hover:border-[#A68F7E]/60 hover:shadow-md'
              }`}
            >
              {isRec && (
                <div className="absolute -top-3.5 left-8 px-3.5 py-1 bg-[#A68F7E] text-white text-[10px] font-serif-en tracking-[0.2em] uppercase rounded-full shadow-md flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <span>RECOMMENDED</span>
                </div>
              )}

              <div>
                {/* Top Header: Code & Type & Price */}
                <div className="flex items-start justify-between border-b border-stone-200 pb-6 mb-6">
                  <div>
                    <div className="flex items-baseline space-x-3 mb-1">
                      <span className="font-serif-en text-4xl sm:text-5xl font-light text-stone-900">
                        {pkg.typeCode}
                      </span>
                      <div className="h-6 w-[1px] bg-stone-300 self-center" />
                      <span className="font-serif-en text-xs sm:text-sm tracking-[0.25em] text-stone-600 uppercase font-semibold">
                        {pkg.name}
                      </span>
                    </div>

                    <p className="font-serif-kr text-xs sm:text-sm text-stone-800 font-medium mt-2">
                      {pkg.coverage}
                    </p>
                    <span className="inline-block text-[11px] font-medium text-stone-500 mt-0.5">
                      ({pkg.timeText})
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="font-serif-kr text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                      {pkg.originalPrice}
                    </div>
                    <div className="text-xs font-serif-kr text-[#A68F7E] font-medium mt-1">
                      (최대 할인 적용시 <strong className="font-bold underline text-stone-900">{pkg.discountedPriceText}</strong>)
                    </div>
                    <span className="text-[10px] text-stone-400 font-light block mt-0.5">
                      VAT 별도
                    </span>
                  </div>
                </div>

                {/* 구성 (Features) in 2 columns */}
                <div className="mb-8">
                  <span className="font-serif-kr text-xs font-bold text-stone-900 tracking-wider block mb-3 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A68F7E] mr-2" />
                    구성 내역
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-stone-700 bg-stone-50/70 p-4 rounded-2xl border border-stone-100">
                    <div className="space-y-2">
                      {pkg.featuresCol1.map((feat, idx) => (
                        <div key={idx} className="flex items-start">
                          <Check className="w-3.5 h-3.5 text-[#A68F7E] mr-2 shrink-0 mt-0.5" />
                          <span className={idx === 1 ? 'font-semibold text-stone-900' : ''}>
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {pkg.featuresCol2.map((feat, idx) => (
                        <div key={idx} className="flex items-start">
                          <Check className="w-3.5 h-3.5 text-[#A68F7E] mr-2 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPackage(pkg.id)}
                className={`w-full py-4 rounded-xl text-xs font-serif-kr font-medium tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 active:scale-[0.98] ${
                  isRec
                    ? 'bg-[#1A1A1A] hover:bg-[#A68F7E] text-white shadow-md'
                    : 'bg-[#A68F7E] hover:bg-[#1A1A1A] text-white shadow-xs'
                }`}
              >
                <span>아이폰 스냅 {pkg.name} ({pkg.typeCode}타입) 예약 문의</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Additional Options & Discounts Grid (Matching the Poster Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Additional Options Box */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
            <h4 className="font-serif-kr text-sm sm:text-base font-bold text-stone-900 flex items-center">
              <Sparkles className="w-4 h-4 text-[#A68F7E] mr-2" />
              <span>추가옵션</span>
            </h4>
            <span className="text-[11px] text-stone-400">VAT 별도</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {additionalOptions.map((opt, idx) => (
              <div key={idx} className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/60 text-center">
                <span className="text-xs text-stone-600 block mb-1 font-medium">{opt.title}</span>
                <strong className="text-sm font-bold text-stone-900">{opt.price}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Discount Info Box */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
            <h4 className="font-serif-kr text-sm sm:text-base font-bold text-stone-900 flex items-center">
              <Gift className="w-4 h-4 text-rose-500 mr-2" />
              <span>할인안내 (최대 5만원 할인)</span>
            </h4>
            <span className="text-[11px] text-rose-600 font-medium">중복 적용 가능</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {discountBenefits.map((disc, idx) => (
              <div key={idx} className="bg-rose-50/50 rounded-xl p-3.5 border border-rose-100 text-center">
                <span className="text-xs text-stone-800 block font-medium mb-0.5">{disc.title}</span>
                <strong className="text-sm font-bold text-rose-600 block">{disc.discount}</strong>
                <span className="text-[10px] text-stone-400 block mt-1">{disc.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Combo Offer Banner: 본식스냅 동시 이용 할인 */}
      <div className="bg-[#1A1A1A] text-white rounded-3xl p-6 sm:p-8 border border-[#A68F7E]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-[#A68F7E]/20 border border-[#A68F7E]/40 text-[#A68F7E] flex items-center justify-center shrink-0">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-[#A68F7E] text-white text-[10px] font-serif-en tracking-wider uppercase rounded-full">
                SPECIAL COMBO
              </span>
              <span className="text-xs text-[#A68F7E] font-medium">동시 예약 특전</span>
            </div>
            <h4 className="font-serif-kr text-xl sm:text-2xl font-light text-white mt-1">
              본식스냅 동시 이용 할인
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 font-light mt-1">
              본식스냅과 아이폰스냅을 동시에 예약하시면 <strong className="text-white font-semibold underline decoration-[#A68F7E] underline-offset-4">5만원 추가 할인 혜택</strong>이 즉시 적용됩니다.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          <div className="text-right">
            <span className="text-[11px] text-stone-400 block">할인 금액</span>
            <span className="font-serif-kr text-3xl font-bold text-rose-400 tracking-tight">
              - 50,000원
            </span>
          </div>

          <button
            onClick={() => onSelectPackage('bundle-snap-iphone')}
            className="px-5 py-3 rounded-xl bg-[#A68F7E] hover:bg-white hover:text-[#1A1A1A] text-white text-xs font-serif-kr font-medium tracking-wider transition-all duration-300 shadow-md active:scale-95"
          >
            동시 예약 문의
          </button>
        </div>
      </div>

      {/* Notice & Guidelines (Matching the Bottom Section of the Poster) */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200/90 p-6 sm:p-8">
        <div className="flex items-center space-x-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-[#A68F7E]" />
          <h4 className="font-serif-kr text-sm font-bold text-stone-900 tracking-wider">
            안내사항 및 꼭 확인해주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600">
          {/* 1. Device Info */}
          <div className="bg-white p-4 rounded-xl border border-stone-200/60 space-y-1.5">
            <div className="flex items-center space-x-2 text-stone-900 font-semibold">
              <Smartphone className="w-4 h-4 text-[#A68F7E]" />
              <span>최신 기종 Pro 촬영</span>
            </div>
            <p className="text-stone-500 font-light text-[11px] leading-relaxed">
              아이폰 최신 Pro 기종(아이폰 16/18 Pro)으로 촬영하여 고해상도 색감과 디테일을 보장합니다.
            </p>
          </div>

          {/* 2. Ratio Info */}
          <div className="bg-white p-4 rounded-xl border border-stone-200/60 space-y-1.5">
            <div className="flex items-center space-x-2 text-stone-900 font-semibold">
              <ImageIcon className="w-4 h-4 text-[#A68F7E]" />
              <span>촬영 비율</span>
            </div>
            <p className="text-stone-700 font-medium text-[11px]">
              신부 60% <span className="text-stone-300">|</span> 신랑 20% <span className="text-stone-300">|</span> 혼주 및 하객 20%
            </p>
            <p className="text-stone-400 text-[10px]">
              감동적인 순간을 신부님 중심으로 고르게 담아냅니다.
            </p>
          </div>

          {/* 3. Essential Notice */}
          <div className="bg-white p-4 rounded-xl border border-stone-200/60 space-y-1 text-[11px] leading-relaxed text-stone-600">
            <span className="font-semibold text-stone-900 block mb-1">꼭 확인해주세요</span>
            <ul className="space-y-1 list-disc list-inside text-stone-500 font-light">
              <li>촬영 시간은 예식 진행 상황에 따라 변동될 수 있습니다.</li>
              <li>원본 파일은 <strong className="text-stone-700 font-normal">당일 또는 익일</strong>에 전달됩니다.</li>
              <li>아이폰 특성상 빛과 색감이 다르게 느껴질 수 있습니다. (자연스러운 색감 보정 진행)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Poster Image Modal */}
      {showOriginalPoster && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full max-h-[90vh] bg-white rounded-2xl p-4 overflow-auto shadow-2xl">
            <button
              onClick={() => setShowOriginalPoster(false)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/10 hover:bg-black/20 text-stone-700 transition-colors z-10"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-3">
              <h5 className="font-serif-kr text-sm font-semibold text-stone-900">
                여백스튜디오 아이폰 스냅 공식 안내표
              </h5>
            </div>
            <img
              src="/assets/aistudio/______________________0922d804.PNG"
              alt="여백스튜디오 아이폰 스냅 가격표 포스터"
              className="w-full h-auto rounded-lg shadow-inner object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
