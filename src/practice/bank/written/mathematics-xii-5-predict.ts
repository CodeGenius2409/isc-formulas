// Written by hand: three-dimensional geometry, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('mathematics', 'XII');
const G = at(5, 'a');

const questions: BankDef[] = [
  predict(G(2, 1), 'Predict the distance of the origin from the plane $2x - y + 2z = 9$.', '$d = \\frac{|0 - 0 + 0 - 9|}{\\sqrt{4 + 1 + 4}}$.', '$= 3$.'),
  predict(G(2, 2), 'Two lines have direction ratios $(1, 2, 3)$ and $(2, 4, 6)$, and pass through different points. Predict the shortest distance formula needed between them.', 'They are parallel, so the skew-line formula, with $\\vec{b}_1 \\times \\vec{b}_2 = \\vec{0}$, can’t be used.', 'The parallel-line formula is used: $\\frac{|\\vec{b} \\times (\\vec{a}_2 - \\vec{a}_1)|}{|\\vec{b}|}$.'),
  predict(G(2, 2), 'A line is parallel to a plane. Predict the angle between the line and the plane’s normal.', '$90°$.', 'So $\\vec{b} \\cdot \\vec{n} = 0$.'),
  predict(G(3, 3), 'Predict whether the line $\\frac{x - 1}{2} = \\frac{y}{1} = \\frac{z + 1}{-1}$ lies in the plane $x - y + z = 0$.', 'Its direction $(2, 1, -1)$ dotted with the normal $(1, -1, 1)$ gives $2 - 1 - 1 = 0$, so it is parallel to the plane.', 'Its point $(1, 0, -1)$ gives $1 - 0 - 1 = 0$, so that point lies in the plane.', 'So the whole line lies in the plane.'),
  predict(G(2, 3), 'Predict the angle between the planes $x + 2y - z = 1$ and $2x + 4y - 2z = 5$.', '$0°$: their normals are parallel.', 'They are different parallel planes, as the second equation isn’t a multiple of the first.'),
];

export default questions;
