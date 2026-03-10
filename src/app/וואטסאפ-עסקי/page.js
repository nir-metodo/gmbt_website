import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappBusiness');

export default function WhatsAppBusinessPage() {
  return <LandingPageContent content={SOLUTIONS.whatsappBusiness} />;
}
