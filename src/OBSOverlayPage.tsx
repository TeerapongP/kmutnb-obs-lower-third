import { useEffect, useState } from 'react';
import { initialData, type Snapshot } from '../shared/types';
import { OverlayCanvas } from './Overlay';
import { readOverlaySnapshot } from './obsSync';
import './styles/obs.css';

function readSnapshot(): Snapshot {
  try {
    const encoded = new URLSearchParams(window.location.search).get('state');
    if (!encoded) throw new Error('Missing overlay state');
    const base64 = encoded.replaceAll('-', '+').replaceAll('_', '/');
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!value || typeof value !== 'object') throw new Error('Invalid overlay state');
    const data = value as Partial<Snapshot>;
    if (
      !Array.isArray(data.speakers) ||
      !data.settings ||
      typeof data.selectedSpeakerId !== 'string' ||
      !data.live ||
      typeof data.live.visible !== 'boolean' ||
      typeof data.live.cue !== 'number'
    ) throw new Error('Invalid overlay state');
    return data as Snapshot;
  } catch {
    return {
      ...structuredClone(initialData),
      live: { visible: false, cue: 0 },
    };
  }
}

export function OBSOverlayPage() {
  const channel = new URLSearchParams(window.location.search).get('channel');
  const [snapshot, setSnapshot] = useState(readSnapshot);

  useEffect(() => {
    if (!channel) return;
    const channelId = channel;
    let active = true;
    let previous = '';

    async function refresh() {
      try {
        const next = await readOverlaySnapshot(channelId);
        const serialized = JSON.stringify(next);
        if (active && serialized !== previous) {
          previous = serialized;
          setSnapshot(next);
        }
      } catch {
        // Keep the last rendered frame during temporary network failures.
      }
    }

    void refresh();
    const timer = window.setInterval(() => void refresh(), 400);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [channel]);

  return (
    <main className="obs-page" aria-label="OBS lower third overlay">
      <OverlayCanvas snapshot={snapshot} />
    </main>
  );
}
