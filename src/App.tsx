/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { PricingSection } from './components/PricingSection';
import { ReservationSection } from './components/ReservationSection';
import { ProcessFaqSection } from './components/ProcessFaqSection';
import { Footer } from './components/Footer';
import { CalendarCheck, Edit3, Settings, Inbox } from 'lucide-react';
import { ContentProvider, useSiteContent } from './context/ContentContext';
import { AdminEditorModal } from './components/AdminEditorModal';
import { InquiriesInboxModal } from './components/InquiriesInboxModal';

function MainApp() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('album');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);

  const { isAdminMode, toggleAdminMode, inquiries } = useSiteContent();

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackageId(packageId);
    handleNavigate('reservation');
  };

  // Global keyboard shortcut to toggle admin mode (Ctrl+Shift+E or Cmd+Shift+E)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        toggleAdminMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAdminMode]);

  // ScrollSpy to update active section in header
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'gallery', 'pricing', 'reservation', 'faq'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#1A1A1A] font-sans-kr flex flex-col selection:bg-[#A68F7E]/20 selection:text-[#1A1A1A]">
      {/* Header Navigation */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <HeroSection onNavigate={handleNavigate} />
        <AboutSection />
        <GallerySection />
        <PricingSection onSelectPackage={handleSelectPackage} />
        <ReservationSection selectedPackageId={selectedPackageId} />
        <ProcessFaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Admin & Photo Quick-Editor Toolbar (Only visible if Admin Mode is explicitly toggled via Ctrl+Shift+E) */}
      {isAdminMode && (
        <div className="fixed bottom-5 left-5 z-40 flex items-center space-x-2 animate-fadeIn">
          <button
            onClick={toggleAdminMode}
            className="px-4 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 text-xs font-semibold border bg-amber-500 text-white border-amber-300 ring-4 ring-amber-500/25 shadow-amber-500/30 active:scale-95 transition-all"
            title="관리 모드 종료"
          >
            <Edit3 className="w-4 h-4" />
            <span>편집 모드 종료 (OFF)</span>
          </button>

          <button
            onClick={() => setIsInboxModalOpen(true)}
            className="px-3.5 py-2.5 bg-rose-600 text-white rounded-full shadow-2xl flex items-center space-x-1.5 text-xs font-medium border border-rose-400 hover:bg-rose-700 transition-colors relative"
            title="고객 예약 문의 수신함 열기"
          >
            <Inbox className="w-4 h-4" />
            <span>예약 수신함</span>
            {inquiries.filter((i) => i.status === 'NEW').length > 0 && (
              <span className="bg-white text-rose-600 text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-1">
                {inquiries.filter((i) => i.status === 'NEW').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="px-3.5 py-2.5 bg-[#1A1A1A] text-white rounded-full shadow-2xl flex items-center space-x-1.5 text-xs font-medium border border-[#A68F7E]/50 hover:bg-[#A68F7E] transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>전체 관리함</span>
          </button>
        </div>
      )}

      {/* Floating Action Bar on Mobile for Rapid Inquiry */}
      <div className="md:hidden fixed bottom-5 right-5 z-40 flex items-center space-x-2">
        <button
          onClick={() => handleNavigate('reservation')}
          className="px-5 py-3 bg-[#1A1A1A] text-white rounded-full shadow-2xl flex items-center space-x-2 text-xs font-medium tracking-wider border border-[#A68F7E]/50 active:scale-[0.95] transition-transform"
        >
          <CalendarCheck className="w-4 h-4 text-[#A68F7E]" />
          <span>예약 문의</span>
        </button>
      </div>

      {/* Admin Content Manager Drawer Modal */}
      <AdminEditorModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Customer Inquiries Inbox Modal */}
      <InquiriesInboxModal
        isOpen={isInboxModalOpen}
        onClose={() => setIsInboxModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <MainApp />
    </ContentProvider>
  );
}

