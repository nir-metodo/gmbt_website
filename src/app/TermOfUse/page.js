import TermOfUse from '@/components/Legal/TermOfUse';

export const metadata = {
  title: 'תנאי שימוש | גמבוט',
  description: 'תנאי השימוש של מערכת גמבוט לניהול וואטסאפ עסקי',
  alternates: { canonical: 'https://gambot.co.il/TermOfUse/' },
};

export default function TermOfUsePage() {
  return <TermOfUse />;
}
