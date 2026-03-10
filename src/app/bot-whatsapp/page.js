import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappBot');

export default function BotWhatsAppPage() {
  return <LandingPageContent content={SOLUTIONS.whatsappBot} />;
}
