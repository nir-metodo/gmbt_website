'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import CookieConsent from '@/components/Compliance/CookieConsent';
import AccessibilityToolbar from '@/components/Compliance/AccessibilityToolbar';
import GambotWhatsAppWidget from '@/components/Widget/GambotWhatsAppWidget';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from '@/components/Compliance/Compliance.module.css';

// Public document pages (signer-facing forms & e-signature) must render as a clean, standalone
// document — WITHOUT the marketing site's global navbar/footer. Those pages carry their own header
// and a clickable "Powered by Gambot" footer. Detected by URL segment because the live URLs are
// rewritten to /{org}/form/{id}/{token} and /{org}/esignature/{id}/{token}.
// The embeddable chat-widget iframe (/wabaChatWidgetIframe) is bare too: it is loaded inside customers'
// sites, so it must never render our navbar/footer, cookie banner or accessibility button.
const BARE_ROUTE = /(?:^|\/)(form|esig|esignature|wabaChatWidgetIframe)(?:\/|$)/i;

export default function SiteChrome({ children }) {
  const pathname = usePathname() || '';
  const { currentLanguage } = useLanguage();
  const bare = BARE_ROUTE.test(pathname);

  if (bare) return <main>{children}</main>;

  return (
    <>
      <a href="#main-content" className={styles.skip}>
        {currentLanguage === 'en' ? 'Skip to main content' : 'דלג לתוכן הראשי'}
      </a>
      <CookieConsent />
      <Navbar />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
      <AccessibilityToolbar />
      <GambotWhatsAppWidget />
    </>
  );
}
