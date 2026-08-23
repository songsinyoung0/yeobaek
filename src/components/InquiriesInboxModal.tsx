import React, { useState } from 'react';
import { X, Inbox, Mail, Phone, Calendar, MapPin, Tag, Gift, Trash2, Check, Clock, ExternalLink, MessageSquare, Copy } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { InquiryItem } from '../types';

interface InquiriesInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InquiriesInboxModal: React.FC<InquiriesInboxModalProps> = ({ isOpen, onClose }) => {
  const { inquiries, updateInquiryStatus, deleteInquiry, content } = useSiteContent();
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const getStatusBadge = (status: InquiryItem['status']) => {
    switch (status) {
      case 'NEW':
        return <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">신규 문의</span>;
      case 'CONTACTED':
        return <span className="bg-amber-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">상담 진행 중</span>;
      case 'CONFIRMED':
        return <span className="bg-emerald-600 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">예약 확정</span>;
      case 'CANCELLED':
        return <span className="bg-gray-400 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">취소/종료</span>;
    }
  };

  const getPackageName = (pkgId: string) => {
    switch (pkgId) {
      case 'raw': return '원본형';
      case 'raw-retouched': return '원본 + 보정본형';
      case 'album': return '화보앨범형';
      case 'premium': return '프리미엄형';
      default: return '맞춤 견적 문의';
    }
  };

  const handleCopyInquiry = (item: InquiryItem) => {
    const text = `[여백스튜디오 예약 문의]
접수번호: ${item.referenceNumber} (${item.submittedAt})
신랑 ${item.data.groomName || '-'} / 신부 ${item.data.brideName || '-'}
연락처: ${item.data.phone}
이메일: ${item.data.email || '미입력'}
예식일: ${item.data.weddingDate} (${item.data.weddingTime})
장소: ${item.data.venueName}
상품: ${getPackageName(item.data.selectedPackage)} [${item.data.priceType === 'WESTERN' ? '웨스턴 혜택가' : '일반가'}]
리뷰이벤트: ${item.data.reviewEvent === 'JOIN' ? '참여함' : '미참여'}
요청사항: ${item.data.specialRequests || '없음'}`;

    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="max-w-4xl w-full bg-white rounded-2xl border border-black/10 shadow-2xl relative my-auto max-h-[90vh] flex flex-col overflow-hidden text-[#1A1A1A]">
        {/* Modal Header */}
        <div className="bg-[#1A1A1A] text-white p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#A68F7E] text-white rounded-xl">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-kr text-lg font-medium text-white flex items-center space-x-2">
                <span>고객 예약 문의 관리 수신함</span>
                <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-[#A68F7E] text-white">
                  총 {inquiries.length}건
                </span>
              </h3>
              <p className="text-xs text-white/70 font-light mt-0.5">
                대표 메일({content.studioInfo.email}) 및 웹사이트를 통해 제출된 견적 문의 내역입니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F5F3EF]">
          {inquiries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-black/5 p-8">
              <Inbox className="w-12 h-12 text-[#A68F7E]/40 mx-auto mb-3" />
              <h4 className="font-serif-kr text-base font-medium text-[#1A1A1A]">접수된 문의 내역이 없습니다</h4>
              <p className="text-xs text-[#777777] font-light mt-1">
                고객님이 본식 스냅 예약 문의폼을 제출하면 이곳에 자동으로 기록됩니다.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl p-5 border transition-all ${
                    item.status === 'NEW'
                      ? 'border-rose-300 shadow-sm ring-1 ring-rose-200'
                      : 'border-black/5 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-3 mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(item.status)}
                      <span className="font-serif-en text-xs font-bold text-[#A68F7E]">
                        {item.referenceNumber}
                      </span>
                      <span className="text-[11px] text-[#888888] flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.submittedAt}
                      </span>
                    </div>

                    {/* Status Toggle Actions */}
                    <div className="flex items-center space-x-1.5 text-xs">
                      <select
                        value={item.status}
                        onChange={(e) => updateInquiryStatus(item.id, e.target.value as InquiryItem['status'])}
                        className="px-2.5 py-1 bg-[#F5F3EF] border border-black/10 rounded-md text-xs text-[#1A1A1A] font-medium focus:outline-none"
                      >
                        <option value="NEW">신규 문의</option>
                        <option value="CONTACTED">상담 진행 중</option>
                        <option value="CONFIRMED">예약 확정</option>
                        <option value="CANCELLED">취소/종료</option>
                      </select>

                      <button
                        onClick={() => handleCopyInquiry(item)}
                        className="p-1.5 rounded-md bg-[#F5F3EF] hover:bg-[#EAE7E2] text-[#333333] transition-colors"
                        title="내역 복사"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteInquiry(item.id)}
                        className="p-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="문의 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Inquiry Content Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-[#333333]">
                    <div>
                      <span className="text-[#888888] block text-[11px]">성함 (신랑 / 신부)</span>
                      <strong className="text-[#1A1A1A] text-sm">
                        신랑 {item.data.groomName || '-'} / 신부 {item.data.brideName || '-'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[#888888] block text-[11px]">연락처</span>
                      <a href={`tel:${item.data.phone}`} className="text-[#1A1A1A] hover:underline font-medium">
                        {item.data.phone}
                      </a>
                    </div>

                    <div>
                      <span className="text-[#888888] block text-[11px]">이메일</span>
                      <span className="text-[#1A1A1A]">{item.data.email || '미입력'}</span>
                    </div>

                    <div>
                      <span className="text-[#888888] block text-[11px]">예식 일시</span>
                      <span className="text-[#1A1A1A] font-medium">
                        {item.data.weddingDate} ({item.data.weddingTime})
                      </span>
                    </div>

                    <div>
                      <span className="text-[#888888] block text-[11px]">예식 장소</span>
                      <span className="text-[#1A1A1A] font-medium">{item.data.venueName}</span>
                    </div>

                    <div>
                      <span className="text-[#888888] block text-[11px]">선택 패키지</span>
                      <span className="text-[#1A1A1A] font-bold">
                        {getPackageName(item.data.selectedPackage)}
                        <span className="font-normal text-[11px] text-[#888888] ml-1">
                          ({item.data.priceType === 'WESTERN' ? '웨스턴 혜택가' : '일반가'})
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Review Event Status */}
                  <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                    <span className="text-[#666666] flex items-center">
                      <Gift className="w-3.5 h-3.5 mr-1 text-[#A68F7E]" />
                      <span>리뷰 이벤트:</span>
                      <strong className={`ml-1 ${item.data.reviewEvent === 'JOIN' ? 'text-emerald-700' : 'text-gray-500'}`}>
                        {item.data.reviewEvent === 'JOIN' ? '참여함 (보정본 5~10장 우선 발송 혜택)' : '참여 안함'}
                      </strong>
                    </span>

                    {item.data.email && (
                      <a
                        href={`mailto:${item.data.email}?subject=${encodeURIComponent(`[여백스튜디오] ${item.data.groomName || item.data.brideName}님 예식 스냅 일정 안내`)}`}
                        className="text-amber-800 hover:underline flex items-center space-x-1 text-[11px] font-medium"
                      >
                        <Mail className="w-3 h-3" />
                        <span>고객에게 메일 답장하기</span>
                      </a>
                    )}
                  </div>

                  {/* Special Requests */}
                  {item.data.specialRequests && (
                    <div className="mt-2.5 p-2.5 bg-[#FAF9F5] rounded-lg border border-black/5 text-xs text-[#555555]">
                      <span className="font-semibold text-[#1A1A1A] block mb-0.5">요청사항:</span>
                      <p className="font-light leading-relaxed whitespace-pre-wrap">{item.data.specialRequests}</p>
                    </div>
                  )}

                  {copiedId === item.id && (
                    <div className="mt-2 p-1.5 bg-emerald-50 text-emerald-800 rounded text-[11px] text-center font-medium animate-fadeIn">
                      문의 내역이 클립보드에 복사되었습니다!
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-black/10 flex justify-between items-center text-xs">
          <span className="text-[#777777]">
            문의 데이터는 브라우저 및 클라우드 동기화를 통해 안전하게 보관됩니다.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#A68F7E] text-white rounded-lg font-medium transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
