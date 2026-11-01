import BotTypesPageEn from '@/components/BotTypesPage/BotTypesPageEn';

export const metadata = {
  alternates: {
    canonical: 'https://gambot.co.il/whatsapp-bot-types/',
    languages: { he: 'https://gambot.co.il/סוגי-בוט-וואטסאפ/', en: 'https://gambot.co.il/whatsapp-bot-types/', 'x-default': 'https://gambot.co.il/whatsapp-bot-types/' },
  },
  title: 'WhatsApp Bot Types: Smart Bot vs AI Bot vs Hybrid',
  description: 'Compare WhatsApp bot types — rule-based, AI and hybrid. See live examples, understand the differences, and get a free recommendation for your business.',
  robots: 'index, follow',
};

export default function BotTypesEnPage() {
  return <BotTypesPageEn />;
}
