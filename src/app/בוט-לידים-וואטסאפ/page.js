import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('aiLeadBot');

export default function WhatsAppLeadsBotPage() {
  return <LandingPageContent content={SOLUTIONS.whatsappLeadsBot} />;
}
