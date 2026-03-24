const GAMBOT_WEBHOOK_URL = 'https://gambot.azurewebsites.net/api/external/webhooks/GambotDemo/landing_page';
const GAMBOT_WEBHOOK_TOKEN = 'Bearer EAAJT4Xz94h0BOZBFZBE8X7JG09mddZAGTO0wxAnyLiAiJWatmQZBsyM5VsgR6luorX4ldUWsFL4MohZAB2ZCANsL44AdFZCew4OKNbYFUAMtOEeBlH8Eju2y1RErm8tWFP3HVZCURjetG1KBmdEwkWAz9h47zKb7oet9qLAzXh7Af98btiOQZAPPpVH6gshOeghXpqZCDZCTylYZCGrvrt5iMXbC7uZBTRFfO0cDgntPmBIRNNGZAZBSbRDeMMkc4xNZCWIl';

/**
 * Sends a lead to the Gambot backend webhook.
 * The HandleWebhook endpoint expects the contact nested under a "contact" key,
 * with phoneNumber (camelCase) and a keys array for CRM tagging.
 * Failures are swallowed so they never block the user-facing form submission.
 */
export async function sendLeadWebhook({ name = '', email = '', phone = '', message = '', businessName = '', source = 'website' }) {
  try {
    await fetch(GAMBOT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': GAMBOT_WEBHOOK_TOKEN,
      },
      body: JSON.stringify({
        contact: {
          name,
          email,
          phoneNumber: phone.replace(/\D/g, ''),
          message,
          businessName,
          keys: ['Leads'],
          from: source,
        },
      }),
    });
  } catch {
    // Fire-and-forget — do not surface webhook errors to the user
  }
}
