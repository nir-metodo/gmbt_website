import { buildMetadata } from '@/lib/pageMeta';
import HomeContent from '@/components/Home/HomeContent';

export const metadata = buildMetadata('home', {
  title: 'גמבוט | מערכת WhatsApp API מובילה בישראל | בוט AI, אוטומציה, קמפיינים',
  description: 'גמבוט - שותף מטא רשמי בישראל. בוט AI לוואטסאפ, אוטומציה חכמה, קמפיינים ודיוור המוני. ניסיון חינם חודש.',
});

export default function HomePage() {
  return <HomeContent />;
}
