import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { clampWidth, forgetWidth, readWidth, saveWidth, type WidthLimits } from '../../lib/work-width';

const KEY_STEP = 16;

/** Reads a token in rem, such as --rail, as pixels. */
function tokenPx(name: string): number {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  return parseFloat(style.getPropertyValue(name)) * parseFloat(style.fontSize);
}

function defaultWidth(): number {
  return tokenPx('--work');
}

/** The same limits as the column in shell.css, which also holds them while the window is resized. */
function limits(): WidthLimits {
  const room = document.documentElement.clientWidth - tokenPx('--rail') - tokenPx('--contents') - tokenPx('--main-min');
  return { min: tokenPx('--work-min'), max: room };
}

/** The handle on the left edge of the working area. Drag it, or focus it and use the arrow keys. */
export function WorkResizer() {
  const handle = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointer: number; startX: number; startWidth: number } | null>(null);
  const [width, setWidth] = useState(() => clampWidth(readWidth() ?? defaultWidth(), limits()));
  const [range, setRange] = useState(limits);
  // The latest width, for the moment a drag ends, before React has drawn it.
  const latest = useRef(width);

  const apply = useCallback((next: number) => {
    handle.current?.closest<HTMLElement>('.shell')?.style.setProperty('--work-docked', `${next}px`);
    latest.current = next;
    setWidth(next);
  }, []);

  // Before the first paint, so a saved width doesn't jump into place.
  useLayoutEffect(() => {
    const saved = readWidth();
    if (saved !== null) apply(clampWidth(saved, limits()));
    const shell = handle.current?.closest<HTMLElement>('.shell');
    return () => {
      shell?.style.removeProperty('--work-docked');
    };
  }, [apply]);

  // A smaller window can narrow the column; the handle must report what's really there.
  useEffect(() => {
    const onResize = () => {
      const next = limits();
      const shown = clampWidth(readWidth() ?? defaultWidth(), next);
      setRange(next);
      latest.current = shown;
      setWidth(shown);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const endDrag = () => {
    drag.current = null;
    delete document.documentElement.dataset.resizing;
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.focus({ preventScroll: true });
    e.currentTarget.setPointerCapture(e.pointerId);
    setRange(limits());
    drag.current = { pointer: e.pointerId, startX: e.clientX, startWidth: latest.current };
    document.documentElement.dataset.resizing = 'true';
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointer !== e.pointerId) return;
    // The handle is on the panel's left edge, so moving left makes the panel wider.
    apply(clampWidth(drag.current.startWidth + drag.current.startX - e.clientX, limits()));
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointer !== e.pointerId) return;
    endDrag();
    saveWidth(latest.current);
  };

  const reset = () => {
    endDrag();
    forgetWidth();
    apply(clampWidth(defaultWidth(), limits()));
    handle.current?.closest<HTMLElement>('.shell')?.style.removeProperty('--work-docked');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const now = limits();
    let next: number | null = null;
    if (e.key === 'ArrowLeft') next = latest.current + KEY_STEP;
    if (e.key === 'ArrowRight') next = latest.current - KEY_STEP;
    if (e.key === 'Home') next = now.min;
    if (e.key === 'End') next = now.max;
    if (e.key === 'Enter') {
      e.preventDefault();
      reset();
      return;
    }
    if (e.key === 'Escape' && drag.current) {
      e.preventDefault();
      apply(drag.current.startWidth);
      endDrag();
      return;
    }
    if (next === null) return;
    e.preventDefault();
    const clamped = clampWidth(next, now);
    setRange(now);
    apply(clamped);
    saveWidth(clamped);
  };

  return (
    <div
      ref={handle}
      className="work-resizer"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize the working area"
      aria-valuenow={Math.round(width)}
      aria-valuemin={Math.round(range.min)}
      aria-valuemax={Math.round(Math.max(range.min, range.max))}
      aria-valuetext={`${Math.round(width)} pixels wide`}
      tabIndex={0}
      title="Drag to resize. Double-click to reset."
      data-testid="work-resizer"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={reset}
      onKeyDown={onKeyDown}
    />
  );
}
