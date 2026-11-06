import { describe, expect, it } from 'vitest';
import { getEntry } from '../../src/solver/registry';
import { solve } from '../../src/solver/solve';
import { plainNumber } from '../../src/solver/units';
import { buildParts } from '../../src/practice/bank';
import { seededRng } from '../../src/practice/questions';

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
});
