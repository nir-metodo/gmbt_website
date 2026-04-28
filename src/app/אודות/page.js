import AboutContent from '@/components/About/AboutContent';
import { buildMetadata } from '@/lib/pageMeta';

export const metadata = buildMetadata('about', {
  canonical: 'https://gambot.co.il/about/',
});

export default function AboutPageHe() {
  return <AboutContent />;
}
