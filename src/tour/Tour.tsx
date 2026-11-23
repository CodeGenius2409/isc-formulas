// The first-visit tour. It is a note beside the page, not a layer over it: nothing is dimmed, the app keeps working
// under it, and Skip tour is always there. The part of the page each step is about is marked as a teacher would,
// with the red pen or the yellow chalk. It loads after the first screen, so the first load doesn't wait for it.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { findTarget, STEPS, type Step } from './steps';
import { endTour, placePanel, saveRole, savedRole, tourWanted, type Placed, type Role } from './state';
import './tour.css';

const MARKED = 'data-tour-target';

function go(route: string | undefined): void {
  if (route === undefined) return;
  const hash = `#/${route}`;
  if (location.hash !== hash && !(route === '' && (location.hash === '' || location.hash === '#/'))) location.hash = hash;
}

const onRoute = (route: string | undefined) => route === undefined || location.hash === `#/${route}` || (route === '' && (location.hash === '' || location.hash === '#'));

/**
 * Waits for a step's page to arrive and its target to be drawn. A new page takes focus and scrolls to its top a frame
 * after the address changes, so the step waits for that too, or it would be placed and focused too soon. Gives up after
 * a while, and the panel sits alone.
 */
function waitForTarget(step: Step, done: (el: HTMLElement | null) => void): () => void {
  let frame = 0;
  let tries = 0;
  let settled = 0;
  const look = () => {
    tries++;
    if (!onRoute(step.route) && tries < 120) {
      settled = 0;
      frame = requestAnimationFrame(look);
      return;
    }
    // Two frames on the page, for its own focus and scroll to happen first.
    if (settled++ < 2) {
      frame = requestAnimationFrame(look);
      return;
    }
    const el = findTarget(step);
    if (el || tries > 180) done(el);
    else frame = requestAnimationFrame(look);
  };
  frame = requestAnimationFrame(look);
  return () => cancelAnimationFrame(frame);
}

export default function Tour({ asked }: { asked: number }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [at, setAt] = useState(0);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [placed, setPlaced] = useState<Placed | null>(null);
  /** No movement after a keyboard action. */
  const [instant, setInstant] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef('');

  const steps = role ? STEPS[role] : [];
  const step: Step | undefined = role ? steps[at] : undefined;

  const begin = useCallback(() => {
    startedAt.current = location.hash;
    setRole(null);
    setAt(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (asked > 0) begin();
    else if (tourWanted()) begin();
  }, [asked, begin]);

  const close = useCallback(
    (how: 'done' | 'skipped') => {
      endTour(how);
      setOpen(false);
      setTarget(null);
      // Back where the tour began, so skipping it never leaves anyone somewhere they didn't choose.
      if (location.hash !== startedAt.current) location.hash = startedAt.current || '#/';
    },
    [],
  );

  // Each step opens its page, then waits for the part of it the step is about.
  useEffect(() => {
    if (!open || !step) return undefined;
    setTarget(null);
    go(step.route);
    return waitForTarget(step, (el) => {
      el?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
      setTarget(el);
    });
  }, [open, step]);

  // The marked part of the page carries the pen mark until the step moves on.
  useEffect(() => {
    target?.setAttribute(MARKED, '');
    return () => target?.removeAttribute(MARKED);
  }, [target]);

  // The panel follows its target wherever it moves: a scroll, a resize, or the page's own late changes, such as
  // maths that finishes setting and pushes a button down. One measurement a frame, and a new place only on a change.
  useLayoutEffect(() => {
    if (!open) return undefined;
    let frame = 0;
    let last = '';
    const measure = () => {
      const box = panel.current;
      if (box) {
        const rect = target?.getBoundingClientRect();
        const next = placePanel(rect ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height } : null, { width: box.offsetWidth, height: box.offsetHeight }, { width: window.innerWidth, height: window.innerHeight });
        const key = `${Math.round(next.top)},${Math.round(next.left)},${next.pointer},${next.side}`;
        if (key !== last) {
          last = key;
          setPlaced(next);
        }
      }
      frame = requestAnimationFrame(measure);
    };
    measure();
    return () => cancelAnimationFrame(frame);
  }, [open, target, at, role]);

  // Focus goes to each step, so a keyboard or a screen reader is taken along with it. The note can only take it once
  // it is placed and visible.
  const visible = placed !== null;
  useEffect(() => {
    if (open && visible) heading.current?.focus({ preventScroll: true });
  }, [open, visible, role, at, target]);

  if (!open) return null;

  const choose = (next: Role, keyboard: boolean) => {
    setInstant(keyboard);
    saveRole(next);
    setRole(next);
    setAt(0);
  };

  const next = (keyboard: boolean) => {
    setInstant(keyboard);
    if (at >= steps.length - 1) close('done');
    else setAt(at + 1);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close('skipped');
    }
  };

  // detail is 0 for a click made with the keyboard, which is how the panel knows not to move.
  const viaKeyboard = (e: { detail: number }) => e.detail === 0;
  const remembered = savedRole();
  const style = placed ? { top: placed.top, left: placed.left } : { visibility: 'hidden' as const };

  return (
    <div
      ref={panel}
      className="tour"
      role="dialog"
      aria-modal="false"
      aria-labelledby="tour-h"
      aria-describedby="tour-text"
      data-side={placed?.side}
      data-instant={instant || undefined}
      key={`${role ?? 'role'}-${at}`}
      style={{ ...style, ...(placed?.pointer != null ? { '--pointer': `${placed.pointer}px` } : {}) } as CSSProperties}
      onKeyDown={onKeyDown}
    >
      {!step ? (
        <>
          <h2 id="tour-h" ref={heading} tabIndex={-1}>
            A quick look round
          </h2>
          <p id="tour-text">Who’s using the book? The tour starts with what matters most to you.</p>
          <div className="tour-actions">
            <button type="button" className={`btn ${remembered === 'teacher' ? 'btn-line' : 'btn-solid'}`} onClick={(e) => choose('student', viaKeyboard(e))}>
              I’m a student
            </button>
            <button type="button" className={`btn ${remembered === 'teacher' ? 'btn-solid' : 'btn-line'}`} onClick={(e) => choose('teacher', viaKeyboard(e))}>
              I’m a teacher
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="tour-count">
            {at + 1} of {steps.length}
          </p>
          <h2 id="tour-h" ref={heading} tabIndex={-1}>
            {step.title}
          </h2>
          <p id="tour-text">{step.text}</p>
          <div className="tour-actions">
            <button type="button" className="btn btn-solid" onClick={(e) => next(viaKeyboard(e))}>
              {at >= steps.length - 1 ? 'Done' : 'Next'}
            </button>
          </div>
        </>
      )}
      <button type="button" className="btn btn-quiet tour-skip" onClick={() => close('skipped')}>
        Skip tour
      </button>
    </div>
  );
}
