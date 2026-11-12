import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('recurring-whatsapp-broadcast');

export default function RecurringWhatsAppBroadcastEnPage() {
  return <EnSolutionPage slug="recurring-whatsapp-broadcast" />;
}
