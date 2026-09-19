import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-newsletter');

export default function WhatsAppNewsletterEnPage() {
  return <EnSolutionPage slug="whatsapp-newsletter" />;
}
