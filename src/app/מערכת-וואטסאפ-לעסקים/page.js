import WhatsAppBusinessPage from '@/components/WhatsAppBusinessPage/WhatsAppBusinessPage';

export const metadata = {
  alternates: {
    canonical: 'https://gambot.co.il/מערכת-וואטסאפ-לעסקים/',
    languages: { he: 'https://gambot.co.il/מערכת-וואטסאפ-לעסקים/', en: 'https://gambot.co.il/whatsapp-business-system/', 'x-default': 'https://gambot.co.il/whatsapp-business-system/' },
  },
  title: 'ריבוי נציגים בוואטסאפ | מערכת וואטסאפ לעסקים עם CRM',
  description: 'ריבוי נציגים על מספר וואטסאפ אחד: כל השיחות במקום אחד, שיוך לנציגים, סטטוסים וסינון, לידים, פניות והצעות מחיר — עם בוט AI ואפליקציה לנייד. ניסיון חינם.',
  robots: 'index, follow',
};

export default function WhatsAppBusinessLandingPage() {
  return <WhatsAppBusinessPage />;
}
