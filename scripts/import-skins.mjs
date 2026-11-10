import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const decodeHtml = value => value.replaceAll('&quot;', '"').replaceAll('&#039;', "'").replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');

// Parse the public Laravel/Alpine initializer as data, without evaluating code.
function parseLiteral(expression) {
  const value = expression.trim();
  if (value.startsWith('JSON.parse(') && value.endsWith(')')) return JSON.parse(parseLiteral(value.slice(11, -1)));
  if (value.startsWith("'") && value.endsWith("'")) return JSON.parse('"' + value.slice(1, -1).replaceAll('"', '\\"').replaceAll("\\'", "'") + '"');
  if (/^(null|true|false|-?\d+(\.\d+)?)$/.test(value)) return JSON.parse(value);
  if (value === '[]' || value === '{}') return JSON.parse(value);
  throw new Error(`Unexpected public preview initializer: ${value.slice(0, 120)}`);
}

function parseArguments(raw) {
  const args = [];
  let start = 0, level = 0, quote = null;
  for (let index = 0; index < raw.length; index++) {
    const char = raw[index];
    if (quote) { if (char === '\\') index++; else if (char === quote) quote = null; }
    else if (char === "'" || char === '"') quote = char;
    else if (char === '(') level++;
    else if (char === ')') {
      if (level === 0) { args.push(parseLiteral(raw.slice(start, index))); return args; }
      level--;
    } else if (char === ',' && level === 0) { args.push(parseLiteral(raw.slice(start, index))); start = index + 1; }
  }
  throw new Error('Incomplete public preview initializer');
}

export function parseTemplateSkins(html, sourceUrl) {
  const initializer = html.match(/x-data="stylePreviewChat\(([\s\S]*?)"/);
  if (!initializer) throw new Error(`Missing public preview data: ${sourceUrl}`);
  const [baseValues, skins, baseVariables, baseHtml] = parseArguments(decodeHtml(initializer[1]));
  if (!Array.isArray(skins) || !baseValues || typeof baseHtml !== 'string' || typeof baseVariables !== 'string') throw new Error(`Invalid skin data: ${sourceUrl}`);
  const skinIds = new Set();
  for (const skin of skins) {
    if (!Number.isInteger(skin.id) || !skin.name || !skin.slug || skinIds.has(skin.id)) throw new Error(`Invalid/duplicate skin: ${sourceUrl}`);
    if (!html.includes(`id: ${skin.id }`)) throw new Error(`Skin missing from public list: ${skin.id}`);
    skinIds.add(skin.id);
  }
  // ChatStyle emits font definitions before the template stylesheet. Keep both;
  // the first style block alone would omit the template's structural CSS.
  const afterInitializer = html.slice(initializer.index);
  const beforeSkins = afterInitializer.split(/<style\s+id="skin-css-/)[0];
  const baseCss = [...beforeSkins.matchAll(/<style>([\s\S]*?)<\/style>/g)]
    .map(match => match[1]).filter(css => /@font-face|\.cs-bubble|\.cs-chat/.test(css)).join('\n');
  if (!baseCss) throw new Error(`Missing original template CSS: ${sourceUrl}`);
  const stylesheetUrls = [...html.matchAll(/<link\b[^>]*href="([^"]+)"[^>]*>/g)].map(match => new URL(decodeHtml(match[1]), sourceUrl).href);
  const frameworkUrl = stylesheetUrls.find(url => url.includes('/overlay/framework.css'));
  const animationUrl = stylesheetUrls.find(url => url.includes('/overlay/animations.css'));
  if (!frameworkUrl) throw new Error(`Missing overlay framework: ${sourceUrl}`);
  return { baseValues, baseVariables, baseHtml, baseCss, skins, frameworkUrl, animationUrl, appCssUrl: stylesheetUrls.find(url => /\/build\/assets\/app-[^/]+\.css/.test(url)) };
}

function sanitizeMarkup(markup) {
  return markup.replace(/<(script|iframe|object|embed)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|iframe|object|embed|link|meta|base)\b[^>]*\/?\s*>/gi, '')
    .replace(/\s(?:on[a-z]+|x-[\w:.-]+)\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/\s(?:href|src)\s*=\s*(["'])\s*(?:javascript|vbscript):[\s\S]*?\1/gi, '');
}

function bubbleClasses(values) {
  const classes = ['cs-avatar-position-' + (values['avatar.position'] ?? 'right'), 'cs-username-position-' + (values['username.position'] ?? 'above-message'), 'cs-badges-position-' + (values['badges.position'] ?? 'before-name'), 'cs-direction-' + (values['bubble.direction'] ?? 'ltr'), 'cs-platform-twitch'];
  for (const element of ['avatar', 'badges', 'pronouns', 'accent', 'events']) if (values[`${element}.show`] === false || values[`${element}.show`] === 0 || values[`${element}.show`] === '0') classes.push(`cs-${element}-hidden`);
  return classes.join(' ');
}

// Neo Tokyo's entrance animations otherwise leave real text hidden when motion is disabled.
export const reducedMotionTextFix = '@media(prefers-reduced-motion:reduce){.skin-content .nt-username-real,.skin-content .nt-message-real{opacity:1!important;transform:none!important}}';

export function renderSkinDocument({ templateName, skin, baseHtml, baseCss, fontCss, frameworkPath, animationPath, values, variables }) {
  const sample = {
    username: 'JesusTenG', message: 'So sieht dein Chat aus.', timestamp: '21:08', pronouns: '', broadcaster: 'JesusTenG', usercolor: '#9b59b6',
    avatar: '<img alt="" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Crect width=%2240%22 height=%2240%22 fill=%22%23e9b4f0%22/%3E%3Ctext x=%2220%22 y=%2228%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-weight=%22700%22 font-size=%2225%22 fill=%22%23423448%22%3EJ%3C/text%3E%3C/svg%3E">',
    badges: '<img alt="" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 18 18%22%3E%3Crect width=%2218%22 height=%2218%22 rx=%223%22 fill=%22%239146ff%22/%3E%3Cpath d=%22m9 2 2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1Z%22 fill=%22white%22/%3E%3C/svg%3E">',
  };
  let markup = sanitizeMarkup(skin.html_template || baseHtml).replace(/\{\{(\w+)\}\}/g, (_, key) => sample[key] ?? '');
  markup = markup.replace(/class="cs-bubble"(?:\s+style="([^"]*)")?/, (_, inline = '') => `class="cs-bubble ${bubbleClasses(values)}" style="${escapeHtml(variables)}; ${inline}"`);
  if (!markup.includes('cs-bubble ')) throw new Error(`Unsupported bubble markup: ${skin.id}`);
  const css = `${fontCss}\n${baseCss}\n${skin.css_template || ''}`.replace(/<\/style/gi, '<\\/style').replace(/@import[^;]+;/g, '');

  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; script-src 'none'; connect-src 'none'; base-uri 'none'; form-action 'none'"><title>${escapeHtml(templateName)} – ${escapeHtml(skin.name)}</title><link rel="stylesheet" href="${frameworkPath}">${animationPath ? `<link rel="stylesheet" href="${animationPath}">` : ''}<style>${css}
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}*{box-sizing:border-box}body{display:flex;align-items:center;justify-content:center}.skin-content{width:100%;height:auto;max-width:600px;padding:45px 25px;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;zoom:1.35}.skin-content .cs-chat{width:100%;padding:0;max-width:100%;align-items:center;overflow:visible}.skin-content .cs-bubble{animation:none!important;max-width:100%}.sample-avatar{display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-width:24px;min-height:24px;background:#e9b4f0;color:#423448;font:700 16px Arial,sans-serif;border-radius:inherit}.sample-badge{color:#ab65d6;font-size:14px}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}}
${markup.includes('nt-message-real') ? reducedMotionTextFix : ''}
</style></head><body><div class="skin-content"><div class="cs-chat cs-chat--bottom-up cs-align-center">${markup}</div></div></body></html>`;
}

export async function importSkins() {
  const catalog = JSON.parse(await readFile(path.join(projectRoot, 'source/catalog.json'), 'utf8'));
  const assetRoot = path.join(projectRoot, 'public/assets/skins');
  await mkdir(path.join(assetRoot, 'shared'), { recursive: true });
  const requestCache = new Map();
  async function fetchBytes(url) {
    if (!requestCache.has(url)) requestCache.set(url, (async () => {
      let lastError;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await fetch(url, { signal: AbortSignal.timeout(45000), headers: { 'User-Agent': 'ChatOverlays preview import' } });
          if (!response.ok) throw new Error(`${response.status}: ${url}`);
          return { bytes: Buffer.from(await response.arrayBuffer()), type: response.headers.get('content-type') || '' };
        } catch (error) { lastError = error; if (attempt < 2) await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 800)); }
      }
      throw lastError;
    })());
    return requestCache.get(url);
  }
  const localizedAssets = new Map();
  async function localizeAsset(raw, sourceUrl) {
    const url = new URL(decodeHtml(raw), sourceUrl);
    if (url.protocol !== 'https:') throw new Error(`Unexpected asset protocol: ${url}`);
    if (!localizedAssets.has(url.href)) localizedAssets.set(url.href, (async () => {
      const extension = path.extname(url.pathname).toLowerCase();
      if (!['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.otf', '.avif'].includes(extension)) throw new Error(`Unsupported skin asset: ${url}`);
      const filename = createHash('sha256').update(url.href).digest('hex').slice(0, 20) + extension;
      const target = path.join(assetRoot, 'shared', filename);
      if (!(await stat(target).catch(() => null))?.isFile()) {
        const { bytes, type } = await fetchBytes(url.href);
        if (bytes.length < 30 || /text\/html/i.test(type)) throw new Error(`Invalid media response: ${url}`);
        await writeFile(target, bytes);
      }
      return `/assets/skins/shared/${filename}`;
    })());
    return localizedAssets.get(url.href);
  }
  async function localizeCss(css, sourceUrl) {
    let result = css;
    for (const match of [...css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/g)]) {
      const raw = match[2].trim();
      if (!raw || raw.startsWith('data:') || raw.startsWith('#') || raw.includes('var(')) continue;
      result = result.replaceAll(match[0], `url("${await localizeAsset(raw, sourceUrl)}")`);
    }
    return result.replace(/@import[^;]+;/g, '');
  }
  async function localizeHtml(html, sourceUrl) {
    let result = html;
    for (const match of [...html.matchAll(/\bsrc="([^"]+)"/g)]) if (!match[1].startsWith('data:') && !match[1].includes('{{')) result = result.replaceAll(match[0], `src="${await localizeAsset(match[1], sourceUrl)}"`);
    return result;
  }
  const sharedStyles = new Map();
  async function saveStylesheet(url) {
    if (!url) return null;
    if (!sharedStyles.has(url)) sharedStyles.set(url, (async () => {
      const css = (await fetchBytes(url)).bytes.toString('utf8');
      const filename = createHash('sha256').update(url).digest('hex').slice(0, 20) + '.css';
      await writeFile(path.join(assetRoot, 'shared', filename), await localizeCss(css, url));
      return `/assets/skins/shared/${filename}`;
    })());
    return sharedStyles.get(url);
  }
  const result = {}, queue = [...catalog];
  const importedAt = new Date().toISOString();
  await Promise.all(Array.from({ length: 2 }, async () => {
    while (queue.length) {
      const template = queue.shift();
      const html = (await fetchBytes(template.url)).bytes.toString('utf8');
      const parsed = parseTemplateSkins(html, template.url);
      const record = { sourceUrl: template.url, importedAt, sampleText: 'So sieht dein Chat aus.', skins: [] };
      if (parsed.skins.length) {
        const templateDirectory = path.join(assetRoot, template.slug);
        await mkdir(templateDirectory, { recursive: true });
        const frameworkPath = await saveStylesheet(parsed.frameworkUrl);
        const animationPath = await saveStylesheet(parsed.animationUrl);
        const baseCss = await localizeCss(parsed.baseCss, template.url);
        const baseHtml = await localizeHtml(sanitizeMarkup(parsed.baseHtml), template.url);
        const appCss = parsed.appCssUrl ? (await fetchBytes(parsed.appCssUrl)).bytes.toString('utf8') : '';
        const fontCss = await localizeCss([...appCss.matchAll(/@font-face\s*\{[^}]+\}/g)].map(match => match[0]).join('\n'), parsed.appCssUrl || template.url);
        for (const skin of parsed.skins) {
          const localizedSkin = { ...skin, css_template: await localizeCss(skin.css_template || '', template.url), html_template: skin.html_template ? await localizeHtml(sanitizeMarkup(skin.html_template), template.url) : null };
          const preview = `/assets/skins/${template.slug}/${skin.id}.html`;
          await writeFile(path.join(projectRoot, 'public', preview), renderSkinDocument({ templateName: template.name, skin: localizedSkin, baseHtml, baseCss, fontCss, frameworkPath, animationPath, values: { ...parsed.baseValues, ...skin.settings_values }, variables: skin.css_vars || parsed.baseVariables }));
          const image = skin.thumbnail ? await localizeAsset(skin.thumbnail, template.url) : null;
          record.skins.push({ id: skin.id, name: skin.name, slug: skin.slug, url: template.url, preview, image, sourceImage: skin.thumbnail || null });
        }
      }
      result[template.slug] = record;
      console.log(`${template.slug}: ${record.skins.length} skins`);
    }
  }));
  const ordered = Object.fromEntries(catalog.map(template => [template.slug, result[template.slug]]));
  await writeFile(path.join(projectRoot, 'source/skins.json'), JSON.stringify(ordered, null, 2) + '\n');
  const count = Object.values(ordered).reduce((sum, value) => sum + value.skins.length, 0);
  console.log(`Imported ${count} authentic skins across ${catalog.length} templates; ${localizedAssets.size} localized media assets.`);
  return ordered;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await importSkins();
