const GAMBOT_WEBHOOK_URL = 'https://gambot.azurewebsites.net/api/external/webhooks/GambotDemo/landing_page';
const GAMBOT_WEBHOOK_TOKEN = 'Bearer EAAJT4Xz94h0BOZBFZBE8X7JG09mddZAGTO0wxAnyLiAiJWatmQZBsyM5VsgR6luorX4ldUWsFL4MohZAB2ZCANsL44AdFZCew4OKNbYFUAMtOEeBlH8Eju2y1RErm8tWFP3HVZCURjetG1KBmdEwkWAz9h47zKb7oet9qLAzXh7Af98btiOQZAPPpVH6gshOeghXpqZCDZCTylYZCGrvrt5iMXbC7uZBTRFfO0cDgntPmBIRNNGZAZBSbRDeMMkc4xNZCWIl';

/**
 * Normalize an Israeli phone number to E.164-like format (972XXXXXXXXX).
 * Handles:  0522096687 → 972522096687
 *           972522096687 → 972522096687 (already normalized)
 *           +972522096687 → 972522096687
 */
function normalizeIsraeliPhone(raw = '') {
  let digits = raw.replace(/\D/g, '');        // strip non-digits
  if (digits.startsWith('972')) return digits; // already international
  if (digits.startsWith('0'))   return '972' + digits.slice(1); // 05X → 972 5X
  return digits;                               // fallback: return as-is
}

/**
 * Sends a lead to the Gambot backend webhook.
 * Phone is converted to 972XXXXXXXXX format automatically.
 * page_url and page_name are captured automatically from the browser.
 * Failures are swallowed so they never block the user-facing form submission.
 */
export async function sendLeadWebhook({ name = '', email = '', phone = '', message = '', businessName = '', source = 'website' }) {
  try {
    const normalizedPhone = normalizeIsraeliPhone(phone);
    const pageUrl  = typeof window !== 'undefined' ? window.location.href : '';
    const pagePath = typeof window !== 'undefined' ? window.location.pathname : '';

    await fetch(GAMBOT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': GAMBOT_WEBHOOK_TOKEN,
      },
      body: JSON.stringify({
        name,
        email,
        phonenumber: normalizedPhone,
        message,
        buisnessname: businessName,
        form:      source,
        page_url:  pageUrl,
        page_path: pagePath,
      }),
    });
  } catch {
    // Fire-and-forget — do not surface webhook errors to the user
  }
}
