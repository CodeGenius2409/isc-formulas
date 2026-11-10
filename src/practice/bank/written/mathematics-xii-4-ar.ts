// Written by hand: vector algebra, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('mathematics', 'XII');
const V = at(4, 'a');

const questions: BankDef[] = [
  ar(V(1, 1), '$\\vec{a} \\times \\vec{b} = -\\vec{b} \\times \\vec{a}$.', 'The vector product is not commutative.', 2, 'Both are true, but the reason only says the two differ; the assertion says exactly how, from the right-hand rule.'),
  ar(V(1, 2), '$\\hat{i} \\cdot \\hat{j} = 0$.', '$\\hat{i}$ and $\\hat{j}$ are at right angles.', 1, '$\\cos 90° = 0$.'),
  ar(V(1, 2), 'The vectors $2\\hat{i} + 3\\hat{j}$ and $4\\hat{i} + 6\\hat{j}$ are at right angles.', 'One is a multiple of the other.', 4, 'Being multiples, they are parallel, not at right angles.'),
  ar(V(1, 3), '$|\\vec{a} \\times \\vec{b}|$ is the area of the parallelogram on $\\vec{a}$ and $\\vec{b}$.', 'The area is base times height, $|\\vec{a}| \\cdot |\\vec{b}|\\sin\\theta$.', 1, 'That is the size of the vector product.'),
];

export default questions;
