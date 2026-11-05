// Figures in papers: whether they're shown, which ones a question can't do without, and their numbers.
import { createStore } from '../../lib/store';
import { readJson, writeJson } from '../../lib/storage';
import type { BankItem } from '../bank/types';

const switchStore = (key: string) => createStore<boolean>(readJson<boolean>(key, true), (value) => writeJson(key, value));

/** On by default, and remembered separately for a student's mock paper and a teacher's paper. */
export const paperDiagramsStore = switchStore('isc-paper-diagrams');
export const teacherDiagramsStore = switchStore('isc-teacher-diagrams');

export const KEPT_NOTE = 'This figure stays, as the question can’t be answered without it.';

/** A question that points at its figure, or whose data is the figure, makes no sense without it. */
export function needsFigure(item: BankItem): boolean {
  if (!item.diagram) return false;
  if (item.diagram.kind === 'table' || item.diagram.kind === 'tree') return true;
  return /\b(shown|the (graph|figure|diagram|circuit|table)|drawn|above|below|marked|this (graph|figure|circuit))\b/i.test(item.text);
}

export interface FigureMark {
  number: number;
  /** Shown with figures switched off, because the question needs it. */
  kept: boolean;
}

/** Numbers the figures across a paper, in the order they appear. Anything without a mark isn't shown. */
export function markFigures(items: BankItem[], on: boolean): Map<string, FigureMark> {
  const marks = new Map<string, FigureMark>();
  let number = 0;
  for (const item of items) {
    if (!item.diagram) continue;
    const kept = !on && needsFigure(item);
    if (on || kept) marks.set(item.id, { number: ++number, kept });
  }
  return marks;
}

/** The question's words, pointing to its figure. */
export const withFigureNote = (text: string, mark: FigureMark | undefined): string => (mark ? `${text} (See Fig. ${mark.number}.)` : text);
