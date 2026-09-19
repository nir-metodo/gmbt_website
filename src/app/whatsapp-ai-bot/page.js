import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-ai-bot');

export default function WhatsAppAiBotEnPage() {
  return <EnSolutionPage slug="whatsapp-ai-bot" />;
}
