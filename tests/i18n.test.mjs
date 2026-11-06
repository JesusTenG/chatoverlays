import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { locales, localizePath, stripLocale, switchLanguageUrl } from '../lib/routing.mjs';

test('English is unprefixed; language switches preserve the current page, filters and section', () => {
  assert.equal(localizePath('/', 'en'), '/');
  assert.equal(localizePath('/', 'de'), '/de/');
  assert.equal(localizePath('/de/overlays/neo-tokyo/', 'es'), '/es/overlays/neo-tokyo/');
  assert.equal(localizePath('/es/overlays/neo-tokyo/', 'en'), '/overlays/neo-tokyo/');
  assert.equal(switchLanguageUrl('https://example.com/de/?style=retro-pixel&q=Neo#templates', 'es'), '/es/?style=retro-pixel&q=Neo#templates');
  assert.equal(switchLanguageUrl('/es/ratgeber/chat-overlay-auswaehlen/#tips', 'en'), '/ratgeber/chat-overlay-auswaehlen/#tips');
  assert.equal(stripLocale('/design/'), '/design/');
  assert.equal(stripLocale('/esoteric/'), '/esoteric/');
});

test('all dictionaries have matching keys, nonempty text and interpolation placeholders', async () => {
  const dictionaries = await Promise.all(locales.map(async locale => JSON.parse(await readFile(`source/locales/${locale}.json`, 'utf8'))));
  function leaves(value, prefix = '') {
    return Object.entries(value).flatMap(([key, child]) => typeof child === 'string' ? [[`${prefix}${key}`, child]] : leaves(child, `${prefix}${key}.`));
  }
  const base = new Map(leaves(dictionaries[0]));
  for (const dictionary of dictionaries) {
    const current = new Map(leaves(dictionary));
    assert.deepEqual([...current.keys()], [...base.keys()]);
    for (const [key, value] of current) {
      assert(value.trim().length > 0, `Empty translation: ${key}`);
      assert.deepEqual(value.match(/\{\w+\}/g), base.get(key).match(/\{\w+\}/g), `Placeholders: ${key}`);
    }
  }
});

test('all 40 template descriptions and design notes exist in English and Spanish', async () => {
  const catalog = JSON.parse(await readFile('source/catalog.json', 'utf8'));
  for (const locale of ['en', 'es']) {
    const notes = JSON.parse(await readFile(`source/editorial.${locale}.json`, 'utf8'));
    assert.deepEqual(Object.keys(notes).sort(), catalog.map(item => item.slug).sort());
    for (const item of catalog) {
      assert.equal(notes[item.slug].length, 2);
      assert(notes[item.slug].every(text => typeof text === 'string' && text.length > 30));
    }
  }
});
