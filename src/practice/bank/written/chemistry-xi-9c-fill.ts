// Written by hand: alkynes, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar } = kit('chemistry', 'XI');
const Y = at(9, 'c');

const questions: BankDef[] = [
  figure(Y(3, 2), 'Draw the bonding in ethyne, showing its σ framework and its two π bonds, and give its shape.', ['Each carbon is sp hybridised: its two sp orbitals form a C–C σ bond and a C–H σ bond, in a straight line.', 'Each carbon keeps two unhybridised p orbitals, at right angles; these overlap sideways to form two π bonds, one above and below, one in front and behind.', 'The molecule is linear, with H–C–C angles of 180°.'], {
    answer: sketch(340, 180, 'H–C–C–H drawn in a straight line, marked 180°. Above and below the C–C bond, a pair of lobes is one π bond. A second pair, drawn dashed, in front of and behind the bond, is the other π bond.', [
      label(40, 94, 'H'), line([[52, 90], [118, 90]]), label(130, 94, 'C'), line([[142, 90], [198, 90]]), label(210, 94, 'C'), line([[222, 90], [288, 90]]), label(300, 94, 'H'),
      { t: 'path', d: 'M130 82 Q 170 40, 210 82' }, { t: 'path', d: 'M130 98 Q 170 140, 210 98' },
      { t: 'path', d: 'M126 84 Q 170 66, 214 84', dash: 1 }, { t: 'path', d: 'M126 96 Q 170 114, 214 96', dash: 1 },
      label(170, 40, 'π'), label(170, 150, 'π'), label(85, 82, 'σ'), label(170, 86, 'σ'), label(170, 172, 'linear, 180°'),
    ]),
  }),
  figure(Y(3, 1), 'Make a table of the products when ethyne reacts with H₂ over Lindlar’s catalyst, excess H₂ over nickel, excess bromine, excess HBr, and water with HgSO₄ and dilute H₂SO₄.', ['With Lindlar’s catalyst, one mole of H₂ adds, giving ethene; with nickel and excess H₂, two moles add, giving ethane.', 'Excess bromine gives 1,1,2,2-tetrabromoethane; excess HBr gives 1,1-dibromoethane, by Markovnikov’s rule.', 'Water, with Hg²⁺ and acid, gives ethanal, through an enol that rearranges.'], {
    answer: table(['Reagent', 'Product'], [['H₂, Lindlar’s catalyst', 'ethene, CH₂=CH₂'], ['Excess H₂, Ni', 'ethane, CH₃CH₃'], ['Excess Br₂', 'CHBr₂CHBr₂'], ['Excess HBr', 'CH₃CHBr₂'], ['H₂O, HgSO₄, dilute H₂SO₄', 'ethanal, CH₃CHO']]),
  }),
  figure(Y(3, 1), 'Draw a labelled diagram of the laboratory preparation of ethyne from calcium carbide, and write the equation.', ['Water is dripped from a dropping funnel onto lumps of calcium carbide in a flask.', 'The gas passes through a delivery tube and is collected over water in a gas jar, as it is only slightly soluble.', 'CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂.'], {
    answer: sketch(360, 220, 'A conical flask holding lumps of calcium carbide, with a dropping funnel of water fitted in its stopper. A delivery tube leads from the flask into a trough of water, ending under an upturned gas jar that fills with ethyne.', [
      { t: 'path', d: 'M60 100 L60 120 L30 190 L130 190 L100 120 L100 100' }, label(80, 182, 'CaC₂'),
      line([[80, 104], [80, 60]]), { t: 'path', d: 'M60 30 L100 30 L84 60 L76 60 Z' }, label(106, 34, 'water', 'start'),
      line([[94, 110], [200, 110], [200, 170], [236, 170]]),
      line([[180, 140], [180, 200], [340, 200], [340, 140]]), line([[180, 150], [340, 150]], { dash: 1 }),
      line([[230, 190], [230, 90], [290, 90], [290, 190]]), label(260, 80, 'gas jar'), label(260, 124, 'C₂H₂'),
    ]),
  }),

  predict(Y(2, 2), 'Predict the product when propyne reacts with excess HBr.', '2,2-dibromopropane, CH₃CBr₂CH₃.', 'Both molecules of HBr add by Markovnikov’s rule, the bromine going to the middle carbon each time.'),
  predict(Y(2, 1), 'Ethyne is bubbled through bromine water. Predict what is seen, and the product with excess bromine.', 'The orange colour of the bromine fades.', 'Bromine adds across the triple bond, finally giving 1,1,2,2-tetrabromoethane.'),
  predict(Y(2, 1), 'Predict the numbers of σ and π bonds in propyne, CH₃–C≡CH.', 'σ bonds: four C–H, one C–C single, and one in the triple bond: 6.', 'π bonds: the other two bonds of the triple bond: 2.'),

  odd(Y(2, 1), ['ethyne', 'propyne', 'but-1-yne', 'but-2-yne'], 'but-2-yne', 'Its triple bond isn’t at the end, so it has no acidic hydrogen; the others are terminal alkynes.'),
  odd(Y(2, 2), ['Br₂', 'HBr', 'H₂O', 'NaNH₂'], 'NaNH₂', 'It takes the acidic hydrogen of a terminal alkyne, forming a salt; the others add across the triple bond.'),
  odd(Y(2, 1), ['linear', 'sp', '180°', '109.5°'], '109.5°', 'It is the tetrahedral angle of an sp³ carbon; the others describe the carbons of ethyne.'),

  long(Y(5, 2), 'Answer each part on the alkynes C₄H₆.\n(a) Draw the condensed formulae of the two open-chain alkynes with this formula, and name them. [2]\n(b) Give the product of the terminal one with two moles of HBr. [1]\n(c) What does each give with excess hydrogen over nickel? [1]\n(d) What does but-2-yne give with hydrogen over Lindlar’s catalyst? [1]', '(a) CH₃CH₂C≡CH, but-1-yne.', '(a) CH₃C≡CCH₃, but-2-yne.', '(b) 2,2-dibromobutane, CH₃CH₂CBr₂CH₃, by Markovnikov’s rule.', '(c) Both give butane, CH₃CH₂CH₂CH₃.', '(d) cis-but-2-ene, as both hydrogens add from the same side.'),

  tell(Y(2, 1), 'Distinguish between ethene and ethyne in structure.', 'Ethene has sp² carbons joined by a double bond, one σ and one π, and is planar with angles of about 120°.', 'Ethyne has sp carbons joined by a triple bond, one σ and two π, and is linear, with angles of 180°.'),
  tell(Y(2, 1), 'Distinguish between a terminal and an internal alkyne, with an example of each.', 'A terminal alkyne has its triple bond at the end of the chain, with an acidic hydrogen on it: propyne.', 'An internal alkyne has its triple bond inside the chain, with no such hydrogen: but-2-yne.'),
  tell(Y(2, 2), 'Distinguish between adding hydrogen to ethyne over nickel and over Lindlar’s catalyst.', 'Over nickel, with excess hydrogen, the triple bond is fully saturated, giving ethane.', 'Over Lindlar’s catalyst, palladium partly poisoned, only one mole adds, giving ethene, and an internal alkyne gives the cis alkene.'),

  match(Y(4, 1), [['Ethyne with H₂ over Lindlar’s catalyst', 'ethene'], ['Ethyne with excess H₂ over nickel', 'ethane'], ['Ethyne with water, HgSO₄ and dilute H₂SO₄', 'ethanal'], ['Ethyne through a red-hot iron tube', 'benzene']]),
  match(Y(4, 2), [['The C≡C bond length', '120 pm'], ['The C=C bond length', '134 pm'], ['The C–C bond length', '154 pm'], ['The H–C–C bond angle in ethyne', '180°']]),
  match(Y(4, 1), [['Ethyne', 'HC≡CH'], ['Propyne', 'CH₃C≡CH'], ['But-2-yne', 'CH₃C≡CCH₃'], ['But-1-yne', 'CH₃CH₂C≡CH']]),

  reason(Y(2, 1), 'Give reasons. (a) Alkynes take part in addition reactions. (b) Ethyne is a linear molecule.', '(a) Their triple bond has two π bonds, whose electrons are open to attack by electrophiles.', '(b) Its carbons are sp hybridised, and two sp orbitals point in opposite directions, at 180°.'),
  reason(Y(2, 1), 'Give reasons. (a) Ethyne decolourises bromine water. (b) Ethyne burns with a sooty flame.', '(a) Bromine adds across its triple bond, using up the coloured bromine.', '(b) It has a high proportion of carbon, so some carbon is left unburnt as soot.'),
  reason(Y(2, 2), 'Give reasons. (a) But-2-yne doesn’t react with sodamide. (b) The C≡C bond is shorter than the C=C bond.', '(a) It has no hydrogen on a triply bonded carbon, so there is no acidic hydrogen to remove.', '(b) Three shared pairs pull the carbons closer, and sp orbitals, with more s character, are shorter.'),

  short(Y(2, 2), 'Write the equations for the two steps in which ethyne reacts with excess HCl, naming the products.', 'HC≡CH + HCl → CH₂=CHCl, chloroethene (vinyl chloride).', 'CH₂=CHCl + HCl → CH₃CHCl₂, 1,1-dichloroethane, by Markovnikov’s rule.'),

  ar(Y(1, 1), 'Ethyne gives a white precipitate with ammoniacal silver nitrate.', 'Its hydrogens, on sp carbons, are acidic and can be replaced by a metal.', 1, 'The precipitate is silver ethynide, Ag–C≡C–Ag.'),
  ar(Y(1, 1), 'All alkynes react with sodamide.', 'Terminal alkynes have an acidic hydrogen.', 4, 'Only terminal alkynes react; internal ones have no acidic hydrogen.'),
];

export default questions;
