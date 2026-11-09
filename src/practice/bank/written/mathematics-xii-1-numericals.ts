// Written by hand: numericals on relations, functions and inverse trigonometry, for Mathematics XII at 0% generated. The answers are
// computed separately in tests/unit/written-answers.test.ts. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { theory } = bank('mathematics', 'XII');
const n = (place: Place, text: string, points: (string | [string, number])[]) => theory('short', place, text, points, { format: 'numerical' });
const F = (marks: number, d: 1 | 2 | 3): Place => [1, 'a', marks, d];
const T = (marks: number, d: 1 | 2 | 3): Place => [1, 'b', marks, d];

const questions: BankDef[] = [
  // ---- 1a Relations and functions
  n(F(1, 1), 'If $f(x) = 2x + 1$ and $g(x) = x^2$, find $(f \\circ g)(2)$.', ['$f(g(2)) = f(4) = 9$.']),
  n(F(1, 2), 'How many reflexive relations are there on a set of 3 elements?', ['$2^{n^2 - n}$ with $n = 3$ gives $64$.']),
  n(F(2, 1), 'If $f(x) = 3x - 4$, find $f^{-1}(5)$.', ['$f^{-1}(y) = \\frac{y + 4}{3}$.', 'So $f^{-1}(5) = 3$.']),
  n(F(2, 1), 'If $f(x) = x^2 + 1$ and $g(x) = 2x - 3$, find $(g \\circ f)(2) + (f \\circ g)(2)$.', ['$g(f(2)) = g(5) = 7$, and $f(g(2)) = f(1) = 2$.', 'The sum is $9$.']),
  n(F(2, 2), 'How many one-one functions are there from a set of 3 elements to a set of 5 elements?', ['The first element has 5 images, the next 4, and the last 3.', '$5 \\times 4 \\times 3 = 60$.']),
  n(F(3, 2), 'If $f(x) = \\frac{2x + 3}{x - 1}$, $x \\ne 1$, find $f^{-1}$, and hence $f^{-1}(3)$.', ['Let $y = \\frac{2x + 3}{x - 1}$, so $x(y - 2) = y + 3$.', '$f^{-1}(y) = \\frac{y + 3}{y - 2}$.', 'So $f^{-1}(3) = 6$.']),
  n(F(3, 2), 'On $A = \\{1, 2, \\dots, 7\\}$, $R = \\{(a, b) : a + b = 8\\}$. List $R$, say whether it is symmetric, and give the number of pairs in it.', ['$R = \\{(1, 7), (2, 6), (3, 5), (4, 4), (5, 3), (6, 2), (7, 1)\\}$.', 'It is symmetric, as $a + b = b + a$.', 'It has $7$ pairs.']),
  n(F(3, 3), 'How many functions from $\\{1, 2, 3\\}$ to $\\{a, b\\}$ are onto? Explain.', ['There are $2^3 = 8$ functions in all.', 'Two of them send everything to one element, and aren’t onto.', 'So $6$ are onto.']),
  n(F(5, 3), 'Let $f(x) = 2x - 1$ and $g(x) = x^2 + 2$ on the real numbers. (i) Find $f \\circ g$. (ii) Find $g \\circ f$. (iii) Solve $(f \\circ g)(x) = (g \\circ f)(x)$. (iv) Find $f^{-1}$, and hence $f^{-1}(7)$.', ['(i) $(f \\circ g)(x) = 2x^2 + 3$.', '(ii) $(g \\circ f)(x) = 4x^2 - 4x + 3$.', '(iii) $2x^2 - 4x = 0$, so $x = 0$ or $x = 2$.', '(iv) $f^{-1}(y) = \\frac{y + 1}{2}$.', 'So $f^{-1}(7) = 4$.']),
  n(F(5, 2), 'A function $f : \\{1, 2, 3, 4\\} \\to \\{1, 2, 3, 4\\}$ is one-one. (i) How many such functions are there? (ii) How many have $f(1) = 1$? (iii) How many have $f(1) = 1$ and $f(2) = 2$? (iv) What fraction of all of them have $f(1) = 1$?', ['(i) $4! = 24$.', '(ii) The other three can be arranged in $3! = 6$ ways.', '(iii) The other two can be arranged in $2$ ways.', '(iv) The fraction is $\\frac{6}{24}$.', 'This is $\\frac{1}{4}$.']),
  // ---- 1b Inverse trigonometric functions
  n(T(1, 1), 'Find the principal value of $\\tan^{-1}(1)$.', ['$\\frac{\\pi}{4}$.']),
  n(T(1, 1), 'Find the value of $\\sin^{-1}\\frac{1}{2} + \\cos^{-1}\\frac{1}{2}$.', ['It is $\\frac{\\pi}{2}$.']),
  n(T(1, 2), 'Find the principal value of $\\cos^{-1}\\left(-\\frac{1}{2}\\right)$.', ['$\\frac{2\\pi}{3}$.']),
  n(T(2, 1), 'Find the value of $\\sin\\left(\\cos^{-1}\\frac{3}{5}\\right)$.', ['Let $\\theta = \\cos^{-1}\\frac{3}{5}$, so $\\cos\\theta = \\frac{3}{5}$.', 'Then $\\sin\\theta = \\frac{4}{5}$.']),
  n(T(2, 1), 'Find the value of $\\cos\\left(\\tan^{-1}\\frac{3}{4}\\right)$.', ['Let $\\tan\\theta = \\frac{3}{4}$: the sides are 3 and 4, and the hypotenuse is 5.', 'So $\\cos\\theta = \\frac{4}{5}$.']),
  n(T(2, 2), 'Find the value of $\\tan^{-1}\\frac{1}{2} + \\tan^{-1}\\frac{1}{3}$.', ['$\\tan$ of the sum is $\\frac{\\frac{1}{2} + \\frac{1}{3}}{1 - \\frac{1}{6}} = 1$.', 'So the sum is $\\frac{\\pi}{4}$.']),
  n(T(3, 2), 'Solve $2\\tan^{-1}x = \\tan^{-1}\\frac{3}{4}$.', ['$\\frac{2x}{1 - x^2} = \\frac{3}{4}$, so $3x^2 + 8x - 3 = 0$.', '$x = \\frac{1}{3}$ or $x = -3$.', 'The value $-3$ makes the left side negative, so $x = \\frac{1}{3}$.']),
  n(T(3, 2), 'Find $\\sin\\left(\\sin^{-1}\\frac{3}{5} + \\cos^{-1}\\frac{12}{13}\\right)$.', ['Let the angles be $A$ and $B$: $\\cos A = \\frac{4}{5}$ and $\\sin B = \\frac{5}{13}$.', '$\\sin(A + B) = \\frac{3}{5} \\cdot \\frac{12}{13} + \\frac{4}{5} \\cdot \\frac{5}{13}$.', 'This is $\\frac{56}{65}$.']),
  n(T(3, 2), 'Find the value of $\\cos\\left(2\\sin^{-1}\\frac{1}{3}\\right)$.', ['Let $\\theta = \\sin^{-1}\\frac{1}{3}$.', '$\\cos 2\\theta = 1 - 2\\sin^2\\theta$.', 'This is $1 - \\frac{2}{9} = \\frac{7}{9}$.']),
  n(T(5, 3), 'Solve $\\tan^{-1}(2x) + \\tan^{-1}(3x) = \\frac{\\pi}{4}$, and say which root you reject and why.', ['Take the tangent of both sides: $\\frac{2x + 3x}{1 - 6x^2} = 1$.', 'So $6x^2 + 5x - 1 = 0$.', 'This gives $(6x - 1)(x + 1) = 0$, so $x = \\frac{1}{6}$ or $x = -1$.', 'At $x = -1$, both inverse tangents are negative, and their sum can’t be $\\frac{\\pi}{4}$, so it is rejected.', 'So $x = \\frac{1}{6}$.']),
];

export default questions;
