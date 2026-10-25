import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaSearch, FaSyncAlt, FaPhoneAlt } from 'react-icons/fa';
import axiosInstance from './axiosInstance';
import './PhoneNumbersList.css';
import { useLanguage } from '@/contexts/LanguageContext';

const COUNTRIES = [
    ['IL', 'ישראל', 'Israel'], ['US', 'ארצות הברית', 'United States'], ['GB', 'בריטניה', 'United Kingdom'],
    ['DE', 'גרמניה', 'Germany'], ['FR', 'צרפת', 'France'], ['IT', 'איטליה', 'Italy'], ['ES', 'ספרד', 'Spain'],
    ['TR', 'טורקיה', 'Turkey'], ['RU', 'רוסיה', 'Russia'], ['IN', 'הודו', 'India'], ['BR', 'ברזיל', 'Brazil'],
    ['MX', 'מקסיקו', 'Mexico'], ['AR', 'ארגנטינה', 'Argentina'], ['CO', 'קולומביה', 'Colombia'], ['PE', 'פרו', 'Peru'],
    ['ID', 'אינדונזיה', 'Indonesia'], ['PH', 'הפיליפינים', 'Philippines'], ['VN', 'וייטנאם', 'Vietnam'],
    ['TH', 'תאילנד', 'Thailand'], ['PK', 'פקיסטן', 'Pakistan'], ['BD', 'בנגלדש', 'Bangladesh'],
    ['NG', 'ניגריה', 'Nigeria'], ['EG', 'מצרים', 'Egypt'], ['KE', 'קניה', 'Kenya'], ['DZ', "אלג'יריה", 'Algeria'],
    ['SA', 'ערב הסעודית', 'Saudi Arabia'],
];

const PhoneNumbersList = ({ onPhoneNumberSelect }) => {
    const { t, currentLanguage, isRTL } = useLanguage();
    const isHe = currentLanguage === 'he';
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [countryCode, setCountryCode] = useState('IL');
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const requestId = useRef(0);

    // Use the translation file when the key exists, otherwise the inline fallback.
    const tr = (key, fallbackHe, fallbackEn) => {
        const value = t(key);
        return value === key ? (isHe ? fallbackHe : fallbackEn) : value;
    };

    const fetchPhoneNumbers = async (selectedCountryCode) => {
        const id = ++requestId.current;
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post(
                '/api/Webhooks/GetAvailablePhoneNumbersToPurchaseByCountry',
                { countryCode: selectedCountryCode }
            );
            if (id !== requestId.current) return; // a newer country was picked meanwhile
            setPhoneNumbers(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            if (id !== requestId.current) return;
            console.error('Error fetching phone numbers:', err);
            setError(tr('phoneNumbersList.error', 'שגיאה בטעינת מספרי טלפון', 'Error loading phone numbers'));
            setPhoneNumbers([]);
        } finally {
            if (id === requestId.current) setLoading(false);
        }
    };

    useEffect(() => {
        setQuery('');
        fetchPhoneNumbers(countryCode);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countryCode]);

    const visibleNumbers = useMemo(() => {
        const digits = query.replace(/\D/g, '');
        if (!digits) return phoneNumbers;
        return phoneNumbers.filter((n) => String(n.phone_number || '').replace(/\D/g, '').includes(digits));
    }, [phoneNumbers, query]);

    const priceLabel = isHe ? '₪35' : '$10';

    return (
        <div className="pn" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="pn-head">
                <div className="pn-head-text">
                    <h3 className="pn-title">{isHe ? 'בחירת מספר WhatsApp' : 'Choose your WhatsApp number'}</h3>
                    <p className="pn-sub">{isHe ? 'בחרו מדינה ואז מספר פנוי מהרשימה.' : 'Pick a country, then an available number from the list.'}</p>
                </div>
                <span className="pn-price">
                    <strong>{priceLabel}</strong> {isHe ? 'לחודש למספר' : 'per number / month'}
                </span>
            </div>

            <div className="pn-toolbar">
                <label className="pn-field">
                    <span className="pn-label">{tr('phoneNumbersList.countryLabel', 'מדינה', 'Country').replace(/:\s*$/, '')}</span>
                    <select
                        id="countryCode-select"
                        className="pn-select"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        disabled={loading}
                    >
                        {COUNTRIES.map(([code, he, en]) => (
                            <option key={code} value={code}>{isHe ? he : en} ({code})</option>
                        ))}
                    </select>
                </label>
                <label className="pn-field pn-search">
                    <span className="pn-label">{isHe ? 'חיפוש לפי ספרות' : 'Search by digits'}</span>
                    <span className="pn-search-box">
                        <FaSearch className="pn-search-icon" aria-hidden="true" />
                        <input
                            type="search"
                            inputMode="numeric"
                            className="pn-input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={isHe ? 'למשל 1234' : 'e.g. 1234'}
                            disabled={loading || phoneNumbers.length === 0}
                        />
                    </span>
                </label>
            </div>

            {loading && (
                <ul className="pn-list" aria-busy="true" aria-label={tr('phoneNumbersList.loading', 'טוען מספרי טלפון...', 'Loading phone numbers...')}>
                    {[0, 1, 2, 3, 4].map((i) => (
                        <li key={i} className="pn-row pn-skeleton"><span /><span /><span /></li>
                    ))}
                </ul>
            )}

            {!loading && error && (
                <div className="pn-state pn-state-error" role="alert">
                    <span>{error}</span>
                    <button type="button" className="pn-retry" onClick={() => fetchPhoneNumbers(countryCode)}>
                        <FaSyncAlt /> {isHe ? 'נסו שוב' : 'Try again'}
                    </button>
                </div>
            )}

            {!loading && !error && phoneNumbers.length === 0 && (
                <div className="pn-state">
                    <FaPhoneAlt className="pn-state-icon" aria-hidden="true" />
                    <span>{tr('phoneNumbersList.noNumbers', 'אין מספרים זמינים כרגע', 'No numbers available at the moment')}</span>
                </div>
            )}

            {!loading && !error && phoneNumbers.length > 0 && visibleNumbers.length === 0 && (
                <div className="pn-state">
                    <span>{isHe ? 'לא נמצאו מספרים שמתאימים לחיפוש' : 'No numbers match your search'}</span>
                </div>
            )}

            {!loading && !error && visibleNumbers.length > 0 && (
                <ul className="pn-list">
                    {visibleNumbers.map((number, index) => (
                        <li key={`${number.phone_number}-${index}`} className="pn-row">
                            <div className="pn-number-col">
                                <span className="pn-number" dir="ltr">{number.phone_number}</span>
                                {number.locality && <span className="pn-locality">{number.locality}</span>}
                            </div>
                            <span className="pn-row-price">{priceLabel} <small>{isHe ? '/חודש' : '/mo'}</small></span>
                            <button
                                type="button"
                                className="pn-select-btn"
                                onClick={() => onPhoneNumberSelect(number.phone_number)}
                            >
                                {isHe ? 'בחירה' : 'Select'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PhoneNumbersList;
