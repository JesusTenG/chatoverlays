import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Keep the imported design intact; translate only our own sample message.
const skins = JSON.parse(await readFile('source/skins.json', 'utf8'));
const bases = JSON.parse(await readFile('source/base-previews.json', 'utf8'));
const records = [...Object.values(skins), ...Object.values(bases).map(base => ({ ...base, skins: [base] }))];
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
console.log('Localized skin samples: English and Spanish. Original German previews preserved.');
