import { useEffect, useState } from 'react';
import { CloudOff } from 'lucide-react';
import { useStore } from '../lib/store';
import { offlineReadyStore } from '../state/ui';

function useOnline(): boolean {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const change = () => setOnline(navigator.onLine);
    window.addEventListener('online', change);
    window.addEventListener('offline', change);
    return () => {
      window.removeEventListener('online', change);
      window.removeEventListener('offline', change);
    };
  }, []);
  return online;
}

/** Shown on Today while there is no connection. Nothing is wrong, so it isn't an error. */
export function OfflineLine() {
  const online = useOnline();
  if (online) return null;
  return (
    <p className="offline-line">
      <CloudOff size={16} aria-hidden="true" />
      Offline. Everything in the book still works.
    </p>
  );
}

/** The Offline section of Settings. */
export function OfflineStatus() {
  const online = useOnline();
  const ready = useStore(offlineReadyStore);
  const [usedMb, setUsedMb] = useState<number | null>(null);

  useEffect(() => {
    if (!ready || !navigator.storage?.estimate) return;
    void navigator.storage.estimate().then(
      (estimate) => {
        if (estimate.usage) setUsedMb(estimate.usage / (1024 * 1024));
      },
      () => undefined,
    );
  }, [ready]);

  return (
    <section className="today-section" aria-labelledby="offline-h">
      <h2 id="offline-h">Offline</h2>
      <p className="mt-2 text-ink-2">
        {ready ? 'The whole book is saved on this device, so it works with no connection.' : 'The book is saving itself to this device for offline use.'}
        {usedMb != null ? ` It uses about ${Math.ceil(usedMb)} MB.` : ''}
        {online ? '' : ' You are offline now.'}
      </p>
      <p className="mt-2 text-ink-2">To keep it on your home screen: on Android, open the browser menu and choose Install app. On iPhone, tap Share in Safari, then Add to Home Screen.</p>
    </section>
  );
}
