import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// References were read from the original public base previews on 2026-11-23.
// Compare their CSS, markup and settings before reusing the already localized assets.
const references = JSON.parse(await readFile('source/base-preview-reference.json', 'utf8'));
const skins = JSON.parse(await readFile('source/skins.json', 'utf8'));
const fingerprint = text => {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 16777619); }
  return (hash >>> 0).toString(16);
};
const normalizeCss = css => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\([^)]*\)/g, 'url(asset)').replace(/\s+/g, '');
const decode = value => value.replaceAll('&quot;', '"').replaceAll('&#039;', "'").replaceAll('&amp;', '&');
const normalizeVars = css => decode(css).replace(/\s+/g, '').replace(/;+$/, '');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const records = {};
for (const [slug, reference] of Object.entries(references)) {
  const source = skins[slug];
  const docs = await Promise.all(source.skins.map(skin => readFile(path.join('public', skin.preview), 'utf8')));
  const originalCss = docs[0].match(/<style>([\s\S]*?)<\/style>/)[1];
  let baseCss;
  let marker = -1;
  while ((marker = originalCss.indexOf(reference.cssEnd, marker + 1)) >= 0) {
    const candidate = originalCss.slice(0, marker + reference.cssEnd.length);
    if (fingerprint(normalizeCss(candidate).slice(-reference.cssLength)) === reference.cssHash) { baseCss = candidate; break; }
  }
  if (!baseCss) throw new Error(`${slug}: cached CSS differs from the verified original base`);
  const previewCss = originalCss.slice(originalCss.indexOf('html,body{margin:0;'));
  const markupDoc = docs.find(doc => {
    const body = doc.split('<div class="cs-chat cs-chat--bottom-up cs-align-center">')[1].split('</div></div></body>')[0];
    const normalized = body.replace(/class="cs-bubble [^"]*" style="[^"]*"/, 'class="cs-bubble"')
      .replaceAll('<img alt="" src="/assets/skins/shared/sample-profile.webp">', '')
      .replace(/<img alt="" src="data:image\/svg\+xml,[^"]*">/g, '').replace(/\s+/g, ' ').trim();
    return fingerprint(normalized) === reference.markupHash;
  });
  if (!markupDoc) throw new Error(`${slug}: no cached markup matches the original base`);
  let variables;
  for (const doc of docs) {
    let candidate = decode(doc.match(/class="cs-bubble [^"]*" style="([^"]*)"/)[1]).replace(/;\s*--cs-usercolor:[^;]*;?\s*$/, '');
    for (const [property, value] of Object.entries(reference.variableRestores)) candidate = candidate.replace(new RegExp(`${property}:\\s*[^;]+`), `${property}: ${value}`);
    if (fingerprint(normalizeVars(candidate)) === reference.varsHash) { variables = candidate; break; }
  }
  if (!variables) throw new Error(`${slug}: cached settings differ from the original base`);
  const classes = `cs-bubble cs-avatar-position-${reference.avatar} cs-username-position-above-message cs-badges-position-before-name cs-direction-ltr cs-platform-twitch${reference.avatarVisible ? '' : ' cs-avatar-hidden'} cs-pronouns-hidden`;
  const html = markupDoc.replace(/<style>[\s\S]*?<\/style>/, `<style>${baseCss}\n${previewCss}</style>`)
    .replace(/(<title>[^<]*? – )[^<]+(<\/title>)/, '$1Base$2')
    .replace(/class="cs-bubble [^"]*" style="[^"]*"/, `class="${classes}" style="${escape(variables)}; --cs-usercolor: #9b59b6;"`);
  const preview = `/assets/skins/${slug}/base.html`;
  await writeFile(path.join('public', preview), html);
  records[slug] = { id: `base-${slug}`, name: 'Base', sourceUrl: source.sourceUrl, verifiedAt: '2026-11-23', sampleText: source.sampleText, preview };
  console.log(`${slug}: original CSS, markup and settings verified`);
}
await writeFile('source/base-previews.json', JSON.stringify(records, null, 2) + '\n');
