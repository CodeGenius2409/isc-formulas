// Written by hand: numericals on vectors, for Mathematics XII at 0% generated. The answers are computed separately in
// tests/unit/written-answers.test.ts. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { theory } = bank('mathematics', 'XII');
const n = (place: Place, text: string, points: (string | [string, number])[]) => theory('short', place, text, points, { format: 'numerical' });
const V = (marks: number, d: 1 | 2 | 3): Place => [4, 'a', marks, d];

const questions: BankDef[] = [
  n(V(1, 1), 'Find the magnitude of $3\\hat{i} - 4\\hat{j}$.', ['$\\sqrt{9 + 16} = 5$.']),
  n(V(1, 1), 'Find $(\\hat{i} + 2\\hat{j}) \\cdot (3\\hat{i} - \\hat{j})$.', ['$3 - 2 = 1$.']),
  n(V(2, 1), 'If $|\\vec{a}| = 2$, $|\\vec{b}| = 3$, and the angle between them is $30°$, find $|\\vec{a} \\times \\vec{b}|$.', ['$|\\vec{a}||\\vec{b}|\\sin 30°$.', 'This is $3$.']),
  n(V(2, 2), 'Find the projection of $2\\hat{i} + \\hat{j}$ on $3\\hat{i} + 4\\hat{j}$.', ['$\\frac{(2\\hat{i} + \\hat{j}) \\cdot (3\\hat{i} + 4\\hat{j})}{5} = \\frac{10}{5}$.', 'This is $2$.']),
  n(V(2, 1), 'Find $k$ if $2\\hat{i} + \\hat{j} + \\hat{k}$ and $\\hat{i} - 3\\hat{j} + k\\hat{k}$ are perpendicular.', ['Their dot product is $2 - 3 + k = 0$.', 'So $k = 1$.']),
  n(V(3, 2), 'Find the area of the triangle with vertices $A(1, 0, 0)$, $B(0, 1, 0)$ and $C(0, 0, 1)$.', ['$\\overrightarrow{AB} = -\\hat{i} + \\hat{j}$, and $\\overrightarrow{AC} = -\\hat{i} + \\hat{k}$.', 'Their cross product is $\\hat{i} + \\hat{j} + \\hat{k}$, of magnitude $\\sqrt{3}$.', 'The area is $\\frac{\\sqrt{3}}{2}$.']),
  n(V(3, 1), 'Find the angle between $\\hat{i} + \\hat{j}$ and $\\hat{j} + \\hat{k}$.', ['The dot product is 1.', 'Each magnitude is $\\sqrt{2}$, so $\\cos\\theta = \\frac{1}{2}$.', 'So $\\theta = \\frac{\\pi}{3}$.']),
  n(V(3, 3), 'Find $k$ if $\\hat{i} + 2\\hat{j} + 3\\hat{k}$, $\\hat{j} + 2\\hat{k}$ and $\\hat{i} + k\\hat{k}$ are coplanar.', ['Their scalar triple product must be zero.', 'The determinant is $1(k) - 2(0 - 2) + 3(0 - 1) = k + 1$.', 'So $k = -1$.']),
  n(V(5, 2), 'A force $3\\hat{i} + 2\\hat{j} + \\hat{k}$ moves a particle from $(1, 1, 1)$ to $(3, 2, 4)$, in SI units. (i) Find the displacement. (ii) Say what quantity gives the work. (iii) Find the work. (iv) Find the magnitude of the force. (v) Is the angle between the force and the displacement acute? Why?', ['(i) $2\\hat{i} + \\hat{j} + 3\\hat{k}$.', '(ii) The dot product of the force and the displacement.', '(iii) $6 + 2 + 3 = 11$ J.', '(iv) $\\sqrt{14}$ N.', '(v) Yes, as the dot product is positive: $11$.']),
  n(V(5, 3), 'Let $\\vec{a} = \\hat{i} + 2\\hat{j} + 3\\hat{k}$ and $\\vec{b} = 3\\hat{i} - 2\\hat{j} + \\hat{k}$. (i) Find $\\vec{a} \\times \\vec{b}$. (ii) Find a unit vector perpendicular to both. (iii) Find the area of the parallelogram with these sides.', ['(i) The determinant with rows $\\hat{i}, \\hat{j}, \\hat{k}$, then 1, 2, 3, then 3, −2, 1.', 'This gives $8\\hat{i} + 8\\hat{j} - 8\\hat{k}$.', '(ii) The unit vector is $\\frac{1}{\\sqrt{3}}(\\hat{i} + \\hat{j} - \\hat{k})$.', '(iii) The area is the magnitude of the cross product.', 'The area is $8\\sqrt{3}$.']),
];

export default questions;
