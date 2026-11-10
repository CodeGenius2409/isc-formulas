// Written by hand: aldehydes and ketones, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch, table } from '../figures';

const { figure } = kit('chemistry', 'XII');
const A = at(8, 'a');

const questions: BankDef[] = [
  figure(A(2, 1), 'Draw the structure of the carbonyl group, showing its shape, its bond angles and its polarity.', ['Carbon is sp², so the group is flat, with bond angles of about 120°.', 'Oxygen is more electronegative, so carbon is δ+ and oxygen δ−.'], {
    answer: sketch(260, 130, 'A carbonyl group. Carbon in the middle is double bonded to oxygen at the top and single bonded to two groups below, with 120° between the bonds. Carbon is marked delta plus and oxygen delta minus.', [
      label(130, 84, 'C'), line([[126, 74], [126, 42]]), line([[134, 74], [134, 42]]), label(130, 34, 'O'),
      line([[122, 90], [80, 116]]), line([[138, 90], [180, 116]]), label(70, 126, 'R'), label(192, 126, 'R′'),
      label(150, 30, 'δ−', 'start'), label(150, 90, 'δ+', 'start'), label(96, 70, '120°', 'end'),
    ]),
  }),
  figure(A(3, 2), 'Draw the mechanism by which HCN adds to ethanal. Use curved arrows.', ['CN⁻ attacks the carbonyl carbon, and the C=O pair moves onto oxygen.', 'This gives a negatively charged alkoxide.', 'The alkoxide takes a proton from HCN, giving the cyanohydrin and a new CN⁻.'], {
    answer: sketch(330, 130, 'Step one: CN⁻ with a curved arrow to the carbon of ethanal, and a curved arrow from the C=O bond to oxygen, giving an alkoxide ion with O⁻. Step two: the O⁻ takes H⁺ from HCN, giving CH₃CH(OH)CN.', [
      label(30, 50, 'CN⁻'), { t: 'path', d: 'M40 40 C 55 20, 75 20, 88 40', arrow: 1 },
      label(100, 64, 'CH₃CHO'), { t: 'path', d: 'M120 52 C 130 36, 140 36, 146 46', arrow: 1 },
      arrow([150, 60], [180, 60]), label(250, 64, 'CH₃CH(O⁻)CN'),
      label(250, 110, 'CH₃CH(OH)CN'), arrow([250, 76], [250, 96]), label(242, 90, '+ H⁺ from HCN', 'end'),
    ]),
  }),
  figure(A(2, 2), 'The table gives boiling points of compounds of similar mass. Explain why propanal boils between butane and propan-1-ol.', ['Propanal has a polar C=O group, so it has dipole–dipole forces, stronger than butane’s.', 'It can’t hydrogen bond with itself, as propan-1-ol does, so it boils lower than the alcohol.'], {
    shown: table(['Compound', 'Mr', 'Boiling point (K)'], [['Butane', '58', '273'], ['Propanal', '58', '322'], ['Propanone', '58', '329'], ['Propan-1-ol', '60', '370']]),
  }),
  figure(A(3, 2), 'The figure shows two molecules of ethanal joining in dilute alkali. Name the reaction, name the product, and say what it gives on heating.', ['Aldol condensation.', 'The product is 3-hydroxybutanal, an aldol.', 'On heating it loses water to give but-2-enal.'], {
    shown: sketch(330, 100, 'Two ethanal molecules, CH₃CHO plus CH₃CHO, with an arrow labelled dilute NaOH leading to CH₃CH(OH)CH₂CHO.', [
      label(40, 54, 'CH₃CHO'), label(84, 54, '+'), label(128, 54, 'CH₃CHO'), arrow([164, 50], [200, 50]), label(182, 38, 'dil. NaOH'), label(268, 54, 'CH₃CH(OH)CH₂CHO'),
    ]),
  }),
  figure(A(3, 3), 'The table shows the results of three tests on X, Y and Z, which are ethanal, propanal and propanone in some order. Identify each.', ['X gives all three, so it is ethanal: an aldehyde with a CH₃CO– group.', 'Y gives Tollens’ and Fehling’s but no iodoform, so it is propanal.', 'Z gives only iodoform, so it is propanone, a methyl ketone.'], {
    shown: table(['Compound', 'Tollens’ reagent', 'Fehling’s solution', 'Iodoform test'], [['X', 'silver mirror', 'red precipitate', 'yellow precipitate'], ['Y', 'silver mirror', 'red precipitate', 'no change'], ['Z', 'no change', 'no change', 'yellow precipitate']]),
  }),
];

export default questions;
