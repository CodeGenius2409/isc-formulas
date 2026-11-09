// New ways to ask in Computer Science. Nothing here is worked out by hand: a program's behaviour comes from running it in the
// tracer, including the changed version and an instrumented copy for tracing and counting. Boolean answers come from an exact
// truth table and Quine–McCluskey. Each template is an original program with a few values drawn each time.
import { runProgram } from '../../../java/trace';
import { minimalCover, primeImplicants, sopText, truthColumn, VARS } from '../../../practice/gen/boolean';
import type { Difficulty } from '../../../practice/bank/types';
import type { Gen } from '../../../practice/gen/gen';
import type { ClassLevel } from '../../types';
import { inMain, run, withMethods } from '../cs-common';
import type { Blueprint, Body, Format, Style } from '../types';

const fence = (code: string) => `\`\`\`\n${code}\n\`\`\``;

interface Template {
  /** Where it belongs, as level, unit and topic. */
  at: [ClassLevel, number, string];
  key: string;
  /**
   * Builds the program. `body` is the code with a marker comment on the line that a change or a gap applies to. Everything
   * else about the question follows from it.
   */
  make(g: Gen): {
    /** The program, with /*LINE*\/ at the start of the line that changes, or is missing. */
    code: string;
    /** That line changed, for "output after a change". */
    changed?: string;
    /** Says what the change is in words. */
    changeWords?: string;
    /** A loop's variable to trace: a statement to run at the end of each pass. /*TRACE*\/ marks where. */
    trace?: { name: string; at?: string };
    /** Whether /*COUNT*\/ marks the inside of a loop to count. */
    count?: string;
  };
}

const num = (g: Gen, low: number, high: number) => g.int(low, high);

// Each program has one line that can change, a loop that can be traced or counted, and something to print.
const TEMPLATES: Template[] = [
  // ---- Class XI: statements and scope
  { at: ['XI', 8, 'a'], key: 'sum-loop', make(g) {
    const n = num(g, 4, 9);
    const step = g.pick([1, 2]);
    return { code: inMain(`int total = 0;\nfor (int i = 1; i <= ${n}; i += ${step}) {\n/*LINE*/  total += i;\n/*TRACE*/\n/*COUNT*/\n}\nSystem.out.println(total);`), changed: '  total += i * i;', changeWords: 'total += i * i;', trace: { name: 'total' }, count: 'this loop body' };
  } },
  { at: ['XI', 8, 'a'], key: 'while-digits', make(g) {
    const n = num(g, 1234, 9876);
    return { code: inMain(`int n = ${n};\nint s = 0;\nwhile (n > 0) {\n/*LINE*/  s = s + n % 10;\n  n = n / 10;\n/*TRACE*/\n/*COUNT*/\n}\nSystem.out.println(s);`), changed: '  s = s * 10 + n % 10;', changeWords: 's = s * 10 + n % 10;', trace: { name: 's' }, count: 'the while loop' };
  } },
  { at: ['XI', 8, 'a'], key: 'nested-stars', make(g) {
    const n = num(g, 3, 5);
    return { code: inMain(`int c = 0;\nfor (int i = 1; i <= ${n}; i++) {\n/*LINE*/  for (int j = 1; j <= i; j++) {\n    c = c + j;\n/*COUNT*/\n  }\n}\nSystem.out.println(c);`), changed: `  for (int j = i; j <= ${n}; j++) {`, changeWords: `for (int j = i; j <= ${n}; j++) {`, count: 'the inner loop body' };
  } },
  { at: ['XI', 8, 'a'], key: 'do-while', make(g) {
    const start = num(g, 2, 6);
    const limit = start * num(g, 8, 20);
    return { code: inMain(`int x = ${start};\ndo {\n/*LINE*/  x = x * 2;\n/*TRACE*/\n/*COUNT*/\n} while (x < ${limit});\nSystem.out.println(x);`), changed: '  x = x * 3;', changeWords: 'x = x * 3;', trace: { name: 'x' }, count: 'the do-while body' };
  } },
  { at: ['XI', 8, 'a'], key: 'break-continue', make(g) {
    const n = num(g, 7, 12);
    const skip = num(g, 2, 3);
    const stop = num(g, 5, 6) + skip;
    return { code: inMain(`int s = 0;\nfor (int i = 1; i <= ${n}; i++) {\n  if (i % ${skip} == 0) continue;\n/*LINE*/  if (i > ${stop}) break;\n  s += i;\n/*TRACE*/\n}\nSystem.out.println(s);`), changed: `  if (i > ${stop + 2}) break;`, changeWords: `if (i > ${stop + 2}) break;`, trace: { name: 's' } };
  } },
  // ---- Class XI: variables and expressions
  { at: ['XI', 7, 'a'], key: 'mixed-ops', make(g) {
    const a = num(g, 5, 20);
    const b = num(g, 2, 7);
    return { code: inMain(`int a = ${a}, b = ${b};\n/*LINE*/int r = a / b + a % b;\nSystem.out.println(r);\nSystem.out.println(a * 1.0 / b > r);`), changed: 'int r = (a + b) / b - a % b;', changeWords: 'int r = (a + b) / b - a % b;' };
  } },
  { at: ['XI', 7, 'a'], key: 'increment', make(g) {
    const a = num(g, 2, 9);
    return { code: inMain(`int a = ${a};\n/*LINE*/int b = a++ + ++a;\nSystem.out.println(a);\nSystem.out.println(b);`), changed: 'int b = a-- + --a;', changeWords: 'int b = a-- + --a;' };
  } },
  // ---- Class XI: methods
  { at: ['XI', 9, 'a'], key: 'method-sum', make(g) {
    const n = num(g, 3, 7);
    const m = num(g, 2, 4);
    return { code: withMethods(`static int f(int x, int y) {\n/*LINE*/  return x * x + y;\n}`, `int s = 0;\nfor (int i = 1; i <= ${n}; i++) {\n  s = f(i, ${m}) - s;\n/*TRACE*/\n/*COUNT*/\n}\nSystem.out.println(s);`), changed: '  return x + y * y;', changeWords: 'return x + y * y;', trace: { name: 's' }, count: 'the loop in main' };
  } },
  { at: ['XI', 9, 'a'], key: 'value-param', make(g) {
    const a = num(g, 2, 9);
    const k = num(g, 2, 5);
    return { code: withMethods(`static int twice(int n) {\n/*LINE*/  n = n * ${k};\n  return n;\n}`, `int a = ${a};\nint b = twice(a);\nSystem.out.println(a);\nSystem.out.println(b);`), changed: `  n = n * ${k} + 1;`, changeWords: `n = n * ${k} + 1;` };
  } },
  // ---- Class XI: arrays and strings
  { at: ['XI', 10, 'a'], key: 'array-sum', make(g) {
    const list = g.sample([3, 5, 7, 8, 11, 12, 14, 16, 19, 21], 5);
    return { code: inMain(`int[] a = {${list.join(', ')}};\nint m = a[0];\nfor (int i = 1; i < a.length; i++) {\n/*LINE*/  if (a[i] > m) m = a[i];\n/*TRACE*/\n/*COUNT*/\n}\nSystem.out.println(m);`), changed: '  if (a[i] < m) m = a[i];', changeWords: 'if (a[i] < m) m = a[i];', trace: { name: 'm' }, count: 'the for loop' };
  } },
  { at: ['XI', 10, 'a'], key: 'string-count', make(g) {
    const word = g.pick(['COMPUTER', 'ALGORITHM', 'VARIABLE', 'INTERFACE', 'PROGRAM', 'EQUATION']);
    return { code: inMain(`String s = "${word}";\nint c = 0;\nfor (int i = 0; i < s.length(); i++) {\n/*LINE*/  if ("AEIOU".indexOf(s.charAt(i)) >= 0) c++;\n/*TRACE*/\n}\nSystem.out.println(c);`), changed: '  if ("AEIOU".indexOf(s.charAt(i)) < 0) c++;', changeWords: 'if ("AEIOU".indexOf(s.charAt(i)) < 0) c++;', trace: { name: 'c' } };
  } },
  // ---- Class XII: methods
  { at: ['XII', 3, 'a'], key: 'digit-rev', make(g) {
    const n = num(g, 123, 987);
    return { code: withMethods(`static int r(int n) {\n  int x = 0;\n  while (n != 0) {\n/*LINE*/    x = x * 10 + n % 10;\n    n /= 10;\n/*COUNT*/\n  }\n  return x;\n}`, `System.out.println(r(${n}));`), changed: '    x = x + n % 10;', changeWords: 'x = x + n % 10;', count: 'the while loop' };
  } },
  { at: ['XII', 3, 'a'], key: 'gcd-loop', make(g) {
    const a = num(g, 2, 9) * 6;
    const b = num(g, 2, 9) * 4;
    return { code: withMethods(`static int h(int a, int b) {\n  while (b != 0) {\n    int t = a % b;\n    a = b;\n/*LINE*/    b = t;\n/*COUNT*/\n  }\n  return a;\n}`, `System.out.println(h(${a}, ${b}));`), count: 'the while loop' };
  } },
  { at: ['XII', 3, 'a'], key: 'prime-count', make(g) {
    const n = num(g, 10, 20);
    return { code: withMethods(`static boolean p(int n) {\n  if (n < 2) return false;\n  for (int i = 2; i * i <= n; i++) {\n    if (n % i == 0) return false;\n  }\n/*LINE*/  return true;\n}`, `int c = 0;\nfor (int i = 1; i <= ${n}; i++) {\n  if (p(i)) c++;\n/*TRACE*/\n}\nSystem.out.println(c);`), trace: { name: 'c' } };
  } },
  // ---- Class XII: arrays
  { at: ['XII', 4, 'a'], key: 'bubble-pass', make(g) {
    const list = g.sample([9, 7, 6, 5, 4, 3, 2, 8], 5);
    return { code: inMain(`int[] a = {${list.join(', ')}};\nfor (int j = 0; j < a.length - 1; j++) {\n/*LINE*/  if (a[j] > a[j + 1]) {\n    int t = a[j];\n    a[j] = a[j + 1];\n    a[j + 1] = t;\n  }\n/*COUNT*/\n}\nfor (int x : a) System.out.print(x + " ");`), changed: '  if (a[j] < a[j + 1]) {', changeWords: 'if (a[j] < a[j + 1]) {', count: 'the for loop' };
  } },
  { at: ['XII', 4, 'a'], key: 'matrix-diag', make(g) {
    const v = g.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 9);
    return { code: inMain(`int[][] m = {{${v[0]}, ${v[1]}, ${v[2]}}, {${v[3]}, ${v[4]}, ${v[5]}}, {${v[6]}, ${v[7]}, ${v[8]}}};\nint s = 0;\nfor (int i = 0; i < 3; i++) {\n/*LINE*/  s += m[i][i];\n/*TRACE*/\n/*COUNT*/\n}\nSystem.out.println(s);`), changed: '  s += m[i][2 - i];', changeWords: 's += m[i][2 - i];', trace: { name: 's' }, count: 'the for loop' };
  } },
  { at: ['XII', 4, 'a'], key: 'binary-search', make(g) {
    const start = num(g, 2, 5);
    const list = [0, 1, 2, 3, 4, 5, 6].map((i) => start + i * 3);
    const key = g.pick(list);
    return { code: inMain(`int[] a = {${list.join(', ')}};\nint lo = 0, hi = a.length - 1, pos = -1;\nwhile (lo <= hi && pos < 0) {\n  int mid = (lo + hi) / 2;\n  if (a[mid] == ${key}) pos = mid;\n  else if (a[mid] < ${key}) lo = mid + 1;\n  else hi = mid - 1;\n/*COUNT*/\n}\n/*LINE*/System.out.println(pos);`), count: 'the while loop' };
  } },
  // ---- Class XII: strings
  { at: ['XII', 4, 'b'], key: 'reverse-word', make(g) {
    const word = g.pick(['SWAPPING', 'RECURSE', 'TRACING', 'OBJECTS', 'CLASSES']);
    return { code: inMain(`String s = "${word}";\nString t = "";\nfor (int i = 0; i < s.length(); i++) {\n/*LINE*/  t = s.charAt(i) + t;\n/*TRACE*/\n}\nSystem.out.println(t);`), changed: '  t = t + s.charAt(i);', changeWords: 't = t + s.charAt(i);', trace: { name: 't' } };
  } },
  { at: ['XII', 4, 'b'], key: 'sub-index', make(g) {
    const word = g.pick(['INFORMATION', 'COMPUTATION', 'OPERATIONAL', 'ABSTRACTION']);
    const from = num(g, 1, 3);
    const to = from + num(g, 3, 5);
    return { code: inMain(`String s = "${word}";\n/*LINE*/String t = s.substring(${from}, ${to});\nSystem.out.println(t);\nSystem.out.println(t.length());\nSystem.out.println(s.indexOf('O'));`), changed: `String t = s.substring(${from + 1});`, changeWords: `String t = s.substring(${from + 1});` };
  } },
  // ---- Class XII: recursion
  { at: ['XII', 5, 'a'], key: 'rec-sum', make(g) {
    const n = num(g, 3, 7);
    return { code: withMethods(`static int f(int n) {\n  if (n <= 1) return 1;\n/*LINE*/  return n + f(n - 1);\n}`, `System.out.println(f(${n}));`), changed: '  return n * f(n - 1);', changeWords: 'return n * f(n - 1);' };
  } },
  { at: ['XII', 5, 'a'], key: 'rec-print', make(g) {
    const n = num(g, 3, 6);
    return { code: withMethods(`static void show(int n) {\n  if (n == 0) return;\n/*LINE*/  System.out.print(n + " ");\n  show(n - 1);\n}`, `show(${n});`), changed: '  System.out.print(n * 2 + " ");', changeWords: 'System.out.print(n * 2 + " ");' };
  } },
  { at: ['XII', 5, 'a'], key: 'rec-digits', make(g) {
    const n = num(g, 1234, 9876);
    return { code: withMethods(`static int d(int n) {\n  if (n < 10) return n;\n/*LINE*/  return n % 10 + d(n / 10);\n}`, `System.out.println(d(${n}));`), changed: '  return n % 10 * d(n / 10);', changeWords: 'return n % 10 * d(n / 10);' };
  } },
  // ---- Class XII: inheritance
  { at: ['XII', 6, 'a'], key: 'override', make(g) {
    const a = num(g, 2, 9);
    const b = num(g, 2, 9);
    const code = `class Base {\n  int v = ${a};\n  int get() { return v; }\n}\nclass Child extends Base {\n/*LINE*/  int get() { return v * ${b}; }\n}\nclass Test {\n  public static void main(String[] args) {\n    Base x = new Child();\n    System.out.println(x.get());\n    System.out.println(new Base().get());\n  }\n}`;
    return { code, changed: `  int get() { return super.get() + ${b}; }`, changeWords: `int get() { return super.get() + ${b}; }` };
  } },
  { at: ['XII', 6, 'a'], key: 'ctor-order', make(g) {
    const a = num(g, 2, 9);
    const code = `class A {\n  A() { System.out.println("A"); }\n}\nclass B extends A {\n/*LINE*/  B() { System.out.println("B"); }\n  B(int x) { this(); System.out.println(x); }\n}\nclass Test {\n  public static void main(String[] args) {\n    new B(${a});\n  }\n}`;
    return { code, changed: `  B() { super(); System.out.println("C"); }`, changeWords: 'B() { super(); System.out.println("C"); }' };
  } },
];

const clean = (code: string) =>
  code
    .split('\n')
    .filter((line) => !/^\s*\/\*(TRACE|COUNT)\*\/\s*$/.test(line))
    .map((line) => line.replace('/*LINE*/', ''))
    .join('\n');

/** The source of the line marked, with the change put in. */
const withChange = (code: string, changed: string) =>
  code
    .split('\n')
    .filter((line) => !/^\s*\/\*(TRACE|COUNT)\*\/\s*$/.test(line))
    .map((line) => (line.includes('/*LINE*/') ? (line.match(/^\s*/)?.[0] ?? '') + changed.trim() : line))
    .join('\n');

const markedLine = (code: string) => code.split('\n').find((line) => line.includes('/*LINE*/'))!.replace('/*LINE*/', '').trim();

function changeQuestion(g: Gen, t: Template): Body {
  const built = t.make(g);
  if (!built.changed) g.retry('no change for this program');
  const before = run(g, clean(built.code));
  const after = run(g, withChange(built.code, built.changed!));
  if (before === after) g.retry('the change makes no difference');
  const line = markedLine(built.code);
  return {
    form: 'output',
    text: `This program prints:\n${fence(before)}\nWrite what it prints if the line\n${fence(line)}\nis changed to\n${fence(built.changeWords!)}\n`,
    code: clean(built.code),
    expected: after,
    why: 'The changed program was run to get this.',
  };
}

function traceQuestion(g: Gen, t: Template): Body {
  const built = t.make(g);
  if (!built.trace) g.retry('nothing to trace');
  const name = built.trace!.name;
  const probe = built.code
    .split('\n')
    .filter((line) => !/^\s*\/\*COUNT\*\/\s*$/.test(line))
    .map((line) => (/^\s*\/\*TRACE\*\/\s*$/.test(line) ? `  System.out.println("#" + ${name});` : line.replace('/*LINE*/', '')))
    .join('\n');
  const output = runProgram(probe);
  if (output.error || output.truncated) g.retry('the traced program did not run');
  const values = output.output.split('\n').filter((l) => l.startsWith('#')).map((l) => l.slice(1));
  if (values.length < 2 || values.length > 12) g.retry('too few or too many values to trace');
  return g.theory(`Trace the program. Write the value of ${name} at the end of each pass of the loop, in order.\n${fence(clean(built.code))}`, [[`Values of ${name}: ${values.join(', ')}.`, 2]]);
}

function countQuestion(g: Gen, t: Template): Body {
  const built = t.make(g);
  if (!built.count) g.retry('nothing to count');
  const probe = built.code
    .split('\n')
    .filter((line) => !/^\s*\/\*TRACE\*\/\s*$/.test(line))
    .map((line) => (/^\s*\/\*COUNT\*\/\s*$/.test(line) ? '  System.out.println("#");' : line.replace('/*LINE*/', '')))
    .join('\n');
  const output = runProgram(probe);
  if (output.error || output.truncated) g.retry('the counted program did not run');
  const times = output.output.split('\n').filter((l) => l === '#').length;
  if (!times) g.retry('the loop never ran');
  return g.theory(`How many times does ${built.count} run?\n${fence(clean(built.code))}`, [[`${times} ${times === 1 ? 'time' : 'times'}.`, 1]]);
}

function fillQuestion(g: Gen, t: Template): Body {
  const built = t.make(g);
  const code = clean(built.code);
  const output = run(g, code);
  const line = markedLine(built.code);
  const gapped = built.code
    .split('\n')
    .filter((l) => !/^\s*\/\*(TRACE|COUNT)\*\/\s*$/.test(l))
    .map((l) => (l.includes('/*LINE*/') ? `${l.replace('/*LINE*/', '').match(/^\s*/)?.[0] ?? ''}// ?1?` : l))
    .join('\n');
  return g.theory(`One line is missing, at ?1?. When it is there, the program prints:\n${fence(output)}\nWrite the missing line.\n${fence(gapped)}`, [[line, 2]], { model: fence(code) });
}

// ---- Boolean: expression, truth table and circuit, in each direction.
interface BoolExpr {
  text: string;
  f: (bits: boolean[]) => boolean;
  gates: string;
}

const pickExpr = (g: Gen, size: number): BoolExpr => {
  const [a, b, c] = g.shuffle(VARS.slice(0, size));
  const at = (name: string) => VARS.indexOf(name);
  const choices: BoolExpr[] = [
    { text: `${a}·${b} + ${c ?? a}′`, f: (x) => (x[at(a)] && x[at(b)]) || !x[at(c ?? a)], gates: `an AND gate on ${a} and ${b}, a NOT gate on ${c ?? a}, and an OR gate joining them` },
    { text: `(${a} + ${b})·${c ?? b}′`, f: (x) => (x[at(a)] || x[at(b)]) && !x[at(c ?? b)], gates: `an OR gate on ${a} and ${b}, a NOT gate on ${c ?? b}, and an AND gate joining them` },
    { text: `${a}′·${b} + ${a}·${b}′`, f: (x) => (!x[at(a)] && x[at(b)]) || (x[at(a)] && !x[at(b)]), gates: `two NOT gates, two AND gates, and an OR gate joining them` },
    { text: `(${a}·${b})′ + ${c ?? b}`, f: (x) => !(x[at(a)] && x[at(b)]) || x[at(c ?? b)], gates: `a NAND gate on ${a} and ${b}, and an OR gate joining it to ${c ?? b}` },
  ];
  return g.pick(choices);
};

function truthRows(size: number, column: boolean[]): { head: string[]; rows: string[][] } {
  const names = VARS.slice(0, size);
  const rows = column.map((value, i) => [...names.map((_, j) => String((i >> (size - 1 - j)) & 1)), value ? '1' : '0']);
  return { head: [...names, 'X'], rows };
}

function toTable(g: Gen, size: number): Body {
  const e = pickExpr(g, size);
  const column = truthColumn(size, e.f);
  return g.theory(`Write the output column of the truth table for X = ${e.text}. Take the input rows in the usual order, from all 0s to all 1s.`, [[`X, from the first row to the last: ${column.map((v) => (v ? 1 : 0)).join(', ')}.`, 2]]);
}

function fromTable(g: Gen, size: number): Body {
  const e = pickExpr(g, size);
  const column = truthColumn(size, e.f);
  const minterms = column.flatMap((v, i) => (v ? [i] : []));
  if (!minterms.length || minterms.length === column.length) g.retry('a constant function');
  const cover = minimalCover(minterms, primeImplicants(minterms));
  return { ...g.theory('The table gives a Boolean function X. Write X as a simplified sum of products.', [[`X = ${sopText(cover, size)}`, 3]]), diagram: { kind: 'table', ...truthRows(size, column) } };
}

function toCircuit(g: Gen, size: number): Body {
  const e = pickExpr(g, size);
  return g.theory(`Describe a logic circuit for X = ${e.text}, using basic gates. Say which gates it needs, and how they are joined.`, [[`It needs ${e.gates}.`, 2]]);
}

function fromCircuit(g: Gen, size: number): Body {
  const e = pickExpr(g, size);
  const column = truthColumn(size, e.f);
  const row = g.int(0, column.length - 1);
  const names = VARS.slice(0, size);
  const inputs = names.flatMap((name, j) => (e.text.includes(name) ? [`${name} = ${(row >> (size - 1 - j)) & 1}`] : [])).join(', ');
  return g.theory(`A circuit has ${e.gates}, and its output is X = ${e.text}. What is X when ${inputs}?`, [[`X = ${column[row] ? 1 : 0}.`, 1]]);
}

const BOOL_TOPICS: [ClassLevel, number, string, number][] = [
  ['XI', 3, 'a', 2],
  ['XI', 3, 'b', 2],
  ['XII', 1, 'a', 3],
  ['XII', 1, 'b', 3],
  ['XII', 2, 'a', 3],
];

export function csBlueprints(level: ClassLevel): Blueprint[] {
  const prefix = `k${level === 'XII' ? '12' : '11'}`;
  const out: Blueprint[] = [];
  const add = (unit: number, topic: string, key: string, marks: number, difficulty: Difficulty, type: Blueprint['type'], format: Format, family: string, make: (g: Gen) => Body, style: Style = 'paper-style') =>
    out.push({ id: `${prefix}-${unit}${topic}-v-${key}`, subject: 'computerscience', level, unit, topic, marks, difficulty, type, format, style, family, make });
  for (const t of TEMPLATES) {
    if (t.at[0] !== level) continue;
    const [, unit, topic] = t.at;
    // A throwaway run shows what this template can do, with its own dice.
    const sample = t.make({ int: (a: number) => a, pick: <T,>(l: readonly T[]) => l[0], sample: <T,>(l: readonly T[], n: number) => l.slice(0, n) } as unknown as Gen);
    if (sample.changed) add(unit, topic, `change-${t.key}`, 2, 2, 'output', 'change', 'change', (g) => changeQuestion(g, t));
    if (sample.trace) add(unit, topic, `trace-${t.key}`, 2, 2, 'short', 'trace', 'trace', (g) => traceQuestion(g, t));
    if (sample.count) add(unit, topic, `count-${t.key}`, 1, 1, 'short', 'trace', 'count', (g) => countQuestion(g, t));
    add(unit, topic, `fill-${t.key}`, 2, 3, 'complete', 'fill', 'fill', (g) => fillQuestion(g, t));
  }
  for (const [l, unit, topic, size] of BOOL_TOPICS) {
    if (l !== level) continue;
    add(unit, topic, 'to-table', 2, 1, 'short', 'convert', 'to-table', (g) => toTable(g, size));
    add(unit, topic, 'from-table', 3, 3, 'short', 'convert', 'from-table', (g) => fromTable(g, size));
    add(unit, topic, 'to-circuit', 2, 2, 'short', 'convert', 'to-circuit', (g) => toCircuit(g, size));
    add(unit, topic, 'from-circuit', 1, 1, 'short', 'convert', 'from-circuit', (g) => fromCircuit(g, size));
  }
  return out;
}
