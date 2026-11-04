import { useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { offlineReadyStore } from '../state/ui';
import { toast } from '../state/toast';

const CHECK_EVERY_MS = 60 * 60 * 1000;

/** Registers the service worker, and offers a new version without interrupting. */
export function UpdatePrompt() {
  const [waiting, setWaiting] = useState(false);
  const [updatedElsewhere, setUpdatedElsewhere] = useState(false);
  const update = useRef<((reload?: boolean) => Promise<void>) | null>(null);
  const updatingHere = useRef(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;
    // Another tab pressed Update now. Its service worker has deleted this page's old files, so this page
    // can't load any more of its code, and it must not carry on as if it could.
    const hadWorker = Boolean(navigator.serviceWorker.controller);
    const onControllerChange = () => {
      if (hadWorker && !updatingHere.current) setUpdatedElsewhere(true);
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    update.current = registerSW({
      onNeedRefresh: () => setWaiting(true),
      onOfflineReady: () => {
        offlineReadyStore.set(true);
        toast('Ready to work offline');
      },
      onRegisteredSW: (_url, registration) => {
        if (!registration) return;
        if (registration.active) offlineReadyStore.set(true);
        window.setInterval(() => {
          if (navigator.onLine) void registration.update().catch(() => undefined);
        }, CHECK_EVERY_MS);
      },
    });
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, []);

  if (updatedElsewhere) {
    return (
      <div className="update-note" role="status">
        <span>The book was updated in another tab. Reload to use the new version here.</span>
        <button type="button" className="btn btn-solid" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    );
  }
  if (!waiting) return null;
  return (
    <div className="update-note" role="status">
      <span>A new version of the book is ready.</span>
      <button type="button" className="btn btn-solid" onClick={() => {
            updatingHere.current = true;
            void update.current?.(true);
          }}
        >
        Update now
      </button>
      <button type="button" className="btn btn-quiet" style={{ color: 'inherit' }} onClick={() => setWaiting(false)}>
        Later
      </button>
    </div>
  );
}
