import { useEffect, useState, useSyncExternalStore } from 'react';

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (l) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', l);
      return () => mq.removeEventListener('change', l);
    },
    () => window.matchMedia(query).matches,
  );
}

export type Async<T> = { status: 'loading' } | { status: 'ready'; value: T } | { status: 'error'; error: Error };

/** Runs an async loader on mount and whenever its key changes. */
export function useAsync<T>(load: () => Promise<T>, key: string): Async<T> {
  const [state, setState] = useState<{ key: string; result: Async<T> }>({ key, result: { status: 'loading' } });

  useEffect(() => {
    let alive = true;
    setState({ key, result: { status: 'loading' } });
    load().then(
      (value) => alive && setState({ key, result: { status: 'ready', value } }),
      (error: Error) => alive && setState({ key, result: { status: 'error', error } }),
    );
    return () => {
      alive = false;
    };
    // `key` stands in for `load`, which is a new closure on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state.key === key ? state.result : { status: 'loading' };
}
