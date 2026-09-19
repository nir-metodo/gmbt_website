import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-chatbot');

export default function WhatsAppChatbotEnPage() {
  return <EnSolutionPage slug="whatsapp-chatbot" />;
}
