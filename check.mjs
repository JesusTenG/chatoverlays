import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');const config=JSON.parse(await readFile('site.config.json','utf8'));const catalog=JSON.parse(await readFile('dist/assets/catalog.json','utf8'));
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});return(await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name)))).flat()}
const htmlFiles=(await walk(root)).filter(f=>f.endsWith('.html'));
const titles=new Set();const descriptions=new Set();let links=0;
for(const file of htmlFiles){const html=await readFile(file,'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: H1`);const title=html.match(/<title>(.*?)<\/title>/)[1];assert(!titles.has(title),`Duplicate title: ${title}`);titles.add(title);const description=html.match(/<meta name="description" content="([^"]*)"/)[1];assert(!descriptions.has(description),`Duplicate description: ${title}`);descriptions.add(description);assert(html.includes(`content="${config.indexable?'index,follow':'noindex,follow'}"`));JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert(html.includes(`rel="canonical" href="${config.origin}`));
 for(const [,attr,url] of html.matchAll(/(href|src)="([^"]+)"/g)){if(!url.startsWith('/')||url.startsWith('//'))continue;const pathname=url.split(/[?#]/)[0];let target=path.join(root,pathname);if(!path.extname(target))target=path.join(target,'index.html');assert((await stat(target).catch(()=>null))?.isFile(),`Broken ${attr}: ${url} in ${file}`);links++;}
}
assert.equal(catalog.length,40);assert.equal(htmlFiles.length,48);
const creator=await readFile('source/creator.html','utf8');
for(const t of catalog){assert(creator.includes(`href="${t.url}"`),`Unverified shop URL: ${t.slug}`);assert.equal(new URL(t.shopUrl).pathname,new URL(t.url).pathname);const image=await readFile(path.join(root,t.image));assert.equal(image.subarray(8,12).toString(),'WEBP');const video=await readFile(path.join(root,t.video));assert.equal(video.subarray(0,4).toString('hex'),'1a45dfa3');}
const sitemap=await readFile('dist/sitemap.xml','utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,47);
console.log(`PASS: ${htmlFiles.length} HTML pages; ${links} internal links/assets; 40 verified Chatstyle targets; 80 valid media files; unique metadata, JSON-LD and sitemap.`);
