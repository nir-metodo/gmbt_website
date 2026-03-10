'use client';
import { useState, useMemo } from 'react';
import { FaSearch, FaGlobe, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { useLanguage } from '@/contexts/LanguageContext';
import './MetaPricingTable.css';

const pricingData = [
  { country: "Afghanistan", iso: "AF", code: "93", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Albania", iso: "AL", code: "355", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Algeria", iso: "DZ", code: "213", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "American Samoa", iso: "AS", code: "1-684", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Andorra", iso: "AD", code: "376", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Angola", iso: "AO", code: "244", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Argentina", iso: "AR", code: "54", marketing: 0.07725, utility: 0.0338, authentication: 0.0338, internationalAuth: null },
  { country: "Australia", iso: "AU", code: "61", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Austria", iso: "AT", code: "43", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Azerbaijan", iso: "AZ", code: "994", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Bahrain", iso: "BH", code: "973", marketing: 0.042625, utility: 0.012285, authentication: 0.012285, internationalAuth: null },
  { country: "Bangladesh", iso: "BD", code: "880", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Belgium", iso: "BE", code: "32", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Bolivia", iso: "BO", code: "591", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Bosnia and Herzegovina", iso: "BA", code: "387", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Brazil", iso: "BR", code: "55", marketing: 0.078125, utility: 0.00918, authentication: 0.00918, internationalAuth: null },
  { country: "Bulgaria", iso: "BG", code: "359", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Cambodia", iso: "KH", code: "855", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Cameroon", iso: "CM", code: "237", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Canada", iso: "CA", code: "1", marketing: 0.03125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Chile", iso: "CL", code: "56", marketing: 0.111125, utility: 0.027, authentication: 0.027, internationalAuth: null },
  { country: "China", iso: "CN", code: "86", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Colombia", iso: "CO", code: "57", marketing: 0.015625, utility: 0.00104, authentication: 0.00104, internationalAuth: null },
  { country: "Costa Rica", iso: "CR", code: "506", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Croatia", iso: "HR", code: "385", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Czech Republic", iso: "CZ", code: "420", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Democratic Republic of the Congo", iso: "CD", code: "243", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Denmark", iso: "DK", code: "45", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Dominican Republic", iso: "DO", code: "1-809, 1-829, 1-849", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Ecuador", iso: "EC", code: "593", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Egypt", iso: "EG", code: "20", marketing: 0.134125, utility: 0.00468, authentication: 0.00468, internationalAuth: 0.08775 },
  { country: "El Salvador", iso: "SV", code: "503", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Ethiopia", iso: "ET", code: "251", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Finland", iso: "FI", code: "358", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "France", iso: "FR", code: "33", marketing: 0.179, utility: 0.0405, authentication: 0.0405, internationalAuth: null },
  { country: "Germany", iso: "DE", code: "49", marketing: 0.170625, utility: 0.07425, authentication: 0.07425, internationalAuth: null },
  { country: "Ghana", iso: "GH", code: "233", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Greece", iso: "GR", code: "30", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Guatemala", iso: "GT", code: "502", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Honduras", iso: "HN", code: "504", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Hong Kong", iso: "HK", code: "852", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Hungary", iso: "HU", code: "36", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "India", iso: "IN", code: "91", marketing: 0.013375, utility: 0.00189, authentication: 0.00189, internationalAuth: 0.0378 },
  { country: "Indonesia", iso: "ID", code: "62", marketing: 0.051375, utility: 0.03375, authentication: 0.03375, internationalAuth: 0.1836 },
  { country: "Iraq", iso: "IQ", code: "964", marketing: 0.042625, utility: 0.012285, authentication: 0.012285, internationalAuth: null },
  { country: "Ireland", iso: "IE", code: "353", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Israel", iso: "IL", code: "972", marketing: 0.0442, utility: 0.0067, authentication: 0.0067, internationalAuth: null },
  { country: "Italy", iso: "IT", code: "39", marketing: 0.086375, utility: 0.0405, authentication: 0.0405, internationalAuth: null },
  { country: "Ivory Coast", iso: "CI", code: "225", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Japan", iso: "JP", code: "81", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Jordan", iso: "JO", code: "962", marketing: 0.042625, utility: 0.012285, authentication: 0.012285, internationalAuth: null },
  { country: "Kenya", iso: "KE", code: "254", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Kuwait", iso: "KW", code: "965", marketing: 0.042625, utility: 0.012285, authentication: 0.012285, internationalAuth: null },
  { country: "Latvia", iso: "LV", code: "371", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Lebanon", iso: "LB", code: "961", marketing: 0.042625, utility: 0.012285, authentication: 0.012285, internationalAuth: null },
  { country: "Libya", iso: "LY", code: "218", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Lithuania", iso: "LT", code: "370", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Malaysia", iso: "MY", code: "60", marketing: 0.1075, utility: 0.0189, authentication: 0.0189, internationalAuth: 0.05643 },
  { country: "Mexico", iso: "MX", code: "52", marketing: 0.038125, utility: 0.011475, authentication: 0.011475, internationalAuth: null },
  { country: "Morocco", iso: "MA", code: "212", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Mozambique", iso: "MZ", code: "258", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Netherlands", iso: "NL", code: "31", marketing: 0.199625, utility: 0.0675, authentication: 0.0675, internationalAuth: null },
  { country: "New Zealand", iso: "NZ", code: "64", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Nigeria", iso: "NG", code: "234", marketing: 0.0645, utility: 0.009045, authentication: 0.009045, internationalAuth: 0.10125 },
  { country: "Norway", iso: "NO", code: "47", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Oman", iso: "OM", code: "968", marketing: 0.042625, utility: 0.012285, authentication: 0.012285, internationalAuth: null },
  { country: "Other", iso: "XX", code: "-", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Pakistan", iso: "PK", code: "92", marketing: 0.059125, utility: 0.00729, authentication: 0.00729, internationalAuth: 0.10125 },
  { country: "Palestine", iso: "PS", code: "970", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "Panama", iso: "PA", code: "507", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Peru", iso: "PE", code: "51", marketing: 0.087875, utility: 0.027, authentication: 0.027, internationalAuth: null },
  { country: "Philippines", iso: "PH", code: "63", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Poland", iso: "PL", code: "48", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Portugal", iso: "PT", code: "351", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Qatar", iso: "QA", code: "974", marketing: 0.042625, utility: 0.012285, authentication: 0.012285, internationalAuth: null },
  { country: "Romania", iso: "RO", code: "40", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Russia", iso: "RU", code: "7", marketing: 0.10025, utility: 0.054, authentication: 0.054, internationalAuth: null },
  { country: "Rwanda", iso: "RW", code: "250", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Saudi Arabia", iso: "SA", code: "966", marketing: 0.056875, utility: 0.01391, authentication: 0.01391, internationalAuth: 0.08073 },
  { country: "Senegal", iso: "SN", code: "221", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Serbia", iso: "RS", code: "381", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Singapore", iso: "SG", code: "65", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Slovakia", iso: "SK", code: "421", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "Slovenia", iso: "SI", code: "386", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "South Africa", iso: "ZA", code: "27", marketing: 0.047375, utility: 0.01026, authentication: 0.01026, internationalAuth: 0.027 },
  { country: "South Korea", iso: "KR", code: "82", marketing: 0.0755, utility: 0.010395, authentication: 0.010395, internationalAuth: null },
  { country: "South Sudan", iso: "SS", code: "211", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Spain", iso: "ES", code: "34", marketing: 0.076875, utility: 0.027, authentication: 0.027, internationalAuth: null },
  { country: "Sri Lanka", iso: "LK", code: "94", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Sudan", iso: "SD", code: "249", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Sweden", iso: "SE", code: "46", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Switzerland", iso: "CH", code: "41", marketing: 0.074, utility: 0.023085, authentication: 0.023085, internationalAuth: null },
  { country: "Taiwan", iso: "TW", code: "886", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Tanzania", iso: "TZ", code: "255", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Thailand", iso: "TH", code: "66", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Tunisia", iso: "TN", code: "216", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Turkey", iso: "TR", code: "90", marketing: 0.013625, utility: 0.007155, authentication: 0.007155, internationalAuth: null },
  { country: "Uganda", iso: "UG", code: "256", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Ukraine", iso: "UA", code: "380", marketing: 0.1075, utility: 0.02862, authentication: 0.02862, internationalAuth: null },
  { country: "United Arab Emirates", iso: "AE", code: "971", marketing: 0.062375, utility: 0.021195, authentication: 0.021195, internationalAuth: 0.06885 },
  { country: "United Kingdom", iso: "GB", code: "44", marketing: 0.066125, utility: 0.0297, authentication: 0.0297, internationalAuth: null },
  { country: "United States", iso: "US", code: "1", marketing: 0.03125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Uruguay", iso: "UY", code: "598", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Venezuela", iso: "VE", code: "58", marketing: 0.0925, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Vietnam", iso: "VN", code: "84", marketing: 0.0915, utility: 0.015255, authentication: 0.015255, internationalAuth: null },
  { country: "Yemen", iso: "YE", code: "967", marketing: 0.042625, utility: 0.012285, authentication: 0.012285, internationalAuth: null },
  { country: "Zambia", iso: "ZM", code: "260", marketing: 0.028125, utility: 0.0054, authentication: 0.0054, internationalAuth: null },
  { country: "Zimbabwe", iso: "ZW", code: "263", marketing: 0.028125, utility: 0.0052, authentication: 0.0052, internationalAuth: null },
];

export default function MetaPricingTable() {
  const { currentLanguage } = useLanguage();
  const isHe = currentLanguage !== 'en';
  const dir = isHe ? 'rtl' : 'ltr';

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const filteredData = useMemo(() => {
    return pricingData.filter(row =>
      row.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.iso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.code.includes(searchTerm)
    );
  }, [searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? -1;
      const bVal = b[sortConfig.key] ?? -1;
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="meta-pricing-container" dir={dir} style={{ paddingTop: '68px' }}>
      <div className="meta-pricing-header">
        <div className="header-badge">
          <MdVerified className="badge-icon" />
          <span>{isHe ? 'מחירים רשמיים' : 'Official Pricing'}</span>
        </div>
        <h1 className="meta-pricing-title">
          <FaGlobe className="title-icon" />
          {isHe ? 'מחירון Meta WhatsApp - תשלום לפי הודעה' : 'Meta WhatsApp Pricing - Pay Per Message'}
        </h1>
        <p className="meta-pricing-subtitle">
          {isHe
            ? 'עלות הודעה בדולר לפי מדינה – עודכן ב-1 באוקטובר 2025'
            : 'Cost per message in USD by country. Updated October 1, 2025'}
        </p>
        <div className="pricing-notes">
          <div className="note-item">
            <FaMoneyBillWave className="note-icon" />
            <span>{isHe ? 'המחירים המוצגים כאן הם עבור תכנית Growth/Pro' : 'Prices shown are for Growth/Pro Plan'}</span>
          </div>
          <div className="note-item">
            <FaChartLine className="note-icon" />
            <span>{isHe ? 'עבור תכנית Business יש הנחה נוספת על התעריף' : 'Business plan gets additional discount'}</span>
          </div>
        </div>
      </div>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder={isHe ? 'חפש מדינה, קוד ISO או קידומת...' : 'Search country, ISO code or prefix...'}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="pricing-table-wrapper">
        <table className="meta-pricing-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('country')}>
                {isHe ? 'מדינה' : 'Country Name'}
                {sortConfig.key === 'country' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
              <th onClick={() => handleSort('iso')}>
                {isHe ? 'קוד ISO' : 'ISO Code'}
                {sortConfig.key === 'iso' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
              <th onClick={() => handleSort('code')}>
                {isHe ? 'קידומת' : 'Country Codes'}
                {sortConfig.key === 'code' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
              <th onClick={() => handleSort('marketing')} className="price-column">
                {isHe ? 'שיווק' : 'Marketing'}
                {sortConfig.key === 'marketing' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
              <th onClick={() => handleSort('utility')} className="price-column">
                {isHe ? 'שירות' : 'Utility'}
                {sortConfig.key === 'utility' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
              <th onClick={() => handleSort('authentication')} className="price-column">
                {isHe ? 'אימות' : 'Authentication'}
                {sortConfig.key === 'authentication' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
              <th onClick={() => handleSort('internationalAuth')} className="price-column">
                {isHe ? 'אימות בינלאומי' : 'International Auth*'}
                {sortConfig.key === 'internationalAuth' && <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr key={idx}>
                <td className="country-cell">{row.country}</td>
                <td className="iso-cell">{row.iso}</td>
                <td className="code-cell">{row.code}</td>
                <td className="price-cell">${row.marketing.toFixed(6)}</td>
                <td className="price-cell">${row.utility.toFixed(6)}</td>
                <td className="price-cell">${row.authentication.toFixed(6)}</td>
                <td className="price-cell">{row.internationalAuth ? `$${row.internationalAuth.toFixed(6)}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pricing-footer">
        <p className="footer-note">
          <strong>*</strong> {isHe
            ? 'אימות בינלאומי זמין רק במדינות מסוימות'
            : 'International Authentication is only available for specific countries'}
        </p>
        <p className="footer-note">
          {isHe
            ? 'כל הודעות השירות חינמיות עבור לקוחות תכנית Growth/Pro/Business'
            : 'All service messages are free for Growth/Pro/Business plan customers'}
        </p>
      </div>
    </div>
  );
}
