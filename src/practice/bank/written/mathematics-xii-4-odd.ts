// Written by hand: vector algebra, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('mathematics', 'XII');
const V = at(4, 'a');

const questions: BankDef[] = [
  odd(V(2, 1), ['displacement', 'velocity', 'force', 'work'], 'work', 'It is a scalar; the others are vectors.'),
  odd(V(2, 2), ['$\\hat{i} \\cdot \\hat{i}$', '$\\hat{j} \\cdot \\hat{j}$', '$\\hat{k} \\cdot \\hat{k}$', '$\\hat{i} \\cdot \\hat{j}$'], '$\\hat{i} \\cdot \\hat{j}$', 'It is 0; the others are 1.'),
  odd(V(2, 2), ['$\\vec{a} \\cdot \\vec{b}$', '$|\\vec{a}|$', '$\\vec{a} \\times \\vec{b}$', '$|\\vec{a} \\times \\vec{b}|$'], '$\\vec{a} \\times \\vec{b}$', 'It is a vector; the others are scalars.'),
  odd(V(2, 3), ['$2\\hat{i} + 4\\hat{j}$', '$\\hat{i} + 2\\hat{j}$', '$-3\\hat{i} - 6\\hat{j}$', '$2\\hat{i} + \\hat{j}$'], '$2\\hat{i} + \\hat{j}$', 'It isn’t parallel to the others, which are all multiples of $\\hat{i} + 2\\hat{j}$.'),
  odd(V(2, 3), ['$\\frac{1}{\\sqrt{2}}\\hat{i} + \\frac{1}{\\sqrt{2}}\\hat{j}$', '$\\hat{k}$', '$\\frac{1}{3}(2\\hat{i} + \\hat{j} + 2\\hat{k})$', '$\\hat{i} + \\hat{j}$'], '$\\hat{i} + \\hat{j}$', 'Its length is $\\sqrt{2}$; the others are unit vectors.'),
];

export default questions;
