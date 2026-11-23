import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

// Public catalog only. Keep its explicit Free status, not a price inferred from prose.
const decode = s => s.replaceAll('&quot;', '"').replaceAll('&#039;', "'").replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const response = await fetch('https://chatstyle.gg/templates');
if (!response.ok) throw new Error(`Catalog: ${response.status}`);
const html = await response.text();
const rows = [...html.matchAll(/x-show="matchesStyle\((.*?)\)"[\s\S]*?<article\b([\s\S]*?)<\/article>/g)];
if (!rows.length) throw new Error('Catalog markup changed; inspect before importing.');
const existing = JSON.parse(await readFile('source/catalog.json', 'utf8'));
const templates = rows.map(([, raw, block]) => {
  const data = JSON.parse(decode(raw));
  if (data.availability !== 'free') return null;
  const url = decode(block.match(/href="(https:\/\/chatstyle\.gg\/template\/[^"?]+)"/)?.[1] ?? '');
  const sourceImage = block.match(/src="(https:\/\/cdn\.chatstyle\.gg\/[^" ]+\.webp)"/)?.[1];
  const sourceVideo = block.match(/data-src="(https:\/\/cdn\.chatstyle\.gg\/[^" ]+\.webm)"/)?.[1] ?? null;
  if (!url || !sourceImage) throw new Error(`Incomplete media: ${data.name}`);
  const slug = new URL(url).pathname.split('/').pop();
  const local = existing.find(t => t.slug === slug);
  return { id: data.id, name: data.name.trim(), slug, url, free: true, tags: data.tags, sourceImage, sourceVideo, image: local?.image ?? `/assets/community/${slug}.webp`, video: local?.video ?? (sourceVideo ? `/assets/community/${slug}.webm` : null), localDetail: Boolean(local) };
}).filter(Boolean);
if (new Set(templates.map(t => t.slug)).size !== templates.length) throw new Error('Duplicate templates');
await mkdir('public/assets/community', { recursive: true });
const jobs = templates.filter(t => !t.localDetail);
await Promise.all(Array.from({ length: 3 }, async () => {
  while (jobs.length) {
    const t = jobs.shift();
    for (const [remote, target] of [[t.sourceImage, t.image], [t.sourceVideo, t.video]]) {
      if (!remote || await stat(`public${target}`).then(s => s.size > 100).catch(() => false)) continue;
      const r = await fetch(remote, { signal: AbortSignal.timeout(60000) });
      if (!r.ok) throw new Error(`Media ${r.status}: ${remote}`);
      await writeFile(`public${target}`, Buffer.from(await r.arrayBuffer()));
    }
    for (const width of [360, 720]) await sharp(`public${t.image}`).resize(width, width, { fit: 'inside' }).webp({ quality: 84 }).toFile(`public${t.image.replace('.webp', `.${width}.webp`)}`);
  }
}));
await writeFile('source/free-templates.json', JSON.stringify({ sourceUrl: 'https://chatstyle.gg/templates', checkedAt: '2026-11-12', catalogCount: rows.length, templates }, null, 2) + '\n');
console.log(`Imported ${templates.length} Free templates from ${rows.length} public catalog entries.`);
