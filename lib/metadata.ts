import type { Metadata } from 'next';
import { absoluteUrl, config } from './catalog';
import { locales, localizePath } from './routing.mjs';
import type { Locale } from './i18n';

export function pageMetadata(path: string, title: string, description: string, image = '/assets/templates/neo-tokyo.webp', locale: Locale = 'en'): Metadata {
  const url = absoluteUrl(localizePath(path, locale));
  const ogLocales = { en: 'en_US', de: 'de_DE', es: 'es_ES' };
  return {
    title,
    description,
    alternates: { canonical: url, languages: { ...Object.fromEntries(locales.map(lang => [lang, absoluteUrl(localizePath(path, lang))])), 'x-default': absoluteUrl(path) } },
    robots: { index: config.indexable, follow: true },
    openGraph: { type: 'website', locale: ogLocales[locale], alternateLocale: locales.filter(lang => lang !== locale).map(lang => ogLocales[lang]), title, description, url, images: [absoluteUrl(image)] },
    twitter: { card: 'summary_large_image', title, description, images: [absoluteUrl(image)] },
  };
}
