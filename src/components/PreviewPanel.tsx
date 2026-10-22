import { ArrowDownRight, ChevronDown } from 'lucide-react';
import { displayName, templateInfo, type Snapshot } from '../../shared/types';
import { PreviewStage } from '../Overlay';
import { cardClass, eyebrowClass, sectionHeadingClass } from '../ui';

export function PreviewPanel({
  snapshot,
  previewCue,
}: {
  snapshot: Snapshot;
  previewCue: number;
}) {
  const selected = snapshot.speakers.find(
    (speaker) => speaker.id === snapshot.selectedSpeakerId,
  );
  const previewSnapshot: Snapshot = {
    ...snapshot,
    live: {
      visible: snapshot.live.visible || previewCue > 0,
      cue: snapshot.live.cue + previewCue,
    },
  };
  return (
    <section
      className={`${cardClass} px-[22px] pt-[21px] max-[680px]:px-[15px] max-[680px]:pt-[15px]`}
      aria-labelledby="preview-title"
    >
      <div className="flex items-center justify-between gap-[18px]">
        <div>
          <p className={eyebrowClass}>PREVIEW MONITOR</p>
          <h2
            id="preview-title"
            className={sectionHeadingClass}
          >
            Studio preview <span className="mx-1 font-normal text-[#d1d3d4]">/</span>{' '}
            <span className="font-normal text-[#a3a6a7]">1920 × 1080</span>
          </h2>
        </div>
        <div className="flex items-center gap-5 max-[680px]:gap-2">
          <span
            className={`flex items-center gap-[7px] font-['DM_Sans'] text-[10px] font-extrabold tracking-[0.11em] ${snapshot.live.visible ? 'text-[#e15b2d]' : 'text-[#83888a]'}`}
            aria-label={`Application overlay ${snapshot.live.visible ? 'visible' : 'hidden'}`}
          >
            <span
              className={`size-[7px] rounded-full ${snapshot.live.visible ? 'bg-brand shadow-[0_0_0_4px_#f15a2420]' : 'bg-[#aeb3b5]'}`}
            />
            {snapshot.live.visible ? 'OVERLAY VISIBLE' : 'OVERLAY HIDDEN'}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-[#72787b] max-[680px]:hidden">
            {templateInfo[snapshot.settings.template].name} design{' '}
            <ChevronDown size={14} />
          </span>
        </div>
      </div>
      <div className="relative mt-5 overflow-hidden rounded border border-[#dededb] bg-[#e4e4e2]">
        <PreviewStage snapshot={previewSnapshot} />
        <div className="pointer-events-none absolute left-[17px] top-[17px] size-[14px] border-l border-t border-[#fff9]" />
        <div className="pointer-events-none absolute right-[17px] top-[17px] size-[14px] border-r border-t border-[#fff9]" />
        <div className="pointer-events-none absolute bottom-[17px] left-[17px] size-[14px] border-b border-l border-[#fff9]" />
        <div className="pointer-events-none absolute bottom-[17px] right-[17px] size-[14px] border-b border-r border-[#fff9]" />
        <span className="absolute left-[42px] top-[22px] font-['DM_Sans'] text-[9px] font-extrabold tracking-[0.16em] text-[#777b7bb0]">
          LOCAL PREVIEW
        </span>
      </div>
      <div className="flex items-center justify-between px-px py-[14px] text-[10px] text-[#8b9091]">
        <span className="flex items-center gap-[7px]">
          <span className="size-1.5 rounded-full bg-brand" />
          {selected ? (
            <>
              Current:{' '}
              <strong className="font-semibold text-[#353839]">
                {displayName(selected)}
              </strong>
            </>
          ) : (
            'No speaker selected'
          )}
        </span>
        <span className="flex items-center gap-[7px]">
          Safe area · 16:9{' '}
          <ArrowDownRight
            className="text-[#c2c5c4]"
            size={14}
          />
        </span>
      </div>
    </section>
  );
}
