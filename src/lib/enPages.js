/**
 * Central registry of ENGLISH URL aliases for the Hebrew solution/landing pages.
 *
 * Every Hebrew landing page renders bilingual content from SOLUTIONS (LandingPageContent picks
 * the language from context). Historically most of them had only a Hebrew URL, so search engines
 * and AI crawlers had no English URL to index — capping international reach. This registry gives
 * each bilingual page a real English URL with its own English <title>/description/keywords,
 * a self-canonical, reciprocal hreflang back to the Hebrew page, AND internal links to the other
 * English pages (via `related`) so the English site is fully interlinked like the Hebrew one.
 *
 * Adding a page here + a 2-line route file (see EnSolutionPage) + the reciprocal hreflang on the
 * Hebrew PAGE_META entry is all that's needed to publish an internationally-indexable English
 * version. The Hebrew pages (and their strong Israeli rankings) are never touched.
 *
 * Keyed by the English slug:
 *   solutionKey — the SOLUTIONS[...] content key (must have an `en` block, or be a flat English entry).
 *   heSlug      — the raw Hebrew slug (encoded by the helper for the URL).
 *   label       — short label used when this page is listed as a "Related Solution" elsewhere.
 *   related     — English slugs to cross-link from this page.
 */

const BASE = 'https://gambot.co.il';
const OG_IMAGE = `${BASE}/og-image.jpg`;

const heUrl = (heSlug) => `${BASE}/${encodeURI(heSlug)}/`;
const enUrl = (slug) => `${BASE}/${slug}/`;

export const EN_PAGES = {
  'bot-whatsapp': {
    solutionKey: 'whatsappBot',
    heSlug: 'בוט-וואטסאפ',
    label: 'WhatsApp Bot',
    title: 'WhatsApp Bot — Build a No-Code WhatsApp Bot | Gambot',
    description: 'Build a powerful WhatsApp bot with no code — a visual workflow designer, AI triggers, integrations and 24/7 customer service on the official WhatsApp Business API. Free trial.',
    keywords: 'WhatsApp bot, WhatsApp chatbot, no-code WhatsApp bot, WhatsApp automation, workflow designer, WhatsApp Business API bot, Gambot',
    related: ['whatsapp-ai-bot', 'whatsapp-bot-builder', 'whatsapp-chatbot', 'whatsapp-business'],
  },
  'whatsapp-business': {
    solutionKey: 'whatsappBusiness',
    heSlug: 'וואטסאפ-עסקי',
    label: 'WhatsApp Business API',
    title: 'WhatsApp Business API | Official Meta Platform | Gambot',
    description: 'WhatsApp Business API for your company — manage conversations, campaigns and automation in one platform. Official Meta Business Solution Provider. Green badge, CRM & bots. Free trial.',
    keywords: 'WhatsApp Business, WhatsApp Business API, WhatsApp Business platform, WhatsApp CRM, Meta Business Solution Provider, official WhatsApp API',
    related: ['bot-whatsapp', 'whatsapp-shared-inbox', 'whatsapp-broadcast', 'whatsapp-automation'],
  },
  'whatsapp-automation': {
    solutionKey: 'whatsappAutomation',
    heSlug: 'אוטומציה-בוואטסאפ',
    label: 'WhatsApp Automation',
    title: 'WhatsApp Automation | Botomation Workflows | Gambot',
    description: 'Advanced no-code WhatsApp automation. Build automated business workflows with CRM, API and Google Sheets integrations that run 24/7. Official WhatsApp Business API. Free trial.',
    keywords: 'WhatsApp automation, WhatsApp workflows, botomation, business automation, WhatsApp API automation, no-code automation',
    related: ['whatsapp-automation-guide', 'whatsapp-bot-builder', 'whatsapp-broadcast', 'whatsapp-campaigns'],
  },
  'whatsapp-chatbot': {
    solutionKey: 'whatsappChatbot',
    heSlug: 'צאטבוט-וואטסאפ',
    label: 'WhatsApp Chatbot',
    title: 'WhatsApp Chatbot | AI Chatbot for Business | Gambot',
    description: 'AI-powered WhatsApp chatbot — automatic 24/7 replies, lead management, smart customer service and integrations. No code. Official WhatsApp Business API. Free trial.',
    keywords: 'WhatsApp chatbot, AI chatbot WhatsApp, chatbot for business, automatic WhatsApp replies, AI customer service, WhatsApp bot',
    related: ['whatsapp-ai-bot', 'bot-whatsapp', 'whatsapp-customer-service-bot', 'whatsapp-bot-builder'],
  },
  'whatsapp-ai-bot': {
    solutionKey: 'whatsappAiBot',
    heSlug: 'בוט-ai-וואטסאפ',
    label: 'WhatsApp AI Bot',
    title: 'WhatsApp AI Bot | GPT-Powered AI Agent 24/7 | Gambot',
    description: 'A GPT-powered WhatsApp AI agent that holds natural conversations, sends media, scans your website, books meetings and reaches goals — set up in 5 minutes, no code.',
    keywords: 'WhatsApp AI bot, AI agent WhatsApp, GPT WhatsApp bot, AI chatbot WhatsApp, smart WhatsApp bot, conversational AI WhatsApp',
    related: ['whatsapp-ai-lead-bot', 'whatsapp-chatbot', 'bot-whatsapp', 'whatsapp-sales-bot'],
  },
  'whatsapp-ai-lead-bot': {
    solutionKey: 'whatsappLeadsBot',
    heSlug: 'בוט-לידים-וואטסאפ',
    label: 'WhatsApp AI Lead Bot',
    title: 'WhatsApp AI Lead Bot | Qualify & Book Meetings | Gambot',
    description: 'A WhatsApp AI lead bot that runs the sales conversation, books meetings in your calendar and sends an AI summary with the lead details — fully automatic, 24/7.',
    keywords: 'WhatsApp lead bot, AI lead bot, lead management WhatsApp, automatic meeting booking, AI summary, WhatsApp CRM',
    related: ['whatsapp-ai-bot', 'whatsapp-lead-management', 'whatsapp-sales-bot', 'whatsapp-appointment-booking'],
  },
  'whatsapp-marketing-reports': {
    solutionKey: 'mediaManagement',
    heSlug: 'ניהול-מדיה',
    label: 'Marketing Reports',
    title: 'WhatsApp Marketing Reports | Leads & Campaign Analytics | Gambot',
    description: 'Automatic weekly/monthly WhatsApp marketing reports — analyze leads, campaign performance, ROI and agents, all in one report. Free trial.',
    keywords: 'WhatsApp marketing reports, WhatsApp analytics, lead analysis, campaign ROI, marketing analytics WhatsApp, WhatsApp reporting',
    related: ['whatsapp-campaigns', 'whatsapp-broadcast', 'whatsapp-shared-inbox', 'whatsapp-automation'],
  },
  'whatsapp-shared-inbox': {
    solutionKey: 'whatsappMarketingSystem',
    heSlug: 'מערכת-שיווק-בוואטסאפ',
    label: 'Shared Inbox',
    title: 'WhatsApp Shared Inbox | Team Conversations & Routing | Gambot',
    description: 'A central WhatsApp shared inbox — assign conversations to agents, add labels and track everything. All your WhatsApp chats in one place. Free trial.',
    keywords: 'WhatsApp shared inbox, WhatsApp team inbox, WhatsApp helpdesk, conversation management, agent assignment, WhatsApp inbox',
    related: ['whatsapp-business', 'whatsapp-customer-service-bot', 'whatsapp-task-management', 'whatsapp-lead-management'],
  },
  'whatsapp-task-management': {
    solutionKey: 'taskManagement',
    heSlug: 'ניהול-משימות',
    label: 'Task Management',
    title: 'WhatsApp Task Management | Create, Assign & Track | Gambot',
    description: 'Manage tasks from WhatsApp — create tasks from conversations, assign to agents, set deadlines and reminders. Integrated with CRM, leads and cases. Free trial.',
    keywords: 'WhatsApp task management, task management for business, WhatsApp tasks, CRM tasks, team management WhatsApp',
    related: ['whatsapp-shared-inbox', 'whatsapp-lead-management', 'whatsapp-automation', 'whatsapp-business'],
  },
  'whatsapp-invoices': {
    solutionKey: 'digitalInvoices',
    heSlug: 'חשבוניות-דיגיטליות',
    label: 'Digital Invoices',
    title: 'Digital Invoices over WhatsApp | Tax-Compliant | Gambot',
    description: 'Issue tax invoices, receipts and proforma invoices and send them straight to WhatsApp. Connected to your CRM and quotes, with automatic numbering and payment tracking.',
    keywords: 'digital invoices, WhatsApp invoices, online invoicing, tax invoice, invoicing software, business invoices',
    related: ['whatsapp-business', 'whatsapp-task-management', 'whatsapp-automation', 'whatsapp-broadcast'],
  },
  'whatsapp-time-tracking': {
    solutionKey: 'employeeTimeTracking',
    heSlug: 'דיווח-שעות-עובדים',
    label: 'Employee Time Tracking',
    title: 'Employee Time Tracking over WhatsApp | Clock In/Out | Gambot',
    description: 'Employee time tracking over WhatsApp — clock in/out by message, breaks, overtime, monthly reports and payroll export. No extra app needed.',
    keywords: 'employee time tracking, WhatsApp time tracking, clock in out WhatsApp, attendance tracking, overtime, timesheet',
    related: ['whatsapp-task-management', 'whatsapp-automation', 'whatsapp-business', 'whatsapp-shared-inbox'],
  },
  'whatsapp-telephony': {
    solutionKey: 'telephonyWhatsApp',
    heSlug: 'טלפוניה-וואטסאפ',
    label: 'Telephony + WhatsApp',
    title: 'Telephony + WhatsApp | Calls, Recording & AI Summary | Gambot',
    description: 'Telephony integrated with WhatsApp — calls from the browser, recordings and AI summaries. Missed a call? An automatic WhatsApp message follows. All connected to CRM.',
    keywords: 'WhatsApp telephony, VoIP WhatsApp, browser calling, call recording, AI call summary, business phone system',
    related: ['whatsapp-shared-inbox', 'whatsapp-customer-service-bot', 'whatsapp-lead-management', 'whatsapp-business'],
  },
  'whatsapp-broadcast': {
    solutionKey: 'whatsappBroadcast',
    heSlug: 'מערכת-דיוור-וואטסאפ',
    label: 'WhatsApp Broadcast',
    title: 'WhatsApp Broadcast & Campaigns | Meta-Approved | Gambot',
    description: 'WhatsApp broadcast & marketing from your own business number, Meta-approved. Build templates, broadcast to Excel or contacts, schedule campaigns and AI holiday greetings. Free trial.',
    keywords: 'WhatsApp broadcast, WhatsApp bulk messaging, WhatsApp campaigns, WhatsApp marketing, bulk WhatsApp, Meta-approved broadcast',
    related: ['whatsapp-campaigns', 'whatsapp-newsletter', 'whatsapp-marketing-reports', 'whatsapp-automation'],
  },
  'whatsapp-automation-guide': {
    solutionKey: 'whatsappAutomationPro',
    heSlug: 'מערכת-אוטומציה-וואטסאפ',
    label: 'Automation Guide',
    title: 'How to Build WhatsApp Automation | Fastest Way | Gambot',
    description: 'Guide: build WhatsApp automation the fastest way — order confirmations, reminders, follow-ups and review requests. Webhook & HTTP Request integrations and scheduling. Free trial.',
    keywords: 'how to build WhatsApp automation, WhatsApp automation system, botomation, business automation, webhook WhatsApp, HTTP request WhatsApp',
    related: ['whatsapp-automation', 'whatsapp-bot-builder', 'whatsapp-broadcast', 'whatsapp-campaigns'],
  },
  'whatsapp-bot-builder': {
    solutionKey: 'whatsappBotBuilder',
    heSlug: 'יצירת-בוטים-וואטסאפ',
    label: 'Bot Builder',
    title: 'WhatsApp Bot Builder | Drag-and-Drop, No Code | Gambot',
    description: 'Build a WhatsApp menu bot in 15 minutes with a drag-and-drop builder — no code. Includes Coexistence (bot on your phone), reminders and reports. Free trial.',
    keywords: 'WhatsApp bot builder, build WhatsApp bot, drag and drop bot, menu bot, no-code bot builder, WhatsApp bot creation',
    related: ['bot-whatsapp', 'whatsapp-ai-bot', 'whatsapp-automation', 'whatsapp-chatbot'],
  },
  'whatsapp-campaigns': {
    solutionKey: 'whatsappCampaigns',
    heSlug: 'קמפיינים-בוואטסאפ',
    label: 'WhatsApp Campaigns',
    title: 'WhatsApp Campaigns | Smart Segmentation & Scheduling | Gambot',
    description: 'WhatsApp campaigns with smart segmentation, automatic scheduling and performance reports. Grow sales with high conversion rates on the official WhatsApp Business API.',
    keywords: 'WhatsApp campaigns, WhatsApp marketing campaigns, bulk messaging, campaign scheduling, WhatsApp segmentation',
    related: ['whatsapp-broadcast', 'whatsapp-newsletter', 'whatsapp-marketing-reports', 'whatsapp-automation'],
  },
  'whatsapp-appointment-booking': {
    solutionKey: 'appointmentBooking',
    heSlug: 'זימון-תורים-וואטסאפ',
    label: 'Appointment Booking',
    title: 'WhatsApp Appointment Booking | Auto Reminders | Gambot',
    description: 'Automatic appointment booking over WhatsApp — a smart calendar, confirmations and automatic reminders. Perfect for clinics, salons and service businesses. Free trial.',
    keywords: 'WhatsApp appointment booking, appointment scheduling, WhatsApp calendar, automatic reminders, booking bot',
    related: ['whatsapp-ai-lead-bot', 'whatsapp-customer-service-bot', 'bot-whatsapp', 'whatsapp-automation'],
  },
  'whatsapp-customer-service-bot': {
    solutionKey: 'customerServiceBot',
    heSlug: 'בוט-שירות-לקוחות-וואטסאפ',
    label: 'Customer Service Bot',
    title: 'WhatsApp Customer Service Bot | 24/7 Support | Gambot',
    description: 'A WhatsApp customer service bot — instant 24/7 replies, smart routing and hand-off to a human agent when needed. Improve CSAT on the official WhatsApp Business API.',
    keywords: 'WhatsApp customer service bot, WhatsApp support bot, customer service automation, WhatsApp support, helpdesk bot',
    related: ['whatsapp-chatbot', 'whatsapp-shared-inbox', 'whatsapp-ai-bot', 'whatsapp-telephony'],
  },
  'whatsapp-sales-bot': {
    solutionKey: 'salesBot',
    heSlug: 'בוט-מכירות-וואטסאפ',
    label: 'Sales Bot',
    title: 'WhatsApp Sales Bot | AI Sales Automation | Gambot',
    description: 'An AI WhatsApp sales bot — runs the full sales process, presents products, takes orders and processes payments automatically. Official WhatsApp Business API.',
    keywords: 'WhatsApp sales bot, AI sales bot, e-commerce WhatsApp, automated orders, sales automation, WhatsApp selling',
    related: ['whatsapp-ai-lead-bot', 'whatsapp-ai-bot', 'whatsapp-lead-management', 'whatsapp-campaigns'],
  },
  'whatsapp-newsletter': {
    solutionKey: 'whatsappMailing',
    heSlug: 'דיוור-בוואטסאפ',
    label: 'WhatsApp Newsletter',
    title: 'WhatsApp Newsletter | 95%+ Open Rate | Gambot',
    description: 'WhatsApp newsletters with a 95%+ open rate — send updates, offers and news straight to your customers on WhatsApp. Simple and effective. Free trial.',
    keywords: 'WhatsApp newsletter, WhatsApp mailing, bulk messaging, WhatsApp updates, newsletter over WhatsApp',
    related: ['whatsapp-broadcast', 'whatsapp-campaigns', 'whatsapp-marketing-reports', 'whatsapp-business'],
  },
  'whatsapp-lead-management': {
    solutionKey: 'leadManagementEn',
    heSlug: 'ניהול-לידים',
    label: 'Lead Management',
    title: 'WhatsApp Lead Management | Instant Reply & CRM Pipeline | Gambot',
    description: 'Capture leads from Facebook, landing pages, Click-to-WhatsApp and API into one place — each lead gets an instant WhatsApp reply and flows through a visual pipeline to a closed deal.',
    keywords: 'WhatsApp lead management, lead management software, lead pipeline, CRM leads, Facebook CTWA leads, instant lead response',
    related: ['whatsapp-ai-lead-bot', 'whatsapp-landing-page-leads', 'whatsapp-shared-inbox', 'whatsapp-sales-bot'],
  },
  'whatsapp-landing-page-leads': {
    solutionKey: 'landingPageLeadsEn',
    heSlug: 'דפי-נחיתה-לידים',
    label: 'Landing Page Leads',
    title: 'Landing Page to WhatsApp | Instant Lead Capture | Gambot',
    description: 'Connect any landing page form to WhatsApp with one webhook — every submission sends a personal WhatsApp message in seconds and lands in your CRM. Works with Wix, Webflow, WordPress.',
    keywords: 'landing page to WhatsApp, landing page leads, webhook WhatsApp, Wix leads WhatsApp, Webflow leads, instant lead capture, landing page CRM',
    related: ['whatsapp-lead-management', 'whatsapp-ai-lead-bot', 'whatsapp-campaigns', 'bot-whatsapp'],
  },
};

export const EN_SLUGS = Object.keys(EN_PAGES);

/** "Related Solutions" cards (English URL + short label) for a given English page. */
export function enRelatedFor(slug) {
  const p = EN_PAGES[slug];
  if (!p || !Array.isArray(p.related)) return [];
  return p.related
    .filter((s) => EN_PAGES[s])
    .map((s) => ({ href: `/${s}/`, label: EN_PAGES[s].label }));
}

/**
 * Return a copy of the SOLUTIONS content with English "Related Solutions" links injected.
 * If the content already ships a curated `related` list, it is kept as-is.
 */
export function withEnRelated(content, slug) {
  const related = enRelatedFor(slug);
  if (!content || !related.length) return content;
  if (content.he && content.en) {
    if (Array.isArray(content.en.related) && content.en.related.length) return content;
    return { ...content, en: { ...content.en, related } };
  }
  if (Array.isArray(content.related) && content.related.length) return content;
  return { ...content, related };
}

/** Build Next.js metadata for an English alias page (self-canonical + reciprocal hreflang). */
export function buildEnMetadata(slug) {
  const p = EN_PAGES[slug];
  if (!p) return {};
  const canonical = enUrl(slug);
  const he = heUrl(p.heSlug);
  return {
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    alternates: {
      canonical,
      languages: { he, en: canonical, 'x-default': canonical },
    },
    openGraph: {
      title: p.title,
      description: p.description,
      url: canonical,
      siteName: 'Gambot | WhatsApp Business API',
      locale: 'en_US',
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: p.title,
      description: p.description,
      images: [OG_IMAGE],
    },
  };
}
