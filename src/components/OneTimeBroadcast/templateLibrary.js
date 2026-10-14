/*
 * Ready-made WhatsApp templates for the one-time broadcast wizard, grouped by business domain.
 *
 * Bodies use concept tokens — {{name}} {{date}} {{time}} {{amount}} {{product}} — which applyLibraryTemplate() maps to
 * the customer's Excel columns by header synonyms. A concept with no matching column becomes plain text instead
 * (the name falls back to "לקוח/ה יקר/ה"; the others become a [placeholder] the customer must complete — the wizard
 * blocks the order until no [placeholder] is left). Link / call buttons come without an address on purpose: the
 * customer fills in their own.
 */

export const LIB_DOMAINS = [
  { id: 'food', label: 'מסעדות וקפה', icon: '🍽️' },
  { id: 'beauty', label: 'יופי וספא', icon: '💅' },
  { id: 'retail', label: 'קמעונאות ואופנה', icon: '🛍️' },
  { id: 'realestate', label: 'נדל״ן', icon: '🏠' },
  { id: 'health', label: 'בריאות ורפואה', icon: '🩺' },
  { id: 'fitness', label: 'כושר ופנאי', icon: '🏋️' },
  { id: 'services', label: 'שירותים מקצועיים', icon: '💼' },
  { id: 'events', label: 'אירועים והדרכות', icon: '🎟️' },
  { id: 'auto', label: 'רכב ושירותי בית', icon: '🚗' },
  { id: 'general', label: 'כללי', icon: '✨' },
];

export const LIB_TEMPLATES = [
  // ── מסעדות וקפה ──
  {
    id: 'food-reservation', domain: 'food', title: 'תזכורת להזמנת שולחן',
    header: 'תזכורת להזמנה',
    body: 'שלום {{name}},\nמזכירים לכם שהזמנתם שולחן אצלנו בתאריך {{date}} בשעה {{time}}.\nנשמח לראות אתכם! אם צריך לשנות או לבטל, לחצו על הכפתור ונחזור אליכם.',
    buttons: [{ type: 'QUICK_REPLY', text: 'שינוי או ביטול' }, { type: 'URL', text: 'לתפריט' }],
  },
  {
    id: 'food-promo', domain: 'food', title: 'מבצע / ארוחה עסקית',
    header: 'מיוחד בשבילכם',
    body: 'היי {{name}}, השבוע מחכה לכם אצלנו הטבה מיוחדת ללקוחות קבועים: *{{product}}* במחיר מיוחד.\nההטבה בתוקף עד סוף החודש. מזמינים שולחן ובאים ליהנות.',
    buttons: [{ type: 'PHONE_NUMBER', text: 'הזמנת שולחן' }, { type: 'URL', text: 'לתפריט המלא' }],
  },
  {
    id: 'food-delivery', domain: 'food', title: 'עדכון משלוח',
    body: 'שלום {{name}}, ההזמנה שלכם בדרך אליכם ותגיע בשעה {{time}} בערך.\nתודה שבחרתם בנו ובתיאבון!',
    buttons: [{ type: 'PHONE_NUMBER', text: 'התקשרו אלינו' }],
  },
  // ── יופי וספא ──
  {
    id: 'beauty-reminder', domain: 'beauty', title: 'תזכורת לתור',
    header: 'תזכורת לתור שלך',
    body: 'שלום {{name}},\nמזכירים לך שנקבע לך תור בתאריך {{date}} בשעה {{time}}.\nמחכות לך! לשינוי או ביטול התור לחצי על הכפתור.',
    buttons: [{ type: 'QUICK_REPLY', text: 'מאשרת הגעה' }, { type: 'QUICK_REPLY', text: 'שינוי או ביטול' }],
  },
  {
    id: 'beauty-return', domain: 'beauty', title: 'חזרה אחרי זמן (לקוחות רדומים)',
    body: 'היי {{name}}, עבר כבר זמן מאז הביקור האחרון שלך אצלנו ומתגעגעים!\nרק עכשיו: הטבה מיוחדת של 15% על הטיפול הבא, בתוקף עד סוף החודש.\nקובעים תור?',
    buttons: [{ type: 'URL', text: 'קביעת תור' }, { type: 'QUICK_REPLY', text: 'תחזרו אליי' }],
  },
  {
    id: 'beauty-gift', domain: 'beauty', title: 'מבצע / שובר מתנה',
    header: 'מתנה מיוחדת',
    body: 'שלום {{name}}, לרגל החג הכנו לך הטבה: שוברי מתנה לטיפולים במחירים מיוחדים, מושלמים למי שאוהבים להתפנק.\nהמבצע בתוקף לזמן מוגבל.',
    buttons: [{ type: 'URL', text: 'לרכישת שובר' }],
  },
  // ── קמעונאות ואופנה ──
  {
    id: 'retail-sale', domain: 'retail', title: 'מבצע לקוחות מועדון',
    header: 'מבצע למועדון הלקוחות',
    body: 'היי {{name}}, מבצע סוף עונה פתוח עכשיו ללקוחות המועדון שלנו: עד 50% הנחה על מבחר רחב.\nהמבצע בתוקף עד סוף השבוע, או עד גמר המלאי.',
    buttons: [{ type: 'URL', text: 'לצפייה במבצע' }, { type: 'QUICK_REPLY', text: 'להסרה מהמועדון' }],
  },
  {
    id: 'retail-order', domain: 'retail', title: 'עדכון הזמנה',
    body: 'שלום {{name}}, ההזמנה שלך נארזה ויצאה אליך בדרך.\nהמשלוח צפוי להגיע בתאריך {{date}}.\nתודה שקנית אצלנו!',
    buttons: [{ type: 'URL', text: 'מעקב משלוח' }],
  },
  {
    id: 'retail-cart', domain: 'retail', title: 'שכחתם משהו בעגלה',
    body: 'היי {{name}}, שמנו לב ש{{product}} נשארו בעגלה שלכם.\nשמרנו אותם בשבילכם, אבל המלאי מוגבל. אפשר להשלים את ההזמנה בלחיצה.',
    buttons: [{ type: 'URL', text: 'להשלמת ההזמנה' }],
  },
  // ── נדל״ן ──
  {
    id: 're-new-project', domain: 'realestate', title: 'פרויקט חדש לשיווק',
    header: 'פרויקט חדש',
    body: 'שלום {{name}}, יצאנו לשיווק פרויקט חדש באזור שחיפשת, עם מגוון דירות ותנאי תשלום נוחים.\nנשמח לתאם לך שיחה או סיור בשטח, ללא התחייבות.',
    buttons: [{ type: 'QUICK_REPLY', text: 'מעוניין לשמוע עוד' }, { type: 'URL', text: 'לפרטי הפרויקט' }],
  },
  {
    id: 're-tour', domain: 'realestate', title: 'תזכורת לסיור בנכס',
    body: 'שלום {{name}}, מזכירים לך שנקבע סיור בנכס בתאריך {{date}} בשעה {{time}}.\nאם צריך לשנות את המועד, אפשר לענות כאן ונתאים.',
    buttons: [{ type: 'QUICK_REPLY', text: 'מאשר הגעה' }, { type: 'PHONE_NUMBER', text: 'התקשרו אליי' }],
  },
  // ── בריאות ורפואה ──
  {
    id: 'health-appointment', domain: 'health', title: 'תזכורת לתור',
    header: 'תזכורת לתור',
    body: 'שלום {{name}}, מזכירים לך שנקבע לך תור בקליניקה בתאריך {{date}} בשעה {{time}}.\nבבקשה הגיעו כמה דקות מראש. לביטול או לשינוי, לחצו על הכפתור.',
    buttons: [{ type: 'QUICK_REPLY', text: 'מאשר הגעה' }, { type: 'QUICK_REPLY', text: 'שינוי או ביטול' }],
  },
  {
    id: 'health-checkup', domain: 'health', title: 'תזכורת לבדיקה תקופתית',
    body: 'שלום {{name}}, מזכירים שהגיע הזמן לבדיקה התקופתית שלך.\nכדאי לקבוע תור מראש כדי להבטיח זמן נוח לך. אנחנו כאן לכל שאלה.',
    buttons: [{ type: 'URL', text: 'קביעת תור' }, { type: 'PHONE_NUMBER', text: 'התקשרו למרפאה' }],
  },
  // ── כושר ופנאי ──
  {
    id: 'fit-trial', domain: 'fitness', title: 'אימון ניסיון בחינם',
    header: 'אימון ניסיון בחינם',
    body: 'היי {{name}}, רוצה להתחיל להתאמן? הזמנו אותך לאימון ניסיון ללא עלות אצלנו בסטודיו.\nמתאמנים לפי היכולת שלך, עם ליווי של המאמנים שלנו.',
    buttons: [{ type: 'URL', text: 'לקביעת אימון' }, { type: 'QUICK_REPLY', text: 'תחזרו אליי' }],
  },
  {
    id: 'fit-renewal', domain: 'fitness', title: 'חידוש מנוי',
    body: 'שלום {{name}}, המנוי שלך מסתיים בתאריך {{date}}.\nחידוש מוקדם מזכה בהטבה מיוחדת ובלי להפסיד אימונים. אפשר לחדש בלחיצה.',
    buttons: [{ type: 'URL', text: 'לחידוש המנוי' }, { type: 'QUICK_REPLY', text: 'רוצה לשמוע פרטים' }],
  },
  // ── שירותים מקצועיים ──
  {
    id: 'svc-payment', domain: 'services', title: 'תזכורת תשלום',
    body: 'שלום {{name}}, מזכירים בעדינות שקיימת יתרה לתשלום בסך {{amount}} ש״ח.\nאם כבר שילמת, אפשר להתעלם מההודעה. תודה על שיתוף הפעולה.',
    buttons: [{ type: 'URL', text: 'לתשלום' }, { type: 'PHONE_NUMBER', text: 'לבירורים' }],
  },
  {
    id: 'svc-meeting', domain: 'services', title: 'תזכורת לפגישה',
    header: 'תזכורת לפגישה',
    body: 'שלום {{name}}, מזכירים לך שנקבעה פגישה בתאריך {{date}} בשעה {{time}}.\nכדי שנוכל להתכונן, אפשר להעביר מסמכים מראש. נתראה!',
    buttons: [{ type: 'QUICK_REPLY', text: 'מאשר' }, { type: 'QUICK_REPLY', text: 'לשינוי מועד' }],
  },
  {
    id: 'svc-renewal', domain: 'services', title: 'חידוש פוליסה / חוזה',
    body: 'שלום {{name}}, הפוליסה או החוזה שלך מסתיימים בתאריך {{date}}.\nכדאי לבדוק מראש את האפשרויות ולחסוך. נשמח להכין לך הצעה מעודכנת.',
    buttons: [{ type: 'QUICK_REPLY', text: 'תכינו לי הצעה' }, { type: 'PHONE_NUMBER', text: 'התקשרו אליי' }],
  },
  // ── אירועים והדרכות ──
  {
    id: 'ev-invite', domain: 'events', title: 'הזמנה לאירוע',
    header: 'מוזמנים לאירוע',
    body: 'שלום {{name}}, אנחנו מזמינים אותך לאירוע שלנו שיתקיים בתאריך {{date}} בשעה {{time}}.\nמספר המקומות מוגבל, ולכן כדאי לאשר הגעה מראש.',
    buttons: [{ type: 'QUICK_REPLY', text: 'מאשר הגעה' }, { type: 'QUICK_REPLY', text: 'לא אוכל להגיע' }, { type: 'URL', text: 'לפרטי האירוע' }],
  },
  {
    id: 'ev-course', domain: 'events', title: 'פתיחת קורס / הרשמה',
    body: 'היי {{name}}, נפתחה ההרשמה לקורס החדש שלנו שיתחיל בתאריך {{date}}.\nההרשמה המוקדמת כוללת הטבה מיוחדת, והמקומות מוגבלים.',
    buttons: [{ type: 'URL', text: 'להרשמה' }, { type: 'QUICK_REPLY', text: 'רוצה פרטים' }],
  },
  // ── רכב ושירותי בית ──
  {
    id: 'auto-service', domain: 'auto', title: 'תזכורת לטיפול / טסט',
    header: 'הגיע הזמן לטיפול',
    body: 'שלום {{name}}, הגיע הזמן לטיפול התקופתי או לטסט של הרכב שלך.\nקבעו תור מראש ושמרו על רכב בטוח ואמין. נשמח לראותך במוסך.',
    buttons: [{ type: 'URL', text: 'קביעת תור' }, { type: 'PHONE_NUMBER', text: 'התקשרו למוסך' }],
  },
  {
    id: 'auto-visit', domain: 'auto', title: 'תיאום ביקור טכנאי',
    body: 'שלום {{name}}, הטכנאי שלנו יגיע אליך בתאריך {{date}} בין השעות שנקבעו.\nכדי להקל על העבודה, נא לוודא שיש גישה לאזור הטיפול. תודה.',
    buttons: [{ type: 'QUICK_REPLY', text: 'מאשר' }, { type: 'QUICK_REPLY', text: 'לשינוי מועד' }],
  },
  // ── כללי ──
  {
    id: 'gen-holiday', domain: 'general', title: 'ברכת חג ללקוחות',
    header: 'חג שמח',
    body: 'שלום {{name}}, לקראת החג רצינו לאחל לך ולמשפחתך חג שמח, בריאות ושנה טובה.\nתודה שאתם איתנו, ומחכים לראותכם שוב.',
    buttons: [],
  },
  {
    id: 'gen-survey', domain: 'general', title: 'משוב / סקר שביעות רצון',
    body: 'היי {{name}}, תודה שבחרת בנו! נשמח לשמוע איך היה והאם נוכל להשתפר.\nהמשוב שלך לוקח פחות מדקה ועוזר לנו מאוד.',
    buttons: [{ type: 'URL', text: 'למשוב קצר' }],
  },
  {
    id: 'gen-announce', domain: 'general', title: 'עדכון לקוחות (שעות / שינוי)',
    body: 'שלום {{name}}, רצינו לעדכן אותך על שינוי חשוב: החל מתאריך {{date}} חלו שינויים בשעות הפעילות שלנו.\nלפרטים נוספים אפשר ליצור איתנו קשר בכל עת.',
    buttons: [{ type: 'PHONE_NUMBER', text: 'צרו קשר' }, { type: 'URL', text: 'לפרטים' }],
  },
];

// concept → how to find a column for it, and what to use when the customer's file has none
const CONCEPTS = {
  name: { rx: /שם|name|לקוח|customer|contact/i, prefer: /פרטי|first/i, fallback: 'לקוח/ה יקר/ה', literal: 'לקוח/ה יקר/ה' },
  date: { rx: /תאריך|date|יום|day/i, fallback: 'בקרוב', literal: '[תאריך]' },
  time: { rx: /שעה|time|hour/i, fallback: 'השעה שנקבעה', literal: '[שעה]' },
  amount: { rx: /סכום|מחיר|תשלום|חוב|יתרה|amount|price|total|sum|balance/i, fallback: '0', literal: '[סכום]' },
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
      buttons: (tpl.buttons || []).map((b) => newButton(b.type, b.text)),
    },
    fallbacks,
    placeholders: Array.from(new Set(placeholders)),
  };
}
