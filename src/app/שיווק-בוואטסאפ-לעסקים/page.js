import WhatsAppMarketingPage from '@/components/WhatsAppMarketingPage/WhatsAppMarketingPage';

export const metadata = {
  alternates: {
    canonical: 'https://gambot.co.il/שיווק-בוואטסאפ-לעסקים/',
    languages: { he: 'https://gambot.co.il/שיווק-בוואטסאפ-לעסקים/', en: 'https://gambot.co.il/whatsapp-marketing/', 'x-default': 'https://gambot.co.il/whatsapp-marketing/' },
  },
  title: 'שיווק בוואטסאפ לעסקים | 98% אחוז פתיחה',
  description: 'שלחו קמפיינים שיווקיים בוואטסאפ עם אחוז פתיחה של 95%+. מיועד ללידים רטרו ולקוחות קיימים. הבוט מחמם מתעניינים אוטומטית.',
  robots: 'index, follow',
};

export default function WhatsAppMarketingLandingPage() {
  return <WhatsAppMarketingPage />;
}
