// Code that loads on demand can fail for a moment: a dropped connection, or a deploy that has moved the
// file. React.lazy and a remembered promise both keep that failure for good, so the page stays broken
// until it is reloaded. Everything here tries again, and forgets a failure once it has been reported.
import { lazy, type ComponentType } from 'react';

const WAITS_MS = [0, 400, 1200];

const sleep = (ms: number) => new Promise<void>((done) => window.setTimeout(done, ms));

/** Chromium can remember a failed module for the life of the page. A new query asks for it afresh. */
function failedUrl(err: unknown): string | null {
  const found = /https?:\/\/\S+\.js/.exec(String((err as Error)?.message ?? ''));
  return found ? found[0] : null;
}

let busted = 0;

export async function retryImport<T>(load: () => Promise<T>, waits: readonly number[] = WAITS_MS): Promise<T> {
  let failure: unknown;
  for (const wait of waits) {
    if (wait) await sleep(wait);
    try {
      return await load();
    } catch (err) {
      failure = err;
    }
  }
  // A last go at the exact file, in case the failure itself is what was remembered.
  const url = failedUrl(failure);
  if (url) {
    try {
      await import(/* @vite-ignore */ `${url}?retry=${++busted}`);
      return await load();
    } catch {
      // Reported below, as the first failure.
    }
  }
  void askForUpdate();
  throw failure;
}

/** A file that has gone usually means a new version is out, so look for it now rather than within the hour. */
async function askForUpdate(): Promise<void> {
  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    await registration?.update();
  } catch {
    // Offline, or no service worker. There is nothing to find.
  }
}

/** Runs a loader once it has worked, and again from the start if it failed. */
export function loadOnce<T>(load: () => Promise<T>): () => Promise<T> {
  let loading: Promise<T> | null = null;
  return () => {
    loading ??= retryImport(load).catch((err) => {
      loading = null;
      throw err;
    });
    return loading;
  };
}

const forgetters = new Set<() => void>();

/** After this, a component that failed to load will try again the next time it renders. */
export function forgetFailedImports(): void {
  forgetters.forEach((forget) => forget());
  forgetters.clear();
}

/** React.lazy, retrying first, and able to start again after `forgetFailedImports`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyRetry<P extends object>(load: () => Promise<{ default: ComponentType<P> }>): ComponentType<P> {
  const make = () =>
    lazy(() =>
      retryImport(load).catch((err) => {
        forgetters.add(() => {
          current = make();
        });
        throw err;
      }),
    );
  let current = make();
  return function Lazy(props: P) {
    const Current = current as unknown as ComponentType<P>;
    return <Current {...props} />;
  };
}
