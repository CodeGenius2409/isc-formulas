// The Python tracer in Node: the same Pyodide, the same cut-down standard library and the same tracer.py as
// the app's worker, so a test of this is a test of what students run.
import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadPyodide, type PyodideAPI } from 'pyodide';
import { PYODIDE_DIR, pythonFiles } from '../../../scripts/lib/pyodide-files.mjs';
import { createEngine, LIMITS, type PythonEngine } from '../../../src/python/engine';

let started: Promise<PyodideAPI> | null = null;

/** Starts Pyodide once per test file, from the files the app serves. */
export function startPyodide(): Promise<PyodideAPI> {
  started ??= (async () => {
    const files = pythonFiles();
    const dir = join(tmpdir(), files.cache);
    mkdirSync(dir, { recursive: true });
    const stdlib = join(dir, files.stdlibName);
    writeFileSync(stdlib, files.files.find((f) => f.name === files.stdlibName)!.data);
    return loadPyodide({ indexURL: `${PYODIDE_DIR}/`, stdLibURL: stdlib, lockFileContents: files.lock, stdout: () => undefined, stderr: () => undefined });
  })();
  return started;
}

let engine: Promise<PythonEngine> | null = null;

export function nodeEngine(limits = LIMITS): Promise<PythonEngine> {
  if (limits !== LIMITS) return startPyodide().then((py) => createEngine(py, limits));
  engine ??= startPyodide().then((py) => createEngine(py));
  return engine;
}

/** Real Python on this computer, if there is one: the same command the other Python tests use. */
export function realPythonCommand(spawn: typeof import('node:child_process').spawnSync): string | null {
  for (const cmd of ['python', 'python3']) {
    const check = spawn(cmd, ['--version'], { encoding: 'utf8' });
    if (check.status === 0 && /Python 3/.test(`${check.stdout}${check.stderr}`)) return cmd;
  }
  return null;
}
