// Acid-base titration curves, from the exact charge balance rather than region-by-
// region approximations, so that the curve stays smooth and correct throughout.

export const KW = 1e-14;

export type TitrationKind = 'strong-acid-strong-base' | 'weak-acid-strong-base' | 'strong-acid-weak-base' | 'strong-base-strong-acid' | 'weak-base-strong-acid';

export interface TitrationSetup {
  kind: TitrationKind;
  /** Concentration and volume in the flask. */
  analyteC: number;
  analyteV: number;
  /** Concentration in the burette. */
  titrantC: number;
  /** pKa of the weak acid, or pKb of the weak base, when there is one. */
  pK: number;
}

/** A strong acid or base is modelled with a very large dissociation constant. */
const STRONG = 1e10;

interface Species {
  acidC: number;
  Ka: number;
  baseC: number;
  /** Ka of the base's conjugate acid. */
  KaConj: number;
}

function speciesAt(setup: TitrationSetup, added: number): Species {
  const total = setup.analyteV + added;
  const inFlask = (setup.analyteC * setup.analyteV) / total;
  const fromBurette = total > 0 ? (setup.titrantC * added) / total : 0;
  const K = 10 ** -setup.pK;
  switch (setup.kind) {
    case 'strong-acid-strong-base':
      return { acidC: inFlask, Ka: STRONG, baseC: fromBurette, KaConj: KW / STRONG };
    case 'weak-acid-strong-base':
      return { acidC: inFlask, Ka: K, baseC: fromBurette, KaConj: KW / STRONG };
    case 'strong-acid-weak-base':
      return { acidC: inFlask, Ka: STRONG, baseC: fromBurette, KaConj: KW / K };
    case 'strong-base-strong-acid':
      return { acidC: fromBurette, Ka: STRONG, baseC: inFlask, KaConj: KW / STRONG };
    case 'weak-base-strong-acid':
      return { acidC: fromBurette, Ka: STRONG, baseC: inFlask, KaConj: KW / K };
  }
}

/**
 * pH from the charge balance  [H⁺] + [BH⁺] = [OH⁻] + [A⁻],  found by bisection on
 * log[H⁺]. The balance only ever falls as [H⁺] falls, so there is exactly one root.
 */
export function phOf(species: Species): number {
  const balance = (h: number) => {
    const aMinus = species.acidC * (species.Ka / (species.Ka + h));
    const bPlus = species.baseC * (h / (species.KaConj + h));
    return h + bPlus - KW / h - aMinus;
  };
  let lo = -16; // log10[H⁺]
  let hi = 2;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (balance(10 ** mid) > 0) hi = mid;
    else lo = mid;
  }
  return -(lo + hi) / 2;
}

export function phAfter(setup: TitrationSetup, added: number): number {
  return phOf(speciesAt(setup, added));
}

export function equivalenceVolume(setup: TitrationSetup): number {
  return (setup.analyteC * setup.analyteV) / setup.titrantC;
}

export function isWeak(kind: TitrationKind): boolean {
  return kind.startsWith('weak') || kind.includes('weak');
}

export interface Indicator {
  name: string;
  low: number;
  high: number;
  /** Colour below and above the range, for showing the change. */
  acidColour: string;
  baseColour: string;
  acidName: string;
  baseName: string;
}

export const INDICATORS: Indicator[] = [
  { name: 'Methyl orange', low: 3.1, high: 4.4, acidColour: '#d6322c', baseColour: '#e8b923', acidName: 'red', baseName: 'yellow' },
  { name: 'Methyl red', low: 4.4, high: 6.2, acidColour: '#d6322c', baseColour: '#e8c623', acidName: 'red', baseName: 'yellow' },
  { name: 'Bromothymol blue', low: 6.0, high: 7.6, acidColour: '#d9c21e', baseColour: '#2b5fc1', acidName: 'yellow', baseName: 'blue' },
  { name: 'Phenol red', low: 6.8, high: 8.4, acidColour: '#d9b51e', baseColour: '#d6322c', acidName: 'yellow', baseName: 'red' },
  { name: 'Phenolphthalein', low: 8.2, high: 10.0, acidColour: '#d8d8d8', baseColour: '#d62c8f', acidName: 'colourless', baseName: 'pink' },
];

/**
 * An indicator suits a titration when its colour-change range falls inside the
 * near-vertical jump around equivalence, so the colour flips within a drop or two.
 * The jump is taken from 0.5% before equivalence to 0.5% after, which is about one
 * drop in a 25 mL titration.
 */
export function jumpRange(setup: TitrationSetup): { low: number; high: number } {
  const v = equivalenceVolume(setup);
  const a = phAfter(setup, v * 0.995);
  const b = phAfter(setup, v * 1.005);
  return { low: Math.min(a, b), high: Math.max(a, b) };
}

/** How far a range may overhang the jump and still change sharply enough to read. */
const OVERHANG = 0.5;

export function suitableIndicators(setup: TitrationSetup): Indicator[] {
  const { low, high } = jumpRange(setup);
  return INDICATORS.filter((i) => i.low >= low - OVERHANG && i.high <= high + OVERHANG);
}

/** For a weak/weak-free case with no perfect fit, the closest indicator by range centre. */
export function bestIndicator(setup: TitrationSetup): Indicator {
  const suitable = suitableIndicators(setup);
  const eqPh = phAfter(setup, equivalenceVolume(setup));
  const score = (i: Indicator) => Math.abs((i.low + i.high) / 2 - eqPh);
  return [...(suitable.length ? suitable : INDICATORS)].sort((a, b) => score(a) - score(b))[0];
}
