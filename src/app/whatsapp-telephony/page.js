import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-telephony');

export default function WhatsAppTelephonyEnPage() {
  return <EnSolutionPage slug="whatsapp-telephony" />;
}
