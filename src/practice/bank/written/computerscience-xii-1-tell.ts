// Written by hand: Boolean algebra, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('computerscience', 'XII');
const B = at(1, 'b');

const questions: BankDef[] = [
  tell(B(2, 2), 'Distinguish between a canonical and a simplified sum-of-products expression.', 'In canonical SOP, every term is a minterm holding every variable, plain or complemented.', 'In a simplified SOP, terms may leave variables out, as in A·B + C.'),
];

export default questions;
