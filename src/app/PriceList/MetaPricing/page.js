import MetaPricingTable from '@/components/Pricing/MetaPricingTable';

export const metadata = {
  title: 'מחירון Meta WhatsApp לפי מדינה 2025 | גמבוט',
  description: 'טבלת מחירים מלאה של WhatsApp Business API לפי מדינה וסוג הודעה – שיווק, שירות ואימות. מחירים עדכניים מאוקטובר 2025.',
  keywords: ['מחירון WhatsApp', 'Meta WhatsApp pricing', 'מחיר הודעת WhatsApp לפי מדינה', 'WhatsApp API cost', 'תעריף WhatsApp'],
  alternates: { canonical: 'https://gambot.co.il/PriceList/MetaPricing/' },
  openGraph: {
    title: 'מחירון Meta WhatsApp לפי מדינה 2025 | גמבוט',
    description: 'טבלת מחירים מלאה של WhatsApp API לפי מדינה – שיווק, שירות, אימות',
    url: 'https://gambot.co.il/PriceList/MetaPricing/',
  },
};

export default function MetaPricingPage() {
  return <MetaPricingTable />;
}
