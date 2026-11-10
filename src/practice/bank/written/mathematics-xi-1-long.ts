// Written by hand: trigonometry, long answers in parts. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('mathematics', 'XI');
const T = at(1, 'c');

const questions: BankDef[] = [
  long(T(5, 1), 'Answer each part.\n(a) Convert $40°\\,20\'$ into radians. [2]\n(b) Find the length of an arc of a circle of radius 6 cm that makes $60°$ at the centre. [2]\n(c) In which quadrant is an angle of $\\frac{7\\pi}{6}$? [1]', '(a) $40°\\,20\' = 40\\frac{1}{3}° = \\frac{121}{3}°$.', '(a) $\\frac{121}{3} \\times \\frac{\\pi}{180} = \\frac{121\\pi}{540}$ radians.', '(b) $60° = \\frac{\\pi}{3}$ radians, and $l = r\\theta$.', '(b) $l = 6 \\times \\frac{\\pi}{3} = 2\\pi$ cm.', '(c) The third, as it lies between $\\pi$ and $\\frac{3\\pi}{2}$.'),
  long(T(5, 2), 'Answer each part. $\\sin x = \\frac{3}{5}$ with $x$ in the second quadrant.\n(a) Find $\\cos x$ and $\\tan x$. [2]\n(b) Find $\\sin 2x$ and $\\cos 2x$. [2]\n(c) In which quadrant does $2x$ lie? [1]', '(a) $\\cos x = -\\frac{4}{5}$, negative in the second quadrant.', '(a) $\\tan x = -\\frac{3}{4}$.', '(b) $\\sin 2x = 2 \\cdot \\frac{3}{5} \\cdot \\left(-\\frac{4}{5}\\right) = -\\frac{24}{25}$.', '(b) $\\cos 2x = \\frac{16}{25} - \\frac{9}{25} = \\frac{7}{25}$.', '(c) The fourth, as $\\sin 2x < 0$ and $\\cos 2x > 0$.'),
  long(T(5, 2), 'Answer each part.\n(a) Prove that $\\sin 3x = 3\\sin x - 4\\sin^3 x$. [3]\n(b) Use it to find $\\sin 3x$ when $\\sin x = \\frac{1}{2}$, and check it. [2]', '(a) $\\sin 3x = \\sin(2x + x) = \\sin 2x\\cos x + \\cos 2x\\sin x$.', '(a) $= 2\\sin x\\cos^2 x + (1 - 2\\sin^2 x)\\sin x$.', '(a) With $\\cos^2 x = 1 - \\sin^2 x$, this is $3\\sin x - 4\\sin^3 x$.', '(b) $3 \\cdot \\frac{1}{2} - 4 \\cdot \\frac{1}{8} = 1$.', '(b) Check: $x = 30°$, and $\\sin 90° = 1$.'),
  long(T(5, 3), 'Answer each part.\n(a) Prove that $\\cos(x + y)\\cos(x - y) = \\cos^2 x - \\sin^2 y$. [3]\n(b) Use it to find $\\cos 75°\\cos 15°$. [2]', '(a) Expand both: $(\\cos x\\cos y - \\sin x\\sin y)(\\cos x\\cos y + \\sin x\\sin y)$.', '(a) $= \\cos^2 x\\cos^2 y - \\sin^2 x\\sin^2 y$.', '(a) $= \\cos^2 x(1 - \\sin^2 y) - (1 - \\cos^2 x)\\sin^2 y = \\cos^2 x - \\sin^2 y$.', '(b) With $x = 45°$, $y = 30°$: $\\cos^2 45° - \\sin^2 30°$.', '(b) $= \\frac{1}{2} - \\frac{1}{4} = \\frac{1}{4}$.'),
  long(T(5, 3), 'Answer each part on $y = 2\\sin x$.\n(a) Give its domain, range and period. [2]\n(b) Sketch it for $0 \\le x \\le 2\\pi$. [2]\n(c) Where is it greatest in that interval? [1]', '(a) Domain $\\mathbb{R}$, range $[-2, 2]$.', '(a) Period $2\\pi$.', '(b) It rises from 0 to 2 at $\\frac{\\pi}{2}$, falls through 0 at $\\pi$ to $-2$ at $\\frac{3\\pi}{2}$, and returns to 0 at $2\\pi$.', '(b) It has the shape of $\\sin x$, stretched to twice the height.', '(c) At $x = \\frac{\\pi}{2}$.'),
];

export default questions;
