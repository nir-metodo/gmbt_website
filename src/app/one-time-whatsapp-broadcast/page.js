import OneTimeBroadcastLandingEn from '@/components/OneTimeBroadcast/OneTimeBroadcastLandingEn';

const CANONICAL = 'https://gambot.co.il/one-time-whatsapp-broadcast/';
const HE = 'https://gambot.co.il/%D7%93%D7%99%D7%95%D7%95%D7%A8-%D7%97%D7%93-%D7%A4%D7%A2%D7%9E%D7%99/';
const TITLE = 'One-Time WhatsApp Broadcast — No Number, No Meta Verification | From ₪49';
const DESCRIPTION =
  'Need to send one WhatsApp message to a list — for example an invitation to a WhatsApp group? Upload Excel, write a message, pay and schedule. No dedicated number, no Meta business verification and no subscription. From ₪49 before VAT.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    'one-time WhatsApp broadcast, send WhatsApp message to a list, WhatsApp group invitation broadcast, WhatsApp broadcast without business number, WhatsApp broadcast without Meta verification, bulk WhatsApp message, Gambot',
  alternates: {
    canonical: CANONICAL,
    languages: { he: HE, en: CANONICAL, 'x-default': CANONICAL },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    siteName: 'Gambot',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://gambot.co.il/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://gambot.co.il/og-image.jpg'] },
};

export default function OneTimeWhatsAppBroadcastEnPage() {
  return <OneTimeBroadcastLandingEn />;
}
