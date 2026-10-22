import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Speaker, Template } from '../shared/types';
import { useStudio } from './studio';
import { AppChrome } from './components/AppChrome';
import { PreviewPanel } from './components/PreviewPanel';
import { OnAirControls } from './components/OnAirControls';
import { AnimationSettings } from './components/AnimationSettings';
import { DesignLibrary } from './components/DesignLibrary';
import { SpeakerList } from './components/SpeakerList';
import { SpeakerEditor } from './components/SpeakerEditor';
import { DashboardSection } from './components/DashboardSection';
import { buttonClass } from './ui';

export function ControlPage() {
  const {
    snapshot,
    persistenceError,
    command,
    updateSettings,
    saveSpeaker,
    deleteSpeaker,
  } = useStudio();
  const [editing, setEditing] = useState<Speaker | 'new' | null>(null);
  const [message, setMessage] = useState('');
  const [previewCue, setPreviewCue] = useState(0);
  const selected =
    snapshot.speakers.find((speaker) => speaker.id === snapshot.selectedSpeakerId) ??
    null;

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 4500);
    return () => clearTimeout(timer);
  }, [message]);

  function run(type: 'show' | 'hide' | 'next' | 'replay' | 'select', speakerId?: string) {
    if (type === 'hide') setPreviewCue(0);
    command({ type, speakerId });
  }
  function save(
    fields: Pick<Speaker, 'name' | 'academicTitle' | 'position' | 'department'>,
  ) {
    saveSpeaker({
      ...fields,
      id: editing && editing !== 'new' ? editing.id : crypto.randomUUID(),
    });
    setEditing(null);
  }
  function remove(speaker: Speaker) {
    if (!window.confirm(`Delete ${speaker.name}?`)) return;
    deleteSpeaker(speaker.id);
  }

  return (
    <AppChrome>
      <main
        id="overview"
        className="mx-auto max-w-[1530px] px-[38px] pt-[37px] max-[1200px]:px-[26px] max-[1200px]:pt-[30px] max-[900px]:px-5 max-[900px]:pt-[27px]"
      >
        <div className="mb-8 flex items-end justify-between gap-5 max-[680px]:flex-col max-[680px]:items-start">
          <div>
            <div className="flex items-center gap-[9px] font-['DM_Sans'] text-[10px] font-extrabold tracking-[0.17em] text-brand">
              <span className="size-[7px] rotate-45 bg-brand" /> LOCAL STUDIO
            </div>
            <h1 className="mb-[7px] mt-[11px] text-[31px] font-bold leading-[1.2] tracking-[-0.05em] max-[680px]:text-[27px]">
              Lower third studio<span className="text-brand">.</span>
            </h1>
            <p className="m-0 text-xs text-[#8b8f92]">
              Manage speaker profiles, designs, and the studio preview.
            </p>
          </div>
          <div className="flex gap-[9px] max-[680px]:w-full max-[680px]:[&>*]:flex-1">
            <button
              className={buttonClass('primary')}
              onClick={() => setEditing('new')}
            >
              <Plus size={17} />
              Add speaker
            </button>
          </div>
        </div>
        <DashboardSection
          snapshot={snapshot}
          persistenceError={persistenceError}
        />
        <PreviewPanel
          snapshot={snapshot}
          previewCue={previewCue}
        />
        <div className="mt-[19px] grid grid-cols-2 gap-[17px] max-[680px]:grid-cols-1">
          <OnAirControls
            speaker={selected}
            onAction={(action) => run(action)}
          />
          <AnimationSettings
            settings={snapshot.settings}
            onChange={updateSettings}
            onPreview={() => setPreviewCue((value) => value + 1)}
            onReplay={() => run('replay')}
          />
        </div>
        <DesignLibrary
          selected={snapshot.settings.template}
          onSelect={(template: Template) => updateSettings({ template })}
        />
        <SpeakerList
          speakers={snapshot.speakers}
          selectedId={snapshot.selectedSpeakerId}
          onSelect={(id) => run('select', id)}
          onShow={(id) => run('show', id)}
          onEdit={setEditing}
          onDelete={remove}
          onAdd={() => setEditing('new')}
        />
        <footer className="flex justify-between px-px py-[27px] font-['DM_Sans'] text-[9px] font-bold tracking-[0.11em] text-[#a7abad] max-[680px]:gap-4">
          <span>KMUTNB BROADCAST STUDIO</span>
          <span>Made for local lower-third previews.</span>
        </footer>
      </main>
      {editing && (
        <SpeakerEditor
          speaker={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onError={setMessage}
          onSave={save}
        />
      )}
      {message && (
        <div
          className="fixed bottom-5 right-5 z-[100] flex max-w-[400px] items-center gap-[18px] rounded-[5px] bg-[#25292b] px-[14px] py-[11px] text-xs text-white shadow-[0_8px_30px_#0003]"
          role="status"
        >
          {message}
          <button
            className="grid place-items-center border-0 bg-transparent text-white"
            aria-label="Dismiss message"
            onClick={() => setMessage('')}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </AppChrome>
  );
}
