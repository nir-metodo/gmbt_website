/**
 * Clean and normalize Israeli phone numbers
 * Removes leading 0 after country code (e.g., 972 0 55 -> 972 55)
 * 
 * @param {string} rawPhone - Raw phone number input
 * @returns {string} - Cleaned phone number in format 972XXXXXXXX
 */
export const cleanIsraeliPhoneNumber = (rawPhone) => {
  if (!rawPhone) return '';

  // Remove ALL non-digit characters (+, -, spaces, etc.)
  let cleaned = rawPhone.replace(/\D/g, '');

  // Handle Israeli numbers starting with 0:
  // - 0505278310 (10 digits) => 972505278310 (12 digits)
  // - 055 985 9052 => 972559859052
  if (cleaned.startsWith('0') && (cleaned.length === 9 || cleaned.length === 10)) {
    cleaned = '972' + cleaned.substring(1); // Remove leading 0, add 972
  } else if (!cleaned.startsWith('972') && !cleaned.startsWith('0') && (cleaned.length === 8 || cleaned.length === 9)) {
    // Israeli number without leading 0 (e.g. 505278310) - add 972
    cleaned = '972' + cleaned;
  } else if (!cleaned.startsWith('972') && !cleaned.startsWith('0') && cleaned.length > 9) {
    // Truly international number (e.g. US: 12125551234) - keep as is
    return cleaned;
  }

  // Fix: Remove extra 0 after 972 (e.g., 9720559859052 -> 972559859052)
  if (cleaned.startsWith('9720')) {
    cleaned = '972' + cleaned.substring(4); // Remove '9720', keep '972' + rest
  }

  return cleaned;
};

/**
 * Format phone number for display with country code
 * @param {string} phone - Phone number (e.g., 972559859052)
 * @returns {string} - Formatted phone number (e.g., +972 55 985 9052)
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = cleanIsraeliPhoneNumber(phone);
  
  // Format Israeli numbers: +972 XX XXX XXXX
  if (cleaned.startsWith('972')) {
    const withoutCountry = cleaned.substring(3); // Remove 972
    if (withoutCountry.length === 9) {
      // Mobile: +972 XX XXX XXXX
      return `+972 ${withoutCountry.substring(0, 2)} ${withoutCountry.substring(2, 5)} ${withoutCountry.substring(5)}`;
    } else if (withoutCountry.length === 8) {
      // Landline: +972 X XXX XXXX
      return `+972 ${withoutCountry.substring(0, 1)} ${withoutCountry.substring(1, 4)} ${withoutCountry.substring(4)}`;
    }
  }
  
  return `+${cleaned}`;
};
