import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('customerServiceBot');

export default function CustomerServiceBotPage() {
  return <LandingPageContent content={SOLUTIONS.customerServiceBot} />;
}
