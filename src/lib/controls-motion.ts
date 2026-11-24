// Segmented controls and tabs: when the choice changes, its fill (or the tabs' red-pen underline)
// slides from the old choice to the new, rather than blinking across. Loaded after first paint;
// until then the choice simply changes. A choice made from the keyboard changes at once.
import { EASE, play, prefersReducedMotion, spring, turns, usingKeyboard } from './motion';

const SELECTED = ':scope > :is([aria-pressed="true"], [aria-current="true"], [aria-selected="true"]), [data-slide-item][aria-pressed="true"]';
const GROUPS = '.seg, .work-tablist, [data-slide-group]';

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Where something is drawn, mid-slide or not, relative to its group. */
function boxOf(el: HTMLElement, group: HTMLElement): Box {
  const m = el.getBoundingClientRect();
  const g = group.getBoundingClientRect();
  return { x: m.left - g.left - group.clientLeft, y: m.top - g.top - group.clientTop, w: m.width, h: m.height };
}

function slide(group: HTMLElement, before: Box, to: HTMLElement): void {
  // A theme change pictures the whole screen as it is; a slide caught half-way would be pictured too.
  if (document.documentElement.dataset.vt) return;
  const after = boxOf(to, group);
  if (!after.w || !after.h) return;
  let mark = group.querySelector<HTMLElement>(':scope > .slide-mark');
  if (!mark) {
    mark = document.createElement('span');
    mark.className = 'slide-mark';
    mark.setAttribute('aria-hidden', 'true');
    group.append(mark);
  }
  mark.style.width = `${after.w}px`;
  mark.style.height = `${after.h}px`;
  mark.style.transform = `translate(${after.x}px, ${after.y}px)`;
  group.dataset.sliding = '';
  const { easing } = spring('sheet');
  const animation = mark.animate(
    [{ transform: `translate(${before.x}px, ${before.y}px) scale(${before.w / after.w}, ${before.h / after.h})` }, { transform: `translate(${after.x}px, ${after.y}px)` }],
    { duration: 340, easing },
  );
  const done = () => {
    if (mark.getAnimations().length) return;
    delete group.dataset.sliding;
    mark.remove();
  };
  animation.finished.then(done, () => undefined);
}

document.addEventListener(
  'click',
  (e) => {
    if (prefersReducedMotion() || usingKeyboard()) return;
    const group = (e.target instanceof Element ? e.target.closest(GROUPS) : null) as HTMLElement | null;
    const from = group?.querySelector<HTMLElement>(SELECTED);
    if (!group || !from) return;
    const moving = group.querySelector<HTMLElement>(':scope > .slide-mark');
    const before = boxOf(moving ?? from, group);
    // The new choice may arrive after a re-render or a hash change, so wait for it, briefly.
    const check = () => {
      const to = group.querySelector<HTMLElement>(SELECTED);
      if (!to || to === from || !group.isConnected) return false;
      observer.disconnect();
      window.clearTimeout(timer);
      slide(group, before, to);
      return true;
    };
    const observer = new MutationObserver(check);
    observer.observe(group, { subtree: true, attributes: true, attributeFilter: ['aria-pressed', 'aria-current', 'aria-selected'] });
    const timer = window.setTimeout(() => observer.disconnect(), 400);
  },
  true,
);

// Sheets (Sheet.tsx): drawn in from their edge, or from wherever a leaving sheet had got to, on the
// sheet spring, as the page dims. Until this loads, a sheet simply appears.
turns.sheetIn = (dialog, from) => {
  const reduce = prefersReducedMotion();
  const { easing, duration } = spring('sheet');
  play(dialog, reduce ? [{ opacity: 0 }, { opacity: 1 }] : [{ transform: from }, { transform: 'none' }], reduce ? { duration: 200, easing: 'ease' } : { duration, easing });
  play(dialog, [{ opacity: 0 }, { opacity: 1 }], { duration: reduce ? 200 : 380, easing: EASE.out, pseudoElement: '::backdrop' });
};

// Closed mid-entrance: the entrance is written back where it is, so the exit starts from there.
turns.sheetOut = (dialog) => {
  for (const animation of dialog.getAnimations()) {
    if (animation instanceof CSSTransition) continue;
    try {
      animation.commitStyles();
    } catch {
      // A backdrop's fade can't be written back; it simply hands over.
    }
    animation.cancel();
  }
  void getComputedStyle(dialog).transform;
};

// A <details> opened from the keyboard opens at once (motion-later.css); by pointer, it unrolls.
document.addEventListener(
  'keydown',
  (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target instanceof Element) e.target.closest('summary')?.parentElement?.setAttribute('data-instant', '');
  },
  true,
);
document.addEventListener(
  'pointerdown',
  (e) => {
    if (e.target instanceof Element) e.target.closest('summary')?.parentElement?.removeAttribute('data-instant');
  },
  true,
);
