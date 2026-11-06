import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { parseTemplateSkins, renderSkinDocument } from '../scripts/import-skins.mjs';

const jsonArgument = value => `JSON.parse('${JSON.stringify(value).replaceAll('"', '\\u0022').replaceAll("'", '\\u0027')}')`;
function fixture(skins = []) {
  return `<link rel="stylesheet" href="/overlay/framework.css"><div x-data="stylePreviewChat(${jsonArgument({ 'bubble.width': 570 })}, ${skins.length ? jsonArgument(skins) : '[]'}, '--cs-bubble-width:570px', '<div>Preview</div>', null)"><style>.cs-bubble{color:red}</style>${skins.map(skin => `<button x-on:click="$dispatch('preview-skin', { id: ${skin.id} })">${skin.name}</button>`).join('')}</div>`;
}

test('skin importer reads public initializer data without executing it', () => {
  const sourceUrl = 'https://chatstyle.gg/template/example';
  const data = parseTemplateSkins(fixture([{ id: 42, name: 'Original skin', slug: 'original-skin', css_vars: '', settings_values: {} }]), sourceUrl);
  assert.equal(data.skins[0].name, 'Original skin');
  assert.equal(data.frameworkUrl, 'https://chatstyle.gg/overlay/framework.css');
  assert.deepEqual(parseTemplateSkins(fixture(), sourceUrl).skins, []);
  assert.throws(() => parseTemplateSkins('<html>Login page</html>', sourceUrl), /Missing public preview data/);
  assert.throws(() => parseTemplateSkins(fixture().replace('[],', 'runArbitraryCode(),'), sourceUrl), /Unexpected public preview initializer/);
  const withFonts = fixture().replace('<style>', '<style>@font-face{font-family:Example;src:url(/font.woff2)}</style><style>');
  assert(parseTemplateSkins(withFonts, sourceUrl).baseCss.includes('.cs-bubble{color:red}'), 'Font styles must not hide the template stylesheet');
});

test('generated previews isolate original styles and strip executable markup', () => {
  const html = renderSkinDocument({
    templateName: 'Example', skin: { id: 42, name: 'Rose', css_template: '.cs-bubble{color:pink}', html_template: null },
    baseHtml: '<div class="cs-bubble" onclick="alert(1)">{{username}} {{message}}<script>alert(1)</script></div>',
    baseCss: '.cs-bubble{border:1px solid}', fontCss: '', frameworkPath: '/assets/skins/shared/framework.css', animationPath: null,
    values: { 'bubble.width': 570 }, variables: '--cs-bubble-width:570px',
  });
  assert(html.includes('So sieht dein Chat aus.'));
  assert(html.includes('script-src \'none\''));
  assert(!html.includes('<script'));
  assert(!html.includes('onclick='));
  assert(html.includes('class="skin-content"'));
  assert(html.includes('cs-align-center'));
  assert(!html.includes('<foreignObject'), 'Text must retain readable native sizing on narrow screens');
});

test('all catalog templates have verified skin coverage and local preview assets', async () => {
  const catalog = JSON.parse(await readFile('source/catalog.json', 'utf8'));
  const imported = JSON.parse(await readFile('source/skins.json', 'utf8'));
  assert.equal(Object.keys(imported).length, catalog.length);
  let count = 0;
  for (const template of catalog) {
    const record = imported[template.slug];
    assert.equal(record.sourceUrl, template.url);
    assert(Array.isArray(record.skins));
    assert(Number.isFinite(Date.parse(record.importedAt)));
    assert.equal(new Set(record.skins.map(skin => skin.id)).size, record.skins.length);
    for (const skin of record.skins) {
      assert.equal(skin.url, template.url);
      assert(skin.preview.startsWith(`/assets/skins/${template.slug}/`));
      assert(Number.isInteger(skin.id) && skin.name && skin.slug);
      const previewFile = path.join('public', skin.preview);
      assert((await stat(previewFile)).isFile());
      const html = await readFile(previewFile, 'utf8');
      assert(html.includes('Content-Security-Policy'));
      assert(!/<script\b/i.test(html));
      for (const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
        if (url.startsWith('data:') || url.startsWith('#')) continue;
        assert(url.startsWith('/assets/skins/'), `Unexpected external resource: ${url}`);
        assert((await stat(path.join('public', url))).isFile());
      }
      for (const [, rawUrl] of html.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        if (rawUrl.startsWith('data:') || rawUrl.startsWith('#') || rawUrl.includes('var(')) continue;
        assert(rawUrl.startsWith('/assets/skins/'), `Unexpected CSS asset: ${rawUrl}`);
        assert((await stat(path.join('public', rawUrl))).isFile());
      }
      count++;
    }
  }
  assert(count > 0, 'Skin import must not silently turn every source into an empty result');
});
