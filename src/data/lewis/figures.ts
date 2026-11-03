// Every structure with lone pairs, described as data. Most are built from the VSEPR templates below, so
// that a molecule's drawing follows from its shape. tests/unit/lewis.test.ts checks each with check.ts.
import type { LewisAtom, LewisBond, LewisFigure, LewisFigures, LewisMolecule, ShapeName } from './types';

const L = 44;

interface Spot {
  at: number;
  style?: 'wedge' | 'dash';
}

interface Template {
  shape: ShapeName;
  spots: Spot[];
  lpAt: number[];
}

const TEMPLATES = {
  linear: { shape: 'linear', spots: [{ at: 180 }, { at: 0 }], lpAt: [] },
  planar: { shape: 'trigonal planar', spots: [{ at: 90 }, { at: 210 }, { at: 330 }], lpAt: [] },
  bent3: { shape: 'bent', spots: [{ at: 210 }, { at: 330 }], lpAt: [90] },
  tetra: { shape: 'tetrahedral', spots: [{ at: 125 }, { at: 55 }, { at: 235, style: 'wedge' }, { at: 305, style: 'dash' }], lpAt: [] },
  pyramid: { shape: 'trigonal pyramidal', spots: [{ at: 215 }, { at: 270, style: 'wedge' }, { at: 325, style: 'dash' }], lpAt: [90] },
  bent4: { shape: 'bent', spots: [{ at: 218 }, { at: 322 }], lpAt: [60, 120] },
  tbp: { shape: 'trigonal bipyramidal', spots: [{ at: 90 }, { at: 270 }, { at: 0 }, { at: 210, style: 'wedge' }, { at: 150, style: 'dash' }], lpAt: [] },
  seesaw: { shape: 'see-saw', spots: [{ at: 90 }, { at: 270 }, { at: 210, style: 'wedge' }, { at: 150, style: 'dash' }], lpAt: [0] },
  tee: { shape: 'T-shaped', spots: [{ at: 90 }, { at: 270 }, { at: 180 }], lpAt: [35, 325] },
  linear3: { shape: 'linear', spots: [{ at: 180 }, { at: 0 }], lpAt: [90, 225, 315] },
  octa: { shape: 'octahedral', spots: [{ at: 90 }, { at: 270 }, { at: 30, style: 'dash' }, { at: 150, style: 'dash' }, { at: 210, style: 'wedge' }, { at: 330, style: 'wedge' }], lpAt: [] },
  sqpyr: { shape: 'square pyramidal', spots: [{ at: 90 }, { at: 30, style: 'dash' }, { at: 150, style: 'dash' }, { at: 210, style: 'wedge' }, { at: 330, style: 'wedge' }], lpAt: [270] },
  sqplanar: { shape: 'square planar', spots: [{ at: 135 }, { at: 45 }, { at: 225 }, { at: 315 }], lpAt: [0, 180] },
} satisfies Record<string, Template>;

/** Labels whose attached atom must come first when the group sits to the left. */
const FLIPPED: Record<string, string> = { NH3: 'H3N', H2O: 'H2O', CH3: 'H3C', OH: 'HO', CN: 'NC', C2H5: 'H5C2' };
const FACING_RIGHT: Record<string, string> = { H2O: 'OH2' };

interface Ligand {
  el: string;
  order?: 1 | 2 | 3;
  lp?: number;
  charge?: number;
  quietCharge?: 1;
  /** The ligand gives a pair to the centre. */
  donates?: 1;
  /** The centre gives a pair to the ligand. */
  accepts?: 1;
  mark?: 1;
}

interface Centre {
  el: string;
  lp?: number;
  charge?: number;
  radical?: 1;
  d?: number;
  mark?: 1;
  quietCharge?: 1;
}

interface Extra {
  hyb?: string;
  exceptions?: LewisMolecule['exceptions'];
  oddInP?: 1;
  quietPairs?: 1;
  bracket?: 1;
  note?: string;
  /** Keeps the bonds of a shape in the plane, as a Lewis structure rather than a shape diagram. */
}

const H: Ligand = { el: 'H' };

/** A central atom with everything around it placed by a shape template. */
function star(id: string, name: string, formula: string, charge: number, centre: Centre, template: Template, ligands: Ligand[], extra: Extra = {}): LewisMolecule {
  if (ligands.length !== template.spots.length) throw new Error(`${id}: ${ligands.length} ligands for ${template.spots.length} places`);
  const atoms: LewisAtom[] = [{ ...centre, x: 0, y: 0, lpAt: centre.lp ? template.lpAt.slice(0, centre.lp) : undefined }];
  const bonds: LewisBond[] = [];
  ligands.forEach((ligand, i) => {
    const spot = template.spots[i];
    const rad = (spot.at * Math.PI) / 180;
    const x = Math.round(Math.cos(rad) * L * 100) / 100;
    const y = Math.round(-Math.sin(rad) * L * 100) / 100;
    const label = x < -1 ? FLIPPED[ligand.el] : x > 1 ? FACING_RIGHT[ligand.el] : undefined;
    atoms.push({ el: ligand.el, x, y, lp: ligand.lp, charge: ligand.charge, quietCharge: ligand.quietCharge, mark: ligand.mark, label });
    if (ligand.donates) bonds.push({ a: i + 1, b: 0, style: 'dative' });
    else if (ligand.accepts) bonds.push({ a: 0, b: i + 1, style: 'dative' });
    else bonds.push({ a: 0, b: i + 1, order: ligand.order, style: spot.style });
  });
  // A single atom or a pair has no shape to speak of.
  const shaped = ligands.length >= 2 ? { central: 0, shape: template.shape } : {};
  return { id, name, formula, charge, atoms, bonds, ...shaped, ...extra };
}

const F: Ligand = { el: 'F', lp: 3 };
const Cl: Ligand = { el: 'Cl', lp: 3 };
const O2: Ligand = { el: 'O', order: 2, lp: 2 };
const Ominus: Ligand = { el: 'O', lp: 3, charge: -1 };
const CH3: Ligand = { el: 'CH3' };
const R: Ligand = { el: 'R' };

/** Two atoms in a line. */
function pair(id: string, name: string, formula: string, charge: number, a: Partial<LewisAtom> & { el: string }, b: Partial<LewisAtom> & { el: string }, order: 1 | 2 | 3 = 1, extra: Extra = {}): LewisMolecule {
  return { id, name, formula, charge, atoms: [{ ...a, x: 0, y: 0 }, { ...b, x: L, y: 0 }], bonds: [{ a: 0, b: 1, order }], ...extra };
}

const molecules: LewisMolecule[] = [
  // Simple molecules and shapes
  star('water', 'Water', 'H2O', 0, { el: 'O', lp: 2 }, TEMPLATES.bent4, [H, H], { hyb: 'sp3' }),
  star('ammonia', 'Ammonia', 'NH3', 0, { el: 'N', lp: 1 }, TEMPLATES.pyramid, [H, H, H], { hyb: 'sp3' }),
  star('methane', 'Methane', 'CH4', 0, { el: 'C' }, TEMPLATES.tetra, [H, H, H, H], { hyb: 'sp3' }),
  pair('hf', 'Hydrogen fluoride', 'HF', 0, { el: 'H' }, { el: 'F', lp: 3 }),
  star('co2', 'Carbon dioxide', 'CO2', 0, { el: 'C' }, TEMPLATES.linear, [O2, O2], { hyb: 'sp' }),
  star('hcn', 'Hydrogen cyanide', 'HCN', 0, { el: 'C' }, TEMPLATES.linear, [H, { el: 'N', order: 3, lp: 1 }], { hyb: 'sp' }),
  pair('n2', 'Nitrogen', 'N2', 0, { el: 'N', lp: 1 }, { el: 'N', lp: 1 }, 3),
  star('becl2', 'Beryllium chloride', 'BeCl2', 0, { el: 'Be' }, TEMPLATES.linear, [Cl, Cl], { hyb: 'sp', exceptions: { 0: 'deficient' } }),
  star('bf3', 'Boron trifluoride', 'BF3', 0, { el: 'B' }, TEMPLATES.planar, [F, F, F], { hyb: 'sp2', exceptions: { 0: 'deficient' } }),
  star('alcl3', 'Aluminium chloride', 'AlCl3', 0, { el: 'Al' }, TEMPLATES.planar, [Cl, Cl, Cl], { hyb: 'sp2', exceptions: { 0: 'deficient' } }),
  star('pcl5', 'Phosphorus pentachloride', 'PCl5', 0, { el: 'P' }, TEMPLATES.tbp, [Cl, Cl, Cl, Cl, Cl], { hyb: 'sp3d', exceptions: { 0: 'expanded' } }),
  star('sf4', 'Sulphur tetrafluoride', 'SF4', 0, { el: 'S', lp: 1 }, TEMPLATES.seesaw, [F, F, F, F], { hyb: 'sp3d', exceptions: { 0: 'expanded' } }),
  star('clf3', 'Chlorine trifluoride', 'ClF3', 0, { el: 'Cl', lp: 2 }, TEMPLATES.tee, [F, F, F], { hyb: 'sp3d', exceptions: { 0: 'expanded' } }),
  star('sf6', 'Sulphur hexafluoride', 'SF6', 0, { el: 'S' }, TEMPLATES.octa, [F, F, F, F, F, F], { hyb: 'sp3d2', exceptions: { 0: 'expanded' } }),
  star('brf5', 'Bromine pentafluoride', 'BrF5', 0, { el: 'Br', lp: 1 }, TEMPLATES.sqpyr, [F, F, F, F, F], { hyb: 'sp3d2', exceptions: { 0: 'expanded' } }),
  star('i3', 'Triiodide ion', 'I3-', -1, { el: 'I', lp: 3, charge: -1 }, TEMPLATES.linear3, [{ el: 'I', lp: 3 }, { el: 'I', lp: 3 }], { hyb: 'sp3d', exceptions: { 0: 'expanded' } }),
  star('icl2', 'Dichloroiodate(I) ion', 'ICl2-', -1, { el: 'I', lp: 3, charge: -1 }, TEMPLATES.linear3, [Cl, Cl], { hyb: 'sp3d', exceptions: { 0: 'expanded' } }),
  star('icl4', 'Tetrachloroiodate(III) ion', 'ICl4-', -1, { el: 'I', lp: 2, charge: -1 }, TEMPLATES.sqplanar, [Cl, Cl, Cl, Cl], { hyb: 'sp3d2', exceptions: { 0: 'expanded' } }),
  star('so2', 'Sulphur dioxide', 'SO2', 0, { el: 'S', lp: 1 }, TEMPLATES.bent3, [O2, O2], { hyb: 'sp2', exceptions: { 0: 'expanded' } }),
  star('sulphate', 'Sulphate ion', 'SO42-', -2, { el: 'S' }, TEMPLATES.tetra, [O2, O2, Ominus, Ominus], { hyb: 'sp3', exceptions: { 0: 'expanded' } }),
  star('nitrite', 'Nitrite ion', 'NO2-', -1, { el: 'N', lp: 1, mark: 1 }, TEMPLATES.bent3, [O2, { ...Ominus, mark: 1 }], { hyb: 'sp2', note: 'it can bond through nitrogen or through oxygen' }),

  // Odd-electron molecules
  pair('no', 'Nitric oxide', 'NO', 0, { el: 'N', lp: 1, radical: 1 }, { el: 'O', lp: 2 }, 2, { exceptions: { 0: 'odd' } }),
  star('no2', 'Nitrogen dioxide', 'NO2', 0, { el: 'N', radical: 1, charge: 1 }, TEMPLATES.bent3, [O2, Ominus], { hyb: 'sp2', exceptions: { 0: 'odd' } }),

  // Formal charge and coordinate bonds
  star('ammonium', 'Ammonium ion', 'NH4+', 1, { el: 'N', charge: 1 }, TEMPLATES.tetra, [H, H, H, H], { hyb: 'sp3' }),
  star('ammonium-dative', 'Ammonium ion, with its coordinate bond', 'NH4+', 1, { el: 'N' }, TEMPLATES.tetra, [H, H, H, { el: 'H', accepts: 1, charge: 1, quietCharge: 1 }], { hyb: 'sp3', bracket: 1, note: 'the nitrogen gives its lone pair to H⁺' }),
  star('hydronium', 'Hydronium ion', 'H3O+', 1, { el: 'O', lp: 1 }, TEMPLATES.pyramid, [H, H, { el: 'H', accepts: 1, charge: 1, quietCharge: 1 }], { hyb: 'sp3', bracket: 1, note: 'the oxygen gives one lone pair to H⁺' }),
  star('hydroxide', 'Hydroxide ion', 'OH-', -1, { el: 'O', lp: 3, charge: -1, mark: 1 }, { shape: 'linear', spots: [{ at: 0 }], lpAt: [] }, [H]),
  star('chloride', 'Chloride ion', 'Cl-', -1, { el: 'Cl', lp: 4, charge: -1, mark: 1 }, { shape: 'linear', spots: [], lpAt: [] }, []),
  star('cl-radical', 'Chlorine atom', 'Cl', 0, { el: 'Cl', lp: 3, radical: 1 }, { shape: 'linear', spots: [], lpAt: [] }, [], { exceptions: { 0: 'odd' } }),
  {
    id: 'nh3-bf3',
    name: 'Ammonia-boron trifluoride adduct',
    formula: 'NH3BF3',
    charge: 0,
    atoms: [
      { el: 'N', x: 0, y: 0 },
      { el: 'H', x: -38, y: -22 },
      { el: 'H', x: -38, y: 22 },
      { el: 'H', x: 0, y: -44 },
      { el: 'B', x: 50, y: 0 },
      { el: 'F', x: 88, y: -22, lp: 3 },
      { el: 'F', x: 88, y: 22, lp: 3 },
      { el: 'F', x: 50, y: 44, lp: 3 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4, style: 'dative' }, { a: 4, b: 5 }, { a: 4, b: 6 }, { a: 4, b: 7 }],
    note: 'the nitrogen gives its lone pair to the electron-deficient boron',
  },
  {
    id: 'ozone-dative',
    name: 'Ozone, with its coordinate bond',
    formula: 'O3',
    charge: 0,
    atoms: [{ el: 'O', x: 0, y: 0, lp: 1 }, { el: 'O', x: -38, y: 22, lp: 2 }, { el: 'O', x: 38, y: 22, lp: 3 }],
    bonds: [{ a: 0, b: 1, order: 2 }, { a: 0, b: 2, style: 'dative' }],
    central: 0,
    shape: 'bent',
    hyb: 'sp2',
  },
  {
    id: 'hno3',
    name: 'Nitric acid',
    formula: 'HNO3',
    charge: 0,
    atoms: [{ el: 'N', x: 0, y: 0 }, { el: 'O', x: -38, y: 22, lp: 2 }, { el: 'H', x: -76, y: 0 }, { el: 'O', x: 0, y: -44, lp: 2 }, { el: 'O', x: 38, y: 22, lp: 3 }],
    bonds: [{ a: 0, b: 1 }, { a: 1, b: 2 }, { a: 0, b: 3, order: 2 }, { a: 0, b: 4, style: 'dative' }],
    central: 0,
    shape: 'trigonal planar',
    hyb: 'sp2',
  },

  // Organic intermediates
  star('methyl-cation', 'Methyl carbocation', 'CH3+', 1, { el: 'C', charge: 1 }, TEMPLATES.planar, [H, H, H], { hyb: 'sp2', exceptions: { 0: 'deficient' } }),
  star('methyl-radical', 'Methyl free radical', 'CH3', 0, { el: 'C', radical: 1 }, TEMPLATES.planar, [H, H, H], { hyb: 'sp2', exceptions: { 0: 'odd' }, oddInP: 1 }),
  star('methyl-anion', 'Methyl carbanion', 'CH3-', -1, { el: 'C', lp: 1, charge: -1, mark: 1 }, TEMPLATES.pyramid, [H, H, H], { hyb: 'sp3' }),
  star('tert-butyl-cation', 'tert-Butyl carbocation', 'C4H9+', 1, { el: 'C', charge: 1 }, TEMPLATES.planar, [CH3, CH3, CH3], { hyb: 'sp2', exceptions: { 0: 'deficient' } }),
  star('isopropyl-cation', 'Isopropyl carbocation', 'C3H7+', 1, { el: 'C', charge: 1 }, TEMPLATES.planar, [H, CH3, CH3], { hyb: 'sp2', exceptions: { 0: 'deficient' } }),
  star('ethyl-cation', 'Ethyl carbocation', 'C2H5+', 1, { el: 'C', charge: 1 }, TEMPLATES.planar, [CH3, H, H], { hyb: 'sp2', exceptions: { 0: 'deficient' } }),
  star('tert-butyl-radical', 'tert-Butyl free radical', 'C4H9', 0, { el: 'C', radical: 1 }, TEMPLATES.planar, [CH3, CH3, CH3], { hyb: 'sp2', exceptions: { 0: 'odd' }, oddInP: 1 }),
  star('nitronium', 'Nitronium ion', 'NO2+', 1, { el: 'N', charge: 1 }, TEMPLATES.linear, [O2, O2], { hyb: 'sp' }),
  pair('cyanide', 'Cyanide ion', 'CN-', -1, { el: 'C', lp: 1, charge: -1, mark: 1 }, { el: 'N', lp: 1 }, 3),

  // Lone pairs that decide basicity and hydrogen bonding
  star('methylamine', 'Methylamine', 'CH5N', 0, { el: 'N', lp: 1, mark: 1 }, TEMPLATES.pyramid, [CH3, H, H], { hyb: 'sp3' }),
  star('dimethylamine', 'Dimethylamine', 'C2H7N', 0, { el: 'N', lp: 1, mark: 1 }, TEMPLATES.pyramid, [CH3, H, CH3], { hyb: 'sp3' }),
  star('trimethylamine', 'Trimethylamine', 'C3H9N', 0, { el: 'N', lp: 1, mark: 1 }, TEMPLATES.pyramid, [CH3, CH3, CH3], { hyb: 'sp3' }),
  star('aniline-pair', 'Aniline', 'C6H7N', 0, { el: 'N', lp: 1, mark: 1 }, TEMPLATES.pyramid, [{ el: 'C6H5' }, H, H], { hyb: 'sp3', note: 'the lone pair on nitrogen is drawn into the ring, so it is less available' }),
  star('methanol', 'Methanol', 'CH4O', 0, { el: 'O', lp: 2, mark: 1 }, TEMPLATES.bent4, [CH3, H], { hyb: 'sp3' }),
  star('ethanol', 'Ethanol', 'C2H6O', 0, { el: 'O', lp: 2, mark: 1 }, TEMPLATES.bent4, [{ el: 'C2H5' }, H], { hyb: 'sp3' }),
  star('dimethyl-ether', 'Methoxymethane', 'C2H6O', 0, { el: 'O', lp: 2 }, TEMPLATES.bent4, [CH3, CH3], { hyb: 'sp3' }),

  // Functional groups, with lone pairs left out since they would only be clutter here
  star('fg-alcohol', 'Alcohol', 'RHO', 0, { el: 'O', lp: 2 }, TEMPLATES.bent4, [R, H], { quietPairs: 1 }),
  star('fg-ether', 'Ether', 'R2O', 0, { el: 'O', lp: 2 }, TEMPLATES.bent4, [R, R], { quietPairs: 1 }),
  star('fg-aldehyde', 'Aldehyde', 'RCHO', 0, { el: 'C' }, TEMPLATES.planar, [O2, R, H], { quietPairs: 1 }),
  star('fg-ketone', 'Ketone', 'R2CO', 0, { el: 'C' }, TEMPLATES.planar, [O2, R, R], { quietPairs: 1 }),
  star('fg-acid', 'Carboxylic acid', 'RCOOH', 0, { el: 'C' }, TEMPLATES.planar, [O2, R, { el: 'OH' }], { quietPairs: 1 }),
  star('fg-amine', 'Primary amine', 'RH2N', 0, { el: 'N', lp: 1 }, TEMPLATES.pyramid, [R, H, H], { quietPairs: 1 }),
  star('fg-nitrile', 'Nitrile', 'RCN', 0, { el: 'C' }, TEMPLATES.linear, [R, { el: 'N', order: 3, lp: 1 }], { quietPairs: 1 }),
  star('fg-nitro', 'Nitro compound', 'RNO2', 0, { el: 'N', charge: 1 }, TEMPLATES.planar, [R, O2, Ominus], { quietPairs: 1 }),

  // Ligands and their donor atoms
  star('ligand-ammonia', 'Ammonia, as a ligand', 'NH3', 0, { el: 'N', lp: 1, mark: 1 }, TEMPLATES.pyramid, [H, H, H], { note: 'monodentate, donating through nitrogen' }),
  star('ligand-water', 'Water, as a ligand', 'H2O', 0, { el: 'O', lp: 2, mark: 1 }, TEMPLATES.bent4, [H, H], { note: 'monodentate, donating through oxygen' }),
  pair('ligand-co', 'Carbon monoxide, as a ligand', 'CO', 0, { el: 'C', lp: 1, charge: -1, mark: 1 }, { el: 'O', lp: 1, charge: 1 }, 3, { note: 'donating through carbon' }),
  {
    id: 'ligand-en',
    name: 'Ethane-1,2-diamine',
    formula: 'C2H8N2',
    charge: 0,
    atoms: [
      { el: 'CH2', x: 0, y: 0 },
      { el: 'CH2', x: 44, y: 0 },
      { el: 'N', x: -38, y: 22, lp: 1, mark: 1 },
      { el: 'N', x: 82, y: 22, lp: 1, mark: 1 },
      { el: 'H', x: -76, y: 0 },
      { el: 'H', x: -38, y: 66 },
      { el: 'H', x: 120, y: 0 },
      { el: 'H', x: 82, y: 66 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 1, b: 3 }, { a: 2, b: 4 }, { a: 2, b: 5 }, { a: 3, b: 6 }, { a: 3, b: 7 }],
    note: 'bidentate, donating through both nitrogen atoms',
  },
  {
    id: 'ligand-ox',
    name: 'Oxalate ion',
    formula: 'C2O42-',
    charge: -2,
    atoms: [
      { el: 'C', x: 0, y: 0 },
      { el: 'C', x: 44, y: 0 },
      { el: 'O', x: -22, y: -38, lp: 2 },
      { el: 'O', x: 66, y: -38, lp: 2 },
      { el: 'O', x: -22, y: 38, lp: 3, charge: -1, mark: 1 },
      { el: 'O', x: 66, y: 38, lp: 3, charge: -1, mark: 1 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2, order: 2 }, { a: 1, b: 3, order: 2 }, { a: 0, b: 4 }, { a: 1, b: 5 }],
    note: 'bidentate, donating through two oxygen atoms',
  },
  {
    id: 'ligand-scn',
    name: 'Thiocyanate ion',
    formula: 'SCN-',
    charge: -1,
    atoms: [{ el: 'S', x: -44, y: 0, lp: 3, charge: -1, mark: 1 }, { el: 'C', x: 0, y: 0 }, { el: 'N', x: 44, y: 0, lp: 1, mark: 1 }],
    bonds: [{ a: 0, b: 1 }, { a: 1, b: 2, order: 3 }],
    note: 'ambidentate, bonding through sulphur or through nitrogen',
  },

  // Complexes
  star('co-ammine', 'Hexaamminecobalt(III) ion', '[Co(NH3)6]3+', 3, { el: 'Co', d: 6, charge: 3, quietCharge: 1 }, TEMPLATES.octa, Array<Ligand>(6).fill({ el: 'NH3', donates: 1 }), { hyb: 'd2sp3', bracket: 1, note: 'six ammonia ligands each donate a lone pair through nitrogen, low spin' }),
  star('fe-cyanide', 'Hexacyanidoferrate(II) ion', '[Fe(CN)6]4-', -4, { el: 'Fe', d: 6, charge: 2, quietCharge: 1 }, TEMPLATES.octa, Array<Ligand>(6).fill({ el: 'CN', donates: 1, charge: -1, quietCharge: 1 }), { hyb: 'd2sp3', bracket: 1, note: 'six cyanide ligands each donate a lone pair through carbon, low spin' }),
  star('fe-aqua', 'Hexaaquairon(II) ion', '[Fe(H2O)6]2+', 2, { el: 'Fe', d: 6, charge: 2, quietCharge: 1 }, TEMPLATES.octa, Array<Ligand>(6).fill({ el: 'H2O', donates: 1 }), { hyb: 'sp3d2', bracket: 1, note: 'six water ligands each donate a lone pair through oxygen, high spin' }),
  star('ni-cyanide', 'Tetracyanidonickelate(II) ion', '[Ni(CN)4]2-', -2, { el: 'Ni', d: 8, charge: 2, quietCharge: 1 }, { ...TEMPLATES.sqplanar, lpAt: [] }, Array<Ligand>(4).fill({ el: 'CN', donates: 1, charge: -1, quietCharge: 1 }), { hyb: 'dsp2', bracket: 1, note: 'four cyanide ligands donate through carbon' }),
  star('ni-chloride', 'Tetrachloridonickelate(II) ion', '[NiCl4]2-', -2, { el: 'Ni', d: 8, charge: 2, quietCharge: 1 }, TEMPLATES.tetra, Array<Ligand>(4).fill({ el: 'Cl', lp: 3, donates: 1, charge: -1, quietCharge: 1 }), { hyb: 'sp3', bracket: 1, note: 'four chloride ligands each donate a lone pair' }),
  star('cu-ammine', 'Tetraamminecopper(II) ion', '[Cu(NH3)4]2+', 2, { el: 'Cu', d: 9, charge: 2, quietCharge: 1 }, { ...TEMPLATES.sqplanar, lpAt: [] }, Array<Ligand>(4).fill({ el: 'NH3', donates: 1 }), { hyb: 'dsp2', bracket: 1, note: 'four ammonia ligands donate through nitrogen' }),
  star('zn-ammine', 'Tetraamminezinc(II) ion', '[Zn(NH3)4]2+', 2, { el: 'Zn', d: 10, charge: 2, quietCharge: 1 }, TEMPLATES.tetra, Array<Ligand>(4).fill({ el: 'NH3', donates: 1 }), { hyb: 'sp3', bracket: 1, note: 'four ammonia ligands donate through nitrogen' }),
  star('ag-ammine', 'Diamminesilver(I) ion', '[Ag(NH3)2]+', 1, { el: 'Ag', d: 10, charge: 1, quietCharge: 1 }, TEMPLATES.linear, Array<Ligand>(2).fill({ el: 'NH3', donates: 1 }), { hyb: 'sp', bracket: 1, note: 'two ammonia ligands donate through nitrogen' }),
  star('cisplatin', 'cis-Diamminedichloridoplatinum(II)', '[Pt(NH3)2Cl2]', 0, { el: 'Pt', d: 8, charge: 2, quietCharge: 1 }, { ...TEMPLATES.sqplanar, lpAt: [] }, [{ el: 'NH3', donates: 1 }, { el: 'NH3', donates: 1 }, { el: 'Cl', lp: 3, donates: 1, charge: -1, quietCharge: 1 }, { el: 'Cl', lp: 3, donates: 1, charge: -1, quietCharge: 1 }], { hyb: 'dsp2', note: 'like ligands side by side' }),
  star('transplatin', 'trans-Diamminedichloridoplatinum(II)', '[Pt(NH3)2Cl2]', 0, { el: 'Pt', d: 8, charge: 2, quietCharge: 1 }, { ...TEMPLATES.sqplanar, lpAt: [] }, [{ el: 'NH3', donates: 1 }, { el: 'Cl', lp: 3, donates: 1, charge: -1, quietCharge: 1 }, { el: 'Cl', lp: 3, donates: 1, charge: -1, quietCharge: 1 }, { el: 'NH3', donates: 1 }], { hyb: 'dsp2', note: 'like ligands opposite each other' }),
];

const O1lp = (charge?: number): Ligand => ({ el: 'O', lp: 3, charge });

/** The same atoms with the double bond moved: each resonance form of a species with one centre. */
function forms(id: string, name: string, formula: string, charge: number, centre: Centre, template: Template, doubleAt: number[], extra: Extra = {}): LewisMolecule[] {
  return doubleAt.map((d, i) =>
    star(
      `${id}-${i + 1}`,
      name,
      formula,
      charge,
      centre,
      template,
      template.spots.map((_, k) => (k === d ? O2 : O1lp(-1))),
      extra,
    ),
  );
}

function hexagon(id: string, starting: number): LewisMolecule {
  const atoms: LewisAtom[] = [];
  const bonds: LewisBond[] = [];
  for (let i = 0; i < 6; i++) {
    const rad = ((90 + 60 * i) * Math.PI) / 180;
    atoms.push({ el: 'CH', hide: 1, x: Math.round(Math.cos(rad) * L * 100) / 100, y: Math.round(-Math.sin(rad) * L * 100) / 100 });
    bonds.push({ a: i, b: (i + 1) % 6, order: (i + starting) % 2 === 0 ? 2 : 1 });
  }
  return { id, name: 'Benzene', formula: 'C6H6', charge: 0, atoms, bonds };
}

function allyl(id: string, doubleLeft: boolean): LewisMolecule {
  return {
    id,
    name: 'Allyl carbocation',
    formula: 'C3H5+',
    charge: 1,
    atoms: [{ el: 'CH2', x: -40, y: 18, charge: doubleLeft ? 0 : 1, label: 'H2C' }, { el: 'CH', x: 0, y: 0 }, { el: 'CH2', x: 40, y: 18, charge: doubleLeft ? 1 : 0 }],
    bonds: [{ a: 0, b: 1, order: doubleLeft ? 2 : 1 }, { a: 1, b: 2, order: doubleLeft ? 1 : 2 }],
  };
}

function acetate(id: string, first: boolean): LewisMolecule {
  const one: Ligand = O2;
  const two: Ligand = Ominus;
  return star(id, 'Ethanoate ion', 'C2H3O2-', -1, { el: 'C' }, TEMPLATES.planar, [CH3, first ? one : two, first ? two : one], { hyb: 'sp2' });
}

const CO2_FORMS: LewisMolecule[] = [
  star('co2-1', 'Carbon dioxide', 'CO2', 0, { el: 'C' }, TEMPLATES.linear, [O2, O2], { hyb: 'sp' }),
  star('co2-2', 'Carbon dioxide', 'CO2', 0, { el: 'C' }, TEMPLATES.linear, [Ominus, { el: 'O', order: 3, lp: 1, charge: 1 }], { hyb: 'sp' }),
  star('co2-3', 'Carbon dioxide', 'CO2', 0, { el: 'C' }, TEMPLATES.linear, [{ el: 'O', order: 3, lp: 1, charge: 1 }, Ominus], { hyb: 'sp' }),
];

function hbonded(id: string, name: string, formula: string, atoms: LewisAtom[], bonds: LewisBond[], note: string): LewisMolecule {
  return { id, name, formula, charge: 0, atoms, bonds, note };
}

const hbondMolecules: LewisMolecule[] = [
  hbonded(
    'hf-chain',
    'Hydrogen bonds in hydrogen fluoride',
    'H3F3',
    [{ el: 'H', x: 0, y: 0 }, { el: 'F', x: 38, y: 0, lp: 3, mark: 1 }, { el: 'H', x: 92, y: 0 }, { el: 'F', x: 130, y: 0, lp: 3, mark: 1 }, { el: 'H', x: 184, y: 0 }, { el: 'F', x: 222, y: 0, lp: 3 }],
    [{ a: 0, b: 1 }, { a: 2, b: 3 }, { a: 4, b: 5 }, { a: 1, b: 2, style: 'hbond' }, { a: 3, b: 4, style: 'hbond' }],
    'each hydrogen is held to a lone pair on the next fluorine',
  ),
  hbonded(
    'water-dimer',
    'A hydrogen bond between water molecules',
    'H4O2',
    [{ el: 'O', x: 0, y: 0, lp: 2 }, { el: 'H', x: -30, y: 26 }, { el: 'H', x: 38, y: 0 }, { el: 'O', x: 92, y: 0, lp: 2, mark: 1 }, { el: 'H', x: 122, y: 26 }, { el: 'H', x: 122, y: -26 }],
    [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 3, b: 4 }, { a: 3, b: 5 }, { a: 2, b: 3, style: 'hbond' }],
    'a hydrogen of one molecule is held to a lone pair on the oxygen of the other',
  ),
  hbonded(
    'ethanol-water',
    'A hydrogen bond between ethanol and water',
    'C2H8O2',
    [{ el: 'C2H5', label: 'H5C2', x: -38, y: 22 }, { el: 'O', x: 0, y: 0, lp: 2 }, { el: 'H', x: 38, y: 0 }, { el: 'O', x: 92, y: 0, lp: 2, mark: 1 }, { el: 'H', x: 122, y: 26 }, { el: 'H', x: 122, y: -26 }],
    [{ a: 0, b: 1 }, { a: 1, b: 2 }, { a: 3, b: 4 }, { a: 3, b: 5 }, { a: 2, b: 3, style: 'hbond' }],
    'the hydroxyl hydrogen is held to a lone pair on the water oxygen',
  ),
];

function figure(id: string, name: string, list: LewisMolecule[], resonance = false): LewisFigure {
  return { id, name, forms: list, resonance: resonance ? 1 : undefined };
}

export const LEWIS: LewisFigures = Object.fromEntries(
  [
    ...molecules.map((m) => figure(m.id, m.name, [m])),
    ...hbondMolecules.map((m) => figure(m.id, m.name, [m])),
    figure('ozone', 'Ozone', [
      star('ozone-1', 'Ozone', 'O3', 0, { el: 'O', lp: 1, charge: 1 }, TEMPLATES.bent3, [O2, Ominus], { hyb: 'sp2' }),
      star('ozone-2', 'Ozone', 'O3', 0, { el: 'O', lp: 1, charge: 1 }, TEMPLATES.bent3, [Ominus, O2], { hyb: 'sp2' }),
    ], true),
    figure('carbonate', 'Carbonate ion', forms('carbonate', 'Carbonate ion', 'CO32-', -2, { el: 'C' }, TEMPLATES.planar, [0, 1, 2], { hyb: 'sp2' }), true),
    figure('nitrate', 'Nitrate ion', forms('nitrate', 'Nitrate ion', 'NO3-', -1, { el: 'N', charge: 1 }, TEMPLATES.planar, [0, 1, 2], { hyb: 'sp2' }), true),
    figure('co2-resonance', 'Carbon dioxide', CO2_FORMS, true),
    figure('benzene-resonance', 'Benzene', [hexagon('benzene-1', 0), hexagon('benzene-2', 1)], true),
    figure('allyl', 'Allyl carbocation', [allyl('allyl-1', true), allyl('allyl-2', false)], true),
    figure('acetate', 'Ethanoate ion', [acetate('acetate-1', true), acetate('acetate-2', false)], true),
  ].map((f) => [f.id, f]),
);
