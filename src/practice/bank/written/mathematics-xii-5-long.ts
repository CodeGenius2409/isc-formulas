// Written by hand: three-dimensional geometry, long answers in parts. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('mathematics', 'XII');
const G = at(5, 'a');

const questions: BankDef[] = [
  long(G(5, 1), 'Answer each part on the line through $(1, 2, 3)$ and $(3, 5, 9)$.\n(a) Find its direction ratios and direction cosines. [2]\n(b) Write its vector and Cartesian equations. [2]\n(c) Does $(5, 8, 15)$ lie on it? [1]', '(a) Direction ratios $2, 3, 6$.', '(a) Their length is 7, so the direction cosines are $\\frac{2}{7}, \\frac{3}{7}, \\frac{6}{7}$.', '(b) $\\vec{r} = (\\hat{i} + 2\\hat{j} + 3\\hat{k}) + \\lambda(2\\hat{i} + 3\\hat{j} + 6\\hat{k})$.', '(b) $\\frac{x - 1}{2} = \\frac{y - 2}{3} = \\frac{z - 3}{6}$.', '(c) Yes: each fraction is 2 there.'),
  long(G(5, 2), 'Answer each part on the lines $\\vec{r} = (\\hat{i} + \\hat{j}) + \\lambda(2\\hat{i} - \\hat{j} + \\hat{k})$ and $\\vec{r} = (2\\hat{i} + \\hat{j} - \\hat{k}) + \\mu(3\\hat{i} - 5\\hat{j} + 2\\hat{k})$.\n(a) Find $\\vec{b}_1 \\times \\vec{b}_2$. [2]\n(b) Find the shortest distance between them. [3]', '(a) $\\vec{b}_1 \\times \\vec{b}_2 = \\hat{i}(-2 + 5) - \\hat{j}(4 - 3) + \\hat{k}(-10 + 3)$.', '(a) $= 3\\hat{i} - \\hat{j} - 7\\hat{k}$, of length $\\sqrt{59}$.', '(b) $\\vec{a}_2 - \\vec{a}_1 = \\hat{i} - \\hat{k}$.', '(b) Its dot product with $\\vec{b}_1 \\times \\vec{b}_2$ is $3 + 7 = 10$.', '(b) The shortest distance is $\\frac{10}{\\sqrt{59}}$.'),
  long(G(5, 3), 'Answer each part on the plane through $(1, 1, 1)$, $(1, -1, 2)$ and $(-2, -2, 2)$.\n(a) Find a normal to it. [3]\n(b) Write its equation. [2]', '(a) Two vectors in it: $(0, -2, 1)$ and $(-3, -3, 1)$.', '(a) Their cross product: $\\hat{i}(-2 + 3) - \\hat{j}(0 + 3) + \\hat{k}(0 - 6)$.', '(a) $= \\hat{i} - 3\\hat{j} - 6\\hat{k}$.', '(b) $1(x - 1) - 3(y - 1) - 6(z - 1) = 0$.', '(b) $x - 3y - 6z + 8 = 0$.'),
];

export default questions;
