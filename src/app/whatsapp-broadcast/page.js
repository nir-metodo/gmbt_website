import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-broadcast');

export default function WhatsAppBroadcastEnPage() {
  return <EnSolutionPage slug="whatsapp-broadcast" />;
}
