// The generator's Python "write the output" answers are what the Python tracer printed for each program. This runs
// every program again and requires the record to match. To record them afresh, after changing a program:
//   $env:WRITE_PYTHON_RUNS=1; npx vitest run tests/unit/python-runs.test.ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { PYTHON_PROGRAMS, pythonProgram, VARIANTS } from '../../src/data/blueprints/python-programs';
import RUNS from '../../src/data/blueprints/python-runs.json';
import { nodeEngine } from './lib/python-node';

const FILE = path.resolve(__dirname, '../../src/data/blueprints/python-runs.json');

describe('the recorded runs of the generator’s Python programs', () => {
  it('match what the Python tracer prints for every program', async () => {
    const engine = await nodeEngine();
    const fresh: Record<string, string[]> = {};
    const problems: string[] = [];
    for (const id of Object.keys(PYTHON_PROGRAMS)) {
      fresh[id] = [];
      for (let v = 0; v < VARIANTS; v++) {
        const { code } = pythonProgram(id, v);
        const run = engine.run(code, '');
        if (run.error || run.stopped || !run.output.trim()) problems.push(`${id} ${v}: ${run.error?.text ?? run.stopped ?? 'no output'}\n${code}`);
        fresh[id].push(run.output);
      }
    }
    expect(problems).toEqual([]);
    if (process.env.WRITE_PYTHON_RUNS) {
      fs.writeFileSync(FILE, `${JSON.stringify(fresh, null, 1)}\n`);
      return;
    }
    expect(RUNS, 'Record the runs again: $env:WRITE_PYTHON_RUNS=1; npx vitest run tests/unit/python-runs.test.ts').toEqual(fresh);
  }, 120_000);

  it('give each blueprint a good number of different programs', () => {
    for (const id of Object.keys(PYTHON_PROGRAMS)) {
      const distinct = new Set(Array.from({ length: VARIANTS }, (_, v) => pythonProgram(id, v).code)).size;
      // py-5-xi has only four list lengths to choose from; the rest have far more.
      expect(distinct, id).toBeGreaterThanOrEqual(id === 'py-5-xi' ? 4 : 60);
    }
  });
});
