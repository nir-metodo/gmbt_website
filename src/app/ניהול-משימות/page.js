import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('taskManagement');

export default function TaskManagementPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.taskManagement.schema) }}
      />
      <LandingPageContent content={SOLUTIONS.taskManagement} />
    </>
  );
}
