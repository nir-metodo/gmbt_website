import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('quotations');

export default function QuotationsPage() {
  return <LandingPageContent content={SOLUTIONS.quotations} />;
}
