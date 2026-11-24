// Page turns, with the View Transitions API where the browser has it. motion.css draws them.
//
// Forward lays the new page over the old like a fresh sheet, and the old one recedes. Back lifts
// the top sheet away to the right. Moving between the main sections is a quieter cross-fade.
// Something pressed that becomes the next page (a formula row, a subject tab, a tool) grows into
// it, and the new page's title arrives a beat behind its body, as a separate layer.
//
// None of it blocks input (the overlay passes pointer events through), a new navigation skips
// whatever is still moving, and a keyboard action changes the page at once, with no animation.
import type { gsap as Gsap } from 'gsap';
import { DUR, EASE, play, prefersReducedMotion, shouldAnimate, turns, usingKeyboard, type PageKind, type PageMove } from './motion';
import '../styles/motion.css';

interface ViewTransitionLike {
  finished: Promise<void>;
  ready: Promise<void>;
  skipTransition(): void;
}
type TransitionDoc = Document & { startViewTransition?: (update: () => Promise<void> | void) => ViewTransitionLike };

const root = document.documentElement;
let running: ViewTransitionLike | null = null;
const named: HTMLElement[] = [];


function name(el: Element | null | undefined, value: string): void {
  if (!(el instanceof HTMLElement)) return;
  el.style.viewTransitionName = value;
  named.push(el);
}

function clearNames(): void {
  for (const el of named.splice(0)) el.style.viewTransitionName = '';
}

function onScreen(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
}

// What was pressed, if it can grow into the page it opens. Only a link counts, and only just now.
let pressed: { el: HTMLElement; key: string; at: number } | null = null;
document.addEventListener(
  'click',
  (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target?.closest('a[href]')) return;
    const scope = target.closest('[data-morph-scope]');
    const el = (scope?.querySelector('[data-morph]') ?? target.closest('[data-morph]')) as HTMLElement | null;
    pressed = el?.dataset.morph ? { el, key: el.dataset.morph, at: performance.now() } : null;
  },
  { capture: true },
);

// React draws the new page a moment after it's told of it. App says when it has.
let committed: (() => void) | null = null;

/** Called by App once the new page is drawn. */
function pageCommitted(): void {
  committed?.();
  committed = null;
}

function whenCommitted(): Promise<void> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(done, 200);
    function done() {
      window.clearTimeout(timer);
      committed = null;
      resolve();
    }
    committed = done;
  });
}

/** A lazy page shows its fallback for a moment; the new picture waits for it, briefly. */
function settled(): Promise<void> {
  const main = document.querySelector('main');
  const busy = () => main?.querySelector('[data-loading]');
  if (!main || !busy()) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      observer.disconnect();
      window.clearTimeout(timer);
      resolve();
    };
    const observer = new MutationObserver(() => {
      if (!busy()) done();
    });
    const timer = window.setTimeout(done, 320);
    observer.observe(main, { childList: true, subtree: true });
  });
}

const SECTIONS = new Set(['', 'saved', 'mine', 'practice', 'tools', 'settings', 'find', 'paper', 'generate']);

/** Forward goes deeper, back goes up or back in history, lateral moves between the main sections. */
function pageKind(from: string[], to: string[], wentBack: boolean): PageKind {
  if (wentBack) return 'back';
  if (from.length <= 1 && to.length <= 1 && SECTIONS.has(from[0] ?? '') && SECTIONS.has(to[0] ?? '')) return 'lateral';
  if (to.length < from.length && to.every((part, i) => part === from[i])) return 'back';
  // Within the book: the previous unit is back, and the other class is beside this one.
  if (from[0] === 'book' && to[0] === 'book' && from[1] === to[1]) {
    if (from.length === 4 && to.length === 4 && from[2] === to[2]) return Number(to[3]) < Number(from[3]) ? 'back' : 'forward';
    if (from.length === 3 && to.length === 3) return 'lateral';
  }
  return 'forward';
}

function pageChange(update: () => void, move: PageMove): void {
  const doc = document as TransitionDoc;
  const kind = pageKind(move.from, move.to, move.back);
  turns.kind = kind;
  clearNames();
  const fresh = pressed && performance.now() - pressed.at < 800 && pressed.el.isConnected ? pressed : null;
  pressed = null;
  if (!doc.startViewTransition || usingKeyboard() || document.visibilityState === 'hidden') {
    update();
    return;
  }
  const reduce = prefersReducedMotion();
  root.dataset.page = reduce ? 'fade' : kind;
  delete root.dataset.morphMissing;

  // The old side of a morph: what was pressed going forward, or this page's subject going back.
  let key: string | null = null;
  if (!reduce) {
    if (kind !== 'back' && fresh) {
      key = fresh.key;
      name(fresh.el, 'morph');
    } else if (kind === 'back') {
      const hero = document.querySelector<HTMLElement>('main [data-morph-hero]');
      if (hero && onScreen(hero)) {
        key = hero.dataset.morphHero ?? null;
        name(hero, 'morph');
      }
    }
  }

  const transition = doc.startViewTransition(async () => {
    const drawn = whenCommitted();
    update();
    await drawn;
    await settled();
    clearNames();
    if (key) {
      const selector = kind === 'back' ? `main [data-morph="${CSS.escape(key)}"]` : `main [data-morph-hero="${CSS.escape(key)}"]`;
      const target = [...document.querySelectorAll(selector)].find(onScreen);
      if (target) name(target, 'morph');
      else root.dataset.morphMissing = '';
    }
    if (!reduce) {
      const title = document.querySelector<HTMLElement>('main h1');
      if (title && !title.style.viewTransitionName && onScreen(title)) name(title, 'page-title');
    }
  });
  // A turn skipped by the next one rejects `ready`; that's expected, not an error.
  transition.ready.catch(() => undefined);
  running = transition;
  const end = () => {
    if (running !== transition) return;
    running = null;
    delete root.dataset.page;
    delete root.dataset.morphMissing;
    clearNames();
  };
  transition.finished.then(end, end);
}

/** Paper to Blackboard and back: the new theme is drawn down over the old like a blind. */
function themeChange(apply: () => void): void {
  const doc = document as TransitionDoc;
  if (!doc.startViewTransition || document.visibilityState === 'hidden') {
    apply();
    return;
  }
  running?.skipTransition();
  root.dataset.vt = prefersReducedMotion() || usingKeyboard() ? 'theme-fade' : 'theme';
  const transition = doc.startViewTransition(apply);
  transition.ready.catch(() => undefined);
  const end = () => delete root.dataset.vt;
  transition.finished.then(end, end);
}

// Where there are no View Transitions, GSAP brings the new page in from the side it came from.
let gsap: typeof Gsap | null = null;
if (!('startViewTransition' in document) && !prefersReducedMotion()) void import('gsap').then((module) => { gsap = module.gsap; }, () => undefined);

function viewEnter(el: Element | null, kind: PageKind): void {
  if (!el || !shouldAnimate()) return;
  const x = kind === 'forward' ? 28 : kind === 'back' ? -28 : 0;
  const y = kind === 'lateral' ? 10 : 0;
  if (gsap) gsap.fromTo(el, { opacity: 0, x, y }, { opacity: 1, x: 0, y: 0, duration: DUR.page / 1000, ease: 'expo.out', clearProps: 'opacity,transform' });
  else play(el, [{ opacity: 0, transform: `translate(${x}px, ${y}px)` }, { opacity: 1, transform: 'none' }], { duration: DUR.page, easing: EASE.drawer });
}

turns.enter = viewEnter;
turns.page = pageChange;
turns.theme = themeChange;
turns.turning = () => running !== null;
turns.committed = pageCommitted;
