/**
 * Shared helpers for the global developer/MCP/AI-agent landing pages.
 * Builds Next.js metadata and valid schema.org JSON-LD from a single page `data` object,
 * so the FAQ/breadcrumb structured data can never drift from what is visible on the page.
 */

const OG_IMAGE = 'https://gambot.co.il/og-image.jpg';
const ORG_REF = 'https://gambot.co.il/#organization';

/** Next.js metadata for an English landing page (locale en_US, self-referential canonical + hreflang). */
export function landingMetadata(data) {
  const { title, description, keywords, canonical, ogTitle, ogDescription } = data.seo;
  return {
    title,
    description,
    keywords,
    alternates: { canonical, languages: { en: canonical, 'x-default': canonical } },
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url: canonical,
      siteName: 'Gambot | WhatsApp Business API',
      locale: 'en_US',
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE] },
  };
}

/** Valid JSON-LD @graph: SoftwareApplication (or TechArticle) + FAQPage (from visible FAQ) + BreadcrumbList. */
export function landingSchema(data) {
  const graph = [];
  if (data.schemaType === 'article') {
    graph.push({
      '@type': 'TechArticle',
      headline: data.seo.ogTitle || data.seo.title,
      description: data.seo.description,
      inLanguage: 'en',
      url: data.seo.canonical,
      author: { '@id': ORG_REF },
      publisher: { '@id': ORG_REF },
    });
  } else {
    graph.push({
      '@type': 'SoftwareApplication',
      name: data.seo.appName || 'Gambot WhatsApp Business API',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web, Node.js 18+',
      url: data.seo.canonical,
      description: data.seo.description,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free trial; requires a Gambot account (plans from ₪179/month).',
      },
      author: { '@id': ORG_REF },
      publisher: { '@id': ORG_REF },
    });
  }
  if (data.faq && data.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: data.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  if (data.breadcrumbs && data.breadcrumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: data.breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: b.item,
      })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
