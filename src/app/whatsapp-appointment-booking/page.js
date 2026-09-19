import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-appointment-booking');

export default function WhatsAppAppointmentBookingEnPage() {
  return <EnSolutionPage slug="whatsapp-appointment-booking" />;
}
