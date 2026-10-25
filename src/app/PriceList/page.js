import { buildMetadata } from '@/lib/pageMeta';
import PriceListPage from '@/components/Pricing/PriceListPage';

export const metadata = buildMetadata('pricing');

export default function PriceListRoute() {
  return <PriceListPage />;
}
