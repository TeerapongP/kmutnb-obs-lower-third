import { Eye, Pencil, Play, Plus, Trash2, Users } from 'lucide-react';
import type { Speaker } from '../../shared/types';
import { buttonClass, cardClass, eyebrowClass } from '../ui';

export function SpeakerList({
  speakers,
  selectedId,
  connected,
  onSelect,
  onShow,
  onEdit,
  onDelete,
  onAdd,
}: {
  speakers: Speaker[];
  selectedId: string | null;
  connected: boolean;
  onSelect: (id: string) => void;
  onShow: (id: string) => void;
  onEdit: (speaker: Speaker) => void;
  onDelete: (speaker: Speaker) => void;
  onAdd: () => void;
}) {
  return (
    <section
      id="speakers"
      className={`${cardClass} mt-[35px] p-[23px] max-[680px]:p-[15px]`}
      aria-labelledby="speaker-title"
    >
      <div className="mb-[18px] flex items-center justify-between gap-[18px]">
        <div>
          <p className={eyebrowClass}>SPEAKER PROFILES</p>
          <h2
            id="speaker-title"
            className="mb-0 mt-[5px] text-[19px] font-[650] tracking-[-0.035em]"
          >
            Your lineup{' '}
            <span className="font-normal text-[#a3a6a7]">({speakers.length})</span>
          </h2>
          <p className="mb-0 mt-1.5 text-[11px] text-[#9ba0a1]">
            Manage names and titles for your next broadcast.
          </p>
        </div>
        <button
          className={buttonClass('outline')}
          onClick={onAdd}
        >
          <Plus size={17} />
          Add speaker
        </button>
      </div>
      <div className="overflow-hidden rounded-[5px] border border-[#eceeed]">
        {speakers.length ? (
          speakers.map((speaker, index) => (
            <div
              className={`flex min-h-[68px] items-center border-t border-[#eceeed] first:border-t-0 ${speaker.id === selectedId ? 'bg-[#fffbf8]' : ''}`}
              key={speaker.id}
            >
              <button
                className="flex min-w-0 flex-1 items-center gap-[13px] border-0 bg-transparent px-[14px] py-[11px] text-left max-[680px]:gap-2 max-[680px]:p-[9px]"
                onClick={() => onSelect(speaker.id)}
                disabled={!connected}
                aria-label={`Select ${speaker.name}`}
              >
                <span className="w-[19px] font-['DM_Sans'] text-[10px] font-bold text-[#b2b6b7] max-[680px]:hidden">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="grid size-[35px] flex-none place-items-center rounded bg-[#f7e4db] text-[11px] font-bold text-[#c85a30]">
                  {speaker.name.slice(0, 2)}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold">
                    {speaker.academicTitle} {speaker.name}
                  </strong>
                  <small className="mt-[3px] block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] text-[#a0a4a5]">
                    {[speaker.position, speaker.department].filter(Boolean).join(' · ') ||
                      'No title added'}
                  </small>
                </span>
                {speaker.demo && (
                  <span className="rounded-sm bg-[#eff0f0] px-1.5 py-[5px] font-['DM_Sans'] text-[8px] font-extrabold tracking-[0.08em] text-[#9ca0a1] max-[680px]:hidden">
                    DEMO
                  </span>
                )}
                {speaker.id === selectedId && (
                  <span className="flex items-center gap-1 font-['DM_Sans'] text-[8px] font-extrabold tracking-[0.07em] text-[#e15f2e] max-[1200px]:hidden">
                    <Eye size={14} /> SELECTED
                  </span>
                )}
              </button>
              <div className="flex gap-[3px] pr-[10px] max-[680px]:gap-0 max-[680px]:pr-[3px]">
                <button
                  className="grid size-[30px] place-items-center rounded-[3px] border-0 bg-transparent text-[#8b9092] hover:bg-[#fff0e9] hover:text-[#df5b2b] max-[680px]:w-[27px]"
                  aria-label={`Show ${speaker.name}`}
                  title="Show speaker"
                  disabled={!connected}
                  onClick={() => onShow(speaker.id)}
                >
                  <Play size={16} />
                </button>
                <button
                  className="grid size-[30px] place-items-center rounded-[3px] border-0 bg-transparent text-[#8b9092] hover:bg-[#fff0e9] hover:text-[#df5b2b] max-[680px]:w-[27px]"
                  aria-label={`Edit ${speaker.name}`}
                  title="Edit speaker"
                  onClick={() => onEdit(speaker)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="grid size-[30px] place-items-center rounded-[3px] border-0 bg-transparent text-[#8b9092] hover:bg-[#fff0e9] hover:text-[#df5b2b] max-[680px]:w-[27px]"
                  aria-label={`Delete ${speaker.name}`}
                  title="Delete speaker"
                  onClick={() => onDelete(speaker)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-[7px] p-10 text-[11px] text-[#9ca0a1]">
            <Users size={26} />
            <strong className="text-[#45494a]">No speakers yet</strong>
            <span>Add a profile to start your lineup.</span>
          </div>
        )}
      </div>
    </section>
  );
}
