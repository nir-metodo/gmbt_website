import WhatsAppMessagingPricing from '@/components/Pricing/WhatsAppMessagingPricing';

export const metadata = {
  title: 'מדריך תמחור WhatsApp Business API | גמבוט',
  description: 'מדריך מקיף לתמחור WhatsApp Business API – הבנת מחירי הודעות לפי מדינה, סוג שיחה, ומחשבון עלות אינטראקטיבי.',
  keywords: ['תמחור WhatsApp', 'מחיר הודעת WhatsApp', 'WhatsApp API pricing', 'מחשבון WhatsApp', 'Meta pricing'],
  alternates: { canonical: 'https://gambot.co.il/PriceList/WhatsAppMessagingPricingBlog/' },
  openGraph: {
    title: 'מדריך תמחור WhatsApp Business API | גמבוט',
    description: 'מחשבון עלות הודעות WhatsApp לפי מדינה וסוג הודעה – מידע מעודכן מטא 2025',
    url: 'https://gambot.co.il/PriceList/WhatsAppMessagingPricingBlog/',
  },
};

export default function WhatsAppMessagingPricingBlogPage() {
  return <WhatsAppMessagingPricing />;
}
