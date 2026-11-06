// A derivation or proof the syllabus expects, written once and asked in several ways. See reports/derivations.md.
import type { DiagramSpec } from '../../practice/bank/diagram';
import type { ClassLevel, SubjectId } from '../types';

/** How a final result is checked by machine: both sides agree at random values, and have the same dimensions. */
export interface DerivationCheck {
  lhs: string;
  rhs: string;
  /** Each symbol's unit, as mathjs writes it. An empty string means a plain number. */
  vars: Record<string, string>;
}

/** "And hence calculate": fresh values each time. */
export interface HencePart {
  /** With {name} for each value. */
  text: string;
  vars: Record<string, [number, number, number]>;
  value: (v: Record<string, number>) => number;
  /** The same calculation for mathjs, which a test holds \`value\` to. */
  expr: string;
  /** The unit, shown with the answer. */
  unit: string;
}

export interface Derivation {
  /** A short name, unique in its subject. */
  slug: string;
  subject: SubjectId;
  level: ClassLevel;
  unit: number;
  topic: string;
  /** Completes "Derive an expression for ...". */
  what: string;
  /** Where the working starts, for "Starting from ..., show that ...". */
  from: string;
  /** Completes "show that ...". */
  showThat: string;
  assumptions: string[];
  /** Each step, in order, with the marks it earns and why it holds. */
  steps: [text: string, marks: number, why?: string][];
  result: string;
  figure?: DiagramSpec;
  /** Asks for the figure too, for "Draw a labelled diagram and derive ...". */
  drawIt?: boolean;
  check?: DerivationCheck;
  /** One realistic mistake: which step, its wrong form, and what's wrong with it. */
  error?: [step: number, wrong: string, why: string];
  hence?: HencePart;
  difficulty?: 1 | 2 | 3;
  /** Recognises this derivation in the private analysis, for counting how often it is asked. */
  seen: RegExp;
}

export const marksOf = (d: Pick<Derivation, 'steps'>): number => d.steps.reduce((sum, [, m]) => sum + m, 0);
