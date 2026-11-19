import SchoolBotPage from '@/components/SchoolBotPage/SchoolBotPage';

export const metadata = {
  title: 'וואטסאפ לבתי ספר | בוט שמסדיר את התקשורת בין הורים למורים',
  description:
    'מערכת שעות, מבחנים, טפסים, אישורים, חתימות דיגיטליות ופניות לצוות, הכול בוואטסאפ של בית הספר. ההורים מקבלים תשובה מיד והמורים מתפנים להוראה.',
  keywords:
    'וואטסאפ לבתי ספר, בוט לבית ספר, תקשורת הורים ומורים, חתימה דיגיטלית לבית ספר, וואטסאפ למורים, אוטומציה לבתי ספר, חינוך וטכנולוגיה, Gambot',
  alternates: { canonical: 'https://gambot.co.il/וואטסאפ-לבתי-ספר/' },
  robots: 'index, follow',
};

export default function SchoolsLandingPage() {
  return <SchoolBotPage />;
}
