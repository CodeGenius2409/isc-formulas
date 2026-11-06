// What a blueprint builds a question with: seeded dice, the solver registry, and the checks that make a question
// presentable. Everything here is deterministic for a given seed.
import type { Body, McqBody, NumericBody, TheoryBody } from '../../data/blueprints/types';
import { getEntry } from '../../solver/registry';
import { solve, type SolveInput, type Step } from '../../solver/solve';
import { unitLabel } from '../../solver/unit-label';
import { roundSig } from '../../solver/units';
import { buildParts } from '../bank/index';
import type { BankOption, MarkPoint, NumericPart, NumericPartDef } from '../bank/types';
import type { Rng } from '../questions';

/** These values don't make a good question. The engine draws again. */
export class Retry extends Error {}

const SUPER: Record<string, string> = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };

/** A tidy number for question text and options: at most `digits` significant figures, with × 10ⁿ when large or small. */
export function tidy(value: number, digits = 3): string {
  if (!Number.isFinite(value)) throw new Retry('not a finite number');
  if (value === 0) return '0';
  value = roundSig(value, digits);
  const size = Math.abs(value);
  if (size >= 1e5 || size < 1e-3) {
    const [mantissa, power] = value.toExponential(digits - 1).split('e');
    return `${Number(mantissa)} × 10${[...String(Number(power))].map((c) => SUPER[c]).join('')}`;
  }
  return String(Number(value.toPrecision(digits)));
}

export interface Solved {
  /** In the unit asked for. */
  value: number;
  unit: string;
  text: string;
  steps: Step[];
}

export interface Mistake {
  /** What the slip is, for the explanation after marking. */
  slip: string;
  value: number;
}

export class Gen {
  /** The question's seed. Most blueprints leave choices to the dice, and a few need it. */
  seed = 0;
  constructor(
    readonly rng: Rng,
    readonly subject: string,
    readonly id: string,
  ) {}

  retry(why = 'try again'): never {
    throw new Retry(why);
  }

  int(low: number, high: number): number {
    return low + Math.floor(this.rng() * (high - low + 1));
  }

  /** A value on a regular step, written without floating-point dust. */
  step(low: number, high: number, by: number): number {
    const steps = Math.round((high - low) / by);
    return Number((low + this.int(0, steps) * by).toPrecision(10));
  }

  pick<T>(list: readonly T[]): T {
    if (!list.length) this.retry('nothing to pick from');
    return list[Math.floor(this.rng() * list.length)];
  }

  shuffle<T>(list: readonly T[]): T[] {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  sample<T>(list: readonly T[], count: number): T[] {
    if (list.length < count) this.retry('too few to sample');
    return this.shuffle(list).slice(0, count);
  }

  chance(p: number): boolean {
    return this.rng() < p;
  }

  sign(): number {
    return this.chance(0.5) ? 1 : -1;
  }

  /** One value from the solver registry, by the same route the solver shows you. */
  solve(use: string, find: string, given: Record<string, number | [number, string]>, unit?: string): Solved {
    const entry = getEntry(use);
    if (!entry) throw new Error(`${this.id}: no solver entry ${use}`);
    const inputs: Record<string, SolveInput> = {};
    for (const v of entry.vars) {
      if (v.symbol === find) continue;
      const spec = given[v.symbol];
      if (spec === undefined) {
        const fixed = v.value ?? (v.isConstant ? v.gen[0] : undefined);
        if (fixed === undefined) throw new Error(`${this.id}: ${use} needs ${v.symbol}`);
        inputs[v.symbol] = { raw: String(fixed), unit: v.unit };
      } else if (typeof spec === 'number') {
        inputs[v.symbol] = { raw: String(spec), unit: v.unit };
      } else {
        inputs[v.symbol] = { raw: String(spec[0]), unit: spec[1] };
      }
    }
    const outcome = solve(entry, find, inputs, { resultUnit: unit, exact: this.subject === 'mathematics' });
    if (!outcome.ok) this.retry('the solver refused these values');
    const root = outcome.roots.filter((r) => !r.rejected)[0];
    if (!root || !Number.isFinite(root.shown)) this.retry('no usable root');
    return { value: root.shown, unit: root.unit, text: root.text, steps: outcome.steps };
  }

  /** Parts worked by the solver registry, written the same way as the bank's numericals. */
  parts(defs: NumericPartDef[], values: Record<string, number>): NumericPart[] {
    const built = buildParts({ id: this.id, subject: this.subject as never, parts: defs }, values, this.rng);
    if (!built) this.retry('the solver refused these values');
    return built;
  }

  numeric(text: string, defs: NumericPartDef[], values: Record<string, number>, extras: Partial<NumericBody> = {}): NumericBody {
    return { form: 'numeric', text: fillIn(text, values), parts: this.parts(defs, values), ...extras };
  }

  /** A part answered by a number worked out here. Used where no registry entry applies, as in Mathematics. */
  answerPart(ask: string, answer: number, marks: number, steps: Step[], unit = '', text?: string): NumericPart {
    if (!Number.isFinite(answer)) this.retry('not a finite answer');
    return {
      ask,
      marks,
      question: {
        kind: 'numeric',
        formulaId: this.id,
        unknown: 'answer',
        unknownName: 'answer',
        unknownTex: 'x',
        givens: [],
        answers: [answer],
        unit,
        unitChoices: unit ? [unit] : [],
        tolerance: 0.01,
        steps,
        answerText: `${text ?? tidy(answer, 4)}${unit ? ` ${unitLabel(unit)}` : ''}`,
      },
    };
  }

  /** Multiple choice. The right option lands wherever the dice put it. */
  mcq(text: string, right: string | BankOption, wrong: (string | BankOption)[], extras: Partial<McqBody> = {}): McqBody {
    const norm = (o: string | BankOption): BankOption => (typeof o === 'string' ? { text: o } : o);
    const correct = norm(right);
    const others = wrong.map(norm);
    const seen = new Set([correct.text]);
    for (const o of others) {
      if (seen.has(o.text)) this.retry('two options read the same');
      seen.add(o.text);
    }
    const options = this.shuffle([correct, ...others]);
    return { form: 'mcq', text, options, answer: options.indexOf(correct), ...extras };
  }

  /**
   * Multiple choice on a number. Wrong options come only from realistic slips, never from random numbers, and
   * must differ from the answer and each other once rounded as a student would see them.
   */
  mcqNumber(text: string, value: number, unit: string, mistakes: Mistake[], extras: Partial<McqBody> & { digits?: number; working?: string } = {}): McqBody {
    const { digits = 3, working, ...rest } = extras;
    const show = (v: number) => `${tidy(v, digits)}${unit ? `${unit === '°' ? '' : ' '}${unit}` : ''}`;
    const right = show(value);
    const seen = new Set([right]);
    const usable: Mistake[] = [];
    for (const m of mistakes) {
      if (!Number.isFinite(m.value) || m.value === 0) continue;
      if (Math.abs(m.value - value) <= Math.abs(value) * 0.01) continue;
      const shown = show(m.value);
      if (seen.has(shown)) continue;
      seen.add(shown);
      usable.push(m);
    }
    if (usable.length < 3) this.retry('too few distinct realistic mistakes');
    const chosen = usable.slice(0, 3);
    const why = [working, `The other options come from common slips: ${chosen.map((m) => `${show(m.value)} if you ${m.slip}`).join('; ')}.`].filter(Boolean).join(' ');
    return this.mcq(text, right, chosen.map((m) => show(m.value)), { ...rest, why: rest.why ?? why });
  }

  theory(text: string, points: (string | [string, number])[], extras: Partial<TheoryBody> = {}): TheoryBody {
    return { form: 'theory', text, points: toPoints(points), ...extras };
  }
}

export function toPoints(list: (string | [string, number])[]): MarkPoint[] {
  return list.map((p) => (typeof p === 'string' ? { text: p, marks: 1 } : { text: p[0], marks: p[1] }));
}

export function fillIn(text: string, values: Record<string, number | string>): string {
  return text.replace(/\{([A-Za-z]\w*)\}/g, (whole, name: string) => (name in values ? String(values[name]) : whole));
}

/** The whole question and answer as text, for checks and for a question with parts. */
export function bodyMarks(body: Body): number {
  switch (body.form) {
    case 'numeric':
      return body.parts.reduce((sum, p) => sum + p.marks, 0);
    case 'theory':
      return body.points.reduce((sum, p) => sum + p.marks, 0);
    default:
      return 0;
  }
}
