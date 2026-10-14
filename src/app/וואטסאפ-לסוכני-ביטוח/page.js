import InsuranceAgentsPage from '@/components/InsuranceAgentsPage/InsuranceAgentsPage';

export const metadata = {
  title: 'וואטסאפ לסוכני ביטוח | בוט חידושים ובוט שירות לסוכנות | Gambot',
  description:
    'מעלים אקסל של המחדשים החודש, ולכל לקוח נשלחת הודעה אישית בוואטסאפ. הלקוח מאשר או מעדכן שינוי, והבוט אוסף את הפרטים. חידוש דירה, רכב, עסק ואחריות מקצועית, ובוט שירות כללי לסוכנות.',
  keywords:
    'וואטסאפ לסוכני ביטוח, חידוש פוליסה בוואטסאפ, בוט לסוכנות ביטוח, אוטומציה לסוכני ביטוח, חידושי ביטוח, Gambot',
  alternates: { canonical: 'https://gambot.co.il/וואטסאפ-לסוכני-ביטוח/' },
  robots: 'index, follow',
};

export default function InsuranceAgentsLandingPage() {
  return <InsuranceAgentsPage />;
}
