import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import WhatsAppMcpContent from '@/components/WhatsAppMcp/WhatsAppMcpContent';

export const metadata = buildMetadata('whatsappMcp');

export default function WhatsAppMcpPage() {
  return (
    <>
      {PAGE_META.whatsappMcp?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_META.whatsappMcp.schema) }}
        />
      )}
      <WhatsAppMcpContent />
    </>
  );
}
