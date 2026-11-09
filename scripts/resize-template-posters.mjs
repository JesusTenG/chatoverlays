import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(await readFile(path.join(root, 'source/catalog.json'), 'utf8'));
let bytes = 0;
for (const template of catalog) {
  const original = path.join(root, 'public', template.image);
  for (const size of [360, 720]) {
    const poster = await sharp(original).resize(size, size, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    await writeFile(original.replace('.webp', `.${size}.webp`), poster);
    bytes += poster.length;
  }
}
console.log(`${catalog.length * 2} responsive posters: ${(bytes / 1024 / 1024).toFixed(2)} MB total`);
