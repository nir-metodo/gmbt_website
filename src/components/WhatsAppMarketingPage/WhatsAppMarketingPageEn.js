'use client';
import { useState, useEffect } from 'react';
import styles from './WhatsAppMarketingPage.module.css';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('Hi Gambot 👋 I want to learn about WhatsApp marketing');

function trackWAClick(location = 'button') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: location });
    window.gtag('event', 'conversion', { send_to: 'AW-18018385768/tTojCPDWio0cEOj-6o9D', value: 1.0, currency: 'ILS' });
  }
  window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank');
}

const COMPARISON = [
  { channel: '📧 Email', open: '18-22%', click: '2-3%', response: 'Hours–Days', color: '#ef4444', bad: true },
  { channel: '📱 SMS', open: '45-50%', click: '4-6%', response: 'Hours', color: '#f59e0b', bad: false },
  { channel: '💬 WhatsApp', open: '85-98%', click: '25-40%', response: 'Minutes', color: '#25D366', bad: false, highlight: true },
];

const USE_CASES = [
  {
    icon: '🔄', title: 'Cold leads that went quiet',
    desc: 'Have a list of prospects who never converted? Send a targeted campaign — the bot warms them back up and passes only the hot ones to your team.',
    tag: 'Retargeting', tagColor: '#7c3aed',
  },
  {
    icon: '👥', title: 'Existing customers',
    desc: 'Product update, exclusive offer, event invitation — send to your list. 95%+ open rate ensures the message lands.',
    tag: 'Retention', tagColor: '#128C7E',
  },
  {
    icon: '🎯', title: 'Targeted sales campaigns',
    desc: 'Segment by interest, purchase history, location — everyone gets a message that\'s personally relevant.',
    tag: 'Segmentation', tagColor: '#2563eb',
  },
  {
    icon: '📅', title: 'Reminders & updates',
    desc: 'Meeting reminder, subscription renewal, expiry date — automated, at the right time, on the channel the customer actually opens.',
    tag: 'Automation', tagColor: '#d97706',
  },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '📋', title: 'Upload your list', desc: 'A list of phone numbers — from your CRM, website, or spreadsheet. We organize and clean it.' },
  { step: '02', icon: '✍️', title: 'Build the message', desc: 'Text + image/video/file + reply buttons. Segment — each group gets its own version.' },
  { step: '03', icon: '🚀', title: 'Send in one click', desc: 'Immediate or scheduled. Our platform sends legally through the WhatsApp Business API.' },
  { step: '04', icon: '🤖', title: 'Bot warms up responses', desc: 'Replied? The bot engages — answers, qualifies, books. A human only joins for the right leads.' },
  { step: '05', icon: '📊', title: 'Track results', desc: 'Sent / Delivered / Read / Replied / Converted — full ROI visibility.' },
];

const FEATURES = [
  { icon: '✅', text: 'Compliant WhatsApp Business API sending' },
  { icon: '📎', text: 'Supports images, videos, documents and buttons' },
  { icon: '🎯', text: 'List segmentation by any field' },
  { icon: '⏰', text: 'Scheduled sending — date, time, time zone' },
  { icon: '🤖', text: 'Auto bot response when customer replies' },
  { icon: '📈', text: 'Real-time reports: delivered / read / replied' },
  { icon: '🔗', text: 'Integration with CRM — lead auto-created' },
  { icon: '🌐', text: 'Multi-language message support' },
];

const FAQS = [
  { q: 'Is this legal? Won\'t we get blocked?', a: 'Absolutely legal. We work through the official WhatsApp Business API — the same infrastructure used by the world\'s largest companies. Sending requires a pre-approved message template by Meta. We help you write and submit templates for approval.' },
  { q: 'Can I send to any list?', a: 'You can send to people who have interacted with your business or opted in to receive messages. We\'ll advise on which lists are suitable and how to keep your account in good standing.' },
  { q: 'How do responses work?', a: 'The moment someone replies — our bot is activated. It continues the conversation according to the flow you defined: qualifying questions, booking a meeting, sending a quote. A human agent only joins when the lead is ready.' },
  { q: 'How quickly can we launch a first campaign?', a: 'Usually 3-5 business days: template approval, list preparation, bot flow setup. First campaign goes out within a week of signing up.' },
  { q: 'What results can we expect?', a: 'Average open rate: 85-95%. Response rate: 15-35% depending on the quality of the message and list. These numbers are 5-10x better than email for the same audience.' },
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

function MiniLeadForm({ source = 'wa-marketing-en' }) {
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
        {status === 'loading' ? '⏳ Sending...' : '🚀 Launch Your First Campaign'}
      </button>
    </form>
  );
}

export default function WhatsAppMarketingPageEn() {
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
        <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`} target="_blank" rel="noreferrer"
          className={styles.headerWa} onClick={(e) => { e.preventDefault(); trackWAClick('header'); }}>
          💬 Free Demo
        </a>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>📢 WhatsApp Marketing · 95%+ Open Rate · Bot-Powered</div>
          <h1 className={styles.heroTitle}>
            Why your marketing messages<br />
            <span className={styles.heroHighlight}>are being ignored — and how to fix it</span>
          </h1>
          <p className={styles.heroDesc}>
            WhatsApp has a 95%+ open rate vs 20% for email.
            Combined with an AI bot that warms and qualifies leads automatically —
            this is the marketing channel that actually converts.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.ctaPrimary} onClick={() => trackWAClick('hero_primary')}>🚀 Start Your First Campaign</button>
            <button className={styles.ctaSecondary} onClick={() => trackWAClick('hero_secondary')}>💬 Ask on WhatsApp</button>
          </div>
          <p className={styles.ctaSub}>⚡ Legal WhatsApp API · Bot auto-responds · Full ROI tracking</p>
        </div>
      </section>

      <section className={styles.comparisonSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>📊 WhatsApp vs Email vs SMS</h2>
          <div className={styles.comparisonTable}>
            <div className={styles.comparisonHeader}>
              <span>Channel</span><span>Open Rate</span><span>Click Rate</span><span>Response Time</span>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={i} className={`${styles.comparisonRow} ${row.highlight ? styles.comparisonRowHighlight : ''}`}
                style={{ borderColor: row.color }}>
                <span style={{ fontWeight: 700, color: row.color }}>{row.channel}</span>
                <span style={{ color: row.bad ? '#ef4444' : '#059669', fontWeight: 700 }}>{row.open}</span>
                <span style={{ color: row.bad ? '#ef4444' : '#059669', fontWeight: 700 }}>{row.click}</span>
                <span>{row.response}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.useCases}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🎯 Who is this for?</h2>
          <div className={styles.useCasesGrid}>
            {USE_CASES.map((uc, i) => (
              <div key={i} className={styles.useCaseCard}>
                <div className={styles.useCaseIcon}>{uc.icon}</div>
                <div className={styles.useCaseTag} style={{ background: uc.tagColor }}>{uc.tag}</div>
                <h3>{uc.title}</h3>
                <p>{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>⚙️ How it works</h2>
          <div className={styles.howSteps}>
            {HOW_IT_WORKS.map((s, i) => (
              <div key={i} className={styles.howStep}>
                <div className={styles.howNum}>{s.step}</div>
                <div className={styles.howIcon}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>✅ Everything included in the platform</h2>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureItem}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.midCta}>
        <div className={styles.container}>
          <div className={styles.midCtaInner}>
            <div>
              <h3>💡 Want to see a live campaign?</h3>
              <p>We'll show you a full campaign from list to results — 20-minute demo</p>
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
          <h2 className={styles.ctaTitle}>🚀 Ready to send campaigns that actually get read?</h2>
          <p className={styles.ctaDesc}>Leave your details — first campaign live within a week</p>
          <MiniLeadForm source="wa-marketing-en" />
          <div className={styles.ctaOr}>
            <span>or</span>
            <button className={styles.ctaWaBtn} onClick={() => trackWAClick('cta_bottom')}>💬 WhatsApp Us</button>
          </div>
          <p className={styles.privacy}>🔒 No commitment · Legal WhatsApp API · Full support</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Gambot · Official Meta Partner · <a href="/privacy">Privacy Policy</a></p>
      </footer>
    </div>
  );
}
