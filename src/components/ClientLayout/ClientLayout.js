'use client';
import { useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

function LangSync() {
  const { setCurrentLanguage } = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem('gambot_lang');
    if (saved && (saved === 'he' || saved === 'en')) {
      setCurrentLanguage(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === 'he' ? 'rtl' : 'ltr';
    }
  }, [setCurrentLanguage]);

  return null;
}

export default function ClientLayout({ children }) {
  return (
    <LanguageProvider defaultLanguage="he">
      <LangSync />
      {children}
    </LanguageProvider>
  );
}
