'use client';
import { useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

function LangSync() {
  const { setCurrentLanguage } = useLanguage();

  useEffect(() => {
    // Default is Hebrew (RTL) — Israel is the primary audience. The only exception is the
    // global, AI-agent-facing pages (WhatsApp MCP / developer API docs), which default to English.
    // A visitor's explicit choice (saved) always wins over any default.
    const saved = localStorage.getItem('gambot_lang');
    const path = (typeof window !== 'undefined' ? window.location.pathname : '') || '';
    const isGlobalEnglishPage = /^\/(whatsapp-mcp|developers)(\/|$)/i.test(path);
    const lang = saved === 'he' || saved === 'en'
      ? saved
      : (isGlobalEnglishPage ? 'en' : 'he');
    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
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
