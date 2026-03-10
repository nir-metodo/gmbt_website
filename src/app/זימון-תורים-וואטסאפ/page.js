import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappAppointment');

export default function AppointmentBookingPage() {
  return <LandingPageContent content={SOLUTIONS.appointmentBooking} />;
}
