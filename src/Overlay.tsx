import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import {
  displayName,
  displaySubtitle,
  type Template,
  type Snapshot,
  type Speaker,
} from '../shared/types';
import { useLive } from './live';
import { LowerThirdAnimator } from './animations/LowerThirdAnimator';
import type { LowerThirdVariant } from './components/LowerThird';

function Brand({ template }: { template: string }) {
  return (
    <div className="cg-brand">
      <div
        className="cg-brand-badge"
        aria-hidden="true"
      />
      <div className="cg-brand-copy">
        <div className="cg-brand-mark">
          K<span>M</span>UTNB
        </div>
        <div className="cg-brand-rule" />
        <div className="cg-brand-sub">
          KING MONGKUT&apos;S UNIVERSITY
          <br />
          OF TECHNOLOGY NORTH BANGKOK
        </div>
        {template === 'speaker' && <div className="cg-brand-event">SPEAKER</div>}
      </div>
    </div>
  );
}

function useFitText(text: string, template: string, minimumSize: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.removeProperty('font-size');
    let size = Math.round(parseFloat(getComputedStyle(element).fontSize));
    element.style.fontSize = `${size}px`;
    while (
      size > minimumSize &&
      (element.scrollHeight > element.clientHeight + 2 ||
        element.scrollWidth > element.clientWidth + 2)
    ) {
      size -= 2;
      element.style.fontSize = `${size}px`;
    }
  }, [text, template, minimumSize]);
  return ref;
}

export function CGBar({
  speaker,
  snapshot,
  staticPreview = false,
}: {
  speaker: Speaker | null;
  snapshot: Snapshot;
  staticPreview?: boolean;
}) {
  if (!speaker) return null;
  const definition = templateRegistry[snapshot.settings.template];

  if (definition.renderer === 'svg') {
    const Renderer = definition.component;
    return (
      <Renderer
        variant={definition.variant}
        name={displayName(speaker)}
        title={
          displaySubtitle(speaker) ||
          'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ'
        }
        animation={snapshot.settings.animation}
        visible={snapshot.live.visible}
        cue={snapshot.live.cue}
        staticPreview={staticPreview}
      />
    );
  }

  const Renderer = definition.component;
  return (
    <Renderer
      speaker={speaker}
      snapshot={snapshot}
      staticPreview={staticPreview}
    />
  );
}

function LegacyCGBar({
  speaker,
  snapshot,
  staticPreview = false,
}: {
  speaker: Speaker;
  snapshot: Snapshot;
  staticPreview?: boolean;
}) {
  const controls = useAnimationControls();
  const textControls = useAnimationControls();
  const panelControls = useAnimationControls();
  const sweepControls = useAnimationControls();
  const { visible, cue } = snapshot.live;
  const speed = snapshot.settings.speed;
  const name = displayName(speaker);
  const title = displaySubtitle(speaker);
  const nameRef = useFitText(name, snapshot.settings.template, 22);
  const titleRef = useFitText(title, snapshot.settings.template, 14);

  useEffect(() => {
    if (staticPreview) return;

    controls.stop();
    textControls.stop();
    panelControls.stop();
    sweepControls.stop();
    if (!visible) {
      void textControls.start({
        opacity: 0,
        y: 15,
        transition: { duration: 0.16 / speed },
      });
      void panelControls.start({
        scaleX: 0,
        transition: {
          duration: 0.34 / speed,
          delay: 0.08 / speed,
          ease: [0.65, 0, 0.35, 1],
        },
      });
      void controls.start({
        x: -1600,
        opacity: 0,
        transition: {
          duration: 0.5 / speed,
          delay: 0.2 / speed,
          ease: [0.65, 0, 0.35, 1],
        },
      });
      return;
    }
    controls.set({ x: -1600, opacity: 1 });
    panelControls.set({ scaleX: 0 });
    textControls.set({ opacity: 0, y: 20 });
    sweepControls.set({ x: -1300, opacity: 0 });
    void controls.start({
      x: 0,
      opacity: 1,
      transition: { duration: 0.48 / speed, ease: [0.22, 1, 0.36, 1] },
    });
    void panelControls.start({
      scaleX: 1,
      transition: {
        duration: 0.55 / speed,
        delay: 0.25 / speed,
        ease: [0.22, 1, 0.36, 1],
      },
    });
    void textControls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.46 / speed,
        delay: 0.65 / speed,
        ease: [0.22, 1, 0.36, 1],
      },
    });
    void sweepControls.start({
      x: 1300,
      opacity: [0, 0.7, 0],
      transition: { duration: 0.65 / speed, delay: 0.78 / speed, ease: 'easeInOut' },
    });
  }, [
    visible,
    cue,
    speed,
    controls,
    textControls,
    panelControls,
    sweepControls,
    speaker.id,
    staticPreview,
  ]);

  return (
    <motion.div
      className={`cg-bar cg-${snapshot.settings.template}`}
      initial={false}
      animate={controls}
      style={staticPreview ? { x: 0, opacity: 1 } : { x: -1600, opacity: 0 }}
      aria-hidden="true"
    >
      <div className="cg-orange-base" />
      <Brand template={snapshot.settings.template} />
      <motion.div
        className="cg-panel"
        initial={false}
        animate={panelControls}
        style={{ scaleX: staticPreview ? 1 : 0 }}
      >
        <div className="cg-panel-inner">
          <motion.div
            className="cg-text"
            initial={false}
            animate={textControls}
            style={staticPreview ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          >
            {snapshot.settings.template === 'speaker' && (
              <div className="cg-kicker">KMUTNB · FEATURED SPEAKER</div>
            )}
            <div
              ref={nameRef}
              className="cg-name"
            >
              {name}
            </div>
            <div
              ref={titleRef}
              className="cg-title"
            >
              {title || 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ'}
            </div>
          </motion.div>
        </div>
      </motion.div>
      <div className="cg-end-cap" />
      <motion.div
        className="cg-sweep"
        initial={false}
        animate={sweepControls}
        style={staticPreview ? { display: 'none' } : undefined}
      />
    </motion.div>
  );
}

type TemplateDefinition =
  | {
      renderer: 'svg';
      component: typeof LowerThirdAnimator;
      variant: LowerThirdVariant;
    }
  | {
      renderer: 'legacy';
      component: typeof LegacyCGBar;
    };

export const templateRegistry = {
  standard: { renderer: 'svg', component: LowerThirdAnimator, variant: 'classic' },
  modern: { renderer: 'svg', component: LowerThirdAnimator, variant: 'angular' },
  glass: { renderer: 'svg', component: LowerThirdAnimator, variant: 'overlay' },
  minimal: { renderer: 'svg', component: LowerThirdAnimator, variant: 'rounded' },
  premium: { renderer: 'legacy', component: LegacyCGBar },
  speaker: { renderer: 'legacy', component: LegacyCGBar },
} as const satisfies Record<Template, TemplateDefinition>;

export function OverlayCanvas({ snapshot }: { snapshot: Snapshot }) {
  const speaker =
    snapshot.speakers.find((item) => item.id === snapshot.selectedSpeakerId) ?? null;
  return (
    <div className="overlay-canvas">
      <CGBar
        speaker={speaker}
        snapshot={snapshot}
      />
    </div>
  );
}

export function OverlayPage() {
  const { snapshot, ready } = useLive();
  useEffect(() => {
    document.documentElement.classList.add('overlay-root');
    document.body.classList.add('overlay-body');
    return () => {
      document.documentElement.classList.remove('overlay-root');
      document.body.classList.remove('overlay-body');
    };
  }, []);
  return ready ? <OverlayCanvas snapshot={snapshot} /> : null;
}

export function PreviewStage({ snapshot }: { snapshot: Snapshot }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setScale(element.clientWidth / 1920));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className="preview-checkerboard relative aspect-video w-full"
      ref={ref}
    >
      <div
        className="pointer-events-none absolute left-0 top-0 h-[1080px] w-[1920px] origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        <OverlayCanvas snapshot={snapshot} />
      </div>
    </div>
  );
}
