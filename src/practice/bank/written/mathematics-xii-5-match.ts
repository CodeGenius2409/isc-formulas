// Written by hand: three-dimensional geometry, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('mathematics', 'XII');
const A = at(5, 'a');

const questions: BankDef[] = [
  match(A(3, 1), [['$x$-axis', 'Direction cosines $1, 0, 0$'], ['$y$-axis', 'Direction cosines $0, 1, 0$'], ['$z$-axis', 'Direction cosines $0, 0, 1$']]),
  match(A(4, 2), [['Lines with $a_1a_2 + b_1b_2 + c_1c_2 = 0$', 'At right angles'], ['Lines with $\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}$', 'Parallel'], ['Lines that neither meet nor are parallel', 'Skew'], ['Lines that lie in one plane', 'Coplanar']]),
  match(A(3, 2), [['Plane $ax + by + cz = d$', 'Normal along $(a, b, c)$'], ['Plane through the origin', '$d = 0$'], ['Plane parallel to the $xy$-plane', '$z = k$']]),
  match(A(4, 3), [['Distance of $(x_1, y_1, z_1)$ from $ax + by + cz + d = 0$', '$\\frac{|ax_1 + by_1 + cz_1 + d|}{\\sqrt{a^2 + b^2 + c^2}}$'], ['Angle between two planes', 'The angle between their normals'], ['Angle between a line and a plane', '$90°$ minus the angle with the normal'], ['Shortest distance between skew lines', '$\\frac{|(\\vec{a}_2 - \\vec{a}_1) \\cdot (\\vec{b}_1 \\times \\vec{b}_2)|}{|\\vec{b}_1 \\times \\vec{b}_2|}$']]),
  match(A(3, 3), [['Line through $\\vec{a}$ along $\\vec{b}$', '$\\vec{r} = \\vec{a} + \\lambda\\vec{b}$'], ['Plane with normal $\\hat{n}$ at distance $p$ from the origin', '$\\vec{r} \\cdot \\hat{n} = p$'], ['Line through $(x_1, y_1, z_1)$ with direction ratios $a, b, c$', '$\\frac{x - x_1}{a} = \\frac{y - y_1}{b} = \\frac{z - z_1}{c}$']]),
];

export default questions;
