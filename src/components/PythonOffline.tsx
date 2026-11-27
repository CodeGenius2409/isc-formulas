// "Keep Python for offline use", in Settings. Off by default, since Python is far larger than the rest of
// the book. Turning it on saves Pyodide's files in a cache of their own; turning it off deletes them.
// Under it, "Also keep NumPy, pandas and Matplotlib" does the same for the libraries. That option's code is
// saved with Python rather than with the book, so it loads only while Keep Python is on.
import { Suspense, useEffect, type ComponentType } from 'react';
import { LoadBar } from './LoadBar';
import { lazyRetry } from '../lib/retry-import';
import { useStore } from '../python/state';
import { checkSavedPython, keepPythonStore, megabytes, PYTHON_BYTES, pythonSaveStore, savePython } from '../python/offline';

const loadLibrariesOption = (): Promise<{ default: ComponentType<object> }> => import('../python/python-libraries').then((m) => ({ default: m.LibrariesOption }));
const LibrariesOption = lazyRetry<object>(loadLibrariesOption);

export function PythonOffline() {
  const keep = useStore(keepPythonStore);
  const save = useStore(pythonSaveStore);

  useEffect(() => {
    void checkSavedPython();
  }, []);

  const share = save.phase === 'saving' && save.total ? Math.round((save.loaded / save.total) * 100) : null;

  return (
    <section className="today-section" aria-labelledby="python-offline-h">
      <h2 id="python-offline-h">Python tracer</h2>
      <p className="mt-2 text-ink-2">The Python tracer runs real Python, which downloads the first time the tracer opens in a visit. It isn’t saved with the rest of the book, as it takes about {megabytes(PYTHON_BYTES)}.</p>
      <label className="check-row mt-3">
        <input type="checkbox" checked={keep} onChange={(e) => keepPythonStore.set(e.target.checked)} />
        Keep Python for offline use
      </label>
      <p className="mt-1 text-ink-2" role="status" data-testid="python-offline-state">
        {!keep && 'Python isn’t saved on this device.'}
        {keep && save.phase === 'saving' && `Saving Python on this device. ${share ?? 0}%`}
        {keep && save.phase === 'saved' && 'Python is saved on this device, so the tracer works offline.'}
        {keep && save.phase === 'idle' && 'Python will be saved on this device.'}
        {keep && save.phase === 'failed' && save.message}
      </p>
      {keep && save.phase === 'saving' && <LoadBar className="mt-2" share={share ?? 0} label="Saving Python" />}
      {keep && save.phase === 'failed' && navigator.onLine && (
        <button type="button" className="btn btn-line mt-2" onClick={() => void savePython()}>
          Try again
        </button>
      )}
      {keep && (
        <Suspense fallback={null}>
          <LibrariesOption />
        </Suspense>
      )}
    </section>
  );
}
