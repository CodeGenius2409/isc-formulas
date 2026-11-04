import { describe, expect, it } from 'vitest';
import compounds from '../../src/data/generated/compound-list.json';
import { checkTry } from '../../src/custom/smiles-check';
import { readSmiles, sameSmiles } from '../../src/custom/smiles-read';
import { GUIDE } from '../../src/data/smiles-tutorial';

const MASS: Record<string, number> = { H: 1.008, B: 10.81, C: 12.011, N: 14.007, O: 15.999, F: 18.998, Na: 22.99, Mg: 24.305, Al: 26.982, Si: 28.086, P: 30.974, S: 32.06, Cl: 35.45, K: 39.098, Ca: 40.078, Fe: 55.845, Cu: 63.546, Zn: 65.38, Br: 79.904, Ag: 107.868, I: 126.904, Li: 6.94, Mn: 54.938, Cr: 51.996, Hg: 200.59, Sn: 118.71, Pb: 207.2, Co: 58.933, Ni: 58.693 };

function massOf(formula: string): number {
  return [...formula.replace(/[+-]\d*$/, '').matchAll(/([A-Z][a-z]?)(\d*)/g)].reduce((sum, [, el, n]) => {
    expect(MASS[el], `no mass for ${el}`).toBeDefined();
    return sum + MASS[el] * Number(n || 1);
  }, 0);
}

describe('the guide', () => {
  it('has the nine steps asked for', () => {
    expect(GUIDE.length).toBe(9);
    expect(GUIDE.every((s) => s.explain.length > 0 && s.more.length > 0)).toBe(true);
  });

  it('every example and every answer can be read', () => {
    for (const step of GUIDE) {
      expect(() => readSmiles(step.example), step.example).not.toThrow();
      for (const m of step.more) expect(() => readSmiles(m.smiles), m.smiles).not.toThrow();
      if (step.tryIt) expect(() => readSmiles(step.tryIt!.answer), step.tryIt.answer).not.toThrow();
    }
  });

  it('every example is the compound it says it is', () => {
    const known: Record<string, string> = {
      Methane: 'CH4',
      Ethane: 'C2H6',
      Methoxymethane: 'C2H6O',
      Ethene: 'C2H4',
      Ethyne: 'C2H2',
      Ethanenitrile: 'C2H3N',
      'Propan-2-ol': 'C3H8O',
      'Ethanoic acid': 'C2H4O2',
      Trichloromethane: 'CHCl3',
      Cyclopropane: 'C3H6',
      Cyclohexene: 'C6H10',
      Methylcyclohexane: 'C7H14',
      'Benzene, Kekulé form': 'C6H6',
      Phenol: 'C6H6O',
      Pyridine: 'C5H5N',
      '2-Nitrophenol (ortho)': 'C6H5NO3',
      '3-Nitrophenol (meta)': 'C6H5NO3',
      '4-Nitrophenol (para)': 'C6H5NO3',
      'Ammonium ion': 'H4N+',
      'Hydroxide ion': 'HO-',
      'Sodium ion': 'Na+',
      Biphenyl: 'C12H10',
      Anthracene: 'C14H10',
      'Cyclohexane, with %10': 'C6H12',
    };
    for (const step of GUIDE) {
      for (const m of step.more) {
        if (m.smiles.includes('>>')) continue;
        expect(readSmiles(m.smiles).reactants[0].formula, m.label).toBe(known[m.label]);
      }
    }
  });

  it('the three nitrophenols are different compounds with one formula', () => {
    const step = GUIDE.find((s) => s.title.includes('Ortho'))!;
    const [o, m, p] = step.more.map((x) => x.smiles);
    expect(sameSmiles(o, m)).toBe(false);
    expect(sameSmiles(m, p)).toBe(false);
    expect(sameSmiles(o, p)).toBe(false);
    expect(sameSmiles(p, 'c1cc(ccc1[N+](=O)[O-])O')).toBe(true);
  });
});

describe('try it', () => {
  it('accepts any correct way of writing the answer', () => {
    const accepted: Record<string, string[]> = {
      CCCO: ['OCCC'],
      'CC=C': ['C=CC'],
      'CC(C)(C)O': ['OC(C)(C)C', 'CC(O)(C)C'],
      C1CCCC1: ['C2CCCC2', 'C%10CCCC%10'],
      Cc1ccccc1: ['c1ccc(C)cc1', 'CC1=CC=CC=C1', 'c1cc(C)ccc1'],
      'Cc1ccc(Cl)cc1': ['Clc1ccc(C)cc1', 'CC1=CC=C(Cl)C=C1'],
      'CC(=O)[O-]': ['[O-]C(=O)C', 'CC([O-])=O'],
      c1ccc2ccccc2c1: ['c1cc2ccccc2cc1', 'C1=CC=C2C=CC=CC2=C1'],
      'C=C.BrBr>>BrCCBr': ['BrBr.C=C>>BrCCBr', 'C=C.BrBr>>C(Br)CBr'],
    };
    for (const step of GUIDE) {
      const task = step.tryIt!;
      expect(accepted[task.answer], task.answer).toBeDefined();
      expect(checkTry(task.answer, task.answer, task.hints, 0).right).toBe(true);
      for (const other of accepted[task.answer]) expect(checkTry(other, task.answer, task.hints, 0).right, other).toBe(true);
    }
  });

  it('the example from the brief', () => {
    expect(checkTry('Oc1ccccc1', 'c1ccc(O)cc1', ['x'], 0).right).toBe(true);
    expect(checkTry('c1ccc(O)cc1', 'Oc1ccccc1', ['x'], 0).right).toBe(true);
  });

  it('says what is wrong, and gives the next hint after each wrong try', () => {
    const hints = ['First hint.', 'Second hint.'];
    const one = checkTry('CCC', 'Cc1ccccc1', hints, 0);
    expect(one.right).toBe(false);
    expect(one.message).toContain('That gives C3H8');
    expect(one.message).toContain('should be C7H8');
    expect(one.message).toContain('First hint.');
    expect(checkTry('CCC', 'Cc1ccccc1', hints, 1).message).toContain('Second hint.');
    expect(checkTry('CCC', 'Cc1ccccc1', hints, 5).message).toContain('Second hint.');
    expect(checkTry('COC', 'CCO', hints, 0).message).toContain('right atoms');
    expect(checkTry('C(C', 'CCO', hints, 0).message).toContain('never closed');
    expect(checkTry('  ', 'CCO', hints, 0)).toEqual({ right: false, message: '' });
  });
});

describe('pick by name', () => {
  const list = compounds as unknown as { n: string; s: string; m: string; a: number }[];

  it('has a useful number of compounds', () => {
    expect(list.length).toBeGreaterThanOrEqual(200);
    expect(list.length).toBeLessThanOrEqual(300);
    expect(new Set(list.map((c) => c.n)).size).toBe(list.length);
  });

  it('every formula and mass agrees with the SMILES, read again by the editor', () => {
    const wrong: string[] = [];
    const counts = (f: string) => JSON.stringify([...f.replace(/[+-]\d*$/, '').matchAll(/([A-Z][a-z]?)(\d*)/g)].map((m) => `${m[1]}${m[2] || 1}`).sort());
    for (const c of list) {
      const parts = readSmiles(c.s).reactants;
      const joined = new Map<string, number>();
      for (const part of parts) for (const [, el, n] of part.formula.replace(/[+-]\d*$/, '').matchAll(/([A-Z][a-z]?)(\d*)/g)) joined.set(el, (joined.get(el) ?? 0) + Number(n || 1));
      const mine = JSON.stringify([...joined].map(([el, n]) => `${el}${n}`).sort());
      if (mine !== counts(c.m)) wrong.push(`${c.n}: ${c.s} reads as ${mine}, listed ${c.m}`);
      if (Math.abs(massOf(c.m) - c.a) > 0.15) wrong.push(`${c.n}: mass ${massOf(c.m).toFixed(2)}, listed ${c.a}`);
    }
    expect(wrong).toEqual([]);
  });
});
