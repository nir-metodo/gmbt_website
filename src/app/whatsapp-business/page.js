import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-business');

export default function WhatsAppBusinessEnPage() {
  return <EnSolutionPage slug="whatsapp-business" />;
}
