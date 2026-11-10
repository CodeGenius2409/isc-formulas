// Written by hand: calculus, figures to draw and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { graph, label, line, plot, sketch, table } from '../figures';

const { figure } = kit('mathematics', 'XII');
const A = at(3, 'a');
const D = at(3, 'b');
const I = at(3, 'c');
const E = at(3, 'e');

const questions: BankDef[] = [
  figure(A(2, 1), 'The graph shows $f(x)$, with a break at $x = 1$. Give the left- and right-hand limits at $x = 1$. Is $f$ continuous there?', ['The left-hand limit is 2, and the right-hand limit is 3.', 'They differ, so $f$ is not continuous at $x = 1$.'], {
    shown: graph('x', 'y', [{ points: [[0, 1], [1, 2], [1, 3], [2, 4]] }], { x: [[1, '1']], y: [[2, '2'], [3, '3']] }),
  }),
  figure(A(2, 2), 'The graph is of $f(x) = |x - 2|$. Is $f$ continuous at $x = 2$? Is it differentiable there? Give reasons from the graph.', ['It is continuous: the graph has no break at $x = 2$.', 'It is not differentiable: it has a sharp corner there, with slope $-1$ on the left and $1$ on the right.'], {
    shown: graph('x', 'y', [{ points: [[0, 2], [2, 0], [4, 2]] }], { x: [[2, '2']] }),
  }),
  figure(A(2, 2), 'The table gives values of $f(x)$ near $x = 1$, and $f(1) = 3$. What does it suggest about $\\lim_{x \\to 1} f(x)$? Is $f$ continuous at 1?', ['The values close in on 2 from both sides, so the limit appears to be 2.', 'But $f(1) = 3$, which differs from the limit, so $f$ is not continuous at 1.'], {
    shown: table(['x', '0.9', '0.99', '0.999', '1.001', '1.01', '1.1'], [['f(x)', '1.9', '1.99', '1.999', '2.001', '2.01', '2.1']]),
  }),
  figure(A(3, 3), 'Draw the graph of $f(x) = x|x|$. Use it, and the derivative from each side, to decide whether $f$ is differentiable at 0.', ['For $x \\ge 0$, $f(x) = x^2$; for $x < 0$, $f(x) = -x^2$. The graph is smooth through the origin.', 'Left derivative: $-2x \\to 0$. Right derivative: $2x \\to 0$.', 'They are equal, so $f$ is differentiable at 0, with $f\'(0) = 0$.'], {
    answer: graph('x', 'y = x|x|', [{ points: plot((x) => x * Math.abs(x), -2, 2, 40) }]),
  }),
  figure(A(2, 3), 'The graph is of a function that is continuous everywhere. At which of the points marked P, Q and R on the x-axis is it not differentiable? Give the reason for each.', ['At P, it has a corner, so the slopes on the two sides differ.', 'At R, the tangent is vertical, so there is no finite derivative. At Q the curve is smooth, so it is differentiable there.'], {
    shown: graph('x', 'y', [{ points: plot((x) => Math.abs(x + 2) + 1.5 * Math.cbrt(x - 2), -4, 4, 160) }], { x: [[-2, 'P'], [0, 'Q'], [2, 'R']] }),
  }),
  figure(D(3, 1), 'The graph shows $y = f(x)$. Give the intervals where $f$ is increasing and where it is decreasing, and name its local maximum and minimum.', ['Increasing for $x < -1$ and for $x > 1$; decreasing for $-1 < x < 1$.', 'A local maximum at $x = -1$, of value 4.', 'A local minimum at $x = 1$, of value 0.'], {
    shown: graph('x', 'y', [{ points: plot((x) => x ** 3 - 3 * x + 2, -2.2, 2.2, 40) }], { x: [[-1, '−1'], [1, '1']], y: [[4, '4']] }),
  }),
  figure(D(3, 2), 'The graph shows the derivative $f\'(x)$ of a function. Where is $f$ increasing? Where does $f$ have a local maximum, and where a local minimum?', ['$f$ increases where $f\' > 0$: for $x < 1$ and $x > 3$.', 'At $x = 1$, $f\'$ changes from positive to negative, so $f$ has a local maximum.', 'At $x = 3$, $f\'$ changes from negative to positive, so $f$ has a local minimum.'], {
    shown: graph('x', 'f′(x)', [{ points: plot((x) => (x - 1) * (x - 3), -0.5, 4.5, 30) }], { x: [[1, '1'], [3, '3']] }),
  }),
  figure(D(2, 2), 'Draw the curve $y = x^2$, with its tangent and its normal at the point $(1, 1)$. Give their equations.', ['The tangent has slope 2: $y = 2x - 1$.', 'The normal has slope $-\\frac{1}{2}$: $y = -\\frac{x}{2} + \\frac{3}{2}$.'], {
    answer: graph('x', 'y', [{ label: 'y = x²', points: plot((x) => x * x, -1, 2.2, 30) }, { label: 'tangent', points: [[0, -1], [2.2, 3.4]] }, { label: 'normal', points: [[-1, 2], [2.2, 0.4]] }], { x: [[1, '1']] }),
  }),
  figure(D(2, 3), 'The table gives the sign of $f\'(x)$ on each interval. Find where $f$ has a local maximum and a local minimum, and where neither.', ['At $x = -2$, $f\'$ goes from + to −: a local maximum. At $x = 1$, from − to +: a local minimum.', 'At $x = 4$, $f\'$ is + on both sides, so $f$ keeps rising: neither a maximum nor a minimum.'], {
    shown: table(['Interval', 'x < −2', '−2 < x < 1', '1 < x < 4', 'x > 4'], [['Sign of f′(x)', '+', '−', '+', '+']]),
  }),
  figure(D(2, 1), 'Draw the graph of $f(x) = x^3 - 3x$, and mark its turning points.', ['$f\'(x) = 3x^2 - 3 = 0$ at $x = \\pm 1$.', 'A local maximum at $(-1, 2)$ and a local minimum at $(1, -2)$, with the curve crossing the axis at $0$ and $\\pm\\sqrt{3}$.'], {
    answer: graph('x', 'y = x³ − 3x', [{ points: plot((x) => x ** 3 - 3 * x, -2.2, 2.2, 40) }], { x: [[-1, '−1'], [1, '1']], y: [[2, '2'], [-2, '−2']] }),
  }),
  figure(I(2, 1), 'The graph is of $y = 2x$. Use it to find $\\int_0^3 2x\\,dx$ without integrating, and check by integrating.', ['The area under the line from 0 to 3 is a triangle: $\\frac{1}{2} \\times 3 \\times 6 = 9$.', 'By integrating, $[x^2]_0^3 = 9$.'], {
    shown: graph('x', 'y', [{ points: [[0, 0], [3, 6]] }], { x: [[3, '3']], y: [[6, '6']] }),
  }),
  figure(I(2, 2), 'The graph is of an odd function $f$ on $[-a, a]$. What is $\\int_{-a}^{a} f(x)\\,dx$? Explain using the graph.', ['The integral is 0.', 'The area above the axis on one side equals the area below it on the other, so they cancel.'], {
    shown: graph('x', 'y', [{ points: plot((x) => x ** 3 - 2 * x, -2, 2, 40) }], { x: [[-2, '−a'], [2, 'a']] }),
  }),
  figure(I(2, 2), 'Draw the region whose area is $\\int_0^{\\pi} \\sin x\\,dx$, and find the area.', ['The region lies under one arch of $y = \\sin x$, between 0 and $\\pi$, above the $x$-axis.', 'Area $= [-\\cos x]_0^{\\pi} = 1 + 1 = 2$.'], {
    answer: graph('x', 'y = sin x', [{ points: plot((x) => Math.sin(x), 0, Math.PI, 30) }], { x: [[3.142, 'π']] }),
  }),
  figure(I(3, 2), 'The graph shows a step function $f$. Find $\\int_0^4 f(x)\\,dx$.', ['From 0 to 1, $f = 2$: area 2. From 1 to 3, $f = 1$: area 2.', 'From 3 to 4, $f = 3$: area 3.', 'The integral is $2 + 2 + 3 = 7$.'], {
    shown: graph('x', 'y', [{ points: [[0, 2], [1, 2], [1, 1], [3, 1], [3, 3], [4, 3]] }], { x: [[1, '1'], [3, '3'], [4, '4']], y: [[1, '1'], [2, '2'], [3, '3']] }),
  }),
  figure(I(2, 3), 'The table gives values of $F(x)$, an antiderivative of $f$. Find $\\int_1^3 f(x)\\,dx$ and $\\int_3^5 f(x)\\,dx$.', ['By the fundamental theorem, $\\int_1^3 f = F(3) - F(1) = 10 - 2 = 8$.', '$\\int_3^5 f = F(5) - F(3) = 26 - 10 = 16$.'], {
    shown: table(['x', '1', '3', '5'], [['F(x)', '2', '10', '26']]),
  }),
  figure(E(2, 1), 'Draw three curves from the family of solutions of $\\frac{dy}{dx} = 2x$. What is the same about them, and what is different?', ['The solutions are $y = x^2 + C$, a family of parabolas.', 'They have the same shape and slope at each $x$, and differ only by being shifted up or down.'], {
    answer: graph('x', 'y', [{ label: 'C = 2', points: plot((x) => x * x + 2, -2, 2, 30) }, { label: 'C = 0', points: plot((x) => x * x, -2, 2, 30) }, { label: 'C = −2', points: plot((x) => x * x - 2, -2, 2, 30) }]),
  }),
  figure(E(2, 2), 'Draw the solution of $\\frac{dy}{dx} = -y$ that passes through $(0, 4)$. Give its equation.', ['Separating gives $y = Ce^{-x}$, and $y(0) = 4$ gives $C = 4$.', 'So $y = 4e^{-x}$, which falls towards 0 without reaching it.'], {
    answer: graph('x', 'y', [{ points: plot((x) => 4 * Math.exp(-x), 0, 4, 30) }], { y: [[4, '4']] }),
  }),
  figure(E(3, 2), 'The graph is a solution of $\\frac{dy}{dx} = ky$ through $(0, 3)$ and $(1, 3e)$. Find $k$ and the particular solution.', ['The general solution is $y = Ce^{kx}$.', 'At $x = 0$, $y = 3$, so $C = 3$.', 'At $x = 1$, $3e^k = 3e$, so $k = 1$, and $y = 3e^x$.'], {
    shown: graph('x', 'y', [{ points: plot((x) => 3 * Math.exp(x), -1, 1.2, 30) }], { x: [[1, '1']], y: [[3, '3'], [8.155, '3e']] }),
  }),
  figure(E(2, 3), 'The figure shows the family of circles $x^2 + y^2 = C$. Form the differential equation of the family.', ['Differentiating, $2x + 2y\\frac{dy}{dx} = 0$.', 'So $\\frac{dy}{dx} = -\\frac{x}{y}$, with the constant gone.'], {
    shown: sketch(220, 220, 'Three circles centred on the origin, with axes through the middle.', [
      line([[10, 110], [210, 110]]), line([[110, 10], [110, 210]]),
      { t: 'circle', x: 110, y: 110, r: 30 }, { t: 'circle', x: 110, y: 110, r: 60 }, { t: 'circle', x: 110, y: 110, r: 90 }, label(200, 104, 'x'), label(118, 20, 'y', 'start'),
    ]),
  }),
  figure(E(3, 3), 'Draw the solutions of $\\frac{dy}{dx} = y$ through $(0, 1)$ and through $(0, -1)$. What is the solution through $(0, 0)$?', ['The solutions are $y = Ce^x$.', 'Through $(0, 1)$: $y = e^x$, rising. Through $(0, -1)$: $y = -e^x$, falling.', 'Through $(0, 0)$: $C = 0$, so $y = 0$, the $x$-axis.'], {
    answer: graph('x', 'y', [{ label: 'y = eˣ', points: plot((x) => Math.exp(x), -2, 1.5, 30) }, { label: 'y = −eˣ', points: plot((x) => -Math.exp(x), -2, 1.5, 30) }]),
  }),
];

export default questions;
