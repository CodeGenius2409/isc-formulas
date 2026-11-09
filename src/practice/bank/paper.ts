// "Build a mock paper": the same sections and marks as the real paper, drawn from the bank, timed, then
// marked and broken down by topic. In progress and past results are stored locally.
import { loadSyllabus } from '../../data/syllabus';
import type { ClassLevel, SubjectId } from '../../data/types';
import { createStore } from '../../lib/store';
import { readJson, writeJson } from '../../lib/storage';
import { noteMissedSteps, papersImported, recordAnswer, studentFreshness } from '../progress';
import { seededRng, type Rng } from '../questions';
import { loadBlueprints, type LoadedBlueprints } from '../../data/blueprints';
import { distinctCount, historyKeys, planShare, type Freshness, type SlotCount } from '../gen/mix';
import { ensureFactHistory, factGapStore, noteFactsShown } from '../fact-history';
import { isCompiled } from './define';
import { classTargets, composeSlot, createComposer, sectionTarget } from './compose';
import { loadBank, type LoadedBank } from './index';
import { answerSummary, isAttempted, isPassing, qualityOf, scoreOf, yourAnswerSummary } from './mark';
import type { BankAnswer, BankItem, BankQuestion, QuestionFormat } from './types';

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
  /** How many of its questions have an "OR" alternative, as the real paper gives. */
  or?: number;
}

export interface PaperSpec {
  total: number;
  sections: SectionSpec[];
}

const orNote = (or: number) => (or === 1 ? ' One has an internal choice.' : ` ${or === 2 ? 'Two' : 'Three'} have an internal choice.`);
const science = (b: number, c: number): SectionSpec[] => [
  { name: 'Section A', note: 'Fourteen one-mark parts: multiple choice, assertion and reason, and very short answers.', slots: [{ marks: 1, count: 14 }] },
  { name: 'Section B', note: `${b} questions of two marks each.${orNote(2)}`, slots: [{ marks: 2, count: b }], or: 2 },
  { name: 'Section C', note: `${c} questions of three marks each.${orNote(2)}`, slots: [{ marks: 3, count: c }], or: 2 },
  { name: 'Section D', note: `Three questions of five marks each.${orNote(2)}`, slots: [{ marks: 5, count: 3 }], or: 2 },
];
const mathematics: SectionSpec[] = [
  { name: 'Section A', note: 'Twenty very short answer questions of one mark each.', slots: [{ marks: 1, count: 20 }] },
  { name: 'Section B', note: `Seven short answer questions of two marks each.${orNote(3)}`, slots: [{ marks: 2, count: 7 }], or: 3 },
  { name: 'Section C', note: `Seven questions of three marks each.${orNote(3)}`, slots: [{ marks: 3, count: 7 }], or: 3 },
  { name: 'Section D', note: `Five long answer questions of five marks each.${orNote(3)}`, slots: [{ marks: 5, count: 5 }], or: 3 },
];
const computerScience = (a: number[], b: number[], c: number[]): SectionSpec[] => [
  { name: 'Part I', note: 'Compulsory. Ten one-mark parts, then five of two marks.', slots: [{ marks: 1, count: 10 }, { marks: 2, count: 5 }] },
  { name: 'Part II, Section A', note: `Answer any two.${orNote(1)}`, slots: [{ marks: 10, count: 3 }], units: a, choose: 2, or: 1 },
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
  /** The "OR" alternatives, by the id of the question each stands beside. */
  alternatives?: Record<string, BankQuestion>;
}

export interface Paper {
  subject: SubjectId;
  level: ClassLevel;
  total: number;
  startedAt: number;
  endsAt: number;
  sections: PaperSection[];
  answers: Record<string, BankAnswer>;
  /** Where the alternative was answered instead, by the id of the question it stands beside. */
  orChosen?: Record<string, true>;
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

/** Section A of these subjects keeps each kind together: Chemistry its fill-ins, choices and assertions, Mathematics its choices and then its short answers. */
const GROUPED: Partial<Record<SubjectId, QuestionFormat[]>> = {
  chemistry: ['complete', 'mcq', 'assertion', 'numerical', 'reason', 'very-short'],
  mathematics: ['mcq', 'assertion', 'very-short'],
};

export async function unitWeights(subject: SubjectId, level: ClassLevel): Promise<Map<number, number>> {
  const syllabus = await loadSyllabus(subject);
  const groups = syllabus.classes.find((c) => c.level === level)?.markGroups ?? [];
  const weights = new Map<number, number>();
  for (const group of groups) for (const unit of group.units) weights.set(unit, group.marks / group.units.length);
  return weights;
}

function derivationShare(subject: SubjectId): Record<number, number> {
  return Object.fromEntries(classTargets(subject, 'XII').flatMap((t) => (t.mix.derivation ? [[t.marks, t.mix.derivation]] : [])));
}

/** The share of each mark value that is a derivation or proof, in the recent papers. Computer Science has none. See reports/derivations.md. */
export const DERIVATION_SHARE: Record<SubjectId, Record<number, number>> = {
  physics: derivationShare('physics'),
  chemistry: derivationShare('chemistry'),
  mathematics: derivationShare('mathematics'),
  computerscience: {},
};

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
      const have = distinctCount(bank.defs.filter((d) => !isCompiled(d) && d.marks === slot.marks && (!section.units || section.units.includes(d.unit))));
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
  const share = generated ? planShare(paperSlots(subject, level, bank), generated.share).share : 0;
  const composer = createComposer({ subject, level, set: generated?.set, weights, share, rng, fresh: generated?.fresh, reviewedOnly: generated?.reviewedOnly });
  const sections = spec.sections.map((section) => {
    const alternatives: Record<string, BankQuestion> = {};
    let orLeft = section.or ?? 0;
    const questions = section.slots.flatMap((slot) => {
      const inSection = (unit: number) => !section.units || section.units.includes(unit);
      const target = sectionTarget(subject, level, section.name, slot.marks);
      const result = composeSlot(composer, {
        defs: bank.defs.filter((d) => inSection(d.unit)),
        blueprints: (generated?.set.blueprints ?? []).filter((b) => inSection(b.unit)),
        bank,
        marks: slot.marks,
        count: slot.count,
        mix: target?.mix,
        figure: target?.figure,
        cbq: target?.cbq,
        or: orLeft,
        grouped: slot.marks === 1 ? GROUPED[subject] : undefined,
      });
      if (result.short > 0) throw new Error(share > 0 ? `There are too few ${slot.marks}-mark questions for this paper.` : `There aren’t enough hand-written and fact-based ${slot.marks}-mark questions for this paper. Raise the slider to use generated questions.`);
      Object.assign(alternatives, result.alternatives);
      orLeft -= Object.keys(result.alternatives).length;
      return result.questions;
    });
    return { name: section.name, note: section.note, choose: section.choose, questions, ...(Object.keys(alternatives).length ? { alternatives } : {}) };
  });
  return { subject, level, total: spec.total, startedAt: now, endsAt: now + PAPER_MINUTES * 60_000, sections, answers: {}, generatedShare: generated ? share : 0, ...(generated?.reviewedOnly ? { reviewedOnly: true, reviewNote: reviewNoteFor(composer.unreviewedFill) } : {}) };
}

export async function startPaper(subject: SubjectId, level: ClassLevel, options: { share?: number; seed?: number; diagrams?: boolean; reviewedOnly?: boolean } = {}): Promise<Paper> {
  const share = options.share ?? 0;
  const [bank, weights, set] = await Promise.all([loadBank(subject, level), unitWeights(subject, level), loadBlueprints(subject, level), ensureFactHistory()]);
  const seed = options.seed ?? Math.floor(Math.random() * 2 ** 31);
  // A paper opened from a link has to come out the same, so history has no say in it.
  const fresh = options.seed === undefined ? studentFreshness() : undefined;
  const built = assemblePaper(subject, level, bank, weights, seededRng(seed), Date.now(), { set, share, fresh, reviewedOnly: options.reviewedOnly });
  const shown = built.sections.flatMap((s) => [...s.questions, ...Object.values(s.alternatives ?? {})].map(historyKeys));
  const repeats = fresh ? shown.filter((keys) => fresh.resting(keys)).length : 0;
  const paper = { ...built, seed, diagrams: options.diagrams ?? true, repeatNote: repeatNoteFor(repeats, factGapStore.get()) };
  noteFactsShown(shown.flat());
  paperStore.set(paper);
  return paper;
}

/** The same, under the name the tests know it by. */
export const unitWeightsForTest = unitWeights;

export function answerPaper(id: string, change: Partial<BankAnswer>): void {
  paperStore.set((p) => (p ? { ...p, answers: { ...p.answers, [id]: { ...p.answers[id], ...change } } } : p));
}

/** Answers the "OR" alternative instead of the question it stands beside, or goes back. */
export function chooseAlternative(id: string, chosen: boolean): void {
  paperStore.set((p) => {
    if (!p) return p;
    const { [id]: _gone, ...others } = p.orChosen ?? {};
    return { ...p, orChosen: chosen ? { ...others, [id]: true } : others };
  });
}

/** The questions being answered: each with its alternative if that was chosen instead. */
export function activeQuestions(section: PaperSection, chosen: Paper['orChosen']): BankQuestion[] {
  return section.questions.map((q) => (chosen?.[q.item.id] && section.alternatives?.[q.item.id]) || q);
}

export function submitPaper(timedOut = false): void {
  paperStore.set((p) => (p && !p.submittedAt ? { ...p, submittedAt: Date.now(), timedOut } : p));
}

export function abandonPaper(): void {
  paperStore.set(null);
}

/** The questions that count: all of them, or in an "any two" section, the best scoring. */
export function countedQuestions(section: PaperSection, answers: Record<string, BankAnswer>, chosen?: Paper['orChosen']): BankItem[] {
  const items = activeQuestions(section, chosen).map((q) => q.item);
  if (!section.choose) return items;
  return [...items].sort((a, b) => scoreOf(b, answers[b.id]) - scoreOf(a, answers[a.id])).slice(0, section.choose);
}

export function paperResult(paper: Paper): PaperResult {
  const topics = new Map<string, TopicResult>();
  const sections = paper.sections.map((section) => {
    let got = 0;
    let outOf = 0;
    for (const item of countedQuestions(section, paper.answers, paper.orChosen)) {
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
    const counted = new Set(countedQuestions(section, paper.answers, paper.orChosen).map((i) => i.id));
    for (const question of activeQuestions(section, paper.orChosen)) {
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
