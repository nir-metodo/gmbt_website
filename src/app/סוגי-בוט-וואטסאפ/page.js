import BotTypesPage from '@/components/BotTypesPage/BotTypesPage';

export const metadata = {
  title: 'איזה בוט וואטסאפ מתאים לכם? | Gambot',
  description: 'בוט חכם, בוט AI או בוט משולב — השוו בין שלושת הסוגים ובחרו מה שמתאים לעסק שלכם. ייעוץ חינמי ללא התחייבות.',
  robots: 'index, follow',
};

export default function BotTypesLandingPage() {
  return <BotTypesPage />;
}
