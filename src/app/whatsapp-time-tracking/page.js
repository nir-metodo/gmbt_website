import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-time-tracking');

export default function WhatsAppTimeTrackingEnPage() {
  return <EnSolutionPage slug="whatsapp-time-tracking" />;
}
