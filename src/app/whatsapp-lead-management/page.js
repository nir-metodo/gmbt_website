import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-lead-management');

export default function WhatsAppLeadManagementEnPage() {
  return <EnSolutionPage slug="whatsapp-lead-management" />;
}
