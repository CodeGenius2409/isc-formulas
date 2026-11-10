// Written by hand: three-dimensional geometry, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('mathematics', 'XII');
const A = at(5, 'a');

const questions: BankDef[] = [
  reason(A(1, 1), 'Explain why $(1, 2, 3)$ and $(2, 4, 6)$ give the same line direction.', 'Each is a multiple of the other, and direction ratios are fixed only up to a multiple.'),
  reason(A(2, 2), 'Explain why skew lines can only occur in three dimensions.', 'In a plane, two lines either meet or are parallel.', 'Skew lines neither meet nor are parallel, which needs them to lie in different planes.'),
  reason(A(2, 2), 'Explain why the shortest distance between two lines that meet is zero.', 'They share a point.', 'The distance between them at that point is zero, and no distance can be less.'),
  reason(A(2, 3), 'Explain why the angle between a line and a plane uses $\\sin$, while the angle between two planes uses $\\cos$.', 'The angle between two planes is the angle between their normals, which uses $\\cos$.', 'A line makes an angle $90° - \\theta$ with the normal when it makes $\\theta$ with the plane, and $\\cos(90° - \\theta) = \\sin\\theta$.'),
  reason(A(1, 2), 'Explain why the planes $x + 2y + 3z = 4$ and $2x + 4y + 6z = 1$ are parallel.', 'Their normals, $(1, 2, 3)$ and $(2, 4, 6)$, are parallel, but the equations aren’t multiples, so the planes are different.'),
  short(A(2, 1), 'Find the direction cosines of the line joining $(1, 2, 3)$ and $(3, 4, 4)$.', 'Its direction ratios are $2, 2, 1$, with $\\sqrt{4 + 4 + 1} = 3$.', 'The direction cosines are $\\frac{2}{3}, \\frac{2}{3}, \\frac{1}{3}$.'),
  short(A(2, 2), 'Find the distance of the point $(2, 1, -1)$ from the plane $x - 2y + 2z = 5$.', '$d = \\frac{|2 - 2 - 2 - 5|}{\\sqrt{1 + 4 + 4}}$.', '$= \\frac{7}{3}$.'),
  short(A(2, 2), 'Write the vector and the Cartesian equations of the line through $(1, -2, 3)$ parallel to $2\\hat{i} + \\hat{j} - \\hat{k}$.', '$\\vec{r} = (\\hat{i} - 2\\hat{j} + 3\\hat{k}) + \\lambda(2\\hat{i} + \\hat{j} - \\hat{k})$.', '$\\frac{x - 1}{2} = \\frac{y + 2}{1} = \\frac{z - 3}{-1}$.'),
  short(A(3, 2), 'Find the angle between the planes $x + y + z = 1$ and $x - y + 2z = 3$.', 'Their normals are $(1, 1, 1)$ and $(1, -1, 2)$, with dot product 2.', 'Their lengths are $\\sqrt{3}$ and $\\sqrt{6}$.', '$\\cos\\theta = \\frac{2}{\\sqrt{18}} = \\frac{\\sqrt{2}}{3}$, so $\\theta = \\cos^{-1}\\frac{\\sqrt{2}}{3}$.'),
  short(A(3, 3), 'Show that the lines $\\frac{x - 1}{2} = \\frac{y - 2}{3} = \\frac{z - 3}{4}$ and $\\frac{x - 4}{5} = \\frac{y - 1}{2} = z$ meet.', 'Points on them are $(2\\lambda + 1, 3\\lambda + 2, 4\\lambda + 3)$ and $(5\\mu + 4, 2\\mu + 1, \\mu)$.', 'Equating $x$ and $y$ gives $\\lambda = -1$ and $\\mu = -1$.', 'Then $z$ is $-1$ on both, so they meet at $(-1, -1, -1)$.'),
];

export default questions;
