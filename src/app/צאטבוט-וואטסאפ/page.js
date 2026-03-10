import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappChatbot');

export default function WhatsAppChatbotPage() {
  return <LandingPageContent content={SOLUTIONS.whatsappChatbot} />;
}
