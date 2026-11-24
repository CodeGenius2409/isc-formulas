// The motion system. DESIGN.md describes it, tokens.css holds the same values for CSS, and
// nothing animates with values of its own. Motion should read as paper: a sheet sliding
// over another, a pen mark drawn on, a page turned. Never as decoration.
//
//  - Element motion runs on the Web Animations API, which the compositor runs off the main
//    thread, so it stays smooth while a page loads. GSAP drives only the page change where View
//    Transitions are missing (page-transition.ts).
//  - Only transform, opacity and clip-path move. Layout changes use FLIP.
//  - Entering is ease-out, moving on screen ease-in-out, sheets and pages the drawer curve.
//  - Nothing waits for an animation, and a keyboard action never starts one that delays it.
//  - Reduced motion (the setting, or the device when it's left to match) keeps fades and
//    drops all movement.

export const EASE = {
  out: 'cubic-bezier(0.23, 1, 0.32, 1)',
  inOut: 'cubic-bezier(0.77, 0, 0.175, 1)',
  drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
} as const;

export const DUR = { press: 110, quick: 160, standard: 240, emphasis: 380, page: 460 } as const;

/** A spring as a linear() curve, read from the stylesheet so CSS and scripts share one. */
export function spring(name: 'sheet' | 'pop'): { easing: string; duration: number } {
  const easing = getComputedStyle(document.documentElement).getPropertyValue(`--spring-${name}`).trim();
  return { easing: easing || EASE.drawer, duration: name === 'sheet' ? 440 : 520 };
}

export type PageKind = 'forward' | 'back' | 'lateral';

/**
 * Page turns and the theme change. page-transition.ts fills these in once it loads, after first
 * paint, as GSAP does; a change before then simply happens.
 */
export const turns: {
  page?: (update: () => void, move: PageMove) => void;
  theme?: (apply: () => void) => void;
  turning?: () => boolean;
  committed?: () => void;
  /** A page arriving where there are no View Transitions. */
  enter?: (el: Element | null, kind: PageKind) => void;
  /** A sheet drawn in from `from` (controls-motion.ts), and handed over to its exit wherever it is. */
  sheetIn?: (dialog: HTMLElement, from: string) => void;
  sheetOut?: (dialog: HTMLElement) => void;
  kind: PageKind;
} = { kind: 'forward' };

/** A page change: the path it left, the path it reached, and whether it went back in history. */
export interface PageMove {
  from: string[];
  to: string[];
  back: boolean;
}

/** Runs a page change, as a page turn if it can be one. `update` must render the new page. */
export function pageChange(update: () => void, move: PageMove): void {
  if (turns.page) turns.page(update, move);
  else update();
}

/** Applies a theme, drawn over the old one where it can be. */
export function themeChange(apply: () => void): void {
  if (turns.theme) turns.theme(apply);
  else apply();
}

let lastInputKeyboard = false;
let lastPointerAt = -Infinity;

/** True if the reader pressed or tapped something just now: what a page turn answers. */
export function pointedJustNow(): boolean {
  return !lastInputKeyboard && performance.now() - lastPointerAt < 1000;
}
// Also on <html> as data-input, so a stylesheet can make a keyboard action instant too.
const setInput = (keyboard: boolean) => {
  if (keyboard === lastInputKeyboard && document.documentElement.dataset.input) return;
  lastInputKeyboard = keyboard;
  document.documentElement.dataset.input = keyboard ? 'key' : 'pointer';
};
// Tests import the tracers' code in Node, where there is no window.
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => { if (!['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) setInput(true); }, { capture: true, passive: true });
  window.addEventListener('pointerdown', () => {
    lastPointerAt = performance.now();
    setInput(false);
  }, { capture: true, passive: true });
}

/** The Reduce motion setting, or the device's, set on <html> before first paint. */
export function prefersReducedMotion(): boolean {
  return document.documentElement.dataset.motion === 'reduce';
}

/** True if the last thing the student did was press a key rather than point. */
export function usingKeyboard(): boolean {
  return lastInputKeyboard;
}

/** Movement is allowed: no reduced motion, and the last input wasn't a key. */
export function shouldAnimate(): boolean {
  return !prefersReducedMotion() && !lastInputKeyboard;
}

type Target = Element | null | undefined;

/** One WAAPI animation. `backwards` fill hides a delayed item until it starts, and nothing is left behind after. */
export function play(el: Target, frames: Keyframe[], options: KeyframeAnimationOptions): Animation | null {
  if (!el || typeof el.animate !== 'function') return null;
  return el.animate(frames, { fill: 'backwards', ...options });
}

/** Stops whatever is moving an element, leaving it where its styles say. */
export function stop(el: Target): void {
  el?.getAnimations?.().forEach((a) => a.cancel());
}

/**
 * Delays that shrink as a group goes on, so it moves as a wave rather than a metronome.
 * Capped, so the last item never waits more than `max`.
 */
export function staggerDelay(i: number, step = 42, max = 260): number {
  return Math.min(max, Math.round(step * i ** 0.78));
}

/** A control confirming a press with a small, springy grow: a star filling, a tick landing. */
export function pop(el: Target): void {
  if (!el || prefersReducedMotion()) return;
  stop(el);
  const { easing, duration } = spring('pop');
  play(el, [{ transform: 'scale(0.72)' }, { transform: 'none' }], { duration, easing });
}
