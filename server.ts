import { createHash, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Snapshot } from './shared/types';

const PORT = Number(process.env.PORT ?? 3000);
const DIST = join(import.meta.dirname, 'dist');
const DATA_FILE = process.env.DATA_FILE ?? join(import.meta.dirname, 'data', 'overlays.json');

type StoredOverlay = { writeKeyHash: string; snapshot: Snapshot };

// In-memory store; optionally backed by a JSON file on disk.
const store = new Map<string, StoredOverlay>();

function loadFromDisk() {
  if (!existsSync(DATA_FILE)) return;
  try {
    const raw = readFileSync(DATA_FILE, 'utf8');
    const entries = JSON.parse(raw) as [string, StoredOverlay][];
    for (const [k, v] of entries) store.set(k, v);
    console.log(`Loaded ${store.size} overlay(s) from ${DATA_FILE}`);
  } catch {
    console.warn('Could not load data file; starting with empty store.');
  }
}

async function saveToDisk() {
  try {
    const dir = DATA_FILE.slice(0, DATA_FILE.lastIndexOf('/') + 1 || DATA_FILE.lastIndexOf('\\') + 1);
    if (dir) {
      const { mkdir } = await import('node:fs/promises');
      await mkdir(dir, { recursive: true });
    }
    await writeFile(DATA_FILE, JSON.stringify([...store.entries()]), 'utf8');
  } catch {
    // Non-fatal — state lives in memory either way.
  }
}

function isSnapshot(value: unknown): value is Snapshot {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<Snapshot>;
  return (
    Array.isArray(data.speakers) &&
    !!data.settings &&
    (typeof data.selectedSpeakerId === 'string' || data.selectedSpeakerId === null) &&
    !!data.live &&
    typeof data.live.visible === 'boolean' &&
    typeof data.live.cue === 'number'
  );
}

function safeHashEqual(left: string, right: string) {
  const leftBytes = Buffer.from(left, 'hex');
  const rightBytes = Buffer.from(right, 'hex');
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

function mimeFor(path: string) {
  const dot = path.lastIndexOf('.');
  return dot >= 0 ? (MIME[path.slice(dot)] ?? 'application/octet-stream') : 'application/octet-stream';
}

function serveStatic(pathname: string, res: import('node:http').ServerResponse) {
  // SPA fallback: /control and /overlay → index.html
  const isSpa = pathname === '/control' || pathname === '/overlay' || pathname === '/';
  const filePath = isSpa ? join(DIST, 'index.html') : join(DIST, pathname.replace(/^\//, ''));

  // Prevent path traversal
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403); res.end(); return;
  }

  if (!existsSync(filePath)) {
    // Final fallback for any unknown route → index.html
    const idx = join(DIST, 'index.html');
    if (!existsSync(idx)) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(readFileSync(idx));
    return;
  }

  res.writeHead(200, { 'Content-Type': mimeFor(filePath) });
  res.end(readFileSync(filePath));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost`);
  const pathname = url.pathname;

  res.setHeader('Cache-Control', 'no-store, max-age=0');

  // ── API ──────────────────────────────────────────────────────────────────
  if (pathname === '/api/overlay') {
    const channel = url.searchParams.get('channel');
    if (!channel || !/^[a-f0-9]{32}$/i.test(channel)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid overlay channel.' }));
      return;
    }

    if (req.method === 'GET') {
      const stored = store.get(channel);
      if (!stored) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Overlay channel not found.' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ snapshot: stored.snapshot }));
      return;
    }

    if (req.method === 'PUT') {
      const writeKey = req.headers['x-overlay-write-key'];
      if (typeof writeKey !== 'string' || !/^[a-f0-9]{64}$/i.test(writeKey)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid write key.' }));
        return;
      }

      const body = await new Promise<string>((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        req.on('error', reject);
      });

      if (Buffer.byteLength(body) > 48_000) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid overlay snapshot.' }));
        return;
      }

      let snapshot: unknown;
      try { snapshot = JSON.parse(body); } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid overlay snapshot.' }));
        return;
      }

      if (!isSnapshot(snapshot)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid overlay snapshot.' }));
        return;
      }

      const writeKeyHash = createHash('sha256').update(writeKey).digest('hex');
      const existing = store.get(channel);
      if (existing && !safeHashEqual(existing.writeKeyHash, writeKeyHash)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not authorized to update this overlay.' }));
        return;
      }

      store.set(channel, { writeKeyHash: existing?.writeKeyHash ?? writeKeyHash, snapshot });
      void saveToDisk();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    res.setHeader('Allow', 'GET, PUT');
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }

  // ── Static files ─────────────────────────────────────────────────────────
  serveStatic(pathname, res);
});

loadFromDisk();
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
