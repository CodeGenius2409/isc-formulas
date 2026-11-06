// Which facts you've been shown, and when, kept on this device. Practice and mock papers read it to choose unseen facts
// first, and the least recently seen after that. A fact you got wrong comes back when its review schedule says so.
import { openDB, type IDBPDatabase } from 'idb';
import { createStore } from '../lib/store';
import { readJson, writeJson } from '../lib/storage';
import type { Freshness } from './gen/mix';

const DB_NAME = 'isc-fact-history';
const STORE = 'seen';
const GAP_KEY = 'isc-fact-gap-days';

export const DEFAULT_GAP_DAYS = 7;
const DAY = 86_400_000;

interface SeenFact {
  key: string;
  at: number;
  /** The review item that asked it, when it was last answered wrongly. */
  missed?: string;
}

/** The days before a fact can come back. Zero turns the rule off. */
export const factGapStore = createStore<number>(readJson<number>(GAP_KEY, DEFAULT_GAP_DAYS), (v) => writeJson(GAP_KEY, v));
export const seenFactsStore = createStore<Record<string, SeenFact>>({});

export const cleanGap = (days: number): number => (Number.isFinite(days) ? Math.max(0, Math.min(365, Math.round(days))) : DEFAULT_GAP_DAYS);

let database: Promise<IDBPDatabase | null> | null = null;

function open(): Promise<IDBPDatabase | null> {
  database ??= (async () => {
    try {
      return await openDB(DB_NAME, 1, {
        upgrade(db) {
          db.createObjectStore(STORE, { keyPath: 'key' });
        },
      });
    } catch {
      return null;
    }
  })();
  return database;
}

let loading: Promise<void> | null = null;

/** Reads the history on first need. Blocked storage just means it lasts until the page closes. */
export function ensureFactHistory(): Promise<void> {
  loading ??= (async () => {
    const db = await open();
    if (!db) return;
    try {
      const all = (await db.getAll(STORE)) as SeenFact[];
      // Anything noted while this was loading is newer, so it stays.
      seenFactsStore.set((now) => ({ ...Object.fromEntries(all.map((row) => [row.key, row])), ...now }));
    } catch {
      // The rows in memory still work.
    }
  })();
  return loading;
}

function save(rows: SeenFact[]): void {
  if (!rows.length) return;
  void open().then(async (db) => {
    if (!db) return;
    try {
      const tx = db.transaction(STORE, 'readwrite');
      await Promise.all([...rows.map((row) => tx.store.put(row)), tx.done]);
    } catch {
      // Storage is full or blocked. The rows in memory still work.
    }
  });
}

export function noteFactsShown(keys: string[], at = Date.now()): void {
  if (!keys.length) return;
  const all = { ...seenFactsStore.get() };
  const rows = keys.map((key) => (all[key] = { ...all[key], key, at }));
  seenFactsStore.set(all);
  save(rows);
}

/** Answered wrongly, a fact follows the review schedule of that question. Answered rightly, the gap applies again. */
export function noteFactsAnswered(keys: string[], itemId: string, correct: boolean): void {
  if (!keys.length) return;
  const all = { ...seenFactsStore.get() };
  const rows = keys.map((key) => {
    const row: SeenFact = { key, at: all[key]?.at ?? Date.now() };
    if (!correct) row.missed = itemId;
    all[key] = row;
    return row;
  });
  seenFactsStore.set(all);
  save(rows);
}

export async function resetFactHistory(): Promise<void> {
  seenFactsStore.set({});
  const db = await open();
  try {
    await db?.clear(STORE);
  } catch {
    // Nothing more can be done, and memory is already clear.
  }
}

/** The history as a question picker needs it. `isDue` says whether a review item's time has come. */
export function historyFreshness(isDue: (itemId: string) => boolean, now = Date.now(), gapDays = factGapStore.get()): Freshness {
  const seen = seenFactsStore.get();
  const gap = cleanGap(gapDays) * DAY;
  return {
    resting: (keys) =>
      keys.some((key) => {
        const row = seen[key];
        if (!row || now - row.at >= gap) return false;
        return !(row.missed && isDue(row.missed));
      }),
    lastSeen: (keys) => keys.reduce((latest, key) => Math.max(latest, seen[key]?.at ?? 0), 0),
  };
}
