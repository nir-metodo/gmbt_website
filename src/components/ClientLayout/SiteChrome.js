'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

// Public document pages (signer-facing forms & e-signature) must render as a clean, standalone
// document — WITHOUT the marketing site's global navbar/footer. Those pages carry their own header
// and a clickable "Powered by Gambot" footer. Detected by URL segment because the live URLs are
// rewritten to /{org}/form/{id}/{token} and /{org}/esignature/{id}/{token}.
const BARE_ROUTE = /(?:^|\/)(form|esig|esignature)(?:\/|$)/i;

export default function SiteChrome({ children }) {
  const pathname = usePathname() || '';
  const bare = BARE_ROUTE.test(pathname);

  if (bare) return <main>{children}</main>;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
