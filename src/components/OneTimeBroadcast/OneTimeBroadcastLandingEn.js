import Link from 'next/link';
import { OTB_TIERS, OTB_MIN_ORDER, OTB_VAT, OTB_MAX_MESSAGES, OTB_MIN_LEAD_HOURS } from '@/lib/oneTimeBroadcastPricing';
import './OneTimeBroadcastLanding.css';

// English version of the one-time broadcast landing page (the Hebrew one lives at /דיוור-חד-פעמי/).
// Same facts and prices (single source: lib/oneTimeBroadcastPricing); keep the two pages in sync.
export const OTB_LANDING_URL_EN = 'https://gambot.co.il/one-time-whatsapp-broadcast/';
const OTB_LANDING_URL_HE = 'https://gambot.co.il/%D7%93%D7%99%D7%95%D7%95%D7%A8-%D7%97%D7%93-%D7%A4%D7%A2%D7%9E%D7%99/';
const ORDER_URL = 'https://gambot.co.il/one-time-broadcast/';
const BLOG_PATH = '/blog/49/one-time-whatsapp-broadcast-with-no-number-and-no-meta-verification-we-built-the-solution/';

const fmt = (n) => `₪${Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
const rangeLabel = (t) => `${t.from.toLocaleString('en-US')}–${t.to.toLocaleString('en-US')}`;

// Graduated pricing — identical to the order wizard (single source: lib/oneTimeBroadcastPricing).
function priceFor(count) {
  let left = count;
  let prev = 0;
  let total = 0;
  for (const t of OTB_TIERS) {
    const inTier = Math.min(left, t.to - prev);
    if (inTier > 0) total += inTier * t.price;
    left -= inTier;
    prev = t.to;
    if (left <= 0) break;
  }
  return Math.max(total, OTB_MIN_ORDER);
}

const EXAMPLES = [100, 500, 1000, 2000, 5000, 10000].map((n) => {
  const net = priceFor(n);
  return { n, net, gross: net * (1 + OTB_VAT) };
});

const USE_CASES = [
  { icon: '👥', title: 'Invite people to a WhatsApp group', text: 'Opening a new group or community? Send one message with a join button to your list — everyone interested joins in one tap.' },
  { icon: '📢', title: 'Updates channel & community', text: 'Invite your audience to an updates channel or a new club, without building a permanent broadcasting setup.' },
  { icon: '🎉', title: 'Event, meetup or lecture', text: 'A one-off invitation to an event, open day or launch — with a registration button and link.' },
  { icon: '🏷️', title: 'Limited-time sale', text: 'A promotion that ends in a few days? One message to your customers with a coupon code and a purchase link.' },
  { icon: '📍', title: 'New number or address', text: '“We moved to a new WhatsApp number” or “We moved to a new branch” — one update to the whole list.' },
  { icon: '📝', title: 'Quick survey or request', text: 'A one-time survey, donation request, volunteer call or waiting list.' },
];

const STEPS = [
  { name: 'Upload an Excel file', text: 'Upload a spreadsheet with phone numbers (and personal fields such as a name, if you like). The system validates the numbers and filters out invalid numbers, landlines and duplicates.' },
  { name: 'Write the message', text: 'Write your message with personal fields from the file and add a button (link, call or quick reply) — or pick a ready-made template from the library, for example “Invitation to join a WhatsApp group”.' },
  { name: 'Pay', text: 'A calculator shows the exact price before you pay. You pay by credit card on a secure page and receive an invoice.' },
  { name: 'Schedule', text: `Pick a date and time to send (at least ${OTB_MIN_LEAD_HOURS} hours ahead, so Meta has time to approve the template). You get an email when the template is approved, an email when the broadcast finishes, and a results report about a day later.` },
];

const COMPARE = [
  { k: 'Needs a dedicated WhatsApp phone number', a: 'No', b: 'Yes', c: 'No (but only contacts who saved you)' },
  { k: 'Needs business verification with Meta', a: 'No', b: 'Yes', c: 'No' },
  { k: 'Needs your own WhatsApp Business API account', a: 'No', b: 'Yes', c: 'No' },
  { k: 'Monthly subscription', a: 'No — pay once', b: 'Usually yes', c: 'No' },
  { k: 'Reach people who have not saved your number', a: 'Yes (those who gave consent)', b: 'Yes (those who gave consent)', c: 'No' },
  { k: 'Recipient limit', a: `Up to ${OTB_MAX_MESSAGES.toLocaleString('en-US')} messages per order`, b: 'Depends on your verification tier', c: 'Up to 256 per list' },
  { k: 'Link buttons and personalization per recipient', a: 'Yes', b: 'Yes', c: 'No' },
  { k: 'Results report', a: 'Yes, by email', b: 'Depends on the platform', c: 'Limited' },
];

const FAQ = [
  { q: 'How do I send a one-time WhatsApp message to a list without setting up a broadcasting system?', a: 'Use a ready-made one-time broadcast service such as Gambot\'s: upload an Excel file of phone numbers, write the message, pay and schedule. You do not need a business WhatsApp number, Meta business verification or a subscription. Messages are sent from Gambot\'s verified number and the price includes WhatsApp fees.' },
  { q: 'Can I send an invitation to join a WhatsApp group to a list of people?', a: 'Yes. It is one of the most common uses. Write a short message with a link button that leads to the group (or channel) invitation and send it to the whole list. Recipients join in one tap. A ready template is available in the library.' },
  { q: 'Do I need a dedicated phone number or Meta business verification?', a: 'No. The broadcast is sent through Gambot\'s verified WhatsApp Business API account, so you do not have to set up a number, pass business verification or open your own account.' },
  { q: 'How much does it cost?', a: `Graduated pricing: ${OTB_TIERS.map((t) => `${rangeLabel(t)} messages — ${fmt(t.price)} per message`).join('; ')}. Minimum order ${fmt(OTB_MIN_ORDER)}. All prices are before VAT (${Math.round(OTB_VAT * 100)}%), include WhatsApp/Meta fees and apply to recipients in Israel — for other destinations Meta's rate may be higher and the calculator shows it.` },
  { q: 'When are the messages sent — can it be immediate?', a: `Ordering takes minutes and needs no advance setup. The send itself is scheduled at least ${OTB_MIN_LEAD_HOURS} hours ahead because every message template is approved by Meta (usually within 24 hours). You receive an email as soon as the template is approved.` },
  { q: 'What happens if Meta rejects the message?', a: 'If the template is rejected we come back to you to fix it at no extra charge, and the broadcast is rescheduled.' },
  { q: 'What do recipients see, and where do replies go?', a: 'The message is sent from Gambot\'s number and the line “Sent by Gambot on behalf of [your business name]” is added automatically at the bottom. Recipients\' replies do not reach you, so add a website or call button that sends people to you directly.' },
  { q: 'What reports do I get?', a: 'An email when the template is approved, an email when the broadcast finishes, and about a day after sending a results report: how many messages were sent, delivered and read, how many people clicked buttons and links, and what they replied.' },
  { q: 'Can I send to any list?', a: 'Only to people who agreed to receive messages from you. When ordering you confirm that you have such consent and that you are responsible for the content and the list. Recipients can ask to be removed. Marketing messages without consent are prohibited by law and by Meta\'s policy.' },
  { q: 'What if I have more than 10,000 recipients, or need hands-on help?', a: 'For large volumes or full service there is Gambot\'s managed broadcast service, and for recurring broadcasts you can open a full WhatsApp broadcasting system with a free trial.' },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'One-time WhatsApp broadcast — Gambot',
    alternateName: 'דיוור חד־פעמי בוואטסאפ',
    serviceType: 'WhatsApp one-time broadcast',
    description: `A one-time WhatsApp broadcast service with no dedicated number, no Meta business verification and no subscription. Upload Excel, write a message, pay and schedule. From ${fmt(OTB_MIN_ORDER)} before VAT.`,
    url: OTB_LANDING_URL_EN,
    areaServed: ['IL', 'Worldwide'],
    inLanguage: 'en',
    provider: { '@type': 'Organization', name: 'Gambot', url: 'https://gambot.co.il' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'ILS',
      lowPrice: OTB_MIN_ORDER,
      highPrice: Math.round(priceFor(OTB_MAX_MESSAGES)),
      offerCount: OTB_TIERS.length,
      url: ORDER_URL,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to send a one-time WhatsApp broadcast with Gambot',
    totalTime: 'PT10M',
    step: STEPS.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text, url: `${OTB_LANDING_URL_EN}#steps` })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Gambot', item: 'https://gambot.co.il/' },
      { '@type': 'ListItem', position: 2, name: 'One-time WhatsApp broadcast', item: OTB_LANDING_URL_EN },
    ],
  },
];

export default function OneTimeBroadcastLandingEn() {
  return (
    <main className="otbl" dir="ltr" lang="en">
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <section className="otbl-hero">
        <div className="otbl-wrap">
          <span className="otbl-badge">⚡ No number · No Meta verification · No subscription</span>
          <h1>One-Time WhatsApp Broadcast — Nothing to Set Up</h1>
          <p className="otbl-lead">
            Need to send one message to a list — an invitation to a WhatsApp group, an event, a sale or an update? Upload an Excel file, write the message, pay and schedule.
            Prices start at {fmt(OTB_MIN_ORDER)} before VAT, with no dedicated number and no business verification with Meta.
          </p>
          <div className="otbl-cta-row">
            <Link href="/one-time-broadcast/" className="otbl-btn primary">Order a one-time broadcast</Link>
            <a href="#pricing" className="otbl-btn ghost">Pricing</a>
          </div>
          <ul className="otbl-facts">
            <li><b>{fmt(OTB_TIERS[0].price)}</b> per message (up to {OTB_TIERS[0].to.toLocaleString('en-US')})</li>
            <li><b>Up to {OTB_MAX_MESSAGES.toLocaleString('en-US')}</b> messages per order</li>
            <li><b>Results report</b> by email</li>
          </ul>
        </div>
      </section>

      <section className="otbl-section" id="what">
        <div className="otbl-wrap otbl-narrow">
          <h2>What is a one-time WhatsApp broadcast?</h2>
          <p className="otbl-answer">
            A one-time WhatsApp broadcast is a single message sent to a list of recipients, without setting up a permanent broadcasting system. With Gambot you do not need a business WhatsApp number,
            business verification with Meta or a subscription: messages go out through Gambot&apos;s verified WhatsApp Business API account, and the price includes WhatsApp fees.
          </p>
          <p>
            It suits anyone who needs to send a message once, or once in a while — for example to invite people to join a WhatsApp group — and does not want to wait for verification, set up a number or pay a monthly fee.
            If you broadcast on a regular schedule, move to a <Link href="/recurring-whatsapp-broadcast/">recurring WhatsApp broadcast</Link> or the full <Link href="/whatsapp-broadcast/">WhatsApp broadcast system</Link>.
          </p>
        </div>
      </section>

      <section className="otbl-section alt" id="use-cases">
        <div className="otbl-wrap">
          <h2>What people use one-time broadcasts for</h2>
          <div className="otbl-grid">
            {USE_CASES.map((u) => (
              <article key={u.title} className="otbl-card">
                <div className="otbl-ico" aria-hidden="true">{u.icon}</div>
                <h3>{u.title}</h3>
                <p>{u.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="otbl-section" id="steps">
        <div className="otbl-wrap otbl-narrow">
          <h2>How it works — 4 steps</h2>
          <ol className="otbl-steps">
            {STEPS.map((s) => (
              <li key={s.name}><b>{s.name}.</b> {s.text}</li>
            ))}
          </ol>
          <div className="otbl-cta-row">
            <Link href="/one-time-broadcast/" className="otbl-btn primary">Start an order</Link>
          </div>
        </div>
      </section>

      <section className="otbl-section alt" id="compare">
        <div className="otbl-wrap">
          <h2>One-time broadcast vs. the alternatives</h2>
          <div className="otbl-table-wrap">
            <table className="otbl-table">
              <thead>
                <tr>
                  <th scope="col"> </th>
                  <th scope="col" className="hl">Gambot one-time broadcast</th>
                  <th scope="col">Setting up your own WhatsApp Business API</th>
                  <th scope="col">Broadcast list in the WhatsApp Business app</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.k}>
                    <th scope="row">{r.k}</th>
                    <td className="hl">{r.a}</td>
                    <td>{r.b}</td>
                    <td>{r.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="otbl-section" id="pricing">
        <div className="otbl-wrap otbl-narrow">
          <h2>How much does a one-time WhatsApp broadcast cost?</h2>
          <p className="otbl-answer">
            Pricing is graduated by message volume, starting at {fmt(OTB_TIERS[0].price)} per message before VAT, with a minimum order of {fmt(OTB_MIN_ORDER)}. The price includes WhatsApp/Meta fees with no extra charge.
          </p>
          <div className="otbl-table-wrap">
            <table className="otbl-table">
              <thead>
                <tr><th scope="col">Message range</th><th scope="col">Price per message (before VAT)</th></tr>
              </thead>
              <tbody>
                {OTB_TIERS.map((t) => (
                  <tr key={t.to}><td>{rangeLabel(t)}</td><td>{fmt(t.price)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3>Examples</h3>
          <div className="otbl-table-wrap">
            <table className="otbl-table">
              <thead>
                <tr><th scope="col">Recipients</th><th scope="col">Before VAT</th><th scope="col">Including VAT ({Math.round(OTB_VAT * 100)}%)</th></tr>
              </thead>
              <tbody>
                {EXAMPLES.map((e) => (
                  <tr key={e.n}><td>{e.n.toLocaleString('en-US')}</td><td>{fmt(e.net)}</td><td>{fmt(e.gross)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="otbl-note">
            Each range is charged at its own rate. Prices apply to recipients in Israel; for other countries Meta&apos;s rate is higher and the calculator in the order flow shows the exact price before you pay.
            You only send to, and pay for, valid mobile numbers. For more than {OTB_MAX_MESSAGES.toLocaleString('en-US')} messages see the <Link href="/PriceList/ManagedBroadcast/">managed broadcast service</Link>.
          </p>
        </div>
      </section>

      <section className="otbl-section alt" id="good-to-know">
        <div className="otbl-wrap otbl-narrow">
          <h2>Good to know before you order</h2>
          <ul className="otbl-list">
            <li><b>Gambot is the sender.</b> The message goes out from Gambot&apos;s number and ends with “Sent by Gambot on behalf of [your business name]”. Recipients&apos; replies do not reach you — add a website or call button.</li>
            <li><b>Scheduled in advance.</b> The send is scheduled at least {OTB_MIN_LEAD_HOURS} hours ahead because of Meta&apos;s template approval.</li>
            <li><b>Only to people who agreed.</b> Send only to people who consented to receive messages from you; you are responsible for the content and the list.</li>
            <li><b>Mobile numbers only.</b> Landlines, invalid numbers and duplicates are not sent and not charged.</li>
          </ul>
        </div>
      </section>

      <section className="otbl-section" id="faq">
        <div className="otbl-wrap otbl-narrow">
          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <details key={f.q} className="otbl-faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="otbl-section alt" id="more">
        <div className="otbl-wrap otbl-narrow">
          <h2>Read more</h2>
          <ul className="otbl-list">
            <li><Link href={BLOG_PATH}>Why we built a one-time broadcast: no number and no Meta verification</Link></li>
            <li><Link href="/recurring-whatsapp-broadcast/">Recurring WhatsApp broadcasts — weekly, monthly and scheduled</Link></li>
            <li><Link href="/whatsapp-broadcast/">WhatsApp broadcast system for regular campaigns</Link></li>
            <li><Link href="/whatsapp-newsletter/">WhatsApp newsletter — the complete guide</Link></li>
            <li><Link href="/PriceList/ManagedBroadcast/">Managed broadcast service</Link></li>
            <li><a href={OTB_LANDING_URL_HE} hrefLang="he">גרסה בעברית: דיוור חד־פעמי בוואטסאפ</a></li>
          </ul>
        </div>
      </section>

      <section className="otbl-final">
        <div className="otbl-wrap">
          <h2>Ready to send?</h2>
          <p>Upload Excel, write a message and schedule. From {fmt(OTB_MIN_ORDER)} before VAT.</p>
          <Link href="/one-time-broadcast/" className="otbl-btn primary">Order a one-time broadcast</Link>
          <p className="otbl-updated">Last updated: November 12, 2026</p>
        </div>
      </section>
    </main>
  );
}
