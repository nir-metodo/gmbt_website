/**
 * Shared "I'm signed in" hint written by the app (app.gambot.co.il) on the parent domain
 * (.gambot.co.il), so this site can offer one-click "Continue as <name>".
 * It holds NO tokens - only { e: email, n: display name, l: language }.
 *
 * Keep the cookie name + shape in sync with gmbt_frontend/src/utils/ssoCookie.js.
 */
const COOKIE_NAME = 'gambot_sso';

export const readSsoCookie = () => {
  try {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE_NAME}=`));
    if (!match) return null;
    const hint = JSON.parse(decodeURIComponent(match.slice(COOKIE_NAME.length + 1)));
    return hint && hint.e ? hint : null;
  } catch {
    return null;
  }
};
