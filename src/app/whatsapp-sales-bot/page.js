import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-sales-bot');

export default function WhatsAppSalesBotEnPage() {
  return <EnSolutionPage slug="whatsapp-sales-bot" />;
}
