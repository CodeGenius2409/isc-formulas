// Practice questions drawn from the checked structures, so their answers are the same facts the checker
// verified: the shape, the lone pairs, the hybridisation and the formal charges.
import { formalCharge, formulaText } from '../../data/lewis/check';
import { LEWIS } from '../../data/lewis/figures';
import type { LewisMolecule } from '../../data/lewis/types';
import type { Bank, Place } from './define';
import type { BankDef } from './types';

const SHAPES = ['linear', 'trigonal planar', 'bent', 'tetrahedral', 'trigonal pyramidal', 'trigonal bipyramidal', 'see-saw', 'T-shaped', 'octahedral', 'square pyramidal', 'square planar'];

const mol = (id: string): LewisMolecule => LEWIS[id].forms[0];
const written = (m: LewisMolecule) => formulaText(m.formula, m.charge);
const hybText = (h: string) => h.replace(/2/g, '²').replace(/3/g, '³');
const seedOf = (text: string) => [...text].reduce((sum, c) => sum + c.charCodeAt(0), 0);

/** Puts the right answer at a position set by the question, so it doesn't always sit first. */
function arranged(right: string, wrong: string[], seed: string): { options: string[]; answer: number } {
  const answer = seedOf(seed) % (wrong.length + 1);
  const options = [...wrong];
  options.splice(answer, 0, right);
  return { options, answer };
}

function wrongFrom(pool: string[], right: string, seed: string, count = 3): string[] {
  const others = pool.filter((p) => p !== right);
  const start = seedOf(seed) % others.length;
  return Array.from({ length: count }, (_, i) => others[(start + i) % others.length]);
}

function shapeQuestion(b: Bank, id: string, place: Place): BankDef {
  const m = mol(id);
  const text = `According to VSEPR theory, what is the shape of ${written(m)}?`;
  const { options, answer } = arranged(m.shape!, wrongFrom(SHAPES, m.shape!, id), id);
  return b.mcq(place, text, options, answer, undefined, { answerLewis: [id] });
}

function lonePairQuestion(b: Bank, id: string, place: Place): BankDef {
  const m = mol(id);
  const lone = m.atoms[m.central!].lp ?? 0;
  const counts = ['0', '1', '2', '3'];
  return b.mcq(place, `How many lone pairs are on the central atom of ${written(m)}?`, counts, counts.indexOf(String(lone)), undefined, { answerLewis: [id] });
}

function hybQuestion(b: Bank, id: string, place: Place, pool: string[]): BankDef {
  const m = mol(id);
  const text = `What is the hybridisation of the central atom in ${written(m)}?`;
  const right = hybText(m.hyb!);
  const { options, answer } = arranged(right, wrongFrom(pool.map(hybText), right, id), id);
  return b.mcq(place, text, options, answer, undefined, { answerLewis: [id] });
}

function drawQuestion(b: Bank, id: string, place: Place, ask: string, points: (string | [string, number])[]): BankDef {
  return b.theory('structure', place, ask, points, { answerLewis: [id] });
}

const CENTRE_HYB = ['sp', 'sp2', 'sp3', 'sp3d', 'sp3d2'];
const COMPLEX_HYB = ['sp', 'sp3', 'dsp2', 'd2sp3', 'sp3d2'];

export function bondingQuestions(b: Bank): BankDef[] {
  const ozone = mol('ozone');
  const [centre, double, single] = [0, 1, 2].map((i) => formalCharge(ozone, i));
  return [
    ...['water', 'ammonia', 'bf3', 'becl2', 'pcl5', 'sf4', 'clf3', 'sf6', 'brf5', 'i3', 'icl4', 'so2'].map((id) => shapeQuestion(b, id, [4, 'b', 1, 2])),
    ...['water', 'ammonia', 'sf4', 'clf3', 'i3', 'icl4'].map((id) => lonePairQuestion(b, id, [4, 'b', 1, 2])),
    ...['bf3', 'becl2', 'pcl5', 'sf6', 'ammonia', 'co2'].map((id) => hybQuestion(b, id, [4, 'b', 1, 2], CENTRE_HYB)),
    drawQuestion(b, 'water', [4, 'a', 2, 1], 'Draw the Lewis structure of H₂O, showing every lone pair, and state its shape.', ['Two O-H single bonds and two lone pairs on oxygen.', 'The shape is bent.']),
    drawQuestion(b, 'ammonia', [4, 'a', 2, 1], 'Draw the Lewis structure of NH₃, showing every lone pair, and state its shape.', ['Three N-H single bonds and one lone pair on nitrogen.', 'The shape is trigonal pyramidal.']),
    drawQuestion(b, 'co2', [4, 'a', 2, 1], 'Draw the Lewis structure of CO₂, and state how many lone pairs each oxygen has.', ['Two C=O double bonds, and no lone pairs on carbon.', 'Each oxygen has two lone pairs.']),
    drawQuestion(b, 'hydronium', [4, 'a', 2, 2], 'Show how a coordinate bond forms in the hydronium ion, H₃O⁺.', ['Oxygen in water has two lone pairs.', 'It gives one of them to H⁺, forming the coordinate bond.']),
    drawQuestion(b, 'no', [4, 'a', 2, 2], 'Draw the Lewis structure of NO. Why doesn\'t it obey the octet rule?', ['N=O, with one lone pair and one unpaired electron on nitrogen, and two lone pairs on oxygen.', 'It has 11 valence electrons, an odd number, so one atom can\'t have an octet.']),
    drawQuestion(b, 'ozone', [4, 'a', 3, 2], 'Draw the resonance structures of ozone, and work out the formal charge on each oxygen atom in one of them.', ['Two structures, with the double bond to a different terminal oxygen, joined by a double-headed arrow.', `The central oxygen has a formal charge of +${centre}.`, `The doubly bonded oxygen has ${double}, and the singly bonded oxygen has −${-single}.`]),
    drawQuestion(b, 'carbonate', [4, 'a', 3, 2], 'Draw the resonance structures of the carbonate ion, and find its C-O bond order.', ['Three structures, each with one C=O and two C-O⁻ bonds.', 'They are joined by double-headed arrows, and the true structure is a hybrid.', 'Bond order = (2 + 1 + 1)/3 = 4/3.']),
    drawQuestion(b, 'water-dimer', [4, 'a', 2, 2], 'Draw a hydrogen bond between two water molecules, and say which lone pair takes part.', ['A dotted line joins the hydrogen of one molecule to the oxygen of the other.', 'It is held by a lone pair on the oxygen of the second molecule.']),
    drawQuestion(b, 'sf4', [4, 'b', 3, 3], 'Use VSEPR theory to predict the shape of SF₄. State the number of bond pairs and lone pairs, and the hybridisation.', ['Four bond pairs and one lone pair, so five electron domains.', 'The hybridisation is sp³d.', 'The lone pair sits in an equatorial position, giving a see-saw shape.']),
    drawQuestion(b, 'clf3', [4, 'b', 3, 3], 'Use VSEPR theory to predict the shape of ClF₃. State the number of bond pairs and lone pairs, and the hybridisation.', ['Three bond pairs and two lone pairs, so five electron domains.', 'The hybridisation is sp³d.', 'Both lone pairs take equatorial positions, giving a T shape.']),
  ];
}

export function organicConceptQuestions(b: Bank): BankDef[] {
  return [
    shapeQuestion(b, 'methyl-cation', [8, 'c', 1, 2]),
    shapeQuestion(b, 'methyl-anion', [8, 'c', 1, 2]),
    hybQuestion(b, 'methyl-cation', [8, 'c', 1, 2], CENTRE_HYB),
    hybQuestion(b, 'methyl-anion', [8, 'c', 1, 2], CENTRE_HYB),
    drawQuestion(b, 'cyanide', [8, 'c', 2, 2], 'Draw the cyanide ion with its lone pairs. Is it a nucleophile or an electrophile? Give a reason.', ['A triple bond between C and N, with a lone pair on each, and a negative charge on carbon.', 'It is a nucleophile, because it has a lone pair to donate to an electron-poor centre.']),
  ];
}

export function complexQuestions(b: Bank): BankDef[] {
  return [
    ...['co-ammine', 'ni-cyanide', 'ni-chloride', 'ag-ammine'].map((id) => shapeQuestion(b, id, [5, 'a', 1, 2])),
    ...['co-ammine', 'fe-aqua', 'ni-cyanide', 'ni-chloride', 'ag-ammine'].map((id) => hybQuestion(b, id, [5, 'a', 1, 2], COMPLEX_HYB)),
    b.mcq([5, 'a', 1, 1], 'Which atoms can thiocyanate, SCN⁻, bond to a metal through?', ['S or N', 'C only', 'S only', 'N only'], 0, 'It is ambidentate, with a lone pair available on each of those atoms.', { answerLewis: ['ligand-scn'] }),
    b.mcq([5, 'a', 1, 1], 'How many donor atoms does ethane-1,2-diamine use?', ['1', '2', '3', '4'], 1, 'Each of its two nitrogen atoms has a lone pair.', { answerLewis: ['ligand-en'] }),
    drawQuestion(b, 'co-ammine', [5, 'a', 3, 2], 'For [Co(NH₃)₆]³⁺, state the oxidation state of cobalt, the donor atom, the hybridisation and the shape.', ['Cobalt is in the +3 state.', 'Each NH₃ donates a lone pair through nitrogen.', 'd²sp³ hybridisation, so the shape is octahedral.']),
    drawQuestion(b, 'ni-cyanide', [5, 'a', 2, 2], 'Using its hybridisation, predict the shape of [Ni(CN)₄]²⁻ and its magnetic behaviour.', ['dsp² hybridisation gives a square planar shape.', 'All its d electrons are paired, so it is diamagnetic.']),
    drawQuestion(b, 'ni-chloride', [5, 'a', 2, 2], 'Using its hybridisation, predict the shape of [NiCl₄]²⁻ and its magnetic behaviour.', ['sp³ hybridisation gives a tetrahedral shape.', 'It has two unpaired d electrons, so it is paramagnetic.']),
    drawQuestion(b, 'cisplatin', [5, 'a', 2, 2], 'Draw the two geometrical isomers of [Pt(NH₃)₂Cl₂].', ['cis: square planar, with the like ligands side by side.', 'trans: square planar, with the like ligands opposite each other.']),
  ];
}

export function amineQuestions(b: Bank): BankDef[] {
  return [
    drawQuestion(b, 'aniline-pair', [9, 'a', 2, 2], 'Show the lone pair in aniline, and use it to explain why aniline is a weaker base than methylamine.', ['The nitrogen in aniline has one lone pair, delocalised into the benzene ring.', 'So it is less available to accept a proton than the lone pair in methylamine.']),
    drawQuestion(b, 'dimethylamine', [9, 'a', 2, 2], 'Show the lone pair in dimethylamine. Why is it a stronger base than methylamine in water?', ['One lone pair on nitrogen, with two methyl groups and one hydrogen.', 'Two +I methyl groups push more electron density onto nitrogen, and the ion formed is well solvated.']),
  ];
}
