import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import express, { type Request, type Response } from 'express';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import { nextSpeakerId, type Snapshot } from '../shared/types';
import { isIncomingCommand, parseSettings, parseSpeaker, Store } from './store';

if (existsSync('.env')) process.loadEnvFile('.env');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
const store = new Store();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const live = { visible: store.get().settings.autoShow, cue: 0 };
const snapshot = (): Snapshot => ({ ...store.get(), live: { ...live } });
const publish = () => io.emit('snapshot', snapshot());

app.use(express.json({ limit: '64kb' }));
app.use('/api', (_request, response, next) => {
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

app.post('/api/speakers', (request, response) => {
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

app.put('/api/speakers/:id', (request, response) => {
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

app.delete('/api/speakers/:id', (request, response) => {
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

app.patch('/api/settings', (request, response) => {
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

io.on('connection', (socket) => {
  socket.emit('snapshot', snapshot());
  socket.on(
    'command',
    (command: unknown, ack?: (result: { ok: boolean; error?: string }) => void) => {
      try {
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
