// Favourites, recent formulas and the reading position. Favourites keep the old
// app's storage key, so your saved list carries over, and old ids migrate on load.
import { isRemovedId, migrateIds } from '../data/aliases';
import { getClass } from '../data/book';
import type { ClassLevel, SubjectId } from '../data/types';
import { createStore } from '../lib/store';
import { readJson, writeJson } from '../lib/storage';

const FAV_KEY = 'isc-favs';
const RECENT_KEY = 'isc-recent';
const LAST_KEY = 'isc-last';
const RECENT_LIMIT = 24;

function countRemoved(key: string): number {
  const raw = readJson<unknown>(key, []);
  return Array.isArray(raw) ? raw.filter((x) => typeof x === 'string' && isRemovedId(x)).length : 0;
}

function loadIds(key: string): string[] {
  const raw = readJson<unknown>(key, []);
  return Array.isArray(raw) ? migrateIds(raw.filter((x): x is string => typeof x === 'string')) : [];
}

/** How many saved formulas were dropped on this load, because they have left the book. */
export const removedFavourites = countRemoved(FAV_KEY);

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

/** The book's units were renumbered to the official syllabus, so an old place may not exist. */
function loadLastRead(): LastRead | null {
  const last = readJson<LastRead | null>(LAST_KEY, null);
  if (!last) return null;
  const unit = getClass(last.subject, last.classLevel)?.units[last.unitIndex ?? 0];
  return unit?.name === last.unit ? last : null;
}

export const lastReadStore = createStore<LastRead | null>(loadLastRead(), (value) => writeJson(LAST_KEY, value));

/**
 * The subject and class last open anywhere in the book, even without reading a unit. It sets where a new
 * formula starts when nothing else says so.
 */
const PLACE_KEY = 'isc-place';
export interface Place {
  subject: SubjectId;
  level: ClassLevel;
}
export const lastPlaceStore = createStore<Place | null>(readJson<Place | null>(PLACE_KEY, null), (value) => writeJson(PLACE_KEY, value));

export function rememberPlace(subject: SubjectId, level: ClassLevel): void {
  lastPlaceStore.set((place) => (place?.subject === subject && place.level === level ? place : { subject, level }));
}

// Another tab moving through the book counts too. Without this, only a reload would notice.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === PLACE_KEY) lastPlaceStore.set(readJson<Place | null>(PLACE_KEY, null));
    if (e.key === LAST_KEY) lastReadStore.set(loadLastRead());
  });
}

/** The class last opened for each subject, so a thumb tab returns you there. */
const CLASS_KEY = 'isc-class';
export const classMemoryStore = createStore<Partial<Record<SubjectId, ClassLevel>>>(readJson(CLASS_KEY, {}), (value) => writeJson(CLASS_KEY, value));

export function rememberClass(subject: SubjectId, level: ClassLevel): void {
  classMemoryStore.set((memo) => (memo[subject] === level ? memo : { ...memo, [subject]: level }));
}
