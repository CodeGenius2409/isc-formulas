import { useEffect, useMemo, type RefObject } from 'react';
import { useAsync } from '../lib/hooks';
import { href, useRoute } from '../lib/router';
import { search } from '../search/client';
import { openPalette } from '../state/ui';
import { FormulaList, type ListItem } from '../components/FormulaList';

/** Every result for a query, when the palette's short list is not enough. */
export default function SearchView({ scrollRef }: { scrollRef: RefObject<HTMLElement | null> }) {
  const route = useRoute();
  const query = route.query.get('q') ?? '';
  const onlyMine = route.query.get('mine') === '1';
  const state = useAsync(() => search(query, { custom: onlyMine }, 1000), `find-${query}-${onlyMine}`);

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
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className="btn btn-line" onClick={openPalette}>
            Search again
          </button>
          <a className="btn btn-line" aria-pressed={onlyMine} role="button" href={href('find', { q: query, mine: onlyMine ? undefined : '1' })}>
            {onlyMine ? 'Show the whole book' : 'Only your formulas'}
          </a>
        </div>
      </header>
      <h2 className="sr-only">Results</h2>
      {items.length > 0 && <FormulaList items={items} scrollRef={scrollRef} showWhere />}
    </div>
  );
}
