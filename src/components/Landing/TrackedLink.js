'use client';

import { trackEvent } from '@/lib/track';

/**
 * A plain anchor (fully crawlable — real href, real text) that also fires a conversion event on click.
 * Used for developer/MCP CTAs so we can attribute signups to organic developer traffic.
 */
export default function TrackedLink({ href, event, eventParams, className, style, children }) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={() => event && trackEvent(event, eventParams)}
    >
      {children}
    </a>
  );
}
