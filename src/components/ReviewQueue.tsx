import { useMemo } from 'react';
import { ListChecks } from 'lucide-react';
import { findFormula } from '../data/book';
import type { Formula } from '../data/types';
import { useAsync } from '../lib/hooks';
import { openWork } from '../lib/router';
import { useStore } from '../lib/store';
import { srsStore, today } from '../practice/progress';
import { reviewOrder } from '../practice/srs';
import { startReviewNow } from '../practice/session-link';
import { Math as MathTex } from './Math';

/** Today's review queue, the first thing on the home screen. */
export function ReviewQueue() {
  const srs = useStore(srsStore);
  const due = useMemo(() => reviewOrder(Object.values(srs), today()), [srs]);
  const preview = due.slice(0, 3).map((d) => d.id);
  const state = useAsync(async () => (await Promise.all(preview.map(findFormula))).filter((f): f is Formula => f !== null), preview.join());
  const seen = Object.keys(srs).length;

  return (
    <section className="today-section" aria-labelledby="review-h" style={{ marginTop: '1rem' }}>
      <h2 id="review-h">Today's review</h2>
      {due.length > 0 ? (
        <>
          <p className="mt-2 text-step-1">
            <span className="num font-bold">{due.length}</span> {due.length === 1 ? 'formula is' : 'formulas are'} due.
          </p>
          {state.status === 'ready' && (
            <ul className="m-0 mt-1 list-none p-0">
              {state.value.map((f) => (
                <li key={f.id} className="border-b border-rule py-2" data-subject={f.subject}>
                  <span className="font-semibold">{f.name}</span>
                  <div className="math-host">
                    <MathTex latex={f.latex} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="btn btn-solid mt-3" onClick={startReviewNow}>
            <ListChecks size={16} aria-hidden /> Start review
          </button>
        </>
      ) : (
        <p className="empty">
          {seen ? `Nothing due today. ${seen} ${seen === 1 ? 'formula is' : 'formulas are'} scheduled for later.` : 'Nothing to review yet. Practise any formula and it joins this queue, returning just before you would forget it.'}
          {!seen && (
            <>
              {' '}
              <button type="button" className="underline text-action" onClick={() => openWork('practice')}>
                Start practising
              </button>
            </>
          )}
        </p>
      )}
    </section>
  );
}
