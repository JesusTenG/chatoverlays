import type { MetadataRoute } from 'next';
import { catalog, categories, absoluteUrl } from '@/lib/catalog';
import { locales, localizePath } from '@/lib/routing.mjs';

export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', ...catalog.map(item => `/overlays/${item.slug}/`), ...categories.map(item => `/styles/${item.slug}/`), '/ratgeber/chat-overlay-auswaehlen/'].flatMap(path => locales.map(locale => ({ url: absoluteUrl(localizePath(path, locale)), alternates: { languages: { ...Object.fromEntries(locales.map(lang => [lang, absoluteUrl(localizePath(path, lang))])), 'x-default': absoluteUrl(path) } } })));
}
