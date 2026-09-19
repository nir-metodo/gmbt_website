'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/track';

/** Fires a `seo_page_view` event (with first-touch attribution) once per mount for developer/MCP pages. */
export default function PageViewTracker({ page }) {
  useEffect(() => {
    trackEvent('seo_page_view', { page });
  }, [page]);
  return null;
}
