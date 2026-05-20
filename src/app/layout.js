import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ClientLayout from '@/components/ClientLayout/ClientLayout';

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
    siteName: 'Gambot — WhatsApp Business API Israel',
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
  other: {
    'geo.region': 'IL',
    'geo.country': 'Israel',
    'geo.placename': 'Tel Aviv, Israel',
    'ICBM': '32.0853, 34.7818',
    'content-language': 'he',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <head>
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
                  areaServed: { '@type': 'Country', name: 'Israel' },
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
                  alternateName: 'גמבוט',
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
        {/* Google Analytics + Google Ads */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18018385768" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GFMXYNTV1N');
              gtag('config', 'AW-18018385768');
            `,
          }}
        />
      </head>
      <body>
        <ClientLayout>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
