import { useMemo, useState } from 'react';
import { loadAllFormulas } from '../../data/book';
import { useAsync } from '../../lib/hooks';
import { openWork } from '../../lib/router';
import { allEntries } from '../../solver/registry';

/** Choosing a formula to solve: a filter box over the solvable formulas, by topic. */
export function FormulaPicker() {
  const [query, setQuery] = useState('');
  const state = useAsync(loadAllFormulas, 'all-formulas');
  const names = useMemo(() => (state.status === 'ready' ? new Map(state.value.map((f) => [f.id, f.name])) : new Map<string, string>()), [state]);
  const entries = useMemo(() => allEntries(), []);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = new Map<string, { id: string; name: string }[]>();
    for (const e of entries) {
      const name = names.get(e.id) ?? e.id;
      if (q && !name.toLowerCase().includes(q) && !e.topic.toLowerCase().includes(q) && !e.eq.toLowerCase().includes(q)) continue;
      (out.get(e.topic) ?? out.set(e.topic, []).get(e.topic)!).push({ id: e.id, name });
    }
    return [...out.entries()];
  }, [entries, names, query]);

  return (
    <div>
      <h2 className="work-title">Solve a problem</h2>
      <p className="work-hint">Press Solve on a formula in the book, or choose one here. {entries.length} formulas can be solved for any variable.</p>
      <label className="lbl mt-3" htmlFor="picker-q">
        Filter
      </label>
      <input id="picker-q" className="field" value={query} autoComplete="off" onChange={(e) => setQuery(e.target.value)} placeholder="ohm, projectile, pH" />
      {state.status === 'loading' && <p className="mt-3 text-ink-3">Opening the list</p>}
      {state.status === 'ready' && groups.length === 0 && <p className="mt-3 text-ink-2">No solvable formula matches "{query}". Try a broader word.</p>}
      {state.status === 'ready' &&
        groups.map(([topic, items]) => (
          <section key={topic} className="mt-4">
            <h3 className="text-step-0 font-body font-semibold">{topic}</h3>
            <div className="pick-list">
              {items.slice(0, query ? 40 : 8).map((item) => (
                <button key={item.id} type="button" className="pick-item" onClick={() => openWork('solve', item.id)}>
                  {item.name}
                </button>
              ))}
              {!query && items.length > 8 && <p className="py-1 text-step--1 text-ink-3">and {items.length - 8} more. Filter to find them.</p>}
            </div>
          </section>
        ))}
    </div>
  );
}
