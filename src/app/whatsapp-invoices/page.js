import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-invoices');

export default function WhatsAppInvoicesEnPage() {
  return <EnSolutionPage slug="whatsapp-invoices" />;
}
