// The Boolean answers written by hand are worked out here a second time, by truth table, since nothing else reads them.
import { describe, expect, it } from 'vitest';

type F = (...v: boolean[]) => boolean;
const table = (vars: number, f: F): number[] => {
  const out: number[] = [];
  for (let i = 0; i < 2 ** vars; i++) {
    const bits = Array.from({ length: vars }, (_, k) => Boolean((i >> (vars - 1 - k)) & 1));
    if (f(...bits)) out.push(i);
  }
  return out;
};

describe('hand-written Boolean answers', () => {
  it('F(A,B,C,D) = Σ(0,1,2,5,8,9,10) reduces to B′D′ + B′C′ + A′C′D', () => {
    expect(table(4, (a, b, c, d) => (!b && !d) || (!b && !c) || (!a && !c && d))).toEqual([0, 1, 2, 5, 8, 9, 10]);
  });
  it('F(P,Q,R,S) = π(3,7,11,12,13,14,15) reduces to (P′+Q′)(R′+S′), which is Σ(0,1,2,4,5,6,8,9,10)', () => {
    expect(table(4, (p, q, r, s) => (!p || !q) && (!r || !s))).toEqual([0, 1, 2, 4, 5, 6, 8, 9, 10]);
  });
  it('X′Y + XY′ + XY is X + Y', () => {
    expect(table(2, (x, y) => (!x && y) || (x && !y) || (x && y))).toEqual(table(2, (x, y) => x || y));
  });
  it('X + YZ is the five minterms given', () => {
    expect(table(3, (x, y, z) => x || (y && z))).toEqual(table(3, (x, y, z) => (x && !y && !z) || (x && !y && z) || (x && y && !z) || (x && y && z) || (!x && y && z)));
  });
  it('an odd number of switches is A ⊕ B ⊕ C', () => {
    expect(table(3, (a, b, c) => (a !== b) !== c)).toEqual([1, 2, 4, 7]);
  });
});
