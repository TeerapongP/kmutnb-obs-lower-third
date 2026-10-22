import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  initialData,
  animationEasings,
  animationEffects,
  templates,
  type SavedData,
  type Settings,
  type Speaker,
} from '../shared/types';

function stringField(value: unknown, max: number, required = false): string {
  if (typeof value !== 'string') throw new Error('Please enter valid text.');
  const text = value.trim();
  if ((required && !text) || text.length > max)
    throw new Error(`Text must be ${required ? '1–' : '0–'}${max} characters.`);
  return text;
}

export function isAuthorized(
  configuredToken: string | null,
  authorizationHeader: string | undefined,
): boolean {
  if (!configuredToken) return true;
  return authorizationHeader === `Bearer ${configuredToken}`;
}

export function parseSpeaker(value: unknown, id: string = randomUUID()): Speaker {
  if (!value || typeof value !== 'object') throw new Error('Invalid speaker.');
  const item = value as Record<string, unknown>;
  return {
    id,
    name: stringField(item.name, 180, true),
    academicTitle: stringField(item.academicTitle ?? '', 80),
    position: stringField(item.position ?? '', 220),
    department: stringField(item.department ?? '', 220),
    demo: item.demo === true,
  };
}

export type IncomingCommand = { type: string; speakerId?: string };

export function isIncomingCommand(value: unknown): value is IncomingCommand {
  if (typeof value !== 'object' || value === null) return false;
  if (!('type' in value) || typeof value.type !== 'string') return false;
  if (
    'speakerId' in value &&
    value.speakerId !== undefined &&
    typeof value.speakerId !== 'string'
  )
    return false;
  return true;
}

export function parseSettings(value: unknown, current: Settings): Settings {
  if (!value || typeof value !== 'object') throw new Error('Invalid settings.');
  const input = value as Record<string, unknown>;
  const template = input.template ?? current.template;
  const speed = input.speed ?? current.speed;
  const autoShow = input.autoShow ?? current.autoShow;
  const animationInput =
    input.animation && typeof input.animation === 'object'
      ? (input.animation as Record<string, unknown>)
      : {};
  const animation = {
    effect: animationInput.effect ?? current.animation.effect,
    duration: animationInput.duration ?? current.animation.duration,
    easing: animationInput.easing ?? current.animation.easing,
    enabled: animationInput.enabled ?? current.animation.enabled,
  };
  if (!templates.includes(template as Settings['template']))
    throw new Error('Unknown design.');
  if (typeof speed !== 'number' || !Number.isFinite(speed) || speed < 0.5 || speed > 2)
    throw new Error('Speed must be between 0.5 and 2.');
  if (typeof autoShow !== 'boolean') throw new Error('Auto-show must be on or off.');
  if (!animationEffects.includes(animation.effect as Settings['animation']['effect']))
    throw new Error('Unknown animation effect.');
  if (
    typeof animation.duration !== 'number' ||
    !Number.isFinite(animation.duration) ||
    animation.duration < 0.3 ||
    animation.duration > 2.5
  )
    throw new Error('Animation duration must be between 0.3 and 2.5 seconds.');
  if (!animationEasings.includes(animation.easing as Settings['animation']['easing']))
    throw new Error('Unknown animation easing.');
  if (typeof animation.enabled !== 'boolean')
    throw new Error('Animation enabled must be on or off.');
  return {
    template: template as Settings['template'],
    speed,
    autoShow,
    animation: animation as Settings['animation'],
  };
}

export class Store {
  private data: SavedData;
  readonly file: string;

  constructor(file = process.env.DATA_FILE || './data/config.json') {
    this.file = resolve(file);
    this.data = this.read();
  }

  private read(): SavedData {
    if (!existsSync(this.file)) {
      this.data = structuredClone(initialData);
      this.save();
      return this.data;
    }
    try {
      const raw = JSON.parse(readFileSync(this.file, 'utf8')) as SavedData;
      if (!Array.isArray(raw.speakers)) throw new Error('Missing speakers');
      const speakers = raw.speakers.map((item) => parseSpeaker(item, item.id));
      const settings = parseSettings(raw.settings, initialData.settings);
      const selectedSpeakerId = speakers.some((s) => s.id === raw.selectedSpeakerId)
        ? raw.selectedSpeakerId
        : (speakers[0]?.id ?? null);
      return { speakers, settings, selectedSpeakerId };
    } catch (error) {
      throw new Error(
        `Could not read ${this.file}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  get(): SavedData {
    return structuredClone(this.data);
  }

  update(mutator: (data: SavedData) => void): SavedData {
    const next = structuredClone(this.data);
    mutator(next);
    const previous = this.data;
    this.data = next;
    try {
      this.save();
    } catch (error) {
      this.data = previous;
      throw error;
    }
    return this.get();
  }

  private save() {
    mkdirSync(dirname(this.file), { recursive: true });
    const temp = `${this.file}.${process.pid}.tmp`;
    writeFileSync(temp, JSON.stringify(this.data, null, 2) + '\n', 'utf8');
    renameSync(temp, this.file);
  }
}
