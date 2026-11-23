import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Run with a Playwright page against the local preview after importing skins.
// Output is committed so normal builds don't need a browser or remote requests.
export async function renderSkinThumbnails(page, { skins, directory, locale = 'de', origin = 'http://127.0.0.1:3000' }) {
  const queue = [...skins];
  let rendered = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    const preview = await page.context().newPage();
    try {
      await preview.setViewportSize({ width: 520, height: 400 });
      await preview.emulateMedia({ reducedMotion: 'reduce' });
      while (queue.length) {
        const skin = queue.shift();
        const document = locale === 'de' ? skin.preview : skin.preview.replace('.html', `.${locale}.html`);
        await preview.goto(origin + document, { waitUntil: 'load' });
        await preview.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
        });
        const box = await preview.locator('.cs-bubble').boundingBox();
        if (!box) throw new Error(`Missing bubble: ${skin.preview}`);
        const height = Math.min(400, Math.max(box.height + 100, (box.width + 64) / (360 / 220)));
        const width = Math.min(520, height * (360 / 220));
        const clip = { x: Math.max(0, Math.min(520 - width, box.x + box.width / 2 - width / 2)), y: Math.max(0, Math.min(400 - height, box.y + box.height / 2 - height / 2 - 10)), width, height };
        await preview.screenshot({ path: `${directory}/skin-${skin.id}.${locale}.png`, clip, omitBackground: true, animations: 'disabled' });
        rendered++;
      }
    } finally {
      await preview.close();
    }
  }));
  return { rendered, locale };
}

if (process.argv[2] === '--browser-code') {
  const baseMode = process.argv.includes('--base');
  const catalog = JSON.parse(await readFile(path.join(root, baseMode ? 'source/base-previews.json' : 'source/skins.json'), 'utf8'));
  const offset = Number(process.argv[3] || 0);
  const limit = Number(process.argv[4] || 344);
  const locale = process.argv[5] || 'de';
  if (!['de', 'en', 'es'].includes(locale)) throw new Error(`Unknown locale: ${locale}`);
  const skins = (baseMode ? Object.values(catalog) : Object.values(catalog).flatMap(record => record.skins)).slice(offset, offset + limit).map(({ id, preview }) => ({ id, preview }));
  console.log(`async (page) => { return await (${renderSkinThumbnails.toString()})(page, ${JSON.stringify({ skins, directory: path.join(root, 'qa'), locale })}); }`);
}

if (process.argv[2] === '--compress') {
  const baseMode = process.argv.includes('--base');
  const catalog = JSON.parse(await readFile(path.join(root, baseMode ? 'source/base-previews.json' : 'source/skins.json'), 'utf8'));
  const offset = Number(process.argv[3] || 0);
  const limit = Number(process.argv[4] || 344);
  const locale = process.argv[5] || 'de';
  if (!['de', 'en', 'es'].includes(locale)) throw new Error(`Unknown locale: ${locale}`);
  const skins = (baseMode ? Object.values(catalog) : Object.values(catalog).flatMap(record => record.skins)).slice(offset, offset + limit);
  let bytes = 0;
  for (const skin of skins) {
    const thumbnail = await sharp(path.join(root, 'qa', `skin-${skin.id}.${locale}.png`)).resize(360, 220, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 86 }).toBuffer();
    await writeFile(path.join(root, 'public', skin.preview.replace('.html', locale === 'de' ? '.webp' : `.${locale}.webp`)), thumbnail);
    bytes += thumbnail.length;
  }
  console.log(`${skins.length} ${locale} skin thumbnails: ${(bytes / 1024 / 1024).toFixed(2)} MB total`);
}
