import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-bot-builder');

export default function WhatsAppBotBuilderEnPage() {
  return <EnSolutionPage slug="whatsapp-bot-builder" />;
}
