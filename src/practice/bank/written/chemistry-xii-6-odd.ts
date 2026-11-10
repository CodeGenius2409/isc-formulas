// Written by hand: haloalkanes, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('chemistry', 'XII');
const A = at(6, 'a');

const questions: BankDef[] = [
  odd(A(2, 1), ['CH₃CH₂Cl', 'CH₃CH₂CH₂Br', '(CH₃)₂CHCH₂I', '(CH₃)₃CCl'], '(CH₃)₃CCl', 'It is a tertiary halide; the others are primary.'),
  odd(A(2, 2), ['OH⁻', 'CN⁻', 'NH₃', 'BF₃'], 'BF₃', 'It is an electrophile, with no lone pair to give; the others are nucleophiles.'),
  odd(A(2, 2), ['Wurtz reaction', 'Finkelstein reaction', 'Swarts reaction', 'Kolbe’s reaction'], 'Kolbe’s reaction', 'It belongs to phenols; the others are reactions of alkyl halides.'),
  odd(A(2, 3), ['one step', 'inversion of configuration', 'carbocation', 'rate = k[RX][Nu⁻]'], 'carbocation', 'It belongs to SN1; the others describe SN2.'),
  odd(A(2, 3), ['CH₃F', 'CH₃Cl', 'CH₃Br', 'CH₃I'], 'CH₃F', 'Its C–X bond is the strongest, so it reacts slowest in substitution; the others react more readily.'),
];

export default questions;
