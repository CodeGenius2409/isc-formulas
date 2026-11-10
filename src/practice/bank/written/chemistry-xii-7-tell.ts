// Written by hand: alcohols, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('chemistry', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  tell(A(2, 2), 'Distinguish between methanol and ethanol by a chemical test.', 'Warm each with iodine and sodium hydroxide.', 'Ethanol gives a yellow precipitate of iodoform; methanol gives none.'),
];

export default questions;
