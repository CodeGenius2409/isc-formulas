// Written by hand: numericals on limits and derivatives, for Mathematics XI at 0% generated. The answers are computed separately in
// tests/unit/written-answers.test.ts. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { theory } = bank('mathematics', 'XI');
const n = (place: Place, text: string, points: (string | [string, number])[]) => theory('short', place, text, points, { format: 'numerical' });
const L = (marks: number, d: 1 | 2 | 3): Place => [4, 'a', marks, d];

const questions: BankDef[] = [
  n(L(1, 1), 'Evaluate $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$.', ['It simplifies to $x + 2$, so the limit is $4$.']),
  n(L(1, 1), 'Evaluate $\\lim_{x \\to 0} \\frac{\\sin 3x}{x}$.', ['$3 \\times \\frac{\\sin 3x}{3x}$, so the limit is $3$.']),
  n(L(2, 1), 'Evaluate $\\lim_{x \\to 1} \\frac{x^3 - 1}{x - 1}$.', ['It simplifies to $x^2 + x + 1$.', 'The limit is $3$.']),
  n(L(2, 2), 'Evaluate $\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2}$.', ['$1 - \\cos x = 2\\sin^2\\frac{x}{2}$, so this is $\\frac{1}{2}\\left(\\frac{\\sin(x/2)}{x/2}\\right)^2$.', 'The limit is $\\frac{1}{2}$.']),
  n(L(2, 1), 'If $y = 3x^2 - 2x$, find $\\frac{dy}{dx}$ at $x = 1$.', ['$\\frac{dy}{dx} = 6x - 2$.', 'At $x = 1$ it is $4$.']),
  n(L(3, 2), 'Find the derivative of $x^2$ at $x = 3$, from first principles.', ['$\\lim_{h \\to 0} \\frac{(3 + h)^2 - 9}{h}$.', '$= \\lim_{h \\to 0} (6 + h)$.', 'This is $6$.']),
  n(L(3, 2), 'Evaluate $\\lim_{x \\to \\infty} \\frac{2x^2 + 1}{x^2 + 3}$.', ['Divide the top and bottom by $x^2$.', '$\\frac{2 + 1/x^2}{1 + 3/x^2}$.', 'The limit is $2$.']),
  n(L(3, 1), 'If $f(x) = x\\sin x$, find $f\'\\left(\\frac{\\pi}{2}\\right)$.', ['By the product rule, $f\'(x) = \\sin x + x\\cos x$.', 'At $\\frac{\\pi}{2}$, the cosine term is zero.', 'So the value is $1$.']),
  n(L(5, 3), 'Find $k$ so that $\\lim_{x \\to 2} f(x)$ exists, where $f(x) = kx + 1$ for $x < 2$, and $f(x) = x^2 - 1$ for $x \\ge 2$. Then find the slope of $f$ just to the right of $x = 2$.', ['The right-hand limit is $4 - 1 = 3$.', 'The left-hand limit is $2k + 1$.', 'So $2k + 1 = 3$, and $k = 1$.', 'To the right, $f\'(x) = 2x$.', 'At $x = 2$, the slope is $4$.']),
  n(L(5, 2), 'A stone’s height is $h = 20t - 5t^2$ metres after $t$ seconds. (i) Find its speed at time $t$. (ii) Find its speed at $t = 1$. (iii) When does it stop rising? (iv) Find its greatest height.', ['(i) $\\frac{dh}{dt} = 20 - 10t$.', '(ii) $10$ m/s.', '(iii) $20 - 10t = 0$, at $t = 2$.', '(iv) $h = 40 - 20$.', 'The greatest height is $20$ m.']),
];

export default questions;
