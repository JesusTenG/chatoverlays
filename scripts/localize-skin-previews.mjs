import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Keep the imported design intact; translate only our own sample message.
const skins = JSON.parse(await readFile('source/skins.json', 'utf8'));
const bases = JSON.parse(await readFile('source/base-previews.json', 'utf8'));
const records = [...Object.values(skins), ...Object.values(bases).map(base => ({ ...base, skins: [base] }))];
const heroSkins = new Set([725, 988, 1068, 776, 682, 965, 952, 939, 1119, 818, 'base-magical-love', 'base-daydream', 'base-retromon-silver', 'base-lunar-omen']);
for (const locale of ['en', 'es']) {
  const { ui } = JSON.parse(await readFile(`source/locales/${locale}.json`, 'utf8'));
  for (const record of records) for (const skin of record.skins) {
    const file = path.join('public', skin.preview);
    const original = await readFile(file, 'utf8');
    if (!original.includes(record.sampleText)) throw new Error(`Missing sample message: ${file}`);
    const html = original.replace('<html lang="de">', `<html lang="${locale}">`).replaceAll(record.sampleText, ui.sampleText);
    await writeFile(file.replace(/\.html$/, `.${locale}.html`), html);
  }
}
for (const record of records) for (const skin of record.skins) {
  if (!heroSkins.has(skin.id)) continue;
  for (const locale of ['en', 'de', 'es']) {
    const file = path.join('public', skin.preview);
    const localized = locale === 'de' ? file : file.replace(/\.html$/, `.${locale}.html`);
    const html = await readFile(localized, 'utf8');
    const heroCss = `<style>
      .skin-content { padding: 12px 12px; zoom: calc(100vw / 385px); }
      @media (prefers-reduced-motion: no-preference) {
        .skin-content .cs-bubble { animation: hero-skin-reveal .85s .38s cubic-bezier(.16,1,.3,1) both !important; }
      }
      @keyframes hero-skin-reveal {
        from { opacity: .25; translate: 0 14px; scale: .92; }
        to { opacity: 1; translate: 0 0; scale: 1; }
      }
    </style>`;
    await writeFile(file.replace(/\.html$/, `.hero.${locale}.html`), html.replace('</head>', `${heroCss}</head>`));
  }
}
console.log('Localized skin samples: English and Spanish. Original German previews preserved.');
