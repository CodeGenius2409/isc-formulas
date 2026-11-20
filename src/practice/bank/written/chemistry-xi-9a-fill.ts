// Written by hand: alkanes, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// Boiling points of the straight-chain alkanes C1–C8 are the usual data-book values, in kelvin.
import { at, kit, type BankDef } from '../define';
import { graph, label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, ar } = kit('chemistry', 'XI');
const A = at(9, 'a');

/** A Newman projection centred at (cx, 90): front bonds meet at the centre, back bonds start at the circle; back is the angle of the first back bond. */
const newman = (cx: number, back: number): SketchMark[] => {
  const pt = (deg: number, r: number): [number, number] => [cx + r * Math.sin((deg * Math.PI) / 180), 90 - r * Math.cos((deg * Math.PI) / 180)];
  const h = (deg: number, r: number) => label(pt(deg, r)[0], pt(deg, r)[1] + 5, 'H');
  return [
    { t: 'circle', x: cx, y: 90, r: 26 },
    ...[0, 120, 240].flatMap((d) => [line([[cx, 90], pt(d, 46)]), h(d, 58)]),
    ...[back, back + 120, back + 240].flatMap((d) => [line([pt(d, 26), pt(d, 62)]), h(d, 74)]),
  ];
};

const questions: BankDef[] = [
  figure(A(3, 2), 'Draw Newman projections of the staggered and eclipsed conformations of ethane, and say which is more stable and why.', ['Staggered: the three C–H bonds of the back carbon lie half-way between those of the front carbon, at 60° to them.', 'Eclipsed: the back C–H bonds lie directly behind the front ones, drawn slightly turned so that they can be seen.', 'The staggered form is more stable, as its hydrogens are as far apart as possible, with the least repulsion between the bond pairs.'], {
    answer: sketch(360, 200, 'Two Newman projections. In each, a circle stands for the back carbon; three bonds to H meet at the centre for the front carbon, and three bonds to H come from the edge of the circle for the back carbon. Left, staggered: the back bonds lie between the front bonds. Right, eclipsed: the back bonds lie almost behind the front bonds.', [
      ...newman(90, 60), label(90, 190, 'staggered'), ...newman(270, 20), label(270, 190, 'eclipsed'),
    ]),
  }),
  figure(A(3, 2), 'The graph shows the boiling points of the straight-chain alkanes against the number of carbon atoms. Describe and explain the trend, and estimate the boiling point of nonane, C₉H₂₀.', ['The boiling point rises steadily with the number of carbon atoms, by less at each step.', 'Longer chains have more surface for van der Waals forces between molecules, which need more energy to overcome.', 'Carrying the curve on gives about 425 K, about 150 °C, for nonane.'], {
    shown: graph('number of carbon atoms', 'boiling point (K)', [{ points: [[1, 111], [2, 184], [3, 231], [4, 272], [5, 309], [6, 342], [7, 371], [8, 399]] }], { x: [[2, '2'], [4, '4'], [6, '6'], [8, '8']], y: [[100, '100'], [200, '200'], [300, '300'], [400, '400']] }),
  }),
  figure(A(3, 2), 'Make a table of the three structural isomers of C₅H₁₂, giving the condensed formula and IUPAC name of each, and put them in order of boiling point.', ['CH₃CH₂CH₂CH₂CH₃, pentane, boils highest, at 36 °C.', '(CH₃)₂CHCH₂CH₃, 2-methylbutane, at 28 °C.', 'C(CH₃)₄, 2,2-dimethylpropane, lowest at 10 °C: the more branched, the more nearly spherical, and the weaker the forces between molecules.'], {
    answer: table(['Condensed formula', 'IUPAC name', 'Boiling point (°C)'], [['CH₃CH₂CH₂CH₂CH₃', 'pentane', '36'], ['(CH₃)₂CHCH₂CH₃', '2-methylbutane', '28'], ['C(CH₃)₄', '2,2-dimethylpropane', '10']]),
  }),

  predict(A(2, 2), 'Predict the products when propane reacts with chlorine in sunlight, if only one hydrogen is replaced.', 'A mixture of 1-chloropropane, CH₃CH₂CH₂Cl, and 2-chloropropane, CH₃CHClCH₃.', 'The chlorine radical can take a hydrogen from an end carbon or from the middle one.'),
  predict(A(2, 2), 'A mixture of bromomethane and bromoethane is heated with sodium in dry ether. Predict the alkanes formed.', 'Ethane, from two methyl groups; butane, from two ethyl groups.', 'And propane, from a methyl and an ethyl group joining.'),
  predict(A(2, 1), 'Predict the products of burning propane in plenty of air, and write the equation.', 'Carbon dioxide and water.', 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O.'),

  odd(A(2, 1), ['methane', 'ethane', 'propane', 'ethene'], 'ethene', 'It is unsaturated, an alkene; the others are alkanes.'),
  odd(A(2, 2), ['pentane', '2-methylbutane', '2,2-dimethylpropane', 'cyclopentane'], 'cyclopentane', 'It is C₅H₁₀; the others are isomers of C₅H₁₂.'),
  odd(A(2, 1), ['the Wurtz reaction', 'decarboxylation', 'Kolbe’s electrolysis', 'pyrolysis'], 'pyrolysis', 'It breaks alkanes into smaller molecules; the others are ways of making alkanes.'),

  long(A(5, 2), 'Answer each part on naming alkanes.\n(a) Give the IUPAC names of (CH₃)₂CHCH₂CH₃, CH₃C(CH₃)₂CH₃ and CH₃CH(CH₃)CH(CH₃)CH₃. [3]\n(b) Write the condensed formula of 3-ethyl-2-methylpentane. [1]\n(c) What type of isomerism do the first two compounds in (a) show? [1]', '(a) (CH₃)₂CHCH₂CH₃ is 2-methylbutane.', '(a) CH₃C(CH₃)₂CH₃ is 2,2-dimethylpropane.', '(a) CH₃CH(CH₃)CH(CH₃)CH₃ is 2,3-dimethylbutane.', '(b) CH₃CH(CH₃)CH(C₂H₅)CH₂CH₃.', '(c) Chain isomerism: both are C₅H₁₂, with different carbon chains.'),
  long(A(5, 2), 'Butane, C₄H₁₀, burns completely in oxygen.\n(a) Write the balanced equation. [1]\n(b) What volume of oxygen burns 10 L of butane, both measured at the same temperature and pressure? [2]\n(c) What volume of carbon dioxide forms? [1]\n(d) Why does chlorinating butane in sunlight give a mixture of products? [1]', '(a) 2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O.', '(b) By Gay-Lussac’s law, volumes are in the ratio of moles: 2 : 13.', '(b) 10 × 13/2 = 65 L.', '(c) 10 × 8/2 = 40 L.', '(d) The chlorine radicals take hydrogens from different carbons at random, and can replace more than one.'),

  tell(A(2, 1), 'Distinguish between the staggered and eclipsed conformations of ethane.', 'In the staggered form, the hydrogens on the two carbons are as far apart as possible, at 60°, so it has the lowest energy.', 'In the eclipsed form, they lie directly in line, so it has the highest energy, about 12.5 kJ/mol more.'),
  tell(A(2, 1), 'Distinguish between complete and incomplete combustion of an alkane.', 'In complete combustion, in plenty of air, the alkane gives carbon dioxide and water.', 'In incomplete combustion, in too little air, it gives carbon monoxide or soot as well, which are harmful.'),
  tell(A(2, 2), 'Distinguish between the pyrolysis and the combustion of an alkane.', 'Pyrolysis, or cracking, is heating an alkane without air, breaking it into smaller alkanes and alkenes.', 'Combustion is burning it in air, giving carbon dioxide and water and a great deal of heat.'),

  match(A(4, 2), [['CH₃COONa heated with soda lime', 'methane'], ['CH₃Br with sodium in dry ether', 'ethane'], ['Methane with chlorine in sunlight', 'chloromethane'], ['Hexane heated to 773 K over a catalyst', 'smaller alkanes and alkenes']]),
  match(A(4, 1), [['n-butane', 'CH₃CH₂CH₂CH₃'], ['isobutane', '(CH₃)₃CH'], ['neopentane', 'C(CH₃)₄'], ['isopentane', '(CH₃)₂CHCH₂CH₃']]),
  match(A(4, 2), [['Initiation', 'Cl₂ → 2Cl•'], ['Propagation', 'CH₄ + Cl• → CH₃• + HCl'], ['Termination', 'CH₃• + Cl• → CH₃Cl'], ['Overall', 'CH₄ + Cl₂ → CH₃Cl + HCl']]),

  reason(A(2, 1), 'Give reasons. (a) Alkanes are also called paraffins. (b) Methane can’t be made by the Wurtz reaction.', '(a) Paraffin means little affinity: alkanes are unreactive, having only strong C–C and C–H σ bonds.', '(b) The Wurtz reaction joins two alkyl groups, so its product has at least two carbons.'),
  reason(A(2, 1), 'Give reasons. (a) Alkanes don’t dissolve in water. (b) The boiling points of alkanes rise with the length of the chain.', '(a) They are non-polar, and can’t form hydrogen bonds with water.', '(b) Longer molecules have larger van der Waals forces between them.'),

  ar(A(1, 2), 'Iodination of methane needs an oxidising agent such as HIO₃.', 'The HI formed is a strong reducing agent, and turns CH₃I back into methane.', 1, 'The oxidising agent removes HI, so the reaction isn’t reversed.'),
  ar(A(1, 1), 'Methane can be made by the Wurtz reaction.', 'The Wurtz reaction joins two alkyl groups.', 4, 'Joining two alkyl groups gives at least ethane.'),
  ar(A(1, 2), 'The staggered and eclipsed forms of ethane can’t be separated at room temperature.', 'The energy barrier between them is only about 12.5 kJ/mol.', 1, 'Molecules have enough energy at room temperature to turn freely between the forms.'),
];

export default questions;
