'use client';
import { useState, useRef } from 'react';
import styles from './BotBuilderMiniDemo.module.css';

/**
 * A lightweight, self-contained "taste" of the Gambot WhatsApp bot builder
 * (תכנון בוטים / BotFlowBuilder). It mirrors the real planner: an incoming-message
 * trigger with Quick-Reply buttons, connected by a line to a "Send Message" action.
 * Visitors drag blocks from the palette (grouped: Triggers / Sent messages / Actions),
 * add/remove Quick-Reply buttons, reorder and remove nodes — no login needed.
 */

// key → per-language content (bubble text / caption / default quick-reply buttons)
const NODES = {
  he: {
    // Triggers
    trigger_regular: { group: 'trigger', icon: '📩', label: 'הודעה נכנסת רגילה', color: '#059669', caption: 'מופעל כשמתקבלת הודעה מהלקוח' },
    trigger_button: { group: 'trigger', icon: '🔘', label: 'הודעה נכנסת (טמפלט + כפתורים)', color: '#0891b2', bubble: 'היי 👋 רוצים לשמוע על המבצע החודש?', buttons: ['כן, בבקשה 🙌', 'לא תודה'] },
    trigger_reply: { group: 'trigger', icon: '↩️', label: 'עונה להודעה האחרונה', color: '#0d9488', caption: 'ממתין לתשובת הלקוח על ההודעה האחרונה' },
    // Sent messages
    message_regular: { group: 'message', icon: '💬', label: 'שלח הודעה', color: '#2e6155', bubble: 'מעולה! הנה כל הפרטים 👇', buttons: [] },
    message_template: { group: 'message', icon: '📤', label: 'הודעת תבנית (טמפלט)', color: '#047857', bubble: 'תודה שפניתם! 🙏 נחזור אליכם בהקדם', buttons: [] },
    message_media: { group: 'message', icon: '🖼️', label: 'הודעת מדיה', color: '#0891b2', caption: 'שולח תמונה / קובץ / וידאו' },
    // Actions
    transfer: { group: 'action', icon: '👤', label: 'שיוך לנציג', color: '#8b5cf6', caption: 'מעביר את השיחה לנציג אנושי' },
    send_http: { group: 'action', icon: '🌐', label: 'שליחת בקשת HTTP', color: '#f59e0b', caption: 'שולח בקשה למערכת חיצונית (CRM / ERP)' },
    delay: { group: 'action', icon: '⏱️', label: 'השהייה', color: '#64748b', caption: 'ממתין פרק זמן לפני השלב הבא' },
  },
  en: {
    trigger_regular: { group: 'trigger', icon: '📩', label: 'Incoming message', color: '#059669', caption: 'Fires when a customer sends a message' },
    trigger_button: { group: 'trigger', icon: '🔘', label: 'Incoming (template + buttons)', color: '#0891b2', bubble: 'Hi 👋 Want to hear about this month\u2019s offer?', buttons: ['Yes, please 🙌', 'No thanks'] },
    trigger_reply: { group: 'trigger', icon: '↩️', label: 'Reply to last message', color: '#0d9488', caption: 'Waits for the customer to reply to the last message' },
    message_regular: { group: 'message', icon: '💬', label: 'Send Message', color: '#2e6155', bubble: 'Great! Here are all the details 👇', buttons: [] },
    message_template: { group: 'message', icon: '📤', label: 'Template message', color: '#047857', bubble: 'Thanks for reaching out! 🙏 We\u2019ll get back to you soon', buttons: [] },
    message_media: { group: 'message', icon: '🖼️', label: 'Media message', color: '#0891b2', caption: 'Sends an image / file / video' },
    transfer: { group: 'action', icon: '👤', label: 'Assign to agent', color: '#8b5cf6', caption: 'Hands the conversation to a human agent' },
    send_http: { group: 'action', icon: '🌐', label: 'Send HTTP request', color: '#f59e0b', caption: 'Calls an external system (CRM / ERP)' },
    delay: { group: 'action', icon: '⏱️', label: 'Delay', color: '#64748b', caption: 'Waits a while before the next step' },
  },
};

const SECTIONS = {
  he: [
    { title: 'טריגרים', keys: ['trigger_regular', 'trigger_button', 'trigger_reply'] },
    { title: 'הודעות נשלחות', keys: ['message_regular', 'message_template', 'message_media'] },
    { title: 'פעולות', keys: ['transfer', 'send_http', 'delay'] },
  ],
  en: [
    { title: 'Triggers', keys: ['trigger_regular', 'trigger_button', 'trigger_reply'] },
    { title: 'Sent messages', keys: ['message_regular', 'message_template', 'message_media'] },
    { title: 'Actions', keys: ['transfer', 'send_http', 'delay'] },
  ],
};

// which node keys can carry Quick-Reply buttons (mirrors the real builder)
const BUTTONS_ALLOWED = new Set(['trigger_button', 'message_template', 'message_regular']);

let uid = 0;
const nextId = () => `n${++uid}`;

export default function BotBuilderMiniDemo({ isEn = false }) {
  const lang = isEn ? 'en' : 'he';
  const defs = NODES[lang];
  const sections = SECTIONS[lang];

  const makeNode = (key) => {
    const d = defs[key];
    return {
      id: nextId(),
      key,
      group: d.group,
      icon: d.icon,
      label: d.label,
      color: d.color,
      bubble: d.bubble || '',
      caption: d.caption || '',
      buttons: Array.isArray(d.buttons) ? [...d.buttons] : [],
    };
  };

  // Default flow = the exact conversation the planner is built for:
  // incoming template + buttons  →  send message
  const buildDefault = () => [makeNode('trigger_button'), makeNode('message_regular')];

  const [flow, setFlow] = useState(buildDefault);
  const [dragOver, setDragOver] = useState(false);
  const dragKey = useRef(null);
  const reorderFrom = useRef(null);

  const addBlock = (key) => setFlow((f) => [...f, makeNode(key)]);
  const removeBlock = (id) => setFlow((f) => f.filter((n) => n.id !== id));
  const resetFlow = () => setFlow(buildDefault());

  const addButton = (id) =>
    setFlow((f) =>
      f.map((n) =>
        n.id === id ? { ...n, buttons: [...n.buttons, isEn ? 'New option' : 'אפשרות נוספת'] } : n
      )
    );
  const removeButton = (id, idx) =>
    setFlow((f) =>
      f.map((n) => (n.id === id ? { ...n, buttons: n.buttons.filter((_, i) => i !== idx) } : n))
    );

  // Palette → canvas
  const onPaletteDragStart = (key) => (e) => {
    dragKey.current = key;
    e.dataTransfer.effectAllowed = 'copy';
    try { e.dataTransfer.setData('text/plain', key); } catch (_) {}
  };
  const onCanvasDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const key = dragKey.current || e.dataTransfer.getData('text/plain');
    dragKey.current = null;
    if (key && defs[key]) addBlock(key);
  };

  // Reorder within the flow
  const onNodeDragStart = (index) => (e) => {
    reorderFrom.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };
  const onNodeDrop = (index) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const from = reorderFrom.current;
    reorderFrom.current = null;
    if (from === null || from === index) return;
    setFlow((f) => {
      const copy = [...f];
      const [moved] = copy.splice(from, 1);
      copy.splice(index, 0, moved);
      return copy;
    });
  };

  const dir = isEn ? 'ltr' : 'rtl';

  return (
    <div className={styles.wrap} dir={dir}>
      {/* Palette */}
      <aside className={styles.palette}>
        <div className={styles.paletteTitle}>{isEn ? 'Blocks' : 'בלוקים'}</div>
        <div className={styles.paletteHint}>
          {isEn ? 'Drag onto the canvas → or tap to add' : 'גררו אל הקנבס ← או הקישו כדי להוסיף'}
        </div>
        {sections.map((sec) => (
          <div key={sec.title} className={styles.paletteSection}>
            <div className={styles.sectionTitle}>{sec.title}</div>
            {sec.keys.map((key) => {
              const b = defs[key];
              return (
                <button
                  key={key}
                  type="button"
                  className={styles.paletteItem}
                  style={{ '--accent': b.color }}
                  draggable
                  onDragStart={onPaletteDragStart(key)}
                  onClick={() => addBlock(key)}
                >
                  <span className={styles.pIcon} style={{ background: b.color }}>{b.icon}</span>
                  <span className={styles.pLabel}>{b.label}</span>
                  <span className={styles.pPlus}>+</span>
                </button>
              );
            })}
          </div>
        ))}
      </aside>

      {/* Canvas */}
      <div
        className={`${styles.canvas} ${dragOver ? styles.canvasOver : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onCanvasDrop}
      >
        <div className={styles.canvasHead}>
          <span className={styles.canvasTitle}>{isEn ? 'Your Bot Flow' : 'זרימת הבוט שלכם'}</span>
          <button type="button" className={styles.resetBtn} onClick={resetFlow}>
            {isEn ? '↺ Reset' : '↺ איפוס'}
          </button>
        </div>

        <div className={styles.flowList}>
          {flow.map((n, i) => {
            const canButtons = BUTTONS_ALLOWED.has(n.key);
            const removable = i !== 0;
            return (
              <div key={n.id} className={styles.flowNodeWrap}>
                <div
                  className={styles.flowNode}
                  style={{ borderInlineStartColor: n.color }}
                  draggable
                  onDragStart={onNodeDragStart(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onNodeDrop(i)}
                >
                  <div className={styles.nodeHead}>
                    <span className={styles.nodeIcon} style={{ background: n.color }}>{n.icon}</span>
                    <span className={styles.nodeLabel}>{n.label}</span>
                    {removable && (
                      <button
                        type="button"
                        className={styles.nodeRemove}
                        onClick={() => removeBlock(n.id)}
                        aria-label={isEn ? 'Remove' : 'הסרה'}
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {n.bubble && <div className={styles.bubble}>{n.bubble}</div>}
                  {n.caption && <div className={styles.caption}>{n.caption}</div>}

                  {canButtons && (
                    <div className={styles.buttons}>
                      {n.buttons.map((b, idx) => (
                        <div key={idx} className={styles.qr}>
                          <span className={styles.qrText}>{b}</span>
                          <button
                            type="button"
                            className={styles.qrRemove}
                            onClick={() => removeButton(n.id, idx)}
                            aria-label={isEn ? 'Remove button' : 'הסרת כפתור'}
                          >
                            ×
                          </button>
                          {/* green connection handle — each button = its own branch */}
                          <span className={styles.handle} aria-hidden />
                        </div>
                      ))}
                      <button type="button" className={styles.addBtn} onClick={() => addButton(n.id)}>
                        {isEn ? '+ Add button' : '+ הוסף כפתור'}
                      </button>
                    </div>
                  )}
                </div>

                {i < flow.length - 1 && (
                  <div className={styles.connector} aria-hidden>
                    <span className={styles.connectorLine} />
                    <span className={styles.connectorArrow}>▾</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.canvasFooter}>
          {isEn
            ? `${flow.length} blocks • Each Quick-Reply button opens its own branch — the real builder has 40+ block types`
            : `${flow.length} בלוקים • כל כפתור Quick-Reply פותח הסתעפות משלו — בבונה האמיתי יש 40+ סוגי בלוקים`}
        </div>
      </div>
    </div>
  );
}
