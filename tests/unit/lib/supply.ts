// Measures the question supply: what there is for each subtopic, how soon its questions repeat, and how alike
// consecutive ones are. Used by supply-report.test.ts. It reads only the app's own material, never the papers.
import fs from 'node:fs';
import path from 'node:path';
import { loadBlueprints, type LoadedBlueprints } from '../../../src/data/blueprints';
import { FACT_BOOK, type Facts } from '../../../src/data/blueprints/dsl';
import type { Blueprint } from '../../../src/data/blueprints/types';
import { loadSyllabus } from '../../../src/data/syllabus';
import type { ClassLevel, SubjectId } from '../../../src/data/types';
import { loadBank, type LoadedBank } from '../../../src/practice/bank';
import type { BankDef, BankItem, BankQuestion } from '../../../src/practice/bank/types';
import { tryQuestion } from '../../../src/practice/gen/engine';
import { pickGenerated } from '../../../src/practice/gen/mix';
import { bankFormatOf, FORMATS, type FormatChoice } from '../../../src/practice/gen/teacher';
import { seededRng } from '../../../src/practice/questions';

export const SUBJECTS: SubjectId[] = ['physics', 'chemistry', 'mathematics', 'computerscience'];
export const LEVELS: ClassLevel[] = ['XI', 'XII'];

export interface TopicRef {
  subject: SubjectId;
  level: ClassLevel;
  unit: number;
  topic: string;
  name: string;
  key: string;
  /** Parts asked in the papers, from the public report. */
  asked: number;
}

/** How often each topic is asked, read from the public report, which holds counts and no wording. */
export function askedCounts(): Map<string, number> {
  const text = fs.readFileSync(path.resolve(__dirname, '../../../reports/question-analysis.md'), 'utf8');
  const out = new Map<string, number>();
  const titles: Record<string, SubjectId> = { Physics: 'physics', Chemistry: 'chemistry', Mathematics: 'mathematics', 'Computer Science': 'computerscience' };
  let subject: SubjectId | null = null;
  const from = text.indexOf('### By topic');
  for (const line of text.slice(from).split('\n')) {
    const heading = /^#### (.+)$/.exec(line);
    if (heading) subject = titles[heading[1].trim()] ?? null;
    const row = /^\| (XI|XII) \| (\d+)([a-z]) .*?\| (\d+) \|/.exec(line);
    if (row && subject) out.set(`${subject} ${row[1]} ${row[2]}${row[3]}`, Number(row[4]));
  }
  return out;
}

export async function allTopics(): Promise<TopicRef[]> {
  const asked = askedCounts();
  const out: TopicRef[] = [];
  for (const subject of SUBJECTS) {
    const syllabus = await loadSyllabus(subject);
    for (const cls of syllabus.classes) {
      for (const unit of cls.units) {
        for (const topic of unit.topics) {
          const key = `${subject} ${cls.level} ${unit.number}${topic.key}`;
          out.push({ subject, level: cls.level, unit: unit.number, topic: topic.key, name: topic.name, key, asked: asked.get(key) ?? 0 });
        }
      }
    }
  }
  return out;
}

/** The top quarter by how often the papers ask them, as Task 3B defines "most asked". */
export function mostAsked(topics: TopicRef[]): Set<string> {
  const sorted = [...topics].sort((a, b) => b.asked - a.asked);
  return new Set(sorted.slice(0, Math.ceil(topics.length / 4)).map((t) => t.key));
}

export function factCount(f: Facts | undefined): number {
  if (!f) return 0;
  return (['ar', 'define', 'recall', 'reason', 'compare', 'truths', 'explain', 'long', 'cases', 'draw'] as const).reduce((sum, k) => sum + ((f[k] as unknown[] | undefined)?.length ?? 0), 0);
}

const skeleton = (text: string) =>
  text
    .replace(/\$[^$]*\$/g, ' $ ')
    .replace(/[−-]?\d[\d.,]*(\s*×\s*10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)?/g, '#')
    .replace(/\s+/g, ' ')
    .trim();

/** The setting of a numerical: a tag where the blueprint gives one, otherwise its wording with the numbers taken out. */
export const contextOf = (item: BankItem): string => {
  const tag = item.generated as (BankItem['generated'] & { context?: string }) | undefined;
  if (tag?.context) return tag.context;
  return item.form === 'numeric' ? skeleton(item.text) : '';
};

/** What makes a question's shape: its blueprint, what it solves for, its format and its setting. New values alone don't change it. */
export function structureOf(item: BankItem): string {
  const tag = item.generated;
  const blueprint = tag?.blueprint ?? item.id;
  const format = tag?.format ?? item.type;
  const unknown = item.form === 'numeric' ? item.parts.map((p) => p.question.unknown).join('+') : '';
  return [blueprint, unknown, format, contextOf(item)].join('|');
}

const words = (text: string) =>
  new Set(
    text
      .toLowerCase()
      .replace(/\$[^$]*\$/g, ' ')
      .replace(/[^a-z]+/g, ' ')
      .trim()
      .split(' ')
      .filter((w) => w.length > 2),
  );

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size && !b.size) return 1;
  let both = 0;
  for (const x of a) if (b.has(x)) both++;
  return both / (a.size + b.size - both);
}

/** 0 means consecutive questions read alike, 100 means they share no wording and no structure. */
export function varietyScore(items: BankItem[]): number | null {
  if (items.length < 2) return null;
  let sum = 0;
  for (let i = 1; i < items.length; i++) {
    const wording = jaccard(words(items[i - 1].text), words(items[i].text));
    const sameStructure = structureOf(items[i - 1]) === structureOf(items[i]) ? 1 : 0;
    const sameBlueprint = items[i - 1].generated?.blueprint === items[i].generated?.blueprint ? 1 : 0;
    sum += 0.5 * wording + 0.25 * sameStructure + 0.25 * sameBlueprint;
  }
  return Math.round((1 - sum / (items.length - 1)) * 100);
}

export interface TopicSupply {
  ref: TopicRef;
  blueprints: number;
  bank: number;
  facts: number;
  structures: number;
  contexts: number;
  numericBlueprints: number;
  /** Questions from the real picker before a structure comes round again. */
  toStructureRepeat: number;
  /** Smallest gap between two uses of a structure in the run. */
  smallestGap: number | null;
  /** Distinct questions the real picker could give, up to the cap. */
  toIdenticalRepeat: number;
  variety: number | null;
  bankByFormat: Record<string, number>;
  bankOrigin?: Record<string, number>;
  bankByDifficulty: Record<string, number>;
  bankCells: Record<string, number>;
  blueprintFormats: Record<string, number>;
}

const CAP = 200;
const STRUCTURE_SEEDS = 60;

export interface Loaded {
  sets: Map<string, LoadedBlueprints>;
  banks: Map<string, LoadedBank>;
}

export async function loadAll(): Promise<Loaded> {
  const sets = new Map<string, LoadedBlueprints>();
  const banks = new Map<string, LoadedBank>();
  for (const subject of SUBJECTS) {
    for (const level of LEVELS) {
      sets.set(`${subject} ${level}`, await loadBlueprints(subject, level));
      banks.set(`${subject} ${level}`, await loadBank(subject, level));
    }
  }
  return { sets, banks };
}

export const inTopic = <T extends { unit: number; topic: string }>(list: T[], ref: TopicRef) => list.filter((x) => x.unit === ref.unit && x.topic === ref.topic);

export function measureTopic(ref: TopicRef, all: Loaded): TopicSupply {
  const set = all.sets.get(`${ref.subject} ${ref.level}`)!;
  const bank = all.banks.get(`${ref.subject} ${ref.level}`)!;
  const pool: Blueprint[] = inTopic(set.blueprints, ref);
  const defs: BankDef[] = inTopic(bank.defs, ref);
  const structures = new Set<string>();
  const contexts = new Set<string>();
  for (const bp of pool) {
    // Enough to see each setting of the engine's blueprints, which number in the thousands.
    for (let k = 1; k <= (bp.family ? 14 : STRUCTURE_SEEDS); k++) {
      const q = tryQuestion(bp, k * 7919, set.names(bp));
      if (!q) continue;
      structures.add(structureOf(q.item));
      const c = contextOf(q.item);
      if (c) contexts.add(c);
    }
  }
  // The real picker, as a student's or teacher's request would use it, averaged over a few runs.
  let toStructure = 0;
  let toIdentical = 0;
  let variety = 0;
  let varietyRuns = 0;
  let gap: number | null = null;
  const RUNS = 3;
  for (let run = 1; run <= RUNS; run++) {
    const picked: BankQuestion[] = pool.length ? pickGenerated(set, pool, { count: CAP, rng: seededRng(run * 101) }) : [];
    const lastAt = new Map<string, number>();
    let firstRepeat = picked.length;
    picked.forEach((q, i) => {
      const s = structureOf(q.item);
      const before = lastAt.get(s);
      if (before !== undefined) {
        if (firstRepeat === picked.length) firstRepeat = i;
        gap = gap === null ? i - before : Math.min(gap, i - before);
      }
      lastAt.set(s, i);
    });
    toStructure += firstRepeat;
    toIdentical += picked.length;
    const score = varietyScore(picked.slice(0, 40).map((q) => q.item));
    if (score !== null) {
      variety += score;
      varietyRuns++;
    }
  }
  const bankByFormat: Record<string, number> = {};
  const bankByDifficulty: Record<string, number> = {};
  const bankCells: Record<string, number> = {};
  const bankOrigin: Record<string, number> = { written: 0, facts: 0, compiled: 0 };
  for (const d of defs) {
    bankOrigin[d.origin ?? 'written']++;
    const f = bankFormatOf(d);
    bankByFormat[f] = (bankByFormat[f] ?? 0) + 1;
    bankByDifficulty[d.difficulty] = (bankByDifficulty[d.difficulty] ?? 0) + 1;
    bankCells[`${f}|${d.difficulty}`] = (bankCells[`${f}|${d.difficulty}`] ?? 0) + 1;
  }
  const blueprintFormats: Record<string, number> = {};
  for (const bp of pool) blueprintFormats[bp.format] = (blueprintFormats[bp.format] ?? 0) + 1;
  return {
    ref,
    blueprints: pool.length,
    bank: defs.length,
    facts: factCount(FACT_BOOK.get(`${ref.subject} ${ref.level} ${ref.unit}${ref.topic}`)),
    structures: structures.size,
    contexts: contexts.size,
    numericBlueprints: pool.filter((b) => b.type === 'numerical').length,
    toStructureRepeat: Math.round(toStructure / RUNS),
    smallestGap: gap,
    toIdenticalRepeat: Math.round(toIdentical / RUNS),
    variety: varietyRuns ? Math.round(variety / varietyRuns) : null,
    bankByFormat,
    bankOrigin,
    bankByDifficulty,
    bankCells,
    blueprintFormats,
  };
}

/** Every format this app lets you filter by, for a subject. */
export const formatsFor = (subject: SubjectId): FormatChoice[] => FORMATS.filter((f) => !f.cs || subject === 'computerscience').map((f) => f.key);
