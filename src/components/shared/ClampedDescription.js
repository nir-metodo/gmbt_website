'use client';

import React, { useState, useLayoutEffect, useRef } from 'react';

// Long item description: limited to a few lines with a "show more" toggle (only when it really overflows).
// Print / PDF always shows the full text (see the .pq-clamp rules in PUBLIC_DOC_TABLE_CSS).
export function ClampedDescription({ text, lines = 4 }) {
  const ref = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    setOverflowing(el.scrollHeight - el.clientHeight > 1);
  }, [text, lines, expanded]);

  return (
    <div>
      <div
        ref={ref}
        className={`pq-clamp ${expanded ? '' : 'is-clamped'}`}
        style={expanded ? undefined : { WebkitLineClamp: lines }}
      >
        {text}
      </div>
      {(overflowing || expanded) && (
        <button type="button" className="pq-more no-print" onClick={() => setExpanded(v => !v)}>
          {expanded ? 'הצג פחות' : 'הצג עוד'}
        </button>
      )}
    </div>
  );
}

// Shared CSS of the customer-facing items table (public quote + public invoice pages).
// Wide screens: normal table. Phones (<=640px): every row becomes a card — the description gets the full width and
// qty / unit price / total sit underneath (the 4-5 column table used to leave the description a one-word-per-line sliver).
export const publicDocTableCss = (primaryColor) => `
  .pq-clamp { white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.6; }
  .pq-clamp.is-clamped { display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
  .pq-more { margin-top: 2px; padding: 0; background: none; border: none; color: ${primaryColor}; font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; }
  @media print {
    .pq-clamp.is-clamped { display: block !important; -webkit-line-clamp: unset !important; overflow: visible !important; }
  }
  @media (max-width: 640px) {
    .pq-table, .pq-table tbody { display: block; width: 100%; }
    .pq-table thead { display: none; }
    .pq-table tr.pq-row {
      display: flex; flex-wrap: wrap; align-items: center; gap: 4px 0;
      padding: 10px 6px; border-bottom: 1px solid #e5e7eb;
    }
    .pq-table tr.pq-row td { display: block; padding: 2px 8px; border: none; }
    .pq-table tr.pq-row td.pq-img { flex: 0 0 auto; padding: 2px 4px 2px 8px; }
    .pq-table tr.pq-row td.pq-sku { flex: 0 0 100%; font-size: 11px; color: #6b7280; }
    .pq-table tr.pq-row td.pq-sku::before { content: attr(data-label) ': '; }
    .pq-table tr.pq-row td.pq-desc { flex: 1 1 calc(100% - 56px); min-width: 0; font-size: 14px; }
    .pq-table tr.pq-row.no-img td.pq-desc { flex-basis: 100%; }
    .pq-table tr.pq-row td.pq-num { flex: 1 1 0; min-width: 70px; text-align: center; font-size: 13px; }
    .pq-table tr.pq-row td.pq-num::before {
      content: attr(data-label); display: block; font-size: 10px; font-weight: 500; color: #6b7280; margin-bottom: 1px;
    }
    .pq-table tr.pq-section, .pq-table tr.pq-section td { display: block; }
  }
`;
