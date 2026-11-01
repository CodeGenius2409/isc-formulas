import { useEffect } from 'react';
import { manifest } from '../data/book';
import { useStore } from '../lib/store';
import { contrastStore, themeStore, type ContrastChoice, type ThemeChoice } from '../state/prefs';
import { OfflineStatus } from '../components/OfflineStatus';

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

  useEffect(() => {
    document.title = 'Settings: ISC Formula Book';
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
            {manifest.totals.entries.toLocaleString('en-GB')} formulas for ISC 2028 Physics, Chemistry, Mathematics and Computer Science. {manifest.totals.removed} true repeats from the earlier version were merged, and saved formulas from it carry over automatically.
          </p>
          <p className="mt-2 text-ink-2">Keyboard: press <kbd>/</kbd> or <kbd>Ctrl</kbd> <kbd>K</kbd> to find a formula.</p>
        </section>
      </div>
    </div>
  );
}
