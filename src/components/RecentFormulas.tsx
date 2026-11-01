import { findFormula } from '../data/book';
import type { Formula } from '../data/types';
import { useAsync } from '../lib/hooks';
import { href } from '../lib/router';
import { Math } from './Math';

/** A compact list of formulas opened lately, on the Today page. */
export function RecentFormulas({ ids }: { ids: string[] }) {
  const state = useAsync(async () => (await Promise.all(ids.map(findFormula))).filter((f): f is Formula => f !== null), ids.join());
  if (state.status !== 'ready' || !state.value.length) return null;
  return (
    <section className="today-section" aria-labelledby="recent-h">
      <h2 id="recent-h">Recent formulas</h2>
      <ul className="list-none p-0 m-0">
        {state.value.map((f) => (
          <li key={f.id} className="border-b border-rule py-2" data-subject={f.subject}>
            <a href={href(`f/${f.id}`)} className="font-semibold no-underline hover:underline">
              {f.name}
            </a>
            <div className="math-host pt-1">
              <Math latex={f.latex} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
