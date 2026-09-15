import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import DeveloperGuideContent from '@/components/Developers/DeveloperGuideContent';

export const metadata = buildMetadata('developers');

export default function DevelopersPage() {
  return (
    <>
      {PAGE_META.developers?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.developers.schema) }}
        />
      )}
      <DeveloperGuideContent />
    </>
  );
}
