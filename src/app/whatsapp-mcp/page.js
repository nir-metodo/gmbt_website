import { buildMetadata, PAGE_META } from '@/lib/pageMeta';
import WhatsAppMcpContent from '@/components/WhatsAppMcp/WhatsAppMcpContent';

// Absolute title: the root layout template would otherwise append a second "| Gambot".
export const metadata = {
  ...buildMetadata('whatsappMcp'),
  title: { absolute: PAGE_META.whatsappMcp.title },
};

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
