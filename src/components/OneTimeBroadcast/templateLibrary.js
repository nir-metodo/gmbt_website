/*
 * Ready-made WhatsApp templates for the one-time broadcast wizard.
 *
 * A one-time broadcast is for a message that is genuinely sent ONCE: an update, an invitation to join a group or a
 * community, a one-off sale or event, a one-time request or survey. Recurring / transactional messages (appointment
 * reminders, order tracking, payment reminders…) are not what this product is for, so they are not offered here.
 *
 * Bodies use concept tokens — {{name}} {{date}} {{time}} {{product}} — which applyLibraryTemplate() maps to the
 * customer's Excel columns by header synonyms. A concept with no matching column becomes plain text instead
 * (the name falls back to "לקוח/ה יקר/ה"; the others become a [placeholder] the customer must complete — the wizard
 * blocks the order until no [placeholder] is left). Link / call buttons come without an address on purpose: the
 * customer fills in their own. Quick-reply buttons ship with a ready auto-reply the customer can edit.
 */

export const LIB_DOMAINS = [
  { id: 'group', label: 'הצטרפות לקבוצה / קהילה', icon: '👥' },
  { id: 'update', label: 'עדכון חד פעמי', icon: '📣' },
  { id: 'event', label: 'אירוע / מבצע חד פעמי', icon: '🎟️' },
  { id: 'request', label: 'בקשה / סקר חד פעמי', icon: '📝' },
];

export const LIB_TEMPLATES = [
  // ── הצטרפות לקבוצה / קהילה ──
  {
    id: 'group-whatsapp', domain: 'group', title: 'הזמנה להצטרף לקבוצת וואטסאפ',
    header: 'מזמינים אתכם להצטרף',
    body: 'שלום {{name}}, פתחנו קבוצת וואטסאפ לעדכונים והטבות לחברי הקהילה שלנו.\nההצטרפות חופשית, ואפשר לעזוב את הקבוצה בכל רגע. נשמח שתהיו איתנו.',
    buttons: [
      { type: 'URL', text: 'להצטרפות לקבוצה' },
      { type: 'QUICK_REPLY', text: 'רוצה פרטים', autoReply: 'תודה על ההתעניינות! נשלח לך כאן בקרוב את כל הפרטים על הקבוצה 🙏' },
    ],
  },
  {
    id: 'group-channel', domain: 'group', title: 'הזמנה לערוץ עדכונים',
    body: 'היי {{name}}, יצרנו ערוץ וואטסאפ שבו נשתף עדכונים חשובים ומבצעים ראשונים.\nההצטרפות בלחיצה אחת, בלי לחשוף את המספר שלך לאחרים.',
    buttons: [
      { type: 'URL', text: 'להצטרפות לערוץ' },
      { type: 'QUICK_REPLY', text: 'לא מעוניין', autoReply: 'אין בעיה, תודה על הזמן! אם תרצו להצטרף בהמשך, אנחנו כאן 🙏' },
    ],
  },
  {
    id: 'group-community', domain: 'group', title: 'הקמת קהילה / מועדון חדש',
    header: 'קהילה חדשה',
    body: 'שלום {{name}}, אנחנו מקימים קהילה חדשה ונשמח שתהיו חלק ממנה.\nמי שמצטרף ראשון יקבל הטבות והזמנות לאירועים. כדי להצטרף, השאירו תגובה או לחצו על הכפתור.',
    buttons: [
      { type: 'QUICK_REPLY', text: 'מצטרף לקהילה', autoReply: 'ברוכים הבאים! רשמנו אותך, ונחזור אליך בקרוב עם כל הפרטים 🎉' },
      { type: 'URL', text: 'לפרטים נוספים' },
    ],
  },
  // ── עדכון חד פעמי ──
  {
    id: 'update-new-number', domain: 'update', title: 'עברנו למספר וואטסאפ חדש',
    body: 'שלום {{name}}, עדכון חד פעמי: מעכשיו אנחנו זמינים בוואטסאפ במספר הזה.\nאפשר לשמור אותו ולפנות אלינו בכל שאלה. תודה שאתם איתנו.',
    buttons: [
      { type: 'QUICK_REPLY', text: 'קיבלתי, תודה', autoReply: 'תודה! שמרנו אותך ונשמח לעמוד לשירותך 🙏' },
    ],
  },
  {
    id: 'update-address', domain: 'update', title: 'מעבר לכתובת חדשה / סניף חדש',
    header: 'עברנו דירה',
    body: 'שלום {{name}}, רצינו לעדכן שעברנו לכתובת חדשה, ושעות הפעילות נשארו כפי שהיו.\nנשמח לראות אתכם במקום החדש!',
    buttons: [
      { type: 'URL', text: 'לניווט לכתובת החדשה' },
      { type: 'PHONE_NUMBER', text: 'התקשרו אלינו' },
    ],
  },
  {
    id: 'update-closure', domain: 'update', title: 'שינוי חריג / סגירה זמנית',
    body: 'שלום {{name}}, רצינו לעדכן אותך על שינוי חד פעמי: בתאריך {{date}} נהיה סגורים או נפעל בשעות מצומצמות.\nמתנצלים על אי הנוחות, ונחזור לפעילות רגילה מיד לאחר מכן.',
    buttons: [
      { type: 'QUICK_REPLY', text: 'קיבלתי, תודה', autoReply: 'תודה על ההבנה! נשמח לראותך בחזרה בפעילות הרגילה 🙏' },
      { type: 'PHONE_NUMBER', text: 'צרו קשר' },
    ],
  },
  {
    id: 'update-launch', domain: 'update', title: 'השקה / פתיחת עסק או מוצר חדש',
    header: 'חדש אצלנו',
    body: 'היי {{name}}, יש לנו חדשות: אנחנו משיקים {{product}}.\nרצינו שתהיו הראשונים לדעת. לפרטים נוספים לחצו על הכפתור.',
    buttons: [
      { type: 'URL', text: 'לפרטים על ההשקה' },
      { type: 'QUICK_REPLY', text: 'רוצה לשמוע עוד', autoReply: 'תודה על ההתעניינות! נחזור אליך כאן בקרוב עם כל הפרטים 🙏' },
    ],
  },
  // ── אירוע / מבצע חד פעמי ──
  {
    id: 'event-sale', domain: 'event', title: 'מבצע חד פעמי ולזמן מוגבל',
    header: 'מבצע חד פעמי',
    body: 'היי {{name}}, מבצע חד פעמי ולזמן מוגבל: *{{product}}* בהנחה מיוחדת.\nהמבצע בתוקף עד {{date}} בלבד, או עד גמר המלאי.',
    buttons: [
      { type: 'URL', text: 'למימוש המבצע' },
      { type: 'QUICK_REPLY', text: 'רוצה פרטים', autoReply: 'תודה על ההתעניינות! נחזור אליך כאן בקרוב עם כל פרטי המבצע 🙏' },
    ],
  },
  {
    id: 'event-invite', domain: 'event', title: 'הזמנה לאירוע חד פעמי',
    header: 'מוזמנים לאירוע',
    body: 'שלום {{name}}, אנחנו מזמינים אותך לאירוע מיוחד שיתקיים בתאריך {{date}} בשעה {{time}}.\nמספר המקומות מוגבל, ולכן כדאי לאשר הגעה מראש.',
    buttons: [
      { type: 'QUICK_REPLY', text: 'מאשר הגעה', autoReply: 'מעולה, רשמנו אותך! נשלח פרטים נוספים סמוך למועד 🎉' },
      { type: 'QUICK_REPLY', text: 'לא אוכל להגיע', autoReply: 'חבל, תודה שעדכנת! נשמח לראותך באירוע הבא 🙏' },
      { type: 'URL', text: 'לפרטי האירוע' },
    ],
  },
  {
    id: 'event-webinar', domain: 'event', title: 'הרשמה למפגש / הרצאה חד פעמית',
    body: 'היי {{name}}, אנחנו מארגנים מפגש מיוחד בתאריך {{date}} בשעה {{time}}, בהשתתפות חינם.\nההרשמה פתוחה למספר מוגבל של משתתפים.',
    buttons: [
      { type: 'URL', text: 'להרשמה' },
      { type: 'QUICK_REPLY', text: 'רוצה פרטים', autoReply: 'תודה על ההתעניינות! נשלח לך כאן את כל הפרטים על המפגש 🙏' },
    ],
  },
  {
    id: 'event-opening', domain: 'event', title: 'פתיחה חגיגית / יום פתוח',
    header: 'פתיחה חגיגית',
    body: 'שלום {{name}}, בתאריך {{date}} נקיים פתיחה חגיגית, עם הטבות מיוחדות לכל מי שמגיע.\nנשמח לראות אתכם ולחגוג יחד.',
    buttons: [
      { type: 'QUICK_REPLY', text: 'מגיע בשמחה', autoReply: 'איזה כיף! רשמנו אותך ונשמח לראותך 🎉' },
      { type: 'URL', text: 'להגעה ולפרטים' },
    ],
  },
  // ── בקשה / סקר חד פעמי ──
  {
    id: 'req-join', domain: 'request', title: 'בקשה להצטרף / רשימת המתנה',
    body: 'שלום {{name}}, פתחנו הרשמה ראשונית ל{{product}}, והמקומות מוגבלים.\nמי שרוצה להירשם ברשימה מוזמן ללחוץ על הכפתור, ונחזור אליו עם כל הפרטים.',
    buttons: [
      { type: 'QUICK_REPLY', text: 'רושם אותי', autoReply: 'מעולה, רשמנו אותך ברשימה! נחזור אליך כאן בקרוב עם כל הפרטים 🙏' },
      { type: 'URL', text: 'לפרטים נוספים' },
    ],
  },
  {
    id: 'req-survey', domain: 'request', title: 'סקר קצר חד פעמי',
    body: 'היי {{name}}, נשמח לשמוע את דעתך בסקר קצר שלוקח פחות מדקה.\nהתשובות שלך יעזרו לנו להתאים את השירות בדיוק בשבילך. תודה מראש!',
    buttons: [
      { type: 'URL', text: 'למענה על הסקר' },
    ],
  },
  {
    id: 'req-donation', domain: 'request', title: 'בקשת תרומה / התנדבות חד פעמית',
    header: 'מבקשים את עזרתכם',
    body: 'שלום {{name}}, אנחנו יוצאים ביוזמה חד פעמית ונשמח לעזרתכם: תרומה או התנדבות ביום {{date}}.\nכל תרומה, גם קטנה, עושה הבדל גדול. תודה מכל הלב.',
    buttons: [
      { type: 'QUICK_REPLY', text: 'רוצה להתנדב', autoReply: 'תודה רבה על הרצון לעזור! ניצור איתך קשר בקרוב עם כל הפרטים 🙏' },
      { type: 'URL', text: 'לתרומה' },
    ],
  },
];

// concept → how to find a column for it, and what to use when the customer's file has none
const CONCEPTS = {
  name: { rx: /שם|name|לקוח|customer|contact/i, prefer: /פרטי|first/i, fallback: 'לקוח/ה יקר/ה', literal: 'לקוח/ה יקר/ה' },
  date: { rx: /תאריך|date|יום|day/i, fallback: 'בקרוב', literal: '[תאריך]' },
  time: { rx: /שעה|time|hour/i, fallback: 'השעה שנקבעה', literal: '[שעה]' },
  product: { rx: /מוצר|פריט|דגם|שירות|טיפול|product|item|model|service|treatment/i, fallback: 'המוצרים שבחרתם', literal: '[שם המוצר או השירות]' },
};

/**
 * Turns a library template into editor state for the customer's file.
 * Returns { spec: {headerType, header, headerMedia: null, body, buttons}, fallbacks, placeholders: [string] }.
 */
export function applyLibraryTemplate(tpl, headers, newButton) {
  const fallbacks = {};
  const placeholders = [];
  const body = tpl.body.replace(/\{\{(\w+)\}\}/g, (m, key) => {
    const c = CONCEPTS[key];
    if (!c) return m;
    const cands = headers.filter((h) => c.rx.test(h));
    const col = (c.prefer && cands.find((h) => c.prefer.test(h))) || cands.sort((a, b) => a.length - b.length)[0];
    if (col) {
      fallbacks[col] = fallbacks[col] || c.fallback;
      return `{{${col}}}`;
    }
    if (c.literal.startsWith('[')) placeholders.push(c.literal);
    return c.literal;
  });
  return {
    spec: {
      headerType: tpl.header ? 'TEXT' : 'NONE',
      header: tpl.header || '',
      headerMedia: null,
      body,
      buttons: (tpl.buttons || []).map((b) => newButton(b.type, b.text, b.autoReply || '')),
    },
    fallbacks,
    placeholders: Array.from(new Set(placeholders)),
  };
}
