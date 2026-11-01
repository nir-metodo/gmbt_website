import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappBotGuide');

export default function WhatsAppBotGuidePage() {
  return <LandingPageContent content={SOLUTIONS.whatsappBotGuide} />;
}