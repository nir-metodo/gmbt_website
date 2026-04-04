import ServiceRequestContent from '@/components/Support/ServiceRequestContent';

export const metadata = {
  title: 'פתיחת בקשת שירות | Gambot',
  description: 'פתחו בקשת שירות ותמיכה טכנית למערכת Gambot',
  robots: { index: false },
};

export default function SupportPage() {
  return <ServiceRequestContent />;
}
