import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { nextSpeakerId } from '../shared/types';
import { parseSettings, parseSpeaker, Store } from './store';

const directories: string[] = [];
afterEach(() => {
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

describe('speaker and settings validation', () => {
  it('accepts Thai and English speaker data and rejects blank names', () => {
    expect(
      parseSpeaker(
        {
          name: '  กานต์ชนก Smith  ',
          academicTitle: 'ผศ.',
          position: '',
          department: '',
        },
        'one',
      ).name,
    ).toBe('กานต์ชนก Smith');
    expect(() => parseSpeaker({ name: '  ' })).toThrow();
  });
  it('keeps unspecified settings and validates speed', () => {
    const previous = {
      template: 'glass' as const,
      speed: 1,
      autoShow: false,
      animation: {
        effect: 'slide-up' as const,
        duration: 0.65,
        easing: 'ease-out' as const,
        enabled: true,
      },
    };
    expect(parseSettings({ speed: 1.5 }, previous)).toEqual({ ...previous, speed: 1.5 });
    expect(() => parseSettings({ speed: 3 }, previous)).toThrow();
    expect(
      parseSettings({ animation: { effect: 'blur', duration: 1.2 } }, previous).animation,
    ).toEqual({
      effect: 'blur',
      duration: 1.2,
      easing: 'ease-out',
      enabled: true,
    });
    expect(() => parseSettings({ animation: { duration: 2.6 } }, previous)).toThrow();
  });
});

describe('store', () => {
  it('persists speakers, selected speaker, and settings across instances', () => {
    const directory = mkdtempSync(join(tmpdir(), 'cg-bar-'));
    directories.push(directory);
    const file = join(directory, 'config.json');
    const first = new Store(file);
    first.update((data) => {
      data.speakers = [
        parseSpeaker(
          { name: 'Narin', academicTitle: '', position: 'Host', department: '' },
          'narin',
        ),
      ];
      data.selectedSpeakerId = 'narin';
      data.settings.template = 'premium';
      data.settings.animation.effect = 'light-sweep';
    });
    const second = new Store(file);
    expect(second.get().speakers[0].name).toBe('Narin');
    expect(second.get().selectedSpeakerId).toBe('narin');
    expect(second.get().settings.template).toBe('premium');
    expect(second.get().settings.animation.effect).toBe('light-sweep');
  });
  it('cycles through speakers and handles an empty list', () => {
    const speakers = [{ id: 'a' }, { id: 'b' }] as ReturnType<Store['get']>['speakers'];
    expect(nextSpeakerId(speakers, 'b')).toBe('a');
    expect(nextSpeakerId([], null)).toBeNull();
  });
});
