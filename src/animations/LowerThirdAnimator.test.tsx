import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { LowerThirdAnimationSettings } from '../../shared/types';
import { LowerThirdAnimator } from './LowerThirdAnimator';

const mocks = vi.hoisted(() => {
  const controls = {
    container: { stage: 'container' },
    logo: { stage: 'logo' },
    panel: { stage: 'panel' },
    name: { stage: 'name' },
    subtitle: { stage: 'subtitle' },
    decoration: { stage: 'decoration' },
    sweep: { stage: 'sweep' },
  };

  return {
    controls,
    useAnimation: vi.fn(() => ({ container: controls.container, parts: controls })),
  };
});

vi.mock('../hooks/useLowerThirdAnimation', () => ({
  useLowerThirdAnimation: mocks.useAnimation,
}));

vi.mock('motion/react', async () => {
  const React = await import('react');
  const motion = new Proxy(
    {},
    {
      get:
        (_target, tag: string) =>
        ({ animate, initial: _initial, ...props }: Record<string, unknown>) => {
          const stage =
            typeof animate === 'object' && animate !== null && 'stage' in animate
              ? animate.stage
              : undefined;
          return React.createElement(
            tag,
            { ...props, 'data-animation-stage': stage },
            props.children as React.ReactNode,
          );
        },
    },
  );
  return { motion };
});

describe('Classic staggered artwork stages', () => {
  it('keeps artwork stages independent and speaker text editable', () => {
    const animation: LowerThirdAnimationSettings = {
      effect: 'staggered',
      duration: 0.7,
      easing: 'ease-out',
      enabled: true,
    };
    const animatorProps = {
      template: 'standard',
      variant: 'classic',
      name: 'Professor Ada Lovelace',
      title: 'Department of Computing',
      animation,
      visible: true,
      cue: 1,
    } as Parameters<typeof LowerThirdAnimator>[0];
    const markup = renderToStaticMarkup(<LowerThirdAnimator {...animatorProps} />);

    expect(mocks.useAnimation).toHaveBeenLastCalledWith(
      expect.objectContaining({ classic: true }),
    );
    expect(markup).toContain(
      '<g data-animation-stage="panel"><use href="/assets/Classic_1.svg#classic-panel-base"></use></g>',
    );
    expect(markup).toContain(
      '<g data-animation-stage="logo"><use href="/assets/Classic_1.svg#classic-logo"></use></g>',
    );
    expect(markup).toContain(
      '<g data-animation-stage="panel"><use href="/assets/Classic_1.svg#classic-panel-body"></use></g>',
    );
    expect(markup).toContain(
      '<g data-animation-stage="decoration"><use href="/assets/Classic_1.svg#classic-decoration"></use></g>',
    );
    expect(markup).toContain('Professor Ada Lovelace');
    expect(markup).toContain('Department of Computing');
  });
});
