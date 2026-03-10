import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappCampaigns');

export default function WhatsAppCampaignsPage() {
  return <LandingPageContent content={SOLUTIONS.whatsappCampaigns} />;
}
