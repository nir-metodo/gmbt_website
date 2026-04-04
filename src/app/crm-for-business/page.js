import { buildMetadata } from '@/lib/pageMeta';
import CrmPageEn from '@/components/CrmPage/CrmPageEn';

export const metadata = buildMetadata('crmEn');

export default function CrmEnLandingPage() {
  return <CrmPageEn />;
}
