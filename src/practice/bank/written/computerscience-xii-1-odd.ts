// Written by hand: Boolean algebra, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('computerscience', 'XII');
const B = at(1, 'b');

const questions: BankDef[] = [
  odd(B(2, 1), ['AND', 'OR', 'NOT', 'NAND'], 'NAND', 'It is a universal gate, from which any other can be built; the others are basic gates.'),
  odd(B(2, 2), ['A + A = A', 'A · A = A', 'A + 1 = 1', 'A + A′ = 1'], 'A + A′ = 1', 'It is a complement law; the others are idempotent or null laws, needing no complement.'),
  odd(B(2, 2), ['A·B + A′·C', 'A + B·C', '(A + B)·(B + C)', 'A·B·C + A′·B'], '(A + B)·(B + C)', 'It is in product-of-sums form; the others are sums of products.'),
  odd(B(2, 3), ['A·B′·C', 'A′·B·C', 'A·B·C′', 'A·B'], 'A·B', 'It isn’t a minterm of three variables, as C is missing; the others are.'),
  odd(B(2, 3), ['A + A·B = A', 'A·(A + B) = A', 'A + A′·B = A + B', '(A + B)′ = A′ + B′'], '(A + B)′ = A′ + B′', 'It is false: De Morgan’s law gives A′·B′; the others are true.'),
];

export default questions;
