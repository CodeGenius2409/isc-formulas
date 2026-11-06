// Chemistry, Class XII. Numericals come from the solver registry. Named compounds and their drawings come from the
// structures checked against PubChem and RDKit, and reactions only join compounds from that same list.
import { derivationBlueprints } from '../derivations';
import KNOWLEDGE from './knowledge/chemistry-xii';
import { blueprintsFor, n } from './dsl';
import type { Blueprint } from './types';
import type { Gen } from '../../practice/gen/gen';

const { num, mcqNum, facts, custom, rest } = blueprintsFor('chemistry', 'XII', KNOWLEDGE);

/** Compound key and name, by family. Keys match src/data/generated/structures.json, which a test confirms. */
const FAMILIES: Record<string, [string, string][]> = {
  haloalkanes: [['chloromethane', 'Chloromethane'], ['bromoethane', 'Bromoethane'], ['iodoethane', 'Iodoethane'], ['1-bromopropane', '1-Bromopropane'], ['2-bromopropane', '2-Bromopropane'], ['2-bromobutane', '2-Bromobutane'], ['tert-butyl-bromide', '2-Bromo-2-methylpropane'], ['chloroform', 'Trichloromethane']],
  alcohols: [['methanol', 'Methanol'], ['ethanol', 'Ethanol'], ['propan-1-ol', 'Propan-1-ol'], ['propan-2-ol', 'Propan-2-ol'], ['tert-butanol', '2-Methylpropan-2-ol'], ['glycol', 'Ethane-1,2-diol'], ['benzyl-alcohol', 'Benzyl alcohol']],
  ethers: [['diethyl-ether', 'Ethoxyethane'], ['anisole', 'Methoxybenzene'], ['mtbe', '2-Methoxy-2-methylpropane'], ['2-methylanisole', '2-Methylanisole'], ['4-nitroanisole', '4-Nitroanisole']],
  carbonyls: [['ethanal', 'Ethanal'], ['propanal', 'Propanal'], ['propanone', 'Propanone'], ['benzaldehyde', 'Benzaldehyde'], ['acetophenone', 'Acetophenone'], ['crotonaldehyde', 'But-2-enal'], ['3-nitrobenzaldehyde', '3-Nitrobenzaldehyde']],
  acids: [['formic-acid', 'Methanoic acid'], ['acetic-acid', 'Ethanoic acid'], ['propanoic-acid', 'Propanoic acid'], ['oxalic-acid', 'Ethanedioic acid'], ['benzoic-acid', 'Benzoic acid'], ['chloroacetic-acid', 'Chloroethanoic acid']],
  amines: [['methylamine', 'Methanamine'], ['ethylamine', 'Ethanamine'], ['aniline', 'Aniline'], ['dimethylaniline', 'N,N-Dimethylaniline'], ['acetanilide', 'N-Phenylethanamide'], ['tribromoaniline', '2,4,6-Tribromoaniline']],
};

const GROUPS: [string, string][] = [
  ['ethanol', 'Alcohol'], ['phenol', 'Phenol'], ['diethyl-ether', 'Ether'], ['ethanal', 'Aldehyde'], ['propanone', 'Ketone'], ['acetic-acid', 'Carboxylic acid'], ['ethyl-acetate', 'Ester'], ['acetyl-chloride', 'Acid chloride'], ['acetamide', 'Amide'], ['acetonitrile', 'Nitrile'], ['methylamine', 'Primary amine'], ['nitrobenzene', 'Nitro group'], ['chloroethane', 'Alkyl halide'], ['chlorobenzene', 'Aryl halide'], ['phenyl-isocyanide', 'Isocyanide'],
];
const GROUP_NAMES = [...new Set(GROUPS.map((g) => g[1]))];

/** Reagent facts, with products as compound keys from the checked list. Wrong options are near neighbours. */
interface Reaction {
  from: string;
  reagent: string;
  to: string;
  name?: string;
  wrong: [string, string, string];
  because: string;
  unit: number;
  topic: string;
}
const NAME: Record<string, string> = Object.fromEntries(Object.values(FAMILIES).flat());
Object.assign(NAME, { phenol: 'Phenol', ethene: 'Ethene', propene: 'Propene', acetonitrile: 'Ethanenitrile', 'sodium-acetate': 'Sodium ethanoate', 'ethyl-acetate': 'Ethyl ethanoate', 'sodium-phenoxide': 'Sodium phenoxide', 'salicylic-acid': '2-Hydroxybenzoic acid', salicylaldehyde: '2-Hydroxybenzaldehyde', 'picric-acid': '2,4,6-Trinitrophenol', tribromophenol: '2,4,6-Tribromophenol', chlorobenzene: 'Chlorobenzene', iodobenzene: 'Iodobenzene', benzene: 'Benzene', nitrobenzene: 'Nitrobenzene', 'phenyl-isocyanide': 'Phenyl isocyanide', 'ethyl-isocyanide': 'Ethyl isocyanide', iodoform: 'Triiodomethane', methane: 'Methane', ethane: 'Ethane', toluene: 'Toluene', acetamide: 'Ethanamide', benzamide: 'Benzamide', propanenitrile: 'Propanenitrile', benzonitrile: 'Benzonitrile', diazonium: 'Benzenediazonium chloride', 'acetyl-chloride': 'Ethanoyl chloride', hydroxyazobenzene: '4-Hydroxyazobenzene', aminoazobenzene: '4-Aminoazobenzene', aldol: '3-Hydroxybutanal', 'sodium-benzoate': 'Sodium benzoate', 'sodium-formate': 'Sodium methanoate', methanal: 'Methanal', 'phthalic-anhydride': 'Phthalic anhydride', 'acetic-anhydride': 'Ethanoic anhydride', bromobenzene: 'Bromobenzene', 'cumene-hydroperoxide': 'Cumene hydroperoxide', cumene: 'Cumene', 'sodium-ethoxide': 'Sodium ethoxide' });

const REACTIONS: Reaction[] = [
  { from: 'bromoethane', reagent: 'aqueous KOH', to: 'ethanol', wrong: ['ethene', 'diethyl-ether', 'ethanal'], because: 'Aqueous hydroxide substitutes for the halogen, by nucleophilic substitution.', unit: 6, topic: 'a' },
  { from: 'bromoethane', reagent: 'alcoholic KOH', to: 'ethene', wrong: ['ethanol', 'diethyl-ether', 'ethane'], because: 'Alcoholic KOH removes HBr, which is elimination.', unit: 6, topic: 'a' },
  { from: 'bromoethane', reagent: 'alcoholic KCN', to: 'propanenitrile', wrong: ['ethyl-isocyanide', 'ethylamine', 'propanoic-acid'], because: 'The cyanide ion attacks through carbon, which lengthens the chain by one carbon.', unit: 6, topic: 'a' },
  { from: 'bromoethane', reagent: 'alcoholic AgCN', to: 'ethyl-isocyanide', wrong: ['propanenitrile', 'ethylamine', 'ethanol'], because: 'AgCN is mainly covalent, so it attacks through nitrogen to give the isocyanide.', unit: 6, topic: 'a' },
  { from: 'chlorobenzene', reagent: 'aqueous NaOH at 623 K and 300 atm, followed by acid', to: 'phenol', wrong: ['benzene', 'aniline', 'anisole'], name: 'Dow’s process', because: 'The C–Cl bond in an aryl halide is strong, so these harsh conditions are needed.', unit: 6, topic: 'b' },
  { from: 'diazonium', reagent: 'CuCl and HCl', to: 'chlorobenzene', wrong: ['phenol', 'benzene', 'aniline'], name: 'Sandmeyer reaction', because: 'Copper(I) chloride replaces the diazonium group with chlorine.', unit: 9, topic: 'c' },
  { from: 'diazonium', reagent: 'warm water', to: 'phenol', wrong: ['chlorobenzene', 'benzene', 'aniline'], because: 'Warming in water replaces the diazonium group with –OH, releasing nitrogen.', unit: 9, topic: 'c' },
  { from: 'diazonium', reagent: 'aqueous KI', to: 'iodobenzene', wrong: ['chlorobenzene', 'phenol', 'benzene'], because: 'Iodide replaces the diazonium group without a copper catalyst.', unit: 9, topic: 'c' },
  { from: 'diazonium', reagent: 'H₃PO₂ and water', to: 'benzene', wrong: ['phenol', 'aniline', 'chlorobenzene'], because: 'Hypophosphorous acid replaces the diazonium group with hydrogen.', unit: 9, topic: 'c' },
  { from: 'diazonium', reagent: 'phenol in alkali, at low temperature', to: 'hydroxyazobenzene', wrong: ['phenol', 'aminoazobenzene', 'chlorobenzene'], name: 'Coupling reaction', because: 'The diazonium ion attacks the para position of the phenoxide, forming an orange azo dye.', unit: 9, topic: 'c' },
  { from: 'ethanol', reagent: 'concentrated H₂SO₄ at 443 K', to: 'ethene', wrong: ['diethyl-ether', 'ethanal', 'acetic-acid'], because: 'At the higher temperature, ethanol loses water from one molecule, giving the alkene.', unit: 7, topic: 'a' },
  { from: 'ethanol', reagent: 'concentrated H₂SO₄ at 413 K', to: 'diethyl-ether', wrong: ['ethene', 'ethanal', 'acetic-acid'], because: 'At the lower temperature, two ethanol molecules lose one water between them, giving the ether.', unit: 7, topic: 'a' },
  { from: 'ethanol', reagent: 'PCC', to: 'ethanal', wrong: ['acetic-acid', 'ethene', 'diethyl-ether'], because: 'PCC is a mild oxidising agent, so oxidation stops at the aldehyde.', unit: 7, topic: 'a' },
  { from: 'propan-2-ol', reagent: 'hot copper at 573 K', to: 'propanone', wrong: ['propanal', 'propene', 'propanoic-acid'], because: 'A secondary alcohol is dehydrogenated to a ketone.', unit: 7, topic: 'a' },
  { from: 'phenol', reagent: 'bromine water', to: 'tribromophenol', wrong: ['bromobenzene', 'benzene', 'picric-acid'], because: 'The –OH group activates the ring strongly, so all three ortho and para positions react.', unit: 7, topic: 'b' },
  { from: 'phenol', reagent: 'concentrated HNO₃', to: 'picric-acid', wrong: ['nitrobenzene', 'tribromophenol', 'salicylic-acid'], because: 'The activated ring takes three nitro groups.', unit: 7, topic: 'b' },
  { from: 'phenol', reagent: 'CHCl₃ and aqueous NaOH, followed by acid', to: 'salicylaldehyde', wrong: ['salicylic-acid', 'benzoic-acid', 'picric-acid'], name: 'Reimer–Tiemann reaction', because: 'Dichlorocarbene attacks the ortho position, giving an aldehyde after hydrolysis.', unit: 7, topic: 'b' },
  { from: 'sodium-phenoxide', reagent: 'CO₂ at 400 K and 4–7 atm, followed by acid', to: 'salicylic-acid', wrong: ['salicylaldehyde', 'benzoic-acid', 'phenol'], name: 'Kolbe’s reaction', because: 'Carbon dioxide attacks the ortho position of the phenoxide ion.', unit: 7, topic: 'b' },
  { from: 'phenol', reagent: 'zinc dust and heat', to: 'benzene', wrong: ['toluene', 'chlorobenzene', 'anisole'], because: 'Zinc removes the oxygen from phenol.', unit: 7, topic: 'b' },
  { from: 'sodium-ethoxide', reagent: 'bromoethane', to: 'diethyl-ether', wrong: ['ethanol', 'ethene', 'ethanal'], name: 'Williamson synthesis', because: 'The alkoxide ion displaces the halide from a primary halide.', unit: 7, topic: 'c' },
  { from: 'ethanal', reagent: 'dilute NaOH', to: 'aldol', wrong: ['ethanol', 'acetic-acid', 'propanone'], name: 'Aldol condensation', because: 'An aldehyde with an α-hydrogen forms an enolate, which adds to a second molecule.', unit: 8, topic: 'a' },
  { from: 'benzaldehyde', reagent: 'concentrated NaOH', to: 'sodium-benzoate', wrong: ['benzoic-acid', 'phenol', 'benzene'], name: 'Cannizzaro reaction', because: 'With no α-hydrogen, one molecule is oxidised to the salt and another reduced to the alcohol.', unit: 8, topic: 'a' },
  { from: 'ethanal', reagent: 'Tollens’ reagent', to: 'acetic-acid', wrong: ['ethanol', 'propanone', 'methanal'], because: 'Aldehydes reduce the silver ion to silver, and are oxidised to the acid.', unit: 8, topic: 'a' },
  { from: 'acetic-acid', reagent: 'ethanol and concentrated H₂SO₄', to: 'ethyl-acetate', wrong: ['acetyl-chloride', 'acetamide', 'ethanal'], name: 'Esterification', because: 'Acid and alcohol join, losing water, with the acid as catalyst.', unit: 8, topic: 'b' },
  { from: 'acetic-acid', reagent: 'PCl₅', to: 'acetyl-chloride', wrong: ['ethyl-acetate', 'acetamide', 'chloroacetic-acid'], because: 'PCl₅ replaces the –OH of the acid with –Cl.', unit: 8, topic: 'b' },
  { from: 'acetic-acid', reagent: 'Cl₂ with red phosphorus', to: 'chloroacetic-acid', wrong: ['acetyl-chloride', 'chloroform', 'chloromethane'], name: 'Hell–Volhard–Zelinsky reaction', because: 'Chlorine substitutes at the α-carbon.', unit: 8, topic: 'b' },
  { from: 'sodium-acetate', reagent: 'soda lime and heat', to: 'methane', wrong: ['ethane', 'ethene', 'methanol'], name: 'Decarboxylation', because: 'The salt loses CO₂, giving an alkane with one carbon fewer.', unit: 8, topic: 'b' },
  { from: 'nitrobenzene', reagent: 'tin and concentrated HCl', to: 'aniline', wrong: ['phenol', 'benzene', 'benzamide'], because: 'The nitro group is reduced to an amine.', unit: 9, topic: 'a' },
  { from: 'aniline', reagent: 'CHCl₃ and alcoholic KOH, with heat', to: 'phenyl-isocyanide', wrong: ['benzonitrile', 'phenol', 'chlorobenzene'], name: 'Carbylamine test', because: 'A primary amine gives a foul-smelling isocyanide.', unit: 9, topic: 'a' },
  { from: 'aniline', reagent: 'NaNO₂ and dilute HCl at 273–278 K', to: 'diazonium', wrong: ['phenol', 'nitrobenzene', 'chlorobenzene'], name: 'Diazotisation', because: 'Nitrous acid converts the aromatic amine to a diazonium salt, which is stable only when cold.', unit: 9, topic: 'c' },
  { from: 'aniline', reagent: 'bromine water', to: 'tribromoaniline', wrong: ['bromobenzene', 'tribromophenol', 'acetanilide'], because: 'The –NH₂ group activates the ring strongly, so it reacts at all three ortho and para positions.', unit: 9, topic: 'a' },
  { from: 'aniline', reagent: 'ethanoyl chloride', to: 'acetanilide', wrong: ['tribromoaniline', 'benzamide', 'phenol'], name: 'Acylation', because: 'The amine’s nitrogen attacks the acid chloride, forming an amide.', unit: 9, topic: 'a' },
  { from: 'acetamide', reagent: 'bromine and aqueous KOH', to: 'methylamine', wrong: ['ethylamine', 'acetic-acid', 'acetonitrile'], name: 'Hoffmann bromamide degradation', because: 'The amide loses its carbonyl carbon, giving an amine with one carbon fewer.', unit: 9, topic: 'a' },
  { from: 'acetonitrile', reagent: 'dilute acid, and heat', to: 'acetic-acid', wrong: ['ethylamine', 'ethanal', 'acetamide'], because: 'Complete hydrolysis of a nitrile gives the carboxylic acid.', unit: 9, topic: 'b' },
  { from: 'acetonitrile', reagent: 'LiAlH₄', to: 'ethylamine', wrong: ['methylamine', 'ethanal', 'acetic-acid'], because: 'Reduction of a nitrile gives a primary amine with the same number of carbons.', unit: 9, topic: 'b' },
];
const nameOf = (key: string): string => {
  const name = NAME[key];
  if (!name) throw new Error(`No name for ${key}`);
  return name;
};

function nameThis(family: string) {
  return (g: Gen) => {
    const list = FAMILIES[family];
    const [compound, name] = g.pick(list);
    const others = g.sample(list.filter((c) => c[0] !== compound), 3).map((c) => c[1]);
    return g.mcq('Name the compound drawn here.', name, others, { structure: { list: [compound], unnamed: 1 } });
  };
}

function predict(r: Reaction, g: Gen) {
  return g.mcq(`${nameOf(r.from)} is treated with ${r.reagent}. Which is the main organic product?`, nameOf(r.to), r.wrong.map(nameOf), { why: `${r.name ? `${r.name}. ` : ''}${r.because}`, structure: { list: [r.from] } });
}

function reactionsOf(unit: number, topic: string) {
  return REACTIONS.filter((r) => r.unit === unit && r.topic === topic);
}

/** One topic's reactions, as multiple choice, a short "write the equation", and a chain in three steps. */
function reactionBlueprints(unit: number, topic: string): Blueprint[] {
  const list = reactionsOf(unit, topic);
  if (!list.length) return [];
  return [
    custom(`predict-${topic}`, [unit, topic, 1, 2], { type: 'mcq', format: 'mcq' }, (g) => predict(g.pick(list), g)),
    custom(`name-it-${topic}`, [unit, topic, 2, 2], { type: 'reaction', format: 'short' }, (g) => {
      const r = g.pick(list);
      return g.theory(`What happens when ${nameOf(r.from).toLowerCase()} is treated with ${r.reagent}? Name the product${r.name ? ', and name the reaction' : ''}.`, [`The product is ${nameOf(r.to).toLowerCase()}.`, r.name ? `This is the ${r.name}. ${r.because}` : r.because]);
    }),
  ];
}

const COMPLEXES: { f: string; name: string; ox: string; cn: number; hyb: string; shape: string; mag: string; unp: number; ligand: string }[] = [
  { f: '[Co(NH₃)₆]³⁺', name: 'hexaamminecobalt(III) ion', ox: '+3', cn: 6, hyb: 'd²sp³', shape: 'octahedral', mag: 'diamagnetic', unp: 0, ligand: 'NH₃' },
  { f: '[Fe(CN)₆]⁴⁻', name: 'hexacyanidoferrate(II) ion', ox: '+2', cn: 6, hyb: 'd²sp³', shape: 'octahedral', mag: 'diamagnetic', unp: 0, ligand: 'CN⁻' },
  { f: '[Fe(CN)₆]³⁻', name: 'hexacyanidoferrate(III) ion', ox: '+3', cn: 6, hyb: 'd²sp³', shape: 'octahedral', mag: 'paramagnetic', unp: 1, ligand: 'CN⁻' },
  { f: '[Ni(CN)₄]²⁻', name: 'tetracyanidonickelate(II) ion', ox: '+2', cn: 4, hyb: 'dsp²', shape: 'square planar', mag: 'diamagnetic', unp: 0, ligand: 'CN⁻' },
  { f: '[NiCl₄]²⁻', name: 'tetrachloridonickelate(II) ion', ox: '+2', cn: 4, hyb: 'sp³', shape: 'tetrahedral', mag: 'paramagnetic', unp: 2, ligand: 'Cl⁻' },
  { f: '[Cu(NH₃)₄]²⁺', name: 'tetraamminecopper(II) ion', ox: '+2', cn: 4, hyb: 'dsp²', shape: 'square planar', mag: 'paramagnetic', unp: 1, ligand: 'NH₃' },
  { f: '[Zn(NH₃)₄]²⁺', name: 'tetraamminezinc(II) ion', ox: '+2', cn: 4, hyb: 'sp³', shape: 'tetrahedral', mag: 'diamagnetic', unp: 0, ligand: 'NH₃' },
  { f: '[Ag(NH₃)₂]⁺', name: 'diamminesilver(I) ion', ox: '+1', cn: 2, hyb: 'sp', shape: 'linear', mag: 'diamagnetic', unp: 0, ligand: 'NH₃' },
  { f: '[CoF₆]³⁻', name: 'hexafluoridocobaltate(III) ion', ox: '+3', cn: 6, hyb: 'sp³d²', shape: 'octahedral', mag: 'paramagnetic', unp: 4, ligand: 'F⁻' },
  { f: '[Fe(H₂O)₆]²⁺', name: 'hexaaquairon(II) ion', ox: '+2', cn: 6, hyb: 'sp³d²', shape: 'octahedral', mag: 'paramagnetic', unp: 4, ligand: 'H₂O' },
  { f: '[Cr(H₂O)₆]³⁺', name: 'hexaaquachromium(III) ion', ox: '+3', cn: 6, hyb: 'd²sp³', shape: 'octahedral', mag: 'paramagnetic', unp: 3, ligand: 'H₂O' },
  { f: '[Pt(NH₃)₂Cl₂]', name: 'diamminedichloridoplatinum(II)', ox: '+2', cn: 4, hyb: 'dsp²', shape: 'square planar', mag: 'diamagnetic', unp: 0, ligand: 'NH₃ and Cl⁻' },
];

/** Wrong names a student might write: the wrong oxidation state, -ate in a cation or missing from an anion, and the wrong count of the first ligand. */
const ATE: [string, string][] = [['ferrate', 'iron'], ['cobaltate', 'cobalt'], ['nickelate', 'nickel'], ['cuprate', 'copper'], ['zincate', 'zinc'], ['argentate', 'silver'], ['chromate', 'chromium'], ['platinate', 'platinum']];
function nameSlips(name: string): string[] {
  const roman = name.match(/\(([IV]+)\)/)![1];
  const otherState = ({ I: 'II', II: 'III', III: 'II', IV: 'II' } as Record<string, string>)[roman] ?? 'II';
  const state = name.replace(`(${roman})`, `(${otherState})`);
  const anion = ATE.find(([ate]) => name.includes(`${ate}(`));
  const cation = ATE.find(([, metal]) => name.includes(`${metal}(`));
  const ate = anion ? name.replace(`${anion[0]}(`, `${anion[1]}(`) : cation ? name.replace(`${cation[1]}(`, `${cation[0]}(`) : name;
  const count = name.replace(/^(di|tetra|hexa)/, (p) => ({ di: 'tetra', tetra: 'hexa', hexa: 'tetra' } as Record<string, string>)[p]);
  return [state, ate, count];
}

const blueprints: Blueprint[] = [
  // ---- Unit 1: Solutions
  mcqNum('molality-mcq', [1, 'a', 1, 1], {
    text: '{M} mol of a solute is dissolved in {W} g of water. The molality of the solution is:',
    vars: { M: [0.2, 2, 0.2], W: [250, 1000, 250] },
    use: 'c-xii-2-15',
    find: 'm',
    given: { n: 'M mol', W: 'W g' },
    mistakes: (v) => [
      ['left the mass of water in grams', v.M / v.W],
      ['divided by the volume in mL', v.M / (v.W / 1000) / 1000],
      ['inverted the ratio', v.W / 1000 / v.M],
      ['multiplied instead of dividing', v.M * (v.W / 1000)],
      ['doubled the moles', (2 * v.M) / (v.W / 1000)],
    ],
  }),
  num('molarity', [1, 'a', 2, 1], {
    text: '{G} g of {scene} (molar mass {M} g/mol) is dissolved to make {V} mL of solution. Find the molarity.',
    scenes: ['a solute'],
    vars: { G: [5, 40, 5], M: [40, 180, 20], V: [250, 1000, 250] },
    derive: (v) => ({ N: v.G / v.M }),
    parts: [{ ask: 'Molarity', use: 'c-xii-2-6', find: 'M', given: { n: 'N mol', V: 'V mL' }, marks: 2 }],
  }),
  num('boiling-elevation', [1, 'a', 3, 2], {
    text: '{G} g of a non-volatile solute of molar mass {M} g/mol is dissolved in {W} g of water. K_b for water is 0.52 K kg/mol.',
    vars: { G: [5, 30, 5], M: [60, 180, 20], W: [100, 500, 100] },
    derive: (v) => ({ N: v.G / v.M, MOL: v.G / v.M / (v.W / 1000) }),
    // A dilute solution, as the formula assumes.
    when: (v) => v.MOL <= 1,
    parts: [
      { ask: 'Molality', use: 'c-xii-2-15', find: 'm', given: { n: 'N mol', W: 'W g' }, marks: 1 },
      { ask: 'Elevation in boiling point', use: 'c-xii-2-3', find: 'DeltaT_b', given: { K_b: '0.52 K*kg/mol', m: 'MOL mol/kg' }, marks: 2 },
    ],
  }),
  num('freezing-mass', [1, 'a', 3, 2], {
    variants: [
      { text: 'When {G} g of a non-electrolyte is dissolved in {W} g of water, the freezing point falls by {D} K. K_f for water is 1.86 K kg/mol. Find the molar mass of the solute.', parts: [{ ask: 'Molar mass of the solute', use: 'c-xii-2-57', find: 'M_2', given: { K_f: '1.86 K*kg/mol', w_2: 'G g', DeltaT_f: 'D K', w_1: 'W g' }, marks: 3 }] },
      { text: 'When {G} g of a non-volatile solute is dissolved in {W} g of water, its boiling point rises by {B} K. K_b for water is 0.52 K kg/mol. Find the molar mass of the solute.', parts: [{ ask: 'Molar mass of the solute', use: 'c-xii-2-56', find: 'M_2', given: { K_b: '0.52 K*kg/mol', w_2: 'G g', DeltaT_b: 'B K', w_1: 'W g' }, marks: 3 }] },
    ],
    vars: { G: [2, 20, 2], W: [100, 500, 100], D: [0.2, 1.2, 0.2], B: [0.1, 0.5, 0.1] },
  }),
  num('osmotic', [1, 'a', 3, 2], {
    style: 'cbq-style',
    text: 'A drip for a hospital patient contains {G} g of glucose (molar mass {M} g/mol) per litre of solution, at {T} K. Find the osmotic pressure of the solution.',
    vars: { G: [40, 60, 5], M: [180], T: [300, 310, 2] },
    derive: (v) => ({ C: (v.G / v.M) * 1000 }),
    parts: [{ ask: 'Osmotic pressure', use: 'c-xii-2-5', find: 'pi_o', given: { C: 'C mol/m^3', T: 'T K' }, unit: 'atm', marks: 3 }],
  }),
  num('raoult', [1, 'a', 2, 2], {
    text: 'The vapour pressure of pure water at a certain temperature is {P} mm Hg. A solution has a water mole fraction of {X}. Find the vapour pressure of water above it.',
    vars: { P: [20, 60, 5], X: [0.8, 0.98, 0.02] },
    parts: [{ ask: 'Vapour pressure', use: 'c-xii-2-1', find: 'P_A', given: { x_A: 'X', P_0: 'P mmHg' }, unit: 'mmHg', marks: 2 }],
  }),
  num('vanthoff', [1, 'a', 3, 3], {
    text: 'A solution contains {M} mol/kg of a salt that splits into two ions and is {A}% dissociated. K_f for water is 1.86 K kg/mol.',
    vars: { M: [0.1, 0.5, 0.1], A: [60, 95, 5] },
    derive: (v) => ({ I: 1 + v.A / 100, AL: v.A / 100 }),
    parts: [
      { ask: 'van’t Hoff factor', use: 'c-xii-2-88', find: 'i', given: { alpha: 'AL', n: '2' }, marks: 1 },
      { ask: 'Depression in freezing point', use: 'c-xii-2-14', find: 'DeltaT_f', given: { i: 'I', K_f: '1.86 K*kg/mol', m: 'M mol/kg' }, marks: 2 },
    ],
  }),
  ...facts(1, 'a', {
    define: [
      ['molality', 'The number of moles of solute per kilogram of solvent.'],
      ['molarity', 'The number of moles of solute per litre of solution.'],
      ['mole fraction', 'The moles of one component divided by the total moles of all the components.'],
      ['Raoult’s law', 'For a solution of volatile liquids, the partial vapour pressure of each is proportional to its mole fraction.'],
      ['Henry’s law', 'At constant temperature, the solubility of a gas in a liquid is proportional to the partial pressure of the gas above it.'],
      ['an azeotrope', 'A liquid mixture that boils at a constant temperature, with the vapour having the same composition as the liquid.', 'It can’t be separated by simple distillation.'],
      ['osmosis', 'The flow of solvent through a semipermeable membrane, from the dilute solution to the concentrated one.'],
      ['colligative properties', 'Properties that depend on the number of solute particles, not on their nature.'],
      ['an ideal solution', 'A solution that obeys Raoult’s law at every composition, with no heat or volume change on mixing.'],
    ],
    recall: [
      ['Which of these is a colligative property?', 'Osmotic pressure', 'Density', 'Viscosity', 'Surface tension'],
      ['Molality does not change with temperature because it depends on:', 'mass', 'volume', 'density', 'pressure'],
      ['The van’t Hoff factor for a fully dissociated solution of K₂SO₄ is:', '3', '2', '1', '4'],
      ['A negative deviation from Raoult’s law means that intermolecular attractions in the mixture are:', 'stronger than in the pure liquids', 'weaker than in the pure liquids', 'the same as in the pure liquids', 'zero'],
      ['A solution that has a lower osmotic pressure than another is called:', 'hypotonic', 'hypertonic', 'isotonic', 'saturated'],
      ['Dissolving a non-volatile solute in a solvent:', 'lowers its vapour pressure', 'raises its vapour pressure', 'lowers its boiling point', 'raises its freezing point'],
      ['Which of these solutions has the lowest freezing point?', '0.1 m CaCl₂', '0.1 m NaCl', '0.1 m glucose', '0.1 m urea'],
    ],
    reason: [
      ['Fish find it harder to breathe in warm water.', 'Less oxygen dissolves in water at higher temperatures.', 'Henry’s constant rises with temperature, so solubility falls.'],
      ['Salt is spread on icy roads.', 'Dissolved salt lowers the freezing point of water.', 'So ice melts at temperatures below 0 °C.'],
      ['A cucumber shrinks in salty water.', 'The salt solution is hypertonic to the cucumber’s cells.', 'So water leaves the cells by osmosis.'],
      ['Soft drink bottles are sealed under high pressure.', 'A high pressure of CO₂ raises its solubility, by Henry’s law.', 'Opening the bottle lowers the pressure, so the gas comes out.'],
      ['The boiling point of a solution of a non-volatile solute is higher than that of the solvent.', 'The solute lowers the vapour pressure.', 'So a higher temperature is needed for it to reach atmospheric pressure.'],
    ],
    compare: [
      ['molarity', 'molality', ['Moles per litre of solution.', 'Moles per kilogram of solvent.'], ['Changes with temperature.', 'Doesn’t change with temperature.']],
      ['ideal solutions', 'non-ideal solutions', ['Obey Raoult’s law at every composition.', 'Don’t obey Raoult’s law.'], ['ΔH and ΔV of mixing are zero.', 'ΔH and ΔV of mixing aren’t zero.']],
      ['osmosis', 'diffusion', ['Needs a semipermeable membrane.', 'Needs no membrane.'], ['Only the solvent moves.', 'Both solute and solvent move.']],
    ],
    truths: [
      ['A 1 m solution has one mole of solute per kilogram of solvent.', 'A 1 m solution has one mole of solute per litre of solution.'],
      ['Solutions with the same osmotic pressure are isotonic.', 'Solutions with the same osmotic pressure are hypotonic.'],
      ['Solubility of a gas falls as temperature rises.', 'Solubility of a gas rises as temperature rises.'],
      ['Association of solute particles gives a van’t Hoff factor below one.', 'Association of solute particles gives a van’t Hoff factor above one.'],
      ['A mixture of ethanol and water shows a positive deviation from Raoult’s law.', 'A mixture of ethanol and water shows no deviation from Raoult’s law.'],
    ],
    explain: [
      ['What is reverse osmosis? Give one use.', 'When pressure greater than the osmotic pressure is applied to a solution, the solvent flows out through the membrane.', 'It is used to purify sea water.'],
      ['Why does a 0.1 m solution of NaCl have a lower freezing point than a 0.1 m solution of glucose?', 'NaCl splits into two ions, so it has about twice as many particles.', 'Freezing point depression depends on the number of particles.'],
    ],
    long: [
      ['Show that the relative lowering of vapour pressure equals the mole fraction of the solute, and explain how it can be used to find a molar mass.', 'By Raoult’s law, P = x₁P⁰.', 'So P⁰ − P = P⁰(1 − x₁) = P⁰x₂.', 'Dividing by P⁰ gives (P⁰ − P)/P⁰ = x₂.', 'x₂ is about n₂/n₁ in a dilute solution, which is (w₂/M₂)/(w₁/M₁).', 'So measuring the fall in vapour pressure gives M₂.'],
    ],
    draw: [
      ['Sketch a vapour pressure against temperature graph showing how a non-volatile solute raises the boiling point.', 'Two rising curves, with the solution’s curve lower than the solvent’s.', 'Boiling points marked where each curve reaches 1 atm, with the difference labelled ΔT_b.'],
    ],
    cases: [
      {
        scene: 'Divers breathe compressed air at depth. If they rise too quickly, bubbles of nitrogen can form in the blood and cause the bends, so their tanks are often filled with a mix of oxygen and helium instead.',
        parts: [
          ['Which law explains why more nitrogen dissolves in blood at depth?', 'Henry’s law, as the partial pressure of nitrogen is higher there.', 1],
          ['Why do bubbles form if the diver rises fast?', 'The pressure falls, so the gas’s solubility falls and it comes out of solution.', 1],
          ['Why is helium a good substitute?', 'It’s much less soluble in blood than nitrogen.', 1],
        ],
      },
      {
        scene: 'A nurse prepares a drip for a patient. A solution that’s too concentrated makes red blood cells shrink, and one that’s too dilute makes them swell and burst.',
        parts: [
          ['What term describes a solution with the same osmotic pressure as blood?', 'Isotonic.', 1],
          ['Why do cells shrink in a concentrated solution?', 'The solution is hypertonic, so water moves out of the cells by osmosis.', 1],
          ['Which colligative property is the concern here?', 'Osmotic pressure.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 2: Electrochemistry
  mcqNum('nernst-mcq', [2, 'a', 1, 2], {
    text: 'A cell has E° = {E} V, with n = {N} and a reaction quotient of {Q}, at 298 K. Its emf is closest to:',
    vars: { E: [0.5, 1.5, 0.1], N: [1, 2], Q: [0.1, 10, 100, 1000] },
    use: 'c-xii-3-55',
    find: 'E',
    given: { E0: 'E V', N_v: '0.0591 V', n: 'N', Q: 'Q' },
    mistakes: (v) => [
      ['added the correction term', v.E + (0.0591 / v.N) * Math.log10(v.Q)],
      ['forgot to divide by n', v.E - 0.0591 * Math.log10(v.Q)],
      ['used natural log with 0.0591', v.E - (0.0591 / v.N) * Math.log(v.Q)],
      ['left out the log', v.E - (0.0591 / v.N) * v.Q],
    ],
    digits: 3,
  }),
  num('nernst', [2, 'a', 3, 2], {
    text: 'A cell has a standard emf of {E} V. Two electrons are transferred, and the reaction quotient is {Q}, at 298 K.',
    vars: { E: [0.5, 1.5, 0.1], Q: [10, 100, 1000, 0.1, 0.01] },
    parts: [
      { ask: 'Emf of the cell', use: 'c-xii-3-55', find: 'E', given: { E0: 'E V', N_v: '0.0591 V', n: '2', Q: 'Q' }, marks: 2 },
      { ask: 'Standard Gibbs energy change', use: 'c-xii-3-3', find: 'DeltaG0', given: { n: '2', E0: 'E V' }, unit: 'kJ/mol', marks: 1 },
    ],
  }),
  num('equilibrium-constant', [2, 'a', 2, 2], {
    text: 'A cell reaction involves {N} electrons and has a standard emf of {E} V at 298 K. Find its equilibrium constant K.',
    vars: { N: [1, 3, 1], E: [0.1, 1.1, 0.1] },
    // log K = nE°/0.0591 stays below about 37, as for a Daniell cell.
    when: (v) => v.N * v.E <= 2.2,
    parts: [{ ask: 'Value of K', use: 'c-xii-3-4', find: 'K', given: { n: 'N', E0: 'E V', N_v: '0.0591 V' }, marks: 2 }],
  }),
  num('gibbs', [2, 'a', 2, 1], {
    text: 'Calculate ΔG° for a cell in which {N} moles of electrons are transferred, with E° = {E} V.',
    vars: { N: [1, 2, 3, 6], E: [0.3, 2, 0.1] },
    parts: [{ ask: 'ΔG°', use: 'c-xii-3-3', find: 'DeltaG0', given: { n: 'N', E0: 'E V' }, unit: 'kJ/mol', marks: 2 }],
  }),
  num('electrolysis-mass', [2, 'b', 3, 2], {
    variants: [
      { text: 'A current of {I} A passes through a solution of a metal salt for {T} minutes. The metal has a molar mass of {M} g/mol, and its ions each carry a charge of +{N}. Find the mass deposited.', parts: [{ ask: 'Mass deposited', use: 'c-xii-3-7', find: 'm', given: { M: 'M g/mol', I: 'I A', t: 'T min', n: 'N' }, marks: 3 }] },
      { text: 'In electroplating, how long must a current of {I} A run to deposit {W} g of a metal of molar mass {M} g/mol, whose ions each carry a charge of +{N}?', parts: [{ ask: 'Time needed', use: 'c-xii-3-7', find: 't', given: { m: 'W g', M: 'M g/mol', I: 'I A', n: 'N' }, unit: 'min', marks: 3 }] },
    ],
    // Each metal with its usual ion: Al³⁺, Fe²⁺, Ni²⁺, Cu²⁺ and Ag⁺.
    vars: { I: [1, 10, 1], T: [10, 60, 10], K: [0, 4, 1], W: [1, 5, 1] },
    derive: (v) => ({ M: [27, 56, 59, 64, 108][v.K], N: [3, 2, 2, 2, 1][v.K] }),
  }),
  num('conductivity', [2, 'b', 3, 2], {
    text: 'The conductivity of a {C} mol/L solution of a weak acid is {K} × 10⁻³ S/m. Its limiting molar conductivity is {L} × 10⁻⁴ S m²/mol.',
    vars: { C: [0.01, 0.1, 0.01], K: [1, 9, 1], L: [300, 400, 10] },
    derive: (v) => ({ CM: v.C * 1000 }),
    when: (v) => (v.K * 1e-3) / (v.C * 1000) < v.L * 1e-4,
    parts: [
      { ask: 'Molar conductivity', use: 'c-xii-3-6', find: 'Lambda_m', given: { kappa: 'K*1e-3 S/m', c: 'CM mol/m^3' }, marks: 2, save: 'lm' },
      { ask: 'Degree of dissociation', use: 'c-xii-3-26', find: 'alpha', given: { Lambda_m: 'lm', Lambda_0: 'L*1e-4 S*m^2/mol' }, marks: 1 },
    ],
  }),
  num('cell-constant', [2, 'b', 2, 1], {
    text: 'A conductivity cell has electrodes {L} cm apart, each of area {A} cm². Find its cell constant.',
    vars: { L: [1, 5, 1], A: [1, 4, 1] },
    parts: [{ ask: 'Cell constant', use: 'c-xii-3-9', find: 'G_c', given: { l: 'L cm', A: 'A cm^2' }, marks: 2 }],
  }),
  ...facts(2, 'a', {
    define: [
      ['standard electrode potential', 'The potential of an electrode at 298 K, in contact with its ions at 1 mol/L, measured against the standard hydrogen electrode.'],
      ['the emf of a cell', 'The potential difference between its two electrodes when no current is drawn.'],
      ['a salt bridge', 'A tube of an inert electrolyte joining the two half-cells.', 'It completes the circuit and keeps each half-cell neutral.'],
    ],
    recall: [
      ['In a galvanic cell, oxidation takes place at the:', 'anode', 'cathode', 'salt bridge', 'external wire'],
      ['The standard hydrogen electrode has a potential defined as:', '0 V', '1 V', '−1 V', '0.0591 V'],
      ['A spontaneous cell reaction has:', 'E positive and ΔG negative', 'E negative and ΔG positive', 'E positive and ΔG positive', 'E negative and ΔG negative'],
      ['In a Daniell cell, electrons flow in the external circuit from:', 'zinc to copper', 'copper to zinc', 'the salt bridge to zinc', 'copper to the salt bridge'],
      ['A higher standard reduction potential means a species is a stronger:', 'oxidising agent', 'reducing agent', 'acid', 'base'],
    ],
    reason: [
      ['A salt bridge is needed in a Daniell cell.', 'Ions move through it, which completes the circuit.', 'It also stops charge building up in each half-cell.'],
      ['Copper doesn’t displace hydrogen from dilute acid.', 'The reduction potential of copper is positive.', 'So copper is a weaker reducing agent than hydrogen.'],
      ['E° for a cell doesn’t change when its reaction is multiplied through by two.', 'E° is an intensive property.', 'It doesn’t depend on the amount of substance.'],
    ],
    compare: [
      ['a galvanic cell', 'an electrolytic cell', ['Chemical energy becomes electrical energy.', 'Electrical energy becomes chemical energy.'], ['The anode is negative.', 'The anode is positive.'], ['The reaction is spontaneous.', 'The reaction is driven by a supply.']],
    ],
    truths: [
      ['At equilibrium, a cell’s emf is zero.', 'At equilibrium, a cell’s emf is at its largest.'],
      ['Reduction takes place at the cathode.', 'Reduction takes place at the anode.'],
      ['A positive cell emf means a spontaneous reaction.', 'A negative cell emf means a spontaneous reaction.'],
    ],
    explain: [
      ['Write the Nernst equation for a general electrode at 298 K.', 'E = E° − (0.0591/n) log([products]/[reactants]).', 'n is the number of electrons transferred, and E° is the standard potential.'],
    ],
    long: [
      ['Write the anode and cathode reactions of a Daniell cell, and find its standard emf given E°(Zn²⁺/Zn) = −0.76 V and E°(Cu²⁺/Cu) = +0.34 V. Then find ΔG° for it.', 'Anode: Zn → Zn²⁺ + 2e⁻.', 'Cathode: Cu²⁺ + 2e⁻ → Cu.', 'E° = 0.34 − (−0.76) = 1.10 V.', 'ΔG° = −nFE° = −2 × 96500 × 1.10.', 'So ΔG° = −212.3 kJ/mol.'],
    ],
    draw: [
      ['Draw a labelled diagram of a Daniell cell.', 'Zinc in ZnSO₄ and copper in CuSO₄, joined by a salt bridge.', 'Anode, cathode, and direction of electron flow labelled.'],
    ],
  }),
  ...facts(2, 'b', {
    define: [
      ['molar conductivity', 'The conductivity of a solution divided by its molar concentration.'],
      ['the cell constant', 'The ratio of the distance between the electrodes to their area.'],
      ['Kohlrausch’s law', 'At infinite dilution, the molar conductivity of an electrolyte is the sum of the contributions of its ions.'],
      ['Faraday’s first law of electrolysis', 'The mass of a substance deposited is proportional to the charge passed.'],
    ],
    recall: [
      ['The SI unit of molar conductivity is:', 'S m²/mol', 'S/m', 'S m/mol', 'ohm m'],
      ['For a strong electrolyte, molar conductivity on dilution:', 'rises slightly', 'falls slightly', 'rises sharply', 'stays exactly the same'],
      ['One faraday is the charge on:', 'one mole of electrons', 'one electron', 'one coulomb of electrons', 'one kilogram of electrons'],
      ['Which conducts electricity by ions?', 'Molten NaCl', 'Copper wire', 'Solid NaCl', 'Graphite'],
    ],
    reason: [
      ['Conductivity falls on dilution, yet molar conductivity rises.', 'There are fewer ions per unit volume, so conductivity falls.', 'But each ion moves more freely, and a weak electrolyte dissociates more, so molar conductivity rises.'],
      ['Molar conductivity of a weak electrolyte rises sharply on dilution.', 'Its degree of dissociation rises greatly at low concentration.'],
    ],
    compare: [
      ['a strong electrolyte', 'a weak electrolyte', ['Fully dissociated in solution.', 'Partly dissociated in solution.'], ['Molar conductivity rises gently on dilution.', 'Molar conductivity rises sharply on dilution.']],
      ['conductivity', 'molar conductivity', ['Conductance of a cube of the solution with 1 m sides.', 'Conductivity per unit concentration.'], ['Falls on dilution.', 'Rises on dilution.']],
    ],
    truths: [
      ['The charge on a mole of electrons is about 96 500 C.', 'The charge on a mole of electrons is about 9 650 C.'],
      ['The limiting molar conductivity of a weak electrolyte can’t be found by extrapolating a graph.', 'The limiting molar conductivity of a weak electrolyte is easily found by extrapolating a graph.'],
      ['Electrolytic conduction rises with temperature.', 'Electrolytic conduction falls with temperature.'],
    ],
    draw: [
      ['Sketch molar conductivity against √c for a strong and a weak electrolyte.', 'A nearly straight line falling gently for the strong electrolyte, which can be extrapolated.', 'A steep curve rising sharply near zero for the weak electrolyte.'],
    ],
  }),
  ...facts(2, 'c', {
    define: [
      ['a fuel cell', 'A galvanic cell that turns the energy of a fuel’s combustion directly into electricity, with reactants supplied continuously.'],
      ['corrosion', 'The slow eating away of a metal by reaction with its surroundings.'],
    ],
    recall: [
      ['Which is a secondary, rechargeable cell?', 'Lead storage battery', 'Dry cell', 'Mercury cell', 'Daniell cell'],
      ['Rusting of iron is speeded up by:', 'dissolved salts', 'oil', 'paint', 'alkali'],
      ['Galvanising protects iron by coating it with:', 'zinc', 'tin', 'copper', 'lead'],
      ['The density of the acid in a lead storage battery on discharge:', 'falls', 'rises', 'is unchanged', 'first rises and then falls'],
    ],
    reason: [
      ['Density of the acid in a lead storage battery falls as it discharges.', 'Sulphuric acid is used up, forming lead sulphate and water.'],
      ['Iron rusts faster near the sea.', 'Salty water conducts better, so the electrochemical reactions are faster.'],
      ['Zinc protects iron even when a galvanised coating is scratched.', 'Zinc is more easily oxidised than iron.', 'So it corrodes first, as a sacrificial metal.'],
    ],
    compare: [
      ['a primary cell', 'a secondary cell', ['Can’t be recharged.', 'Can be recharged.'], ['Its reaction runs once only.', 'Its reaction can be reversed.']],
    ],
    truths: [
      ['A hydrogen–oxygen fuel cell produces water as its product.', 'A hydrogen–oxygen fuel cell produces carbon dioxide as its product.'],
      ['Rusting needs both oxygen and water.', 'Rusting needs only oxygen.'],
      ['Tin protects iron only while its coating is unbroken.', 'Tin protects iron even when its coating is broken.'],
    ],
    cases: [
      {
        scene: 'A space capsule uses hydrogen–oxygen fuel cells for power, and the crew drink the water they produce. A car, by contrast, uses a lead storage battery to start its engine.',
        parts: [
          ['Which of these two is recharged during use?', 'The lead storage battery, by the car’s alternator.', 1],
          ['Give one reason fuel cells suit a space capsule.', 'They’re efficient and light, and their only product is water.', 1],
          ['What are the reactants at the anode and cathode of the fuel cell?', 'Hydrogen at the anode, and oxygen at the cathode.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 3: Chemical Kinetics
  mcqNum('half-life-order', [3, 'a', 1, 1], {
    text: 'A first-order reaction has a rate constant of {K} × 10⁻³ per second. Its half-life is about:',
    vars: { K: [1, 9, 1] },
    use: 'c-xii-4-39',
    find: 't_half',
    given: { k: 'K*1e-3 s^-1' },
    mistakes: (v, a) => [
      ['used 0.693 × k', 0.693 * v.K * 1e-3],
      ['used 1/k', 1 / (v.K * 1e-3)],
      ['forgot the power of ten', a / 1000],
      ['used 2.303/k', 2.303 / (v.K * 1e-3)],
    ],
  }),
  num('first-order-time', [3, 'a', 3, 2], {
    text: 'A first-order reaction has a half-life of {H} minutes. A sample starts at {A} mol/L.',
    vars: { H: [10, 60, 10], A: [0.2, 1, 0.2], P: [75, 87.5, 90, 99] },
    derive: (v) => ({ LEFT: v.A * (1 - v.P / 100) }),
    parts: [
      { ask: 'Rate constant', use: 'c-xii-4-40', find: 'k', given: { t_half: 'H min' }, unit: 's^-1', marks: 1, save: 'k' },
      { ask: 'Time for {P}% of the reactant to react', use: 'c-xii-4-2', find: 't', given: { k: 'k', A_0: 'A mol/L', A: 'LEFT mol/L' }, unit: 'min', marks: 2 },
    ],
  }),
  num('rate-constant', [3, 'a', 3, 2], {
    variants: [
      { text: 'A first-order reaction falls from {A} mol/L to {B} mol/L in {T} minutes. Find its rate constant.', parts: [{ ask: 'Rate constant', use: 'c-xii-4-2', find: 'k', given: { t: 'T min', A_0: 'A mol/L', A: 'B mol/L' }, unit: 'min^-1', marks: 3 }] },
    ],
    vars: { A: [0.4, 2, 0.2], B: [0.1, 0.3, 0.1], T: [10, 60, 10] },
    when: (v) => v.A > v.B,
  }),
  num('zero-order', [3, 'a', 2, 2], {
    text: 'A zero-order reaction starts at {A} mol/L, and has a rate constant of {K} × 10⁻³ mol/(L s). Find its half-life.',
    vars: { A: [0.2, 1, 0.2], K: [1, 9, 1] },
    parts: [{ ask: 'Half-life', use: 'c-xii-4-8', find: 't_half', given: { A_0: 'A mol/L', k: 'K*1e-3 mol/(L*s)' }, marks: 2 }],
  }),
  num('arrhenius', [3, 'b', 3, 3], {
    variants: [
      { text: 'A reaction has an activation energy of {E} kJ/mol. Its rate constant at {T} K is {K} × 10⁻³ per second. Find the rate constant at {U} K.', parts: [{ ask: 'Rate constant at the higher temperature', use: 'c-xii-4-6', find: 'k_2', given: { k_1: 'K*1e-3 s^-1', E_a: 'E kJ/mol', T_1: 'T K', T_2: 'U K' }, marks: 3 }] },
    ],
    vars: { E: [40, 100, 10], T: [298, 320, 2], U: [330, 350, 10], K: [1, 9, 1] },
  }),
  custom('rate-from-table', [3, 'a', 3, 3], { type: 'numerical', format: 'numerical', style: 'cbq-style' }, (g) => {
    const orderA = g.int(1, 2);
    const orderB = g.int(0, 1);
    const a0 = g.pick([0.1, 0.2]);
    const b0 = g.pick([0.1, 0.2]);
    const k = g.pick([0.5, 1, 2, 5]);
    const rate = (a: number, b: number) => k * a ** orderA * b ** orderB;
    const rows = [[a0, b0], [2 * a0, b0], [a0, 2 * b0]];
    return {
      form: 'numeric',
      text: 'The rate of the reaction A + B → C was measured at the same temperature, with these results. Use them to find the order with respect to each reactant.',
      diagram: { kind: 'table', head: ['[A] / mol L⁻¹', '[B] / mol L⁻¹', 'Rate / mol L⁻¹ s⁻¹'], rows: rows.map(([a, b]) => [String(a), String(b), n(rate(a, b), 3)]) },
      parts: [
        g.answerPart('Order with respect to A', orderA, 1, [{ label: 'Compare the first two rows: only [A] changes', math: [`2^x = ${2 ** orderA}\\Rightarrow x = ${orderA}`] }]),
        g.answerPart('Order with respect to B', orderB, 1, [{ label: 'Compare the first and third rows: only [B] changes', math: [`2^y = ${2 ** orderB}\\Rightarrow y = ${orderB}`] }]),
        g.answerPart('Overall order', orderA + orderB, 1, [{ label: 'Add the two orders', math: [`${orderA} + ${orderB} = ${orderA + orderB}`] }]),
      ],
    };
  }),
  ...facts(3, 'a', {
    define: [
      ['rate of a reaction', 'The change in concentration of a reactant or product per unit time.'],
      ['order of a reaction', 'The sum of the powers of the concentrations in the rate law.', 'It is found by experiment, and can be zero or a fraction.'],
      ['molecularity of a reaction', 'The number of reacting species taking part in one elementary step.', 'It is always a whole number.'],
      ['half-life of a reaction', 'The time in which the concentration of a reactant falls to half of its initial value.'],
      ['a pseudo first-order reaction', 'A reaction that looks first order because one reactant is in such excess that its concentration barely changes.'],
    ],
    recall: [
      ['The half-life of a first-order reaction:', 'doesn’t depend on the initial concentration', 'is proportional to the initial concentration', 'is inversely proportional to the initial concentration', 'depends on the square of the initial concentration'],
      ['The unit of the rate constant of a first-order reaction is:', 's⁻¹', 'mol L⁻¹ s⁻¹', 'L mol⁻¹ s⁻¹', 'mol s⁻¹'],
      ['The unit of the rate constant of a zero-order reaction is:', 'mol L⁻¹ s⁻¹', 's⁻¹', 'L mol⁻¹ s⁻¹', 'L² mol⁻² s⁻¹'],
      ['A graph of ln[A] against time for a first-order reaction is:', 'a straight line with a negative slope', 'a straight line with a positive slope', 'a curve rising steeply', 'a horizontal line'],
      ['Hydrolysis of an ester in excess water is an example of a:', 'pseudo first-order reaction', 'zero-order reaction', 'third-order reaction', 'second-order reaction'],
      ['For the rate law rate = k[A]²[B], the overall order is:', '3', '2', '1', '4'],
    ],
    reason: [
      ['Molecularity can’t be zero or a fraction.', 'It counts the species colliding in an elementary step.', 'That number has to be a positive whole number.'],
      ['The rate of a reaction usually falls with time.', 'Reactants get used up.', 'So there are fewer collisions per unit time.'],
      ['A reaction’s order can’t be found just from its balanced equation.', 'Order depends on the actual mechanism.', 'So it has to be found by experiment.'],
    ],
    compare: [
      ['order', 'molecularity', ['Found by experiment.', 'Worked out from the mechanism.'], ['Can be zero or a fraction.', 'Is always a positive whole number.'], ['Applies to the overall reaction.', 'Applies to one elementary step.']],
      ['average rate', 'instantaneous rate', ['Change in concentration over a time interval.', 'Rate at one moment in time.'], ['Doesn’t show how the rate changes within the interval.', 'Found from the slope of the tangent.']],
    ],
    truths: [
      ['For a zero-order reaction, the half-life is proportional to the initial concentration.', 'For a zero-order reaction, the half-life doesn’t depend on the initial concentration.'],
      ['A first-order reaction takes three half-lives to reach 87.5% completion.', 'A first-order reaction takes two half-lives to reach 87.5% completion.'],
      ['Rate constant depends on temperature.', 'Rate constant depends on the initial concentration.'],
    ],
    long: [
      ['Derive the integrated rate equation of a first-order reaction, and show that its half-life doesn’t depend on the initial concentration.', 'Rate = −d[A]/dt = k[A].', 'Separating and integrating gives ln([A]₀/[A]) = kt.', 'So k = (2.303/t) log([A]₀/[A]).', 'At half-life, [A] = [A]₀/2, so k = (2.303/t½) log 2.', 'So t½ = 0.693/k, which doesn’t involve [A]₀.'],
    ],
    draw: [
      ['Sketch graphs of concentration against time for a zero-order and a first-order reaction.', 'A straight line falling to zero for the zero-order reaction.', 'An exponential curve falling towards zero for the first-order reaction.'],
    ],
    cases: [
      {
        scene: 'A doctor prescribes a drug whose concentration in the blood falls by first-order kinetics, with a half-life of 6 hours. The patient has to take it at regular intervals.',
        parts: [
          ['What fraction of a dose remains after 18 hours?', 'One eighth, after three half-lives.', 1],
          ['Does a bigger dose change the half-life?', 'No, in a first-order process, it doesn’t depend on the concentration.', 1],
          ['What is the rate constant, roughly?', 'k = 0.693/6 h, about 0.116 per hour.', 1],
        ],
      },
    ],
  }),
  ...facts(3, 'b', {
    define: [
      ['activation energy', 'The minimum extra energy that reactants need for an effective collision.'],
      ['threshold energy', 'The minimum total energy that colliding molecules need in order to react.'],
      ['the Arrhenius equation', 'The relation k = Ae^(−Ea/RT), between the rate constant and temperature.'],
      ['a catalyst', 'A substance that changes the rate of a reaction, without being used up, by giving a path with a lower activation energy.'],
    ],
    recall: [
      ['A rise of 10 °C often makes a reaction go about:', 'twice as fast', 'ten times as fast', 'the same speed', 'half as fast'],
      ['A catalyst works by:', 'lowering the activation energy', 'raising the temperature', 'raising the activation energy', 'changing the equilibrium constant'],
      ['A catalyst does not change:', 'ΔG of the reaction', 'the activation energy', 'the rate constant', 'the mechanism'],
      ['A graph of ln k against 1/T has a slope of:', '−Ea/R', 'Ea/R', '−R/Ea', 'A'],
    ],
    reason: [
      ['Not all collisions lead to a reaction.', 'Colliding molecules need enough energy.', 'They must also be correctly oriented.'],
      ['Rate rises sharply with temperature.', 'A small rise in temperature greatly raises the fraction of molecules above the activation energy.'],
    ],
    compare: [
      ['activation energy', 'threshold energy', ['The extra energy above the average energy of the reactants.', 'The total energy needed for an effective collision.'], ['Falls in the presence of a catalyst.', 'Is reached along a different path in the presence of a catalyst.']],
    ],
    truths: [
      ['A catalyst affects forward and backward reactions equally.', 'A catalyst speeds up only the forward reaction.'],
      ['The Arrhenius factor A relates to the collision frequency.', 'The Arrhenius factor A relates to the activation energy.'],
      ['Reactions with low activation energy are usually faster.', 'Reactions with low activation energy are usually slower.'],
    ],
    draw: [
      ['Sketch an energy profile for a reaction with and without a catalyst.', 'Reactants, a peak for the activated complex, and products, for one curve.', 'A second, lower peak for the catalysed path, with the same reactants and products.'],
    ],
  }),

  // ---- Unit 4: d- and f-block
  custom('ion-magnetic', [4, 'a', 2, 2], { type: 'short', format: 'short' }, (g) => {
    const [ion, d, unp] = g.pick([
      ['Mn²⁺', 5, 5], ['Fe²⁺', 6, 4], ['Fe³⁺', 5, 5], ['Co²⁺', 7, 3], ['Ni²⁺', 8, 2], ['Cu²⁺', 9, 1], ['Zn²⁺', 10, 0], ['Sc³⁺', 0, 0], ['Ti³⁺', 1, 1], ['V³⁺', 2, 2], ['Cr³⁺', 3, 3],
    ] as const);
    const mu = Math.sqrt(unp * (unp + 2));
    return g.theory(`Find the number of unpaired electrons in ${ion}, and its spin-only magnetic moment.`, [
      [`Its configuration is 3d${d === 0 ? '⁰' : d === 10 ? '¹⁰' : ['', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'][d]}, so it has ${unp} unpaired ${unp === 1 ? 'electron' : 'electrons'}.`, 1],
      [`μ = √(n(n + 2)) = ${mu.toFixed(2)} BM.`, 1],
    ]);
  }),
  custom('magnetic-mcq', [4, 'a', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const unp = g.int(1, 5);
    const mu = Math.sqrt(unp * (unp + 2));
    return g.mcqNumber(`An ion has ${unp} unpaired ${unp === 1 ? 'electron' : 'electrons'}. Its spin-only magnetic moment is closest to:`, mu, 'BM', [
      { slip: 'forgot the square root', value: unp * (unp + 2) },
      { slip: 'used √(n(n + 1)) instead', value: Math.sqrt(unp * (unp + 1)) },
      { slip: 'used n + 2', value: unp + 2 },
      { slip: 'used √n', value: Math.sqrt(unp) },
    ], { digits: 3 });
  }),
  ...facts(4, 'a', {
    define: [
      ['transition elements', 'Elements with a partly filled d orbital, in the atom or in one of its common ions.'],
      ['lanthanoid contraction', 'The steady decrease in atomic and ionic radii across the lanthanoids.', 'It happens because 4f electrons shield the nucleus poorly.'],
      ['interstitial compounds', 'Compounds formed when small atoms such as C, N or H occupy the gaps in a metal’s lattice.'],
    ],
    recall: [
      ['Which of these is not a transition element, by strict definition?', 'Zinc', 'Iron', 'Copper', 'Scandium'],
      ['Which 3d metal shows the largest number of oxidation states?', 'Manganese', 'Scandium', 'Zinc', 'Titanium'],
      ['Transition metal ions are coloured because of:', 'd–d transitions', 'their high melting points', 'their low density', 'hydrogen bonding'],
      ['Which ion is colourless?', 'Sc³⁺', 'Cu²⁺', 'Fe³⁺', 'Mn²⁺'],
      ['The common oxidation state of lanthanoids is:', '+3', '+1', '+6', '+5'],
      ['Compared with lanthanoids, actinoids show:', 'a greater range of oxidation states', 'a smaller range of oxidation states', 'no oxidation states', 'only the +1 state'],
    ],
    reason: [
      ['Transition metals have high melting points.', 'Both s and d electrons take part in metallic bonding, so it is very strong.'],
      ['Transition metals often act as good catalysts.', 'They have variable oxidation states.', 'They can also adsorb reactants on their surfaces.'],
      ['Zirconium and hafnium have almost the same radii.', 'The lanthanoid contraction cancels the expected increase down the group.'],
      ['Cu⁺ compounds are colourless, while Cu²⁺ compounds are coloured.', 'Cu⁺ is d¹⁰, with no d–d transition possible.', 'Cu²⁺ is d⁹, which absorbs visible light through a d–d transition.'],
    ],
    compare: [
      ['lanthanoids', 'actinoids', ['Mostly show the +3 state.', 'Show a wide range of oxidation states.'], ['Mostly not radioactive.', 'All radioactive.'], ['4f orbitals fill.', '5f orbitals fill.']],
    ],
    truths: [
      ['Mn²⁺ has a half-filled d subshell, which is particularly stable.', 'Mn²⁺ has a completely filled d subshell, which is particularly stable.'],
      ['Transition metal compounds are often paramagnetic.', 'Transition metal compounds are never paramagnetic.'],
      ['Interstitial compounds are hard and have high melting points.', 'Interstitial compounds are soft and have low melting points.'],
    ],
    cases: [
      {
        scene: 'Many industrial plants use iron or vanadium compounds to speed up their reactions. On a factory visit, a student asks why these metals work so well.',
        parts: [
          ['Give one property of transition metals that helps them act as catalysts.', 'They have variable oxidation states.', 1],
          ['Which catalyst is used in making sulphuric acid by the contact process?', 'Vanadium(V) oxide, V₂O₅.', 1],
          ['Which catalyst is used in the Haber process for ammonia?', 'Finely divided iron.', 1],
        ],
      },
    ],
  }),
  ...facts(4, 'b', {
    define: [
      ['potassium dichromate', 'An orange compound, K₂Cr₂O₇, used as a strong oxidising agent in acid solution.'],
      ['potassium permanganate', 'A deep purple compound, KMnO₄, used as a strong oxidising agent.'],
    ],
    recall: [
      ['In acid solution, MnO₄⁻ is reduced to:', 'Mn²⁺', 'MnO₂', 'Mn³⁺', 'MnO₄²⁻'],
      ['In neutral or weakly alkaline solution, MnO₄⁻ is reduced to:', 'MnO₂', 'Mn²⁺', 'Mn', 'Mn³⁺'],
      ['In acid solution, Cr₂O₇²⁻ is reduced to:', 'Cr³⁺', 'Cr²⁺', 'CrO₄²⁻', 'Cr'],
      ['The oxidation state of chromium in K₂Cr₂O₇ is:', '+6', '+3', '+7', '+2'],
      ['The oxidation state of manganese in KMnO₄ is:', '+7', '+5', '+2', '+4'],
      ['Adding alkali to an orange dichromate solution turns it:', 'yellow', 'green', 'purple', 'colourless'],
    ],
    reason: [
      ['KMnO₄ doesn’t need a separate indicator in a titration.', 'Its purple colour disappears until it is in excess.', 'So the first permanent pink shows the end point.'],
      ['Hydrochloric acid isn’t used to acidify KMnO₄ in a titration.', 'KMnO₄ would oxidise chloride ions to chlorine.'],
    ],
    compare: [
      ['K₂Cr₂O₇', 'KMnO₄', ['Orange.', 'Deep purple.'], ['Chromium goes from +6 to +3 in acid.', 'Manganese goes from +7 to +2 in acid.'], ['Needs an external indicator in titrations.', 'Acts as its own indicator.']],
    ],
    truths: [
      ['Dichromate turns to chromate in alkali.', 'Chromate turns to dichromate in alkali.'],
      ['Acidified KMnO₄ oxidises Fe²⁺ to Fe³⁺.', 'Acidified KMnO₄ reduces Fe³⁺ to Fe²⁺.'],
      ['Acidified K₂Cr₂O₇ oxidises iodide ions to iodine.', 'Acidified K₂Cr₂O₇ reduces iodine to iodide ions.'],
    ],
    explain: [
      ['Complete and balance: Cr₂O₇²⁻ + 14H⁺ + 6Fe²⁺ →', '→ 2Cr³⁺ + 6Fe³⁺ + 7H₂O.', 'Chromium is reduced from +6 to +3, and each Fe²⁺ loses one electron.'],
      ['Complete and balance: 2MnO₄⁻ + 16H⁺ + 10I⁻ →', '→ 2Mn²⁺ + 5I₂ + 8H₂O.', 'Manganese is reduced from +7 to +2, and iodide is oxidised to iodine.'],
      ['Complete and balance: MnO₄⁻ + 8H⁺ + 5Fe²⁺ →', '→ Mn²⁺ + 5Fe³⁺ + 4H₂O.', 'Each manganese gains five electrons, one from each Fe²⁺.'],
      ['Write the balanced equation for the reaction of acidified dichromate with hydrogen sulphide.', 'Cr₂O₇²⁻ + 8H⁺ + 3H₂S → 2Cr³⁺ + 3S + 7H₂O.', 'Sulphur from H₂S is oxidised to elemental sulphur.'],
    ],
  }),

  // ---- Unit 5: Coordination
  custom('complex-name', [5, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const c = g.pick(COMPLEXES);
    return g.mcq(`What is the IUPAC name of ${c.f}?`, c.name, nameSlips(c.name), { why: 'Ligands come first, in alphabetical order, then the metal, with -ate only in an anion, then its oxidation state.' });
  }),
  custom('complex-ox', [5, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const c = g.pick(COMPLEXES);
    return g.mcq(`What is the oxidation state of the central metal in ${c.f}?`, c.ox, ['+1', '+2', '+3', '+4'].filter((o) => o !== c.ox).slice(0, 3));
  }),
  custom('complex-hyb', [5, 'a', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const c = g.pick(COMPLEXES);
    return g.mcq(`What is the hybridisation of the central metal in ${c.f}?`, c.hyb, ['sp', 'sp³', 'dsp²', 'd²sp³', 'sp³d²'].filter((o) => o !== c.hyb).slice(0, 3));
  }),
  custom('complex-full', [5, 'a', 3, 2], { type: 'structure', format: 'short' }, (g) => {
    const c = g.pick(COMPLEXES);
    return g.theory(`For the complex ${c.f}, state the following: (i) the IUPAC name, (ii) the hybridisation and shape, (iii) whether it is diamagnetic or paramagnetic.`, [
      [`(i) ${c.name[0].toUpperCase()}${c.name.slice(1)}.`, 1],
      [`(ii) ${c.hyb} hybridisation, so ${c.shape}.`, 1],
      [`(iii) ${c.mag[0].toUpperCase()}${c.mag.slice(1)}, with ${c.unp === 0 ? 'no' : c.unp} unpaired ${c.unp === 1 ? 'electron' : 'electrons'}.`, 1],
    ]);
  }),
  custom('complex-unpaired', [5, 'a', 2, 2], { type: 'structure', format: 'short' }, (g) => {
    const c = g.pick(COMPLEXES);
    const mu = Math.sqrt(c.unp * (c.unp + 2));
    return g.theory(`State the number of unpaired electrons in ${c.f}, and work out its spin-only magnetic moment.`, [
      [`It has ${c.unp === 0 ? 'no' : c.unp} unpaired ${c.unp === 1 ? 'electron' : 'electrons'}.`, 1],
      [`μ = √(n(n + 2)) = ${mu.toFixed(2)} BM.`, 1],
    ]);
  }),
  ...facts(5, 'a', {
    define: [
      ['a ligand', 'An ion or molecule that donates a pair of electrons to the central metal atom or ion.'],
      ['coordination number', 'The number of donor atoms bonded directly to the central metal.'],
      ['a chelate ligand', 'A ligand with two or more donor atoms that bind to one metal, forming a ring.', 'Complexes with chelate rings are unusually stable.'],
      ['crystal field splitting', 'The separation of the d orbitals into groups of different energy, caused by the approach of the ligands.'],
      ['the spectrochemical series', 'The list of ligands in the order of their increasing ability to split the d orbitals.'],
    ],
    recall: [
      ['Which of these is a bidentate ligand?', 'Ethane-1,2-diamine', 'Ammonia', 'Chloride', 'Water'],
      ['Which ligand causes the strongest crystal field splitting?', 'CN⁻', 'Cl⁻', 'F⁻', 'H₂O'],
      ['The primary valency of a metal in a complex corresponds to its:', 'oxidation state', 'coordination number', 'atomic number', 'group number'],
      ['The secondary valency of a metal in a complex corresponds to its:', 'coordination number', 'oxidation state', 'atomic number', 'group number'],
      ['[Co(NH₃)₅Cl]SO₄ and [Co(NH₃)₅SO₄]Cl are examples of:', 'ionisation isomers', 'linkage isomers', 'geometrical isomers', 'optical isomers'],
      ['NO₂⁻ binding through N or through O gives:', 'linkage isomers', 'ionisation isomers', 'coordination isomers', 'optical isomers'],
      ['Which is an anticancer drug that is a coordination compound?', 'Cisplatin', 'Haemoglobin', 'Chlorophyll', 'Wilkinson’s catalyst'],
    ],
    reason: [
      ['[Ni(CN)₄]²⁻ is diamagnetic, while [NiCl₄]²⁻ is paramagnetic.', 'CN⁻ is a strong field ligand, which pairs the d electrons, giving dsp².', 'Cl⁻ is weak, so the electrons stay unpaired, giving sp³.'],
      ['Tetrahedral complexes are usually high spin.', 'Their splitting is small, about four ninths of the octahedral value.', 'So electrons don’t pair up.'],
      ['Chelate complexes are especially stable.', 'A ligand with two donor atoms forms a ring with the metal.', 'That makes the ligand harder to remove, and gives a favourable entropy change.'],
      ['[Ti(H₂O)₆]³⁺ is coloured, while [Sc(H₂O)₆]³⁺ is colourless.', 'Ti³⁺ has one d electron, which can undergo a d–d transition.', 'Sc³⁺ has no d electrons, so no transition is possible.'],
    ],
    compare: [
      ['a double salt', 'a coordination compound', ['Breaks up fully into its simple ions in water.', 'Keeps its complex ion in water.'], ['Example: Mohr’s salt.', 'Example: K₄[Fe(CN)₆].']],
      ['high spin complexes', 'low spin complexes', ['Formed with weak field ligands.', 'Formed with strong field ligands.'], ['More unpaired electrons.', 'Fewer unpaired electrons.']],
    ],
    truths: [
      ['An octahedral complex has its t₂g set lower in energy than its e_g set.', 'An octahedral complex has its e_g set lower in energy than its t₂g set.'],
      ['Square planar complexes can show geometrical isomerism.', 'Square planar complexes can never show geometrical isomerism.'],
      ['EDTA is a hexadentate ligand.', 'EDTA is a monodentate ligand.'],
      ['Stability of a complex rises as the charge on the metal ion rises.', 'Stability of a complex falls as the charge on the metal ion rises.'],
    ],
    explain: [
      ['State two postulates of Werner’s theory.', 'Metals have primary and secondary valencies.', 'Secondary valencies are directed in space, which gives a complex its shape.'],
      ['Name a test that distinguishes [Co(NH₃)₆]Cl₃ from [Co(NH₃)₅Cl]Cl₂.', 'Add silver nitrate to each.', 'The first gives three moles of AgCl per mole, and the second gives two.'],
    ],
    long: [
      ['For [CoF₆]³⁻, give the oxidation state, the electronic configuration of the metal, the hybridisation, the geometry and the magnetic behaviour. Say why it differs from [Co(NH₃)₆]³⁺.', 'Cobalt is +3, with the configuration 3d⁶.', 'F⁻ is a weak field ligand, so the electrons stay unpaired.', 'So it uses sp³d² hybridisation, which is octahedral.', 'It has four unpaired electrons, so it is paramagnetic.', 'NH₃ is stronger, so the electrons pair up, giving d²sp³ and a diamagnetic complex.'],
    ],
    draw: [
      ['Draw a diagram showing how d orbitals split in an octahedral crystal field.', 't₂g set of three orbitals lower in energy, and e_g set of two orbitals higher.', 'Δ₀ marked between them, with +0.6Δ₀ and −0.4Δ₀ labelled.'],
      ['Draw the geometrical isomers of [Pt(NH₃)₂Cl₂].', 'The cis isomer, with like ligands next to each other, in a square plane.', 'The trans isomer, with like ligands opposite each other.'],
    ],
    cases: [
      {
        scene: 'A doctor treats a patient with lead poisoning using a solution of EDTA, which binds lead ions strongly so the kidneys can pass them out of the body.',
        parts: [
          ['What kind of ligand is EDTA?', 'A hexadentate chelating ligand.', 1],
          ['Why does it bind lead ions so strongly?', 'It forms several rings around a metal ion, which makes a very stable complex.', 1],
          ['Name one other use of coordination compounds in medicine.', 'Cisplatin is used to treat some cancers.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 6: Halogen compounds
  custom('name-halo', [6, 'a', 1, 1], { type: 'structure', format: 'mcq' }, nameThis('haloalkanes')),
  ...reactionBlueprints(6, 'a'),
  ...reactionBlueprints(6, 'b'),
  ...facts(6, 'a', {
    define: [
      ['an SN2 reaction', 'A one-step substitution in which the nucleophile attacks as the leaving group departs, inverting the carbon’s configuration.'],
      ['an SN1 reaction', 'A two-step substitution that passes through a carbocation, with a first-order rate.'],
      ['a Grignard reagent', 'An alkyl magnesium halide, RMgX, formed from a haloalkane and magnesium in dry ether.'],
      ['Saytzeff’s rule', 'In an elimination reaction, the more substituted alkene is the main product.'],
    ],
    recall: [
      ['Which undergoes SN2 fastest?', 'CH₃Br', '(CH₃)₃CBr', '(CH₃)₂CHBr', 'CH₃CH₂Br'],
      ['Which undergoes SN1 fastest?', '(CH₃)₃CBr', 'CH₃Br', 'CH₃CH₂Br', '(CH₃)₂CHBr'],
      ['Which has the highest boiling point?', 'CH₃I', 'CH₃F', 'CH₃Cl', 'CH₃Br'],
      ['A Grignard reagent reacts with water to give:', 'an alkane', 'an alcohol', 'an alkene', 'an ether'],
      ['Which reaction joins two alkyl halides with sodium in dry ether?', 'Wurtz', 'Fittig', 'Swarts', 'Finkelstein'],
      ['Which is used to replace chlorine with fluorine in an alkyl halide?', 'Swarts reaction', 'Wurtz reaction', 'Sandmeyer reaction', 'Friedel–Crafts reaction'],
    ],
    reason: [
      ['Grignard reagents must be made in dry ether.', 'They react rapidly with water, forming an alkane.'],
      ['Haloalkanes are only slightly soluble in water.', 'They can’t form hydrogen bonds with water.', 'So breaking water’s own hydrogen bonds isn’t paid for.'],
      ['Tertiary halides prefer SN1.', 'Their tertiary carbocation is stabilised by alkyl groups.', 'Bulky groups also block the backside attack needed for SN2.'],
    ],
    compare: [
      ['SN1', 'SN2', ['Takes place in two steps.', 'Takes place in one step.'], ['Rate depends only on the substrate.', 'Rate depends on the substrate and the nucleophile.'], ['Gives a mixture of configurations.', 'Inverts the configuration.']],
    ],
    truths: [
      ['KCN gives mainly nitriles with haloalkanes, while AgCN gives isocyanides.', 'KCN gives mainly isocyanides with haloalkanes, while AgCN gives nitriles.'],
      ['Elimination is favoured by alcoholic KOH.', 'Elimination is favoured by aqueous KOH.'],
      ['The C–F bond is the strongest carbon–halogen bond.', 'The C–I bond is the strongest carbon–halogen bond.'],
    ],
    explain: [
      ['Write the mechanism of the hydrolysis of bromomethane by hydroxide.', 'Hydroxide attacks the carbon from the side opposite the bromine, in one step, through a transition state.', 'Bromide leaves, and the carbon’s configuration inverts.'],
    ],
    cases: [
      {
        scene: 'A chemist wants to make ethanol from bromoethane. She gets a good yield using aqueous KOH, but mostly a gas when she uses alcoholic KOH instead.',
        parts: [
          ['What is the gas formed with alcoholic KOH?', 'Ethene, from elimination of HBr.', 1],
          ['Why does aqueous KOH give the alcohol?', 'In water, OH⁻ acts as a nucleophile and substitutes for bromine.', 1],
          ['Name the mechanism of the substitution here.', 'SN2, as bromoethane is a primary halide.', 1],
        ],
      },
    ],
  }),
  ...facts(6, 'b', {
    define: [
      ['the Sandmeyer reaction', 'Replacing the diazonium group with a halogen, using a copper(I) halide.'],
      ['the Wurtz–Fittig reaction', 'Coupling an alkyl halide and an aryl halide with sodium in dry ether.'],
    ],
    recall: [
      ['An aryl halide is less reactive than an alkyl halide to nucleophiles because:', 'its C–X bond has partial double bond character', 'it has a larger halogen', 'it is more polar', 'it is heavier'],
      ['A nitro group makes nucleophilic substitution on chlorobenzene easier when it is:', 'ortho or para to the chlorine', 'meta to the chlorine', 'anywhere at all', 'on a side chain'],
      ['With chlorine and FeCl₃, chlorobenzene gives mostly:', 'ortho and para dichlorobenzenes', 'meta dichlorobenzene', 'benzene', 'phenol'],
    ],
    reason: [
      ['Chlorobenzene is less reactive towards nucleophiles than chloroethane.', 'Resonance gives the C–Cl bond partial double bond character.', 'So it is harder to break.'],
      ['Chlorine directs ortho and para, even though it deactivates the ring.', 'Its lone pairs stabilise the ortho and para intermediates by resonance.', 'The inductive effect only slows the reaction overall.'],
    ],
    compare: [
      ['chlorobenzene', 'chloroethane', ['Reacts very slowly with nucleophiles.', 'Reacts readily with nucleophiles.'], ['Its C–Cl carbon is sp² hybridised.', 'Its C–Cl carbon is sp³ hybridised.']],
    ],
    truths: [
      ['Haloarenes undergo electrophilic substitution more slowly than benzene.', 'Haloarenes undergo electrophilic substitution faster than benzene.'],
      ['The para isomer of dichlorobenzene usually melts higher than its ortho and meta isomers.', 'The para isomer of dichlorobenzene usually melts lower than its ortho and meta isomers.'],
      ['Silver nitrate gives no precipitate with chlorobenzene.', 'Silver nitrate gives an immediate white precipitate with chlorobenzene.'],
    ],
  }),
  ...facts(6, 'c', {
    define: [
      ['DDT', 'p,p′-Dichlorodiphenyltrichloroethane, an insecticide now restricted because it persists in the environment.'],
      ['a freon', 'A chlorofluorocarbon of methane or ethane, once widely used in refrigeration.'],
    ],
    recall: [
      ['Chloroform slowly oxidises in air and light to give:', 'phosgene', 'methanol', 'carbon tetrachloride', 'formic acid'],
      ['Iodoform is used as:', 'an antiseptic', 'an anaesthetic', 'a solvent for paints', 'a refrigerant'],
      ['Freons are harmful because they:', 'destroy the ozone layer', 'are highly flammable', 'are strongly acidic', 'are strongly basic'],
      ['DDT has been restricted because it:', 'isn’t broken down, and it builds up in food chains', 'is too expensive', 'has no effect on insects', 'evaporates too quickly'],
    ],
    reason: [
      ['Chloroform is stored in dark bottles, filled to the brim.', 'Light and air oxidise it to poisonous phosgene.'],
      ['A little ethanol is added to stored chloroform.', 'It converts any phosgene formed into harmless diethyl carbonate.'],
    ],
    truths: [
      ['Carbon tetrachloride was once used as a fire extinguisher.', 'Carbon tetrachloride was once used as an antiseptic.'],
      ['Iodoform has a strong, distinctive smell.', 'Iodoform has no smell.'],
      ['Chlorofluorocarbons release chlorine atoms in the stratosphere.', 'Chlorofluorocarbons release oxygen atoms in the stratosphere.'],
    ],
  }),

  // ---- Unit 7: Alcohols, phenols and ethers
  custom('name-alcohol', [7, 'a', 1, 1], { type: 'structure', format: 'mcq' }, nameThis('alcohols')),
  custom('name-ether', [7, 'c', 1, 1], { type: 'structure', format: 'mcq' }, nameThis('ethers')),
  ...reactionBlueprints(7, 'a'),
  ...reactionBlueprints(7, 'b'),
  ...reactionBlueprints(7, 'c'),
  ...facts(7, 'a', {
    define: [
      ['the Lucas test', 'A test that tells primary, secondary and tertiary alcohols apart by how fast they turn cloudy with ZnCl₂ in concentrated HCl.'],
      ['esterification', 'The reaction of an alcohol and a carboxylic acid to give an ester and water.'],
    ],
    recall: [
      ['A tertiary alcohol with Lucas reagent:', 'turns cloudy at once', 'turns cloudy in about five minutes', 'stays clear at room temperature', 'turns blue'],
      ['Which has the highest boiling point?', 'Propan-1-ol', 'Propanal', 'Propane', 'Methoxyethane'],
      ['The oxidation of a primary alcohol with acidified dichromate gives, at length:', 'a carboxylic acid', 'a ketone', 'an alkane', 'an ether'],
      ['A secondary alcohol is oxidised to:', 'a ketone', 'an aldehyde', 'an alkane', 'a carboxylic acid'],
      ['The order of reactivity of alcohols with HCl is:', 'tertiary > secondary > primary', 'primary > secondary > tertiary', 'secondary > primary > tertiary', 'primary > tertiary > secondary'],
    ],
    reason: [
      ['Alcohols have higher boiling points than alkanes of similar mass.', 'Their –OH groups form intermolecular hydrogen bonds.', 'Extra energy is needed to break these.'],
      ['Lower alcohols dissolve in water, but the higher ones don’t.', 'The –OH group forms hydrogen bonds with water.', 'A longer hydrocarbon chain resists this.'],
      ['Tertiary alcohols react faster with HCl.', 'They form the stable tertiary carbocation most easily.'],
    ],
    compare: [
      ['primary alcohols', 'tertiary alcohols', ['Give no cloudiness quickly with the Lucas reagent.', 'Give immediate cloudiness with the Lucas reagent.'], ['Oxidised easily to acids.', 'Resist mild oxidation.']],
    ],
    truths: [
      ['Ethanol is weaker than water as an acid.', 'Ethanol is stronger than water as an acid.'],
      ['Sodium reacts with ethanol to give hydrogen.', 'Sodium reacts with ethanol to give oxygen.'],
      ['Acid-catalysed dehydration of alcohols goes through a carbocation.', 'Acid-catalysed dehydration of alcohols goes through a free radical.'],
    ],
    explain: [
      ['Give a chemical test to distinguish propan-1-ol from propan-2-ol.', 'Warm each with iodine and sodium hydroxide.', 'Propan-2-ol gives a yellow precipitate of iodoform, and propan-1-ol doesn’t.'],
    ],
    long: [
      ['Give the steps by which ethanol loses water in hot concentrated acid to form ethene.', 'The alcohol’s oxygen is protonated by the acid.', 'Water leaves, forming a carbocation.', 'A proton is lost from the next carbon, forming the double bond.'],
    ],
    cases: [
      {
        scene: 'A breath analyser passes a driver’s breath over an orange solution containing acidified dichromate. If ethanol is present, the colour changes to green.',
        parts: [
          ['What is ethanol oxidised to in this test?', 'First ethanal, and then ethanoic acid.', 1],
          ['What causes the colour change?', 'Orange Cr₂O₇²⁻ is reduced to green Cr³⁺.', 1],
          ['Would a tertiary alcohol give this colour change easily? Why?', 'No, because it has no hydrogen on the –OH carbon, so it resists oxidation.', 1],
        ],
      },
    ],
  }),
  ...facts(7, 'b', {
    define: [
      ['the Reimer–Tiemann reaction', 'The reaction of phenol with chloroform and aqueous alkali, which adds an aldehyde group at the ortho position.'],
      ['Kolbe’s reaction', 'The reaction of sodium phenoxide with carbon dioxide under pressure, which gives salicylic acid after acidification.'],
    ],
    recall: [
      ['Phenol is more acidic than ethanol because:', 'the phenoxide ion is stabilised by resonance', 'phenol is heavier', 'ethanol has no oxygen', 'phenol has more hydrogens'],
      ['Which is the strongest acid?', '2,4,6-Trinitrophenol', 'Phenol', '4-Methylphenol', 'Ethanol'],
      ['Phenol gives a violet colour with:', 'neutral FeCl₃', 'bromine water', 'sodium hydroxide', 'Lucas reagent'],
      ['Cumene is used to manufacture:', 'phenol and propanone', 'benzene and ethanol', 'toluene and methanol', 'aniline and propanal'],
      ['Which is the main product of phenol with dilute HNO₃?', 'A mixture of ortho and para nitrophenols', 'Picric acid', 'Benzoic acid', 'Nitrobenzene'],
    ],
    reason: [
      ['Phenol is more acidic than ethanol.', 'The phenoxide ion is stabilised by resonance with the ring.', 'An ethoxide ion has no such stabilisation.'],
      ['ortho-Nitrophenol is more volatile than para-nitrophenol.', 'Its hydrogen bond is intramolecular.', 'So the molecules are less held together than in the para isomer.'],
      ['Phenol reacts with bromine water without a catalyst.', 'The –OH group strongly activates the ring.'],
    ],
    compare: [
      ['phenol', 'ethanol', ['Gives a violet colour with neutral FeCl₃.', 'Gives no colour with neutral FeCl₃.'], ['Dissolves in NaOH solution.', 'Doesn’t react with NaOH solution.']],
    ],
    truths: [
      ['Electron-withdrawing groups make phenol more acidic.', 'Electron-withdrawing groups make phenol less acidic.'],
      ['Phenol doesn’t liberate CO₂ from sodium carbonate.', 'Phenol liberates CO₂ vigorously from sodium carbonate.'],
      ['Picric acid is 2,4,6-trinitrophenol.', 'Picric acid is 2,4,6-tribromophenol.'],
    ],
    explain: [
      ['Give a chemical test to distinguish phenol from cyclohexanol.', 'Add neutral iron(III) chloride to each.', 'Phenol gives a violet colour, and cyclohexanol doesn’t.'],
    ],
  }),
  ...facts(7, 'c', {
    define: [
      ['the Williamson synthesis', 'Preparing an ether by reacting an alkoxide with a primary alkyl halide.'],
    ],
    recall: [
      ['Ethers are less polar than alcohols because they have:', 'no O–H bond', 'no oxygen', 'a shorter chain', 'more carbon'],
      ['Methoxybenzene with hot concentrated HI gives:', 'phenol and iodomethane', 'iodobenzene and methanol', 'benzene and methanol', 'phenol and methanol'],
      ['Which is the best route to ethoxyethane in the lab?', 'Ethanol with concentrated H₂SO₄ at 413 K', 'Ethanol with concentrated H₂SO₄ at 443 K', 'Ethene with water', 'Ethanal with hydrogen'],
    ],
    reason: [
      ['Di-tert-butyl ether can’t be made by the Williamson synthesis.', 'A tertiary halide undergoes elimination instead of substitution with a strong base.'],
      ['Ethers boil at lower temperatures than alcohols of the same mass.', 'Ether molecules can’t form hydrogen bonds with each other.'],
      ['Methoxybenzene with HI gives phenol, not iodobenzene.', 'The bond between the ring and oxygen has partial double bond character.', 'So iodide attacks the methyl carbon instead.'],
    ],
    truths: [
      ['The C–O–C bond angle in an ether is close to the tetrahedral value.', 'The C–O–C bond angle in an ether is close to 180°.'],
      ['Ethers are often used as solvents because they are quite unreactive.', 'Ethers are rarely used as solvents, because they react readily with most reagents.'],
      ['The methoxy group activates the benzene ring.', 'The methoxy group deactivates the benzene ring.'],
    ],
  }),

  // ---- Unit 8: Carbonyls and acids
  custom('name-carbonyl', [8, 'a', 1, 1], { type: 'structure', format: 'mcq' }, nameThis('carbonyls')),
  custom('name-acid', [8, 'b', 1, 1], { type: 'structure', format: 'mcq' }, nameThis('acids')),
  custom('functional-group', [8, 'a', 1, 1], { type: 'structure', format: 'mcq' }, (g) => {
    const [compound, right] = g.pick(GROUPS);
    return g.mcq('Which functional group does this compound have?', right, g.sample(GROUP_NAMES.filter((x) => x !== right), 3), { structure: { list: [compound], unnamed: 1 } });
  }),
  ...reactionBlueprints(8, 'a'),
  ...reactionBlueprints(8, 'b'),
  ...facts(8, 'a', {
    define: [
      ['aldol condensation', 'The joining of two molecules of an aldehyde or ketone that has an α-hydrogen, under dilute alkali.'],
      ['the Cannizzaro reaction', 'The reaction of an aldehyde with no α-hydrogen in concentrated alkali, in which one molecule is oxidised and another reduced.'],
      ['the Clemmensen reduction', 'Reducing a carbonyl group to –CH₂– using zinc amalgam and concentrated HCl.'],
      ['Tollens’ reagent', 'Ammoniacal silver nitrate, which gives a silver mirror with aldehydes.'],
    ],
    recall: [
      ['Which gives a positive iodoform test?', 'Ethanal', 'Propanal', 'Methanal', 'Benzaldehyde'],
      ['Which of these gives the Cannizzaro reaction?', 'Benzaldehyde', 'Ethanal', 'Propanone', 'Propanal'],
      ['Fehling’s solution gives a red precipitate with:', 'aliphatic aldehydes', 'all ketones', 'benzaldehyde', 'carboxylic acids'],
      ['Ketones are less reactive than aldehydes to nucleophiles because:', 'of crowding and two electron-releasing groups', 'they have no carbonyl group', 'they’re always heavier', 'they have more hydrogens'],
      ['Which is used to tell an aldehyde from a ketone?', 'Tollens’ reagent', 'Bromine water', 'Sodium bicarbonate', 'Neutral FeCl₃'],
      ['The carbon of a carbonyl group is:', 'sp² hybridised', 'sp hybridised', 'sp³ hybridised', 'unhybridised'],
    ],
    reason: [
      ['Aldehydes are more reactive than ketones towards nucleophiles.', 'An aldehyde’s carbonyl carbon is less crowded.', 'It also has only one electron-releasing group.'],
      ['Propanal boils higher than butane, though they have similar masses.', 'Its polar carbonyl group gives dipole–dipole attractions.'],
      ['Benzaldehyde gives no aldol condensation on its own.', 'It has no α-hydrogen.'],
    ],
    compare: [
      ['aldehydes', 'ketones', ['Reduce Tollens’ reagent.', 'Don’t reduce Tollens’ reagent.'], ['Oxidised easily to acids.', 'Oxidised only with difficulty.']],
      ['aldol condensation', 'the Cannizzaro reaction', ['Needs an α-hydrogen.', 'Needs no α-hydrogen.'], ['Uses dilute alkali.', 'Uses concentrated alkali.']],
    ],
    truths: [
      ['Methanal is the most reactive of the aldehydes towards nucleophiles.', 'Methanal is the least reactive of the aldehydes towards nucleophiles.'],
      ['Sodium bisulphite adds to most aldehydes.', 'Sodium bisulphite does not add to any aldehyde.'],
      ['The iodoform test needs a CH₃CO– group or a group that can form it.', 'The iodoform test needs a CHO group, whatever else is attached.'],
    ],
    explain: [
      ['Give a chemical test to tell ethanal from propanone.', 'Warm each with Tollens’ reagent.', 'Ethanal gives a silver mirror, and propanone doesn’t.'],
      ['Give a chemical test to tell propanal from propanone.', 'Warm each with iodine and sodium hydroxide.', 'Propanone gives a yellow precipitate of iodoform, and propanal doesn’t.'],
    ],
    long: [
      ['Write the mechanism of nucleophilic addition of hydrogen cyanide to a carbonyl compound.', 'Base removes a proton from HCN, forming the cyanide ion.', 'The cyanide ion attacks the carbonyl carbon, forming an alkoxide.', 'The alkoxide takes a proton, forming a cyanohydrin.'],
    ],
    cases: [
      {
        scene: 'Three unlabelled bottles hold ethanal, propanone and benzaldehyde. A student has Tollens’ reagent, Fehling’s solution and an iodine and alkali mixture.',
        parts: [
          ['Which liquids give a silver mirror?', 'Ethanal and benzaldehyde, the aldehydes.', 1],
          ['How does Fehling’s solution separate those two?', 'Only ethanal gives a red precipitate. Aromatic aldehydes don’t reduce it.', 1],
          ['Which test identifies propanone, and what is seen?', 'Iodine and alkali, which give a yellow precipitate of iodoform.', 1],
        ],
      },
    ],
  }),
  ...facts(8, 'b', {
    define: [
      ['the Hell–Volhard–Zelinsky reaction', 'Chlorination or bromination at the α-carbon of a carboxylic acid, using a halogen and red phosphorus.'],
      ['decarboxylation', 'The removal of CO₂ from a carboxylic acid or its salt, usually by heating with soda lime.'],
    ],
    recall: [
      ['Which is the strongest acid?', 'Trichloroacetic acid', 'Acetic acid', 'Chloroacetic acid', 'Propanoic acid'],
      ['Carboxylic acids liberate CO₂ from:', 'sodium bicarbonate', 'sodium chloride', 'water', 'ethanol'],
      ['Which reagent reduces a carboxylic acid to an alcohol?', 'LiAlH₄', 'NaBH₄', 'Zinc and HCl', 'Sodium and water'],
      ['Formic acid differs from other carboxylic acids because it:', 'reduces Tollens’ reagent', 'is insoluble in water', 'has no O–H bond', 'isn’t acidic'],
    ],
    reason: [
      ['Carboxylic acids are stronger acids than alcohols.', 'The carboxylate ion is stabilised by resonance, spreading the charge over two oxygens.', 'An alkoxide has no such resonance.'],
      ['Carboxylic acids have unusually high boiling points.', 'They form strong hydrogen-bonded dimers.'],
      ['Chloroacetic acid is stronger than acetic acid.', 'Chlorine’s −I effect stabilises the carboxylate ion.'],
      ['Formic acid reduces Tollens’ reagent, but acetic acid doesn’t.', 'Formic acid has an aldehyde-like hydrogen on its carbon.'],
    ],
    compare: [
      ['acetic acid', 'phenol', ['Gives CO₂ with sodium bicarbonate.', 'Doesn’t give CO₂ with sodium bicarbonate.'], ['A stronger acid.', 'A weaker acid.']],
    ],
    truths: [
      ['Electron-withdrawing groups raise the acid strength of carboxylic acids.', 'Electron-withdrawing groups lower the acid strength of carboxylic acids.'],
      ['Carboxylic acids don’t give typical carbonyl addition reactions.', 'Carboxylic acids give all the addition reactions of aldehydes.'],
      ['Benzoic acid is stronger than acetic acid.', 'Benzoic acid is weaker than acetic acid.'],
    ],
    explain: [
      ['Give a chemical test to tell benzoic acid from phenol.', 'Add sodium bicarbonate solution to each.', 'Benzoic acid gives bubbles of CO₂, and phenol doesn’t.'],
    ],
    cases: [
      {
        scene: 'A label on a bottle of vinegar says it contains about 5% ethanoic acid. To make a fruit-scented flavouring, a technician warms it with ethanol and a little concentrated sulphuric acid.',
        parts: [
          ['What type of compound gives the fruity smell?', 'An ester, here ethyl ethanoate.', 1],
          ['What does the sulphuric acid do?', 'It catalyses the reaction, and removes water.', 1],
          ['Why does vinegar fizz when poured on baking soda?', 'Ethanoic acid reacts with sodium bicarbonate, giving CO₂.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 9: Nitrogen compounds
  custom('name-amine', [9, 'a', 1, 1], { type: 'structure', format: 'mcq' }, nameThis('amines')),
  ...reactionBlueprints(9, 'a'),
  ...reactionBlueprints(9, 'b'),
  ...reactionBlueprints(9, 'c'),
  ...facts(9, 'a', {
    define: [
      ['the carbylamine test', 'Warming a primary amine with chloroform and alcoholic KOH, which gives a foul-smelling isocyanide.'],
      ['the Hinsberg test', 'Using benzenesulphonyl chloride to tell primary, secondary and tertiary amines apart.'],
      ['Gabriel phthalimide synthesis', 'A way of making pure primary aliphatic amines from phthalimide.'],
    ],
    recall: [
      ['Which is the strongest base in water?', 'Dimethylamine', 'Aniline', 'Ammonia', 'Trimethylamine'],
      ['Which is the weakest base?', 'Aniline', 'Methanamine', 'Ammonia', 'Dimethylamine'],
      ['Which gives the carbylamine test?', 'Aniline', 'Dimethylamine', 'Trimethylamine', 'N,N-Dimethylaniline'],
      ['The Hoffmann bromamide reaction gives an amine with:', 'one carbon fewer than the amide', 'one carbon more than the amide', 'the same number of carbons', 'two carbons fewer than the amide'],
      ['Aniline doesn’t undergo Friedel–Crafts reactions because:', 'it forms a salt with AlCl₃', 'it’s too heavy', 'it has no ring', 'it’s insoluble in everything'],
    ],
    reason: [
      ['Aniline is a weaker base than methanamine.', 'Its nitrogen’s lone pair is delocalised into the ring.', 'So it’s less available to take a proton.'],
      ['The –NH₂ group is acetylated before nitrating aniline.', 'This protects it from oxidation.', 'It also lessens the group’s activating effect, so one nitro group adds.'],
      ['Direct nitration of aniline gives a large amount of meta product.', 'In strong acid, aniline is protonated to the anilinium ion.', 'That ion directs meta.'],
      ['Primary amines boil higher than tertiary amines of similar mass.', 'They form intermolecular hydrogen bonds.', 'Tertiary amines have no N–H, so they can’t.'],
    ],
    compare: [
      ['primary amines', 'tertiary amines', ['Give the carbylamine test.', 'Don’t give the carbylamine test.'], ['With Hinsberg’s reagent, give a product soluble in alkali.', 'Don’t react with Hinsberg’s reagent.']],
      ['aniline', 'ethanamine', ['Gives a diazonium salt stable when cold.', 'Gives nitrogen gas with nitrous acid.'], ['A weaker base.', 'A stronger base.']],
    ],
    truths: [
      ['Alkylamines are stronger bases than ammonia.', 'Alkylamines are weaker bases than ammonia.'],
      ['Tertiary amines have the lowest boiling points of the three classes.', 'Tertiary amines have the highest boiling points of the three classes.'],
      ['Electron-withdrawing groups on the ring weaken the basicity of aniline.', 'Electron-withdrawing groups on the ring strengthen the basicity of aniline.'],
    ],
    explain: [
      ['Give a chemical test to tell a primary amine from a secondary amine.', 'Warm each with chloroform and alcoholic KOH.', 'The primary amine gives a foul-smelling isocyanide, and the secondary amine doesn’t.'],
    ],
    cases: [
      {
        scene: 'A dye chemist nitrates aniline directly and gets a tarry mess with a lot of unwanted meta product. Adding one protection step gives far better results.',
        parts: [
          ['What’s the protection step?', 'Acetylating the amine, to make acetanilide.', 1],
          ['Why does the direct route give meta product?', 'The acid protonates the amine, and the anilinium ion directs meta.', 1],
          ['How is the free amine recovered at the end?', 'By hydrolysis with acid or alkali.', 1],
        ],
      },
    ],
  }),
  ...facts(9, 'b', {
    define: [
      ['a nitrile', 'An organic compound with a –C≡N group, named from the hydrocarbon with the same number of carbons.'],
      ['an isocyanide', 'An organic compound with an –N≡C group, which has a foul smell.'],
    ],
    recall: [
      ['A nitrile on complete hydrolysis gives:', 'a carboxylic acid', 'an alcohol', 'an amine', 'an aldehyde'],
      ['An isocyanide on hydrolysis gives:', 'a primary amine and formic acid', 'a carboxylic acid and ammonia', 'an alcohol and ammonia', 'an aldehyde and water'],
      ['Reducing ethanenitrile with LiAlH₄ gives:', 'ethanamine', 'ethanol', 'methanamine', 'ethanoic acid'],
    ],
    reason: [
      ['A cyanide ion is ambident.', 'It can attack through carbon or nitrogen, as both carry a lone pair.'],
      ['AgCN gives mainly isocyanides with alkyl halides.', 'The Ag–C bond is largely covalent, which leaves the nitrogen’s lone pair to attack.'],
    ],
    compare: [
      ['nitriles', 'isocyanides', ['Hydrolysed to carboxylic acids.', 'Hydrolysed to primary amines.'], ['Have a mild smell.', 'Have a very foul smell.']],
    ],
    truths: [
      ['Nitriles are made from alkyl halides with alcoholic KCN.', 'Nitriles are made from alkyl halides with AgCN.'],
      ['Making a nitrile from an alkyl halide lengthens the carbon chain by one.', 'Making a nitrile from an alkyl halide shortens the carbon chain by one.'],
      ['The carbon in a nitrile group is sp hybridised.', 'The carbon in a nitrile group is sp³ hybridised.'],
    ],
  }),
  ...facts(9, 'c', {
    define: [
      ['diazotisation', 'Converting a primary aromatic amine into a diazonium salt, with nitrous acid at 273–278 K.'],
      ['a coupling reaction', 'A diazonium salt reacting with a phenol or an aromatic amine, to form a brightly coloured azo compound.'],
    ],
    recall: [
      ['Diazotisation is done at a low temperature because:', 'the salt decomposes when warmed', 'nitrous acid needs ice to form', 'aniline freezes above that', 'the reaction is endothermic'],
      ['Aryl diazonium salts are more stable than alkyl ones because of:', 'resonance with the ring', 'their lower mass', 'their greater size', 'their solubility'],
      ['Which reagent replaces the diazonium group with hydrogen?', 'H₃PO₂', 'CuCl', 'KI', 'H₂O'],
    ],
    reason: [
      ['Aryl diazonium salts are made and used below 278 K.', 'They break down readily when warmed, giving nitrogen.'],
      ['Azo dyes are strongly coloured.', 'The –N=N– group extends the conjugation between the two rings.', 'So they absorb visible light.'],
    ],
    truths: [
      ['Coupling with phenol takes place in mildly alkaline conditions.', 'Coupling with phenol takes place in strongly acidic conditions.'],
      ['Diazonium salts replace their group with iodine without any copper catalyst.', 'Diazonium salts need a copper catalyst to replace their group with iodine.'],
      ['Warming a diazonium salt in water gives phenol.', 'Warming a diazonium salt in water gives aniline.'],
    ],
  }),

  // ---- Unit 10: Biomolecules
  ...facts(10, 'a', {
    define: [
      ['anomers', 'Isomers of a cyclic sugar that differ only in the configuration at the carbon formed from the carbonyl group.'],
      ['a glycosidic linkage', 'The oxide link that joins two monosaccharide units.'],
      ['a reducing sugar', 'A sugar that reduces Fehling’s or Tollens’ reagent.'],
      ['a monosaccharide', 'A sugar that can’t be broken down into simpler sugars by hydrolysis.'],
    ],
    recall: [
      ['Which of these is a non-reducing sugar?', 'Sucrose', 'Glucose', 'Maltose', 'Lactose'],
      ['Starch is made up of:', 'α-glucose units', 'β-glucose units', 'fructose units', 'galactose units'],
      ['Cellulose is made up of:', 'β-glucose units', 'α-glucose units', 'fructose units', 'sucrose units'],
      ['Glucose has an aldehyde group, which is shown by its oxidation with bromine water to:', 'gluconic acid', 'saccharic acid', 'n-hexane', 'sorbitol'],
      ['Lactose breaks down on hydrolysis to:', 'glucose and galactose', 'two glucose units', 'glucose and fructose', 'two fructose units'],
      ['Sucrose on hydrolysis gives:', 'glucose and fructose', 'two glucose units', 'glucose and galactose', 'two galactose units'],
    ],
    reason: [
      ['Sucrose doesn’t reduce Fehling’s solution.', 'Its reducing groups are tied up in the glycosidic link.'],
      ['Sucrose is called invert sugar after hydrolysis.', 'Hydrolysis changes the sign of its rotation from right to left.', 'Fructose’s strong left rotation outweighs glucose’s right rotation.'],
      ['Humans can digest starch, but not cellulose.', 'Humans have no enzyme to break β-glycosidic links.'],
    ],
    compare: [
      ['starch', 'cellulose', ['Made of α-glucose.', 'Made of β-glucose.'], ['Digested by humans.', 'Not digested by humans.'], ['Partly branched and coiled.', 'Straight chains, which form strong fibres.']],
      ['amylose', 'amylopectin', ['A straight chain.', 'A branched chain.'], ['Soluble in water.', 'Insoluble in water.']],
    ],
    truths: [
      ['Glucose is an aldohexose.', 'Glucose is a ketohexose.'],
      ['Fructose is a ketohexose.', 'Fructose is an aldopentose.'],
      ['Maltose is a reducing sugar.', 'Maltose is a non-reducing sugar.'],
    ],
    explain: [
      ['Write the reaction that shows that glucose has an aldehyde group.', 'Bromine water oxidises it to gluconic acid.', 'Only an aldehyde group is oxidised by this mild reagent.'],
      ['Give the evidence that glucose has a straight chain of six carbons.', 'Prolonged heating with HI gives n-hexane.'],
    ],
  }),
  ...facts(10, 'b', {
    define: [
      ['a peptide bond', 'The –CO–NH– link formed between two amino acids, with loss of water.'],
      ['a zwitter ion', 'An ion with both a positive and a negative charge, as an amino acid forms in solution.'],
      ['denaturation of a protein', 'The loss of a protein’s shape and activity under heat or a change in pH, without breaking its peptide bonds.'],
      ['an essential amino acid', 'An amino acid the body can’t make, so it has to be in the diet.'],
    ],
    recall: [
      ['Which protein structure refers to its sequence of amino acids?', 'Primary', 'Secondary', 'Tertiary', 'Quaternary'],
      ['Which is a fibrous protein?', 'Keratin', 'Insulin', 'Albumin', 'Haemoglobin'],
      ['Which is a globular protein?', 'Insulin', 'Keratin', 'Myosin', 'Collagen'],
      ['An α-helix is an example of:', 'secondary structure', 'primary structure', 'quaternary structure', 'denaturation'],
      ['Which amino acid has no chiral centre?', 'Glycine', 'Alanine', 'Valine', 'Leucine'],
    ],
    reason: [
      ['Boiling an egg changes it irreversibly.', 'Heat denatures its proteins, which destroys their shape.'],
      ['Amino acids behave like salts, with high melting points.', 'They exist as zwitter ions.', 'So strong electrostatic forces hold them together.'],
      ['Glycine is optically inactive.', 'Its α-carbon carries two hydrogen atoms, so it isn’t chiral.'],
    ],
    compare: [
      ['fibrous proteins', 'globular proteins', ['Long, thread-like molecules.', 'Rounded, folded molecules.'], ['Insoluble in water.', 'Soluble in water.'], ['Example: keratin.', 'Example: insulin.']],
    ],
    truths: [
      ['Enzymes are mostly proteins.', 'Enzymes are mostly carbohydrates.'],
      ['Denaturation doesn’t break peptide bonds.', 'Denaturation breaks all the peptide bonds.'],
      ['Natural amino acids are mostly the L form.', 'Natural amino acids are mostly the D form.'],
    ],
    draw: [
      ['Write the structure of the dipeptide formed from glycine and alanine, and mark the peptide link.', 'H₂N–CH₂–CO–NH–CH(CH₃)–COOH, with glycine at the N end.', 'The –CO–NH– group marked as the peptide link.'],
      ['Draw the structure of glycine as a zwitter ion.', '⁺H₃N–CH₂–COO⁻.', 'A positive charge on the nitrogen, and a negative charge on the carboxylate group.'],
    ],
    cases: [
      {
        scene: 'When milk is left out, bacteria turn its lactose into lactic acid. The milk curdles, because the change of pH affects its proteins.',
        parts: [
          ['What happens to the proteins as the pH changes?', 'They denature, losing their shape.', 1],
          ['Which level of protein structure is not affected?', 'The primary structure, as peptide bonds aren’t broken.', 1],
          ['Which two sugars make up lactose?', 'Glucose and galactose.', 1],
        ],
      },
    ],
  }),
  ...facts(10, 'c', {
    define: [
      ['a vitamin', 'An organic compound needed in small amounts in the diet for normal health.'],
    ],
    recall: [
      ['A lack of vitamin C causes:', 'scurvy', 'rickets', 'night blindness', 'beriberi'],
      ['A lack of vitamin D causes:', 'rickets', 'scurvy', 'night blindness', 'beriberi'],
      ['A lack of vitamin A causes:', 'night blindness', 'scurvy', 'rickets', 'anaemia'],
      ['A lack of vitamin B₁ causes:', 'beriberi', 'scurvy', 'rickets', 'night blindness'],
      ['Which vitamin is water-soluble?', 'Vitamin C', 'Vitamin A', 'Vitamin D', 'Vitamin E'],
      ['Which vitamin is fat-soluble?', 'Vitamin K', 'Vitamin C', 'Vitamin B₁', 'Vitamin B₁₂'],
    ],
    reason: [
      ['Water-soluble vitamins must be taken regularly in the diet.', 'They’re passed out in urine and aren’t stored in the body.'],
      ['Vitamin C can’t be stored in large amounts.', 'It’s water-soluble, so any excess is excreted.'],
    ],
    compare: [
      ['fat-soluble vitamins', 'water-soluble vitamins', ['A, D, E and K.', 'B group and C.'], ['Stored in the liver and fat tissue.', 'Not stored much, and excreted.']],
    ],
    truths: [
      ['Vitamin K helps blood to clot.', 'Vitamin K helps vision in dim light.'],
      ['Vitamin B₁₂ deficiency causes pernicious anaemia.', 'Vitamin B₁₂ deficiency causes rickets.'],
      ['Vitamin D helps the body absorb calcium.', 'Vitamin D prevents the body absorbing calcium.'],
    ],
  }),
  ...facts(10, 'd', {
    define: [
      ['a nucleoside', 'A base joined to a pentose sugar.'],
      ['a nucleotide', 'A base, a pentose sugar and a phosphate group, joined together.'],
      ['the double helix', 'The structure of DNA: two strands wound round each other, held together by hydrogen bonds between bases.'],
    ],
    recall: [
      ['Which base is found in RNA, but not in DNA?', 'Uracil', 'Thymine', 'Adenine', 'Guanine'],
      ['Which base is found in DNA, but not in RNA?', 'Thymine', 'Uracil', 'Adenine', 'Cytosine'],
      ['In DNA, adenine pairs with:', 'thymine', 'guanine', 'cytosine', 'uracil'],
      ['In DNA, guanine pairs with:', 'cytosine', 'adenine', 'thymine', 'uracil'],
      ['The sugar in RNA is:', 'ribose', 'deoxyribose', 'glucose', 'fructose'],
      ['Which of these is a purine base?', 'Adenine', 'Cytosine', 'Thymine', 'Uracil'],
    ],
    reason: [
      ['DNA strands are complementary.', 'Each base pairs with one partner only.', 'So the sequence on one strand fixes the sequence on the other.'],
      ['Base pairs in DNA are always a purine and a pyrimidine.', 'That keeps the width of the helix constant.'],
    ],
    compare: [
      ['DNA', 'RNA', ['Has deoxyribose.', 'Has ribose.'], ['Has thymine.', 'Has uracil.'], ['A double helix.', 'Usually a single strand.']],
    ],
    truths: [
      ['DNA is the genetic material of most living things.', 'RNA is the genetic material of most living things.'],
      ['Adenine and thymine are joined by two hydrogen bonds.', 'Adenine and thymine are joined by three hydrogen bonds.'],
      ['Guanine and cytosine are joined by three hydrogen bonds.', 'Guanine and cytosine are joined by two hydrogen bonds.'],
    ],
  }),
  custom('oxidant-equations', [4, 'b', 2, 2], { type: 'reaction', format: 'short' }, (g) => {
    const [ask, products, why] = g.pick([
      ['acidified potassium dichromate with iron(II) ions', 'Cr₂O₇²⁻ + 14H⁺ + 6Fe²⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O', 'Orange dichromate turns green as Cr³⁺ forms.'],
      ['acidified potassium dichromate with iodide ions', 'Cr₂O₇²⁻ + 14H⁺ + 6I⁻ → 2Cr³⁺ + 3I₂ + 7H₂O', 'Iodide is oxidised to iodine.'],
      ['acidified potassium dichromate with hydrogen sulphide', 'Cr₂O₇²⁻ + 8H⁺ + 3H₂S → 2Cr³⁺ + 3S + 7H₂O', 'Sulphur separates out.'],
      ['acidified potassium permanganate with iron(II) ions', 'MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O', 'Purple permanganate is decolourised.'],
      ['acidified potassium permanganate with iodide ions', '2MnO₄⁻ + 16H⁺ + 10I⁻ → 2Mn²⁺ + 5I₂ + 8H₂O', 'Iodide is oxidised to iodine.'],
      ['acidified potassium permanganate with oxalate ions', '2MnO₄⁻ + 16H⁺ + 5C₂O₄²⁻ → 2Mn²⁺ + 10CO₂ + 8H₂O', 'Oxalate is oxidised to carbon dioxide.'],
      ['potassium permanganate with sulphur dioxide', '2MnO₄⁻ + 5SO₂ + 2H₂O → 2Mn²⁺ + 5SO₄²⁻ + 4H⁺', 'Sulphur dioxide is oxidised to sulphate.'],
      ['potassium permanganate with iodide in alkaline solution', '2MnO₄⁻ + H₂O + I⁻ → 2MnO₂ + 2OH⁻ + IO₃⁻', 'In alkali, MnO₂ forms rather than Mn²⁺.'],
    ]);
    return g.theory(`Write the balanced ionic equation for the reaction of ${ask}.`, [[`${products}`, 1], [why, 1]]);
  }),
  custom('oxidant-preparation', [4, 'b', 3, 2], { type: 'reaction', format: 'short' }, (g) => {
    const dichromate = g.chance(0.5);
    return dichromate
      ? g.theory('Write the equations for the steps that turn sodium chromate into potassium dichromate, starting from the acidification.', [
          ['2Na₂CrO₄ + 2H⁺ → Na₂Cr₂O₇ + 2Na⁺ + H₂O.', 1],
          ['Na₂Cr₂O₇ + 2KCl → K₂Cr₂O₇ + 2NaCl.', 1],
          ['Potassium dichromate crystallises first, as it is the less soluble.', 1],
        ])
      : g.theory('Write the equations for the steps that turn manganese dioxide into potassium permanganate.', [
          ['2MnO₂ + 4KOH + O₂ → 2K₂MnO₄ + 2H₂O, by fusing with alkali in air.', 1],
          ['In acid, manganate disproportionates: 3MnO₄²⁻ + 4H⁺ → 2MnO₄⁻ + MnO₂ + 2H₂O.', 1],
          ['The purple permanganate is then crystallised out.', 1],
        ]);
  }),
  custom('transition-equations', [4, 'a', 2, 2], { type: 'reaction', format: 'short' }, (g) => {
    const [ask, equation, why] = g.pick([
      ['copper(I) ions disproportionate in water', '2Cu⁺ → Cu²⁺ + Cu', 'Cu²⁺ is more stable in water, owing to its large hydration enthalpy.'],
      ['manganese(III) ions disproportionate in water', '2Mn³⁺ + 2H₂O → Mn²⁺ + MnO₂ + 4H⁺', 'Mn²⁺, with a half-filled d subshell, is especially stable.'],
      ['copper(II) ions oxidise iodide ions', '2Cu²⁺ + 4I⁻ → 2CuI + I₂', 'Copper(II) iodide isn’t stable, so it gives copper(I) iodide and iodine.'],
      ['iron(III) ions oxidise iodide ions', '2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂', 'Iron(III) is a strong enough oxidant to free iodine.'],
    ]);
    return g.theory(`Write the balanced equation for this change, and give a reason for it: ${ask}.`, [[equation, 1], [why, 1]]);
  }),
  custom('transition-moment', [4, 'a', 3, 2], { type: 'structure', format: 'short' }, (g) => {
    const [ion, config, unpaired] = g.pick<[string, string, number]>([
      ['Sc³⁺', '[Ar] 3d⁰', 0], ['Ti³⁺', '[Ar] 3d¹', 1], ['V³⁺', '[Ar] 3d²', 2], ['Cr³⁺', '[Ar] 3d³', 3], ['Mn²⁺', '[Ar] 3d⁵', 5], ['Fe²⁺', '[Ar] 3d⁶', 4], ['Fe³⁺', '[Ar] 3d⁵', 5], ['Co²⁺', '[Ar] 3d⁷', 3], ['Ni²⁺', '[Ar] 3d⁸', 2], ['Cu²⁺', '[Ar] 3d⁹', 1], ['Zn²⁺', '[Ar] 3d¹⁰', 0],
    ]);
    const moment = Math.sqrt(unpaired * (unpaired + 2));
    return g.theory(`For the free ion ${ion}, write the electronic configuration, the number of unpaired electrons, and the spin-only magnetic moment.`, [
      [`The configuration is ${config}.`, 1],
      [`It has ${unpaired} unpaired ${unpaired === 1 ? 'electron' : 'electrons'}.`, 1],
      [`$\\mu = \\sqrt{n(n + 2)} = ${moment.toFixed(2)}$ BM.`, 1],
    ]);
  }),
  custom('protein-levels', [10, 'b', 3, 2], { type: 'structure', format: 'short' }, (g) => {
    const [level, bond, what] = g.pick([
      ['primary', 'peptide bonds', 'The order of the amino acids along the chain.'],
      ['secondary', 'hydrogen bonds between peptide groups', 'The folding of the chain into an α-helix or a β-pleated sheet.'],
      ['tertiary', 'hydrogen bonds, disulphide links and other side-chain forces', 'The overall folding of the whole chain.'],
      ['quaternary', 'forces between separate chains', 'The arrangement of two or more chains in one protein.'],
    ]);
    return g.theory(`What is meant by the ${level} structure of a protein? Which bonds or forces hold it together? How is it affected on denaturation, if at all?`, [
      [what, 1],
      [`It is held by ${bond}.`, 1],
      [level === 'primary' ? 'Denaturation leaves it unchanged, as peptide bonds aren’t broken.' : 'Denaturation destroys it, as these weaker forces are disrupted.', 1],
    ]);
  }),
  ...rest(),
  ...derivationBlueprints('chemistry', 'XII', { custom } as never),
];

export default blueprints;
