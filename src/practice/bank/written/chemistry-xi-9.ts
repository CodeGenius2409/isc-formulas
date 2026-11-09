// Written by hand: Hydrocarbons. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, ar, theory } = bank('chemistry', 'XI');
const A = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [9, 'a', marks, d];
const Y = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [9, 'c', marks, d];
const B = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [9, 'd', marks, d];

const questions: BankDef[] = [
  // ---- Alkanes
  mcq(A(1, 2), 'The number of structural isomers of C₅H₁₂ is:', ['2', '3', '4', '5'], 1),
  theory('reason', A(1, 2), 'Give a reason: the staggered form of ethane is more stable than the eclipsed one.', ['Its C–H bonds are as far apart as possible, so the repulsion between them is least.']),
  theory('short', A(3, 2), 'Write the three kinds of step, with an equation for each, in the chlorination of methane.', ['Initiation: Cl₂ → 2Cl• in light.', 'Propagation: CH₄ + Cl• → CH₃• + HCl, then CH₃• + Cl₂ → CH₃Cl + Cl•.', 'Termination: two radicals join, for example CH₃• + Cl• → CH₃Cl.']),
  theory('short', A(2, 2), 'What is pyrolysis of an alkane, and why is it useful?', ['Heating an alkane without air, which breaks it into smaller molecules.', 'It gives smaller alkanes and alkenes, which are useful fuels and raw materials.']),
  // ---- Alkynes
  mcq(Y(1, 1), 'In ethyne, the carbon atoms are:', ['sp³ hybridised', 'sp² hybridised', 'sp hybridised', 'not hybridised'], 2),
  mcq(Y(1, 1), 'The triple bond in ethyne has:', ['three σ bonds', 'one σ and two π bonds', 'two σ and one π bond', 'three π bonds'], 1),
  mcq(Y(1, 2), 'Ethyne is prepared in the laboratory from water and:', ['CaC₂', 'CaO', 'CaCO₃', 'C₂H₄'], 0),
  mcq(Y(1, 3), 'Propyne is hydrated with dilute H₂SO₄ and HgSO₄. The main product is:', ['propanal', 'propanone', 'propan-1-ol', 'propanoic acid'], 1),
  ar(Y(1, 3), 'Ethyne adds two molecules of HBr, to give 1,1-dibromoethane.', 'The second molecule adds according to Markovnikov’s rule.', 1),
  theory('short', Y(2, 2), 'Write the equation for the action of water on calcium carbide, and name the gas.', ['CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂.', 'The gas is ethyne.']),
  // ---- Aromatic hydrocarbons
  mcq(B(1, 2), 'In nitrobenzene, a second nitro group enters mainly at the:', ['ortho position', 'meta position', 'para position', 'nitro carbon'], 1),
  mcq(B(1, 2), 'Friedel–Crafts acylation of benzene with ethanoyl chloride gives:', ['toluene', 'acetophenone', 'benzoic acid', 'phenol'], 1),
  theory('reason', B(1, 2), 'Give a reason: all the carbon–carbon bonds of benzene have the same length.', ['Its π electrons are delocalised over the ring, so each bond is between a single and a double bond.']),
  theory('short', B(2, 2), 'Why is exposure to benzene a health concern, and what is the kind of harm?', ['Benzene is toxic, and is carcinogenic.', 'Long exposure is linked to leukaemia, so it’s handled with care.']),
];

export default questions;
