// A practice session: a list of questions worked through in the working area.
import { canonicalId } from '../data/aliases';
import { findFormula, loadAllFormulas, loadUnits } from '../data/book';
import type { ClassLevel, Formula, SubjectId } from '../data/types';
import { createStore } from '../lib/store';
import { getEntry } from '../solver/registry';
import { mistakesStore, srsStore, today } from './progress';
import { conceptQuestion, numericQuestion, seededRng, type Question, type Rng } from './questions';
import { reviewOrder } from './srs';

export interface SessionItem {
  question: Question;
  mistakeId?: string;
}

export interface Session {
  title: string;
  items: SessionItem[];
  index: number;
  correct: number;
  answered: number;
}

export const sessionStore = createStore<Session | null>(null);

const SESSION_SIZE = 10;

function freshRng(): Rng {
  return seededRng(Math.floor(Math.random() * 2 ** 31));
}

/** Others in the same section first, widening to the unit, then the whole class. */
async function poolFor(formula: Formula): Promise<Formula[]> {
  const units = await loadUnits(formula.subject, formula.classLevel);
  const unit = units[formula.unitIndex];
  const sub = unit.subtopics[formula.subtopicIndex];
  const seen = new Set<string>();
  const add = (list: Formula[], into: Formula[]) => {
    for (const f of list) {
      if (!seen.has(f.id)) {
        seen.add(f.id);
        into.push(f);
      }
    }
    return into;
  };
  const pool: Formula[] = [];
  add(sub.formulas, pool);
  if (pool.length < 6) add(unit.subtopics.flatMap((s) => s.formulas), pool);
  if (pool.length < 6) add(units.flatMap((u) => u.subtopics.flatMap((s) => s.formulas)), pool);
  return pool;
}

/** Numeric if the formula can be computed and the dice say so, otherwise conceptual. */
export async function questionFor(formula: Formula, rng: Rng, preferNumeric = false): Promise<Question> {
  const entry = getEntry(formula.id);
  if (entry && (preferNumeric || rng() < 0.7)) {
    const numeric = numericQuestion(entry, rng);
    if (numeric) return numeric;
  }
  return conceptQuestion(formula, await poolFor(formula), rng);
}

function shuffled<T>(list: T[], rng: Rng): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function begin(title: string, items: SessionItem[]): Session | null {
  if (!items.length) {
    sessionStore.set(null);
    return null;
  }
  const session = { title, items, index: 0, correct: 0, answered: 0 };
  sessionStore.set(session);
  return session;
}

export async function startReview(limit = 20): Promise<Session | null> {
  const due = reviewOrder(Object.values(srsStore.get()), today()).slice(0, limit);
  const rng = freshRng();
  const formulas = (await Promise.all(due.map((d) => findFormula(d.id)))).filter((f): f is Formula => f !== null);
  const items = await Promise.all(formulas.map(async (f) => ({ question: await questionFor(f, rng) })));
  return begin("Today's review", items);
}

export async function startUnit(subject: SubjectId, level: ClassLevel, unitIndex: number, subtopicIndex?: number): Promise<Session | null> {
  const units = await loadUnits(subject, level);
  const unit = units[unitIndex];
  if (!unit) return null;
  const list = subtopicIndex != null ? (unit.subtopics[subtopicIndex]?.formulas ?? []) : unit.subtopics.flatMap((s) => s.formulas);
  const rng = freshRng();
  const chosen = shuffled(list, rng).slice(0, SESSION_SIZE);
  const items = await Promise.all(chosen.map(async (f) => ({ question: await questionFor(f, rng) })));
  return begin(subtopicIndex != null ? unit.subtopics[subtopicIndex].name : unit.name.replace(/^\d+\.\s*/, ''), items);
}

export async function startFormula(rawId: string): Promise<Session | null> {
  const formula = await findFormula(canonicalId(rawId));
  if (!formula) return null;
  const rng = freshRng();
  const items: SessionItem[] = [];
  const entry = getEntry(formula.id);
  if (entry) {
    for (let i = 0; i < 3; i++) {
      const numeric = numericQuestion(entry, rng);
      if (numeric) items.push({ question: numeric });
    }
  }
  const pool = await poolFor(formula);
  items.push({ question: conceptQuestion(formula, pool, rng) });
  return begin(formula.name, items);
}

export function startMistakes(filter?: (id: string) => boolean): Session | null {
  const rng = freshRng();
  const list = mistakesStore.get().filter((m) => !m.resolved && (!filter || filter(m.id)));
  const items = shuffled(list, rng)
    .slice(0, 20)
    .map((m) => ({ question: m.question, mistakeId: m.id }));
  return begin('Retry my mistakes', items);
}

/** Ten formulas nobody has reviewed yet, from anywhere in the book. */
export async function startNew(subject?: SubjectId): Promise<Session | null> {
  const all = await loadAllFormulas();
  const seen = srsStore.get();
  const fresh = all.filter((f) => !seen[f.id] && (!subject || f.subject === subject));
  const rng = freshRng();
  const chosen = shuffled(fresh, rng).slice(0, SESSION_SIZE);
  const items = await Promise.all(chosen.map(async (f) => ({ question: await questionFor(f, rng) })));
  return begin('New formulas', items);
}

export function nextQuestion(): void {
  sessionStore.set((s) => (s ? { ...s, index: s.index + 1 } : s));
}

export function noteResult(correct: boolean): void {
  sessionStore.set((s) => (s ? { ...s, answered: s.answered + 1, correct: s.correct + (correct ? 1 : 0) } : s));
}

export function endSession(): void {
  sessionStore.set(null);
}
