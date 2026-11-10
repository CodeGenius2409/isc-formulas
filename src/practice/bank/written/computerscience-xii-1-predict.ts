// Written by hand: Boolean algebra, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('computerscience', 'XII');
const B = at(1, 'b');

const questions: BankDef[] = [
  predict(B(2, 1), 'Both inputs of a NAND gate are joined together. Predict which gate it then acts as.', 'A NOT gate.', '(A·A)′ = A′, by the idempotent law.'),
  predict(B(2, 2), 'Predict the output of F = A·B + A·B′ for every input, without a truth table.', 'F = A·(B + B′) = A·1 = A.', 'So F simply equals A, whatever B is.'),
  predict(B(2, 2), 'A 4-variable Karnaugh map has 1s in all four corner cells. Predict the simplified expression.', 'The corners form one quad, as the map wraps round at both edges.', 'They are A′B′C′D′, A′B′CD′, AB′C′D′ and AB′CD′, where B = 0 and D = 0: F = B′·D′.'),
  predict(B(3, 3), 'Predict the canonical SOP of F(A, B) = A + B, and how many minterms it has.', 'A + B is 1 for every input except A = 0, B = 0.', 'So it has three minterms.', 'F = A′B + AB′ + AB.'),
  predict(B(2, 3), 'Predict the dual of A·(A′ + B) = A·B, and whether it is also true.', 'A + A′·B = A + B.', 'Yes: the dual of any true Boolean identity is true.'),
];

export default questions;
