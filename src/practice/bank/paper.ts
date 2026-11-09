// "Build a mock paper": the same sections and marks as the real paper, drawn from the bank, timed, then
// marked and broken down by topic. In progress and past results are stored locally.
import { loadSyllabus } from '../../data/syllabus';
import type { ClassLevel, SubjectId } from '../../data/types';
import { createStore } from '../../lib/store';
import { readJson, writeJson } from '../../lib/storage';
import { noteMissedSteps, papersImported, recordAnswer, studentFreshness } from '../progress';
import { seededRng, type Rng } from '../questions';
import { loadBlueprints, type LoadedBlueprints } from '../../data/blueprints';
import { CBQ_SHARE, defKeys, generatedCount, historyKeys, mixedBankOrder, pickGenerated, planShare, type Freshness, type SlotCount } from '../gen/mix';
import { ensureFactHistory, factGapStore, noteFactsShown } from '../fact-history';
import { bankQuestion, loadBank, type LoadedBank } from './index';
import { answerSummary, isAttempted, isPassing, qualityOf, scoreOf, yourAnswerSummary } from './mark';
import type { BankAnswer, BankDef, BankItem, BankQuestion } from './types';

const CURRENT_KEY = 'isc-paper-current';
const HISTORY_KEY = 'isc-paper-history';
const HISTORY_LIMIT = 40;
export const PAPER_MINUTES = 180;

interface SlotSpec {
  marks: number;
  count: number;
}

export interface SectionSpec {
  name: string;
  note: string;
  slots: SlotSpec[];
  /** Only questions from these units. */
  units?: number[];
  /** Answer any this many. The best scores count, as a real examiner would mark them. */
  choose?: number;
}

export interface PaperSpec {
  total: number;
  sections: SectionSpec[];
}

const science = (b: number, c: number): SectionSpec[] => [
  { name: 'Section A', note: 'Fourteen one-mark parts: multiple choice, assertion and reason, and very short answers.', slots: [{ marks: 1, count: 14 }] },
  { name: 'Section B', note: `${b} questions of two marks each.`, slots: [{ marks: 2, count: b }] },
  { name: 'Section C', note: `${c} questions of three marks each.`, slots: [{ marks: 3, count: c }] },
  { name: 'Section D', note: 'Three questions of five marks each.', slots: [{ marks: 5, count: 3 }] },
];
const mathematics: SectionSpec[] = [
  { name: 'Section A', note: 'Twenty very short answer questions of one mark each.', slots: [{ marks: 1, count: 20 }] },
  { name: 'Section B', note: 'Seven short answer questions of two marks each.', slots: [{ marks: 2, count: 7 }] },
  { name: 'Section C', note: 'Seven questions of three marks each.', slots: [{ marks: 3, count: 7 }] },
  { name: 'Section D', note: 'Five long answer questions of five marks each.', slots: [{ marks: 5, count: 5 }] },
];
const computerScience = (a: number[], b: number[], c: number[]): SectionSpec[] => [
  { name: 'Part I', note: 'Compulsory. Ten one-mark parts, then five of two marks.', slots: [{ marks: 1, count: 10 }, { marks: 2, count: 5 }] },
  { name: 'Part II, Section A', note: 'Answer any two.', slots: [{ marks: 10, count: 3 }], units: a, choose: 2 },
  { name: 'Part II, Section B', note: 'Answer any two.', slots: [{ marks: 10, count: 3 }], units: b, choose: 2 },
  { name: 'Part II, Section C', note: 'Answer any two.', slots: [{ marks: 5, count: 3 }], units: c, choose: 2 },
];

/** The structure of each paper, from reports/paper-analysis.md. */
export function paperSpec(subject: SubjectId, level: ClassLevel): PaperSpec {
  switch (subject) {
    case 'physics':
      return { total: 70, sections: science(7, 9) };
    case 'chemistry':
      return { total: 70, sections: science(10, 7) };
    case 'mathematics':
      return { total: 80, sections: mathematics };
    case 'computerscience':
      return {
        total: 70,
        sections: level === 'XII' ? computerScience([1, 2], [3, 4, 5, 6], [7, 8, 9]) : computerScience([1, 2, 3], [4, 5, 6, 7, 8, 9, 10, 11], [12, 13]),
      };
  }
}

export interface PaperSection {
  name: string;
  note: string;
  choose?: number;
  questions: BankQuestion[];
}

export interface Paper {
  subject: SubjectId;
  level: ClassLevel;
  total: number;
  startedAt: number;
  endsAt: number;
  sections: PaperSection[];
  answers: Record<string, BankAnswer>;
  /** Set when time is up or the paper is handed in. Marking follows. */
  submittedAt?: number;
  /** True for a paper that ran out of time rather than being handed in. */
  timedOut?: boolean;
  /** With the subject, class and share, this rebuilds the same paper. */
  seed?: number;
  /** Whether figures are shown. Those a question can't do without stay either way. */
  diagrams?: boolean;
  /** The share of generated questions asked for, from 0 to 100. */
  generatedShare?: number;
  /** Set when this paper ran out of unseen facts. */
  repeatNote?: string;
  /** Generated questions only from reviewed blueprints. */
  reviewedOnly?: boolean;
  /** Set when there weren't enough reviewed blueprints, so some unreviewed ones filled the paper. */
  reviewNote?: string;
}

export interface TopicResult {
  /** Unit name and topic name. */
  topic: string;
  unit: string;
  got: number;
  outOf: number;
}

export interface PaperResult {
  date: string;
  subject: SubjectId;
  level: ClassLevel;
  got: number;
  total: number;
  minutes: number;
  sections: { name: string; got: number; outOf: number }[];
  topics: TopicResult[];
  seed?: number;
  generatedShare?: number;
  reviewedOnly?: boolean;
}

/** Off by default: unreviewed blueprints stay in use, with their note. */
export const paperReviewedOnlyStore = createStore<boolean>(readJson<boolean>('isc-paper-reviewed-only', false), (v) => writeJson('isc-paper-reviewed-only', v));

export const paperStore = createStore<Paper | null>(readJson<Paper | null>(CURRENT_KEY, null), (v) => writeJson(CURRENT_KEY, v));
export const paperHistoryStore = createStore<PaperResult[]>(readJson<PaperResult[]>(HISTORY_KEY, []), (v) => writeJson(HISTORY_KEY, v));

papersImported.listeners.add((all) => paperHistoryStore.set(all as PaperResult[]));

function shuffled<T>(list: readonly T[], rng: Rng): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Draws questions in proportion to the syllabus's marks for each unit, from a shuffled pool: the unit
 * furthest behind its share goes next. This keeps a paper's balance close to the real one.
 */
function draw(pool: BankDef[], count: number, weights: Map<number, number>, used: Set<string>, rng: Rng, shapes: Set<string> = new Set()): BankDef[] {
  // A big pool would otherwise swamp a paper with whatever there's most of, so it's put in the papers' proportions first.
  const left = mixedBankOrder(pool.filter((d) => !used.has(d.id)).map((def) => ({ def })), rng).map((x) => x.def);
  if (left.length < count) throw new Error(`The bank has too few ${pool[0]?.marks}-mark questions for this paper.`);
  const out: BankDef[] = [];
  const given = new Map<number, number>();
  const topicsTaken = new Set<string>();
  const factsTaken = new Set<string>();
  while (out.length < count && left.length) {
    const units = [...new Set(left.map((d) => d.unit))];
    let best = units[0];
    let bestGap = -Infinity;
    for (const unit of units) {
      const gap = (weights.get(unit) ?? 1) / ((given.get(unit) ?? 0) + 1);
      if (gap > bestGap) {
        bestGap = gap;
        best = unit;
      }
    }
    // A different topic in the unit if there is one, so a paper doesn't ask the same thing twice.
    const inUnit = left.filter((d) => d.unit === best);
    const open = inUnit.filter((d) => !d.shape || !shapes.has(`${d.shape}|${d.context ?? ''}`));
    const choices = open.length ? open : inUnit;
    const chosen = choices.find((d) => !topicsTaken.has(`${d.unit}${d.topic}`)) ?? choices[0];
    if (chosen.shape) shapes.add(`${chosen.shape}|${chosen.context ?? ''}`);
    left.splice(left.indexOf(chosen), 1);
    // Several questions can ask one fact, in different formats, and a paper only asks it once.
    if (chosen.facts?.length) {
      for (const x of chosen.facts) factsTaken.add(x);
      for (let i = left.length - 1; i >= 0; i--) if (left[i].facts?.some((x) => factsTaken.has(x))) left.splice(i, 1);
    }
    used.add(chosen.id);
    topicsTaken.add(`${chosen.unit}${chosen.topic}`);
    given.set(chosen.unit, (given.get(chosen.unit) ?? 0) + 1);
    out.push(chosen);
  }
  return out;
}

export async function unitWeightsForTest(subject: SubjectId, level: ClassLevel): Promise<Map<number, number>> {
  return unitWeights(subject, level);
}

async function unitWeights(subject: SubjectId, level: ClassLevel): Promise<Map<number, number>> {
  const syllabus = await loadSyllabus(subject);
  const groups = syllabus.classes.find((c) => c.level === level)?.markGroups ?? [];
  const weights = new Map<number, number>();
  for (const group of groups) for (const unit of group.units) weights.set(unit, group.marks / group.units.length);
  return weights;
}

/**
 * The share of each mark value that is a derivation or proof, from the board and specimen papers in the analysis.
 * Computer Science has none. See reports/derivations.md.
 */
export const DERIVATION_SHARE: Record<SubjectId, Record<number, number>> = {
  physics: { 2: 0.03, 3: 0.58, 5: 0.33 },
  chemistry: { 2: 0.04, 3: 0.04 },
  mathematics: { 2: 0.08, 3: 0.08, 4: 0.3, 5: 0.18, 6: 0.09 },
  computerscience: {},
};

const isDerivationType = (type: string) => type === 'derivation' || type === 'proof';

export interface GeneratedOption {
  set: LoadedBlueprints;
  share: number;
  /** What has been seen lately, so that unseen facts come first. */
  fresh?: Freshness;
  /** Only reviewed blueprints, unless there aren't enough of them. */
  reviewedOnly?: boolean;
}

/** The short note when a choice has run out of unseen facts. Nothing is said when it hasn't. */
export function repeatNoteFor(count: number, gapDays: number): string | undefined {
  if (!count) return undefined;
  const span = gapDays === 1 ? 'the last day' : `the last ${gapDays} days`;
  return `You’ve seen nearly everything here in ${span}, so ${count} ${count === 1 ? 'question comes' : 'questions come'} from what you saw longest ago.`;
}

/** The short note when "Only reviewed questions" couldn't be kept to. */
export function reviewNoteFor(count: number): string | undefined {
  if (!count) return undefined;
  return `There weren’t enough reviewed questions for every place, so ${count} ${count === 1 ? 'question comes' : 'questions come'} from patterns not yet reviewed, and ${count === 1 ? 'is' : 'are'} marked.`;
}

/** The slots of a paper, with what the bank can supply for each, so a share can be planned and explained. */
export function paperSlots(subject: SubjectId, level: ClassLevel, bank: LoadedBank): SlotCount[] {
  const spec = paperSpec(subject, level);
  const taken = new Map<number, number>();
  return spec.sections.flatMap((section) =>
    section.slots.map((slot) => {
      const have = bank.defs.filter((d) => d.marks === slot.marks && (!section.units || section.units.includes(d.unit))).length;
      // Sections that share a mark value also share the bank's questions for it.
      const before = section.units ? 0 : (taken.get(slot.marks) ?? 0);
      if (!section.units) taken.set(slot.marks, before + slot.count);
      return { marks: slot.marks, count: slot.count, bankHas: Math.max(0, have - before), worth: section.choose ? (slot.marks * section.choose) / slot.count : undefined };
    }),
  );
}

/** Builds a paper. Pure apart from reading the bank, so that a test can check its structure. */
export function assemblePaper(subject: SubjectId, level: ClassLevel, bank: LoadedBank, weights: Map<number, number>, rng: Rng, now: number, generated?: GeneratedOption): Paper {
  const spec = paperSpec(subject, level);
  const used = new Set<string>();
  const usedBlueprints = new Set<string>();
  const seenText = new Set<string>();
  const seenFacts = new Set<string>();
  const usedShapes = new Set<string>();
  const seenStructures = new Set<string>();
  const share = generated ? planShare(paperSlots(subject, level, bank), generated.share).share : 0;
  const fresh = generated?.fresh;
  let unreviewedFill = 0;
  const sections = spec.sections.map((section) => {
    const questions = section.slots.flatMap((slot) => {
      const inSection = (unit: number) => !section.units || section.units.includes(unit);
      const notAsked = (d: BankDef) => !(d.facts ?? []).some((f) => seenFacts.has(f));
      const bankFor = (wantDerivation: boolean | null) => bank.defs.filter((d) => d.marks === slot.marks && inSection(d.unit) && !used.has(d.id) && notAsked(d) && (wantDerivation === null || isDerivationType(d.type) === wantDerivation));
      const anyBlueprintFor = (wantDerivation: boolean | null) => (generated?.set.blueprints ?? []).filter((b) => b.marks === slot.marks && inSection(b.unit) && (wantDerivation === null || isDerivationType(b.type) === wantDerivation));
      const blueprintsFor = (wantDerivation: boolean | null) => anyBlueprintFor(wantDerivation).filter((b) => !generated?.reviewedOnly || b.reviewed === true);
      const pickMade = (pool: ReturnType<typeof blueprintsFor>, count: number, cbqShare = 0) => (generated && count > 0 ? pickGenerated(generated.set, pool, { count, weights, rng, used: usedBlueprints, seenText, seenFacts, seenStructures, cbqShare, fresh, freshOnly: true }) : []);
      const takeBank = (all: BankDef[], count: number) => {
        const pool = fresh ? all.filter((d) => !fresh.resting(defKeys(d))) : all;
        const defs = count > 0 && pool.length ? draw(pool, Math.min(count, pool.length), weights, used, rng, usedShapes) : [];
        for (const d of defs) for (const f of d.facts ?? []) seenFacts.add(f);
        return defs;
      };
      // When the unseen ones have run out, the ones seen longest ago come back, bank or generated, as the slider leans.
      const takeOldBank = (all: BankDef[], count: number) => {
        if (!fresh || count <= 0) return [];
        const defs = [...all].sort((a, b) => fresh.lastSeen(defKeys(a)) - fresh.lastSeen(defKeys(b))).slice(0, count);
        for (const d of defs) {
          used.add(d.id);
          for (const f of d.facts ?? []) seenFacts.add(f);
        }
        return defs;
      };
      const pickOld = (pool: ReturnType<typeof blueprintsFor>, count: number) => (generated && fresh && count > 0 ? pickGenerated(generated.set, pool, { count, weights, rng, used: usedBlueprints, seenText, seenFacts, fresh }) : []);
      // Derivations first, in the share the real papers give them, from the bank or generated as the slider says.
      const wantDerivations = Math.round(slot.count * (DERIVATION_SHARE[subject][slot.marks] ?? 0));
      const genDerivations = pickMade(blueprintsFor(true), generatedCount(wantDerivations, share));
      const bankDerivations = takeBank(bankFor(true), wantDerivations - genDerivations.length);
      const lateDerivations = pickMade(blueprintsFor(true), wantDerivations - genDerivations.length - bankDerivations.length);
      const oldBankDerivations = takeOldBank(bankFor(true), wantDerivations - genDerivations.length - bankDerivations.length - lateDerivations.length);
      const oldDerivations = pickOld(blueprintsFor(true), wantDerivations - genDerivations.length - bankDerivations.length - lateDerivations.length - oldBankDerivations.length);
      const derivationCount = genDerivations.length + bankDerivations.length + lateDerivations.length + oldBankDerivations.length + oldDerivations.length;
      // Then everything else.
      const others = slot.count - derivationCount;
      const made = pickMade(blueprintsFor(false), generatedCount(others, share), CBQ_SHARE);
      // Worked out after the generated ones, which may have used facts that bank questions also ask.
      const defs = takeBank(bankFor(false), others - made.length);
      // A paper is never handed out short: if one kind runs out, anything of the right marks fills the rest, whatever the slider says.
      let left = others - made.length - defs.length;
      const moreBank = takeBank(bankFor(null), left);
      left -= moreBank.length;
      // At 0% the bank's older questions come before anything generated.
      const oldFirst = share === 0 ? takeOldBank(bankFor(null), left) : [];
      left -= oldFirst.length;
      const fill = pickMade(blueprintsFor(null), left);
      left -= fill.length;
      const oldMade = pickOld(blueprintsFor(null), left);
      left -= oldMade.length;
      const oldLast = takeOldBank(bankFor(null), left);
      left -= oldLast.length;
      // Only when nothing reviewed is left does an unreviewed one fill a gap, and the paper says so.
      const unreviewed = generated?.reviewedOnly && left > 0 ? pickGenerated(generated.set, anyBlueprintFor(null), { count: left, weights, rng, used: usedBlueprints, seenText, seenFacts, fresh }) : [];
      left -= unreviewed.length;
      unreviewedFill += unreviewed.length;
      if (left > 0) throw new Error(`There are too few ${slot.marks}-mark questions for this paper.`);
      return shuffled([...[...bankDerivations, ...oldBankDerivations, ...defs, ...moreBank, ...oldFirst, ...oldLast].map((d) => bankQuestion(d, bank, rng)), ...genDerivations, ...lateDerivations, ...oldDerivations, ...made, ...fill, ...oldMade, ...unreviewed], rng);
    });
    return { name: section.name, note: section.note, choose: section.choose, questions };
  });
  return { subject, level, total: spec.total, startedAt: now, endsAt: now + PAPER_MINUTES * 60_000, sections, answers: {}, generatedShare: generated ? share : 0, ...(generated?.reviewedOnly ? { reviewedOnly: true, reviewNote: reviewNoteFor(unreviewedFill) } : {}) };
}

export async function startPaper(subject: SubjectId, level: ClassLevel, options: { share?: number; seed?: number; diagrams?: boolean; reviewedOnly?: boolean } = {}): Promise<Paper> {
  const share = options.share ?? 0;
  const [bank, weights, set] = await Promise.all([loadBank(subject, level), unitWeights(subject, level), loadBlueprints(subject, level), ensureFactHistory()]);
  const seed = options.seed ?? Math.floor(Math.random() * 2 ** 31);
  // A paper opened from a link has to come out the same, so history has no say in it.
  const fresh = options.seed === undefined ? studentFreshness() : undefined;
  const built = assemblePaper(subject, level, bank, weights, seededRng(seed), Date.now(), { set, share, fresh, reviewedOnly: options.reviewedOnly });
  const shown = built.sections.flatMap((s) => s.questions.map(historyKeys));
  const repeats = fresh ? shown.filter((keys) => fresh.resting(keys)).length : 0;
  const paper = { ...built, seed, diagrams: options.diagrams ?? true, repeatNote: repeatNoteFor(repeats, factGapStore.get()) };
  noteFactsShown(shown.flat());
  paperStore.set(paper);
  return paper;
}

export function answerPaper(id: string, change: Partial<BankAnswer>): void {
  paperStore.set((p) => (p ? { ...p, answers: { ...p.answers, [id]: { ...p.answers[id], ...change } } } : p));
}

export function submitPaper(timedOut = false): void {
  paperStore.set((p) => (p && !p.submittedAt ? { ...p, submittedAt: Date.now(), timedOut } : p));
}

export function abandonPaper(): void {
  paperStore.set(null);
}

/** The questions that count: all of them, or in an "any two" section, the best scoring. */
export function countedQuestions(section: PaperSection, answers: Record<string, BankAnswer>): BankItem[] {
  const items = section.questions.map((q) => q.item);
  if (!section.choose) return items;
  return [...items].sort((a, b) => scoreOf(b, answers[b.id]) - scoreOf(a, answers[a.id])).slice(0, section.choose);
}

export function paperResult(paper: Paper): PaperResult {
  const topics = new Map<string, TopicResult>();
  const sections = paper.sections.map((section) => {
    let got = 0;
    let outOf = 0;
    for (const item of countedQuestions(section, paper.answers)) {
      const score = scoreOf(item, paper.answers[item.id]);
      got += score;
      outOf += item.marks;
      const key = `${item.unit} ${item.topic}`;
      const row = topics.get(key) ?? { topic: item.topicName, unit: item.unitName, got: 0, outOf: 0 };
      row.got += score;
      row.outOf += item.marks;
      topics.set(key, row);
    }
    return { name: section.name, got, outOf };
  });
  return {
    date: new Date(paper.submittedAt ?? Date.now()).toISOString(),
    subject: paper.subject,
    level: paper.level,
    got: sections.reduce((sum, s) => sum + s.got, 0),
    total: sections.reduce((sum, s) => sum + s.outOf, 0),
    minutes: Math.max(1, Math.round(((paper.submittedAt ?? Date.now()) - paper.startedAt) / 60_000)),
    sections,
    topics: [...topics.values()].sort((a, b) => a.got / a.outOf - b.got / b.outOf || b.outOf - a.outOf),
    seed: paper.seed,
    generatedShare: paper.generatedShare,
    ...(paper.reviewedOnly ? { reviewedOnly: true } : {}),
  };
}

/** Once marked: everything feeds the review schedule and the mistakes list, then the paper is put away. */
export function finishMarking(): PaperResult | null {
  const paper = paperStore.get();
  if (!paper) return null;
  const result = paperResult(paper);
  for (const section of paper.sections) {
    const counted = new Set(countedQuestions(section, paper.answers).map((i) => i.id));
    for (const question of section.questions) {
      const { item } = question;
      const answer = paper.answers[item.id];
      // In an "any two" section, a question left alone isn't a mistake. Choosing not to answer is allowed.
      if (section.choose && (!counted.has(item.id) || !isAttempted(item, answer))) continue;
      const score = scoreOf(item, answer);
      if (item.form === 'theory') noteMissedSteps(item.stepBlueprint, item.points, answer?.ticks);
      recordAnswer({
        question,
        correct: isPassing(item, score),
        quality: qualityOf(item, score),
        asked: item.text,
        yourAnswer: yourAnswerSummary(item, answer),
        correctAnswer: answerSummary(item),
        formula: { name: `${item.marks} ${item.marks === 1 ? 'mark' : 'marks'}: ${item.topicName}`, subject: item.subject, classLevel: item.level, topic: `${item.unitName}, ${item.topicName}` },
      });
    }
  }
  paperHistoryStore.set((list) => [result, ...list].slice(0, HISTORY_LIMIT));
  paperStore.set(null);
  return result;
}
