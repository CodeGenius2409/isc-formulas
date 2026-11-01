// Favourites, recent formulas and the reading position. Favourites keep the old
// app's storage key, so your saved list carries over, and old ids migrate on load.
import { migrateIds } from '../data/aliases';
import type { ClassLevel, SubjectId } from '../data/types';
import { createStore } from '../lib/store';
import { readJson, writeJson } from '../lib/storage';

const FAV_KEY = 'isc-favs';
const RECENT_KEY = 'isc-recent';
const LAST_KEY = 'isc-last';
const RECENT_LIMIT = 24;

function loadIds(key: string): string[] {
  const raw = readJson<unknown>(key, []);
  return Array.isArray(raw) ? migrateIds(raw.filter((x): x is string => typeof x === 'string')) : [];
}

export const favouritesStore = createStore<string[]>(loadIds(FAV_KEY), (ids) => writeJson(FAV_KEY, ids));

// Writes the migrated list straight away, so old ids do not linger in storage.
writeJson(FAV_KEY, favouritesStore.get());

export function toggleFavourite(id: string): boolean {
  const has = favouritesStore.get().includes(id);
  favouritesStore.set((ids) => (has ? ids.filter((x) => x !== id) : [...ids, id]));
  return !has;
}

export const recentsStore = createStore<string[]>(loadIds(RECENT_KEY), (ids) => writeJson(RECENT_KEY, ids));

export function noteRecent(id: string): void {
  recentsStore.set((ids) => (ids[0] === id ? ids : [id, ...ids.filter((x) => x !== id)].slice(0, RECENT_LIMIT)));
}

export interface LastRead {
  subject: SubjectId;
  classLevel: ClassLevel;
  unit: string;
  unitIndex?: number;
  subtopic?: string | null;
  subtopicIndex?: number;
}

export const lastReadStore = createStore<LastRead | null>(readJson<LastRead | null>(LAST_KEY, null), (value) => writeJson(LAST_KEY, value));

/** The class last opened for each subject, so a thumb tab returns you there. */
const CLASS_KEY = 'isc-class';
export const classMemoryStore = createStore<Partial<Record<SubjectId, ClassLevel>>>(readJson(CLASS_KEY, {}), (value) => writeJson(CLASS_KEY, value));

export function rememberClass(subject: SubjectId, level: ClassLevel): void {
  classMemoryStore.set((memo) => (memo[subject] === level ? memo : { ...memo, [subject]: level }));
}
