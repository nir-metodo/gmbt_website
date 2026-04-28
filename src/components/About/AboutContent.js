'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './AboutContent.module.css';
import LeadForm from '@/components/LeadForm/LeadForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { FaLinkedinIn, FaWhatsapp, FaRocket, FaUsers, FaGlobe, FaCogs, FaBrain, FaChartLine } from 'react-icons/fa';

const SITE = 'https://gambot.co.il';

export default function AboutContent() {
  const { currentLanguage } = useLanguage();
  const isHe = currentLanguage === 'he';
  const dir = isHe ? 'rtl' : 'ltr';

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'ניר סגס',
    alternateName: 'Nir Segas',
    jobTitle: isHe ? 'מייסד ומנכ״ל גמבוט' : 'Founder & CEO of Gambot',
    description: isHe
      ? 'ניר סגס הוא מייסד ומנכ"ל גמבוט (Gambot), פלטפורמת WhatsApp Business API המובילה בישראל. מומחה לאוטומציה עסקית, בינה מלאכותית ו-WhatsApp API.'
      : 'Nir Segas is the Founder & CEO of Gambot, Israel\'s leading WhatsApp Business API platform. Expert in business automation, AI and WhatsApp API.',
    url: `${SITE}/about/`,
    image: `${SITE}/nir-segas.jpg`,
    sameAs: [
      'https://www.linkedin.com/in/nirsegas',
      'https://www.linkedin.com/company/gambot-platform',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Gambot',
      alternateName: 'גמבוט',
      url: SITE,
      logo: `${SITE}/apple-touch-icon.png`,
    },
    knowsAbout: [
      'WhatsApp Business API',
      'Business Automation',
      'Artificial Intelligence',
      'CRM Systems',
      'Digital Marketing',
      'SaaS',
      'Chatbots',
    ],
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gambot',
    alternateName: 'גמבוט',
    url: SITE,
    logo: `${SITE}/apple-touch-icon.png`,
    founder: {
      '@type': 'Person',
      name: 'ניר סגס',
      alternateName: 'Nir Segas',
      url: `${SITE}/about/`,
    },
    description: isHe
      ? 'גמבוט - פלטפורמת WhatsApp Business API המובילה בישראל. שותף מטא רשמי. אוטומציה, בוטים, CRM ושיווק בוואטסאפ.'
      : 'Gambot - Israel\'s leading WhatsApp Business API platform. Official Meta Partner. Automation, bots, CRM and WhatsApp marketing.',
    foundingDate: '2023',
    foundingLocation: { '@type': 'Place', name: 'Israel' },
    areaServed: { '@type': 'Country', name: 'Israel' },
    contactPoint: { '@type': 'ContactPoint', telephone: '+972-3-376-8997', contactType: 'customer service', availableLanguage: ['Hebrew', 'English'] },
    sameAs: [
      'https://www.facebook.com/profile.php?id=61553659007668',
      'https://www.linkedin.com/company/gambot-platform',
      'https://www.instagram.com/gambot_il',
      'https://www.youtube.com/channel/@Gambot-IL',
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isHe ? 'דף בית' : 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: isHe ? 'אודות' : 'About', item: `${SITE}/about/` },
    ],
  };

  const milestones = isHe ? [
    { year: '2023', text: 'הקמת גמבוט ופיתוח הפלטפורמה' },
    { year: '2024', text: 'הפיכה לשותף מטא רשמי, השקת מנוע AI' },
    { year: '2025', text: 'השקת Botomation, CRM מתקדם וחתימה דיגיטלית' },
    { year: '2026', text: 'ניהול מספרים מרובים, דוחות AI ו-Bot Builder' },
  ] : [
    { year: '2023', text: 'Founded Gambot and developed the platform' },
    { year: '2024', text: 'Became official Meta Partner, launched AI engine' },
    { year: '2025', text: 'Launched Botomation, advanced CRM and digital signatures' },
    { year: '2026', text: 'Multi-number management, AI reports and Bot Builder' },
  ];

  const values = isHe ? [
    { icon: <FaRocket />, title: 'חדשנות', desc: 'אנחנו מובילים בפיתוח טכנולוגיות חדשות — מ-AI ועד אוטומציה מתקדמת.' },
    { icon: <FaUsers />, title: 'לקוח במרכז', desc: 'כל פיצ\'ר נבנה מתוך הקשבה לצרכי הלקוחות שלנו.' },
    { icon: <FaCogs />, title: 'פשטות', desc: 'ממשק ידידותי וללא קוד — כדי שכל עסק יוכל להצליח.' },
    { icon: <FaBrain />, title: 'בינה מלאכותית', desc: 'שילוב AI בכל שכבה — מבוטים חכמים ועד דוחות אוטומטיים.' },
    { icon: <FaGlobe />, title: 'ישראליות', desc: 'פיתוח ישראלי, תמיכה בעברית, מותאם לשוק המקומי.' },
    { icon: <FaChartLine />, title: 'צמיחה', desc: 'אנחנו עוזרים לעסקים לצמוח עם כלים שמגדילים מכירות ומשפרים שירות.' },
  ] : [
    { icon: <FaRocket />, title: 'Innovation', desc: 'Leading the development of new technologies — from AI to advanced automation.' },
    { icon: <FaUsers />, title: 'Customer-Centric', desc: 'Every feature is built from listening to our customers\' needs.' },
    { icon: <FaCogs />, title: 'Simplicity', desc: 'Friendly, no-code interface — so every business can succeed.' },
    { icon: <FaBrain />, title: 'Artificial Intelligence', desc: 'AI integrated at every layer — from smart bots to automated reports.' },
    { icon: <FaGlobe />, title: 'Israeli-Made', desc: 'Israeli development, Hebrew support, tailored for the local market.' },
    { icon: <FaChartLine />, title: 'Growth', desc: 'We help businesses grow with tools that increase sales and improve service.' },
  ];

  return (
    <div style={{ paddingTop: '68px' }} dir={dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroBreadcrumb}>
            <Link href="/">{isHe ? 'דף בית' : 'Home'}</Link> / <span>{isHe ? 'אודות' : 'About'}</span>
          </div>
          <h1 className={styles.heroTitle}>
            {isHe ? 'ניר סגס — מייסד גמבוט' : 'Nir Segas — Founder of Gambot'}
          </h1>
          <p className={styles.heroSubtitle}>
            {isHe
              ? 'הסיפור מאחורי הפלטפורמה הישראלית המובילה לניהול WhatsApp Business API'
              : 'The story behind Israel\'s leading WhatsApp Business API platform'}
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className={styles.founderSection}>
        <div className={styles.founderContainer}>
          <div className={styles.founderImage}>
            <div className={styles.founderAvatar}>
              <Image
                src="/nir-segas.jpg"
                alt={isHe ? 'ניר סגס - מייסד ומנכ״ל גמבוט' : 'Nir Segas - Founder & CEO of Gambot'}
                width={280}
                height={280}
                className={styles.avatarImg}
                priority
              />
            </div>
            <div className={styles.founderSocial}>
              <a href="https://www.linkedin.com/in/nirsegas" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialLink}>
                <FaLinkedinIn />
              </a>
              <a href="https://wa.me/97233768997" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={styles.socialLink}>
                <FaWhatsapp />
              </a>
            </div>
          </div>
          <div className={styles.founderBio}>
            <h2>{isHe ? 'מי זה ניר סגס?' : 'Who is Nir Segas?'}</h2>
            <p>
              {isHe
                ? 'ניר סגס הוא מייסד ומנכ"ל גמבוט (Gambot) — הפלטפורמה הישראלית המובילה לניהול WhatsApp Business API. עם רקע עשיר בפיתוח תוכנה, אוטומציה עסקית ובינה מלאכותית, ניר הקים את גמבוט מתוך חזון ברור: לאפשר לכל עסק בישראל לנהל תקשורת לקוחות מתקדמת בוואטסאפ — בלי קוד, בלי מורכבות.'
                : 'Nir Segas is the Founder & CEO of Gambot — Israel\'s leading WhatsApp Business API platform. With a rich background in software development, business automation and artificial intelligence, Nir founded Gambot with a clear vision: to enable every business in Israel to manage advanced customer communication through WhatsApp — no code, no complexity.'}
            </p>
            <p>
              {isHe
                ? 'כשותף מטא רשמי, ניר מוביל את הפיתוח של כלים חדשניים כמו בוטים מבוססי AI, מערכת Botomation לאוטומציה חזותית, CRM מתקדם, חתימה דיגיטלית, ניהול לידים חכם ועוד — הכל במקום אחד.'
                : 'As an official Meta Partner, Nir leads the development of innovative tools including AI-powered bots, the Botomation visual automation system, advanced CRM, digital signatures, smart lead management and more — all in one place.'}
            </p>
            <p>
              {isHe
                ? 'ניר סגס כותב באופן קבוע בבלוג של גמבוט על נושאים כמו שיווק בוואטסאפ, אוטומציה עסקית, בינה מלאכותית לעסקים ומגמות בשוק ה-SaaS הישראלי.'
                : 'Nir Segas regularly writes on the Gambot blog about topics like WhatsApp marketing, business automation, AI for business and trends in the Israeli SaaS market.'}
            </p>
            <div className={styles.founderTags}>
              <span>WhatsApp Business API</span>
              <span>{isHe ? 'אוטומציה עסקית' : 'Business Automation'}</span>
              <span>{isHe ? 'בינה מלאכותית' : 'Artificial Intelligence'}</span>
              <span>CRM</span>
              <span>{isHe ? 'שיווק דיגיטלי' : 'Digital Marketing'}</span>
              <span>SaaS</span>
              <span>Chatbots</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Gambot Section */}
      <section className={styles.aboutSection}>
        <div className={styles.sectionContainer}>
          <h2>{isHe ? 'על גמבוט' : 'About Gambot'}</h2>
          <p className={styles.aboutLead}>
            {isHe
              ? 'גמבוט היא פלטפורמת WhatsApp Business API ישראלית, שפותחה על ידי ניר סגס, ומאפשרת לעסקים לנהל את כל התקשורת עם הלקוחות ממקום אחד.'
              : 'Gambot is an Israeli WhatsApp Business API platform, developed by Nir Segas, enabling businesses to manage all customer communication from one place.'}
          </p>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>{isHe ? 'זמינות מלאה' : 'Full Availability'}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>{isHe ? 'ישראלי' : 'Israeli'}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>No-Code</div>
              <div className={styles.statLabel}>{isHe ? 'ללא קוד' : 'No Coding'}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>Meta</div>
              <div className={styles.statLabel}>{isHe ? 'שותף רשמי' : 'Official Partner'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className={styles.sectionContainer}>
          <h2>{isHe ? 'הערכים שלנו' : 'Our Values'}</h2>
          <div className={styles.valuesGrid}>
            {values.map((v, i) => (
              <div key={i} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.timelineSection}>
        <div className={styles.sectionContainer}>
          <h2>{isHe ? 'ציר הזמן של גמבוט' : 'Gambot Timeline'}</h2>
          <div className={styles.timeline}>
            {milestones.map((m, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{m.year}</div>
                <div className={styles.timelineDot} />
                <div className={styles.timelineText}>{m.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog CTA */}
      <section className={styles.blogCta}>
        <div className={styles.sectionContainer}>
          <h2>{isHe ? 'קראו את המאמרים של ניר סגס' : 'Read articles by Nir Segas'}</h2>
          <p>
            {isHe
              ? 'ניר כותב על שיווק בוואטסאפ, אוטומציה, AI ואסטרטגיות צמיחה לעסקים. כל הידע — בבלוג של גמבוט.'
              : 'Nir writes about WhatsApp marketing, automation, AI and growth strategies for businesses. All the knowledge — on the Gambot blog.'}
          </p>
          <Link href="/blog/" className={styles.ctaBtn}>
            {isHe ? 'לבלוג של גמבוט' : 'Visit Gambot Blog'}
          </Link>
        </div>
      </section>

      {/* Lead Form */}
      <section style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', padding: '60px 0' }}>
        <LeadForm source="about-page" />
      </section>
    </div>
  );
}
