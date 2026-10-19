import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LowerThirdAnimationSettings } from '../../shared/types';
import { classicSweepTarget } from '../animations/classicSweep';
import { useLowerThirdAnimation } from './useLowerThirdAnimation';

type TestControl = {
  stop: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
};

const mocks = vi.hoisted(() => ({
  controls: [] as TestControl[],
  refs: [] as Array<{ current: unknown }>,
}));

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useEffect: (effect: () => void) => effect(),
    useMemo: (factory: () => unknown) => factory(),
    useRef: (initial: unknown) => mocks.refs.shift() ?? { current: initial },
  };
});

vi.mock('motion/react', () => ({
  useAnimationControls: () => mocks.controls.shift(),
}));

const animation: LowerThirdAnimationSettings = {
  effect: 'light-sweep',
  duration: 0.7,
  easing: 'ease-out',
  enabled: true,
};

function setupControls() {
  const controls = Array.from({ length: 7 }, () => ({
    stop: vi.fn(),
    set: vi.fn(),
    start: vi.fn(),
  }));
  mocks.controls.push(...controls);
  mocks.refs.push(
    { current: false },
    { current: { visible: false, cue: 0, active: true } },
  );
  return controls;
}

describe('lower third sweep target', () => {
  beforeEach(() => {
    mocks.controls.length = 0;
    mocks.refs.length = 0;
  });

  it.each([
    { classic: true, target: { attrX: classicSweepTarget.endX } },
    { classic: false, target: { x: 1510 } },
  ])('uses the correct SVG axis for classic=$classic', ({ classic, target }) => {
    const controls = setupControls();

    useLowerThirdAnimation({
      animation,
      visible: true,
      cue: 1,
      active: true,
      classic,
    });

    const sweepTarget = controls[6].start.mock.calls[0]?.[0];

    expect(sweepTarget).toMatchObject(target);
    expect(sweepTarget).not.toHaveProperty(classic ? 'x' : 'attrX');
  });
});
