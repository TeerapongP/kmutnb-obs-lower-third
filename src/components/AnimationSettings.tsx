import { useState } from 'react';
import { Play, RotateCcw, Settings2 } from 'lucide-react';
import type { LowerThirdAnimationSettings, Settings } from '../../shared/types';
import { animationEasingOptions, animationEffectOptions } from '../animations/presets';
import { buttonClass, cardClass, eyebrowClass, sectionHeadingClass } from '../ui';

type Props = {
  settings: Settings;
  onChange: (change: Partial<Settings>) => void;
  onPreview: () => void;
  onReplay: () => void;
};

export function AnimationSettings({ settings, onChange, onPreview, onReplay }: Props) {
  const [duration, setDuration] = useState(settings.animation.duration);
  const [syncedDuration, setSyncedDuration] = useState(settings.animation.duration);
  if (settings.animation.duration !== syncedDuration) {
    setSyncedDuration(settings.animation.duration);
    setDuration(settings.animation.duration);
  }
  const progress = ((duration - 0.3) / (2.5 - 0.3)) * 100;

  function update(change: Partial<LowerThirdAnimationSettings>) {
    onChange({ animation: { ...settings.animation, ...change } });
  }

  return (
    <section
      id="settings"
      className={`${cardClass} p-[23px]`}
      aria-labelledby="settings-title"
    >
      <div className="flex items-center gap-[13px]">
        <div className="grid size-[39px] place-items-center rounded-md bg-[#f0f1f1] text-[#25292b]">
          <Settings2 size={20} />
        </div>
        <div>
          <p className={eyebrowClass}>ANIMATION</p>
          <h2
            id="settings-title"
            className={`${sectionHeadingClass} text-[15px]`}
          >
            Animation settings
          </h2>
        </div>
      </div>
      <p className="mb-[17px] mt-[13px] text-[11px] text-[#9da1a2]">
        Configure the motion shown in the local preview.
      </p>

      <div className="grid grid-cols-2 gap-3 max-[900px]:grid-cols-1">
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-semibold text-[#555a5c]">
            Animation effect
          </span>
          <select
            className="h-10 w-full rounded-[5px] border border-[#dfe1e2] bg-white px-3 text-[11px] font-semibold text-[#25292b] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#f15a2420]"
            value={settings.animation.effect}
            disabled={!settings.animation.enabled}
            onChange={(event) =>
              update({
                effect: event.target.value as LowerThirdAnimationSettings['effect'],
              })
            }
          >
            {animationEffectOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-semibold text-[#555a5c]">
            Easing
          </span>
          <select
            className="h-10 w-full rounded-[5px] border border-[#dfe1e2] bg-white px-3 text-[11px] font-semibold text-[#25292b] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#f15a2420]"
            value={settings.animation.easing}
            disabled={!settings.animation.enabled}
            onChange={(event) =>
              update({
                easing: event.target.value as LowerThirdAnimationSettings['easing'],
              })
            }
          >
            {animationEasingOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-[18px] flex items-center justify-between">
        <div>
          <strong className="block text-xs font-semibold">Duration</strong>
          <span className="mt-0.5 block text-[10px] text-[#a2a5a7]">
            Entrance and exit timing
          </span>
        </div>
        <span className="rounded-[3px] bg-[#fff0e9] px-2 py-1.5 font-['DM_Sans'] text-[10px] font-extrabold text-[#df5c2c]">
          {duration.toFixed(1)}s
        </span>
      </div>
      <input
        className="speed-range mt-[17px] h-1 w-full appearance-none rounded-[5px] outline-none disabled:opacity-50"
        aria-label="Animation duration"
        type="range"
        min="0.3"
        max="2.5"
        step="0.1"
        value={duration}
        disabled={!settings.animation.enabled}
        style={{ '--speed-progress': `${progress}%` } as React.CSSProperties}
        onChange={(event) => setDuration(Number(event.target.value))}
        onPointerUp={() => update({ duration })}
        onKeyUp={() => update({ duration })}
      />
      <div className="mt-[9px] flex justify-between font-['DM_Sans'] text-[9px] font-bold tracking-[0.07em] text-[#aaaeb0]">
        <span>0.3s</span>
        <span>2.5s</span>
      </div>

      <div className="mt-[17px] grid grid-cols-2 gap-2">
        <button
          className={buttonClass('outline', 'w-full')}
          disabled={!settings.animation.enabled}
          onClick={onPreview}
        >
          <Play size={15} />
          Preview animation
        </button>
        <button
          className={buttonClass('primary', 'w-full')}
          disabled={!settings.animation.enabled}
          onClick={onReplay}
        >
          <RotateCcw size={15} />
          Replay preview animation
        </button>
      </div>

      <div className="my-[19px] h-px bg-[#eeefef]" />
      <label className="relative flex cursor-pointer items-center justify-between gap-4">
        <span>
          <strong className="block text-xs font-semibold">Animation enabled</strong>
          <small className="mt-0.5 block text-[10px] text-[#a2a5a7]">
            Show or hide the graphic instantly when disabled
          </small>
        </span>
        <input
          className="peer absolute right-0 opacity-0"
          type="checkbox"
          checked={settings.animation.enabled}
          onChange={(event) => update({ enabled: event.target.checked })}
        />
        <span className="relative h-[22px] w-10 flex-none rounded-[15px] bg-[#dfe2e3] transition-colors after:absolute after:left-[3px] after:top-[3px] after:size-4 after:rounded-full after:bg-white after:shadow-[0_1px_3px_#0002] after:transition-transform after:content-[''] peer-checked:bg-brand peer-checked:after:translate-x-[18px] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-brand" />
      </label>
    </section>
  );
}
