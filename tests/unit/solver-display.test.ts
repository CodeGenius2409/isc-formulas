import { describe, expect, it } from 'vitest';
import { getEntry } from '../../src/solver/registry';
import { solve } from '../../src/solver/solve';
import { plainNumber } from '../../src/solver/units';
import { buildParts } from '../../src/practice/bank';
import { seededRng } from '../../src/practice/questions';
import { fillIn } from '../../src/practice/gen/gen';

const lines = (id: string, find: string, inputs: Record<string, string>) => {
  const entry = getEntry(id)!;
  const outcome = solve(entry, find, Object.fromEntries(Object.entries(inputs).map(([k, raw]) => [k, { raw, unit: entry.vars.find((v) => v.symbol === k)!.unit }])));
  return outcome.steps.flatMap((s) => [...s.math, s.note ?? '']).join('\n');
};

describe('how worked answers are written', () => {
  it('brackets a value in standard form before its power', () => {
    const shown = lines('c-xi-7-177', 'K_sp', { s: '8e-5' });
    expect(shown).toContain('\\left(8\\times10^{-5}\\right)^{2}');
    expect(shown).not.toMatch(/\}\^\{-5\}\^/);
  });

  it('writes [H⁺] in the pH formula', () => {
    expect(lines('c-xi-7-3', 'pH', { H: '0.0006' })).toContain('[\\mathrm{H^+}]');
  });

  it('reads generated values without floating-point noise', () => {
    expect(plainNumber(6 * 10 ** -4)).toBe('0.0006');
    expect(plainNumber(0.1 + 0.2)).toBe('0.3');
    expect(plainNumber(-2.5e-12)).toBe('-2.5e-12');
  });

  it('gives a pH from a generated [H⁺] to 3 figures, not 5', () => {
    const parts = buildParts({ id: 'ph', subject: 'chemistry', parts: [{ ask: 'pH', use: 'c-xi-7-3', find: 'pH', given: { H: 'H0' }, marks: 2 }] } as never, { H0: 6 * 10 ** -4 }, seededRng(1));
    const note = (parts![0].question as { steps: { note?: string }[] }).steps.at(-1)!.note;
    expect(note).toBe('To 3 significant figures.');
  });

  type Q = { steps: { note?: string; math: string[] }[]; answers: number[] };
  const build = (subject: string, parts: object[], values: Record<string, number>) => buildParts({ id: 't', subject, parts } as never, values, seededRng(1))!.map((p) => p.question as unknown as Q);

  it('carries a value to a later part as a student would, to 3 figures', () => {
    const [, speed] = build('physics', [
      { ask: 'Time', use: 'p-xi-2-76', find: 't', given: { h: 'H m' }, marks: 2, save: 't' },
      { ask: 'Speed', use: 'p-xi-2-73', find: 'v', given: { t: 't' }, marks: 1 },
    ], { H: 5 });
    expect(speed.steps.at(-1)!.note).toBe('To 3 significant figures.');
    expect(speed.steps.flatMap((s) => s.math).join(' ')).toContain('1.01');
  });

  it('keeps only the positive root when a part asks for a speed', () => {
    const [part] = build('physics', [{ ask: 'Final speed', use: 'p-xi-2-6', find: 'v', given: { u: '12 m/s', a: '1 m/s^2', s: '50 m' }, marks: 2, positive: true }], {});
    expect(part.answers).toHaveLength(1);
    expect(part.answers[0]).toBeGreaterThan(0);
  });

  it('shows a count such as a bond order exactly', () => {
    const [part] = build('chemistry', [{ ask: 'Bond order', use: 'c-xi-4-2', find: 'BO', given: { N_b: '8', N_a: '4' }, marks: 2, exact: true }], {});
    expect(part.steps.at(-1)!.note).toBeUndefined();
    expect(part.steps.at(-1)!.math[0]).toMatch(/=2$/);
  });

  it('writes a negative number in a question with a true minus sign', () => {
    expect(fillIn('ΔH = {H} kJ/mol', { H: -60 })).toBe('ΔH = −60 kJ/mol');
    expect(fillIn('{name}', { name: '-x' })).toBe('-x');
  });
});
