import ManagedBroadcastContent from '@/components/Pricing/ManagedBroadcastContent';

export const metadata = {
  title: 'דיוור חד־פעמי בוואטסאפ API — שירות מנוהל | גמבוט',
  description:
    'שירות דיוור חד־פעמי מנוהל בוואטסאפ API: אתם שולחים לנו את מלל ההודעה ומתי, אנחנו שולחים מהמספר שלנו ומטפלים בהכול. המחיר כולל את עלויות השליחה של WhatsApp/Meta. תמחור לפי הודעה — החל מ־₪0.90. מינימום 500 הודעות.',
  alternates: { canonical: 'https://gambot.co.il/PriceList/ManagedBroadcast/' },
};

export default function ManagedBroadcastPage() {
  return <ManagedBroadcastContent />;
}
