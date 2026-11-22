// What the Tools page opens for the Python tracer. The tracer's own code is saved for offline use only with
// Python itself, so with no connection this decides, without asking the network for anything, whether it
// can open, and says plainly why not when it can't.
import { Suspense, useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { lazyRetry } from '../lib/retry-import';
import { pythonSaved } from '../python/offline';

const PythonTracer = lazyRetry<object>(() => import('./PythonTracer').then((m) => ({ default: m.PythonTracer })));

export function PythonEntry() {
  const [canOpen, setCanOpen] = useState<boolean | null>(() => (navigator.onLine ? true : null));

  useEffect(() => {
    if (!navigator.onLine) void pythonSaved().then(setCanOpen);
  }, []);

  if (canOpen === null) return null;
  if (!canOpen) {
    return (
      <div className="notice" role="status">
        <Info size={16} aria-hidden="true" />
        <div>
          <p>You’re offline, and the Python tracer isn’t saved on this device, so it can’t open now. It runs real Python, which is downloaded when the tracer first opens.</p>
          <p className="mt-1 text-ink-2">
            Connect to open it. To trace Python offline another time, turn on Keep Python for offline use in <a href="#/settings">Settings</a> while you’re online.
          </p>
        </div>
      </div>
    );
  }
  return (
    <Suspense fallback={<p className="text-ink-3">Opening</p>}>
      <PythonTracer />
    </Suspense>
  );
}
