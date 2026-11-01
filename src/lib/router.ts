// A small hash router. Hash URLs work on GitHub Pages and Vercel without any
// server rewrite, and they survive offline reloads.
import { useSyncExternalStore } from 'react';

export type WorkTab = 'solve' | 'check' | 'practice';

export interface Route {
  path: string[];
  query: URLSearchParams;
  /** Working-area state, kept in the URL so the back button closes the sheet. */
  work: WorkTab | null;
  workFormula: string | null;
}

export function parseHash(hash: string): Route {
  const trimmed = hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = splitOnce(trimmed, '?');
  const query = new URLSearchParams(queryPart);
  const work = query.get('work');
  return {
    path: pathPart.split('/').filter(Boolean).map(decodeURIComponent),
    query,
    work: work === 'solve' || work === 'check' || work === 'practice' ? work : null,
    workFormula: query.get('wf'),
  };
}

function splitOnce(value: string, sep: string): [string, string] {
  const i = value.indexOf(sep);
  return i < 0 ? [value, ''] : [value.slice(0, i), value.slice(i + 1)];
}

let current = parseHash(window.location.hash);
const listeners = new Set<() => void>();

/** The working area remembers its tab and formula while you move around the book. */
const workMemory: { tab: WorkTab; formula: string | null } = { tab: 'solve', formula: null };

function rememberWork(route: Route): void {
  if (route.work) workMemory.tab = route.work;
  if (route.workFormula) workMemory.formula = route.workFormula;
}

rememberWork(current);

window.addEventListener('hashchange', () => {
  current = parseHash(window.location.hash);
  rememberWork(current);
  listeners.forEach((l) => l());
});

export function workState(route: Route): { tab: WorkTab; formula: string | null } {
  return { tab: route.work ?? workMemory.tab, formula: route.workFormula ?? workMemory.formula };
}

/** Back to the formula list in the Solve tab. */
export function clearWorkFormula(): void {
  workMemory.formula = null;
  const params = new URLSearchParams(current.query);
  params.delete('wf');
  params.delete('find');
  params.set('work', 'solve');
  window.location.hash = `/${current.path.map(encodeURIComponent).join('/')}?${params.toString()}`;
}

export function useRoute(): Route {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
  );
}

export function getRoute(): Route {
  return current;
}

/** Builds a hash href. Working-area params carry over so the panel stays put. */
export function href(path: string, query?: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query ?? {})) if (v != null) params.set(k, v);
  const q = params.toString();
  return `#/${path}${q ? `?${q}` : ''}`;
}

export function navigate(path: string, query?: Record<string, string | undefined>): void {
  window.location.hash = href(path, query).slice(1);
}

/** Opens a working-area tab over the current page, without changing the page. */
export function openWork(tab: WorkTab, formulaId?: string): void {
  const route = getRoute();
  const params = new URLSearchParams(route.query);
  params.set('work', tab);
  if (formulaId) params.set('wf', formulaId);
  window.location.hash = `/${route.path.map(encodeURIComponent).join('/')}?${params.toString()}`;
}

export function closeWork(): void {
  const route = getRoute();
  const params = new URLSearchParams(route.query);
  params.delete('work');
  const q = params.toString();
  window.location.hash = `/${route.path.map(encodeURIComponent).join('/')}${q ? `?${q}` : ''}`;
}
