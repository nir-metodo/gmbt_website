import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('telephonyWhatsApp');

export default function TelephonyWhatsAppPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.telephonyWhatsApp.schema) }}
      />
      <LandingPageContent content={SOLUTIONS.telephonyWhatsApp} />
    </>
  );
}
