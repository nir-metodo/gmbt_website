import OnboardingWrapper from '@/components/OnBoard/OnboardingWrapper';

export const metadata = {
  title: 'צור חשבון גמבוט | ניסיון חינם חודש | WhatsApp API',
  description: 'פתח חשבון גמבוט ב-30 דקות. חבר את מספר הוואטסאפ, בחר תוכנית ותתחיל לעבוד. ניסיון חינם חודש ללא כרטיס אשראי.',
  alternates: { canonical: 'https://gambot.co.il/OnboardingProcess/' },
};

export default function OnboardingProcessPage() {
  return <OnboardingWrapper />;
}
