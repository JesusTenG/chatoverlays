import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getMessages, type Locale } from './i18n';

// Embed the bundled skin document so a hosting rewrite cannot load a site page inside the frame.
export function skinDocument(preview: string, locale: Locale, hero = false) {
  const original = readFileSync(join(process.cwd(), 'public', preview), 'utf8');
  const localized = original.replace('<html lang="de">', '<html lang="' + locale + '">')
    .replaceAll(getMessages('de').ui.sampleText, getMessages(locale).ui.sampleText);
  if (!hero) return localized;
  return localized.replace('</head>', `<style>
      .skin-content { padding: 12px 12px; zoom: calc(100vw / 385px); }
      @media (prefers-reduced-motion: no-preference) {
        .skin-content .cs-bubble { animation: hero-skin-reveal .85s .38s cubic-bezier(.16,1,.3,1) both !important; }
      }
      @keyframes hero-skin-reveal {
        from { opacity: .25; translate: 0 14px; scale: .92; }
        to { opacity: 1; translate: 0 0; scale: 1; }
      }
    </style></head>`);
}
