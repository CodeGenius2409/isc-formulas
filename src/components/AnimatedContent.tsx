// The first sight of Today, once a visit: the date is written in from the left as if by pen,
// then the sections settle in below it, each a little sooner after the last.
// Originally adapted from React Bits' AnimatedContent (MIT + Commons Clause, David Haz); now on the
// Web Animations API, so it plays at first paint without waiting for GSAP, and it's cut to what
// this page needs. Never used in the formula-reading area.
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { DUR, EASE, play, prefersReducedMotion, staggerDelay, usingKeyboard } from '../lib/motion';

let played = false;

export function AnimatedContent({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    // Once a visit, and not when a page turn is already bringing the page in.
    if (!el || played || document.documentElement.dataset.page || usingKeyboard()) {
      played = true;
      return;
    }
    played = true;
    const [lead, ...rest] = Array.from(el.children);
    if (prefersReducedMotion()) {
      play(el, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.standard, easing: 'ease' });
      return;
    }
    const date = lead?.querySelector('h1');
    play(date, [{ clipPath: 'inset(-10% 100% -20% 0)', transform: 'translateY(6px)' }, { clipPath: 'inset(-10% 0 -20% 0)', transform: 'none' }], { duration: 640, easing: EASE.out });
    play(lead?.querySelector('.help-button'), [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.emphasis, delay: 420, easing: 'ease' });
    rest.slice(0, 6).forEach((child, i) => {
      play(child, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 220 + staggerDelay(i, 70, 360), easing: EASE.out });
    });
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
