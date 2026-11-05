import type { Metadata } from 'next';
import { absoluteUrl, config } from './catalog';

export function pageMetadata(path: string, title: string, description: string, image = '/assets/templates/neo-tokyo.webp'): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: config.indexable, follow: true },
    openGraph: { type: 'website', locale: 'de_DE', title, description, url: absoluteUrl(path), images: [absoluteUrl(image)] },
    twitter: { card: 'summary_large_image', title, description, images: [absoluteUrl(image)] },
  };
}
