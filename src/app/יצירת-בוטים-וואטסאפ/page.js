import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappBotBuilder');

export default function WhatsAppBotBuilderPage() {
  return (
    <>
      {PAGE_META.whatsappBotBuilder?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.whatsappBotBuilder.schema) }}
        />
      )}
      <LandingPageContent content={SOLUTIONS.whatsappBotBuilder} />
    </>
  );
}
