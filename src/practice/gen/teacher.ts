// The teacher's generator: question sets and full papers, with locks, sets A/B/C, history, and files to reopen.
// No screens here, so every rule can be tested directly.
import { loadBlueprints, type LoadedBlueprints } from '../../data/blueprints';
import type { Blueprint } from '../../data/blueprints/types';
import { createStore } from '../../lib/store';
import { readJson, writeJson } from '../../lib/storage';
import type { ClassLevel, SubjectId } from '../../data/types';
import { bankQuestion, loadBank, type LoadedBank } from '../bank/index';
import { paperSpec } from '../bank/paper';
import type { BankDef, BankQuestion, BankType, Difficulty, GeneratedTag } from '../bank/types';
import { seededRng, type Rng } from '../questions';
import { generatedQuestion } from './engine';
import { generatedCount, pickGenerated } from './mix';

export type FormatChoice = 'mcq' | 'assertion' | 'very-short' | 'short' | 'long' | 'numerical' | 'derivation' | 'reason' | 'distinguish' | 'diagram' | 'cbq' | 'output' | 'error' | 'program';

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
  { key: 'output', label: 'Write the output', cs: 1 },
  { key: 'error', label: 'Find the error', cs: 1 },
  { key: 'program', label: 'Program writing', cs: 1 },
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
}

export const emptyFilters = (subject: SubjectId = 'physics'): Filters => ({ subject, levels: [], units: [], topics: [], formats: [], styles: [], difficulties: [], marks: [], share: 50 });

/** The format of a bank question, worked out from its type and marks, so the same filters apply to both sources. */
function bankFormat(def: BankDef): FormatChoice {
  const byType: Partial<Record<BankType, FormatChoice>> = { mcq: 'mcq', assertion: 'assertion', numerical: 'numerical', derivation: 'derivation', proof: 'derivation', reason: 'reason', distinguish: 'distinguish', output: 'output', error: 'error', program: 'program' };
  const direct = byType[def.type];
  if (direct) return direct;
  if (def.diagram) return 'diagram';
  if (def.marks === 1) return 'very-short';
  return def.marks >= 5 ? 'long' : 'short';
}

const bankStyle = (def: BankDef): GeneratedTag['style'] => (def.type === 'assertion' ? 'cbq-style' : 'paper-style');

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

export const blueprintMatches = (bp: Blueprint, f: Filters): boolean => matches(bp, bp.level, bp.format, bp.style, f);
export const bankMatches = (def: BankDef, level: ClassLevel, f: Filters): boolean => matches(def, level, bankFormat(def), bankStyle(def), f);

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

/** One question on the review screen. */
export interface PaperItem {
  key: string;
  question: BankQuestion;
  locked?: boolean;
  /** The teacher's own wording, if changed. */
  editedText?: string;
  /** The choice this question fills, so a replacement can be found like it. */
  slot?: { marks: number; units?: string[] };
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
  slot?: PaperItem['slot'];
}

/** Draws what's asked for, with the generated share respected to within one question. */
async function drawQuestions(req: DrawRequest): Promise<{ items: PaperItem[]; short: number }> {
  const { count, filters: f, rng, avoid, usedBlueprints = new Set<string>(), seenText = new Set<string>(), slot } = req;
  const sources = await loadSources(f);
  const bankPool = sources.flatMap((s) => s.bank.defs.filter((d) => bankMatches(d, s.level, f) && !avoid.has(d.id)).map((def) => ({ def, bank: s.bank })));
  const pools = sources.map((s) => ({ s, list: s.set.blueprints.filter((b) => blueprintMatches(b, f)) }));
  const blueprintTotal = pools.reduce((n, p) => n + p.list.length, 0);
  const wantGen = blueprintTotal ? generatedCount(count, f.share) : 0;
  const wantBank = Math.min(count - wantGen, bankPool.length);
  const fromBank = shuffled(bankPool, rng).slice(0, wantBank).map(({ def, bank }) => bankQuestion(def, bank, rng));
  for (const q of fromBank) seenText.add(q.item.text);
  // Whatever the bank can't supply, generated questions make up if the share allows any.
  const needGen = count - fromBank.length;
  const made: BankQuestion[] = [];
  const order = shuffled(pools, rng);
  for (let i = 0; i < order.length && made.length < needGen; i++) {
    const left = needGen - made.length;
    const portion = i === order.length - 1 ? left : Math.ceil(left / (order.length - i));
    made.push(...pickGenerated(order[i].s.set, order[i].list, { count: portion, rng, used: usedBlueprints, seenText }));
  }
  const all = shuffled([...fromBank, ...made], rng).map((q) => toItem(q, slot));
  return { items: all, short: count - all.length };
}

export interface SetRequest {
  mode: 'count' | 'marks';
  value: number;
}

/** A question set, for class practice, a worksheet or homework. */
export async function buildQuestionSet(filters: Filters, request: SetRequest, subjectLabel: string, seed: number, avoid: Set<string> = new Set()): Promise<TeacherPaper> {
  const rng = seededRng(seed);
  const used = new Set<string>();
  const seen = new Set<string>();
  let items: PaperItem[];
  let shortfall: string | undefined;
  if (request.mode === 'count') {
    const drawn = await drawQuestions({ count: request.value, filters, rng, avoid, usedBlueprints: used, seenText: seen });
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
      const drawn = await drawQuestions({ count: 1, filters: { ...filters, marks: [marks] }, rng, avoid, usedBlueprints: used, seenText: seen });
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
    options: { ...DEFAULT_OPTIONS },
    sections: [{ name: 'Questions', note: '', items }],
    createdAt: Date.now(),
    shortfall,
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
export async function buildFullPaper(filters: Filters, level: ClassLevel, structure: (CustomSection & { units?: number[] })[], subjectLabel: string, seed: number, avoid: Set<string> = new Set()): Promise<TeacherPaper> {
  const rng = seededRng(seed);
  const used = new Set<string>();
  const seen = new Set<string>();
  const taken = new Set(avoid);
  let short = 0;
  const sections: PaperSectionDraft[] = [];
  for (const part of structure) {
    const units = part.units?.map((u) => `${level} ${u}`);
    const f: Filters = { ...filters, levels: [level], marks: [part.marks], formats: part.formats, units: units ?? filters.units, topics: units ? [] : filters.topics };
    const drawn = await drawQuestions({ count: part.count, filters: f, rng, avoid: taken, usedBlueprints: used, seenText: seen, slot: { marks: part.marks, units } });
    for (const i of drawn.items) taken.add(i.key);
    short += drawn.short;
    sections.push({ name: part.name, note: part.choose ? `Answer any ${part.choose}.` : `${part.count} ${part.count === 1 ? 'question' : 'questions'} of ${part.marks} ${part.marks === 1 ? 'mark' : 'marks'}${part.count === 1 ? '' : ' each'}.`, choose: part.choose, items: drawn.items });
  }
  const paper: TeacherPaper = {
    id: `t-${seed}-${Date.now().toString(36)}`,
    mode: 'paper',
    title: `${subjectLabel} ${level} paper`,
    seed,
    filters,
    header: DEFAULT_HEADER(subjectLabel, 0),
    options: { ...DEFAULT_OPTIONS },
    sections,
    createdAt: Date.now(),
    shortfall: short ? `${short} ${short === 1 ? 'question' : 'questions'} couldn’t be found for these choices.` : undefined,
  };
  paper.header.maxMarks = String(totalMarks(paper));
  return paper;
}

/** Replaces one question with a different one of the same marks and kind. A locked question stays. */
export async function regenerateItem(paper: TeacherPaper, key: string, seed: number): Promise<TeacherPaper> {
  const rng = seededRng(seed);
  const sections = await Promise.all(
    paper.sections.map(async (section) => ({
      ...section,
      items: await Promise.all(
        section.items.map(async (item) => {
          if (item.key !== key || item.locked) return item;
          return (await replacementFor(paper, item, rng)) ?? item;
        }),
      ),
    })),
  );
  return { ...paper, sections };
}

async function replacementFor(paper: TeacherPaper, item: PaperItem, rng: Rng): Promise<PaperItem | null> {
  const taken = new Set(allItems(paper).map((i) => i.key));
  const seen = new Set(allItems(paper).map((i) => i.question.item.text));
  const old = item.question.item;
  // A generated one gets new values from its own blueprint when it can, which keeps the question's shape.
  if (old.generated) {
    const set = await loadBlueprints(old.subject, old.level);
    const bp = set.byId.get(old.generated.blueprint);
    if (bp) {
      for (let i = 0; i < 12; i++) {
        const q = generatedQuestion(bp, Math.floor(rng() * 2 ** 31), set.names(bp));
        if (!seen.has(q.item.text)) return { ...item, key: q.item.id, question: q, editedText: undefined };
      }
    }
  }
  const f: Filters = { ...paper.filters, levels: [old.level], marks: [old.marks], units: item.slot?.units ?? paper.filters.units, topics: item.slot?.units ? [] : paper.filters.topics };
  const drawn = await drawQuestions({ count: 1, filters: f, rng, avoid: taken, seenText: seen });
  const next = drawn.items[0];
  return next ? { ...item, key: next.key, question: next.question, editedText: undefined } : null;
}

/** Regenerates everything that isn't locked. */
export async function regenerateUnlocked(paper: TeacherPaper, seed: number): Promise<TeacherPaper> {
  let next = paper;
  let offset = 0;
  for (const item of allItems(paper)) {
    if (!item.locked) next = await regenerateItem(next, item.key, seed + ++offset);
  }
  return next;
}

/** Sets A, B, C: the same structure with different values or questions. Locked questions are kept in each. */
export async function makeSets(paper: TeacherPaper, names: string[], baseSeed: number): Promise<TeacherPaper[]> {
  const out: TeacherPaper[] = [];
  let current = paper;
  for (let i = 0; i < names.length; i++) {
    if (i > 0) current = await regenerateUnlocked(current, baseSeed + i * 1000);
    out.push({ ...current, id: `${paper.id}-${names[i]}`, setName: names[i], seed: baseSeed + i * 1000, title: `${paper.title}, Set ${names[i]}` });
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

/** Every question id used in the papers kept here, so a new paper can leave them out. */
export const usedInHistory = (): Set<string> => new Set(teacherHistoryStore.get().flatMap((p) => allItems(p).map((i) => i.key)));

export function paperToFile(paper: TeacherPaper): string {
  return JSON.stringify({ app: 'isc-formula-book', kind: 'teacher-paper', version: 1, paper }, null, 2);
}

export function paperFromFile(text: string): TeacherPaper {
  const data = JSON.parse(text) as { app?: string; kind?: string; paper?: TeacherPaper };
  if (data.app !== 'isc-formula-book' || data.kind !== 'teacher-paper' || !data.paper?.sections) throw new Error('That file is not a paper from this app.');
  return data.paper;
}
