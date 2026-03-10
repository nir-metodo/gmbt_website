import { buildMetadata } from '@/lib/pageMeta';
import BlogContent from '@/components/Blog/BlogContent';

export const metadata = buildMetadata('blog');

export default function BlogPage() {
  return <BlogContent />;
}
