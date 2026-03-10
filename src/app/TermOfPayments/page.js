import TermOfPayments from '@/components/Legal/TermOfPayments';

export const metadata = {
  title: 'תנאי תשלום | גמבוט',
  description: 'תנאי התשלום של מערכת גמבוט לניהול וואטסאפ עסקי',
  alternates: { canonical: 'https://gambot.co.il/TermOfPayments/' },
};

export default function TermOfPaymentsPage() {
  return <TermOfPayments />;
}
