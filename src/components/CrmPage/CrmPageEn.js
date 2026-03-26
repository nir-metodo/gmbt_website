'use client';
import { useState, useEffect } from 'react';
import styles from './CrmPage.module.css';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('Hi Gambot 👋 I want to learn about your CRM');

function trackWAClick(location = 'button') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: location });
    window.gtag('event', 'conversion', { send_to: 'AW-18018385768/tTojCPDWio0cEOj-6o9D', value: 1.0, currency: 'ILS' });
  }
  window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank');
}

const INTEGRATIONS = [
  { icon: '📘', name: 'Facebook CTWA', desc: 'Ad click → WhatsApp conversation → lead created automatically' },
  { icon: '📋', name: 'Facebook Forms', desc: 'Submit a Facebook Lead Form → instantly appears in CRM' },
  { icon: '🌐', name: 'Landing Pages', desc: 'Simple embed code — every lead from your page enters directly' },
  { icon: '💬', name: 'WhatsApp', desc: 'Contact via WhatsApp → contact created & conversation opened automatically' },
  { icon: '🔗', name: 'Webhook / API', desc: 'Connect to any system — Zapier, Make, custom API' },
];

const KANBAN_STAGES = [
  { name: 'New Lead', color: '#6b7280', leads: [
    { name: 'David Cohen', value: '$3,200', source: 'FB Ads' },
    { name: 'Rachel Levy', value: '$2,200', source: 'Landing Page' },
  ]},
  { name: 'Contacted', color: '#2563eb', leads: [
    { name: 'Joseph Miller', value: '$5,800', source: 'WhatsApp' },
  ]},
  { name: 'Proposal Sent', color: '#d97706', leads: [
    { name: 'Michelle Brown', value: '$9,500', source: 'FB Forms' },
    { name: 'Avi Gold', value: '$4,100', source: 'CTWA' },
  ]},
  { name: 'Negotiation', color: '#7c3aed', leads: [
    { name: 'Sarah Green', value: '$13,000', source: 'Landing Page' },
  ]},
  { name: 'Closed ✓', color: '#25D366', leads: [
    { name: 'Noah Kim', value: '$7,800', source: 'WhatsApp' },
  ]},
];

const FEATURES = [
  { icon: '📊', title: 'Visual Lead Kanban', desc: 'Drag and drop between stages, colors, values, sources — bird\'s eye view of your entire pipeline', color: '#2563eb' },
  { icon: '🔗', title: 'Connect Everything', desc: 'Facebook CTWA, Forms, landing pages, WhatsApp, API — every lead enters automatically', color: '#1877f2' },
  { icon: '🎨', title: 'Dynamic Fields', desc: 'Add custom fields for your business — date, list, text, number, file', color: '#7c3aed' },
  { icon: '💬', title: 'WhatsApp from Lead Card', desc: 'Send messages directly from the lead card — full history stays inside the system', color: '#25D366' },
  { icon: '✅', title: 'Tasks with Notifications', desc: 'Create a task for a lead, set a date and owner — get notified via WhatsApp/email on time', color: '#ef4444' },
  { icon: '📄', title: 'Quotes + E-Signature', desc: 'Build a quote in minutes, send via WhatsApp, customer signs digitally — all documented', color: '#d97706' },
  { icon: '📋', title: 'Cases (Support)', desc: 'Manage support requests with SLA, priority, and owner — linked to the same customer', color: '#0891b2' },
  { icon: '📈', title: 'Advanced Reports', desc: 'Conversions by source, agent performance, pipeline value, handling times — all visual and exportable', color: '#059669' },
];

const LEAD_CARD = {
  name: 'Michelle Brown',
  phone: '+1-555-1234',
  source: 'Facebook CTWA',
  stage: 'Proposal Sent',
  value: '$9,500',
  owner: 'Joseph M.',
  tags: ['VIP', 'Hot'],
  fields: [
    { label: 'Company size', value: '15-50 employees' },
    { label: 'Industry', value: 'Business Consulting' },
    { label: 'Budget', value: '$8K-12K' },
  ],
  tasks: [
    { done: true, text: 'Initial discovery call' },
    { done: false, text: 'Send proposal — by Mar 25', urgent: true },
    { done: false, text: 'Follow up on proposal' },
  ],
  messages: [
    { side: 'out', text: 'Hi Michelle! Happy to send you our proposal' },
    { side: 'in', text: 'Sure, thanks! Looking forward to it' },
  ],
};

const REPORTS = [
  { icon: '📊', title: 'Conversions by Source', desc: 'Leads from CTWA, Forms, landing pages — which source converts best' },
  { icon: '👤', title: 'Agent Performance', desc: 'How many leads each agent handled, closed, and average time to close' },
  { icon: '💰', title: 'Pipeline Value', desc: 'How much money is in each stage and likelihood to close — revenue forecast' },
  { icon: '⏱️', title: 'Handling Times', desc: 'How long leads wait in each stage — identifies bottlenecks' },
  { icon: '📋', title: 'Cases Report', desc: 'Volume, SLA compliance, recurring topics — to improve service' },
  { icon: '📑', title: 'Quotes Report', desc: 'Sent / Viewed / Approved — conversion rate from quote to deal' },
];

const FAQS = [
  {
    q: 'How do Facebook leads enter automatically?',
    a: 'Connect your Facebook page once. From that moment, every lead from Facebook Lead Forms or Click-to-WhatsApp Ads appears in the CRM within seconds — with all details filled in. No manual copying.',
  },
  {
    q: 'What is CTWA and how does it work?',
    a: 'CTWA — Click to WhatsApp Ads. A Facebook/Instagram ad that opens a WhatsApp conversation on click. Our bot receives the lead, asks qualifying questions, and passes a qualified lead to the CRM with all information.',
  },
  {
    q: 'Can I add custom fields for my business type?',
    a: 'Yes — dynamic fields. Add fields like "Budget", "Company size", "Industry", "Event date" — any field relevant to you. You can also create sections and organize by groups.',
  },
  {
    q: 'How do I send a quote?',
    a: 'From the lead card, click "Quote" — choose items, prices, discounts. The quote is sent directly to the customer\'s WhatsApp in one click. The customer clicks "Approve" and signs digitally — all documented in the customer file.',
  },
  {
    q: 'How do task notifications work?',
    a: 'When creating a task, set a due date and owner. X hours before — the agent receives a notification via WhatsApp and/or email. You can also set recurring reminders if the task wasn\'t handled.',
  },
  {
    q: 'Can I export data?',
    a: 'Yes — export to Excel/CSV from any list or report. You can also connect to Google Sheets for live sync.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqOpen : ''}`}>
      <button className={styles.faqQ} onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className={styles.faqArrow}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <p className={styles.faqA}>{a}</p>}
    </div>
  );
}

function MiniLeadForm({ source = 'crm-en-landing-page' }) {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone) return;
    setStatus('loading');
    try {
      await Promise.allSettled([
        fetch('https://prod-00.northeurope.logic.azure.com:443/workflows/24826d9f1f30448cb12884561d7bcc2b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RMrmjA9SPjryV5VE5iP8elY_V6tFdxhMgjs-zQI8FPQ', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, source, ClientId: 'R9f6r4oe5PSCLr6CnYRQ' }),
        }),
        sendLeadWebhook({ name: form.name, phone: form.phone, source }),
        sendThankYouEmail({ name: form.name, email: '', source }),
      ]);
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'generate_lead', { event_category: 'lead_form', event_label: source });
        window.gtag('event', 'conversion', { send_to: 'AW-18018385768/zoGcCMK4-IwcEOj-6o9D', value: 1.0, currency: 'ILS' });
      }
      window.location.href = '/thank-you';
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className={styles.miniForm} onSubmit={handleSubmit} dir="ltr">
      <input type="text" placeholder="Full name *" value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className={styles.miniInput} style={{ textAlign: 'left' }} required />
      <input type="tel" placeholder="Phone number *" value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
        className={styles.miniInput} style={{ textAlign: 'left' }} required />
      <button type="submit" className={styles.miniSubmit} disabled={status === 'loading'}>
        {status === 'loading' ? '⏳ Sending...' : '🚀 Get a Free Demo'}
      </button>
      {status === 'error' && (
        <p className={styles.formError}>Error — <a href={`https://wa.me/${WA_NUMBER}`}>contact us on WhatsApp</a></p>
      )}
    </form>
  );
}

export default function CrmPageEn() {
  const [activeTab, setActiveTab] = useState('kanban');

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    return () => {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'he';
    };
  }, []);

  return (
    <div className={styles.page} dir="ltr">

      <header className={styles.header}>
        <img src="/new_logo.png" alt="Gambot" className={styles.logo} />
        <div className={styles.headerRight} style={{ flexDirection: 'row-reverse' }}>
          <span className={styles.headerBadge}>🏆 CRM + WhatsApp + Reports</span>
          <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`} target="_blank" rel="noreferrer"
            className={styles.headerWa}
            onClick={(e) => { e.preventDefault(); trackWAClick('header'); }}>
            💬 Free Demo
          </a>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>🚀 CRM · WhatsApp · Leads · Tasks · Quotes</div>
          <h1 className={styles.heroTitle}>
            All your leads, tasks and deals<br />
            <span className={styles.heroHighlight}>in one place — never lose a customer again</span>
          </h1>
          <p className={styles.heroDesc}>
            Leads from Facebook, CTWA and landing pages enter automatically.
            Beautiful kanban board, custom fields, WhatsApp messaging from the lead card,
            tasks with notifications, and quotes with digital signature.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.ctaPrimary} onClick={() => trackWAClick('hero_primary')}>
              🚀 Get a Free Demo
            </button>
            <button className={styles.ctaSecondary} onClick={() => trackWAClick('hero_secondary')}>
              💬 Ask on WhatsApp
            </button>
          </div>
          <p className={styles.ctaSub}>⚡ 1-month free trial · No credit card · Connected within days</p>
        </div>
      </section>

      <section className={styles.integrations}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🔗 Leads arrive from everywhere — automatically</h2>
          <p className={styles.sectionDesc}>Connect once — everything flows in by itself</p>
          <div className={styles.intGrid}>
            {INTEGRATIONS.map((int, i) => (
              <div key={i} className={styles.intCard}>
                <div className={styles.intIcon}>{int.icon}</div>
                <strong>{int.name}</strong>
                <p>{int.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.ctwaSpotlight} style={{ direction: 'ltr' }}>
            <div className={styles.ctwaLeft}>
              <div className={styles.ctwaBadge}>📘 Facebook CTWA</div>
              <h3>Ad click → Hot lead in CRM</h3>
              <p>Facebook/Instagram ad → customer clicks → WhatsApp opens → bot collects details → full lead enters CRM — in 60 seconds, automatically, without an agent.</p>
              <ul className={styles.ctwaList}>
                <li>✓ Much lower cost per lead than form ads</li>
                <li>✓ Lead is already in conversation — very warm</li>
                <li>✓ Bot qualifies and scores before an agent touches it</li>
              </ul>
            </div>
            <div className={styles.ctwaRight}>
              <div className={styles.ctwaFlow}>
                {['📱 Facebook Ad', '💬 Opens WhatsApp', '🤖 Bot collects info', '📊 Lead in CRM', '👤 Agent handles'].map((step, i) => (
                  <div key={i} className={styles.ctwaFlowStep}>
                    <span>{step}</span>
                    {i < 4 && <span className={styles.ctwaArrow}>↓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.productDemo}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🎯 Lead management that actually looks good</h2>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${activeTab === 'kanban' ? styles.tabActive : ''}`} onClick={() => setActiveTab('kanban')}>
              📊 Lead Kanban
            </button>
            <button className={`${styles.tab} ${activeTab === 'card' ? styles.tabActive : ''}`} onClick={() => setActiveTab('card')}>
              🗂️ Lead Card
            </button>
          </div>

          {activeTab === 'kanban' && (
            <div className={styles.kanbanWrap}>
              <div className={styles.kanban}>
                {KANBAN_STAGES.map((stage, si) => (
                  <div key={si} className={styles.kanbanCol}>
                    <div className={styles.kanbanColHeader} style={{ borderTopColor: stage.color }}>
                      <span style={{ color: stage.color }}>●</span>
                      <span>{stage.name}</span>
                      <span className={styles.kanbanCount}>{stage.leads.length}</span>
                    </div>
                    {stage.leads.map((lead, li) => (
                      <div key={li} className={styles.kanbanCard}>
                        <div className={styles.kanbanCardName}>{lead.name}</div>
                        <div className={styles.kanbanCardMeta}>
                          <span className={styles.kanbanValue}>{lead.value}</span>
                          <span className={styles.kanbanSource}>{lead.source}</span>
                        </div>
                        <div className={styles.kanbanCardActions}>
                          <span>💬</span><span>✅</span><span>📄</span>
                        </div>
                      </div>
                    ))}
                    <button className={styles.kanbanAdd}>+ Add lead</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'card' && (
            <div className={styles.leadCardWrap}>
              <div className={styles.leadCard}>
                <div className={styles.lcHeader}>
                  <div className={styles.lcAvatar}>{LEAD_CARD.name[0]}</div>
                  <div className={styles.lcInfo}>
                    <h3>{LEAD_CARD.name}</h3>
                    <p>{LEAD_CARD.phone} · {LEAD_CARD.source}</p>
                  </div>
                  <div className={styles.lcTags}>
                    {LEAD_CARD.tags.map((t, i) => <span key={i} className={styles.lcTag}>{t}</span>)}
                  </div>
                </div>
                <div className={styles.lcMeta}>
                  <span>📌 {LEAD_CARD.stage}</span>
                  <span>💰 {LEAD_CARD.value}</span>
                  <span>👤 {LEAD_CARD.owner}</span>
                </div>
                <div className={styles.lcBody}>
                  <div className={styles.lcSection}>
                    <div className={styles.lcSectionTitle}>🎨 Custom Fields</div>
                    {LEAD_CARD.fields.map((f, i) => (
                      <div key={i} className={styles.lcField}>
                        <span className={styles.lcFieldLabel}>{f.label}</span>
                        <span className={styles.lcFieldValue}>{f.value}</span>
                      </div>
                    ))}
                    <button className={styles.lcAddField}>+ Add field</button>
                  </div>
                  <div className={styles.lcSection}>
                    <div className={styles.lcSectionTitle}>✅ Tasks</div>
                    {LEAD_CARD.tasks.map((t, i) => (
                      <div key={i} className={`${styles.lcTask} ${t.urgent ? styles.lcTaskUrgent : ''}`}>
                        <span className={t.done ? styles.lcTaskDone : styles.lcTaskTodo}>{t.done ? '✅' : '⬜'}</span>
                        <span className={t.done ? styles.lcTaskTextDone : ''}>{t.text}</span>
                        {t.urgent && <span className={styles.lcUrgentTag}>🔔 Urgent</span>}
                      </div>
                    ))}
                    <button className={styles.lcAddField}>+ New task</button>
                  </div>
                  <div className={styles.lcSection}>
                    <div className={styles.lcSectionTitle}>💬 WhatsApp from card</div>
                    <div className={styles.lcChat}>
                      {LEAD_CARD.messages.map((m, i) => (
                        <div key={i} className={m.side === 'out' ? styles.lcMsgOut : styles.lcMsgIn}>{m.text}</div>
                      ))}
                    </div>
                    <div className={styles.lcChatInput}>
                      <span className={styles.lcChatPlaceholder}>Type a message...</span>
                      <button className={styles.lcChatSend}>Send 💬</button>
                    </div>
                  </div>
                </div>
                <div className={styles.lcActions}>
                  <button className={styles.lcActionBtn} style={{ background: '#d97706' }}>📄 Send Quote</button>
                  <button className={styles.lcActionBtn} style={{ background: '#2563eb' }}>📋 New Case</button>
                  <button className={styles.lcActionBtn} style={{ background: '#25D366' }}>💬 Send Message</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>✅ Everything included in the CRM</h2>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureCard} style={{ '--accent': f.color }}>
                <div className={styles.featureIcon} style={{ background: `${f.color}15`, color: f.color }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.quotes}>
        <div className={styles.container}>
          <div className={styles.quotesInner} style={{ direction: 'ltr' }}>
            <div className={styles.quotesText}>
              <div className={styles.quotesBadge}>📄 Quotes + Digital Signature</div>
              <h2>From conversation — to quote — to close</h2>
              <p>Build a quote in minutes directly from the lead card. Send via WhatsApp in one click. The customer approves and signs digitally — no printing, no PDF. Everything is automatically documented in the customer file.</p>
              <ul className={styles.quotesList}>
                <li>✓ Build quote with items, quantities, discounts and VAT</li>
                <li>✓ Send directly to customer's WhatsApp</li>
                <li>✓ Track: viewed / approved / rejected</li>
                <li>✓ Legally binding digital signature from phone</li>
                <li>✓ Auto PDF after approval</li>
              </ul>
              <button className={styles.quotesBtn} onClick={() => trackWAClick('quotes')}>
                💬 See how it works
              </button>
            </div>
            <div className={styles.quotesMockup}>
              <div className={styles.quoteMock}>
                <div className={styles.quoteMockHeader}>📄 Quote #142</div>
                <div className={styles.quoteMockClient}>To: Michelle Brown</div>
                <table className={styles.quoteMockTable}>
                  <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
                  <tbody>
                    <tr><td>Annual CRM Package</td><td>1</td><td>$6,500</td></tr>
                    <tr><td>Setup & Integrations</td><td>1</td><td>$1,100</td></tr>
                    <tr><td>Team Training</td><td>2</td><td>$600</td></tr>
                  </tbody>
                </table>
                <div className={styles.quoteMockTotal}>
                  <span>Total excl. tax:</span><strong>$8,200</strong>
                </div>
                <div className={styles.quoteMockSign}>
                  <button className={styles.quoteMockBtn}>✍️ Sign Digitally</button>
                  <button className={styles.quoteMockBtnSec}>❌ Decline</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.reports}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>📈 Reports that help you make decisions</h2>
          <div className={styles.reportsGrid}>
            {REPORTS.map((r, i) => (
              <div key={i} className={styles.reportCard}>
                <div className={styles.reportIcon}>{r.icon}</div>
                <strong>{r.title}</strong>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.midCta}>
        <div className={styles.container}>
          <div className={styles.midCtaInner}>
            <div>
              <h3>💡 Want to see the CRM in action?</h3>
              <p>20-minute demo — we'll show you the whole system on your data</p>
            </div>
            <button className={styles.midCtaBtn} onClick={() => trackWAClick('mid_cta')}>
              📞 Book a Demo
            </button>
          </div>
        </div>
      </section>

      <section className={styles.faq}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>❓ Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>🚀 Ready to stop managing leads in spreadsheets?</h2>
          <p className={styles.ctaDesc}>Leave your details — we'll demo the system within 24 hours</p>
          <MiniLeadForm source="crm-en-landing-page" />
          <div className={styles.ctaOr}>
            <span>or</span>
            <button className={styles.ctaWaBtn} onClick={() => trackWAClick('cta_bottom')}>
              💬 WhatsApp Us
            </button>
          </div>
          <p className={styles.privacy}>🔒 1-month free trial · No credit card · No commitment</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Gambot · Official Meta Partner · <a href="/privacy">Privacy Policy</a></p>
      </footer>
    </div>
  );
}
