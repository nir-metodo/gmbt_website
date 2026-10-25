import AccessibilityStatement from '@/components/Compliance/AccessibilityStatement';

export const metadata = {
  title: 'הצהרת נגישות | Accessibility Statement',
  description: 'הצהרת הנגישות של גמבוט — התאמות שבוצעו באתר, מגבלות ידועות ויצירת קשר עם רכז הנגישות. Gambot accessibility statement.',
  alternates: { canonical: 'https://gambot.co.il/accessibility/' },
};

export default function AccessibilityPage() {
  return <AccessibilityStatement />;
}
