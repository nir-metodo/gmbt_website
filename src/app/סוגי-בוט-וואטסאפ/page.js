import BotTypesPage from '@/components/BotTypesPage/BotTypesPage';

export const metadata = {
  alternates: {
    canonical: 'https://gambot.co.il/סוגי-בוט-וואטסאפ/',
    languages: { he: 'https://gambot.co.il/סוגי-בוט-וואטסאפ/', en: 'https://gambot.co.il/whatsapp-bot-types/', 'x-default': 'https://gambot.co.il/whatsapp-bot-types/' },
  },
  title: 'איזה בוט וואטסאפ מתאים לכם?',
  description: 'בוט חכם, בוט AI או בוט משולב — השוו בין שלושת הסוגים ובחרו מה שמתאים לעסק שלכם. ייעוץ חינמי ללא התחייבות.',
  robots: 'index, follow',
};

export default function BotTypesLandingPage() {
  return <BotTypesPage />;
}
