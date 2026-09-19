import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-marketing-reports');

export default function WhatsAppMarketingReportsEnPage() {
  return <EnSolutionPage slug="whatsapp-marketing-reports" />;
}
