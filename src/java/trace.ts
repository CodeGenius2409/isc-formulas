// Runs a whole program and records every step, for the tracer to play back.
import { Interpreter } from './interp';
import { JavaError } from './lexer';
import { parseJava } from './parser';
import { MAX_RECORDED, MAX_SHOWN_FRAMES, MAX_STEPS, StopProgram, UNSET, type Frame, type Gen } from './runtime';
import { resetIds } from './stdlib';
import { displayValue, runtimeError, typeName } from './values';

export interface VarView {
  name: string;
  type: string;
  value: string;
}

export interface FrameView {
  method: string;
  line: number;
  vars: VarView[];
}

export interface TraceStep {
  line: number;
  /** Innermost last. Very deep recursion keeps only main and the innermost calls. */
  frames: FrameView[];
  /** The real number of calls in progress. */
  depth: number;
  outputLength: number;
  /** How many trace-table rows existed at this step. */
  traceRows: number;
}

export interface TraceRow {
  line: number;
  method: string;
  values: Record<string, string>;
  changed: string[];
  condition?: string;
  output?: string;
}

export interface RunResult {
  steps: TraceStep[];
  output: string;
  error: { message: string; line: number; kind: 'compile' | 'runtime' } | null;
  rows: TraceRow[];
  columns: string[];
  /** True if the program ran longer than can be stepped through. */
  truncated: boolean;
  totalSteps: number;
}

function snapshot(all: readonly Frame[]): FrameView[] {
  const frames = all.length > MAX_SHOWN_FRAMES ? [all[0], ...all.slice(all.length - MAX_SHOWN_FRAMES + 1)] : all;
  return frames.map((f) => {
    const vars: VarView[] = [];
    if (f.self) {
      for (const [name, slot] of f.self.fields) vars.push({ name: `this.${name}`, type: typeName(slot.type), value: displayValue(slot.value) });
    }
    for (const scope of f.scopes) {
      for (const [name, slot] of scope.vars) {
        vars.push({ name, type: typeName(slot.type), value: slot.value === UNSET ? '(no value yet)' : displayValue(slot.value) });
      }
    }
    return { method: f.name, line: f.line, vars };
  });
}

/** Parses and runs a whole program, recording every step for the tracer to play back. */
export function runProgram(source: string, input = ''): RunResult {
  resetIds();
  const steps: TraceStep[] = [];
  const rows: TraceRow[] = [];
  const columns: string[] = [];
  let truncated = false;
  let totalSteps = 0;
  let interpreter: Interpreter | null = null;

  const finish = (error: RunResult['error']): RunResult => ({ steps, output: interpreter?.output ?? '', error, rows, columns, truncated, totalSteps });

  // Each call compares against its own previous row, so a loop that calls a method
  // doesn't see every variable as changed when control comes back.
  const lastValues = new WeakMap<Frame, Record<string, string>>();
  let lastOutputLength = 0;
  let lastLine = 0;

  /** Adds a dry-run row when something in a loop changed. */
  const noteTrace = (frame: Frame, line: number, condition: string | undefined, interp: Interpreter) => {
    const values: Record<string, string> = {};
    for (const scope of frame.scopes) {
      for (const [name, slot] of scope.vars) {
        // main's own args never changes, and nobody writes it in a dry run.
        if (name === 'args' && frame.method?.name === 'main') continue;
        if (slot.value !== UNSET) values[name] = displayValue(slot.value);
      }
    }
    if (frame.self) for (const [name, slot] of frame.self.fields) values[`this.${name}`] = displayValue(slot.value);
    const previous = lastValues.get(frame) ?? {};
    const changed = Object.keys(values).filter((k) => values[k] !== previous[k]);
    const output = interp.output.slice(lastOutputLength);
    if (condition === undefined && !changed.length && !output) return;
    for (const k of Object.keys(values)) if (!columns.includes(k)) columns.push(k);
    rows.push({ line: condition !== undefined ? line : lastLine || line, method: frame.method?.name ?? '', values, changed, condition, output: output || undefined });
    lastValues.set(frame, values);
    lastOutputLength = interp.output.length;
  };

  try {
    const program = parseJava(source);
    interpreter = new Interpreter(program, input);
    const stack: Gen<void>[] = [interpreter.run()];
    while (stack.length) {
      const result = stack[stack.length - 1].next();
      if (result.done) {
        stack.pop();
        continue;
      }
      if (result.value.enter) {
        stack.push(result.value.enter);
        continue;
      }
      totalSteps++;
      if (totalSteps > MAX_STEPS) {
        throw runtimeError(`This program ran for over ${MAX_STEPS.toLocaleString('en-GB')} steps, so it was stopped. It may be an infinite loop. Check that the loop's condition can become false.`, result.value.line);
      }
      const frames = interpreter.frameList;
      const top = frames[frames.length - 1];
      if (rows.length >= MAX_RECORDED) truncated = true;
      else if (top && top.loops > 0) noteTrace(top, result.value.line, result.value.condition, interpreter);
      // Output from a method called inside a loop still belongs to the loop's next row.
      else if (!frames.some((f) => f.loops > 0)) lastOutputLength = interpreter.output.length;
      lastLine = result.value.line;
      if (result.value.condition !== undefined) continue;
      if (steps.length < MAX_RECORDED) {
        steps.push({ line: result.value.line, frames: snapshot(frames), depth: frames.length, outputLength: interpreter.output.length, traceRows: rows.length });
      } else {
        truncated = true;
      }
    }
    if (!truncated) steps.push({ line: lastLine, frames: [], depth: 0, outputLength: interpreter.output.length, traceRows: rows.length });
    return finish(null);
  } catch (err) {
    // The last step shows the state the program stopped in, including anything it printed.
    if (interpreter && !truncated) {
      const frames = interpreter.frameList;
      const line = err instanceof JavaError ? err.line : lastLine;
      steps.push({ line, frames: err instanceof StopProgram ? [] : snapshot(frames), depth: frames.length, outputLength: interpreter.output.length, traceRows: rows.length });
    }
    if (err instanceof StopProgram) return finish(null);
    if (err instanceof JavaError) return finish({ message: err.message, line: err.line, kind: err.kind });
    if (err instanceof RangeError && /call stack/i.test(err.message)) {
      return finish({ message: 'This line nests too deeply for the tracer to follow.', line: lastLine, kind: 'runtime' });
    }
    return finish({ message: `Something went wrong inside the tracer: ${(err as Error).message}`, line: lastLine, kind: 'runtime' });
  }
}
