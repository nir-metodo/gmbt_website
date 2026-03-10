import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('salesBot');

export default function SalesBotPage() {
  return <LandingPageContent content={SOLUTIONS.salesBot} />;
}
