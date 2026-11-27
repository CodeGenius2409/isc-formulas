// The Python tracer in Node: the same Pyodide, the same cut-down standard library and the same tracer.py as
// the app's worker, so a test of this is a test of what students run.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadPyodide, type PyodideAPI } from 'pyodide';
import { PYODIDE_DIR, pythonFiles } from '../../../scripts/lib/pyodide-files.mjs';
import { ensurePackages, PACKAGE_DIR, pythonPackages } from '../../../scripts/lib/pyodide-packages.mjs';
import { createEngine, LIMITS, type PythonEngine } from '../../../src/python/engine';

let started: Promise<PyodideAPI> | null = null;

/**
 * Starts Pyodide once per test file, from the files the app serves, with the lock file the app's worker starts
 * with. Its packages are read from the checked wheels on disk, never from the network.
 */
export function startPyodide(): Promise<PyodideAPI> {
  started ??= (async () => {
    const files = pythonFiles();
    const dir = join(tmpdir(), files.cache);
    mkdirSync(dir, { recursive: true });
    const stdlib = join(dir, files.stdlibName);
    writeFileSync(stdlib, files.files.find((f) => f.name === files.stdlibName)!.data);
    await ensurePackages(() => undefined);
    const wheels = `${PACKAGE_DIR.replace(/\\/g, '/')}/`;
    return loadPyodide({ indexURL: `${PYODIDE_DIR}/`, stdLibURL: stdlib, lockFileContents: pythonPackages().lock, packageBaseUrl: wheels, packageCacheDir: wheels, stdout: () => undefined, stderr: () => undefined });
  })();
  return started;
}

let engine: Promise<PythonEngine> | null = null;

export function nodeEngine(limits = LIMITS): Promise<PythonEngine> {
  if (limits !== LIMITS) return startPyodide().then((py) => createEngine(py, limits));
  engine ??= startPyodide().then((py) => createEngine(py));
  return engine;
}

/** The extra standard library the libraries need, as the worker is sent it. */
export const libraryExtras = () => new Uint8Array(pythonPackages().files.find((f) => f.package === null)!.data);

let withLibraries: Promise<PythonEngine> | null = null;

/** The engine with NumPy, pandas and Matplotlib installed, as the worker installs them. */
export function libraryEngine(): Promise<PythonEngine> {
  withLibraries ??= nodeEngine().then(async (e) => {
    await e.install(['numpy', 'pandas', 'matplotlib'], libraryExtras());
    return e;
  });
  return withLibraries;
}

/**
 * Real Python on this computer, if there is one: the same command the other Python tests use. ISC_REAL_PYTHON
 * can name another, such as a virtual environment's, to compare with one that has NumPy, pandas and Matplotlib.
 */
export function realPythonCommand(spawn: typeof import('node:child_process').spawnSync): string | null {
  for (const cmd of [process.env.ISC_REAL_PYTHON, 'python', 'python3'].filter((c): c is string => Boolean(c))) {
    const check = spawn(cmd, ['--version'], { encoding: 'utf8' });
    if (check.status === 0 && /Python 3/.test(`${check.stdout}${check.stderr}`)) return cmd;
  }
  return null;
}

const minor = (version: string) => version.split('.').slice(0, 2).join('.');

/** The real Python to compare with: only one of Pyodide's own minor version, as error messages change between versions. */
export function comparablePython(): { python: string | null; version: string; pyodide: string } {
  const pyodide = minor(pythonFiles().lock.info.python);
  const python = realPythonCommand(spawnSync);
  const version = python ? minor(spawnSync(python, ['-c', 'import platform; print(platform.python_version())'], { encoding: 'utf8' }).stdout.trim()) : '';
  return { python: python && version === pyodide ? python : null, version, pyodide };
}

/** Whether real Python here can import these modules, such as numpy. */
export function realPythonHas(python: string, modules: string[]): boolean {
  return spawnSync(python, ['-I', '-c', modules.map((m) => `import ${m}`).join('; ')], { encoding: 'utf8' }).status === 0;
}

/** Runs a program as a file, as a student would, and gives its output and the last line of any error. */
export function runRealPython(python: string, dir: string, name: string, code: string, input = ''): { stdout: string; error: string | null } {
  const file = join(dir, `${name}.py`);
  writeFileSync(file, code);
  // A chart is drawn off screen, so plt.show() has no window to open.
  const run = spawnSync(python, ['-I', '-X', 'utf8', file], { input, encoding: 'utf8', timeout: 120_000, cwd: dir, env: { ...process.env, MPLBACKEND: 'Agg' } });
  const stderr = (run.stderr ?? '').replace(/\r\n/g, '\n').trimEnd();
  return { stdout: (run.stdout ?? '').replace(/\r\n/g, '\n'), error: run.status === 0 ? null : (stderr.split('\n').pop() ?? '') };
}
