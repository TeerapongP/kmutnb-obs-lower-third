import { displayName, templateInfo, type Snapshot } from '../../shared/types';
import { cardClass, eyebrowClass, sectionHeadingClass } from '../ui';

export function DashboardSection({
  snapshot,
  persistenceError,
}: {
  snapshot: Snapshot;
  persistenceError: string | null;
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
        Your lineup and graphics are saved in this browser. External broadcast status is
        not connected.
      </p>
      {persistenceError && (
        <div
          className={`${cardClass} mb-[13px] p-4 text-xs text-[#9c5b22]`}
          role="alert"
        >
          {persistenceError}
        </div>
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
    </section>
  );
}
