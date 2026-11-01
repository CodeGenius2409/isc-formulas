import { useEffect, useRef, type ReactNode } from 'react';
import { sheetEnter } from '../lib/motion';
import { useMediaQuery } from '../lib/hooks';

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: 'right' | 'left';
  className?: string;
  children: ReactNode;
}

/** A modal side or bottom sheet. Native <dialog> gives it focus trapping, Esc, and an inert page. */
export function Sheet({ open, onClose, label, side = 'right', className = '', children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const phone = useMediaQuery('(max-width: 47.99em)');

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      sheetEnter(dialog, phone ? 'bottom' : side);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, phone, side]);

  return (
    <dialog
      ref={ref}
      className={`sheet ${className}`}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && children}
    </dialog>
  );
}
