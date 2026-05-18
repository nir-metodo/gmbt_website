import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('employeeTimeTracking');

export default function EmployeeTimeTrackingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.employeeTimeTracking.schema) }}
      />
      <LandingPageContent content={SOLUTIONS.employeeTimeTracking} />
    </>
  );
}
