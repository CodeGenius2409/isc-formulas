// Written by hand: three-dimensional geometry, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('mathematics', 'XII');
const G = at(5, 'a');

const questions: BankDef[] = [
  tell(G(2, 1), 'Distinguish between the vector and the Cartesian equation of a line.', 'Vector form: $\\vec{r} = \\vec{a} + \\lambda\\vec{b}$, through $\\vec{a}$ along $\\vec{b}$.', 'Cartesian form: $\\frac{x - x_1}{a} = \\frac{y - y_1}{b} = \\frac{z - z_1}{c}$.'),
  tell(G(2, 2), 'Distinguish between skew lines and parallel lines.', 'Parallel lines have the same direction, and lie in one plane.', 'Skew lines are neither parallel nor meeting, so they don’t lie in one plane.'),
  tell(G(2, 2), 'Distinguish between the equation of a line and that of a plane in vector form.', 'A line: $\\vec{r} = \\vec{a} + \\lambda\\vec{b}$, with one parameter.', 'A plane: $\\vec{r} \\cdot \\vec{n} = d$, with a normal $\\vec{n}$.'),
  tell(G(2, 3), 'Distinguish between the angle between two planes and the angle between a line and a plane.', 'The angle between two planes is that between their normals: $\\cos\\theta = \\frac{|\\vec{n}_1 \\cdot \\vec{n}_2|}{|\\vec{n}_1||\\vec{n}_2|}$.', 'For a line and a plane, $\\sin\\theta = \\frac{|\\vec{b} \\cdot \\vec{n}|}{|\\vec{b}||\\vec{n}|}$, as the line makes $90° - \\theta$ with the normal.'),
  tell(G(3, 3), 'Distinguish between how the shortest distance is found for two skew lines and for two parallel lines.', 'For skew lines: $\\frac{|(\\vec{a}_2 - \\vec{a}_1) \\cdot (\\vec{b}_1 \\times \\vec{b}_2)|}{|\\vec{b}_1 \\times \\vec{b}_2|}$.', 'For parallel lines along $\\vec{b}$: $\\frac{|\\vec{b} \\times (\\vec{a}_2 - \\vec{a}_1)|}{|\\vec{b}|}$.', 'The first fails for parallel lines, as $\\vec{b}_1 \\times \\vec{b}_2 = \\vec{0}$.'),
];

export default questions;
