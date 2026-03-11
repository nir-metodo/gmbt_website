'use client';
import React, { createContext, useContext, useState, useMemo } from 'react';
import heTranslations from '@/lib/translations/he.json';
import enTranslations from '@/lib/translations/en.json';

const LanguageContext = createContext(null);

function getNestedValue(obj, path) {
  if (!path) return undefined;
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export function LanguageProvider({ children, defaultLanguage = 'he' }) {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

  const translations = useMemo(
    () => (currentLanguage === 'he' ? heTranslations : enTranslations),
    [currentLanguage]
  );

  const interpolate = (str, params) => {
    if (!params || typeof str !== 'string') return str;
    return str.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? params[k] : `{${k}}`));
  };

  const t = (key, params) => {
    const value = getNestedValue(translations, key);
    if (value !== undefined && (typeof value === 'string' || Array.isArray(value))) return interpolate(value, params);
    // fallback to Hebrew
    const heFallback = getNestedValue(heTranslations, key);
    if (heFallback !== undefined && (typeof heFallback === 'string' || Array.isArray(heFallback))) return interpolate(heFallback, params);
    return key;
  };

  const isRTL = currentLanguage === 'he';

  const getCurrency = () => (currentLanguage === 'he' ? 'ILS' : 'USD');
  const getCurrencySymbol = () => (currentLanguage === 'he' ? '₪' : '$');
  const getExchangeRate = () => 3.5;
  const getPlanPrices = () => {
    if (currentLanguage === 'he') {
      return { Basic: 143, Premium: 287, Enterprise: 865, sim: 35 };
    }
    return { Basic: 41, Premium: 82, Enterprise: 247, sim: 10 };
  };

  const value = {
    t,
    currentLanguage,
    setCurrentLanguage,
    isRTL,
    language: currentLanguage,
    getCurrency,
    getCurrencySymbol,
    getExchangeRate,
    getPlanPrices,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback for components used outside provider — return Hebrew defaults
    const t = (key, params) => {
      const value = getNestedValue(heTranslations, key);
      const resolved = (value && (typeof value === 'string' || Array.isArray(value))) ? value : key;
      if (params && typeof resolved === 'string') return resolved.replace(/\{(\w+)\}/g, (_, k) => params[k] !== undefined ? params[k] : `{${k}}`);
      return resolved;
    };
    return {
      t,
      currentLanguage: 'he',
      isRTL: true,
      language: 'he',
      setCurrentLanguage: () => {},
      getCurrency: () => 'ILS',
      getCurrencySymbol: () => '₪',
      getExchangeRate: () => 3.5,
      getPlanPrices: () => ({ Basic: 143, Premium: 287, Enterprise: 865, sim: 35 }),
    };
  }
  return ctx;
}

export default LanguageContext;
