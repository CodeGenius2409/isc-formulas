// Motion rules live here (see DESIGN.md). GSAP drives view changes, sheets and
// solver steps. Press and hover feedback are CSS transitions in the stylesheets.
//
//  - Under 250 ms, and ease-out on entry, so the interface answers immediately.
//  - Nothing animates after a keyboard action, since those repeat hundreds of times.
//  - With prefers-reduced-motion, elements appear in place with no movement.
//  - GSAP loads after first paint. Motion is decoration, so until then things just appear.
import type { gsap as Gsap } from 'gsap';

const EASE = 'expo.out';

let gsap: typeof Gsap | null = null;

export function loadMotion(): void {
  if (prefersReducedMotion()) return;
  void import('gsap').then(
    (module) => {
      gsap = module.gsap;
    },
    () => undefined,
  );
}

export function motionEngine(): typeof Gsap | null {
  return gsap;
}

let lastInputKeyboard = false;
window.addEventListener('keydown', () => { lastInputKeyboard = true; }, { capture: true, passive: true });
window.addEventListener('pointerdown', () => { lastInputKeyboard = false; }, { capture: true, passive: true });

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** True if the last thing the student did was press a key rather than point. */
export function usingKeyboard(): boolean {
  return lastInputKeyboard;
}

function shouldAnimate(): boolean {
  return !prefersReducedMotion() && !lastInputKeyboard;
}

/** A view arriving: a small rise and fade. */
export function viewEnter(el: Element | null): void {
  if (!gsap || !el || !shouldAnimate()) return;
  gsap.fromTo(el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.2, ease: EASE, clearProps: 'opacity,transform' });
}

/** Solver steps appear in order, so the working reads top to bottom. */
export function stepsReveal(steps: Element[]): void {
  if (!gsap || !steps.length || prefersReducedMotion()) return;
  gsap.fromTo(steps, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.04, ease: EASE, clearProps: 'opacity,transform' });
}

/** A sheet sliding in from its edge. Modal dialogs animate once when opened. */
export function sheetEnter(el: Element | null, from: 'right' | 'bottom' | 'left'): void {
  if (!gsap || !el || !shouldAnimate()) return;
  const vars = from === 'bottom' ? { y: 28 } : { x: from === 'right' ? 28 : -28 };
  gsap.fromTo(el, { opacity: 0, ...vars }, { opacity: 1, x: 0, y: 0, duration: 0.24, ease: EASE, clearProps: 'opacity,transform' });
}

/** A mark of right or wrong: one small settle, to confirm that the answer landed. */
export function answerFeedback(el: Element | null, correct: boolean): void {
  if (!gsap || !el || prefersReducedMotion()) return;
  if (correct) gsap.fromTo(el, { scale: 0.985 }, { scale: 1, duration: 0.2, ease: EASE, clearProps: 'transform' });
  else gsap.fromTo(el, { x: -3 }, { x: 0, duration: 0.2, ease: EASE, clearProps: 'transform' });
}
