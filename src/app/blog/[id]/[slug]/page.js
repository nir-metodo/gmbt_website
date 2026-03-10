import { notFound } from 'next/navigation';
import posts, { getSeoUrl } from '@/lib/posts';
import BlogPostContent from '@/components/blog/BlogPostContent';

function getPost(id) {
  return posts.find(p => String(p.id) === String(id));
}

export async function generateStaticParams() {
  return posts.flatMap(post => {
    const params = [];
    const heTitle = typeof post.title === 'object' ? post.title.he : post.title;
    const enTitle = typeof post.title === 'object' ? post.title.en : post.title;
    params.push({ id: String(post.id), slug: getSeoUrl(heTitle) });
    if (enTitle && getSeoUrl(enTitle) !== getSeoUrl(heTitle)) {
      params.push({ id: String(post.id), slug: getSeoUrl(enTitle) });
    }
    return params;
  });
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = getPost(id);
  if (!post) return { title: 'פוסט לא נמצא' };

  const seoTitle = typeof post.seoTitle === 'object' ? post.seoTitle.he : (post.seoTitle || post.title?.he || post.title);
  const metaDesc = typeof post.metaDescription === 'object' ? post.metaDescription.he : (post.metaDescription || post.description?.he || post.description);
  const heTitle = typeof post.title === 'object' ? post.title.he : post.title;
  const slug = getSeoUrl(heTitle);

  return {
    title: seoTitle,
    description: metaDesc,
    alternates: { canonical: `https://gambot.co.il/blog/${post.id}/${slug}/` },
    openGraph: {
      title: seoTitle,
      description: metaDesc,
      url: `https://gambot.co.il/blog/${post.id}/${slug}/`,
      type: 'article',
      publishedTime: post.publishedDate,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const post = getPost(id);
  if (!post) notFound();

  return <BlogPostContent post={post} />;
}
