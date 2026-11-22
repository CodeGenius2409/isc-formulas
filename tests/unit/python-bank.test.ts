// Every Python answer in the bank, run in the Python tracer. These used to be traced by hand, as the tracer
// ran only Java. Output questions are run as they stand; match questions have each "expression, value" pair
// evaluated; "… gives:" questions have their right option evaluated; and each other question whose answer
// says what Python does has a program in python-bank-checks.ts.
import { describe, expect, it } from 'vitest';
import type { ClassLevel } from '../../src/data/types';
import { loadBankUnits } from '../../src/practice/bank';
import { normaliseOutput } from '../../src/practice/bank/mark';
import type { BankDef } from '../../src/practice/bank/types';
import { nodeEngine } from './lib/python-node';
import { BANK_CHECKS } from './python-bank-checks';

/** The syllabus's Python units: XI 12 (Introduction to Python) and XII 7 (strings, lists and tuples). */
const PYTHON_UNITS: [ClassLevel, number][] = [
  ['XI', 12],
  ['XII', 7],
];

async function pythonDefs(): Promise<BankDef[]> {
  const all: BankDef[] = [];
  for (const [level, unit] of PYTHON_UNITS) all.push(...(await loadBankUnits('computerscience', level, [unit])).defs.filter((d) => d.unit === unit));
  return all;
}

/** Everything a question says, in which an answer's values must appear. */
function answerOf(d: BankDef): string {
  const parts = [d.text];
  if (d.form === 'theory') parts.push(...d.points.map((p) => p.text), d.model ?? '');
  if (d.form === 'mcq') parts.push(d.options[d.answer]?.text ?? '', d.why ?? '');
  if (d.form === 'output') parts.push(d.expected, d.why ?? '');
  return parts.join('\n').replace(/`/g, '');
}

const fenced = (model: string) => /```\n?([\s\S]*?)```/.exec(model)?.[1] ?? model;

const run = async (code: string, input = '') => (await nodeEngine()).run(code, input);

/** Python that compares each pair, printing one word for each: same, skip (not code), or what differed. */
const PAIR_CHECK = `
import ast, sys
def compare(left, right):
    try:
        want = eval(right, {})
    except Exception:
        return 'skip'
    try:
        ast.parse(left, mode='eval')
    except SyntaxError:
        return 'skip'
    try:
        got = eval(left, {})
    except NameError:
        return 'skip'
    except Exception as e:
        return 'error ' + type(e).__name__ + ' in ' + left
    if isinstance(got, range):
        got = tuple(got)
    return 'same' if got == want else 'differ ' + repr(got) + ' for ' + left + ' against ' + right
for left, right in PAIRS:
    print(compare(left, right))
`;

const pyString = (s: string) => JSON.stringify(s);

describe('the bank’s Python answers, run in the Python tracer', () => {
  it('finds the Python questions', async () => {
    const defs = await pythonDefs();
    expect(defs.length).toBeGreaterThan(150);
  });

  it('prints exactly what each "write the output" question says', async () => {
    let checked = 0;
    for (const d of await pythonDefs()) {
      if (d.form !== 'output' || !d.python) continue;
      const r = await run(d.code);
      expect(r.error, `${d.id}: ${r.error?.text}`).toBeNull();
      expect(normaliseOutput(r.output), d.id).toBe(normaliseOutput(d.expected));
      checked++;
    }
    expect(checked).toBeGreaterThan(20);
  });

  it('has the right value for every expression in a match question', async () => {
    let same = 0;
    for (const d of await pythonDefs()) {
      if (d.form !== 'theory' || d.format !== 'match') continue;
      const pairs = d.points.map((p) => /^\(\d+\) (.*) goes with \([a-h]\), (.*)\.$/.exec(p.text)).filter((m) => m !== null).map((m) => [m[1], m[2]]);
      const r = await run(`PAIRS = [${pairs.map(([a, b]) => `(${pyString(a)}, ${pyString(b)})`).join(', ')}]\n${PAIR_CHECK}`);
      expect(r.error, d.id).toBeNull();
      const results = r.output.trim().split('\n');
      expect(results.filter((x) => x !== 'same' && x !== 'skip'), d.id).toEqual([]);
      same += results.filter((x) => x === 'same').length;
    }
    expect(same).toBeGreaterThanOrEqual(25);
  });

  it('marks the right option where a question asks what an expression gives', async () => {
    let checked = 0;
    for (const d of await pythonDefs()) {
      if (d.form !== 'mcq') continue;
      const asked = /^(.+) gives:$/.exec(d.text.trim())?.[1];
      const right = d.options[d.answer]?.text;
      if (!asked || !right) continue;
      const fails = /^an? (\w*Error|error)$/.exec(right);
      const r = await run(fails ? asked : `PAIRS = [(${pyString(asked)}, ${pyString(right)})]\n${PAIR_CHECK}`);
      // "t[0] = 1 on a tuple gives:" is words around code, not code, so there is nothing to run.
      if (fails && r.error?.type === 'SyntaxError') continue;
      if (fails) {
        expect(r.error, d.id).not.toBeNull();
        if (fails[1] !== 'error') expect(r.error?.type, d.id).toBe(fails[1]);
      } else {
        expect(r.error, d.id).toBeNull();
        if (r.output.trim() === 'skip') continue;
        expect(r.output.trim(), `${d.id}: ${asked} gives ${right}`).toBe('same');
      }
      checked++;
    }
    expect(checked).toBeGreaterThanOrEqual(5);
  });

  it.each(BANK_CHECKS.map((c) => [c.ask.split('\n').pop()!.slice(0, 70), c] as const))('%s', async (_name, check) => {
    const defs = await pythonDefs();
    // The first line starts the wording. Any more lines are pieces of it, which is how an odd-one-out question,
    // whose items are listed in a mixed-up order, is found.
    const [start, ...pieces] = check.ask.split('\n');
    const found = defs.filter((d) => (d.origin ?? 'written') === 'written' && d.text.startsWith(start) && pieces.every((p) => d.text.includes(p)));
    expect(found.length, `exactly one hand-written question matches "${check.ask}"`).toBe(1);
    const d = found[0];
    const model = check.model ? fenced(d.form === 'theory' ? (d.model ?? '') : '') : '';
    if (check.model) expect(model.trim(), 'the question has a model program').not.toBe('');
    const code = [model, check.run ?? ''].filter(Boolean).join('\n');
    const r = await run(code, check.input ?? '');
    const answer = answerOf(d);

    if (check.error) {
      expect(r.error?.type).toBe(check.error);
      if (check.prints === undefined) expect(answer, 'the answer names the error').toContain(check.error);
    } else {
      expect(r.error, r.error?.text).toBeNull();
    }
    if (check.prints !== undefined) {
      expect(r.output).toBe(check.prints);
    } else if (!check.shows) {
      const printed = r.output.split('\n').map((l) => l.trim()).filter(Boolean);
      expect(printed.length).toBeGreaterThan(0);
      for (const line of printed) expect(answer, `the answer says ${line}`).toContain(line);
    }
    for (const value of check.shows ?? []) {
      expect(r.output).toContain(value);
      expect(answer).toContain(value);
    }
  });

  it('runs every Python model program in the bank without an error', async () => {
    let checked = 0;
    for (const d of await pythonDefs()) {
      if (d.form !== 'theory' || !d.model) continue;
      const code = fenced(d.model);
      // Programs that read input get a line of digits and words, which every one of them can take.
      const r = await run(code, ['5', '3', '8', '1', '9', '4', '7'].join('\n'));
      expect(r.error, `${d.id}: ${r.error?.text}`).toBeNull();
      checked++;
    }
    expect(checked).toBeGreaterThanOrEqual(10);
  });
});
