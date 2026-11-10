// Written by hand: Boolean algebra and Karnaugh maps, reasons. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason } = kit('computerscience', 'XII');
const B = at(1, 'b');

const questions: BankDef[] = [
  reason(B(1, 2), 'Give a reason: in a Karnaugh map, the cells at the left and right edges count as neighbours.', 'The map wraps round, as the Gray code labels at the two edges differ in one variable only.'),
  reason(B(2, 2), 'Give a reason: a group in a Karnaugh map must hold 1, 2, 4 or 8 cells, and not 3 or 6.', 'Each group must remove whole variables, and a group of 2ᵏ cells removes k of them.', 'Three or six cells can’t be described by one product term.'),
  reason(B(2, 3), 'Give a reason: the dual of a Boolean identity is also an identity.', 'Each postulate of Boolean algebra comes in a pair, with + and · swapped and 0 and 1 swapped.', 'So any proof of an identity can be turned into a proof of its dual, step by step.'),
  reason(B(1, 1), 'Give a reason: A + A = A in Boolean algebra, though 1 + 1 = 2 in arithmetic.', 'OR gives 1 when either input is 1, so 1 + 1 = 1, and 0 + 0 = 0: this is the idempotent law.'),
];

export default questions;
