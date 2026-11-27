// Runs the same programs through the Python tracer and a real Python 3, and requires the same output and the
// same error. The tracer is real Python too, in Pyodide, but it reads input, catches output and records
// every step itself, and any of that could change what a program does. This test is how we know it doesn't.
// It skips itself where no Python 3 is installed, as the Java test does without a JDK, and where the Python is
// a different version from Pyodide's, as error messages change between versions. GitHub's runners, for one,
// have an older Python.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { PY_SAMPLES } from '../../src/python/samples';
import { comparablePython, nodeEngine, runRealPython } from './lib/python-node';
import { PY_PROGRAMS, type PyProgram } from './python-programs';

const { python, pyodide: pyodidePython } = comparablePython();
// The samples that use NumPy, pandas or Matplotlib are compared in python-libraries.test.ts, with a real
// Python that has them.
const ALL: PyProgram[] = [...PY_SAMPLES.filter((s) => !s.libraries).map((s) => ({ name: `sample: ${s.title}`, code: s.code, input: s.input })), ...PY_PROGRAMS];

describe.skipIf(!python)(`against a real Python ${pyodidePython}`, () => {
  const dir = mkdtempSync(join(tmpdir(), 'isc-python-'));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it('is the same version of Python', async () => {
    const engine = await nodeEngine();
    const ours = engine.run('import sys\nprint(sys.version_info[:2])', '').output;
    const theirs = spawnSync(python!, ['-c', 'import sys; print(sys.version_info[:2])'], { encoding: 'utf8' }).stdout.trim();
    expect(ours.trim(), 'Error messages change between versions, so compare like with like').toBe(theirs);
  });

  it.each(ALL.map((p, i) => [p.name, p, i] as const))('%s', async (_name, program, i) => {
    const engine = await nodeEngine();
    const theirs = runRealPython(python!, dir, `p${i}`, program.code, program.input ?? '');
    const ours = engine.run(program.code, program.input ?? '');
    expect(ours.output).toBe(theirs.stdout);
    expect(ours.stopped).toBeNull();
    if (program.error) {
      expect(theirs.error, 'real Python should fail in the way the test expects').toMatch(new RegExp(`^${program.error}\\b`));
      expect(ours.error?.text).toBe(theirs.error);
      expect(ours.error?.type).toBe(program.error);
      expect(ours.error?.line, 'the error points at a line of the program').toBeGreaterThan(0);
    } else {
      expect(theirs.error).toBeNull();
      expect(ours.error).toBeNull();
    }
  });
});
