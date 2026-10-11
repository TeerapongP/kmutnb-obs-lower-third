export const cardClass =
  'rounded-lg border border-[#e8e9e8] bg-white shadow-[0_3px_20px_#1e232606]';

export const eyebrowClass =
  "m-0 font-['DM_Sans'] text-[10px] font-extrabold tracking-[0.17em] text-brand";

export const sectionHeadingClass =
  'mb-0 mt-[5px] text-[17px] font-[650] tracking-[-0.035em]';

const buttonBase =
  'inline-flex h-[39px] items-center justify-center gap-2 whitespace-nowrap rounded border px-[15px] text-[11px] font-semibold transition duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50';

const buttonVariants = {
  primary:
    'border-transparent bg-brand text-white shadow-[0_4px_12px_#f15a2423] hover:bg-[#dc4d1b]',
  outline:
    'border-[#dedfdf] bg-white text-[#3a3e40] hover:border-[#edb39d] hover:bg-[#faf6f3]',
  ghost: 'border-transparent bg-[#f4f4f3] text-[#555]',
  dark: 'border-transparent bg-[#242729] text-white hover:bg-[#383c3e]',
} as const;

export function buttonClass(variant: keyof typeof buttonVariants, extra = ''): string {
  return `${buttonBase} ${buttonVariants[variant]} ${extra}`;
}

export const iconButtonClass =
  'grid size-[30px] place-items-center rounded border-0 bg-transparent text-[#82888a] hover:bg-[#f2f2f2] hover:text-[#222]';
