import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappBot');

export default function WhatsAppBotPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.whatsappBot.schema) }} />
      <LandingPageContent content={SOLUTIONS.whatsappBot} />
    </>
  );
}
