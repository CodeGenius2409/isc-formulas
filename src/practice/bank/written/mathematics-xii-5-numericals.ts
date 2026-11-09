// Written by hand: numericals on three-dimensional geometry, for Mathematics XII at 0% generated. The answers are computed separately
// in tests/unit/written-answers.test.ts. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { theory } = bank('mathematics', 'XII');
const n = (place: Place, text: string, points: (string | [string, number])[]) => theory('short', place, text, points, { format: 'numerical' });
const G = (marks: number, d: 1 | 2 | 3): Place => [5, 'a', marks, d];

const questions: BankDef[] = [
  n(G(1, 1), 'Find the distance between $(1, 2, 3)$ and $(4, 6, 3)$.', ['$\\sqrt{9 + 16 + 0} = 5$.']),
  n(G(1, 2), 'A line has direction ratios 1, 2, 2. Find its direction cosine with the x-axis.', ['$\\frac{1}{\\sqrt{1 + 4 + 4}} = \\frac{1}{3}$.']),
  n(G(2, 1), 'Find the distance of the origin from the plane $2x + 3y + 6z = 14$.', ['$\\frac{14}{\\sqrt{4 + 9 + 36}} = \\frac{14}{7}$.', 'This is $2$.']),
  n(G(2, 2), 'Find the angle between the planes $x + y = 3$ and $y + z = 5$.', ['The normals are $(1, 1, 0)$ and $(0, 1, 1)$, so $\\cos\\theta = \\frac{1}{2}$.', 'So $\\theta = \\frac{\\pi}{3}$.']),
  n(G(2, 2), 'Find the distance between the parallel planes $2x - y + 2z = 3$ and $2x - y + 2z = 9$.', ['$\\frac{|9 - 3|}{\\sqrt{4 + 1 + 4}}$.', 'This is $2$.']),
  n(G(3, 1), 'Find the distance of the point $(1, 2, 3)$ from the plane $x + 2y + 2z = 2$.', ['$\\frac{|1 + 4 + 6 - 2|}{\\sqrt{1 + 4 + 4}}$.', 'That is $\\frac{9}{3}$.', 'This is $3$.']),
  n(G(3, 3), 'Find the shortest distance between $\\vec{r} = \\lambda\\hat{i}$ and $\\vec{r} = 3\\hat{j} + 4\\hat{k} + \\mu\\hat{j}$.', ['$\\vec{b}_1 \\times \\vec{b}_2 = \\hat{i} \\times \\hat{j} = \\hat{k}$.', 'The vector between the given points is $3\\hat{j} + 4\\hat{k}$.', 'The distance is $|(3\\hat{j} + 4\\hat{k}) \\cdot \\hat{k}| = 4$.']),
  n(G(3, 2), 'Find $k$ if the lines $\\frac{x}{1} = \\frac{y}{2} = \\frac{z}{3}$ and $\\frac{x}{k} = \\frac{y}{1} = \\frac{z}{-1}$ are perpendicular.', ['Their direction ratios give a zero dot product.', '$k + 2 - 3 = 0$.', 'So $k = 1$.']),
  n(G(5, 2), 'Find the plane through $(1, 0, 0)$, $(0, 1, 0)$ and $(0, 0, 1)$, and the square of the distance from it to $(2, 2, 2)$.', ['By intercepts, the plane is $x + y + z = 1$.', 'Its normal is $(1, 1, 1)$, of magnitude $\\sqrt{3}$.', 'The distance is $\\frac{|2 + 2 + 2 - 1|}{\\sqrt{3}}$.', 'That is $\\frac{5}{\\sqrt{3}}$.', 'Its square is $\\frac{25}{3}$.']),
  n(G(5, 3), 'Find the foot of the perpendicular from $(3, 4, 5)$ to the plane $x + y + z = 3$, and the square of the distance from the point to the plane.', ['The perpendicular is $(3 + t, 4 + t, 5 + t)$.', 'Put it in the plane: $12 + 3t = 3$, so $t = -3$.', 'The foot is $(0, 1, 2)$, whose coordinates add to 3, as the plane requires.', 'The distance is $3\\sqrt{3}$.', 'Its square is $27$.']),
];

export default questions;
