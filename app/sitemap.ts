import type { MetadataRoute } from 'next';
import { catalog, categories, absoluteUrl } from '@/lib/catalog';

export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', ...catalog.map(item => `/overlays/${item.slug}/`), ...categories.map(item => `/styles/${item.slug}/`), '/ratgeber/chat-overlay-auswaehlen/'].map(path => ({ url: absoluteUrl(path) }));
}
