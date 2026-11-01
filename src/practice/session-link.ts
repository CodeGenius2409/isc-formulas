import { openWork } from '../lib/router';

/** Starts practice on one formula, in the working area. */
export function startPracticeOn(formulaId: string): void {
  openWork('practice', formulaId);
}
