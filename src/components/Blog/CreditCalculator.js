'use client';
import { useMemo, useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// Gambot Credit Calculator — token-based credit model: a bot message costs credits according to the
// chosen model (credit = fixed provider cost; credits/message = avg provider cost per message / credit value).
// Averages assume a typical knowledge base (~15k input tokens) + the intent call, with no cache discount
// (conservative) for any model. Keep in sync with the blog table.
// Non-bot rows (voice/report/copilot/media/proactive) keep flat estimates.

// value → credits per average bot message
const MODELS = [
  { value: 'gpt-6-luna', he: 'ChatGPT · GPT-6 Luna — מומלץ', en: 'ChatGPT · GPT-6 Luna — recommended', credits: 8.4 },
  { value: 'gpt-5-mini', he: 'ChatGPT · GPT-5 mini', en: 'ChatGPT · GPT-5 mini', credits: 8.4 },
  { value: 'claude-haiku-5-5', he: 'Claude · Haiku 5.5', en: 'Claude · Haiku 5.5', credits: 8.4 },
  { value: 'gemini-3.5-flash-lite', he: 'Gemini 3.5 Flash-Lite', en: 'Gemini 3.5 Flash-Lite', credits: 10.4 },
  { value: 'gpt-6.1-terra', he: 'ChatGPT · GPT-6.1 Terra — חזק', en: 'ChatGPT · GPT-6.1 Terra — strong', credits: 25.6 },
  { value: 'gemini-3.6-flash', he: 'Gemini 3.6 Flash', en: 'Gemini 3.6 Flash', credits: 38.4 },
  { value: 'claude-sonnet-5-5', he: 'Claude · Sonnet 5.5 — יקר', en: 'Claude · Sonnet 5.5 — expensive', credits: 46 },
  { value: 'claude-opus-5-5', he: 'Claude · Opus 5.5 — הכי יקר', en: 'Claude · Opus 5.5 — most expensive', credits: 92 },
];
const creditsForModel = (model) => (MODELS.find((m) => m.value === model) || MODELS[0]).credits;
// ═══════════════════════════════════════════════════════════════════════════

// Action rows: each has a flat per-unit credit cost.
const ACTIONS = [
  {
    key: 'agent',
    icon: '🤖',
    he: 'הודעת בוט AI (Gambot AI Action / Agent)',
    en: 'AI bot message (Gambot AI Action / Agent)',
    heDesc: 'כל הודעה שהבוט שולח ללקוח בשיחה. מודל יקר יותר צורך יותר קרדיטים להודעה.',
    enDesc: 'Every message the bot sends to a customer. A more expensive model uses more credits per message.',
    modelBased: true,
    defaultModel: 'gpt-6-luna',
    defaultQty: 500,
  },
  {
    key: 'generated',
    icon: '✍️',
    he: 'AI Generated (תוכן/תשובה)',
    en: 'AI Generated (content/reply)',
    heDesc: 'יצירת תשובה או תוכן AI ידני בצ׳אט.',
    enDesc: 'Generating an AI reply or content manually in chat.',
    fixed: 1,
    // Off by default — don't assume every feature is in use. The user turns it on by typing a qty.
    defaultQty: 0,
  },
  {
    key: 'voice',
    icon: '🎙️',
    he: 'הודעה קולית / מדיה מהלקוח',
    en: 'Customer voice note / media',
    heDesc: 'תמלול וניתוח של הודעה קולית או מדיה שהלקוח שולח לבוט.',
    enDesc: 'Transcription and analysis of a voice note or media the customer sends to the bot.',
    fixed: 9,
    defaultQty: 0,
  },
  {
    key: 'media',
    icon: '🎨',
    he: 'AI Generated Media (תמונה/נכס)',
    en: 'AI Generated Media (image/asset)',
    heDesc: 'יצירת תמונה או נכס גרפי ב‑AI.',
    enDesc: 'Generating an image or graphic asset with AI.',
    fixed: 10,
    defaultQty: 0,
  },
  {
    key: 'proactive',
    icon: '⚡',
    he: 'הודעה יזומה (פרו‑אקטיב)',
    en: 'Proactive message',
    heDesc: 'הודעה יזומה שהבוט שולח מיוזמתו.',
    enDesc: 'A proactive message the bot sends on its own.',
    fixed: 1,
    defaultQty: 0,
  },
  {
    key: 'report',
    icon: '📊',
    he: 'דוח AI',
    en: 'AI report',
    heDesc: 'הפקת דוח מבוסס AI.',
    enDesc: 'Generating an AI‑based report.',
    fixed: 3,
    // On by default alongside the AI agent — these are the two features we assume are in use.
    defaultQty: 10,
  },
  {
    key: 'copilot',
    icon: '💬',
    he: 'קופיילוט — שאילתה/פעולה',
    en: 'Copilot — query/action',
    heDesc: 'שאילתת נתונים או פעולה דרך הקופיילוט (שאלות עזרה — חינם).',
    enDesc: 'A data query or action via the Copilot (help questions are free).',
    fixed: 3,
    defaultQty: 0,
  },
];

// Monthly plan prices (₪, ex-VAT) mirror the pricing page so the recommendation can compare the
// TRUE monthly cost of each option (base plan + add-on banks for any overage), not just credit
// coverage — that's how we know when stacking banks on a small plan is more expensive than simply
// moving up a tier.
const PLANS = [
  { name: 'Growth',   credits: 2500,  price: 179 },
  { name: 'Pro',      credits: 8000,  price: 359 },
  { name: 'Business', credits: 15000, price: 645 },
];
const ADDON_CREDITS = 500;
const ADDON_PRICE = 39;
// Enterprise is a custom tier with no public price. Once the cheapest plan + add-on banks would
// cost at least this much per month, it's no longer worth stacking banks — recommend a tailored
// Enterprise package instead. Tunable business threshold.
const ENTERPRISE_PRICE = 1000;

const fmt = (n) => Number(n).toLocaleString();

// Average bot messages per month for a model in a plan (rounded for display, same as the blog table).
function avgMessages(credits, perMsg) {
  const n = credits / perMsg;
  if (n < 100) return Math.round(n / 5) * 5;
  if (n < 1000) return Math.round(n / 10) * 10;
  return Math.round(n / 50) * 50;
}

export default function CreditCalculator({ lang = 'he' }) {
  const he = lang !== 'en';
  const t = (h, e) => (he ? h : e);

  const [qty, setQty] = useState(() =>
    Object.fromEntries(ACTIONS.map((a) => [a.key, a.defaultQty]))
  );

  const [showTable, setShowTable] = useState(false);
  const [models, setModels] = useState(() =>
    Object.fromEntries(ACTIONS.filter((a) => a.modelBased).map((a) => [a.key, a.defaultModel]))
  );

  const rows = useMemo(() => {
    return ACTIONS.map((a) => {
      const perUnit = a.modelBased ? creditsForModel(models[a.key]) : a.fixed;
      const count = Math.max(0, Number(qty[a.key]) || 0);
      return { ...a, perUnit, count, credits: Math.ceil(perUnit * count) };
    });
  }, [qty, models]);

  const total = rows.reduce((s, r) => s + r.credits, 0);

  const recommended = useMemo(() => {
    // Price out covering `total` on EACH plan = base price + add-on banks for the overage.
    const priced = PLANS.map((p) => {
      const extra = Math.max(0, total - p.credits);
      const batches = Math.ceil(extra / ADDON_CREDITS);
      const addonPrice = batches * ADDON_PRICE;
      return { plan: p, extra, addonPrice, cost: p.price + addonPrice };
    });
    // Cheapest TRUE monthly cost wins — so we never suggest stacking banks on a small plan when
    // simply moving up a tier is the same price or cheaper.
    priced.sort((a, b) => a.cost - b.cost || a.plan.credits - b.plan.credits);
    const best = priced[0];
    // Overage territory: once even the cheapest option reaches Enterprise-level spend, a custom
    // Enterprise package is the right move instead of piling on add-on banks.
    if (best.cost >= ENTERPRISE_PRICE) {
      return { enterprise: true, plan: { name: 'Enterprise' }, extra: best.extra, addonPrice: best.addonPrice, cost: best.cost };
    }
    return { enterprise: false, ...best };
  }, [total]);

  const setModelFor = (key, v) => setModels((prev) => ({ ...prev, [key]: v }));
  const setQtyFor = (key, v) =>
    setQty((prev) => ({ ...prev, [key]: v === '' ? '' : Math.max(0, Number(v)) }));

  const dir = he ? 'rtl' : 'ltr';

  return (
    <div dir={dir} style={S.wrap}>
      <div style={S.header}>
        <span style={S.headerIcon}>🧮</span>
        <div>
          <h2 style={S.headerTitle}>
            {t('מחשבון קרדיטים — כמה תצרכו בחודש?', 'Credit Calculator — how much will you use per month?')}
          </h2>
          <p style={S.headerSub}>
            {t(
              'בחרו מודל וכמות — והמחשבון יראה כמה קרדיטים תצרכו ואיזו חבילה מתאימה.',
              'Pick a model and quantity — the calculator shows how many credits you\'ll use and which plan fits.'
            )}
          </p>
        </div>
      </div>

      <div style={S.rows}>
        {/* column headers (desktop) */}
        <div style={{ ...S.rowGrid, ...S.colHead }} className="cc-row cc-col-head">
          <div>{t('סוג שימוש', 'Usage type')}</div>
          <div style={S.center}>{t('מודל', 'Model')}</div>
          <div style={S.center}>{t('כמות / חודש', 'Qty / month')}</div>
          <div style={S.center}>{t('קרדיט ליחידה', 'Credits/unit')}</div>
          <div style={S.center}>{t('סה״כ', 'Total')}</div>
        </div>

        {rows.map((r) => (
          <div key={r.key} style={S.rowGrid} className="cc-row">
            <div style={S.cellLabel}>
              <span style={S.rowIcon}>{r.icon}</span>
              <div>
                <div style={S.rowName}>{t(r.he, r.en)}</div>
                <div style={S.rowDesc}>{t(r.heDesc, r.enDesc)}</div>
              </div>
            </div>

            <div style={S.center}>
              {r.modelBased ? (
                <select
                  value={models[r.key]}
                  onChange={(e) => setModelFor(r.key, e.target.value)}
                  style={S.select}
                  aria-label={t('בחירת מודל', 'Select model')}
                >
                  {MODELS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {he ? m.he : m.en}
                    </option>
                  ))}
                </select>
              ) : (
                <span style={S.fixedTag}>{t('קבוע', 'fixed')}</span>
              )}
            </div>

            <div style={S.center}>
              <input
                type="number"
                min={0}
                value={qty[r.key]}
                onChange={(e) => setQtyFor(r.key, e.target.value)}
                style={S.qtyInput}
                aria-label={t('כמות', 'Quantity')}
              />
            </div>

            <div style={{ ...S.center, ...S.perUnit }}>{fmt(r.perUnit)}</div>

            <div style={{ ...S.center, ...S.rowTotal }}>{fmt(r.credits)}</div>
          </div>
        ))}
      </div>

      {/* Result */}
      <div style={S.result}>
        <div style={S.resultTop}>
          <div>
            <div style={S.resultLabel}>{t('סה״כ קרדיטים לחודש', 'Total credits / month')}</div>
            <div style={S.resultBig}>{fmt(total)}</div>
          </div>
          <div style={S.planBox}>
            <div style={S.resultLabel}>{t('החבילה המומלצת', 'Recommended plan')}</div>
            <div style={S.planName}>{recommended.plan.name}</div>
            {recommended.enterprise ? (
              <div style={S.planCredits}>
                {t('מותאם אישית — דברו איתנו', 'Custom — talk to us')}
              </div>
            ) : (
              <>
                <div style={S.planCredits}>
                  {t(
                    `${fmt(recommended.plan.credits)} קרדיטים כלולים`,
                    `${fmt(recommended.plan.credits)} credits included`
                  )}
                </div>
                <div style={S.planCost}>
                  {t(`≈ ₪${fmt(recommended.cost)}/חודש`, `≈ ₪${fmt(recommended.cost)}/mo`)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Enterprise: stacking add-on banks would cost as much as a tailored package — move up. */}
        {recommended.enterprise && (
          <div style={S.extra}>
            {t(
              `הצריכה גבוהה — חבילה + בנקים נוספים תעלה ≈ ₪${fmt(recommended.cost)}/חודש ועוברת את הכדאיות של חבילת Enterprise מותאמת. עדיף לעבור ל‑Enterprise.`,
              `High usage — a plan + add‑on banks would cost ≈ ₪${fmt(recommended.cost)}/mo, past the point where a tailored Enterprise package makes sense. Better to move to Enterprise.`
            )}
          </div>
        )}

        {/* Non-enterprise overage: show the add-on banks needed on the recommended plan. */}
        {!recommended.enterprise && recommended.extra > 0 && (
          <div style={S.extra}>
            {t(
              `חריגה של ${fmt(recommended.extra)} קרדיטים מעבר ל‑${recommended.plan.name} — תוספת ≈ ₪${fmt(recommended.addonPrice)}/חודש (₪${ADDON_PRICE} לכל ${ADDON_CREDITS} קרדיטים).`,
              `${fmt(recommended.extra)} credits over ${recommended.plan.name} — add‑on ≈ ₪${fmt(recommended.addonPrice)}/month (₪${ADDON_PRICE} per ${ADDON_CREDITS} credits).`
            )}
          </div>
        )}

        <p style={S.note}>
          {t(
            '💡 שימו לב: מודל חזק צורך הרבה יותר קרדיטים להודעה. מודל זול (GPT-6 Luna / GPT-5 mini / Claude Haiku 5.5) מתאים לרוב השיחות ונותן הכי הרבה הודעות.',
            '💡 Note: a strong model uses many more credits per message. A cheap model (GPT-6 Luna / GPT-5 mini / Claude Haiku 5.5) fits most conversations and gives the most messages.'
          )}
        </p>

        <div style={{ marginTop: 14 }}>
          <button type="button" onClick={() => setShowTable((v) => !v)} style={S.tableBtn} aria-expanded={showTable}>
            {showTable
              ? t('הסתר ממוצע הודעות לפי מודל ▲', 'Hide average messages by model ▲')
              : t('📊 ממוצע הודעות לפי מודל וחבילה ▼', '📊 Average messages by model & plan ▼')}
          </button>
          {showTable && (
            <div style={{ overflowX: 'auto', marginTop: 10 }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={{ ...S.th, textAlign: he ? 'right' : 'left' }}>{t('מודל', 'Model')}</th>
                    {PLANS.map((p) => (
                      <th key={p.name} style={S.th}>
                        {p.name}
                        <div style={S.thSub}>{fmt(p.credits)}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map((m) => (
                    <tr key={m.value}>
                      <td style={{ ...S.td, textAlign: he ? 'right' : 'left' }}>{he ? m.he : m.en}</td>
                      {PLANS.map((p) => (
                        <td key={p.name} style={S.td}>≈{fmt(avgMessages(p.credits, m.credits))}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={S.note}>
                {t(
                  'ממוצע הודעות בוט בחודש לפי שימוש אמיתי (GPT-5 mini נמדד; שאר המודלים הערכה לפי מחירון הספקים, נובמבר 2026). עסק עם בסיס ידע גדול יותר יקבל פחות הודעות.',
                  'Average bot messages per month with a typical knowledge base. A larger knowledge base gives fewer messages.'
                )}
              </p>
            </div>
          )}
        </div>

        <a href="/OnboardingProcess" style={S.cta}>
          {t('התחילו ניסיון חינם ←', 'Start a free trial →')}
        </a>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `@media (max-width: 640px){.cc-row{grid-template-columns:1fr 1fr !important;gap:8px !important}.cc-col-head{display:none !important}}`,
        }}
      />
    </div>
  );
}

const S = {
  wrap: {
    background: '#ffffff',
    border: '2px solid #a5f3fc',
    borderRadius: 18,
    padding: '24px',
    margin: '32px 0',
    boxShadow: '0 10px 30px rgba(3,105,161,0.08)',
  },
  header: { display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 },
  headerIcon: {
    fontSize: 28,
    background: 'linear-gradient(135deg,#0891b2,#0369a1)',
    color: '#fff',
    width: 52,
    height: 52,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle: { margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0e7490', border: 'none' },
  headerSub: { margin: '6px 0 0', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 },
  rows: { display: 'flex', flexDirection: 'column', gap: 8 },
  rowGrid: {
    display: 'grid',
    gridTemplateColumns: '2.4fr 1.6fr 1fr 1fr 1fr',
    gap: 12,
    alignItems: 'center',
    padding: '12px 10px',
    background: '#f8fafc',
    borderRadius: 12,
    border: '1px solid #eef2f7',
  },
  colHead: {
    background: 'transparent',
    border: 'none',
    padding: '0 10px',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#94a3b8',
  },
  center: { textAlign: 'center' },
  cellLabel: { display: 'flex', gap: 10, alignItems: 'flex-start' },
  rowIcon: { fontSize: 20, flexShrink: 0 },
  rowName: { fontWeight: 700, fontSize: '0.92rem', color: '#1a1a2e' },
  rowDesc: { fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4, marginTop: 2 },
  qtyInput: {
    width: 80,
    padding: '8px 10px',
    borderRadius: 8,
    border: '1.5px solid #cbd5e1',
    fontSize: '0.9rem',
    textAlign: 'center',
    fontWeight: 600,
  },
  perUnit: { fontWeight: 600, color: '#0369a1', fontSize: '0.9rem' },
  select: {
    width: '100%',
    maxWidth: 200,
    padding: '8px 10px',
    borderRadius: 8,
    border: '1.5px solid #cbd5e1',
    fontSize: '0.82rem',
    background: '#fff',
    cursor: 'pointer',
  },
  fixedTag: { fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' },
  tableBtn: {
    background: '#fff',
    border: '1.5px solid #0891b2',
    color: '#0369a1',
    fontWeight: 700,
    fontSize: '0.88rem',
    padding: '9px 16px',
    borderRadius: 10,
    cursor: 'pointer',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', background: '#fff' },
  th: { padding: '8px', border: '1px solid #bae6fd', background: '#e0f2fe', color: '#0369a1', textAlign: 'center' },
  thSub: { fontSize: '0.7rem', fontWeight: 400, color: '#64748b' },
  td: { padding: '8px', border: '1px solid #e0f2fe', textAlign: 'center' },
  rowTotal: { fontWeight: 800, color: '#b45309', fontSize: '0.95rem' },
  result: {
    marginTop: 20,
    background: 'linear-gradient(135deg,#ecfeff,#e0f2fe)',
    border: '2px solid #a5f3fc',
    borderRadius: 14,
    padding: 20,
  },
  resultTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  resultLabel: { fontSize: '0.8rem', color: '#0e7490', fontWeight: 600 },
  resultBig: { fontSize: '2.4rem', fontWeight: 900, color: '#0369a1', lineHeight: 1 },
  planBox: {
    background: '#fff',
    borderRadius: 12,
    padding: '12px 20px',
    textAlign: 'center',
    border: '1px solid #bae6fd',
    minWidth: 160,
  },
  planName: { fontSize: '1.4rem', fontWeight: 900, color: '#0369a1' },
  planCredits: { fontSize: '0.78rem', color: '#64748b' },
  planCost: { fontSize: '0.82rem', color: '#0e7490', fontWeight: 700, marginTop: 2 },
  extra: {
    marginTop: 14,
    background: '#fffbeb',
    border: '1.5px solid #fcd34d',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: '0.85rem',
    color: '#92400e',
    fontWeight: 600,
  },
  note: { marginTop: 14, fontSize: '0.82rem', color: '#475569', lineHeight: 1.55 },
  cta: {
    display: 'inline-block',
    marginTop: 10,
    background: 'linear-gradient(135deg,#0891b2,#0369a1)',
    color: '#fff',
    fontWeight: 700,
    padding: '11px 26px',
    borderRadius: 10,
    textDecoration: 'none',
    fontSize: '0.95rem',
  },
};
