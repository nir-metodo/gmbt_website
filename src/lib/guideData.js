// src/components/Website/UserGuide/guideData.js
import { FaUserPlus, FaAddressBook, FaBullhorn, FaRobot, FaComments, FaRegFileAlt, FaUserCog, FaTasks, FaFileSignature } from 'react-icons/fa';

// Helper function to create SEO-friendly URLs
export const getSeoUrl = (title) => {
  return title
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase()
    .trim();
};

// Helper function to get localized guides
export const getLocalizedGuides = (language = 'he') => {
  return guideData.map(guide => ({
    ...guide,
    title: typeof guide.title === 'object' ? guide.title[language] || guide.title.he : guide.title,
    category: typeof guide.category === 'object' ? guide.category[language] || guide.category.he : guide.category,
    difficulty: typeof guide.difficulty === 'object' ? guide.difficulty[language] || guide.difficulty.he : guide.difficulty,
    description: typeof guide.description === 'object' ? guide.description[language] || guide.description.he : guide.description,
    content: typeof guide.content === 'object' ? guide.content[language] || guide.content.he : guide.content,
    seoUrl: typeof guide.title === 'object' ? getSeoUrl(guide.title[language] || guide.title.he) : getSeoUrl(guide.title)
  }));
};

// Helper to get a single guide by slug (for GuideVideoButton in personal area)
export const getGuideBySlug = (slug, language = 'he') => {
  const localized = getLocalizedGuides(language);
  return localized.find(g => g.slug === slug) || null;
};

const guideData = [
    {
    id: 1,
    slug: 'create-account',
    title: {
      he: "איך ליצור חשבון וואטסאפ API בעזרת גמבוט",
      en: "How to Create a WhatsApp API Account with Gambot"
    },
    category: {
      he: "התחלה",
      en: "Getting Started"
    },
    difficulty: {
      he: "קל",
      en: "Easy"
    },
    estimatedTime: 10,
keywords: [
  "WhatsApp API",
  "איך לפתוח חשבון WhatsApp API",
  "WhatsApp API בישראל",
  "גמבוט WhatsApp",
  "פתיחת חשבון וואטסאפ API",
  "WhatsApp API לעסקים קטנים",
  "WhatsApp API Meta",
  "התחברות וואטסאפ API עם פייסבוק",
  "אימות חשבון וואטסאפ API",
  "אוטומציה וואטסאפ עסקי"
],
    description: {
      he: "במדריך זה תלמד כיצד לפתוח חשבון WhatsApp API דרך גמבוט, כולל התחברות עם פייסבוק, הוספת אמצעי תשלום ובחירת מספר.",
      en: "In this guide you will learn how to open a WhatsApp API account through Gambot, including connecting with Facebook, adding payment methods and choosing a number."
    },
    path: "/guide/create-account",
    icon: FaUserPlus,
    videoUrl: "https://www.youtube.com/embed/6y8A61Z7Zv4?si=5feB0Cqht8JKRUif",
    content: {
      he: `
        <h2>פתיחת חשבון WhatsApp API</h2>
        <p>בכדי לפתוח חשבון ב-WhatsApp API דרך גמבוט (שותף רשמי של מטא), נבצע את השלבים הבאים:</p>
        <ul>
          <li>ניתן להשתמש במספר טלפון (סים) קיים או לרכוש מאיתנו ישירות.</li>
          <li>ממלאים פרטי עסק – שם תצוגה, קטגוריה וכתובת.</li>
          <li>מתבצעת הזדהות דרך כתובת מייל או הודעת וואטסאפ למספר הנבחר.</li>
          <li>מתחברים לפייסבוק – עדיף עם משתמש שמשויך לפייסבוק העסקי, אבל זה לא חובה.</li>
          <li>מוסיפים אמצעי תשלום (לפי מדינה, חיוב יתחיל רק כשהשירות בשימוש).</li>
        </ul> 
        <p>לאחר השלמת השלבים – החשבון שלכם מוכן להתחלה!</p>
      `,
      en: `
        <h2>Opening a WhatsApp API Account</h2>
        <p>To open a WhatsApp API account through Gambot (an official Meta partner), we will perform the following steps:</p>
        <ul>
          <li>You can use an existing phone number (SIM) or purchase one directly from us.</li>
          <li>Fill in business details – display name, category and address.</li>
          <li>Verification is performed via email address or WhatsApp message to the selected number.</li>
          <li>Connect to Facebook – preferably with a user associated with business Facebook, but it's not mandatory.</li>
          <li>Add payment method (by country, billing will start only when the service is in use).</li>
        </ul> 
        <p>After completing the steps – your account is ready to start!</p>
      `
    }
  },
  {
    id: 2,
    slug: 'manage-contacts',
    title: {
      he: "ניהול אנשי קשר חכם ודינמי בגמבוט",
      en: "Smart and Dynamic Contact Management in Gambot"
    },
    category: {
      he: "ניהול לקוחות",
      en: "Customer Management"
    },
    difficulty: {
      he: "בינוני",
      en: "Medium"
    },
    estimatedTime: 15,
    description: {
      he: "למד איך לנהל ולייבא אנשי קשר בהתאמה אישית מלאה עם שדות גמישים ומבנה מתקדם.",
      en: "Learn how to manage and import contacts with full customization using flexible fields and advanced structure."
    },
    path: "/guide/manage-contacts",
keywords: [
  "ניהול אנשי קשר WhatsApp API",
  "ייבוא אנשי קשר WhatsApp",
  "CRM WhatsApp API",
  "גמבוט אנשי קשר",
  "שדות דינמיים WhatsApp API",
  "ניהול לקוחות WhatsApp API",
  "WhatsApp API לעסקים",
  "WhatsApp API אוטומציה",
  "טמפלט אנשי קשר וואטסאפ",
  "מערכת אנשי קשר גמבוט"
],

    icon: FaAddressBook,
    videoUrl: "https://www.youtube.com/embed/lWftFBJN3cg",
    content: {
      he: `
        <h2>ניהול אנשי קשר דינמי</h2>
        <p>במערכת גמבוט תוכל לנהל את אנשי הקשר שלך בצורה מותאמת אישית ומתקדמת:</p>
        <ul>
          <li>הוספת שדות מותאמים אישית לטבלה – כולל טקסט, מספרים, תאריכים ובחירה מרובה.</li>
          <li>שימוש בקבוצות אפשרויות מוגדרות מראש עם בחירה בודדת או מרובה.</li>
          <li>ייבוא אנשי קשר מקובץ טמפלט מובנה בצורה פשוטה ונוחה.</li>
        </ul>
        <p>במקום שתתאימו את עצמכם למערכת – אנחנו מתאימים את עצמנו אליכם.</p>
      `,
      en: `
        <h2>Dynamic Contact Management</h2>
        <p>In the Gambot system you can manage your contacts in a personalized and advanced way:</p>
        <ul>
          <li>Adding custom fields to the table – including text, numbers, dates and multiple choice.</li>
          <li>Using predefined option groups with single or multiple selection.</li>
          <li>Importing contacts from a built-in template file in a simple and convenient way.</li>
        </ul>
        <p>Instead of you adapting to the system – we adapt ourselves to you.</p>
      `
    }
  },
   {
  id: 3,
  slug: 'create-template',
  title: {
    he: "יצירת טמפלטים ב־WhatsApp API",
    en: "Creating Templates in WhatsApp API"
  },
  category: {
    he: "הודעות ותבניות",
    en: "Messages and Templates"
  },
  difficulty: {
    he: "בינוני",
    en: "Medium"
  },
  estimatedTime: 20,
  description: {
    he: "במדריך זה תלמד כיצד ליצור, לערוך ולנהל טמפלטים בגמבוט, כולל Header, Body, Footer, וכפתורים אינטראקטיביים.",
    en: "In this guide you will learn how to create, edit and manage templates in Gambot, including Header, Body, Footer, and interactive buttons."
  },
  path: "/guide/create-template",
  icon: FaRegFileAlt,
  videoUrl: "https://www.youtube.com/embed/j4KB3WOHbnE", 
  keywords: [
    "תבניות הודעה WhatsApp API",
    "WhatsApp API Templates",
    "יצירת טמפלט וואטסאפ",
    "הודעות מוכנות WhatsApp",
    "WhatsApp Template Message",
    "כפתורי וואטסאפ אינטראקטיביים",
    "WhatsApp Template Approval",
    "גמבוט טמפלט",
    "אוטומציה עם טמפלטים",
    "WhatsApp API לעסקים"
  ],
content: {
  he: `
    <p>היי לכולם 🤟</p>

    <p>🧩 <strong>טמפלט הוא ליבת ה־WhatsApp API</strong> – סביבו סובבים דיוורים, אוטומציות וכפתורים אינטראקטיביים 💬</p>

    <p>בדיוק בשביל זה בנינו בגמבוט ממשק עוצמתי שמאפשר לכם ליצור ולנהל אותם בקלות 🎯</p>

    <p>בסרטון החדש שלנו אני מסביר שלב אחרי שלב איך יוצרים טמפלטים ב־WhatsApp API, מה היתרונות, ואיך להשתמש בהם אוטומטית בקמפיינים 🤖</p>

    <h3>🧱 מה כולל טמפלט ב־WhatsApp API?</h3>
    <ul>
      <li>📝 <strong>Header</strong> – כותרת עם טקסט, תמונה, וידאו, קובץ או מיקום</li>
      <li>💬 <strong>Body</strong> – תוכן עם משתנים דינמיים כמו {{name}}</li>
      <li>📍 <strong>Footer</strong> – טקסט מסכם קצר</li>
      <li>🔘 <strong>Buttons</strong> – כפתורי תגובה, קישור, פתיחת טופס, קטלוג ועוד</li>
    </ul>

    <h3>🛠️ מה תמצאו בממשק גמבוט?</h3>
    <ul>
      <li>יצירה נוחה ואינטואיטיבית של טמפלטים לפי הצורך</li>
      <li>שילוב טמפלטים באוטומציות וקמפיינים בלחיצת כפתור</li>
      <li>שליחת טמפלטים עם משתנים מתוך קמפיינים, אוטומציות וידנית</li>
      <li>שליטה מלאה על מבנה ההודעה והתאמה אישית לכל לקוח 🎯</li>
    </ul>

    <h3>🏆 למה זה חשוב?</h3>
    <ul>
      <li>כי טמפלטים הם הדרך היחידה ליזום שיחה רשמית עם לקוח</li>
      <li>כי כשיש לכם מערכת שנותנת לכם חופש יצירה – הכל אפשרי</li>
      <li>וכי שליחת הודעות מותאמת אישית עם אפשרות תגובה אינטרקטיבית בערוץ החם ביותר = כסף 💰</li>
    </ul>

    <p>🚀 רוצים לראות איך זה עובד בפועל?</p>
  `,
  en: `
    <p>Hey everyone 🤟</p>

    <p>🧩 <strong>Template is the heart of WhatsApp API</strong> – around it revolve mailings, automations and interactive buttons 💬</p>

    <p>That's exactly why we built a powerful interface in Gambot that allows you to create and manage them easily 🎯</p>

    <p>In our new video I explain step by step how to create templates in WhatsApp API, what are the benefits, and how to use them automatically in campaigns 🤖</p>

    <h3>🧱 What does a template include in WhatsApp API?</h3>
    <ul>
      <li>📝 <strong>Header</strong> – title with text, image, video, file or location</li>
      <li>💬 <strong>Body</strong> – content with dynamic variables like {{name}}</li>
      <li>📍 <strong>Footer</strong> – short summary text</li>
      <li>🔘 <strong>Buttons</strong> – response buttons, link, form opening, catalog and more</li>
    </ul>

    <h3>🛠️ What will you find in the Gambot interface?</h3>
    <ul>
      <li>Convenient and intuitive template creation as needed</li>
      <li>Integration of templates in automations and campaigns at the click of a button</li>
      <li>Sending templates with variables from campaigns, automations and manually</li>
      <li>Full control over message structure and personal customization for each customer 🎯</li>
    </ul>

    <h3>🏆 Why is this important?</h3>
    <ul>
      <li>Because templates are the only way to initiate an official conversation with a customer</li>
      <li>Because when you have a system that gives you creative freedom – everything is possible</li>
      <li>And because sending personalized messages with interactive response possibility in the hottest channel = money 💰</li>
    </ul>

    <p>🚀 Want to see how it works in practice?</p>
  `
}

},
 {
      id: 4,
  slug: 'real-time-chat',
    title: {
      he: "עבודה עם הצ׳אט",
      en: "Working with Chat"
    },
    category: {
      he: "תקשורת ושיחות",
      en: "Communication and Conversations"
    },
    difficulty: {
      he: "קל",
      en: "Easy"
    },
    estimatedTime: 12,
      description: {
        he: "במדריך זה תלמד איך להתכתב עם לקוחות כמו בווטסאפ ווב – כולל תמיכה במדיה, שליחת טמפלטים, תיעוד בציר זמן וחיוג ישיר מהצ'אט.",
        en: "In this guide you will learn how to chat with customers like in WhatsApp Web – including media support, sending templates, timeline documentation and direct calling from chat."
      },
  path: "/guide/real-time-chat",
  icon: FaComments,
  videoUrl: "https://www.youtube.com/embed/ntSw7Wqfrk8",
  keywords: [
    "צ'אט וואטסאפ בזמן אמת",
    "מענה מיידי WhatsApp API",
    "התכתבות בגמבוט",
    "ניהול שיחות WhatsApp",
    "שירות לקוחות WhatsApp API",
    "שליחת טמפלטים מהצ'אט",
    "WhatsApp Business צ'אט",
    "חיוג מהמערכת ללקוח",
    "WhatsApp API שיחות פעילות",
    "ניהול תיעוד לקוחות בוואטסאפ"
  ],
  content: {
    he: `
      <h2>התכתבות בזמן אמת</h2>
      <p>במערכת גמבוט תוכל לנהל שיחות עם לקוחות בצורה מיידית – ממש כמו ב־WhatsApp Web.</p>
      <ul>
        <li>כל שיחה חדשה נפתחת כשהלקוח פונה אליכם או מגיב לטמפלט.</li>
        <li>ההתכתבות זמינה למשך 24 שעות עם אותו לקוח.</li>
        <li>אפשר לשלוח טקסט, מדיה, קבצים, הודעות קוליות ועוד.</li>
        <li>תמיכה מלאה בשליחת טמפלטים מתוך הצ'אט.</li>
        <li>אפשרות לתייג, לשייך קטגוריה ולתעד את השיחה בציר הזמן.</li>
        <li>חיוג ישיר מהדפדפן או שיחת ועידה עם נציג פנים-ארגוני.</li>
      </ul>
      <p>כל מה שצריך כדי לתת שירות לקוחות מקצועי, אישי ומהיר – במקום אחד.</p>
    `,
    en: `
      <h2>Real-time Messaging</h2>
      <p>In the Gambot system you can manage conversations with customers instantly – just like in WhatsApp Web.</p>
      <ul>
        <li>Every new conversation opens when the customer contacts you or responds to a template.</li>
        <li>The messaging is available for 24 hours with the same customer.</li>
        <li>You can send text, media, files, voice messages and more.</li>
        <li>Full support for sending templates from within the chat.</li>
        <li>Option to tag, assign category and document the conversation in the timeline.</li>
        <li>Direct calling from the browser or conference call with an internal representative.</li>
      </ul>
      <p>Everything you need to provide professional, personal and fast customer service – in one place.</p>
    `
  }
},
{
  id: 5,
  slug: 'create-campaigns',
  title: {
    he: "יצירת קמפיינים ב-WhatsApp API עם גמבוט",
    en: "Creating Campaigns in WhatsApp API with Gambot"
  },
  category: {
    he: "שיווק וקמפיינים",
    en: "Marketing and Campaigns"
  },
  difficulty: {
    he: "מתקדם",
    en: "Advanced"
  },
  estimatedTime: 25,
  description: {
    he: "במדריך זה נלמד איך לבנות קמפיינים אוטומטיים ומדויקים ב-Gambot – כולל קמפיינים מיידיים ומתוזמנים, ניתוח תוצאות ושימוש בכפתורים אינטראקטיביים.",
    en: "In this guide we will learn how to build automatic and precise campaigns in Gambot – including immediate and scheduled campaigns, results analysis and using interactive buttons."
  },
  path: "/guide/create-campaigns",
  icon: FaBullhorn,
  videoUrl: "https://www.youtube.com/embed/nc3NtwQJj6s",
  keywords: [
    "קמפיינים WhatsApp API",
    "WhatsApp API שיווק",
    "שליחת הודעות וואטסאפ מרובות",
    "WhatsApp API פילוח לקוחות",
    "קמפיין וואטסאפ עסקי",
    "הודעות אוטומטיות WhatsApp",
    "שיווק בווטסאפ",
    "גמבוט קמפיינים",
    "WhatsApp API לקבוצות",
    "WhatsApp API Campaign Automation"
  ],
  content: {
    he: `
      <h2>קמפיינים ב-Gambot</h2>
      <p>בסרטון הזה נלמד איך לבנות קמפיינים ב-Gambot – הפלטפורמה המובילה לשליחת הודעות וואטסאפ אוטומטיות ואישיות ללקוחות, בקלות ובמהירות.</p>

      <h3>📌 מה תלמדו בסרטון:</h3>
      <ul>
        <li>✅ <strong>שני סוגי קמפיינים:</strong><br>
          קמפיין ידני – נשלח מיידית בלחיצת כפתור<br>
          קמפיין מתוזמן – רץ אוטומטית לפי לו״ז שתגדירו
        </li>
      </ul>

      <h3>⏱️ בקמפיינים מתוזמנים תוכלו לבחור בין:</h3>
      <ul>
        <li>קמפיינים חוזרים (לדוגמה: פעם בשבוע, חודש או שנה) עם הפסקה לפי תאריך או מספר שליחות</li>
        <li>קמפיין חד פעמי – בוחרים תאריך ושעה מדויקים והקמפיין יוצא</li>
      </ul>

      <h3>📊 יכולות נוספות:</h3>
      <ul>
        <li>ניתוח תוצאות מתקדם: מי לחץ, מי הגיב, מי פתח</li>
        <li>כפתורים אינטראקטיביים להמשך שיחה אוטומטית</li>
        <li>שיעור פתיחה גבוה במיוחד – כי וואטסאפ פשוט עובד</li>
      </ul>

     <h3>🏆 היתרונות שלכם עם Gambot:</h3>
  <ul>
    <li>שיווק בוואטסאפ – ערוץ התקשורת הישיר, האפקטיבי והנפתח ביותר 📲</li>
    <li>כפתורים אינטראקטיביים להנעה לפעולה – שיחה, קישור, טופס או קטלוג</li>
    <li>מעקב וניתוח ביצועים – תדעו בדיוק מי פתח, קרא, הקליק וענה</li>
    <li>חיסכון בזמן ובכוח אדם – שלחו מאות הודעות בלחיצה אחת</li>
    <li>שדרוג המקצועיות והאחידות מול הלקוחות – בלי טעויות, עם מיתוג מדויק</li>
    <li>שליטה מלאה בתקשורת – הכל מרוכז במקום אחד, עם גמישות מלאה</li>
  </ul>

      <p>🎥 צפו בסרטון כדי ללמוד איך לנהל קמפיינים מוצלחים בוואטסאפ – שלב אחר שלב.</p>
    `,
    en: `
      <h2>Campaigns in Gambot</h2>
      <p>In this video we will learn how to build campaigns in Gambot – the leading platform for sending automatic and personal WhatsApp messages to customers, easily and quickly.</p>

      <h3>📌 What you will learn in the video:</h3>
      <ul>
        <li>✅ <strong>Two types of campaigns:</strong><br>
          Manual campaign – sent immediately at the click of a button<br>
          Scheduled campaign – runs automatically according to the schedule you set
        </li>
      </ul>

      <h3>⏱️ In scheduled campaigns you can choose between:</h3>
      <ul>
        <li>Recurring campaigns (for example: once a week, month or year) with pause by date or number of sends</li>
        <li>One-time campaign – choose exact date and time and the campaign goes out</li>
      </ul>

      <h3>📊 Additional capabilities:</h3>
      <ul>
        <li>Advanced results analysis: who clicked, who responded, who opened</li>
        <li>Interactive buttons for automatic conversation continuation</li>
        <li>Exceptionally high open rate – because WhatsApp simply works</li>
      </ul>

     <h3>🏆 Your advantages with Gambot:</h3>
  <ul>
    <li>WhatsApp marketing – the most direct, effective and open communication channel 📲</li>
    <li>Interactive buttons for call to action – call, link, form or catalog</li>
    <li>Performance tracking and analysis – you'll know exactly who opened, read, clicked and responded</li>
    <li>Time and manpower savings – send hundreds of messages with one click</li>
    <li>Upgrading professionalism and consistency with customers – no mistakes, with precise branding</li>
    <li>Full control over communication – everything centralized in one place, with full flexibility</li>
  </ul>

      <p>🎥 Watch the video to learn how to manage successful WhatsApp campaigns – step by step.</p>
    `
  }
},

  {
    id: 6,
    slug: 'use-gambot-ai',
    title: {
      he: "שימוש ב-Gambot AI",
      en: "Using Gambot AI"
    },
    category: {
      he: "בינה מלאכותית",
      en: "Artificial Intelligence"
    },
    difficulty: {
      he: "מתקדם",
      en: "Advanced"
    },
    estimatedTime: 18,
    keywords: [
  "בינה מלאכותית WhatsApp",
  "Gambot AI",
  "שימוש ב-AI לצ'אט בוואטסאפ",
  "מענה אוטומטי חכם WhatsApp API",
  "אימון AI על שאלות ותשובות",
  "בוט AI לעסקים",
  "WhatsApp Chatbot",
  "אינטליגנציה מלאכותית לשירות לקוחות",
  "גמבוט בינה מלאכותית",
  "WhatsApp AI Automation"
],
    description: {
      he: "גלה איך להפעיל את הבינה המלאכותית שלנו, לאמן אותה על בסיס שאלות ותשובות, ולקבל תגובות חכמות לשיחות נכנסות עם לקוחות.",
      en: "Discover how to activate our artificial intelligence, train it based on questions and answers, and get smart responses to incoming conversations with customers."
    },
    path: "/guide/use-gambot-ai",
    icon: FaRobot,
    videoUrl: "https://www.youtube.com/embed/example-ai-guide",
    content: {
      he: `
        <h2>הפעלת הבינה המלאכותית של גמבוט</h2>
        <p>הבינה המלאכותית של גמבוט מאפשרת לכם לתת מענה אוטומטי חכם ללקוחות 24/7.</p>
        <ul>
          <li>אימון הבוט על שאלות ותשובות נפוצות בתחום שלכם</li>
          <li>מענה מיידי לשאלות חוזרות ללא התערבות אנושית</li>
          <li>העברה חכמה לנציג אנושי במקרים מורכבים</li>
          <li>למידה מתמשכת מתוך השיחות הקיימות</li>
        </ul>
        <p>הגדירו פעם אחת ותהנו ממענה מקצועי ומהיר לכל לקוח.</p>
      `,
      en: `
        <h2>Activating Gambot's Artificial Intelligence</h2>
        <p>Gambot's artificial intelligence allows you to provide smart automatic responses to customers 24/7.</p>
        <ul>
          <li>Training the bot on frequently asked questions and answers in your field</li>
          <li>Immediate response to recurring questions without human intervention</li>
          <li>Smart transfer to human representative in complex cases</li>
          <li>Continuous learning from existing conversations</li>
        </ul>
        <p>Set up once and enjoy professional and fast response to every customer.</p>
      `
    }
  },
 
  {
    id: 7,
    slug: 'advanced-templates',
    title: {
      he: "הכנת Template מתקדם",
      en: "Creating Advanced Templates"
    },
    category: {
      he: "הודעות ותבניות",
      en: "Messages and Templates"
    },
    difficulty: {
      he: "מתקדם",
      en: "Advanced"
    },
    estimatedTime: 22,
    description: {
      he: "כאן תמצא הסבר מפורט על איך ליצור תבניות הודעה מקצועיות לאישורים, תזכורות, שיווק ועוד – כולל עיצוב והתאמה אישית.",
      en: "Here you will find a detailed explanation on how to create professional message templates for confirmations, reminders, marketing and more – including design and customization."
    },
    path: "/guide/advanced-templates",
    icon: FaRegFileAlt,
    videoUrl: "https://www.youtube.com/embed/example-advanced-template",
    keywords: [
  "תבניות הודעה WhatsApp API",
  "WhatsApp API Templates",
  "יצירת תבנית אישור/תזכורת",
  "תבנית שיווקית לוואטסאפ",
  "WhatsApp Template Message",
  "עיצוב הודעות לוואטסאפ",
  "שימוש ב-Template בוואטסאפ API",
  "הודעות מוכנות WhatsApp API",
  "WhatsApp Template Approval",
  "WhatsApp API תבניות מקצועיות"
],
    content: {
      he: `
        <h2>יצירת תבניות מתקדמות</h2>
        <p>למד איך ליצור תבניות הודעה מקצועיות ומותאמות אישית עבור הצרכים הייחודיים של העסק שלך.</p>
        <ul>
          <li>עיצוב תבניות עם כותרות, תמונות ווידאו</li>
          <li>הוספת כפתורים אינטראקטיביים לפעולות</li>
          <li>שימוש במשתנים דינמיים להתאמה אישית</li>
          <li>אישור תבניות במטא ושימוש בהן</li>
        </ul>
        <p>תבניות מקצועיות מגדילות את שיעורי הפתיחה והמעורבות עם הלקוחות.</p>
      `,
      en: `
        <h2>Creating Advanced Templates</h2>
        <p>Learn how to create professional and customized message templates for your business's unique needs.</p>
        <ul>
          <li>Designing templates with headers, images and videos</li>
          <li>Adding interactive buttons for actions</li>
          <li>Using dynamic variables for personalization</li>
          <li>Approving templates in Meta and using them</li>
        </ul>
        <p>Professional templates increase open rates and engagement with customers.</p>
      `
    }
  },

  {
    id: 8,
    slug: 'botomation',
    title: {
      he: "אוטומציות (Botomation) - מדריך שלם",
      en: "Botomation - Complete Guide"
    },
    category: {
      he: "אוטומציה ובוטים",
      en: "Automation and Bots"
    },
    difficulty: {
      he: "מתקדם",
      en: "Advanced"
    },
    estimatedTime: 30,
    description: {
      he: "למד איך לבנות אוטומציות מורכבות ב-Gambot - מ-triggers פשוטים ועד workflows מתקדמים עם תנאים, לולאות, AI ושילובים עם מערכות חיצוניות.",
      en: "Learn how to build complex automations in Gambot - from simple triggers to advanced workflows with conditions, loops, AI and integrations with external systems."
    },
    path: "/guide/botomation",
    icon: FaRobot,
    videoUrl: "https://www.youtube.com/embed/FpRqTJPZXw8",
    keywords: [
      "אוטומציה WhatsApp API",
      "Botomation גמבוט",
      "Workflow automation",
      "בוט אוטומטי לוואטסאפ",
      "WhatsApp API אוטומציה",
      "Triggers ו-Actions",
      "אוטומציה עם AI",
      "שילוב מערכות חיצוניות",
      "Conditional logic WhatsApp",
      "WhatsApp Automation בעברית"
    ],
    content: {
      he: `
        <h2>אוטומציות מתקדמות ב-Gambot</h2>
        <p>במדריך זה תלמד איך לבנות אוטומציות (Botomation) שיחסכו לך זמן ויעבירו את העסק שלך לרמה הבאה.</p>
        
        <h3>🎯 מה זה Botomation?</h3>
        <p>Botomation הוא מנוע האוטומציות של Gambot - מערכת ויזואלית ועוצמתית שמאפשרת לך ליצור workflows מורכבים ללא צורך בתכנות.</p>

        <h3>🔥 יכולות עיקריות:</h3>
        <ul>
          <li><strong>Triggers:</strong> הפעלה אוטומטית על הודעות נכנסות, כפתורים, מילות מפתח, טמפלטים ועוד</li>
          <li><strong>Actions:</strong> שליחת הודעות, עדכון אנשי קשר, הוספה לקמפיינים, שילוב עם API חיצוני</li>
          <li><strong>Conditions:</strong> תנאים מורכבים עם AND/OR לבניית לוגיקה עסקית</li>
          <li><strong>Loops:</strong> לולאות לעיבוד מרובה של רשומות</li>
          <li><strong>AI Integration:</strong> שילוב Gambot AI למענה חכם</li>
          <li><strong>Variables:</strong> משתנים דינמיים מכל שלב לשלב</li>
        </ul>

        <h3>📊 דוגמאות לשימוש:</h3>
        <ul>
          <li>מענה אוטומטי חכם עם AI</li>
          <li>תהליך הזמנה אוטומטי</li>
          <li>תיאום פגישות אוטומטי</li>
          <li>איסוף פידבק ושביעות רצון</li>
          <li>ניהול leads אוטומטי</li>
          <li>שילוב עם מערכות CRM חיצוניות</li>
        </ul>

        <h3>🎥 בסרטון תלמדו:</h3>
        <ul>
          <li>איך בונים Botomation מהתחלה</li>
          <li>הגדרת Triggers ו-Actions</li>
          <li>עבודה עם Conditions ו-Branches</li>
          <li>שימוש במשתנים דינמיים</li>
          <li>בדיקה ו-Testing של אוטומציות</li>
          <li>טיפים וטריקים למתקדמים</li>
        </ul>

        <p>🚀 עם Botomation אתם יכולים להפוך כל תהליך חוזר למערכת אוטומטית שעובדת 24/7!</p>
      `,
      en: `
        <h2>Advanced Automations in Gambot</h2>
        <p>In this guide you will learn how to build Botomations that will save you time and take your business to the next level.</p>
        
        <h3>🎯 What is Botomation?</h3>
        <p>Botomation is Gambot's automation engine - a visual and powerful system that allows you to create complex workflows without the need for programming.</p>

        <h3>🔥 Main Capabilities:</h3>
        <ul>
          <li><strong>Triggers:</strong> Automatic activation on incoming messages, buttons, keywords, templates and more</li>
          <li><strong>Actions:</strong> Sending messages, updating contacts, adding to campaigns, integrating with external API</li>
          <li><strong>Conditions:</strong> Complex conditions with AND/OR for building business logic</li>
          <li><strong>Loops:</strong> Loops for processing multiple records</li>
          <li><strong>AI Integration:</strong> Integration of Gambot AI for smart responses</li>
          <li><strong>Variables:</strong> Dynamic variables from step to step</li>
        </ul>

        <h3>📊 Usage Examples:</h3>
        <ul>
          <li>Smart auto-reply with AI</li>
          <li>Automatic ordering process</li>
          <li>Automatic appointment scheduling</li>
          <li>Feedback and satisfaction collection</li>
          <li>Automatic leads management</li>
          <li>Integration with external CRM systems</li>
        </ul>

        <h3>🎥 In the video you will learn:</h3>
        <ul>
          <li>How to build Botomation from scratch</li>
          <li>Setting up Triggers and Actions</li>
          <li>Working with Conditions and Branches</li>
          <li>Using dynamic variables</li>
          <li>Testing automations</li>
          <li>Tips and tricks for advanced users</li>
        </ul>

        <p>🚀 With Botomation you can turn any recurring process into an automated system that works 24/7!</p>
      `
    }
  },

  {
    id: 9,
    slug: 'manage-users',
    title: {
      he: "ניהול משתמשים במערכת",
      en: "User Management in the System"
    },
    category: {
      he: "ניהול מערכת",
      en: "System Management"
    },
    difficulty: {
      he: "בינוני",
      en: "Medium"
    },
    estimatedTime: 15,
    description: {
      he: "למד איך לנהל משתמשים במערכת גמבוט - כולל הגדרת תפקידים, הרשאות, אזורי זמן והודעות פנימיות בין חברי הצוות.",
      en: "Learn how to manage users in the Gambot system - including setting roles, permissions, time zones and internal messages between team members."
    },
    path: "/guide/manage-users",
    icon: FaUserCog,
    videoUrl: "https://www.youtube.com/embed/0lrwmOXgT1Y",
    keywords: [
      "ניהול משתמשים גמבוט",
      "הרשאות משתמשים WhatsApp API",
      "תפקידי אבטחה גמבוט",
      "הוספת משתמשים למערכת",
      "ניהול צוות WhatsApp API",
      "הגדרת הרשאות גמבוט",
      "הודעות פנימיות בין משתמשים",
      "תיוג קולגות בתיקי לקוחות",
      "בקרת עלויות משתמשים",
      "ניהול סטטוס משתמש"
    ],
    content: {
      he: `
        <h2>ניהול משתמשים במערכת גמבוט</h2>
        <p>מערכת גמבוט מאפשרת לך לנהל את המשתמשים בארגון שלך בצורה מקצועית ומאובטחת, תוך שליטה מלאה על הרשאות ותפקידים.</p>

        <h3>🔐 הגדרת תפקידי אבטחה והרשאות</h3>
        <p>המערכת מאפשרת למנהלים להגדיר תפקידים מותאמים אישית לכל עובד:</p>
        <ul>
          <li><strong>גישה מלאה למערכת</strong> - מנהלים עם הרשאות לכל התכונות והמודולים</li>
          <li><strong>הרשאות צ'אט בסיסיות</strong> - עובדים שרק עונים על הודעות ומנהלים שיחות</li>
          <li><strong>התאמה אישית של סמכויות</strong> - בחירת מודולים ספציפיים לכל משתמש (קמפיינים, אוטומציות, אנשי קשר וכו')</li>
        </ul>

        <h3>⚙️ הגדרות טכניות</h3>
        <p>לכל משתמש ניתן להגדיר:</p>
        <ul>
          <li><strong>אזור זמן</strong> - להבטיח תזמון נכון של קמפיינים ותזכורות</li>
          <li><strong>שפת ממשק</strong> - עברית או אנגלית</li>
          <li><strong>סטטוס משתמש</strong> - פעיל/לא פעיל (חשוב לבקרת עלויות וניהול רישיונות)</li>
        </ul>

        <h3>💬 תקשורת פנים-ארגונית</h3>
        <p>המערכת משפרת את שיתוף הפעולה בין חברי הצוות:</p>
        <ul>
          <li><strong>הודעות פנימיות</strong> - שליחת הודעות בין עובדים ישירות מתוך המערכת</li>
          <li><strong>תיוג קולגות</strong> - אזכור עמיתים בתוך תיקי לקוחות (@mention)</li>
          <li><strong>מעקב אחר משימות</strong> - הקצאת משימות ומעקב אחר ביצוען</li>
        </ul>

        <h3>📊 בקרת עלויות ויעילות תפעולית</h3>
        <p>ניהול נכון של משתמשים מאפשר:</p>
        <ul>
          <li>שליטה במספר המשתמשים הפעילים (חשבון לפי רישיונות)</li>
          <li>חסימת גישה למשתמשים שעזבו את הארגון</li>
          <li>מניעת שימוש לא מורשה במערכת</li>
          <li>הבטחת אבטחת מידע ופרטיות לקוחות</li>
        </ul>

        <h3>🎯 תרחישי שימוש נפוצים</h3>
        <ul>
          <li><strong>מנהל צוות</strong> - גישה מלאה לניהול, קמפיינים ודוחות</li>
          <li><strong>נציג שירות</strong> - גישה לצ'אט, אנשי קשר ומשימות בלבד</li>
          <li><strong>משווק</strong> - גישה לקמפיינים, טמפלטים וניתוח תוצאות</li>
          <li><strong>מפתח/אדמין</strong> - גישה לאוטומציות, API ושילובים חיצוניים</li>
        </ul>

        <p>🚀 ניהול נכון של משתמשים הוא הבסיס לעבודה מאורגנת, מאובטחת ויעילה במערכת גמבוט!</p>
      `,
      en: `
        <h2>User Management in the Gambot System</h2>
        <p>The Gambot system allows you to manage users in your organization professionally and securely, with full control over permissions and roles.</p>

        <h3>🔐 Setting Security Roles and Permissions</h3>
        <p>The system allows administrators to define custom roles for each employee:</p>
        <ul>
          <li><strong>Full system access</strong> - Managers with permissions to all features and modules</li>
          <li><strong>Basic chat permissions</strong> - Employees who only respond to messages and manage conversations</li>
          <li><strong>Custom permission settings</strong> - Selection of specific modules for each user (campaigns, automations, contacts, etc.)</li>
        </ul>

        <h3>⚙️ Technical Settings</h3>
        <p>For each user you can set:</p>
        <ul>
          <li><strong>Time zone</strong> - Ensure correct timing of campaigns and reminders</li>
          <li><strong>Interface language</strong> - Hebrew or English</li>
          <li><strong>User status</strong> - Active/Inactive (important for cost control and license management)</li>
        </ul>

        <h3>💬 Internal Organizational Communication</h3>
        <p>The system improves collaboration between team members:</p>
        <ul>
          <li><strong>Internal messages</strong> - Sending messages between employees directly from within the system</li>
          <li><strong>Colleague tagging</strong> - Mentioning colleagues within customer files (@mention)</li>
          <li><strong>Task tracking</strong> - Assigning tasks and tracking their completion</li>
        </ul>

        <h3>📊 Cost Control and Operational Efficiency</h3>
        <p>Proper user management allows:</p>
        <ul>
          <li>Control over the number of active users (billing per license)</li>
          <li>Blocking access for users who left the organization</li>
          <li>Preventing unauthorized system use</li>
          <li>Ensuring data security and customer privacy</li>
        </ul>

        <h3>🎯 Common Use Cases</h3>
        <ul>
          <li><strong>Team Manager</strong> - Full access to management, campaigns and reports</li>
          <li><strong>Service Representative</strong> - Access to chat, contacts and tasks only</li>
          <li><strong>Marketer</strong> - Access to campaigns, templates and result analysis</li>
          <li><strong>Developer/Admin</strong> - Access to automations, API and external integrations</li>
        </ul>

        <p>🚀 Proper user management is the foundation for organized, secure and efficient work in the Gambot system!</p>
      `
    }
  },

  {
    id: 10,
    slug: 'manage-tasks',
    title: {
      he: "ניהול משימות במערכת",
      en: "Task Management in the System"
    },
    category: {
      he: "ניהול עבודה",
      en: "Work Management"
    },
    difficulty: {
      he: "קל",
      en: "Easy"
    },
    estimatedTime: 12,
    description: {
      he: "למד איך ליצור ולנהל משימות בגמבוט - כולל יצירה, הקצאה, תזמון תזכורות, שיוך ללקוחות ומעקב אחר ביצוע.",
      en: "Learn how to create and manage tasks in Gambot - including creation, assignment, reminder scheduling, linking to customers and tracking completion."
    },
    path: "/guide/manage-tasks",
    icon: FaTasks,
    videoUrl: "https://www.youtube.com/embed/hMw9i9M1Cx4",
    keywords: [
      "משימות גמבוט",
      "ניהול משימות WhatsApp API",
      "הקצאת משימות לצוות",
      "תזכורות משימות",
      "שיוך משימה ללקוח",
      "ניהול טורי עבודה",
      "מעקב אחר משימות",
      "תיעוד משימות",
      "סטטוס משימות",
      "קטגוריות משימות"
    ],
    content: {
      he: `
        <h2>ניהול משימות במערכת גמבוט</h2>
        <p>מערכת המשימות בגמבוט מיועדת לסייע לך ולצוות שלך לנהל את העבודה היומיומית בצורה מאורגנת ויעילה.</p>

        <h3>🎯 למה משימות?</h3>
        <p>משימות מאפשרות לך:</p>
        <ul>
          <li><strong>ליצור תזכורות אישיות</strong> - להוציא הצעת מחיר, לבדוק בקשה, לחזור ללקוח</li>
          <li><strong>לנהל טורי עבודה</strong> - מנהל צוות יכול לפתוח משימות לכל חברי הצוות</li>
          <li><strong>לשייך ללקוחות</strong> - כל משימה קשורה לאיש קשר או רשומה ספציפית</li>
          <li><strong>לתזמן תזכורות</strong> - קבלת התראות במייל בזמן שנקבע</li>
          <li><strong>לתעד את ההתקדמות</strong> - הוספת הערות וציר זמן למשימה</li>
        </ul>

        <h3>📝 יצירת משימה</h3>
        <p>ליצור משימה חדשה פשוט:</p>
        <ul>
          <li>נווט לסרגל הניווט ← <strong>משימות</strong></li>
          <li>לחץ על <strong>צור משימה חדשה</strong></li>
          <li>מלא את הפרטים:
            <ul>
              <li><strong>תיאור</strong> - מה צריך לעשות?</li>
              <li><strong>תאריך יעד</strong> - עד מתי צריך לבצע?</li>
              <li><strong>עדיפות</strong> - גבוהה / בינונית / נמוכה</li>
              <li><strong>קטגוריה</strong> - מכירה / טיפול / תמיכה</li>
            </ul>
          </li>
        </ul>

        <h3>👥 הקצאה ושיתוף</h3>
        <ul>
          <li><strong>הוקצה למשתמש</strong> - בחר מי יבצע את המשימה (אתה או חבר צוות אחר)</li>
          <li><strong>שיוך לאיש קשר</strong> - קשר את המשימה ללקוח ספציפי</li>
          <li><strong>שיוך לרשומה</strong> - קשר למסמך, הצעת מחיר או כל טבלה דינמית אחרת</li>
        </ul>

        <h3>⏰ תזכורות חכמות</h3>
        <p>המערכת תשלח תזכורת במייל:</p>
        <ul>
          <li>בחר <strong>תאריך ושעה</strong> לתזכורת</li>
          <li>בחר <strong>למי לשלוח</strong> - למשתמש המוקצה, למשתמש אחר או לכתובת מייל חיצונית</li>
          <li>תקבל הודעת אימייל עם פרטי המשימה וקישור ישיר אליה</li>
        </ul>

        <h3>📊 מעקב וניהול</h3>
        <ul>
          <li><strong>המשימות שלי</strong> - רק המשימות שהוקצו לך</li>
          <li><strong>כל המשימות</strong> - כל המשימות של הארגון (למנהלים)</li>
          <li><strong>פעיל</strong> - משימות שעדיין לא בוצעו</li>
          <li><strong>באיחור</strong> - משימות שתאריך היעד עבר</li>
          <li><strong>שלמו</strong> - משימות שסומנו כהושלמו</li>
        </ul>

        <h3>✏️ עדכון משימות</h3>
        <p>בתוך כל משימה תוכל:</p>
        <ul>
          <li><strong>להוסיף תיעוד</strong> - כתוב הערות והתקדמות בציר הזמן</li>
          <li><strong>לעדכן סטטוס</strong> - פתוח / בטיפול / הושלם</li>
          <li><strong>לשנות הקצאה</strong> - להעביר את המשימה למשתמש אחר</li>
          <li><strong>לסמן כהושלם</strong> - לסגור את המשימה</li>
        </ul>

        <h3>🏆 טיפים לעבודה יעילה</h3>
        <ul>
          <li>צור לעצמך משימות לכל פעולה שצריך לבצע עם לקוח</li>
          <li>השתמש בעדיפויות כדי לדעת מה דחוף באמת</li>
          <li>תעד את ההתקדמות בהערות - זה יעזור בעתיד</li>
          <li>השתמש בתגיות לסינון ומיון</li>
          <li>סמן משימות כהושלמו מיד כשגמרת - כדי לשמור על סדר</li>
        </ul>

        <p>🚀 עבודה עם משימות תעזור לך ולצוות שלך לא לפספס כלום, לעבוד בצורה מסודרת ולהגביר את השירות ללקוחות!</p>
      `,
      en: `
        <h2>Task Management in the Gambot System</h2>
        <p>The task system in Gambot is designed to help you and your team manage daily work in an organized and efficient manner.</p>

        <h3>🎯 Why Tasks?</h3>
        <p>Tasks allow you to:</p>
        <ul>
          <li><strong>Create personal reminders</strong> - Issue a quote, check a request, get back to a customer</li>
          <li><strong>Manage work queues</strong> - Team manager can open tasks for all team members</li>
          <li><strong>Link to customers</strong> - Each task is related to a specific contact or record</li>
          <li><strong>Schedule reminders</strong> - Receive email alerts at the set time</li>
          <li><strong>Document progress</strong> - Add notes and timeline to the task</li>
        </ul>

        <h3>📝 Creating a Task</h3>
        <p>Creating a new task is simple:</p>
        <ul>
          <li>Navigate to the navigation bar ← <strong>Tasks</strong></li>
          <li>Click <strong>Create New Task</strong></li>
          <li>Fill in the details:
            <ul>
              <li><strong>Description</strong> - What needs to be done?</li>
              <li><strong>Due date</strong> - By when should it be completed?</li>
              <li><strong>Priority</strong> - High / Medium / Low</li>
              <li><strong>Category</strong> - Sales / Service / Support</li>
            </ul>
          </li>
        </ul>

        <h3>👥 Assignment and Sharing</h3>
        <ul>
          <li><strong>Assigned to user</strong> - Choose who will perform the task (you or another team member)</li>
          <li><strong>Link to contact</strong> - Connect the task to a specific customer</li>
          <li><strong>Link to record</strong> - Connect to document, quote or any other dynamic table</li>
        </ul>

        <h3>⏰ Smart Reminders</h3>
        <p>The system will send an email reminder:</p>
        <ul>
          <li>Choose <strong>date and time</strong> for reminder</li>
          <li>Choose <strong>who to send to</strong> - to assigned user, to another user or to external email address</li>
          <li>You will receive an email notification with task details and direct link to it</li>
        </ul>

        <h3>📊 Tracking and Management</h3>
        <ul>
          <li><strong>My Tasks</strong> - Only tasks assigned to you</li>
          <li><strong>All Tasks</strong> - All organizational tasks (for managers)</li>
          <li><strong>Active</strong> - Tasks not yet completed</li>
          <li><strong>Overdue</strong> - Tasks where due date has passed</li>
          <li><strong>Completed</strong> - Tasks marked as completed</li>
        </ul>

        <h3>✏️ Updating Tasks</h3>
        <p>Within each task you can:</p>
        <ul>
          <li><strong>Add documentation</strong> - Write notes and progress in timeline</li>
          <li><strong>Update status</strong> - Open / In Progress / Completed</li>
          <li><strong>Change assignment</strong> - Transfer the task to another user</li>
          <li><strong>Mark as completed</strong> - Close the task</li>
        </ul>

        <h3>🏆 Tips for Efficient Work</h3>
        <ul>
          <li>Create tasks for every action needed with a customer</li>
          <li>Use priorities to know what's really urgent</li>
          <li>Document progress in notes - it will help in the future</li>
          <li>Use tags for filtering and sorting</li>
          <li>Mark tasks as completed immediately when finished - to maintain order</li>
        </ul>

        <p>🚀 Working with tasks will help you and your team not miss anything, work in an organized manner and improve customer service!</p>
      `
    }
  },

  {
    id: 11,
    slug: 'digital-signature',
    title: {
      he: "חתימה דיגיטלית - מדריך מלא",
      en: "Digital Signature - Complete Guide"
    },
    category: {
      he: "מסמכים וחתימות",
      en: "Documents and Signatures"
    },
    difficulty: {
      he: "בינוני",
      en: "Medium"
    },
    estimatedTime: 18,
    description: {
      he: "למד איך להשתמש במערכת החתימה הדיגיטלית של גמבוט - יצירת מסמכים, ניהול סבב חותמים, רצף כרונולוגי ומעקב בזמן אמת.",
      en: "Learn how to use Gambot's digital signature system - creating documents, managing signature rounds, chronological sequence and real-time tracking."
    },
    path: "/guide/digital-signature",
    icon: FaFileSignature,
    videoUrl: "https://www.youtube.com/embed/_3QbSdmKxqo",
    keywords: [
      "חתימה דיגיטלית גמבוט",
      "חתימה אלקטרונית",
      "סבב חותמים",
      "רצף חתימות כרונולוגי",
      "חתימה על PDF",
      "מסמכים דיגיטליים",
      "אוטומציה לחתימות",
      "מעקב אחר חתימות",
      "חתימה משפטית",
      "תוקף מסמך"
    ],
    content: {
      he: `
        <h2>מערכת החתימה הדיגיטלית של גמבוט</h2>
        <p>מערכת החתימה הדיגיטלית בגמבוט מאפשרת לך ליצור, לנהל ולעקוב אחר תהליך החתימה על מסמכים בצורה מקצועית ומאובטחת.</p>

        <h3>🎯 למה חתימה דיגיטלית?</h3>
        <p>מערכת החתימה הדיגיטלית מספקת:</p>
        <ul>
          <li><strong>אוטומציה מלאה</strong> - כל התהליך אוטומטי מתחילה ועד סוף</li>
          <li><strong>תוקף משפטי</strong> - חתימות מאובטחות ומוכרות על פי חוק</li>
          <li><strong>חיסכון בזמן</strong> - בלי צורך בהדפסה, סריקה ושליחה פיזית</li>
          <li><strong>מעקב בזמן אמת</strong> - ידיעה מיידית מי חתם ומי עדיין לא</li>
          <li><strong>תיעוד מלא</strong> - היסטוריה שלמה של כל תהליך חתימה</li>
        </ul>

        <h3>📄 יצירת מסמך לחתימה</h3>
        <p>התהליך פשוט:</p>
        <ul>
          <li>העלה קובץ PDF למערכת</li>
          <li>הגדר את החותמים - שם, מייל, מספר טלפון</li>
          <li>בחר את סוג החתימה הנדרשת</li>
          <li>הגדר תוקף למסמך (תאריך אחרון לחתימה)</li>
        </ul>

        <h3>🔄 ניהול סבב חותמים</h3>
        <p>המערכת מאפשרת ניהול מתקדם של תהליך החתימה:</p>
        <ul>
          <li><strong>רצף חתימות כרונולוגי</strong> - הגדרת סדר קבוע לחתימה (חותם 1 → חותם 2 → חותם 3...)</li>
          <li><strong>חתימה מקבילה</strong> - כל החותמים מקבלים הודעה בו-זמנית</li>
          <li><strong>הודעות אוטומטיות</strong> - כל חותם מקבל הודעה במייל רק כשמגיע תורו</li>
          <li><strong>תזכורות</strong> - שליחת תזכורות אוטומטיות למי שעדיין לא חתם</li>
        </ul>

        <h3>✍️ הטמעת שדות בPDF</h3>
        <p>המערכת מאפשרת להטמיע אלמנטים שונים במסמך:</p>
        <ul>
          <li><strong>שדה שם</strong> - החותם ממלא את שמו המלא</li>
          <li><strong>שדה תאריך</strong> - תאריך החתימה (אוטומטי או ידני)</li>
          <li><strong>חתימה ידנית</strong> - ציור חתימה עם העכבר או המגע</li>
          <li><strong>חותמת</strong> - חותמת דיגיטלית של החברה</li>
          <li><strong>שדות נוספים</strong> - כל שדה מותאם אישית שתרצה</li>
        </ul>

        <h3>⏰ קביעת תוקף מוגדר</h3>
        <p>הגדר לוחות זמנים למסמך:</p>
        <ul>
          <li>בחר תאריך סיום לתהליך החתימה</li>
          <li>המערכת תזכיר אוטומטית למי שלא חתם</li>
          <li>תקבל התראה אם המסמך לא נחתם עד התאריך הקבוע</li>
          <li>אפשרות להאריך את התוקף במידת הצורך</li>
        </ul>

        <h3>📬 הפצה אוטומטית</h3>
        <p>בסיום תהליך החתימה:</p>
        <ul>
          <li><strong>יצירת עותק חתום</strong> - PDF מלא עם כל החתימות</li>
          <li><strong>שליחה אוטומטית במייל</strong> - לכל הצדדים הרלוונטיים</li>
          <li><strong>שמירה במערכת</strong> - העתק מאובטח נשמר בגמבוט</li>
          <li><strong>אישור השלמה</strong> - הודעה שהתהליך הושלם בהצלחה</li>
        </ul>

        <h3>📊 מעקב בזמן אמת</h3>
        <p>ממשק הניהול מאפשר לך לראות:</p>
        <ul>
          <li><strong>סטטוס חתימה</strong> של כל משתתף - חתם / ממתין / נמסר / נפתח</li>
          <li><strong>תאריך ושעה</strong> מדויקים של כל פעולה</li>
          <li><strong>מיקום גיאוגרפי</strong> של החתימה (אופציונלי)</li>
          <li><strong>היסטוריה מלאה</strong> - כל השלבים מתחילה ועד סוף</li>
        </ul>

        <h3>🔐 אבטחה ותוקף משפטי</h3>
        <ul>
          <li>הצפנה מלאה של כל המסמכים</li>
          <li>תיעוד חתימה עם חותמת זמן (timestamp)</li>
          <li>תעודת אימות דיגיטלית לכל חתימה</li>
          <li>תאימות לתקנות ותקני אבטחה בינלאומיים</li>
        </ul>

        <h3>🏆 תרחישי שימוש נפוצים</h3>
        <ul>
          <li><strong>חוזים עם לקוחות</strong> - חתימה מהירה על הסכמי שירות</li>
          <li><strong>הזמנות ואישורים</strong> - אישור הזמנות גדולות</li>
          <li><strong>מסמכים פנים-ארגוניים</strong> - אישורים ממנהלים</li>
          <li><strong>הסכמי NDA</strong> - חתימה על הסכמי סודיות</li>
          <li><strong>טפסי הסכמה</strong> - אישורי GDPR, תקנות פרטיות וכו'</li>
        </ul>

        <p>🚀 מערכת החתימה הדיגיטלית של גמבוט מייצרת אוטומציה מלאה של תיעוד ואישור, תוך מעקב בזמן אמת ישירות מממשק הניהול!</p>
      `,
      en: `
        <h2>Gambot's Digital Signature System</h2>
        <p>Gambot's digital signature system allows you to create, manage and track the document signing process professionally and securely.</p>

        <h3>🎯 Why Digital Signature?</h3>
        <p>The digital signature system provides:</p>
        <ul>
          <li><strong>Full automation</strong> - The entire process is automatic from start to finish</li>
          <li><strong>Legal validity</strong> - Secure and legally recognized signatures</li>
          <li><strong>Time savings</strong> - No need for printing, scanning and physical mailing</li>
          <li><strong>Real-time tracking</strong> - Immediate knowledge of who signed and who hasn't</li>
          <li><strong>Full documentation</strong> - Complete history of every signing process</li>
        </ul>

        <h3>📄 Creating a Document for Signature</h3>
        <p>The process is simple:</p>
        <ul>
          <li>Upload a PDF file to the system</li>
          <li>Define the signers - name, email, phone number</li>
          <li>Choose the required type of signature</li>
          <li>Set document validity (final date for signing)</li>
        </ul>

        <h3>🔄 Managing Signer Rounds</h3>
        <p>The system allows advanced management of the signing process:</p>
        <ul>
          <li><strong>Chronological signature sequence</strong> - Setting a fixed order for signing (signer 1 → signer 2 → signer 3...)</li>
          <li><strong>Parallel signing</strong> - All signers receive notification simultaneously</li>
          <li><strong>Automatic notifications</strong> - Each signer receives email notification only when their turn comes</li>
          <li><strong>Reminders</strong> - Sending automatic reminders to those who haven't signed yet</li>
        </ul>

        <h3>✍️ Embedding Fields in PDF</h3>
        <p>The system allows embedding various elements in the document:</p>
        <ul>
          <li><strong>Name field</strong> - Signer fills in their full name</li>
          <li><strong>Date field</strong> - Signing date (automatic or manual)</li>
          <li><strong>Manual signature</strong> - Drawing signature with mouse or touch</li>
          <li><strong>Stamp</strong> - Company's digital stamp</li>
          <li><strong>Additional fields</strong> - Any custom field you want</li>
        </ul>

        <h3>⏰ Setting Defined Validity</h3>
        <p>Set timelines for the document:</p>
        <ul>
          <li>Choose end date for the signing process</li>
          <li>System will automatically remind those who haven't signed</li>
          <li>You'll receive alert if document isn't signed by set date</li>
          <li>Option to extend validity if needed</li>
        </ul>

        <h3>📬 Automatic Distribution</h3>
        <p>At the end of the signing process:</p>
        <ul>
          <li><strong>Creating signed copy</strong> - Complete PDF with all signatures</li>
          <li><strong>Automatic email sending</strong> - To all relevant parties</li>
          <li><strong>System storage</strong> - Secure copy saved in Gambot</li>
          <li><strong>Completion confirmation</strong> - Notification that process completed successfully</li>
        </ul>

        <h3>📊 Real-time Tracking</h3>
        <p>The management interface allows you to see:</p>
        <ul>
          <li><strong>Signing status</strong> of each participant - Signed / Waiting / Delivered / Opened</li>
          <li><strong>Date and time</strong> precise for each action</li>
          <li><strong>Geographic location</strong> of signature (optional)</li>
          <li><strong>Complete history</strong> - All steps from start to finish</li>
        </ul>

        <h3>🔐 Security and Legal Validity</h3>
        <ul>
          <li>Full encryption of all documents</li>
          <li>Signature documentation with timestamp</li>
          <li>Digital authentication certificate for each signature</li>
          <li>Compliance with international regulations and security standards</li>
        </ul>

        <h3>🏆 Common Use Cases</h3>
        <ul>
          <li><strong>Customer contracts</strong> - Quick signing of service agreements</li>
          <li><strong>Orders and confirmations</strong> - Approval of large orders</li>
          <li><strong>Internal documents</strong> - Approvals from managers</li>
          <li><strong>NDA agreements</strong> - Signing confidentiality agreements</li>
          <li><strong>Consent forms</strong> - GDPR confirmations, privacy regulations etc.</li>
        </ul>

        <p>🚀 Gambot's digital signature system creates full automation of documentation and approval, with real-time tracking directly from the management interface!</p>
      `
    }
  }

];

export default guideData;
