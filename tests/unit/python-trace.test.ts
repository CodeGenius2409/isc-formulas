// What the Python tracer records, on programs whose every step is known: the lines it stops on, the variables
// at each step, which names are one list, the call stack through recursion, the dry-run table, input, the
// limits, and the walls around a student's program.
import { describe, expect, it } from 'vitest';
import { LIMITS } from '../../src/python/engine';
import { PY_SAMPLES } from '../../src/python/samples';
import type { PyRunResult, PyStep } from '../../src/python/trace';
import { nodeEngine } from './lib/python-node';

const run = async (code: string, input = '') => (await nodeEngine()).run(code, input);
const top = (step: PyStep) => step.frames[step.frames.length - 1];
const varOf = (step: PyStep, name: string, frame = step.frames.length - 1) => step.frames[frame].vars.find((v) => v.name === name);
const lineSteps = (r: PyRunResult) => r.steps.filter((s) => s.event === 'line');

describe('the samples', () => {
  it.each(PY_SAMPLES.map((s) => [s.title, s] as const))('%s prints what it should, in the tracer', async (_t, sample) => {
    const r = await run(sample.code, sample.input ?? '');
    expect(r.error).toBeNull();
    expect(r.output).toBe(sample.expected);
    expect(r.beyond, 'a sample keeps to the syllabus').toEqual([]);
    expect(r.truncated).toBe(false);
  });

  it('has 15 or more, across the topics', () => {
    expect(PY_SAMPLES.length).toBeGreaterThanOrEqual(15);
    expect(new Set(PY_SAMPLES.map((s) => s.topic))).toEqual(new Set(['Lists', 'Tuples', 'Strings', 'Searching and sorting', 'Recursion', 'Functions', 'Loops and numbers', 'Python’s library']));
    expect(new Set(PY_SAMPLES.map((s) => s.id)).size).toBe(PY_SAMPLES.length);
  });
});

describe('steps and variables', () => {
  it('stops on each line in the order Python runs them, and ends with an empty stack', async () => {
    const r = await run('total = 0\nfor i in range(3):\n    total += i\nprint(total)');
    expect(lineSteps(r).map((s) => s.line)).toEqual([1, 2, 3, 2, 3, 2, 3, 2, 4]);
    expect(r.steps[r.steps.length - 1].event).toBe('end');
    expect(r.steps[r.steps.length - 1].frames).toEqual([]);
    expect(r.output).toBe('3\n');
  });

  it('shows the variables as they are before each line runs, with their types', async () => {
    const r = await run('x = 5\ny = x * 2.5\nname = "Asha"\nflag = x > 3');
    const last = lineSteps(r).pop()!;
    expect(top(last).fn).toBe('<module>');
    expect(top(last).vars.map((v) => [v.name, v.type, v.value])).toEqual([
      ['x', 'int', '5'],
      ['y', 'float', '12.5'],
      ['name', 'str', "'Asha'"],
    ]);
    expect(r.steps[r.steps.length - 2].frames[0].vars.find((v) => v.name === 'flag')).toBeUndefined();
  });

  it('leaves out modules, functions and Python’s own names', async () => {
    const r = await run('import math\ndef f():\n    return 1\nn = f()\nprint(n)');
    const last = lineSteps(r).pop()!;
    expect(top(last).vars.map((v) => v.name)).toEqual(['n']);
  });

  it('writes values as Python does, and shortens long ones', async () => {
    const r = await run('t = (1,)\ns = {3}\nd = {"a": [1, 2]}\ne = set()\nbig = list(range(500))\nlong = "x" * 500\nn = None\npass');
    const last = lineSteps(r).pop()!;
    const value = (name: string) => varOf(last, name)?.value;
    expect([value('t'), value('s'), value('d'), value('e'), value('n')]).toEqual(['(1,)', '{3}', "{'a': [1, 2]}", 'set()', 'None']);
    expect(value('big')!.length).toBeLessThanOrEqual(160);
    expect(value('big')!.endsWith('…')).toBe(true);
    expect(value('long')!.length).toBeLessThanOrEqual(160);
  });

  it('writes fractions, decimals and dates as a student would, and as their reprs inside a list', async () => {
    const r = await run(
      [
        'from fractions import Fraction',
        'from decimal import Decimal',
        'from datetime import date, datetime, timedelta',
        'f = Fraction(3, 4)',
        'd = Decimal("0.1") + Decimal("0.2")',
        'day = date(2028, 2, 14)',
        'when = datetime(2028, 2, 14, 9, 30)',
        'gap = timedelta(days=3, hours=2)',
        'items = [Fraction(1, 2), Decimal("1.5"), date(2028, 1, 1)]',
        'pass',
      ].join('\n'),
    );
    const last = lineSteps(r).pop()!;
    const shown = (name: string) => [varOf(last, name)?.type, varOf(last, name)?.value];
    expect(shown('f')).toEqual(['Fraction', '3/4']);
    expect(shown('d')).toEqual(['Decimal', '0.3']);
    expect(shown('day')).toEqual(['date', '2028-02-14']);
    expect(shown('when')).toEqual(['datetime', '2028-02-14 09:30:00']);
    expect(shown('gap')).toEqual(['timedelta', '3 days, 2:00:00']);
    expect(shown('items')).toEqual(['list', "[Fraction(1, 2), Decimal('1.5'), datetime.date(2028, 1, 1)]"]);
  });

  it('writes Counter, deque, defaultdict and named tuples as their reprs do', async () => {
    const r = await run(
      [
        'from collections import Counter, deque, defaultdict, namedtuple, OrderedDict',
        'c = Counter("banana")',
        'q = deque([1, 2, 3], maxlen=5)',
        'q.appendleft(0)',
        'g = defaultdict(list)',
        'g["a"].append(1)',
        'empty = Counter()',
        'Point = namedtuple("Point", "x y")',
        'p = Point(3, 4)',
        'o = OrderedDict(b=2, a=1)',
        'pass',
      ].join('\n'),
    );
    const last = lineSteps(r).pop()!;
    const value = (name: string) => varOf(last, name)?.value;
    expect(value('c')).toBe("Counter({'a': 3, 'n': 2, 'b': 1})");
    expect(value('q')).toBe('deque([0, 1, 2, 3], maxlen=5)');
    expect(value('g')).toBe("defaultdict(<class 'list'>, {'a': [1]})");
    expect(value('empty')).toBe('Counter()');
    expect(value('p')).toBe('Point(x=3, y=4)');
    expect(value('o')).toBe("OrderedDict({'b': 2, 'a': 1})");
  });

  it('never calls a __repr__ the program wrote, even on a subclass of a library type', async () => {
    const r = await run('from fractions import Fraction\nclass Loud(Fraction):\n    def __repr__(self):\n        print("called!")\n        return "loud"\nx = Loud(1, 2)\npass');
    expect(r.output).toBe('');
    expect(varOf(lineSteps(r).pop()!, 'x')?.value).not.toContain('loud');
  });
});

describe('aliasing', () => {
  it('marks two names for the same list, and not a copy', async () => {
    const r = await run('a = [1, 2]\nb = a\nc = a[:]\nb.append(3)\npass');
    const last = lineSteps(r).pop()!;
    expect(varOf(last, 'a')?.same).toEqual([{ frame: 0, path: 'b' }]);
    expect(varOf(last, 'b')?.same).toEqual([{ frame: 0, path: 'a' }]);
    expect(varOf(last, 'c')?.same).toBeUndefined();
    expect(varOf(last, 'a')?.value).toBe('[1, 2, 3]');
    expect(varOf(last, 'c')?.value).toBe('[1, 2]');
  });

  it('marks a list passed to a function as the caller’s list', async () => {
    const r = await run('def double(items):\n    for i in range(len(items)):\n        items[i] *= 2\nnums = [1, 2]\ndouble(nums)\nprint(nums)');
    const inside = lineSteps(r).find((s) => top(s).fn === 'double')!;
    expect(varOf(inside, 'items')?.same).toEqual([{ frame: 0, path: 'nums' }]);
    expect(varOf(inside, 'nums', 0)?.same).toEqual([{ frame: 1, path: 'items' }]);
  });

  it('marks rows made with * as one list, and a name for one of them', async () => {
    const r = await run('grid = [[0] * 2] * 3\nrow = grid[1]\npass');
    const last = lineSteps(r).pop()!;
    expect(varOf(last, 'grid')?.inside).toEqual([['grid[0]', 'grid[1]', 'grid[2]']]);
    expect(varOf(last, 'row')?.same).toEqual([
      { frame: 0, path: 'grid[0]' },
      { frame: 0, path: 'grid[1]' },
      { frame: 0, path: 'grid[2]' },
    ]);
  });

  it('marks two names for one deque or Counter', async () => {
    const r = await run('from collections import Counter, deque\nq = deque([1])\nr = q\nc = Counter("ab")\nd = c\npass');
    const last = lineSteps(r).pop()!;
    expect(varOf(last, 'r')?.same).toEqual([{ frame: 0, path: 'q' }]);
    expect(varOf(last, 'd')?.same).toEqual([{ frame: 0, path: 'c' }]);
  });

  it('doesn’t mark numbers or strings, which can’t be changed', async () => {
    const r = await run('a = 5\nb = a\ns = "hi"\nt = s\npass');
    const last = lineSteps(r).pop()!;
    expect(top(last).vars.every((v) => !v.same)).toBe(true);
  });
});

describe('calls and recursion', () => {
  it('records each call, its frame and what it returns', async () => {
    const r = await run('def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\nprint(fact(4))');
    const calls = r.steps.filter((s) => s.event === 'call');
    expect(calls.map((s) => varOf(s, 'n')?.value)).toEqual(['4', '3', '2', '1']);
    expect(calls.map((s) => s.depth)).toEqual([2, 3, 4, 5]);
    const deepest = calls[3];
    expect(deepest.frames.map((f) => f.fn)).toEqual(['<module>', 'fact', 'fact', 'fact', 'fact']);
    expect(deepest.frames.map((f) => f.line)).toEqual([5, 4, 4, 4, 1]);
    expect(new Set(deepest.frames.map((f) => f.key)).size).toBe(5);
    expect(r.steps.filter((s) => s.event === 'return').map((s) => s.detail)).toEqual(['1', '2', '6', '24']);
  });

  it('keeps the program’s frame and the innermost calls when recursion goes deep, and counts them all', async () => {
    const r = await run('def down(n):\n    if n == 0:\n        return 0\n    return down(n - 1)\ndown(60)');
    const deepest = r.steps.reduce((a, b) => (b.depth > a.depth ? b : a));
    expect(deepest.depth).toBe(62);
    expect(deepest.frames.length).toBe(25);
    expect(deepest.frames[0].fn).toBe('<module>');
    expect(varOf(deepest, 'n')?.value).toBe('0');
  });

  it('marks a function left because of an error', async () => {
    const r = await run('def f(a):\n    return a[5]\nf([1])');
    expect(r.steps.some((s) => s.event === 'exception' && s.detail === 'IndexError: list index out of range')).toBe(true);
    expect(r.steps.some((s) => s.event === 'unwind')).toBe(true);
    const last = r.steps[r.steps.length - 1];
    expect(last.event).toBe('error');
    expect(last.line).toBe(2);
    expect(top(last).fn).toBe('f');
    expect(varOf(last, 'a')?.value).toBe('[1]');
  });
});

describe('the dry run', () => {
  it('adds a row each time a loop is tested or a variable in it changes', async () => {
    const r = await run('n = 3\nwhile n > 0:\n    n -= 2\nprint(n)');
    expect(r.columns).toEqual(['n']);
    expect(r.rows.map((row) => [row.line, row.values.n, row.condition ?? ''])).toEqual([
      [2, '3', 'True'],
      [2, '1', 'True'],
      [2, '-1', 'False'],
    ]);
  });

  it('says True while a for loop has items left, and False when they run out', async () => {
    const r = await run('total = 0\nfor x in [4, 5]:\n    total += x\n    print(total)');
    const tests = r.rows.filter((row) => row.condition !== undefined).map((row) => row.condition);
    expect(tests).toEqual(['True', 'True', 'False']);
    expect(r.rows.map((row) => row.output).filter(Boolean)).toEqual(['4\n', '9\n']);
    expect(r.rows.some((row) => row.changed.includes('x') && row.values.x === '5')).toBe(true);
  });

  it('has no table for a program without loops', async () => {
    const r = await run('a = 1\nb = a + 1\nprint(b)');
    expect(r.rows).toEqual([]);
    expect(r.columns).toEqual([]);
  });

  it('counts the rows that exist at each step, for stepping back', async () => {
    const r = await run('for i in range(3):\n    pass');
    const counts = r.steps.map((s) => s.traceRows);
    expect(counts).toEqual([...counts].sort((a, b) => a - b));
    expect(counts[counts.length - 1]).toBe(r.rows.length);
  });
});

describe('input', () => {
  it('reads the input box a line at a time, and shows each line after its prompt', async () => {
    const r = await run('a = input("First: ")\nb = int(input("Second: "))\nprint(a * b)', 'ab\n3');
    expect(r.output).toBe('First: Second: ababab\n');
    expect(r.extras.map(({ kind, at, text }) => ({ kind, at, text }))).toEqual([
      { kind: 'in', at: 7, text: 'ab' },
      { kind: 'in', at: 15, text: '3' },
    ]);
    // Each shows from the step after the line that read it.
    const [first, second] = r.extras;
    expect(r.steps[first.step - 1].line).toBe(1);
    expect(r.steps[second.step - 1].line).toBe(2);
  });

  it('says where the input ran out, with Python’s own EOFError', async () => {
    const r = await run('a = input()\nb = input("More? ")', '1');
    expect(r.error?.text).toBe('EOFError: EOF when reading a line');
    expect(r.error?.line).toBe(2);
    expect(r.extras.map((e) => e.kind)).toEqual(['in', 'eof']);
  });
});

describe('limits', () => {
  it('stops a program that never ends, and says it may be an infinite loop', async () => {
    const r = await run('n = 0\nwhile True:\n    n += 1');
    expect(r.stopped).toBe('steps');
    expect(r.error).toBeNull();
    expect(r.truncated).toBe(true);
    expect(r.steps.length).toBe(LIMITS.recorded);
    expect(r.totalSteps).toBe(LIMITS.steps + 1);
  });

  it('stops a program that prints without end', async () => {
    const engine = await nodeEngine({ ...LIMITS, output: 1000 });
    const r = engine.run('while True:\n    print("again")', '');
    expect(r.stopped).toBe('output');
    expect(r.output.length).toBeGreaterThan(1000);
  });

  it('shows where a stopped program was', async () => {
    const engine = await nodeEngine({ ...LIMITS, steps: 50 });
    const r = engine.run('n = 0\nwhile True:\n    n += 1', '');
    const last = r.steps[r.steps.length - 1];
    expect(last.event).toBe('stop');
    expect([2, 3]).toContain(last.line);
    expect(Number(varOf(last, 'n')?.value)).toBeGreaterThan(10);
  });
});

describe('beyond the syllabus', () => {
  it('notes classes, imports beyond math and random, files and exceptions, and still runs them', async () => {
    const r = await run('import sys\nclass A:\n    pass\ntry:\n    f = open("x.txt", "w")\nexcept OSError:\n    pass\nprint("ran")');
    expect(r.output).toBe('ran\n');
    expect(r.beyond).toEqual(['import sys', 'classes', 'try and except', 'files']);
  });

  it('doesn’t note what the syllabus uses', async () => {
    const r = await run('import math\nimport random\nfrom math import sqrt\nprint(sqrt(4))');
    expect(r.beyond).toEqual([]);
  });

  it('shows an object of a class without running its own code', async () => {
    const r = await run('class P:\n    def __init__(self):\n        self.x = 1\n    def __repr__(self):\n        while True:\n            pass\np = P()\nprint("ok")');
    expect(r.output).toBe('ok\n');
    expect(varOf(lineSteps(r).pop()!, 'p')?.value).toBe('P(x=1)');
  });
});

describe('the walls around a program', () => {
  it('can’t reach the worker’s JavaScript, or Pyodide', async () => {
    for (const name of ['js', 'pyodide', 'pyodide.http', 'pyodide_js', '_pyodide', 'micropip']) {
      const r = await run(`import ${name}`);
      // As in any Python, a package that can't be found is reported before the module inside it.
      expect(r.error?.text, name).toBe(`ModuleNotFoundError: No module named '${name.split('.')[0]}'`);
    }
    const r = await run('import sys\nprint([m for m in sys.modules if m.split(".")[0] in ("js", "pyodide", "_pyodide", "pyodide_js")])');
    expect(r.output).toBe('[]\n');
  });

  it('starts every run fresh', async () => {
    await run('secret = 42');
    const r = await run('print(secret)');
    expect(r.error?.type).toBe('NameError');
  });

  it('gives a program the real recursion limit, and restores it afterwards', async () => {
    const r = await run('import sys\nsys.setrecursionlimit(50)\nprint(sys.getrecursionlimit())');
    expect(r.output).toBe('50\n');
    const again = await run('import sys\nprint(sys.getrecursionlimit())');
    expect(again.output).toBe('1000\n');
  });
});
