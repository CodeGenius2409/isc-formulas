// Written by hand: trigonometry, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('mathematics', 'XI');
const T = at(1, 'c');

const questions: BankDef[] = [
  ar(T(1, 1), '$\\cos x$ is negative in the second quadrant.', 'In the second quadrant, the point on the unit circle is left of the $y$-axis.', 1, '$\\cos x$ is that point’s $x$-coordinate.'),
  ar(T(1, 2), 'The period of $\\tan x$ is $2\\pi$.', '$\\tan(x + \\pi) = \\tan x$.', 4, 'Since $\\tan x$ repeats after $\\pi$, its period is $\\pi$.'),
  ar(T(1, 2), '$\\sin 2x = 2\\sin x\\cos x$.', '$\\sin(x + y) = \\sin x\\cos y + \\cos x\\sin y$.', 1, 'Putting $y = x$ gives the result.'),
  ar(T(1, 3), '$\\sin x + \\cos x$ can equal 2.', 'Both $\\sin x$ and $\\cos x$ can equal 1.', 4, 'They are never 1 at the same $x$; the greatest value of the sum is $\\sqrt{2}$.'),
];

export default questions;
