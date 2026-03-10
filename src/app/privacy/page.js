import PrivacyPolicy from '@/components/Legal/PrivacyPolicy';

export const metadata = {
  title: 'מדיניות פרטיות | גמבוט',
  description: 'מדיניות הפרטיות של מערכת גמבוט לניהול וואטסאפ עסקי',
  alternates: { canonical: 'https://gambot.co.il/privacy/' },
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
