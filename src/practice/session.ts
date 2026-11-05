// A practice session: a list of questions worked through in the working area.
import { canonicalId } from '../data/aliases';
import { findFormula, loadAllFormulas, loadUnits } from '../data/book';
import type { ClassLevel, Formula, SubjectId } from '../data/types';
import { createStore } from '../lib/store';
import { getEntry } from '../solver/registry';
import { mistakesStore, srsStore, studentFreshness, today } from './progress';
import { ensureFactHistory, factGapStore } from './fact-history';
import { repeatNoteFor } from './bank/paper';
import { customInPracticeStore } from '../custom/store';
import { loadStructures } from '../data/structures';
import { generatedQuestionForId, loadBlueprints } from '../data/blueprints';
import { bankQuestion, loadBank, questionForId } from './bank';
import { isBankId } from './bank/define';
import type { BankDef } from './bank/types';
import { defKeys, generatedCount, historyKeys, pickGenerated, questionKey, practiceShareStore } from './gen/mix';
import { isGeneratedId } from './gen/engine';
import { conceptQuestion, numericQuestion, seededRng, type Question, type Rng, structureQuestion } from './questions';
import { reviewOrder } from './srs';

/** How often a Chemistry entry with a structure is asked by reading the structure. */
const STRUCTURE_SHARE = 0.6;

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
  /** Set when this choice ran out of unseen facts. */
  note?: string;
}

export const sessionStore = createStore<Session | null>(null);

const SESSION_SIZE = 10;
/** Of a unit's session, how many come from the exam-style bank when it has enough. */
const EXAM_SHARE = 8;

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
  add(sub.formulas.filter((f) => !f.custom), pool);
  if (pool.length < 6) add(unit.subtopics.flatMap((s) => s.formulas), pool);
  if (pool.length < 6) add(units.flatMap((u) => u.subtopics.flatMap((s) => s.formulas)), pool);
  return pool;
}

/** Numeric if the formula can be computed and the dice say so, otherwise conceptual. */
export async function questionFor(formula: Formula, rng: Rng, preferNumeric = false): Promise<Question> {
  // Generated questions need facts about a formula that yours may not have, so it comes up as a recall card.
  if (formula.custom) return { kind: 'recall', formulaId: formula.id, name: formula.name, note: formula.note, latex: formula.latex };
  if (formula.structure && rng() < STRUCTURE_SHARE) {
    const question = structureQuestion(formula, await loadStructures(), rng);
    if (question) return question;
  }
  const entry = getEntry(formula.id);
  if (entry && (preferNumeric || rng() < 0.7)) {
    const numeric = numericQuestion(entry, rng);
    if (numeric) return numeric;
  }
  return conceptQuestion(formula, await poolFor(formula), rng);
}

/** Your formulas stay out of generated practice unless you've asked for them. */
const forPractice = (list: Formula[]) => (customInPracticeStore.get() ? list : list.filter((f) => !f.custom));

function shuffled<T>(list: T[], rng: Rng): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function begin(title: string, items: SessionItem[], note?: string): Session | null {
  if (!items.length) {
    sessionStore.set(null);
    return null;
  }
  const session = { title, items, index: 0, correct: 0, answered: 0, note };
  sessionStore.set(session);
  return session;
}

export async function startReview(limit = 20): Promise<Session | null> {
  const due = reviewOrder(Object.values(srsStore.get()), today()).slice(0, limit);
  const rng = freshRng();
  const asked = await Promise.all(
    due.map(async (d) => {
      if (isBankId(d.id)) return questionForId(d.id, rng);
      if (isGeneratedId(d.id)) return generatedQuestionForId(d.id);
      const formula = await findFormula(d.id);
      return formula ? questionFor(formula, rng) : null;
    }),
  );
  // A question reworded or taken out of the bank has a new id, so its old schedule is finished with.
  const gone = due.filter((d, i) => !asked[i] && (isBankId(d.id) || isGeneratedId(d.id))).map((d) => d.id);
  if (gone.length) srsStore.set((all) => Object.fromEntries(Object.entries(all).filter(([id]) => !gone.includes(id))));
  return begin("Today's review", asked.flatMap((question) => (question ? [{ question }] : [])));
}

export interface UnitOptions {
  /** A topic key from the syllabus map, to practise just that. */
  topic?: string;
  difficulty?: 1 | 2 | 3;
  /** The share of generated questions. It rises when the bank has no unseen questions left. */
  share?: number;
}

export async function startUnit(subject: SubjectId, level: ClassLevel, unitIndex: number, subtopicIndex?: number, options: UnitOptions = {}): Promise<Session | null> {
  const units = await loadUnits(subject, level);
  const unit = units[unitIndex];
  if (!unit) return null;
  const list = forPractice(subtopicIndex != null ? (unit.subtopics[subtopicIndex]?.formulas ?? []) : unit.subtopics.flatMap((s) => s.formulas));
  const rng = freshRng();
  // A whole unit is exam-style questions first. A section has no questions of its own, so it stays with formulas.
  const exam: SessionItem[] = [];
  let note: string | undefined;
  await ensureFactHistory();
  if (subtopicIndex == null) {
    const [bank, set] = await Promise.all([loadBank(subject, level), loadBlueprints(subject, level)]);
    const seen = srsStore.get();
    const fresh = studentFreshness();
    const seenFacts = new Set<string>();
    const seenText = new Set<string>();
    const used = new Set<string>();
    /** In order, skipping any that asks a fact this session has already asked. */
    const takeDefs = (list: BankDef[], count: number): BankDef[] => {
      const out: BankDef[] = [];
      for (const d of list) {
        if (out.length >= count) break;
        if ((d.facts ?? []).some((f) => seenFacts.has(f))) continue;
        for (const f of d.facts ?? []) seenFacts.add(f);
        out.push(d);
      }
      return out;
    };
    const number = Number(unit.number);
    const fits = (d: { unit: number; topic: string; difficulty: number }) => d.unit === number && (!options.topic || d.topic === options.topic) && (!options.difficulty || d.difficulty === options.difficulty);
    const here = bank.defs.filter(fits);
    const unseen = shuffled(here.filter((d) => !seen[d.id] && !fresh.resting(defKeys(d))), rng);
    const pool = set.blueprints.filter(fits);
    const share = options.share ?? practiceShareStore.get();
    // More are generated when the bank has run out of unseen questions for this choice.
    const wanted = pool.length ? Math.max(generatedCount(EXAM_SHARE, share), share > 0 ? EXAM_SHARE - unseen.length : 0) : 0;
    const made = pickGenerated(set, pool, { count: Math.min(EXAM_SHARE, wanted), rng, used, seenText, seenFacts, fresh, freshOnly: true });
    // What's left: never seen, then answered before but rested, and then whatever was seen longest ago.
    const rested = shuffled(here.filter((d) => seen[d.id] && !fresh.resting(defKeys(d))), rng);
    const fromRested = takeDefs([...unseen, ...rested], EXAM_SHARE - made.length);
    const old = share > 0 && pool.length ? pickGenerated(set, pool, { count: EXAM_SHARE - made.length - fromRested.length, rng, used, seenText, seenFacts, fresh }) : [];
    const tired = shuffled(here.filter((d) => fresh.resting(defKeys(d))), rng).sort((a, b) => fresh.lastSeen(defKeys(a)) - fresh.lastSeen(defKeys(b)));
    const fromTired = takeDefs(tired, EXAM_SHARE - made.length - fromRested.length - old.length);
    made.push(...old);
    const fromBank = [...fromRested, ...fromTired].map((d) => ({ question: bankQuestion(d, bank, rng) }));
    // A narrow choice may not have enough, so the rest come from the same unit, generated if the slider allows, and then from the bank.
    const short = EXAM_SHARE - made.length - fromBank.length;
    for (const q of made) seenText.add(questionKey(q));
    const wider = short > 0 && share > 0 ? pickGenerated(set, set.blueprints.filter((b) => b.unit === number), { count: short, rng, used, seenText, seenFacts, fresh }) : [];
    const widerDefs = takeDefs(shuffled(bank.defs.filter((d) => d.unit === number && !fits(d)), rng).sort((a, b) => fresh.lastSeen(defKeys(a)) - fresh.lastSeen(defKeys(b))), short - wider.length);
    const widerBank = widerDefs.map((d) => ({ question: bankQuestion(d, bank, rng) }));
    exam.push(...shuffled([...fromBank, ...widerBank, ...[...made, ...wider].map((question) => ({ question }))], rng));
    const repeats = exam.filter((i) => fresh.resting(historyKeys(i.question))).length;
    note = repeatNoteFor(repeats, factGapStore.get());
  }
  // A section with few formulas borrows from the rest of its unit, so a session is always full.
  const wanted = SESSION_SIZE - exam.length;
  const others = forPractice(unit.subtopics.flatMap((s) => s.formulas)).filter((f) => !list.includes(f));
  // Formulas are put in the same order: not seen lately first, then the one seen longest ago.
  const history = studentFreshness();
  const byAge = (fs: Formula[]) => shuffled(fs, rng).sort((a, b) => history.lastSeen([`formula:${a.id}`]) - history.lastSeen([`formula:${b.id}`]));
  const chosen = [...byAge(list), ...byAge(others)].slice(0, wanted);
  const items = await Promise.all(chosen.map(async (f) => ({ question: await questionFor(f, rng) })));
  return begin(subtopicIndex != null ? unit.subtopics[subtopicIndex].name : unit.name.replace(/^\d+\.\s*/, ''), [...exam, ...items], note);
}

export async function startFormula(rawId: string): Promise<Session | null> {
  const formula = await findFormula(canonicalId(rawId));
  if (!formula) return null;
  const rng = freshRng();
  const items: SessionItem[] = [];
  if (formula.custom) return begin(formula.name, [{ question: await questionFor(formula, rng) }]);
  const entry = getEntry(formula.id);
  if (entry) {
    for (let i = 0; i < 3; i++) {
      const numeric = numericQuestion(entry, rng);
      if (numeric) items.push({ question: numeric });
    }
  }
  const pool = await poolFor(formula);
  if (formula.structure) {
    const question = structureQuestion(formula, await loadStructures(), rng);
    if (question) items.push({ question });
  }
  items.push({ question: conceptQuestion(formula, pool, rng) });
  return begin(formula.name, items);
}

/** Opens one generated question from its id, as a link does. */
export async function startGenerated(id: string): Promise<Session | null> {
  const question = await generatedQuestionForId(id);
  return question ? begin('Generated question', [{ question }]) : null;
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
  const fresh = forPractice(all).filter((f) => !seen[f.id] && (!subject || f.subject === subject));
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
