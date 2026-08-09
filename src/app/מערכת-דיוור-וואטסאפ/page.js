import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappBroadcast');

export default function WhatsAppBroadcastPage() {
  return (
    <>
      {PAGE_META.whatsappBroadcast?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.whatsappBroadcast.schema) }}
        />
      )}
      <LandingPageContent content={SOLUTIONS.whatsappBroadcast} />
    </>
  );
}
