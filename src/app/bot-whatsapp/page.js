import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('bot-whatsapp');

export default function BotWhatsAppPage() {
  return <EnSolutionPage slug="bot-whatsapp" />;
}
