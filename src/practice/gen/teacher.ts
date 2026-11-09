// The teacher's generator: question sets and full papers, with locks, sets A/B/C, history, and files to reopen.
// No screens here, so every rule can be tested directly.
import { loadBlueprints, type LoadedBlueprints } from '../../data/blueprints';
import type { Blueprint } from '../../data/blueprints/types';
import { createStore } from '../../lib/store';
import { teacherDiagramsStore } from './figures';
import { readJson, writeJson } from '../../lib/storage';
import type { ClassLevel, SubjectId } from '../../data/types';
import { bankQuestion, loadBank, type LoadedBank } from '../bank/index';
import { paperSpec } from '../bank/paper';
import type { BankDef, BankQuestion, BankType, Difficulty, GeneratedTag, QuestionFormat } from '../bank/types';
import { seededRng, type Rng } from '../questions';
import { generatedQuestion } from './engine';
import { defKeys, factsOf, generatedCount, historyKeys, pickGenerated, PROBE_SEEDS, questionKey, usedFreshness, type Freshness } from './mix';

export type FormatChoice = QuestionFormat;

export const FORMATS: { key: FormatChoice; label: string; cs?: 1 }[] = [
  { key: 'mcq', label: 'Multiple choice' },
  { key: 'assertion', label: 'Assertion and reason' },
  { key: 'very-short', label: 'Very short answer' },
  { key: 'short', label: 'Short answer' },
  { key: 'long', label: 'Long answer' },
  { key: 'numerical', label: 'Numerical' },
  { key: 'derivation', label: 'Derivation or proof' },
  { key: 'reason', label: 'Give reasons' },
  { key: 'distinguish', label: 'Distinguish between' },
  { key: 'diagram', label: 'Diagram-based' },
  { key: 'cbq', label: 'CBQ or case-based' },
  { key: 'statement', label: 'Which statement is correct or incorrect' },
  { key: 'match', label: 'Match the columns' },
  { key: 'mistake', label: 'Find the mistake' },
  { key: 'complete', label: 'Complete the statement or table' },
  { key: 'order', label: 'Arrange in order' },
  { key: 'odd', label: 'Odd one out' },
  { key: 'data', label: 'Read a graph or table' },
  { key: 'predict', label: 'Predict and explain' },
  { key: 'output', label: 'Write the output', cs: 1 },
  { key: 'error', label: 'Find the error', cs: 1 },
  { key: 'program', label: 'Program writing', cs: 1 },
  { key: 'change', label: 'Output after a change', cs: 1 },
  { key: 'trace', label: 'Trace or count', cs: 1 },
  { key: 'fill', label: 'Fill in the missing line', cs: 1 },
  { key: 'convert', label: 'Expression, table and circuit', cs: 1 },
];

export interface Filters {
  subject: SubjectId;
  /** Empty means both classes. */
  levels: ClassLevel[];
  /** "XII 3" for a unit. Empty means all. */
  units: string[];
  /** "XII 3 a" for a topic. Empty means all. */
  topics: string[];
  formats: FormatChoice[];
  styles: GeneratedTag['style'][];
  difficulties: Difficulty[];
  /** Marks per question. Empty means any. */
  marks: number[];
  /** From 0 to 100. */
  share: number;
  /** Only questions from blueprints that have been reviewed. Off unless chosen. */
  reviewedOnly?: boolean;
}

export const emptyFilters = (subject: SubjectId = 'physics'): Filters => ({ subject, levels: [], units: [], topics: [], formats: [], styles: [], difficulties: [], marks: [], share: 50 });

/** The format of a bank question, worked out from its type and marks, so the same filters apply to both sources. */
export function bankFormatOf(def: BankDef): FormatChoice {
  if (def.format) return def.format;
  const byType: Partial<Record<BankType, FormatChoice>> = { mcq: 'mcq', assertion: 'assertion', numerical: 'numerical', derivation: 'derivation', proof: 'derivation', reason: 'reason', distinguish: 'distinguish', output: 'output', error: 'error', program: 'program' };
  const direct = byType[def.type];
  if (direct) return direct;
  if (def.diagram) return 'diagram';
  if (def.marks === 1) return 'very-short';
  return def.marks >= 5 ? 'long' : 'short';
}

const bankStyle = (def: BankDef): GeneratedTag['style'] => def.style ?? (def.type === 'assertion' ? 'cbq-style' : 'paper-style');

interface Source {
  level: ClassLevel;
  bank: LoadedBank;
  set: LoadedBlueprints;
}

/** Marks and tags, the same for a blueprint or a bank question. */
function matches(item: { unit: number; topic: string; marks: number; difficulty: Difficulty }, level: ClassLevel, format: FormatChoice, style: GeneratedTag['style'], f: Filters): boolean {
  if (f.levels.length && !f.levels.includes(level)) return false;
  if (f.formats.length && !f.formats.includes(format)) return false;
  if (f.styles.length && !f.styles.includes(style)) return false;
  if (f.difficulties.length && !f.difficulties.includes(item.difficulty)) return false;
  if (f.marks.length && !f.marks.includes(item.marks)) return false;
  const unitKey = `${level} ${item.unit}`;
  const topicKey = `${level} ${item.unit} ${item.topic}`;
  // A chosen topic narrows its own unit. Any other chosen unit stays whole.
  if (f.units.length || f.topics.length) {
    const topicsHere = f.topics.filter((t) => t.startsWith(`${unitKey} `));
    if (topicsHere.length) return topicsHere.includes(topicKey);
    return f.units.includes(unitKey);
  }
  return true;
}

const isDerivation = (type: BankType) => type === 'derivation' || type === 'proof';
export const blueprintMatches = (bp: Blueprint, f: Filters): boolean => (!f.reviewedOnly || bp.reviewed === true) && matches(bp, bp.level, isDerivation(bp.type) && f.formats.includes('derivation') ? 'derivation' : bp.format, bp.style, f);
export const bankMatches = (def: BankDef, level: ClassLevel, f: Filters): boolean => matches(def, level, bankFormatOf(def), bankStyle(def), f);

async function loadSources(f: Filters): Promise<Source[]> {
  const levels: ClassLevel[] = f.levels.length ? f.levels : ['XI', 'XII'];
  return Promise.all(levels.map(async (level) => ({ level, bank: await loadBank(f.subject, level), set: await loadBlueprints(f.subject, level) })));
}

export interface Availability {
  bank: number;
  blueprints: number;
}

export async function countAvailable(f: Filters, avoid: Set<string> = new Set()): Promise<Availability> {
  const sources = await loadSources(f);
  return {
    bank: sources.reduce((sum, s) => sum + s.bank.defs.filter((d) => bankMatches(d, s.level, f) && !avoid.has(d.id)).length, 0),
    blueprints: sources.reduce((sum, s) => sum + s.set.blueprints.filter((b) => blueprintMatches(b, f)).length, 0),
  };
}

/** How many bank questions each section of a paper could draw on, for the live description under the slider. */
export async function bankForSections(filters: Filters, level: ClassLevel, structure: (CustomSection & { units?: number[] })[], avoid: Set<string> = new Set()): Promise<number[]> {
  const [source] = await loadSources({ ...filters, levels: [level] });
  if (!source) return structure.map(() => 0);
  return structure.map((part) => {
    const units = part.units?.map((u) => `${level} ${u}`);
    const f: Filters = { ...filters, levels: [level], marks: [part.marks], formats: part.formats, units: units ?? filters.units, topics: units ? [] : filters.topics };
    return source.bank.defs.filter((d) => bankMatches(d, level, f) && !avoid.has(d.id)).length;
  });
}

/** Each blueprint's distinct questions, found once, by trying seeds. Enough for any paper, and no more. */
const probes = new Map<string, { key: string; facts: string[] }[]>();

function probe(set: LoadedBlueprints, bp: Blueprint): { key: string; facts: string[] }[] {
  let list = probes.get(bp.id);
  if (!list) {
    const seen = new Set<string>();
    list = [];
    for (let seed = 1; seed <= PROBE_SEEDS && list.length < 40; seed++) {
      const q = generatedQuestion(bp, seed * 7919, set.names(bp));
      const key = questionKey(q);
      if (seen.has(key)) continue;
      seen.add(key);
      list.push({ key, facts: factsOf(q) });
    }
    probes.set(bp.id, list);
  }
  return list;
}

/** How many different questions these filters can give. It stops counting at `limit`. */
function countDistinct(sources: Source[], f: Filters, avoid: Set<string>, limit: number): number {
  let total = 0;
  const facts = new Set<string>();
  const keys = new Set<string>();
  if (f.share < 100) {
    for (const s of sources) {
      for (const d of s.bank.defs) {
        if (!bankMatches(d, s.level, f) || avoid.has(d.id)) continue;
        total++;
        for (const x of d.facts ?? []) facts.add(x);
      }
    }
  }
  if (f.share <= 0 || total >= limit) return Math.min(total, limit);
  // Questions on one fact first, so that a matching question, which uses up several, is counted last.
  for (const multi of [false, true]) {
    for (const s of sources) {
      for (const bp of s.set.blueprints) {
        if (!blueprintMatches(bp, f)) continue;
        for (const { key, facts: own } of probe(s.set, bp)) {
          if (own.length > 1 !== multi || keys.has(key) || own.some((x) => facts.has(x))) continue;
          keys.add(key);
          for (const x of own) facts.add(x);
          if (++total >= limit) return total;
        }
      }
    }
  }
  return total;
}

/** The chapters of the chosen subtopics, whole. The last place to look, and such questions are labelled. */
const widened = (f: Filters): Filters => ({ ...f, topics: [], units: [...new Set([...f.units, ...f.topics.map((t) => t.split(' ').slice(0, 2).join(' '))])] });

export interface Capacity {
  /** From exactly what's chosen. */
  exact: number;
  /** Counting related subtopics in the same chapters. */
  withRelated: number;
}

/** What can be made, so a choice that can't work is stopped before generating and not after. */
export async function capacityOf(f: Filters, avoid: Set<string> = new Set(), limit = 60): Promise<Capacity> {
  const sources = await loadSources(f);
  const exact = countDistinct(sources, f, avoid, limit);
  return { exact, withRelated: f.topics.length && exact < limit ? countDistinct(sources, widened(f), avoid, limit) : exact };
}

/** Lines to leave for an answer. A derivation gets room for its marks, if lines are wanted at all. */
export function answerSpace(item: { type: BankType; marks: number }, chosen: number): number {
  if (!chosen) return 0;
  return isDerivation(item.type) ? Math.max(chosen, item.marks * 2) : chosen;
}

/** One question on the review screen. */
export interface PaperItem {
  key: string;
  question: BankQuestion;
  locked?: boolean;
  /** The teacher's own wording, if changed. */
  editedText?: string;
  /** The choice this question fills, so a replacement can be found like it. */
  slot?: { marks: number; units?: string[] };
  /** From a related subtopic in a chosen chapter, as there weren't enough in the subtopics chosen. */
  related?: boolean;
}

export interface HeaderFields {
  school: string;
  exam: string;
  classSection: string;
  date: string;
  time: string;
  maxMarks: string;
  instructions: string;
}

export interface PaperOptions {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  diagrams: boolean;
  showMarks: boolean;
  answerLines: number;
  fontSize: number;
}

export const DEFAULT_OPTIONS: PaperOptions = { shuffleQuestions: false, shuffleOptions: false, diagrams: true, showMarks: true, answerLines: 0, fontSize: 12 };

export const ISC_INSTRUCTIONS = 'Answer every question in Part I, and the stated number from each later part.\nThe marks for each question are in square brackets.\nShow your working beside each answer, including any rough work.\nUse the first 15 minutes to read the paper. Begin writing after that.';

export interface PaperSectionDraft {
  name: string;
  note: string;
  /** Answer any this many. */
  choose?: number;
  items: PaperItem[];
}

export interface TeacherPaper {
  id: string;
  mode: 'set' | 'paper';
  title: string;
  seed: number;
  /** A, B or C, when it was made as one of several sets. */
  setName?: string;
  filters: Filters;
  header: HeaderFields;
  options: PaperOptions;
  sections: PaperSectionDraft[];
  createdAt: number;
  /** Set when asked for and the bank or blueprints couldn't reach it. */
  shortfall?: string;
  /** Where any related questions came from. */
  relatedNote?: string;
  /** Set when there weren't enough facts left that haven't been used lately. */
  repeatNote?: string;
}

export const allItems = (paper: TeacherPaper): PaperItem[] => paper.sections.flatMap((s) => s.items);
export const totalMarks = (paper: TeacherPaper): number =>
  paper.sections.reduce((sum, s) => {
    const marks = s.items.map((i) => i.question.item.marks);
    if (!s.choose) return sum + marks.reduce((a, b) => a + b, 0);
    return sum + [...marks].sort((a, b) => b - a).slice(0, s.choose).reduce((a, b) => a + b, 0);
  }, 0);

function shuffled<T>(list: readonly T[], rng: Rng): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const toItem = (question: BankQuestion, slot?: PaperItem['slot']): PaperItem => ({ key: question.item.id, question, slot });

export const DEFAULT_HEADER = (subjectLabel: string, marks: number): HeaderFields => ({ school: '', exam: `${subjectLabel} practice test`, classSection: '', date: '', time: '3 hours', maxMarks: String(marks), instructions: ISC_INSTRUCTIONS });

interface DrawRequest {
  count: number;
  filters: Filters;
  rng: Rng;
  avoid: Set<string>;
  usedBlueprints?: Set<string>;
  seenText?: Set<string>;
  seenFacts?: Set<string>;
  slot?: PaperItem['slot'];
  /** Leaves out questions that use up several facts at once. */
  singleFact?: boolean;
  /** Prefers facts not used lately. */
  fresh?: Freshness;
}

/**
 * Draws what's asked for, with the generated share respected to within one question. If that falls short, it takes
 * more from the other source if the slider allows any, and only then looks in related subtopics of the same chapters.
 */
async function drawQuestions(req: DrawRequest): Promise<{ items: PaperItem[]; short: number }> {
  const { usedBlueprints = new Set<string>(), seenText = new Set<string>(), seenFacts = new Set<string>() } = req;
  const startText = new Set(seenText);
  const startFacts = new Set(seenFacts);
  const first = await drawOnce(req, usedBlueprints, seenText, seenFacts);
  if (first.short === 0) return first;
  // A matching question uses up several facts, so if that left it short, it starts again without them.
  seenText.clear();
  for (const x of startText) seenText.add(x);
  seenFacts.clear();
  for (const x of startFacts) seenFacts.add(x);
  return drawOnce({ ...req, singleFact: true }, usedBlueprints, seenText, seenFacts);
}

async function drawOnce(req: DrawRequest, usedBlueprints: Set<string>, seenText: Set<string>, seenFacts: Set<string>): Promise<{ items: PaperItem[]; short: number }> {
  const { count, filters: f, rng, avoid, slot, singleFact, fresh } = req;
  const sources = await loadSources(f);
  const bankPool = sources.flatMap((s) => s.bank.defs.filter((d) => bankMatches(d, s.level, f) && !avoid.has(d.id)).map((def) => ({ def, bank: s.bank })));
  const pools = sources.map((s) => ({ s, list: s.set.blueprints.filter((b) => blueprintMatches(b, f) && !(singleFact && (b.id.endsWith('-match') || b.id.endsWith('-linked')))) }));
  const blueprintTotal = pools.reduce((n, p) => n + p.list.length, 0);
  const wantGen = blueprintTotal ? generatedCount(count, f.share) : 0;
  const bankOrder = shuffled(fresh ? bankPool.filter(({ def }) => !fresh.resting(defKeys(def))) : bankPool, rng);
  const wantBank = f.share >= 100 ? 0 : Math.min(count - wantGen, bankOrder.length);
  const fromBank = bankOrder.slice(0, wantBank).map(({ def, bank }) => bankQuestion(def, bank, rng));
  for (const q of fromBank) {
    seenText.add(questionKey(q));
    for (const x of factsOf(q)) seenFacts.add(x);
  }
  // Whatever the bank can't supply, generated questions make up if the share allows any.
  // Enough of the bank to reach the share: a bank question and a generated one can't both ask one fact.
  const needGen = f.share > 0 ? count - fromBank.length : 0;
  const made: BankQuestion[] = [];
  const order = shuffled(pools, rng);
  for (let i = 0; i < order.length && made.length < needGen; i++) {
    const left = needGen - made.length;
    const portion = i === order.length - 1 ? left : Math.ceil(left / (order.length - i));
    made.push(...pickGenerated(order[i].s.set, order[i].list, { count: portion, rng, used: usedBlueprints, seenText, seenFacts, fresh, freshOnly: true }));
  }
  // The generated side ran short, so the bank makes up the rest if the slider allows it.
  const extra: BankQuestion[] = [];
  if (f.share < 100) {
    for (const { def, bank } of bankOrder.slice(wantBank)) {
      if (extra.length >= count - fromBank.length - made.length) break;
      if ((def.facts ?? []).some((x) => seenFacts.has(x))) continue;
      const q = bankQuestion(def, bank, rng);
      extra.push(q);
      seenText.add(questionKey(q));
      for (const x of factsOf(q)) seenFacts.add(x);
    }
  }
  // Nothing unused is left for these choices, so what was used longest ago comes back, and the count still holds.
  if (fresh) {
    const fromOldBank = () => {
      if (f.share >= 100) return;
      const old = bankPool.filter(({ def }) => fresh.resting(defKeys(def))).sort((a, b) => fresh.lastSeen(defKeys(a.def)) - fresh.lastSeen(defKeys(b.def)));
      for (const { def, bank } of old) {
        if (fromBank.length + extra.length + made.length >= count) break;
        if ((def.facts ?? []).some((x) => seenFacts.has(x))) continue;
        const q = bankQuestion(def, bank, rng);
        extra.push(q);
        seenText.add(questionKey(q));
        for (const x of factsOf(q)) seenFacts.add(x);
      }
    };
    if (f.share < 50) fromOldBank();
    if (f.share > 0) {
      for (const { s, list } of order) {
        const left = count - fromBank.length - extra.length - made.length;
        if (left > 0) made.push(...pickGenerated(s.set, list, { count: left, rng, used: usedBlueprints, seenText, seenFacts, fresh }));
      }
    }
    fromOldBank();
  }
  const all = shuffled([...fromBank, ...extra, ...made], rng).map((q) => toItem(q, slot));
  let short = count - all.length;
  // The last resort: related subtopics in the chapters chosen, which are labelled.
  if (short > 0 && f.topics.length) {
    const taken = new Set([...avoid, ...all.map((i) => i.key)]);
    const related = await drawQuestions({ ...req, count: short, filters: widened(f), avoid: taken, usedBlueprints, seenText, seenFacts });
    all.push(...related.items.map((i) => ({ ...i, related: true })));
    short = count - all.length;
  }
  return { items: all, short };
}

/** The short line saying where related questions came from. */
export function relatedSummary(items: PaperItem[]): string | undefined {
  const n = items.filter((i) => i.related).length;
  return n ? `${n} ${n === 1 ? 'question comes' : 'questions come'} from related subtopics in the same chapter.` : undefined;
}

/** The short note when a choice has run out of facts that haven't been used in saved papers. */
export function repeatSummary(items: PaperItem[], fresh: Freshness | undefined, where = 'your recent papers'): string | undefined {
  const n = fresh ? items.filter((i) => fresh.resting(historyKeys(i.question))).length : 0;
  return n ? `${n} ${n === 1 ? 'question uses a fact' : 'questions use facts'} from ${where}, as there weren’t enough others for these choices.` : undefined;
}

export interface SetRequest {
  mode: 'count' | 'marks';
  value: number;
}

/** A question set, for class practice, a worksheet or homework. */
export async function buildQuestionSet(filters: Filters, request: SetRequest, subjectLabel: string, seed: number, avoid: Set<string> = new Set(), fresh?: Freshness): Promise<TeacherPaper> {
  const rng = seededRng(seed);
  const used = new Set<string>();
  const seen = new Set<string>();
  const seenFacts = new Set<string>();
  let items: PaperItem[];
  let shortfall: string | undefined;
  if (request.mode === 'count') {
    const drawn = await drawQuestions({ count: request.value, filters, rng, avoid, usedBlueprints: used, seenText: seen, seenFacts, fresh });
    items = drawn.items;
    if (drawn.short) shortfall = `Only ${items.length} of the ${request.value} questions could be found for these choices.`;
  } else {
    items = [];
    let left = request.value;
    const choices = filters.marks.length ? [...filters.marks].sort((a, b) => b - a) : [5, 3, 2, 1];
    let guard = 0;
    while (left > 0 && guard++ < request.value * 3) {
      const fits = choices.filter((m) => m <= left);
      if (!fits.length) break;
      const marks = fits[Math.floor(rng() * fits.length)];
      const drawn = await drawQuestions({ count: 1, filters: { ...filters, marks: [marks] }, rng, avoid, usedBlueprints: used, seenText: seen, seenFacts, fresh });
      const [item] = drawn.items;
      if (!item || items.some((i) => i.key === item.key)) {
        choices.splice(choices.indexOf(marks), 1);
        if (!choices.length) break;
        continue;
      }
      items.push(item);
      left -= item.question.item.marks;
    }
    if (left > 0) shortfall = `Only ${request.value - left} of the ${request.value} marks could be reached with these choices.`;
  }
  const paper: TeacherPaper = {
    id: `t-${seed}-${Date.now().toString(36)}`,
    mode: 'set',
    title: `${subjectLabel} question set`,
    seed,
    filters,
    header: DEFAULT_HEADER(subjectLabel, items.reduce((s, i) => s + i.question.item.marks, 0)),
    options: { ...DEFAULT_OPTIONS, diagrams: teacherDiagramsStore.get() },
    sections: [{ name: 'Questions', note: '', items }],
    createdAt: Date.now(),
    shortfall,
    relatedNote: relatedSummary(items),
    repeatNote: repeatSummary(items, fresh),
  };
  paper.header.maxMarks = String(totalMarks(paper));
  return paper;
}

export interface CustomSection {
  name: string;
  count: number;
  marks: number;
  formats: FormatChoice[];
  choose?: number;
}

/** The official structure for a subject and class, as an editable list of sections. */
export function officialStructure(subject: SubjectId, level: ClassLevel): (CustomSection & { units?: number[] })[] {
  return paperSpec(subject, level).sections.flatMap((section) =>
    section.slots.map((slot, i) => ({ name: section.slots.length > 1 ? `${section.name} (${i + 1})` : section.name, count: slot.count, marks: slot.marks, formats: [], choose: section.choose, units: section.units })),
  );
}

/** A whole paper, from the official structure or a custom one. */
export async function buildFullPaper(filters: Filters, level: ClassLevel, structure: (CustomSection & { units?: number[] })[], subjectLabel: string, seed: number, avoid: Set<string> = new Set(), fresh?: Freshness): Promise<TeacherPaper> {
  const rng = seededRng(seed);
  const used = new Set<string>();
  const seen = new Set<string>();
  const seenFacts = new Set<string>();
  const taken = new Set(avoid);
  let short = 0;
  let filled = 0;
  const sections: PaperSectionDraft[] = [];
  for (const part of structure) {
    const units = part.units?.map((u) => `${level} ${u}`);
    const f: Filters = { ...filters, levels: [level], marks: [part.marks], formats: part.formats, units: units ?? filters.units, topics: units ? [] : filters.topics };
    const drawn = await drawQuestions({ count: part.count, filters: f, rng, avoid: taken, usedBlueprints: used, seenText: seen, seenFacts, slot: { marks: part.marks, units }, fresh });
    for (const i of drawn.items) taken.add(i.key);
    // A paper is never handed out short, so if generated questions run out, the bank fills the section, whatever the slider says.
    const fill = drawn.short > 0 ? await drawQuestions({ count: drawn.short, filters: { ...f, share: 50 }, rng, avoid: taken, usedBlueprints: used, seenText: seen, seenFacts, slot: { marks: part.marks, units }, fresh }) : { items: [], short: 0 };
    for (const i of fill.items) taken.add(i.key);
    filled += fill.items.length;
    short += fill.short;
    sections.push({ name: part.name, note: part.choose ? `Answer any ${part.choose}.` : `${part.count} ${part.count === 1 ? 'question' : 'questions'} of ${part.marks} ${part.marks === 1 ? 'mark' : 'marks'}${part.count === 1 ? '' : ' each'}.`, choose: part.choose, items: [...drawn.items, ...fill.items] });
  }
  const paper: TeacherPaper = {
    id: `t-${seed}-${Date.now().toString(36)}`,
    mode: 'paper',
    title: `${subjectLabel} ${level} paper`,
    seed,
    filters,
    header: DEFAULT_HEADER(subjectLabel, 0),
    options: { ...DEFAULT_OPTIONS, diagrams: teacherDiagramsStore.get() },
    sections,
    createdAt: Date.now(),
    shortfall: short ? `${short} ${short === 1 ? 'question' : 'questions'} couldn’t be found for these choices.` : undefined,
    relatedNote: [relatedSummary(sections.flatMap((s) => s.items)), filled ? `${filled} ${filled === 1 ? 'question comes' : 'questions come'} from the bank, as there weren’t enough new ones for that section.` : ''].filter(Boolean).join(' ') || undefined,
    repeatNote: repeatSummary(sections.flatMap((s) => s.items), fresh),
  };
  paper.header.maxMarks = String(totalMarks(paper));
  return paper;
}

/** Replaces one question with a different one of the same marks and kind. A locked question stays. */
export async function regenerateItem(paper: TeacherPaper, key: string, seed: number, fresh?: Freshness): Promise<TeacherPaper> {
  const rng = seededRng(seed);
  const sections = await Promise.all(
    paper.sections.map(async (section) => ({
      ...section,
      items: await Promise.all(
        section.items.map(async (item) => {
          if (item.key !== key || item.locked) return item;
          return (await replacementFor(paper, item, rng, fresh)) ?? item;
        }),
      ),
    })),
  );
  return { ...paper, sections };
}

async function replacementFor(paper: TeacherPaper, item: PaperItem, rng: Rng, fresh?: Freshness): Promise<PaperItem | null> {
  const taken = new Set(allItems(paper).map((i) => i.key));
  const seen = new Set(allItems(paper).map((i) => questionKey(i.question)));
  const seenFacts = new Set(allItems(paper).flatMap((i) => (i.key === item.key ? [] : factsOf(i.question))));
  const old = item.question.item;
  // A generated one gets new values from its own blueprint when it can, which keeps the question's shape.
  if (old.generated) {
    const set = await loadBlueprints(old.subject, old.level);
    const bp = set.byId.get(old.generated.blueprint);
    if (bp) {
      for (let i = 0; i < 40; i++) {
        const q = generatedQuestion(bp, Math.floor(rng() * 2 ** 31), set.names(bp));
        if (!seen.has(questionKey(q)) && !factsOf(q).some((x) => seenFacts.has(x)) && !fresh?.resting(historyKeys(q))) return { ...item, key: q.item.id, question: q, editedText: undefined };
      }
    }
  }
  const f: Filters = { ...paper.filters, levels: [old.level], marks: [old.marks], units: item.slot?.units ?? paper.filters.units, topics: item.slot?.units ? [] : paper.filters.topics };
  const drawn = await drawQuestions({ count: 1, filters: f, rng, avoid: taken, seenText: seen, seenFacts, fresh });
  const next = drawn.items[0];
  return next ? { ...item, key: next.key, question: next.question, editedText: undefined } : null;
}

/** Regenerates everything that isn't locked. */
export async function regenerateUnlocked(paper: TeacherPaper, seed: number, fresh?: Freshness): Promise<TeacherPaper> {
  let next = paper;
  let offset = 0;
  for (const item of allItems(paper)) {
    if (!item.locked) next = await regenerateItem(next, item.key, seed + ++offset, fresh);
  }
  return next;
}

/** Sets A, B, C: the same structure with different facts wherever the material allows. Locked questions are kept in each. */
export async function makeSets(paper: TeacherPaper, names: string[], baseSeed: number, fresh?: Freshness): Promise<TeacherPaper[]> {
  const out: TeacherPaper[] = [];
  let current = paper;
  // What earlier sets used comes back only when nothing else is left, and when it does, the set says so.
  const inEarlierSets = new Map<string, number>();
  const earlier = usedFreshness(inEarlierSets, fresh);
  const onlyEarlier = usedFreshness(inEarlierSets);
  for (let i = 0; i < names.length; i++) {
    if (i > 0) current = await regenerateUnlocked(current, baseSeed + i * 1000, earlier);
    const open = allItems(current).filter((item) => !item.locked);
    const repeated = i > 0 ? repeatSummary(open, onlyEarlier, 'an earlier set') : undefined;
    out.push({ ...current, id: `${paper.id}-${names[i]}`, setName: names[i], seed: baseSeed + i * 1000, title: `${paper.title}, Set ${names[i]}`, repeatNote: repeated ?? current.repeatNote });
    for (const item of open) for (const key of historyKeys(item.question)) inEarlierSets.set(key, i + 1);
  }
  return out;
}

export function moveItem(paper: TeacherPaper, key: string, by: number): TeacherPaper {
  return {
    ...paper,
    sections: paper.sections.map((section) => {
      const i = section.items.findIndex((x) => x.key === key);
      const j = i + by;
      if (i < 0 || j < 0 || j >= section.items.length) return section;
      const items = [...section.items];
      [items[i], items[j]] = [items[j], items[i]];
      return { ...section, items };
    }),
  };
}

/** Puts one question at the place of another, in the same section. */
export function moveItemTo(paper: TeacherPaper, key: string, target: string): TeacherPaper {
  return {
    ...paper,
    sections: paper.sections.map((section) => {
      const from = section.items.findIndex((x) => x.key === key);
      const to = section.items.findIndex((x) => x.key === target);
      if (from < 0 || to < 0) return section;
      const items = [...section.items];
      const [moved] = items.splice(from, 1);
      items.splice(to, 0, moved);
      return { ...section, items };
    }),
  };
}

export const deleteItem = (paper: TeacherPaper, key: string): TeacherPaper => ({ ...paper, sections: paper.sections.map((s) => ({ ...s, items: s.items.filter((i) => i.key !== key) })) });

export const updateItem = (paper: TeacherPaper, key: string, change: Partial<PaperItem>): TeacherPaper => ({ ...paper, sections: paper.sections.map((s) => ({ ...s, items: s.items.map((i) => (i.key === key ? { ...i, ...change } : i)) })) });

/** A copy for printing, with shuffled questions and options if asked for. The stored paper isn't changed. */
export function arranged(paper: TeacherPaper): TeacherPaper {
  const rng = seededRng(paper.seed);
  return {
    ...paper,
    sections: paper.sections.map((section) => {
      const items = paper.options.shuffleQuestions ? shuffled(section.items, rng) : section.items;
      return {
        ...section,
        items: items.map((item) => {
          const q = item.question.item;
          if (!paper.options.shuffleOptions || q.form !== 'mcq' || q.type === 'assertion') return item;
          const order = shuffled(q.options.map((_, i) => i), rng);
          return { ...item, question: { ...item.question, item: { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) } } };
        }),
      };
    }),
  };
}

// ---- Presets and history

const PRESETS_KEY = 'isc-teacher-presets';
const HISTORY_KEY = 'isc-teacher-history';
const HISTORY_LIMIT = 30;

export interface Preset {
  name: string;
  filters: Filters;
}

export const presetsStore = createStore<Preset[]>(readJson<Preset[]>(PRESETS_KEY, []), (v) => writeJson(PRESETS_KEY, v));
export const teacherHistoryStore = createStore<TeacherPaper[]>(readJson<TeacherPaper[]>(HISTORY_KEY, []), (v) => writeJson(HISTORY_KEY, v));

export function savePreset(name: string, filters: Filters): void {
  presetsStore.set((list) => [{ name, filters }, ...list.filter((p) => p.name !== name)]);
}

export function savePaper(paper: TeacherPaper): void {
  teacherHistoryStore.set((list) => [paper, ...list.filter((p) => p.id !== paper.id)].slice(0, HISTORY_LIMIT));
}

export function deletePaper(id: string): void {
  teacherHistoryStore.set((list) => list.filter((p) => p.id !== id));
}

/** On by default. A teacher's saved papers are the history here, as a student's sittings aren't relevant to them. */
/** Off by default: unreviewed blueprints stay in use, with their note. */
export const teacherReviewedOnlyStore = createStore<boolean>(readJson<boolean>('isc-teacher-reviewed-only', false), (v) => writeJson('isc-teacher-reviewed-only', v));
export const avoidRecentStore = createStore<boolean>(readJson<boolean>('isc-teacher-avoid-recent', true), (v) => writeJson('isc-teacher-avoid-recent', v));

/** The facts used in the papers kept here, with when, so a new paper can prefer others. */
export function recentPaperFreshness(): Freshness {
  const used = new Map<string, number>();
  for (const paper of teacherHistoryStore.get()) {
    for (const item of allItems(paper)) {
      for (const key of historyKeys(item.question)) used.set(key, Math.max(used.get(key) ?? 0, paper.createdAt));
    }
  }
  return usedFreshness(used);
}

export function paperToFile(paper: TeacherPaper): string {
  return JSON.stringify({ app: 'isc-formula-book', kind: 'teacher-paper', version: 1, paper }, null, 2);
}

export function paperFromFile(text: string): TeacherPaper {
  const data = JSON.parse(text) as { app?: string; kind?: string; paper?: TeacherPaper };
  if (data.app !== 'isc-formula-book' || data.kind !== 'teacher-paper' || !data.paper?.sections) throw new Error('That file is not a paper from this app.');
  return data.paper;
}
