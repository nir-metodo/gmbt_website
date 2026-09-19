import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-landing-page-leads');

export default function WhatsAppLandingPageLeadsEnPage() {
  return <EnSolutionPage slug="whatsapp-landing-page-leads" />;
}
