// Equations in the blueprints are written by hand, so each one is counted here: atoms and charge on both sides.
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import { generateItem } from '../../src/practice/gen/engine';

const SUB: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
const SUPER: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };

/** Atoms and charge of one side of an equation. */
function count(side: string): { atoms: Map<string, number>; charge: number } {
  const atoms = new Map<string, number>();
  let charge = 0;
  for (const raw of side.split(' + ')) {
    const term = raw.trim();
    const coefficient = /^(\d+)/.exec(term);
    const times = coefficient ? Number(coefficient[1]) : 1;
    const rest = term.replace(/^\d+/, '');
    for (const m of rest.matchAll(/([A-Z][a-z]?)([₀-₉]*)/g)) {
      const n = m[2] ? Number([...m[2]].map((c) => SUB[c]).join('')) : 1;
      atoms.set(m[1], (atoms.get(m[1]) ?? 0) + n * times);
    }
    const sign = /([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/.exec(rest);
    if (sign) {
      const size = sign[1] ? Number([...sign[1]].map((c) => SUPER[c]).join('')) : 1;
      charge += (sign[2] === '⁺' ? size : -size) * times;
    }
  }
  return { atoms, charge };
}

function expectBalanced(equation: string): void {
  const [left, right] = equation.split('→').map(count);
  expect([...left.atoms].sort(), `atoms in ${equation}`).toEqual([...right.atoms].sort());
  expect(left.charge, `charge in ${equation}`).toBe(right.charge);
}

describe('the checker itself', () => {
  it('passes a balanced equation', () => expectBalanced('MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O'));
  it('catches a wrong coefficient, and a wrong charge', () => {
    expect(() => expectBalanced('MnO₄⁻ + 8H⁺ + 4Fe²⁺ → Mn²⁺ + 4Fe³⁺ + 4H₂O')).toThrow();
    expect(() => expectBalanced('MnO₄⁻ + 8H⁺ → Mn²⁺ + 4H₂O + Fe')).toThrow();
  });
});

describe('equations in Chemistry blueprints', () => {
  it('all balance, for atoms and for charge', async () => {
    const set = await loadBlueprints('chemistry', 'XII');
    const seen = new Set<string>();
    for (const id of ['c12-4b-oxidant-equations', 'c12-4b-oxidant-preparation', 'c12-4a-transition-equations']) {
      const bp = set.blueprints.find((b) => b.id === id);
      expect(bp, id).toBeDefined();
      for (let seed = 0; seed < 300; seed++) {
        const item = generateItem(bp!, seed, set.names(bp!));
        if (item.form !== 'theory') continue;
        for (const point of item.points) {
          const found = /([^.:]*→[^.,]*)/.exec(point.text);
          if (found) seen.add(found[1].trim());
        }
      }
    }
    expect(seen.size).toBeGreaterThanOrEqual(14);
    for (const equation of seen) expectBalanced(equation);
  });
});
