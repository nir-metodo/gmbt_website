import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappMarketing');

export default function WhatsAppMarketingPage() {
  return <LandingPageContent content={SOLUTIONS.whatsappMarketing} />;
}
