import { buildMetadata } from '@/lib/pageMeta';
import HomeContent from '@/components/Home/HomeContent';

export const metadata = buildMetadata('home');

export default function HomePage() {
  return <HomeContent />;
}
