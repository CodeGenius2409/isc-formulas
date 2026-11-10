// Written by hand: vector algebra, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('mathematics', 'XII');
const A = at(4, 'a');

const questions: BankDef[] = [
  match(A(3, 1), [['$\\hat{i} \\cdot \\hat{i}$', '1'], ['$\\hat{i} \\cdot \\hat{j}$', '0'], ['$\\hat{i} \\times \\hat{j}$', '$\\hat{k}$']]),
  match(A(4, 2), [['$\\vec{a} \\cdot \\vec{b} = 0$', 'At right angles'], ['$\\vec{a} \\times \\vec{b} = \\vec{0}$', 'Parallel'], ['$|\\vec{a}| = 1$', 'Unit vector'], ['$\\vec{a} = \\vec{b}$', 'Same size and direction']]),
  match(A(3, 2), [['Projection of $\\vec{a}$ on $\\vec{b}$', '$\\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|}$'], ['Area of the parallelogram on $\\vec{a}$, $\\vec{b}$', '$|\\vec{a} \\times \\vec{b}|$'], ['Area of the triangle on $\\vec{a}$, $\\vec{b}$', '$\\frac{1}{2}|\\vec{a} \\times \\vec{b}|$']]),
  match(A(4, 3), [['$\\hat{j} \\times \\hat{k}$', '$\\hat{i}$'], ['$\\hat{k} \\times \\hat{j}$', '$-\\hat{i}$'], ['$\\hat{k} \\times \\hat{i}$', '$\\hat{j}$'], ['$\\hat{k} \\times \\hat{k}$', '$\\vec{0}$']]),
  match(A(3, 3), [['Point dividing $AB$ internally in $m : n$', '$\\frac{m\\vec{b} + n\\vec{a}}{m + n}$'], ['Midpoint of $AB$', '$\\frac{\\vec{a} + \\vec{b}}{2}$'], ['Point dividing $AB$ externally in $m : n$', '$\\frac{m\\vec{b} - n\\vec{a}}{m - n}$']]),
];

export default questions;
