import { motion } from 'motion/react';
import type { LowerThirdAnimationSettings, Template } from '../../shared/types';
import { LowerThird, type LowerThirdVariant } from '../components/LowerThird';
import { useLowerThirdAnimation } from '../hooks/useLowerThirdAnimation';

const variantByTemplate: Partial<Record<Template, LowerThirdVariant>> = {
  standard: 'classic',
  modern: 'angular',
  glass: 'overlay',
  minimal: 'rounded',
};

type Props = {
  template: Template;
  name: string;
  title: string;
  animation: LowerThirdAnimationSettings;
  visible: boolean;
  cue: number;
  staticPreview?: boolean;
};

export function LowerThirdAnimator({
  template,
  name,
  title,
  animation,
  visible,
  cue,
  staticPreview = false,
}: Props) {
  const variant = variantByTemplate[template];
  const { container, parts } = useLowerThirdAnimation({
    animation,
    visible,
    cue,
    active: Boolean(name),
    staticPreview,
    classic: variant === 'classic',
  });

  if (!variant) return null;

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
