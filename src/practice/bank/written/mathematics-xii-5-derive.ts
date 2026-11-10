// Written by hand: three-dimensional geometry, proofs not already in the bank. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { derive } = kit('mathematics', 'XII');
const G = at(5, 'a');

const questions: BankDef[] = [
  derive(G(3, 1), 'Obtain the Cartesian equation of the line through $(x_1, y_1, z_1)$ and $(x_2, y_2, z_2)$.', ['Its direction ratios are $x_2 - x_1$, $y_2 - y_1$, $z_2 - z_1$.', 1], ['A point $(x, y, z)$ on it has $(x - x_1, y - y_1, z - z_1)$ in proportion to them.', 1], ['So $\\frac{x - x_1}{x_2 - x_1} = \\frac{y - y_1}{y_2 - y_1} = \\frac{z - z_1}{z_2 - z_1}$.', 1]),
  derive(G(3, 2), 'Obtain the angle between two lines with direction ratios $a_1, b_1, c_1$ and $a_2, b_2, c_2$.', ['The angle is that between the vectors $\\vec{b}_1 = (a_1, b_1, c_1)$ and $\\vec{b}_2 = (a_2, b_2, c_2)$.', 1], ['$\\cos\\theta = \\frac{\\vec{b}_1 \\cdot \\vec{b}_2}{|\\vec{b}_1||\\vec{b}_2|}$.', 1], ['$= \\frac{|a_1a_2 + b_1b_2 + c_1c_2|}{\\sqrt{a_1^2 + b_1^2 + c_1^2}\\sqrt{a_2^2 + b_2^2 + c_2^2}}$.', 1]),
  derive(G(3, 2), 'Obtain the equation of the plane through $\\vec{a}$ with normal $\\vec{n} = A\\hat{i} + B\\hat{j} + C\\hat{k}$, in vector and Cartesian form.', ['For any point $\\vec{r}$ on the plane, $\\vec{r} - \\vec{a}$ lies in it, so it is at right angles to $\\vec{n}$.', 1], ['Vector form: $(\\vec{r} - \\vec{a}) \\cdot \\vec{n} = 0$.', 1], ['Cartesian form: $A(x - x_1) + B(y - y_1) + C(z - z_1) = 0$.', 1]),
];

export default questions;
