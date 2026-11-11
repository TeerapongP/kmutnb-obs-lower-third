import { useState } from 'react';
import { Check, Copy, Radio } from 'lucide-react';
import type { Snapshot } from '../../shared/types';
import { buttonClass } from '../ui';
import { createObsOverlayUrl } from '../obsSync';

export function ObsSourceLink({
  snapshot,
  syncError,
}: {
  snapshot: Snapshot;
  syncError: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');

  async function copyLink() {
    setCopyError('');
    try {
      const url = await createObsOverlayUrl(snapshot);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError('Could not connect OBS. Please try again.');
    }
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-4 rounded-md border border-[#f1d3c7] bg-[#fff8f4] px-4 py-3 max-[680px]:items-start max-[680px]:flex-col">
      <div>
        <p className="m-0 flex items-center gap-2 text-xs font-bold text-[#343839]">
          <Radio size={15} className="text-brand" /> OBS Browser Source
        </p>
        <p className="mb-0 mt-1 text-[11px] text-[#777d80]">
          Design and animation changes sync automatically to the same OBS link.
        </p>
        {(syncError || copyError) && (
          <p className="mb-0 mt-1 text-[11px] text-red-600" role="alert">
            {copyError || syncError}
          </p>
        )}
      </div>
      <button className={buttonClass('primary')} onClick={() => void copyLink()}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? 'Copied' : 'Copy OBS link'}
      </button>
    </div>
  );
}
