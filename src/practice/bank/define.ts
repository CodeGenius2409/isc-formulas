// Compact helpers the bank files are written with. Ids come from the subject, class and wording, so
// they don't move when questions are reordered.
import type { ClassLevel, EntryStructure, SubjectId } from '../../data/types';
import type { DiagramSpec } from './diagram';
import type { BankDef, BankItem, BankOption, BankType, Difficulty, McqDef, MarkPoint, NumericDef, OutputDef, QuestionFormat, TheoryDef } from './types';

/** Marks are written as `[unit, topic, marks, difficulty]`, the same order everywhere. */
export type Place = [unit: number, topic: string, marks: number, difficulty: Difficulty];

export interface Extras {
  structure?: EntryStructure;
  facts?: string[];
  stepBlueprint?: string;
  answerDiagram?: DiagramSpec;
  answerLewis?: string[];
  diagram?: DiagramSpec;
  recall?: 1;
  python?: 1;
  format?: QuestionFormat;
  style?: 'paper-style' | 'cbq-style';
  context?: string;
}

const SUBJECT_CODE: Record<SubjectId, string> = { physics: 'p', chemistry: 'c', mathematics: 'm', computerscience: 'k' };
const CODE_SUBJECT: Record<string, SubjectId> = { p: 'physics', c: 'chemistry', m: 'mathematics', k: 'computerscience' };

function hash(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (Math.imul(h, 33) ^ text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export const isBankId = (id: string): boolean => /^q-[pcmk]1[12]-/.test(id);

/**
 * Frozen from a blueprint, so on the generated side of the slider wherever one is offered: never used at 0%, and counted in the
 * percentage above that. Hand-written and fact-based questions are the bank's side.
 */
export const isCompiled = (d: { origin?: string }): boolean => d.origin === 'compiled';

/**
 * Whether a question carries the Generated mark and its note. Made from a blueprint just now, or frozen from one into the bank:
 * neither was read one by one. Hand-written and fact-based bank questions were, so they don't. `item.generated` says only whether it was made from a blueprint just now, which swapping and repeat tracking need.
 */
export const isMarkedGenerated = (item: Pick<BankItem, 'generated' | 'origin'>): boolean => Boolean(item.generated) || isCompiled(item);

/** A question from the bank, or one generated from a blueprint and a seed. */
export const isExamId = (id: string): boolean => isBankId(id) || id.startsWith('g-');

/** Which bank file an id lives in, so that finding it loads only that file. */
export function bankOfId(id: string): { subject: SubjectId; level: ClassLevel } | null {
  const match = /^q-([pcmk])(1[12])-/.exec(id);
  return match ? { subject: CODE_SUBJECT[match[1]], level: match[2] === '12' ? 'XII' : 'XI' } : null;
}

/** The standard options for assertion and reason, as the papers set them. */
export const ASSERTION_OPTIONS = [
  'Both Assertion and Reason are true, and Reason is the correct explanation for Assertion.',
  'Both Assertion and Reason are true, but Reason is not the correct explanation for Assertion.',
  'Assertion is true and Reason is false.',
  'Assertion is false and Reason is true.',
];

export interface Bank {
  /** Multiple choice, one mark unless the place says otherwise. */
  mcq(place: Place, text: string, options: (string | BankOption)[], answer: number, why?: string, extras?: Extras): McqDef;
  /** Assertion and reason. `answer` is 1 to 4, in the order of the standard options. */
  ar(place: Place, assertion: string, reason: string, answer: 1 | 2 | 3 | 4, why?: string): McqDef;
  /** Answered on paper, then self-marked against the marking points. */
  theory(type: BankType, place: Place, text: string, points: (string | [string, number])[], extras?: Extras & { model?: string }): TheoryDef;
  /** Parameterised, with answers from the solver registry. */
  num(place: Place, def: Pick<NumericDef, 'text' | 'vars' | 'parts' | 'when'>, extras?: Extras): NumericDef;
  /** Write the output. The expected text is checked by running the program in a test. */
  output(place: Place, code: string, expected: string, why?: string, extras?: Extras & { text?: string }): OutputDef;
}

export function bank(subject: SubjectId, level: ClassLevel): Bank {
  const prefix = `q-${SUBJECT_CODE[subject]}${level === 'XII' ? '12' : '11'}`;
  const tags = (type: BankType, [unit, topic, marks, difficulty]: Place, key: string, extras: Extras = {}) => ({
    id: `${prefix}-${unit}${topic}-${hash(key)}`,
    subject,
    level,
    unit,
    topic,
    marks,
    type,
    difficulty,
    ...extras,
  });
  const points = (list: (string | [string, number])[]): MarkPoint[] => list.map((p) => (typeof p === 'string' ? { text: p, marks: 1 } : { text: p[0], marks: p[1] }));
  return {
    mcq: (place, text, options, answer, why, extras) => ({
      form: 'mcq',
      ...tags(extras?.structure || extras?.answerLewis ? 'structure' : 'mcq', place, text + JSON.stringify(extras?.structure ?? ''), extras),
      text,
      options: options.map((o) => (typeof o === 'string' ? { text: o } : o)),
      answer,
      why,
    }),
    ar: (place, assertion, reason, answer, why) => ({
      form: 'mcq',
      ...tags('assertion', place, assertion + reason),
      text: `Assertion: ${assertion}\nReason: ${reason}`,
      options: ASSERTION_OPTIONS.map((text) => ({ text })),
      answer: answer - 1,
      why,
    }),
    theory: (type, place, text, list, extras) => {
      const { model, ...rest } = extras ?? {};
      return { form: 'theory', ...tags(type, place, text, rest), text, points: points(list), model };
    },
    num: (place, def, extras) => ({ form: 'numeric', ...tags('numerical', place, def.text, extras), ...def }),
    output: (place, code, expected, why, extras) => {
      const { text, ...rest } = extras ?? {};
      return { form: 'output', ...tags('output', place, code, rest), text: text ?? 'Write the output of the following program.', code, expected, why };
    },
  };
}

/** Each kind of written answer, as the bank files write them. A point worth more than a mark is [text, marks]. */
export function kit(subject: SubjectId, level: ClassLevel) {
  const b = bank(subject, level);
  type Point = string | [string, number];
  /** Points written one after another, or as one list. */
  type Points = (Point | Point[])[];
  const isPoint = (x: Point | Point[]): x is Point => typeof x === 'string' || typeof x[1] === 'number';
  const flat = (points: Points): Point[] => points.flatMap((p) => (isPoint(p) ? [p] : p));
  const letters = 'abcdefgh';
  /** An order for Column B that is fixed by the wording, so that a question's id and answer never move. */
  const mixedUp = (n: number, seed: string): number[] => {
    const start = parseInt(hash(seed), 36);
    let order = Array.from({ length: n }, (_, i) => i).sort((x, y) => ((start * (x + 7)) % 1009) - ((start * (y + 7)) % 1009));
    if (order.every((v, i) => v === i)) order = [...order].reverse();
    return order;
  };
  return {
    ...b,
    /** Give a reason. The wording says how. Each point is worth a mark unless it says otherwise. */
    reason: (place: Place, text: string, ...points: Points) => b.theory('reason', place, text, flat(points)),
    /** A short answer, a line at one mark. */
    short: (place: Place, text: string, ...points: Points) => b.theory('short', place, text, flat(points), { format: place[2] === 1 ? 'very-short' : 'short' }),
    long: (place: Place, text: string, ...points: Points) => b.theory('short', place, text, flat(points), { format: 'long' }),
    /** Distinguish between two things, or give a test that does. */
    tell: (place: Place, text: string, ...points: Points) => b.theory('distinguish', place, text, flat(points)),
    predict: (place: Place, text: string, ...points: Points) => b.theory('short', place, text, flat(points), { format: 'predict', style: 'cbq-style' }),
    derive: (place: Place, text: string, ...points: Points) => b.theory('derivation', place, text, flat(points)),
    /** Which is the odd one out, for two marks: which, then why. */
    odd: (place: Place, items: string[], odd: string, why: string) => {
      const order = mixedUp(items.length, items.join());
      return b.theory('short', place, `Which is the odd one out? Give the reason.\n${order.map((i) => items[i]).join(', ')}`, [`The odd one out is ${odd}.`, why], { format: 'odd', style: 'cbq-style' });
    },
    /** Match the columns, a mark for each pair. */
    match: (place: Place, pairs: [string, string][]) => {
      const order = mixedUp(pairs.length, pairs.map((p) => p[0]).join());
      const a = pairs.map(([x], i) => `(${i + 1}) ${x}`).join('\n');
      const c = order.map((j, i) => `(${letters[i]}) ${pairs[j][1]}`).join('\n');
      return b.theory('short', place, `Match each item in Column A with the one it goes with in Column B.\nColumn A\n${a}\nColumn B\n${c}`, pairs.map(([x, y], i) => `(${i + 1}) ${x} goes with (${letters[order.indexOf(i)]}), ${y}.`), { format: 'match' });
    },
    /** A figure to draw, to label or to read. `shown` is printed with the question, `answer` after marking and in the answer key. */
    figure: (place: Place, text: string, points: Point[], figures: { shown?: DiagramSpec; answer?: DiagramSpec }) => b.theory('short', place, text, points, { format: 'diagram', ...(figures.shown ? { diagram: figures.shown } : {}), ...(figures.answer ? { answerDiagram: figures.answer } : {}) }),
    /** Write a program, with a worked one to compare against. */
    program: (place: Place, text: string, points: Point[], model: string, python?: 1) => b.theory('program', place, text, points, { model, ...(python ? { python } : {}) }),
  };
}

/** A place in a chapter: `at(3, 'a')(2, 1)` is unit 3, topic a, 2 marks, easy. */
export const at = (unit: number, topic: string) => (marks: number, difficulty: Difficulty): Place => [unit, topic, marks, difficulty];

export type { BankDef };
