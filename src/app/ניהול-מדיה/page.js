import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('mediaManagement');
// page repurposed: ניהול-מדיה → דוחות שיווק וואטסאפ

export default function MediaManagementPage() {
  return <LandingPageContent content={SOLUTIONS.mediaManagement} />;
}
