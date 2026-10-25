import OnboardingServicesContent from '@/components/Pricing/OnboardingServicesContent';

export const metadata = {
  title: 'הטמעה ושירותים מקצועיים | גמבוט',
  description: 'שירותי הטמעה מקצועיים לפלטפורמת גמבוט לוואטסאפ — בסיסית ₪1,800, מקצועית ₪3,500, מלאה (בוט + CRM) ₪4,970. שחזור רטרו ושירותים נוספים.',
  alternates: { canonical: 'https://gambot.co.il/PriceList/OnboardingServices/' },
};

export default function OnboardingServicesPage() {
  return <OnboardingServicesContent />;
}
