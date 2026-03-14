import { notFound } from 'next/navigation';
import posts, { getSeoUrl } from '@/lib/posts';
import BlogPostContent from '@/components/blog/BlogPostContent';

const SITE = 'https://gambot.co.il';

function getPost(id) {
  return posts.find(p => String(p.id) === String(id));
}

function loc(val, lang) {
  if (!val) return '';
  if (typeof val === 'object') return val[lang] || val.he || val.en || '';
  return val;
}

export async function generateStaticParams() {
  return posts.flatMap(post => {
    const params = [];
    const heTitle = loc(post.title, 'he');
    const enTitle = loc(post.title, 'en');
    params.push({ id: String(post.id), slug: getSeoUrl(heTitle) });
    if (enTitle && getSeoUrl(enTitle) !== getSeoUrl(heTitle)) {
      params.push({ id: String(post.id), slug: getSeoUrl(enTitle) });
    }
    return params;
  });
}

export async function generateMetadata({ params }) {
  const { id, slug } = await params;
  const post = getPost(id);
  if (!post) return { title: 'פוסט לא נמצא' };

  const heTitle = loc(post.title, 'he');
  const enTitle = loc(post.title, 'en');
  const heSlug = getSeoUrl(heTitle);
  const enSlug = enTitle ? getSeoUrl(enTitle) : heSlug;

  // Detect language from slug
  const lang = slug === enSlug && enSlug !== heSlug ? 'en' : 'he';
  const currentSlug = lang === 'en' ? enSlug : heSlug;

  const seoTitle  = loc(post.seoTitle, lang)      || loc(post.title, lang);
  const metaDesc  = loc(post.metaDescription, lang) || loc(post.description, lang);
  const keywords  = loc(post.keywords, lang)       || '';
  const image     = post.image || '/new_logo.png';
  const canonical = `${SITE}/blog/${post.id}/${currentSlug}/`;

  // hreflang alternates for bilingual posts
  const languages = { 'he': `${SITE}/blog/${post.id}/${heSlug}/` };
  if (enSlug !== heSlug) languages['en'] = `${SITE}/blog/${post.id}/${enSlug}/`;
  languages['x-default'] = `${SITE}/blog/${post.id}/${heSlug}/`;

  return {
    title: seoTitle,
    description: metaDesc,
    keywords,
    authors: [{ name: post.author || 'גמבוט' }],
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: seoTitle,
      description: metaDesc,
      url: canonical,
      type: 'article',
      publishedTime: post.publishedDate,
      modifiedTime: post.modifiedDate || post.publishedDate,
      authors: [post.author || 'גמבוט'],
      locale: lang === 'en' ? 'en_US' : 'he_IL',
      images: [{ url: `${SITE}${image}`, width: 1200, height: 630, alt: seoTitle }],
      siteName: 'גמבוט | Gambot',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: metaDesc,
      images: [`${SITE}${image}`],
    },
    robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  };
}

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const post = getPost(id);
  if (!post) notFound();

  return <BlogPostContent post={post} />;
}
