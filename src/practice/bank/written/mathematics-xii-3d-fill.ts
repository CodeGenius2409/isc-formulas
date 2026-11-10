// Written by hand: application of integrals, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, plot, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('mathematics', 'XII');
const R = at(3, 'd');

// y = x² from 0 to 2, origin at (40, 170): 100 px to a unit across, 40 px up.
const parabola = plot((x) => x * x, 0, 2, 20).map(([x, y]): [number, number] => [40 + 100 * x, 170 - 40 * y]);

const questions: BankDef[] = [
  figure(R(3, 1), 'Sketch the region bounded by $y = x^2$, the x-axis and the line $x = 2$, shade it, and find its area.', ['The region lies under the parabola, above the x-axis, between $x = 0$ and $x = 2$, and is shaded.', 'Area $= \\int_0^2 x^2\\,dx = \\left[\\dfrac{x^3}{3}\\right]_0^2$.', '$= \\dfrac{8}{3}$ square units.'], {
    answer: sketch(300, 195, 'Axes with the origin at the lower left. The parabola y = x² rises from the origin to the point (2, 4). A vertical line x = 2 runs down from that point to the x-axis. The region under the curve, between x = 0 and x = 2, is shaded.', [
      { t: 'shade', p: [...parabola, [240, 170]] },
      arrow([40, 170], [290, 170]), arrow([40, 170], [40, 5]), line(parabola), line([[240, 170], [240, 10]]),
      label(290, 186, 'x', 'end'), label(48, 12, 'y', 'start'), label(34, 186, 'O', 'end'), label(240, 186, 'x = 2'), label(190, 60, 'y = x²', 'end'),
    ]),
  }),
  figure(R(3, 2), 'The figure shows the curves $y = \\sqrt{x}$ and $y = x$. Find where they meet, say which is above between those points, and find the area enclosed.', ['They meet where $\\sqrt{x} = x$, at $x = 0$ and $x = 1$.', 'For $0 < x < 1$, $\\sqrt{x} > x$, so $y = \\sqrt{x}$ is above.', 'Area $= \\int_0^1 (\\sqrt{x} - x)\\,dx = \\dfrac{2}{3} - \\dfrac{1}{2} = \\dfrac{1}{6}$ square units.'], {
    shown: graph('x', 'y', [{ label: 'y = √x', points: plot((x) => Math.sqrt(x), 0, 1.6, 32) }, { label: 'y = x', points: [[0, 0], [1.2, 1.2]] }], { x: [[1, '1']], y: [[1, '1']] }),
  }),
  figure(R(2, 2), 'Sketch the region whose area is $\\int_{-1}^{2} |x|\\,dx$, and find the area.', ['The region under the V of $y = |x|$ from $x = -1$ to $x = 2$: two triangles, shaded.', 'Area $= \\dfrac{1}{2} \\times 1 \\times 1 + \\dfrac{1}{2} \\times 2 \\times 2 = \\dfrac{5}{2}$ square units.'], {
    // Origin at (110, 150), 50 px to a unit.
    answer: sketch(300, 195, 'The V-shaped graph of y = |x| with its corner at the origin. The region under it is shaded from x = −1 to x = 2: a small triangle on the left of the y-axis and a larger one on the right.', [
      { t: 'shade', p: [[60, 150], [60, 100], [110, 150], [210, 50], [210, 150]] },
      arrow([20, 150], [290, 150]), arrow([110, 190], [110, 12]), line([[40, 80], [110, 150], [250, 10]]),
      line([[60, 150], [60, 100]]), line([[210, 150], [210, 50]]),
      label(60, 166, '−1'), label(210, 166, '2'), label(222, 30, 'y = |x|', 'end'), label(286, 166, 'x', 'end'), label(118, 16, 'y', 'start'),
    ]),
  }),

  predict(R(2, 2), 'Without working it out, predict whether $\\int_0^{2\\pi} \\sin x\\,dx$ gives the area between $y = \\sin x$ and the x-axis from $0$ to $2\\pi$.', 'No: the integral is 0, as the part from $\\pi$ to $2\\pi$ is below the axis and cancels the part above.', 'The area is $2 + 2 = 4$ square units, found by adding the size of each part.'),
  predict(R(2, 1), 'The curve $y = f(x)$ is replaced by $y = 3f(x)$, with $f(x) \\ge 0$. Predict how the area under it between $x = a$ and $x = b$ changes.', '$\\int_a^b 3f(x)\\,dx = 3\\int_a^b f(x)\\,dx$.', 'So the area is three times as large.'),
  predict(R(2, 2), 'Without integrating, predict which is larger: the area under $y = x^2$ or under $y = x^3$, from $x = 0$ to $x = 1$.', 'For $0 < x < 1$, $x^3 < x^2$, so the curve $y = x^3$ is lower.', 'So the area under $y = x^2$ is larger: $\\dfrac{1}{3}$ against $\\dfrac{1}{4}$.'),

  odd(R(2, 2), ['$\\int_0^2 x\\,dx$', '$\\int_0^1 4x\\,dx$', '$\\int_0^{\\pi} \\sin x\\,dx$', '$\\int_0^1 3x^2\\,dx$'], '$\\int_0^1 3x^2\\,dx$', 'It equals 1; the other three are each 2.'),
  odd(R(2, 2), ['$y = x$', '$y = 1 - x$', '$y = \\dfrac{1}{2}$', '$y = x^2$'], '$y = x^2$', 'The area under it from $x = 0$ to $x = 1$ is $\\dfrac{1}{3}$; under each of the others it is $\\dfrac{1}{2}$.'),
  odd(R(2, 1), ['the area between a curve and the x-axis', 'the area between two curves', 'the area between a curve and the y-axis', 'the volume of a solid of revolution'], 'the volume of a solid of revolution', 'It is a volume, not an area, and is not in this part of the course; the others are all areas found by integration.'),

  long(R(6, 2), 'Answer each part on the region enclosed by $y = x^2$ and the line $y = 4$.\n(a) Sketch the region and find where the curve and the line meet. [2]\n(b) Write its area as an integral using vertical strips, using symmetry. [2]\n(c) Evaluate it. [1]\n(d) Check the answer using horizontal strips. [1]', '(a) The region lies between the parabola and the line above it, symmetric about the y-axis.', '(a) $x^2 = 4$ gives $x = \\pm 2$, so they meet at $(-2, 4)$ and $(2, 4)$.', '(b) Area $= 2\\int_0^2 (4 - x^2)\\,dx$.', '(b) The line is above the curve throughout, so it is (upper − lower).', '(c) $2\\left[4x - \\dfrac{x^3}{3}\\right]_0^2 = 2\\left(8 - \\dfrac{8}{3}\\right) = \\dfrac{32}{3}$.', '(d) $\\int_0^4 2\\sqrt{y}\\,dy = 2 \\cdot \\dfrac{2}{3} \\cdot 8 = \\dfrac{32}{3}$, the same.'),
  long(R(6, 3), 'Answer each part on the region between $y = \\sin x$ and $y = \\cos x$ from $x = 0$ to $x = \\dfrac{\\pi}{2}$.\n(a) Where do the curves meet in this interval? [1]\n(b) Which curve is above on each side of that point? [1]\n(c) Write the area as a sum of two integrals. [2]\n(d) Evaluate it. [2]', '(a) $\\sin x = \\cos x$ at $x = \\dfrac{\\pi}{4}$.', '(b) $\\cos x$ is above from $0$ to $\\dfrac{\\pi}{4}$, and $\\sin x$ from $\\dfrac{\\pi}{4}$ to $\\dfrac{\\pi}{2}$.', '(c) $\\int_0^{\\pi/4} (\\cos x - \\sin x)\\,dx$', '(c) $+ \\int_{\\pi/4}^{\\pi/2} (\\sin x - \\cos x)\\,dx$.', '(d) $= [\\sin x + \\cos x]_0^{\\pi/4} + [-\\cos x - \\sin x]_{\\pi/4}^{\\pi/2} = (\\sqrt{2} - 1) + (\\sqrt{2} - 1)$.', '(d) $= 2\\sqrt{2} - 2$ square units.'),

  tell(R(2, 1), 'Distinguish between a definite integral and the area it is used to find.', 'A definite integral can be negative, or zero, when the curve lies below the x-axis in part of the interval.', 'An area is never negative: the size of each part is taken, with a modulus, and the parts are added.'),
  tell(R(2, 2), 'Distinguish between finding an area with vertical strips and with horizontal strips.', 'Vertical strips integrate $y\\,dx$, with limits on $x$.', 'Horizontal strips integrate $x\\,dy$, with limits on $y$, which suits a curve written as $x = g(y)$.'),
  tell(R(2, 1), 'Distinguish between the area under a curve and the area between two curves.', 'The area under $y = f(x) \\ge 0$ from $a$ to $b$ is $\\int_a^b f(x)\\,dx$, down to the x-axis.', 'The area between $y = f(x)$ and $y = g(x)$, with $f \\ge g$, is $\\int_a^b (f(x) - g(x))\\,dx$, upper minus lower.'),

  match(R(4, 2), [['Under $y = x$ from 0 to 2', '$2$'], ['Under $y = x^2$ from 0 to 1', '$\\dfrac{1}{3}$'], ['Under $y = \\dfrac{1}{x}$ from 1 to $e$', '$1$'], ['Under $y = \\sqrt{x}$ from 0 to 4', '$\\dfrac{16}{3}$']]),
  match(R(4, 1), [['A circle of radius $a$', '$\\pi a^2$'], ['An ellipse with semi-axes $a$ and $b$', '$\\pi ab$'], ['$y^2 = 4ax$ cut off by $x = a$', '$\\dfrac{8a^2}{3}$'], ['A triangle of base $b$ and height $h$', '$\\dfrac{1}{2}bh$']]),
  match(R(4, 2), [['$\\int_a^b f(x)\\,dx$, with $f \\ge 0$', 'the area between the curve and the x-axis'], ['$\\int_c^d g(y)\\,dy$, with $g \\ge 0$', 'the area between the curve $x = g(y)$ and the y-axis'], ['$\\int_a^b (f(x) - g(x))\\,dx$, with $f \\ge g$', 'the area between two curves'], ['$\\left|\\int_a^b f(x)\\,dx\\right|$, with $f \\le 0$', 'the area of a region below the x-axis']]),

  reason(R(2, 1), 'Why is the modulus taken when part of a region lies below the x-axis?', 'There $f(x) < 0$, so the integral over that part is negative.', 'An area is positive, so its size is taken before adding it to the rest.'),
  reason(R(2, 2), 'Why is it often easier to find the area between $y^2 = 4x$ and the y-axis with horizontal strips?', 'The curve is easily written as $x = \\dfrac{y^2}{4}$, a single function of $y$.', 'With vertical strips it would need two branches, $y = \\pm 2\\sqrt{x}$, and the limits would be harder.'),
  reason(R(2, 2), 'Why is $\\int_{-1}^{1} x^3\\,dx = 0$, though $y = x^3$ and the x-axis enclose a region between $x = -1$ and $x = 1$?', '$x^3$ is an odd function, so the part from $-1$ to $0$ is below the axis and exactly cancels the part from $0$ to $1$.', 'The area is $2 \\times \\dfrac{1}{4} = \\dfrac{1}{2}$, adding the sizes of the two parts.'),

  short(R(2, 1), 'Find the area bounded by $y = e^x$, the x-axis and the lines $x = 0$ and $x = 1$.', 'Area $= \\int_0^1 e^x\\,dx = [e^x]_0^1$.', '$= e - 1$ square units.'),
  short(R(2, 2), 'Find the area bounded by the curve $x = y^2$, the y-axis and the lines $y = 0$ and $y = 2$.', 'With horizontal strips, area $= \\int_0^2 y^2\\,dy$.', '$= \\left[\\dfrac{y^3}{3}\\right]_0^2 = \\dfrac{8}{3}$ square units.'),

  ar(R(1, 2), 'The area between $y = \\sin x$ and the x-axis from $0$ to $2\\pi$ is 4 square units.', '$\\int_0^{2\\pi} \\sin x\\,dx = 0$.', 2, 'Both are true, but the area comes from adding the sizes of the two parts, 2 each, not from the integral.'),
  ar(R(1, 2), 'The area bounded by $y = x^3$, the x-axis and the lines $x = -1$ and $x = 1$ is 0.', '$x^3$ is an odd function.', 4, 'The area is $\\dfrac{1}{2}$; only the integral is 0, as the two parts cancel.'),
  ar(R(1, 2), 'The area enclosed by $\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$ is $\\pi ab$.', 'An ellipse is symmetric about both axes only when $a = b$.', 3, 'Every such ellipse is symmetric about both axes, which is why its area is four times that of one quadrant.'),

  derive(R(3, 3), 'Prove that the area enclosed by the parabolas $y^2 = 4ax$ and $x^2 = 4ay$, $a > 0$, is $\\dfrac{16a^2}{3}$.', ['They meet where $\\left(\\dfrac{x^2}{4a}\\right)^2 = 4ax$, at $x = 0$ and $x = 4a$; between them $y = 2\\sqrt{ax}$ is above.', 1], ['Area $= \\int_0^{4a} \\left(2\\sqrt{a}\\,x^{1/2} - \\dfrac{x^2}{4a}\\right)dx = \\left[\\dfrac{4\\sqrt{a}}{3}x^{3/2} - \\dfrac{x^3}{12a}\\right]_0^{4a}$.', 1], ['$= \\dfrac{4\\sqrt{a}}{3} \\cdot 8a^{3/2} - \\dfrac{64a^3}{12a} = \\dfrac{32a^2}{3} - \\dfrac{16a^2}{3} = \\dfrac{16a^2}{3}$.', 1]),
  derive(R(3, 1), 'Using integration, show that the area of the triangle bounded by $y = mx$ ($m > 0$), the x-axis and the line $x = h$ is $\\dfrac{1}{2} \\times \\text{base} \\times \\text{height}$.', ['Area $= \\int_0^h mx\\,dx$.', 1], ['$= \\left[\\dfrac{mx^2}{2}\\right]_0^h = \\dfrac{mh^2}{2}$.', 1], ['The base is $h$ and the height is $mh$, so this is $\\dfrac{1}{2} \\times h \\times mh$.', 1]),
];

export default questions;
