import { useEffect, useMemo, useRef } from 'react';
import { useAnimationControls } from 'motion/react';
import type { LowerThirdAnimationSettings } from '../../shared/types';
import { classicSweep, classicSweepTarget } from '../animations/classicSweep';
import { createAnimationPlan, partTransition } from '../animations/presets';

type Controls = ReturnType<typeof useAnimationControls>;

export type LowerThirdPartControls = {
  logo: Controls;
  panel: Controls;
  name: Controls;
  subtitle: Controls;
  decoration: Controls;
  sweep: Controls;
};

type Options = {
  animation: LowerThirdAnimationSettings;
  visible: boolean;
  cue: number;
  active: boolean;
  staticPreview?: boolean;
  classic?: boolean;
};

export function useLowerThirdAnimation({
  animation,
  visible,
  cue,
  active,
  staticPreview = false,
  classic = false,
}: Options) {
  const container = useAnimationControls();
  const logo = useAnimationControls();
  const panel = useAnimationControls();
  const name = useAnimationControls();
  const subtitle = useAnimationControls();
  const decoration = useAnimationControls();
  const sweep = useAnimationControls();
  const firstSnapshot = useRef(true);
  const previousCommand = useRef({ visible, cue, active });
  const plan = useMemo(() => createAnimationPlan(animation), [animation]);
  const parts = useMemo(
    () => ({ logo, panel, name, subtitle, decoration, sweep }),
    [logo, panel, name, subtitle, decoration, sweep],
  );

  useEffect(() => {
    const all = [container, logo, panel, name, subtitle, decoration, sweep];
    for (const control of all) control.stop();

    const resetSweep = () =>
      sweep.set({
        x: classic ? 0 : -420,
        attrX: classic ? classicSweep.startX : -420,
        opacity: 0,
      });

    const setFinalState = (isVisible: boolean) => {
      container.set(isVisible ? plan.shown : plan.hidden);
      for (const control of [logo, panel, name, subtitle, decoration])
        control.set(isVisible ? plan.partShown : plan.partHidden);
      resetSweep();
    };

    if (staticPreview || !animation.enabled) {
      setFinalState(staticPreview || (visible && active));
      firstSnapshot.current = false;
      previousCommand.current = { visible, cue, active };
      return;
    }

    if (firstSnapshot.current) {
      setFinalState(visible && active);
      firstSnapshot.current = false;
      previousCommand.current = { visible, cue, active };
      return;
    }

    const commandChanged =
      previousCommand.current.visible !== visible ||
      previousCommand.current.cue !== cue ||
      previousCommand.current.active !== active;
    previousCommand.current = { visible, cue, active };
    if (!commandChanged) {
      setFinalState(visible && active);
      return;
    }

    if (!visible || !active) {
      if (plan.staggered) {
        const ordered = [subtitle, name, decoration, panel, logo];
        ordered.forEach((control, index) => {
          void control.start({
            ...plan.partHidden,
            transition: partTransition(animation, index * 0.035, true),
          });
        });
      }
      void container.start(plan.hidden);
      resetSweep();
      return;
    }

    container.set(plan.hidden);
    resetSweep();
    if (plan.staggered) {
      for (const control of [logo, panel, name, subtitle, decoration])
        control.set(plan.partHidden);
      container.set({ ...plan.shown, transition: { duration: 0 } });
      const ordered = [logo, panel, decoration, name, subtitle];
      ordered.forEach((control, index) => {
        void control.start({
          ...plan.partShown,
          transition: partTransition(animation, index * animation.duration * 0.16),
        });
      });
    } else {
      for (const control of [logo, panel, name, subtitle, decoration])
        control.set(plan.partShown);
      void container.start(plan.shown);
    }
    if (plan.sweep) {
      void sweep.start({
        ...(classic ? { attrX: classicSweepTarget.endX } : { x: 1510 }),
        opacity: [0, 0.9, 0],
        transition: {
          duration: Math.max(0.45, animation.duration * 0.72),
          delay: animation.duration * 0.72,
          ease: [0.65, 0, 0.35, 1],
        },
      });
    }
  }, [
    active,
    animation,
    classic,
    container,
    cue,
    decoration,
    logo,
    name,
    panel,
    plan,
    staticPreview,
    subtitle,
    sweep,
    visible,
  ]);

  return { container, parts };
}
