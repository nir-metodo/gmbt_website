import { buildMetadata } from '@/lib/pageMeta';
import OldPriceList from '@/components/Pricing/OldPriceList';

export const metadata = buildMetadata('pricing');

export default function PriceListPage() {
  return <OldPriceList />;
}
