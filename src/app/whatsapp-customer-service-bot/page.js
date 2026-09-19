import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-customer-service-bot');

export default function WhatsAppCustomerServiceBotEnPage() {
  return <EnSolutionPage slug="whatsapp-customer-service-bot" />;
}
