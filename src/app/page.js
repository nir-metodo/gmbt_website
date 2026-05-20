import { buildMetadata } from '@/lib/pageMeta';
import HomeContent from '@/components/Home/HomeContent';

export const metadata = buildMetadata('home', {
  title: 'Gambot | גמבוט — WhatsApp Business API Platform Israel | AI Bot, Automation & CRM',
  description: 'Gambot (גמבוט) — Israel\'s leading WhatsApp Business API platform. Official Meta Partner. AI chatbot, automation, campaigns, CRM & customer service 24/7. Free trial.',
});

export default function HomePage() {
  return <HomeContent />;
}
