import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappAutomationPro');

export default function WhatsAppAutomationProPage() {
  return (
    <>
      {PAGE_META.whatsappAutomationPro?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.whatsappAutomationPro.schema) }}
        />
      )}
      <LandingPageContent content={SOLUTIONS.whatsappAutomationPro} />
    </>
  );
}
