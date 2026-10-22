import { useEffect, useRef, useState } from 'react';
import type { Snapshot, Speaker, Template } from '../../shared/types';
import { CGBar } from '../Overlay';

const previewSpeaker: Speaker = {
  id: 'design-preview',
  academicTitle: '',
  name: 'Speaker Name',
  position: 'Title and department',
  department: '',
};

export function TemplatePreview({ template }: { template: Template }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const snapshot: Snapshot = {
    speakers: [previewSpeaker],
    selectedSpeakerId: previewSpeaker.id,
    settings: {
      template,
      speed: 1,
      animation: {
        effect: 'slide-up',
        duration: 0.65,
        easing: 'ease-out',
        enabled: true,
      },
    },
    live: { visible: true, cue: 0 },
  };

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateScale = () => setScale(frame.clientWidth / 1920);
    const observer = new ResizeObserver(updateScale);
    updateScale();
    observer.observe(frame);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className="design-checkerboard relative aspect-video w-full overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute left-0 top-0 h-[1080px] w-[1920px] origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        <div
          className="absolute inset-0"
          style={{ transform: 'translate(175px, -366px)' }}
        >
          <div
            className="absolute inset-0"
            style={{ transform: 'scale(1.18)', transformOrigin: '785px 906px' }}
          >
            <CGBar
              speaker={previewSpeaker}
              snapshot={snapshot}
              staticPreview
            />
          </div>
        </div>
      </div>
    </div>
  );
}
