import type { Locale } from './i18n';

export const skinThumbnail = (preview: string, locale: Locale) =>
  preview.replace('.html', locale === 'de' ? '.webp' : `.${locale}.webp`);
