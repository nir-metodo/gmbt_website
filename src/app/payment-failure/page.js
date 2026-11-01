import PaymentFailure from '@/components/OnBoard/PaymentFailure';

export const metadata = {
  robots: { index: false, follow: false },
  title: 'תשלום נכשל',
  description: 'אירעה שגיאה בעת אימות פרטי התשלום.',
};

export default function PaymentFailurePage() {
  return <PaymentFailure />;
}
