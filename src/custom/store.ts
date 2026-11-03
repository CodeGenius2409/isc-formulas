// Your own formulas, kept in this browser's IndexedDB. The list is also held in memory so the book can read
// it straight away. If storage is blocked, as in some private windows, they last only until the page closes,
// and the app says so.
import { openDB, type IDBPDatabase } from 'idb';
import { createStore } from '../lib/store';
import type { ClassLevel, SubjectId } from '../data/types';

export interface CustomVariable {
  symbol: string;
  meaning: string;
  unit: string;
}

export interface CustomFormula {
  /** "u-" and a UUID, which can never clash with a built-in id or an alias. */
  id: string;
  name: string;
  latex: string;
  note?: string;
  variables?: CustomVariable[];
  /** In solver form, such as F = m*a. With variables defined, this makes the formula solvable. */
  equation?: string;
  /** A compound, or a reaction written reactants>>products. */
  smiles?: string;
  /** A structure with lone pairs, by id in src/data/lewis/figures.ts. */
  lewis?: string[];
  subject: SubjectId;
  level: ClassLevel;
  /** The chapter's number in the syllabus. */
  unit: string;
  /** A section's name. If it is not one of the chapter's own, it is a section of yours. */
  subtopic: string;
  createdAt: number;
  updatedAt: number;
}

export interface CustomState {
  status: 'loading' | 'ready' | 'unavailable';
  formulas: CustomFormula[];
}

const DB_NAME = 'isc-custom';
const STORE = 'formulas';
const BACKED_UP_KEY = 'isc-custom-backed-up';
const INCLUDE_KEY = 'isc-custom-practice';

export const customStore = createStore<CustomState>({ status: 'loading', formulas: [] });

let database: Promise<IDBPDatabase | null> | null = null;

function open(): Promise<IDBPDatabase | null> {
  database ??= (async () => {
    try {
      return await openDB(DB_NAME, 1, {
        upgrade(db) {
          db.createObjectStore(STORE, { keyPath: 'id' });
        },
      });
    } catch {
      return null;
    }
  })();
  return database;
}

let loading: Promise<void> | null = null;

/** Reads the formulas on first need. Never fails: blocked storage is a state, not an error. */
export function ensureCustomLoaded(): Promise<void> {
  loading ??= (async () => {
    const db = await open();
    if (!db) {
      customStore.set((s) => ({ ...s, status: 'unavailable' }));
      return;
    }
    try {
      const formulas = (await db.getAll(STORE)) as CustomFormula[];
      customStore.set({ status: 'ready', formulas: formulas.sort((a, b) => a.createdAt - b.createdAt) });
    } catch {
      customStore.set((s) => ({ ...s, status: 'unavailable' }));
    }
  })();
  return loading;
}

export function newCustomId(): string {
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `u-${uuid}`;
}

export const isCustomId = (id: string): boolean => id.startsWith('u-');

/** Asks the browser to keep this site's storage. It can decline, which is why export exists. */
function askToKeep(): void {
  try {
    void navigator.storage?.persist?.();
  } catch {
    // Not every browser offers this.
  }
}

async function write(formula: CustomFormula): Promise<void> {
  const db = await open();
  if (!db) return;
  try {
    await db.put(STORE, formula);
  } catch {
    customStore.set((s) => ({ ...s, status: 'unavailable' }));
  }
}

export async function saveCustom(formula: CustomFormula): Promise<void> {
  await ensureCustomLoaded();
  customStore.set((s) => {
    const others = s.formulas.filter((f) => f.id !== formula.id);
    return { ...s, formulas: [...others, formula].sort((a, b) => a.createdAt - b.createdAt) };
  });
  await write(formula);
  askToKeep();
}

export async function eraseCustom(id: string): Promise<void> {
  customStore.set((s) => ({ ...s, formulas: s.formulas.filter((f) => f.id !== id) }));
  const db = await open();
  try {
    await db?.delete(STORE, id);
  } catch {
    customStore.set((s) => ({ ...s, status: 'unavailable' }));
  }
}

export const findCustom = (id: string): CustomFormula | undefined => customStore.get().formulas.find((f) => f.id === id);

// Backup files

export interface CustomBackup {
  app: 'isc-formula-book';
  kind: 'custom-formulas';
  version: 1;
  exportedAt: string;
  formulas: CustomFormula[];
}

export function exportCustom(): CustomBackup {
  return { app: 'isc-formula-book', kind: 'custom-formulas', version: 1, exportedAt: new Date().toISOString(), formulas: customStore.get().formulas };
}

const SUBJECTS = ['physics', 'chemistry', 'mathematics', 'computerscience'];
const LIMITS = { name: 200, latex: 4000, note: 2000, smiles: 1000, subtopic: 120, variables: 30 };
const isText = (x: unknown, max: number): x is string => typeof x === 'string' && x.length <= max;
const optional = (x: unknown, max: number) => x === undefined || isText(x, max);

/** Why a record can't be imported, or null if it can. A bad file must not be able to harm anything. */
export function problemWith(x: unknown): string | null {
  if (typeof x !== 'object' || x === null) return 'not a formula';
  const f = x as Record<string, unknown>;
  if (!isText(f.id, 200) || !/^u-[\w-]+$/.test(f.id)) return 'its id is not one of yours';
  if (!isText(f.name, LIMITS.name) || !f.name.trim()) return 'it has no name';
  if (!isText(f.latex, LIMITS.latex) || !f.latex.trim()) return 'it has no formula';
  if (!SUBJECTS.includes(f.subject as string)) return 'its subject is not known';
  if (f.level !== 'XI' && f.level !== 'XII') return 'its class is not known';
  if (!isText(f.unit, 10) || !isText(f.subtopic, LIMITS.subtopic) || !f.subtopic.trim()) return 'its place in the book is missing';
  if (!optional(f.note, LIMITS.note) || !optional(f.smiles, LIMITS.smiles) || !optional(f.equation, LIMITS.latex)) return 'a field is too long';
  if (f.variables !== undefined) {
    if (!Array.isArray(f.variables) || f.variables.length > LIMITS.variables) return 'its variables are not readable';
    for (const v of f.variables as Record<string, unknown>[]) {
      if (!isText(v?.symbol, 40) || !isText(v?.meaning, 200) || !isText(v?.unit, 40)) return 'its variables are not readable';
    }
  }
  if (f.lewis !== undefined && !(Array.isArray(f.lewis) && f.lewis.every((id) => isText(id, 60)))) return 'its structure is not readable';
  if (typeof f.createdAt !== 'number' || typeof f.updatedAt !== 'number') return 'its dates are missing';
  return null;
}

export type ParsedCustomBackup = { ok: true; formulas: CustomFormula[]; skipped: number } | { ok: false; error: string };

export function parseCustomBackup(text: string): ParsedCustomBackup {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  const file = data as Partial<CustomBackup> | null;
  if (typeof file !== 'object' || file === null || file.app !== 'isc-formula-book' || file.kind !== 'custom-formulas') return { ok: false, error: 'That file is not a formulas file from this app.' };
  if (file.version !== 1) return { ok: false, error: `This file is version ${String(file.version)}, which this app cannot read.` };
  if (!Array.isArray(file.formulas)) return { ok: false, error: 'That file has no formulas in it.' };
  const formulas = file.formulas.filter((f) => problemWith(f) === null);
  return { ok: true, formulas, skipped: file.formulas.length - formulas.length };
}

export interface ImportPlan {
  add: CustomFormula[];
  replace: CustomFormula[];
  duplicates: number;
}

/**
 * Works out what an import should do. The same id keeps whichever was edited last. The same name and
 * formula under a different id counts as a copy, so importing a file twice changes nothing.
 */
export function planImport(incoming: CustomFormula[], current: CustomFormula[]): ImportPlan {
  const plan: ImportPlan = { add: [], replace: [], duplicates: 0 };
  const byId = new Map(current.map((f) => [f.id, f]));
  const sameContent = new Set(current.map((f) => `${f.name}\n${f.latex}`));
  for (const f of incoming) {
    const mine = byId.get(f.id);
    if (mine) {
      if (f.updatedAt > mine.updatedAt) plan.replace.push(f);
      else plan.duplicates++;
    } else if (sameContent.has(`${f.name}\n${f.latex}`)) {
      plan.duplicates++;
    } else {
      plan.add.push(f);
      byId.set(f.id, f);
      sameContent.add(`${f.name}\n${f.latex}`);
    }
  }
  return plan;
}

export async function importCustom(incoming: CustomFormula[]): Promise<ImportPlan> {
  await ensureCustomLoaded();
  const plan = planImport(incoming, customStore.get().formulas);
  for (const f of [...plan.add, ...plan.replace]) await saveCustom(f);
  return plan;
}

// The gentle reminder to back up, and the practice option

function readNumber(key: string): number {
  try {
    return Number(localStorage.getItem(key) ?? 0) || 0;
  } catch {
    return 0;
  }
}

export const customBackupStore = createStore<number>(readNumber(BACKED_UP_KEY), (count) => {
  try {
    localStorage.setItem(BACKED_UP_KEY, String(count));
  } catch {
    // The reminder may just come back sooner.
  }
});

/** How many are new since the last export, once that is enough to be worth a reminder. */
export function unsavedCount(formulas: number, backedUp: number): number {
  const unsaved = formulas - backedUp;
  return unsaved >= 3 ? unsaved : 0;
}

/** Off by default: generated practice leaves your formulas out unless you ask for them, as recall cards. */
export const customInPracticeStore = createStore<boolean>(readNumber(INCLUDE_KEY) === 1, (on) => {
  try {
    localStorage.setItem(INCLUDE_KEY, on ? '1' : '0');
  } catch {
    // It just won't be remembered.
  }
});
