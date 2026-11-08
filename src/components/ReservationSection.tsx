import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Send,
  RefreshCw,
  X,
  Gift,
  Tag,
  Sparkles,
  FileText,
  Smartphone,
  Camera,
  HeartHandshake,
  Check,
  Plus,
  Percent,
} from 'lucide-react';
import { ReservationFormData, InquiryResult, ReservationServiceType } from '../types';
import { useSiteContent } from '../context/ContentContext';
import { KakaoIcon } from './KakaoIcon';

interface ReservationSectionProps {
  selectedPackageId?: string;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ selectedPackageId }) => {
  const { content, addInquiry } = useSiteContent();
  const { studioInfo } = content;

  // Determine initial serviceType from selectedPackageId
  const getInitialServiceType = (pkgId?: string): ReservationServiceType => {
    if (pkgId === 'bundle-snap-iphone') return 'COMBO_BOTH';
    if (pkgId === 'iphone-a' || pkgId === 'iphone-b') return 'IPHONE_ONLY';
    return 'CAMERA_ONLY';
  };

  const [serviceType, setServiceType] = useState<ReservationServiceType>(() =>
    getInitialServiceType(selectedPackageId)
  );

  const [formData, setFormData] = useState<ReservationFormData>({
    groomName: '',
    brideName: '',
    phone: '',
    email: '',
    weddingDate: '',
    weddingTime: '12:00',
    venueName: '',
    serviceType: getInitialServiceType(selectedPackageId),
    selectedPackage: selectedPackageId && !selectedPackageId.startsWith('iphone') && selectedPackageId !== 'bundle-snap-iphone' ? selectedPackageId : 'album',
    selectedIphonePackage: selectedPackageId === 'iphone-a' ? 'iphone-a' : 'iphone-b',
    iphoneOptions: {
      addWonpan: false,
      addBanquet: false,
      addPyebaek: false,
      discountPortrait: false,
      discountReview: false,
      discountPartner: false,
    },
    priceType: 'WESTERN',
    reviewEvent: 'JOIN',
    specialRequests: '',
    agreeToTerms: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ReservationFormData, string>>>({});
  const [inquiryResult, setInquiryResult] = useState<InquiryResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize when selectedPackageId prop changes (from external buttons)
  useEffect(() => {
    if (selectedPackageId) {
      if (selectedPackageId === 'bundle-snap-iphone') {
        setServiceType('COMBO_BOTH');
        setFormData((prev) => ({
          ...prev,
          serviceType: 'COMBO_BOTH',
          selectedPackage: prev.selectedPackage && !prev.selectedPackage.startsWith('iphone') ? prev.selectedPackage : 'album',
          selectedIphonePackage: 'iphone-b',
        }));
      } else if (selectedPackageId.startsWith('iphone')) {
        setServiceType('IPHONE_ONLY');
        setFormData((prev) => ({
          ...prev,
          serviceType: 'IPHONE_ONLY',
          selectedPackage: selectedPackageId,
          selectedIphonePackage: selectedPackageId,
        }));
      } else {
        setServiceType('CAMERA_ONLY');
        setFormData((prev) => ({
          ...prev,
          serviceType: 'CAMERA_ONLY',
          selectedPackage: selectedPackageId,
        }));
      }
    }
  }, [selectedPackageId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof ReservationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleServiceTypeChange = (type: ReservationServiceType) => {
    setServiceType(type);
    setFormData((prev) => ({
      ...prev,
      serviceType: type,
      selectedPackage: type === 'IPHONE_ONLY'
        ? (prev.selectedIphonePackage || 'iphone-b')
        : (prev.selectedPackage && !prev.selectedPackage.startsWith('iphone') ? prev.selectedPackage : 'album'),
      selectedIphonePackage: prev.selectedIphonePackage || 'iphone-b',
    }));
  };

  const handleIphoneOptionToggle = (key: keyof NonNullable<ReservationFormData['iphoneOptions']>) => {
    setFormData((prev) => {
      const currentOpts = prev.iphoneOptions || {};
      return {
        ...prev,
        iphoneOptions: {
          ...currentOpts,
          [key]: !currentOpts[key],
        },
      };
    });
  };

  // Calculation helpers
  const getCameraPackagePrice = (pkgId: string, priceType: 'NORMAL' | 'WESTERN'): { name: string; price: number; priceText: string } => {
    switch (pkgId) {
      case 'raw':
        return {
          name: '원본형 (데이터)',
          price: priceType === 'WESTERN' ? 400000 : 500000,
          priceText: priceType === 'WESTERN' ? '40만원 (웨스턴 혜택가)' : '50만원 (일반가)',
        };
      case 'raw-retouched':
        return {
          name: '원본 + 보정본형',
          price: priceType === 'WESTERN' ? 500000 : 600000,
          priceText: priceType === 'WESTERN' ? '50만원 (웨스턴 혜택가)' : '60만원 (일반가)',
        };
      case 'album':
        return {
          name: '화보앨범형 [인기추천]',
          price: priceType === 'WESTERN' ? 700000 : 800000,
          priceText: priceType === 'WESTERN' ? '70만원 (웨스턴 혜택가)' : '80만원 (일반가)',
        };
      case 'premium':
        return {
          name: '프리미엄형 [2인 작가]',
          price: priceType === 'WESTERN' ? 950000 : 1050000,
          priceText: priceType === 'WESTERN' ? '95만원 (웨스턴 혜택가)' : '105만원 (일반가)',
        };
      default:
        return {
          name: '기타 커스텀 스냅',
          price: 0,
          priceText: '상담 후 견적 안내',
        };
    }
  };

  const getIphonePackagePrice = (pkgId: string): { name: string; price: number; priceText: string; timeText: string } => {
    if (pkgId === 'iphone-a') {
      return {
        name: '아이폰스냅 A타입 [SIGNATURE]',
        price: 250000,
        priceText: '250,000원 (최대할인시 150,000원)',
        timeText: '예식 60분 전 촬영',
      };
    }
    return {
      name: '아이폰스냅 B타입 [PREMIUM - 추천]',
      price: 300000,
      priceText: '300,000원 (최대할인시 200,000원)',
      timeText: '예식 90분 전 촬영',
    };
  };

  // Calculate total estimate based on current selections
  const calculateEstimate = () => {
    const opts = formData.iphoneOptions || {};
    let iphoneOptionsAdd = 0;
    if (opts.addWonpan) iphoneOptionsAdd += 30000;
    if (opts.addBanquet) iphoneOptionsAdd += 30000;
    if (opts.addPyebaek) iphoneOptionsAdd += 30000;

    let iphoneDiscount = 0;
    if (opts.discountPortrait) iphoneDiscount += 20000;
    if (opts.discountReview) iphoneDiscount += 20000;
    if (opts.discountPartner) iphoneDiscount += 10000;

    if (serviceType === 'CAMERA_ONLY') {
      const cameraInfo = getCameraPackagePrice(formData.selectedPackage, formData.priceType);
      return {
        title: `본식 카메라 스냅 [${cameraInfo.name}]`,
        summaryText: `${cameraInfo.name} (${cameraInfo.priceText})`,
        cameraPrice: cameraInfo.price,
        iphonePrice: 0,
        comboDiscount: 0,
        total: cameraInfo.price,
        totalText: cameraInfo.price > 0 ? `${cameraInfo.price.toLocaleString()}원` : '상담 후 안내',
      };
    }

    if (serviceType === 'IPHONE_ONLY') {
      const iphonePkgId = formData.selectedIphonePackage || formData.selectedPackage || 'iphone-b';
      const iphoneInfo = getIphonePackagePrice(iphonePkgId);
      const total = iphoneInfo.price + iphoneOptionsAdd - iphoneDiscount;
      return {
        title: `아이폰 스냅 단독 [${iphoneInfo.name}]`,
        summaryText: `${iphoneInfo.name} (${iphoneInfo.price.toLocaleString()}원, 할인 ${iphoneDiscount.toLocaleString()}원 적용, 옵션 +${iphoneOptionsAdd.toLocaleString()}원)`,
        cameraPrice: 0,
        iphonePrice: iphoneInfo.price,
        iphoneDiscount,
        iphoneOptionsAdd,
        comboDiscount: 0,
        total,
        totalText: `${total.toLocaleString()}원 (VAT 별도)`,
      };
    }

    // COMBO_BOTH
    const cameraInfo = getCameraPackagePrice(formData.selectedPackage, formData.priceType);
    const iphoneInfo = getIphonePackagePrice(formData.selectedIphonePackage || 'iphone-b');
    const comboDiscount = 50000; // 5만원 동시 예약 할인
    const total = cameraInfo.price + iphoneInfo.price + iphoneOptionsAdd - iphoneDiscount - comboDiscount;

    return {
      title: `💎 본식스냅 + 아이폰스냅 동시예약 특전`,
      summaryText: `본식: ${cameraInfo.name} + 아이폰: ${iphoneInfo.name} (동시할인 -50,000원 적용)`,
      cameraPrice: cameraInfo.price,
      iphonePrice: iphoneInfo.price,
      iphoneDiscount,
      iphoneOptionsAdd,
      comboDiscount,
      total,
      totalText: cameraInfo.price > 0 ? `${total.toLocaleString()}원 (VAT 별도)` : '상담 후 안내',
    };
  };

  const estimate = calculateEstimate();

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ReservationFormData, string>> = {};

    if (!formData.groomName.trim() && !formData.brideName.trim()) {
      newErrors.groomName = '신랑 성함 또는 신부 성함을 입력해 주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '연락처를 입력해 주세요.';
    } else if (!/^[0-9-+\s]{9,15}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식을 입력해 주세요.';
    }

    if (!formData.weddingDate) {
      newErrors.weddingDate = '예식 일자를 선택해 주세요.';
    }

    if (!formData.venueName.trim()) {
      newErrors.venueName = '예식 장소(웨딩홀 이름)를 입력해 주세요.';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '개인정보 수집 및 이용 동의가 필요합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const refNum = 'YB-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const currentEstimate = calculateEstimate();

    const serviceCategoryLabel =
      serviceType === 'COMBO_BOTH'
        ? '💎 본식스냅 + 아이폰스냅 함께 예약 (5만원 동시할인)'
        : serviceType === 'IPHONE_ONLY'
        ? '📱 아이폰 스냅만 단독 예약'
        : '📸 본식 카메라 스냅만 예약';

    const fullPackageName = currentEstimate.summaryText;

    // 1. Save inquiry to internal admin inbox
    addInquiry({ ...formData, serviceType }, refNum);

    const inquiryPayload = {
      referenceNumber: refNum,
      submittedAt: now,
      serviceType,
      serviceSummary: serviceCategoryLabel,
      groomName: formData.groomName,
      brideName: formData.brideName,
      phone: formData.phone,
      email: formData.email,
      weddingDate: formData.weddingDate,
      weddingTime: formData.weddingTime,
      venueName: formData.venueName,
      selectedPackage: formData.selectedPackage,
      selectedIphonePackage: formData.selectedIphonePackage,
      packageName: fullPackageName,
      priceType: formData.priceType,
      priceText: currentEstimate.totalText,
      reviewEvent: formData.reviewEvent,
      specialRequests: formData.specialRequests,
    };

    // 2. Dispatch via server-side endpoint (sends to tlsdud3071@gmail.com and yeobaek5795@naver.com)
    try {
      await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryPayload),
      });
    } catch (err) {
      console.warn('Server inquiry dispatch notice:', err);
    }

    // 3. Fallback client-side direct email dispatch to both Gmail and Naver
    try {
      const clientEmailBody = {
        _subject: `[여백스튜디오 예약문의] ${formData.groomName || formData.brideName}님 (${formData.weddingDate} 예식 / ${serviceCategoryLabel})`,
        _replyto: formData.email || 'yeobaek5795@naver.com',
        접수번호: refNum,
        접수일시: now,
        예약구분: serviceCategoryLabel,
        신랑성함: formData.groomName || '-',
        신부성함: formData.brideName || '-',
        연락처: formData.phone,
        고객이메일: formData.email || '미입력',
        예식일자: formData.weddingDate,
        예식시간: formData.weddingTime,
        예식장소: formData.venueName,
        선택상품: fullPackageName,
        예상견적: currentEstimate.totalText,
        리뷰이벤트: formData.reviewEvent === 'JOIN' ? '참여함 (보정본 5~10장 우선 발송)' : '참여 안함',
        요청사항: formData.specialRequests || '없음',
      };

      const mailTargets = ['yeobaek5795@naver.com', 'tlsdud3071@gmail.com'];
      mailTargets.forEach((email) => {
        fetch(`https://formsubmit.co/ajax/${email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(clientEmailBody),
        }).catch(() => {});
      });
    } catch {}

    setInquiryResult({
      referenceNumber: refNum,
      submittedAt: now,
      data: { ...formData, serviceType },
    });
    setIsSubmitting(false);
  };

  const handleCloseSuccessModal = () => {
    setInquiryResult(null);
    setFormData({
      groomName: '',
      brideName: '',
      phone: '',
      email: '',
      weddingDate: '',
      weddingTime: '12:00',
      venueName: '',
      serviceType: 'CAMERA_ONLY',
      selectedPackage: 'album',
      selectedIphonePackage: 'iphone-b',
      iphoneOptions: {
        addWonpan: false,
        addBanquet: false,
        addPyebaek: false,
        discountPortrait: false,
        discountReview: false,
        discountPartner: false,
      },
      priceType: 'WESTERN',
      reviewEvent: 'JOIN',
      specialRequests: '',
      agreeToTerms: true,
    });
    setServiceType('CAMERA_ONLY');
    setErrors({});
  };

  return (
    <section id="reservation" className="py-24 sm:py-32 bg-[#F5F3EF] border-t border-black/5 relative">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-serif-en text-xs sm:text-sm tracking-[0.3em] uppercase text-[#A68F7E] font-medium block mb-3">
            RESERVATION & INQUIRY
          </span>
          <h2 className="font-serif-kr text-3xl sm:text-4xl font-light text-[#1A1A1A] tracking-tight leading-snug mb-4">
            본식 스냅 & 아이폰 스냅 예약 문의
          </h2>
          <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed">
            본식 카메라 스냅과 아이폰 스냅을 각각 단독으로 예약하시거나, 함께 예약하여 <strong className="font-medium text-[#1A1A1A]">5만원 동시할인 혜택</strong>을 받으실 수 있습니다.
          </p>
        </div>

        {/* 3-Way Service Selector (Camera Only / iPhone Only / Combo Both) */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Camera Only */}
            <button
              type="button"
              onClick={() => handleServiceTypeChange('CAMERA_ONLY')}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between ${
                serviceType === 'CAMERA_ONLY'
                  ? 'bg-white border-[#1A1A1A] shadow-md ring-2 ring-[#1A1A1A]/10'
                  : 'bg-white/70 border-black/10 hover:border-black/30 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`p-2 rounded-xl ${serviceType === 'CAMERA_ONLY' ? 'bg-[#1A1A1A] text-white' : 'bg-stone-100 text-stone-600'}`}>
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="font-serif-kr text-sm font-bold text-[#1A1A1A]">
                    본식 카메라 스냅만
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  고화질 카메라로 담는 감성 본식 스냅 단독 예약
                </p>
              </div>
              <div className="mt-3 text-[11px] font-medium text-[#A68F7E]">
                40만원 ~ 105만원 (VAT 별도)
              </div>
            </button>

            {/* 2. iPhone Only */}
            <button
              type="button"
              onClick={() => handleServiceTypeChange('IPHONE_ONLY')}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between ${
                serviceType === 'IPHONE_ONLY'
                  ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/10'
                  : 'bg-white/70 border-black/10 hover:border-rose-300 hover:bg-white'
              }`}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                NEW
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`p-2 rounded-xl ${serviceType === 'IPHONE_ONLY' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-600'}`}>
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="font-serif-kr text-sm font-bold text-[#1A1A1A]">
                    아이폰 스냅만 (단독)
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  최신 Pro 기종으로 현장의 온기를 담는 아이폰 단독 예약
                </p>
              </div>
              <div className="mt-3 text-[11px] font-medium text-rose-600">
                15만원 ~ 30만원 (최대 5만 할인)
              </div>
            </button>

            {/* 3. Combo Both */}
            <button
              type="button"
              onClick={() => handleServiceTypeChange('COMBO_BOTH')}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between ${
                serviceType === 'COMBO_BOTH'
                  ? 'bg-stone-900 border-[#A68F7E] text-white shadow-xl ring-2 ring-[#A68F7E]/30 scale-[1.02]'
                  : 'bg-stone-900/90 border-stone-800 text-white hover:bg-stone-900'
              }`}
            >
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#A68F7E] text-white text-[9px] font-bold tracking-wide">
                -50,000원 할인
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 rounded-xl bg-[#A68F7E]/30 text-[#A68F7E]">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <span className="font-serif-kr text-sm font-bold text-white">
                    본식 + 아이폰 함께
                  </span>
                </div>
                <p className="text-xs text-stone-300 font-light leading-relaxed">
                  두 상품을 동시에 예약하고 5만원 즉시 할인 혜택 받기
                </p>
              </div>
              <div className="mt-3 text-[11px] font-medium text-amber-300 flex items-center space-x-1">
                <span>동시 예약 특전 5만원 즉시 할인</span>
              </div>
            </button>
          </div>
        </div>

        {/* Inquiry Form Bento Box */}
        <div className="bento-card bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-black/5">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Couple Names Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-serif-kr font-medium text-[#1A1A1A] mb-2 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                  <span>신랑 성함</span>
                </label>
                <input
                  type="text"
                  name="groomName"
                  value={formData.groomName}
                  onChange={handleChange}
                  placeholder="신랑님 성함 입력"
                  className="w-full px-4 py-3 bg-[#F5F3EF] border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A68F7E] transition-colors"
                />
                {errors.groomName && <p className="text-xs text-red-500 font-light mt-1">{errors.groomName}</p>}
              </div>

              <div>
                <label className="block text-xs font-serif-kr font-medium text-[#1A1A1A] mb-2 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                  <span>신부 성함</span>
                </label>
                <input
                  type="text"
                  name="brideName"
                  value={formData.brideName}
                  onChange={handleChange}
                  placeholder="신부님 성함 입력"
                  className="w-full px-4 py-3 bg-[#F5F3EF] border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A68F7E] transition-colors"
                />
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-serif-kr font-medium text-[#1A1A1A] mb-2 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                  <span>연락처 (휴대전화)</span>
                  <span className="text-[#A68F7E] ml-1">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                  className="w-full px-4 py-3 bg-[#F5F3EF] border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A68F7E] transition-colors"
                />
                {errors.phone && <p className="text-xs text-red-500 font-light mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-serif-kr font-medium text-[#1A1A1A] mb-2 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                  <span>이메일 주소</span>
                  <span className="text-[11px] text-[#888888] font-light ml-2">(견적서 & 확인증 수신)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@naver.com"
                  className="w-full px-4 py-3 bg-[#F5F3EF] border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A68F7E] transition-colors"
                />
              </div>
            </div>

            {/* Wedding Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-serif-kr font-medium text-[#1A1A1A] mb-2 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                  <span>예식 일자</span>
                  <span className="text-[#A68F7E] ml-1">*</span>
                </label>
                <input
                  type="date"
                  name="weddingDate"
                  value={formData.weddingDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F5F3EF] border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A68F7E] transition-colors"
                />
                {errors.weddingDate && <p className="text-xs text-red-500 font-light mt-1">{errors.weddingDate}</p>}
              </div>

              <div>
                <label className="block text-xs font-serif-kr font-medium text-[#1A1A1A] mb-2 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                  <span>예식 시간</span>
                </label>
                <select
                  name="weddingTime"
                  value={formData.weddingTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F5F3EF] border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A68F7E] transition-colors"
                >
                  <option value="11:00">오전 11:00</option>
                  <option value="11:30">오전 11:30</option>
                  <option value="12:00">오후 12:00 (정오)</option>
                  <option value="12:30">오후 12:30</option>
                  <option value="13:00">오후 01:00</option>
                  <option value="14:00">오후 02:00</option>
                  <option value="15:00">오후 03:00</option>
                  <option value="16:00">오후 04:00</option>
                  <option value="17:00">오후 05:00</option>
                  <option value="18:00">오후 06:00 이상 (나이트 웨딩)</option>
                </select>
              </div>
            </div>

            {/* Venue Name */}
            <div>
              <label className="block text-xs font-serif-kr font-medium text-[#1A1A1A] mb-2 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                <span>예식 장소 (웨딩홀 이름)</span>
                <span className="text-[#A68F7E] ml-1">*</span>
              </label>
              <input
                type="text"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                placeholder="예: 웨스턴라이프호텔, 더라움, 아모리스 등"
                className="w-full px-4 py-3 bg-[#F5F3EF] border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A68F7E] transition-colors"
              />
              {errors.venueName && <p className="text-xs text-red-500 font-light mt-1">{errors.venueName}</p>}
            </div>

            {/* ----------------- SPECIFIC PACKAGE SELECTIONS PER SERVICE TYPE ----------------- */}

            {/* MODE 1: CAMERA SNAP ONLY */}
            {serviceType === 'CAMERA_ONLY' && (
              <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-stone-200/80 space-y-5 animate-fadeIn">
                <div className="flex items-center space-x-2 pb-3 border-b border-stone-200">
                  <Camera className="w-4 h-4 text-[#A68F7E]" />
                  <h4 className="font-serif-kr text-sm font-bold text-stone-900">
                    본식 카메라 스냅 상품 선택
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      본식 스냅 패키지
                    </label>
                    <select
                      name="selectedPackage"
                      value={formData.selectedPackage}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#A68F7E] font-medium"
                    >
                      <option value="raw">1. 원본형 (데이터 전송 전용)</option>
                      <option value="raw-retouched">2. 원본 + 보정본형</option>
                      <option value="album">3. 화보앨범형 [인기추천 - 앨범 3권 포함]</option>
                      <option value="premium">4. 프리미엄형 [2인 작가 촬영]</option>
                      <option value="type-custom">기타 커스텀 스냅 문의</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      적용 금액 구분
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, priceType: 'WESTERN' }))}
                        className={`py-3 px-3 rounded-xl border text-xs font-medium transition-all ${
                          formData.priceType === 'WESTERN'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-900 font-bold shadow-xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        🌟 웨스턴 제휴가
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, priceType: 'NORMAL' }))}
                        className={`py-3 px-3 rounded-xl border text-xs font-medium transition-all ${
                          formData.priceType === 'NORMAL'
                            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold shadow-xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        🏷️ 일반 스냅가
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200/60 text-xs flex justify-between items-center text-stone-700">
                  <span className="text-stone-500">선택 패키지 금액 (VAT 별도)</span>
                  <span className="font-bold text-stone-900 font-serif-kr text-sm">
                    {estimate.totalText}
                  </span>
                </div>
              </div>
            )}

            {/* MODE 2: IPHONE SNAP ONLY */}
            {serviceType === 'IPHONE_ONLY' && (
              <div className="bg-rose-50/40 p-6 rounded-2xl border border-rose-200/70 space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-rose-200/60">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-rose-600" />
                    <h4 className="font-serif-kr text-sm font-bold text-stone-900">
                      아이폰 스냅 (iPhone Snap) 단독 상품 선택
                    </h4>
                  </div>
                  <span className="text-[11px] text-rose-600 font-medium font-serif-en">
                    @yeobaek_iphone_iksan
                  </span>
                </div>

                {/* iPhone Package Radios */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    onClick={() => setFormData((prev) => ({ ...prev, selectedIphonePackage: 'iphone-a', selectedPackage: 'iphone-a' }))}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      (formData.selectedIphonePackage || formData.selectedPackage) === 'iphone-a'
                        ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/10'
                        : 'bg-white/80 border-stone-200 hover:border-rose-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif-en text-sm font-bold text-stone-900">
                          A. SIGNATURE (시그니처)
                        </span>
                        <span className="font-bold text-stone-900 text-sm">250,000원</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        신부대기실·본식·플라워샤워·원판 (예식 60분 전)
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        원본 사진/영상 전체 제공 + 작가별 보정본 5장
                      </p>
                    </div>
                    <div className="mt-3 text-[11px] text-rose-600 font-medium">
                      (최대 할인 적용시 15만원)
                    </div>
                  </label>

                  <label
                    onClick={() => setFormData((prev) => ({ ...prev, selectedIphonePackage: 'iphone-b', selectedPackage: 'iphone-b' }))}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                      (formData.selectedIphonePackage || formData.selectedPackage) === 'iphone-b'
                        ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/10'
                        : 'bg-white/80 border-stone-200 hover:border-rose-300'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-3 px-2 py-0.2 bg-[#A68F7E] text-white text-[9px] font-bold rounded-full">
                      추천
                    </span>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif-en text-sm font-bold text-stone-900">
                          B. PREMIUM (프리미엄)
                        </span>
                        <span className="font-bold text-stone-900 text-sm">300,000원</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        신부대기실·본식·플라워샤워·원판 (예식 90분 전)
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        원본 사진/영상 전체 제공 + 작가별 보정본 10장
                      </p>
                    </div>
                    <div className="mt-3 text-[11px] text-rose-600 font-medium">
                      (최대 할인 적용시 20만원)
                    </div>
                  </label>
                </div>

                {/* iPhone Discounts Checkboxes */}
                <div>
                  <span className="block text-xs font-bold text-stone-800 mb-2 flex items-center">
                    <Gift className="w-3.5 h-3.5 mr-1 text-rose-500" />
                    <span>할인 이벤트 선택 (중복 적용 가능, 최대 5만원 할인)</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <label className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                      formData.iphoneOptions?.discountPortrait ? 'bg-rose-500/10 border-rose-400 text-rose-950 font-medium' : 'bg-white border-stone-200 text-stone-600'
                    }`}>
                      <span>초상권 동의 할인</span>
                      <strong className="text-rose-600 font-bold">-2만원</strong>
                    </label>

                    <label className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                      formData.iphoneOptions?.discountReview ? 'bg-rose-500/10 border-rose-400 text-rose-950 font-medium' : 'bg-white border-stone-200 text-stone-600'
                    }`}>
                      <span>후기 이벤트 할인</span>
                      <strong className="text-rose-600 font-bold">-2만원</strong>
                    </label>

                    <label className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                      formData.iphoneOptions?.discountPartner ? 'bg-rose-500/10 border-rose-400 text-rose-950 font-medium' : 'bg-white border-stone-200 text-stone-600'
                    }`}>
                      <span>짝꿍 할인</span>
                      <strong className="text-rose-600 font-bold">-1만원</strong>
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 mt-2 text-[11px] text-stone-500">
                    <button
                      type="button"
                      onClick={() => handleIphoneOptionToggle('discountPortrait')}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] ${formData.iphoneOptions?.discountPortrait ? 'bg-rose-500 text-white border-rose-500' : 'bg-stone-100 text-stone-600'}`}
                    >
                      초상권 동의 토글
                    </button>
                    <button
                      type="button"
                      onClick={() => handleIphoneOptionToggle('discountReview')}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] ${formData.iphoneOptions?.discountReview ? 'bg-rose-500 text-white border-rose-500' : 'bg-stone-100 text-stone-600'}`}
                    >
                      후기 이벤트 토글
                    </button>
                    <button
                      type="button"
                      onClick={() => handleIphoneOptionToggle('discountPartner')}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] ${formData.iphoneOptions?.discountPartner ? 'bg-rose-500 text-white border-rose-500' : 'bg-stone-100 text-stone-600'}`}
                    >
                      짝꿍 할인 토글
                    </button>
                  </div>
                </div>

                {/* iPhone Add-on Options */}
                <div>
                  <span className="block text-xs font-bold text-stone-800 mb-2 flex items-center">
                    <Plus className="w-3.5 h-3.5 mr-1 text-[#A68F7E]" />
                    <span>추가 옵션 항목</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleIphoneOptionToggle('addWonpan')}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                        formData.iphoneOptions?.addWonpan ? 'bg-[#A68F7E]/15 border-[#A68F7E] text-stone-900 font-semibold' : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      <span>원판 촬영 추가</span>
                      <strong>+3만원</strong>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleIphoneOptionToggle('addBanquet')}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                        formData.iphoneOptions?.addBanquet ? 'bg-[#A68F7E]/15 border-[#A68F7E] text-stone-900 font-semibold' : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      <span>연회장 촬영 추가</span>
                      <strong>+3만원</strong>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleIphoneOptionToggle('addPyebaek')}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                        formData.iphoneOptions?.addPyebaek ? 'bg-[#A68F7E]/15 border-[#A68F7E] text-stone-900 font-semibold' : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      <span>폐백 촬영 추가</span>
                      <strong>+3만원</strong>
                    </button>
                  </div>
                </div>

                {/* Estimate Preview */}
                <div className="p-4 bg-white rounded-xl border border-rose-200 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-stone-600">
                    아이폰 스냅 예상 견적 (기본가 - 할인 + 옵션, VAT 별도)
                  </span>
                  <span className="font-bold text-rose-600 font-serif-kr text-base">
                    {estimate.totalText}
                  </span>
                </div>
              </div>
            )}

            {/* MODE 3: COMBO BOTH (Main Snap + iPhone Snap together) */}
            {serviceType === 'COMBO_BOTH' && (
              <div className="bg-[#1A1A1A] text-white p-6 sm:p-8 rounded-3xl border border-[#A68F7E]/50 space-y-6 shadow-xl animate-fadeIn">
                {/* Special Combo Badge Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#A68F7E] text-white flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-serif-kr text-base font-bold text-white">
                          본식스냅 + 아이폰스냅 동시예약 특전
                        </h4>
                        <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                          -50,000원 할인
                        </span>
                      </div>
                      <p className="text-xs text-white/70 font-light mt-0.5">
                        본식 카메라 스냅과 아이폰 감성 스냅을 함께 예약하여 5만원 추가 할인 혜택을 받으세요.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 1: Camera Snap Selection */}
                <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="font-serif-kr text-xs font-bold text-amber-300 block flex items-center">
                    <Camera className="w-3.5 h-3.5 mr-1.5" />
                    <span>STEP 1. 본식 카메라 스냅 상품 선택</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      name="selectedPackage"
                      value={formData.selectedPackage}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#2A2A2A] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#A68F7E]"
                    >
                      <option value="raw">1. 원본형 (데이터)</option>
                      <option value="raw-retouched">2. 원본 + 보정본형</option>
                      <option value="album">3. 화보앨범형 [인기추천]</option>
                      <option value="premium">4. 프리미엄형 [2인 작가]</option>
                      <option value="type-custom">기타 커스텀 스냅</option>
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, priceType: 'WESTERN' }))}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                          formData.priceType === 'WESTERN'
                            ? 'bg-[#A68F7E] text-white border-[#A68F7E] font-bold'
                            : 'bg-[#2A2A2A] border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        🌟 웨스턴 제휴가
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, priceType: 'NORMAL' }))}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                          formData.priceType === 'NORMAL'
                            ? 'bg-white text-stone-900 border-white font-bold'
                            : 'bg-[#2A2A2A] border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        🏷️ 일반 스냅가
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 2: iPhone Snap Selection */}
                <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="font-serif-kr text-xs font-bold text-rose-300 block flex items-center">
                    <Smartphone className="w-3.5 h-3.5 mr-1.5" />
                    <span>STEP 2. 함께할 아이폰 스냅 상품 선택</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setFormData((prev) => ({ ...prev, selectedIphonePackage: 'iphone-a' }))}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                        formData.selectedIphonePackage === 'iphone-a'
                          ? 'bg-rose-500/20 border-rose-400 text-white font-medium shadow-xs'
                          : 'bg-[#2A2A2A] border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">A. 시그니처 (예식 60분 전)</span>
                        <span className="text-[10px] text-white/60">보정본 5장 + 전체 원본 당일 전달</span>
                      </div>
                      <strong className="text-xs font-serif-kr">250,000원</strong>
                    </label>

                    <label
                      onClick={() => setFormData((prev) => ({ ...prev, selectedIphonePackage: 'iphone-b' }))}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                        formData.selectedIphonePackage === 'iphone-b'
                          ? 'bg-rose-500/20 border-rose-400 text-white font-medium shadow-xs'
                          : 'bg-[#2A2A2A] border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold block">B. 프리미엄 (예식 90분 전)</span>
                          <span className="px-1.5 py-0.2 bg-[#A68F7E] text-[9px] rounded-full">추천</span>
                        </div>
                        <span className="text-[10px] text-white/60">보정본 10장 + 전체 원본 당일 전달</span>
                      </div>
                      <strong className="text-xs font-serif-kr">300,000원</strong>
                    </label>
                  </div>
                </div>

                {/* Step 3: Total Calculation with -50,000 combo discount */}
                <div className="bg-[#2A2A2A] p-4 sm:p-5 rounded-2xl border border-white/15 space-y-2">
                  <div className="flex justify-between items-center text-xs text-white/70">
                    <span>본식스냅 금액:</span>
                    <span>{estimate.cameraPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-white/70">
                    <span>아이폰스냅 금액:</span>
                    <span>{estimate.iphonePrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-rose-400 font-bold border-t border-white/10 pt-2">
                    <span className="flex items-center space-x-1">
                      <Percent className="w-3.5 h-3.5" />
                      <span>동시 예약 특별 할인:</span>
                    </span>
                    <span>- 50,000원</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/15 text-sm sm:text-base font-bold">
                    <span className="text-white">최종 예상 견적 (VAT 별도)</span>
                    <span className="text-amber-300 font-serif-kr text-lg sm:text-xl">
                      {estimate.totalText}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Review Event (For Camera Snap or General) */}
            <div className="bg-[#FAF9F6] p-5 rounded-xl border border-black/5 space-y-3">
              <label className="block text-xs font-serif-kr font-semibold text-[#1A1A1A] flex items-center">
                <Gift className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                <span>스튜디오 후기 이벤트 참여 여부</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setFormData((prev) => ({ ...prev, reviewEvent: 'JOIN' }))}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                    formData.reviewEvent === 'JOIN'
                      ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950 shadow-xs'
                      : 'bg-white border-black/10 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="reviewEvent"
                    value="JOIN"
                    checked={formData.reviewEvent === 'JOIN'}
                    onChange={() => {}}
                    className="mt-0.5 accent-emerald-600"
                  />
                  <div>
                    <div className="text-xs font-bold flex items-center space-x-1">
                      <span>참여함 (보정본 5~10매 우선 발송)</span>
                      <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-serif-en uppercase">혜택</span>
                    </div>
                    <p className="text-[11px] opacity-80 mt-1 leading-snug">
                      예식 후 5일 이내 베스트컷 선공개 및 블로그/인스타 리뷰 작성시 혜택이 적용됩니다.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setFormData((prev) => ({ ...prev, reviewEvent: 'NONE' }))}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                    formData.reviewEvent === 'NONE'
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                      : 'bg-white border-black/10 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="reviewEvent"
                    value="NONE"
                    checked={formData.reviewEvent === 'NONE'}
                    onChange={() => {}}
                    className="mt-0.5 accent-[#A68F7E]"
                  />
                  <div>
                    <div className="text-xs font-bold">참여 안 함</div>
                    <p className="text-[11px] opacity-80 mt-1 leading-snug">
                      별도 후기 작성 없이 표준 일정에 맞춰 작업물이 전달됩니다.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Special Requests / Additional Inquiries */}
            <div>
              <label className="block text-xs font-serif-kr font-medium text-[#1A1A1A] mb-2 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                <span>추가 문의사항 및 요청사항</span>
                <span className="text-[11px] text-[#888888] font-light ml-2">(선택 입력)</span>
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={3}
                placeholder="어두운 홀 연출, 메이크업 숍 추가 여부, 선호하는 색감이나 특별히 원하시는 스냅 분위기를 자유롭게 작성해 주세요."
                className="w-full px-4 py-3 bg-[#F5F3EF] border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A68F7E] transition-colors resize-none"
              />
            </div>

            {/* Privacy Agreement Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 accent-[#A68F7E]"
              />
              <label htmlFor="agreeToTerms" className="text-xs text-[#666666] font-light cursor-pointer">
                [필수] 예약 상담 진행 및 일정 확인, 이메일 확인증 전송을 위한 개인정보 수집 및 이용에 동의합니다.
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-xs text-red-500 font-light">{errors.agreeToTerms}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#1A1A1A] hover:bg-[#A68F7E] text-white rounded-xl text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center space-x-3 shadow-md active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#A68F7E]" />
                  <span>예약 문의 안전하게 전달 중...</span>
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#A68F7E]" />
                  <span>
                    {serviceType === 'COMBO_BOTH'
                      ? '본식스냅 + 아이폰스냅 동시예약 문의 제출'
                      : serviceType === 'IPHONE_ONLY'
                      ? '아이폰 스냅 단독 예약 문의 제출'
                      : '본식 카메라 스냅 예약 문의 제출'}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Booking Confirmation Popup Modal - Clean & Simple for Wedding Clients */}
      {inquiryResult && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn overflow-y-auto">
          <div className="max-w-lg w-full bg-white rounded-2xl border border-black/10 p-6 sm:p-8 text-[#1A1A1A] shadow-2xl relative my-auto animate-scaleUp">
            {/* Close Button */}
            <button
              onClick={handleCloseSuccessModal}
              className="absolute top-4 right-4 p-2 rounded-full text-[#888888] hover:text-[#1A1A1A] hover:bg-[#F5F3EF] transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Icon & Title */}
            <div className="text-center mb-6 pt-1">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              <p className="font-serif-en text-[11px] tracking-[0.25em] text-[#A68F7E] uppercase mb-1 font-semibold">
                INQUIRY RECEIVED
              </p>
              <h3 className="font-serif-kr text-2xl sm:text-3xl font-light text-[#1A1A1A] mb-2">
                예약 문의가 정상 접수되었습니다
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] font-light leading-relaxed max-w-sm mx-auto">
                대표 작가에게 문의 내용이 전달되었습니다.<br />
                남겨주신 연락처로 <strong className="text-[#1A1A1A] font-medium">24시간 이내</strong>에 확인 안내를 드리겠습니다.
              </p>
            </div>

            {/* Clean Receipt Summary Card */}
            <div className="bg-[#FAF9F6] rounded-xl p-4 sm:p-5 border border-black/5 text-xs text-[#444444] space-y-2.5 mb-6">
              <div className="flex items-center justify-between pb-2 border-b border-black/5">
                <span className="text-[#888888]">접수 번호</span>
                <span className="font-serif-en font-bold text-[#A68F7E] tracking-wider text-xs">
                  {inquiryResult.referenceNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[#888888] block text-[11px]">신랑 / 신부</span>
                  <span className="font-medium text-[#1A1A1A]">
                    {inquiryResult.data.groomName ? `신랑 ${inquiryResult.data.groomName}` : ''}
                    {inquiryResult.data.groomName && inquiryResult.data.brideName ? ' / ' : ''}
                    {inquiryResult.data.brideName ? `신부 ${inquiryResult.data.brideName}` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-[#888888] block text-[11px]">연락처</span>
                  <span className="font-medium text-[#1A1A1A]">{inquiryResult.data.phone}</span>
                </div>
                <div>
                  <span className="text-[#888888] block text-[11px]">예식 일시</span>
                  <span className="font-medium text-[#1A1A1A]">
                    {inquiryResult.data.weddingDate} ({inquiryResult.data.weddingTime})
                  </span>
                </div>
                <div>
                  <span className="text-[#888888] block text-[11px]">예식 장소</span>
                  <span className="font-medium text-[#1A1A1A] truncate block">{inquiryResult.data.venueName}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-black/5">
                <span className="text-[#888888] block text-[11px]">예약 구분</span>
                <span className="font-bold text-[#1A1A1A]">
                  {inquiryResult.data.serviceType === 'COMBO_BOTH'
                    ? '💎 본식스냅 + 아이폰스냅 동시예약 (5만원 할인 적용)'
                    : inquiryResult.data.serviceType === 'IPHONE_ONLY'
                    ? '📱 아이폰 스냅만 단독 예약'
                    : '📸 본식 카메라 스냅만 예약'}
                </span>
              </div>

              <div className="pt-1">
                <span className="text-[#888888] block text-[11px]">선택 상품 및 예상 견적</span>
                <span className="font-medium text-[#1A1A1A] block">
                  {estimate.title}
                </span>
                <span className="text-[#A68F7E] font-bold text-xs mt-0.5 block">
                  예상 금액: {estimate.totalText}
                </span>
              </div>

              {inquiryResult.data.reviewEvent === 'JOIN' && (
                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px]">
                  <span className="text-[#888888]">리뷰 이벤트</span>
                  <span className="font-medium text-emerald-700">🎁 참여 (보정본 5~10장 우선 발송)</span>
                </div>
              )}

              {inquiryResult.data.specialRequests && (
                <div className="pt-2 border-t border-black/5">
                  <span className="text-[#888888] block text-[11px]">요청사항</span>
                  <span className="text-[#333333] font-light">{inquiryResult.data.specialRequests}</span>
                </div>
              )}
            </div>

            {/* Action Buttons: Kakao 1:1 Channel + Confirm Button */}
            <div className="space-y-2.5">
              <a
                href={studioInfo.kakaoLink || "https://pf.kakao.com/_AxdWxgn"}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-xs"
              >
                <KakaoIcon className="w-4 h-4 fill-current" />
                <span>카카오톡 채널 1:1 상담연결</span>
              </a>

              <button
                onClick={handleCloseSuccessModal}
                className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-xl text-xs font-medium tracking-[0.15em] uppercase transition-colors shadow-xs"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
