import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-ai-lead-bot');

export default function WhatsAppAiLeadBotEnPage() {
  return <EnSolutionPage slug="whatsapp-ai-lead-bot" />;
}
