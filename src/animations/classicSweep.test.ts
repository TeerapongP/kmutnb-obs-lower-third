import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  classicArtwork,
  classicSweep,
  classicSweepBounds,
  classicSweepTarget,
} from './classicSweep';

describe('Classic light sweep', () => {
  it('starts outside the artwork and clears its far edge', () => {
    const start = classicSweepBounds(classicSweep.startX);
    const end = classicSweepBounds(classicSweepTarget.endX);

    expect(start.right).toBeLessThan(0);
    expect(end.left).toBeGreaterThanOrEqual(classicArtwork.width);
    expect(classicSweepTarget.travel).toBe(classicSweepTarget.endX - classicSweep.startX);
  });

  it('uses the artwork viewBox and one source group per painted layer', () => {
    const source = readFileSync(
      new URL('../../public/assets/Classic_1.svg', import.meta.url),
      'utf8',
    );
    expect(source).toContain(
      `viewBox="0 0 ${classicArtwork.width} ${classicArtwork.height}"`,
    );
    const groups = [...source.matchAll(/<g id="(classic-[^"]+)">/g)].map(
      (match) => match[1],
    );
    expect(groups).toEqual([
      'classic-panel-base',
      'classic-logo',
      'classic-panel-body',
      'classic-decoration',
    ]);
  });
});
