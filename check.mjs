import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { categories } from './source/editorial.mjs';
import { locales, localizePath } from './lib/routing.mjs';
import { guidesPath, guideSlugs, articlePath } from './source/guides/routes.mjs';

const root = path.resolve('out');
const config = JSON.parse(await readFile('site.config.json', 'utf8'));
const original = JSON.parse(await readFile('source/catalog.json', 'utf8'));
const catalog = JSON.parse(await readFile('out/assets/catalog.json', 'utf8'));
const skinCatalog = JSON.parse(await readFile('source/skins.json', 'utf8'));
const baseRoutes = ['/', ...catalog.map(item => `/overlays/${item.slug}/`), ...categories.map(item => `/styles/${item.slug}/`), '/ratgeber/chat-overlay-auswaehlen/', guidesPath, ...guideSlugs.map(articlePath)];
const entries = locales.flatMap(locale => baseRoutes.map(base => ({ locale, base, route: localizePath(base, locale) })));
const routes = entries.map(entry => entry.route);
const files = [...entries.map(entry => ({ ...entry, file: path.join(root, entry.route, 'index.html') })), { locale: 'en', base: '/404.html', route: '/404.html', file: path.join(root, '404.html') }];
const titles = new Set(), descriptions = new Set();
let links = 0, shopLinks = 0;

for (const { file, locale, base, route } of files) {
  const html = await readFile(file, 'utf8');
  assert(html.includes(`<html lang="${locale}"`), `Server-rendered document language: ${file}`);
  assert(!html.includes('<dialog'), `Preview modal must remain removed: ${file}`);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${file}: H1`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  assert(title && !titles.has(title), `Missing/duplicate title: ${file}`); titles.add(title);
  assert(description && !descriptions.has(description), `Missing/duplicate description: ${file}`); descriptions.add(description);
  const robots = [...html.matchAll(/<meta name="robots" content="([^"]*)"/g)].map(match => match[1]);
  assert(robots.some(value => config.indexable ? /(^|,\s*)index(,|$)/.test(value) : value.includes('noindex')), `Robots: ${file}`);
  assert(html.includes(`rel="canonical" href="${config.origin}${route}"`), `Canonical: ${file}`);
  if (base !== '/404.html') {
    for (const lang of [...locales, 'x-default']) {
      const alternate = localizePath(base, lang === 'x-default' ? 'en' : lang);
      assert(new RegExp(`hreflang="${lang}" href="${config.origin}${alternate}"`, 'i').test(html), `Language alternate ${lang}: ${file}`);
    }
    assert(html.includes(`"inLanguage":"${locale}"`), `Structured data language: ${file}`);
  }
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  assert(schemas.length, `JSON-LD: ${file}`);
  schemas.forEach(match => JSON.parse(match[1]));
  for (const [, attr, url] of html.matchAll(/(href|src)="([^"]+)"/g)) {
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
    let target = path.join(root, pathname);
    if (!path.extname(target)) target = path.join(target, 'index.html');
    assert((await stat(target).catch(() => null))?.isFile(), `Broken ${attr}: ${url} in ${file}`); links++;
  }
  for (const [, attributes, body] of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    if (!attributes.includes('https://chatstyle.gg/')) continue;
    assert(body.includes('/assets/chatstyle-logo.svg'), `ChatStyle logo missing: ${file}`); shopLinks++;
  }
}
assert.equal(catalog.length, 40);
assert.equal(routes.length, new Set(routes).size, 'Every localized route must be unique');
assert.equal(guideSlugs.length, 18, 'Existing guides, makeover and two ChatStyle guides');
for (const item of catalog) {
  assert.equal(item.url, original.find(source => source.slug === item.slug)?.url, `Changed destination: ${item.slug}`);
  assert.equal(new URL(item.shopUrl).pathname, new URL(item.url).pathname);
  const image = await readFile(path.join(root, item.image));
  assert.equal(image.subarray(8, 12).toString(), 'WEBP');
  for (const width of [360, 720]) {
    const poster = await readFile(path.join(root, item.image.replace('.webp', `.${width}.webp`)));
    assert.equal(poster.subarray(8, 12).toString(), 'WEBP', `Responsive poster: ${item.slug}/${width}`);
  }
  const video = await readFile(path.join(root, item.video));
  assert.equal(video.subarray(0, 4).toString('hex'), '1a45dfa3');
  const skins = skinCatalog[item.slug].skins;
  for (const locale of locales) {
    const detail = await readFile(path.join(root, localizePath(`/overlays/${item.slug}/`, locale), 'index.html'), 'utf8');
    assert.equal((detail.match(/class="skin-option"/g) || []).length, skins.length, `Skin choices: ${locale}/${item.slug}`);
    for (const skin of skins) {
      const preview = locale === 'de' ? skin.preview : skin.preview.replace('.html', `.${locale}.html`);
      const html = await readFile(path.join(root, preview), 'utf8');
      assert(html.includes(`<html lang="${locale}"`), `Localized skin preview: ${preview}`);
    }
  }
  for (const skin of skins) {
    const html = await readFile(path.join(root, skin.preview), 'utf8');
    assert(html.includes('Content-Security-Policy'), `Skin preview isolation: ${skin.preview}`);
    for (const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      if (url.startsWith('data:') || url.startsWith('#')) continue;
      assert(url.startsWith('/assets/skins/'), `External skin asset: ${url}`);
      assert((await stat(path.join(root, url))).isFile(), `Missing exported skin asset: ${url}`);
    }
  }
}
const sitemap = await readFile('out/sitemap.xml', 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, routes.length);
for (const route of routes) assert(sitemap.includes(`${config.origin}${route}</loc>`), `Missing sitemap route: ${route}`);
for (const locale of locales) {
  const home = await readFile(path.join(root, localizePath('/', locale), 'index.html'), 'utf8');
  assert.equal((home.match(/data-template="true"/g) || []).length, 40, 'All templates must be present in server-rendered HTML');
  assert(home.includes('/_next/'), 'Next.js assets missing');
}
const skinCount = Object.values(skinCatalog).reduce((sum, record) => sum + record.skins.length, 0);
console.log(`PASS: ${files.length} pages; ${links} local links/assets; ${shopLinks} branded ChatStyle links; 40 original destinations; 80 media files; ${skinCount} skin previews; metadata, JSON-LD and sitemap.`);
