// A structure described as data: atoms at positions, bonds, lone pairs and charges. Skeletal structures
// still come from SMILES. These are for where the electrons are the point. check.ts verifies each one.
export type ShapeName = 'linear' | 'trigonal planar' | 'bent' | 'tetrahedral' | 'trigonal pyramidal' | 'trigonal bipyramidal' | 'see-saw' | 'T-shaped' | 'octahedral' | 'square pyramidal' | 'square planar';

export interface LewisAtom {
  /** An element symbol, or a group from GROUPS such as CH3, drawn as one label. */
  el: string;
  x: number;
  y: number;
  /** Lone pairs. */
  lp?: number;
  /** Where to draw them, in degrees anticlockwise from east. Worked out from the bonds if left out. */
  lpAt?: number[];
  /** Formal charge. */
  charge?: number;
  /** Counted but not printed, as for ligands inside a bracketed complex ion. */
  quietCharge?: 1;
  /** One unpaired electron. */
  radical?: 1;
  /** Non-bonding d electrons, on a metal. */
  d?: number;
  /** How the label reads, where the attached atom must come first: H3N rather than NH3. */
  label?: string;
  /** No label, for carbon in a ring drawn the skeletal way. */
  hide?: 1;
  /** This lone pair is what the structure is about, so it stands out. */
  mark?: 1;
}

export interface LewisBond {
  a: number;
  b: number;
  order?: 1 | 2 | 3;
  /** A wedge or dash runs from a to b. A dative arrow points from the donor a to the acceptor b. */
  style?: 'wedge' | 'dash' | 'dative' | 'hbond';
}

export interface LewisMolecule {
  id: string;
  name: string;
  /** As written, such as H2O or [Co(NH3)6]3+. Used to check the atoms. */
  formula: string;
  charge: number;
  atoms: LewisAtom[];
  bonds: LewisBond[];
  /** The index of the central atom, where the shape is about one atom. */
  central?: number;
  shape?: ShapeName;
  /** Hybridisation of the central atom. */
  hyb?: string;
  /** The octet exceptions this structure is allowed, by atom index. */
  exceptions?: Record<number, 'deficient' | 'expanded' | 'odd'>;
  /** A carbon radical's odd electron sits in a p orbital, so it isn't a VSEPR domain. */
  oddInP?: 1;
  /** Lone pairs are counted but not drawn, unless marked, since here they would only be clutter. */
  quietPairs?: 1;
  /** Draws a bracket round an ion, with its charge outside. */
  bracket?: 1;
  /** Replaces the generated part of the description. */
  note?: string;
}

/** One or more drawings shown together. Several forms of one species are resonance structures. */
export interface LewisFigure {
  id: string;
  name: string;
  forms: LewisMolecule[];
  resonance?: 1;
}

export type LewisFigures = Record<string, LewisFigure>;
