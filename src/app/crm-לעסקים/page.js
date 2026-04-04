import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import CrmPage from '@/components/CrmPage/CrmPage';

export const metadata = buildMetadata('crmHe');

export default function CrmLandingPage() {
  return (
    <>
      {PAGE_META.crmHe.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.crmHe.schema) }}
        />
      )}
      <CrmPage />
    </>
  );
}
