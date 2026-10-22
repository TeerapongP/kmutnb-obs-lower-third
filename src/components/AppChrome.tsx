import { useState, type ReactNode } from 'react';
import {
  ChevronRight,
  Clapperboard,
  LayoutDashboard,
  LayoutTemplate,
  Menu,
  Settings2,
  Users,
} from 'lucide-react';

const sideLink =
  'group relative my-0.5 flex h-[43px] items-center gap-[14px] rounded-[5px] px-[15px] text-xs font-medium text-[#a5a9ad] hover:bg-[#2a2d2f] hover:text-white';

export function AppChrome({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
      <aside
        className={`sticky top-0 z-30 flex h-screen min-h-screen w-[255px] flex-none flex-col bg-[#151719] text-[#e8e8e7] max-[1200px]:w-[214px] max-[900px]:fixed max-[900px]:w-[255px] max-[900px]:transition-[left] ${
          navOpen
            ? 'max-[900px]:left-0 max-[900px]:shadow-[0_0_0_100vmax_#0007]'
            : 'max-[900px]:-left-[255px]'
        }`}
      >
        <div className="flex h-[91px] items-center gap-[13px] border-b border-[#ffffff16] px-[27px]">
          <div className="grid size-[39px] place-items-center bg-brand font-['DM_Sans'] text-2xl font-extrabold tracking-[-4px] text-white [transform:skew(-7deg)]">
            K<span className="mr-1 text-lg tracking-normal">▮</span>
          </div>
          <div>
            <strong className="block font-['DM_Sans'] text-[17px] font-extrabold tracking-[0.08em]">
              KMUTNB
            </strong>
            <small className="mt-1 block font-['DM_Sans'] text-[8px] font-semibold tracking-[0.18em] text-[#a9acaf]">
              BROADCAST STUDIO
            </small>
          </div>
        </div>
        <div className="px-[13px] pt-[34px]">
          <p className="mx-[14px] mb-[13px] mt-0 font-['DM_Sans'] text-[10px] font-bold tracking-[0.18em] text-[#73787d]">
            WORKSPACE
          </p>
          <a
            className={`${sideLink} bg-[#2a2d2f] text-white`}
            href="#overview"
            onClick={() => setNavOpen(false)}
          >
            <LayoutTemplate
              className="text-brand"
              size={18}
            />
            Overview
            <span className="absolute right-0 h-6 w-[3px] rounded-l-[3px] bg-brand" />
          </a>
          <a
            className={sideLink}
            href="#dashboard"
            onClick={() => setNavOpen(false)}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </a>
          <a
            className={sideLink}
            href="#speakers"
            onClick={() => setNavOpen(false)}
          >
            <Users size={18} />
            Speakers
          </a>
          <a
            className={sideLink}
            href="#designs"
            onClick={() => setNavOpen(false)}
          >
            <Clapperboard size={18} />
            Design library
          </a>
        </div>
        <div className="px-[13px] pt-[34px]">
          <p className="mx-[14px] mb-[13px] mt-0 font-['DM_Sans'] text-[10px] font-bold tracking-[0.18em] text-[#73787d]">
            SYSTEM
          </p>
          <a
            className={sideLink}
            href="#settings"
            onClick={() => setNavOpen(false)}
          >
            <Settings2 size={18} />
            Settings
          </a>
        </div>
        <div className="mt-auto px-[17px] pb-[23px] pt-[18px]">
          <div className="flex gap-3 rounded-[7px] border border-[#ffffff10] bg-[#242729] p-[15px]">
            <div>
              <strong className="block text-[11px]">Local workspace</strong>
              <span className="mt-1 block font-['DM_Sans'] text-[10px] font-medium text-[#8c9093]">
                Saved in this browser
              </span>
            </div>
          </div>
          <div className="flex justify-between px-[7px] pt-[21px] font-['DM_Sans'] text-[9px] font-semibold tracking-[0.11em] text-[#777d80]">
            KMUTNB CG SYSTEM <span>v1.0</span>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex h-[68px] items-center justify-between border-b border-[#e9e9e7] bg-white px-9 max-[1200px]:px-[26px] max-[900px]:h-[60px]">
          <div className="flex items-center gap-[13px] text-xs">
            <button
              className="hidden size-[30px] place-items-center rounded border-0 bg-transparent text-[#82888a] hover:bg-[#f2f2f2] hover:text-[#222] max-[900px]:grid"
              aria-label="Open menu"
              onClick={() => setNavOpen(!navOpen)}
            >
              <Menu size={20} />
            </button>
            <span className="text-[#999da0]">Workspace</span>
            <ChevronRight
              className="text-[#a7abad]"
              size={15}
            />
            <strong className="font-semibold">Overview</strong>
          </div>
          <div className="flex items-center gap-[18px] max-[680px]:gap-2">
            <span className="font-['DM_Sans'] text-[10px] font-bold tracking-[0.13em] text-[#aaadb0] max-[900px]:hidden">
              LOWER THIRD STUDIO
            </span>
            <span className="flex items-center gap-[7px] whitespace-nowrap rounded-full bg-[#e7f5eb] px-[11px] py-2 font-['DM_Sans'] text-[10px] font-bold text-[#257b4b]">
              <span className="size-1.5 rounded-full bg-[#39af6a]" />
              Ready in browser
            </span>
            <span className="grid size-[31px] place-items-center rounded-full bg-[#f1e9e4] font-['DM_Sans'] text-[10px] font-bold text-[#a44b29]">
              KM
            </span>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
