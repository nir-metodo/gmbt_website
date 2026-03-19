import PaymentFailure from '@/components/OnBoard/PaymentFailure';

export const metadata = {
  title: 'תשלום נכשל | Gambot',
  description: 'אירעה שגיאה בעת אימות פרטי התשלום.',
};

export default function PaymentFailurePage() {
  return <PaymentFailure />;
}
