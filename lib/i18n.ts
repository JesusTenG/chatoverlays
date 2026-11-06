import en from '@/source/locales/en.json';
import de from '@/source/locales/de.json';
import es from '@/source/locales/es.json';
export type Locale = 'en' | 'de' | 'es';
export type Messages = typeof en;
const dictionaries: Record<Locale, Messages> = { en, de, es };
export const getMessages = (locale: Locale): Messages => dictionaries[locale];
export { locales, defaultLocale, isLocale, localizePath, stripLocale, guidePath } from './routing.mjs';
