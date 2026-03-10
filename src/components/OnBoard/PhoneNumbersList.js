import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import './PhoneNumbersList.css';
import Swal from 'sweetalert2';
import { useLanguage } from '@/contexts/LanguageContext';

const PhoneNumbersList = ({ onPhoneNumberSelect }) => {
    const { t, currentLanguage, isRTL } = useLanguage();
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [countryCode, setCountryCode] = useState('IL');
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Direct translations with fallback
    const getTranslation = (key, fallbackHe, fallbackEn) => {
        const translation = t(key);
        if (translation === key) {
            // Translation key returned, use fallback
            return currentLanguage === 'he' ? fallbackHe : fallbackEn;
        }
        return translation;
    };

    // Fetch available phone numbers based on the selected country code
    const fetchPhoneNumbers = async (selectedCountryCode) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axiosInstance.post(
                '/api/Webhooks/GetAvailablePhoneNumbersToPurchaseByCountry',
                { countryCode: selectedCountryCode }
            );
            console.log('Phone numbers response:', response.data);
            console.log('First number:', response.data[0]);
            setPhoneNumbers(response.data);
        } catch (error) {
            console.error("Error fetching phone numbers:", error);
            setError(getTranslation('phoneNumbersList.error', 'שגיאה בטעינת מספרי טלפון', 'Error loading phone numbers'));
            setPhoneNumbers([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle country code change
    const handleCountryCodeChange = (event) => {
        setCountryCode(event.target.value);
        fetchPhoneNumbers(event.target.value);
    };

    // Fetch available phone numbers when the component mounts or country code changes
    useEffect(() => {
        fetchPhoneNumbers(countryCode);
    }, [countryCode]);

    const formatPhoneNumber = (phoneNumber) => {
        const prefix = phoneNumber.slice(0, 4);
        const number = phoneNumber.slice(4);
        return `
            <div class="phone-number-container">
                <span class="phone-wrapper">
                    <span class="phone-prefix">${prefix}</span>
                    <span class="phone-space">&nbsp;</span>
                    <span class="phone-number">${number}</span>
                </span>
            </div>`;
    };

    const handleBuyClick = (phoneNumber) => {
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        Swal.fire({
            title: getTranslation('phoneNumbersList.confirmation.title', 'אישור בחירה', 'Confirm Selection'),
            html: `${getTranslation('phoneNumbersList.confirmation.message', 'האם אתה בטוח שברצונך לבחור את המספר', 'Are you sure you want to select the number')} ${formattedPhoneNumber}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: getTranslation('phoneNumbersList.confirmation.confirm', 'כן, אני בטוח', 'Yes, I\'m sure'),
            cancelButtonText: getTranslation('phoneNumbersList.confirmation.cancel', 'ביטול', 'Cancel'),
            reverseButtons: isRTL,
            customClass: {
                popup: 'rtl-popup',
                confirmButton: 'swal2-confirm',
                cancelButton: 'swal2-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setSelectedPhoneNumber(phoneNumber);
                Swal.fire({
                    title: getTranslation('phoneNumbersList.confirmation.success', 'מצוין!', 'Excellent!'),
                    html: `${getTranslation('phoneNumbersList.confirmation.successMessage', 'בחרת את המספר', 'You selected the number')} - ${formattedPhoneNumber}`,
                    icon: 'success',
                    confirmButtonText: getTranslation('phoneNumbersList.confirmation.close', 'סגור', 'Close'),
                    customClass: {
                        popup: 'rtl-popup'
                    }
                });
                onPhoneNumberSelect(phoneNumber);
            }
        });
    };

    // Define countries directly based on current language
    const getCountryOptions = () => {
        if (currentLanguage === 'he') {
            return [
                { value: 'IL', label: 'ישראל (IL)' },
                { value: 'US', label: 'ארצות הברית (US)' },
                { value: 'IN', label: 'הודו (IN)' },
                { value: 'BR', label: 'ברזיל (BR)' },
                { value: 'ID', label: 'אינדונזיה (ID)' },
                { value: 'MX', label: 'מקסיקו (MX)' },
                { value: 'RU', label: 'רוסיה (RU)' },
                { value: 'PK', label: 'פקיסטן (PK)' },
                { value: 'NG', label: 'ניגריה (NG)' },
                { value: 'DE', label: 'גרמניה (DE)' },
                { value: 'PH', label: 'הפיליפינים (PH)' },
                { value: 'VN', label: 'וייטנאם (VN)' },
                { value: 'EG', label: 'מצרים (EG)' },
                { value: 'TR', label: 'טורקיה (TR)' },
                { value: 'CO', label: 'קולומביה (CO)' },
                { value: 'GB', label: 'בריטניה (GB)' },
                { value: 'IT', label: 'איטליה (IT)' },
                { value: 'ES', label: 'ספרד (ES)' },
                { value: 'AR', label: 'ארגנטינה (AR)' },
                { value: 'KE', label: 'קניה (KE)' },
                { value: 'SA', label: 'ערב הסעודית (SA)' },
                { value: 'FR', label: 'צרפת (FR)' },
                { value: 'TH', label: 'תאילנד (TH)' },
                { value: 'DZ', label: 'אלג\'יריה (DZ)' },
                { value: 'BD', label: 'בנגלדש (BD)' },
                { value: 'PE', label: 'פרו (PE)' }
            ];
        } else {
            return [
                { value: 'IL', label: 'Israel (IL)' },
                { value: 'US', label: 'United States (US)' },
                { value: 'IN', label: 'India (IN)' },
                { value: 'BR', label: 'Brazil (BR)' },
                { value: 'ID', label: 'Indonesia (ID)' },
                { value: 'MX', label: 'Mexico (MX)' },
                { value: 'RU', label: 'Russia (RU)' },
                { value: 'PK', label: 'Pakistan (PK)' },
                { value: 'NG', label: 'Nigeria (NG)' },
                { value: 'DE', label: 'Germany (DE)' },
                { value: 'PH', label: 'Philippines (PH)' },
                { value: 'VN', label: 'Vietnam (VN)' },
                { value: 'EG', label: 'Egypt (EG)' },
                { value: 'TR', label: 'Turkey (TR)' },
                { value: 'CO', label: 'Colombia (CO)' },
                { value: 'GB', label: 'United Kingdom (GB)' },
                { value: 'IT', label: 'Italy (IT)' },
                { value: 'ES', label: 'Spain (ES)' },
                { value: 'AR', label: 'Argentina (AR)' },
                { value: 'KE', label: 'Kenya (KE)' },
                { value: 'SA', label: 'Saudi Arabia (SA)' },
                { value: 'FR', label: 'France (FR)' },
                { value: 'TH', label: 'Thailand (TH)' },
                { value: 'DZ', label: 'Algeria (DZ)' },
                { value: 'BD', label: 'Bangladesh (BD)' },
                { value: 'PE', label: 'Peru (PE)' }
            ];
        }
    };

    const countryOptions = getCountryOptions();

    return (
        <div className="phone-numbers-list-container" dir={isRTL ? 'rtl' : 'ltr'}>
            <h1 className="phone-numbers-list-header">
                {getTranslation('phoneNumbersList.header', 'בחר קוד מדינה ומספר טלפון:', 'Select country code and phone number:')}
            </h1>
            
            {/* Price info - shown only on mobile */}
            <div className="phone-numbers-price-info-mobile">
                {currentLanguage === 'he' 
                    ? 'עלות חודשית: ₪35 למספר' 
                    : 'Monthly cost: $10 per number'}
            </div>

            {/* Country code dropdown */}
            <div className="phone-numbers-list-country-select">
                <label htmlFor="countryCode-select">
                    {getTranslation('phoneNumbersList.countryLabel', 'בחר מדינה:', 'Select country:')}
                </label>
                <select 
                    id="countryCode-select" 
                    value={countryCode} 
                    onChange={handleCountryCodeChange}
                    disabled={loading}
                >
                    {countryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Available phone numbers title */}
            <h2 className="phone-numbers-list-title">
                {getTranslation('phoneNumbersList.availableNumbers', 'מספרי טלפון זמינים:', 'Available phone numbers:')}
            </h2>

            {/* Loading state */}
            {loading && (
                <div className="phone-numbers-loading">
                    <div className="loading-spinner"></div>
                    {getTranslation('phoneNumbersList.loading', 'טוען מספרי טלפון...', 'Loading phone numbers...')}
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="phone-numbers-empty">
                    <div className="empty-icon">⚠️</div>
                    {getTranslation('phoneNumbersList.error', 'שגיאה בטעינת מספרי טלפון', 'Error loading phone numbers')}
                </div>
            )}

            {/* Phone numbers table */}
            {!loading && !error && selectedPhoneNumber === null && (
                phoneNumbers.length > 0 ? (
                    <div className="phone-numbers-list-table-container">
                        <table className="phone-numbers-list-table">
                            <thead>
                                <tr>
                                    <th>{getTranslation('phoneNumbersList.tableHeaders.phoneNumber', 'מספר טלפון', 'Phone Number')}</th>
                                    <th>{getTranslation('phoneNumbersList.tableHeaders.monthlyPayment', 'תשלום חודשי', 'Monthly Payment')}</th>
                                    <th>{getTranslation('phoneNumbersList.tableHeaders.action', 'פעולה', 'Action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {phoneNumbers.map((number, index) => (
                                    <tr
                                        key={index}
                                        className={selectedPhoneNumber === number.phone_number ? 'phone-numbers-selected' : ''}
                                    >
                                        <td className='phone-numbers-list-table-container-phonenumber-value' style={{color: '#1e293b', textAlign: 'center'}}>
                                            <div style={{color: '#1e293b', textAlign: 'center'}}>
                                                <div style={{color: '#1e293b', fontWeight: '700', fontSize: '16px'}}>
                                                    {number.phone_number}
                                                </div>
                                                <div className="district" style={{color: '#64748b', fontSize: '12px'}}>
                                                    {number.locality}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {currentLanguage === 'he' ? '₪35' : '$10'}
                                        </td>
                                        <td>
                                            <button
                                                className="phone-numbers-list-buy-button"
                                                onClick={() => handleBuyClick(number.phone_number)}
                                            >
                                                {currentLanguage === 'he' ? 'בחר' : 'Select'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="phone-numbers-empty">
                        <div className="empty-icon">📞</div>
                        {getTranslation('phoneNumbersList.noNumbers', 'אין מספרים זמינים כרגע', 'No numbers available at the moment')}
                    </div>
                )
            )}

            {/* Display selected phone number */}
            {selectedPhoneNumber && (
                <div className="phone-numbers-list-selected">
                    {getTranslation('phoneNumbersList.confirmation.successMessage', 'בחרת את המספר', 'You selected the number')}: {selectedPhoneNumber}
                </div>
            )}
        </div>
    );
};

export default PhoneNumbersList;