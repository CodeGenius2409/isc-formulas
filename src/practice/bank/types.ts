// The exam-style question bank. A definition is what is written in the bank files. An instance is one
// attempt at it, with fresh values, and is plain JSON so that mistakes and mock papers can store it.
import type { ClassLevel, EntryStructure, SubjectId } from '../../data/types';
import type { NumericQuestion } from '../questions';
import type { DiagramSpec } from './diagram';

export type BankType =
  | 'mcq'
  | 'assertion'
  | 'numerical'
  | 'derivation'
  | 'proof'
  | 'reason'
  | 'distinguish'
  | 'definition'
  | 'short'
  | 'reaction'
  | 'structure'
  | 'output'
  | 'error'
  | 'complete'
  | 'program'
  | 'recall';

export type Difficulty = 1 | 2 | 3;

/** Set on a question the app made itself, from a blueprint and a seed. Bank questions don't have one. */
export interface GeneratedTag {
  blueprint: string;
  seed: number;
  style: 'paper-style' | 'cbq-style';
  format: 'mcq' | 'assertion' | 'very-short' | 'short' | 'long' | 'numerical' | 'derivation' | 'reason' | 'distinguish' | 'diagram' | 'cbq' | 'output' | 'error' | 'program';
  /** Its blueprint hasn't been read as a teacher would yet. */
  unreviewed?: true;
}

/** One marking point. */
export interface MarkPoint {
  text: string;
  marks: number;
}

export interface BankOption {
  text: string;
  /** A compound to draw, with `text` as its name for the mistakes log. */
  structure?: string;
}

interface Tags {
  id: string;
  subject: SubjectId;
  level: ClassLevel;
  /** The unit's number in the official syllabus. */
  unit: number;
  /** The topic's key within that unit in the syllabus map. */
  topic: string;
  marks: number;
  type: BankType;
  difficulty: Difficulty;
  /** Code in the question is Python, not Java. */
  python?: 1;
  structure?: EntryStructure;
  facts?: string[];
  stepBlueprint?: string;
  answerDiagram?: DiagramSpec;
  diagram?: DiagramSpec;
  /** Structures with lone pairs shown once the question is marked, by id in src/data/lewis/figures.ts. */
  answerLewis?: string[];
  /** A deliberate short recall item. The quality gate caps how many of these there are. */
  recall?: 1;
}

export interface McqDef extends Tags {
  form: 'mcq';
  text: string;
  options: BankOption[];
  answer: number;
  why?: string;
}

export interface TheoryDef extends Tags {
  form: 'theory';
  text: string;
  /** The model answer, as marking points. Their marks add up to the question's. */
  points: MarkPoint[];
  /** A worked program or longer model, shown under the points. */
  model?: string;
}

export interface OutputDef extends Tags {
  form: 'output';
  text: string;
  code: string;
  /** What the program prints. A test runs it to prove this. */
  expected: string;
  why?: string;
}

export interface NumericPartDef {
  ask: string;
  /** The solver registry entry that computes this part. */
  use: string;
  find: string;
  /** Registry symbol to "variable unit" or "number unit", with -U and V*1e6 allowed. A saved name needs no unit. */
  given: Record<string, string>;
  unit?: string;
  marks: number;
  /** Lets later parts use this result. */
  save?: string;
  /** Keep only positive roots, as for a speed found from v² = u² + 2as. */
  positive?: boolean;
  /** Show the answer exactly, as for a count such as a formal charge. */
  exact?: boolean;
}

export interface NumericDef extends Tags {
  form: 'numeric';
  text: string;
  /** Three numbers are [low, high, step]. Any other length is a list of values to pick from. */
  vars: Record<string, [number, number, number] | number[]>;
  /** Keeps only sensible combinations of values. */
  when?: (v: Record<string, number>) => boolean;
  parts: NumericPartDef[];
}

export type BankDef = McqDef | TheoryDef | OutputDef | NumericDef;

/** A simulator that shows this question's set-up, with the values to start it from. */
export interface SimulatorRef {
  id: string;
  preset: Record<string, number>;
}

interface InstanceTags extends Omit<Tags, 'structure' | 'diagram'> {
  structure?: EntryStructure;
  diagram?: DiagramSpec;
  simulator?: SimulatorRef;
  unitName: string;
  topicName: string;
  generated?: GeneratedTag;
}

export interface McqItem extends InstanceTags {
  /** For an assertion and reason question: the one concept both statements are about. */
  concept?: string;
  form: 'mcq';
  text: string;
  options: BankOption[];
  answer: number;
  why?: string;
}

export interface TheoryItem extends InstanceTags {
  form: 'theory';
  text: string;
  points: MarkPoint[];
  model?: string;
}

export interface OutputItem extends InstanceTags {
  form: 'output';
  text: string;
  code: string;
  expected: string;
  why?: string;
}

export interface NumericPart {
  ask: string;
  marks: number;
  question: NumericQuestion;
}

export interface NumericItem extends InstanceTags {
  form: 'numeric';
  text: string;
  parts: NumericPart[];
}

export type BankItem = McqItem | TheoryItem | OutputItem | NumericItem;

/** What someone has answered so far. Only the fields for the question's form are used. */
export interface BankAnswer {
  choice?: number;
  parts?: { value: string; unit: string }[];
  text?: string;
  /** Marking points ticked when self-marking. */
  ticks?: boolean[];
}

/** How a bank question travels through a practice session and the mistakes log. */
export interface BankQuestion {
  kind: 'bank';
  /** The bank id. Review schedules and mistakes key on this, as they do on a formula id. */
  formulaId: string;
  item: BankItem;
}
