// The compact way blueprint files are written. `num` and `mcqNum` make numericals answered by the solver registry.
// `facts` turns a topic's knowledge base into blueprints for definitions, reasons, comparisons, assertion and reason,
// and case studies, all written fresh from the syllabus.
import type { DiagramSpec } from '../../practice/bank/diagram';
import { ASSERTION_OPTIONS } from '../../practice/bank/define';
import type { BankType, Difficulty, NumericPartDef, SimulatorRef } from '../../practice/bank/types';
import { unitLabel } from '../../solver/unit-label';
import { fillIn, tidy, type Gen, type Mistake } from '../../practice/gen/gen';
import type { ClassLevel, SubjectId } from '../types';
import type { Blueprint, Body, Format, Style } from './types';

export type Place = [unit: number, topic: string, marks: number, difficulty: Difficulty];
type Range = [number, number, number] | number[];

export type Values = Record<string, number>;

interface NumVariant {
  text: string;
  parts: NumericPartDef[];
  /** When this variant needs a different figure from the others. */
  diagram?: (v: Values) => DiagramSpec;
}

export interface NumSpec {
  /** Words with {name} for each value. {scene} comes from `scenes`, which changes the setting and nothing else. */
  text?: string;
  parts?: NumericPartDef[];
  /** Different ways of asking, such as which quantity is unknown. */
  variants?: NumVariant[];
  vars: Record<string, Range>;
  /** Values worked out from the others. */
  derive?: (v: Values) => Values;
  when?: (v: Values) => boolean;
  scenes?: string[];
  style?: Style;
  format?: Format;
  diagram?: (v: Values) => DiagramSpec;
  sim?: (v: Values) => SimulatorRef;
}

export interface McqNumSpec {
  text: string;
  vars: Record<string, Range>;
  derive?: (v: Values) => Values;
  when?: (v: Values) => boolean;
  scenes?: string[];
  use: string;
  find: string;
  given: Record<string, string>;
  unit?: string;
  /** Realistic wrong answers, in the same unit as the answer. Random numbers never go here. */
  mistakes: (v: Values, answer: number) => [slip: string, value: number][];
  style?: Style;
  diagram?: (v: Values) => DiagramSpec;
  sim?: (v: Values) => SimulatorRef;
  digits?: number;
}

/** A topic's knowledge, written in the app's own words. */
export interface Facts {
  /** Term, then what it means. Extra sentences make it worth two marks. */
  define?: [term: string, ...meaning: string[]][];
  /** A one-mark concept question: question, right answer, then three wrong ones. */
  recall?: [question: string, right: string, wrong1: string, wrong2: string, wrong3: string][];
  /** Something to explain, then the marking points. */
  reason?: [claim: string, ...because: string[]][];
  /** Two things, then rows that compare them. */
  compare?: [a: string, b: string, ...rows: [string, string][]][];
  /** A true statement and a false version of it. They feed "which is correct" and assertion and reason. */
  truths?: [right: string, wrong: string][];
  /** A short-answer question, then its marking points. */
  explain?: [question: string, ...points: string[]][];
  /** A long answer or derivation, then its marking points. */
  long?: [question: string, ...points: (string | [string, number])[]][];
  /** Figures for long answers, by the words of the question. These have symbols only, so they never change. */
  figures?: Record<string, DiagramSpec>;
  /** A real-life case: the situation, then asks with their answers and marks. */
  cases?: { scene: string; parts: [ask: string, answer: string, marks: number][] }[];
  /** Diagram-based: what to draw, then what earns marks. */
  draw?: [question: string, ...points: string[]][];
}

const CODE: Record<SubjectId, string> = { physics: 'p', chemistry: 'c', mathematics: 'm', computerscience: 'k' };

function drawValues(g: Gen, vars: Record<string, Range>): Values {
  const out: Values = {};
  for (const [name, spec] of Object.entries(vars)) {
    out[name] = spec.length === 3 ? g.step(spec[0], spec[1], spec[2]) : g.pick(spec);
  }
  return out;
}

/** Words shown for each way of asking, so the same fact reads differently from one question to the next. */
const ASK_REASON = ['Give a reason: {x}', 'Explain why: {x}', 'Account for the following: {x}', 'Why is this so? {x}'];
const ASK_DEFINE = ['Define {x}.', 'What is meant by {x}?', 'State what is meant by {x}.'];
const ASK_COMPARE = ['Distinguish between {a} and {b}.', 'State the differences between {a} and {b}.', 'Give the difference between {a} and {b}.'];

const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function blueprintsFor(subject: SubjectId, level: ClassLevel) {
  const prefix = `${CODE[subject]}${level === 'XII' ? '12' : '11'}`;
  const base = (key: string, [unit, topic, marks, difficulty]: Place, type: BankType, format: Format, style: Style) => ({
    id: `${prefix}-${unit}${topic}-${key}`,
    subject,
    level,
    unit,
    topic,
    marks,
    type,
    difficulty,
    format,
    style,
  });

  const custom = (key: string, place: Place, opts: { type: BankType; format: Format; style?: Style; python?: 1 }, make: (g: Gen) => Body): Blueprint => ({
    ...base(key, place, opts.type, opts.format, opts.style ?? 'paper-style'),
    python: opts.python,
    make,
  });

  const num = (key: string, place: Place, spec: NumSpec): Blueprint => ({
    ...base(key, place, 'numerical', spec.format ?? 'numerical', spec.style ?? 'paper-style'),
    make(g) {
      const values = drawValues(g, spec.vars);
      if (spec.derive) Object.assign(values, spec.derive(values));
      if (spec.when && !spec.when(values)) g.retry('values out of range');
      const variant: NumVariant = spec.variants ? g.pick(spec.variants) : { text: spec.text!, parts: spec.parts! };
      const scene = spec.scenes ? g.pick(spec.scenes) : '';
      const text = fillIn(fillIn(variant.text, { scene }), values);
      return { ...g.numeric(text, variant.parts, values), diagram: (variant.diagram ?? spec.diagram)?.(values), simulator: spec.sim?.(values) };
    },
  });

  const mcqNum = (key: string, place: Place, spec: McqNumSpec): Blueprint => ({
    ...base(key, place, 'mcq', 'mcq', spec.style ?? 'paper-style'),
    make(g) {
      const values = drawValues(g, spec.vars);
      if (spec.derive) Object.assign(values, spec.derive(values));
      if (spec.when && !spec.when(values)) g.retry('values out of range');
      const [part] = g.parts([{ ask: '', use: spec.use, find: spec.find, given: spec.given, unit: spec.unit, marks: 1 }], values);
      const answer = part.question.answers[0];
      const scene = spec.scenes ? g.pick(spec.scenes) : '';
      const text = fillIn(fillIn(spec.text, { scene }), values);
      const mistakes: Mistake[] = spec.mistakes(values, answer).map(([slip, value]) => ({ slip, value }));
      return { ...g.mcqNumber(text, answer, unitLabel(part.question.unit), mistakes, { digits: spec.digits ?? 3 }), diagram: spec.diagram?.(values), simulator: spec.sim?.(values) };
    },
  });

  /** Everything a topic's facts can make. */
  const facts = (unit: number, topic: string, f: Facts): Blueprint[] => {
    const out: Blueprint[] = [];
    const at = (marks: number, difficulty: Difficulty): Place => [unit, topic, marks, difficulty];
    const add = (key: string, marks: number, difficulty: Difficulty, type: BankType, format: Format, style: Style, make: (g: Gen) => Body) => out.push({ ...base(key, at(marks, difficulty), type, format, style), make });

    if (f.define && f.define.length >= 3 && (subject === 'chemistry' || subject === 'physics')) {
      const list = f.define;
      const size = Math.min(4, list.length);
      add('match', size, 2, 'short', 'very-short', 'paper-style', (g) => {
        const pairs = g.sample(list, size);
        const order = g.shuffle(pairs.map((_, i) => i));
        if (order.every((j, i) => j === i)) g.retry('the columns line up');
        const letters = 'abcd';
        const columnA = pairs.map(([term], i) => `(${i + 1}) ${term}`).join('\n');
        const columnB = order.map((j, i) => `(${letters[i]}) ${pairs[j][1]}`).join('\n');
        return g.theory(`Match each item in Column A with its description in Column B.\nColumn A\n${columnA}\nColumn B\n${columnB}`, pairs.map(([term], i): [string, number] => [`(${i + 1}) ${term} goes with (${letters[order.indexOf(i)]}).`, 1]));
      });
    }
    if (f.define?.length) {
      const list = f.define;
      add('define', 1, 1, 'definition', 'very-short', 'paper-style', (g) => {
        const [term, meaning] = g.pick(list);
        return g.theory(fillIn(g.pick(ASK_DEFINE), { x: term }), [meaning]);
      });
      const longer = list.filter((d) => d.length >= 3);
      if (longer.length) {
        add('define2', 2, 1, 'definition', 'short', 'paper-style', (g) => {
          const [term, a, b] = g.pick(longer);
          return g.theory(fillIn(g.pick(ASK_DEFINE), { x: term }), [a, b]);
        });
      }
    }
    if (f.recall?.length) {
      const list = f.recall;
      add('recall', 1, 1, 'mcq', 'mcq', 'paper-style', (g) => {
        const [q, right, a, b, c] = g.pick(list);
        return g.mcq(q, right, [a, b, c]);
      });
    }
    if (f.reason?.length) {
      for (const marks of [1, 2, 3]) {
        const list = f.reason.filter((r) => r.length - 1 === marks);
        if (!list.length) continue;
        add(`reason${marks}`, marks, marks > 1 ? 2 : 1, 'reason', 'reason', 'paper-style', (g) => {
          const [claim, ...because] = g.pick(list);
          return g.theory(fillIn(g.pick(ASK_REASON), { x: claim }), because);
        });
      }
    }
    if (f.compare?.length) {
      for (const marks of [2, 3]) {
        const list = f.compare.filter((c) => c.length - 2 >= marks);
        if (!list.length) continue;
        add(`compare${marks}`, marks, 2, 'distinguish', 'distinguish', 'paper-style', (g) => {
          const [a, b, ...rows] = g.pick(list);
          const chosen = g.sample(rows as [string, string][], marks);
          return g.theory(fillIn(g.pick(ASK_COMPARE), { a, b }), chosen.map(([x, y]) => `${capital(a)}: ${x} ${capital(b)}: ${y}`));
        });
      }
    }
    if ((f.truths?.length ?? 0) >= 3) {
      const list = f.truths!;
      add('truth', 1, 2, 'mcq', 'mcq', 'paper-style', (g) => {
        const [picked, ...rest] = g.shuffle(list);
        return g.mcq('Which of these statements is correct?', picked[0], g.sample(rest, 3 > rest.length ? rest.length : 3).map((t) => t[1]));
      });
    }
    const reasons = (f.reason ?? []).filter((r) => r.length >= 2);
    const truths = f.truths ?? [];
    if (reasons.length && truths.length >= 2) {
      add('assertion', 1, 2, 'assertion', 'assertion', 'cbq-style', (g) => {
        const kind = g.int(1, 4);
        let assertion: string;
        let reason: string;
        const fact = g.pick(reasons);
        const [t1, t2] = g.sample(truths, 2);
        if (kind === 1) {
          assertion = fact[0];
          reason = fact[1] as string;
        } else if (kind === 2) {
          assertion = t1[0];
          reason = t2[0];
        } else if (kind === 3) {
          assertion = t1[0];
          reason = t2[1];
        } else {
          assertion = t1[1];
          reason = t2[0];
        }
        return { form: 'mcq', text: `Assertion: ${assertion}\nReason: ${reason}`, options: ASSERTION_OPTIONS.map((text) => ({ text })), answer: kind - 1 };
      });
    }
    if (f.explain?.length) {
      for (const marks of [1, 2, 3]) {
        const list = f.explain.filter((e) => e.length - 1 === marks);
        if (!list.length) continue;
        add(`explain${marks}`, marks, marks > 2 ? 2 : 1, 'short', marks === 1 ? 'very-short' : 'short', 'paper-style', (g) => {
          const [q, ...points] = g.pick(list);
          return g.theory(q, points);
        });
      }
    }
    if (f.long?.length) {
      const sums = new Map<number, typeof f.long>();
      for (const item of f.long) {
        const marks = item.slice(1).reduce<number>((sum, p) => sum + (typeof p === 'string' ? 1 : p[1]), 0);
        sums.set(marks, [...(sums.get(marks) ?? []), item]);
      }
      for (const [marks, list] of sums) {
        add(`long${marks}`, marks, marks >= 5 ? 3 : 2, 'derivation', marks >= 5 ? 'long' : 'derivation', 'paper-style', (g) => {
          const [q, ...points] = g.pick(list);
          const diagram = f.figures?.[q];
          return g.theory(q, points as (string | [string, number])[], diagram ? { diagram } : undefined);
        });
      }
    }
    if (f.draw?.length) {
      for (const marks of [1, 2, 3]) {
        const list = f.draw.filter((d) => d.length - 1 === marks);
        if (!list.length) continue;
        add(`draw${marks}`, marks, 2, 'short', 'diagram', 'paper-style', (g) => {
          const [q, ...points] = g.pick(list);
          return g.theory(q, points);
        });
      }
    }
    if (f.cases?.length) {
      const sums = new Map<number, NonNullable<Facts['cases']>>();
      for (const c of f.cases) {
        const marks = c.parts.reduce((sum, p) => sum + p[2], 0);
        sums.set(marks, [...(sums.get(marks) ?? []), c]);
      }
      for (const [marks, list] of sums) {
        add(`case${marks}`, marks, 2, 'short', 'cbq', 'cbq-style', (g) => {
          const c = g.pick(list);
          const asks = c.parts.map((p, i) => `(${['i', 'ii', 'iii', 'iv', 'v'][i]}) ${p[0]} [${p[2]}]`).join('\n');
          return g.theory(`${c.scene}\n${asks}`, c.parts.map((p, i) => [`(${['i', 'ii', 'iii', 'iv', 'v'][i]}) ${p[1]}`, p[2]]));
        });
      }
    }
    return out;
  };

  return { custom, num, mcqNum, facts, base };
}

/** A number for question text, in words a student would read. */
export const n = tidy;
