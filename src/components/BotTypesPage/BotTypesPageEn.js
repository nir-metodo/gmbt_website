'use client';
import { useState } from 'react';
import styles from './BotTypesPage.module.css';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('Hi Gambot 👋 I want to learn about your WhatsApp bots');

function trackWAClick(location = 'button') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: location });
    window.gtag('event', 'conversion', { send_to: 'AW-18018385768/tTojCPDWio0cEOj-6o9D', value: 1.0, currency: 'ILS' });
  }
  window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank');
}

const BOT_TYPES = [
  {
    id: 'rule',
    icon: '🤖',
    name: 'Smart Bot',
    subtitle: 'Script-based',
    color: '#128C7E',
    tag: 'Most Popular',
    tagColor: '#128C7E',
    desc: 'Answers FAQs, routes conversations, books appointments — all according to scripts you define. Predictable, consistent, reliable.',
    pros: [
      'Fast setup — 3-5 days',
      'Low cost',
      'Consistent and accurate responses',
      'Ideal for fixed processes',
      'Easy to update and change',
    ],
    bestFor: 'Businesses with repetitive questions and clear processes: beauty salons, clinics, customer service',
    example: [
      { side: 'in', text: 'What are your opening hours?' },
      { side: 'out', text: 'Hi! We\'re open Mon–Fri 9am–7pm and Sat 9am–2pm 😊 Would you like to book an appointment?' },
      { side: 'in', text: 'Yes please' },
      { side: 'out', text: 'Great! Click here to pick a date and time: 📅 [Booking Link]' },
    ],
  },
  {
    id: 'ai',
    icon: '🧠',
    name: 'AI Bot',
    subtitle: 'Artificial Intelligence',
    color: '#6c35de',
    tag: 'Smartest',
    tagColor: '#6c35de',
    desc: 'Learns from your data, understands open-ended questions, responds naturally and always steers toward your defined goals.',
    pros: [
      'Understands complex open questions',
      'Learns from FAQ files you upload',
      'Sends product images / explainer videos / links',
      'Connects to external data sources',
      'Goal-oriented (sale, signup, appointment)',
    ],
    bestFor: 'Businesses with diverse products/services, many unpredictable questions, need for in-depth explanations',
    example: [
      { side: 'in', text: 'Which cream works for oily sensitive skin?' },
      { side: 'out', text: 'Great question! For oily-sensitive skin I recommend our HydraBalance — ultra-light gel, fragrance-free. Here\'s a look 👇' },
      { side: 'out', text: '🖼️ [Product Image]  |  📹 [Explainer Video]  |  🛒 [Buy Now]' },
    ],
  },
  {
    id: 'hybrid',
    icon: '⚡',
    name: 'Hybrid Bot',
    subtitle: 'Smart + Precise',
    color: '#d97706',
    tag: 'Recommended for growing businesses',
    tagColor: '#d97706',
    desc: 'Repetitive questions → Smart Bot answers instantly. Complex questions → AI steps in. The best of both worlds.',
    pros: [
      'Fast and consistent for routine questions',
      'Flexible and smart for complex ones',
      'Saves on AI costs',
      'Covers 100% of cases',
      'Scales with your business',
    ],
    bestFor: 'Growing businesses with both fixed processes and a diverse product/service catalog',
    example: [
      { side: 'in', text: 'What\'s the difference between Basic and Premium?' },
      { side: 'out', text: 'Great question! Basic includes X, Y, Z. Premium adds A and B. For most businesses your size, I\'d recommend Premium because...' },
      { side: 'in', text: 'What are your support hours?' },
      { side: 'out', text: 'Technical support: Mon–Fri 8am–6pm 📞 For urgent issues — 0800-XXX-XXX' },
    ],
  },
];

const AI_CAPABILITIES = [
  { icon: '📚', title: 'Learns from your data', desc: 'Upload FAQ files, product catalogs, usage guides — the AI absorbs everything and answers accordingly.' },
  { icon: '🖼️', title: 'Sends smart media', desc: 'Product images, explainer videos, PDFs, product page links — exactly when the customer needs them.' },
  { icon: '🔗', title: 'Connects to external sources', desc: 'Real-time inventory, your system\'s prices, order status, appointment calendar — AI fetches and answers directly.' },
  { icon: '🎯', title: 'Goal-oriented', desc: 'Set the goal as a sale, newsletter signup, or meeting booking — the bot leads every conversation there naturally.' },
  { icon: '🧩', title: 'Understands conversation context', desc: 'Remembers what was said two messages ago, never asks for repeated info, conducts conversations like a real person.' },
];

const FAQS = [
  { q: 'Which bot is right for my business?', a: 'If you have clear, repetitive processes (appointments, FAQ, price inquiries) — a Smart Bot is enough. If you have diverse products, complex questions or need in-depth explanations — an AI bot or hybrid is the right call. We\'ll help you decide on a free consultation call.' },
  { q: 'How long does setup take?', a: 'Smart Bot: 3-7 days. AI Bot: 7-14 days depending on the amount of data to upload. Hybrid: 10-21 days. We handle everything — you just provide the content and review.' },
  { q: 'Can the AI bot really sell products?', a: 'Yes. The bot can show images, send comparison links, answer pricing questions, and even handle simple orders — all within the WhatsApp conversation. We configure it to reach the goal you define.' },
  { q: 'What happens when the bot can\'t answer?', a: 'You can define a smart handoff: if the bot doesn\'t know — it passes to a human agent or opens a case. The customer never gets stuck.' },
  { q: 'Can I update the bot content myself?', a: 'Yes. Smart Bot — you update the scripts through our interface. AI Bot — you upload a new FAQ file or product catalog and the bot learns within hours.' },
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

function ChatDemo({ messages }) {
  return (
    <div className={styles.chatDemo}>
      {messages.map((m, i) => (
        <div key={i} className={m.side === 'in' ? styles.chatMsgIn : styles.chatMsgOut}>{m.text}</div>
      ))}
    </div>
  );
}

function MiniLeadForm({ source = 'bot-types-en' }) {
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
        {status === 'loading' ? '⏳ Sending...' : '🚀 Get a Free Consultation'}
      </button>
    </form>
  );
}

export default function BotTypesPageEn() {
  const [selected, setSelected] = useState('rule');
  const current = BOT_TYPES.find(b => b.id === selected);

  return (
    <div className={styles.page} dir="ltr">
      <header className={styles.header}>
        <img src="/new_logo.png" alt="Gambot" className={styles.logo} />
        <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`} target="_blank" rel="noreferrer"
          className={styles.headerWa} onClick={(e) => { e.preventDefault(); trackWAClick('header'); }}>
          💬 Free Consultation
        </a>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>🤖 Smart Bot · 🧠 AI Bot · ⚡ Hybrid Bot</div>
          <h1 className={styles.heroTitle}>
            Which WhatsApp bot<br />
            <span className={styles.heroHighlight}>is right for your business?</span>
          </h1>
          <p className={styles.heroDesc}>
            Not all bots are equal. Learn the differences, see live examples,
            and get a free recommendation.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.ctaPrimary} onClick={() => trackWAClick('hero')}>🚀 Get a Free Recommendation</button>
            <button className={styles.ctaSecondary} onClick={() => trackWAClick('hero_wa')}>💬 Ask on WhatsApp</button>
          </div>
        </div>
      </section>

      <section className={styles.comparison}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🔍 Compare the three bot types</h2>
          <div className={styles.botGrid}>
            {BOT_TYPES.map(bot => (
              <div key={bot.id} className={`${styles.botCard} ${selected === bot.id ? styles.botCardActive : ''}`}
                onClick={() => setSelected(bot.id)} style={{ '--color': bot.color }}>
                <div className={styles.botCardTag} style={{ background: bot.tagColor }}>{bot.tag}</div>
                <div className={styles.botIcon}>{bot.icon}</div>
                <h3 style={{ color: bot.color }}>{bot.name}</h3>
                <p className={styles.botSubtitle}>{bot.subtitle}</p>
                <p className={styles.botDesc}>{bot.desc}</p>
              </div>
            ))}
          </div>

          {current && (
            <div className={styles.botDetail} style={{ '--color': current.color }}>
              <div className={styles.botDetailLeft}>
                <h3>{current.icon} {current.name} — Key Advantages</h3>
                <ul className={styles.prosList}>
                  {current.pros.map((p, i) => <li key={i}>✅ {p}</li>)}
                </ul>
                <div className={styles.bestFor}>
                  <strong>Best for:</strong> {current.bestFor}
                </div>
              </div>
              <div className={styles.botDetailRight}>
                <p className={styles.demoLabel}>Live conversation example</p>
                <ChatDemo messages={current.example} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className={styles.aiCapabilities}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🧠 What can an AI bot actually do?</h2>
          <p className={styles.sectionDesc}>The AI bot isn't just "smarter" — it works completely differently</p>
          <div className={styles.aiGrid}>
            {AI_CAPABILITIES.map((cap, i) => (
              <div key={i} className={styles.aiCard}>
                <div className={styles.aiIcon}>{cap.icon}</div>
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.hybrid}>
        <div className={styles.container}>
          <div className={styles.hybridInner} style={{ direction: 'ltr' }}>
            <div className={styles.hybridText}>
              <div className={styles.hybridBadge}>⚡ Hybrid Bot</div>
              <h2>The smartest combination</h2>
              <p>Routine questions (hours, prices, booking) → Smart Bot answers in milliseconds, no AI cost. Complex questions → AI steps in with full context. Result: maximum efficiency at minimum cost.</p>
              <div className={styles.hybridFlow}>
                <div className={styles.hybridStep}>📨 Customer message</div>
                <div className={styles.hybridArrow}>→</div>
                <div className={styles.hybridStep}>🤖 Routine? Smart Bot</div>
                <div className={styles.hybridArrow}>→</div>
                <div className={styles.hybridStep}>🧠 Complex? AI</div>
                <div className={styles.hybridArrow}>→</div>
                <div className={styles.hybridStep}>👤 Unclear? Human agent</div>
              </div>
            </div>
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
          <h2 className={styles.ctaTitle}>🚀 Not sure which bot fits you?</h2>
          <p className={styles.ctaDesc}>Leave your details — we'll give you a free recommendation within 24 hours</p>
          <MiniLeadForm source="bot-types-en" />
          <div className={styles.ctaOr}>
            <span>or</span>
            <button className={styles.ctaWaBtn} onClick={() => trackWAClick('cta_bottom')}>💬 WhatsApp Us Now</button>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Gambot · Official Meta Partner · <a href="/privacy">Privacy Policy</a></p>
      </footer>
    </div>
  );
}
