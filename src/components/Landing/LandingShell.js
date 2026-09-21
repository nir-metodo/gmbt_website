'use client';
/**
 * Data-driven landing shell for the global developer / MCP / AI-agent SEO pages.
 * Client component so it can follow the site-wide language switch (LanguageContext): CTAs use the
 * client TrackedLink for conversion attribution.
 *
 * Pages pass a `data` object: { pageKey, hero, blocks[], faq[], breadcrumbs[] } (English), plus an
 * OPTIONAL `he` object with the SAME shape holding Hebrew translations of the visible strings. When
 * the site language is Hebrew we deep-merge `data.he` over `data` (per-field, English fallback) and
 * flip the layout to RTL — so the same page renders correctly in both languages via the navbar toggle.
 * Block types: prose | cards | bullets | steps | code | prompts | table | cta.
 */
import TrackedLink from '@/components/Landing/TrackedLink';
import PageViewTracker from '@/components/Landing/PageViewTracker';
import { useLanguage } from '@/contexts/LanguageContext';

// ── Language merge: overlay the Hebrew `data.he` strings on top of the English structure, keeping any
// field the translation omits (href/event/type and untranslated text) from English. Arrays provided in
// `he` replace their English counterpart wholesale; blocks are matched by index. ──────────────────────
function mergeCta(en, he) {
  if (!en) return he || null;
  if (!he) return en;
  return { ...en, ...he };
}
function mergeBlock(en, he) {
  if (!he) return en;
  const out = { ...en, ...he };
  if (en.primary || he.primary) out.primary = mergeCta(en.primary, he.primary);
  if (en.secondary || he.secondary) out.secondary = mergeCta(en.secondary, he.secondary);
  return out;
}
function mergeHero(en, he) {
  if (!he) return en;
  const out = { ...en, ...he };
  out.primary = mergeCta(en.primary, he.primary);
  out.secondary = mergeCta(en.secondary, he.secondary);
  out.chips = he.chips || en.chips;
  return out;
}
function resolveData(data, useHe) {
  if (!useHe || !data.he) return data;
  const he = data.he;
  const out = { ...data };
  if (he.hero) out.hero = mergeHero(data.hero, he.hero);
  if (he.blocks && Array.isArray(data.blocks)) out.blocks = data.blocks.map((b, i) => mergeBlock(b, he.blocks[i]));
  if (he.faq) out.faq = he.faq;
  if (he.breadcrumbs) out.breadcrumbs = he.breadcrumbs;
  return out;
}

const GREEN = '#25D366';
const DARK = '#0b141a';
const CARD = '#131f27';
const BORDER = '#22323d';
const TEXT = '#e9edef';
const MUTED = '#8fa3ad';

function Cta({ cta, page, kind }) {
  if (!cta) return null;
  const primary = kind === 'primary';
  return (
    <TrackedLink
      href={cta.href}
      event={cta.event}
      eventParams={{ page, label: cta.label, ...(cta.eventParams || {}) }}
      className="ls-btn"
      style={
        primary
          ? { background: GREEN, color: '#04220f' }
          : { background: 'transparent', color: TEXT, border: `1px solid ${BORDER}` }
      }
    >
      {cta.label}
    </TrackedLink>
  );
}

function Block({ block, page, ui }) {
  switch (block.type) {
    case 'prose':
      return (
        <section className="ls-sec">
          <div className="ls-wrap">
            {block.title && <h2 className="ls-h2">{block.title}</h2>}
            {(block.paragraphs || []).map((p, i) => (
              <p key={i} className="ls-p" dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>
        </section>
      );
    case 'cards':
      return (
        <section className="ls-sec">
          <div className="ls-wrap">
            {block.title && <h2 className="ls-h2">{block.title}</h2>}
            {block.intro && <p className="ls-p">{block.intro}</p>}
            <div className="ls-grid">
              {block.cards.map((c, i) => (
                <div key={i} className="ls-card">
                  {c.icon && <div className="ls-icon">{c.icon}</div>}
                  <h3 className="ls-h3">{c.title}</h3>
                  <p className="ls-cardtext">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'bullets':
      return (
        <section className="ls-sec">
          <div className="ls-wrap">
            {block.title && <h2 className="ls-h2">{block.title}</h2>}
            {block.intro && <p className="ls-p">{block.intro}</p>}
            <ul className="ls-ul">
              {block.bullets.map((b, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
              ))}
            </ul>
          </div>
        </section>
      );
    case 'steps':
      return (
        <section className="ls-sec">
          <div className="ls-wrap">
            {block.title && <h2 className="ls-h2">{block.title}</h2>}
            {block.intro && <p className="ls-p">{block.intro}</p>}
            <div className="ls-grid">
              {block.steps.map((s, i) => (
                <div key={i} className="ls-card">
                  <div className="ls-step">{i + 1}</div>
                  <h3 className="ls-h3">{s.title}</h3>
                  <p className="ls-cardtext">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'code':
      return (
        <section className="ls-sec">
          <div className="ls-wrap">
            {block.title && <h2 className="ls-h2">{block.title}</h2>}
            {block.intro && <p className="ls-p">{block.intro}</p>}
            <pre className="ls-pre">{block.code}</pre>
          </div>
        </section>
      );
    case 'prompts':
      return (
        <section className="ls-sec">
          <div className="ls-wrap">
            {block.title && <h2 className="ls-h2">{block.title}</h2>}
            {block.intro && <p className="ls-p">{block.intro}</p>}
            <div className="ls-prompts">
              {block.prompts.map((pr, i) => (
                <div key={i} className="ls-card">
                  <p className="ls-user">
                    <span className="ls-tag">{ui?.you || 'You'}</span> {pr.user}
                  </p>
                  {pr.agent && (
                    <p className="ls-agent">
                      <span className="ls-tag ls-tag-agent">{ui?.agent || 'Agent'}</span> {pr.agent}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {block.note && <p className="ls-note">{block.note}</p>}
          </div>
        </section>
      );
    case 'table':
      return (
        <section className="ls-sec">
          <div className="ls-wrap">
            {block.title && <h2 className="ls-h2">{block.title}</h2>}
            {block.intro && <p className="ls-p">{block.intro}</p>}
            <div className="ls-tablewrap">
              <table className="ls-table">
                <thead>
                  <tr>
                    {block.columns.map((c, i) => (
                      <th key={i}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} dangerouslySetInnerHTML={{ __html: cell }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      );
    case 'cta':
      return (
        <section className="ls-sec ls-cta">
          <div className="ls-wrap" style={{ textAlign: 'center' }}>
            {block.title && <h2 className="ls-h2">{block.title}</h2>}
            {block.text && <p className="ls-p" style={{ margin: '0 auto 22px', maxWidth: 640 }}>{block.text}</p>}
            <div className="ls-ctarow">
              <Cta cta={block.primary} page={page} kind="primary" />
              <Cta cta={block.secondary} page={page} kind="secondary" />
            </div>
          </div>
        </section>
      );
    default:
      return null;
  }
}

export default function LandingShell({ data }) {
  const { currentLanguage } = useLanguage();
  const isHe = currentLanguage === 'he' && !!data.he;
  const d = resolveData(data, isHe);
  const { pageKey, hero, blocks = [], faq = [], breadcrumbs = [] } = d;
  const ui = {
    faqHeading: isHe ? 'שאלות נפוצות' : 'Frequently asked questions',
    you: isHe ? 'אתה' : 'You',
    agent: isHe ? 'סוכן' : 'Agent',
  };
  return (
    <main dir={isHe ? 'rtl' : 'ltr'} style={{ background: DARK, color: TEXT, fontFamily: 'Rubik, "Open Sans", system-ui, sans-serif', direction: isHe ? 'rtl' : 'ltr' }}>
      <PageViewTracker page={pageKey} />
      <style>{`
        .ls-wrap { max-width: 1080px; margin: 0 auto; padding: 0 20px; }
        .ls-sec { padding: 40px 0; }
        .ls-btn { display:inline-block; padding:14px 26px; border-radius:10px; font-weight:600; text-decoration:none; transition:transform .15s ease, opacity .15s ease; }
        .ls-btn:hover { transform: translateY(-2px); }
        .ls-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:18px; margin-top:18px; }
        .ls-pre { background:#0f1a21; border:1px solid ${BORDER}; border-radius:12px; padding:18px 20px; overflow:auto; font-family:"SF Mono",Menlo,Consolas,monospace; font-size:13.5px; line-height:1.6; color:#cfe9d8; white-space:pre; }
        .ls-h2 { font-size:30px; font-weight:700; margin:0 0 12px; }
        .ls-h3 { margin:0 0 8px; font-size:18px; }
        .ls-p { color:${MUTED}; font-size:16px; line-height:1.7; margin:0 0 14px; }
        .ls-card { background:${CARD}; border:1px solid ${BORDER}; border-radius:14px; padding:22px; }
        .ls-cardtext { color:${MUTED}; margin:0; line-height:1.6; font-size:15px; }
        .ls-icon { font-size:26px; margin-bottom:10px; }
        .ls-step { width:38px; height:38px; border-radius:10px; background:${GREEN}; color:#04220f; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:18px; margin-bottom:12px; }
        .ls-ul { color:${MUTED}; font-size:16px; line-height:1.8; padding-inline-start:22px; margin:0; }
        .ls-ul li { margin-bottom:8px; }
        .ls-badge { display:inline-block; background:rgba(37,211,102,0.12); color:${GREEN}; border:1px solid ${GREEN}; border-radius:999px; padding:6px 16px; font-size:13px; font-weight:600; margin-bottom:22px; }
        .ls-chip { border:1px solid ${BORDER}; border-radius:999px; padding:8px 16px; color:${TEXT}; font-weight:500; font-size:14px; background:#0f1a21; }
        .ls-prompts { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:16px; margin-top:18px; }
        .ls-user { margin:0 0 10px; color:${TEXT}; font-size:15px; line-height:1.6; }
        .ls-agent { margin:0; color:${MUTED}; font-size:15px; line-height:1.6; }
        .ls-tag { display:inline-block; font-size:11px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; padding:2px 8px; border-radius:6px; margin-inline-end:8px; background:#0f1a21; border:1px solid ${BORDER}; color:${MUTED}; }
        .ls-tag-agent { color:${GREEN}; border-color:${GREEN}; }
        .ls-note { color:${MUTED}; font-size:13.5px; margin-top:14px; font-style:italic; }
        .ls-tablewrap { overflow:auto; margin-top:18px; }
        .ls-table { width:100%; border-collapse:collapse; font-size:14.5px; }
        .ls-table th, .ls-table td { text-align:start; padding:12px 14px; border-bottom:1px solid ${BORDER}; color:${TEXT}; vertical-align:top; }
        .ls-table th { color:${MUTED}; font-weight:600; }
        .ls-table code { background:#0f1a21; border:1px solid ${BORDER}; border-radius:6px; padding:1px 6px; font-size:13px; color:#cfe9d8; }
        .ls-cta { background:#0f1a21; border-top:1px solid ${BORDER}; border-bottom:1px solid ${BORDER}; }
        .ls-ctarow { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
        .ls-p code { background:#0f1a21; border:1px solid ${BORDER}; border-radius:6px; padding:1px 6px; font-size:13.5px; color:#cfe9d8; }
        .ls-crumbs { color:${MUTED}; font-size:13px; }
        .ls-crumbs a { color:${MUTED}; text-decoration:none; }
        .ls-crumbs a:hover { color:${TEXT}; }
        @media (max-width:600px){ .ls-h1{ font-size:34px !important; } .ls-h2{ font-size:24px !important; } }
      `}</style>

      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <div className="ls-wrap" style={{ paddingTop: 22 }}>
          <nav className="ls-crumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((b, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <span key={i}>
                  {b.item && !isLast ? <a href={b.item}>{b.name}</a> : b.name}
                  {!isLast ? ' / ' : ''}
                </span>
              );
            })}
          </nav>
        </div>
      )}

      {/* Hero */}
      <section style={{ padding: '48px 0 36px', textAlign: 'center' }}>
        <div className="ls-wrap">
          {hero.badge && <div className="ls-badge">{hero.badge}</div>}
          <h1 className="ls-h1" style={{ fontSize: 48, lineHeight: 1.12, fontWeight: 800, margin: '0 0 16px' }}>
            {hero.h1}
          </h1>
          <p style={{ fontSize: 20, color: MUTED, maxWidth: 760, margin: '0 auto 14px', lineHeight: 1.6 }}
             dangerouslySetInnerHTML={{ __html: hero.subhead }} />
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 26 }}>
            <Cta cta={hero.primary} page={pageKey} kind="primary" />
            <Cta cta={hero.secondary} page={pageKey} kind="secondary" />
          </div>
          {hero.chips && (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 30 }}>
              {hero.chips.map((n) => (
                <span key={n} className="ls-chip">{n}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {blocks.map((block, i) => (
        <Block key={i} block={block} page={pageKey} ui={ui} />
      ))}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="ls-sec">
          <div className="ls-wrap">
            <h2 className="ls-h2">{ui.faqHeading}</h2>
            <div style={{ marginTop: 12 }}>
              {faq.map((f, i) => (
                <details key={i} className="ls-card" style={{ marginBottom: 12 }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 16 }}>{f.q}</summary>
                  <p className="ls-cardtext" style={{ marginTop: 10 }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
