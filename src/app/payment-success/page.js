import PaymentSuccess from '@/components/OnBoard/PaymentSuccess';

export const metadata = {
  robots: { index: false, follow: false },
  title: 'תשלום הצליח',
  description: 'פרטי התשלום נשמרו בהצלחה.',
};

export default function PaymentSuccessPage() {
  return <PaymentSuccess />;
}
