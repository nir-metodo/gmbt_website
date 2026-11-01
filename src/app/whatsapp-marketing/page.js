import WhatsAppMarketingPageEn from '@/components/WhatsAppMarketingPage/WhatsAppMarketingPageEn';

export const metadata = {
  alternates: {
    canonical: 'https://gambot.co.il/whatsapp-marketing/',
    languages: { he: 'https://gambot.co.il/שיווק-בוואטסאפ-לעסקים/', en: 'https://gambot.co.il/whatsapp-marketing/', 'x-default': 'https://gambot.co.il/whatsapp-marketing/' },
  },
  title: 'WhatsApp Marketing for Business | 95%+ Open Rate',
  description: 'Send WhatsApp marketing campaigns with 95%+ open rate. Perfect for cold leads and existing customers. The bot automatically warms up prospects and qualifies them.',
  robots: 'index, follow',
};

export default function WhatsAppMarketingEnPage() {
  return <WhatsAppMarketingPageEn />;
}
