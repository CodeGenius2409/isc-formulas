// A one-time tip, the first time someone opens a feature. It says one useful thing, goes away when dismissed, and can be
// brought back from Settings.
import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { markTip, tipSeen, type TipId } from './state';
import './tip.css';

export function Tip({ id, children }: { id: TipId; children: string }) {
  const [shown, setShown] = useState(() => !tipSeen(id));
  if (!shown) return null;
  return (
    <div className="tip" role="note" data-testid={`tip-${id}`}>
      <Lightbulb size={15} aria-hidden />
      <p>{children}</p>
      <button
        type="button"
        className="btn btn-quiet"
        onClick={() => {
          markTip(id, true);
          setShown(false);
        }}
      >
        Got it
      </button>
    </div>
  );
}
