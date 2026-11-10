// Written by hand: alcohols, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, sketch, table } from '../figures';

const { figure } = kit('chemistry', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  figure(A(2, 1), 'Draw how hydrogen bonds join ethanol molecules to one another.', ['Each –OH hydrogen is drawn to a lone pair on the oxygen of the next molecule.', 'The hydrogen bonds are shown dotted, joining the molecules in chains.'], {
    answer: sketch(320, 130, 'Three ethanol molecules in a row. In each, an oxygen is bonded to an ethyl group and a hydrogen. The hydrogen of one molecule is joined to the oxygen of the next by a dotted hydrogen bond.', [
      label(40, 40, 'C₂H₅'), line([[58, 44], [76, 60]]), label(86, 70, 'O'), line([[94, 74], [110, 90]]), label(118, 102, 'H'),
      line([[126, 100], [150, 84]], { dash: 1 }),
      label(140, 40, 'C₂H₅'), line([[158, 44], [160, 64]]), label(166, 78, 'O'), line([[174, 82], [190, 98]]), label(198, 110, 'H'),
      line([[206, 108], [230, 92]], { dash: 1 }),
      label(240, 40, 'C₂H₅'), line([[252, 44], [244, 72]]), label(246, 86, 'O'), line([[254, 90], [270, 106]]), label(278, 118, 'H'),
    ]),
  }),
  figure(A(2, 2), 'The table gives the boiling points of some compounds of similar mass. Why does ethanol boil so much higher?', ['Ethanol molecules are held together by hydrogen bonds through their –OH groups.', 'Propane and methoxymethane can’t form them with each other, so they have weaker forces.'], {
    shown: table(['Compound', 'Mr', 'Boiling point (K)'], [['Propane', '44', '231'], ['Methoxymethane', '46', '248'], ['Ethanol', '46', '351']]),
  }),
  figure(A(2, 2), 'Draw how the solubility of alcohols in water changes with the number of carbon atoms. Give the reason.', ['The first few mix completely, and solubility then falls steeply as the chain grows.', 'The –OH forms hydrogen bonds with water, but a longer hydrocarbon part is hydrophobic.'], {
    answer: graph('number of carbon atoms', 'solubility in water', [{ points: [[1, 100], [2, 100], [3, 100], [4, 8], [5, 2.5], [6, 0.6], [7, 0.2]] }]),
  }),
  figure(A(3, 3), 'The figure shows the steps of the acid-catalysed dehydration of ethanol. Name the steps P, Q and R, and say which is slowest.', ['P: the –OH is protonated by the acid, to give an oxonium ion.', 'Q: water leaves, giving a carbocation. R: a proton is lost from the next carbon, giving ethene.', 'Q, forming the carbocation, is the slowest step.'], {
    shown: sketch(330, 140, 'A row of three steps with arrows: ethanol to its protonated form, labelled P; then to a carbocation and water, labelled Q; then to ethene and H⁺, labelled R.', [
      label(30, 70, 'C₂H₅OH'), arrow([60, 66], [96, 66]), label(78, 56, 'P'),
      label(130, 70, 'C₂H₅OH₂⁺'), arrow([166, 66], [196, 66]), label(181, 56, 'Q'),
      label(230, 70, 'C₂H₅⁺'), arrow([256, 66], [282, 66]), label(269, 56, 'R'), label(304, 70, 'C₂H₄'),
      label(181, 100, '− H₂O'), label(269, 100, '− H⁺'), label(78, 100, '+ H⁺'),
    ]),
  }),
  figure(A(2, 3), 'Draw the shape around the oxygen atom in methanol, and give the C–O–H bond angle. Why is it a little less than 109° 28′?', ['Oxygen is sp³ hybridised, with two bonds and two lone pairs, so the shape around it is bent.', 'The angle is about 108.9°, a little less than tetrahedral, as the lone pairs repel the bonds more.'], {
    answer: sketch(260, 130, 'A bent shape. Oxygen in the middle, bonded to a methyl group on the left and a hydrogen on the right, with the angle between them marked 108.9°. Two lone pairs sit above the oxygen.', [
      label(130, 64, 'O'), line([[122, 70], [70, 100]]), label(56, 112, 'CH₃'), line([[138, 70], [190, 100]]), label(200, 112, 'H'),
      label(130, 40, '• •'), label(130, 104, '108.9°'),
    ]),
  }),
];

export default questions;
