import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
const decode = value => value.replaceAll('&quot;', '"').replaceAll('&#039;', "'").replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const html = await readFile(new URL('./source/creator.html', import.meta.url), 'utf8');
const blocks = [...html.matchAll(/x-show="matchesStyle\((.*?)\)"[\s\S]*?<article\b([\s\S]*?)<\/article>/g)];
const catalog = blocks.map(([, raw, block]) => {
  const data = JSON.parse(decode(raw));
  const url = decode(block.match(/href="(https:\/\/chatstyle\.gg\/template\/[^"?]+)"/)[1]);
  const image = block.match(/src="(https:\/\/cdn\.chatstyle\.gg\/[^" ]+\.webp)"/)[1];
  const video = block.match(/data-src="(https:\/\/cdn\.chatstyle\.gg\/[^" ]+\.webm)"/)?.[1];
  const slug = new URL(url).pathname.split('/').pop();
  return { id: data.id, name: data.name.trim(), slug, url, tags: data.tags, free: data.availability === 'free', sourceImage: image, sourceVideo: video, image: `/assets/templates/${slug}.webp`, video: video ? `/assets/templates/${slug}.webm` : null };
});
if (catalog.length !== 40 || new Set(catalog.map(t => t.slug)).size !== 40) throw new Error(`Unexpected catalog: ${catalog.length}. Check source before import.`);
await writeFile(new URL('./source/catalog.json', import.meta.url), JSON.stringify(catalog, null, 2));
console.log(`Parsed ${catalog.length} templates by JesusTenG.`);
if (process.argv.includes('--download')) {
  await mkdir(new URL('./public/assets/templates/', import.meta.url), { recursive: true });
  const jobs = catalog.flatMap(t => [[t.sourceImage, t.image], [t.sourceVideo, t.video]]).filter(([url]) => url);
  let total = 0;
  await Promise.all(Array.from({length: 4}, async () => {
    while(jobs.length) {
      const [url, file] = jobs.shift();
      const target = new URL(`./public${file}`, import.meta.url);
      if (await stat(target).then(s=>s.size > 100).catch(()=>false)) continue;
      const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error(`${response.status}: ${url}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 100) throw new Error(`Empty media: ${url}`);
      await writeFile(target, bytes);
      total += bytes.length;
    }
  }));
  console.log(`Media downloaded: ${(total/1024/1024).toFixed(1)} MB`);
}
