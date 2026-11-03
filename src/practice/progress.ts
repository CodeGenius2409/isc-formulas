// Everything practice remembers: review schedule, mistakes and daily totals, stored
// locally, and able to move between devices as a JSON backup.
import { canonicalId, isRemovedId, migrateIds } from '../data/aliases';
import { createStore } from '../lib/store';
import { readJson, writeJson } from '../lib/storage';
import { favouritesStore, recentsStore } from '../state/library';
import { dayString, newItem, schedule, type Quality, type SrsItem } from './srs';
import type { Question } from './questions';

const SRS_KEY = 'isc-srs';
const MISTAKES_KEY = 'isc-mistakes';
const STATS_KEY = 'isc-stats';
const MISTAKE_LIMIT = 1500;
const PAPERS_KEY = 'isc-paper-history';

/** A saved mock paper result. The paper module owns its full shape. */
interface PaperResultLike {
  date: string;
}

/** The paper module loads with its view, so an import reaches it through this. */
export const papersImported = {
  notify(all: PaperResultLike[]): void {
    writeJson(PAPERS_KEY, all);
    for (const listener of papersImported.listeners) listener(all);
  },
  listeners: new Set<(all: PaperResultLike[]) => void>(),
};

export interface Mistake {
  id: string;
  date: string;
  formulaId: string;
  formulaName: string;
  subject: string;
  classLevel: string;
  topic: string;
  /** What was asked, in words. */
  asked: string;
  yourAnswer: string;
  yourAnswerIsLatex?: boolean;
  correctAnswer: string;
  correctAnswerIsLatex?: boolean;
  /** Lets "retry my mistakes" ask the same question again. */
  question: Question;
  resolved: boolean;
}

export interface Stats {
  answered: number;
  correct: number;
  /** Answers per day, for the streak line. */
  byDay: Record<string, number>;
}

/** A formula taken out of the book takes its review schedule and mistakes with it. */
function liveSchedule(saved: Record<string, SrsItem>): Record<string, SrsItem> {
  return Object.fromEntries(Object.entries(saved).filter(([id]) => !isRemovedId(id)));
}

export const srsStore = createStore<Record<string, SrsItem>>(liveSchedule(readJson(SRS_KEY, {})), (v) => writeJson(SRS_KEY, v));
export const mistakesStore = createStore<Mistake[]>(
  readJson<Mistake[]>(MISTAKES_KEY, []).filter((m) => !isRemovedId(m.formulaId)),
  (v) => writeJson(MISTAKES_KEY, v),
);
export const statsStore = createStore<Stats>(readJson(STATS_KEY, { answered: 0, correct: 0, byDay: {} }), (v) => writeJson(STATS_KEY, v));

export function today(): string {
  return dayString(new Date());
}

export interface AnswerRecord {
  question: Question;
  correct: boolean;
  quality: Quality;
  asked: string;
  yourAnswer: string;
  yourAnswerIsLatex?: boolean;
  correctAnswer: string;
  correctAnswerIsLatex?: boolean;
  formula: { name: string; subject: string; classLevel: string; topic: string };
  /** True in "retry my mistakes", so a right answer can clear the mistake. */
  mistakeId?: string;
}

export function recordAnswer(record: AnswerRecord): void {
  const day = today();
  const id = record.question.formulaId;
  srsStore.set((all) => ({ ...all, [id]: schedule(all[id] ?? newItem(id, day), record.quality, day) }));
  statsStore.set((s) => ({
    answered: s.answered + 1,
    correct: s.correct + (record.correct ? 1 : 0),
    byDay: { ...s.byDay, [day]: (s.byDay[day] ?? 0) + 1 },
  }));

  if (record.mistakeId && record.correct) {
    mistakesStore.set((list) => list.map((m) => (m.id === record.mistakeId ? { ...m, resolved: true } : m)));
  }
  if (!record.correct && !record.mistakeId) {
    const mistake: Mistake = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
      formulaId: id,
      formulaName: record.formula.name,
      subject: record.formula.subject,
      classLevel: record.formula.classLevel,
      topic: record.formula.topic,
      asked: record.asked,
      yourAnswer: record.yourAnswer,
      yourAnswerIsLatex: record.yourAnswerIsLatex,
      correctAnswer: record.correctAnswer,
      correctAnswerIsLatex: record.correctAnswerIsLatex,
      question: record.question,
      resolved: false,
    };
    mistakesStore.set((list) => [mistake, ...list].slice(0, MISTAKE_LIMIT));
  }
}

/** Removes the mistake log entry without touching the review schedule. */
export function deleteMistake(id: string): void {
  mistakesStore.set((list) => list.filter((m) => m.id !== id));
}

export interface Backup {
  app: 'isc-formula-book';
  version: 1;
  exportedAt: string;
  favourites: string[];
  recents: string[];
  srs: Record<string, SrsItem>;
  mistakes: Mistake[];
  stats: Stats;
  /** Mock paper results. Backups made before mock papers don't have this. */
  papers?: PaperResultLike[];
}

export function exportBackup(): Backup {
  return {
    app: 'isc-formula-book',
    version: 1,
    exportedAt: new Date().toISOString(),
    favourites: favouritesStore.get(),
    recents: recentsStore.get(),
    srs: srsStore.get(),
    mistakes: mistakesStore.get(),
    stats: statsStore.get(),
    papers: readJson<PaperResultLike[]>(PAPERS_KEY, []),
  };
}

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/** Checks a backup file, so that a wrong file can't damage anything. */
export function parseBackup(text: string): { ok: true; backup: Backup } | { ok: false; error: string } {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  if (!isObject(data) || data.app !== 'isc-formula-book') return { ok: false, error: 'That file is not a backup from this app.' };
  if (data.version !== 1) return { ok: false, error: `This backup is version ${String(data.version)}, which this app cannot read.` };
  if (!isObject(data.srs) || !Array.isArray(data.mistakes) || !Array.isArray(data.favourites)) {
    return { ok: false, error: 'That backup file is incomplete.' };
  }
  return { ok: true, backup: data as unknown as Backup };
}

/**
 * Merges a backup into current progress and never deletes anything. For each formula,
 * the more recently reviewed schedule wins. Old formula ids are migrated.
 */
export function importBackup(backup: Backup): { items: number; mistakes: number; favourites: number } {
  const beforeMistakes = mistakesStore.get().length;
  const beforeFavourites = favouritesStore.get().length;
  let items = 0;

  srsStore.set((current) => {
    const merged = { ...current };
    for (const [rawId, item] of Object.entries(backup.srs)) {
      if (isRemovedId(rawId)) continue;
      const id = canonicalId(rawId);
      const mine = merged[id];
      if (!mine || (item.lastReviewed ?? '') > (mine.lastReviewed ?? '')) {
        merged[id] = { ...item, id };
        items++;
      }
    }
    return merged;
  });

  mistakesStore.set((current) => {
    const seen = new Set(current.map((m) => m.id));
    const incoming = backup.mistakes.filter((m) => isObject(m) && !seen.has(m.id) && !isRemovedId(m.formulaId)).map((m) => ({ ...m, formulaId: canonicalId(m.formulaId) }));
    return [...current, ...incoming].sort((a, b) => b.date.localeCompare(a.date)).slice(0, MISTAKE_LIMIT);
  });

  favouritesStore.set((current) => migrateIds([...current, ...backup.favourites]));
  if (Array.isArray(backup.recents)) recentsStore.set((current) => migrateIds([...current, ...backup.recents]).slice(0, 24));

  if (isObject(backup.stats)) {
    statsStore.set((current) => {
      const byDay = { ...backup.stats.byDay };
      for (const [day, n] of Object.entries(current.byDay)) byDay[day] = Math.max(byDay[day] ?? 0, n);
      return { answered: Math.max(current.answered, backup.stats.answered ?? 0), correct: Math.max(current.correct, backup.stats.correct ?? 0), byDay };
    });
  }

  if (Array.isArray(backup.papers) && backup.papers.length) {
    const mine = readJson<PaperResultLike[]>(PAPERS_KEY, []);
    const seen = new Set(mine.map((p) => p.date));
    papersImported.notify([...mine, ...backup.papers.filter((p) => isObject(p) && !seen.has(p.date))].sort((a, b) => b.date.localeCompare(a.date)));
  }

  return { items, mistakes: mistakesStore.get().length - beforeMistakes, favourites: favouritesStore.get().length - beforeFavourites };
}
