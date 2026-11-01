// Types and limits shared by the parts of the interpreter.
import type { ClassDecl, MethodDecl } from './ast';
import type { JValue, Slot } from './values';

export const MAX_STEPS = 500_000;
export const MAX_RECORDED = 20_000;
export const MAX_DEPTH = 5000;
export const MAX_ARRAY = 2_000_000;
export const MAX_OUTPUT = 200_000;
/** The panel shows this many of the innermost calls, however deep the recursion goes. */
export const MAX_SHOWN_FRAMES = 25;

export type Signal = { type: 'break' } | { type: 'continue' } | { type: 'return'; value: JValue } | null;

export interface Scope {
  vars: Map<string, Slot>;
}

export interface Frame {
  method: MethodDecl | null;
  name: string;
  cls: ClassDecl | null;
  self: Extract<JValue, { t: 'object' }> | null;
  scopes: Scope[];
  line: number;
  /** Above 0 while inside a loop, which is when the trace table records. */
  loops: number;
}

/**
 * Control passes back to the driver at each of these: either a statement about to run,
 * or a method to enter. Method bodies run on the driver's own stack instead of inside
 * nested generators, so deep Java recursion cannot use up the JavaScript stack.
 */
export type Pause = { line: number; condition?: string; enter?: undefined } | { enter: Gen<void>; line?: undefined; condition?: undefined };
export type Gen<T> = Generator<Pause, T, void>;

/** Thrown by System.exit. */
export class StopProgram extends Error {}

/** Marks a declared variable with no value yet. */
export const UNSET: JValue = { t: 'void' };
