// How the old Chemistry units map onto the 2028 syllabus, and what it leaves out.

export const map = {
  XI: {
    1: { unit: 1, topic: 'b', sub: { 'Laws of Chemical Combination': 'a', 'Measurement, Units & Significant Figures': 'a', 'Concentration Terms': 'c', 'Equivalent Weights': 'c' } },
    2: { unit: 2, topic: 'a', sub: { 'Quantum Mechanical Model': 'b', 'Electronic Configuration': 'b' } },
    3: { unit: 3, topic: 'a', sub: {} },
    4: { unit: 4, topic: 'a', sub: { 'VBT, MOT, VSEPR': 'b', 'VSEPR Theory & Geometry': 'b', 'Molecular Orbital Theory': 'b' } },
    // Unit 5 has gone. The few gas relations that thermodynamics needs move to Unit 1.
    5: { unit: 1, topic: 'b', sub: {} },
    6: { unit: 5, topic: 'a', sub: { 'Second Law & Entropy': 'b', 'Gibbs & Helmholtz Energy': 'b', 'Enthalpy, Entropy, Gibbs': 'a' } },
    7: { unit: 6, topic: 'b', sub: { 'Law of Mass Action & Equilibrium Constants': 'a', 'Degree of Dissociation': 'a', "Le Chatelier's Principle & Factors": 'a' } },
    8: { unit: 7, topic: 'a', sub: {} },
    9: { unit: 1, topic: 'a', sub: {} },
    10: { unit: 8, topic: 'a', sub: { 'Electronic Effects & Intermediates': 'c', 'Types of Reactions & Mechanisms': 'c', 'Purification & Analysis': 'b' } },
    11: { unit: 9, topic: 'a', sub: { 'Alkenes: Preparation': 'b', 'Alkenes: Reactions': 'b', Alkynes: 'c', 'Aromatic Hydrocarbons': 'd' } },
    12: { unit: 10, topic: 'b', sub: { 'Titration Calculations': 'a', 'Preparation of Inorganic Compounds': 'c', 'Paper Chromatography': 'd' } },
  },
  XII: {
    1: { unit: 1, topic: 'a', sub: {} },
    2: { unit: 1, topic: 'a', sub: {} },
    3: { unit: 2, topic: 'a', sub: { 'Cells & Conductance': 'b', 'Electrolysis & Faraday\'s Laws': 'b', 'Batteries & Fuel Cells': 'c', Corrosion: 'c' } },
    4: { unit: 3, topic: 'a', sub: { 'Temperature & Catalyst: Arrhenius': 'b' } },
    5: { unit: 1, topic: 'a', sub: {} },
    6: {
      unit: 5,
      topic: 'a',
      sub: { 'd-Block: Configuration & Properties': [4, 'a'], 'f-Block: Lanthanoids & Actinoids': [4, 'a'], 'Potassium Dichromate': [4, 'b'], 'Potassium Permanganate': [4, 'b'] },
    },
    7: {
      unit: 7,
      topic: 'a',
      sub: {
        'Important Reactions': [6, 'a'],
        'Haloalkanes: General & Nomenclature': [6, 'a'],
        'Preparation of Haloalkanes': [6, 'a'],
        'Reactions of Haloalkanes': [6, 'a'],
        'SN1, SN2 and Elimination': [6, 'a'],
        Haloarenes: [6, 'b'],
        'Polyhalogen Compounds': [6, 'c'],
        'Phenols: Preparation': 'b',
        'Phenols: Reactions': 'b',
        Ethers: 'c',
      },
    },
    8: { unit: 8, topic: 'a', sub: { 'Carboxylic Acids: Preparation': 'b', 'Carboxylic Acids: Properties': 'b', 'Formic Acid, Acetic Acid & Tests': 'b' } },
    9: {
      unit: 9,
      topic: 'a',
      sub: { 'Cyanides & Isocyanides': 'b', 'Diazonium Salts': 'c', Carbohydrates: [10, 'a'], 'Amino Acids & Proteins': [10, 'b'], Vitamins: [10, 'c'], 'Nucleic Acids': [10, 'd'] },
    },
    10: { unit: 9, topic: 'a', sub: {} },
    11: { unit: 11, topic: 'd', sub: { 'Volumetric Analysis (Titrations)': 'a', 'Rate of Reaction Practical': 'b', 'Electrochemistry Practical': 'b', 'pH Practical': 'b', 'Organic Functional Group Tests': 'c', 'Preparation of Inorganic Compounds (Related)': 'a' } },
  },
};

const out = (name, reason, ref, extra = {}) => ({ name, verdict: 'out', reason, ref, ...extra });
const notNeeded = (name, reason) => ({ name, verdict: 'not-needed', reason });
const review = (test, question) => ({ ...test, verdict: 'review', reason: question, force: true });

const KEEP_GAS = /^(Ideal gas law|Gas constant in different units|Standard temperature and pressure|Ideal gas equation in terms of (density|mass))$/;

export const rules = [
  // Units that are simply not in the 2028 syllabus. These come first, so older-paper hits go to review.
  { level: 'XI', unit: 5, name: KEEP_GAS, verdict: 'supporting' },
  { level: 'XI', unit: 5, verdict: 'out', reason: 'States of Matter is not a unit in the 2028 Chemistry syllabus. Gas laws are covered in Physics Unit 9.', ref: 'XI units 1 to 9' },
  { level: 'XI', unit: 9, verdict: 'out', reason: 'Hydrogen and the s-block are not in the 2028 syllabus.', ref: 'XI units 1 to 9' },
  { level: 'XII', unit: 1, name: /^Lattice enthalpy$/, verdict: 'supporting' },
  { level: 'XII', unit: 1, verdict: 'out', reason: 'Solid State is not a unit in the 2028 syllabus.', ref: 'XII units 1 to 10' },
  { level: 'XII', unit: 5, verdict: 'out', reason: 'Surface Chemistry is not a unit in the 2028 syllabus.', ref: 'XII units 1 to 10' },
  { level: 'XII', unit: 10, verdict: 'out', reason: 'Polymers and Chemistry in Everyday Life are not units in the 2028 syllabus.', ref: 'XII units 1 to 10' },

  // Class XI
  { level: 'XI', sub: 'Effective Nuclear Charge (Slater)', verdict: 'out', reason: 'The syllabus names screening and shielding qualitatively. Slater\'s rules are not listed.', ref: 'XI Unit 3(iii)' },
  out(/Effective nuclear charge \(Slater\)|Mulliken|Allred-Rochow|Born-Lande|Conversion between Mulliken/, 'Not listed in the syllabus, which names lattice enthalpy through the Born-Haber cycle and electronegativity generally.', 'XI Units 3, 4'),
  out(/Hamiltonian|Schrodinger equation \(Cartesian|Normalisation condition|Orbital magnetic moment|Bohr magneton|Z-component of angular momentum|Spin angular momentum|^Total spin$|Radial probability$/, 'The syllabus says "a simple mathematical treatment" and asks only for the physical significance of Ψ and |Ψ|².', 'XI Unit 2(v)'),
  out(/Statistical \(Boltzmann\) entropy|Clausius inequality|Trouton|Entropy change on heating|Entropy change of ideal gas \(general\)|Kirchhoff's equation|^Non-expansion \(useful\) work$|Efficiency of heat engine/, 'Not listed under Chemical Thermodynamics.', 'XI Unit 5'),
  out(/Van't Hoff (equation|linear)/, 'Not listed under Equilibrium.', 'XI Unit 6(i)'),
  out(/Dumas method|Volume of nitrogen at STP/, 'The syllabus names Liebig, Kjeldahl and Carius. Dumas is not listed.', 'XI Unit 8(vi)'),
  out(/Conformations of butane/, 'The syllabus says "conformation (methane and ethane)".', 'XI Unit 9(i)'),
  out(/Optical purity|enantiomeric excess/, 'Not listed under isomerism.', 'XI Unit 8(iv)'),

  // Class XII
  out(/Debye-Huckel|Hall-Heroult/, 'Not listed under Electrochemistry.', 'XII Unit 2'),
  out(/Second-order|Half-life of nth order|Units of k: third order/, 'The syllabus says: "Integrated rate equations and half-life (only for zero and first order reactions)".', 'XII Unit 3', { force: true }),
  out(/Effective atomic number|^EAN of|Metal carbonyl bonding|Estimation of hardness of water/, 'Not listed under Coordination Compounds.', 'XII Unit 5'),
  out(/Gattermann-Koch|Claisen condensation|Polymerisation of methanal|Trimerisation of ethanal|urotropine|hemiacetal|Ketal formation|Crossed Cannizzaro/, 'Not in the list of preparations and reactions in Unit 8.', 'XII Unit 8'),
  out(/Bakelite|aspirin|Reduction of phenol to cyclohexanol/, 'Not in the list of phenol reactions in Unit 7, and polymers have gone.', 'XII Unit 7'),
  out(/Hofmann exhaustive methylation|Hofmann elimination|Reduction of nitro to aniline \(partial|Reduction of diazonium salt to phenylhydrazine/, 'Not in the list of amine and diazonium reactions in Unit 9.', 'XII Unit 9'),
  out(/[Cc]hromyl chloride test/, 'The syllabus says: "Chromyl chloride test not to be performed".', 'Paper II'),

  notNeeded(/^(Water density at 4 deg C|Volume units|Length units|Mass units|Example of law of multiple proportions|Hydrogen deficiency per unit|Meaning of degree of unsaturation|Number of molecules in 22\.4 L at STP|Mass of one mole of electrons)$/, 'A restated fact, not used in answering questions.'),
  notNeeded(/^Kb and Kf of |Henry's constant for gases|pKa values of common acids|pKb values of common amines|Radioactive decay \(first order\)|Carbonic acid buffer in blood|Gas in gas solution example|Liquid in solid solution example|Gas in solid solution example/, 'A reference value or example. Papers give the data they need.'),

  // Questions for the student
  review({ level: 'XI', sub: 'Equivalent Weights', name: /standard values|common substances/ }, 'Lists of equivalent masses: the method is in the syllabus, but are ready-made values useful?'),
];

export const supportingSubs = new Set(['Types of Solutions', 'Atomic & Molecular Quantities', 'Subatomic Particles & Nuclear Symbols']);
