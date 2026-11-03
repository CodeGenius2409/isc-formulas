// Deleting one of your formulas takes its favourite, its review schedule and its mistakes with it, and Undo
// brings all of them back.
import { mistakesStore, srsStore } from '../practice/progress';
import { favouritesStore, recentsStore } from '../state/library';
import { toast } from '../state/toast';
import { eraseCustom, findCustom, isCustomId, saveCustom } from './store';

const UNDO_MS = 8000;

export async function deleteCustomFormula(id: string): Promise<void> {
  // Only your own, whatever asked for this.
  const formula = findCustom(id);
  if (!isCustomId(id) || !formula) return;
  const before = { favourites: favouritesStore.get(), recents: recentsStore.get(), srs: srsStore.get(), mistakes: mistakesStore.get() };
  favouritesStore.set((ids) => ids.filter((x) => x !== id));
  recentsStore.set((ids) => ids.filter((x) => x !== id));
  srsStore.set((all) => Object.fromEntries(Object.entries(all).filter(([key]) => key !== id)));
  mistakesStore.set((list) => list.filter((m) => m.formulaId !== id));
  await eraseCustom(id);
  toast(`Deleted ${formula.name}`, {
    ms: UNDO_MS,
    action: {
      label: 'Undo',
      run: () => {
        void saveCustom(formula);
        favouritesStore.set(before.favourites);
        recentsStore.set(before.recents);
        srsStore.set(before.srs);
        mistakesStore.set(before.mistakes);
        toast('Restored');
      },
    },
  });
}
