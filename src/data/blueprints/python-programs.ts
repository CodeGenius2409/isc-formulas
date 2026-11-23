// Python "write the output" programs for the generator. Their answers are Python's own: the Python tracer ran every
// program and recorded what it printed, in python-runs.json. The app never runs Python to make a question, as that
// would mean loading Pyodide on a practice page, so each blueprint has a fixed number of programs, each built from its
// variant number alone, and tests/unit/python-runs.test.ts runs them all again and fails if the record is out of date:
//   $env:WRITE_PYTHON_RUNS=1; npx vitest run tests/unit/python-runs.test.ts
import { Gen } from '../../practice/gen/gen';
import { seededRng } from '../../practice/questions';
import RUNS from './python-runs.json';
import type { OutputBody } from './types';

/** How many different programs each blueprint has. */
export const VARIANTS = 100;

const WORDS = ['COMPUTER', 'PROGRAM', 'NETWORK', 'KEYBOARD', 'MONITOR', 'SCIENCE', 'LIBRARY', 'NOTEBOOK', 'TEACHER', 'STUDENT', 'PRINTER', 'SYSTEM', 'BINARY', 'MEMORY', 'CIRCUIT', 'VARIABLE'];

/** How a Python program writes a list of numbers. */
const listOf = (items: number[]) => `[${items.join(', ')}]`;

interface Program {
  code: string;
  why: string;
}

/** Each blueprint's program, from a generator seeded by its variant. */
export const PYTHON_PROGRAMS: Record<string, (g: Gen) => Program> = {
  // Class XI, introduction to Python
  'py-basic': (g) => {
    const a = g.int(2, 15);
    const b = g.int(2, 6);
    const word = g.pick(WORDS).toLowerCase();
    const pick = g.int(0, 2);
    if (pick === 0) return { code: `a = ${a}\nb = ${b}\nprint(a // b)\nprint(a % b)\nprint(a ** 2)`, why: '// is floor division, % is the remainder, and ** is a power.' };
    if (pick === 1) return { code: `s = "${word}"\nprint(s[0])\nprint(s[-1])\nprint(s[1:3])\nprint(len(s))`, why: 'Indexes start at 0, and −1 is the last character.' };
    const list = Array.from({ length: g.int(3, 5) }, () => g.int(1, 9));
    return { code: `a = ${listOf(list)}\na.append(${a})\nprint(a)\nprint(len(a))\nprint(sum(a))`, why: 'append adds to the end of the list.' };
  },
  'py-5-xi': (g) => {
    const n = g.int(3, 6);
    return { code: `s = []\nfor i in range(1, ${n + 1}):\n    s.append(i * i)\nprint(s)\nprint(sum(s))\nprint(s[-1])\nprint(s[:2])\nprint(len(s))`, why: 'range stops one short of its second argument, and −1 is the last index.' };
  },

  // Class XII, strings, lists and tuples
  'py-string': (g) => {
    const word = g.pick(WORDS).toLowerCase();
    const form = g.int(0, 3);
    const a = g.int(1, 3);
    const b = g.int(a + 1, 5);
    const forms: Program[] = [
      { code: `s = "${word}"\nprint(s[${a}:${b}])\nprint(s[::-1])`, why: 'A slice stops one short of its second index, and [::-1] reverses.' },
      { code: `s = "${word}"\nprint(s[-${a}])\nprint(s[:${b}].upper())`, why: 'A negative index counts from the end, and a slice stops one short of its second index.' },
      { code: `s = "${word}"\nprint(len(s))\nprint(s[${a}:] + s[:${a}])`, why: 'A slice stops one short of its second index, and + joins the two parts.' },
      { code: `s = "${word}"\nprint(s.count("${word[a]}"))\nprint(s[${a}])`, why: 'count finds every match, and an index counts from 0.' },
    ];
    return forms[form];
  },
  'py-list': (g) => {
    const list = Array.from({ length: g.int(4, 6) }, () => g.int(1, 20));
    const x = g.int(21, 30);
    return { code: `a = ${listOf(list)}\na.append(${x})\nprint(len(a))\nprint(a[1:3])\na.reverse()\nprint(a[0])\nprint(sum(a))`, why: 'append adds to the end, and reverse changes the list in place.' };
  },
  'py-tuple': (g) => {
    const t = Array.from({ length: g.int(4, 6) }, () => g.int(1, 9));
    const a = g.int(1, 2);
    return { code: `t = (${t.join(', ')})\nprint(t[${a}])\nprint(len(t))\nprint(max(t))\nprint(t.count(${t[0]}))`, why: 'A tuple can be indexed and counted like a list, but not changed.' };
  },
  'py-5': (g) => {
    const list = Array.from({ length: g.int(5, 7) }, () => g.int(1, 20));
    return {
      code: `a = ${listOf(list)}\nb = []\nfor x in a:\n    if x % 2 == 0:\n        b.append(x)\nprint(b)\nprint(len(b))\nc = [x * x for x in a]\nprint(c[0])\nprint(c[-1])\nprint(a[::2])`,
      why: 'The loop keeps the even numbers, the comprehension squares each element, and [::2] takes every second one.',
    };
  },
};

function hash(text: string): number {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (Math.imul(h, 33) ^ text.charCodeAt(i)) >>> 0;
  return h;
}

/** A blueprint's program for one variant. The same variant always gives the same program. */
export function pythonProgram(id: string, variant: number): Program {
  const g = new Gen(seededRng((hash(id) ^ Math.imul(variant + 1, 2654435761)) >>> 0), 'computerscience', id);
  return PYTHON_PROGRAMS[id](g);
}

const recorded = RUNS as Record<string, string[]>;

/** A blueprint's body: a variant by the dice, with what Python printed for it. */
export function pythonOutput(id: string): (g: Gen) => OutputBody {
  return (g) => {
    const variant = g.int(0, VARIANTS - 1);
    const program = pythonProgram(id, variant);
    const expected = recorded[id]?.[variant];
    if (expected === undefined) g.retry('no recorded run for this program');
    return { form: 'output', text: 'Write the output of the following Python code.', code: program.code, expected: expected.replace(/\s+$/, ''), python: 1, why: program.why };
  };
}
