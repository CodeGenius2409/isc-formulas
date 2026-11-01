// The solver registry is data: adding a formula means adding one entry to a file in
// src/solver/registry, with no code change. A test then checks its dimensions.

/** A kind of physical quantity, shared across entries. */
export interface QuantityDef {
  /** Dimension as "M L T^-2". Empty when dimensionless. */
  dim: string;
  /** The unit values are calculated in. Empty when dimensionless. */
  unit: string;
  /** Other units the student can enter values in. */
  alt?: string[];
  /** Range of random values for practice questions. */
  gen?: [number, number];
  /** Smallest physically meaningful value. */
  min?: number;
  max?: number;
  /** The minimum itself is not allowed (a mass of 0, a denominator). */
  exclusiveMin?: boolean;
  integer?: boolean;
  /** Prefer showing results in this unit. */
  show?: string;
  /** Treated as a pure number in equations (e.g. log[H⁺] uses the value in mol/L). */
  nominal?: boolean;
}

export interface ConstantDef {
  name: string;
  value: number;
  dim: string;
  unit: string;
  tex?: string;
}

export interface VarOptions {
  gen?: [number, number];
  min?: number;
  max?: number;
  exclusiveMin?: boolean;
  integer?: boolean;
  tex?: string;
  /** Pre-filled default that the student may change (not a universal constant). */
  value?: number;
  /** Overrides the quantity's result unit. */
  show?: string;
}

/**
 * "human name|quantity key", or the same as a list when it needs options, or
 * "c:g" to use a constant from the constants table.
 */
export type VarSpec = string | [string, string, VarOptions];

export interface SolverEntry {
  /** The formula id in the book. */
  id: string;
  /** Equation in mathjs syntax, with one "=". Use exp() for e^x, log() for ln, log10(). */
  eq: string;
  vars: Record<string, VarSpec>;
  /** Syllabus area, for grouping. */
  topic: string;
  /** Which variable a question usually asks for. Defaults to the left side. */
  ask?: string;
  /**
   * True when the equation holds only in stated non-SI units (a 1000 converting L to
   * mL, or 0.0591 V at 25 °C). The dimension test still runs. Only the check that
   * unit factors agree is skipped.
   */
  convention?: boolean;
}

/** A variable with its quantity and constant data resolved. */
export interface ResolvedVar {
  symbol: string;
  name: string;
  quantityKey: string;
  dim: string;
  unit: string;
  alt: string[];
  show?: string;
  tex?: string;
  gen: [number, number];
  min?: number;
  max?: number;
  exclusiveMin?: boolean;
  integer?: boolean;
  nominal?: boolean;
  /** Pre-filled value: a constant or a default. */
  value?: number;
  isConstant: boolean;
}

export interface ResolvedEntry {
  id: string;
  eq: string;
  topic: string;
  ask?: string;
  convention?: boolean;
  vars: ResolvedVar[];
}
