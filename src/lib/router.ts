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
  /** Counts moves to a new place. Following the reader's scroll does not count. */
  navigation: number;
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
    navigation: 0,
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
  const next = parseHash(window.location.hash);
  // Opening the working area changes the hash too, and that must not move the page.
  const moved = next.path.join('/') !== current.path.join('/') || next.query.get('s') !== current.query.get('s');
  current = { ...next, navigation: current.navigation + (moved ? 1 : 0) };
  rememberWork(current);
  listeners.forEach((l) => l());
});

/** Writes the section being read to the URL. It replaces the entry, so Back still leaves the unit. */
export function trackSection(section: number | null): void {
  const params = new URLSearchParams(current.query);
  if (section == null) params.delete('s');
  else params.set('s', String(section));
  const q = params.toString();
  const next = `#/${current.path.map(encodeURIComponent).join('/')}${q ? `?${q}` : ''}`;
  if (next === window.location.hash) return;
  window.history.replaceState(window.history.state, '', next);
  current = { ...parseHash(next), navigation: current.navigation };
  listeners.forEach((l) => l());
}

/** Takes a parameter out of the URL without it counting as a move. */
export function dropQuery(name: string): void {
  const params = new URLSearchParams(current.query);
  if (!params.has(name)) return;
  params.delete(name);
  const q = params.toString();
  const next = `#/${current.path.map(encodeURIComponent).join('/')}${q ? `?${q}` : ''}`;
  window.history.replaceState(window.history.state, '', next);
  current = { ...parseHash(next), navigation: current.navigation };
  listeners.forEach((l) => l());
}

/** A link to where the URL already points fires no hashchange, but the reader still wants to go there. */
export function goAgainIfHere(target: string): void {
  if (window.location.hash !== target) return;
  current = { ...current, navigation: current.navigation + 1 };
  listeners.forEach((l) => l());
}

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
