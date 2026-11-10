// Written by hand: haloalkanes, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('chemistry', 'XII');
const A = at(6, 'a');

const questions: BankDef[] = [
  predict(A(2, 1), 'Predict which reacts faster with aqueous NaOH by SN2: 1-bromobutane or 1-chlorobutane. Give the reason.', '1-bromobutane.', 'The C–Br bond is weaker than C–Cl, and Br⁻ is the better leaving group.'),
  predict(A(2, 2), '2-bromobutane, optically active, is hydrolysed under SN1 conditions. Predict whether the product is optically active.', 'It is not, or only slightly.', 'The planar carbocation is attacked equally from both sides, giving a racemic mixture.'),
  predict(A(2, 2), 'Predict the main product when 2-bromobutane is heated with alcoholic KOH, and name the rule that decides it.', 'But-2-ene, mainly.', 'By Saytzeff’s rule, the more substituted alkene forms more.'),
  predict(A(3, 3), 'Predict the order of SN1 reactivity of (CH₃)₃CBr, (CH₃)₂CHBr and CH₃CH₂Br, and explain it.', '(CH₃)₃CBr > (CH₃)₂CHBr > CH₃CH₂Br.', 'SN1 goes through a carbocation, and the rate depends on how stable it is.', 'More alkyl groups give more electron release and hyperconjugation, so the tertiary carbocation is the most stable.'),
  predict(A(2, 3), 'An alkyl halide is shaken with water in a test tube. Predict whether it dissolves, and which layer it forms.', 'It doesn’t dissolve.', 'Most alkyl halides, such as bromoethane, are denser than water, so they sink as the lower layer.'),
];

export default questions;
