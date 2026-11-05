import { lazy, Suspense, useMemo, useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { retryImport } from '../../lib/retry-import';
import { href } from '../../lib/router';
import type { SimulatorRef } from '../../practice/bank/types';
import { SimQuestionContext } from '../../sims/lib/question-mode';
import { SIMS } from '../../sims/registry';
import { RetryBoundary } from '../RetryBoundary';

/**
 * Simulators safe to open before answering, with their readouts hidden: what they draw doesn't give the number away.
 * A lens, say, draws the image, so it waits until the question has been answered. See reports/physics-visuals.md.
 */
const SAFE_BEFORE_ANSWER = new Set(['projectile', 'atwood', 'inclined', 'spring']);

export function SimPanel({ simulator, answered }: { simulator: SimulatorRef; answered: boolean }) {
  const [open, setOpen] = useState(false);
  const sim = SIMS.find((s) => s.id === simulator.id);
  const Component = useMemo(() => (sim ? lazy(() => retryImport(() => sim.load()).then((c) => ({ default: c }))) : null), [sim]);
  const context = useMemo(() => ({ preset: simulator.preset, hide: !answered }), [simulator.preset, answered]);
  if (!sim || !Component) return null;
  const canOpen = answered || SAFE_BEFORE_ANSWER.has(sim.id);
  if (!canOpen) return null;
  return (
    <div className="sim-panel no-print" data-testid="sim-panel">
      <button type="button" className="btn btn-line" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Play size={15} aria-hidden /> {answered ? 'Show in simulator' : 'Try this set-up in the simulator'}
      </button>
      {answered && (
        <a className="btn btn-quiet" href={href(`tools/${sim.id}`, Object.fromEntries(Object.entries(simulator.preset).map(([k, v]) => [k, String(v)])))}>
          <ExternalLink size={14} aria-hidden /> Open full size
        </a>
      )}
      {open && (
        <div className="sim-embed">
          {!answered && <p className="text-step--1 text-ink-2">It’s set to this question’s values, and its results stay hidden until you’ve answered.</p>}
          <RetryBoundary message="Couldn't load the simulator. Try again.">
            <SimQuestionContext.Provider value={context}>
              <Suspense fallback={<p className="text-ink-3">Opening</p>}>
                <Component />
              </Suspense>
            </SimQuestionContext.Provider>
          </RetryBoundary>
        </div>
      )}
    </div>
  );
}
