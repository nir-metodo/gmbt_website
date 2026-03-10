import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappAutomation');

export default function WhatsAppAutomationPage() {
  return <LandingPageContent content={SOLUTIONS.whatsappAutomation} />;
}
