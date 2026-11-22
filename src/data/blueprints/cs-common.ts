// Shared by both Computer Science classes. Java answers come from really running the program in the app's tracer,
// so they can't drift from what the code does. Python answers are what the Python tracer printed: see
// python-programs.ts.
import { runProgram } from '../../java/trace';
import type { Gen } from '../../practice/gen/gen';
import type { OutputBody, TheoryBody } from './types';

const fence = (code: string) => `\`\`\`\n${code}\n\`\`\``;

/** Runs a program, and refuses it unless it finishes cleanly with some output. */
export function run(g: Gen, code: string): string {
  const result = runProgram(code);
  if (result.error || result.truncated || !result.output.trim()) g.retry(`the program didn't run cleanly: ${result.error?.message ?? 'no output'}`);
  return result.output.replace(/\s+$/, '');
}

export function outputOf(g: Gen, code: string, why?: string, text = 'Write the output of the following program.'): OutputBody {
  return { form: 'output', text, code, expected: run(g, code), why };
}

/** A class with a main method from its statements. */
export const inMain = (statements: string, name = 'Test') =>
  `class ${name} {\n  public static void main(String[] args) {\n${statements
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n')}\n  }\n}`;

/** A class with helper methods and a main. */
export const withMethods = (methods: string, statements: string, name = 'Test') =>
  `class ${name} {\n${methods
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')}\n  public static void main(String[] args) {\n${statements
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n')}\n  }\n}`;

/** Find the error: the broken program must really fail, and the fixed one must really run. */
export function findError(g: Gen, broken: string, fixed: string, points: (string | [string, number])[]): TheoryBody {
  const bad = runProgram(broken);
  if (!bad.error) g.retry('the broken program ran without an error');
  run(g, fixed);
  return g.theory(`The following program doesn’t work. Find the error and correct it.\n${fence(broken)}`, points);
}

/** Fill in the missing parts: the finished program must print what the question says it prints. */
export function complete(g: Gen, withGaps: string, filled: string, points: [string, number][], intro: string): TheoryBody {
  const output = run(g, filled);
  return g.theory(`${intro}\nWhen complete, it prints:\n${fence(output)}\nWrite what goes in place of each ?n?.\n${fence(withGaps)}`, points, { model: fence(filled) });
}

/** A "design a class" question, with a model answer that has really been run. */
export function designClass(g: Gen, spec: string, model: string, points: [string, number][]): TheoryBody {
  run(g, model);
  return g.theory(spec, points, { model: fence(model) });
}

/** The same, where the question leaves out main(): the model answer is run with a main of its own, and shown without it. */
export function designChecked(g: Gen, spec: string, model: string, main: string, points: [string, number][]): TheoryBody {
  run(g, `${model}\n${main}`);
  return g.theory(spec, points, { model: fence(model) });
}

export const SHORT_WORDS = ['COMPUTER', 'PROGRAM', 'NETWORK', 'KEYBOARD', 'MONITOR', 'SCIENCE', 'LIBRARY', 'NOTEBOOK', 'TEACHER', 'STUDENT', 'PRINTER', 'SYSTEM', 'BINARY', 'MEMORY', 'CIRCUIT', 'VARIABLE'];
