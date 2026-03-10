'use client';
import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import './WhatsAppMessagingPricing.css';

const pricingData = [
  { country: "Afghanistan", iso: "AF", marketing: 0.0915, utility: 0.015255, authentication: 0.015255 },
  { country: "Albania", iso: "AL", marketing: 0.1075, utility: 0.02862, authentication: 0.02862 },
  { country: "Algeria", iso: "DZ", marketing: 0.028125, utility: 0.0054, authentication: 0.0054 },
  { country: "Argentina", iso: "AR", marketing: 0.07725, utility: 0.0338, authentication: 0.0338 },
  { country: "Australia", iso: "AU", marketing: 0.0915, utility: 0.015255, authentication: 0.015255 },
  { country: "Austria", iso: "AT", marketing: 0.074, utility: 0.023085, authentication: 0.023085 },
  { country: "Bahrain", iso: "BH", marketing: 0.042625, utility: 0.012285, authentication: 0.012285 },
  { country: "Bangladesh", iso: "BD", marketing: 0.0915, utility: 0.015255, authentication: 0.015255 },
  { country: "Belgium", iso: "BE", marketing: 0.074, utility: 0.023085, authentication: 0.023085 },
  { country: "Bolivia", iso: "BO", marketing: 0.0925, utility: 0.015255, authentication: 0.015255 },
  { country: "Brazil", iso: "BR", marketing: 0.078125, utility: 0.00918, authentication: 0.00918 },
  { country: "Bulgaria", iso: "BG", marketing: 0.1075, utility: 0.02862, authentication: 0.02862 },
  { country: "Canada", iso: "CA", marketing: 0.03125, utility: 0.0054, authentication: 0.0054 },
  { country: "Chile", iso: "CL", marketing: 0.111125, utility: 0.027, authentication: 0.027 },
  { country: "China", iso: "CN", marketing: 0.0915, utility: 0.015255, authentication: 0.015255 },
  { country: "Colombia", iso: "CO", marketing: 0.015625, utility: 0.00104, authentication: 0.00104 },
  { country: "Costa Rica", iso: "CR", marketing: 0.0925, utility: 0.015255, authentication: 0.015255 },
  { country: "Croatia", iso: "HR", marketing: 0.1075, utility: 0.02862, authentication: 0.02862 },
  { country: "Czech Republic", iso: "CZ", marketing: 0.1075, utility: 0.02862, authentication: 0.02862 },
  { country: "Denmark", iso: "DK", marketing: 0.074, utility: 0.023085, authentication: 0.023085 },
  { country: "Ecuador", iso: "EC", marketing: 0.0925, utility: 0.015255, authentication: 0.015255 },
  { country: "Egypt", iso: "EG", marketing: 0.134125, utility: 0.00468, authentication: 0.00468 },
  { country: "Finland", iso: "FI", marketing: 0.074, utility: 0.023085, authentication: 0.023085 },
  { country: "France", iso: "FR", marketing: 0.179, utility: 0.0405, authentication: 0.0405 },
  { country: "Germany", iso: "DE", marketing: 0.170625, utility: 0.07425, authentication: 0.07425 },
  { country: "Ghana", iso: "GH", marketing: 0.028125, utility: 0.0054, authentication: 0.0054 },
  { country: "Greece", iso: "GR", marketing: 0.1075, utility: 0.02862, authentication: 0.02862 },
  { country: "Guatemala", iso: "GT", marketing: 0.0925, utility: 0.015255, authentication: 0.015255 },
  { country: "Honduras", iso: "HN", marketing: 0.0925, utility: 0.015255, authentication: 0.015255 },
  { country: "Hong Kong", iso: "HK", marketing: 0.0915, utility: 0.015255, authentication: 0.015255 },
  { country: "Hungary", iso: "HU", marketing: 0.1075, utility: 0.02862, authentication: 0.02862 },
  { country: "India", iso: "IN", marketing: 0.013375, utility: 0.00189, authentication: 0.00189 },
  { country: "Indonesia", iso: "ID", marketing: 0.051375, utility: 0.03375, authentication: 0.03375 },
  { country: "Iraq", iso: "IQ", marketing: 0.042625, utility: 0.012285, authentication: 0.012285 },
  { country: "Ireland", iso: "IE", marketing: 0.074, utility: 0.023085, authentication: 0.023085 },
  { country: "Israel", iso: "IL", marketing: 0.0442, utility: 0.0067, authentication: 0.0067 },
  { country: "Italy", iso: "IT", marketing: 0.086375, utility: 0.0405, authentication: 0.0405 },
  { country: "Japan", iso: "JP", marketing: 0.0915, utility: 0.015255, authentication: 0.015255 },
  { country: "Jordan", iso: "JO", marketing: 0.042625, utility: 0.012285, authentication: 0.012285 },
  { country: "Kenya", iso: "KE", marketing: 0.028125, utility: 0.0054, authentication: 0.0054 },
  { country: "Kuwait", iso: "KW", marketing: 0.042625, utility: 0.012285, authentication: 0.012285 },
  { country: "Lebanon", iso: "LB", marketing: 0.042625, utility: 0.012285, authentication: 0.012285 },
  { country: "Malaysia", iso: "MY", marketing: 0.1075, utility: 0.0189, authentication: 0.0189 },
  { country: "Mexico", iso: "MX", marketing: 0.038125, utility: 0.011475, authentication: 0.011475 },
  { country: "Morocco", iso: "MA", marketing: 0.028125, utility: 0.0054, authentication: 0.0054 },
  { country: "Netherlands", iso: "NL", marketing: 0.199625, utility: 0.0675, authentication: 0.0675 },
  { country: "New Zealand", iso: "NZ", marketing: 0.0915, utility: 0.015255, authentication: 0.015255 },
  { country: "Nigeria", iso: "NG", marketing: 0.0645, utility: 0.009045, authentication: 0.009045 },
  { country: "Norway", iso: "NO", marketing: 0.074, utility: 0.023085, authentication: 0.023085 },
  { country: "Oman", iso: "OM", marketing: 0.042625, utility: 0.012285, authentication: 0.012285 },
  { country: "Other", iso: "XX", marketing: 0.0755, utility: 0.010395, authentication: 0.010395 },
  { country: "Pakistan", iso: "PK", marketing: 0.059125, utility: 0.00729, authentication: 0.00729 },
  { country: "Peru", iso: "PE", marketing: 0.087875, utility: 0.027, authentication: 0.027 },
  { country: "Philippines", iso: "PH", marketing: 0.0915, utility: 0.015255, authentication: 0.015255 },
  { country: "Poland", iso: "PL", marketing: 0.1075, utility: 0.02862, authentication: 0.02862 },
  { country: "Portugal", iso: "PT", marketing: 0.074, utility: 0.023085, authentication: 0.023085 },
  { country: "Qatar", iso: "QA", marketing: 0.042625, utility: 0.012285, authentication: 0.012285 },
  { country: "Romania", iso: "RO", marketing: 0.1075, utility: 0.02862, authentication: 0.02862 },
  { country: "Russia", iso: "RU", marketing: 0.10025, utility: 0.054, authentication: 0.054 },
  { country: "Saudi Arabia", iso: "SA", marketing: 0.056875, utility: 0.01391, authentication: 0.01391 },
  { country: "Singapore", iso: "SG", marketing: 0.0915, utility: 0.015255, authentication: 0.015255 },
  { country: "South Africa", iso: "ZA", marketing: 0.047375, utility: 0.01026, authentication: 0.01026 },
  { country: "South Korea", iso: "KR", marketing: 0.0755, utility: 0.010395, authentication: 0.010395 },
  { country: "Spain", iso: "ES", marketing: 0.076875, utility: 0.027, authentication: 0.027 },
  { country: "Sri Lanka", iso: "LK", marketing: 0.0915, utility: 0.015255, authentication: 0.015255 },
  { country: "Sweden", iso: "SE", marketing: 0.074, utility: 0.023085, authentication: 0.023085 },
  { country: "Switzerland", iso: "CH", marketing: 0.074, utility: 0.023085, authentication: 0.023085 },
  { country: "Taiwan", iso: "TW", marketing: 0.0915, utility: 0.015255, authentication: 0.015255 },
  { country: "Thailand", iso: "TH", marketing: 0.0915, utility: 0.015255, authentication: 0.015255 },
  { country: "Tunisia", iso: "TN", marketing: 0.028125, utility: 0.0054, authentication: 0.0054 },
  { country: "Turkey", iso: "TR", marketing: 0.013625, utility: 0.007155, authentication: 0.007155 },
  { country: "Ukraine", iso: "UA", marketing: 0.1075, utility: 0.02862, authentication: 0.02862 },
  { country: "United Arab Emirates", iso: "AE", marketing: 0.062375, utility: 0.021195, authentication: 0.021195 },
  { country: "United Kingdom", iso: "GB", marketing: 0.066125, utility: 0.0297, authentication: 0.0297 },
  { country: "United States", iso: "US", marketing: 0.03125, utility: 0.0054, authentication: 0.0054 },
  { country: "Uruguay", iso: "UY", marketing: 0.0925, utility: 0.015255, authentication: 0.015255 },
  { country: "Venezuela", iso: "VE", marketing: 0.0925, utility: 0.015255, authentication: 0.015255 },
  { country: "Vietnam", iso: "VN", marketing: 0.0915, utility: 0.015255, authentication: 0.015255 },
  { country: "Yemen", iso: "YE", marketing: 0.042625, utility: 0.012285, authentication: 0.012285 },
  { country: "Zimbabwe", iso: "ZW", marketing: 0.028125, utility: 0.0052, authentication: 0.0052 },
];

const TX = {
  he: {
    badge: 'מדריך מקצועי',
    title: 'מדריך תמחור WhatsApp Business API',
    subtitle: 'כל מה שצריך לדעת על עלויות הודעות',
    introText: 'WhatsApp Business API מבוסס על מודל תשלום לפי הודעה. המדריך הזה יעזור לכם להבין את מבנה התמחור ולתכנן את התקציב שלכם בהתאם.',
    howWorksTitle: 'איך עובד תמחור הודעות ב-WhatsApp Business API?',
    howWorksContent: 'WhatsApp מחייבת לפי כל הודעה שנשלחת, בהתאם למדינה ולסוג ההודעה (שיווק, שירות, אימות). כל הודעה שאתם שולחים ללקוח מחויבת בנפרד לפי מחירון מטא.',
    importantLabel: 'חשוב לדעת:',
    freeWindowText: 'אם הלקוח יוזם שיחה ושולח הודעה ראשון – נפתח חלון שירות חינמי של 24 שעות, במהלכו תוכלו לשלוח לו הודעות ללא עלות.',
    msgTypesTitle: 'סוגי הודעות',
    marketing: 'הודעת שיווק (Marketing)',
    marketingDesc: 'הודעות שיווקיות, קידום מכירות, מבצעים והצעות. בדרך כלל הכי יקרות.',
    service: 'הודעת שירות (Service)',
    serviceDesc: 'הודעות שנשלחות בתגובה ללקוח בתוך חלון 24 שעות – בדרך כלל חינמיות!',
    utility: 'אימות ושירות (Authentication & Utility)',
    utilityDesc: 'קטגוריות ייחודיות עבור קודי אימות (OTP), עדכוני הזמנות, אישורים ועדכונים תפעוליים.',
    whenPayTitle: 'מתי משלמים?',
    whenPayContent: 'תשלום נגבה עבור כל הודעה שנשלחת מחוץ לחלון שירות של 24 שעות. אם הלקוח פנה אליכם והגבתם תוך 24 שעות - ההודעה חינמית. אם אתם פותחים שיחה חדשה עם תבנית שיווקית - תחויבו לפי סוג ההודעה והמדינה.',
    whyTitle: 'למה זה חשוב לעסק שלך?',
    timeMgmt: 'ניהול זמנים',
    timeMgmtDesc: 'ניצול חלון 24 השעות לשליחת מספר הודעות ללא תשלום נוסף.',
    smartPlan: 'תכנון חכם',
    smartPlanDesc: 'תכנון קמפיינים בצורה חכמה – בחירת סוג ההודעה הנכון לכל מטרה.',
    budgetCtrl: 'בקרת תקציב',
    budgetCtrlDesc: 'בקרה על תקציב – הבנה מתי נגבה תשלום עבור הודעה.',
    tipTitle: 'טיפ מהמקצוענים',
    tipContent: 'מערכת Gambot מזהה אוטומטית את מחירי ההודעות לפי מדינה, ומציעה לכם את הדרך החסכונית ביותר לשלוח הודעות ללקוחות.',
    moreInfoTitle: 'מידע נוסף',
    metaLink: 'תיעוד רשמי של מטא',
    metaLinkDesc: 'לפרטים המלאים והמעודכנים ישירות מאתר מטא – כולל מחירים לפי מדינות וקטגוריות',
    metaLinkText: 'המאמר הרשמי על תמחור WhatsApp API',
    fullTableLabel: 'מחירון מלא לפי מדינות',
    fullTableDesc: 'צפו בטבלת המחירים המלאה של WhatsApp API לפי מדינה וסוג הודעה',
    fullTableBtn: 'צפה במחירון המלא',
    summaryTitle: 'לסיכום',
    summaryContent: 'תמחור לפי הודעה ב-WhatsApp API מעניק שקיפות מלאה, אך דורש תכנון חכם. הבנה מעמיקה של מחירי ההודעות לפי מדינה וסוג תעזור לכם לנצל את המערכת בצורה חסכונית יותר – ולמקסם החזר על השקעה בקמפיינים שיווקיים.',
    calcTitle: 'מחשבון תמחור WhatsApp',
    calcDesc: 'השתמשו במחשבון שלנו כדי לחשב את העלות המדויקת לפי המדינה וסוג ההודעה',
    noticeLabel: 'הערה חשובה:',
    noticeText: 'המחירים המוצגים כאן הם עבור הודעות יזומות (Template Outbound Messages) בלבד. הודעות שנשלחות בתגובה ללקוח בתוך חלון 24 שעות הן חינמיות.',
    noticeExp: 'לרוב שיחה תיפתח באמצעות פניה יזומה של הלקוח (חינמית) או באמצעות שליחת טמפלט בתשלום. לאחר פתיחת השיחה, שאר ההתכתבות הן הודעות רגילות חינמיות בתוך חלון 24 שעות.',
    selectCountry: 'בחרו מדינה:',
    selectCategory: 'בחרו קטגוריית הודעה:',
    selectMessages: 'מספר הודעות לחודש:',
    catMarketing: 'שיווק (Marketing)',
    catUtility: 'שירות (Utility)',
    catAuth: 'אימות (Authentication)',
    perMsg: 'מחיר להודעה:',
    total: 'סה"כ לחודש:',
    forMessages: 'הודעות',
    ctaTitle: 'רוצים לנהל את שיחות ה-WhatsApp שלכם בצורה חכמה?',
    ctaDesc: 'הצטרפו לגמבוט – מערכת לניהול אוטומציות, קמפיינים, ושירות לקוחות ב-WhatsApp API.',
    ctaF1: 'ניהול אוטומטי של שיחות',
    ctaF2: 'חיסכון בעלויות תמחור',
    ctaF3: 'מערכת מתקדמת לקמפיינים',
    ctaBtn: 'בקרו באתר שלנו',
    roiTitle: '📊 WhatsApp vs SMS vs אימייל — השוואת ROI אמיתית',
    roiSubtitle: 'מחיר ההודעה הוא רק חלק מהתמונה. הנה מה שבאמת משפיע על הרווחיות שלכם:',
    roiWhatsApp: 'WhatsApp',
    roiSMS: 'SMS',
    roiEmail: 'אימייל',
    roiCostLabel: 'עלות להודעה (ישראל)',
    roiCostWA: '~$0.044',
    roiCostSMS: '~$0.05–0.15',
    roiCostEmail: '~$0.001–0.003',
    roiOpenLabel: 'אחוז פתיחה',
    roiOpenWA: '98%',
    roiOpenSMS: '35%',
    roiOpenEmail: '20–25%',
    roiResponseLabel: 'אחוז מענה / מעורבות',
    roiResponseWA: '40–60%',
    roiResponseSMS: '10–15%',
    roiResponseEmail: '5–10%',
    roiCTRLabel: 'אחוז קליק (CTR)',
    roiCTRWA: '60–80%',
    roiCTRSMS: '15–20%',
    roiCTREmail: '2–5%',
    roiInteractiveLabel: 'אינטרקטיביות (בוט / שיחה)',
    roiInteractiveWA: '✅ מלאה — בוט AI, שאלות, קבלת מידע',
    roiInteractiveSMS: '❌ חד-כיווני',
    roiInteractiveEmail: '❌ חד-כיווני',
    roiLandingLabel: 'צורך בדף נחיתה',
    roiLandingWA: '❌ לא נדרש',
    roiLandingSMS: '⚠️ כן — עלויות פיתוח + אחסון',
    roiLandingEmail: '⚠️ כן — עלויות פיתוח + אחסון',
    roiConversionLabel: 'אחוז המרה ממוצע',
    roiConversionWA: '15–25%',
    roiConversionSMS: '2–5%',
    roiConversionEmail: '1–3%',
    roiInsightTitle: '💡 למה WhatsApp מנצח בROI למרות המחיר הגבוה יותר?',
    roiInsight1: 'בוט AI ב-WhatsApp אוסף מידע, מסנן לידים ומקדם ישירות בתוך הצ\'אט — ללא דף נחיתה',
    roiInsight2: 'SMS ואימייל מכוונים לדף נחיתה עם המרה של 2–5% בלבד — עלות נסתרת עצומה',
    roiInsight3: 'ב-WhatsApp הלקוח מגיב, שואל ומשלים קנייה בזמן אמת — ב-SMS הוא בדרך כלל מתעלם',
    roiInsight4: '98% שיעור פתיחה לעומת 20–35% — פשוט יותר אנשים רואים את ההודעה',
    roiInsight5: 'הכל בוואטסאפ: שאלון, הצעת מחיר, חתימה דיגיטלית, תשלום — ב-SMS צריך שלבים רבים',
    roiExampleTitle: '🔢 דוגמת חישוב: 1,000 הודעות שיווקיות',
    roiExWALabel: 'WhatsApp (ישראל)',
    roiExWACost: 'עלות: ~$44',
    roiExWALeads: 'לידים משוערים: 150–250',
    roiExWACPL: 'עלות ליד: ~$0.18–0.29',
    roiExSMSLabel: 'SMS',
    roiExSMSCost: 'עלות: ~$75–150 + דף נחיתה',
    roiExSMSLeads: 'לידים משוערים: 20–50',
    roiExSMSCPL: 'עלות ליד: ~$3–7',
    roiExEmailLabel: 'אימייל',
    roiExEmailCost: 'עלות: ~$1–3 + דף נחיתה',
    roiExEmailLeads: 'לידים משוערים: 10–30',
    roiExEmailCPL: 'עלות ליד: ~$0.10–0.30 (אבל אחוז סגירה נמוך בהרבה)',
    roiConclusion: 'המסקנה: WhatsApp עולה קצת יותר להודעה, אבל ה-ROI גבוה פי 5–15 בשל האינטרקטיביות, שיעורי ההמרה הגבוהים וחיסכון בעלויות דפי נחיתה.',
  },
  en: {
    badge: 'Professional Guide',
    title: 'WhatsApp Business API Pricing Guide',
    subtitle: 'Everything you need to know about message costs',
    introText: 'WhatsApp Business API is based on a per-message payment model. This guide will help you understand the pricing structure and plan your budget accordingly.',
    howWorksTitle: 'How does WhatsApp Business API message pricing work?',
    howWorksContent: 'WhatsApp charges per message sent, based on the country and message type (marketing, service, authentication). Every message you send to a customer is charged separately according to Meta\'s pricing.',
    importantLabel: 'Important:',
    freeWindowText: 'If a customer initiates a conversation and sends the first message – a free 24-hour service window opens, during which you can send messages at no cost.',
    msgTypesTitle: 'Message Types',
    marketing: 'Marketing Message',
    marketingDesc: 'Marketing messages, promotions, offers and deals. Usually the most expensive.',
    service: 'Service Message',
    serviceDesc: 'Messages sent in response to a customer within a 24-hour window – usually free!',
    utility: 'Authentication & Utility',
    utilityDesc: 'Specific categories for OTP codes, order updates, confirmations and operational updates.',
    whenPayTitle: 'When do you pay?',
    whenPayContent: 'Payment is charged for every message sent outside the 24-hour service window. If a customer contacted you and you responded within 24 hours - the message is free. If you open a new conversation with a marketing template - you\'re charged by message type and country.',
    whyTitle: 'Why does this matter for your business?',
    timeMgmt: 'Time Management',
    timeMgmtDesc: 'Utilize the 24-hour window to send multiple messages without additional charges.',
    smartPlan: 'Smart Planning',
    smartPlanDesc: 'Plan campaigns smartly – choosing the right message type for each goal.',
    budgetCtrl: 'Budget Control',
    budgetCtrlDesc: 'Budget control – understanding when a message fee is charged.',
    tipTitle: 'Pro Tip',
    tipContent: 'Gambot automatically identifies message prices by country, offering you the most cost-effective way to send messages to customers.',
    moreInfoTitle: 'More Information',
    metaLink: 'Official Meta Documentation',
    metaLinkDesc: 'Full and up-to-date details directly from Meta\'s website – including prices by country and category',
    metaLinkText: 'Official WhatsApp API Pricing Article',
    fullTableLabel: 'Full Pricing by Country',
    fullTableDesc: 'View the complete WhatsApp API pricing table by country and message type',
    fullTableBtn: 'View Full Pricing Table',
    summaryTitle: 'Summary',
    summaryContent: 'Per-message pricing in WhatsApp API provides full transparency but requires smart planning. A deep understanding of message prices by country and type will help you use the system more economically – and maximize ROI on marketing campaigns.',
    calcTitle: 'WhatsApp Pricing Calculator',
    calcDesc: 'Use our calculator to estimate the exact cost by country and message type',
    noticeLabel: 'Important Note:',
    noticeText: 'Prices shown here are for Template Outbound Messages only. Messages sent in response to a customer within the 24-hour window are free.',
    noticeExp: 'Typically, a conversation starts through a customer-initiated contact (free) or by sending a paid template. After opening the conversation, the rest of the messages are regular free messages within the 24-hour window.',
    selectCountry: 'Select Country:',
    selectCategory: 'Select Message Category:',
    selectMessages: 'Messages per Month:',
    catMarketing: 'Marketing',
    catUtility: 'Utility (Service)',
    catAuth: 'Authentication',
    perMsg: 'Price per message:',
    total: 'Total per month:',
    forMessages: 'messages',
    ctaTitle: 'Want to manage your WhatsApp conversations intelligently?',
    ctaDesc: 'Join Gambot – a system for managing automations, campaigns, and customer service on WhatsApp API.',
    ctaF1: 'Automatic conversation management',
    ctaF2: 'Cost savings on pricing',
    ctaF3: 'Advanced campaign system',
    ctaBtn: 'Visit our website',
    roiTitle: '📊 WhatsApp vs SMS vs Email — Real ROI Comparison',
    roiSubtitle: 'Message price is only part of the picture. Here\'s what truly impacts your profitability:',
    roiWhatsApp: 'WhatsApp',
    roiSMS: 'SMS',
    roiEmail: 'Email',
    roiCostLabel: 'Cost per message (Israel)',
    roiCostWA: '~$0.044',
    roiCostSMS: '~$0.05–0.15',
    roiCostEmail: '~$0.001–0.003',
    roiOpenLabel: 'Open Rate',
    roiOpenWA: '98%',
    roiOpenSMS: '35%',
    roiOpenEmail: '20–25%',
    roiResponseLabel: 'Response / Engagement Rate',
    roiResponseWA: '40–60%',
    roiResponseSMS: '10–15%',
    roiResponseEmail: '5–10%',
    roiCTRLabel: 'Click-Through Rate (CTR)',
    roiCTRWA: '60–80%',
    roiCTRSMS: '15–20%',
    roiCTREmail: '2–5%',
    roiInteractiveLabel: 'Interactivity (Bot / Conversation)',
    roiInteractiveWA: '✅ Full — AI bot, questions, data collection',
    roiInteractiveSMS: '❌ One-way only',
    roiInteractiveEmail: '❌ One-way only',
    roiLandingLabel: 'Requires Landing Page',
    roiLandingWA: '❌ Not needed',
    roiLandingSMS: '⚠️ Yes — dev + hosting costs',
    roiLandingEmail: '⚠️ Yes — dev + hosting costs',
    roiConversionLabel: 'Average Conversion Rate',
    roiConversionWA: '15–25%',
    roiConversionSMS: '2–5%',
    roiConversionEmail: '1–3%',
    roiInsightTitle: '💡 Why does WhatsApp win on ROI despite higher cost per message?',
    roiInsight1: 'WhatsApp AI bots collect data, qualify leads and convert — all inside the chat, no landing page needed',
    roiInsight2: 'SMS and Email drive to a landing page with only 2–5% conversion — a massive hidden cost',
    roiInsight3: 'On WhatsApp, customers respond, ask questions and complete purchases in real time — SMS users typically ignore',
    roiInsight4: '98% open rate vs 20–35% — more people simply see your message',
    roiInsight5: 'Everything on WhatsApp: questionnaire, quote, digital signature, payment — SMS requires many separate steps',
    roiExampleTitle: '🔢 Example: 1,000 Marketing Messages',
    roiExWALabel: 'WhatsApp (Israel)',
    roiExWACost: 'Cost: ~$44',
    roiExWALeads: 'Estimated leads: 150–250',
    roiExWACPL: 'Cost per lead: ~$0.18–0.29',
    roiExSMSLabel: 'SMS',
    roiExSMSCost: 'Cost: ~$75–150 + landing page',
    roiExSMSLeads: 'Estimated leads: 20–50',
    roiExSMSCPL: 'Cost per lead: ~$3–7',
    roiExEmailLabel: 'Email',
    roiExEmailCost: 'Cost: ~$1–3 + landing page',
    roiExEmailLeads: 'Estimated leads: 10–30',
    roiExEmailCPL: 'Cost per lead: ~$0.10–0.30 (but much lower close rate)',
    roiConclusion: 'Bottom line: WhatsApp costs slightly more per message, but the ROI is 5–15x higher due to interactivity, high conversion rates and savings on landing page costs.',
  },
};

export default function WhatsAppMessagingPricing() {
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage === 'en' ? 'en' : 'he';
  const tx = TX[lang];
  const dir = lang === 'he' ? 'rtl' : 'ltr';

  const [country, setCountry] = useState('Israel');
  const [category, setCategory] = useState('utility');
  const [messagesPerMonth, setMessagesPerMonth] = useState(1000);

  const calculatedPrice = useMemo(() => {
    const countryData = pricingData.find(c => c.country === country);
    if (!countryData) return null;
    const pricePerMessage = countryData[category];
    return {
      perMessage: pricePerMessage,
      totalCost: pricePerMessage * messagesPerMonth,
    };
  }, [country, category, messagesPerMonth]);

  return (
    <div className="whatsapp-pricing-blog-container" dir={dir} style={{ paddingTop: '68px' }}>
      {/* Header */}
      <div className="blog-header">
        <div className="header-badge">
          <span>✨</span>
          <span>{tx.badge}</span>
        </div>
        <h1 className="blog-title">
          <span className="whatsapp-icon-text">💬</span> {tx.title}
        </h1>
        <div className="blog-intro">
          <span>✅</span>
          <p className="intro-text">{tx.introText}</p>
        </div>
      </div>

      {/* How it works */}
      <div className="content-section">
        <div className="section-header">
          <span className="section-icon">🕐</span>
          <h2 className="section-title">{tx.howWorksTitle}</h2>
        </div>
        <div className="section-content">
          <p className="content-paragraph">{tx.howWorksContent}</p>
          <div className="highlight-box">
            <span className="highlight-icon">✅</span>
            <p className="highlight-text">
              <strong>{tx.importantLabel}</strong> {tx.freeWindowText}
            </p>
          </div>
        </div>
      </div>

      {/* Message Types */}
      <div className="content-section">
        <div className="section-header">
          <span className="section-icon">💬</span>
          <h2 className="section-title">{tx.msgTypesTitle}</h2>
        </div>
        <div className="conversation-types">
          <div className="conversation-type-card marketing">
            <div className="card-header">
              <span className="card-icon">📈</span>
              <h3>{tx.marketing}</h3>
            </div>
            <p>{tx.marketingDesc}</p>
          </div>
          <div className="conversation-type-card service">
            <div className="card-header">
              <span className="card-icon">✅</span>
              <h3>{tx.service}</h3>
            </div>
            <p>{tx.serviceDesc}</p>
          </div>
          <div className="conversation-type-card utility">
            <div className="card-header">
              <span className="card-icon">⚙️</span>
              <h3>{tx.utility}</h3>
            </div>
            <p>{tx.utilityDesc}</p>
          </div>
        </div>
      </div>

      {/* When to pay */}
      <div className="content-section">
        <div className="section-header">
          <span className="section-icon">💰</span>
          <h2 className="section-title">{tx.whenPayTitle}</h2>
        </div>
        <div className="section-content">
          <p className="content-paragraph">{tx.whenPayContent}</p>
        </div>
      </div>

      {/* Why important */}
      <div className="content-section">
        <div className="section-header">
          <span className="section-icon">📊</span>
          <h2 className="section-title">{tx.whyTitle}</h2>
        </div>
        <div className="benefits-grid">
          <div className="benefit-card">
            <span className="benefit-icon">🕐</span>
            <h4>{tx.timeMgmt}</h4>
            <p>{tx.timeMgmtDesc}</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">📈</span>
            <h4>{tx.smartPlan}</h4>
            <p>{tx.smartPlanDesc}</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">💰</span>
            <h4>{tx.budgetCtrl}</h4>
            <p>{tx.budgetCtrlDesc}</p>
          </div>
        </div>
      </div>

      {/* Pro tip */}
      <div className="tip-section">
        <div className="tip-header">
          <span className="tip-icon">💡</span>
          <h3>{tx.tipTitle}</h3>
        </div>
        <div className="tip-content">
          <p>{tx.tipContent}</p>
        </div>
      </div>

      {/* More info links */}
      <div className="content-section">
        <div className="section-header">
          <span className="section-icon">🌐</span>
          <h2 className="section-title">{tx.moreInfoTitle}</h2>
        </div>
        <div className="external-link-card">
          <div className="link-content">
            <h4>{tx.fullTableLabel}</h4>
            <p>{tx.fullTableDesc}</p>
            <a href="/PriceList/MetaPricing/" className="external-link" style={{ marginBottom: '15px' }}>
              <span>💰</span>
              <span>{tx.fullTableBtn}</span>
              <span>→</span>
            </a>
          </div>
        </div>
        <div className="external-link-card">
          <div className="link-content">
            <h4>{tx.metaLink}</h4>
            <p>{tx.metaLinkDesc}</p>
            <a href="https://developers.facebook.com/docs/whatsapp/pricing/" target="_blank" rel="noopener noreferrer" className="external-link">
              <span>{tx.metaLinkText}</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="summary-section">
        <div className="summary-header">
          <span className="summary-icon">✅</span>
          <h2>{tx.summaryTitle}</h2>
        </div>
        <div className="summary-content">
          <p>{tx.summaryContent}</p>
        </div>
      </div>

      {/* Calculator */}
      <div className="calculator-section">
        <div className="calculator-header">
          <span className="calculator-icon">🧮</span>
          <h2>{tx.calcTitle}</h2>
          <p>{tx.calcDesc}</p>
        </div>

        <div className="important-notice">
          <div className="notice-icon">⚠️</div>
          <div className="notice-content">
            <strong>{tx.noticeLabel}</strong>
            <p>{tx.noticeText}</p>
            <p className="notice-explanation">{tx.noticeExp}</p>
          </div>
        </div>

        <div className="calculator-container">
          <div className="calculator-form">
            <div className="form-group">
              <label>{tx.selectCountry}</label>
              <div className="select-wrapper">
                <select onChange={e => setCountry(e.target.value)} value={country} className="form-input">
                  {pricingData.map(c => (
                    <option key={c.iso} value={c.country}>{c.country}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>{tx.selectCategory}</label>
              <div className="select-wrapper">
                <select onChange={e => setCategory(e.target.value)} value={category} className="form-input">
                  <option value="marketing">{tx.catMarketing}</option>
                  <option value="utility">{tx.catUtility}</option>
                  <option value="authentication">{tx.catAuth}</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>{tx.selectMessages}</label>
              <input
                type="number"
                onChange={e => setMessagesPerMonth(parseInt(e.target.value) || 0)}
                value={messagesPerMonth}
                min="0"
                step="100"
                className="form-input"
                placeholder="1000"
              />
            </div>

            {calculatedPrice && (
              <div className="result-display">
                <div className="result-row">
                  <span className="result-icon">💰</span>
                  <div className="result-details">
                    <div className="result-item">
                      <span className="result-label">{tx.perMsg}</span>
                      <span className="result-value">${calculatedPrice.perMessage.toFixed(6)} USD</span>
                    </div>
                    <div className="result-item total">
                      <span className="result-label">{tx.total}</span>
                      <span className="result-value">${calculatedPrice.totalCost.toFixed(2)} USD</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">{lang === 'he' ? 'עבור:' : 'For:'}</span>
                      <span className="result-value">{messagesPerMonth.toLocaleString()} {tx.forMessages}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ROI Comparison */}
      <div className="roi-comparison-section">
        <div className="roi-header">
          <h2>{tx.roiTitle}</h2>
          <p>{tx.roiSubtitle}</p>
        </div>

        {/* Comparison Table */}
        <div className="roi-table-wrapper">
          <table className="roi-table">
            <thead>
              <tr>
                <th></th>
                <th className="wa-col">
                  <span className="channel-icon">💬</span> {tx.roiWhatsApp}
                </th>
                <th className="sms-col">
                  <span className="channel-icon">📱</span> {tx.roiSMS}
                </th>
                <th className="email-col">
                  <span className="channel-icon">📧</span> {tx.roiEmail}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="row-label">{tx.roiCostLabel}</td>
                <td className="wa-col highlight">{tx.roiCostWA}</td>
                <td className="sms-col">{tx.roiCostSMS}</td>
                <td className="email-col">{tx.roiCostEmail}</td>
              </tr>
              <tr>
                <td className="row-label">{tx.roiOpenLabel}</td>
                <td className="wa-col winner"><strong>{tx.roiOpenWA} 🏆</strong></td>
                <td className="sms-col">{tx.roiOpenSMS}</td>
                <td className="email-col">{tx.roiOpenEmail}</td>
              </tr>
              <tr>
                <td className="row-label">{tx.roiResponseLabel}</td>
                <td className="wa-col winner"><strong>{tx.roiResponseWA} 🏆</strong></td>
                <td className="sms-col">{tx.roiResponseSMS}</td>
                <td className="email-col">{tx.roiResponseEmail}</td>
              </tr>
              <tr>
                <td className="row-label">{tx.roiCTRLabel}</td>
                <td className="wa-col winner"><strong>{tx.roiCTRWA} 🏆</strong></td>
                <td className="sms-col">{tx.roiCTRSMS}</td>
                <td className="email-col">{tx.roiCTREmail}</td>
              </tr>
              <tr>
                <td className="row-label">{tx.roiInteractiveLabel}</td>
                <td className="wa-col winner">{tx.roiInteractiveWA}</td>
                <td className="sms-col">{tx.roiInteractiveSMS}</td>
                <td className="email-col">{tx.roiInteractiveEmail}</td>
              </tr>
              <tr>
                <td className="row-label">{tx.roiLandingLabel}</td>
                <td className="wa-col winner">{tx.roiLandingWA}</td>
                <td className="sms-col">{tx.roiLandingSMS}</td>
                <td className="email-col">{tx.roiLandingEmail}</td>
              </tr>
              <tr>
                <td className="row-label">{tx.roiConversionLabel}</td>
                <td className="wa-col winner"><strong>{tx.roiConversionWA} 🏆</strong></td>
                <td className="sms-col">{tx.roiConversionSMS}</td>
                <td className="email-col">{tx.roiConversionEmail}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Insights */}
        <div className="roi-insights">
          <h3>{tx.roiInsightTitle}</h3>
          <ul className="roi-insight-list">
            {[tx.roiInsight1, tx.roiInsight2, tx.roiInsight3, tx.roiInsight4, tx.roiInsight5].map((insight, i) => (
              <li key={i}><span className="insight-bullet">✅</span><span>{insight}</span></li>
            ))}
          </ul>
        </div>

        {/* Example calculation */}
        <div className="roi-example">
          <h3>{tx.roiExampleTitle}</h3>
          <div className="roi-example-grid">
            <div className="roi-example-card wa-card">
              <div className="example-channel">💬 {tx.roiExWALabel}</div>
              <div className="example-stat">{tx.roiExWACost}</div>
              <div className="example-stat">{tx.roiExWALeads}</div>
              <div className="example-stat winner-stat">{tx.roiExWACPL}</div>
            </div>
            <div className="roi-example-card sms-card">
              <div className="example-channel">📱 {tx.roiExSMSLabel}</div>
              <div className="example-stat">{tx.roiExSMSCost}</div>
              <div className="example-stat">{tx.roiExSMSLeads}</div>
              <div className="example-stat">{tx.roiExSMSCPL}</div>
            </div>
            <div className="roi-example-card email-card">
              <div className="example-channel">📧 {tx.roiExEmailLabel}</div>
              <div className="example-stat">{tx.roiExEmailCost}</div>
              <div className="example-stat">{tx.roiExEmailLeads}</div>
              <div className="example-stat">{tx.roiExEmailCPL}</div>
            </div>
          </div>
          <div className="roi-conclusion">
            <span className="conclusion-icon">🎯</span>
            <p>{tx.roiConclusion}</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <div className="cta-icon">💬</div>
            <h3 className="cta-title">{tx.ctaTitle}</h3>
            <p className="cta-description">{tx.ctaDesc}</p>
            <div className="cta-features">
              <div className="cta-feature"><span className="feature-icon">✅</span><span>{tx.ctaF1}</span></div>
              <div className="cta-feature"><span className="feature-icon">✅</span><span>{tx.ctaF2}</span></div>
              <div className="cta-feature"><span className="feature-icon">✅</span><span>{tx.ctaF3}</span></div>
            </div>
            <a href="/OnboardingProcess/" className="cta-button">
              <span>{tx.ctaBtn}</span>
              <span className="button-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
