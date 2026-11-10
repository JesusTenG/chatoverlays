import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { guideSlugs } from '../source/guides/routes.mjs';
import { locales } from '../lib/routing.mjs';

test('guide translations cover every topic and reference real templates and exact skins', async () => {
  const catalog = JSON.parse(await readFile('source/catalog.json', 'utf8'));
  const skins = JSON.parse(await readFile('source/skins.json', 'utf8'));
  const bundles = await Promise.all(locales.map(async locale => JSON.parse(await readFile(`source/guides/${locale}.json`, 'utf8'))));
  const titles = new Set(), descriptions = new Set();
  for (const bundle of bundles) {
    assert.deepEqual(Object.keys(bundle.articles), guideSlugs);
    assert.deepEqual(Object.keys(bundle.ui), Object.keys(bundles[0].ui));
    assert(Object.values(bundle.ui).every(value => typeof value === 'string' && value.trim()));
    for (const slug of guideSlugs) {
      const guide = bundle.articles[slug];
      assert(!titles.has(guide.title)); titles.add(guide.title);
      assert(!descriptions.has(guide.description)); descriptions.add(guide.description);
      assert(guide.steps.length >= 3 && guide.examples.length >= 3);
      assert(guide.steps.every(step => step.length === 2 && step.every(value => value.trim())));
      assert.deepEqual(guide.examples.map(({ slug, skinId }) => [slug, skinId]), bundles[0].articles[slug].examples.map(({ slug, skinId }) => [slug, skinId]));
      for (const example of guide.examples) {
        assert(catalog.some(template => template.slug === example.slug), `Unknown example: ${example.slug}`);
        if (example.skinId) assert(skins[example.slug].skins.some(skin => skin.id === example.skinId), `Unknown skin: ${example.slug}/${example.skinId}`);
      }
      assert(guide.related.every(related => related !== slug && guideSlugs.includes(related)));
      assert(guide.sources.every(source => new URL(source.url).protocol === 'https:'));
    }
  }
});
