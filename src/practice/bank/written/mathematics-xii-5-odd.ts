// Written by hand: three-dimensional geometry, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('mathematics', 'XII');
const G = at(5, 'a');

const questions: BankDef[] = [
  odd(G(2, 1), ['$\\frac{1}{3}, \\frac{2}{3}, \\frac{2}{3}$', '$0, 0, 1$', '$\\frac{1}{\\sqrt{2}}, 0, \\frac{1}{\\sqrt{2}}$', '$1, 1, 1$'], '$1, 1, 1$', 'Their squares add up to 3, so they can’t be direction cosines; the others can.'),
  odd(G(2, 2), ['$x + y + z = 1$', '$2x + 2y + 2z = 5$', '$x - y + z = 0$', '$3x + 3y + 3z = 0$'], '$x - y + z = 0$', 'It isn’t parallel to the others, whose normals are all along $(1, 1, 1)$.'),
  odd(G(2, 2), ['intersecting lines', 'parallel lines', 'coplanar lines', 'skew lines'], 'skew lines', 'They don’t lie in one plane; the others do.'),
  odd(G(2, 3), ['$\\vec{r} = \\vec{a} + \\lambda\\vec{b}$', '$\\frac{x - x_1}{a} = \\frac{y - y_1}{b} = \\frac{z - z_1}{c}$', '$\\vec{r} \\cdot \\hat{n} = d$', '$\\vec{r} = (1 - \\lambda)\\vec{a} + \\lambda\\vec{b}$'], '$\\vec{r} \\cdot \\hat{n} = d$', 'It is the equation of a plane; the others are equations of a line.'),
  odd(G(2, 3), ['angle between two lines', 'angle between two planes', 'angle between a line and a plane', 'distance of a point from a plane'], 'distance of a point from a plane', 'It is a length; the others are angles.'),
];

export default questions;
