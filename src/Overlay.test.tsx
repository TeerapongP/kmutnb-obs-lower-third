import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { initialData, templates, type Snapshot, type Template } from '../shared/types';
import { CGBar, templateRegistry } from './Overlay';

const svgTemplates = ['standard', 'modern', 'glass', 'minimal'] as const;
const legacyTemplates = ['premium', 'speaker'] as const;

function renderTemplate(template: Template) {
  const snapshot: Snapshot = {
    ...initialData,
    settings: { ...initialData.settings, template },
    live: { visible: false, cue: 0 },
  };

  return renderToStaticMarkup(
    <CGBar
      speaker={snapshot.speakers[0]}
      snapshot={snapshot}
      staticPreview
    />,
  );
}

describe('overlay template registry', () => {
  it('registers every supported template ID', () => {
    expect(Object.keys(templateRegistry).sort()).toEqual([...templates].sort());
  });

  it.each(svgTemplates)('routes %s through the shared SVG renderer', (template) => {
    expect(templateRegistry[template].renderer).toBe('svg');
    expect(templateRegistry[template].variant).toBeDefined();
    expect(renderTemplate(template)).toContain('cg-svg-bar');
  });

  it.each(svgTemplates)('uses the same subtitle size for %s', (template) => {
    expect(renderTemplate(template)).toContain('font-size:14px');
  });

  it('uses the tilted and rounded artwork with the selected speaker text', () => {
    const tilted = renderTemplate('modern');
    const rounded = renderTemplate('minimal');

    expect(tilted).toContain('href="/assets/lower-third-2-tilted.svg"');
    expect(tilted).toContain(initialData.speakers[0].name);
    expect(rounded).toContain('href="/assets/lower-third-4-rounded.svg"');
    expect(rounded).toContain(initialData.speakers[0].name);
  });

  it.each(legacyTemplates)('routes %s through the shared legacy renderer', (template) => {
    expect(templateRegistry[template].renderer).toBe('legacy');
    expect(renderTemplate(template)).toContain(`cg-bar cg-${template}`);
  });

  it('keeps one component identity per renderer family', () => {
    for (const template of svgTemplates)
      expect(templateRegistry[template].component).toBe(
        templateRegistry.standard.component,
      );
    for (const template of legacyTemplates)
      expect(templateRegistry[template].component).toBe(
        templateRegistry.premium.component,
      );
  });

  it('preserves the existing SVG variant mapping', () => {
    expect(
      Object.fromEntries(
        svgTemplates.map((template) => [template, templateRegistry[template].variant]),
      ),
    ).toEqual({
      standard: 'classic',
      modern: 'angular',
      glass: 'overlay',
      minimal: 'rounded',
    });
  });
});
