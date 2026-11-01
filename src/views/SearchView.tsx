import { useEffect, useMemo, type RefObject } from 'react';
import { useAsync } from '../lib/hooks';
import { useRoute } from '../lib/router';
import { search } from '../search/client';
import { openPalette } from '../state/ui';
import { FormulaList, type ListItem } from '../components/FormulaList';

/** Every result for a query, when the palette's short list is not enough. */
export default function SearchView({ scrollRef }: { scrollRef: RefObject<HTMLElement | null> }) {
  const route = useRoute();
  const query = route.query.get('q') ?? '';
  const state = useAsync(() => search(query, {}, 1000), `find-${query}`);

  const items = useMemo<ListItem[]>(() => (state.status === 'ready' ? state.value.hits.map(({ formula }) => ({ kind: 'formula', key: formula.id, formula })) : []), [state]);

  useEffect(() => {
    document.title = `Find "${query}": ISC Formula Book`;
  }, [query]);

  return (
    <div className="page">
      <header className="unit-title">
        <h1 style={{ color: 'var(--ink)' }}>Results for "{query}"</h1>
        <p>
          {state.status === 'loading' && 'Searching'}
          {state.status === 'ready' && `${state.value.total} formulas`}
          {state.status === 'ready' && state.value.total === 0 && '. Try fewer words.'}
        </p>
        <button type="button" className="btn btn-line mt-2" onClick={openPalette}>
          Search again
        </button>
      </header>
      {items.length > 0 && <FormulaList items={items} scrollRef={scrollRef} showWhere />}
    </div>
  );
}
