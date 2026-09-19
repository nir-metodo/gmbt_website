import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-campaigns');

export default function WhatsAppCampaignsEnPage() {
  return <EnSolutionPage slug="whatsapp-campaigns" />;
}
