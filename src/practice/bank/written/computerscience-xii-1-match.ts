// Written by hand: Boolean algebra, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('computerscience', 'XII');
const B = at(1, 'b');

const questions: BankDef[] = [
  match(B(3, 1), [['A + A′', '1'], ['A · A′', '0'], ['(A′)′', 'A']]),
  match(B(4, 2), [['A + A·B', 'Absorption law'], ['(A + B)′ = A′·B′', 'De Morgan’s law'], ['A·(B + C) = A·B + A·C', 'Distributive law'], ['A + A = A', 'Idempotent law']]),
  match(B(3, 2), [['Sum of products', 'A·B + A′·C'], ['Product of sums', '(A + B)·(A′ + C)'], ['A single minterm in A, B, C', 'A·B′·C']]),
  match(B(4, 3), [['A group of 2 cells in a 4-variable map', 'A term of three variables'], ['A group of 4 cells', 'A term of two variables'], ['A group of 8 cells', 'A term of one variable'], ['All 16 cells', 'The constant 1']]),
  match(B(3, 3), [['Dual of A + 0 = A', 'A · 1 = A'], ['Dual of A + 1 = 1', 'A · 0 = 0'], ['Dual of A + A′·B = A + B', 'A·(A′ + B) = A·B']]),
];

export default questions;
