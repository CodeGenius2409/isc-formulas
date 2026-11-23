// The Python tracer's own copy of createStore and useStore from src/lib/store.ts. Importing that module from
// the tracer's chunks made the bundler move it out of the first screen's files into one of its own, which
// would have made the first load bigger. This copy lives only in the tracer's chunks.
import { useSyncExternalStore } from 'react';
import type { Store } from '../lib/store';

export function createStore<T>(initial: T, onChange?: (value: T) => void): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next) {
      const resolved = typeof next === 'function' ? (next as (prev: T) => T)(value) : next;
      if (Object.is(resolved, value)) return;
      value = resolved;
      onChange?.(value);
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
