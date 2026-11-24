import React from 'react';

// Tiny "Word-like" formatting for free-text fields (quote notes / terms / custom sections).
// Supported (typed as plain text, no editor needed):
//   **bold**        *italic*        [text](https://link)
//   "1. item" / "1) item"  -> numbered line (the typed number is kept; wrapped lines are indented)
//   "- item" / "* item" / "• item" -> bullet line
// Every line is its own block, so the surrounding element can be a plain <p> (no <br>/pre-wrap needed).
// Keep this file identical to gmbt_website/src/components/shared/richText.js (public quote page).

const BULLET_RE = /^\s*[-•*]\s+(.*)$/;
const NUMBER_RE = /^\s*(\d+[.)])\s+(.*)$/;

function renderInline(text, linkColor, rawUrls, keyPrefix) {
  const re = new RegExp(
    '\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\s)]+)\\)'          // 1,2: [text](url)
    + (rawUrls ? '|(https?:\\/\\/[^\\s\\])"\'>]+)' : '|(\\b\\B)')  // never matches (keeps group numbering) // 3:   bare url
    + '|\\*\\*(.+?)\\*\\*'                                    // 4:   **bold**
    + '|\\*([^\\s*](?:[^*\\n]*?[^\\s*])?)\\*',                // 5:   *italic*
    'g'
  );
  const parts = [];
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m[0] === '') { re.lastIndex++; continue; }
    if (m.index > last) parts.push(text.slice(last, m.index));
    const key = `${keyPrefix}-${i++}`;
    if (m[1] && m[2]) {
      parts.push(<a key={key} href={m[2]} target="_blank" rel="noopener noreferrer" style={{ color: linkColor, textDecoration: 'underline', fontWeight: 500 }}>{m[1]}</a>);
    } else if (m[3]) {
      parts.push(<a key={key} href={m[3]} target="_blank" rel="noopener noreferrer" style={{ color: linkColor, textDecoration: 'underline', fontWeight: 500 }}>{m[3]}</a>);
    } else if (m[4]) {
      parts.push(<strong key={key} style={{ fontWeight: 700 }}>{renderInline(m[4], linkColor, rawUrls, key)}</strong>);
    } else if (m[5]) {
      parts.push(<em key={key}>{renderInline(m[5], linkColor, rawUrls, key)}</em>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function renderRichText(text, { linkColor = '#2e6155', rawUrls = false } = {}) {
  if (!text) return null;
  const hang = { display: 'block', paddingInlineStart: '1.6em', textIndent: '-1.6em', whiteSpace: 'normal' };
  return String(text).split('\n').map((line, idx) => {
    const key = `l${idx}`;
    const num = line.match(NUMBER_RE);
    if (num) {
      return <span key={key} style={hang}>{num[1]}{'\u00A0\u00A0'}{renderInline(num[2], linkColor, rawUrls, key)}</span>;
    }
    const bul = line.match(BULLET_RE);
    if (bul) {
      return <span key={key} style={hang}>{'•\u00A0\u00A0'}{renderInline(bul[1], linkColor, rawUrls, key)}</span>;
    }
    if (!line.trim()) return <span key={key} style={{ display: 'block', height: '0.8em' }} />;
    return <span key={key} style={{ display: 'block', whiteSpace: 'normal' }}>{renderInline(line, linkColor, rawUrls, key)}</span>;
  });
}
