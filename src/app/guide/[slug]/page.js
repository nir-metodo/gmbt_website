import { notFound } from 'next/navigation';
import { getLocalizedGuides } from '@/lib/guideData';
import GuideDetailContent from '@/components/Guide/GuideDetailContent';

export async function generateStaticParams() {
  const guides = getLocalizedGuides('he');
  return guides.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guides = getLocalizedGuides('he');
  const guide = guides.find(g => g.slug === slug);
  if (!guide) return { title: 'מדריך לא נמצא' };

  return {
    title: `${guide.title} | מדריך גמבוט`,
    description: guide.description,
    alternates: { canonical: `https://gambot.co.il/guide/${slug}/` },
    openGraph: {
      title: `${guide.title} | מדריך גמבוט`,
      description: guide.description,
      url: `https://gambot.co.il/guide/${slug}/`,
    },
  };
}

export default async function GuideDetailPage({ params }) {
  const { slug } = await params;
  const guides = getLocalizedGuides('he');
  const guide = guides.find(g => g.slug === slug);
  if (!guide) notFound();

  // Pass guide ID so the client component can re-fetch in any language
  return <GuideDetailContent guideId={guide.id} slug={slug} />;
}
