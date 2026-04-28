import AboutContent from '@/components/About/AboutContent';
import { buildMetadata } from '@/lib/pageMeta';

export const metadata = buildMetadata('about');

export default function AboutPage() {
  return <AboutContent />;
}
