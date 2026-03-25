import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappAiBot');

export default function WhatsAppAiBotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.whatsappAiBot.schema) }}
      />
      <LandingPageContent content={SOLUTIONS.whatsappAiBot} />
    </>
  );
}
