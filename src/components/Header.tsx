import React, { useState, useEffect } from 'react';
import { Menu, X, CalendarCheck, PhoneCall, Instagram } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { KakaoIcon } from './KakaoIcon';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdminModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useSiteContent();
  const { studioInfo } = content;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'ABOUT', krLabel: '스튜디오 소개' },
    { id: 'gallery', label: 'GALLERY', krLabel: '포트폴리오' },
    { id: 'pricing', label: 'PRICING', krLabel: '상품 & 가격' },
    { id: 'reservation', label: 'RESERVATION', krLabel: '예약 문의' },
    { id: 'faq', label: 'FAQ', krLabel: '이용 안내' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#F5F3EF]/95 backdrop-blur-md border-b border-black/5 py-3.5 shadow-xs'
          : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent text-white py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo & Partner Tag */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleNavClick('hero')}
            className="group flex flex-col text-left focus:outline-hidden"
            aria-label="여백스튜디오 메인으로 이동"
          >
            <span
              className={`font-serif-kr text-xl sm:text-2xl font-semibold tracking-widest uppercase transition-colors duration-300 ${
                isScrolled ? 'text-[#1A1A1A] group-hover:text-[#A68F7E]' : 'text-white group-hover:text-[#EAE7E2]'
              }`}
            >
              여백스튜디오
            </span>
            <span
              className={`font-serif-en text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-light -mt-0.5 ${
                isScrolled ? 'text-[#888888]' : 'text-white/80'
              }`}
            >
              Yeobaek Studio
            </span>
          </button>

          <span
            onClick={() => handleNavClick('pricing')}
            className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-serif-kr font-medium cursor-pointer transition-all ${
              isScrolled
                ? 'bg-[#A68F7E]/15 text-[#A68F7E] hover:bg-[#A68F7E] hover:text-white'
                : 'bg-white/20 text-white hover:bg-white hover:text-[#1A1A1A]'
            }`}
            title="익산 웨스턴라이프 호텔 공식 제휴 스튜디오 (제휴가 보기)"
          >
            <span>웨스턴라이프 공식제휴</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group relative text-[11px] tracking-[0.2em] uppercase font-medium py-1 transition-colors duration-300 ${
                  isScrolled
                    ? isActive
                      ? 'text-[#1A1A1A] border-b border-[#1A1A1A]'
                      : 'text-[#555555] hover:text-[#1A1A1A]'
                    : isActive
                    ? 'text-white border-b border-white'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center space-x-3">
          <a
            href={studioInfo.instagram || "https://www.instagram.com/yeobaek_studio_iksan/"}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full transition-colors ${
              isScrolled ? 'text-[#555555] hover:text-[#A68F7E]' : 'text-white/80 hover:text-white'
            }`}
            aria-label="여백스튜디오 인스타그램"
            title="인스타그램"
          >
            <Instagram className="w-4 h-4" />
          </a>

          <a
            href={studioInfo.kakaoLink || "https://pf.kakao.com/_AxdWxgn"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-full bg-[#FFE812] text-[#3B1E1E] hover:bg-yellow-300 font-bold text-xs flex items-center space-x-1 shadow-xs transition-transform active:scale-95"
            aria-label="여백스튜디오 카카오톡 채널"
            title="카카오톡 채널 바로가기"
          >
            <KakaoIcon className="w-3.5 h-3.5 fill-current" />
            <span className="text-[11px] font-bold">카카오톡</span>
          </a>

          <button
            onClick={() => handleNavClick('reservation')}
            className={`px-4 py-2.5 rounded-xs text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-300 flex items-center space-x-2 ${
              isScrolled
                ? 'bg-[#1A1A1A] text-white hover:bg-[#A68F7E] shadow-xs'
                : 'bg-white/15 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-[#1A1A1A]'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>예약 문의</span>
          </button>
        </div>

        {/* Mobile Header Actions (Instagram, KakaoTalk, Hamburger Menu) */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Mobile Instagram Button */}
          <a
            href={studioInfo.instagram || "https://www.instagram.com/yeobaek_studio_iksan/"}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${
              isScrolled ? 'text-[#1A1A1A] hover:text-[#A68F7E]' : 'text-white hover:text-[#EAE7E2]'
            }`}
            aria-label="여백스튜디오 인스타그램"
            title="인스타그램"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* Mobile KakaoTalk Button */}
          <a
            href={studioInfo.kakaoLink || "https://pf.kakao.com/_AxdWxgn"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-full bg-[#FFE812] text-[#3B1E1E] hover:bg-yellow-300 font-bold text-[11px] flex items-center space-x-1 shadow-xs transition-transform active:scale-95"
            aria-label="여백스튜디오 카카오톡 채널"
            title="카카오톡 채널 바로가기"
          >
            <KakaoIcon className="w-3 h-3 fill-current" />
            <span className="font-bold">카톡</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-md transition-colors ml-1 ${
              isScrolled ? 'text-[#1A1A1A]' : 'text-white'
            }`}
            aria-label="메뉴 열기/닫기"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] z-40 bg-[#F5F3EF] text-[#1A1A1A] border-t border-black/5 px-6 py-8 flex flex-col justify-between shadow-2xl animate-fadeIn">
          <div className="space-y-6">
            <p className="font-serif-en text-xs tracking-[0.25em] text-[#A68F7E] uppercase">
              Navigation Menu
            </p>
            <div className="flex flex-col space-y-5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="flex items-center justify-between text-left py-2 border-b border-black/5 group"
                >
                  <span className="font-serif-kr text-lg font-medium text-[#1A1A1A] group-hover:text-[#A68F7E] transition-colors">
                    {item.krLabel}
                  </span>
                  <span className="font-serif-en text-xs tracking-widest text-[#888888] uppercase">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-black/5">
            <button
              onClick={() => handleNavClick('reservation')}
              className="w-full py-3.5 bg-[#1A1A1A] text-white rounded-xs text-xs tracking-[0.2em] uppercase font-medium flex items-center justify-center space-x-2 shadow-md active:scale-[0.98] transition-transform"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>실시간 본식 스냅 예약 문의</span>
            </button>

            <a
              href={studioInfo.kakaoLink || "https://pf.kakao.com/_AxdWxgn"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#FFE812] text-[#3B1E1E] rounded-xs text-xs font-bold tracking-wide flex items-center justify-center space-x-2 shadow-sm transition-transform active:scale-[0.98]"
            >
              <KakaoIcon className="w-4 h-4 fill-current" />
              <span>카카오톡 채널 1:1 상담 바로가기</span>
            </a>

            <div className="flex items-center justify-between text-xs text-[#777777] pt-1">
              <span className="flex items-center space-x-1">
                <PhoneCall className="w-3.5 h-3.5 text-[#A68F7E]" />
                <span>{studioInfo.phone}</span>
              </span>
              <span>{studioInfo.kakao}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
