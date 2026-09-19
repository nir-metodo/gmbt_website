import { buildEnMetadata } from '@/lib/enPages';
import EnSolutionPage from '@/components/shared/EnSolutionPage';

export const metadata = buildEnMetadata('whatsapp-task-management');

export default function WhatsAppTaskManagementEnPage() {
  return <EnSolutionPage slug="whatsapp-task-management" />;
}
