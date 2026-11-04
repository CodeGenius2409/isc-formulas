// Reads SMILES into atoms and bonds, in plain TypeScript with nothing to load. The drawing engine only draws.
// This is what can say which character is which atom, explain a mistake in words, work out the molecular
// formula, and tell that two different strings mean the same compound.

export interface ReadAtom {
  element: string;
  aromatic: boolean;
  bracket: boolean;
  charge: number;
  /** Hydrogens on this atom, written or implied. */
  hydrogens: number;
  /** Where it is in the text. `end` is one past the last character. */
  start: number;
  end: number;
}

export interface ReadBond {
  a: number;
  b: number;
  order: number;
}

export interface ReadMolecule {
  atoms: ReadAtom[];
  bonds: ReadBond[];
  start: number;
  end: number;
  formula: string;
  text: string;
}

export interface ReadStructure {
  reactants: ReadMolecule[];
  products: ReadMolecule[];
  isReaction: boolean;
}

/** A mistake in the text, in words, with where it is. */
export class SmilesMistake extends Error {
  constructor(
    message: string,
    readonly start: number,
    readonly end: number,
  ) {
    super(message);
  }
}

const ORGANIC = new Set(['B', 'C', 'N', 'O', 'P', 'S', 'F', 'Cl', 'Br', 'I']);
const AROMATIC = new Set(['b', 'c', 'n', 'o', 'p', 's']);
const ELEMENTS = new Set(
  'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu'.split(' '),
);
const NAMES: Record<string, string> = { B: 'Boron', C: 'Carbon', N: 'Nitrogen', O: 'Oxygen', P: 'Phosphorus', S: 'Sulphur', F: 'Fluorine', Cl: 'Chlorine', Br: 'Bromine', I: 'Iodine' };
const BONDS: Record<string, number> = { '-': 1, '=': 2, '#': 3, $: 4, ':': 1.5, '/': 1, '\\': 1 };
const VALENCES: Record<string, number[]> = { B: [3], C: [4], N: [3], O: [2], P: [3, 5], S: [2, 4, 6], F: [1], Cl: [1], Br: [1], I: [1] };

const titleCase = (s: string) => s[0].toUpperCase() + s.slice(1);
const at = (position: number) => `position ${position + 1}`;

interface Draft {
  atoms: (ReadAtom & { written: number | null })[];
  bonds: (ReadBond & { written: boolean })[];
}

/** Bonds that aren't part of any ring, found by depth-first search. */
function bridges(draft: Draft): Set<number> {
  const adjacent: [neighbour: number, bond: number][][] = draft.atoms.map(() => []);
  draft.bonds.forEach((b, i) => {
    adjacent[b.a].push([b.b, i]);
    adjacent[b.b].push([b.a, i]);
  });
  const order = new Array<number>(draft.atoms.length).fill(-1);
  const low = new Array<number>(draft.atoms.length).fill(0);
  const out = new Set<number>();
  let clock = 0;
  const walk = (atom: number, via: number) => {
    order[atom] = low[atom] = clock++;
    for (const [next, bond] of adjacent[atom]) {
      if (bond === via) continue;
      if (order[next] >= 0) {
        low[atom] = Math.min(low[atom], order[next]);
      } else {
        walk(next, bond);
        low[atom] = Math.min(low[atom], low[next]);
        if (low[next] > order[atom]) out.add(bond);
      }
    }
  };
  for (let i = 0; i < draft.atoms.length; i++) if (order[i] < 0) walk(i, -1);
  return out;
}

/** Turns aromatic bonds into alternating single and double ones, so hydrogens can be counted. False if that can't be done. */
function kekulise(draft: Draft): boolean {
  const aromaticBonds = draft.bonds.map((b, i) => ({ ...b, index: i })).filter((b) => b.order === 1.5);
  if (!aromaticBonds.length) return true;
  const neighbours = new Map<number, { atom: number; bond: number }[]>();
  for (const b of aromaticBonds) {
    (neighbours.get(b.a) ?? neighbours.set(b.a, []).get(b.a)!).push({ atom: b.b, bond: b.index });
    (neighbours.get(b.b) ?? neighbours.set(b.b, []).get(b.b)!).push({ atom: b.a, bond: b.index });
  }
  const others = (atom: number) =>
    draft.bonds.filter((b) => (b.a === atom || b.b === atom) && b.order !== 1.5).reduce((sum, b) => sum + b.order, 0);
  /** Must this atom take a double bond inside the ring to be happy? */
  const needsDouble = (atom: number) => {
    const a = draft.atoms[atom];
    const sigma = (neighbours.get(atom)?.length ?? 0) + others(atom);
    if (a.element === 'C') return sigma + a.hydrogens * Number(a.bracket) < 4 && a.charge === 0;
    if (a.element === 'N' || a.element === 'P') return sigma + a.charge + a.hydrogens * Number(a.bracket) === 2 || (a.charge === 1 && sigma === 3);
    if (a.element === 'B') return false;
    if (a.element === 'O' || a.element === 'S') return a.charge === 1 && sigma === 2;
    return false;
  };
  const taken = new Set<number>();
  const chosen = new Set<number>();
  const must = [...neighbours.keys()].filter(needsDouble);
  const free = new Set(must);
  let budget = 200_000;
  const solve = (left: number[]): boolean => {
    if (--budget < 0) return false;
    const rest = left.filter((a) => !taken.has(a));
    if (!rest.length) return true;
    // The most constrained atom next, which makes this quick on real molecules.
    const options = (a: number) => (neighbours.get(a) ?? []).filter((n) => free.has(n.atom) && !taken.has(n.atom));
    const atom = rest.reduce((best, a) => (options(a).length < options(best).length ? a : best), rest[0]);
    for (const { atom: other, bond } of options(atom)) {
      taken.add(atom);
      taken.add(other);
      chosen.add(bond);
      if (solve(rest)) return true;
      taken.delete(atom);
      taken.delete(other);
      chosen.delete(bond);
    }
    return false;
  };
  if (!solve(must)) return false;
  for (const b of aromaticBonds) draft.bonds[b.index].order = chosen.has(b.index) ? 2 : 1;
  return true;
}

function finishMolecule(draft: Draft, text: string, start: number, end: number): ReadMolecule {
  const { atoms, bonds } = draft;
  // Between aromatic atoms a bond is aromatic unless it says otherwise, or isn't in a ring at all.
  const notInRing = bridges(draft);
  bonds.forEach((b, i) => {
    if (b.written) return;
    if (atoms[b.a].aromatic && atoms[b.b].aromatic && !notInRing.has(i)) b.order = 1.5;
  });
  atoms.forEach((a, i) => {
    if (!a.aromatic) return;
    const inRing = bonds.some((b, j) => (b.a === i || b.b === i) && !notInRing.has(j));
    if (!inRing) throw new SmilesMistake(`Lowercase ${a.element.toLowerCase()} at ${at(a.start)} means an aromatic atom, and those are only found in rings. Use capital ${a.element} for an ordinary atom.`, a.start, a.end);
  });
  if (!kekulise(draft)) {
    const first = atoms.find((a) => a.aromatic)!;
    throw new SmilesMistake("This aromatic ring can't have alternating double bonds, so check its size. A five-membered ring with nitrogen usually needs [nH], as in c1cc[nH]c1.", first.start, first.end);
  }
  atoms.forEach((a, i) => {
    const used = bonds.filter((b) => b.a === i || b.b === i).reduce((sum, b) => sum + b.order, 0);
    if (a.bracket) {
      a.hydrogens = a.written ?? 0;
      checkBracket(a, used + a.hydrogens);
      return;
    }
    const allowed = VALENCES[a.element];
    const fits = allowed.find((v) => v >= used);
    // A neutral nitrogen with five bonds is the old way of writing nitro, which is still seen in books.
    if (a.element === 'N' && used === 5) {
      a.hydrogens = 0;
      return;
    }
    if (fits === undefined) {
      const name = NAMES[a.element];
      const hint = a.element === 'N' ? ' With four bonds it carries a charge, so write [N+].' : a.element === 'O' ? ' With three bonds it carries a charge, so write [O+].' : '';
      throw new SmilesMistake(`${name} at ${at(a.start)} has ${used} bonds, and it can make at most ${allowed[allowed.length - 1]}.${hint}`, a.start, a.end);
    }
    a.hydrogens = fits - used;
  });
  return { atoms: atoms.map(({ written: _w, ...atom }) => atom), bonds: bonds.map(({ written: _w, ...bond }) => bond), start, end, text: text.slice(start, end), formula: formulaOf(atoms) };
}

function checkBracket(a: ReadAtom, used: number): void {
  const most: Record<string, number> = { C: 4 - Math.abs(a.charge), N: 3 + a.charge, O: 2 + a.charge };
  const limit = most[a.element];
  if (limit === undefined || a.charge > 1 || a.charge < -1) return;
  if (used > limit) {
    throw new SmilesMistake(`${NAMES[a.element]} with a charge of ${a.charge > 0 ? '+' : ''}${a.charge} at ${at(a.start)} has ${used} bonds, and it can make at most ${limit}.`, a.start, a.end);
  }
}

/** Molecular formula in Hill order, with any overall charge after it. */
export function formulaOf(atoms: ReadAtom[]): string {
  const counts = new Map<string, number>();
  let charge = 0;
  for (const a of atoms) {
    counts.set(a.element, (counts.get(a.element) ?? 0) + 1);
    if (a.hydrogens) counts.set('H', (counts.get('H') ?? 0) + a.hydrogens);
    charge += a.charge;
  }
  const rest = [...counts.keys()].filter((k) => k !== 'C' && k !== 'H').sort();
  const order = counts.has('C') ? ['C', ...(counts.has('H') ? ['H'] : []), ...rest] : [...counts.keys()].sort();
  const body = order.map((k) => `${k}${counts.get(k)! > 1 ? counts.get(k) : ''}`).join('');
  if (!charge) return body;
  const size = Math.abs(charge) > 1 ? Math.abs(charge) : '';
  return `${body}${charge > 0 ? '+' : '-'}${size}`;
}

function readBracket(text: string, start: number): { atom: ReadAtom & { written: number | null }; next: number } {
  const close = text.indexOf(']', start);
  const nextOpen = text.indexOf('[', start + 1);
  if (close < 0 || (nextOpen >= 0 && nextOpen < close)) throw new SmilesMistake(`The square bracket at ${at(start)} is never closed.`, start, start + 1);
  const inner = text.slice(start + 1, close);
  if (!inner) throw new SmilesMistake(`The square brackets at ${at(start)} are empty. Put one atom inside, like [NH4+].`, start, close + 1);
  const match = /^(\d+)?([A-Z][a-z]?|[a-z]{1,2})(@{0,2}(?:[A-Z]{2}\d+)?)(H\d*)?([+-]\d+|\++|-+)?(?::\d+)?$/.exec(inner);
  if (!match) throw new SmilesMistake(`[${inner}] at ${at(start)} can't be read. Inside square brackets, write the element, then any hydrogens, then the charge, like [NH4+] or [O-].`, start, close + 1);
  const raw = match[2];
  const aromatic = raw === raw.toLowerCase();
  const element = aromatic ? titleCase(raw) : raw;
  if (!ELEMENTS.has(element)) throw new SmilesMistake(`${raw} at ${at(start + 1)} isn't an element.`, start, close + 1);
  const hydrogens = match[4] ? Number(match[4].slice(1) || 1) : 0;
  const signs = match[5] ?? '';
  let charge = 0;
  if (/^[+-]\d+$/.test(signs)) charge = Number(signs);
  else if (signs) charge = signs.length * (signs[0] === '+' ? 1 : -1);
  return { atom: { element, aromatic, bracket: true, charge, hydrogens, start, end: close + 1, written: hydrogens }, next: close + 1 };
}

function readPlain(text: string, i: number): { atom: ReadAtom & { written: number | null }; next: number } {
  const two = text.slice(i, i + 2);
  const one = text[i];
  if (two === 'Cl' || two === 'Br') return { atom: { element: two, aromatic: false, bracket: false, charge: 0, hydrogens: 0, start: i, end: i + 2, written: null }, next: i + 2 };
  // Sc and Cn can be an atom then an aromatic atom, but Na can't be read any way except sodium.
  if (ELEMENTS.has(two) && !AROMATIC.has(two[1] ?? '') && /[a-z]/.test(two[1] ?? '')) throw new SmilesMistake(`${two} at ${at(i)} has to go in square brackets, like [${two}].`, i, i + 2);
  if (ORGANIC.has(one)) return { atom: { element: one, aromatic: false, bracket: false, charge: 0, hydrogens: 0, start: i, end: i + 1, written: null }, next: i + 1 };
  if (AROMATIC.has(one)) {
    if (two === 'cl' || two === 'br') throw new SmilesMistake(`${titleCase(two)} is written with a capital: ${titleCase(two)}, at ${at(i)}.`, i, i + 2);
    return { atom: { element: one.toUpperCase(), aromatic: true, bracket: false, charge: 0, hydrogens: 0, start: i, end: i + 1, written: null }, next: i + 1 };
  }
  if (one === 'H') throw new SmilesMistake(`Leave hydrogens out at ${at(i)}: SMILES adds them for you. If you really need one, write [H].`, i, i + 1);
  const word = /^[A-Z][a-z]?/.exec(text.slice(i))?.[0];
  if (word && ELEMENTS.has(word)) throw new SmilesMistake(`${word} at ${at(i)} has to go in square brackets, like [${word}].`, i, i + word.length);
  throw new SmilesMistake(`${one} at ${at(i)} isn't part of SMILES.`, i, i + 1);
}

/** Reads one compound between `start` and `end`, which holds no dots. */
function readFragment(text: string, start: number, end: number): ReadMolecule {
  const draft: Draft = { atoms: [], bonds: [] };
  const stack: { atom: number; position: number }[] = [];
  const rings = new Map<string, { atom: number; order: number | null; position: number; length: number }>();
  let previous = -1;
  let pending: { order: number; position: number; symbol: string } | null = null;
  let i = start;

  const addAtom = (atom: ReadAtom & { written: number | null }) => {
    draft.atoms.push(atom);
    const index = draft.atoms.length - 1;
    if (previous >= 0) {
      draft.bonds.push({ a: previous, b: index, order: pending?.order ?? 1, written: pending !== null });
    } else if (pending) {
      throw new SmilesMistake(`The ${pending.symbol} at ${at(pending.position)} needs an atom before it.`, pending.position, pending.position + 1);
    }
    pending = null;
    previous = index;
  };

  while (i < end) {
    const c = text[i];
    if (c === '(') {
      if (previous < 0) throw new SmilesMistake(`A branch can't come first, at ${at(i)}. Start with the atom it hangs from.`, i, i + 1);
      if (pending) throw new SmilesMistake(`The ${(pending as { symbol: string }).symbol} at ${at((pending as { position: number }).position)} goes after the bracket, not before it.`, (pending as { position: number }).position, (pending as { position: number }).position + 1);
      if (text[i + 1] === ')') throw new SmilesMistake(`The brackets at ${at(i)} are empty. Put the branch inside them.`, i, i + 2);
      stack.push({ atom: previous, position: i });
      i++;
    } else if (c === ')') {
      if (pending) throw new SmilesMistake(`The ${(pending as { symbol: string }).symbol} at ${at((pending as { position: number }).position)} has no atom after it.`, (pending as { position: number }).position, (pending as { position: number }).position + 1);
      const open = stack.pop();
      if (!open) throw new SmilesMistake(`Unmatched bracket at ${at(i)}. There's a ) with no ( before it.`, i, i + 1);
      previous = open.atom;
      i++;
    } else if (c in BONDS) {
      if (previous < 0) throw new SmilesMistake(`The ${c} at ${at(i)} needs an atom before it.`, i, i + 1);
      if (pending) throw new SmilesMistake(`Two bond symbols in a row at ${at(i)}. Use just one.`, i, i + 1);
      pending = { order: BONDS[c], position: i, symbol: c };
      i++;
    } else if (/\d/.test(c) || c === '%') {
      let label: string;
      let length: number;
      if (c === '%') {
        const digits = /^\d\d/.exec(text.slice(i + 1, end));
        if (!digits) throw new SmilesMistake(`After the % at ${at(i)}, write a two-digit ring number, like %10.`, i, i + 1);
        label = String(Number(digits[0]));
        length = 3;
      } else {
        label = c;
        length = 1;
      }
      if (previous < 0) throw new SmilesMistake(`Ring number ${label} at ${at(i)} needs an atom before it.`, i, i + length);
      const open = rings.get(label);
      const written = (pending as { order: number } | null)?.order ?? null;
      if (open) {
        if (open.atom === previous) throw new SmilesMistake(`Ring ${label} opens and closes on the same atom, at ${at(i)}. Put the atoms of the ring between the two numbers.`, i, i + length);
        if (draft.bonds.some((b) => (b.a === previous && b.b === open.atom) || (b.b === previous && b.a === open.atom))) {
          throw new SmilesMistake(`Ring ${label} joins two atoms that are already bonded, at ${at(i)}. A ring needs at least three atoms.`, i, i + length);
        }
        const order = written ?? open.order;
        if (written !== null && open.order !== null && written !== open.order) throw new SmilesMistake(`The two ends of ring ${label} disagree about the bond, at ${at(i)}. Give it once, at either end.`, i, i + length);
        draft.bonds.push({ a: open.atom, b: previous, order: order ?? 1, written: order !== null });
        rings.delete(label);
      } else {
        rings.set(label, { atom: previous, order: written, position: i, length });
      }
      pending = null;
      i += length;
    } else if (c === '[') {
      const { atom, next } = readBracket(text, i);
      addAtom(atom);
      i = next;
    } else if (c === ']') {
      throw new SmilesMistake(`Unmatched square bracket at ${at(i)}. There's a ] with no [ before it.`, i, i + 1);
    } else if (/\s/.test(c)) {
      throw new SmilesMistake(`SMILES has no spaces in it. There's one at ${at(i)}.`, i, i + 1);
    } else {
      const { atom, next } = readPlain(text, i);
      addAtom(atom);
      i = next;
    }
  }
  if (pending) throw new SmilesMistake(`The ${(pending as { symbol: string }).symbol} at ${at((pending as { position: number }).position)} has no atom after it.`, (pending as { position: number }).position, (pending as { position: number }).position + 1);
  const open = stack[stack.length - 1];
  if (open) throw new SmilesMistake(`The bracket at ${at(open.position)} is never closed.`, open.position, open.position + 1);
  const ring = [...rings.entries()][0];
  if (ring) throw new SmilesMistake(`Ring ${ring[0]} is opened at ${at(ring[1].position)} but never closed. Write ${ring[0]} again on the atom that closes it.`, ring[1].position, ring[1].position + ring[1].length);
  if (!draft.atoms.length) throw new SmilesMistake(`There's no atom at ${at(start)}.`, start, start + 1);
  return finishMolecule(draft, text, start, end);
}

function readSide(text: string, start: number, end: number): ReadMolecule[] {
  const out: ReadMolecule[] = [];
  let from = start;
  for (let i = start; i <= end; i++) {
    if (i === end || text[i] === '.') {
      if (i === from) throw new SmilesMistake(`Something is missing at ${at(i)}. A dot needs a compound on each side of it.`, i, Math.min(i + 1, text.length));
      out.push(readFragment(text, from, i));
      from = i + 1;
    }
  }
  return out;
}

/** Reads a compound, or a reaction written reactants>>products, with parts separated by dots. Throws SmilesMistake. */
export function readSmiles(source: string): ReadStructure {
  const text = source;
  if (!text.trim()) throw new SmilesMistake('Nothing to read yet.', 0, 0);
  const first = text.indexOf('>>');
  if (first >= 0) {
    const second = text.indexOf('>>', first + 2);
    if (second >= 0) throw new SmilesMistake(`A reaction has one >>, between reactants and products. There's another at ${at(second)}.`, second, second + 2);
    if (first === 0) throw new SmilesMistake('A reaction needs compounds before the >>.', 0, 2);
    if (first + 2 >= text.length) throw new SmilesMistake('A reaction needs compounds after the >>.', first, first + 2);
    return { reactants: readSide(text, 0, first), products: readSide(text, first + 2, text.length), isReaction: true };
  }
  const single = text.indexOf('>');
  if (single >= 0) throw new SmilesMistake(`A reaction arrow is two signs, >>. There's just one at ${at(single)}.`, single, single + 1);
  return { reactants: readSide(text, 0, text.length), products: [], isReaction: false };
}

/** The atom the cursor is on, or just after. */
export function atomAtCursor(structure: ReadStructure, cursor: number): { molecule: ReadMolecule; atom: number } | null {
  for (const molecule of [...structure.reactants, ...structure.products]) {
    if (cursor < molecule.start || cursor > molecule.end) continue;
    const on = molecule.atoms.findIndex((a) => cursor >= a.start && cursor < a.end);
    if (on >= 0) return { molecule, atom: on };
    const before = molecule.atoms.reduce((best, a, i) => (a.end <= cursor ? i : best), -1);
    if (before >= 0) return { molecule, atom: before };
  }
  return null;
}

// ---- Same compound?

interface Plain {
  element: string;
  charge: number;
  hydrogens: number;
}

/** Hydrogens as counts, and nitro in its charged form, so the same compound written differently looks the same. */
function normalise(molecule: ReadMolecule): { atoms: Plain[]; neighbours: number[][] } {
  const keep = molecule.atoms.map((a, i) => a.element !== 'H' || molecule.atoms.length === 1 || molecule.bonds.filter((b) => b.a === i || b.b === i).some((b) => molecule.atoms[b.a === i ? b.b : b.a].element === 'H'));
  const atoms: Plain[] = molecule.atoms.map((a) => ({ element: a.element, charge: a.charge, hydrogens: a.hydrogens }));
  for (const b of molecule.bonds) {
    if (!keep[b.a] && keep[b.b]) atoms[b.b].hydrogens++;
    if (!keep[b.b] && keep[b.a]) atoms[b.a].hydrogens++;
  }
  // N(=O)=O is [N+](=O)[O-] written the old way.
  molecule.atoms.forEach((a, i) => {
    if (a.element !== 'N' || a.charge !== 0) return;
    const doubledOxygens = molecule.bonds.filter((b) => (b.a === i || b.b === i) && b.order === 2 && molecule.atoms[b.a === i ? b.b : b.a].element === 'O');
    if (doubledOxygens.length !== 2) return;
    atoms[i].charge = 1;
    const oxygen = doubledOxygens[0].a === i ? doubledOxygens[0].b : doubledOxygens[0].a;
    atoms[oxygen].charge = -1;
  });
  const indices = molecule.atoms.flatMap((_, i) => (keep[i] ? [i] : []));
  const newIndex = new Map(indices.map((old, i) => [old, i]));
  const neighbours = indices.map(() => [] as number[]);
  for (const b of molecule.bonds) {
    const a = newIndex.get(b.a);
    const c = newIndex.get(b.b);
    if (a !== undefined && c !== undefined) {
      neighbours[a].push(c);
      neighbours[c].push(a);
    }
  }
  return { atoms: indices.map((i) => atoms[i]), neighbours };
}

function colours(atoms: Plain[], neighbours: number[][]): string[] {
  let colour = atoms.map((a, i) => `${a.element}|${a.charge}|${a.hydrogens}|${neighbours[i].length}`);
  for (let round = 0; round < atoms.length; round++) {
    const next = colour.map((c, i) => `${c}(${neighbours[i].map((n) => colour[n]).sort().join(',')})`);
    // Shortened to stop the text growing on large molecules. A clash is settled by the search below.
    colour = next.map(shortHash);
  }
  return colour;
}

function shortHash(text: string): string {
  let h = 5381;
  let g = 52711;
  for (let i = 0; i < text.length; i++) {
    h = (Math.imul(h, 33) ^ text.charCodeAt(i)) >>> 0;
    g = (Math.imul(g, 31) ^ text.charCodeAt(i)) >>> 0;
  }
  return `${h.toString(36)}${g.toString(36)}`;
}

/** The same atoms joined the same way, whichever way it was written and whichever Kekulé form it was. Stereochemistry is ignored. */
export function sameMolecule(a: ReadMolecule, b: ReadMolecule): boolean {
  const left = normalise(a);
  const right = normalise(b);
  if (left.atoms.length !== right.atoms.length) return false;
  const leftColour = colours(left.atoms, left.neighbours);
  const rightColour = colours(right.atoms, right.neighbours);
  if ([...leftColour].sort().join() !== [...rightColour].sort().join()) return false;
  const size = left.atoms.length;
  const map = new Array<number>(size).fill(-1);
  const used = new Set<number>();
  // Follow the bonds outward, so each choice is checked against what's already placed.
  const order: number[] = [];
  const seen = new Set<number>();
  for (let s = 0; s < size; s++) {
    if (seen.has(s)) continue;
    const queue = [s];
    seen.add(s);
    while (queue.length) {
      const x = queue.shift()!;
      order.push(x);
      for (const n of left.neighbours[x]) {
        if (!seen.has(n)) {
          seen.add(n);
          queue.push(n);
        }
      }
    }
  }
  let budget = 500_000;
  const place = (k: number): boolean => {
    if (k === size) return true;
    if (--budget < 0) return false;
    const atom = order[k];
    for (let candidate = 0; candidate < size; candidate++) {
      if (used.has(candidate) || leftColour[atom] !== rightColour[candidate]) continue;
      const fits = left.neighbours[atom].every((n) => map[n] < 0 || right.neighbours[candidate].includes(map[n]));
      if (!fits) continue;
      map[atom] = candidate;
      used.add(candidate);
      if (place(k + 1)) return true;
      map[atom] = -1;
      used.delete(candidate);
    }
    return false;
  };
  return place(0);
}

/** True when two pieces of SMILES mean the same compounds, in any order. Unreadable text is never the same. */
export function sameSmiles(one: string, other: string): boolean {
  try {
    const a = readSmiles(one);
    const b = readSmiles(other);
    if (a.isReaction !== b.isReaction) return false;
    return sameSet(a.reactants, b.reactants) && sameSet(a.products, b.products);
  } catch {
    return false;
  }
}

function sameSet(a: ReadMolecule[], b: ReadMolecule[]): boolean {
  if (a.length !== b.length) return false;
  const left = [...b];
  return a.every((m) => {
    const hit = left.findIndex((n) => sameMolecule(m, n));
    if (hit < 0) return false;
    left.splice(hit, 1);
    return true;
  });
}
