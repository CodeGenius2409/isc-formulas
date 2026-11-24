import { useEffect, useRef, useState, type ReactNode } from 'react';
import { prefersReducedMotion, turns, usingKeyboard } from '../lib/motion';
import { useMediaQuery } from '../lib/hooks';

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: 'right' | 'left';
  className?: string;
  children: ReactNode;
}

/** The longest a sheet takes to leave. Its content is kept until then. */
const EXIT_MS = 420;

/**
 * A modal side or bottom sheet. Native <dialog> gives it focus trapping, Esc, and an inert page.
 * It slides in on a spring and out a little faster (motion.css), and on a phone it can be swiped
 * down. Opened or closed from the keyboard, it simply appears or goes.
 */
export function Sheet({ open, onClose, label, side = 'right', className = '', children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const phone = useMediaQuery('(max-width: 47.99em)');
  // Kept through the exit, so the sheet doesn't empty as it leaves.
  const [present, setPresent] = useState(open);
  if (open && !present) setPresent(true);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  // Opened by pointer, the sheet starts moving first and its content arrives a frame later, so the
  // work of drawing it never delays the slide's first frame. From the keyboard it all comes at once.
  const [filled, setFilled] = useState(open);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    const instant = usingKeyboard();
    if (open && !dialog.open) {
      // Opened again while still leaving: it turns back from wherever it had got to.
      const leaving = dialog.getAnimations().some((a) => a instanceof CSSTransition && a.transitionProperty === 'transform' && a.playState === 'running');
      const drawnAt = leaving ? getComputedStyle(dialog).transform : null;
      dialog.style.transform = '';
      dialog.style.transition = '';
      dialog.toggleAttribute('data-instant', instant);
      // Opened where it rests, so the focus it takes scrolls nothing, then drawn in from its edge.
      dialog.showModal();
      if (!instant) turns.sheetIn?.(dialog, drawnAt && drawnAt !== 'none' ? drawnAt : phone ? 'translateY(100%)' : side === 'left' ? 'translateX(-100%)' : 'translateX(100%)');
    } else if (!open && dialog.open) {
      dialog.toggleAttribute('data-instant', instant);
      // Closed mid-entrance, it leaves from wherever it had got to.
      turns.sheetOut?.(dialog);
      dialog.close();
      dialog.style.transform = '';
      dialog.style.opacity = '';
      // Emptied once it has gone: when its slide ends, or after a while if nothing slides.
      const empty = () => {
        setPresent(false);
        setFilled(false);
      };
      const onEnd = (e: TransitionEvent) => {
        if (e.target === dialog && e.propertyName === 'transform') empty();
      };
      dialog.addEventListener('transitionend', onEnd);
      const timer = window.setTimeout(empty, instant || prefersReducedMotion() ? 0 : EXIT_MS * 3);
      return () => {
        window.clearTimeout(timer);
        dialog.removeEventListener('transitionend', onEnd);
      };
    }
    return undefined;
  }, [open, phone, side]);

  useEffect(() => {
    if (!open || filled) return undefined;
    if (usingKeyboard() || prefersReducedMotion()) {
      setFilled(true);
      return undefined;
    }
    // Drawing the content takes the main thread for a moment, which on a slow phone holds a frame of
    // the slide. So it's drawn 200 ms in, when the spring has carried the sheet nine tenths of the
    // way and it is slowing into place, where a held frame doesn't show.
    let cancelled = false;
    let timer = 0;
    const fill = () => {
      timer = window.setTimeout(() => {
        if (!cancelled) setFilled(true);
      }, 200);
    };
    const slide = ref.current?.getAnimations().find((a) => !(a instanceof CSSTransition));
    if (slide) void slide.ready.then(fill, fill);
    else fill();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, filled]);

  // Once the content is there, focus goes into it, as it would have if it had been there at the start.
  useEffect(() => {
    const dialog = ref.current;
    if (!filled || !dialog?.open || document.activeElement !== dialog) return;
    dialog.querySelector<HTMLElement>('[autofocus], [role="tab"][aria-selected="true"], button, a[href], input, select, textarea')?.focus({ preventScroll: true });
  }, [filled]);

  useEffect(() => {
    const dialog = ref.current;
    if (!phone || !present || !dialog) return undefined;
    let detach: (() => void) | undefined;
    let cancelled = false;
    void import('../lib/sheet-drag').then(({ attachSheetDrag }) => {
      if (!cancelled) detach = attachSheetDrag(dialog, () => closeRef.current());
    }, () => undefined);
    return () => {
      cancelled = true;
      detach?.();
    };
  }, [phone, present]);

  return (
    <dialog
      ref={ref}
      className={`sheet ${className}`}
      data-side={side}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {(open || present) && filled && children}
    </dialog>
  );
}
