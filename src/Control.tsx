import { useEffect, useState } from 'react';
import { Activity, Copy, ExternalLink, Plus, X } from 'lucide-react';
import type { Settings, Speaker, Template } from '../shared/types';
import { api, useLive } from './live';
import { AppChrome } from './components/AppChrome';
import { PreviewPanel } from './components/PreviewPanel';
import { OnAirControls } from './components/OnAirControls';
import { AnimationSettings } from './components/AnimationSettings';
import { DesignLibrary } from './components/DesignLibrary';
import { SpeakerList } from './components/SpeakerList';
import { SpeakerEditor } from './components/SpeakerEditor';
import { DashboardSection } from './components/DashboardSection';
import { ControlAccess } from './components/ControlAccess';
import { buttonClass } from './ui';

export function ControlPage() {
  const { snapshot, connected, ready, connectionError, command } = useLive();
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

  function error(value: unknown) {
    setMessage(value instanceof Error ? value.message : String(value));
  }
  function run(type: 'show' | 'hide' | 'next' | 'replay' | 'select', speakerId?: string) {
    if (type === 'hide') setPreviewCue(0);
    void command({ type, speakerId }).catch(error);
  }
  function setting(change: Partial<Settings>) {
    void api('/settings', 'PATCH', change).catch(error);
  }
  async function remove(speaker: Speaker) {
    if (!window.confirm(`Delete ${speaker.name}?`)) return;
    try {
      await api(`/speakers/${speaker.id}`, 'DELETE');
    } catch (issue) {
      error(issue);
    }
  }
  async function copyLink() {
    const url = `${location.origin}/overlay`;
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Overlay URL copied.');
    } catch {
      setMessage(url);
    }
  }

  return (
    <AppChrome connected={connected}>
      <main
        id="overview"
        className="mx-auto max-w-[1530px] px-[38px] pt-[37px] max-[1200px]:px-[26px] max-[1200px]:pt-[30px] max-[900px]:px-5 max-[900px]:pt-[27px]"
      >
        <div className="mb-8 flex items-end justify-between gap-5 max-[680px]:flex-col max-[680px]:items-start">
          <div>
            <div className="flex items-center gap-[9px] font-['DM_Sans'] text-[10px] font-extrabold tracking-[0.17em] text-brand">
              <span className="size-[7px] rotate-45 bg-brand" /> LIVE PRODUCTION CONTROL
            </div>
            <h1 className="mb-[7px] mt-[11px] text-[31px] font-bold leading-[1.2] tracking-[-0.05em] max-[680px]:text-[27px]">
              Lower third studio<span className="text-brand">.</span>
            </h1>
            <p className="m-0 text-xs text-[#8b8f92]">
              Manage speakers, shape your graphics, and cue the next moment on air.
            </p>
          </div>
          <div className="flex gap-[9px] max-[680px]:w-full max-[680px]:[&>*]:flex-1">
            <a
              className={buttonClass('outline')}
              href="/overlay"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={17} />
              Open overlay
            </a>
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
          ready={ready}
          connected={connected}
          connectionError={connectionError}
        />
        <PreviewPanel
          snapshot={snapshot}
          previewCue={previewCue}
        />
        <div className="mt-[19px] grid grid-cols-2 gap-[17px] max-[680px]:grid-cols-1">
          <OnAirControls
            speaker={selected}
            connected={connected}
            onAction={(action) => run(action)}
          />
          <AnimationSettings
            settings={snapshot.settings}
            onChange={setting}
            onPreview={() => setPreviewCue((value) => value + 1)}
            onReplay={() => run('replay')}
          />
        </div>
        <DesignLibrary
          selected={snapshot.settings.template}
          onSelect={(template: Template) => setting({ template })}
        />
        {ready && (
          <SpeakerList
            speakers={snapshot.speakers}
            selectedId={snapshot.selectedSpeakerId}
            connected={connected}
            onSelect={(id) => run('select', id)}
            onShow={(id) => run('show', id)}
            onEdit={setEditing}
            onDelete={(speaker) => void remove(speaker)}
            onAdd={() => setEditing('new')}
          />
        )}
        <section
          id="guide"
          className="mt-[21px] flex items-center gap-[15px] rounded-[7px] bg-[#24282b] px-[22px] py-[19px] text-white max-[680px]:items-start max-[680px]:flex-wrap"
        >
          <div className="grid size-[39px] flex-none place-items-center rounded-[5px] bg-brand text-white">
            <Activity size={22} />
          </div>
          <div className="flex-1">
            <strong className="text-xs">Connect to OBS Studio</strong>
            <p className="mb-0 mt-1 text-[10px] text-[#aeb4b6]">
              Add a Browser Source at 1920 × 1080 using the overlay URL. Keep this control
              page open to cue graphics live.
            </p>
          </div>
          <button
            className={buttonClass(
              'primary',
              'border border-[#F15A24] ' +
                'shadow-[0_2px_10px_rgba(241,90,36,0.20)] ' +
                'hover:border-[#FF7848] hover:bg-[#FF7848] ' +
                'hover:shadow-[0_4px_16px_rgba(241,90,36,0.30)] ' +
                'active:scale-[0.98] ' +
                'focus-visible:outline-none focus-visible:ring-2 ' +
                'focus-visible:ring-[#FF9A75] focus-visible:ring-offset-2 ' +
                'focus-visible:ring-offset-[#23282B] ' +
                'transition-all duration-200 max-[680px]:w-full',
            )}
            onClick={() => void copyLink()}
          >
            <Copy size={16} />
            Copy overlay URL
          </button>
        </section>
        <div id="settings">
          <ControlAccess />
        </div>
        <footer className="flex justify-between px-px py-[27px] font-['DM_Sans'] text-[9px] font-bold tracking-[0.11em] text-[#a7abad] max-[680px]:gap-4">
          <span>KMUTNB BROADCAST STUDIO</span>
          <span>Built for the moments that matter on air.</span>
        </footer>
      </main>
      {editing && (
        <SpeakerEditor
          speaker={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onError={setMessage}
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
