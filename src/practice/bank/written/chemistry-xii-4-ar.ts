// Written by hand: d- and f-block elements, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('chemistry', 'XII');
const A = at(4, 'a');

const questions: BankDef[] = [
  ar(A(1, 1), 'Transition metals and their compounds are often good catalysts.', 'They can change their oxidation state easily, and offer a surface for reaction.', 1, 'Variable oxidation states let them take part in electron transfers, as Fe does in the Haber process.'),
  ar(A(1, 2), 'Zn²⁺ salts are coloured.', 'Zn²⁺ has a completely filled 3d set.', 4, 'With d¹⁰, no d–d transition can happen, so Zn²⁺ salts are white.'),
  ar(A(1, 2), 'Manganese shows the largest number of oxidation states in the 3d series.', 'It has five unpaired 3d electrons as well as two 4s electrons to lose.', 1, 'It can use all seven, from +2 up to +7.'),
  ar(A(1, 3), 'Zr and Hf have almost the same atomic radius.', 'The 4f electrons of the lanthanoids screen the nucleus poorly.', 1, 'This lanthanoid contraction cancels the expected rise in size from Zr to Hf.'),
];

export default questions;
