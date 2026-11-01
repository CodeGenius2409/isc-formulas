import { describe, expect, it } from 'vitest';
import { checkUserEquation, suggestUnit, symbolsOfEquation } from '../../src/solver/checker';
import { checkEquation, formatDim, parseDim } from '../../src/solver/dims';
import { parseEquation } from '../../src/solver/expr';
import { dimOfUnit } from '../../src/solver/units';

const symbols = (table: Record<string, string>) => Object.fromEntries(Object.entries(table).map(([k, v]) => [k, { dim: parseDim(v) }]));

describe('dimension formatting', () => {
  it('prints textbook notation', () => {
    expect(formatDim(parseDim('L T^-1'))).toBe('[L T⁻¹]');
    expect(formatDim(parseDim('M L^2 T^-2'))).toBe('[M L² T⁻²]');
    expect(formatDim(parseDim(''))).toBe('[1]');
  });
  it('reads units through mathjs', () => {
    expect(formatDim(dimOfUnit('N'))).toBe('[M L T⁻²]');
    expect(formatDim(dimOfUnit('J'))).toBe('[M L² T⁻²]');
    expect(formatDim(dimOfUnit('V'))).toBe('[M L² T⁻³ I⁻¹]');
    expect(formatDim(dimOfUnit('mol/L'))).toBe('[L⁻³ N]');
  });
});

describe('equation checking', () => {
  it('accepts a correct equation', () => {
    const r = checkEquation(parseEquation('v = u + a*t'), symbols({ v: 'L T^-1', u: 'L T^-1', a: 'L T^-2', t: 'T' }));
    expect(r.ok).toBe(true);
    expect(r.message).toContain('[L T⁻¹]');
  });

  it('explains a mismatch between the two sides, in the words from the brief', () => {
    const r = checkEquation(parseEquation('v = a'), symbols({ v: 'L T^-1', a: 'L T^-2' }));
    expect(r.ok).toBe(false);
    expect(r.message).toContain('LHS is [L T⁻¹], RHS is [L T⁻²]');
    expect(r.message).toContain('[T⁻¹]');
  });

  it('catches adding unlike terms', () => {
    const r = checkEquation(parseEquation('s = u + a*t^2'), symbols({ s: 'L', u: 'L T^-1', a: 'L T^-2', t: 'T' }));
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/added.*same dimensions/);
    expect(r.termError).toBeTruthy();
  });

  it('requires dimensionless arguments for functions', () => {
    const r = checkEquation(parseEquation('y = sin(x)'), symbols({ y: '', x: 'L' }));
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/argument of sin must be dimensionless/);
  });

  it('requires dimensionless exponents', () => {
    expect(checkEquation(parseEquation('y = 2^t'), symbols({ y: '', t: 'T' })).ok).toBe(false);
    expect(checkEquation(parseEquation('N = N_0*exp(-L*t)'), symbols({ N: '', N_0: '', L: 'T^-1', t: 'T' })).ok).toBe(true);
    expect(checkEquation(parseEquation('N = N_0*exp(-L*t)'), symbols({ N: '', N_0: '', L: 'T^-1', t: 'L' })).ok).toBe(false);
  });

  it('handles square roots and powers', () => {
    expect(checkEquation(parseEquation('T = 2*pi*sqrt(l/g)'), symbols({ T: 'T', l: 'L', g: 'L T^-2' })).ok).toBe(true);
    expect(checkEquation(parseEquation('T = 2*pi*sqrt(g/l)'), symbols({ T: 'T', l: 'L', g: 'L T^-2' })).ok).toBe(false);
    expect(checkEquation(parseEquation('A = r^2'), symbols({ A: 'L^2', r: 'L' })).ok).toBe(true);
  });

  it('lets a bare zero match anything', () => {
    expect(checkEquation(parseEquation('a*x + b = 0'), symbols({ a: 'L T^-2', x: 'T^2', b: 'L' })).ok).toBe(true);
  });
});

describe('the "check my equation" tool', () => {
  it('finds the symbols and suggests units', () => {
    expect(symbolsOfEquation('F = m*a').symbols.sort()).toEqual(['F', 'a', 'm']);
    expect(suggestUnit('F')).toBe('N');
    expect(suggestUnit('v_0')).toBe('m/s');
  });

  it('checks with real units', () => {
    expect(checkUserEquation('F = m*a', { F: 'N', m: 'kg', a: 'm/s^2' }).ok).toBe(true);
    const wrong = checkUserEquation('F = m*v', { F: 'N', m: 'kg', v: 'm/s' });
    expect(wrong.ok).toBe(false);
    expect(wrong.message).toContain('LHS is [M L T⁻²], RHS is [M L T⁻¹]');
  });

  it('treats different units of one dimension as compatible', () => {
    expect(checkUserEquation('s = v*t', { s: 'km', v: 'cm/s', t: 'hour' }).ok).toBe(true);
  });

  it('reports a bad unit and a bad equation clearly', () => {
    expect(checkUserEquation('F = m*a', { F: 'blorp', m: 'kg', a: 'm/s^2' }).unitProblems.F).toMatch(/not a unit/);
    expect(checkUserEquation('F m a', {}).message).toMatch(/single "="/);
    expect(checkUserEquation('F = = m', {}).message).toMatch(/single "="/);
    expect(checkUserEquation('F = (m', {}).message).toMatch(/Could not read/);
  });
});
