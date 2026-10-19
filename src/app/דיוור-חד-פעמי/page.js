import { buildMetadata } from '@/lib/pageMeta';
import OneTimeBroadcastLanding from '@/components/OneTimeBroadcast/OneTimeBroadcastLanding';

export const metadata = buildMetadata('oneTimeBroadcast');

export default function OneTimeBroadcastLandingPage() {
  return <OneTimeBroadcastLanding />;
}
