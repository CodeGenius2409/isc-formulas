// Written by hand: limits and derivatives, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, plot, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, reason, ar } = kit('mathematics', 'XI');
const D = at(4, 'a');

// y = x² with the origin at (40, 210), 60 px to a unit across and 40 px up.
const parabola = `M${plot((x) => x * x, 0, 2.2, 22).map(([x, y]) => `${Math.round((40 + 60 * x) * 10) / 10} ${Math.round((210 - 40 * y) * 10) / 10}`).join(' L')}`;

const questions: BankDef[] = [
  figure(D(3, 2), 'On the curve $y = x^2$, $P$ is the point $(1, 1)$ and $Q$ the point $(1 + h, (1 + h)^2)$. Sketch the curve with the line $PQ$ and the tangent at $P$, find the slope of $PQ$, and say what it tends to as $Q$ moves to $P$.', ['The slope of $PQ$ is $\\dfrac{(1 + h)^2 - 1}{h} = \\dfrac{2h + h^2}{h} = 2 + h$; for $Q(2, 4)$, with $h = 1$, it is 3.', 'As $Q$ moves along the curve to $P$, $h \\to 0$, and the slope tends to 2.', 'So the slope of the tangent at $P$ is 2, which is the derivative of $x^2$ at $x = 1$.'], {
    answer: sketch(300, 230, 'Axes with the curve y = x² rising from the origin. P is at (1, 1) and Q at (2, 4) on the curve. A straight line through P and Q is the secant. A less steep line touching the curve at P is the tangent.', [
      arrow([40, 210], [270, 210]), arrow([40, 220], [40, 10]), label(266, 226, 'x', 'end'), label(32, 18, 'y', 'end'),
      { t: 'path', d: parabola }, line([[80, 210], [175, 20]]), line([[70, 210], [180, 63.3]], { dash: 1 }),
      { t: 'dot', x: 100, y: 170 }, { t: 'dot', x: 160, y: 50 }, label(92, 168, 'P(1, 1)', 'end'), label(152, 46, 'Q(2, 4)', 'end'),
      label(182, 24, 'secant PQ', 'start'), label(188, 72, 'tangent at P', 'start'),
    ]),
  }),
  figure(D(3, 2), 'The graph shows a function $f$ near $x = 1$. Find its left-hand and right-hand limits at $x = 1$, and say whether $\\lim_{x \\to 1} f(x)$ exists.', ['As $x \\to 1$ from the left, $f(x) \\to 2$; from the right, $f(x) \\to 3$.', 'The two one-sided limits are different.', 'So $\\lim_{x \\to 1} f(x)$ doesn’t exist, even though $f(1) = 3$ is defined.'], {
    // Origin (60, 200), 40 px to a unit across and 30 px up.
    shown: sketch(240, 230, 'Axes. A straight line rises from (−1, 0) to an open circle at (1, 2). Another straight line starts at a filled dot at (1, 3) and rises to the right. Marks on the y-axis show 2 and 3, and on the x-axis 1.', [
      arrow([10, 200], [230, 200]), arrow([60, 220], [60, 10]), label(226, 216, 'x', 'end'), label(52, 18, 'y', 'end'),
      line([[20, 200], [97, 142]]), { t: 'circle', x: 100, y: 140, r: 3 }, line([[100, 110], [180, 50]]), { t: 'dot', x: 100, y: 110 },
      line([[60, 140], [96, 140]], { dash: 1 }), line([[60, 110], [100, 110]], { dash: 1 }), line([[100, 200], [100, 143]], { dash: 1 }),
      label(52, 144, '2', 'end'), label(52, 114, '3', 'end'), label(100, 216, '1'),
    ]),
  }),
  figure(D(3, 1), 'The graph shows the distance $s = t^2$ metres travelled by a body in $t$ seconds. Find its average speed from $t = 1$ to $t = 3$, and its speed at $t = 2$ and at $t = 3$.', ['Average speed $= \\dfrac{9 - 1}{3 - 1} = 4$ m/s, the slope of the chord.', 'The speed at time $t$ is $\\dfrac{ds}{dt} = 2t$, so it is 4 m/s at $t = 2$.', 'At $t = 3$ it is 6 m/s: the speed grows, so the graph gets steeper.'], {
    shown: graph('time t (s)', 'distance s (m)', [{ points: plot((t) => t * t, 0, 4, 40) }], { x: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], y: [[1, '1'], [4, '4'], [9, '9'], [16, '16']] }),
  }),

  predict(D(2, 2), 'Predict $\\lim_{x \\to 0} \\dfrac{\\sin 5x}{\\sin 2x}$, and explain.', 'For small $x$, $\\sin 5x \\approx 5x$ and $\\sin 2x \\approx 2x$.', 'So the limit is $\\dfrac{5x}{2x} = \\dfrac{5}{2}$; exactly, $\\dfrac{\\sin 5x}{5x} \\cdot \\dfrac{2x}{\\sin 2x} \\cdot \\dfrac{5}{2} \\to \\dfrac{5}{2}$.'),
  predict(D(2, 1), 'Predict the derivative of $f(x) = 7$, and what its graph’s tangent looks like.', 'The derivative is 0, as $f$ doesn’t change.', 'The graph is the horizontal line $y = 7$, which is its own tangent everywhere, of slope 0.'),
  predict(D(2, 1), 'Predict $\\lim_{x \\to \\infty} \\dfrac{3x + 1}{x - 2}$, and explain.', 'Dividing the top and bottom by $x$ gives $\\dfrac{3 + \\frac{1}{x}}{1 - \\frac{2}{x}}$.', 'As $x \\to \\infty$, $\\dfrac{1}{x}$ and $\\dfrac{2}{x}$ tend to 0, so the limit is 3.'),

  odd(D(2, 2), ['$\\lim_{x \\to 0}\\dfrac{\\sin x}{x}$', '$\\lim_{x \\to 0}\\dfrac{\\tan x}{x}$', '$\\lim_{x \\to 0}\\dfrac{e^x - 1}{x}$', '$\\lim_{x \\to 0}\\dfrac{1 - \\cos x}{x}$'], '$\\lim_{x \\to 0}\\dfrac{1 - \\cos x}{x}$', 'It is 0; the other three are all 1.'),
  odd(D(2, 1), ['$\\dfrac{d}{dx}(x^2)$ at $x = 1$', '$\\dfrac{d}{dx}(2x + 5)$', '$\\dfrac{d}{dx}(\\sin x)$ at $x = 0$', '$\\dfrac{d}{dx}(x^2 + 1)$ at $x = 1$'], '$\\dfrac{d}{dx}(\\sin x)$ at $x = 0$', 'It is 1; the other three are all 2.'),
  odd(D(2, 2), ['$\\lim_{x \\to 2}(x^2 + 1)$', '$\\lim_{x \\to 1}\\dfrac{x^2 - 1}{x - 1}$', '$\\lim_{x \\to 0}\\dfrac{|x|}{x}$', '$\\lim_{x \\to 3}(2x - 1)$'], '$\\lim_{x \\to 0}\\dfrac{|x|}{x}$', 'It doesn’t exist, as the left and right limits are $-1$ and 1; the others exist.'),

  long(D(6, 2), 'Evaluate each limit.\n(a) $\\lim_{x \\to 0}\\dfrac{1 - \\cos 2x}{x^2}$ [2]\n(b) $\\lim_{x \\to 3}\\dfrac{x^2 - 9}{x^2 - 5x + 6}$ [2]\n(c) $\\lim_{x \\to 0}\\dfrac{\\sqrt{1 + x} - 1}{x}$ [2]', '(a) $1 - \\cos 2x = 2\\sin^2 x$, so the expression is $2\\left(\\dfrac{\\sin x}{x}\\right)^2$.', '(a) The limit is $2 \\times 1^2 = 2$.', '(b) $\\dfrac{(x - 3)(x + 3)}{(x - 3)(x - 2)} = \\dfrac{x + 3}{x - 2}$ for $x \\neq 3$.', '(b) The limit is $\\dfrac{6}{1} = 6$.', '(c) Multiplying top and bottom by $\\sqrt{1 + x} + 1$ gives $\\dfrac{x}{x(\\sqrt{1 + x} + 1)} = \\dfrac{1}{\\sqrt{1 + x} + 1}$.', '(c) The limit is $\\dfrac{1}{2}$.'),
  long(D(6, 2), 'Differentiate with respect to $x$.\n(a) $(x^2 + 1)(x - 3)$, by the product rule [2]\n(b) $\\dfrac{\\sin x}{x}$, by the quotient rule [2]\n(c) $x^3 - \\dfrac{4}{x} + 7$ [1]\n(d) $\\cot x$ [1]', '(a) $2x(x - 3) + (x^2 + 1) \\times 1$.', '(a) $= 3x^2 - 6x + 1$.', '(b) $\\dfrac{x\\cos x - \\sin x \\times 1}{x^2}$.', '(b) $= \\dfrac{x\\cos x - \\sin x}{x^2}$.', '(c) $3x^2 + \\dfrac{4}{x^2}$.', '(d) $-\\operatorname{cosec}^2 x$.'),

  tell(D(2, 1), 'Distinguish between the left-hand and right-hand limits of $f$ at $x = a$.', 'The left-hand limit is the value $f(x)$ approaches as $x$ comes to $a$ from below, $x < a$.', 'The right-hand limit is the value it approaches as $x$ comes to $a$ from above; the limit exists only when the two are equal.'),
  tell(D(2, 2), 'Distinguish between the value of a function at $x = a$ and its limit as $x \\to a$, using $\\dfrac{x^2 - 1}{x - 1}$ at $a = 1$.', 'The value at $a$ is $f(a)$ itself; here $f(1)$ is $\\dfrac{0}{0}$, not defined.', 'The limit depends only on values near $a$; here it is 2, as the function equals $x + 1$ for $x \\neq 1$.'),
  tell(D(2, 1), 'Distinguish between the average rate of change and the instantaneous rate of change of $f$.', 'The average rate over $[a, a + h]$ is $\\dfrac{f(a + h) - f(a)}{h}$, the slope of a chord.', 'The instantaneous rate at $a$ is the limit of this as $h \\to 0$, $f\'(a)$, the slope of the tangent.'),

  match(D(4, 1), [['$x^n$', '$nx^{n-1}$'], ['$\\sin x$', '$\\cos x$'], ['$\\cos x$', '$-\\sin x$'], ['$\\tan x$', '$\\sec^2 x$']]),
  match(D(4, 2), [['$\\lim_{x \\to 0}\\dfrac{\\sin x}{x}$', '1'], ['$\\lim_{x \\to 0}\\dfrac{a^x - 1}{x}$', '$\\log_e a$'], ['$\\lim_{x \\to a}\\dfrac{x^n - a^n}{x - a}$', '$na^{n-1}$'], ['$\\lim_{x \\to 0}(1 + x)^{1/x}$', '$e$']]),
  match(D(4, 1), [["$(u + v)'$", "$u' + v'$"], ["$(uv)'$", "$u'v + uv'$"], ["$\\left(\\dfrac{u}{v}\\right)'$", "$\\dfrac{u'v - uv'}{v^2}$"], ["$(cu)'$, $c$ a constant", "$cu'$"]]),

  reason(D(2, 1), 'Why is the derivative of $f$ at $x = a$ the slope of the tangent to its graph there?', '$\\dfrac{f(a + h) - f(a)}{h}$ is the slope of the chord from $x = a$ to $x = a + h$.', 'As $h \\to 0$ the chord turns into the tangent, so the limit, $f\'(a)$, is the tangent’s slope.'),
  reason(D(2, 2), 'Why must $x$ be in radians for $\\dfrac{d}{dx}(\\sin x) = \\cos x$ to hold?', 'The proof uses $\\lim_{h \\to 0}\\dfrac{\\sin h}{h} = 1$.', 'That limit is 1 only when $h$ is in radians; in degrees it is $\\dfrac{\\pi}{180}$.'),
  reason(D(2, 1), 'Why doesn’t $\\lim_{x \\to 0}\\dfrac{|x|}{x}$ exist?', 'For $x > 0$ the fraction is 1, and for $x < 0$ it is $-1$.', 'So the right-hand limit is 1 and the left-hand limit $-1$; they differ.'),

  ar(D(1, 1), 'The derivative of $x^2$ at $x = 3$ is 6.', 'The derivative of $x^n$ is $nx^{n-1}$.', 1, 'With $n = 2$, the derivative is $2x$, which is 6 at $x = 3$.'),
  ar(D(1, 2), '$\\lim_{x \\to 1}\\dfrac{x^2 - 1}{x - 1}$ can be found by putting $x = 1$.', 'A limit depends on the values near the point, not on the value at it.', 4, 'Putting $x = 1$ gives $\\dfrac{0}{0}$; the limit, 2, comes from cancelling $x - 1$ first.'),
];

export default questions;
