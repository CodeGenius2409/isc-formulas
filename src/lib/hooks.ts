import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

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

/**
 * Lets the keyboard reach a formula only when it overflows and scrolls sideways.
 * A tab stop on every row would make a long unit impossible to tab through.
 */
export function useFocusableOverflow(label: string, ready: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const measure = () => {
      if (host.scrollWidth > host.clientWidth) {
        host.tabIndex = 0;
        host.setAttribute('role', 'group');
        host.setAttribute('aria-label', label);
      } else {
        host.removeAttribute('tabindex');
        host.removeAttribute('role');
        host.removeAttribute('aria-label');
      }
    };
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    void document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [label, ready]);
  return ref;
}
