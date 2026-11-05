import { copyFile, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Next.js on Windows can export nested RSC segment paths while the client asks
// for dot-separated filenames. Keep the original payloads and provide their
// expected flat names. Linux/macOS exports already have these names (no-op).
// Upstream: https://github.com/vercel/next.js/issues/85374
export async function normalizeStaticSegments(outputDirectory) {
  const root = path.resolve(outputDirectory);
  let copied = 0;
  async function collectSegments(directory, routeDirectory, parts) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const source = path.join(directory, entry.name);
      const segments = [...parts, entry.name];
      if (entry.isDirectory()) await collectSegments(source, routeDirectory, segments);
      else if (entry.isFile() && entry.name.endsWith('.txt')) {
        const target = path.join(routeDirectory, segments.join('.'));
        const existing = await readFile(target).catch(error => { if (error.code !== 'ENOENT') throw error; return null; });
        if (existing) {
          if (!existing.equals(await readFile(source))) throw new Error(`Conflicting RSC export: ${target}`);
        } else { await copyFile(source, target); copied++; }
      }
    }
  }
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const child = path.join(directory, entry.name);
      if (entry.name.startsWith('__next.')) await collectSegments(child, directory, [entry.name]);
      else if (entry.name !== '_next' && entry.name !== 'assets') await visit(child);
    }
  }
  await visit(root);
  return copied;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  console.log(`Static export: normalized ${await normalizeStaticSegments('out')} Windows RSC paths.`);
}
