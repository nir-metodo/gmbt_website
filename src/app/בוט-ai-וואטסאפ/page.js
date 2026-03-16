import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappAiBot');

export default function WhatsAppAiBotPage() {
  return <LandingPageContent content={SOLUTIONS.whatsappAiBot} />;
}
