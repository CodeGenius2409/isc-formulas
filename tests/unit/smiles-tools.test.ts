import { describe, expect, it } from 'vitest';
import structures from '../../src/data/generated/structures.json';
import { addGroup, relatedPosition, startCore, writeSmiles } from '../../src/custom/smiles-build';
import { atomAtCursor, readSmiles, sameSmiles, SmilesMistake } from '../../src/custom/smiles-read';

function mistake(text: string): SmilesMistake {
  try {
    readSmiles(text);
  } catch (err) {
    if (err instanceof SmilesMistake) return err;
    throw err;
  }
  throw new Error(`No mistake found in ${text}`);
}

const formula = (text: string) => readSmiles(text).reactants.map((m) => m.formula).join(', ');

describe('reading SMILES', () => {
  it('fills in hydrogens', () => {
    expect(formula('C')).toBe('CH4');
    expect(formula('CC')).toBe('C2H6');
    expect(formula('CCO')).toBe('C2H6O');
    expect(formula('C=C')).toBe('C2H4');
    expect(formula('C#C')).toBe('C2H2');
    expect(formula('CC(C)C')).toBe('C4H10');
    expect(formula('C1CCCCC1')).toBe('C6H12');
  });

  it('counts aromatic rings', () => {
    expect(formula('c1ccccc1')).toBe('C6H6');
    expect(formula('C1=CC=CC=C1')).toBe('C6H6');
    expect(formula('n1ccccc1')).toBe('C5H5N');
    expect(formula('c1cc[nH]c1')).toBe('C4H5N');
    expect(formula('c1ccoc1')).toBe('C4H4O');
    expect(formula('c1ccsc1')).toBe('C4H4S');
    expect(formula('c1ccc2ccccc2c1')).toBe('C10H8');
    expect(formula('c1ccc(cc1)-c1ccccc1')).toBe('C12H10');
    expect(formula('c1ccccc1c1ccccc1')).toBe('C12H10');
    expect(formula('O=c1cc[nH]cc1')).toBe('C5H5NO');
  });

  it('reads charges and groups in square brackets', () => {
    expect(formula('[NH4+]')).toBe('H4N+');
    expect(formula('[O-]')).toBe('O-');
    expect(formula('[OH-]')).toBe('HO-');
    expect(formula('C[N+](=O)[O-]')).toBe('CH3NO2');
    expect(formula('[Na+]')).toBe('Na+');
    expect(formula('[Fe+3]')).toBe('Fe+3');
    expect(formula('[Cu++]')).toBe('Cu+2');
  });

  it('reads ring numbers above nine', () => {
    expect(formula('C%10CCCCC%10')).toBe('C6H12');
    expect(sameSmiles('C%10CCCCC%10', 'C1CCCCC1')).toBe(true);
  });

  it('reads a reaction and dotted parts', () => {
    const r = readSmiles('CCO.O>>CC=O');
    expect(r.isReaction).toBe(true);
    expect(r.reactants.map((m) => m.formula)).toEqual(['C2H6O', 'H2O']);
    expect(r.products.map((m) => m.formula)).toEqual(['C2H4O']);
  });

  it('agrees with RDKit on the formula of every compound in the book', () => {
    const compounds = structures as unknown as Record<string, { s: string; m: string }>;
    const wrong: string[] = [];
    const sum = (f: string) => JSON.stringify([...f.replace(/[+-]\d*$/, '').matchAll(/([A-Z][a-z]?)(\d*)/g)].map((m) => `${m[1]}${m[2] || 1}`).sort());
    let checked = 0;
    for (const [key, { s, m }] of Object.entries(compounds)) {
      if (typeof s !== 'string' || typeof m !== 'string') continue;
      checked++;
      try {
        const parts = readSmiles(s).reactants;
        const all = parts.flatMap((p) => [...p.formula.replace(/[+-]\d*$/, '').matchAll(/([A-Z][a-z]?)(\d*)/g)]);
        const counts = new Map<string, number>();
        for (const [, el, n] of all) counts.set(el, (counts.get(el) ?? 0) + Number(n || 1));
        const mine = JSON.stringify([...counts].map(([el, n]) => `${el}${n}`).sort());
        if (mine !== sum(m)) wrong.push(`${key}: ${s} gave ${mine}, expected ${m}`);
      } catch (err) {
        wrong.push(`${key}: ${s} failed: ${(err as Error).message}`);
      }
    }
    expect(checked).toBeGreaterThan(200);
    expect(wrong).toEqual([]);
  });
});

describe('mistakes, in words', () => {
  it.each([
    ['C1CCC', /Ring 1 is opened at position 2 but never closed/, 1],
    ['C(CC', /bracket at position 2 is never closed/, 1],
    ['CC)C', /Unmatched bracket at position 3/, 2],
    ['CCCCCCCCCCC)C', /Unmatched bracket at position 12/, 11],
    ['[NH4+', /square bracket at position 1 is never closed/, 0],
    ['CC]', /Unmatched square bracket at position 3/, 2],
    ['C=', /The = at position 2 has no atom after it/, 1],
    ['=C', /The = at position 1 needs an atom before it/, 0],
    ['(C)C', /A branch can't come first, at position 1/, 0],
    ['C()C', /brackets at position 2 are empty/, 1],
    ['CC C', /no spaces/, 2],
    ['CNa', /Na at position 2 has to go in square brackets/, 1],
    ['Fe', /Fe at position 1 has to go in square brackets/, 0],
    ['CHC', /Leave hydrogens out at position 2/, 1],
    ['C%1CCC%1', /two-digit ring number/, 1],
    ['ccc', /Lowercase c at position 1 means an aromatic atom/, 0],
    ['c1cccc1', /can't have alternating double bonds/, 0],
    ['n1cccc1', /can't have alternating double bonds/, 0],
    ['C(C)(C)(C)(C)C', /Carbon at position 1 has 5 bonds, and it can make at most 4/, 0],
    ['CN(C)(C)C', /Nitrogen at position 2 has 4 bonds.*\[N\+\]/, 1],
    ['CC>C', /just one at position 3/, 2],
    ['CC>>', /after the >>/, 2],
    ['>>CC', /before the >>/, 0],
    ['C>>C>>C', /one >>/, 4],
    ['C..C', /A dot needs a compound/, 2],
    ['C11', /same atom/, 2],
    ['C1C1', /already bonded/, 3],
    ['C=1CC-1', /disagree/, 6],
    ['[Xx]', /isn't an element/, 0],
    ['C?', /\? at position 2 isn't part of SMILES/, 1],
    ['ClCl', null, 0],
  ] as const)('%s', (text, pattern, start) => {
    if (pattern === null) {
      expect(formula(text)).toBe('Cl2');
      return;
    }
    const err = mistake(text);
    expect(err.message).toMatch(pattern);
    expect(err.start).toBe(start);
    expect(err.end).toBeGreaterThan(err.start);
  });

  it("doesn't mistake an atom and an aromatic atom for one element", () => {
    expect(formula('Sc1ccccc1')).toBe('C6H6S');
    expect(formula('Cn1cccc1')).toBe('C5H7N');
  });

  it('a C in lower case for chlorine gets a clear note', () => {
    expect(mistake('Ccl').message).toContain('Cl is written with a capital');
  });
});

describe('the same compound, written differently', () => {
  it.each([
    ['Oc1ccccc1', 'c1ccc(O)cc1'],
    ['Oc1ccccc1', 'C1=CC=C(O)C=C1'],
    ['c1ccccc1', 'C1=CC=CC=C1'],
    ['c1ccccc1', 'C1C=CC=CC=1'],
    ['CCO', 'OCC'],
    ['CC(C)C', 'C(C)(C)C'],
    ['Cc1ccccc1', 'c1ccc(C)cc1'],
    ['CC(=O)O', 'OC(C)=O'],
    ['C[N+](=O)[O-]', 'CN(=O)=O'],
    ['[H]C([H])([H])[H]', 'C'],
    ['C/C=C/C', 'CC=CC'],
    ['c1ccc2ccccc2c1', 'c1cc2ccccc2cc1'],
    ['C%10CCCCC%10', 'C1CCCCC1'],
    ['CCO.O', 'O.OCC'],
    ['CCO>>CC=O', 'OCC>>O=CC'],
  ])('%s and %s', (a, b) => {
    expect(sameSmiles(a, b)).toBe(true);
    expect(sameSmiles(b, a)).toBe(true);
  });

  it.each([
    ['CCO', 'COC'],
    ['Oc1ccccc1O', 'Oc1ccc(O)cc1'],
    ['Oc1ccc(O)cc1', 'Oc1cc(O)ccc1'],
    ['CCC', 'CC'],
    ['C=C', 'CC'],
    ['C[N+](=O)[O-]', 'CN'],
    ['c1ccccc1', 'C1CCCCC1'],
    ['CCCC', 'CC(C)C'],
    ['CCO>>CC=O', 'CC=O>>CCO'],
    ['CCO', 'CCO>>CCO'],
    ['nonsense(', 'CCO'],
  ])('%s and %s are different', (a, b) => {
    expect(sameSmiles(a, b)).toBe(false);
  });
});

describe('which character is which atom', () => {
  it('finds the atom under the cursor', () => {
    const r = readSmiles('CC(O)Br');
    expect(atomAtCursor(r, 0)?.atom).toBe(0);
    expect(atomAtCursor(r, 1)?.atom).toBe(1);
    expect(atomAtCursor(r, 2)?.atom).toBe(1);
    expect(atomAtCursor(r, 3)?.atom).toBe(2);
    expect(atomAtCursor(r, 4)?.atom).toBe(2);
    expect(atomAtCursor(r, 5)?.atom).toBe(3);
    expect(atomAtCursor(r, 6)?.atom).toBe(3);
  });

  it('treats a bracket as one atom, and separates the parts of a reaction', () => {
    const r = readSmiles('[NH4+].C>>O');
    expect(atomAtCursor(r, 3)?.atom).toBe(0);
    expect(atomAtCursor(r, 7)?.molecule.formula).toBe('CH4');
    expect(atomAtCursor(r, 10)?.molecule.formula).toBe('H2O');
  });
});

describe('the builder', () => {
  const phenol = addGroup(startCore('benzene'), 1, 'OH');

  it('writes the plain cores', () => {
    expect(formula(writeSmiles(startCore('benzene')))).toBe('C6H6');
    expect(formula(writeSmiles(startCore('cyclohexane')))).toBe('C6H12');
    expect(formula(writeSmiles(startCore('cyclopentane')))).toBe('C5H10');
    expect(formula(writeSmiles(startCore('pyridine')))).toBe('C5H5N');
    expect(formula(writeSmiles(startCore('chain', 4)))).toBe('C4H10');
  });

  it.each([
    ['ortho', 'Oc1ccccc1[N+](=O)[O-]'],
    ['meta', 'Oc1cccc(c1)[N+](=O)[O-]'],
    ['para', 'Oc1ccc(cc1)[N+](=O)[O-]'],
  ] as const)('puts a group %s to another', (relation, expected) => {
    const position = relatedPosition(phenol, 1, relation);
    expect(position).not.toBeNull();
    const built = writeSmiles(addGroup(phenol, position!, 'NO2'));
    expect(sameSmiles(built, expected)).toBe(true);
    for (const other of ['ortho', 'meta', 'para'] as const) {
      if (other === relation) continue;
      const position2 = relatedPosition(phenol, 1, other)!;
      expect(sameSmiles(built, writeSmiles(addGroup(phenol, position2, 'NO2')))).toBe(false);
    }
  });

  it('picks the free side when one is taken', () => {
    const one = addGroup(phenol, relatedPosition(phenol, 1, 'ortho')!, 'Cl');
    const two = relatedPosition(one, 1, 'ortho');
    expect(two).toBe(6);
    expect(sameSmiles(writeSmiles(addGroup(one, two!, 'Cl')), 'Oc1c(Cl)cccc1Cl')).toBe(true);
    const para = addGroup(phenol, 4, 'Cl');
    expect(relatedPosition(para, 1, 'para')).toBeNull();
  });

  it('writes every group on a ring and on a chain', () => {
    const expected: Record<string, string> = { OH: 'C6H6O', NO2: 'C6H5NO2', Cl: 'C6H5Cl', Br: 'C6H5Br', NH2: 'C6H7N', CH3: 'C7H8', CHO: 'C7H6O', COOH: 'C7H6O2', OCH3: 'C7H8O' };
    for (const [group, want] of Object.entries(expected)) {
      expect(formula(writeSmiles(addGroup(startCore('benzene'), 3, group as never)))).toBe(want);
    }
    expect(sameSmiles(writeSmiles(addGroup(startCore('chain', 3), 1, 'OH')), 'OCCC')).toBe(true);
    expect(sameSmiles(writeSmiles(addGroup(startCore('chain', 3), 3, 'OH')), 'OCCC')).toBe(true);
    expect(sameSmiles(writeSmiles(addGroup(startCore('chain', 3), 2, 'OH')), 'CC(O)C')).toBe(true);
    expect(sameSmiles(writeSmiles(addGroup(startCore('chain', 1), 1, 'OH')), 'CO')).toBe(true);
  });

  it('keeps groups off the nitrogen of pyridine', () => {
    const p = startCore('pyridine');
    expect(addGroup(p, 1, 'OH')).toBe(p);
    expect(formula(writeSmiles(addGroup(p, 4, 'CH3')))).toBe('C6H7N');
  });
});
