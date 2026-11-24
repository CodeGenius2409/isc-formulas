// A bottom sheet follows the finger and can be thrown away. Loaded the first time a sheet opens
// on a phone. The finger drives the transform directly, never React state or a CSS variable, so
// a drag costs one composited layer a frame however much the sheet holds.
import { EASE, spring } from './motion';

function scrollParent(from: Element, stopAt: Element): HTMLElement | null {
  for (let el: Element | null = from; el && el !== stopAt; el = el.parentElement) {
    if (el instanceof HTMLElement && el.scrollHeight > el.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(el).overflowY)) return el;
  }
  return null;
}

interface Drag {
  id: number;
  x0: number;
  y0: number;
  scroller: HTMLElement | null;
  active: boolean;
  offset: number;
  lastY: number;
  lastT: number;
  /** px per ms, smoothed, positive downwards. */
  v: number;
  backdrop: Animation | null;
}

/** Throws away past a third of its height, or on a downward flick of about 0.45 px/ms. */
export function attachSheetDrag(sheet: HTMLElement, close: () => void): () => void {
  let drag: Drag | null = null;
  let height = 1;

  const start = (e: TouchEvent) => {
    // A second finger is ignored, so it can't make the sheet jump.
    if (drag || e.touches.length !== 1) return;
    const target = e.target as Element;
    if (target.closest('input, textarea, select, [contenteditable="true"], .cm-editor, canvas, [data-no-sheet-drag]')) return;
    const t = e.touches[0];
    drag = { id: t.identifier, x0: t.clientX, y0: t.clientY, scroller: scrollParent(target, sheet), active: false, offset: 0, lastY: t.clientY, lastT: e.timeStamp, v: 0, backdrop: null };
  };

  const move = (e: TouchEvent) => {
    if (!drag) return;
    const t = [...e.touches].find((touch) => touch.identifier === drag!.id);
    if (!t) return;
    const dx = t.clientX - drag.x0;
    const dy = t.clientY - drag.y0;
    const atTop = !drag.scroller || drag.scroller.scrollTop <= 0;
    if (!drag.active) {
      if (!atTop || dy < -6 || (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy))) {
        drag = null;
        return;
      }
      // Pulling down at the top: claim the gesture before the browser starts an overscroll.
      if (dy > 0 && e.cancelable) e.preventDefault();
      if (dy < 6) return;
      drag.active = true;
      drag.y0 = t.clientY;
      height = sheet.getBoundingClientRect().height || 1;
      sheet.dataset.dragging = '';
      // The dimming behind follows the finger: a paused fade, scrubbed.
      if (typeof sheet.animate === 'function') {
        drag.backdrop = sheet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000, fill: 'both', pseudoElement: '::backdrop' });
        drag.backdrop.pause();
      }
    }
    if (e.cancelable) e.preventDefault();
    const d = t.clientY - drag.y0;
    // Past the top it gives a little, with friction, rather than hitting a wall.
    drag.offset = d >= 0 ? d : -Math.min(24, Math.sqrt(-d) * 2.2);
    const dt = e.timeStamp - drag.lastT;
    if (dt > 0) drag.v = 0.75 * ((t.clientY - drag.lastY) / dt) + 0.25 * drag.v;
    drag.lastY = t.clientY;
    drag.lastT = e.timeStamp;
    sheet.style.transform = `translateY(${drag.offset}px)`;
    if (drag.backdrop) drag.backdrop.currentTime = Math.max(0, Math.min(1, drag.offset / height)) * 1000;
  };

  const end = (e: TouchEvent) => {
    if (!drag || [...e.touches].some((touch) => touch.identifier === drag!.id)) return;
    const finished = drag;
    drag = null;
    if (!finished.active) return;
    delete sheet.dataset.dragging;
    const throwAway = finished.offset > height * 0.3 || (finished.v > 0.45 && finished.offset > 16);
    const backdrop = finished.backdrop;
    if (throwAway) {
      // Leaves at the speed it was thrown, clamped so a slow drop still feels decided.
      const remaining = height - finished.offset;
      const ms = Math.round(Math.max(140, Math.min(320, remaining / Math.max(finished.v, 0.8))));
      // It stays drawn for as long as it's falling, then is put away.
      sheet.style.transition = `transform ${ms}ms ${EASE.out}, overlay ${ms}ms allow-discrete, display ${ms}ms allow-discrete`;
      sheet.style.transform = 'translateY(100%)';
      if (backdrop) {
        backdrop.playbackRate = (1000 - Number(backdrop.currentTime ?? 0)) / ms;
        backdrop.play();
        backdrop.finished.then(() => backdrop.cancel(), () => undefined);
      }
      close();
    } else {
      // Settles back on the sheet spring, from wherever the finger let it go.
      sheet.style.transition = `transform ${spring('sheet').duration}ms ${spring('sheet').easing}`;
      sheet.style.transform = '';
      const settledBack = (event: TransitionEvent) => {
        if (event.target !== sheet || event.propertyName !== 'transform') return;
        sheet.style.transition = '';
        sheet.removeEventListener('transitionend', settledBack);
      };
      sheet.addEventListener('transitionend', settledBack);
      if (backdrop) {
        backdrop.playbackRate = -Number(backdrop.currentTime ?? 0) / 280;
        backdrop.play();
        backdrop.finished.then(() => backdrop.cancel(), () => undefined);
      }
    }
  };

  sheet.addEventListener('touchstart', start, { passive: true });
  sheet.addEventListener('touchmove', move, { passive: false });
  sheet.addEventListener('touchend', end);
  sheet.addEventListener('touchcancel', end);
  return () => {
    sheet.removeEventListener('touchstart', start);
    sheet.removeEventListener('touchmove', move);
    sheet.removeEventListener('touchend', end);
    sheet.removeEventListener('touchcancel', end);
  };
}
