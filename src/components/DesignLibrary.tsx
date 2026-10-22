import { Check } from 'lucide-react';
import { designTemplates, type Template } from '../../shared/types';
import { TemplatePreview } from './TemplatePreview';

export function DesignLibrary({
  selected,
  onSelect,
}: {
  selected: Template;
  onSelect: (template: Template) => void;
}) {
  return (
    <section
      id="designs"
      className="mt-[38px]"
      aria-labelledby="design-title"
    >
      <div className="mb-[22px] flex items-center justify-between gap-[18px]">
        <div>
          <p className="m-0 font-['DM_Sans'] text-[10px] font-extrabold tracking-[0.17em] text-brand">
            VISUAL IDENTITY
          </p>
          <h2
            id="design-title"
            className="mb-0 mt-[5px] text-[21px] font-[650] tracking-[-0.035em]"
          >
            Choose a design
          </h2>
          <p className="mb-0 mt-[7px] text-xs text-[#9ba0a1]">
            Four styles to preview in the studio.
          </p>
        </div>
        <span className="font-['DM_Sans'] text-[10px] font-extrabold tracking-[0.12em] text-[#a0a4a5]">
          04 DESIGNS
        </span>
      </div>
      <div className="grid grid-cols-2 gap-[18px] max-[1200px]:gap-[10px] max-[680px]:grid-cols-1">
        {designTemplates.map((template) => (
          <button
            key={template.id}
            className={`relative cursor-pointer overflow-hidden rounded-[11px] border bg-white p-0 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#f2a384] hover:shadow-[0_9px_26px_#4b24130c] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[3px] focus-visible:outline-[#f15a2440] ${
              selected === template.id
                ? 'border-brand shadow-[0_0_0_2px_#f15a24,0_10px_28px_#f15a2417]'
                : 'border-[#e4e6e5]'
            }`}
            onClick={() => onSelect(template.id)}
            aria-pressed={selected === template.id}
          >
            <div className="relative overflow-hidden border-b border-[#e5e6e5]">
              <TemplatePreview template={template.id} />
              <span className="absolute right-[14px] top-[13px] min-w-[30px] rounded-md border border-[#ffffffa8] bg-[#25292db8] px-[7px] pb-[5px] pt-1.5 text-center font-['DM_Sans'] text-[10px] font-extrabold tracking-[0.08em] text-white shadow-[0_3px_10px_#0002]">
                {template.number}
              </span>
            </div>
            <div className="flex min-h-[70px] items-center justify-between px-4 py-[15px]">
              <span>
                <strong className="block text-[13px] tracking-[-0.015em] text-[#25282a]">
                  {template.name}
                </strong>
                <small className="mt-1 block text-[10px] text-[#a3a6a8]">
                  {template.description}
                </small>
              </span>
              <span
                className={`grid size-5 flex-none place-items-center rounded-full border-[1.5px] text-white transition duration-200 ${
                  selected === template.id
                    ? 'border-brand bg-brand shadow-[0_0_0_4px_#f15a2414]'
                    : 'border-[#c8ccce]'
                }`}
                aria-hidden="true"
              >
                {selected === template.id && (
                  <Check
                    size={11}
                    strokeWidth={3}
                  />
                )}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
