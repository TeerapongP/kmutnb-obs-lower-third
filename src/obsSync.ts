import type { Snapshot } from '../shared/types';

const STORAGE_KEY = 'kmutnb-cg-obs-channel';
export type ObsChannel = { id: string; writeKey: string };

function randomHex(bytes: number) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

function getChannel(): ObsChannel {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      const parsed: unknown = JSON.parse(existing);
      if (
        parsed &&
        typeof parsed === 'object' &&
        'id' in parsed &&
        typeof parsed.id === 'string' &&
        /^[a-f0-9]{32}$/i.test(parsed.id) &&
        'writeKey' in parsed &&
        typeof parsed.writeKey === 'string' &&
        /^[a-f0-9]{64}$/i.test(parsed.writeKey)
      ) {
        return parsed as ObsChannel;
      }
    } catch {
      // Replace malformed local channel credentials with a new channel.
    }
  }

  const channel = { id: randomHex(16), writeKey: randomHex(32) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(channel));
  return channel;
}

let pendingPublish: Promise<void> = Promise.resolve();

export function publishOverlaySnapshot(snapshot: Snapshot, channel = getChannel()) {
  const current = pendingPublish.then(async () => {
    const response = await fetch(`/api/overlay?channel=${channel.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Overlay-Write-Key': channel.writeKey,
      },
      body: JSON.stringify(snapshot),
    });
    if (!response.ok) throw new Error('Could not sync the OBS overlay.');
  });
  pendingPublish = current.catch(() => undefined);
  return current;
}

export async function createObsOverlayUrl(snapshot: Snapshot) {
  const channel = getChannel();
  await publishOverlaySnapshot(snapshot, channel);
  const url = new URL('/overlay', window.location.origin);
  url.searchParams.set('channel', channel.id);
  return url.toString();
}

export async function readOverlaySnapshot(channelId: string): Promise<Snapshot> {
  const response = await fetch(`/api/overlay?channel=${encodeURIComponent(channelId)}`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('OBS overlay state is unavailable.');
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('snapshot' in data)) {
    throw new Error('OBS overlay state is invalid.');
  }
  return data.snapshot as Snapshot;
}
