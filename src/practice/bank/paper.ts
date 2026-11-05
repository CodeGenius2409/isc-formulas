// "Build a mock paper": the same sections and marks as the real paper, drawn from the bank, timed, then
// marked and broken down by topic. In progress and past results are stored locally.
import { loadSyllabus } from '../../data/syllabus';
import type { ClassLevel, SubjectId } from '../../data/types';
import { createStore } from '../../lib/store';
import { readJson, writeJson } from '../../lib/storage';
import { papersImported, recordAnswer } from '../progress';
import { seededRng, type Rng } from '../questions';
import { loadBlueprints, type LoadedBlueprints } from '../../data/blueprints';
import { CBQ_SHARE, generatedCount, pickGenerated, planShare, type SlotCount } from '../gen/mix';
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
}

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
function draw(pool: BankDef[], count: number, weights: Map<number, number>, used: Set<string>, rng: Rng): BankDef[] {
  const left = shuffled(pool.filter((d) => !used.has(d.id)), rng);
  if (left.length < count) throw new Error(`The bank has too few ${pool[0]?.marks}-mark questions for this paper.`);
  const out: BankDef[] = [];
  const given = new Map<number, number>();
  const topicsTaken = new Set<string>();
  while (out.length < count) {
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
    const chosen = inUnit.find((d) => !topicsTaken.has(`${d.unit}${d.topic}`)) ?? inUnit[0];
    left.splice(left.indexOf(chosen), 1);
    used.add(chosen.id);
    topicsTaken.add(`${chosen.unit}${chosen.topic}`);
    given.set(chosen.unit, (given.get(chosen.unit) ?? 0) + 1);
    out.push(chosen);
  }
  return out;
}

async function unitWeights(subject: SubjectId, level: ClassLevel): Promise<Map<number, number>> {
  const syllabus = await loadSyllabus(subject);
  const groups = syllabus.classes.find((c) => c.level === level)?.markGroups ?? [];
  const weights = new Map<number, number>();
  for (const group of groups) for (const unit of group.units) weights.set(unit, group.marks / group.units.length);
  return weights;
}

export interface GeneratedOption {
  set: LoadedBlueprints;
  share: number;
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
  const share = generated ? planShare(paperSlots(subject, level, bank), generated.share).share : 0;
  const sections = spec.sections.map((section) => {
    const questions = section.slots.flatMap((slot) => {
      const inSection = (unit: number) => !section.units || section.units.includes(unit);
      const pool = bank.defs.filter((d) => d.marks === slot.marks && inSection(d.unit) && !used.has(d.id));
      const made = generated ? pickGenerated(generated.set, generated.set.blueprints.filter((b) => b.marks === slot.marks && inSection(b.unit)), { count: Math.max(generatedCount(slot.count, share), slot.count - pool.length), weights, rng, used: usedBlueprints, seenText, cbqShare: CBQ_SHARE }) : [];
      const fromBank = slot.count - made.length;
      const defs = fromBank > 0 ? draw(bank.defs.filter((d) => d.marks === slot.marks && inSection(d.unit)), fromBank, weights, used, rng) : [];
      return shuffled([...defs.map((d) => bankQuestion(d, bank, rng)), ...made], rng);
    });
    return { name: section.name, note: section.note, choose: section.choose, questions };
  });
  return { subject, level, total: spec.total, startedAt: now, endsAt: now + PAPER_MINUTES * 60_000, sections, answers: {}, generatedShare: generated ? share : 0 };
}

export async function startPaper(subject: SubjectId, level: ClassLevel, options: { share?: number; seed?: number; diagrams?: boolean } = {}): Promise<Paper> {
  const share = options.share ?? 0;
  const [bank, weights, set] = await Promise.all([loadBank(subject, level), unitWeights(subject, level), share > 0 ? loadBlueprints(subject, level) : null]);
  const seed = options.seed ?? Math.floor(Math.random() * 2 ** 31);
  const paper = { ...assemblePaper(subject, level, bank, weights, seededRng(seed), Date.now(), set ? { set, share } : undefined), seed, diagrams: options.diagrams ?? true };
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
