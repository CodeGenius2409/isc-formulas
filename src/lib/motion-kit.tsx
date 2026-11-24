// Motion for the pages that load later: lists arriving and keeping their place as they change,
// working written out, answers marked, values that change, numbers that count, and content that
// swaps. Same tokens and rules as motion.ts; only transform, opacity
// and clip-path move.
import { useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react';
import { DUR, EASE, play, prefersReducedMotion, spring, staggerDelay, stop, usingKeyboard } from './motion';
import '../styles/motion-later.css';

type Target = Element | null | undefined;

interface RevealOptions {
  /** Rise in px. The lead rises furthest; support less. */
  y?: number;
  delay?: number;
  step?: number;
  limit?: number;
  duration?: number;
}

/**
 * A group arriving: each item rises and fades in turn. Only the first `limit`, since the rest
 * are below the fold, and never when the page around it is already moving in.
 * With reduced motion the group fades in together, in place.
 */
export function reveal(items: ArrayLike<Element>, { y = 10, delay = 0, step = 42, limit = 10, duration = DUR.emphasis }: RevealOptions = {}): void {
  const list = Array.from(items).slice(0, limit);
  if (!list.length || usingKeyboard()) return;
  const reduce = prefersReducedMotion();
  list.forEach((el, i) => {
    stop(el);
    if (reduce) play(el, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.standard, easing: 'ease' });
    else play(el, [{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: 'none' }], { duration, delay: delay + staggerDelay(i, step), easing: EASE.out });
  });
}

/** The first rows of a list arriving. Skipped while a page turn carries them in. */
export function listReveal(rows: Element[]): void {
  if (document.documentElement.dataset.page) return;
  reveal(rows, { y: 8, step: 34 });
}

/**
 * Solver and marking steps written out in order, like working on paper: each line is
 * revealed from the left as if by a pen, then settles.
 */
export function stepsReveal(steps: Element[]): void {
  // From the keyboard the working is simply there: nothing waits on the pen.
  if (usingKeyboard()) return;
  const reduce = prefersReducedMotion();
  steps.slice(0, 14).forEach((el, i) => {
    stop(el);
    if (reduce) {
      play(el, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.standard, delay: i * 30, easing: 'ease' });
      return;
    }
    play(
      el,
      [
        { opacity: 0, clipPath: 'inset(0 100% 0 0)', transform: 'translateY(4px)' },
        { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'none' },
      ],
      { duration: DUR.emphasis + 60, delay: 60 + staggerDelay(i, 70, 520), easing: EASE.out },
    );
  });
}

/** A result landing: a small settle in scale, with no bounce, since it's an answer. */
export function landResult(el: Target, delay = 0): void {
  if (!el || usingKeyboard()) return;
  stop(el);
  if (prefersReducedMotion()) {
    play(el, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.standard, delay, easing: 'ease' });
    return;
  }
  play(el, [{ opacity: 0, transform: 'scale(0.96) translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: DUR.emphasis + 80, delay, easing: EASE.out });
}

/**
 * Right or wrong, answered. Right: the notice settles in, and any pen tick inside it draws on.
 * Wrong: three small shakes, 5 px at most, like a head shaken once, and the cross written in.
 * Never a bounce.
 */
export function answerFeedback(el: Target, correct: boolean): void {
  if (!el) return;
  stop(el);
  const reduce = prefersReducedMotion();
  if (reduce) {
    play(el, [{ opacity: 0.4 }, { opacity: 1 }], { duration: DUR.standard, easing: 'ease' });
  } else if (usingKeyboard()) {
    // Nothing hides or moves after a key; the tick below is still drawn.
  } else if (correct) {
    play(el, [{ opacity: 0, transform: 'translateY(4px) scale(0.985)' }, { opacity: 1, transform: 'none' }], { duration: DUR.emphasis, easing: EASE.out });
  } else {
    play(el, [{ transform: 'none' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-2px)' }, { transform: 'none' }], { duration: 320, easing: EASE.inOut });
  }
  // The pen mark is written in from the left, the way a tick is drawn.
  play(el.querySelector('.pen-tick, .pen-cross'), [{ clipPath: 'inset(-2px 100% -2px 0)' }, { clipPath: 'inset(-2px -2px -2px 0)' }], { duration: reduce ? 1 : 340, delay: reduce ? 0 : 80, easing: EASE.out });
}

/** A value that just changed, marked for a moment with a wash of the highlighter that fades.
 *  The wash is the element's ::after (`.value-flash` in motion.css), so only its opacity moves. */
export function flash(el: Target): void {
  if (!el) return;
  el.classList.add('value-flash');
  play(el, [{ opacity: 0.9 }, { opacity: 0 }], { duration: 900, easing: 'ease-out', pseudoElement: '::after' });
}


interface Placed {
  el: HTMLElement;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** More changes than this at once, and the list simply updates: a crowd moving is noise. */
const MOST_MOVING = 28;

function measure(root: HTMLElement): Map<string, Placed> {
  const placed = new Map<string, Placed>();
  for (const el of root.querySelectorAll<HTMLElement>(':scope > [data-flip]')) {
    if (el.dataset.flipGhost !== undefined) continue;
    placed.set(el.dataset.flip!, { el, x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
  }
  return placed;
}

/** A removed item fades where it was, out of the flow, while the rest close the gap. */
function ghostOut(root: HTMLElement, gone: Placed): void {
  const ghost = gone.el;
  if (ghost.isConnected || typeof ghost.animate !== 'function') return;
  ghost.dataset.flipGhost = '';
  // Nothing in it can be found or pressed while it fades.
  for (const node of [ghost, ...ghost.querySelectorAll('[id], [data-testid]')]) {
    node.removeAttribute('id');
    node.removeAttribute('data-testid');
  }
  ghost.setAttribute('aria-hidden', 'true');
  ghost.inert = true;
  Object.assign(ghost.style, { position: 'absolute', left: `${gone.x}px`, top: `${gone.y}px`, width: `${gone.w}px`, margin: '0', pointerEvents: 'none', zIndex: '0' });
  root.append(ghost);
  const reduce = prefersReducedMotion();
  const out = ghost.animate(reduce ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.97)' }], { duration: DUR.standard, easing: EASE.out, fill: 'forwards' });
  const remove = () => ghost.remove();
  out.finished.then(remove, remove);
}

/**
 * FLIP for a keyed list: children marked `data-flip="<key>"`, directly inside `ref`, which must be
 * positioned. Moved items glide to their new place, new ones rise in, removed ones fade where
 * they were. Interrupting mid-move starts from wherever an item is drawn, so nothing jumps.
 */
export function useFlip(ref: RefObject<HTMLElement | null>): void {
  const last = useRef<Map<string, Placed> | null>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const now = measure(root);
    const before = last.current;
    last.current = now;
    if (!before || usingKeyboard()) return;
    const added = [...now.keys()].filter((k) => !before.has(k));
    const removed = [...before.keys()].filter((k) => !now.has(k));
    if (added.length + removed.length > MOST_MOVING) return;
    const reduce = prefersReducedMotion();
    const origin = root.getBoundingClientRect();
    const { easing } = spring('sheet');
    let moving = 0;
    for (const [key, place] of now) {
      const prev = before.get(key);
      if (!prev) {
        if (reduce) play(place.el, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.standard, easing: 'ease' });
        else play(place.el, [{ opacity: 0, transform: 'translateY(8px) scale(0.985)' }, { opacity: 1, transform: 'none' }], { duration: DUR.emphasis, delay: 60, easing: EASE.out });
        continue;
      }
      // Where it's drawn now, which includes any move still under way.
      const drawn = place.el.getBoundingClientRect();
      const dx = prev.x - place.x + (drawn.left - origin.left - root.clientLeft - place.x);
      const dy = prev.y - place.y + (drawn.top - origin.top - root.clientTop - place.y);
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
      stop(place.el);
      if (reduce || moving++ > MOST_MOVING) continue;
      play(place.el, [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 440, easing });
    }
    for (const key of removed) ghostOut(root, before.get(key)!);
  });
}

/** A whole number that counts to its new value rather than jumping, from `from` when it first shows. */
export function CountUp({ value, from, className, format = String }: { value: number; from?: number; className?: string; format?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(from !== undefined && !usingKeyboard() ? from : value);
  useLayoutEffect(() => {
    const el = ref.current;
    const from = shown.current;
    shown.current = value;
    if (!el) return undefined;
    if (from === value || prefersReducedMotion()) {
      el.textContent = format(value);
      return undefined;
    }
    const start = performance.now();
    const duration = Math.min(900, 320 + Math.abs(value - from) * 40);
    let frame = 0;
    const tick = (time: number) => {
      const p = Math.min(1, (time - start) / duration);
      const eased = 1 - (1 - p) ** 3;
      el.textContent = format(Math.round(from + (value - from) * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, format]);
  // One span, so the text reads as the number; a reader that looks at it after the count gets the value.
  return (
    <span ref={ref} className={className}>
      {format(shown.current)}
    </span>
  );
}

/**
 * Content that swaps in place, such as the next question: it comes in from the side it's going as
 * the old one goes. No copy of the old one is kept on the page, so nothing can be found or pressed
 * in it while it would have been fading. `swapKey` names what's shown.
 */
export function useSwap(ref: RefObject<HTMLElement | null>, swapKey: string | number, direction: 'forward' | 'back' | 'none' = 'none'): void {
  const shownKey = useRef(swapKey);
  useLayoutEffect(() => {
    const el = ref.current;
    if (shownKey.current === swapKey) return;
    shownKey.current = swapKey;
    if (!el || usingKeyboard()) return;
    stop(el);
    if (prefersReducedMotion()) {
      play(el, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.standard, easing: 'ease' });
      return;
    }
    const x = direction === 'forward' ? 28 : direction === 'back' ? -28 : 0;
    // It moves the whole way and is fully there well before it stops.
    play(el, [{ transform: `translateX(${x}px)` }, { transform: 'none' }], { duration: DUR.emphasis + 60, easing: EASE.out });
    play(el, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.standard, easing: EASE.out });
  }, [swapKey, direction, ref]);
}

/** A list whose items (each with `data-flip="<key>"`) keep their place as it changes. See useFlip. */
export function FlipList({ as = 'ul', className, children, label }: { as?: 'ul' | 'ol'; className?: string; children: ReactNode; label?: string }) {
  const ref = useRef<HTMLUListElement & HTMLOListElement>(null);
  useFlip(ref);
  const Tag = as;
  return (
    <Tag ref={ref} className={className} data-flip-root aria-label={label}>
      {children}
    </Tag>
  );
}
