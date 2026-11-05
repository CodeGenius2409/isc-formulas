// A blueprint is an original, parameterised recipe for one kind of question: what it tests, how it is built and
// how it is marked. Nothing in src/data/blueprints is taken from a paper's wording. See reports/question-analysis.md.
import type { DiagramSpec } from '../../practice/bank/diagram';
import type { BankOption, BankType, Difficulty, GeneratedTag, MarkPoint, NumericPart, SimulatorRef } from '../../practice/bank/types';
import type { Gen } from '../../practice/gen/gen';
import type { ClassLevel, EntryStructure, SubjectId } from '../types';

export type Style = GeneratedTag['style'];
export type Format = GeneratedTag['format'];

interface Attachments {
  structure?: EntryStructure;
  diagram?: DiagramSpec;
  answerLewis?: string[];
  python?: 1;
  simulator?: SimulatorRef;
}

export interface McqBody extends Attachments {
  form: 'mcq';
  text: string;
  options: BankOption[];
  answer: number;
  why?: string;
}

export interface TheoryBody extends Attachments {
  form: 'theory';
  text: string;
  points: MarkPoint[];
  model?: string;
}

export interface OutputBody extends Attachments {
  form: 'output';
  text: string;
  code: string;
  expected: string;
  why?: string;
}

export interface NumericBody extends Attachments {
  form: 'numeric';
  text: string;
  parts: NumericPart[];
}

export type Body = McqBody | TheoryBody | OutputBody | NumericBody;

export interface Blueprint {
  id: string;
  subject: SubjectId;
  level: ClassLevel;
  unit: number;
  topic: string;
  marks: number;
  /** How the app files it, the same list the bank uses. */
  type: BankType;
  difficulty: Difficulty;
  format: Format;
  style: Style;
  python?: 1;
  /** Builds one question from the generator's dice. It can call `g.retry()` for values that don't work out. */
  make(g: Gen): Body;
}
