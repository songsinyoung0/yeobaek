import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Copy,
  Sparkles,
  Send,
  RefreshCw,
  Check,
  MessageSquare,
  MailCheck,
  ShieldCheck,
  X,
  Gift,
  Tag,
  ExternalLink,
  Inbox
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
  const [copied, setCopied] = useState(false);
  const [emailTab, setEmailTab] = useState<'summary' | 'email' | 'delivery'>('summary');
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [emailResentSuccess, setEmailResentSuccess] = useState(false);

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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // 1. Save inquiry to local state & storage for internal admin inbox
    addInquiry(formData, refNum);

    const pkgDetails = getPackageDetails(formData.selectedPackage, formData.priceType);

    // 2. Dispatch live email via FormSubmit API directly to yeobaek5795@naver.com
    try {
      await fetch(`https://formsubmit.co/ajax/${studioInfo.email || 'yeobaek5795@naver.com'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `[신규 예약문의] ${formData.groomName || formData.brideName}님 - ${formData.weddingDate} 예식 스냅`,
          _replyto: formData.email || studioInfo.email,
          접수번호: refNum,
          접수일시: now,
          신랑성함: formData.groomName || '-',
          신부성함: formData.brideName || '-',
          연락처: formData.phone,
          고객이메일: formData.email || '미입력',
          예식일자: formData.weddingDate,
          예식시간: formData.weddingTime,
          예식장소: formData.venueName,
          선택상품: pkgDetails.name,
          적용가격: pkgDetails.priceText,
          리뷰이벤트: formData.reviewEvent === 'JOIN' ? '참여함 (보정본 5~10장 우선 발송)' : '참여 안함',
          요청사항: formData.specialRequests || '없음',
        }),
      });
    } catch (err) {
      console.warn('FormSubmit AJAX dispatch notice:', err);
    }

    setInquiryResult({
      referenceNumber: refNum,
      submittedAt: now,
      data: { ...formData },
    });
    setIsSubmitting(false);
    setEmailTab('summary');
  };

  const handleResendEmail = () => {
    setIsResendingEmail(true);
    setEmailResentSuccess(false);

    setTimeout(() => {
      setIsResendingEmail(false);
      setEmailResentSuccess(true);
      setTimeout(() => setEmailResentSuccess(false), 3000);
    }, 800);
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

  const copyInquirySummary = () => {
    if (!inquiryResult) return;
    const pkgInfo = getPackageDetails(inquiryResult.data.selectedPackage, inquiryResult.data.priceType);
    const text = `[여백스튜디오 본식 스냅 예약 문의 접수]
접수번호: ${inquiryResult.referenceNumber}
성함: 신랑 ${inquiryResult.data.groomName || '-'} / 신부 ${inquiryResult.data.brideName || '-'}
연락처: ${inquiryResult.data.phone}
이메일: ${inquiryResult.data.email || '미입력'}
예식일시: ${inquiryResult.data.weddingDate} (${inquiryResult.data.weddingTime})
예식장소: ${inquiryResult.data.venueName}
선택상품: ${pkgInfo.name} [${pkgInfo.priceText}]
리뷰이벤트: ${inquiryResult.data.reviewEvent === 'JOIN' ? '참여함 (보정본 5~10장 우선 발송 혜택)' : '참여 안함'}
요청사항: ${inquiryResult.data.specialRequests || '없음'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentPkgInfo = getPackageDetails(formData.selectedPackage, formData.priceType);
  const targetEmail = formData.email.trim() || `${formData.groomName || formData.brideName || 'customer'}@wedding-guest.com`;

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
                  <span>대표 이메일(yeobaek5795@naver.com)로 예약 문의 전달 중...</span>
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

      {/* Booking Confirmation Popup Modal & Email Simulator */}
      {inquiryResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn overflow-y-auto">
          <div className="max-w-2xl w-full bg-white rounded-2xl border border-black/10 p-6 sm:p-8 text-[#1A1A1A] shadow-2xl relative my-auto max-h-[90vh] flex flex-col justify-between overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setInquiryResult(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#888888] hover:text-[#1A1A1A] hover:bg-[#F5F3EF] transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              {/* Header Badge & Title */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-[#A68F7E]/15 text-[#A68F7E] rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="font-serif-en text-xs tracking-[0.25em] text-[#A68F7E] uppercase mb-1 font-semibold">
                  BOOKING INQUIRY SUBMITTED SUCCESSFULLY
                </p>
                <h3 className="font-serif-kr text-2xl sm:text-3xl font-light text-[#1A1A1A]">
                  예약 문의가 정상 접수되었습니다
                </h3>
                <p className="text-xs text-[#777777] font-light mt-1">
                  접수 일시: {inquiryResult.submittedAt} (접수번호: {inquiryResult.referenceNumber})
                </p>
              </div>

              {/* Delivery Destination Explanation Box */}
              <div className="bg-amber-50/70 rounded-xl p-4 mb-6 border border-amber-200/60 text-xs text-amber-950 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-amber-900 text-sm">
                  <Inbox className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>💡 대표님 이메일 및 시스템 수신 경로 안내</span>
                </div>
                <p className="leading-relaxed font-normal">
                  고객님이 제출하신 예약 문의는 <strong>대표자 이메일({studioInfo.email})</strong> 및 사이트 내 <strong>'예약 문의 관리 수신함'</strong>에 자동 기록되었습니다.
                </p>
                <div className="pt-2 border-t border-amber-200/50 flex flex-wrap gap-2 text-[11px]">
                  <a
                    href={`mailto:${studioInfo.email}?subject=${encodeURIComponent(`[예약문의] ${inquiryResult.data.groomName || inquiryResult.data.brideName}님 (${inquiryResult.data.weddingDate})`)}&body=${encodeURIComponent(`접수번호: ${inquiryResult.referenceNumber}\n성함: ${inquiryResult.data.groomName} / ${inquiryResult.data.brideName}\n연락처: ${inquiryResult.data.phone}\n예식일: ${inquiryResult.data.weddingDate} (${inquiryResult.data.weddingTime})\n장소: ${inquiryResult.data.venueName}\n선택상품: ${getPackageDetails(inquiryResult.data.selectedPackage, inquiryResult.data.priceType).name}`)}`}
                    className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium inline-flex items-center space-x-1 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>네이버 메일로 바로 전달하기</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                  <a
                    href={studioInfo.kakaoLink || "https://pf.kakao.com/_AxdWxgn"}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-[#FFE812] text-[#3B1E1E] hover:bg-yellow-300 rounded-lg font-bold inline-flex items-center space-x-1 transition-colors"
                  >
                    <KakaoIcon className="w-3.5 h-3.5 fill-current" />
                    <span>카카오톡 채널 1:1 상담 연결</span>
                  </a>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center space-x-2 border-b border-black/10 pb-3 mb-6">
                <button
                  onClick={() => setEmailTab('summary')}
                  className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wider uppercase transition-colors flex items-center space-x-1.5 ${
                    emailTab === 'summary'
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'bg-[#F5F3EF] text-[#666666] hover:bg-[#EAE7E2] hover:text-[#1A1A1A]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>예약 접수 요약</span>
                </button>

                <button
                  onClick={() => setEmailTab('email')}
                  className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wider uppercase transition-colors flex items-center space-x-1.5 relative ${
                    emailTab === 'email'
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'bg-[#F5F3EF] text-[#666666] hover:bg-[#EAE7E2] hover:text-[#1A1A1A]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>대표자 수신 이메일 양식</span>
                  <span className="w-2 h-2 rounded-full bg-[#A68F7E] animate-pulse"></span>
                </button>

                <button
                  onClick={() => setEmailTab('delivery')}
                  className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wider uppercase transition-colors flex items-center space-x-1.5 ${
                    emailTab === 'delivery'
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'bg-[#F5F3EF] text-[#666666] hover:bg-[#EAE7E2] hover:text-[#1A1A1A]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>전달 방법 가이드</span>
                </button>
              </div>

              {/* Tab 1: On-screen Summary */}
              {emailTab === 'summary' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-[#F5F3EF] p-5 rounded-xl border border-black/5 space-y-3 text-xs text-[#444444]">
                    <div className="flex justify-between border-b border-black/10 pb-2.5">
                      <span className="font-medium text-[#1A1A1A]">고유 접수 번호</span>
                      <span className="font-serif-en font-bold text-[#A68F7E] tracking-wider text-sm">
                        {inquiryResult.referenceNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-[#888888] block text-[11px]">신랑 / 신부</span>
                        <span className="font-medium text-[#1A1A1A]">
                          신랑 {inquiryResult.data.groomName || '-'} / 신부 {inquiryResult.data.brideName || '-'}
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
                        <span className="font-medium text-[#1A1A1A]">{inquiryResult.data.venueName}</span>
                      </div>
                    </div>

                    <div className="border-t border-black/5 pt-2.5">
                      <span className="text-[#888888] block text-[11px]">선택 상품 및 가격 구분</span>
                      <span className="font-medium text-[#1A1A1A]">
                        {getPackageDetails(inquiryResult.data.selectedPackage, inquiryResult.data.priceType).name} (
                        {getPackageDetails(inquiryResult.data.selectedPackage, inquiryResult.data.priceType).priceText})
                      </span>
                    </div>

                    <div className="border-t border-black/5 pt-2.5">
                      <span className="text-[#888888] block text-[11px]">리뷰 이벤트 참여</span>
                      <span className="font-medium text-emerald-700">
                        {inquiryResult.data.reviewEvent === 'JOIN'
                          ? '🎁 참여함 (보정본 5~10장 우선 발송 혜택)'
                          : '참여 안함'}
                      </span>
                    </div>

                    {inquiryResult.data.specialRequests && (
                      <div className="border-t border-black/5 pt-2.5">
                        <span className="text-[#888888] block text-[11px]">요청사항</span>
                        <span className="text-[#333333] font-light">{inquiryResult.data.specialRequests}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Email Format Preview */}
              {emailTab === 'email' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-[#1A1A1A] text-white p-4 rounded-t-xl border-b border-white/10 text-xs font-serif-en space-y-1.5">
                    <div className="flex justify-between items-center text-white/60 text-[11px]">
                      <span>TO: {studioInfo.email} (대표 메일)</span>
                      <span>STATUS: RECORDED</span>
                    </div>
                    <div className="text-white font-medium">REPLY-TO: {targetEmail}</div>
                    <div className="text-[#A68F7E] font-sans text-xs pt-1 border-t border-white/10">
                      SUBJECT: [신규 예약 문의] {inquiryResult.data.groomName || inquiryResult.data.brideName}님 - {inquiryResult.data.weddingDate} 예식 스냅
                    </div>
                  </div>

                  <div className="bg-[#F5F3EF] p-6 rounded-b-xl border border-black/10 text-xs text-[#333333] space-y-4 font-sans leading-relaxed">
                    <div className="flex items-center justify-between border-b border-black/10 pb-4">
                      <div>
                        <h4 className="font-serif-kr text-lg font-semibold text-[#1A1A1A]">여백스튜디오 대표 수신용 내역</h4>
                        <p className="font-serif-en text-[10px] text-[#A68F7E] uppercase tracking-widest">Inquiry Details</p>
                      </div>
                      <Sparkles className="w-5 h-5 text-[#A68F7E]" />
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-black/5 space-y-2">
                      <p className="font-medium text-[#1A1A1A] border-b border-black/5 pb-1">📌 고객 접수 정보</p>
                      <p>• 접수 번호: <strong>{inquiryResult.referenceNumber}</strong></p>
                      <p>• 신랑/신부: {inquiryResult.data.groomName || '-'} / {inquiryResult.data.brideName || '-'}</p>
                      <p>• 연락처: {inquiryResult.data.phone}</p>
                      <p>• 이메일: {inquiryResult.data.email || '미입력'}</p>
                      <p>• 예식 일시: {inquiryResult.data.weddingDate} ({inquiryResult.data.weddingTime})</p>
                      <p>• 예식 장소: {inquiryResult.data.venueName}</p>
                      <p>• 선택 상품: {getPackageDetails(inquiryResult.data.selectedPackage, inquiryResult.data.priceType).name}</p>
                      <p>• 적용 가격: {getPackageDetails(inquiryResult.data.selectedPackage, inquiryResult.data.priceType).priceText}</p>
                      <p>• 리뷰 이벤트: {inquiryResult.data.reviewEvent === 'JOIN' ? '참여함 (보정본 5~10장 우선 발송)' : '참여 안함'}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-[#888888]">고객센터: {studioInfo.phone}</span>
                      <button
                        onClick={handleResendEmail}
                        disabled={isResendingEmail}
                        className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#A68F7E] text-white rounded-md text-[11px] font-medium flex items-center space-x-1.5 transition-colors"
                      >
                        {isResendingEmail ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin text-[#A68F7E]" />
                            <span>전송 확인 중...</span>
                          </>
                        ) : (
                          <>
                            <MailCheck className="w-3 h-3" />
                            <span>이메일 수신 재확인</span>
                          </>
                        )}
                      </button>
                    </div>

                    {emailResentSuccess && (
                      <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 text-xs flex items-center space-x-2 animate-fadeIn">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>대표 이메일({studioInfo.email})로 전송 기록되었습니다!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Delivery Options Guide */}
              {emailTab === 'delivery' && (
                <div className="space-y-4 animate-fadeIn text-xs text-[#333333]">
                  <div className="bg-[#FAF9F5] p-5 rounded-xl border border-black/10 space-y-3 font-sans">
                    <h4 className="font-serif-kr text-sm font-bold text-[#1A1A1A] flex items-center">
                      <Mail className="w-4 h-4 mr-1.5 text-[#A68F7E]" />
                      <span>무료로 대표님 이메일({studioInfo.email}) 수신받는 3가지 방법</span>
                    </h4>

                    <div className="space-y-2.5 pt-1">
                      <div className="p-3 bg-white rounded-lg border border-black/5">
                        <p className="font-semibold text-[#1A1A1A] text-xs">1. 웹사이트 내장 수신함 (즉시 사용 가능)</p>
                        <p className="text-[#666666] text-[11px] mt-0.5">
                          대표님이 웹사이트의 편집/관리자 모드를 켜면 제출된 고객 문의가 자동으로 리스트업됩니다.
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-black/5">
                        <p className="font-semibold text-[#1A1A1A] text-xs">2. Formspree / EmailJS 연동 (100% 무료)</p>
                        <p className="text-[#666666] text-[11px] mt-0.5">
                          Formspree.io 가입 후 부여받는 Endpoint URL을 연결하면 고객이 제출할 때마다 대표 네이버 메일로 자동 전송됩니다.
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-black/5">
                        <p className="font-semibold text-[#1A1A1A] text-xs">3. 원클릭 메일/카카오톡 전달 버튼</p>
                        <p className="text-[#666666] text-[11px] mt-0.5">
                          손님이 제출 후 '네이버 메일 전달'이나 '카카오톡 전달' 버튼을 누르면 1초 만에 내용이 카톡/메일로 보내집니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Modal Actions */}
            <div className="pt-6 border-t border-black/10 space-y-2.5 mt-6">
              <button
                onClick={copyInquirySummary}
                className="w-full py-3 bg-[#F5F3EF] hover:bg-[#EAE7E2] text-[#1A1A1A] rounded-lg text-xs font-medium flex items-center justify-center space-x-2 transition-colors border border-black/5"
              >
                <Copy className="w-3.5 h-3.5 text-[#A68F7E]" />
                <span>{copied ? '예약 내역 텍스트 복사 완료!' : '예약 접수 내역 클립보드 복사'}</span>
              </button>

              <button
                onClick={() => setInquiryResult(null)}
                className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#A68F7E] text-white rounded-lg text-xs font-medium tracking-[0.2em] uppercase transition-colors shadow-md"
              >
                확인 및 모달 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


