import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { normalizeStaticSegments } from '../scripts/fix-static-export.mjs';

test('Windows segment payloads resolve at the URLs requested by Next.js', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'chatoverlays-export-'));
  try {
    const route = path.join(root, 'overlays', 'lofi-windows-93');
    const nested = path.join(route, '__next.overlays', '$d$slug');
    await mkdir(nested, { recursive: true });
    await writeFile(path.join(nested, '__PAGE__.txt'), 'original RSC payload');
    await writeFile(path.join(route, '__next._tree.txt'), 'tree payload');
    await mkdir(path.join(root, 'assets', '__next.not-a-route'), { recursive: true });
    await writeFile(path.join(root, 'assets', '__next.not-a-route', 'file.txt'), 'asset');
    assert.equal(await normalizeStaticSegments(root), 1);
    assert.equal(await readFile(path.join(route, '__next.overlays.$d$slug.__PAGE__.txt'), 'utf8'), 'original RSC payload');
    assert.equal(await readFile(path.join(route, '__next._tree.txt'), 'utf8'), 'tree payload');
    assert.equal(await normalizeStaticSegments(root), 0, 'Repeated builds are safe');
    assert.equal(await stat(path.join(root, 'assets', '__next.not-a-route.file.txt')).catch(() => null), null);
    await writeFile(path.join(route, '__next.overlays.$d$slug.__PAGE__.txt'), 'different payload');
    await assert.rejects(normalizeStaticSegments(root), /Conflicting RSC export/);
  } finally {
    // mkdtemp returns this test's own absolute directory beneath the OS temp root.
    assert(path.resolve(root).startsWith(path.resolve(tmpdir()) + path.sep));
    assert(path.basename(root).startsWith('chatoverlays-export-'));
    await rm(root, { recursive: true, force: true });
  }
});
