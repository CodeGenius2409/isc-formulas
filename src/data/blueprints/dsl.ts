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
import { DERIVATIONS, derivationFact } from '../derivations';

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
  answerDiagram?: (v: Values) => DiagramSpec;
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

/**
 * One concept, set out so that all four assertion and reason outcomes are correct, and always about the same thing.
 * The statement and its false version, why it's true and a false explanation, and something else true of the same
 * concept that doesn't explain the statement.
 */
export type ArNode = [concept: string, statement: string, falseStatement: string, because: string, falseBecause: string, alsoTrue: string];

/** A topic's knowledge, written in the app's own words. */
export interface Facts {
  /** Assertion and reason questions. A pair is only ever made from one concept. */
  ar?: ArNode[];
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
  /** Figures for answers, by the start of the question's words. A question that asks you to draw something gets it in the key. */
  answerFigures?: Record<string, DiagramSpec>;
  /** A real-life case: the situation, then asks with their answers and marks. */
  cases?: { scene: string; parts: [ask: string, answer: string, marks: number][] }[];
  /** Diagram-based: what to draw, then what earns marks. */
  draw?: [question: string, ...points: string[]][];
  /**
   * How facts in this topic relate, which gives assertion and reason, and "distinguish between", more good pairs.
   * "cause": truth a happens because of truth b. "same": truths a and b are about one concept, and neither explains the other.
   * "contrast": define terms a and b are worth telling apart. Truths are named by the start of their words, terms in full.
   */
  links?: Link[];
}

export type Link = [relation: 'cause' | 'same' | 'contrast', a: string, b: string];

/** Adds together several files of knowledge about one class. */
export function mergeKnowledge(...sets: Record<string, Facts>[]): Record<string, Facts> {
  const out: Record<string, Facts> = {};
  for (const set of sets) for (const [key, facts] of Object.entries(set)) out[key] = out[key] ? mergeFacts(out[key], facts) : facts;
  return out;
}

/** Every topic's merged knowledge, by "subject level unit+topic". Tests and the report read this. */
export const FACT_BOOK = new Map<string, Facts>();

const CODE: Record<SubjectId, string> = { physics: 'p', chemistry: 'c', mathematics: 'm', computerscience: 'k' };

function drawValues(g: Gen, vars: Record<string, Range>): Values {
  const out: Values = {};
  for (const [name, spec] of Object.entries(vars)) {
    // Three numbers are a range: low, high and step. A choice of three needs writing as a range, or as a longer list.
    if (spec.length === 3 && (spec[2] <= 0 || spec[1] < spec[0] || (spec[1] > spec[0] && spec[2] > spec[1] - spec[0]))) throw new Error(`${name}: [${spec.join(', ')}] isn't a range`);
    out[name] = spec.length === 3 ? g.step(spec[0], spec[1], spec[2]) : g.pick(spec);
  }
  return out;
}

/** Words shown for each way of asking, so the same fact reads differently from one question to the next. */
const ASK_REASON = ['Give a reason: {x}', 'Explain why: {x}', 'Account for the following: {x}', 'Why is this so? {x}'];
const ASK_DEFINE = ['Define {x}.', 'What is meant by {x}?', 'State what is meant by {x}.'];
const ASK_COMPARE = ['Distinguish between {a} and {b}.', 'State the differences between {a} and {b}.', 'Give the difference between {a} and {b}.'];

const capital = (text: string) => (/^\w+\(\)/.test(text) ? text : text.charAt(0).toUpperCase() + text.slice(1));

/** Adds a topic's extra knowledge to what its file already says. */
function mergeFacts(a: Facts, b: Facts | undefined): Facts {
  if (!b) return a;
  const out: Record<string, unknown> = { ...a };
  for (const [key, value] of Object.entries(b)) {
    const had = out[key];
    if (Array.isArray(had) && Array.isArray(value)) out[key] = [...had, ...value];
    else if (had && value && typeof had === 'object' && typeof value === 'object') out[key] = { ...had, ...value };
    else out[key] = value;
  }
  return out as Facts;
}

export function blueprintsFor(subject: SubjectId, level: ClassLevel, knowledge: Record<string, Facts> = {}) {
  const prefix = `${CODE[subject]}${level === 'XII' ? '12' : '11'}`;
  const used = new Set<string>();
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
      return { ...g.numeric(text, variant.parts, values), diagram: (variant.diagram ?? spec.diagram)?.(values), answerDiagram: spec.answerDiagram?.(values), simulator: spec.sim?.(values) };
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
  const facts = (unit: number, topic: string, own: Facts): Blueprint[] => {
    used.add(`${unit}${topic}`);
    const f = mergeFacts(own, knowledge[`${unit}${topic}`]);
    FACT_BOOK.set(`${subject} ${level} ${unit}${topic}`, f);
    const out: Blueprint[] = [];
    const at = (marks: number, difficulty: Difficulty): Place => [unit, topic, marks, difficulty];
    const add = (key: string, marks: number, difficulty: Difficulty, type: BankType, format: Format, style: Style, make: (g: Gen) => Body) => out.push({ ...base(key, at(marks, difficulty), type, format, style), make });
    /** A fact's name, the same in every format that asks it. */
    const fact = (text: string) => `${prefix}-${unit}${topic}:${text.slice(0, 80)}`;

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
        return g.theory(`Match each item in Column A with its description in Column B.\nColumn A\n${columnA}\nColumn B\n${columnB}`, pairs.map(([term], i): [string, number] => [`(${i + 1}) ${term} goes with (${letters[order.indexOf(i)]}).`, 1]), { facts: pairs.map(([term]) => fact(term)) });
      });
    }
    if (f.define?.length) {
      const list = f.define;
      add('define', 1, 1, 'definition', 'very-short', 'paper-style', (g) => {
        const [term, meaning] = g.pick(list);
        return g.theory(fillIn(g.pick(ASK_DEFINE), { x: term }), [meaning], { facts: [fact(term)] });
      });
      const longer = list.filter((d) => d.length >= 3);
      if (longer.length) {
        add('define2', 2, 1, 'definition', 'short', 'paper-style', (g) => {
          const [term, a, b] = g.pick(longer);
          return g.theory(fillIn(g.pick(ASK_DEFINE), { x: term }), [a, b], { facts: [fact(term)] });
        });
      }
    }
    if (f.recall?.length) {
      const list = f.recall;
      add('recall', 1, 1, 'mcq', 'mcq', 'paper-style', (g) => {
        const [q, right, a, b, c] = g.pick(list);
        return { ...g.mcq(q, right, [a, b, c]), facts: [fact(q)] };
      });
    }
    if (f.reason?.length) {
      for (const marks of [1, 2, 3]) {
        const list = f.reason.filter((r) => r.length - 1 === marks);
        if (!list.length) continue;
        add(`reason${marks}`, marks, marks > 1 ? 2 : 1, 'reason', 'reason', 'paper-style', (g) => {
          const [claim, ...because] = g.pick(list);
          return g.theory(fillIn(g.pick(ASK_REASON), { x: claim }), because, { facts: [fact(claim)] });
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
          return g.theory(fillIn(g.pick(ASK_COMPARE), { a, b }), chosen.map(([x, y]) => `${capital(a)}: ${x} ${capital(b)}: ${y}`), { facts: [fact(`${a} | ${b}`)] });
        });
      }
    }
    if ((f.truths?.length ?? 0) >= 3) {
      const list = f.truths!;
      add('truth', 1, 2, 'mcq', 'mcq', 'paper-style', (g) => {
        const [picked, ...rest] = g.shuffle(list);
        return { ...g.mcq('Which of these statements is correct?', picked[0], g.sample(rest, 3 > rest.length ? rest.length : 3).map((t) => t[1])), facts: [fact(picked[0])] };
      });
    }
    if (f.ar?.length) {
      const nodes = f.ar;
      add('assertion', 1, 2, 'assertion', 'assertion', 'cbq-style', (g) => {
        const [concept, statement, falseStatement, because, falseBecause, alsoTrue] = g.pick(nodes);
        const kind = g.int(1, 4);
        const assertion = kind === 4 ? falseStatement : statement;
        const reason = kind === 1 ? because : kind === 2 ? alsoTrue : kind === 3 ? falseBecause : g.pick([because, alsoTrue]);
        const why = [`Both are true, and the reason explains the assertion.`, `Both are true, but what explains the assertion is this: ${because}`, `The reason is false. In fact: ${because}`, `The assertion is false. In fact: ${statement}`][kind - 1];
        return { form: 'mcq', text: `Assertion: ${assertion}\nReason: ${reason}`, options: ASSERTION_OPTIONS.map((text) => ({ text })), answer: kind - 1, why, concept, facts: [fact(concept)] };
      });
    }
    const truthFor = (start: string) => f.truths?.find((t) => t[0].startsWith(start));
    const linkedTruths = (f.links ?? []).filter((l) => l[0] !== 'contrast' && truthFor(l[1]) && truthFor(l[2]));
    if (linkedTruths.length) {
      add('assertion-linked', 1, 2, 'assertion', 'assertion', 'cbq-style', (g) => {
        const [relation, a, b] = g.pick(linkedTruths);
        const [statement, falseStatement] = truthFor(a)!;
        const [other, falseOther] = truthFor(b)!;
        // A pair linked by "same" is the true pair where the reason doesn't explain. A "cause" pair is the true pair where it does.
        const answer = g.pick([relation === 'cause' ? 0 : 1, 2, 3]);
        const assertion = answer === 3 ? falseStatement : statement;
        const reason = answer === 2 ? falseOther : other;
        const why = [`Both are true, and the reason explains the assertion.`, `Both are true, but neither one explains the other.`, `The reason is false. In fact: ${other}`, `The assertion is false. In fact: ${statement}`][answer];
        return { form: 'mcq', text: `Assertion: ${assertion}\nReason: ${reason}`, options: ASSERTION_OPTIONS.map((text) => ({ text })), answer, why, concept: statement, facts: [fact(statement), fact(other)] };
      });
    }
    const termFor = (name: string) => f.define?.find((d) => d[0] === name);
    const plain = (s: string) => s.toLowerCase().replace(/\b(a|an|the)\b/g, '').replace(/s\b/g, '').replace(/\s+/g, ' ').trim();
    const alike = (x: string, y: string) => plain(x).includes(plain(y)) || plain(y).includes(plain(x));
    /** The facts of written comparisons of the same two things, so that a paper doesn't ask the pair twice. */
    const comparedAs = (a: string, b: string) => (f.compare ?? []).filter(([x, y]) => (alike(a, x) && alike(b, y)) || (alike(a, y) && alike(b, x))).map(([x, y]) => fact(`${x} | ${y}`));
    const contrasts = (f.links ?? []).filter((l) => l[0] === 'contrast' && termFor(l[1]) && termFor(l[2]));
    if (contrasts.length) {
      add('compare-linked', 2, 2, 'distinguish', 'distinguish', 'paper-style', (g) => {
        const [, a, b] = g.pick(contrasts);
        return g.theory(fillIn(g.pick(ASK_COMPARE), { a, b }), [`${capital(a)}: ${termFor(a)![1]}`, `${capital(b)}: ${termFor(b)![1]}`], { facts: [fact(a), fact(b), ...comparedAs(a, b)] });
      });
    }
    if (f.explain?.length) {
      for (const marks of [1, 2, 3]) {
        const list = f.explain.filter((e) => e.length - 1 === marks);
        if (!list.length) continue;
        add(`explain${marks}`, marks, marks > 2 ? 2 : 1, 'short', marks === 1 ? 'very-short' : 'short', 'paper-style', (g) => {
          const [q, ...points] = g.pick(list);
          return g.theory(q, points, { facts: [fact(q)] });
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
          // A long answer that is one of the library's derivations shares its fact, so a paper doesn't ask it twice.
          const same = DERIVATIONS.filter((d) => d.subject === subject && d.level === level && d.unit === unit && d.topic === topic && d.seen.test(q)).map(derivationFact);
          return g.theory(q, points as (string | [string, number])[], { facts: [fact(q), ...same], ...(diagram ? { diagram } : {}) });
        });
      }
    }
    if (f.draw?.length) {
      for (const marks of [1, 2, 3]) {
        const list = f.draw.filter((d) => d.length - 1 === marks);
        if (!list.length) continue;
        add(`draw${marks}`, marks, 2, 'short', 'diagram', 'paper-style', (g) => {
          const [q, ...points] = g.pick(list);
          const key = Object.keys(f.answerFigures ?? {}).find((start) => q.startsWith(start));
          return g.theory(q, points, { facts: [fact(q)], ...(key ? { answerDiagram: f.answerFigures![key] } : {}) });
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
          return g.theory(`${c.scene}\n${asks}`, c.parts.map((p, i) => [`(${['i', 'ii', 'iii', 'iv', 'v'][i]}) ${p[1]}`, p[2]]), { facts: [fact(c.scene)] });
        });
      }
    }
    return out;
  };

  /** Topics whose knowledge has no block in the class's own file. Put last, so that it knows which ones were used. */
  const rest = (): Blueprint[] =>
    Object.keys(knowledge)
      .filter((key) => !used.has(key))
      .flatMap((key) => facts(Number(key.slice(0, -1)), key.slice(-1), {}));

  return { custom, num, mcqNum, facts, base, rest };
}

/** A number for question text, in words a student would read. */
export const n = tidy;
