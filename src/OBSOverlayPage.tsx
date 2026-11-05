import { useMemo } from 'react';
import { initialData, type Snapshot } from '../shared/types';
import { OverlayCanvas } from './Overlay';
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
  const snapshot = useMemo(readSnapshot, []);
  return (
    <main className="obs-page" aria-label="OBS lower third overlay">
      <OverlayCanvas snapshot={snapshot} />
    </main>
  );
}
