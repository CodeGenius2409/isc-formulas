// Written by hand: trigonometry, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('mathematics', 'XI');
const T = at(1, 'c');

const questions: BankDef[] = [
  reason(T(1, 1), 'Explain why $\\sin x$ can never be 2.', 'On the unit circle, $\\sin x$ is a point’s $y$-coordinate, which lies between $-1$ and $1$.'),
  reason(T(2, 2), 'Explain why $\\tan x$ is not defined at $x = \\frac{\\pi}{2}$.', '$\\tan x = \\frac{\\sin x}{\\cos x}$.', 'At $\\frac{\\pi}{2}$, $\\cos x = 0$, so it would mean dividing by zero.'),
  reason(T(2, 2), 'Explain why $\\cos x$ is negative in the second and third quadrants.', '$\\cos x$ is the $x$-coordinate of the point on the unit circle.', 'In those quadrants, the point lies left of the $y$-axis.'),
  reason(T(2, 3), 'Explain why $\\sin x$ and $\\cos x$ have period $2\\pi$, while $\\tan x$ has period $\\pi$.', 'Turning through $2\\pi$ brings a point on the unit circle back to where it started.', 'Turning through $\\pi$ changes the sign of both $\\sin$ and $\\cos$, so their ratio $\\tan$ is unchanged.'),
  reason(T(1, 2), 'Explain why $\\sin(-x) = -\\sin x$.', 'The angle $-x$ reflects the point on the unit circle in the $x$-axis, which changes the sign of its $y$-coordinate.'),
  short(T(2, 1), 'Convert $\\frac{5\\pi}{6}$ radians into degrees, and $210°$ into radians.', '$\\frac{5\\pi}{6} \\times \\frac{180°}{\\pi} = 150°$.', '$210° \\times \\frac{\\pi}{180°} = \\frac{7\\pi}{6}$.'),
  short(T(2, 2), 'Find the value of $\\sin 75°$ without tables.', '$\\sin(45° + 30°) = \\sin 45°\\cos 30° + \\cos 45°\\sin 30°$.', '$= \\frac{\\sqrt{3} + 1}{2\\sqrt{2}}$.'),
  short(T(2, 2), 'Give the domain and range of $\\sin x$ and of $\\tan x$.', '$\\sin x$: domain $\\mathbb{R}$, range $[-1, 1]$.', '$\\tan x$: domain all reals except odd multiples of $\\frac{\\pi}{2}$, range $\\mathbb{R}$.'),
  short(T(3, 2), 'Prove that $\\cos 3x = 4\\cos^3 x - 3\\cos x$.', '$\\cos 3x = \\cos(2x + x) = \\cos 2x\\cos x - \\sin 2x\\sin x$.', '$= (2\\cos^2 x - 1)\\cos x - 2\\sin^2 x\\cos x$.', 'With $\\sin^2 x = 1 - \\cos^2 x$, it becomes $4\\cos^3 x - 3\\cos x$.'),
  short(T(3, 3), 'If $\\tan x = \\frac{3}{4}$ and $x$ lies in the third quadrant, find $\\sin 2x$ and $\\cos 2x$.', 'In the third quadrant, $\\sin x = -\\frac{3}{5}$ and $\\cos x = -\\frac{4}{5}$.', '$\\sin 2x = 2 \\cdot \\left(-\\frac{3}{5}\\right)\\left(-\\frac{4}{5}\\right) = \\frac{24}{25}$.', '$\\cos 2x = \\frac{16}{25} - \\frac{9}{25} = \\frac{7}{25}$.'),
];

export default questions;
