import PrivacyPolicyEN from '@/components/Legal/PrivacyPolicyEN';

export const metadata = {
  title: 'Privacy Policy | Gambot',
  description: 'Privacy policy of the Gambot WhatsApp Business management platform',
  alternates: {
    canonical: 'https://gambot.co.il/privacy/en/',
    languages: {
      he: 'https://gambot.co.il/privacy/',
      en: 'https://gambot.co.il/privacy/en/',
    },
  },
};

export default function PrivacyPageEN() {
  return <PrivacyPolicyEN />;
}
