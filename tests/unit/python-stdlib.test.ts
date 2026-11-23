// The Python tracer ships a cut-down standard library. Python must start on it, the modules a school program
// imports must be in it, and what was left out must be left out, so the download stays small.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PYODIDE_DIR, pythonFiles } from '../../scripts/lib/pyodide-files.mjs';
import { nodeEngine, startPyodide } from './lib/python-node';

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
