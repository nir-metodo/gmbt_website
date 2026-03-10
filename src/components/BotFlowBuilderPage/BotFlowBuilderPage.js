'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import BotFlowBuilder from '../BotFlowBuilder/BotFlowBuilder';
import { getBotFlowT } from '../BotFlowBuilder/translations';
import './BotFlowBuilderPage.css';

const BOT_FLOW_STORAGE_KEY = 'gambot_bot_flow';

const BotFlowBuilderPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [initialFlow, setInitialFlow] = useState(null);

  const lang = pathname && pathname.startsWith('/en/') ? 'en' : 'he';
  const t = getBotFlowT(lang);
  const dir = lang === 'he' ? 'rtl' : 'ltr';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BOT_FLOW_STORAGE_KEY);
      if (saved) {
        setInitialFlow(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load saved flow:', e);
    }
  }, []);

  const handleBack = () => router.push(lang === 'en' ? '/en' : '/');
  const handleLogin = () => router.push('/OnboardingProcess');

  return (
    <div className="bot-flow-builder-page" dir={dir}>
      <button
        type="button"
        className="bot-flow-builder-page__back"
        onClick={handleBack}
        aria-label={t.page.back}
      >
        ← {t.page.back}
      </button>
      <div className="bot-flow-builder-page__header">
        <h1 className="bot-flow-builder-page__title">{t.page.title}</h1>
        <p className="bot-flow-builder-page__subtitle">{t.page.subtitle}</p>
        <button
          type="button"
          className="bot-flow-builder-page__cta"
          onClick={handleLogin}
        >
          {t.page.cta}
        </button>
      </div>
      <div className="bot-flow-builder-page__canvas">
        <BotFlowBuilder mode="website" initialFlow={initialFlow} lang={lang} />
      </div>
    </div>
  );
};

export default BotFlowBuilderPage;
