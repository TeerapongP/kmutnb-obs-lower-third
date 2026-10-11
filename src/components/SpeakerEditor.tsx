import { useState, type FormEvent } from 'react';
import { Save, X } from 'lucide-react';
import type { Speaker } from '../../shared/types';
import { api } from '../live';
import { buttonClass, eyebrowClass, iconButtonClass } from '../ui';

type Form = Pick<Speaker, 'name' | 'academicTitle' | 'position' | 'department'>;
const empty: Form = { name: '', academicTitle: '', position: '', department: '' };

export function SpeakerEditor({
  speaker,
  onClose,
  onError,
}: {
  speaker: Speaker | null;
  onClose: () => void;
  onError: (message: string) => void;
}) {
  const [form, setForm] = useState<Form>(
    speaker
      ? {
          name: speaker.name,
          academicTitle: speaker.academicTitle,
          position: speaker.position,
          department: speaker.department,
        }
      : empty,
  );
  const [saving, setSaving] = useState(false);
  function field(key: keyof Form, label: string, placeholder: string, required = false) {
    return (
      <label
        className="mt-[13px] block text-[11px] font-semibold"
        key={key}
      >
        {label}
        <input
          required={required}
          className="mt-1.5 block h-[42px] w-full rounded border border-[#dfe2e2] bg-white px-3 text-xs outline-none placeholder:text-[#bdc0c1] focus:border-brand focus:shadow-[0_0_0_3px_#f15a241a]"
          value={form[key]}
          maxLength={key === 'name' ? 180 : key === 'academicTitle' ? 80 : 220}
          placeholder={placeholder}
          onChange={(event) => setForm({ ...form, [key]: event.target.value })}
        />
      </label>
    );
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await api(
        speaker ? `/speakers/${speaker.id}` : '/speakers',
        speaker ? 'PUT' : 'POST',
        form,
      );
      onClose();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Could not save speaker.');
    } finally {
      setSaving(false);
    }
  }
  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[#0d1116a8] p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="w-full max-w-[570px] rounded-lg bg-white p-[26px] shadow-[0_20px_70px_#0003]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-title"
      >
        <div className="mb-[19px] flex items-start justify-between">
          <div>
            <p className={eyebrowClass}>SPEAKER PROFILE</p>
            <h2
              id="editor-title"
              className="mb-0 mt-[5px] text-[22px]"
            >
              {speaker ? 'Edit speaker' : 'Add a speaker'}
            </h2>
          </div>
          <button
            className={iconButtonClass}
            aria-label="Close editor"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={save}>
          {field('name', 'Speaker name *', 'e.g. ดร. กานต์ชนก วัฒนกุล', true)}
          <div className="grid grid-cols-[1fr_1.4fr] gap-3 max-[680px]:grid-cols-1">
            {field('academicTitle', 'Academic title', 'e.g. ผศ. / Prof. Dr.')}
            {field('position', 'Position', 'e.g. Head of Department')}
          </div>
          {field('department', 'Department / Faculty', 'e.g. คณะวิศวกรรมศาสตร์')}
          <p className="my-[18px] text-[10px] text-[#929899]">
            Thai and English text are supported. Changes appear in OBS immediately.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className={buttonClass('ghost')}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={buttonClass('primary')}
              type="submit"
              disabled={saving}
            >
              <Save size={16} />
              {saving ? 'Saving…' : 'Save speaker'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
