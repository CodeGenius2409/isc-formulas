// How generated questions join the bank's: the share you've asked for, what that comes to, and which blueprints fill it.
import type { Blueprint } from '../../data/blueprints/types';
import type { LoadedBlueprints } from '../../data/blueprints';
import { createStore } from '../../lib/store';
import { readJson, writeJson } from '../../lib/storage';
import type { Rng } from '../questions';
import type { BankDef, BankQuestion } from '../bank/types';
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
export function historyKeys(q: { formulaId: string; kind: string; item?: { facts?: string[]; generated?: { blueprint: string } } }): string[] {
  if (q.kind !== 'bank') return [`formula:${q.formulaId}`];
  if (q.item?.facts?.length) return q.item.facts;
  return [q.item?.generated ? `bp:${q.item.generated.blueprint}` : q.formulaId];
}

export const defKeys = (d: BankDef): string[] => (d.facts?.length ? d.facts : [d.id]);

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
  if (item.form === 'output') return item.text + item.code;
  if (item.form === 'mcq') return `${item.text}|${item.options.map((o) => o.text).sort().join('|')}`;
  if (item.form === 'numeric') return `${item.text}|${item.parts.map((p) => p.ask).join('|')}`;
  return item.text;
}

export const factsOf = (q: BankQuestion): string[] => q.item.facts ?? [];

/** Draws questions from a pool of blueprints, spreading them across units by weight. Fewer come back if the pool is empty. */
export function pickGenerated(set: LoadedBlueprints, pool: Blueprint[], options: PickOptions): BankQuestion[] {
  const { count, weights, rng, used = new Set<string>(), seenText = new Set<string>(), seenFacts = new Set<string>(), cbqShare = 0, fresh, freshOnly } = options;
  const out: BankQuestion[] = [];
  if (!pool.length) return out;
  const given = new Map<number, number>();
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
    const inUnit = shuffled(eligible.filter((b) => b.unit === unit), rng);
    const bp = inUnit.find((b) => !used.has(b.id)) ?? inUnit[0];
    const seed = Math.floor(rng() * 2 ** 31);
    const question = generatedQuestion(bp, seed, set.names(bp));
    const text = questionKey(question);
    if (seenText.has(text) || factsOf(question).some((f) => seenFacts.has(f)) || fresh?.resting(historyKeys(question))) continue;
    seenText.add(text);
    for (const f of factsOf(question)) seenFacts.add(f);
    used.add(bp.id);
    given.set(unit, (given.get(unit) ?? 0) + 1);
    if (bp.style === 'cbq-style') cbqTaken++;
    out.push(question);
  }
  // Chance alone rarely finds the last few, so this goes through every blueprint in turn, with the seeds that capacity counts.
  if (out.length < count) {
    for (const bp of shuffled(pool, rng)) {
      for (let k = 1; k <= PROBE_SEEDS && out.length < count; k++) {
        const question = generatedQuestion(bp, k * 7919, set.names(bp));
        const text = questionKey(question);
        if (seenText.has(text) || factsOf(question).some((f) => seenFacts.has(f)) || fresh?.resting(historyKeys(question))) continue;
        seenText.add(text);
        for (const f of factsOf(question)) seenFacts.add(f);
        used.add(bp.id);
        out.push(question);
      }
      if (out.length >= count) break;
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
      const text = questionKey(question);
      if (seenText.has(text) || factsOf(question).some((f) => seenFacts.has(f))) continue;
      seenText.add(text);
      for (const f of factsOf(question)) seenFacts.add(f);
      used.add(bp.id);
      out.push(question);
    }
  }
  return out;
}
