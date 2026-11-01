// Runs the same programs through the interpreter and a real JDK, and requires the same
// output. The other Java tests have hand-worked answers, which could share a mistaken
// reading of the language. This one can't. It skips itself where no JDK is installed.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { parseJava } from '../../src/java/parser';
import { SAMPLES } from '../../src/java/samples';
import { runProgram } from '../../src/java/trace';
import { PROGRAMS, type JdkProgram } from './java-programs';

/** Java 19 changed how doubles print, and the app follows the newer rule. */
const MIN_JAVA = 19;

function javaVersion(): number {
  const result = spawnSync('javac', ['-version'], { encoding: 'utf8' });
  const match = /javac (\d+)/.exec(`${result.stdout ?? ''}${result.stderr ?? ''}`);
  return match ? Number(match[1]) : 0;
}

const ALL: JdkProgram[] = [...SAMPLES.map((s) => ({ name: `sample: ${s.title}`, code: s.code, input: s.input })), ...PROGRAMS];

function mainClass(code: string): string {
  const found = parseJava(code).classes.find((c) => c.methods.some((m) => m.name === 'main' && m.isStatic));
  if (!found) throw new Error(`No main class in:\n${code}`);
  return found.name;
}

describe.skipIf(javaVersion() < MIN_JAVA)('against a real JDK', () => {
  const dir = mkdtempSync(join(tmpdir(), 'isc-jdk-'));
  const results = new Map<string, { stdout: string; stderr: string }>();

  beforeAll(() => {
    const files = ALL.map((program, i) => {
      const file = join(dir, `P${i}.java`);
      writeFileSync(file, program.code);
      return file;
    });
    const compile = spawnSync('javac', ['-nowarn', '-encoding', 'UTF-8', '-d', join(dir, 'out'), ...files], { encoding: 'utf8' });
    if (compile.status !== 0) throw new Error(`javac rejected a test program:\n${compile.stderr}`);
    for (const program of ALL) {
      const run = spawnSync('java', ['-XX:TieredStopAtLevel=1', '-Xshare:auto', '-cp', join(dir, 'out'), mainClass(program.code)], { input: program.input ?? '', encoding: 'utf8' });
      results.set(program.name, { stdout: (run.stdout ?? '').replace(/\r\n/g, '\n'), stderr: run.stderr ?? '' });
    }
  }, 300_000);

  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it.each(ALL.map((p) => [p.name, p] as const))('%s', (_name, program) => {
    const real = results.get(program.name)!;
    const ours = runProgram(program.code, program.input ?? '');
    expect(ours.output).toBe(real.stdout);
    if (program.throws) {
      expect(real.stderr, 'the JDK should crash in the way the test expects').toContain(program.throws);
      expect(ours.error?.message).toContain(program.throws);
    } else {
      expect(real.stderr).toBe('');
      expect(ours.error).toBeNull();
    }
  });
});
