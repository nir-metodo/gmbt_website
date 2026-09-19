import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-automation-guide');

export default function WhatsAppAutomationGuideEnPage() {
  return <EnSolutionPage slug="whatsapp-automation-guide" />;
}
