import CampaignPageEn from '@/components/CampaignPage/CampaignPageEn';

export const metadata = {
  alternates: { canonical: 'https://gambot.co.il/whatsapp-bot-campaign/' },
  title: 'WhatsApp Bot for Business | 24/7 Automation',
  description: 'A WhatsApp bot that responds 24/7, filters leads, books appointments, and transfers to a human agent only when needed. Free trial, no commitment.',
  robots: 'index, follow',
};

export default function WhatsAppBotCampaignEnPage() {
  return <CampaignPageEn />;
}
