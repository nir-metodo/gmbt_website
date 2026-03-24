'use client';
import { useState } from 'react';
import styles from './WhatsAppBusinessPage.module.css';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('Hi Gambot 👋 I want to learn about your WhatsApp business system');

function trackWAClick(location = 'button') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: location });
    window.gtag('event', 'conversion', { send_to: 'AW-18018385768/tTojCPDWio0cEOj-6o9D', value: 1.0, currency: 'ILS' });
  }
  window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank');
}

const PAINS = [
  { icon: '😤', title: 'No order in conversations', desc: 'Dozens of open chats, no one knows who handled what, what the status is, or what happens next' },
  { icon: '📱', title: 'Everyone on one number', desc: 'Agents rotate, customers get confused, no tracking and no accountability' },
  { icon: '🔀', title: 'Information chaos', desc: 'Leads here, invoices there, tasks in WhatsApp — nothing is synced' },
  { icon: '🌙', title: 'Inquiries falling through the cracks', desc: 'Customer wrote at night, fell between the chairs, went to a competitor — and you never knew' },
];

const MODULES = [
  {
    id: 'inbox',
    icon: '💬',
    title: 'Shared Inbox',
    color: '#128C7E',
    features: [
      'Each agent connects with their own personal user',
      'Every message logged with agent name and time',
      'Assign conversation owner — always know who\'s responsible',
      'Conversation status: Open / In Progress / Waiting / Closed',
      'Transfer conversations between agents in seconds',
      'Internal notes the customer never sees',
    ],
  },
  {
    id: 'routing',
    icon: '🎯',
    title: 'Smart Routing & Filtering',
    color: '#0d7a4e',
    features: [
      'Each agent sees only their area',
      'Sales sees only new leads',
      'Billing sees only payment inquiries',
      'Customer service sees issues and requests',
      'Personal work queue per agent',
      'Auto-routing rules based on keywords',
    ],
  },
  {
    id: 'crm',
    icon: '📊',
    title: 'Built-in CRM',
    color: '#2563eb',
    features: [
      'Every customer with full conversation history',
      'Leads with stages and pipeline',
      'Cases with SLA and priority',
      'Tasks with due date and owner',
      'Dynamic fields by customer/business type',
      'Full timeline for every contact',
    ],
  },
  {
    id: 'quotes',
    icon: '📄',
    title: 'Quotes & Sales Flow',
    color: '#d97706',
    features: [
      'Create a quote directly from the conversation',
      'Link lead → quote → deal',
      'Send quote via WhatsApp in seconds',
      'Digital signature on the quote',
      'Track: viewed / approved / rejected',
      'Sales performance reports by agent',
    ],
  },
  {
    id: 'reports',
    icon: '📈',
    title: 'Advanced Reports',
    color: '#7c3aed',
    features: [
      'Average response time by agent and team',
      'Conversation analysis: volume, duration, closure',
      'Lead performance by source and status',
      'Case and SLA analysis',
      'Workload per agent',
      'Export to Excel / Google Sheets',
    ],
  },
];

const WORKFLOW = [
  { icon: '📩', step: '01', title: 'Customer writes', desc: 'Arrives in the shared inbox with full history' },
  { icon: '🎯', step: '02', title: 'Auto-routed', desc: 'To the right agent by topic, skills, or queue' },
  { icon: '👤', step: '03', title: 'Agent handles', desc: 'Responds, notes, creates tasks — all documented' },
  { icon: '📋', step: '04', title: 'Lead/Case created', desc: 'With one button, including all conversation data' },
  { icon: '📄', step: '05', title: 'Quote sent', desc: 'Directly from the system to WhatsApp' },
  { icon: '✅', step: '06', title: 'Deal closed', desc: 'Appears in real-time reports' },
];

const FAQS = [
  { q: 'Does each agent connect with their own account?', a: 'Yes. Each agent logs in with their own username and password. Every message they send is logged under their name — the customer doesn\'t see the difference, but the manager knows exactly who wrote what and when.' },
  { q: 'Can a sales agent be prevented from seeing service conversations?', a: 'Exactly. You configure view permissions for each agent — they see only their work area. Sales sees leads, customer service sees cases, managers see everything.' },
  { q: 'What happens to a conversation when a customer writes again?', a: 'The system recognizes the customer and opens the same conversation. If the original owner isn\'t available, it goes to the queue or can be automatically reassigned.' },
  { q: 'How is the quote connected to the lead?', a: 'Directly. From the lead card, click "Create Quote" — the system pulls the customer name, details, and previous conversation. You add items and send. Everything stays under one customer file.' },
  { q: 'How quickly can we get started?', a: 'Usually 3-7 business days for full setup: WhatsApp connection, agent onboarding, routing configuration, and training. We handle the entire setup.' },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqOpen : ''}`}>
      <button className={styles.faqQ} onClick={() => setOpen(!open)}>
        <span>{q}</span><span className={styles.faqArrow}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <p className={styles.faqA}>{a}</p>}
    </div>
  );
}

function MiniLeadForm({ source = 'wa-business-en' }) {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState('idle');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await Promise.allSettled([
        fetch('https://prod-00.northeurope.logic.azure.com:443/workflows/24826d9f1f30448cb12884561d7bcc2b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RMrmjA9SPjryV5VE5iP8elY_V6tFdxhMgjs-zQI8FPQ', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
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
    } catch { setStatus('error'); }
  };
  return (
    <form className={styles.miniForm} onSubmit={handleSubmit} dir="ltr">
      <input type="text" placeholder="Full name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={styles.miniInput} style={{ textAlign: 'left' }} required />
      <input type="tel" placeholder="Phone number *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={styles.miniInput} style={{ textAlign: 'left' }} required />
      <button type="submit" className={styles.miniSubmit} disabled={status === 'loading'}>
        {status === 'loading' ? '⏳ Sending...' : '🚀 Get a Free Demo'}
      </button>
    </form>
  );
}

export default function WhatsAppBusinessPageEn() {
  const [activeModule, setActiveModule] = useState('inbox');
  const mod = MODULES.find(m => m.id === activeModule);

  return (
    <div className={styles.page} dir="ltr">
      <header className={styles.header}>
        <img src="/new_logo.png" alt="Gambot" className={styles.logo} />
        <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`} target="_blank" rel="noreferrer"
          className={styles.headerWa} onClick={(e) => { e.preventDefault(); trackWAClick('header'); }}>
          💬 Free Demo
        </a>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>👥 Multi-Agent · 📊 CRM · 📄 Quotes · 📈 Reports</div>
          <h1 className={styles.heroTitle}>
            Stop losing customers<br />
            <span className={styles.heroHighlight}>because no one knew who was handling them</span>
          </h1>
          <p className={styles.heroDesc}>
            Shared inbox with ownership and status, smart routing, built-in CRM,
            quotes with digital signature, and advanced reports — all in one WhatsApp system.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.ctaPrimary} onClick={() => trackWAClick('hero_primary')}>🚀 Get a Free Demo</button>
            <button className={styles.ctaSecondary} onClick={() => trackWAClick('hero_secondary')}>💬 Ask on WhatsApp</button>
          </div>
          <p className={styles.ctaSub}>⚡ 1-month free trial · No credit card · Connected within days</p>
        </div>
      </section>

      <section className={styles.pains}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>😩 Sound familiar?</h2>
          <div className={styles.painsGrid}>
            {PAINS.map((p, i) => (
              <div key={i} className={styles.painCard}>
                <div className={styles.painIcon}>{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.modules}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>✅ Everything the system includes</h2>
          <div className={styles.moduleTabs}>
            {MODULES.map(m => (
              <button key={m.id} className={`${styles.moduleTab} ${activeModule === m.id ? styles.moduleTabActive : ''}`}
                onClick={() => setActiveModule(m.id)} style={{ '--color': m.color }}>
                {m.icon} {m.title}
              </button>
            ))}
          </div>
          {mod && (
            <div className={styles.moduleDetail} style={{ '--color': mod.color }}>
              <h3>{mod.icon} {mod.title}</h3>
              <ul className={styles.moduleFeatures}>
                {mod.features.map((f, i) => <li key={i}>✅ {f}</li>)}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className={styles.workflow}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🔄 How the work flow looks</h2>
          <div className={styles.workflowSteps}>
            {WORKFLOW.map((s, i) => (
              <div key={i} className={styles.workflowStep}>
                <div className={styles.workflowNum}>{s.step}</div>
                <div className={styles.workflowIcon}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < WORKFLOW.length - 1 && <div className={styles.workflowArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.midCta}>
        <div className={styles.container}>
          <div className={styles.midCtaInner}>
            <div>
              <h3>💡 Want to see the system in action?</h3>
              <p>20-minute demo — we'll show you everything on your data</p>
            </div>
            <button className={styles.midCtaBtn} onClick={() => trackWAClick('mid_cta')}>📞 Book a Demo</button>
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
          <h2 className={styles.ctaTitle}>🚀 Ready to bring order to your WhatsApp?</h2>
          <p className={styles.ctaDesc}>Leave your details — we'll show you the system within 24 hours</p>
          <MiniLeadForm source="wa-business-en" />
          <div className={styles.ctaOr}>
            <span>or</span>
            <button className={styles.ctaWaBtn} onClick={() => trackWAClick('cta_bottom')}>💬 WhatsApp Us</button>
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
