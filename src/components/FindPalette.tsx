import { useEffect, useRef } from 'react';
import { useStore } from '../lib/store';
import { closePalette, paletteStore } from '../state/ui';

/** Replaced in phase 5 with real search. */
export function FindPalette() {
  const open = useStore(paletteStore);
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
    if (!open && ref.current?.open) ref.current.close();
  }, [open]);
  return (
    <dialog ref={ref} className="palette" aria-label="Find" onCancel={(e) => { e.preventDefault(); closePalette(); }}>
      <p className="p-4">Search arrives in phase 5.</p>
    </dialog>
  );
}
