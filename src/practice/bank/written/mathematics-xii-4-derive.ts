// Written by hand: vector algebra, proofs not already in the bank. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { derive } = kit('mathematics', 'XII');
const V = at(4, 'a');

const questions: BankDef[] = [
  derive(V(3, 2), 'Prove that the point dividing the join of $A(\\vec{a})$ and $B(\\vec{b})$ internally in the ratio $m : n$ has position vector $\\frac{m\\vec{b} + n\\vec{a}}{m + n}$.', ['Let the point be $R(\\vec{r})$, with $n\\vec{AR} = m\\vec{RB}$.', 1], ['So $n(\\vec{r} - \\vec{a}) = m(\\vec{b} - \\vec{r})$.', 1], ['$(m + n)\\vec{r} = m\\vec{b} + n\\vec{a}$, which gives the result.', 1]),
  derive(V(3, 2), 'Prove that $\\vec{a} \\cdot \\vec{b} = a_1b_1 + a_2b_2 + a_3b_3$.', ['$\\vec{a} \\cdot \\vec{b} = (a_1\\hat{i} + a_2\\hat{j} + a_3\\hat{k}) \\cdot (b_1\\hat{i} + b_2\\hat{j} + b_3\\hat{k})$, expanded term by term.', 1], ['$\\hat{i} \\cdot \\hat{i} = \\hat{j} \\cdot \\hat{j} = \\hat{k} \\cdot \\hat{k} = 1$, and the products of different unit vectors are 0.', 1], ['So only $a_1b_1 + a_2b_2 + a_3b_3$ is left.', 1]),
  derive(V(3, 3), 'Prove that $|\\vec{a} \\times \\vec{b}|^2 = |\\vec{a}|^2|\\vec{b}|^2 - (\\vec{a} \\cdot \\vec{b})^2$.', ['$|\\vec{a} \\times \\vec{b}|^2 = |\\vec{a}|^2|\\vec{b}|^2\\sin^2\\theta$.', 1], ['$= |\\vec{a}|^2|\\vec{b}|^2(1 - \\cos^2\\theta)$.', 1], ['$= |\\vec{a}|^2|\\vec{b}|^2 - (\\vec{a} \\cdot \\vec{b})^2$.', 1]),
];

export default questions;
