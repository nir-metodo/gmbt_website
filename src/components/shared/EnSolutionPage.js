'use client';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';
import { EN_PAGES, withEnRelated } from '@/lib/enPages';

/**
 * Renders an English-alias solution page: resolves the SOLUTIONS content key from the English-page
 * registry and injects internal "Related Solutions" links to other English pages (unless the
 * content already ships a curated `related` list). Keeps every English route file to two lines.
 */
export default function EnSolutionPage({ slug }) {
  const key = EN_PAGES[slug]?.solutionKey;
  const content = key ? SOLUTIONS[key] : null;
  if (!content) return null;
  // forceLang="en" so the prerendered static HTML is English (crawler-friendly), independent of the
  // Hebrew-default language context.
  return <LandingPageContent content={withEnRelated(content, slug)} forceLang="en" />;
}
