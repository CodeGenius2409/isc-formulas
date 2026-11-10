// Which question types fit which subtopic, for the balanced-supply target: at least 15 questions of each fitting type, bank and
// generated together, and at least 5 of them written by hand. Used by type-matrix.test.ts. "Fits" is a judgement, written down here
// so that it can be argued with: a type fits when an ISC examiner could set it on that subtopic without strain.
import type { SubjectId } from '../../../src/data/types';
import type { QuestionFormat } from '../../../src/practice/bank/types';

/** The types being balanced, in the order they are being worked on. */
export const WORK_ORDER: QuestionFormat[] = ['reason', 'short', 'match', 'diagram', 'predict', 'odd', 'distinguish', 'program', 'assertion', 'long', 'derivation'];

export const MIN_TOTAL = 15;
export const MIN_WRITTEN = 5;

/** Topics with something to derive or prove, by "level unit+topic". Everything else has no derivation to ask. */
const DERIVES: Partial<Record<SubjectId, RegExp>> = {
  physics: /^XI (2[ab]|3[ab]|4[ab]|5[abc]|6[ab]|7[abc]|8[ab]|9a|10[ab])$|^XII (1[ab]|2[ab]|3[ab]|4[ab]|6[abc]|7a|8[ab]|9b)$/,
  chemistry: /^XI (1b|2[ab]|5[ab]|6[ab])$|^XII (1a|2[ab]|3[ab])$/,
  mathematics: /./,
  computerscience: /^XI 2a$|^XII (1b|9[a-z])$/,
};

/** Topics where a figure is natural: to draw, to label or to read. */
const DRAWS: Partial<Record<SubjectId, RegExp>> = {
  physics: /./,
  chemistry: /^XI (1p|2[ab]|3a|4[ab]|5[ab]|6[ab]|8[abc]|9[abcd]|10[a-d])$|^XII (1a|2[abc]|3[ab]|4[ab]|5a|6[abc]|7[abc]|8[ab]|9[abc]|10[abcd]|11[a-d])$/,
  mathematics: /^XI (1[ab]|2[a-z]|3[a-z]|4[a-z]|5[a-z])$|^XII (1[ab]|3[a-z]|4[a-z]|5[a-z]|6a|7[a-z])$/,
  computerscience: /^XI (1[ab]|2a|3[a-z])$|^XII (1[ab]|2[a-z]|8[a-z]|9[a-z])$/,
};

/** Topics that are programming, where a program is what the papers ask. */
const PROGRAMS = /^XI (4[a-z]|5[a-z]|6[a-z]|7[a-z]|8[a-z]|9[a-z]|10[a-z]|11[a-z]|12[a-z])$|^XII (3[a-z]|4[a-z]|5[a-z]|6[a-z]|7[a-z])$/;

export function fitsTopic(subject: SubjectId, place: string, format: QuestionFormat): boolean {
  switch (format) {
    case 'program':
      return subject === 'computerscience' && PROGRAMS.test(place);
    case 'derivation':
      return Boolean(DERIVES[subject]?.test(place));
    case 'diagram':
      return Boolean(DRAWS[subject]?.test(place));
    case 'reason':
    case 'predict':
    case 'short':
    case 'match':
    case 'odd':
    case 'distinguish':
    case 'assertion':
    case 'long':
      return true;
    default:
      return false;
  }
}
