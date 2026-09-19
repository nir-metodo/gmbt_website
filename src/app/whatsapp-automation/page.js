import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-automation');

export default function WhatsAppAutomationEnPage() {
  return <EnSolutionPage slug="whatsapp-automation" />;
}
