/** @typedef {'en' | 'de' | 'es'} Locale */
/** @type {readonly Locale[]} */
export const locales = ['en', 'de', 'es'];
export const defaultLocale = 'en';
export const guidePath = '/ratgeber/chat-overlay-auswaehlen/';
/** @param {string} value @returns {value is Locale} */
export const isLocale = value => locales.includes(/** @type {Locale} */ (value));
/** @param {string} path */
export function stripLocale(path) {
  return path.replace(/^\/(de|es)(?=\/|$)/, '') || '/';
}
/** @param {string} path @param {Locale} locale */
export function localizePath(path, locale) {
  const base = stripLocale(path);
  return locale === 'en' ? base : `/${locale}${base.startsWith('/') ? base : `/${base}`}`;
}
/** Preserve filters and the current section when changing language. @param {string} url @param {Locale} locale */
export function switchLanguageUrl(url, locale) {
  const current = new URL(url, 'https://local.invalid');
  return localizePath(current.pathname, locale) + current.search + current.hash;
}
