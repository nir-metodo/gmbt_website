import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-shared-inbox');

export default function WhatsAppSharedInboxEnPage() {
  return <EnSolutionPage slug="whatsapp-shared-inbox" />;
}
