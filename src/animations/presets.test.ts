import { describe, expect, it } from 'vitest';
import {
  animationEffects,
  designTemplates,
  type LowerThirdAnimationSettings,
} from '../../shared/types';
import { createAnimationPlan } from './presets';

describe('lower third animation presets', () => {
  it.each(animationEffects)('creates entrance and exit states for %s', (effect) => {
    const settings: LowerThirdAnimationSettings = {
      effect,
      duration: 0.8,
      easing: 'ease-out',
      enabled: true,
    };
    const plan = createAnimationPlan(settings);

    expect(plan.shown.opacity).toBe(1);
    expect(plan.hidden).not.toEqual(plan.shown);
    expect(plan.shown.transition).toBeDefined();
    expect(plan.hidden.transition).toBeDefined();
  });

  it('covers every requested SVG template with every preset', () => {
    const combinations = designTemplates.flatMap((template) =>
      animationEffects.map((effect) => `${template.id}:${effect}`),
    );
    expect(combinations).toHaveLength(40);
    expect(new Set(combinations).size).toBe(40);
  });
});
