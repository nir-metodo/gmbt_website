import OnboardingServicesContent from '@/components/Pricing/OnboardingServicesContent';

export const metadata = {
  title: 'הטמעה ושירותים מקצועיים | גמבוט',
  description: 'שירותי הטמעה מקצועיים לפלטפורמת גמבוט לוואטסאפ — בסיסית ₪950, מקצועית ₪1,700, מתקדמת ₪2,500. שחזור רטרו ושירותים נוספים.',
  alternates: { canonical: 'https://gambot.co.il/PriceList/OnboardingServices/' },
};

export default function OnboardingServicesPage() {
  return <OnboardingServicesContent />;
}
