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
  /** A figure the answer needs, such as a completed ray diagram. It's only shown after answering, and in the answer key. */
  answerDiagram?: DiagramSpec;
  answerLewis?: string[];
  python?: 1;
  /** For a derivation: the blueprint that asks one step of it, so that a step you miss comes back. */
  stepBlueprint?: string;
  /** The facts a question tests, so that a paper never asks one twice, even in another format. */
  facts?: string[];
  simulator?: SimulatorRef;
  /** The kind of setting this instance uses, such as "sport" or "medicine", so that a set can vary them. */
  context?: string;
}

export interface McqBody extends Attachments {
  form: 'mcq';
  text: string;
  options: BankOption[];
  answer: number;
  why?: string;
  /** For an assertion and reason question: the one concept both statements are about. */
  concept?: string;
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
  /** The way of asking, for blueprints the variety engine or a new format made: "reverse", "units", "chain" and so on. */
  family?: string;
  /** Set when the class loads, from its file in reviews/. False until it has been read as a teacher would. */
  reviewed?: boolean;
  /** When it was read, and what was fixed. */
  review?: { date: string; note: string };
  /** Why it can't be made right yet. A flagged blueprint stays in use, marked as not yet reviewed. */
  flag?: string;
  /** Builds one question from the generator's dice. It can call `g.retry()` for values that don't work out. */
  make(g: Gen): Body;
}

/** One blueprint's review: the date it was read, what was fixed, and, for one that can't be made right, why. */
export type ReviewRow = readonly [date: string, note: string, flag?: string];
export type Reviews = Record<string, ReviewRow>;
