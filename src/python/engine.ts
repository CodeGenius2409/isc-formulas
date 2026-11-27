// Puts the tracer into a running Pyodide and runs programs with it. The worker uses this in the app, and the
// tests use it in Node, so what the tests check is the tracer itself.
import type { PyodideAPI } from 'pyodide';
import TRACER from './tracer.py?raw';
import { LIMITS, shapeRun, type PyRunResult, type RawRun } from './trace';

export { LIMITS };

/** The app's colours, which charts are drawn in. The page reads them from the theme's tokens. */
export interface ChartTheme {
  ink: string;
  ink2: string;
  faint: string;
  paper: string;
  grid: string;
  /** Colours for lines and bars in turn, or null for Matplotlib's own. */
  palette: string[] | null;
}

export interface RunOptions {
  theme?: ChartTheme;
}

export interface PythonEngine {
  run(code: string, input: string, options?: RunOptions): PyRunResult;
  /** The top-level modules a program imports, read from its syntax without running it. */
  imports(code: string): string[];
  /**
   * Installs NumPy, pandas or Matplotlib from files the caller has made reachable: the extra standard library
   * they need first, if it isn't in yet, then the packages, which Pyodide loads from its lock file.
   */
  install(packages: string[], extras: Uint8Array | null): Promise<void>;
}

export function createEngine(pyodide: PyodideAPI, limits = LIMITS): PythonEngine {
  const namespace = pyodide.globals.get('dict')();
  pyodide.runPython(TRACER, { globals: namespace, filename: 'tracer.py' });
  namespace.get('lock_down')();
  const trace = namespace.get('trace_program');
  const findImports = namespace.get('program_imports');
  let extrasIn = false;
  return {
    run(code, input, options = {}) {
      // Windows line endings would count as part of each line, so Python sees what a student typed.
      const json = trace(code.replace(/\r\n?/g, '\n'), input.replace(/\r\n?/g, '\n'), limits.steps, limits.recorded, limits.output, limits.seconds, JSON.stringify(options)) as string;
      return shapeRun(JSON.parse(json) as RawRun);
    },
    imports(code) {
      return JSON.parse(findImports(code.replace(/\r\n?/g, '\n')) as string) as string[];
    },
    async install(packages, extras) {
      if (!extrasIn) {
        if (!extras) throw new Error('The libraries need their part of the standard library first.');
        pyodide.unpackArchive(extras, 'zip', { extractDir: namespace.get('site_packages')() as string });
        namespace.get('extras_unpacked')();
        extrasIn = true;
      }
      const errors: string[] = [];
      await pyodide.loadPackage(packages, { messageCallback: () => undefined, errorCallback: (m) => errors.push(m) });
      // A package that fails is reported to errorCallback, not thrown.
      const missing = packages.filter((name) => !(name in pyodide.loadedPackages));
      if (missing.length) throw new Error(`${missing.join(', ')} couldn’t be installed. ${errors.join(' ').slice(0, 400)}`);
      namespace.get('prepare_libraries')(JSON.stringify(packages));
    },
  };
}
