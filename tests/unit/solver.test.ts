import { describe, expect, it } from 'vitest';
import { getEntry } from '../../src/solver/registry';
import { solve, type SolveInput, type SolveOutcome } from '../../src/solver/solve';
import { allEntries } from '../../src/solver/registry';

/** Runs the solver, filling in constants, and returns the outcome. */
function run(id: string, unknown: string, values: Record<string, string>): SolveOutcome {
  const entry = getEntry(id);
  if (!entry) throw new Error(`No entry ${id}`);
  const inputs: Record<string, SolveInput> = {};
  for (const v of entry.vars) {
    if (v.symbol === unknown) continue;
    const raw = values[v.symbol] ?? (v.value !== undefined ? String(v.value) : '');
    inputs[v.symbol] = { raw, unit: v.show === 'deg' ? 'deg' : v.unit };
  }
  return solve(entry, unknown, inputs);
}

function answers(outcome: SolveOutcome): number[] {
  return outcome.roots.filter((r) => !r.rejected).map((r) => r.shown);
}

/** Every value here was worked out by hand or from a textbook example. */
const HAND_WORKED: [string, string, Record<string, string>, number, string][] = [
  ['p-xi-2-4', 'v', { u: '5', a: '2', t: '3' }, 11, 'v = 5 + 2×3'],
  ['p-xi-2-4', 't', { v: '20', u: '5', a: '3' }, 5, 't = (20−5)/3'],
  ['p-xi-2-4', 'a', { v: '20', u: '0', t: '4' }, 5, 'a = 20/4'],
  ['p-xi-2-4', 'u', { v: '20', a: '3', t: '5' }, 5, 'u = 20 − 15'],
  ['p-xi-2-5', 's', { u: '10', a: '2', t: '5' }, 75, '50 + 25'],
  ['p-xi-2-5', 'a', { s: '75', u: '10', t: '5' }, 2, 'a = 2(75−50)/25'],
  ['p-xi-2-8', 'T', { u: '20', theta: '30' }, 2.0408, '2·20·0.5/9.8'],
  ['p-xi-2-9', 'H', { u: '20', theta: '30' }, 5.102, '400·0.25/19.6'],
  ['p-xi-2-10', 'R_h', { u: '20', theta: '30' }, 35.35, '400·sin 60°/9.8'],
  ['p-xi-2-12', 'a_c', { v: '10', r: '5' }, 20, '100/5'],
  ['p-xi-3-22', 'W', { m: '70' }, 686, '70 × 9.8'],
  ['p-xi-3-5', 'F_c', { m: '2', v: '3', r: '1.5' }, 12, '2·9/1.5'],
  ['p-xi-3-95', 'a', { m_1: '3', m_2: '1' }, 4.9, '2·9.8/4'],
  ['p-xi-4-2', 'K', { m: '2', v: '3' }, 9, '½·2·9'],
  ['p-xi-4-4', 'U', { m: '2', h: '10' }, 196, '2·9.8·10'],
  ['p-xi-4-5', 'U', { k: '100', x: '0.1' }, 0.5, '½·100·0.01'],
  ['p-xi-4-96', 'v', { m_1: '2', u_1: '3', m_2: '1', u_2: '0' }, 2, '6/3'],
  ['p-xi-5-8', 'K', { I: '2', omega: '3' }, 9, '½·2·9'],
  ['p-xi-5-102', 'omega', { omega_0: '2', alpha: '3', t: '4' }, 14, '2 + 12'],
  ['p-xi-6-1', 'F', { m_1: '1000', m_2: '1000', r: '1' }, 6.674e-5, 'G × 10⁶'],
  ['p-xi-6-4', 'v_e', { M: '5.97e24', R: '6.37e6' }, 11184.8, 'Earth escape velocity'],
  ['p-xi-7-5', 'P', { P_0: '100000', rho: '1000', h: '10' }, 198000, '10⁵ + 1000·9.8·10'],
  ['p-xi-8-5', 'eta', { T_2: '300', T_1: '600' }, 0.5, '1 − ½'],
  ['p-xi-8-6', 'P', { n: '1', V: '0.0224', T: '273.15' }, 101382.6, 'one mole near STP'],
  ['p-xi-8-6', 'V', { P: '101325', n: '1', T: '273.15' }, 0.022413, 'molar volume'],
  ['p-xi-8-43', 'Q', { m: '2', c: '4200', DeltaT: '10' }, 84000, '2·4200·10'],
  ['p-xi-10-4', 'T', { m: '1', k: '100' }, 0.62832, '2π/10'],
  ['p-xi-10-5', 'T', { l: '1' }, 2.0071, '2π√(1/9.8)'],
  ['p-xi-10-5', 'l', { T: '2' }, 0.99295, '9.8·4/4π²'],
  ['p-xi-10-8', 'v', { f: '440', lambda: '0.75' }, 330, '440 × 0.75'],
  ['p-xii-1-1', 'F', { q_1: '1e-6', q_2: '1e-6', r: '1' }, 8.988e-3, '9×10⁹ × 10⁻¹²'],
  ['p-xii-1-8', 'C', { A: '1', d: '0.001' }, 8.854e-9, 'ε₀ × 1000'],
  ['p-xii-2-1', 'V', { I: '2', R: '5' }, 10, '2 × 5'],
  ['p-xii-2-1', 'R', { V: '10', I: '2' }, 5, '10/2'],
  ['p-xii-2-47', 'R', { R_1: '6', R_2: '3' }, 2, '18/9'],
  ['p-xii-2-47', 'R_2', { R: '2', R_1: '6' }, 3, 'x appears twice, still linear'],
  ['p-xii-2-57', 'I', { E_m: '12', R: '5', r: '1' }, 2, '12/6'],
  ['p-xii-3-3', 'B', { I: '10', r: '0.02' }, 1e-4, 'μ₀·10/(2π·0.02)'],
  ['p-xii-4-7', 'Z', { R: '3', X_L: '8', X_C: '4' }, 5, '3-4-5 triangle'],
  ['p-xii-4-20', 'f_0', { L: '0.1', C: '1e-6' }, 503.29, '1/(2π√10⁻⁷)'],
  ['p-xii-6-1', 'f', { v: '0.3', u: '0.6' }, 0.2, '1/f = 5'],
  ['p-xii-6-7', 'r', { mu_1: '1', i: '30', mu_2: '1.5' }, 19.47, 'sin r = 1/3'],
  ['p-xii-6-8', 'i_c', { mu_2: '1', mu_1: '1.5' }, 41.81, 'sin i = 2/3'],
  ['p-xii-7-4', 'E', { nu: '5e14' }, 3.313e-19, 'h × 5×10¹⁴'],
  ['p-xii-8-5', 'T_half', { lambda: '0.1' }, 6.9315, 'ln 2 / 0.1'],
  ['p-xii-8-4', 'N', { N_0: '1000', lambda: '0.1', t: '10' }, 367.88, '1000/e'],
  ['p-xii-8-4', 't', { N: '500', N_0: '1000', lambda: '0.1' }, 6.9315, 'one half-life'],
  ['c-xii-2-6', 'M', { n: '0.5', V: '0.25' }, 2, '0.5/0.25'],
  ['c-xi-1-51', 'M_2', { M_1: '2', V_1: '100', V_2: '400' }, 0.5, '200/400'],
  ['c-xi-7-3', 'pH', { H: '1e-3' }, 3, '−log 10⁻³'],
  ['c-xi-7-3', 'H', { pH: '4' }, 1e-4, '10⁻⁴'],
  ['c-xi-6-5', 'DeltaG', { DeltaH: '-50000', T: '300', DeltaS: '100' }, -80000, '−50000 − 30000'],
  ['c-xii-4-39', 't_half', { k: '0.0693' }, 10, '0.693/0.0693'],
  ['c-xii-4-5', 'k', { A: '1e13', E_a: '50000', T: '300' }, 19675, 'e⁻²⁰·⁰⁴⁶⁵ × 10¹³'],
  ['c-xii-3-7', 'm', { M: '63.5', I: '2', t: '1000', n: '2' }, 0.65813, 'copper deposited'],
  ['c-xii-3-55', 'E', { E0: '1.1', n: '2', Q: '0.01' }, 1.1591, 'Daniell cell'],
  ['c-xii-2-3', 'DeltaT_b', { K_b: '0.52', m: '1' }, 0.52, 'water, 1 molal'],
  ['m-xi-2-10', 'a_n', { a: '2', n: '10', d: '3' }, 29, '2 + 27'],
  ['m-xi-2-10', 'n', { a_n: '29', a: '2', d: '3' }, 10, '1 + 27/3'],
  ['m-xi-2-13', 'S_n', { a: '1', r: '2', n: '5' }, 31, '1 + 2 + 4 + 8 + 16'],
  ['m-xi-1-20k', 'c', { a: '3', b: '4', C_a: '90' }, 5, '3-4-5 triangle'],
  ['m-xi-1-20k', 'C_a', { c: '5', a: '3', b: '4' }, 90, 'right angle'],
  ['m-xi-1-20m', 'A', { a: '6', b: '8', C_a: '30' }, 12, '½·48·½'],
  ['m-xi-3-9', 'd', { x_2: '3', x_1: '0', y_2: '4', y_1: '0' }, 5, '3-4-5 triangle'],
  ['m-xi-5-6', 'P_U', { P_A: '0.5', P_B: '0.4', P_I: '0.2' }, 0.7, '0.5 + 0.4 − 0.2'],
  ['p-xi-2-95', 'A', { A_x: '1', A_y: '2', A_z: '2' }, 3, '√9'],
];

describe('solver against hand-worked values', () => {
  it('covers at least 40 different formulas', () => {
    expect(new Set(HAND_WORKED.map((c) => c[0])).size).toBeGreaterThanOrEqual(40);
  });

  it.each(HAND_WORKED)('%s for %s %j', (id, unknown, values, expected) => {
    const outcome = run(id, unknown, values);
    expect(outcome.ok, outcome.message ?? JSON.stringify(outcome.inputProblems)).toBe(true);
    const got = answers(outcome);
    const hit = got.some((v) => Math.abs(v - expected) <= Math.abs(expected) * 2e-3);
    expect(hit, `got ${got.join(', ')}, expected ${expected}`).toBe(true);
  });
});

describe('multiple roots', () => {
  it('solves a quadratic and rejects the negative time', () => {
    const outcome = run('p-xi-2-5', 't', { s: '75', u: '10', a: '2' });
    expect(outcome.method).toBe('quadratic');
    expect(answers(outcome)).toEqual([5]);
    const rejected = outcome.roots.find((r) => r.rejected);
    expect(rejected?.shown).toBeCloseTo(-15);
    expect(rejected?.rejected).toMatch(/cannot be negative/);
    expect(outcome.steps.some((s) => s.label === 'Use the quadratic formula')).toBe(true);
  });

  it('keeps both roots of a pure quadratic', () => {
    const outcome = run('m-xi-2-101', 'x', { a: '1', b: '-5', c: '6' });
    expect(answers(outcome).sort()).toEqual([2, 3]);
  });

  it('gives both signs when a velocity is squared', () => {
    const outcome = run('p-xi-2-6', 'v', { u: '0', a: '10', s: '5' });
    expect(answers(outcome).sort((a, b) => a - b)).toEqual([-10, 10]);
  });

  it('rejects the negative speed when only a speed makes sense', () => {
    const outcome = run('p-xi-4-2', 'v', { K: '9', m: '2' });
    expect(answers(outcome)).toEqual([3]);
    expect(outcome.roots.some((r) => r.rejected)).toBe(true);
  });

  it('finds both launch angles for a given range', () => {
    const outcome = run('p-xi-2-10', 'theta', { R_h: '35.35', u: '20' });
    const angles = answers(outcome).sort((a, b) => a - b);
    expect(angles.length).toBe(2);
    expect(angles[0]).toBeCloseTo(30, 0);
    expect(angles[1]).toBeCloseTo(60, 0);
  });

  it('handles a quadratic where the unknown is in a product', () => {
    const outcome = run('p-xi-4-63', 'x', { m: '1', h: '0.2', k: '100', g: '10' });
    expect(answers(outcome)[0]).toBeCloseTo(0.3236, 3);
  });

  it('solves a quadratic in the number of terms, and rejects the negative one', () => {
    const outcome = run('m-xi-2-215', 'n', { S_n: '100', a: '1', d: '2' });
    expect(answers(outcome)).toEqual([10]);
    expect(outcome.roots.find((r) => r.rejected)?.shown).toBeCloseTo(-10);
  });

  it('treats a "quadratic" with no x² term as linear', () => {
    const outcome = run('p-xi-2-5', 't', { s: '50', u: '10', a: '0' });
    expect(answers(outcome)).toEqual([5]);
  });
});

describe('any variable as the unknown', () => {
  it('can solve every entry for every variable without crashing', () => {
    // Pick values from each variable's range, then ask for each variable in turn.
    const failures: string[] = [];
    for (const entry of allEntries()) {
      for (const unknown of entry.vars) {
        const values: Record<string, string> = {};
        for (const v of entry.vars) {
          const [lo, hi] = v.gen;
          const value = v.value ?? (v.integer ? Math.round((lo + hi) / 2) : (lo + hi) / 2);
          values[v.symbol] = String(value);
        }
        try {
          const inputs: Record<string, SolveInput> = {};
          for (const v of entry.vars) if (v.symbol !== unknown.symbol) inputs[v.symbol] = { raw: values[v.symbol], unit: v.unit };
          const outcome = solve(entry, unknown.symbol, inputs);
          expect(outcome.steps.length + (outcome.message ? 1 : 0)).toBeGreaterThan(0);
        } catch (err) {
          failures.push(`${entry.id} for ${unknown.symbol}: ${(err as Error).message}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it('finds an unknown on both sides numerically', () => {
    const outcome = run('p-xi-2-90', 'h', { t: '2.0791', v_s: '340' });
    expect(outcome.method).toBe('numeric');
    expect(answers(outcome)[0]).toBeCloseTo(20, 0);
  });

  it('solves the van der Waals equation for volume', () => {
    const outcome = run('c-xi-5-4', 'V', { P: '124604', n: '1', a: '0.14', b: '3.9e-5', T: '300' });
    expect(outcome.ok).toBe(true);
    expect(answers(outcome).some((v) => Math.abs(v - 0.02) < 2e-4)).toBe(true);
  });
});

describe('working steps', () => {
  it('states the formula, rearranges, substitutes, and answers in order', () => {
    const outcome = run('p-xi-2-4', 't', { v: '20', u: '5', a: '3' });
    const labels = outcome.steps.map((s) => s.label);
    expect(labels[0]).toBe('Formula');
    expect(labels[1]).toMatch(/^Rearrange for time/);
    expect(labels[2]).toBe('Substitute the values');
    expect(labels[labels.length - 1]).toBe('Answer');
    expect(outcome.steps[2].math[0]).toContain('\\mathrm{m/s}');
  });

  it('reports the answer with units and significant figures', () => {
    const outcome = run('p-xi-2-4', 'v', { u: '5.0', a: '2.0', t: '3.0' });
    expect(outcome.roots[0].text).toBe('11.0');
    expect(outcome.roots[0].unit).toBe('m/s');
    const answer = outcome.steps.find((s) => s.label === 'Answer');
    expect(answer?.note).toMatch(/3 significant figures/);
  });

  it('uses scientific notation for very small answers', () => {
    expect(run('p-xii-7-4', 'E', { nu: '5e14' }).roots[0].text).toBe('3.31 × 10⁻¹⁹');
  });

  it('shows angles in degrees', () => {
    const outcome = run('p-xii-6-8', 'i_c', { mu_2: '1', mu_1: '1.5' });
    expect(outcome.roots[0].unit).toBe('deg');
  });
});

describe('units', () => {
  const entry = getEntry('p-xi-2-4')!;
  const given = (u: SolveInput) => solve(entry, 'v', { u, a: { raw: '1', unit: 'm/s^2' }, t: { raw: '1', unit: 's' } });

  it('converts cm/s to m/s and shows the step', () => {
    const outcome = given({ raw: '50', unit: 'cm/s' });
    expect(outcome.roots[0].shown).toBeCloseTo(1.5);
    expect(outcome.steps.some((s) => s.label.startsWith('Convert'))).toBe(true);
  });

  it('converts km/h', () => {
    expect(given({ raw: '36', unit: 'km/hour' }).roots[0].shown).toBeCloseTo(11);
  });

  it('accepts a unit typed into the value box', () => {
    expect(given({ raw: '36 km/hour', unit: 'm/s' }).roots[0].shown).toBeCloseTo(11);
  });

  it('converts temperature from Celsius', () => {
    const gas = getEntry('p-xi-8-6')!;
    const outcome = solve(gas, 'P', { V: { raw: '1', unit: 'm^3' }, n: { raw: '1', unit: 'mol' }, R: { raw: '8.314', unit: 'J/(mol*K)' }, T: { raw: '27', unit: 'degC' } });
    expect(outcome.roots[0].shown).toBeCloseTo(8.314 * 300.15, 0);
  });

  it('warns when a unit measures the wrong thing', () => {
    const outcome = run('p-xi-4-4', 'U', { m: '2', h: '5 kg' });
    expect(outcome.ok).toBe(false);
    expect(outcome.inputProblems.h).toMatch(/kg measures \[M\], but this needs \[L\]/);
  });

  it('warns about an unknown unit and about text that is not a number', () => {
    expect(run('p-xi-4-4', 'U', { m: '2', h: '5 blorps' }).inputProblems.h).toMatch(/not a unit/);
    expect(run('p-xi-4-4', 'U', { m: '2', h: 'abc' }).inputProblems.h).toMatch(/Could not read/);
  });

  it('reads simple expressions', () => {
    expect(run('p-xi-4-4', 'U', { m: '2', h: '20/2' }).roots[0].shown).toBeCloseTo(196);
  });
});

describe('constraints and impossible values', () => {
  it('refuses a mass of zero', () => {
    expect(run('p-xi-4-2', 'K', { m: '0', v: '3' }).inputProblems.m).toMatch(/greater than 0/);
  });

  it('refuses a negative time', () => {
    expect(run('p-xi-2-4', 'v', { u: '1', a: '1', t: '-2' }).inputProblems.t).toMatch(/cannot be negative/);
  });

  it('explains when there is no real solution', () => {
    const outcome = run('p-xi-2-6', 'v', { u: '0', a: '-10', s: '5' });
    expect(outcome.ok).toBe(false);
    expect(outcome.message).toMatch(/no real solution/i);
  });

  it('reports a negative discriminant', () => {
    const outcome = run('m-xi-2-101', 'x', { a: '1', b: '0', c: '1' });
    expect(outcome.ok).toBe(false);
    expect(outcome.message).toMatch(/discriminant is negative/);
  });

  it('explains a zero denominator', () => {
    const outcome = run('p-xii-6-25', 'R', { f: '0' });
    expect(answers(outcome)).toEqual([0]);
    expect(run('m-xi-2-14', 'r', { S: '4', a: '0' }).ok).toBe(false);
  });

  it('asks for missing values', () => {
    const outcome = run('p-xi-2-4', 'v', { u: '5' });
    expect(outcome.ok).toBe(false);
    expect(outcome.inputProblems.a).toBeTruthy();
    expect(outcome.inputProblems.t).toBeTruthy();
  });
});
