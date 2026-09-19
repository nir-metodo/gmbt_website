# GAMBOT — Global Growth + Agent-Ready API/MCP — Audit & Implementation Plan

> Planning checkpoint per the master plan (PART 43). This documents the **current
> state** across all Gambot repositories, what already satisfies the spec, the gaps,
> the files to change, risks, backward-compatibility notes, and the phased plan.
> Implementation proceeds after this report — the report is a checkpoint, not the deliverable.

Repos in scope:

| Repo | Path | Role |
|------|------|------|
| Backend (ASP.NET Web API, .NET Framework) | `Gambot-BE/gmbt_backend/Gambot-BE` | Core business logic + public `api/v1` REST API |
| MCP server (Node/TypeScript) | `gambot/gmbt_mcp` (GitHub `gambot-ai/gambot-mcp`, npm `gambot-mcp`) | AI-agent interface over the REST API |
| Marketing website (Next.js static export) | `gambot/gmbt_website` | SEO/GEO, `/developers/`, `/whatsapp-mcp/`, `llms.txt` |
| Admin frontend | `gambot/gmbt_frontend` | App UI (not a growth/agent surface) |
| Mobile / Function apps | `gambot/gmbt_mobile`, `gambotFunctionApp` | Out of scope for this initiative |

---

## 1. Current implementation (summary)

The initiative is **already substantially underway**. Key existing facts:

- The public REST API (`api/v1`, ~120 endpoints across 12 `*V1Controller`s) is **explicitly designed for AI consumption**: `ApiV1Base` normalizes Firestore timestamps to ISO-8601, strips empty fields, resolves multi-number senders, and detects the MCP client via the `X-Gambot-Client: mcp` header.
- The MCP server (`gmbt_mcp`, 114 tools) is a **real, published product** (npm + MCP registry + hosted at `gambot-mcp.azurewebsites.net/mcp`) with strong tool descriptions and a decision-tree `GAMBOT_INSTRUCTIONS` block.
- The website already has `/whatsapp-mcp/` and `/developers/` pages with mature SEO metadata (`pageMeta.js` + `buildMetadata`), JSON-LD, an AI-crawler-friendly `robots.txt`, and a comprehensive `llms.txt`.

So this project is primarily **hardening + expansion**, not greenfield.

---

## 2. Existing routes

### 2a. Backend `api/v1` (base: `https://api.gambot.co.il/api/v1`)
All controllers inherit `ApiV1Base` (`[GambotApiKey]` + `[ApiV1Log]`). Envelope:
`ApiOk` → `{ success:true, message, data }`; `ApiError` → `{ success:false, error:"<slug>", message }`.

Controllers: Messages, Templates, Contacts, Campaigns, Analytics, Crm (leads/cases/tasks),
Botomations (bots), Billing (quotes/invoices/orders), Documents (signatures/forms/docs),
Notes, Onboarding, Users. Full endpoint map captured in audit (see chat transcript).

### 2b. MCP tools
114 `gambot_*` tools, mostly 1:1 REST mirrors + high-level builders
(`gambot_send_campaign_from_excel`, `gambot_create_keyword_autoreply`,
`gambot_create_menu_bot`, `gambot_create_template_button_autoreply`).

### 2c. Website (Next.js App Router, `output:'export'`, Firebase Hosting)
79 static routes + `blog/[id]/[slug]` + `guide/[slug]`. Developer/MCP-relevant existing:
`/developers/`, `/whatsapp-mcp/`, plus English product landers and 3 MCP/AI blog posts.

---

## 3. Existing API architecture

- **Auth:** `gmbt_…` org token via `Authorization: Bearer`, `X-Api-Key`, or `?api_key=`
  (`Filters/GambotApiKeyAttribute.cs`). Scopes stored in Firestore `apiScopes`; empty ⇒ all.
- **Error model:** flat string `error` slug + prose `message`. **No** nested machine-readable
  `error.code`. Slugs (lowercase): `missing_fields`, `invalid_phone`, `not_found`,
  `conversation_closed`, `send_failed`, `insufficient_scope`, `regular_window_confirmation_required`, etc.
- **24-hour window:** handled today.
  - `POST messages/send-text` → 409 `conversation_closed` (prose only, no `data`).
  - `GET conversations/{phone}/window` → 200 with `{ windowOpen, canSendFreeText, requiresTemplate, reason, recommendation, defaultTemplateId }`.
  - `POST campaigns/send` (MCP) → 409 `regular_window_confirmation_required` **with a `data` payload** (counts).
- **Templates:** approval `status` exposed on read; **no** APPROVED gate at send; missing-variable
  errors surface as raw Meta text inside `send_failed`.
- **Contacts:** phone is the Firestore doc id ⇒ **no** `MULTIPLE_CONTACTS_FOUND` scenario; not-found = `not_found`.
- **Analytics:** rich period handling (`today|yesterday|week|month|30d|all` + `from`/`to`) but **day
  boundaries hardcoded to Israel Standard Time**, not org timezone.
- **Business logic** lives in services (`FirestoreService`, `Waba`, `ContactQueryService`); V1
  controllers are thin. ✅ Good foundation for shared logic (PART 40).

---

## 4. Existing MCP architecture

- Node/TS, `@modelcontextprotocol/sdk`. Stdio (`index.ts`) + Streamable-HTTP multi-tenant (`http.ts`) + OAuth (`oauth.ts`).
- `client.ts` sends `X-Gambot-Client: mcp`; on non-2xx it throws `GambotApiError(status, message, error)`
  and **discards the structured `data`/`recommendation` body** — only `message`/`error` survive.
- `server.ts` turns errors into a plain string `Gambot API error (409 conversation_closed): …`.
  **No `recommendedAction`, no forwarding of `data`/state flags.**
- **No** tool `annotations` (readOnly / destructive / openWorld) set on any tool.
- No high-level orchestration tools beyond `gambot_send_campaign_from_excel`.

---

## 5. Existing SEO architecture

- `src/app/layout.js` global metadata (Organization/WebSite/BreadcrumbList JSON-LD) + `src/lib/pageMeta.js`
  (`PAGE_META` + `buildMetadata(key, overrides)`), per-page JSON-LD (SoftwareApplication/FAQPage/WebAPI/Breadcrumb).
- Static `public/sitemap.xml` (~114 URLs; `next-sitemap` present but unused), `public/robots.txt`
  (explicit AI-crawler Allow rules), `public/llms.txt` (comprehensive).
- Analytics: GA4 `G-GFMXYNTV1N`, Google Ads `AW-18018385768`, Meta Pixel. Custom events:
  `generate_lead`, `conversion`, `whatsapp_click`, `CompleteRegistration`. **No** dev/MCP funnel events
  (`create_account_click`, `mcp_cta_click`, `developer_docs_click`, `github_click`, `seo_page_view`).
- Signup canonical: `https://gambot.co.il/OnboardingProcess/`.

---

## 6. What already satisfies this specification

- Single business/API layer; MCP is a thin interface (✅ PART 16/40/41 — no duplicate MCP API exists).
- 24h window is already normalized on the primary send path + a dedicated `/window` pre-flight endpoint (partial PART 20/23).
- Campaign safeguards for MCP (regular-broadcast confirmation, allowance/limit guards) with structured `data` (partial PART 30/31).
- AI-friendly response shaping (ISO timestamps, empty-field pruning) (✅ PART 24/25).
- Structured success ids on key writes (`messageId`, `campaignId`, `leadId`, `botId`) (partial PART 24).
- MCP tool descriptions already encode WhatsApp constraints + single-vs-bulk routing (partial PART 27).
- Mature SEO metadata, JSON-LD, `robots.txt` AI allow-list, `llms.txt`, `/developers/`, `/whatsapp-mcp/` (partial PART 4/11/12).

---

## 7. Missing pieces (gaps vs spec)

**API (PART 18–26):**
- No machine-readable `code` on error envelope (flat string only).
- `conversation_closed` (send-text) has no `data` state flags (`canSendFreeform`/`canSendTemplate`).
- No canonical vocabulary (`CONVERSATION_WINDOW_CLOSED`, `TEMPLATE_REQUIRED`, `TEMPLATE_NOT_FOUND`,
  `CONTACT_NOT_FOUND`, `INVALID_PHONE_NUMBER`, `VALIDATION_ERROR`, `INSUFFICIENT_PERMISSION`,
  `AUTHENTICATION_REQUIRED`, `RATE_LIMITED`, `CAMPAIGN_NOT_FOUND`, `TEMPLATE_NOT_APPROVED`, `MISSING_TEMPLATE_VARIABLES`).
- Analytics timezone hardcoded to Israel (spec PART 26 wants org timezone semantics, documented).

**MCP (PART 21/22/27/31):**
- Error passthrough drops structured `data`/`recommendation`; no `recommendedAction`.
- No side-effect/destructive tool `annotations`.

**Docs (PART 33/34):** `/developers/` lacks an "Error Handling (codes)" + "Building AI Agents" section reflecting the new codes; MCP README/`/whatsapp-mcp/` lack an "Agent Behavior" section.

**SEO (PART 4–10, 14):** 13 of 15 target routes absent:
`/whatsapp-api-for-ai-agents/`, `/whatsapp-api-for-developers/`, `/whatsapp-mcp/{chatgpt,claude,cursor,gemini}/`,
`/whatsapp-api/{campaigns,scheduled-messages,automation,analytics,webhooks,bulk-messaging}/`,
`/whatsapp-mcp-vs-whatsapp-web/`.

**Technical SEO (PART 11/15):** new pages need metadata/JSON-LD/sitemap/llms.txt entries + internal linking; dev/MCP conversion events absent.

---

## 8. Proposed files to change (additive-first)

**Backend (`Gambot-BE`):**
- `Controllers/ApiV1Base.cs` — add `ApiErrorCodes` canonical map; make `ApiError` emit an additive
  top-level `code` + optional `data` (keeps `error` string + `message` unchanged).
- `Controllers/MessagesV1Controller.cs` — enrich `conversation_closed` send-text error with `data`
  state flags + detect Meta missing-variable/not-approved errors on template send → `code`.

**MCP (`gmbt_mcp`):**
- `src/client.ts` — keep parsed `{ code, data, recommendation }` on `GambotApiError`.
- `src/server.ts` — serialize structured error (status/code/message/data + recovery hint) as JSON on `isError`.
- `src/tools.ts` — add `annotations` (readOnly/destructive/openWorld) to each tool; minor description tightening.
- `README.md` — Agent Behavior + error/recovery section, topics.

**Website (`gmbt_website`):**
- New `src/app/**/page.js` + `src/components/**/*.js` for the 13 pages (reusable `LandingShell`).
- `src/lib/pageMeta.js` — new `PAGE_META` entries (title/description/canonical/JSON-LD).
- `public/sitemap.xml`, `public/llms.txt` — add new URLs.
- `src/lib/track.js` (new) — GA4/Ads event helper; wire dev/MCP CTAs.
- `src/lib/apiDocsData.js` — Error Handling (codes) + Building AI Agents sections.

---

## 9. Risks

- **Backend compile risk** (.NET Framework, cannot build in this environment) — mitigate by keeping
  edits self-contained, additive, and syntactically conservative; no signature-breaking changes.
- **Breaking API clients** — mitigated: `error` (string) and `message` stay; only new fields added.
- **MCP behavior change** — richer error text is additive; success payloads unchanged.
- **Thin SEO pages** — mitigated by distinct intent/content per page (no product-name-swap duplicates).
- **Fabrication risk** — only document real endpoints/tools/capabilities; illustrative analytics numbers labeled as examples.

## 10. Backward compatibility

- API: purely additive JSON fields (`code`, and `data` on selected errors). Existing integrations and
  the MCP’s current `error`/`message` parsing keep working.
- MCP: tool names, schemas, and success shapes unchanged; only error text is enriched and annotations added.
- Website: all new routes; no existing route renamed or removed.

## 11. Implementation phases

1. **API foundation** — `ApiErrorCodes` + additive `code`/`data`; enrich window & template errors.
2. **MCP intelligence** — structured error passthrough + `recommendedAction` + annotations.
3. **Docs** — `/developers/` error+agent sections; MCP README; `llms.txt`.
4. **SEO/GEO** — 13 landing pages + metadata/JSON-LD + internal linking.
5. **Technical SEO** — sitemap, conversion tracking helper + events.
6. **QA** — compatibility checks, no data exposure, no fake claims, links/sitemap/schema validity.
