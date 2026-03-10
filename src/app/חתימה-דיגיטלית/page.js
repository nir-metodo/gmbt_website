import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('digitalSignature');

export default function DigitalSignaturePage() {
  return <LandingPageContent content={SOLUTIONS.digitalSignature} />;
}
