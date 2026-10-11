import type { TargetAndTransition, Transition } from 'motion/react';
import type {
  AnimationEffect,
  AnimationEasing,
  LowerThirdAnimationSettings,
} from '../../shared/types';

export const animationEffectOptions: ReadonlyArray<{
  value: AnimationEffect;
  label: string;
}> = [
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-down', label: 'Slide Down' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'fade', label: 'Fade In / Out' },
  { value: 'scale', label: 'Scale In / Out' },
  { value: 'wipe', label: 'Wipe Reveal' },
  { value: 'blur', label: 'Blur Reveal' },
  { value: 'staggered', label: 'Staggered Reveal' },
  { value: 'light-sweep', label: 'Light Sweep' },
];

export const animationEasingOptions: ReadonlyArray<{
  value: AnimationEasing;
  label: string;
}> = [
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'spring', label: 'Spring' },
];

export type AnimationPlan = {
  hidden: TargetAndTransition;
  shown: TargetAndTransition;
  partHidden: TargetAndTransition;
  partShown: TargetAndTransition;
  staggered: boolean;
  sweep: boolean;
};

function transition(easing: AnimationEasing, duration: number, delay = 0): Transition {
  if (easing === 'spring') {
    return { type: 'spring', duration, bounce: 0.2, delay };
  }
  return {
    duration,
    delay,
    ease: easing === 'ease-out' ? [0.22, 1, 0.36, 1] : [0.65, 0, 0.35, 1],
  };
}

export function createAnimationPlan(
  settings: LowerThirdAnimationSettings,
): AnimationPlan {
  const { effect, duration, easing } = settings;
  const enter = transition(easing, duration);
  const exit = transition(easing, Math.max(0.2, duration * 0.72));
  const shown: TargetAndTransition = {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    filter: 'blur(0px)',
    transition: enter,
  };
  let hidden: TargetAndTransition = {
    x: 0,
    y: 0,
    opacity: 0,
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    filter: 'blur(0px)',
    transition: exit,
  };

  if (effect === 'slide-up') hidden = { ...hidden, y: 145 };
  if (effect === 'slide-down') hidden = { ...hidden, y: -145 };
  if (effect === 'slide-left') hidden = { ...hidden, x: -1500 };
  if (effect === 'slide-right') hidden = { ...hidden, x: 1500 };
  if (effect === 'scale') hidden = { ...hidden, scale: 0.82 };
  if (effect === 'wipe') {
    hidden = { ...hidden, opacity: 1, clipPath: 'inset(0% 100% 0% 0%)' };
  }
  if (effect === 'blur') hidden = { ...hidden, filter: 'blur(18px)' };
  if (effect === 'staggered') hidden = { ...hidden, opacity: 1 };
  if (effect === 'light-sweep') {
    hidden = {
      ...hidden,
      opacity: 1,
      clipPath: 'inset(0% 100% 0% 0%)',
      transition: transition(easing, duration * 0.72),
    };
  }

  return {
    hidden,
    shown,
    partHidden: { opacity: 0, x: -24, y: 8, filter: 'blur(5px)' },
    partShown: { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' },
    staggered: effect === 'staggered',
    sweep: effect === 'light-sweep',
  };
}

export function partTransition(
  settings: LowerThirdAnimationSettings,
  delay: number,
  hiding = false,
): Transition {
  return transition(
    settings.easing,
    Math.max(0.18, settings.duration * (hiding ? 0.28 : 0.34)),
    delay,
  );
}
