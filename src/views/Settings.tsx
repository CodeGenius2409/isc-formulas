import { useEffect, useState } from 'react';
import { manifest } from '../data/book';
import { useStore } from '../lib/store';
import { contrastStore, themeStore, type ContrastChoice, type ThemeChoice } from '../state/prefs';
import { OfflineStatus } from '../components/OfflineStatus';
import { cleanGap, ensureFactHistory, factGapStore, resetFactHistory, seenFactsStore } from '../practice/fact-history';

const THEMES: { id: ThemeChoice; label: string }[] = [
  { id: 'system', label: 'Match device' },
  { id: 'paper', label: 'Paper' },
  { id: 'board', label: 'Blackboard' },
];

const CONTRASTS: { id: ContrastChoice; label: string }[] = [
  { id: 'normal', label: 'Standard' },
  { id: 'high', label: 'High' },
];

export default function Settings() {
  const theme = useStore(themeStore);
  const contrast = useStore(contrastStore);
  const gap = useStore(factGapStore);
  const seen = useStore(seenFactsStore);
  const [asking, setAsking] = useState(false);
  const [cleared, setCleared] = useState(false);
  const remembered = Object.keys(seen).length;

  useEffect(() => {
    document.title = 'Settings: ISC Formula Book';
    void ensureFactHistory();
  }, []);

  return (
    <div className="page">
      <div className="page-pad max-w-[42rem]">
        <h1 className="text-step-3">Settings</h1>

        <section className="today-section" aria-labelledby="look-h">
          <h2 id="look-h">Appearance</h2>
          <p className="lbl mt-3">Theme</p>
          <div className="seg" role="group" aria-label="Theme">
            {THEMES.map((t) => (
              <button key={t.id} type="button" aria-pressed={theme === t.id} onClick={() => themeStore.set(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <p className="lbl mt-3">Contrast</p>
          <div className="seg" role="group" aria-label="Contrast">
            {CONTRASTS.map((c) => (
              <button key={c.id} type="button" aria-pressed={contrast === c.id} onClick={() => contrastStore.set(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </section>

        <section className="today-section" aria-labelledby="repeats-h">
          <h2 id="repeats-h">Repeats</h2>
          <p className="mt-2 text-ink-2">
            In practice and mock papers, a fact you’ve been shown stays away for a while, so you meet new ones first. Anything you got wrong still comes back when its review is due.
          </p>
          <label className="lbl mt-3 block" htmlFor="fact-gap">
            Days before a fact can come back
          </label>
          <input id="fact-gap" className="field mt-1 w-24" type="number" min={0} max={365} value={gap} onChange={(e) => factGapStore.set(cleanGap(e.target.valueAsNumber))} />
          <p className="mt-3 text-ink-2" data-testid="fact-count">
            {remembered === 1 ? 'One fact is' : `${remembered} facts are`} remembered on this device.
          </p>
          {asking ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span>Forget which facts you’ve seen? Your review schedule stays.</span>
              <button
                type="button"
                className="btn btn-line"
                onClick={() => {
                  void resetFactHistory();
                  setAsking(false);
                  setCleared(true);
                }}
              >
                Yes, reset
              </button>
              <button type="button" className="btn btn-quiet" onClick={() => setAsking(false)}>
                Keep it
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-line mt-2"
              onClick={() => {
                setCleared(false);
                setAsking(true);
              }}
            >
              Reset history
            </button>
          )}
          {cleared && (
            <p className="mt-2 text-ink-2" role="status">
              History cleared.
            </p>
          )}
        </section>

        <section className="today-section" aria-labelledby="data-h">
          <h2 id="data-h">Your data</h2>
          <p className="mt-2 text-ink-2">
            Your progress stays on this device. To back it up or move it, go to <a href="#/practice">Progress</a>.
          </p>
        </section>

        <OfflineStatus />

        <section className="today-section" aria-labelledby="about-h">
          <h2 id="about-h">About this book</h2>
          <p className="mt-2 text-ink-2">
            {manifest.totals.entries.toLocaleString('en-GB')} formulas for ISC 2028 Physics, Chemistry, Mathematics and Computer Science. The list follows the official 2028 syllabus. {manifest.totals.merged} true repeats from the earlier version were merged, {manifest.totals.archived} entries outside the syllabus or not needed were taken out, and saved formulas carry over.
          </p>
          <p className="mt-2 text-ink-2">Keyboard: press <kbd>/</kbd> or <kbd>Ctrl</kbd> <kbd>K</kbd> to find a formula.</p>
        </section>
      </div>
    </div>
  );
}
