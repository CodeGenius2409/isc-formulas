// The Python tracer ships a cut-down standard library. Python must start on it, the modules a school program
// imports must be in it, and what was left out must be left out, so the download stays small.
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { PYODIDE_DIR, pythonFiles } from '../../scripts/lib/pyodide-files.mjs';
import { comparablePython, nodeEngine, runRealPython, startPyodide } from './lib/python-node';
import { ALL_AT_ONCE, STDLIB_MODULES, STDLIB_PROGRAMS } from './python-stdlib-programs';

describe('the cut-down standard library', () => {
  it('starts Python, and every module Python loads comes from it', async () => {
    const py = await startPyodide();
    const outside = py.runPython(`
import sys
[name for name, m in sys.modules.items() if m is not None and getattr(m, '__file__', None) and not m.__file__.startswith('/lib/python3')]
`).toJs();
    expect(outside).toEqual([]);
  }, 60_000);

  it('has the modules the syllabus and common school programs use', async () => {
    const engine = await nodeEngine();
    const run = engine.run('import math, random, string, copy, collections, functools, time, re, sys\nrandom.seed(1)\nprint(math.floor(math.sqrt(10)), string.ascii_uppercase[:3], random.randint(1, 6))', '');
    expect(run.error).toBeNull();
    expect(run.output).toBe('3 ABC 2\n');
  }, 60_000);

  it('leaves out what a program for the syllabus never needs', async () => {
    const engine = await nodeEngine();
    for (const name of ['email', 'unittest', 'xml', 'http', 'tkinter', 'sqlite3']) {
      const run = engine.run(`import ${name}`, '');
      expect(run.error?.type, name).toBe('ModuleNotFoundError');
    }
  }, 60_000);

  it('is much smaller than the full one', () => {
    const full = readFileSync(join(PYODIDE_DIR, 'python_stdlib.zip')).length;
    const files = pythonFiles();
    const cut = files.files.find((f) => f.name === files.stdlibName)!.data.length;
    expect(cut).toBeLessThan(full * 0.45);
  });
});

describe('statistics, fractions, decimal, datetime and the other modules used as freely as math', () => {
  it.each(STDLIB_MODULES.map((m) => [m] as const))('%s imports, with everything it needs, and without a note', async (name) => {
    const engine = await nodeEngine();
    const run = engine.run(`import ${name}`, '');
    expect(run.error, name).toBeNull();
    expect(run.beyond, 'these are normal Python, like math and random').toEqual([]);
  });

  it.each([...STDLIB_PROGRAMS, ALL_AT_ONCE].map((p) => [p.name, p] as const))('%s runs in the tracer', async (_name, program) => {
    const engine = await nodeEngine();
    const run = engine.run(program.code, '');
    expect(run.error).toBeNull();
    expect(run.output.length).toBeGreaterThan(0);
    expect(run.beyond.filter((b) => b.startsWith('import'))).toEqual([]);
  });

  it('starts every run with decimal’s usual precision, as a new Python would', async () => {
    const engine = await nodeEngine();
    engine.run('import decimal\ndecimal.getcontext().prec = 3', '');
    expect(engine.run('from decimal import Decimal\nprint(Decimal(1) / Decimal(7))', '').output).toBe('0.1428571428571428571428571429\n');
  });

  const { python, pyodide } = comparablePython();
  describe.skipIf(!python)(`prints what a real Python ${pyodide} prints`, () => {
    const dir = mkdtempSync(join(tmpdir(), 'isc-stdlib-'));
    afterAll(() => rmSync(dir, { recursive: true, force: true }));
    it.each([...STDLIB_PROGRAMS, ALL_AT_ONCE].map((p, i) => [p.name, p, i] as const))('%s', async (_name, program, i) => {
      const engine = await nodeEngine();
      const theirs = runRealPython(python!, dir, `s${i}`, program.code);
      expect(theirs.error).toBeNull();
      expect(engine.run(program.code, '').output).toBe(theirs.stdout);
    });
  });
});
