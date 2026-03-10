import dynamic from 'next/dynamic';

export const metadata = {
  title: 'בונה בוט וואטסאפ חינמי | גמבוט',
  description: 'בנה בוט וואטסאפ חכם בחינם עם גמבוט. צור תרחישי שיחה, אוטומציות ותגובות אוטומטיות בכמה דקות - ללא קידוד.',
  keywords: ['בוט וואטסאפ', 'בניית בוט', 'bot builder', 'WhatsApp bot', 'אוטומציה'],
  alternates: { canonical: 'https://gambot.co.il/bot-builder/' },
};

const BotFlowBuilderPage = dynamic(
  () => import('@/components/BotFlowBuilderPage/BotFlowBuilderPage'),
  { ssr: false, loading: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' }}>טוען...</div> }
);

export default function BotBuilderPage() {
  return <BotFlowBuilderPage />;
}
