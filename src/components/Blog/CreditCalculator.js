'use client';
import { useMemo, useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// Gambot Credit Calculator — mirrors the backend CreditCalculator (AiService.cs)
//   credits = ceil( providerCostUsd * MARKUP / CREDIT_VALUE_USD )
//   MARKUP = 10 , CREDIT_VALUE_USD = 0.01  →  factor = 1000
// Per-model input/output USD per 1M tokens are copied 1:1 from the backend.
// ═══════════════════════════════════════════════════════════════════════════
const FACTOR = 10 / 0.01; // 1000

// model key → [inputUsdPer1M, outputUsdPer1M]  (must match backend keys)
const MODEL_RATES = {
  'gpt-4o-mini':            [0.15, 0.60],
  'gpt-5-mini':             [0.25, 2.00],
  'gpt-4o':                 [2.50, 10.00],
  'gpt-5':                  [1.25, 10.00],
  'gemini-3.5-flash-lite':  [0.10, 0.40],
  'gemini-3.6-flash':       [0.30, 2.50],
  'gemini-3.1-pro':         [1.25, 10.00],
  'claude-haiku':           [1.00, 5.00],
  'claude-sonnet':          [3.00, 15.00],
  'claude-opus':            [5.00, 25.00],
};

// Grouped options for the model dropdown (value = backend key)
const MODEL_GROUPS = [
  {
    label: 'ChatGPT (OpenAI)',
    options: [
      { value: 'gpt-4o-mini', he: 'GPT‑4o mini — מהיר/זול', en: 'GPT‑4o mini — fast/cheap' },
      { value: 'gpt-5-mini',  he: 'GPT‑5 mini — מאוזן',     en: 'GPT‑5 mini — balanced' },
      { value: 'gpt-4o',      he: 'GPT‑4o — חזק',           en: 'GPT‑4o — strong' },
      { value: 'gpt-5',       he: 'GPT‑5 — חזק+',           en: 'GPT‑5 — strong+' },
    ],
  },
  {
    label: 'Gemini (Google)',
    options: [
      { value: 'gemini-3.5-flash-lite', he: 'Gemini Flash Lite — מהיר/זול', en: 'Gemini Flash Lite — fast/cheap' },
      { value: 'gemini-3.6-flash',      he: 'Gemini Flash — מאוזן',         en: 'Gemini Flash — balanced' },
      { value: 'gemini-3.1-pro',        he: 'Gemini Pro — חזק',             en: 'Gemini Pro — strong' },
    ],
  },
  {
    label: 'Claude (Anthropic)',
    options: [
      { value: 'claude-haiku',  he: 'Claude Haiku — מהיר',  en: 'Claude Haiku — fast' },
      { value: 'claude-sonnet', he: 'Claude Sonnet — חזק',  en: 'Claude Sonnet — strong' },
      { value: 'claude-opus',   he: 'Claude Opus — חזק+',   en: 'Claude Opus — strong+' },
    ],
  },
];

// credits for a model-based action given a representative token profile
function creditsForModel(model, inTok, outTok) {
  const [i, o] = MODEL_RATES[model] || MODEL_RATES['gpt-5-mini'];
  const costUsd = (inTok * i) / 1e6 + (outTok * o) / 1e6;
  return Math.max(1, Math.ceil(costUsd * FACTOR));
}

// Action rows. modelBased rows compute per-unit credits from the selected model
// using a representative token profile; fixed rows use a flat credit cost.
const ACTIONS = [
  {
    key: 'agent',
    icon: '🤖',
    he: 'Gambot AI Action / Agent',
    en: 'Gambot AI Action / Agent',
    heDesc: 'תשובת הבוט בשיחה — קורא את כל הידע העסקי ומריץ בדיקות איכות. הפריט הכבד.',
    enDesc: 'A bot reply in the conversation — reads all business knowledge and runs quality checks. The heavy item.',
    modelBased: true,
    profile: { in: 90000, out: 3000 },
    defaultModel: 'gpt-4o-mini',
    defaultQty: 500,
  },
  {
    key: 'generated',
    icon: '✍️',
    he: 'AI Generated (תוכן/תשובה)',
    en: 'AI Generated (content/reply)',
    heDesc: 'יצירת תשובה או תוכן AI ידני בצ׳אט. תלוי במודל שנבחר.',
    enDesc: 'Generating an AI reply or content manually in chat. Depends on the chosen model.',
    modelBased: true,
    profile: { in: 2500, out: 500 },
    defaultModel: 'gpt-4o-mini',
    // Off by default — don't assume every feature is in use. The user turns it on by typing a qty.
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
  { name: 'Growth',   credits: 1000,  price: 179 },
  { name: 'Pro',      credits: 5000,  price: 359 },
  { name: 'Business', credits: 15000, price: 645 },
];
const ADDON_CREDITS = 500;
const ADDON_PRICE = 39;
// Enterprise is a custom tier with no public price. Once the cheapest plan + add-on banks would
// cost at least this much per month, it's no longer worth stacking banks — recommend a tailored
// Enterprise package instead. Tunable business threshold.
const ENTERPRISE_PRICE = 1000;

const fmt = (n) => Number(n).toLocaleString();

export default function CreditCalculator({ lang = 'he' }) {
  const he = lang !== 'en';
  const t = (h, e) => (he ? h : e);

  const [qty, setQty] = useState(() =>
    Object.fromEntries(ACTIONS.map((a) => [a.key, a.defaultQty]))
  );
  const [models, setModels] = useState(() =>
    Object.fromEntries(
      ACTIONS.filter((a) => a.modelBased).map((a) => [a.key, a.defaultModel])
    )
  );

  const rows = useMemo(() => {
    return ACTIONS.map((a) => {
      const perUnit = a.modelBased
        ? creditsForModel(models[a.key], a.profile.in, a.profile.out)
        : a.fixed;
      const count = Math.max(0, Number(qty[a.key]) || 0);
      return { ...a, perUnit, count, credits: perUnit * count };
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

  const setQtyFor = (key, v) =>
    setQty((prev) => ({ ...prev, [key]: v === '' ? '' : Math.max(0, Number(v)) }));
  const setModelFor = (key, v) =>
    setModels((prev) => ({ ...prev, [key]: v }));

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
              'בחרו סוג שימוש, מודל וכמות — והמחשבון יראה כמה קרדיטים תצרכו ואיזו חבילה מתאימה.',
              'Pick a usage type, model and quantity — the calculator shows how many credits you\'ll use and which plan fits.'
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
                  {MODEL_GROUPS.map((g) => (
                    <optgroup key={g.label} label={g.label}>
                      {g.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {he ? o.he : o.en}
                        </option>
                      ))}
                    </optgroup>
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
            '💡 שימו לב: מודל חזק צורך הרבה יותר קרדיטים לכל תשובה. בחירת מודל מהיר/זול לשיחות פשוטות מורידה משמעותית את הצריכה.',
            '💡 Note: a strong model consumes many more credits per reply. Choosing a fast/cheap model for simple conversations lowers usage significantly.'
          )}
        </p>

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
