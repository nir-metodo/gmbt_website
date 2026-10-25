import './globals.css';
import ClientLayout from '@/components/ClientLayout/ClientLayout';
import SiteChrome from '@/components/ClientLayout/SiteChrome';
import { GLOBAL_EN_SSR_SEGMENTS } from '@/lib/globalEnPaths';

export const metadata = {
  metadataBase: new URL('https://gambot.co.il'),
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  title: {
    default: 'Gambot | WhatsApp Business API Platform Israel | גמבוט',
    template: '%s | Gambot',
  },
  description: 'Gambot (גמבוט) — Israel\'s #1 WhatsApp Business API platform. Official Meta Partner. AI chatbot, automation, campaigns, CRM & customer service. Free trial.',
  keywords: [
    'Gambot', 'gambot', 'גמבוט', 'Gambot WhatsApp', 'Gambot Israel',
    'WhatsApp API Israel', 'WhatsApp Business API', 'WhatsApp bot Israel',
    'WhatsApp automation', 'WhatsApp CRM', 'בוט וואטסאפ', 'אוטומציה וואטסאפ',
    'שיווק בוואטסאפ', 'מערכת וואטסאפ עסקי',
  ],
  authors: [
    { name: 'Gambot', url: 'https://gambot.co.il' },
    { name: 'Nir Segas', url: 'https://gambot.co.il/about/' },
    { name: 'ניר סגס', url: 'https://gambot.co.il/about/' },
  ],
  creator: 'Nir Segas',
  publisher: 'Gambot',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    alternateLocale: 'en_US',
    siteName: 'Gambot',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Gambot - WhatsApp Business API Platform Israel' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Gambot',
    creator: '@Gambot',
  },
  alternates: {
    canonical: 'https://gambot.co.il',
    languages: { 'he-IL': 'https://gambot.co.il', 'en': 'https://gambot.co.il/about/' },
    types: { 'application/rss+xml': 'https://gambot.co.il/blog/' },
  },
  verification: {
    google: 'REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
  },
  // NOTE: Site-wide geo.region=IL / content-language=he were intentionally removed.
  // Gambot now targets a global developer/business audience; those tags pinned the whole
  // site to Israel and conflicted with the English + hreflang global pages. Israel targeting
  // is still carried by the .co.il ccTLD and per-page hreflang="he", so Hebrew rankings are
  // unaffected while English/international pages are no longer geo-locked to Israel.
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        {/* English global MCP/API pages: set <html lang/dir> before first paint (the static HTML ships
            lang="he" for every route; the page body itself is server-rendered in English). Mirrors the
            explicit-language priorities in ClientLayout/LangSync. Hebrew pages are untouched. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var en=${JSON.stringify(GLOBAL_EN_SSR_SEGMENTS)};var seg=(location.pathname.replace(/^\\/+/,'').split('/')[0]||'');var q=(new URLSearchParams(location.search).get('lang')||'').toLowerCase();var s=localStorage.getItem('gambot_lang');var l=(q==='he'||q==='en')?q:(s==='he'||s==='en')?s:(en.indexOf(seg)>-1?'en':'');if(l){var d=document.documentElement;d.lang=l;d.dir=l==='he'?'rtl':'ltr';}}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Varela+Round&family=Rubik:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Organization + WebSite Schema for brand recognition */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://gambot.co.il/#organization',
                  name: 'Gambot',
                  alternateName: ['גמבוט', 'Gambot WhatsApp', 'Gambot Israel'],
                  url: 'https://gambot.co.il',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://gambot.co.il/apple-touch-icon.png',
                    width: 180,
                    height: 180,
                  },
                  description: 'Gambot is Israel\'s leading WhatsApp Business API platform. Official Meta Partner providing AI chatbots, automation, campaigns, and CRM solutions.',
                  foundingDate: '2020',
                  founder: { '@type': 'Person', name: 'Nir Segas', alternateName: 'ניר סגס' },
                  // Serves Israel plus a global developer/business audience (WhatsApp API, MCP, AI agents).
                  areaServed: [
                    { '@type': 'Country', name: 'Israel' },
                    { '@type': 'Place', name: 'Worldwide' },
                  ],
                  sameAs: [
                    'https://www.linkedin.com/company/gambot-platform',
                    'https://www.facebook.com/gambotwhatsapp',
                  ],
                  contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer service',
                    availableLanguage: ['Hebrew', 'English'],
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://gambot.co.il/#website',
                  url: 'https://gambot.co.il',
                  name: 'Gambot',
                  description: 'Gambot — WhatsApp Business API Platform for Israel',
                  publisher: { '@id': 'https://gambot.co.il/#organization' },
                  inLanguage: ['he-IL', 'en'],
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: { '@type': 'EntryPoint', urlTemplate: 'https://gambot.co.il/?s={search_term_string}' },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'BreadcrumbList',
                  '@id': 'https://gambot.co.il/#breadcrumb',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Gambot', item: 'https://gambot.co.il/' },
                  ],
                },
              ],
            }),
          }}
        />
        {/* Consent Mode v2: everything is DENIED by default. Google Analytics / Google Ads / Meta Pixel
            are NOT loaded here any more — components/Compliance/CookieConsent.js loads them only after
            the visitor opts in (Israeli Privacy Protection Law Amendment 13, GDPR/ePrivacy).
            gtag() is stubbed so existing gtag('event', ...) calls simply queue until consent is given. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
              gtag('set', 'ads_data_redaction', true);
              gtag('set', 'url_passthrough', false);
            `,
          }}
        />
      </head>
      <body>
        <ClientLayout>
          <SiteChrome>{children}</SiteChrome>
        </ClientLayout>
      </body>
    </html>
  );
}
