import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import LandingPagesPage from '@/components/LandingPagesPage/LandingPagesPage';

export const metadata = buildMetadata('landingPages');

export default function LandingPagesLeadsPage() {
  return (
    <>
      {PAGE_META.landingPages?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.landingPages.schema) }}
        />
      )}
      <LandingPagesPage />
    </>
  );
}
