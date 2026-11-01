import WhatsAppBusinessPageEn from '@/components/WhatsAppBusinessPage/WhatsAppBusinessPageEn';

export const metadata = {
  alternates: {
    canonical: 'https://gambot.co.il/whatsapp-business-system/',
    languages: { he: 'https://gambot.co.il/מערכת-וואטסאפ-לעסקים/', en: 'https://gambot.co.il/whatsapp-business-system/', 'x-default': 'https://gambot.co.il/whatsapp-business-system/' },
  },
  title: 'WhatsApp Business System | Multi-Agent + CRM',
  description: 'Manage all WhatsApp conversations in one place — multiple agents, conversation ownership and status, smart routing, leads, cases, quotes and advanced reports. Stop losing customers.',
  robots: 'index, follow',
};

export default function WhatsAppBusinessEnPage() {
  return <WhatsAppBusinessPageEn />;
}
