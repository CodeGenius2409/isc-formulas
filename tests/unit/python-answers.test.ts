// Generated Python questions are answered by functions in the app, not by Python. This holds them to the real thing,
// and skips itself on a machine without Python, as the Java test does without a JDK.
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import type { ClassLevel } from '../../src/data/types';
import { generateItem } from '../../src/practice/gen/engine';

function pythonCommand(): string | null {
  for (const cmd of ['python', 'python3']) {
    const check = spawnSync(cmd, ['--version'], { encoding: 'utf8' });
    if (check.status === 0 && /Python 3/.test(`${check.stdout}${check.stderr}`)) return cmd;
  }
  return null;
}

const python = pythonCommand();

describe.skipIf(!python)('generated Python, run by real Python', () => {
  for (const level of ['XII', 'XI'] as ClassLevel[]) {
    it(`Class ${level}`, async () => {
      const set = await loadBlueprints('computerscience', level);
      const python3 = set.blueprints.filter((b) => b.python);
      const wrong: string[] = [];
      for (const bp of python3) {
        for (let seed = 0; seed < 40; seed++) {
          const item = generateItem(bp, seed, set.names(bp));
          if (item.form !== 'output') continue;
          const run = spawnSync(python!, ['-I', '-c', item.code], { encoding: 'utf8' });
          const actual = run.stdout.replace(/\r/g, '').trim();
          if (run.status !== 0 || actual !== item.expected.trim()) wrong.push(`${item.id}\n${item.code}\nexpected: ${item.expected}\nactual: ${actual}${run.stderr}`);
        }
      }
      expect(wrong.slice(0, 5)).toEqual([]);
    }, 300_000);
  }
});
