import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import AuthModal from '../modals/AuthModal';
import PlacementModal from '../modals/PlacementModal';
import CoreLessonModal from '../modals/CoreLessonModal';
import OnboardingModal from '../modals/OnboardingModal';
import WordInsightModal from '../modals/WordInsightModal';
import ChatWidget from '../chat/ChatWidget';
import { useUI } from '../../hooks/useUI';

/** Shell shared by every page: header, footer, mobile nav and all global popups. */
export default function Layout() {
  const { pathname } = useLocation();
  const { closeDrawer } = useUI();

  useEffect(() => {
    window.scrollTo(0, 0);
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <Header />
      <MobileBottomNav />
      <main>
        <Outlet />
      </main>
      <Footer />

      <AuthModal />
      <PlacementModal />
      <CoreLessonModal />
      <OnboardingModal />
      <WordInsightModal />
      <ChatWidget />
    </>
  );
}
