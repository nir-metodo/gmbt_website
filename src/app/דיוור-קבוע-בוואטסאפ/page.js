import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('recurringBroadcast');

export default function RecurringBroadcastPage() {
  return (
    <>
      {PAGE_META.recurringBroadcast?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.recurringBroadcast.schema) }}
        />
      )}
      <LandingPageContent content={SOLUTIONS.whatsappRecurringBroadcast} />
    </>
  );
}
