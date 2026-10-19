import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { initialData } from '../../shared/types';
import { PreviewPanel } from './PreviewPanel';

describe('preview overlay status', () => {
  it('labels application overlay visibility without implying OBS broadcast status', () => {
    const visible = renderToStaticMarkup(
      <PreviewPanel
        snapshot={{ ...initialData, live: { visible: true, cue: 1 } }}
        previewCue={0}
      />,
    );
    const hidden = renderToStaticMarkup(
      <PreviewPanel
        snapshot={{ ...initialData, live: { visible: false, cue: 0 } }}
        previewCue={0}
      />,
    );

    expect(visible).toContain('aria-label="Application overlay visible"');
    expect(visible).toContain('OVERLAY VISIBLE');
    expect(hidden).toContain('aria-label="Application overlay hidden"');
    expect(hidden).toContain('OVERLAY HIDDEN');
    expect(visible).not.toContain('ON AIR');
    expect(hidden).not.toContain('OFF AIR');
  });
});
