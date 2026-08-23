import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Star, MessageSquarePlus, Send, CheckCircle2, Trash2, Heart, Sparkles } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { EditableText } from './EditableText';

export const ProcessFaqSection: React.FC = () => {
  const { content, updateFaq, updateTestimonial, addTestimonial, deleteTestimonial, isAdminMode } = useSiteContent();
  const testimonials = content.testimonials;
  const faqItems = content.faqItems;

  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Review Form State
  const [groomBrideName, setGroomBrideName] = useState('');
  const [venueInfo, setVenueInfo] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const steps = [
    { num: '01', title: '문의 및 일정 확인', desc: '예식 일시와 장소로 촬영 가능 여부 조회' },
    { num: '02', title: '사전 디렉팅', desc: '원하시는사진, 희망사항 등 상담진행' },
    { num: '03', title: '계약 및 예약 확정', desc: '상세 계약서 작성 및 예약금 확인 후 최종 확정' },
    { num: '04', title: '본식 당일 촬영', desc: '작가 현장 도착 후 신부대기실부터 밀착 커버' },
    { num: '05', title: '원본 전송 & 셀렉', desc: '본식 2주 내 전체 고화질 원본 및 리뷰이벤트용 사진 선발송' },
    { num: '06', title: '최종 보정 및 앨범 수령', desc: '고객 셀렉 후 2~8주 내 보정본/앨범 배송' },
  ];

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groomBrideName.trim() || !reviewContent.trim()) {
      alert('성함과 후기 내용을 입력해주세요.');
      return;
    }

    const formattedNames = groomBrideName.includes('부부')
      ? groomBrideName
      : `${groomBrideName} 부부`;

    addTestimonial({
      coupleNames: formattedNames,
      venue: venueInfo || '웨스턴컨벤션',
      weddingDate: weddingDate || new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      content: reviewContent,
      rating: rating,
      imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=200',
    });

    setIsSubmitted(true);
    setGroomBrideName('');
    setVenueInfo('');
    setWeddingDate('');
    setReviewContent('');
    setRating(5);

    setTimeout(() => {
      setIsSubmitted(false);
      setIsFormOpen(false);
    }, 3000);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#F5F3EF] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-28">
        {/* Booking Timeline Section */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-serif-en text-xs sm:text-sm tracking-[0.3em] uppercase text-[#A68F7E] font-medium block mb-3">
              PROCESS GUIDE
            </span>
            <h2 className="font-serif-kr text-3xl sm:text-4xl font-light text-[#1A1A1A] tracking-tight mb-4">
              예약 진행 및 작업 프로세스
            </h2>
            <p className="text-sm text-[#555555] font-light">
              문의 접수부터 최종 앨범 수령까지, 여백스튜디오가 차근차근 함께합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bento-card bg-white p-6 rounded-xl border border-black/5 flex flex-col justify-between hover:border-[#A68F7E] transition-colors"
              >
                <div>
                  <span className="font-serif-en text-2xl font-light text-[#A68F7E] block mb-3">{s.num}</span>
                  <h3 className="font-serif-kr text-base font-medium text-[#1A1A1A] mb-2">{s.title}</h3>
                  <p className="text-xs text-[#666666] font-light leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Client Reviews Section */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-serif-en text-xs sm:text-sm tracking-[0.3em] uppercase text-[#A68F7E] font-medium block mb-3">
              REAL REVIEWS
            </span>
            <h2 className="font-serif-kr text-3xl sm:text-4xl font-light text-[#1A1A1A] tracking-tight mb-4">
              신랑신부님의 소중한 후기
            </h2>
            <p className="text-sm text-[#555555] font-light">
              여백스튜디오와 함께 가장 찬란한 날을 기록하신 고객님들의 실제 후기입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bento-card bg-white p-8 rounded-xl border border-black/5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative group"
              >
                {isAdminMode && (
                  <button
                    onClick={() => deleteTestimonial(t.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors opacity-80 hover:opacity-100"
                    title="후기 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div>
                  <div className="flex items-center space-x-1 text-[#A68F7E] mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-xs sm:text-sm text-[#444444] font-light leading-relaxed mb-6 italic">
                    "<EditableText
                      value={t.content}
                      onSave={(val) => updateTestimonial(t.id, { content: val })}
                      label="후기 내용"
                      multiline
                    />"
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5">
                  <div>
                    <div className="font-serif-kr text-sm font-medium text-[#1A1A1A]">
                      <EditableText
                        value={t.coupleNames}
                        onSave={(val) => updateTestimonial(t.id, { coupleNames: val })}
                        label="신랑신부 이름"
                      />
                    </div>
                    <div className="text-[11px] text-[#888888] font-light">
                      <EditableText
                        value={t.venue}
                        onSave={(val) => updateTestimonial(t.id, { venue: val })}
                        label="웨딩홀"
                      />{' '}
                      ·{' '}
                      <EditableText
                        value={t.weddingDate}
                        onSave={(val) => updateTestimonial(t.id, { weddingDate: val })}
                        label="예식 일자"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Write Review Button & Form Container */}
          <div className="mt-12 text-center">
            {!isFormOpen ? (
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-[#1A1A1A] hover:bg-[#A68F7E] text-white rounded-full text-xs sm:text-sm font-medium tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <MessageSquarePlus className="w-4 h-4 text-[#A68F7E] group-hover:text-white" />
                <span>나도 소중한 예식 후기 작성하기</span>
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 ml-1 animate-pulse" />
              </button>
            ) : (
              <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-[#A68F7E]/30 shadow-xl text-left animate-fadeIn">
                <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-[#A68F7E]/10 rounded-lg text-[#A68F7E]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif-kr text-lg font-medium text-[#1A1A1A]">
                        신랑신부 소중한 촬영 후기 작성
                      </h3>
                      <p className="text-xs text-[#777777] font-light">
                        여백스튜디오와 함께한 본식 스냅 소감을 들려주세요.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="text-xs text-[#888888] hover:text-[#1A1A1A] px-2 py-1 rounded bg-[#F5F3EF]"
                  >
                    닫기
                  </button>
                </div>

                {isSubmitted ? (
                  <div className="py-12 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                    <h4 className="font-serif-kr text-lg font-medium text-[#1A1A1A]">
                      후기가 소중하게 등록되었습니다!
                    </h4>
                    <p className="text-xs text-[#666666] font-light max-w-sm mx-auto">
                      따뜻한 후기를 남겨주셔서 감사드립니다. 신랑신부님의 찬란한 앞날을 진심으로 축복합니다.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-5 text-xs text-[#333333]">
                    {/* Star Rating */}
                    <div>
                      <label className="block font-medium text-[#1A1A1A] mb-1.5">만족도 별점</label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                (hoverRating !== null ? star <= hoverRating : star <= rating)
                                  ? 'text-[#A68F7E] fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 font-medium text-[#A68F7E] text-xs">
                          {rating}점 / 5점
                        </span>
                      </div>
                    </div>

                    {/* Couple Names & Venue */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-[#1A1A1A] mb-1">
                          신랑신부 성함 <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="예: 김서연 & 이준호 부부"
                          value={groomBrideName}
                          onChange={(e) => setGroomBrideName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#F5F3EF] border border-black/10 rounded-lg text-xs focus:outline-none focus:border-[#A68F7E]"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-[#1A1A1A] mb-1">
                          예식장소 및 패키지
                        </label>
                        <input
                          type="text"
                          placeholder="예: 더라움 체임버홀 (B타입 프리미엄)"
                          value={venueInfo}
                          onChange={(e) => setVenueInfo(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#F5F3EF] border border-black/10 rounded-lg text-xs focus:outline-none focus:border-[#A68F7E]"
                        />
                      </div>
                    </div>

                    {/* Wedding Date */}
                    <div>
                      <label className="block font-medium text-[#1A1A1A] mb-1">예식 일자</label>
                      <input
                        type="text"
                        placeholder="예: 2026.05.20"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#F5F3EF] border border-black/10 rounded-lg text-xs focus:outline-none focus:border-[#A68F7E]"
                      />
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className="block font-medium text-[#1A1A1A] mb-1">
                        솔직한 후기 내용 <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="작가님의 분위기 주도, 사진 톤앤매너, 보정본 만족도 등 생생한 후기를 남겨주세요."
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#F5F3EF] border border-black/10 rounded-lg text-xs focus:outline-none focus:border-[#A68F7E] resize-none leading-relaxed"
                      />
                    </div>

                    {/* Form Buttons */}
                    <div className="pt-3 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-5 py-2.5 bg-[#F5F3EF] hover:bg-[#EAE7E2] text-[#555555] rounded-lg font-medium transition-colors"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#A68F7E] text-white rounded-lg font-medium flex items-center space-x-1.5 shadow-md transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>소중한 후기 등록하기</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-serif-en text-xs sm:text-sm tracking-[0.3em] uppercase text-[#A68F7E] font-medium block mb-3">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-serif-kr text-3xl font-light text-[#1A1A1A] tracking-tight mb-2">
              자주 묻는 질문 (FAQ)
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div
                  key={item.id}
                  className="bento-card bg-white rounded-xl border border-black/5 overflow-hidden transition-colors"
                >
                  <div className="w-full p-6 flex items-center justify-between space-x-4">
                    <span className="font-serif-kr text-base font-medium text-[#1A1A1A] flex items-center flex-grow">
                      <HelpCircle className="w-4 h-4 mr-3 text-[#A68F7E] shrink-0" />
                      <EditableText
                        value={item.question}
                        onSave={(val) => updateFaq(item.id, { question: val })}
                        label="FAQ 질문"
                      />
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFaq(item.id)}
                      className="p-1.5 text-[#888888] hover:text-[#A68F7E] transition-colors"
                    >
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'transform rotate-180 text-[#A68F7E]' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#555555] font-light leading-relaxed border-t border-black/5 bg-[#EAE7E2]/30 animate-fadeIn">
                      <EditableText
                        value={item.answer}
                        onSave={(val) => updateFaq(item.id, { answer: val })}
                        label="FAQ 답변"
                        multiline
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
