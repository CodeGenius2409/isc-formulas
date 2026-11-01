// Adapted from React Bits (https://reactbits.dev), AnimatedContent, copied in by
// hand as its docs describe. MIT + Commons Clause, by David Haz.
//
// Trimmed to what this app needs: the mount trigger only, so ScrollTrigger is not
// bundled, and no blur, tilt or wipe effects. Timing follows DESIGN.md rather than
// the component's defaults (0.8 s and 100 px, which are far too slow and loud here).
// Used once, on the Today page. Never in the formula-reading area.
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { motionEngine, prefersReducedMotion } from '../lib/motion';

interface Props {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
  stagger?: number;
}

export function AnimatedContent({ children, className, distance = 8, duration = 0.22, stagger = 0.03 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const gsap = motionEngine();
    if (!gsap || !el || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.children, { y: distance, opacity: 0 }, { y: 0, opacity: 1, duration, stagger, ease: 'expo.out', clearProps: 'opacity,transform' });
    }, el);
    return () => ctx.revert();
    // Plays once, when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
