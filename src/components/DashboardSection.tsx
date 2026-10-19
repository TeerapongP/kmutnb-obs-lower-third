import { displayName, templateInfo, type Snapshot } from '../../shared/types';
import { cardClass, eyebrowClass, sectionHeadingClass } from '../ui';

export function DashboardSection({
  snapshot,
  ready,
  connected,
  connectionError,
}: {
  snapshot: Snapshot;
  ready: boolean;
  connected: boolean;
  connectionError: string | null;
}) {
  const selected = snapshot.speakers.find(
    (speaker) => speaker.id === snapshot.selectedSpeakerId,
  );
  const summary = [
    { label: 'Speakers', value: snapshot.speakers.length },
    {
      label: 'Selected speaker',
      value: selected ? displayName(selected) : 'None selected',
    },
    { label: 'Template', value: templateInfo[snapshot.settings.template].name },
    { label: 'Application overlay', value: snapshot.live.visible ? 'Visible' : 'Hidden' },
  ];

  return (
    <section
      id="dashboard"
      className="mb-[21px] scroll-mt-5"
      aria-labelledby="dashboard-title"
    >
      <p className={eyebrowClass}>WORKSPACE SUMMARY</p>
      <h2
        id="dashboard-title"
        className={sectionHeadingClass}
      >
        Dashboard
      </h2>
      <p className="mb-[18px] mt-1.5 text-[11px] text-[#8b8f92]">
        Application state for your lineup and graphics. OBS broadcast status is not
        monitored.
      </p>
      {!ready ? (
        <div
          className={`${cardClass} p-5 text-xs text-[#686e71]`}
          role={connectionError ? 'alert' : 'status'}
        >
          {connectionError
            ? 'Could not load dashboard data. The server connection failed; retrying automatically.'
            : 'Loading dashboard data…'}
        </div>
      ) : (
        <>
          {!connected && (
            <p
              className="mb-[13px] rounded border border-[#f1d6ba] bg-[#fff5e9] px-4 py-3 text-xs text-[#9c5b22]"
              role="status"
            >
              Connection lost. Showing the last received data; it may be out of date.
              Reconnecting automatically.
            </p>
          )}
          <dl className="m-0 grid grid-cols-4 gap-[17px] max-[1200px]:grid-cols-2 max-[680px]:grid-cols-1">
            {summary.map(({ label, value }) => (
              <div
                key={label}
                className={`${cardClass} min-w-0 p-[19px]`}
              >
                <dt className="text-[11px] font-medium text-[#8b8f92]">{label}</dt>
                <dd className="m-0 mt-2 break-words text-[19px] font-semibold leading-snug tracking-[-0.035em]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </section>
  );
}
