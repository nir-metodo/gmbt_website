// Explains plan-feature lines that need a definition (conversations, broadcast, AI credits, API/MCP credits).
// Matching is done on the translated feature text so it works for both Hebrew and English plan copy.

const BLOG = {
    ai: {
        en: '/blog/44/gambot-tokens-credits-how-to-calculate-and-estimate-your-ai-usage/',
        he: '/blog/44/טוקני-גמבוט-קרדיטים-איך-מחשבים-ומעריכים-כמה-ai-תצרכו/',
    },
    api: {
        en: '/blog/46/api-mcp-credits-how-gambot-counts-interface-usage-and-what-it-costs/',
        he: '/blog/46/קרדיטים-api-ו-mcp-איך-נספרת-צריכת-הממשק-בגמבוט-וכמה-זה-עולה/',
    },
};

const TEXT = {
    conversations: {
        en: '1 conversation = all messaging with a single person within a 24-hour window. From the moment someone reaches out, the entire exchange with them during those 24 hours counts as a single conversation.',
        he: 'שיחה 1 נחשבת התקשרות עם אדם אחד למשך 24 שעות. כלומר, מהרגע שמישהו פונה — כל ההתכתבות איתו במסגרת אותן 24 שעות נחשבת שיחה אחת.',
    },
    broadcast: {
        en: 'Broadcast messages = bulk mailing to many recipients. E.g. you upload an Excel and send one message to 100 people, then two weeks later to another 200 — that counts as 300 broadcast messages. The quota applies to each channel separately (WhatsApp and/or Email) — e.g. up to 5,000 on each channel.',
        he: 'הודעות דיוור = שליחה בתפוצה רחבה לנמענים רבים. לדוגמה: העליתם אקסל ושלחתם הודעה אחת ל-100 איש, וכעבור שבועיים עוד 200 — זה נחשב 300 הודעות דיוור. המכסה חלה על כל ערוץ בנפרד (וואטסאפ ו/או מייל) — למשל עד 5,000 בכל ערוץ.',
    },
    aiResponses: {
        en: 'AI responses = replies your AI bot generates to customers. Each reply consumes credits by the model used and the amount of context/knowledge involved — heavier replies cost more.',
        he: 'תגובות AI = התשובות שהבוט מייצר ללקוחות. כל תשובה צורכת קרדיטים לפי המודל שנבחר וכמות ההקשר/הידע בשימוש — תשובות "כבדות" עולות יותר.',
    },
    generalTokens: {
        en: 'General AI tokens power advanced AI actions beyond replies — proactive messages, AI reports, data analysis and smart summaries. Each action consumes tokens by its size.',
        he: 'טוקנים כלליים AI מפעילים פעולות AI מתקדמות מעבר לתשובות — הודעות פרואקטיביות, בניית דוחות, ניתוח נתונים וסיכומים חכמים. כל פעולה צורכת טוקנים לפי גודלה.',
    },
    credits: {
        en: 'AI credits are one unified pool for ALL AI usage — bot replies plus proactive messages, reports, analysis and summaries. Each action draws credits by the model used and its size; heavier/premium usage costs more. Extra: ₪39 per 500 credits.',
        he: 'קרדיטים AI הם מאגר אחד מאוחד לכל שימושי ה‑AI — תשובות הבוט וגם הודעות פרואקטיביות, דוחות, ניתוח וסיכומים. כל פעולה צורכת קרדיטים לפי המודל והגודל; שימוש כבד/מודל יקר עולה יותר. תוספת: ₪39 לכל 500 קרדיטים.',
    },
    apiMcp: {
        en: 'API/MCP credits are a separate pool for external-interface usage: a plain API call = 1 credit, an MCP action = 2, a bulk send/export = 4, and an AI action via the interface = 12. The monthly quota is included in your plan; overage is billed at ₪0.10 per credit.',
        he: 'קרדיטים API/MCP הם מאגר נפרד לשימוש בממשק החיצוני: קריאת API רגילה = 1 קרדיט, פעולת MCP = 2, דיוור/ייצוא בכמות = 4, ופעולת AI דרך הממשק = 12. המכסה החודשית כלולה בחבילה; חריגה מחויבת ₪0.10 לקרדיט.',
    },
};

/**
 * @returns {{ text: string, href: string | null, linkLabel: string | null } | null}
 */
export function getFeatureInfo(feature, lang) {
    const l = lang === 'en' ? 'en' : 'he';
    const isConversations = /שיחות[\s\S]*בחודש/.test(feature) || /conversations\s*(per month|\/\s*month)/i.test(feature);
    const isBroadcast = /הודעות דיוור/.test(feature) || /broadcast messages/i.test(feature);
    const isAiResponses = /תגובות\s*AI/i.test(feature) || /AI responses/i.test(feature);
    const isGeneralTokens = /טוקנים\s*כלליים/i.test(feature) || /general (ai )?tokens/i.test(feature);
    // API/MCP credits are a SEPARATE pool from the AI credits — must be detected before isCredits
    // (which also matches "קרדיט") so it gets its own, correct explanation.
    const isApiMcp = /API\s*\/\s*MCP/i.test(feature) || /קרדיטים\s*API/.test(feature);
    const isCredits = /קרדיט/i.test(feature) || /\bcredits?\b/i.test(feature);

    if (isConversations) return { text: TEXT.conversations[l], href: null, linkLabel: null };
    if (isBroadcast) return { text: TEXT.broadcast[l], href: null, linkLabel: null };
    if (isApiMcp) {
        return { text: TEXT.apiMcp[l], href: BLOG.api[l], linkLabel: l === 'en' ? 'Learn more →' : 'להרחבה — מדריך קרדיטי API/MCP ←' };
    }
    if (isCredits || isAiResponses || isGeneralTokens) {
        const text = isCredits ? TEXT.credits[l] : (isAiResponses ? TEXT.aiResponses[l] : TEXT.generalTokens[l]);
        return { text, href: BLOG.ai[l], linkLabel: l === 'en' ? 'Learn more →' : 'להרחבה — מדריך הטוקנים ←' };
    }
    return null;
}
