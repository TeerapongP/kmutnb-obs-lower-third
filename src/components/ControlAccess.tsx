import { useState, type SubmitEvent } from 'react';
import { KeyRound } from 'lucide-react';
import { getControlToken, setControlToken } from '../live';
import { buttonClass, cardClass, eyebrowClass } from '../ui';

export function ControlAccess() {
  const [token, setToken] = useState(getControlToken);
  const [saved, setSaved] = useState(false);

  function save(event: SubmitEvent) {
    event.preventDefault();
    setControlToken(token.trim());
    setSaved(true);
  }

  return (
    <section className={`${cardClass} mt-[19px] p-[23px]`}>
      <div className="flex items-center gap-[13px]">
        <div className="grid size-[39px] place-items-center rounded-md bg-[#f0f1f1] text-[#25292b]">
          <KeyRound size={20} />
        </div>
        <div>
          <p className={eyebrowClass}>SYSTEM</p>
          <h2 className="mb-0 mt-[5px] text-[15px] font-[650] tracking-[-0.035em]">
            Control access token
          </h2>
        </div>
      </div>
      <p className="mb-[17px] mt-[13px] text-[11px] text-[#9da1a2]">
        Only required when the server enforces a CONTROL_TOKEN. Stored on this device only
        and sent with every cue and edit; leave blank for an unauthenticated local server.
      </p>
      <form
        className="flex gap-[9px] max-[680px]:flex-col"
        onSubmit={(event) => save(event)}
      >
        <input
          type="password"
          className="h-10 flex-1 rounded-[5px] border border-[#dfe1e2] bg-white px-3 text-[11px] font-semibold text-[#25292b] outline-none transition focus:border-brand focus:ring-2 focus:ring-[#f15a2420]"
          placeholder="Paste the server's CONTROL_TOKEN"
          value={token}
          onChange={(event) => {
            setToken(event.target.value);
            setSaved(false);
          }}
        />
        <button
          type="submit"
          className={buttonClass('primary')}
        >
          {saved ? 'Saved' : 'Save token'}
        </button>
      </form>
    </section>
  );
}
