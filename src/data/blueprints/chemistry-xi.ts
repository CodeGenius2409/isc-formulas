// Chemistry, Class XI. Numericals come from the solver registry, and shapes and hybridisation from the checked
// structures in src/data/lewis.
import { LEWIS } from '../lewis/figures';
import { formulaText } from '../lewis/check';
import { derivationBlueprints } from '../derivations';
import KNOWLEDGE from './knowledge/chemistry-xi';
import { blueprintsFor } from './dsl';
import type { Blueprint } from './types';

const { num, mcqNum, facts, custom, rest } = blueprintsFor('chemistry', 'XI', KNOWLEDGE);

const SHAPE_IDS = ['water', 'ammonia', 'methane', 'co2', 'becl2', 'bf3', 'pcl5', 'sf4', 'clf3', 'sf6', 'brf5', 'so2'];
const SHAPES = ['linear', 'trigonal planar', 'bent', 'tetrahedral', 'trigonal pyramidal', 'trigonal bipyramidal', 'see-saw', 'T-shaped', 'octahedral', 'square pyramidal'];
const HYBRIDS = ['sp', 'sp²', 'sp³', 'sp³d', 'sp³d²'];
const hybText = (h: string) => h.replace(/2/g, '²').replace(/3/g, '³');
const mol = (id: string) => LEWIS[id].forms[0];

const ATOMS: [string, string][] = [['H', '1s¹'], ['Li', '1s² 2s¹'], ['C', '1s² 2s² 2p²'], ['N', '1s² 2s² 2p³'], ['O', '1s² 2s² 2p⁴'], ['F', '1s² 2s² 2p⁵'], ['Na', '1s² 2s² 2p⁶ 3s¹'], ['Mg', '1s² 2s² 2p⁶ 3s²'], ['Al', '1s² 2s² 2p⁶ 3s² 3p¹'], ['Si', '1s² 2s² 2p⁶ 3s² 3p²'], ['P', '1s² 2s² 2p⁶ 3s² 3p³'], ['S', '1s² 2s² 2p⁶ 3s² 3p⁴'], ['Cl', '1s² 2s² 2p⁶ 3s² 3p⁵']];

const blueprints: Blueprint[] = [
  // ---- Unit 1: Basic concepts
  mcqNum('moles-mcq', [1, 'b', 1, 1], {
    text: '{N} mol of a substance contains how many particles?',
    vars: { N: [0.5, 4, 0.5] },
    use: 'c-xi-1-2',
    find: 'N',
    given: { n: 'N mol' },
    mistakes: (v) => [
      ['divided by Avogadro’s number', v.N / 6.022e23],
      ['used 6.022 × 10²² as the constant', v.N * 6.022e22],
      ['forgot the moles', 6.022e23],
      ['squared the moles', v.N * v.N * 6.022e23],
      ['doubled it, thinking of two atoms in each molecule', 2 * v.N * 6.022e23],
    ],
  }),
  num('moles', [1, 'b', 2, 1], {
    text: '{G} g of a substance of molar mass {M} g/mol is taken. Find the number of molecules.',
    vars: { G: [5, 90, 5], M: [18, 44, 46, 58, 180] },
    derive: (v) => ({ N: Number((v.G / v.M).toPrecision(3)) }),
    parts: [{ ask: 'Number of molecules', use: 'c-xi-1-2', find: 'N', given: { n: 'N mol' }, marks: 2 }],
  }),
  num('molarity-xi', [1, 'c', 2, 1], {
    text: '{N} mol of a solute is dissolved to make {V} L of solution. Find the molarity.',
    vars: { N: [0.2, 2, 0.2], V: [0.5, 2, 0.5] },
    parts: [{ ask: 'Molarity', use: 'c-xii-2-6', find: 'M', given: { n: 'N mol', V: 'V L' }, marks: 2 }],
  }),
  num('dilution', [1, 'c', 2, 1], {
    text: 'To what volume must {V} mL of a {A} M solution be diluted to make it {B} M?',
    vars: { V: [50, 200, 50], A: [1, 4, 1], B: [0.2, 0.8, 0.2] },
    parts: [{ ask: 'Final volume needed', use: 'c-xi-1-51', find: 'V_2', given: { M_1: 'A mol/L', V_1: 'V mL', M_2: 'B mol/L' }, marks: 2 }],
  }),
  num('titration', [1, 'c', 3, 2], {
    style: 'cbq-style',
    text: 'In a titration, {A} mL of a {M} M acid reacts fully with {B} mL of an alkali, with a 1 : 1 ratio.',
    vars: { A: [10, 25, 5], M: [0.1, 0.5, 0.1], B: [10, 30, 5] },
    parts: [{ ask: 'Molarity of the alkali', use: 'c-xi-1-51', find: 'M_2', given: { M_1: 'M mol/L', V_1: 'A mL', V_2: 'B mL' }, marks: 3 }],
  }),
  custom('empirical', [1, 'b', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const [name, c, h, o, formula] = g.pick([
      ['glucose', 40, 6.7, 53.3, 'CH₂O'],
      ['ethanoic acid', 40, 6.7, 53.3, 'CH₂O'],
      ['ethanol', 52.2, 13, 34.8, 'C₂H₆O'],
      ['propanone', 62.1, 10.3, 27.6, 'C₃H₆O'],
      ['butane', 82.8, 17.2, 0, 'C₂H₅'],
      ['methane', 75, 25, 0, 'CH₄'],
    ] as const);
    const mc = c / 12;
    const mh = h;
    const mo = o / 16;
    const smallest = Math.min(mc, mh, ...(o ? [mo] : []));
    return g.theory(`A compound contains ${c}% carbon, ${h}% hydrogen${o ? ` and ${o}% oxygen` : ''} by mass. Find its empirical formula.`, [
      [`Divide by atomic mass: C ${mc.toFixed(2)}, H ${mh.toFixed(2)}${o ? `, O ${mo.toFixed(2)}` : ''}.`, 1],
      [`Divide by the smallest, ${smallest.toFixed(2)}, and round to simple whole numbers.`, 1],
      [`The empirical formula is ${formula}, as in ${name}.`, 1],
    ]);
  }),
  ...facts(1, 'a', {
    define: [
      ['the law of conservation of mass', 'In a chemical reaction, the total mass of the products equals the total mass of the reactants.'],
      ['the law of definite proportions', 'A compound always contains the same elements combined in the same ratio by mass.'],
      ['an element', 'A substance made of only one kind of atom.'],
    ],
    recall: [
      ['Which is a mixture?', 'Air', 'Water', 'Sodium chloride', 'Copper'],
      ['The atomic mass unit is based on:', 'carbon-12', 'hydrogen-1', 'oxygen-16', 'nitrogen-14'],
      ['The law of multiple proportions was given by:', 'Dalton', 'Lavoisier', 'Avogadro', 'Gay-Lussac'],
    ],
    reason: [
      ['A compound’s properties differ from those of its elements.', 'Its atoms are joined by chemical bonds.', 'So it’s a new substance.'],
    ],
    compare: [
      ['a mixture', 'a compound', ['Its parts can be in any ratio.', 'Its elements are in a fixed ratio.'], ['Separable by physical methods.', 'Separable only by chemical methods.']],
    ],
    truths: [
      ['One mole of a gas at STP takes up about 22.4 L.', 'One mole of a gas at STP takes up about 2.24 L.'],
      ['Isotopes have different masses.', 'Isotopes have different atomic numbers.'],
      ['Avogadro’s law says equal volumes of gases at the same conditions have equal numbers of molecules.', 'Avogadro’s law says equal volumes of gases at the same conditions have equal masses.'],
    ],
  }),
  ...facts(1, 'b', {
    define: [
      ['a mole', 'The amount of a substance holding 6.022 × 10²³ particles.'],
      ['molar mass', 'The mass of one mole of a substance, in grams per mole.'],
      ['the limiting reagent', 'The reactant that’s used up first, which fixes how much product forms.'],
      ['empirical formula', 'The simplest whole-number ratio of the atoms in a compound.'],
    ],
    recall: [
      ['The number of atoms in 1 mol of O₂ is:', '2 × 6.022 × 10²³', '6.022 × 10²³', '3 × 6.022 × 10²³', '16 × 6.022 × 10²³'],
      ['A compound with the empirical formula CH₂O and a molar mass of 180 g/mol has the molecular formula:', 'C₆H₁₂O₆', 'CH₂O', 'C₂H₄O₂', 'C₃H₆O₃'],
      ['The mass of 1 mol of water is:', '18 g', '16 g', '2 g', '20 g'],
      ['The number of moles in 22 g of CO₂ is:', '0.5', '1', '2', '0.25'],
    ],
    reason: [
      ['Stoichiometry needs moles rather than mass.', 'Reactions go by numbers of particles.', 'Moles count particles, while masses vary with the substance.'],
    ],
    truths: [
      ['Empirical formula can equal the molecular formula.', 'Empirical formula can never equal the molecular formula.'],
      ['A balanced equation gives the mole ratio of reactants and products.', 'A balanced equation gives their ratio by mass directly.'],
      ['Percentage yield can’t be more than 100 for a pure product.', 'Percentage yield is usually more than 100 for a pure product.'],
      ['One mole of any gas at STP takes up about 22.4 L.', 'One mole of any gas at STP takes up about 2.24 L.'],
    ],
    cases: [
      {
        scene: 'A baker needs 2 eggs for every 3 cups of flour. With 6 eggs and 12 cups of flour, the batches are limited by one ingredient, just as a chemist’s reaction is limited by one reactant.',
        parts: [
          ['Which ingredient is the limiting one?', 'The eggs, as 6 eggs need only 9 cups of flour.', 1],
          ['What is the matching term for this in chemistry?', 'The limiting reagent.', 1],
          ['What decides the amount of product in a reaction?', 'The amount of the limiting reagent.', 1],
        ],
      },
    ],
  }),
  ...facts(1, 'c', {
    define: [
      ['molarity', 'The number of moles of solute per litre of solution.'],
      ['normality', 'The number of gram equivalents of solute per litre of solution.'],
      ['the equivalence point', 'The point in a titration when the reactants have been added in exact proportion.'],
    ],
    recall: [
      ['Phenolphthalein is suitable for titrating:', 'a strong acid with a strong base', 'a weak acid with a weak base', 'a strong acid with a weak base', 'no acid at all'],
      ['Which indicator suits a strong acid with a weak base?', 'Methyl orange', 'Phenolphthalein', 'Litmus paper only', 'Starch'],
    ],
    reason: [
      ['A standard solution must be made accurately for a titration.', 'Its concentration is the base of the whole calculation.'],
    ],
    truths: [
      ['M₁V₁ = M₂V₂ applies to a dilution.', 'M₁V₁ = M₂V₂ never applies to a dilution.'],
      ['The end point of a titration comes close to the equivalence point.', 'The end point of a titration is far from the equivalence point.'],
      ['A secondary standard is standardised against a primary standard.', 'A secondary standard needs no standardising.'],
    ],
  }),

  // ---- Unit 2: Atoms
  num('bohr-hydrogen', [2, 'a', 3, 2], {
    text: 'An electron sits in the n = {N} orbit of a hydrogen atom.',
    vars: { N: [1, 2, 3, 4, 5] },
    parts: [
      { ask: 'Radius of the orbit', use: 'c-xi-2-5', find: 'r_n', given: { a_0: '52.9 pm', n: 'N', Z: '1' }, marks: 1 },
      { ask: 'Energy of the electron', use: 'c-xi-2-4', find: 'E_n', given: { E_R: '13.6 eV', Z: '1', n: 'N' }, marks: 2 },
    ],
  }),
  num('photon-mole', [2, 'a', 2, 1], {
    text: 'Find the energy of one mole of photons of light of wavelength {L} nm.',
    vars: { L: [300, 700, 50] },
    parts: [{ ask: 'Energy per mole', use: 'c-xi-2-29', find: 'E', given: { lambda: 'L nm' }, unit: 'kJ/mol', marks: 2 }],
  }),
  num('frequency-wavelength', [2, 'a', 2, 1], {
    text: 'A radio station broadcasts at {F} MHz. Find the wavelength of its signal.',
    vars: { F: [88, 108, 2] },
    parts: [{ ask: 'Wavelength', use: 'c-xi-2-24', find: 'lambda', given: { nu: 'F MHz' }, marks: 2 }],
  }),
  custom('uncertainty', [2, 'a', 2, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const dx = g.pick([0.1, 0.2, 0.5, 1]);
    const dv = 6.626e-34 / (4 * Math.PI * 9.11e-31 * dx * 1e-9);
    return { form: 'numeric', text: `An electron’s position is known to within ${dx} nm. Find the least uncertainty in its velocity.`, parts: [g.answerPart('Least uncertainty in velocity', dv, 2, [{ label: 'Use Heisenberg’s principle', math: ['\\Delta v = \\dfrac{h}{4\\pi m\\,\\Delta x}'] }], 'm/s')] };
  }),
  custom('configuration', [2, 'b', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const [atom, config] = g.pick(ATOMS);
    return g.mcq(`The electronic configuration of ${atom} in its ground state is:`, config, g.sample(ATOMS.filter((a) => a[0] !== atom), 3).map((a) => a[1]));
  }),
  custom('quantum-count', [2, 'b', 2, 2], { type: 'short', format: 'short' }, (g) => {
    const n = g.int(2, 4);
    return g.theory(`How many orbitals, and how many electrons at most, can the shell with n = ${n} hold?`, [`It has n² = ${n * n} orbitals.`, `It holds up to 2n² = ${2 * n * n} electrons.`]);
  }),
  ...facts(2, 'a', {
    define: [
      ['the photoelectric effect', 'The release of electrons from a metal’s surface by light above a certain frequency.'],
      ['the Heisenberg uncertainty principle', 'A particle’s position and momentum can’t both be known exactly at one time.'],
      ['isotopes', 'Atoms of one element with different numbers of neutrons.'],
    ],
    recall: [
      ['Who discovered the electron?', 'J. J. Thomson', 'Rutherford', 'Chadwick', 'Bohr'],
      ['Who discovered the neutron?', 'Chadwick', 'Thomson', 'Rutherford', 'Goldstein'],
      ['Rutherford’s model failed to explain:', 'the stability of atoms', 'the small nucleus', 'the empty space in atoms', 'the positive charge of the nucleus'],
      ['The spectral series of hydrogen in the visible region is:', 'Balmer', 'Lyman', 'Paschen', 'Pfund'],
    ],
    reason: [
      ['Bohr’s model works only for atoms with one electron.', 'It ignores the repulsion between electrons.'],
    ],
    truths: [
      ['Energy levels in a hydrogen atom get closer together as n rises.', 'Energy levels in a hydrogen atom get further apart as n rises.'],
      ['The Bohr radius of hydrogen’s first orbit is about 52.9 pm.', 'The Bohr radius of hydrogen’s first orbit is about 52.9 nm.'],
      ['Electrons have a wave nature as well as a particle nature.', 'Electrons have only a particle nature.'],
    ],
  }),
  ...facts(2, 'b', {
    define: [
      ['the Aufbau principle', 'Orbitals fill in order of increasing energy.'],
      ['Hund’s rule', 'In orbitals of equal energy, electrons stay unpaired as far as they can, with parallel spins.'],
      ['the Pauli exclusion principle', 'No two electrons in an atom can have the same four quantum numbers.'],
      ['an orbital', 'A region of space where an electron is most likely to be found.'],
    ],
    recall: [
      ['The maximum number of electrons in a d subshell is:', '10', '6', '14', '2'],
      ['The shape of a p orbital is:', 'dumb-bell', 'spherical', 'double dumb-bell', 'ring'],
      ['Which orbital is filled first?', '4s', '3d', '4p', '4d'],
      ['The value of l for a p orbital is:', '1', '0', '2', '3'],
    ],
    reason: [
      ['Copper’s configuration ends in 3d¹⁰ 4s¹.', 'A completely filled d subshell is especially stable.'],
      ['The 4s orbital fills before the 3d.', 'It has a lower value of n + l.'],
    ],
    truths: [
      ['The s orbital is spherical.', 'The s orbital is dumb-bell shaped.'],
      ['The principal quantum number fixes an orbital’s size and energy.', 'The principal quantum number fixes an orbital’s orientation.'],
      ['The magnetic quantum number shows the orientation of an orbital.', 'The magnetic quantum number shows the size of an orbital.'],
      ['A p subshell has three orbitals.', 'A p subshell has five orbitals.'],
    ],
    compare: [
      ['an orbit', 'an orbital', ['A definite circular path in Bohr’s model.', 'A region of probability.'], ['Can hold 2n² electrons.', 'Can hold at most two electrons.']],
    ],
  }),

  // ---- Unit 3: Periodicity
  ...facts(3, 'a', {
    define: [
      ['ionisation enthalpy', 'The energy needed to remove the outermost electron from an isolated gaseous atom.'],
      ['electronegativity', 'An atom’s tendency to attract a shared pair of electrons to itself.'],
      ['electron gain enthalpy', 'The energy change when an isolated gaseous atom gains an electron.'],
      ['the modern periodic law', 'Properties of the elements repeat periodically with increasing atomic number.'],
    ],
    recall: [
      ['Across a period, atomic radius generally:', 'decreases', 'increases', 'stays the same', 'first doubles'],
      ['Down a group, ionisation enthalpy generally:', 'decreases', 'increases', 'stays the same', 'jumps irregularly'],
      ['Which element has the highest electronegativity?', 'Fluorine', 'Oxygen', 'Chlorine', 'Nitrogen'],
      ['Which has a higher first ionisation enthalpy, N or O?', 'N', 'O', 'They’re equal', 'It can’t be known'],
      ['A cation, compared with its parent atom, is:', 'smaller', 'larger', 'the same size', 'heavier by far'],
      ['Which is the largest of these?', 'Cl⁻', 'Cl', 'K⁺', 'Ar'],
    ],
    reason: [
      ['Nitrogen has a higher first ionisation enthalpy than oxygen.', 'Nitrogen’s half-filled p subshell is especially stable.'],
      ['Atomic radius falls across a period.', 'Nuclear charge rises, while the new electrons go in the same shell.', 'So the outer electrons are pulled in closer.'],
      ['Fluorine’s electron gain enthalpy is less negative than chlorine’s.', 'Fluorine’s small 2p subshell is crowded.', 'So an added electron meets strong repulsion.'],
    ],
    compare: [
      ['electronegativity', 'electron gain enthalpy', ['A tendency in a bond.', 'An energy change for a free atom.'], ['Has no unit.', 'Measured in kJ/mol.']],
    ],
    truths: [
      ['Noble gases have the highest ionisation enthalpies in their periods.', 'Noble gases have the lowest ionisation enthalpies in their periods.'],
      ['Metallic character rises down a group.', 'Metallic character falls down a group.'],
      ['Second ionisation enthalpy is always larger than the first.', 'Second ionisation enthalpy is always smaller than the first.'],
    ],
  }),

  // ---- Unit 4: Bonding
  custom('shape', [4, 'b', 1, 2], { type: 'structure', format: 'mcq' }, (g) => {
    const id = g.pick(SHAPE_IDS);
    const m = mol(id);
    return g.mcq(`According to VSEPR theory, what is the shape of ${formulaText(m.formula, m.charge)}?`, m.shape!, g.sample(SHAPES.filter((s) => s !== m.shape), 3), { answerLewis: [id] });
  }),
  custom('hybrid', [4, 'b', 1, 2], { type: 'structure', format: 'mcq' }, (g) => {
    const id = g.pick(SHAPE_IDS);
    const m = mol(id);
    const right = hybText(m.hyb!);
    return g.mcq(`What is the hybridisation of the central atom in ${formulaText(m.formula, m.charge)}?`, right, g.sample(HYBRIDS.filter((s) => s !== right), 3), { answerLewis: [id] });
  }),
  custom('lone-pairs', [4, 'b', 1, 1], { type: 'structure', format: 'mcq' }, (g) => {
    const id = g.pick(SHAPE_IDS);
    const m = mol(id);
    const lone = m.atoms[m.central!].lp ?? 0;
    return g.mcq(`How many lone pairs are on the central atom of ${formulaText(m.formula, m.charge)}?`, String(lone), ['0', '1', '2', '3'].filter((c) => c !== String(lone)), { answerLewis: [id] });
  }),
  custom('shape-explain', [4, 'b', 2, 2], { type: 'structure', format: 'short' }, (g) => {
    const id = g.pick(SHAPE_IDS);
    const m = mol(id);
    const lone = m.atoms[m.central!].lp ?? 0;
    return g.theory(`State the hybridisation and shape of ${formulaText(m.formula, m.charge)}, and give the number of lone pairs on its central atom.`, [`It is ${hybText(m.hyb!)} hybridised, and ${m.shape}.`, `It has ${lone === 0 ? 'no' : lone} ${lone === 1 ? 'lone pair' : 'lone pairs'} on the central atom.`], { answerLewis: [id] });
  }),
  num('bond-order', [4, 'b', 2, 2], {
    text: 'A molecule has {B} electrons in bonding orbitals, and {A} in antibonding orbitals. Find its bond order.',
    vars: { B: [4, 10, 2], A: [0, 4, 2] },
    when: (v) => v.B > v.A,
    parts: [{ ask: 'Bond order', use: 'c-xi-4-2', find: 'BO', given: { N_b: 'B', N_a: 'A' }, marks: 2, exact: true }],
  }),
  num('formal-charge', [4, 'a', 2, 2], {
    text: 'An atom with {V} valence electrons has {L} non-bonding electrons, and {S} bonding electrons, in a Lewis structure. Find its formal charge.',
    vars: { V: [4, 5, 6, 7], L: [0, 2, 4, 6], S: [2, 4, 6, 8] },
    when: (v) => v.V - v.L - v.S / 2 !== 0 && Math.abs(v.V - v.L - v.S / 2) <= 2,
    parts: [{ ask: 'Formal charge', use: 'c-xi-4-1', find: 'FC', given: { V_e: 'V', N_e: 'L', B_e: 'S' }, marks: 2, exact: true }],
  }),
  ...facts(4, 'a', {
    define: [
      ['an ionic bond', 'The attraction between oppositely charged ions, formed by transfer of electrons.'],
      ['a covalent bond', 'A bond formed by two atoms sharing a pair of electrons.'],
      ['lattice enthalpy', 'The energy needed to separate one mole of an ionic solid into gaseous ions.'],
      ['the octet rule', 'Atoms tend to bond so that they have eight electrons in their outer shell.'],
    ],
    recall: [
      ['Which has an ionic bond?', 'NaCl', 'CH₄', 'H₂O', 'CO₂'],
      ['Which molecule has an incomplete octet?', 'BF₃', 'CH₄', 'H₂O', 'NH₃'],
      ['By Fajan’s rules, covalent character is greatest with:', 'a small, highly charged cation', 'a large, singly charged cation', 'a small anion', 'a large cation and a small anion'],
      ['The bond in a hydrogen molecule is:', 'covalent', 'ionic', 'metallic', 'a hydrogen bond'],
    ],
    reason: [
      ['Ionic compounds have high melting points.', 'Strong forces hold their ions together in a lattice.'],
      ['Ionic compounds conduct electricity when molten, but not as solids.', 'As solids, their ions can’t move.', 'When molten, their ions are free to move.'],
    ],
    compare: [
      ['ionic bonds', 'covalent bonds', ['Formed by transfer of electrons.', 'Formed by sharing of electrons.'], ['Usually give solids with high melting points.', 'Usually give molecules with low melting points.']],
      ['sigma bonds', 'pi bonds', ['Formed by end-on overlap.', 'Formed by sideways overlap.'], ['Stronger.', 'Weaker.']],
    ],
    truths: [
      ['A double bond has one sigma and one pi bond.', 'A double bond has two pi bonds.'],
      ['BF₃ has no dipole moment.', 'BF₃ has a large dipole moment.'],
      ['A triple bond has one sigma and two pi bonds.', 'A triple bond has three sigma bonds.'],
      ['Lattice enthalpy is larger for ions with higher charges.', 'Lattice enthalpy is smaller for ions with higher charges.'],
    ],
    draw: [
      ['Draw the Lewis dot structure of ammonia.', 'Three N–H shared pairs.', 'One lone pair on nitrogen.'],
    ],
  }),
  ...facts(4, 'b', {
    define: [
      ['hybridisation', 'The mixing of atomic orbitals on one atom to give new orbitals of equal energy.'],
      ['bond order', 'Half the difference between the numbers of bonding and antibonding electrons.'],
      ['a hydrogen bond', 'An attraction between a hydrogen atom bonded to N, O or F, and a lone pair on another such atom.'],
    ],
    recall: [
      ['The bond angle in methane is about:', '109.5°', '120°', '180°', '90°'],
      ['The shape of NH₃ is:', 'trigonal pyramidal', 'trigonal planar', 'tetrahedral', 'T-shaped'],
      ['The bond order of H₂ is:', '1', '2', '0', '½'],
      ['The carbon atoms in ethyne are:', 'sp hybridised', 'sp² hybridised', 'sp³ hybridised', 'unhybridised'],
    ],
    reason: [
      ['Water’s bond angle is smaller than ammonia’s.', 'Water has two lone pairs, and ammonia has one.', 'Lone pairs repel more strongly than bonding pairs.'],
      ['Ice floats on water.', 'Hydrogen bonds hold the molecules in an open structure.', 'So ice is less dense than liquid water.'],
      ['O₂ is attracted to a magnet.', 'Molecular orbital theory shows two unpaired electrons.'],
    ],
    compare: [
      ['bonding orbitals', 'antibonding orbitals', ['Lower in energy than the atomic orbitals.', 'Higher in energy than the atomic orbitals.'], ['Add stability.', 'Reduce stability.']],
    ],
    truths: [
      ['A higher bond order usually means a shorter bond.', 'A higher bond order usually means a longer bond.'],
      ['N₂ has a higher bond order than O₂.', 'O₂ has a higher bond order than N₂.'],
      ['sp³d² hybridisation gives an octahedral arrangement.', 'sp³d² hybridisation gives a linear arrangement.'],
      ['sp² hybridisation gives bond angles of 120°.', 'sp² hybridisation gives bond angles of 109.5°.'],
    ],
  }),

  // ---- Unit 5: Thermodynamics
  num('first-law-chem', [5, 'a', 2, 1], {
    text: 'A system absorbs {Q} J of heat, and {W} J of work is done on it. Find the change in internal energy.',
    vars: { Q: [100, 800, 100], W: [50, 400, 50] },
    parts: [{ ask: 'Change in internal energy', use: 'c-xi-6-1', find: 'DeltaU', given: { q: 'Q J', w: 'W J' }, marks: 2 }],
  }),
  num('expansion-work', [5, 'a', 2, 2], {
    text: 'A gas expands by {V} L against a constant pressure of {P} atm. Find the work done on the gas.',
    vars: { V: [1, 10, 1], P: [1, 5, 1] },
    parts: [{ ask: 'Work done on the gas', use: 'c-xi-6-28', find: 'w', given: { P: 'P atm', DeltaV: 'V L' }, marks: 2 }],
  }),
  num('heat-capacity', [5, 'a', 3, 2], {
    text: '{M} g of water is heated from {A} °C to {B} °C. Water has a specific heat capacity of 4.18 J/(g K).',
    vars: { M: [100, 500, 100], A: [20, 30, 5], B: [50, 90, 10] },
    derive: (v) => ({ D: v.B - v.A }),
    parts: [{ ask: 'Heat absorbed', use: 'c-xi-6-47', find: 'q', given: { m: 'M g', c: '4180 J/(kg*K)', DeltaT: 'D K' }, marks: 3 }],
  }),
  num('gibbs-xi', [5, 'b', 3, 2], {
    text: 'A reaction has ΔH = {H} kJ/mol and ΔS = {S} J/(mol K).',
    vars: { H: [-80, 80, 20], S: [50, 200, 50], T: [298, 350, 26] },
    when: (v) => v.H !== 0,
    parts: [{ ask: 'ΔG at {T} K', use: 'c-xi-6-5', find: 'DeltaG', given: { DeltaH: 'H kJ/mol', T: 'T K', DeltaS: 'S J/(mol*K)' }, unit: 'kJ/mol', marks: 3 }],
  }),
  num('crossover', [5, 'b', 2, 2], {
    text: 'A reaction has ΔH = {H} kJ/mol and ΔS = {S} J/(mol K). Above what temperature does it become spontaneous?',
    vars: { H: [40, 120, 20], S: [100, 300, 50] },
    parts: [{ ask: 'Temperature', use: 'c-xi-6-124', find: 'T', given: { DeltaH: 'H kJ/mol', DeltaS: 'S J/(mol*K)' }, marks: 2 }],
  }),
  ...facts(5, 'a', {
    define: [
      ['enthalpy', 'The heat content of a system at constant pressure, H = U + PV.'],
      ['an intensive property', 'A property that doesn’t depend on the amount of substance.'],
      ['Hess’s law', 'The total enthalpy change of a reaction doesn’t depend on the route taken.'],
    ],
    recall: [
      ['Which is an intensive property?', 'Temperature', 'Mass', 'Volume', 'Enthalpy'],
      ['Which is a state function?', 'Enthalpy', 'Heat', 'Work', 'Path length'],
      ['ΔH for an exothermic reaction is:', 'negative', 'positive', 'zero', 'infinite'],
      ['For an isolated system, which is exchanged with the surroundings?', 'Nothing', 'Heat only', 'Matter only', 'Heat and matter'],
    ],
    reason: [
      ['Heat isn’t a state function.', 'The heat in a change depends on the route taken.'],
    ],
    compare: [
      ['an open system', 'a closed system', ['Exchanges both matter and energy.', 'Exchanges only energy.'], ['Example: an uncovered beaker.', 'Example: a sealed flask.']],
      ['exothermic reactions', 'endothermic reactions', ['Give out heat.', 'Take in heat.'], ['ΔH is negative.', 'ΔH is positive.']],
    ],
    truths: [
      ['ΔU equals the heat absorbed at constant volume.', 'ΔU equals the heat absorbed at constant pressure.'],
      ['ΔH = ΔU + Δn_g RT for reactions of gases.', 'ΔH = ΔU − 2Δn_g RT for reactions of gases.'],
      ['Internal energy is an extensive property.', 'Internal energy is an intensive property.'],
    ],
  }),
  ...facts(5, 'b', {
    define: [
      ['entropy', 'A measure of how many ways a system’s energy can be spread out, often seen as its disorder.'],
      ['Gibbs free energy', 'The quantity G = H − TS, whose decrease shows that a change is spontaneous at constant T and P.'],
      ['a spontaneous process', 'A process that goes on by itself, without outside help, once started.'],
    ],
    recall: [
      ['A reaction is spontaneous at constant temperature and pressure if:', 'ΔG is negative', 'ΔG is positive', 'ΔH is positive', 'ΔS is negative'],
      ['A reaction with ΔH > 0 and ΔS < 0 is:', 'never spontaneous', 'always spontaneous', 'spontaneous only at high temperature', 'spontaneous only at low temperature'],
      ['At equilibrium, ΔG is:', 'zero', 'positive', 'negative', 'infinite'],
      ['If ΔH is negative and ΔS is positive, a reaction is:', 'spontaneous at every temperature', 'never spontaneous', 'spontaneous only at low temperature', 'spontaneous only at high temperature'],
    ],
    reason: [
      ['Ice melts above 0 °C, even though melting takes in heat.', 'Entropy rises as it melts.', 'Above 0 °C, TΔS is larger than ΔH, so ΔG is negative.'],
    ],
    truths: [
      ['Entropy rises when a solid melts.', 'Entropy falls when a solid melts.'],
      ['By the second law, heat can’t flow by itself from a cold body to a hot one.', 'By the second law, heat can’t flow by itself from a hot body to a cold one.'],
      ['ΔG° = −RT ln K.', 'ΔG° = RT ln K.'],
    ],
    cases: [
      {
        scene: 'A cold pack in a first-aid kit has ammonium nitrate and water separated by a thin film. Squeezing it mixes them, and it gets very cold, though no one adds any energy to it.',
        parts: [
          ['Is the dissolving exothermic or endothermic?', 'Endothermic, as it takes heat from the surroundings.', 1],
          ['Why does it happen, then?', 'Entropy rises so much that ΔG is still negative.', 1],
          ['What’s the sign of ΔS?', 'Positive, as ions spread out into the solution.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 6: Equilibrium
  num('ph', [6, 'b', 2, 1], {
    variants: [
      { text: 'A solution has [H⁺] = {C} × $10^{-{P}}$ mol/L. Find its pH.', parts: [{ ask: 'pH', use: 'c-xi-7-3', find: 'pH', given: { H: 'H0' }, marks: 2 }] },
    ],
    vars: { C: [1, 9, 1], P: [2, 3, 4, 5, 6] },
    derive: (v) => ({ H0: v.C * 10 ** -v.P }),
  }),
  mcqNum('ph-mcq', [6, 'b', 1, 1], {
    text: 'A strong acid has a hydrogen ion concentration of $10^{-{P}}$ mol/L. Its pH is:',
    vars: { P: [1, 2, 3, 4, 5, 6] },
    derive: (v) => ({ H: 10 ** -v.P }),
    use: 'c-xi-7-3',
    find: 'pH',
    given: { H: 'H' },
    mistakes: (v) => [
      ['used the pOH', 14 - v.P],
      ['took the negative of the pH', -v.P],
      ['doubled the exponent', v.P * 2],
      ['added 1', v.P + 1],
      ['subtracted 1', v.P - 1 || 7],
    ],
    digits: 2,
  }),
  num('buffer', [6, 'b', 3, 2], {
    text: 'A buffer has acid at {A} mol/L and its salt at {S} mol/L. The acid’s pKa is {K}.',
    vars: { A: [0.1, 0.5, 0.1], S: [0.1, 0.5, 0.1], K: [4, 5, 0.5] },
    parts: [{ ask: 'pH of the buffer', use: 'c-xi-7-6', find: 'pH', given: { pK_a: 'K', S_c: 'S', A_c: 'A' }, marks: 3 }],
  }),
  num('ostwald', [6, 'b', 3, 2], {
    text: 'A weak acid at {C} mol/L has Ka = {K} × 10⁻⁵. Find its degree of dissociation, using α = √(Ka/C).',
    vars: { C: [0.01, 0.1, 0.01], K: [1, 9, 1] },
    parts: [{ ask: 'Degree of dissociation', use: 'c-xi-7-10', find: 'alpha', given: { K_a: 'K*1e-5', C_c: 'C' }, marks: 3 }],
  }),
  num('ksp', [6, 'b', 2, 2], {
    text: 'A sparingly soluble salt AB has a solubility of {S} × 10⁻⁵ mol/L. Find its solubility product.',
    vars: { S: [1, 9, 1] },
    parts: [{ ask: 'Solubility product', use: 'c-xi-7-177', find: 'K_sp', given: { s: 'S*1e-5' }, marks: 2 }],
  }),
  ...facts(6, 'a', {
    define: [
      ['chemical equilibrium', 'The state in which the forward and backward reactions go at the same rate, so concentrations stay constant.'],
      ['Le Chatelier’s principle', 'A system at equilibrium shifts so as to oppose a change made to it.'],
      ['the reaction quotient', 'The same ratio as the equilibrium constant, at any moment in the reaction.'],
    ],
    recall: [
      ['A catalyst at equilibrium:', 'speeds up both reactions equally', 'changes K', 'shifts it to the products', 'stops the reaction'],
      ['Raising the pressure on N₂ + 3H₂ ⇌ 2NH₃ shifts it towards:', 'ammonia', 'nitrogen and hydrogen', 'neither', 'the side with more gas'],
      ['K for a reaction changes only with:', 'temperature', 'pressure', 'concentration', 'a catalyst'],
      ['If Q < K, the reaction moves:', 'forward', 'backward', 'neither way', 'to a stop'],
    ],
    reason: [
      ['Equilibrium is called dynamic.', 'Both reactions keep going at equal rates, so nothing seems to change.'],
      ['Adding an inert gas at constant volume doesn’t shift an equilibrium.', 'The partial pressures of the reacting gases stay the same.'],
    ],
    truths: [
      ['K doesn’t depend on the starting concentrations.', 'K depends on the starting concentrations.'],
      ['For an exothermic reaction, K falls as temperature rises.', 'For an exothermic reaction, K rises as temperature rises.'],
      ['Solids and pure liquids don’t appear in the expression for K.', 'Solids and pure liquids always appear in the expression for K.'],
    ],
    cases: [
      {
        scene: 'In the Haber process, N₂ + 3H₂ ⇌ 2NH₃, an industrial plant runs at about 200 atm and 700 K with an iron catalyst. The reaction is exothermic.',
        parts: [
          ['Why is a high pressure used?', 'The product side has fewer moles of gas, so high pressure shifts it to ammonia.', 1],
          ['Why isn’t a much lower temperature used, if the reaction is exothermic?', 'The rate would be far too slow.', 1],
          ['Does the iron catalyst change the yield at equilibrium?', 'No, it only gets there sooner.', 1],
        ],
      },
    ],
  }),
  ...facts(6, 'b', {
    define: [
      ['pH', 'The negative logarithm to base 10 of the hydrogen ion concentration.'],
      ['a buffer solution', 'A solution that resists changes of pH when a little acid or alkali is added.'],
      ['the common ion effect', 'The fall in a weak electrolyte’s dissociation when a salt with a shared ion is added.'],
      ['solubility product', 'The product of the concentrations of the ions of a sparingly soluble salt, in a saturated solution.'],
    ],
    recall: [
      ['At 298 K, the pH of pure water is:', '7', '0', '1', '14'],
      ['Which is a Lewis acid?', 'BF₃', 'NH₃', 'OH⁻', 'H₂O'],
      ['An acid and base that differ by one proton are called:', 'a conjugate pair', 'a buffer', 'isomers', 'a salt'],
      ['The pOH of a solution of pH 4 at 298 K is:', '10', '4', '−4', '14'],
    ],
    reason: [
      ['A solution of sodium ethanoate is basic.', 'Ethanoate ions react with water.', 'That gives ethanoic acid and hydroxide ions.'],
      ['A buffer keeps its pH almost steady.', 'Its weak acid reacts with added alkali.', 'Its conjugate base reacts with added acid.'],
      ['Adding NaCl to a saturated solution of AgCl lowers its solubility.', 'The extra chloride shifts the equilibrium back towards the solid.'],
    ],
    compare: [
      ['strong acids', 'weak acids', ['Fully ionised in water.', 'Partly ionised in water.'], ['Have a very weak conjugate base.', 'Have a relatively strong conjugate base.']],
    ],
    truths: [
      ['pH + pOH = 14 at 298 K.', 'pH + pOH = 7 at 298 K.'],
      ['A precipitate forms when the ionic product is above Ksp.', 'A precipitate forms when the ionic product is below Ksp.'],
      ['A stronger acid has a lower pKa.', 'A stronger acid has a higher pKa.'],
    ],
  }),

  // ---- Unit 7: Redox
  custom('oxidation-number', [7, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const [species, atom, ox] = g.pick([
      ['KMnO₄', 'Mn', '+7'], ['K₂Cr₂O₇', 'Cr', '+6'], ['H₂SO₄', 'S', '+6'], ['HNO₃', 'N', '+5'], ['NH₃', 'N', '−3'], ['H₂O₂', 'O', '−1'], ['SO₂', 'S', '+4'], ['Fe₂O₃', 'Fe', '+3'], ['CO₂', 'C', '+4'], ['NaH', 'H', '−1'], ['Cl₂O₇', 'Cl', '+7'], ['ClO₃⁻', 'Cl', '+5'],
    ] as const);
    return g.mcq(`The oxidation number of ${atom} in ${species} is:`, ox, g.sample(['+1', '+2', '+3', '+4', '+5', '+6', '+7', '−1', '−3'].filter((o) => o !== ox), 3));
  }),
  custom('redox-balance', [7, 'a', 3, 2], { type: 'reaction', format: 'short' }, (g) => {
    const [eq, ox, red, balanced] = g.pick([
      ['Zn + Cu²⁺ → Zn²⁺ + Cu', 'Zn is oxidised, from 0 to +2.', 'Cu²⁺ is reduced, from +2 to 0.', 'Zn + Cu²⁺ → Zn²⁺ + Cu is already balanced for atoms and charge.'],
      ['Fe³⁺ + I⁻ → Fe²⁺ + I₂', 'I⁻ is oxidised, from −1 to 0.', 'Fe³⁺ is reduced, from +3 to +2.', '2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂.'],
      ['MnO₄⁻ + Fe²⁺ + H⁺ → Mn²⁺ + Fe³⁺ + H₂O', 'Fe²⁺ is oxidised, from +2 to +3.', 'Mn is reduced, from +7 to +2.', 'MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O.'],
      ['Cr₂O₇²⁻ + I⁻ + H⁺ → Cr³⁺ + I₂ + H₂O', 'I⁻ is oxidised, from −1 to 0.', 'Cr is reduced, from +6 to +3.', 'Cr₂O₇²⁻ + 6I⁻ + 14H⁺ → 2Cr³⁺ + 3I₂ + 7H₂O.'],
      ['Al + H⁺ → Al³⁺ + H₂', 'Al is oxidised, from 0 to +3.', 'H⁺ is reduced, from +1 to 0.', '2Al + 6H⁺ → 2Al³⁺ + 3H₂.'],
    ] as const);
    return g.theory(`For the reaction ${eq}, state which species is oxidised and which is reduced, then balance it.`, [ox, red, balanced]);
  }),
  ...facts(7, 'a', {
    define: [
      ['oxidation', 'The loss of electrons, or a rise in oxidation number.'],
      ['reduction', 'The gain of electrons, or a fall in oxidation number.'],
      ['a disproportionation reaction', 'A reaction in which one element is both oxidised and reduced.'],
      ['an oxidising agent', 'A substance that accepts electrons, and so is itself reduced.'],
    ],
    recall: [
      ['The oxidation number of an element in its free state is:', '0', '+1', '−1', '+2'],
      ['In most of its compounds, oxygen has an oxidation number of:', '−2', '−1', '+2', '0'],
      ['A substance that gives away electrons is a:', 'reducing agent', 'oxidising agent', 'catalyst', 'solvent'],
      ['The oxidation number of oxygen in Na₂O₂ is:', '−1', '−2', '+1', '0'],
    ],
    reason: [
      ['Oxidation and reduction always happen together.', 'Electrons lost by one species must be gained by another.'],
      ['H₂O₂ can act as both an oxidising and a reducing agent.', 'Oxygen’s −1 state is between 0 and −2.', 'So it can go either way.'],
    ],
    compare: [
      ['oxidation', 'reduction', ['Loss of electrons.', 'Gain of electrons.'], ['Oxidation number rises.', 'Oxidation number falls.']],
    ],
    truths: [
      ['Fluorine is always −1 in its compounds.', 'Fluorine is always +1 in its compounds.'],
      ['The sum of oxidation numbers in a neutral compound is zero.', 'The sum of oxidation numbers in a neutral compound is one.'],
      ['Hydrogen is +1 in most of its compounds, and −1 in metal hydrides.', 'Hydrogen is −1 in most of its compounds, and +1 in metal hydrides.'],
      ['The oxidation number of a simple ion equals its charge.', 'The oxidation number of a simple ion is always zero.'],
    ],
  }),

  // ---- Unit 8: Organic basics
  custom('name-simple', [8, 'a', 1, 1], { type: 'structure', format: 'mcq' }, (g) => {
    const list: [string, string][] = [['propane', 'Propane'], ['butane', 'Butane'], ['isobutane', '2-Methylpropane'], ['propene', 'Propene'], ['but-1-ene', 'But-1-ene'], ['but-2-ene', 'But-2-ene'], ['propyne', 'Propyne'], ['benzene', 'Benzene'], ['toluene', 'Toluene'], ['cyclohexane', 'Cyclohexane']];
    const [key, name] = g.pick(list);
    return g.mcq('Name the compound drawn here.', name, g.sample(list.filter((x) => x[0] !== key), 3).map((x) => x[1]), { structure: { list: [key], unnamed: 1 } });
  }),
  ...facts(8, 'a', {
    define: [
      ['a functional group', 'An atom or group of atoms that gives an organic compound its typical reactions.'],
      ['isomers', 'Compounds with the same molecular formula, but different structures.'],
      ['a homologous series', 'A family of compounds with the same functional group, each differing from the next by CH₂.'],
    ],
    recall: [
      ['The IUPAC name of CH₃CH₂OH is:', 'ethanol', 'methanol', 'ethanal', 'ethanoic acid'],
      ['Butane and 2-methylpropane are:', 'chain isomers', 'position isomers', 'functional isomers', 'optical isomers'],
      ['Ethanol and methoxymethane are:', 'functional isomers', 'chain isomers', 'position isomers', 'identical'],
      ['Which suffix means a carboxylic acid?', '-oic acid', '-al', '-one', '-ol'],
    ],
    reason: [
      ['Members of a homologous series have similar reactions.', 'They share one functional group.'],
      ['Boiling points rise along a homologous series.', 'Larger molecules have stronger dispersion forces.'],
    ],
    compare: [
      ['position isomers', 'functional isomers', ['The same group at different places.', 'Different functional groups.'], ['Example: propan-1-ol and propan-2-ol.', 'Example: ethanol and methoxymethane.']],
    ],
    truths: [
      ['Each member of a homologous series differs by CH₂.', 'Each member of a homologous series differs by CH₃.'],
      ['Geometrical isomerism needs restricted rotation about a bond.', 'Geometrical isomerism needs free rotation about a bond.'],
      ['Optical isomers need a chiral centre, or another source of asymmetry.', 'Optical isomers need a double bond.'],
      ['Propanal and propanone are functional isomers.', 'Propanal and propanone are chain isomers.'],
    ],
  }),
  ...facts(8, 'b', {
    define: [
      ['sublimation', 'A solid changing directly to a gas when heated, used to purify some compounds.'],
      ['chromatography', 'A way of separating a mixture by how differently its parts move through a medium.'],
    ],
    recall: [
      ['Which method separates liquids with close boiling points?', 'Fractional distillation', 'Sublimation', 'Filtration', 'Crystallisation'],
      ['Lassaigne’s test detects:', 'nitrogen, sulphur and halogens', 'carbon only', 'hydrogen only', 'oxygen only'],
      ['Kjeldahl’s method estimates:', 'nitrogen', 'carbon', 'sulphur', 'chlorine'],
      ['Steam distillation suits compounds that are:', 'volatile in steam and insoluble in water', 'non-volatile', 'soluble in water', 'easily broken down by water'],
    ],
    reason: [
      ['Fractional distillation separates crude oil.', 'Its parts have different boiling points.', 'So each part condenses at a different height in the column.'],
    ],
    truths: [
      ['Crystallisation relies on a difference in solubility.', 'Crystallisation relies on a difference in colour.'],
      ['Kjeldahl’s method fails for nitro compounds.', 'Kjeldahl’s method works for all nitrogen compounds.'],
      ['In paper chromatography, the Rf value is below 1.', 'In paper chromatography, the Rf value is above 1.'],
    ],
  }),
  ...facts(8, 'c', {
    define: [
      ['the inductive effect', 'A permanent shift of electrons along a chain of sigma bonds, caused by a polar bond.'],
      ['resonance', 'The representation of a molecule by several structures, with electrons spread over them.'],
      ['an electrophile', 'A species short of electrons, which attacks electron-rich sites.'],
      ['a nucleophile', 'A species rich in electrons, which attacks electron-poor sites.'],
    ],
    recall: [
      ['Which is an electrophile?', 'NO₂⁺', 'OH⁻', 'NH₃', 'CN⁻'],
      ['Which is a nucleophile?', 'OH⁻', 'H⁺', 'NO₂⁺', 'AlCl₃'],
      ['The order of stability of carbocations is:', 'tertiary > secondary > primary', 'primary > secondary > tertiary', 'secondary > tertiary > primary', 'they’re all equal'],
      ['Hyperconjugation involves:', 'C–H sigma electrons and an empty p orbital', 'only lone pairs', 'only ionic bonds', 'only pi bonds'],
    ],
    reason: [
      ['A tertiary carbocation is more stable than a primary one.', 'Alkyl groups push electrons towards the positive carbon.', 'Hyperconjugation also spreads out the charge.'],
      ['Chloroacetic acid is stronger than acetic acid.', 'Chlorine’s −I effect pulls electrons.', 'That stabilises the carboxylate ion.'],
    ],
    compare: [
      ['homolytic fission', 'heterolytic fission', ['Each atom keeps one electron, giving free radicals.', 'One atom keeps both electrons, giving ions.'], ['Favoured by heat or light.', 'Favoured by polar solvents.']],
      ['the inductive effect', 'the resonance effect', ['Acts through sigma bonds.', 'Acts through pi bonds.'], ['Falls off quickly along a chain.', 'Spreads over a conjugated system.']],
    ],
    truths: [
      ['−I groups pull electrons towards themselves.', '−I groups push electrons away from themselves.'],
      ['Free radicals have an unpaired electron.', 'Free radicals have no electrons in their outer shell.'],
      ['Resonance lowers the energy of a molecule.', 'Resonance raises the energy of a molecule.'],
    ],
  }),

  // ---- Unit 9: Hydrocarbons
  custom('reaction-mcq-hydro', [9, 'b', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const [q, right, wrong] = g.pick([
      ['Propene reacts with HBr, without peroxide, to give mainly:', '2-Bromopropane', ['1-Bromopropane', 'Propane', 'Bromoethane']],
      ['Propene reacts with HBr, in the presence of a peroxide, to give mainly:', '1-Bromopropane', ['2-Bromopropane', 'Propane', 'Propan-2-ol']],
      ['Ethene decolourises:', 'bromine water', ['sodium chloride solution', 'dilute HCl', 'water alone']],
      ['Ozonolysis of ethene, with zinc and water, gives:', 'Methanal', ['Ethanal', 'Propanone', 'Methanol']],
    ] as [string, string, string[]][]);
    return g.mcq(q, right, wrong);
  }),
  ...facts(9, 'a', {
    define: [
      ['an alkane', 'A saturated hydrocarbon, with the general formula CₙH₂ₙ₊₂.'],
      ['the Wurtz reaction', 'Joining two alkyl halides using sodium in dry ether, to give a longer alkane.'],
      ['conformations', 'Different arrangements of a molecule’s atoms, reached by rotation about a single bond.'],
    ],
    recall: [
      ['Which conformation of ethane is the more stable?', 'Staggered', 'Eclipsed', 'Both are equal', 'Neither exists'],
      ['Methane reacts with chlorine in sunlight by:', 'free radical substitution', 'electrophilic addition', 'nucleophilic addition', 'elimination'],
      ['Which alkane has the highest boiling point?', 'Hexane', 'Pentane', '2-Methylbutane', 'Butane'],
    ],
    reason: [
      ['Branched alkanes boil lower than straight ones.', 'They’re more compact, with less surface area.', 'So their dispersion forces are weaker.'],
    ],
    truths: [
      ['Alkanes are fairly unreactive.', 'Alkanes are highly reactive with all reagents.'],
      ['Alkanes have a general formula of CₙH₂ₙ₊₂.', 'Alkanes have a general formula of CₙH₂ₙ.'],
      ['The carbon in methane is sp³ hybridised.', 'The carbon in methane is sp hybridised.'],
    ],
  }),
  ...facts(9, 'b', {
    define: [
      ['Markovnikov’s rule', 'When HX adds to an unsymmetrical alkene, the hydrogen goes to the carbon that already has more hydrogens.'],
      ['ozonolysis', 'Breaking a double bond using ozone, followed by zinc and water, to give carbonyl compounds.'],
      ['geometrical isomerism', 'Isomerism from different arrangements of groups about a double bond, which can’t rotate.'],
      ['a carbocation', 'An ion with a positive charge on a carbon atom.'],
    ],
    recall: [
      ['Alkenes mainly undergo:', 'electrophilic addition', 'nucleophilic substitution', 'free radical addition only', 'elimination'],
      ['Ethene with hydrogen over nickel gives:', 'ethane', 'ethyne', 'ethanol', 'methane'],
      ['The carbon atoms in ethene are:', 'sp² hybridised', 'sp³ hybridised', 'sp hybridised', 'unhybridised'],
    ],
    reason: [
      ['Markovnikov’s rule works.', 'Addition goes through the more stable carbocation.', 'A secondary one is favoured over a primary one.'],
      ['But-2-ene shows geometrical isomerism, but but-1-ene doesn’t.', 'In but-2-ene each double-bonded carbon has two different groups.', 'In but-1-ene, one carbon has two hydrogens.'],
    ],
    compare: [
      ['cis isomers', 'trans isomers', ['Like groups on the same side of the double bond.', 'Like groups on opposite sides of the double bond.'], ['Usually have a higher boiling point.', 'Usually have a higher melting point.']],
    ],
    truths: [
      ['The peroxide effect reverses the direction of HBr addition.', 'The peroxide effect stops HBr adding altogether.'],
      ['A double bond is one sigma and one pi bond.', 'A double bond is two sigma bonds.'],
      ['Baeyer’s reagent is decolourised by alkenes.', 'Baeyer’s reagent is decolourised by alkanes.'],
    ],
  }),
  ...facts(9, 'c', {
    define: [
      ['an alkyne', 'A hydrocarbon with a carbon–carbon triple bond, with the general formula CₙH₂ₙ₋₂.'],
    ],
    recall: [
      ['Ethyne is made from calcium carbide with:', 'water', 'hydrogen', 'chlorine', 'an alkali'],
      ['Terminal alkynes are:', 'weakly acidic', 'strongly basic', 'neutral with sodium', 'strongly acidic'],
      ['Which test separates but-1-yne from but-2-yne?', 'Ammoniacal silver nitrate', 'Bromine water', 'Baeyer’s reagent', 'Lucas reagent'],
      ['The hydration of ethyne with dilute H₂SO₄ and HgSO₄ gives:', 'ethanal', 'ethanol', 'ethanoic acid', 'ethene'],
    ],
    reason: [
      ['Ethyne is more acidic than ethene.', 'Its sp carbon has more s character.', 'So it holds the C–H electrons more tightly.'],
    ],
    truths: [
      ['Ethyne is a linear molecule.', 'Ethyne is a bent molecule.'],
      ['A triple bond is one sigma and two pi bonds.', 'A triple bond is three sigma bonds.'],
      ['Terminal alkynes give a white precipitate with ammoniacal silver nitrate.', 'Internal alkynes give a white precipitate with ammoniacal silver nitrate.'],
    ],
  }),
  ...facts(9, 'd', {
    define: [
      ['aromaticity', 'The extra stability of a flat, cyclic, conjugated molecule with 4n + 2 pi electrons.'],
      ['Friedel–Crafts alkylation', 'Adding an alkyl group to benzene, using an alkyl halide and anhydrous AlCl₃.'],
    ],
    recall: [
      ['Benzene mainly undergoes:', 'electrophilic substitution', 'electrophilic addition', 'nucleophilic addition', 'elimination'],
      ['Which group directs to the meta position?', '–NO₂', '–OH', '–CH₃', '–NH₂'],
      ['Which group directs to the ortho and para positions?', '–OH', '–NO₂', '–COOH', '–CHO'],
      ['Nitration of benzene uses:', 'concentrated HNO₃ and H₂SO₄', 'dilute HNO₃ alone', 'NaOH', 'HCl'],
    ],
    reason: [
      ['Benzene prefers substitution to addition.', 'Substitution keeps its stable aromatic ring.', 'Addition would destroy it.'],
      ['Anhydrous AlCl₃ is needed for Friedel–Crafts reactions.', 'Water would react with it, and destroy the catalyst.'],
    ],
    compare: [
      ['activating groups', 'deactivating groups', ['Make the ring react faster.', 'Make the ring react slower.'], ['Usually direct ortho and para.', 'Usually direct meta.']],
    ],
    truths: [
      ['All carbon–carbon bonds in benzene have the same length.', 'Benzene has three short and three long carbon–carbon bonds.'],
      ['Nitration uses NO₂⁺ as its electrophile.', 'Nitration uses NO₂⁻ as its electrophile.'],
      ['Hückel’s rule requires 4n + 2 pi electrons.', 'Hückel’s rule requires 4n pi electrons.'],
    ],
  }),

  // ---- Unit 10: Practical work
  ...facts(10, 'a', {
    recall: [
      ['A burette is read from the:', 'bottom of the meniscus', 'top of the meniscus', 'side of the glass', 'top of the liquid’s drop'],
      ['A pipette is used to:', 'measure a fixed volume of liquid', 'heat a liquid', 'mix solutions', 'filter a solid'],
      ['A titration should be repeated until:', 'readings agree closely', 'the burette is empty', 'the colour is very dark', 'the flask is full'],
    ],
    truths: [
      ['A conical flask is rinsed only with distilled water before a titration.', 'A conical flask is rinsed with the solution to be titrated before a titration.'],
      ['A burette is rinsed with the solution it will hold.', 'A burette is rinsed only with distilled water, and used wet.'],
      ['Air bubbles in a burette’s tip cause a wrong reading.', 'Air bubbles in a burette’s tip never affect the reading.'],
    ],
    reason: [
      ['A burette is rinsed with the solution it will hold.', 'Any water left inside would dilute that solution.'],
    ],
  }),
  ...rest(),
  ...derivationBlueprints('chemistry', 'XI', { custom } as never),
];

export default blueprints;
