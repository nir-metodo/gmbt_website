import OneTimeBroadcastWizard from '@/components/OneTimeBroadcast/OneTimeBroadcastWizard';

export const metadata = {
  title: 'דיוור חד פעמי בוואטסאפ — עשה זאת בעצמך | גמבוט',
  description:
    'שלחו דיוור וואטסאפ חד פעמי לרשימה שלכם בלי מנוי: מעלים אקסל, יוצרים תבנית עם שדות אישיים מהקובץ, משלמים ומתזמנים. מחיר מדורג להודעה, כולל עלויות Meta.',
  alternates: { canonical: 'https://gambot.co.il/one-time-broadcast/' },
};

export default function OneTimeBroadcastPage() {
  return <OneTimeBroadcastWizard />;
}
