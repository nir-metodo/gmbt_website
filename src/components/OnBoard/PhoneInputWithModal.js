import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './PhoneInputWithModal.css';

const PhoneInputWithModal = ({ value, onChange, country = 'il', ...props }) => {
  // react-phone-input-2 expects values WITHOUT the + prefix (e.g., "972505278310")
  // The library handles the display format internally
  let formattedValue = value || '';
  
  // Remove + if it exists (for consistency)
  if (formattedValue && typeof formattedValue === 'string' && formattedValue.startsWith('+')) {
    formattedValue = formattedValue.substring(1);
  }

  return (
    <div className="simple-phone-input">
      <PhoneInput
        country={country}
        value={formattedValue}
        onChange={onChange}
        enableSearch={true}
        searchPlaceholder="Search..."
        {...props}
      />
    </div>
  );
};

export default PhoneInputWithModal;
