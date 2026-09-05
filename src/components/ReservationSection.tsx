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
} from 'lucide-react';
import { ReservationFormData, InquiryResult } from '../types';
import { useSiteContent } from '../context/ContentContext';
import { KakaoIcon } from './KakaoIcon';

interface ReservationSectionProps {
  selectedPackageId?: string;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ selectedPackageId }) => {
  const { content, addInquiry, isAdminMode, toggleAdminMode } = useSiteContent();
  const { studioInfo } = content;
  const [formData, setFormData] = useState<ReservationFormData>({
    groomName: '',
    brideName: '',
    phone: '',
    email: '',
    weddingDate: '',
    weddingTime: '12:00',
    venueName: '',
    selectedPackage: selectedPackageId || 'album',
    priceType: 'WESTERN',
    reviewEvent: 'JOIN',
    specialRequests: '',
    agreeToTerms: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ReservationFormData, string>>>({});
  const [inquiryResult, setInquiryResult] = useState<InquiryResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedPackageId) {
      setFormData((prev) => ({ ...prev, selectedPackage: selectedPackageId }));
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

    const pkgDetails = getPackageDetails(formData.selectedPackage, formData.priceType);

    // 1. Save inquiry to internal admin inbox
    addInquiry(formData, refNum);

    const inquiryPayload = {
      referenceNumber: refNum,
      submittedAt: now,
      groomName: formData.groomName,
      brideName: formData.brideName,
      phone: formData.phone,
      email: formData.email,
      weddingDate: formData.weddingDate,
      weddingTime: formData.weddingTime,
      venueName: formData.venueName,
      selectedPackage: formData.selectedPackage,
      packageName: pkgDetails.name,
      priceType: formData.priceType,
      priceText: pkgDetails.priceText,
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

    // 3. Fallback client-side direct email dispatch to tlsdud3071@gmail.com
    try {
      fetch('https://formsubmit.co/ajax/tlsdud3071@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `[여백스튜디오 예약문의] ${formData.groomName || formData.brideName}님 (${formData.weddingDate} 예식)`,
          _replyto: formData.email || 'tlsdud3071@gmail.com',
          접수번호: refNum,
          접수일시: now,
          신랑성함: formData.groomName || '-',
          신부성함: formData.brideName || '-',
          연락처: formData.phone,
          고객이메일: formData.email || '미입력',
          예식일자: formData.weddingDate,
          예식시간: formData.weddingTime,
          예식장소: formData.venueName,
          선택상품: `${pkgDetails.name} [${pkgDetails.priceText}]`,
          리뷰이벤트: formData.reviewEvent === 'JOIN' ? '참여함 (보정본 5~10장 우선 발송)' : '참여 안함',
          요청사항: formData.specialRequests || '없음',
        }),
      }).catch(() => {});
    } catch {}

    setInquiryResult({
      referenceNumber: refNum,
      submittedAt: now,
      data: { ...formData },
    });
    setIsSubmitting(false);
  };

  const getPackageDetails = (pkgId: string, priceType: 'NORMAL' | 'WESTERN') => {
    switch (pkgId) {
      case 'raw':
        return {
          name: '원본형',
          priceText: priceType === 'WESTERN' ? '40만원 (웨스턴 혜택가 적용)' : '50만원 (일반가 적용)',
        };
      case 'raw-retouched':
        return {
          name: '원본 + 보정본형',
          priceText: priceType === 'WESTERN' ? '50만원 (웨스턴 혜택가 적용)' : '60만원 (일반가 적용)',
        };
      case 'album':
        return {
          name: '화보앨범형 [인기추천]',
          priceText: priceType === 'WESTERN' ? '70만원 (웨스턴 혜택가 적용)' : '80만원 (일반가 적용)',
        };
      case 'premium':
        return {
          name: '프리미엄형 [2인 작가]',
          priceText: priceType === 'WESTERN' ? '95만원 (웨스턴 혜택가 적용)' : '105만원 (일반가 적용)',
        };
      default:
        return {
          name: '기타 커스텀 스냅 문의',
          priceText: '상담 후 견적 안내',
        };
    }
  };

  const currentPkgInfo = getPackageDetails(formData.selectedPackage, formData.priceType);

  return (
    <section id="reservation" className="py-24 sm:py-32 bg-[#F5F3EF] border-t border-black/5 relative">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-serif-en text-xs sm:text-sm tracking-[0.3em] uppercase text-[#A68F7E] font-medium block mb-3">
            RESERVATION & INQUIRY
          </span>
          <h2 className="font-serif-kr text-3xl sm:text-4xl font-light text-[#1A1A1A] tracking-tight leading-snug mb-6">
            본식 스냅 예약 & 견적 문의
          </h2>
          <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed">
            원하시는 예식 일정과 장소를 남겨주시면, 담당 작가가 일정 조회 후 대표 이메일(<strong className="font-medium text-[#1A1A1A]">{studioInfo.email}</strong>) 및 카카오톡으로 실시간 확정 안내를 드립니다.
          </p>
        </div>

        {/* Inquiry Form Bento Box */}
        <div className="bento-card bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-black/5">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Couple Names Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-serif-kr font-medium text-[#1A1A1A] mb-2 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                  <span>신랑 성함</span>
                  <span className="text-[#A68F7E] ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="groomName"
                  value={formData.groomName}
                  onChange={handleChange}
                  placeholder="예: 홍길동"
                  className="w-full px-4 py-3 bg-[#F5F3EF] border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A68F7E] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-serif-kr font-medium text-[#1A1A1A] mb-2 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                  <span>신부 성함</span>
                  <span className="text-[#A68F7E] ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="brideName"
                  value={formData.brideName}
                  onChange={handleChange}
                  placeholder="예: 성춘향"
                  className="w-full px-4 py-3 bg-[#F5F3EF] border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A68F7E] transition-colors"
                />
              </div>
            </div>
            {errors.groomName && <p className="text-xs text-red-500 font-light">{errors.groomName}</p>}

            {/* Contact & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-serif-kr font-medium text-[#1A1A1A] mb-2 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                  <span>연락처</span>
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
                  <span>이메일 주소 (확인증 수신용)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yeobaek@example.com"
                  className="w-full px-4 py-3 bg-[#F5F3EF] border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A68F7E] transition-colors"
                />
              </div>
            </div>

            {/* Wedding Date & Time */}
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

            {/* Venue & Package Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  placeholder="예: 웨스턴컨벤션, 더라움, 아모리스 등"
                  className="w-full px-4 py-3 bg-[#F5F3EF] border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A68F7E] transition-colors"
                />
                {errors.venueName && <p className="text-xs text-red-500 font-light mt-1">{errors.venueName}</p>}
              </div>

              <div>
                <label className="block text-xs font-serif-kr font-medium text-[#1A1A1A] mb-2 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                  <span>선택 상품 패키지</span>
                </label>
                <select
                  name="selectedPackage"
                  value={formData.selectedPackage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F5F3EF] border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#A68F7E] transition-colors font-medium"
                >
                  <option value="raw">1. 원본형 (데이터 전송 전용)</option>
                  <option value="raw-retouched">2. 원본 + 보정본형</option>
                  <option value="album">3. 화보앨범형 [인기추천 - 앨범 3권 포함]</option>
                  <option value="premium">4. 프리미엄형 [2인 작가 촬영]</option>
                  <option value="type-custom">5. 기타 맞춤 스냅 문의 (야외 스냅, 메이크업 추가 등)</option>
                </select>
              </div>
            </div>

            {/* Price Type Selection (General vs Western Discount) */}
            <div className="bg-[#FAFAFA] p-5 rounded-xl border border-black/5 space-y-3">
              <label className="block text-xs font-serif-kr font-semibold text-[#1A1A1A] flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                <span>적용 가격 금액 선택</span>
                <span className="text-xs font-normal text-[#888888] ml-2">(일반가 / 웨스턴 제휴 혜택가 구분)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setFormData((prev) => ({ ...prev, priceType: 'WESTERN' }))}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                    formData.priceType === 'WESTERN'
                      ? 'bg-amber-50/70 border-amber-400 text-amber-950 shadow-xs'
                      : 'bg-white border-black/10 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="priceType"
                    value="WESTERN"
                    checked={formData.priceType === 'WESTERN'}
                    onChange={() => {}}
                    className="mt-0.5 accent-amber-600"
                  />
                  <div>
                    <div className="text-xs font-bold flex items-center space-x-1">
                      <span>🌟 웨스턴 제휴 혜택가 적용</span>
                      <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-serif-en uppercase">SPECIAL</span>
                    </div>
                    <p className="text-[11px] opacity-80 mt-1 leading-snug">
                      웨스턴컨벤션/제휴 웨딩홀 예식 고객님께 제공되는 특별 할인 금액입니다.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setFormData((prev) => ({ ...prev, priceType: 'NORMAL' }))}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                    formData.priceType === 'NORMAL'
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                      : 'bg-white border-black/10 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="priceType"
                    value="NORMAL"
                    checked={formData.priceType === 'NORMAL'}
                    onChange={() => {}}
                    className="mt-0.5 accent-[#A68F7E]"
                  />
                  <div>
                    <div className="text-xs font-bold">🏷️ 일반가 적용</div>
                    <p className="text-[11px] opacity-80 mt-1 leading-snug">
                      일반 웨딩홀 및 야외/출장 예식 기준 표준 안내 금액입니다.
                    </p>
                  </div>
                </label>
              </div>

              {/* Current Calculated Price Preview */}
              <div className="p-3 bg-white rounded-lg border border-black/5 text-xs flex justify-between items-center text-[#333333]">
                <span className="text-[#666666]">선택 상품 예상 금액:</span>
                <span className="font-serif-kr font-bold text-sm text-rose-600">
                  {currentPkgInfo.priceText}
                </span>
              </div>
            </div>

            {/* Review Event Participation */}
            <div className="bg-[#FAF9F5] p-5 rounded-xl border border-[#A68F7E]/20 space-y-3">
              <label className="block text-xs font-serif-kr font-semibold text-[#1A1A1A] flex items-center">
                <Gift className="w-4 h-4 mr-1.5 text-[#A68F7E]" />
                <span>리뷰 이벤트 참여 여부 선택</span>
                <span className="bg-[#A68F7E] text-white text-[10px] px-2 py-0.5 rounded-full ml-2 font-light">
                  혜택: 보정본 5~10장 우선 발송
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setFormData((prev) => ({ ...prev, reviewEvent: 'JOIN' }))}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                    formData.reviewEvent === 'JOIN'
                      ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 shadow-xs'
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
                    <div className="text-xs font-bold text-emerald-900 flex items-center space-x-1">
                      <span>🎁 리뷰 이벤트 참여함</span>
                    </div>
                    <p className="text-[11px] text-emerald-800/80 mt-1 leading-snug">
                      예식 후 블로그/인스타그램/카페 리뷰 작성 조건으로 <strong>수정본 5~10장을 선발송</strong>해 드립니다.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setFormData((prev) => ({ ...prev, reviewEvent: 'NONE' }))}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                    formData.reviewEvent === 'NONE'
                      ? 'bg-gray-100 border-gray-400 text-gray-900 shadow-xs'
                      : 'bg-white border-black/10 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="reviewEvent"
                    value="NONE"
                    checked={formData.reviewEvent === 'NONE'}
                    onChange={() => {}}
                    className="mt-0.5 accent-gray-600"
                  />
                  <div>
                    <div className="text-xs font-bold">참여 안함</div>
                    <p className="text-[11px] opacity-70 mt-1 leading-snug">
                      리뷰 이벤트 혜택 없이 기본 일정대로 보정작업이 진행됩니다.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-serif-kr font-medium text-[#1A1A1A] mb-2 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-[#A68F7E]" />
                <span>기타 요청사항 및 문의 내용</span>
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={4}
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
                  <span>예약 문의 제출하기</span>
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
              onClick={() => setInquiryResult(null)}
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
                대표 작가에게 문의 내용이 안전하게 전달되었습니다.<br />
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
                <span className="text-[#888888] block text-[11px]">선택 상품</span>
                <span className="font-medium text-[#1A1A1A]">
                  {getPackageDetails(inquiryResult.data.selectedPackage, inquiryResult.data.priceType).name}
                  <span className="text-[#A68F7E] ml-1 font-normal">
                    ({getPackageDetails(inquiryResult.data.selectedPackage, inquiryResult.data.priceType).priceText})
                  </span>
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

            {/* Action Buttons: Kakao 1:1 + Confirm Close */}
            <div className="space-y-2.5">
              <a
                href={studioInfo.kakaoLink || "https://pf.kakao.com/_AxdWxgn"}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-xs"
              >
                <KakaoIcon className="w-4 h-4 fill-current" />
                <span>카카오톡으로 빠른 상담하기</span>
              </a>

              <button
                onClick={() => setInquiryResult(null)}
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


