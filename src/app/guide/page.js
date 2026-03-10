import { buildMetadata } from '@/lib/pageMeta';
import GuideHomeContent from '@/components/Guide/GuideHomeContent';

export const metadata = buildMetadata('guide');

export default function GuidePage() {
  return <GuideHomeContent />;
}
