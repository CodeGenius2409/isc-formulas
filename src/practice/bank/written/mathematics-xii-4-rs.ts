// Written by hand: vector algebra, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('mathematics', 'XII');
const A = at(4, 'a');

const questions: BankDef[] = [
  reason(A(1, 1), 'Explain why $\\vec{a} \\times \\vec{a} = \\vec{0}$ for any vector $\\vec{a}$.', 'The angle between $\\vec{a}$ and itself is 0, and $\\sin 0 = 0$.'),
  reason(A(2, 2), 'Explain why $\\vec{a} \\cdot \\vec{b} = 0$ for non-zero vectors means they are at right angles.', '$\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta$, and neither length is zero.', 'So $\\cos\\theta = 0$, which gives $\\theta = 90°$.'),
  reason(A(2, 2), 'Explain why $\\vec{a} \\times \\vec{b} = -\\vec{b} \\times \\vec{a}$.', 'Both have the same size, $|\\vec{a}||\\vec{b}|\\sin\\theta$.', 'By the right-hand rule, turning from $\\vec{b}$ to $\\vec{a}$ gives the opposite direction.'),
  reason(A(2, 3), 'Explain why $|\\vec{a} \\times \\vec{b}|$ gives the area of the parallelogram on $\\vec{a}$ and $\\vec{b}$.', 'The area is base times height, $|\\vec{a}|$ times $|\\vec{b}|\\sin\\theta$.', 'That is the size of the cross product.'),
  reason(A(1, 2), 'Explain why the direction cosines $l$, $m$, $n$ of a vector satisfy $l^2 + m^2 + n^2 = 1$.', 'They are the components of the unit vector along it, whose length is 1.'),
  reason(A(2, 3), 'Explain why two non-zero vectors are parallel exactly when their cross product is zero.', '$|\\vec{a} \\times \\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\theta$, with both lengths non-zero.', 'It is zero only when $\\sin\\theta = 0$, that is $\\theta = 0$ or $\\pi$.'),
  short(A(2, 1), 'Find a unit vector in the direction of $2\\hat{i} - \\hat{j} + 2\\hat{k}$.', 'Its length is $\\sqrt{4 + 1 + 4} = 3$.', 'The unit vector is $\\frac{1}{3}(2\\hat{i} - \\hat{j} + 2\\hat{k})$.'),
  short(A(2, 2), 'Find the projection of $\\vec{a} = \\hat{i} + 2\\hat{j} + 3\\hat{k}$ on $\\vec{b} = 2\\hat{i} + \\hat{j} + 2\\hat{k}$.', '$\\vec{a} \\cdot \\vec{b} = 2 + 2 + 6 = 10$, and $|\\vec{b}| = 3$.', 'The projection is $\\frac{10}{3}$.'),
  short(A(2, 2), 'Find $\\lambda$ so that $2\\hat{i} + \\lambda\\hat{j} + \\hat{k}$ and $\\hat{i} - 2\\hat{j} + 3\\hat{k}$ are at right angles.', 'Their dot product is $2 - 2\\lambda + 3 = 0$.', 'So $\\lambda = \\frac{5}{2}$.'),
  short(A(3, 2), 'Find the position vector of the point dividing the join of $P(\\hat{i} + 2\\hat{j})$ and $Q(4\\hat{i} - \\hat{j} + 3\\hat{k})$ internally in the ratio $2 : 1$.', 'It is $\\frac{2\\vec{q} + 1\\vec{p}}{2 + 1}$.', '$= \\frac{(8\\hat{i} - 2\\hat{j} + 6\\hat{k}) + (\\hat{i} + 2\\hat{j})}{3}$.', '$= 3\\hat{i} + 2\\hat{k}$.'),
  short(A(3, 3), 'Find the area of the triangle with vertices $A(1, 1, 1)$, $B(1, 2, 3)$ and $C(2, 3, 1)$.', '$\\vec{AB} = \\hat{j} + 2\\hat{k}$ and $\\vec{AC} = \\hat{i} + 2\\hat{j}$.', '$\\vec{AB} \\times \\vec{AC} = -4\\hat{i} + 2\\hat{j} - \\hat{k}$, of length $\\sqrt{21}$.', 'The area is $\\frac{\\sqrt{21}}{2}$.'),
];

export default questions;
