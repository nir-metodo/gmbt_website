import React from 'react';
import { getBotFlowT } from './translations';

export const BotFlowLangContext = React.createContext({ lang: 'he', t: getBotFlowT('he') });

export const useBotFlowLang = () => {
  const ctx = React.useContext(BotFlowLangContext);
  return ctx.t ? ctx : { lang: 'he', t: getBotFlowT('he') };
};
