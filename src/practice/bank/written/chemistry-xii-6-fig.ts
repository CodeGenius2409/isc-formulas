// Written by hand: haloalkanes, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, sketch, table } from '../figures';

const { figure } = kit('chemistry', 'XII');
const A = at(6, 'a');

const questions: BankDef[] = [
  figure(A(2, 2), 'Draw the energy profile of an SN2 reaction. Mark the transition state.', ['One hump, as the reaction goes in a single step.', 'The transition state, at the top, has the nucleophile and the leaving group both partly bonded to carbon.'], {
    answer: graph('progress of reaction', 'energy', [{ points: [[0, 20], [2, 20], [3.5, 45], [4, 50], [4.5, 45], [6, 10], [8, 10]] }], { x: [[4, 'transition state']] }),
  }),
  figure(A(2, 3), 'Draw the energy profile of an SN1 reaction. Mark the carbocation, and say which step decides the rate.', ['Two humps, with the carbocation in the dip between them.', 'The first hump is higher: forming the carbocation is the slow step, so it decides the rate.'], {
    answer: graph('progress of reaction', 'energy', [{ points: [[0, 20], [1.5, 20], [3, 55], [4, 38], [5, 45], [6.5, 8], [8, 8]] }], { x: [[4, 'carbocation']] }),
  }),
  figure(A(3, 2), 'Draw the transition state of the SN2 reaction of OH⁻ with CH₃Br. Show why the product’s configuration is inverted.', ['OH⁻ attacks the carbon from the side opposite to Br.', 'In the transition state, the three hydrogens lie flat in one plane, with HO and Br partly bonded on either side.', 'As Br leaves, the hydrogens flip over to the other side, like an umbrella in the wind.'], {
    answer: sketch(320, 140, 'A carbon atom in the middle with three hydrogens in a flat plane around it. On the left, HO is joined by a dashed partial bond; on the right, Br is joined by a dashed partial bond. The whole is in square brackets with a negative charge.', [
      label(60, 74, 'HO', 'end'), line([[64, 70], [140, 70]], { dash: 1 }), label(160, 74, 'C'), line([[180, 70], [250, 70]], { dash: 1 }), label(256, 74, 'Br', 'start'),
      line([[160, 60], [160, 30]]), label(160, 24, 'H'), line([[152, 80], [130, 110]]), label(126, 124, 'H'), line([[168, 80], [190, 110]]), label(194, 124, 'H'),
      label(30, 74, '[', 'end'), label(290, 74, ']⁻', 'start'),
    ]),
  }),
  figure(A(2, 2), 'The table gives the relative rates of an SN2 reaction for some bromides. State the trend, and give the reason.', ['The rate falls from CH₃Br to (CH₃)₃CBr.', 'More alkyl groups crowd the carbon, which blocks the nucleophile’s attack from the back.'], {
    shown: table(['Bromide', 'Relative rate'], [['CH₃Br', '150'], ['CH₃CH₂Br', '1'], ['(CH₃)₂CHBr', '0.01'], ['(CH₃)₃CBr', 'almost 0']]),
  }),
  figure(A(3, 1), 'The figure shows a polarimeter. Name the parts P, Q and R, and say what is measured.', ['P is the polariser, which gives plane-polarised light.', 'Q is the tube holding the solution, and R is the analyser, turned to find the new plane.', 'The angle the plane of polarisation is turned through, the optical rotation, is measured.'], {
    shown: sketch(320, 110, 'A light source on the left, then a polariser P, a long tube Q holding the solution, and an analyser R with a scale, with an eye on the right.', [
      { t: 'circle', x: 25, y: 55, r: 12 }, label(25, 88, 'light'), arrow([40, 55], [70, 55]),
      { t: 'box', x: 72, y: 30, w: 12, h: 50 }, label(78, 22, 'P'), { t: 'box', x: 100, y: 40, w: 120, h: 30 }, label(160, 30, 'Q'),
      { t: 'box', x: 236, y: 30, w: 12, h: 50 }, label(242, 22, 'R'), arrow([250, 55], [285, 55]), label(298, 60, 'eye'),
    ]),
  }),
];

export default questions;
