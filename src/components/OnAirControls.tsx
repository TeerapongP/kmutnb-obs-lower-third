import { ChevronDown, EyeOff, FastForward, Play, Radio, RotateCcw } from 'lucide-react';
import { displayName, type Speaker } from '../../shared/types';
import { buttonClass, cardClass, eyebrowClass, sectionHeadingClass } from '../ui';

type Action = 'show' | 'hide' | 'next' | 'replay';
export function OnAirControls({
  speaker,
  onAction,
}: {
  speaker: Speaker | null;
  onAction: (action: Action) => void;
}) {
  return (
    <section
      className={`${cardClass} p-[23px]`}
      aria-labelledby="control-title"
    >
      <div className="flex items-center gap-[13px]">
        <div className="grid size-[39px] place-items-center rounded-md bg-[#fff0e9] text-brand">
          <Radio size={20} />
        </div>
        <div>
          <p className={eyebrowClass}>PREVIEW CONTROLS</p>
          <h2
            id="control-title"
            className={`${sectionHeadingClass} text-[15px]`}
          >
            Studio controls
          </h2>
        </div>
      </div>
      <p className="mb-[17px] mt-[13px] text-[11px] text-[#9da1a2]">
        Show and hide the selected graphic in this browser preview.
      </p>
      <div className="flex h-[67px] items-center gap-[11px] rounded-[5px] border border-[#eceeed] bg-[#fafafa] px-3 py-2">
        <div className="grid size-[39px] flex-none place-items-center rounded bg-[#f7e4db] text-[13px] font-bold text-[#c85a30]">
          {speaker ? speaker.name.slice(0, 2) : '—'}
        </div>
        <div className="min-w-0 flex-1">
          <small className="block overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans'] text-[8px] font-extrabold tracking-[0.13em] text-[#a4a7a9]">
            SELECTED SPEAKER
          </small>
          <strong className="mt-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-xs">
            {speaker ? displayName(speaker) : 'No speaker selected'}
          </strong>
          <span className="mt-px block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] text-[#9b9fa0]">
            {speaker?.position || 'Choose a profile below'}
          </span>
        </div>
        <ChevronDown
          className="text-[#b5b8ba]"
          size={18}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-[9px]">
        <button
          className={buttonClass('primary', 'h-[43px]')}
          disabled={!speaker}
          onClick={() => onAction('show')}
        >
          <Play
            size={17}
            fill="currentColor"
          />
          Show CG
        </button>
        <button
          className={buttonClass('dark', 'h-[43px]')}
          onClick={() => onAction('hide')}
        >
          <EyeOff size={17} />
          Hide CG
        </button>
      </div>
      <div className="mt-[10px] grid grid-cols-2 gap-2">
        <button
          className="flex h-[37px] items-center justify-center gap-2 rounded border border-[#e9eaea] bg-transparent text-[10px] font-semibold text-[#6b7072] hover:bg-[#f7f7f6] hover:text-[#2d3133] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!speaker}
          onClick={() => onAction('next')}
        >
          <FastForward size={17} />
          Next speaker
        </button>
        <button
          className="flex h-[37px] items-center justify-center gap-2 rounded border border-[#e9eaea] bg-transparent text-[10px] font-semibold text-[#6b7072] hover:bg-[#f7f7f6] hover:text-[#2d3133] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!speaker}
          onClick={() => onAction('replay')}
        >
          <RotateCcw size={17} />
          Replay animation
        </button>
      </div>
    </section>
  );
}
