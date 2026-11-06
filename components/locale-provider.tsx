'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Locale, Messages } from '@/lib/i18n';

const LocaleContext = createContext<{ locale: Locale; t: Messages } | null>(null);
export function LocaleProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: ReactNode }) {
  return <LocaleContext.Provider value={{ locale, t: messages }}>{children}</LocaleContext.Provider>;
}
export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('LocaleProvider is required');
  return value;
}
