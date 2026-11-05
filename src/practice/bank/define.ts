// Compact helpers the bank files are written with. Ids come from the subject, class and wording, so
// they don't move when questions are reordered.
import type { ClassLevel, EntryStructure, SubjectId } from '../../data/types';
import type { DiagramSpec } from './diagram';
import type { BankDef, BankOption, BankType, Difficulty, McqDef, MarkPoint, NumericDef, OutputDef, TheoryDef } from './types';

/** Marks are written as `[unit, topic, marks, difficulty]`, the same order everywhere. */
export type Place = [unit: number, topic: string, marks: number, difficulty: Difficulty];

export interface Extras {
  structure?: EntryStructure;
  answerLewis?: string[];
  diagram?: DiagramSpec;
  recall?: 1;
  python?: 1;
}

const SUBJECT_CODE: Record<SubjectId, string> = { physics: 'p', chemistry: 'c', mathematics: 'm', computerscience: 'k' };
const CODE_SUBJECT: Record<string, SubjectId> = { p: 'physics', c: 'chemistry', m: 'mathematics', k: 'computerscience' };

function hash(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (Math.imul(h, 33) ^ text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export const isBankId = (id: string): boolean => /^q-[pcmk]1[12]-/.test(id);

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

export type { BankDef };
