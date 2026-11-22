// Turns the recording that tracer.py makes into steps for the Python tracer to play back, and builds the
// dry-run table from it the way the Java tracer does: a row each time a loop is tested or a variable in a
// loop changes. Nothing here needs Pyodide, so tests can check it with recordings of their own.
import type { TraceRow } from '../java/trace';

export type { TraceRow };

/** The same limits as the Java tracer, so the two behave alike, plus a clock as a last resort. */
export const LIMITS = {
  /** Events before a program counts as a likely infinite loop. */
  steps: 500_000,
  /** Steps that can be stepped through. The console still shows all the output. */
  recorded: 20_000,
  output: 200_000,
  seconds: 20,
};

export type PyEvent = 'line' | 'call' | 'return' | 'exception' | 'unwind' | 'error' | 'stop' | 'end';

export interface PyPlace {
  /** Index into the step's frames. */
  frame: number;
  /** A name, or a path inside one such as m[0]. */
  path: string;
}

export interface PyVar {
  name: string;
  type: string;
  value: string;
  /** Other names for this same object: b after b = a, or a list passed to a function. */
  same?: PyPlace[];
  /** Places inside this value that are one object, such as the rows of [[0] * 3] * 3. */
  inside?: string[][];
}

export interface PyFrame {
  /** What Python calls it: a function's name, or <module> for the program itself. */
  fn: string;
  line: number;
  /** The first line of its code, which identifies the function. */
  first: number;
  /** The same number for every step of one call, and a different one for each call. */
  key: number;
  vars: PyVar[];
}

export interface PyStep {
  line: number;
  event: PyEvent;
  /** Innermost last. Very deep recursion keeps only the program's frame and the innermost calls. */
  frames: PyFrame[];
  /** The real number of calls in progress, counting the program itself. */
  depth: number;
  outputLength: number;
  /** A return's value, or an exception's message. */
  detail?: string;
  /** How many dry-run rows existed at this step. */
  traceRows: number;
}

export interface PyLoop {
  scope: string;
  line: number;
  end: number;
  body: number;
  bodyEnd: number;
  kind: 'for' | 'while';
  test: string;
  target: string;
}

/** Input that was read, shown after its prompt; the point where input ran out; and anything sent to stderr. */
export interface ConsoleExtra {
  kind: 'in' | 'eof' | 'err';
  /** Where in the output it goes. */
  at: number;
  text: string;
  /** The first step at which it has happened. */
  step: number;
}

export interface PyError {
  /** The exception's name, such as IndexError. */
  type: string;
  /** The last line Python prints, such as "IndexError: list index out of range". */
  text: string;
  line: number;
  kind: 'syntax' | 'runtime';
}

export type StopReason = 'steps' | 'time' | 'output';

export interface PyRunResult {
  steps: PyStep[];
  /** Everything the program printed to standard output, exactly. */
  output: string;
  extras: ConsoleExtra[];
  error: PyError | null;
  /** Set when the tracer ended the program because it ran too long. */
  stopped: StopReason | null;
  rows: TraceRow[];
  columns: string[];
  /** True if the program ran longer than can be stepped through. */
  truncated: boolean;
  totalSteps: number;
  /** What the program uses that the ISC Python units don't, such as "classes" or "import sys". */
  beyond: string[];
  loops: PyLoop[];
}

type RawVar = [string, string, string, [number, string][] | null, string[][] | null];
type RawFrame = [string, number, number, number, RawVar[]];
type RawStep = [number, PyEvent, RawFrame[], number, number, string | null];

export interface RawRun {
  steps: RawStep[];
  output: string;
  extras: [ConsoleExtra['kind'], number, string, number][];
  error: PyError | null;
  stopped: StopReason | null;
  totalSteps: number;
  truncated: boolean;
  loops: PyLoop[];
  beyond: string[];
}

function frameOf([fn, line, first, key, vars]: RawFrame): PyFrame {
  return {
    fn,
    line,
    first,
    key,
    vars: vars.map(([name, type, value, same, inside]) => ({
      name,
      type,
      value,
      ...(same ? { same: same.map(([frame, path]) => ({ frame, path })) } : {}),
      ...(inside ? { inside } : {}),
    })),
  };
}

const scopeOf = (frame: PyFrame) => `${frame.fn}:${frame.first}`;

/** The loops of this frame's function that contain the line it's on, innermost first. */
function loopsAt(loops: PyLoop[], frame: PyFrame): PyLoop[] {
  const scope = scopeOf(frame);
  return loops.filter((l) => l.scope === scope && l.line <= frame.line && frame.line <= l.end).sort((a, b) => b.line - a.line);
}

/**
 * Whether a loop's test at step `at` let the loop run again. Python says so only by where it goes next: into
 * the loop's body, or past it. Calls made while testing are skipped over, as they belong to the test.
 */
function testResult(steps: PyStep[], at: number, loop: PyLoop): boolean | undefined {
  const key = steps[at].frames[steps[at].frames.length - 1].key;
  for (let i = at + 1; i < steps.length; i++) {
    const frames = steps[i].frames;
    const top = frames[frames.length - 1];
    if (!top || !frames.some((f) => f.key === key)) return false;
    if (top.key !== key) continue;
    if (steps[i].event === 'exception' || steps[i].event === 'error') return undefined;
    return top.line >= loop.body && top.line <= loop.bodyEnd;
  }
  return undefined;
}

function buildRows(steps: PyStep[], loops: PyLoop[], printed: string): { rows: TraceRow[]; columns: string[] } {
  const rows: TraceRow[] = [];
  const columns: string[] = [];
  // Each call compares against its own previous row, so a loop that calls a function doesn't see every
  // variable as changed when control comes back.
  const last = new Map<number, Record<string, string>>();
  let lastOutput = 0;
  let lastLine = 0;
  steps.forEach((step, i) => {
    const top = step.frames[step.frames.length - 1];
    if (top && (step.event === 'line' || step.event === 'error' || step.event === 'stop')) {
      const around = loopsAt(loops, top);
      if (around.length) {
        const header = around.find((l) => l.line === top.line && step.event === 'line');
        const values: Record<string, string> = {};
        for (const v of top.vars) values[v.name] = v.value;
        const previous = last.get(top.key) ?? {};
        const changed = Object.keys(values).filter((k) => values[k] !== previous[k]);
        // The output this row shows is what the program printed since the last row, as a dry run would write it.
        const output = printed.slice(lastOutput, step.outputLength);
        const result = header ? testResult(steps, i, header) : undefined;
        const condition = header ? (result === undefined ? '' : result ? 'True' : 'False') : undefined;
        if (condition !== undefined || changed.length || output) {
          for (const k of Object.keys(values)) if (!columns.includes(k)) columns.push(k);
          rows.push({ line: header ? top.line : lastLine || top.line, method: top.fn, values, changed, condition, output: output || undefined });
          last.set(top.key, values);
          lastOutput = step.outputLength;
        }
      } else if (!step.frames.some((f) => loopsAt(loops, f).length)) {
        // Output from a function called inside a loop still belongs to the loop's next row.
        lastOutput = step.outputLength;
      }
      lastLine = top.line;
    } else if (top) {
      lastLine = top.line;
    }
    step.traceRows = rows.length;
  });
  return { rows, columns };
}

/** Shapes a raw recording into steps, with the dry-run rows worked out from them. */
export function shapeRun(raw: RawRun): PyRunResult {
  const steps: PyStep[] = raw.steps.map(([line, event, frames, depth, outputLength, detail]) => ({
    line,
    event,
    frames: frames.map(frameOf),
    depth,
    outputLength,
    ...(detail != null ? { detail } : {}),
    traceRows: 0,
  }));
  const { rows, columns } = buildRows(steps, raw.loops, raw.output);
  return {
    steps,
    output: raw.output,
    extras: raw.extras.map(([kind, at, text, step]) => ({ kind, at, text, step })),
    error: raw.error,
    stopped: raw.stopped,
    rows,
    columns,
    truncated: raw.truncated,
    totalSteps: raw.totalSteps,
    beyond: raw.beyond,
    loops: raw.loops,
  };
}

/** Where the program stopped, in words, when the tracer ended it. */
export function stopMessage(stopped: StopReason, limits: { steps: number; seconds: number; output: number }): string {
  if (stopped === 'steps') return `This program ran for over ${limits.steps.toLocaleString('en-GB')} steps, so it was stopped. It may be an infinite loop. Check that the loop's condition can become False.`;
  if (stopped === 'time') return `This program ran for over ${limits.seconds} seconds, so it was stopped. It may be an infinite loop.`;
  return `This program printed over ${limits.output.toLocaleString('en-GB')} characters, so it was stopped. It may be printing in an infinite loop.`;
}
