import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { guideSlugs, guideGroups } from '../source/guides/routes.mjs';
import { locales } from '../lib/routing.mjs';

test('guide translations cover every topic and reference real templates and exact skins', async () => {
  const catalog = JSON.parse(await readFile('source/catalog.json', 'utf8'));
  const community = JSON.parse(await readFile('source/free-templates.json', 'utf8'));
  const examples = [...catalog, ...community.templates];
  const skins = JSON.parse(await readFile('source/skins.json', 'utf8'));
  const bundles = await Promise.all(locales.map(async locale => {
    const base = JSON.parse(await readFile(`source/guides/${locale}.json`, 'utf8'));
    const setup = JSON.parse(await readFile(`source/guides/setup.${locale}.json`, 'utf8'));
    assert.equal(Object.keys(setup).length, 10);
    const makeover = JSON.parse(await readFile(`source/guides/makeover.${locale}.json`, 'utf8'));
    const platform = JSON.parse(await readFile(`source/guides/platform.${locale}.json`, 'utf8'));
    return { ...base, articles: { ...base.articles, ...setup, 'chat-overlay-before-after': makeover, ...platform } };
  }));
  assert.deepEqual(guideGroups.flatMap(group => group.slugs).sort(), [...guideSlugs].sort(), 'Every guide appears in exactly one group');
  const titles = new Set(), descriptions = new Set();
  for (const bundle of bundles) {
    assert.deepEqual(Object.keys(bundle.articles), guideSlugs);
    assert.deepEqual(Object.keys(bundle.ui), Object.keys(bundles[0].ui));
    assert(Object.values(bundle.ui).every(value => typeof value === 'string' && value.trim()));
    for (const slug of guideSlugs) {
      const guide = bundle.articles[slug];
      assert(!titles.has(guide.title)); titles.add(guide.title);
      assert(!descriptions.has(guide.description)); descriptions.add(guide.description);
      assert(guide.steps.length >= 3 && guide.examples.length >= 2);
      assert(guide.faq.length >= 4, `FAQ coverage: ${slug}`);
      assert.equal(guide.faq.length, bundles[0].articles[slug].faq.length, `Translated FAQs: ${slug}`);
      assert.equal(new Set(guide.faq.map(([question]) => question)).size, guide.faq.length);
      assert.equal(Boolean(guide.stepsFirst), Boolean(bundles[0].articles[slug].stepsFirst));
      if (slug === 'free-twitch-chat-overlays') { assert(guide.communityExamples); assert(guide.examples.every(example => examples.find(template => template.slug === example.slug)?.free), 'Free guide must only feature free templates'); }
      if (guide.reference) {
        assert(guide.reference.columns.length >= 2 && guide.reference.rows.length >= 3);
        assert(guide.reference.rows.every(row => row.length === guide.reference.columns.length && row.every(value => value.trim())));
      }
      assert(guide.steps.every(step => step.length === 2 && step.every(value => value.trim())));
      assert.deepEqual(guide.examples.map(({ slug, skinId }) => [slug, skinId]), bundles[0].articles[slug].examples.map(({ slug, skinId }) => [slug, skinId]));
      for (const example of guide.examples) {
        assert(examples.some(template => template.slug === example.slug), `Unknown example: ${example.slug}`);
        if (example.skinId) assert(skins[example.slug].skins.some(skin => skin.id === example.skinId), `Unknown skin: ${example.slug}/${example.skinId}`);
      }
      assert(guide.related.every(related => related !== slug && guideSlugs.includes(related)));
      assert(guide.sources.every(source => new URL(source.url).protocol === 'https:'));
    }
  }
  assert(community.templates.every(template => template.free && template.url.startsWith('https://chatstyle.gg/template/')));
  assert(community.templates.some(template => !catalog.some(local => local.slug === template.slug)), 'Community collection must include other creators');
  assert.equal(new Set(community.templates.map(template => template.slug)).size, community.templates.length);
  for (const template of community.templates) {
    for (const suffix of ['', '.360', '.720']) {
      const bytes = await readFile(`public${template.image.replace('.webp', `${suffix}.webp`)}`);
      assert.equal(bytes.subarray(8, 12).toString(), 'WEBP', `Community poster: ${template.slug}${suffix}`);
    }
    if (template.video) assert.equal((await readFile(`public${template.video}`)).subarray(0, 4).toString('hex'), '1a45dfa3');
  }
});
