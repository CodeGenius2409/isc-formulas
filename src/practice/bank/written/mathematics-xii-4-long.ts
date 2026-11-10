// Written by hand: vector algebra, long answers in parts. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('mathematics', 'XII');
const V = at(4, 'a');

const questions: BankDef[] = [
  long(V(5, 1), 'Answer each part for $\\vec{a} = \\hat{i} + 2\\hat{j} + 2\\hat{k}$ and $\\vec{b} = 3\\hat{i} - \\hat{j} + 2\\hat{k}$.\n(a) Find $\\vec{a} \\cdot \\vec{b}$ and the angle between them. [3]\n(b) Find the projection of $\\vec{b}$ on $\\vec{a}$. [2]', '(a) $\\vec{a} \\cdot \\vec{b} = 3 - 2 + 4 = 5$.', '(a) $|\\vec{a}| = 3$ and $|\\vec{b}| = \\sqrt{14}$.', '(a) $\\cos\\theta = \\frac{5}{3\\sqrt{14}}$.', '(b) The projection is $\\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}|}$.', '(b) $= \\frac{5}{3}$.'),
  long(V(5, 2), 'Answer each part for $\\vec{a} = 2\\hat{i} + \\hat{j} - \\hat{k}$ and $\\vec{b} = \\hat{i} - \\hat{j} + 2\\hat{k}$.\n(a) Find $\\vec{a} \\times \\vec{b}$. [2]\n(b) Find a unit vector at right angles to both. [2]\n(c) Find the area of the parallelogram on them. [1]', '(a) $\\vec{a} \\times \\vec{b} = \\hat{i}(2 - 1) - \\hat{j}(4 + 1) + \\hat{k}(-2 - 1)$.', '(a) $= \\hat{i} - 5\\hat{j} - 3\\hat{k}$.', '(b) Its length is $\\sqrt{1 + 25 + 9} = \\sqrt{35}$.', '(b) The unit vector is $\\frac{1}{\\sqrt{35}}(\\hat{i} - 5\\hat{j} - 3\\hat{k})$.', '(c) The area is $\\sqrt{35}$ square units.'),
  long(V(5, 2), 'Answer each part.\n(a) Show that the points with position vectors $\\hat{i} + 2\\hat{j}$, $3\\hat{i} + 4\\hat{j}$ and $5\\hat{i} + 6\\hat{j}$ are collinear. [3]\n(b) Find the position vector of the midpoint of the first and third. [2]', '(a) $\\vec{AB} = 2\\hat{i} + 2\\hat{j}$.', '(a) $\\vec{BC} = 2\\hat{i} + 2\\hat{j}$.', '(a) They are parallel and share $B$, so $A$, $B$ and $C$ lie on one line.', '(b) $\\frac{(\\hat{i} + 2\\hat{j}) + (5\\hat{i} + 6\\hat{j})}{2}$.', '(b) $= 3\\hat{i} + 4\\hat{j}$, which is $B$.'),
  long(V(5, 3), 'Answer each part.\n(a) Prove that the diagonals of a rhombus are at right angles, using vectors. [3]\n(b) Find $|\\vec{a} + \\vec{b}|$ if $|\\vec{a}| = 3$, $|\\vec{b}| = 4$ and $\\vec{a} \\cdot \\vec{b} = 0$. [2]', '(a) Let the sides be $\\vec{a}$ and $\\vec{b}$, with $|\\vec{a}| = |\\vec{b}|$.', '(a) The diagonals are $\\vec{a} + \\vec{b}$ and $\\vec{a} - \\vec{b}$.', '(a) $(\\vec{a} + \\vec{b}) \\cdot (\\vec{a} - \\vec{b}) = |\\vec{a}|^2 - |\\vec{b}|^2 = 0$.', '(b) $|\\vec{a} + \\vec{b}|^2 = 9 + 16 + 0 = 25$.', '(b) $|\\vec{a} + \\vec{b}| = 5$.'),
];

export default questions;
