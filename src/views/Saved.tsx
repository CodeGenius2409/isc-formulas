import { useEffect, useMemo, type RefObject } from 'react';
import { findFormula } from '../data/book';
import type { Formula } from '../data/types';
import { useAsync } from '../lib/hooks';
import { useStore } from '../lib/store';
import { favouritesStore, removedFavourites } from '../state/library';
import { FormulaList, type ListItem } from '../components/FormulaList';

export default function Saved({ scrollRef }: { scrollRef: RefObject<HTMLElement | null> }) {
  const ids = useStore(favouritesStore);
  const state = useAsync(async () => (await Promise.all(ids.map(findFormula))).filter((f): f is Formula => f !== null), ids.join());

  const items = useMemo<ListItem[]>(() => (state.status === 'ready' ? state.value.map((formula) => ({ kind: 'formula', key: formula.id, formula })) : []), [state]);

  useEffect(() => {
    document.title = 'Saved: ISC Formula Book';
  }, []);

  return (
    <div className="page">
      <header className="unit-title">
        <h1 style={{ color: 'var(--ink)' }}>Saved formulas</h1>
        <p>{ids.length ? `${ids.length} saved` : 'Nothing saved yet. Press the star on any formula to keep it here.'}</p>
        {removedFavourites > 0 && (
          <p>
            {removedFavourites === 1 ? '1 saved formula is' : `${removedFavourites} saved formulas are`} no longer in the book, because {removedFavourites === 1 ? 'it is' : 'they are'} outside the 2028 syllabus.
          </p>
        )}
      </header>
      <h2 className="sr-only">Your saved formulas</h2>
      {items.length > 0 && <FormulaList items={items} scrollRef={scrollRef} showWhere />}
    </div>
  );
}
