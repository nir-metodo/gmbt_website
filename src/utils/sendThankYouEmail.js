const GAMBOT_API = 'https://gambot.azurewebsites.net';

/**
 * Sends a thank-you email to the lead/contact if they provided an email address.
 * Fire-and-forget — errors are swallowed so they never block form submission.
 */
export async function sendThankYouEmail({ name = '', email = '', source = 'website' }) {
  if (!email || !email.includes('@')) return;

  try {
    await fetch(`${GAMBOT_API}/api/Webhooks/SendThankYouEmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, source }),
    });
  } catch {
    // Fire-and-forget — do not surface email errors to the user
  }
}
