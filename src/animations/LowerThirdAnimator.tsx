import { motion } from 'motion/react';
import type { LowerThirdAnimationSettings } from '../../shared/types';
import { LowerThird, type LowerThirdVariant } from '../components/LowerThird';
import { useLowerThirdAnimation } from '../hooks/useLowerThirdAnimation';

type Props = {
  variant: LowerThirdVariant;
  name: string;
  title: string;
  animation: LowerThirdAnimationSettings;
  visible: boolean;
  cue: number;
  staticPreview?: boolean;
};

export function LowerThirdAnimator({
  variant,
  name,
  title,
  animation,
  visible,
  cue,
  staticPreview = false,
}: Props) {
  const { container, parts } = useLowerThirdAnimation({
    animation,
    visible,
    cue,
    active: Boolean(name),
    staticPreview,
    classic: variant === 'classic',
  });

  return (
    <motion.div
      className="cg-svg-bar"
      initial={false}
      animate={container}
      aria-hidden="true"
    >
      <LowerThird
        variant={variant}
        name={name}
        subtitle={title}
        logoSrc="/assets/kmutnb-seal.png"
        parts={parts}
        staggerParts={animation.effect === 'staggered'}
      />
    </motion.div>
  );
}
