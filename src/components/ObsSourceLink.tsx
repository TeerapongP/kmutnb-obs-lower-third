import { useState } from 'react';
import { Check, Copy, Radio } from 'lucide-react';
import type { Snapshot } from '../../shared/types';
import { buttonClass } from '../ui';

export function ObsSourceLink({ snapshot }: { snapshot: Snapshot }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const bytes = new TextEncoder().encode(JSON.stringify(snapshot));
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    const state = btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
    const url = new URL('/overlay', window.location.origin);
    url.searchParams.set('state', state);
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-4 rounded-md border border-[#f1d3c7] bg-[#fff8f4] px-4 py-3 max-[680px]:items-start max-[680px]:flex-col">
      <div>
        <p className="m-0 flex items-center gap-2 text-xs font-bold text-[#343839]">
          <Radio size={15} className="text-brand" /> OBS Browser Source
        </p>
        <p className="mb-0 mt-1 text-[11px] text-[#777d80]">
          Copy a transparent overlay link for the current graphic state.
        </p>
      </div>
      <button className={buttonClass('primary')} onClick={() => void copyLink()}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? 'Copied' : 'Copy OBS link'}
      </button>
    </div>
  );
}
