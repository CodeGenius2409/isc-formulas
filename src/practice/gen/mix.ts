// How generated questions join the bank's: the share you've asked for, what that comes to, and which blueprints fill it.
import type { Blueprint } from '../../data/blueprints/types';
import type { LoadedBlueprints } from '../../data/blueprints';
import { createStore } from '../../lib/store';
import { readJson, writeJson } from '../../lib/storage';
import type { Rng } from '../questions';
import type { SubjectId } from '../../data/types';
import type { BankDef, BankQuestion, BankType, QuestionFormat } from '../bank/types';
import { generatedQuestion } from './engine';

const shareStore = (key: string, start: number) => createStore<number>(readJson<number>(key, start), (value) => writeJson(key, value));

/** The last value is kept separately for each use, as a student and a teacher want different things. */
export const practiceShareStore = shareStore('isc-gen-share-practice', 35);
export const paperShareStore = shareStore('isc-gen-share-paper', 50);
export const teacherShareStore = shareStore('isc-gen-share-teacher', 50);
export const paperUsesGeneratedStore = createStore<boolean>(readJson<boolean>('isc-gen-paper-on', false), (value) => writeJson('isc-gen-paper-on', value));

/**
 * The share of CBQ-style questions, from the recent papers in the analysis: about three in ten of the sub-parts in
 * the 2025 to 2027 board and specimen papers carry a competency tag. See reports/question-analysis.md.
 */
export const CBQ_SHARE = 0.3;

export const clampShare = (share: number): number => Math.max(0, Math.min(100, Math.round(share / 5) * 5));

/** How many of a count should be generated, at a share. */
export const generatedCount = (count: number, share: number): number => Math.round((count * clampShare(share)) / 100);

export interface SharePlan {
  /** The share in force, raised if the bank can't supply the rest. */
  share: number;
  /** Set when the share had to rise. Says why, in words. */
  raised?: string;
  questions: number;
  generated: number;
  marks: number;
  generatedMarks: number;
}

export interface SlotCount {
  marks: number;
  count: number;
  /** Of `count`, how many the bank can supply. */
  bankHas: number;
  /** Marks that count per question, for "any two" sections. */
  worth?: number;
}

/** What a share comes to over a list of slots, and the lowest share the bank allows. */
export function planShare(slots: SlotCount[], wanted: number): SharePlan {
  let share = clampShare(wanted);
  let lowest = 0;
  for (let s = 0; s <= 100; s += 5) {
    if (slots.every((slot) => slot.count - generatedCount(slot.count, s) <= slot.bankHas)) {
      lowest = s;
      break;
    }
    lowest = 100;
  }
  let raised: string | undefined;
  if (share < lowest) {
    raised = `The bank doesn’t have enough questions for this, so at least ${lowest}% has to be generated.`;
    share = lowest;
  }
  const counts = slots.map((slot) => ({ slot, gen: generatedCount(slot.count, share) }));
  return {
    share,
    raised,
    questions: slots.reduce((sum, s) => sum + s.count, 0),
    generated: counts.reduce((sum, c) => sum + c.gen, 0),
    marks: slots.reduce((sum, s) => sum + s.count * (s.worth ?? s.marks), 0),
    generatedMarks: Math.round(counts.reduce((sum, c) => sum + c.gen * (c.slot.worth ?? c.slot.marks), 0)),
  };
}

export function describePlan(plan: SharePlan): string {
  if (plan.generated === 0) return 'Every question will come from the bank.';
  if (plan.generated === plan.questions) return `All ${plan.questions} questions (${plan.marks} marks) will be generated.`;
  return `About ${plan.generated} of ${plan.questions} questions (${plan.generatedMarks} of ${plan.marks} marks) will be generated.`;
}

/** Seeds tried for each blueprint when looking for every question it can give. */
export const PROBE_SEEDS = 150;

/** What has been used lately, so that a picker can choose fresh facts first. It only ever orders: it never leaves a paper short. */
export interface Freshness {
  /** Used too recently to come back yet. */
  resting: (keys: string[]) => boolean;
  /** When any of these was last used, or 0 if never. */
  lastSeen: (keys: string[]) => number;
}

/** A Freshness from a list of when each key was used, where anything on the list is resting. */
export function usedFreshness(used: Map<string, number>, also?: Freshness): Freshness {
  return {
    resting: (keys) => keys.some((k) => used.has(k)) || Boolean(also?.resting(keys)),
    lastSeen: (keys) => Math.max(0, also?.lastSeen(keys) ?? 0, ...keys.map((k) => used.get(k) ?? 0)),
  };
}

/** What a history keeps a question under: its facts, or for a numerical its blueprint, or else its own id. */
export function historyKeys(q: { formulaId: string; kind: string; item?: { facts?: string[]; form?: string; parts?: { question: { unknown: string } }[]; generated?: { blueprint: string } } }): string[] {
  if (q.kind !== 'bank') return [`formula:${q.formulaId}`];
  if (q.item?.facts?.length) return q.item.facts;
  if (!q.item?.generated) return [q.formulaId];
  // A numerical is remembered by its structure: the same blueprint asking for something else is a different question.
  const unknowns = q.item.parts?.map((p) => p.question.unknown).join('+');
  return [`bp:${q.item.generated.blueprint}${unknowns ? `|${unknowns}` : ''}`];
}

/** What a fixed question rests under. One frozen from a blueprint rests with the structure it shares, as the generator's do. */
export const defKeys = (d: BankDef): string[] => (d.facts?.length ? d.facts : d.shape ? [`bp:${d.shape}`] : [d.id]);

export interface PickOptions {
  count: number;
  /** Relative marks for each unit. Units not listed count as one. */
  weights?: Map<number, number>;
  rng: Rng;
  /** Blueprints already used, so a paper doesn't lean on one twice while there are others. */
  used?: Set<string>;
  /** Questions already taken, so none appears twice. */
  seenText?: Set<string>;
  /** Facts already asked, so none is asked twice, even in another format. */
  seenFacts?: Set<string>;
  /** Roughly this share should be CBQ-style, where some are on offer. */
  cbqShare?: number;
  /** Chooses unseen facts first, then the least recently seen. */
  fresh?: Freshness;
  /** Stop when the unseen ones run out, so that the caller can try other sources first. */
  freshOnly?: boolean;
  /** Structures already in this paper or set, so that none comes back with the same setting. */
  seenStructures?: Set<string>;
}

/** How many of the last questions must differ in structure, and in setting. */
const STRUCTURE_WINDOW = 10;
const CONTEXT_WINDOW = 3;

/** The next blueprint: the format furthest behind its share in the papers, then the way of asking used least, then one not used yet. */
function chooseBlueprint(list: Blueprint[], formats: Map<string, number>, families: Map<string, number>, used: Set<string>, rng: Rng): Blueprint {
  const share = FORMAT_SHARE[list[0].subject] ?? {};
  const present = shuffled([...new Set(list.map((b) => b.format))], rng);
  let format = present[0];
  let best = -Infinity;
  for (const f of present) {
    const gap = (share[f] ?? 1) / ((formats.get(f) ?? 0) + 1);
    if (gap > best) {
      best = gap;
      format = f;
    }
  }
  const ofFormat = shuffled(list.filter((b) => b.format === format), rng);
  const least = Math.min(...ofFormat.map((b) => families.get(b.family ?? b.id) ?? 0));
  const quiet = ofFormat.filter((b) => (families.get(b.family ?? b.id) ?? 0) === least);
  return quiet.find((b) => !used.has(b.id)) ?? ofFormat.find((b) => !used.has(b.id)) ?? quiet[0];
}

function shuffled<T>(list: readonly T[], rng: Rng): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** What makes two questions the same: not just the words, as "Which of these is correct?" has many different questions. */
export function questionKey(q: BankQuestion): string {
  const { item } = q;
  // Where the figure holds the data, two questions with the same words and different figures are different questions.
  const data = item.diagram && (item.diagram.kind === 'table' || item.diagram.kind === 'graph') ? JSON.stringify(item.diagram) : '';
  if (item.form === 'output') return item.text + item.code;
  // Where the stem says it all, new wrong options don't make a new question. "Which statement is true?" is the opposite case.
  if (item.form === 'mcq' && (item.generated?.family || item.origin === 'compiled')) return item.text + data;
  if (item.form === 'mcq') return `${item.text}|${item.options.map((o) => o.text).sort().join('|')}${data}`;
  if (item.form === 'numeric') return `${item.text}|${item.parts.map((p) => p.ask).join('|')}${data}`;
  return item.text + data;
}

/** The format of a bank question, worked out from its type and marks, so the same filters apply to both sources. */
export function bankFormatOf(def: BankDef): QuestionFormat {
  if (def.format) return def.format;
  const byType: Partial<Record<BankType, QuestionFormat>> = { mcq: 'mcq', assertion: 'assertion', numerical: 'numerical', derivation: 'derivation', proof: 'derivation', reason: 'reason', distinguish: 'distinguish', output: 'output', error: 'error', program: 'program' };
  const direct = byType[def.type];
  if (direct) return direct;
  if (def.diagram) return 'diagram';
  if (def.marks === 1) return 'very-short';
  return def.marks >= 5 ? 'long' : 'short';
}


export const factsOf = (q: BankQuestion): string[] => q.item.facts ?? [];

/** A question's structure: its blueprint, what it asks for, its format and its setting. New numbers alone don't change it. */
export function structureKey(q: BankQuestion): string {
  const { item } = q;
  const tag = item.generated;
  const unknown = item.form === 'numeric' ? item.parts.map((p) => p.question.unknown).join('+') : '';
  // Two questions from one template on different facts aren't the same question, so a fact counts as part of the shape.
  return [tag?.blueprint ?? item.shape ?? item.id, unknown, tag?.format ?? '', tag?.context ?? item.context ?? '', item.facts?.[0] ?? ''].join('|');
}

/**
 * How often each format turns up in the papers, from the counts in reports/question-analysis.md, so that a mixed set reads
 * like a paper. The new formats take a small share of what they grew from. Numbers are relative.
 */
export const FORMAT_SHARE: Record<SubjectId, Partial<Record<QuestionFormat, number>>> = {
  physics: { numerical: 26, short: 20, 'very-short': 17, mcq: 10, statement: 3, reason: 5, derivation: 8, long: 4, diagram: 7, distinguish: 4, assertion: 2, cbq: 4, data: 4, mistake: 2, match: 1, complete: 1, order: 1, odd: 1, predict: 2 },
  chemistry: { short: 26, numerical: 12, mcq: 12, statement: 3, reason: 13, 'very-short': 6, complete: 6, match: 3, distinguish: 3, assertion: 3, cbq: 3, long: 3, derivation: 1, diagram: 1, data: 2, mistake: 2, order: 2, odd: 1, predict: 2 },
  mathematics: { numerical: 44, mcq: 20, statement: 2, assertion: 11, derivation: 9, short: 8, long: 3, 'very-short': 3, cbq: 4, data: 2, diagram: 1, mistake: 2, distinguish: 1, complete: 1, match: 1, order: 1, odd: 1 },
  computerscience: { short: 18, program: 15, 'very-short': 11, convert: 8, numerical: 4, output: 7, change: 3, trace: 3, fill: 4, mcq: 6, statement: 1, error: 3, assertion: 3, distinguish: 2, reason: 1, diagram: 1, cbq: 3, mistake: 2, match: 1, complete: 1, order: 1, odd: 1, long: 3 },
};

/** Draws questions from a pool of blueprints, spreading them across units by weight. Fewer come back if the pool is empty. */
export function pickGenerated(set: LoadedBlueprints, pool: Blueprint[], options: PickOptions): BankQuestion[] {
  const { count, weights, rng, used = new Set<string>(), seenText = new Set<string>(), seenFacts = new Set<string>(), seenStructures = new Set<string>(), cbqShare = 0, fresh, freshOnly } = options;
  const out: BankQuestion[] = [];
  if (!pool.length) return out;
  const given = new Map<number, number>();
  const formats = new Map<string, number>();
  const families = new Map<string, number>();
  const recentStructures: string[] = [];
  const recentContexts: string[] = [];
  /** Takes a question that passes every check. Later passes leave the softer ones out, rather than come back short. */
  const take = (question: BankQuestion, bp: Blueprint, strict: boolean): boolean => {
    const text = questionKey(question);
    if (seenText.has(text) || factsOf(question).some((f) => seenFacts.has(f))) return false;
    const shape = structureKey(question);
    const context = question.item.generated?.context;
    if (strict) {
      if (seenStructures.has(shape) || recentStructures.includes(shape)) return false;
      if (context && recentContexts.includes(context)) return false;
      // A blueprint with no facts of its own only has new numbers to offer, so it waits until the others have had a turn.
      if (!factsOf(question).length && used.has(bp.id)) return false;
    }
    seenText.add(text);
    for (const f of factsOf(question)) seenFacts.add(f);
    seenStructures.add(shape);
    recentStructures.push(shape);
    if (recentStructures.length > STRUCTURE_WINDOW) recentStructures.shift();
    if (context) {
      recentContexts.push(context);
      if (recentContexts.length > CONTEXT_WINDOW) recentContexts.shift();
    }
    used.add(bp.id);
    formats.set(bp.format, (formats.get(bp.format) ?? 0) + 1);
    families.set(bp.family ?? bp.id, (families.get(bp.family ?? bp.id) ?? 0) + 1);
    out.push(question);
    return true;
  };
  const wantCbq = Math.round(count * cbqShare);
  let cbqTaken = 0;
  let tries = 0;
  while (out.length < count && tries < count * 40 + pool.length * 6 + 100) {
    tries++;
    // A CBQ-style one first while the share isn't met, if any are here.
    const wantStyle = cbqTaken < wantCbq && pool.some((b) => b.style === 'cbq-style');
    const eligible = wantStyle ? pool.filter((b) => b.style === 'cbq-style') : pool;
    const units = [...new Set(eligible.map((b) => b.unit))];
    let unit = units[0];
    let bestGap = -Infinity;
    for (const u of shuffled(units, rng)) {
      const gap = (weights?.get(u) ?? 1) / ((given.get(u) ?? 0) + 1);
      if (gap > bestGap) {
        bestGap = gap;
        unit = u;
      }
    }
    const bp = chooseBlueprint(eligible.filter((b) => b.unit === unit), formats, families, used, rng);
    const seed = Math.floor(rng() * 2 ** 31);
    const question = generatedQuestion(bp, seed, set.names(bp));
    if (fresh?.resting(historyKeys(question)) || !take(question, bp, true)) {
      // So that a format with nothing left to give doesn't keep being chosen.
      formats.set(bp.format, (formats.get(bp.format) ?? 0) + 0.5);
      continue;
    }
    given.set(unit, (given.get(unit) ?? 0) + 1);
    if (bp.style === 'cbq-style') cbqTaken++;
  }
  // Chance alone rarely finds the last few, so this goes round every blueprint in turn, one seed each time, with the seeds
  // that capacity counts. Going round keeps a blueprint's questions apart, however long the set is.
  if (out.length < count) {
    const order = shuffled(pool, rng);
    for (let k = 1; k <= PROBE_SEEDS && out.length < count; k++) {
      for (const bp of order) {
        if (out.length >= count) break;
        const question = generatedQuestion(bp, k * 7919, set.names(bp));
        if (fresh?.resting(historyKeys(question))) continue;
        take(question, bp, false);
      }
    }
  }
  // Every fresh fact has gone, so the ones seen longest ago come back. There is never a shorter paper for it.
  if (out.length < count && fresh && !freshOnly) {
    const seeds = Math.min(PROBE_SEEDS, Math.max(12, Math.ceil(4000 / pool.length)));
    const candidates: { question: BankQuestion; at: number; bp: Blueprint }[] = [];
    for (const bp of shuffled(pool, rng)) {
      for (let k = 1; k <= seeds; k++) {
        const question = generatedQuestion(bp, k * 7919, set.names(bp));
        candidates.push({ question, at: fresh.lastSeen(historyKeys(question)), bp });
      }
    }
    candidates.sort((a, b) => a.at - b.at);
    for (const { question, bp } of candidates) {
      if (out.length >= count) break;
      take(question, bp, false);
    }
  }
  return out;
}

/** A fixed question's order in a pool: the formats in the papers' proportions, and hand-written ones before those made from facts or blueprints. */
export function mixedBankOrder<T extends { def: BankDef }>(pool: T[], rng: Rng): T[] {
  if (pool.length < 2) return [...pool];
  const rank = (d: BankDef) => (!d.origin || d.origin === 'written' ? 0 : d.origin === 'facts' ? 1 : 2);
  const byFormat = new Map<string, T[]>();
  for (const x of shuffled(pool, rng).sort((a, b) => rank(a.def) - rank(b.def))) {
    const key = bankFormatOf(x.def);
    byFormat.set(key, [...(byFormat.get(key) ?? []), x]);
  }
  const share = FORMAT_SHARE[pool[0].def.subject] ?? {};
  const taken = new Map<string, number>();
  const at = new Map<string, number>();
  const out: T[] = [];
  while (out.length < pool.length) {
    let best = '';
    let bestGap = -Infinity;
    for (const [format, list] of byFormat) {
      if ((at.get(format) ?? 0) >= list.length) continue;
      const gap = (share[format as QuestionFormat] ?? 1) / ((taken.get(format) ?? 0) + 1);
      if (gap > bestGap) {
        bestGap = gap;
        best = format;
      }
    }
    const i = at.get(best) ?? 0;
    out.push(byFormat.get(best)![i]);
    at.set(best, i + 1);
    taken.set(best, (taken.get(best) ?? 0) + 1);
  }
  return out;
}
