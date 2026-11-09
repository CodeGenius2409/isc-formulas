// Written by hand: basic organic chemistry, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XI');
const A = at(8, 'a');
const B = at(8, 'b');
const C = at(8, 'c');

const questions: BankDef[] = [
  long(A(5, 2), 'For the formula C₄H₁₀O:\n(a) Draw and name, by IUPAC, its four isomeric alcohols. [4]\n(b) Which of them shows optical isomerism? [1]', ['(a) Butan-1-ol, CH₃CH₂CH₂CH₂OH.', '(a) Butan-2-ol, CH₃CH₂CH(OH)CH₃.', '(a) 2-methylpropan-1-ol, (CH₃)₂CHCH₂OH.', '(a) 2-methylpropan-2-ol, (CH₃)₃COH.', '(b) Butan-2-ol, as it has a chiral carbon.']),
  long(B(5, 2), 'Answer each part.\n(a) Which method would you use to separate each, and why: a liquid boiling at 80 °C from one boiling at 90 °C; aniline from a mixture with water that would decompose near its boiling point? [2]\n(b) Outline how Kjeldahl’s method finds nitrogen. [2]\n(c) Name one compound for which Kjeldahl’s method fails. [1]', ['(a) Fractional distillation, as the boiling points are close.', '(a) Steam distillation, as it boils below its normal boiling point, with water.', '(b) The compound is heated with concentrated H₂SO₄, turning nitrogen into ammonium sulphate.', '(b) NaOH frees ammonia, which is absorbed in a known excess of acid and back-titrated.', '(c) Pyridine, or any nitro or azo compound.']),
  long(C(5, 2), 'Answer each part.\n(a) Define the inductive effect, and say why Cl₃CCOOH is a stronger acid than CH₃COOH. [2]\n(b) Arrange the methyl, primary, secondary and tertiary carbocations by stability, and explain it through hyperconjugation. [2]\n(c) Distinguish between an electrophile and a nucleophile, with an example of each. [1]', ['(a) The permanent shift of bonding electrons along a chain, due to a polar bond.', '(a) The –I effect of chlorine stabilises the anion, so it gives up H⁺ more easily.', '(b) Tertiary > secondary > primary > methyl.', '(b) More alkyl groups give more C–H bonds to overlap with the empty orbital, which spreads the charge.', '(c) An electrophile seeks electrons, like NO₂⁺, and a nucleophile gives them, like OH⁻.']),
];

export default questions;
