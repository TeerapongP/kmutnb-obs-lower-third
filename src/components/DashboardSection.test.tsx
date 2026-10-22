import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { initialData, type Snapshot } from '../../shared/types';
import { DashboardSection } from './DashboardSection';
import { SpeakerList } from './SpeakerList';

const snapshot: Snapshot = {
  ...initialData,
  speakers: [
    {
      id: 'ada',
      name: 'Ada Lovelace',
      academicTitle: 'Dr.',
      position: 'Researcher',
      department: 'Computing',
      demo: true,
    },
    {
      id: 'grace',
      name: 'Grace Hopper',
      academicTitle: '',
      position: '',
      department: '',
    },
  ],
  selectedSpeakerId: 'ada',
  settings: { ...initialData.settings, template: 'modern' },
  live: { visible: true, cue: 1 },
};

function dashboard(overrides: Partial<Parameters<typeof DashboardSection>[0]> = {}) {
  return renderToStaticMarkup(
    <DashboardSection
      snapshot={snapshot}
      ready={true}
      connected={true}
      connectionError={null}
      {...overrides}
    />,
  );
}

function visibleText(markup: string) {
  return markup
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function lineup(data = snapshot, connected = true) {
  return renderToStaticMarkup(
    <SpeakerList
      speakers={data.speakers}
      selectedId={data.selectedSpeakerId}
      connected={connected}
      onSelect={() => {}}
      onShow={() => {}}
      onEdit={() => {}}
      onDelete={() => {}}
      onAdd={() => {}}
    />,
  );
}

describe('dashboard summary', () => {
  it('derives the count, selected label, template name and application overlay state from the snapshot', () => {
    const text = visibleText(dashboard());
    expect(text).toContain(
      'Speakers 2 Selected speaker Dr. Ada Lovelace Template Tilted Application overlay Visible',
    );
    expect(text).toContain('OBS broadcast status is not monitored.');
  });

  it('shows loading without exposing initial demo values before the first snapshot', () => {
    const markup = dashboard({
      snapshot: { ...initialData, live: { visible: false, cue: 0 } },
      ready: false,
      connected: false,
    });
    expect(markup).toContain('role="status"');
    expect(visibleText(markup)).toContain('Loading dashboard data…');
    expect(markup).not.toContain(initialData.speakers[0].name);
    expect(markup).not.toContain('<dl');
  });

  it('shows an initial connection error with automatic retry status', () => {
    const markup = dashboard({
      ready: false,
      connected: false,
      connectionError: 'xhr poll error',
    });
    expect(markup).toContain('role="alert"');
    expect(visibleText(markup)).toContain('Could not load dashboard data.');
    expect(visibleText(markup)).toContain('retrying automatically.');
    expect(markup).not.toContain('Ada Lovelace');
  });

  it('shows zero speakers, no selection and hidden application overlay for an empty snapshot', () => {
    const empty: Snapshot = {
      ...snapshot,
      speakers: [],
      selectedSpeakerId: null,
      live: { visible: false, cue: 0 },
    };
    expect(visibleText(dashboard({ snapshot: empty }))).toContain(
      'Speakers 0 Selected speaker None selected Template Tilted Application overlay Hidden',
    );
    const markup = lineup(empty);
    expect(markup).toContain('<table');
    expect(visibleText(markup)).toContain('No speakers yet');
    expect(visibleText(markup)).toContain('Add your first speaker');
    expect(markup).not.toContain('aria-label="Select');
  });

  it('keeps the last snapshot visible and marks it stale when disconnected', () => {
    const text = visibleText(dashboard({ connected: false, connectionError: 'offline' }));
    expect(text).toContain('Showing the last received data; it may be out of date.');
    expect(text).toContain('Reconnecting automatically.');
    expect(text).toContain('Selected speaker Dr. Ada Lovelace');
    expect(text).toContain('Application overlay Visible');
    expect(text).not.toContain('Could not load dashboard data.');
  });

  it('handles a missing selected speaker without inventing a selection', () => {
    expect(
      visibleText(
        dashboard({
          snapshot: { ...snapshot, selectedSpeakerId: 'removed' },
        }),
      ),
    ).toContain('Selected speaker None selected');
  });
});

describe('speaker table', () => {
  it('shows semantic headers, every speaker, demo and selected status, and named actions', () => {
    const markup = lineup();
    expect(markup).toContain('<caption');
    expect(markup).toContain('Speaker profiles and lineup actions');
    expect(markup.match(/scope="col"/g)).toHaveLength(3);
    expect(markup.match(/scope="row"/g)).toHaveLength(2);
    expect(visibleText(markup)).toContain('Dr. Ada Lovelace DEMO SELECTED');
    expect(visibleText(markup)).toContain('Grace Hopper');
    expect(visibleText(markup)).toContain('No title added');
    for (const action of ['Select', 'Show', 'Edit', 'Delete']) {
      expect(markup).toContain(`aria-label="${action} Ada Lovelace"`);
    }
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).not.toContain('disabled=""');
  });

  it('disables selection and show when disconnected while retaining edit, delete and add', () => {
    const buttons = lineup(snapshot, false).match(/<button\b[^>]*>/g) ?? [];
    for (const action of ['Select', 'Show']) {
      expect(
        buttons.find((button) => button.includes(`aria-label="${action} Ada Lovelace"`)),
      ).toContain('disabled=""');
    }
    for (const action of ['Edit', 'Delete']) {
      expect(
        buttons.find((button) => button.includes(`aria-label="${action} Ada Lovelace"`)),
      ).not.toContain('disabled=""');
    }
    expect(buttons.filter((button) => button.includes('disabled=""'))).toHaveLength(4);
  });
});
