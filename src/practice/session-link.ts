// Starts practice from anywhere, without loading the question code (and mathjs)
// until it is needed.
import { openWork } from '../lib/router';
import { createStore } from '../lib/store';

export const practiceBusyStore = createStore(false);

export function startPracticeOn(formulaId: string): void {
  practiceBusyStore.set(true);
  openWork('practice');
  void import('./session')
    .then((m) => m.startFormula(formulaId))
    .finally(() => practiceBusyStore.set(false));
}

export function startReviewNow(): void {
  practiceBusyStore.set(true);
  openWork('practice');
  void import('./session')
    .then((m) => m.startReview())
    .finally(() => practiceBusyStore.set(false));
}
