import { Eye, Pencil, Play, Plus, Trash2, Users } from 'lucide-react';
import type { Speaker } from '../../shared/types';
import { buttonClass, cardClass, eyebrowClass } from '../ui';

export function SpeakerList({
  speakers,
  selectedId,
  onSelect,
  onShow,
  onEdit,
  onDelete,
  onAdd,
}: {
  speakers: Speaker[];
  selectedId: string | null;
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
            Manage the profiles shown in your preview.
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
      <div
        className="overflow-x-auto rounded-[5px] border border-[#eceeed] focus-visible:outline-brand"
        role="region"
        aria-label="Speaker lineup table"
        tabIndex={0}
      >
        <table className="w-full min-w-[640px] border-collapse text-left text-[11px]">
          <caption className="sr-only">Speaker profiles and lineup actions</caption>
          <thead className="bg-[#f8f9f8] text-[10px] text-[#686e71]">
            <tr>
              <th
                scope="col"
                className="px-[14px] py-3 font-semibold"
              >
                Speaker
              </th>
              <th
                scope="col"
                className="px-[14px] py-3 font-semibold"
              >
                Position and department
              </th>
              <th
                scope="col"
                className="px-[14px] py-3 font-semibold"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {speakers.length ? (
              speakers.map((speaker, index) => (
                <tr
                  className={`border-t border-[#eceeed] ${speaker.id === selectedId ? 'bg-[#fffbf8]' : ''}`}
                  key={speaker.id}
                >
                  <th
                    scope="row"
                    className="font-normal"
                  >
                    <button
                      className="flex w-full items-center gap-[13px] border-0 bg-transparent px-[14px] py-[15px] text-left disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => onSelect(speaker.id)}
                      aria-label={`Select ${speaker.name}`}
                      aria-pressed={speaker.id === selectedId}
                    >
                      <span className="w-[19px] font-['DM_Sans'] text-[10px] font-bold text-[#b2b6b7]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="grid size-[35px] flex-none place-items-center rounded bg-[#f7e4db] text-[11px] font-bold text-[#c85a30]">
                        {speaker.name.slice(0, 2)}
                      </span>
                      <span className="min-w-[130px] flex-1">
                        <strong className="block text-[11px] font-semibold">
                          {speaker.academicTitle} {speaker.name}
                        </strong>
                        <span className="mt-1 flex items-center gap-2">
                          {speaker.demo && (
                            <span className="rounded-sm bg-[#eff0f0] px-1.5 py-[5px] font-['DM_Sans'] text-[8px] font-extrabold tracking-[0.08em] text-[#757b7d]">
                              DEMO
                            </span>
                          )}
                          {speaker.id === selectedId && (
                            <span className="flex items-center gap-1 font-['DM_Sans'] text-[8px] font-extrabold tracking-[0.07em] text-[#e15f2e]">
                              <Eye size={14} /> SELECTED
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </th>
                  <td className="min-w-[180px] px-[14px] py-[11px] text-[#757b7d]">
                    {[speaker.position, speaker.department].filter(Boolean).join(' · ') ||
                      'No title added'}
                  </td>
                  <td className="px-[10px] py-[11px]">
                    <div className="flex gap-[3px]">
                      <button
                        className="grid size-[30px] place-items-center rounded-[3px] border-0 bg-transparent text-[#8b9092] hover:bg-[#fff0e9] hover:text-[#df5b2b] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Show ${speaker.name}`}
                        title="Show speaker"
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>
                  <div className="flex flex-col items-center gap-[7px] p-10 text-[11px] text-[#9ca0a1]">
                    <Users size={26} />
                    <strong className="text-[#45494a]">No speakers yet</strong>
                    <span>Add a profile to start your lineup.</span>
                    <button
                      className={buttonClass('outline', 'mt-2')}
                      onClick={onAdd}
                    >
                      <Plus size={17} /> Add your first speaker
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
