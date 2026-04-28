import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('multiNumber');

export default function MultiNumberPage() {
  return <LandingPageContent content={SOLUTIONS.multiNumber} />;
}
