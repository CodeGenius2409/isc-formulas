// A cheap answer to "can this formula be solved?", for list rows. It loads the
// registry's id list on its own, without pulling in the solver or mathjs.
import type { CustomFormula } from '../custom/store';
import { createStore, useStore } from '../lib/store';

const solvableStore = createStore<ReadonlySet<string>>(new Set());
let started = false;

export function loadSolvableIds(): void {
  if (started) return;
  started = true;
  void import('./registry/ids').then((m) => solvableStore.set(new Set(m.solvableIds)));
}

/** Whether the solver could use it, without loading the solver to find out. The solver itself checks fully. */
export function canSolveCustom(f: CustomFormula | undefined): boolean {
  return Boolean(f?.equation?.trim() && f.variables?.length);
}

export function useSolvableIds(): ReadonlySet<string> {
  loadSolvableIds();
  return useStore(solvableStore);
}
