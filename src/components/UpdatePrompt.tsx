import { useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { offlineReadyStore } from '../state/ui';
import { toast } from '../state/toast';

const CHECK_EVERY_MS = 60 * 60 * 1000;

/** Registers the service worker, and offers a new version without interrupting. */
export function UpdatePrompt() {
  const [waiting, setWaiting] = useState(false);
  const update = useRef<((reload?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
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
  }, []);

  if (!waiting) return null;
  return (
    <div className="update-note" role="status">
      <span>A new version of the book is ready.</span>
      <button type="button" className="btn btn-solid" onClick={() => void update.current?.(true)}>
        Update now
      </button>
      <button type="button" className="btn btn-quiet" style={{ color: 'inherit' }} onClick={() => setWaiting(false)}>
        Later
      </button>
    </div>
  );
}
