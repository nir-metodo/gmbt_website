import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('marketingSystem');

export default function WhatsAppMarketingSystemPage() {
  return <LandingPageContent content={SOLUTIONS.whatsappMarketingSystem} />;
}
