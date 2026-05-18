import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('digitalInvoices');

export default function DigitalInvoicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.digitalInvoices.schema) }}
      />
      <LandingPageContent content={SOLUTIONS.digitalInvoices} />
    </>
  );
}
