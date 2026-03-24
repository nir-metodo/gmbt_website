'use client';
import { useState } from 'react';
import styles from './CampaignPage.module.css';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('Hi Gambot 👋 I want to try the WhatsApp bot');

const STATS = [
  { num: '24/7', label: 'Automated responses' },
  { num: '3 min', label: 'Average setup time' },
  { num: '98%', label: 'Customer satisfaction' },
];

const PAINS = [
  { icon: '⏰', text: 'Answering the same questions manually over and over — hours wasted every day' },
  { icon: '😤', text: 'Can\'t respond to everyone — customers leave for the competition' },
  { icon: '🤯', text: 'Conversation chaos — no one knows who handled what or what the status is' },
  { icon: '🌙', text: 'No coverage at night or weekends — leads are slipping away' },
];

const BENEFITS = [
  { icon: '🤖', title: '24/7 Automatic Responses', desc: 'The bot responds in seconds — at night, weekends, holidays. You won\'t lose a single lead' },
  { icon: '📋', title: 'All Conversations in One Place', desc: 'Clear status, known owner, nothing falls through the cracks' },
  { icon: '🎯', title: 'Filters & Routes Leads', desc: 'Sends only relevant inquiries to the right person — saves hours of sorting' },
  { icon: '📅', title: 'Books Appointments on Its Own', desc: 'The customer books a meeting directly with the bot — no waiting for an agent' },
  { icon: '📊', title: 'Built-in CRM', desc: 'Every lead, conversation and deal saved automatically — full tracking with zero effort' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Only get notified when human intervention is needed — the bot handles everything else' },
];

const FAQS = [
  { q: 'How long does it take to get started?', a: 'In most cases — 3 to 5 business days. We connect you to WhatsApp Business API (WABA), configure the bot to your needs, and you start receiving customers.' },
  { q: 'Does the bot sound robotic?', a: 'Not at all. We train the bot with your business\'s language — customers can\'t tell the difference. And if a conversation needs a human touch, the bot transfers to an agent within seconds.' },
  { q: 'What happens if the bot doesn\'t know how to answer?', a: 'The bot recognizes when it\'s reached its limit and transfers the conversation to a human agent immediately — with the full conversation history. No explanations needed.' },
  { q: 'Do I need to know how to code?', a: 'Not at all. Our interface is simple and visual — like building a presentation. We also help with the initial setup.' },
  { q: 'How much does it cost?', a: 'There are several packages based on business size and message volume. We\'ll present the options that suit you after sign-up — no commitment.' },
];

function trackWAClick(location = 'button') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: location });
    window.gtag('event', 'conversion', { send_to: 'AW-18018385768/tTojCPDWio0cEOj-6o9D', value: 1.0, currency: 'ILS' });
  }
  window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank');
}

function MiniLeadForm({ source = 'whatsapp-bot-campaign-en' }) {
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

export default function CampaignPageEn() {
  return (
    <div className={styles.page} dir="ltr">
      <header className={styles.header}>
        <img src="/new_logo.png" alt="Gambot" className={styles.logo} />
        <div className={styles.headerRight} style={{ flexDirection: 'row-reverse' }}>
          <span className={styles.headerBadge}>🏆 Dozens of businesses trust us</span>
          <button className={styles.headerWa} onClick={() => trackWAClick('header')}>💬 Free Demo</button>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>🤖 WhatsApp Bot — Leads, Service & Sales Automation</div>
          <h1 className={styles.heroTitle}>
            Stop losing customers<br />
            <span className={styles.heroHighlight}>because no one answered in time</span>
          </h1>
          <p className={styles.heroDesc}>
            A WhatsApp bot that responds 24/7, filters leads, books appointments,
            and transfers to a human only when needed — while you focus on closing deals.
          </p>
          <MiniLeadForm source="whatsapp-bot-campaign-en-hero" />
          <div className={styles.heroActions} style={{ marginTop: 16 }}>
            <button className={styles.ctaSecondary} onClick={() => trackWAClick('hero_wa')}>
              💬 Prefer to chat? WhatsApp us
            </button>
          </div>
          <p className={styles.ctaSub}>⚡ Free trial · No commitment · Connected within days</p>
        </div>
      </section>

      <div className={styles.statsBar}>
        {STATS.map((s, i) => (
          <div key={i} className={styles.statItem}>
            <span className={styles.statNum}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <section className={styles.pains}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>😩 Does this sound familiar?</h2>
          <div className={styles.painsList}>
            {PAINS.map((p, i) => (
              <div key={i} className={styles.painItem}>
                <span className={styles.painIcon}>{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>✅ What the bot does for you</h2>
          <div className={styles.benefitsGrid}>
            {BENEFITS.map((b, i) => (
              <div key={i} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.mockupSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>💬 What a conversation looks like</h2>
          <div className={styles.mockupChat}>
            {[
              { side: 'in', text: 'Hi, I want to get a price for your service' },
              { side: 'out', text: 'Hi! Great to hear from you 😊 I\'m Gambot\'s bot. What type of service are you interested in?' },
              { side: 'in', text: 'CRM and WhatsApp bot' },
              { side: 'out', text: 'Perfect! Can I get your name and I\'ll connect you with the right person?' },
              { side: 'in', text: 'Sure, David Cohen' },
              { side: 'out', text: 'Great David! I\'m transferring you to our team now. While you wait — would you like to book a 20-min demo call? 📅' },
            ].map((m, i) => (
              <div key={i} className={m.side === 'in' ? styles.chatIn : styles.chatOut}>{m.text}</div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.earlyAccess}>
        <div className={styles.container}>
          <div className={styles.eaBadge}>🔒 Safe · Secure · Official Meta Partner</div>
          <h2>Trusted by businesses that want results</h2>
          <p>We work with businesses across a wide range of industries — real estate, clinics, e-commerce, professional services and more. The bot adapts to your processes, not the other way around.</p>
          <div className={styles.eaFeatures}>
            <span>✅ Official WhatsApp Business API</span>
            <span>✅ GDPR compliant</span>
            <span>✅ Full onboarding support</span>
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>❓ Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2>🚀 Ready to automate your WhatsApp?</h2>
          <p>Leave your details — we'll reach out within 24 hours for a free demo</p>
          <MiniLeadForm source="whatsapp-bot-campaign-en-bottom" />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <button className={styles.ctaWa} onClick={() => trackWAClick('final_cta')}>
              💬 Or chat with us on WhatsApp
            </button>
          </div>
        </div>
      </section>

      <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`} target="_blank" rel="noreferrer"
        className={styles.floatBtn}
        onClick={(e) => { e.preventDefault(); trackWAClick('float'); }}>
        💬
      </a>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Gambot · Official Meta Partner · <a href="/privacy">Privacy Policy</a></p>
      </footer>
    </div>
  );
}
