import { describe, expect, it } from 'vitest';
import { initialData, type Snapshot } from '../shared/types';
import { studioReducer } from './studio';

const state: Snapshot = {
  ...initialData,
  live: { visible: false, cue: 0 },
};

describe('local studio state', () => {
  it('selects a speaker and shows the application preview without claiming a broadcast', () => {
    const next = studioReducer(state, {
      type: 'command',
      command: { type: 'show', speakerId: state.speakers[1].id },
    });

    expect(next.selectedSpeakerId).toBe(state.speakers[1].id);
    expect(next.live).toEqual({ visible: true, cue: 1 });
  });

  it('adds, updates, and deletes speakers while maintaining a valid selection', () => {
    const added = {
      id: 'new-speaker',
      name: 'New speaker',
      academicTitle: '',
      position: '',
      department: '',
    };
    const afterAdd = studioReducer(state, { type: 'save-speaker', speaker: added });
    expect(afterAdd.selectedSpeakerId).toBe(added.id);

    const edited = { ...added, name: 'Edited speaker' };
    const afterEdit = studioReducer(afterAdd, { type: 'save-speaker', speaker: edited });
    expect(afterEdit.speakers.at(-1)?.name).toBe('Edited speaker');
    expect(afterEdit.speakers).toHaveLength(state.speakers.length + 1);

    const afterDelete = studioReducer(afterEdit, {
      type: 'delete-speaker',
      speakerId: added.id,
    });
    expect(afterDelete.speakers).toHaveLength(state.speakers.length);
    expect(afterDelete.selectedSpeakerId).toBe(state.speakers[0].id);
  });

  it('updates design and nested animation settings without dropping other values', () => {
    const next = studioReducer(state, {
      type: 'update-settings',
      change: {
        template: 'minimal',
        animation: { ...state.settings.animation, duration: 1.2 },
      },
    });
    expect(next.settings.template).toBe('minimal');
    expect(next.settings.animation.duration).toBe(1.2);
    expect(next.settings.animation.effect).toBe(state.settings.animation.effect);
  });

  it('hides the preview when the last speaker is deleted', () => {
    const single: Snapshot = {
      ...state,
      speakers: [state.speakers[0]],
      selectedSpeakerId: state.speakers[0].id,
      live: { visible: true, cue: 1 },
    };
    const next = studioReducer(single, {
      type: 'delete-speaker',
      speakerId: single.speakers[0].id,
    });
    expect(next.selectedSpeakerId).toBeNull();
    expect(next.live.visible).toBe(false);
  });
});
