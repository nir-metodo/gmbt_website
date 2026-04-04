// Webhook URL — replace with your actual botomation webhook
const SERVICE_REQUEST_WEBHOOK_URL = 'PASTE_YOUR_BOTOMATION_WEBHOOK_URL_HERE';

/**
 * Sends a service request to the GambotDemo botomation webhook.
 * Creates a new inquiry in GambotDemo org.
 * Fire-and-forget — errors never surface to the user.
 */
export async function sendServiceRequestWebhook({
  businessName = '',
  businessId = '',
  contactName = '',
  phone = '',
  requestType = '',
  description = '',
}) {
  if (!SERVICE_REQUEST_WEBHOOK_URL || SERVICE_REQUEST_WEBHOOK_URL.startsWith('PASTE')) return;

  try {
    await fetch(SERVICE_REQUEST_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: contactName,
        phonenumber: phone.replace(/\D/g, ''),
        buisnessname: businessName,
        businessId,
        form: 'service-request',
        message: `[${requestType}] ${description}`,
        requestType,
        description,
      }),
    });
  } catch {
    // silently swallow — do not block the user
  }
}
