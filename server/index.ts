import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import express, { type NextFunction, type Request, type Response } from 'express';
import { DefaultEventsMap, Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import { nextSpeakerId, type Snapshot } from '../shared/types';
import {
  isAuthorized,
  isIncomingCommand,
  parseSettings,
  parseSpeaker,
  Store,
} from './store';

if (existsSync('.env')) process.loadEnvFile('.env');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const controlToken = process.env.CONTROL_TOKEN || null;
if (!controlToken) {
  if (process.env.NODE_ENV === 'production') {
    console.error('CONTROL_TOKEN must be set when NODE_ENV=production.');
    process.exit(1);
  }
  console.warn(
    'CONTROL_TOKEN is not set. Mutation endpoints and Socket.IO commands are unauthenticated. Set CONTROL_TOKEN before exposing this server publicly.',
  );
}

function requireAuth(request: Request, response: Response, next: NextFunction) {
  if (isAuthorized(controlToken, request.headers.authorization)) {
    next();
    return;
  }
  response.status(401).json({ error: 'Not authorized.' });
}

const store = new Store();
const app = express();
const httpServer = createServer(app);
const io = new Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, { authorized: boolean }>(
  httpServer,
  { cors: allowedOrigins.length ? { origin: allowedOrigins } : undefined },
);
const live = { visible: store.get().settings.autoShow, cue: 0 };
const snapshot = (): Snapshot => ({ ...store.get(), live: { ...live } });
const publish = () => io.emit('snapshot', snapshot());

app.use(express.json({ limit: '64kb' }));
app.use('/api', (request, response, next) => {
  const origin = request.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }
  response.setHeader('Cache-Control', 'no-store');
  next();
});

function fail(response: Response, error: unknown) {
  response
    .status(
      error instanceof Error && /could not|ENOENT|EACCES/i.test(error.message)
        ? 500
        : 400,
    )
    .json({ error: error instanceof Error ? error.message : 'Unexpected error.' });
}

app.get('/api/state', (_request, response) => response.json(snapshot()));

app.post('/api/speakers', requireAuth, (request, response) => {
  try {
    const speaker = parseSpeaker(request.body);
    store.update((data) => {
      data.speakers.push(speaker);
      data.selectedSpeakerId = speaker.id;
    });
    publish();
    response.status(201).json(speaker);
  } catch (error) {
    fail(response, error);
  }
});

app.put('/api/speakers/:id', requireAuth, (request, response) => {
  try {
    const id = String(request.params.id);
    if (!store.get().speakers.some((s) => s.id === id))
      return response.status(404).json({ error: 'Speaker not found.' });
    const speaker = parseSpeaker(request.body, id);
    store.update((data) => {
      const index = data.speakers.findIndex((s) => s.id === id);
      data.speakers[index] = speaker;
    });
    publish();
    response.json(speaker);
  } catch (error) {
    fail(response, error);
  }
});

app.delete('/api/speakers/:id', requireAuth, (request, response) => {
  try {
    const id = String(request.params.id);
    if (!store.get().speakers.some((s) => s.id === id))
      return response.status(404).json({ error: 'Speaker not found.' });
    store.update((data) => {
      data.speakers = data.speakers.filter((s) => s.id !== id);
      if (data.selectedSpeakerId === id)
        data.selectedSpeakerId = data.speakers[0]?.id ?? null;
    });
    if (!store.get().selectedSpeakerId) live.visible = false;
    publish();
    response.status(204).end();
  } catch (error) {
    fail(response, error);
  }
});

app.patch('/api/settings', requireAuth, (request, response) => {
  try {
    const settings = parseSettings(request.body, store.get().settings);
    store.update((data) => {
      data.settings = settings;
    });
    publish();
    response.json(settings);
  } catch (error) {
    fail(response, error);
  }
});

io.use((socket, next) => {
  const token: unknown = socket.handshake.auth.token;
  socket.data.authorized = isAuthorized(
    controlToken,
    typeof token === 'string' ? `Bearer ${token}` : undefined,
  );
  next();
});

io.on('connection', (socket) => {
  socket.emit('snapshot', snapshot());
  socket.on(
    'command',
    (command: unknown, ack?: (result: { ok: boolean; error?: string }) => void) => {
      try {
        if (!socket.data.authorized) throw new Error('Not authorized.');
        if (!isIncomingCommand(command)) throw new Error('Invalid command.');
        const data = store.get();
        if (command.type === 'select' || command.type === 'show') {
          const id = command.speakerId ?? data.selectedSpeakerId;
          if (!id || !data.speakers.some((s) => s.id === id))
            throw new Error('Select a speaker first.');
          if (id !== data.selectedSpeakerId)
            store.update((saved) => {
              saved.selectedSpeakerId = id;
            });
          if (command.type === 'show') {
            live.visible = true;
            live.cue++;
          }
        } else if (command.type === 'hide') {
          live.visible = false;
        } else if (command.type === 'next') {
          const id = nextSpeakerId(data.speakers, data.selectedSpeakerId);
          if (!id) throw new Error('Add a speaker first.');
          store.update((saved) => {
            saved.selectedSpeakerId = id;
          });
          live.visible = true;
          live.cue++;
        } else if (command.type === 'replay') {
          if (!data.selectedSpeakerId) throw new Error('Select a speaker first.');
          live.visible = true;
          live.cue++;
        } else throw new Error('Unknown command.');
        publish();
        ack?.({ ok: true });
      } catch (error) {
        ack?.({
          ok: false,
          error: error instanceof Error ? error.message : 'Unexpected error.',
        });
      }
    },
  );
});

if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: { server: httpServer } },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const dist = resolve('dist');
  app.use(express.static(dist));
  app.get(/.*/, (_request: Request, response: Response) =>
    response.sendFile(resolve(dist, 'index.html')),
  );
}

httpServer.listen(port, host, () => {
  console.log(`KMUTNB Broadcast Studio: http://localhost:${port}/control`);
  console.log(`OBS overlay: http://localhost:${port}/overlay`);
});
