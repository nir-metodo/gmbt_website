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
    default: 'Gambot | מערכת WhatsApp API מובילה בישראל',
    template: '%s | גמבוט',
  },
  description: 'גמבוט - שותף מטא רשמי. בוט AI לוואטסאפ, אוטומציה, קמפיינים ושירות לקוחות 24/7. התחילו ניסיון חינם.',
  keywords: [
    'WhatsApp API ישראל', 'בוט וואטסאפ', 'אוטומציה וואטסאפ', 'שיווק בוואטסאפ',
    'WhatsApp Business API', 'בוט AI', 'מערכת וואטסאפ עסקי', 'Gambot', 'גמבוט',
    'CRM וואטסאפ', 'דיוור בוואטסאפ', 'קמפיינים בוואטסאפ',
  ],
  authors: [{ name: 'Gambot', url: 'https://gambot.co.il' }],
  creator: 'Gambot',
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
    siteName: 'Gambot - WhatsApp API ישראל',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Gambot WhatsApp API' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Gambot',
    creator: '@Gambot',
  },
  alternates: {
    canonical: 'https://gambot.co.il',
    languages: { 'he': 'https://gambot.co.il', 'en': 'https://gambot.co.il/en' },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual
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
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GFMXYNTV1N" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GFMXYNTV1N');
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
