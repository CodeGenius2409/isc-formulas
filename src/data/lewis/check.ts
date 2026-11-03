// The automated accuracy check. A wrong structure is worse than none, so a test runs this on every
// structure: electrons against the formula and charge, formal charges, octets, and shape against domains.
import type { LewisAtom, LewisMolecule, ShapeName } from './types';

/** Valence electrons. For metals, the electrons outside the core, which are d and s together. */
export const VALENCE: Record<string, number> = {
  H: 1, Be: 2, B: 3, Al: 3, C: 4, N: 5, P: 5, O: 6, S: 6, F: 7, Cl: 7, Br: 7, I: 7, X: 7,
  Fe: 8, Co: 9, Ni: 10, Pt: 10, Cu: 11, Ag: 11, Zn: 12,
};
export const METALS = new Set(['Fe', 'Co', 'Ni', 'Pt', 'Cu', 'Ag', 'Zn']);
const SECOND_PERIOD = new Set(['Be', 'B', 'C', 'N', 'O', 'F']);
/** May hold fewer than eight electrons without it being a mistake. */
const CAN_BE_DEFICIENT = new Set(['Be', 'B', 'Al', 'C']);
const CAN_EXPAND = new Set(['P', 'S', 'Cl', 'Br', 'I']);

/**
 * A group drawn as one label. `valence` is its total, `inside` is what its own bonds and lone pairs hold,
 * and what is left is what it brings to the bond drawn to it. R stands for any alkyl group.
 */
export const GROUPS: Record<string, { atoms: Record<string, number>; valence: number; inside: number }> = {
  CH3: { atoms: { C: 1, H: 3 }, valence: 7, inside: 6 },
  CH2: { atoms: { C: 1, H: 2 }, valence: 6, inside: 4 },
  CH: { atoms: { C: 1, H: 1 }, valence: 5, inside: 2 },
  C2H5: { atoms: { C: 2, H: 5 }, valence: 13, inside: 12 },
  C6H5: { atoms: { C: 6, H: 5 }, valence: 29, inside: 28 },
  R: { atoms: { R: 1 }, valence: 1, inside: 0 },
  OH: { atoms: { O: 1, H: 1 }, valence: 7, inside: 6 },
  NH3: { atoms: { N: 1, H: 3 }, valence: 8, inside: 6 },
  H2O: { atoms: { H: 2, O: 1 }, valence: 8, inside: 6 },
  CN: { atoms: { C: 1, N: 1 }, valence: 9, inside: 8 },
};

/** Splits a charge off the end of a formula. The charge is needed: NH4+ is NH₄ and +, but SO42- is SO₄ and 2−. */
export function splitCharge(formula: string, charge: number): { body: string; written: string } {
  const written = charge === 0 ? '' : `${Math.abs(charge) > 1 ? Math.abs(charge) : ''}${charge > 0 ? '+' : '-'}`;
  return { body: written && formula.endsWith(written) ? formula.slice(0, -written.length) : formula, written };
}

const SUBSCRIPTS: Record<string, string> = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
const SUPERSCRIPTS: Record<string, string> = { 2: '²', 3: '³', 4: '⁴', '+': '⁺', '-': '⁻' };

/** A formula for reading: [Co(NH₃)₆]³⁺. */
export function formulaText(formula: string, charge: number): string {
  const { body, written } = splitCharge(formula, charge);
  return body.replace(/\d/g, (d) => SUBSCRIPTS[d]) + [...written].map((c) => SUPERSCRIPTS[c] ?? c).join('');
}

function formulaAtoms(formula: string, charge: number): Record<string, number> {
  const text = splitCharge(formula, charge).body.replace(/\[|\]/g, '');
  const parse = (from: number): [Record<string, number>, number] => {
    const out: Record<string, number> = {};
    let i = from;
    const add = (key: string, n: number) => {
      out[key] = (out[key] ?? 0) + n;
    };
    while (i < text.length) {
      if (text[i] === ')') return [out, i];
      if (text[i] === '(') {
        const [inner, end] = parse(i + 1);
        let j = end + 1;
        let digits = '';
        while (/\d/.test(text[j] ?? '')) digits += text[j++];
        for (const [k, v] of Object.entries(inner)) add(k, v * Number(digits || 1));
        i = j;
        continue;
      }
      const m = /^([A-Z][a-z]?)(\d*)/.exec(text.slice(i));
      if (!m) throw new Error(`Can't read ${formula} at ${text.slice(i)}`);
      add(m[1], Number(m[2] || 1));
      i += m[0].length;
    }
    return [out, i];
  };
  return parse(0)[0];
}

const same = (a: Record<string, number>, b: Record<string, number>) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());

export const SHAPE_OF_DOMAINS: Record<string, ShapeName> = {
  '2,0': 'linear',
  '3,0': 'trigonal planar',
  '2,1': 'bent',
  '4,0': 'tetrahedral',
  '3,1': 'trigonal pyramidal',
  '2,2': 'bent',
  '5,0': 'trigonal bipyramidal',
  '4,1': 'see-saw',
  '3,2': 'T-shaped',
  '2,3': 'linear',
  '6,0': 'octahedral',
  '5,1': 'square pyramidal',
  '4,2': 'square planar',
};
export const HYB_OF_DOMAINS: Record<number, string> = { 2: 'sp', 3: 'sp2', 4: 'sp3', 5: 'sp3d', 6: 'sp3d2' };

const METAL_SHAPES: Record<number, { shape: ShapeName; hyb: string[] }[]> = {
  2: [{ shape: 'linear', hyb: ['sp'] }],
  4: [{ shape: 'tetrahedral', hyb: ['sp3'] }, { shape: 'square planar', hyb: ['dsp2'] }],
  6: [{ shape: 'octahedral', hyb: ['d2sp3', 'sp3d2'] }],
};

export interface CheckResult {
  name: string;
  pass: boolean;
  detail: string;
}

/** The electrons an atom brings, whether it is one atom or a group. */
function brings(atom: LewisAtom): number {
  const group = GROUPS[atom.el];
  if (group) return group.valence - group.inside;
  const v = VALENCE[atom.el];
  if (v === undefined) throw new Error(`No valence for ${atom.el}`);
  return v;
}

const bondsOf = (m: LewisMolecule, i: number) => m.bonds.map((b, index) => ({ b, index })).filter(({ b }) => (b.a === i || b.b === i) && b.style !== 'hbond');

export function formalCharge(m: LewisMolecule, i: number): number {
  const atom = m.atoms[i];
  let held = 2 * (atom.lp ?? 0) + (atom.radical ?? 0) + (atom.d ?? 0);
  for (const { b } of bondsOf(m, i)) {
    // A dative pair is counted to its donor and none to the acceptor, as the arrow says.
    if (b.style === 'dative') held += b.a === i ? 2 : 0;
    else held += b.order ?? 1;
  }
  return brings(atom) - held;
}

/** Electrons around an atom, for its octet. */
function electronsAround(m: LewisMolecule, i: number): number {
  const atom = m.atoms[i];
  return 2 * (atom.lp ?? 0) + (atom.radical ?? 0) + bondsOf(m, i).reduce((sum, { b }) => sum + 2 * (b.order ?? 1), 0);
}

function angleBetween(m: LewisMolecule, centre: number, p: number, q: number): number {
  const c = m.atoms[centre];
  const u = [m.atoms[p].x - c.x, m.atoms[p].y - c.y];
  const v = [m.atoms[q].x - c.x, m.atoms[q].y - c.y];
  return (Math.acos((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1]))) * 180) / Math.PI;
}

export function checkMolecule(m: LewisMolecule): CheckResult[] {
  const results: CheckResult[] = [];

  // The atoms drawn are the atoms in the formula.
  const drawn: Record<string, number> = {};
  for (const atom of m.atoms) {
    const parts = GROUPS[atom.el]?.atoms ?? { [atom.el]: 1 };
    for (const [k, v] of Object.entries(parts)) drawn[k] = (drawn[k] ?? 0) + v;
  }
  const wanted = formulaAtoms(m.formula, m.charge);
  results.push({ name: 'atoms', pass: same(drawn, wanted), detail: `drawn ${JSON.stringify(drawn)}, formula ${JSON.stringify(wanted)}` });

  // Total valence electrons, against the formula and the charge.
  let total = -m.charge;
  let placed = 0;
  m.atoms.forEach((atom) => {
    const group = GROUPS[atom.el];
    total += group ? group.valence : VALENCE[atom.el];
    placed += (group?.inside ?? 0) + 2 * (atom.lp ?? 0) + (atom.radical ?? 0) + (atom.d ?? 0);
  });
  for (const bond of m.bonds) if (bond.style !== 'hbond') placed += 2 * (bond.order ?? 1);
  results.push({ name: 'valence electrons', pass: total === placed, detail: `${total} from the formula and charge, ${placed} drawn` });

  // Formal charges: each as stated, and summing to the overall charge.
  const charges = m.atoms.map((_, i) => formalCharge(m, i));
  const stated = m.atoms.map((a) => a.charge ?? 0);
  const wrong = charges.flatMap((c, i) => (c === stated[i] ? [] : [`${m.atoms[i].el}: worked out ${c}, stated ${stated[i]}`]));
  results.push({ name: 'formal charges', pass: wrong.length === 0, detail: wrong.join('; ') || `each as stated: ${charges.join(', ')}` });
  const sum = charges.reduce((s, c) => s + c, 0);
  results.push({ name: 'charges sum', pass: sum === m.charge, detail: `sum ${sum}, overall ${m.charge}` });

  // Octets, with only the allowed exceptions.
  const octets: string[] = [];
  m.atoms.forEach((atom, i) => {
    if (GROUPS[atom.el] || METALS.has(atom.el)) return;
    const around = electronsAround(m, i);
    const exception = m.exceptions?.[i];
    const full = atom.el === 'H' ? 2 : 8;
    // A hydrogen given a dative pair, or a lone H+ in a bond, still ends with 2.
    if (exception === 'deficient') {
      if (!CAN_BE_DEFICIENT.has(atom.el) || around >= 8) octets.push(`${atom.el} marked deficient with ${around}`);
    } else if (exception === 'expanded') {
      if (!CAN_EXPAND.has(atom.el) || around <= 8) octets.push(`${atom.el} marked expanded with ${around}`);
    } else if (exception === 'odd') {
      if (around % 2 === 0 || around > 9) octets.push(`${atom.el} marked odd with ${around}`);
    } else if (around !== full) {
      octets.push(`${atom.el} has ${around}, wants ${full}`);
    }
    if (SECOND_PERIOD.has(atom.el) && around > 8) octets.push(`${atom.el} has ${around}, and period 2 can't expand`);
  });
  results.push({ name: 'octets', pass: octets.length === 0, detail: octets.join('; ') || 'as expected' });

  // Shape against the electron domains.
  if (m.central !== undefined && m.shape) {
    const centre = m.atoms[m.central];
    const neighbours = bondsOf(m, m.central);
    if (METALS.has(centre.el)) {
      const options = METAL_SHAPES[neighbours.length] ?? [];
      const match = options.find((o) => o.shape === m.shape);
      results.push({ name: 'shape', pass: Boolean(match), detail: `coordination number ${neighbours.length}, ${m.shape}` });
      results.push({ name: 'hybridisation', pass: Boolean(match && m.hyb && match.hyb.includes(m.hyb)), detail: `${m.hyb}` });
    } else {
      const lone = (centre.lp ?? 0) + (centre.radical && !m.oddInP ? 1 : 0);
      const key = `${neighbours.length},${lone}`;
      const expected = SHAPE_OF_DOMAINS[key];
      results.push({ name: 'shape', pass: expected === m.shape, detail: `${neighbours.length} bonded, ${lone} lone, so ${expected}; stated ${m.shape}` });
      if (m.hyb) {
        const domains = neighbours.length + lone;
        results.push({ name: 'hybridisation', pass: HYB_OF_DOMAINS[domains] === m.hyb, detail: `${domains} domains give ${HYB_OF_DOMAINS[domains]}; stated ${m.hyb}` });
      }
    }
    // Where a shape lies in the page, the drawing has to show its real angles.
    const inPlane = neighbours.filter(({ b }) => !b.style || b.style === 'dative');
    if (neighbours.length === inPlane.length && neighbours.length >= 2) {
      const ids = neighbours.map(({ b }) => (b.a === m.central ? b.b : b.a));
      const angles: number[] = [];
      for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) angles.push(angleBetween(m, m.central, ids[i], ids[j]));
      const wantAngles: Partial<Record<ShapeName, number[]>> = { linear: [180], 'trigonal planar': [120], 'square planar': [90, 180] };
      const allowed = wantAngles[m.shape];
      if (allowed) {
        const fits = angles.every((a) => allowed.some((w) => Math.abs(a - w) < 2));
        results.push({ name: 'drawn angles', pass: fits, detail: angles.map((a) => a.toFixed(0)).join(', ') });
      }
    }
  }
  return results;
}
