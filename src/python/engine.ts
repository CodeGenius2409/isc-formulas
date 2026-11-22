// Puts the tracer into a running Pyodide and runs programs with it. The worker uses this in the app, and the
// tests use it in Node, so what the tests check is the tracer itself.
import type { PyodideAPI } from 'pyodide';
import TRACER from './tracer.py?raw';
import { LIMITS, shapeRun, type PyRunResult, type RawRun } from './trace';

export { LIMITS };

export interface PythonEngine {
  run(code: string, input: string): PyRunResult;
}

export function createEngine(pyodide: PyodideAPI, limits = LIMITS): PythonEngine {
  const namespace = pyodide.globals.get('dict')();
  pyodide.runPython(TRACER, { globals: namespace, filename: 'tracer.py' });
  namespace.get('lock_down')();
  const trace = namespace.get('trace_program');
  return {
    run(code, input) {
      // Windows line endings would count as part of each line, so Python sees what a student typed.
      const json = trace(code.replace(/\r\n?/g, '\n'), input.replace(/\r\n?/g, '\n'), limits.steps, limits.recorded, limits.output, limits.seconds) as string;
      return shapeRun(JSON.parse(json) as RawRun);
    },
  };
}
