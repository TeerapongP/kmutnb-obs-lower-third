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

function dashboard(data = snapshot, persistenceError: string | null = null) {
  return renderToStaticMarkup(
    <DashboardSection
      snapshot={data}
      persistenceError={persistenceError}
    />,
  );
}

function visibleText(markup: string) {
  return markup
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function speakerList(data = snapshot) {
  return renderToStaticMarkup(
    <SpeakerList
      speakers={data.speakers}
      selectedId={data.selectedSpeakerId}
      onSelect={() => {}}
      onShow={() => {}}
      onEdit={() => {}}
      onDelete={() => {}}
      onAdd={() => {}}
    />,
  );
}

describe('dashboard summary', () => {
  it('derives the count, selected label, template and local overlay state from the snapshot', () => {
    const text = visibleText(dashboard());
    expect(text).toContain(
      'Speakers 2 Selected speaker Dr. Ada Lovelace Template Tilted Application overlay Visible',
    );
    expect(text).toContain('saved in this browser');
    expect(text).toContain('External broadcast status is not connected.');
  });

  it('shows empty data without hiding the summary or speaker controls', () => {
    const empty: Snapshot = {
      ...snapshot,
      speakers: [],
      selectedSpeakerId: null,
      live: { visible: false, cue: 0 },
    };
    expect(visibleText(dashboard(empty))).toContain(
      'Speakers 0 Selected speaker None selected Template Tilted Application overlay Hidden',
    );
    const markup = speakerList(empty);
    expect(markup).toContain('<table');
    expect(visibleText(markup)).toContain('No speakers yet');
    expect(visibleText(markup)).toContain('Add your first speaker');
  });

  it('reports browser storage errors while keeping the current summary visible', () => {
    const markup = dashboard(
      snapshot,
      'Could not save browser data. Changes may not persist.',
    );
    expect(markup).toContain('role="alert"');
    expect(visibleText(markup)).toContain('Speakers 2');
    expect(visibleText(markup)).toContain('Changes may not persist.');
  });

  it('handles a missing selected speaker without inventing a selection', () => {
    expect(
      visibleText(dashboard({ ...snapshot, selectedSpeakerId: 'removed' })),
    ).toContain('Selected speaker None selected');
  });

  it('keeps all speaker actions available in local mode', () => {
    const markup = speakerList();
    for (const action of ['Select', 'Show', 'Edit', 'Delete'])
      expect(markup).toContain(`aria-label="${action} Ada Lovelace"`);
    expect(markup).not.toContain('disabled=""');
  });
});
