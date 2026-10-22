import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import {
  initialData,
  animationEasings,
  animationEffects,
  nextSpeakerId,
  templates,
  type SavedData,
  type Settings,
  type Snapshot,
  type Speaker,
} from '../shared/types';

const STORAGE_KEY = 'kmutnb-cg-studio';

type Command = {
  type: 'select' | 'show' | 'hide' | 'next' | 'replay';
  speakerId?: string;
};
type Action =
  | { type: 'command'; command: Command }
  | { type: 'update-settings'; change: Partial<Settings> }
  | { type: 'save-speaker'; speaker: Speaker }
  | { type: 'delete-speaker'; speakerId: string };
type StudioContextValue = {
  snapshot: Snapshot;
  persistenceError: string | null;
  command: (command: Command) => void;
  updateSettings: (change: Partial<Settings>) => void;
  saveSpeaker: (speaker: Speaker) => void;
  deleteSpeaker: (speakerId: string) => void;
};

const StudioContext = createContext<StudioContextValue | null>(null);

export function studioReducer(snapshot: Snapshot, action: Action): Snapshot {
  if (action.type === 'update-settings') {
    return {
      ...snapshot,
      settings: {
        ...snapshot.settings,
        ...action.change,
        animation: action.change.animation
          ? { ...snapshot.settings.animation, ...action.change.animation }
          : snapshot.settings.animation,
      },
    };
  }
  if (action.type === 'save-speaker') {
    const exists = snapshot.speakers.some((item) => item.id === action.speaker.id);
    return {
      ...snapshot,
      speakers: exists
        ? snapshot.speakers.map((item) =>
            item.id === action.speaker.id ? action.speaker : item,
          )
        : [...snapshot.speakers, action.speaker],
      selectedSpeakerId: exists ? snapshot.selectedSpeakerId : action.speaker.id,
    };
  }
  if (action.type === 'delete-speaker') {
    const speakers = snapshot.speakers.filter((item) => item.id !== action.speakerId);
    const selectedSpeakerId =
      snapshot.selectedSpeakerId === action.speakerId
        ? (speakers[0]?.id ?? null)
        : snapshot.selectedSpeakerId;
    return {
      ...snapshot,
      speakers,
      selectedSpeakerId,
      live: speakers.length ? snapshot.live : { ...snapshot.live, visible: false },
    };
  }

  const { command } = action;
  if (command.type === 'hide')
    return { ...snapshot, live: { ...snapshot.live, visible: false } };
  if (command.type === 'select' || command.type === 'show') {
    const id = command.speakerId ?? snapshot.selectedSpeakerId;
    if (!id || !snapshot.speakers.some((speaker) => speaker.id === id)) return snapshot;
    return {
      ...snapshot,
      selectedSpeakerId: id,
      live:
        command.type === 'show'
          ? { visible: true, cue: snapshot.live.cue + 1 }
          : snapshot.live,
    };
  }
  if (command.type === 'next') {
    const id = nextSpeakerId(snapshot.speakers, snapshot.selectedSpeakerId);
    return id
      ? {
          ...snapshot,
          selectedSpeakerId: id,
          live: { visible: true, cue: snapshot.live.cue + 1 },
        }
      : snapshot;
  }
  return snapshot.selectedSpeakerId
    ? { ...snapshot, live: { visible: true, cue: snapshot.live.cue + 1 } }
    : snapshot;
}

function isSpeaker(value: unknown): value is Speaker {
  if (!value || typeof value !== 'object') return false;
  const speaker = value as Record<string, unknown>;
  return (
    typeof speaker.id === 'string' &&
    typeof speaker.name === 'string' &&
    typeof speaker.academicTitle === 'string' &&
    typeof speaker.position === 'string' &&
    typeof speaker.department === 'string'
  );
}

function isSettings(value: unknown): value is Settings {
  if (!value || typeof value !== 'object') return false;
  const settings = value as Record<string, unknown>;
  const animation = settings.animation;
  if (!animation || typeof animation !== 'object') return false;
  const motion = animation as Record<string, unknown>;
  return (
    templates.includes(settings.template as Settings['template']) &&
    typeof settings.speed === 'number' &&
    Number.isFinite(settings.speed) &&
    settings.speed >= 0.5 &&
    settings.speed <= 2 &&
    animationEffects.includes(motion.effect as Settings['animation']['effect']) &&
    typeof motion.duration === 'number' &&
    Number.isFinite(motion.duration) &&
    motion.duration >= 0.3 &&
    motion.duration <= 2.5 &&
    animationEasings.includes(motion.easing as Settings['animation']['easing']) &&
    typeof motion.enabled === 'boolean'
  );
}

function readSavedData(): { snapshot: Snapshot; error: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return {
        snapshot: { ...structuredClone(initialData), live: { visible: false, cue: 0 } },
        error: null,
      };
    const saved = JSON.parse(raw) as Partial<SavedData>;
    if (!Array.isArray(saved.speakers) || !saved.speakers.every(isSpeaker))
      throw new Error('Saved speaker data is invalid.');
    const speakers = saved.speakers;
    const settings = saved.settings ?? initialData.settings;
    if (!isSettings(settings)) throw new Error('Saved settings are invalid.');
    const selectedSpeaker =
      speakers.find((speaker) => speaker.id === saved.selectedSpeakerId) ??
      speakers.at(0);
    const selectedSpeakerId = selectedSpeaker ? selectedSpeaker.id : null;
    return {
      snapshot: {
        speakers,
        settings,
        selectedSpeakerId,
        live: { visible: false, cue: 0 },
      },
      error: null,
    };
  } catch {
    return {
      snapshot: { ...structuredClone(initialData), live: { visible: false, cue: 0 } },
      error: 'Could not read saved browser data. Changes may not persist.',
    };
  }
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const [loaded] = useState(readSavedData);
  const [snapshot, setSnapshot] = useState(loaded.snapshot);
  const [persistenceError, setPersistenceError] = useState(loaded.error);
  const snapshotRef = useRef(snapshot);

  function apply(action: Action) {
    const next = studioReducer(snapshotRef.current, action);
    snapshotRef.current = next;
    setSnapshot(next);
    try {
      const saved: SavedData = {
        speakers: next.speakers,
        settings: next.settings,
        selectedSpeakerId: next.selectedSpeakerId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      setPersistenceError(null);
    } catch {
      setPersistenceError('Could not save browser data. Changes may not persist.');
    }
  }

  const value: StudioContextValue = {
    snapshot,
    persistenceError,
    command: (command) => apply({ type: 'command', command }),
    updateSettings: (change) => apply({ type: 'update-settings', change }),
    saveSpeaker: (speaker) => apply({ type: 'save-speaker', speaker }),
    deleteSpeaker: (speakerId) => apply({ type: 'delete-speaker', speakerId }),
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const value = useContext(StudioContext);
  if (!value) throw new Error('StudioProvider is missing.');
  return value;
}
