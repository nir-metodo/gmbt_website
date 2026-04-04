import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import LeadsPage from '@/components/LeadsPage/LeadsPage';

export const metadata = buildMetadata('leadsManagement');

export default function LeadsManagementPage() {
  return (
    <>
      {PAGE_META.leadsManagement?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.leadsManagement.schema) }}
        />
      )}
      <LeadsPage />
    </>
  );
}
