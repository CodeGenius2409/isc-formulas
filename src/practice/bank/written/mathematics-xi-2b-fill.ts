// Written by hand: quadratic equations and inequalities, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, plot, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('mathematics', 'XI');
const Q = at(2, 'b');

const questions: BankDef[] = [
  figure(Q(3, 1), 'Sketch the graph of $y = x^2 - 4x + 3$, marking where it cuts the axes and its lowest point, and say for which $x$ the expression is negative.', ['$x^2 - 4x + 3 = (x - 1)(x - 3)$, so it cuts the $x$-axis at 1 and 3, and the $y$-axis at 3.', 'Its lowest point is at $x = -\\dfrac{b}{2a} = 2$, where $y = -1$.', 'It is below the $x$-axis, so negative, for $1 < x < 3$.'], {
    answer: graph('x', 'y', [{ points: plot((x) => x * x - 4 * x + 3, -0.5, 4.5, 40) }], { x: [[1, '1'], [2, '2'], [3, '3']], y: [[-1, '−1'], [3, '3']] }),
  }),
  figure(Q(3, 2), 'The graph shows $y = ax^2 + bx + c$. Read off its roots and its greatest value, and say what the graph tells you about the sign of $a$ and of the discriminant.', ['The roots are $x = -1$ and $x = 3$, where the graph cuts the $x$-axis.', 'The greatest value is 4, at $x = 1$.', 'It opens downwards, so $a < 0$; it cuts the $x$-axis twice, so the discriminant is positive.'], {
    shown: graph('x', 'y', [{ points: plot((x) => -x * x + 2 * x + 3, -1, 3, 40) }], { x: [[-1, '−1'], [1, '1'], [3, '3']], y: [[4, '4']] }),
  }),
  figure(Q(3, 2), 'Solve $x^2 - x - 6 \\le 0$, and show the solution on a number line, with the sign of $x^2 - x - 6$ in each part.', ['$x^2 - x - 6 = (x - 3)(x + 2)$, which is zero at $x = -2$ and $x = 3$.', 'It is positive for $x < -2$ and for $x > 3$, and negative between.', 'So $-2 \\le x \\le 3$, a closed interval with both ends included.'], {
    // 0 at x = 140, 30 px to a unit.
    answer: sketch(320, 90, 'A number line from −4 to 5. Filled dots at −2 and 3 are joined by a thick segment, the solution. The parts are marked +, −, + from left to right.', [
      arrow([10, 50], [310, 50]), ...[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5].flatMap((k) => [line([[140 + 30 * k, 46], [140 + 30 * k, 54]]), label(140 + 30 * k, 72, k < 0 ? `−${-k}` : `${k}`)]),
      line([[80, 44], [230, 44]]), { t: 'dot', x: 80, y: 44 }, { t: 'dot', x: 230, y: 44 },
      label(45, 34, '+'), label(155, 34, '−'), label(275, 34, '+'),
    ]),
  }),

  predict(Q(2, 1), 'The discriminant of a quadratic equation is zero. Predict its roots, and how its graph meets the $x$-axis.', 'It has two equal real roots, $x = -\\dfrac{b}{2a}$.', 'Its graph just touches the $x$-axis at that point, its vertex.'),
  predict(Q(2, 2), 'In $ax^2 + bx + c = 0$, $a$ and $c$ have opposite signs. Predict the nature of the roots, and explain.', '$ac < 0$, so $b^2 - 4ac$ is $b^2$ plus a positive number, and is positive.', 'So the roots are real and different; their product $\\dfrac{c}{a}$ is negative, so one is positive and one negative.'),
  predict(Q(2, 2), 'The roots of $x^2 - 7x + k = 0$ are reciprocals of each other. Predict $k$.', 'If the roots are $\\alpha$ and $\\dfrac{1}{\\alpha}$, their product is 1.', 'The product of the roots is $k$, so $k = 1$.'),

  odd(Q(2, 1), ['$x^2 - 5x + 6$', '$x^2 - 4x + 4$', '$x^2 + 1$', '$x^2 - 1$'], '$x^2 + 1$', 'It has no real roots; each of the others has real roots.'),
  odd(Q(2, 1), ['$2x + 3 > 7$', '$x^2 - 4 < 0$', '$3x - 1 \\le 5$', '$5 - x \\ge 2$'], '$x^2 - 4 < 0$', 'It is a quadratic inequality; the others are linear.'),
  odd(Q(2, 2), ['$x^2 + 2x + 1 = 0$', '$4x^2 - 4x + 1 = 0$', '$x^2 - 6x + 9 = 0$', '$x^2 - 5x + 4 = 0$'], '$x^2 - 5x + 4 = 0$', 'Its roots, 1 and 4, are different; the others each have two equal roots.'),

  long(Q(6, 1), 'For the equation $2x^2 - 7x + 3 = 0$:\n(a) find its discriminant, and say what it tells you about the roots. [2]\n(b) Solve it. [2]\n(c) Check that the sum and product of the roots are $-\\dfrac{b}{a}$ and $\\dfrac{c}{a}$. [2]', '(a) $D = 49 - 24 = 25$.', '(a) $D > 0$ and is a perfect square, so the roots are real, different and rational.', '(b) $x = \\dfrac{7 \\pm 5}{4}$.', '(b) $x = 3$ or $x = \\dfrac{1}{2}$.', '(c) Sum $= 3 + \\dfrac{1}{2} = \\dfrac{7}{2} = -\\dfrac{b}{a}$.', '(c) Product $= \\dfrac{3}{2} = \\dfrac{c}{a}$.'),
  long(Q(6, 2), 'Solve each inequality for real $x$.\n(a) $3x - 5 < 2x + 1$ [1]\n(b) $x^2 - 5x + 6 > 0$ [2]\n(c) $\\dfrac{x - 1}{x + 2} \\ge 0$ [3]', '(a) $x < 6$.', '(b) $(x - 2)(x - 3) > 0$, which holds when both factors have the same sign.', '(b) So $x < 2$ or $x > 3$.', '(c) The fraction is zero at $x = 1$, and undefined at $x = -2$.', '(c) It is positive when $x < -2$ or $x > 1$, and negative between.', '(c) So $x < -2$ or $x \\ge 1$; $x = -2$ is left out.'),
  long(Q(6, 2), '$\\alpha$ and $\\beta$ are the roots of $x^2 - 3x + 1 = 0$.\n(a) Write $\\alpha + \\beta$ and $\\alpha\\beta$. [1]\n(b) Find $\\alpha^2 + \\beta^2$. [1]\n(c) Find $\\alpha^3 + \\beta^3$. [2]\n(d) Form the equation whose roots are $\\alpha^2$ and $\\beta^2$. [2]', '(a) $\\alpha + \\beta = 3$ and $\\alpha\\beta = 1$.', '(b) $(\\alpha + \\beta)^2 - 2\\alpha\\beta = 9 - 2 = 7$.', '(c) $\\alpha^3 + \\beta^3 = (\\alpha + \\beta)^3 - 3\\alpha\\beta(\\alpha + \\beta)$.', '(c) $= 27 - 9 = 18$.', '(d) The new roots have sum 7 and product $(\\alpha\\beta)^2 = 1$.', '(d) So the equation is $x^2 - 7x + 1 = 0$.'),

  tell(Q(2, 1), 'Distinguish between a quadratic equation and a quadratic inequality, with an example of each.', 'A quadratic equation, such as $x^2 - 4 = 0$, holds for at most two values of $x$, its roots.', 'A quadratic inequality, such as $x^2 - 4 < 0$, usually holds for a whole interval of values, here $-2 < x < 2$.'),
  tell(Q(2, 1), 'Distinguish between the roots of a real quadratic with $D > 0$ and with $D < 0$.', 'With $D > 0$ there are two different real roots, and the graph cuts the $x$-axis twice.', 'With $D < 0$ there are no real roots, but two complex conjugate ones, and the graph doesn’t meet the $x$-axis.'),
  tell(Q(2, 2), 'Distinguish between a quadratic function and a quadratic equation.', 'A quadratic function, $f(x) = ax^2 + bx + c$, gives a value for every $x$; its graph is a parabola.', 'A quadratic equation, $ax^2 + bx + c = 0$, asks for the $x$ where that value is zero: where the parabola meets the $x$-axis.'),

  match(Q(4, 1), [['$D > 0$', 'two different real roots'], ['$D = 0$', 'two equal real roots'], ['$D < 0$', 'two complex roots, no real ones'], ['$D$ a perfect square, with rational coefficients', 'rational roots']]),
  match(Q(4, 1), [['$x^2 - 5x + 6 = 0$', 'roots 2 and 3'], ['$x^2 - 9 = 0$', 'roots $\\pm 3$'], ['$x^2 + 4 = 0$', 'roots $\\pm 2i$'], ['$x^2 - 6x + 9 = 0$', 'the root 3, twice']]),
  match(Q(4, 2), [['$x^2 < 4$', '$-2 < x < 2$'], ['$x^2 > 4$', '$x < -2$ or $x > 2$'], ['$x^2 \\le 0$', '$x = 0$ only'], ['$x^2 + 1 > 0$', 'every real $x$']]),

  reason(Q(2, 1), 'Why can a quadratic equation have no more than two roots?', 'By the fundamental theorem of algebra, an equation of degree $n$ has exactly $n$ roots, counted with repeats.', 'A quadratic has degree 2, so it has two roots in all, real or complex.'),
  reason(Q(2, 2), 'Why do the complex roots of a quadratic with real coefficients always come in a conjugate pair?', 'When $D < 0$ the roots are $\\dfrac{-b \\pm i\\sqrt{-D}}{2a}$.', 'With $a$, $b$ and $D$ real, these differ only in the sign of the imaginary part, so they are conjugates.'),
  reason(Q(2, 1), 'Why must an inequality be reversed when both sides are multiplied by a negative number?', 'Multiplying by a negative number reverses the order of numbers on the line.', 'For example, $2 < 3$ but $-2 > -3$.'),

  short(Q(2, 1), 'Find the values of $k$ for which $x^2 + kx + 4 = 0$ has real roots.', 'Real roots need $D = k^2 - 16 \\ge 0$.', 'So $k \\le -4$ or $k \\ge 4$.'),
  short(Q(2, 1), 'Solve $2x^2 + 3x + 2 = 0$.', '$D = 9 - 16 = -7$, which is negative.', '$x = \\dfrac{-3 \\pm i\\sqrt{7}}{4}$.'),

  ar(Q(1, 1), '$x^2 + x + 1 > 0$ for every real $x$.', 'Its discriminant is negative, and its leading coefficient is positive.', 1, 'So its graph lies wholly above the $x$-axis.'),
  ar(Q(1, 1), 'The equation $x^2 - 2x + 3 = 0$ has real roots.', 'The sum of its roots is 2.', 4, 'Its discriminant is $4 - 12 = -8$, so it has no real roots.'),
  ar(Q(1, 2), 'Every quadratic with real coefficients has two roots, counting a repeated root twice.', 'The graph of a quadratic is a parabola.', 2, 'Both are true, but the number of roots comes from the fundamental theorem of algebra.'),

  derive(Q(3, 1), 'Derive the formula for the roots of $ax^2 + bx + c = 0$, $a \\neq 0$, by completing the square.', ['Dividing by $a$: $x^2 + \\dfrac{b}{a}x = -\\dfrac{c}{a}$.', 1], ['Adding $\\dfrac{b^2}{4a^2}$: $\\left(x + \\dfrac{b}{2a}\\right)^2 = \\dfrac{b^2 - 4ac}{4a^2}$.', 1], ['So $x + \\dfrac{b}{2a} = \\pm\\dfrac{\\sqrt{b^2 - 4ac}}{2a}$, and $x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.', 1]),
  derive(Q(3, 1), 'Show that the roots $\\alpha$ and $\\beta$ of $ax^2 + bx + c = 0$ have sum $-\\dfrac{b}{a}$ and product $\\dfrac{c}{a}$.', ['$\\alpha, \\beta = \\dfrac{-b \\pm \\sqrt{D}}{2a}$, with $D = b^2 - 4ac$.', 1], ['$\\alpha + \\beta = \\dfrac{-2b}{2a} = -\\dfrac{b}{a}$.', 1], ['$\\alpha\\beta = \\dfrac{b^2 - D}{4a^2} = \\dfrac{4ac}{4a^2} = \\dfrac{c}{a}$.', 1]),
  derive(Q(3, 2), 'Show that, for $a > 0$, $ax^2 + bx + c$ has its least value $\\dfrac{4ac - b^2}{4a}$, at $x = -\\dfrac{b}{2a}$.', ['$ax^2 + bx + c = a\\left(x + \\dfrac{b}{2a}\\right)^2 + c - \\dfrac{b^2}{4a}$.', 1], ['As $a > 0$, the squared term is never negative, and is zero only at $x = -\\dfrac{b}{2a}$.', 1], ['So the least value is $c - \\dfrac{b^2}{4a} = \\dfrac{4ac - b^2}{4a}$, at that $x$.', 1]),
];

export default questions;
