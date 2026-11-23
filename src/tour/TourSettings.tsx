// "Tour and tips", in Settings: start the tour again, and bring back any one-time tip that was dismissed.
import { useState } from 'react';
import { markTip, startTour, tipSeen, TIPS, type TipId } from './state';

const WHERE: Record<TipId, string> = {
  solver: 'Shows next time you solve a formula.',
  plotter: 'Shows next time you open the graph plotter.',
  generator: 'Shows next time you open the question generator.',
};

export function TourSettings() {
  const [seen, setSeen] = useState(() => Object.fromEntries(Object.keys(TIPS).map((id) => [id, tipSeen(id as TipId)])) as Record<TipId, boolean>);
  return (
    <section className="today-section" aria-labelledby="tour-settings-h">
      <h2 id="tour-settings-h">Tour and tips</h2>
      <p className="mt-2 text-ink-2">A short tour of the book, and a tip the first time you open some of its tools.</p>
      <button type="button" className="btn btn-line mt-3" onClick={() => startTour()}>
        Take the tour again
      </button>
      <ul className="mt-3">
        {(Object.keys(TIPS) as TipId[]).map((id) => (
          <li key={id} className="flex flex-wrap items-center justify-between gap-2 border-b border-rule py-2">
            <span>
              {TIPS[id]}
              <span className="block text-step--1 text-ink-2">{seen[id] ? 'Tip dismissed.' : WHERE[id]}</span>
            </span>
            {seen[id] && (
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => {
                  markTip(id, false);
                  setSeen({ ...seen, [id]: false });
                }}
              >
                Show it again
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
