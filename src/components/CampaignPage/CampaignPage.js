'use client';
import styles from './CampaignPage.module.css';
import LeadForm from '@/components/LeadForm/LeadForm';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('היי גמבוט 👋 אני רוצה לנסות את הבוט');

const PAINS = [
  { icon: '⏰', text: 'עונים ידנית לאותן שאלות שוב ושוב — שעות ביום' },
  { icon: '😤', text: 'לא מצליחים לענות לכולם — לקוחות עוזבים למתחרה' },
  { icon: '🤯', text: 'בלאגן של שיחות — לא יודעים מי טיפל במי ומה הסטטוס' },
  { icon: '🌙', text: 'אין מענה בלילות ובסופ"ש — לידים הולכים לאיבוד' },
];

const BENEFITS = [
  { icon: '🤖', title: 'מענה אוטומטי 24/7', desc: 'הבוט עונה בשניות — בלילה, בשבת, בחגים' },
  { icon: '📋', title: 'כל השיחות במקום אחד', desc: 'סטטוס ברור, אחראי ידוע, אין דברים שנופלים' },
  { icon: '🎯', title: 'מסנן ומנתב לידים', desc: 'שולח לאדם הנכון רק מה שרלוונטי אליו' },
  { icon: '📅', title: 'קובע פגישות לבד', desc: 'הלקוח קובע פגישה עם הבוט — בלי לחכות לנציג' },
];

const STEPS = [
  { num: '01', text: 'שולחים לנו וואטסאפ' },
  { num: '02', text: 'הבוט שלנו עונה לכם — עכשיו, בזמן אמת' },
  { num: '03', text: 'חווים את הפרודקט בפעולה' },
  { num: '04', text: 'מחליטים — בלי לחץ, בלי מחויבות' },
];

export default function CampaignPage() {
  const openWA = () => window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank');

  return (
    <div className={styles.page} dir="rtl">

      {/* Minimal header - logo only, no nav */}
      <header className={styles.header}>
        <img src="/new_logo.png" alt="Gambot" className={styles.logo} />
        <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`} target="_blank" rel="noreferrer"
          className={styles.headerWa}>
          💬 דברו איתנו עכשיו
        </a>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>🤖 שותף Meta רשמי</div>
          <h1 className={styles.heroTitle}>
            הפסיקו לבזבז שעות על וואטסאפ —<br />
            <span className={styles.green}>הבוט שלנו הוא הדמו שלכם</span>
          </h1>
          <p className={styles.heroDesc}>
            שלחו לנו וואטסאפ עכשיו — תוך שניות תחוו בעצמכם איך הבוט עונה, שואל ומסדר הכל
          </p>
          <button className={styles.ctaMain} onClick={openWA}>
            💬 שלחו וואטסאפ — הבוט עונה עכשיו
          </button>
          <p className={styles.ctaSub}>⚡ לא צריך להירשם · לא צריך כרטיס אשראי · פשוט שלחו הודעה</p>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className={styles.pains}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>😩 מכירים את זה?</h2>
          <div className={styles.painsGrid}>
            {PAINS.map((p, i) => (
              <div key={i} className={styles.painCard}>
                <span className={styles.painIcon}>{p.icon}</span>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
          <div className={styles.painCta}>
            <strong>יש פתרון. הבוט של גמבוט מטפל בכל אלה — אוטומטית.</strong>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>✅ מה הבוט עושה בשבילכם</h2>
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

      {/* TRY IT LIVE */}
      <section className={styles.tryLive}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🎯 הבוט שלנו הוא הדמו שלכם</h2>
          <p className={styles.tryDesc}>
            לא צריך שיצרו לכם כלום — פשוט שלחו לנו הודעה עכשיו.<br />
            הבוט שלנו יענה לכם, ישאל שאלות, יסדר ואפילו יקבע פגישה — בדיוק כמו שיעשה ללקוחות שלכם
          </p>
          <button className={styles.ctaWa} onClick={openWA}>
            💬 שלחו הודעה — הבוט עונה עכשיו
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.steps}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>⚡ איך מתחילים?</h2>
          <div className={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD FORM */}
      <section className={styles.formSection}>
        <div className={styles.container}>
          <LeadForm source="קמפיין-בוט-וואטסאפ" />
          <p className={styles.privacy}>🔒 פרטיכם לא יועברו לצד שלישי</p>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Gambot · שותף Meta רשמי · <a href="/privacy">מדיניות פרטיות</a></p>
      </footer>
    </div>
  );
}
