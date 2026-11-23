// The tour's steps: one sentence each, pointing at the real interface. A step lists its targets in order, and the
// first one on screen is used, so the same step points at the rail on a laptop and at the dock on a phone.
import type { Role } from './state';

export interface Target {
  selector: string;
  /** The element's own words, where its class is shared, such as one of the dock's buttons. */
  text?: string;
}

export interface Step {
  id: string;
  title: string;
  text: string;
  /** A page to open first, as a hash route without "#/". */
  route?: string;
  targets: Target[];
}

const BOOK: Step = {
  id: 'book',
  title: 'The book',
  text: 'Every ISC 2028 formula is here, by subject and unit, so open a subject to start reading.',
  route: '',
  targets: [{ selector: '.thumbs' }, { selector: '.dock-item', text: 'Book' }],
};

const FIND: Step = {
  id: 'find',
  title: 'Find',
  text: 'Find any formula by its name or by the quantities you know, from here or by pressing / on a keyboard.',
  targets: [
    { selector: '.rail-link', text: 'Find' },
    { selector: '.dock-item', text: 'Find' },
  ],
};

const SOLVE: Step = {
  id: 'solve',
  title: 'Solve with this',
  text: 'On any formula, Solve with this works out the quantity you don’t know and shows every step.',
  route: 'f/p-xi-2-7',
  targets: [{ selector: 'main a, main button', text: 'Solve with this' }],
};

const PRACTICE: Step = {
  id: 'practice',
  title: 'Practice',
  text: 'Practice asks questions in the style of the papers, and brings back sooner whatever you get wrong.',
  route: '',
  targets: [
    { selector: '.work-tab', text: 'Practice' },
    { selector: '.rail-link', text: 'Work' },
    { selector: '.dock-item', text: 'Work' },
  ],
};

const PAPERS: Step = {
  id: 'papers',
  title: 'Mock papers',
  text: 'A mock paper has the real sections, marks and three hours, and you mark it afterwards against the scheme.',
  route: 'paper',
  targets: [{ selector: 'main button', text: 'Start the paper' }, { selector: 'main h1' }],
};

const GENERATOR: Step = {
  id: 'generator',
  title: 'Generate questions',
  text: 'Make a worksheet or a whole paper offline, then Sets A, B and C, an answer key and a Word file from it.',
  route: 'generate',
  targets: [{ selector: 'main h1' }],
};

const TOOLS: Step = {
  id: 'tools',
  title: 'Simulators and tracers',
  text: 'Tools has 42 simulators, with tracers that step through Java and Python programs a line at a time.',
  route: '',
  targets: [
    { selector: '.rail-link', text: 'Tools' },
    { selector: '.dock-item', text: 'Tools' },
  ],
};

const YOURS: Step = {
  id: 'yours',
  title: 'Your own formulas',
  text: 'Add formulas of your own, and they sit in the book beside the printed ones.',
  route: '',
  targets: [
    { selector: '.rail-link', text: 'Yours' },
    { selector: 'main a', text: 'Your formulas' },
  ],
};

/** A teacher sees what they came for first: the generator, its sets and Word export. */
export const STEPS: Record<Role, Step[]> = {
  student: [BOOK, FIND, SOLVE, PRACTICE, PAPERS, TOOLS, YOURS],
  teacher: [GENERATOR, PAPERS, BOOK, FIND, TOOLS, YOURS],
};

function shown(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;
  const style = getComputedStyle(el);
  return style.visibility !== 'hidden' && style.display !== 'none';
}

/** The first of a step's targets that is on screen now. */
export function findTarget(step: Step): HTMLElement | null {
  for (const target of step.targets) {
    for (const el of document.querySelectorAll<HTMLElement>(target.selector)) {
      if (target.text && el.textContent?.trim() !== target.text) continue;
      if (shown(el)) return el;
    }
  }
  return null;
}
