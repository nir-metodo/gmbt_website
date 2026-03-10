'use client';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './PhoneInputWithModal.css';

const PhoneInputWithModal = ({ value, onChange, country = 'il', ...props }) => {
  let formattedValue = value || '';
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
