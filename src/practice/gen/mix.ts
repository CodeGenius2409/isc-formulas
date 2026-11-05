// How generated questions join the bank's: the share you've asked for, what that comes to, and which blueprints fill it.
import type { Blueprint } from '../../data/blueprints/types';
import type { LoadedBlueprints } from '../../data/blueprints';
import { createStore } from '../../lib/store';
import { readJson, writeJson } from '../../lib/storage';
import type { Rng } from '../questions';
import type { BankQuestion } from '../bank/types';
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

export interface PickOptions {
  count: number;
  /** Relative marks for each unit. Units not listed count as one. */
  weights?: Map<number, number>;
  rng: Rng;
  /** Blueprints already used, so a paper doesn't lean on one twice while there are others. */
  used?: Set<string>;
  /** Questions already taken, so none appears twice. */
  seenText?: Set<string>;
  /** Roughly this share should be CBQ-style, where some are on offer. */
  cbqShare?: number;
}

function shuffled<T>(list: readonly T[], rng: Rng): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const textOf = (q: BankQuestion) => q.item.text + (q.item.form === 'output' ? q.item.code : '');

/** Draws questions from a pool of blueprints, spreading them across units by weight. Fewer come back if the pool is empty. */
export function pickGenerated(set: LoadedBlueprints, pool: Blueprint[], options: PickOptions): BankQuestion[] {
  const { count, weights, rng, used = new Set<string>(), seenText = new Set<string>(), cbqShare = 0 } = options;
  const out: BankQuestion[] = [];
  if (!pool.length) return out;
  const given = new Map<number, number>();
  const wantCbq = Math.round(count * cbqShare);
  let cbqTaken = 0;
  let tries = 0;
  while (out.length < count && tries < count * 40) {
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
    const text = textOf(question);
    if (seenText.has(text)) continue;
    seenText.add(text);
    used.add(bp.id);
    given.set(unit, (given.get(unit) ?? 0) + 1);
    if (bp.style === 'cbq-style') cbqTaken++;
    out.push(question);
  }
  return out;
}
