// Hand-worked answers, computed a second time. Each line finds a question by its wording, works its answer out here in code, and
// holds the question's last marking point to that value. Every hand-written Mathematics numerical has to appear below.
import { describe, expect, it } from 'vitest';
import { instantiate, loadBank } from '../../src/practice/bank';
import type { BankDef, NumericItem } from '../../src/practice/bank/types';
import { seededRng } from '../../src/practice/questions';
import { bankFormatOf } from '../../src/practice/gen/teacher';

const { PI, E, sqrt, sin, cos, tan, atan, asin, acos, hypot, abs } = Math;
const deg = PI / 180;
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n: number, r: number) => fact(n) / (fact(r) * fact(n - r));
const P = (n: number, r: number) => fact(n) / fact(n - r);
const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: number[]) => hypot(...a);
const det3 = (m: number[][]) => dot(m[0], cross(m[1], m[2]));
/** Simpson's rule, so that an integral is checked without its working. */
const integral = (f: (x: number) => number, a: number, b: number, n = 2000) => {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
};
const slope = (f: (x: number) => number, x: number, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
const limit = (f: (x: number) => number, x: number, h = 1e-5) => (f(x + h) + f(x - h)) / 2;
/** The largest value of an objective over a region's corners. */
const best = (pick: (...v: number[]) => number, z: (p: number[]) => number, corners: number[][]) => pick(...corners.map(z));
const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const variance = (v: number[]) => mean(v.map((x) => x * x)) - mean(v) ** 2;
const count = (n: number, test: (k: number) => boolean) => Array.from({ length: n }, (_, i) => i + 1).filter(test).length;

type Check = [text: string, computed: number, shown: string];

const XII: Check[] = [
  // Relations and functions
  ['$(f \\circ g)(2)$', 2 * 2 ** 2 + 1, '9'],
  ['How many reflexive relations', 2 ** (3 ** 2 - 3), '64'],
  ['$f(x) = 3x - 4$', (5 + 4) / 3, '3'],
  ['$(g \\circ f)(2) + (f \\circ g)(2)$', 2 * (2 ** 2 + 1) - 3 + ((2 * 2 - 3) ** 2 + 1), '9'],
  ['How many one-one functions', P(5, 3), '60'],
  ['$f(x) = \\frac{2x + 3}{x - 1}$', 6, '6'],
  ['$R = \\{(a, b) : a + b = 8\\}$', count(7, (a) => 8 - a >= 1 && 8 - a <= 7), '7'],
  ['are onto? Explain', 2 ** 3 - 2, '6'],
  ['$f(x) = 2x - 1$ and $g(x) = x^2 + 2$', (7 + 1) / 2, '4'],
  ['$f : \\{1, 2, 3, 4\\} \\to', fact(3) / fact(4), '\\frac{1}{4}'],
  // Inverse trigonometry
  ['principal value of $\\tan^{-1}(1)$', atan(1), '\\frac{\\pi}{4}'],
  ['$\\sin^{-1}\\frac{1}{2} + \\cos^{-1}\\frac{1}{2}$', asin(0.5) + acos(0.5), '\\frac{\\pi}{2}'],
  ['$\\cos^{-1}\\left(-\\frac{1}{2}\\right)$', acos(-0.5), '\\frac{2\\pi}{3}'],
  ['$\\sin\\left(\\cos^{-1}\\frac{3}{5}\\right)$', sin(acos(3 / 5)), '\\frac{4}{5}'],
  ['$\\cos\\left(\\tan^{-1}\\frac{3}{4}\\right)$', cos(atan(3 / 4)), '\\frac{4}{5}'],
  ['$\\tan^{-1}\\frac{1}{2} + \\tan^{-1}\\frac{1}{3}$', atan(1 / 2) + atan(1 / 3), '\\frac{\\pi}{4}'],
  ['Solve $2\\tan^{-1}x = \\tan^{-1}\\frac{3}{4}$', tan(atan(3 / 4) / 2), '\\frac{1}{3}'],
  ['$\\sin\\left(\\sin^{-1}\\frac{3}{5} + \\cos^{-1}\\frac{12}{13}\\right)$', sin(asin(3 / 5) + acos(12 / 13)), '\\frac{56}{65}'],
  ['$\\cos\\left(2\\sin^{-1}\\frac{1}{3}\\right)$', cos(2 * asin(1 / 3)), '\\frac{7}{9}'],
  ['Solve $\\tan^{-1}(2x) + \\tan^{-1}(3x) = \\frac{\\pi}{4}$', (-5 + sqrt(25 + 24)) / 12, '\\frac{1}{6}'],
  // Matrices
  ['$A$ is $2 \\times 3$ and $B$ is $3 \\times 4$', 2 * 4, '8'],
  ['How many $2 \\times 2$ matrices', 2 ** 4, '16'],
  ['Give the value of $xy$', ((6 + 2) / 2) * ((6 - 2) / 2), '8'],
  ['second row and first column of $AB$', 3 * 1 + 4 * 2, '11'],
  ['$A^2 - 2A = kI$', 1 * 1 + 2 * 2 - 2 * 1, '3'],
  ['$A^2 - 6A + kI = O$', 4 * 2 + 1 * 1, '9'],
  ['5 notebooks, 3 pens and 2 rulers', dot([10, 15, 20], [5, 3, 2]), '135'],
  ['Write $A = \\begin{bmatrix}3 & 5\\\\1 & -1\\end{bmatrix}$ as $P + Q$', (5 + 1) / 2, '3'],
  ['$2x + 3y = 7$, $x + 2y = 4$', 2 * 7 - 3 * 4, '2'],
  ['two brands of tea', 20 * 12 + 30 * 8 + 25 * 12 + 15 * 8, '900'],
  // Determinants
  ['$\\begin{vmatrix}2 & 3\\\\1 & 4\\end{vmatrix}$', 2 * 4 - 3 * 1, '5'],
  ['$(0, 0)$, $(4, 0)$ and $(0, 3)$', (4 * 3) / 2, '6'],
  ['$|3A|$', 3 ** 2 * 2, '18'],
  ['$\\begin{vmatrix}x & 2\\\\3 & x\\end{vmatrix} = 10$', sqrt(10 + 6), '4'],
  ['$|\\operatorname{adj} A|$', 5 ** 2, '25'],
  ['Find the cofactor', -(4 * 9 - 6 * 7), '6'],
  ['$\\begin{vmatrix}1 & 2 & 3\\\\0 & 1 & 4\\\\5 & 6 & 0\\end{vmatrix}$', det3([[1, 2, 3], [0, 1, 4], [5, 6, 0]]), '1'],
  ['$(1, 0)$, $(6, 0)$ and $(4, 3)$', abs(det3([[1, 0, 1], [6, 0, 1], [4, 3, 1]])) / 2, '\\frac{15}{2}'],
  ['$(1, 2)$, $(3, k)$ and $(5, 8)$', 2 + (2 * (8 - 2)) / (5 - 1), '5'],
  ['$x + y + z = 6$, $x - y + z = 2$', det3([[1, 1, 6], [1, -1, 2], [2, 1, 1]]) / det3([[1, 1, 1], [1, -1, 1], [2, 1, -1]]), '3'],
  ['Two pens, one book and one ruler', det3([[2, 23, 1], [1, 28, 1], [1, 21, 2]]) / det3([[2, 1, 1], [1, 2, 1], [1, 1, 2]]), '10'],
  // Differentiation
  ['If $y = e^{2x}$', slope((x) => E ** (2 * x), 0), '2'],
  ['If $y = \\log x$', slope(Math.log, 2), '\\frac{1}{2}'],
  ['If $y = \\sin 3x$', slope((x) => sin(3 * x), 0), '3'],
  ['If $y = \\tan x$', slope(tan, PI / 4), '2'],
  ['If $x = t^2$ and $y = 2t$', 2 / (2 * 2), '\\frac{1}{2}'],
  ['If $x^2 + y^2 = 25$', slope((x) => sqrt(25 - x * x), 3), '-\\frac{3}{4}'],
  ['If $y = x^x$', slope((x) => x ** x, 1), '1'],
  ['$f(x) = kx + 1$ for $x \\le 2$', (3 * 2 - 1 - 1) / 2, '2'],
  ['$f(x) = ax^2 + b$ for $x \\le 1$', 2 * 1 + 1 - 2 / 2, '2'],
  ['$y = (\\sin^{-1}x)^2$', (() => {
    const y = (x: number) => asin(x) ** 2;
    const x = 0.3;
    const h = 1e-4;
    return (1 - x * x) * ((y(x + h) - 2 * y(x) + y(x - h)) / (h * h)) - x * slope(y, x);
  })(), '2'],
  // Applications of derivatives
  ['slope of the tangent to $y = x^3$', slope((x) => x ** 3, 2), '12'],
  ['maximum value of $4 - x^2$', 4, '4'],
  ['radius of a circle grows at 2 cm/s', 2 * PI * 5 * 2, '20\\pi'],
  ['approximate value of $\\sqrt{26}$', 5 + 1 / (2 * 5), '5.1'],
  ['minimum value of $x^2 - 4x + 5$', 2 ** 2 - 4 * 2 + 5, '1'],
  ['local maximum value of $x^3 - 3x$', (-1) ** 3 - 3 * -1, '2'],
  ['perimeter of 20 cm', 5 * 5, '25'],
  ['spherical balloon', 100 / (4 * PI * 5 ** 2), '\\frac{1}{\\pi}'],
  ['square sheet of side 18 cm', Math.max(...Array.from({ length: 90 }, (_, i) => (i / 10) * (18 - (2 * i) / 10) ** 2)), '432'],
  ['100 m of fence', Math.max(...Array.from({ length: 51 }, (_, x) => x * (100 - 2 * x))), '1250'],
  // Integrals
  ['$\\int_0^1 x^2\\,dx$', integral((x) => x * x, 0, 1), '\\frac{1}{3}'],
  ['$\\int_0^{\\pi/2} \\cos x\\,dx$', integral(cos, 0, PI / 2), '1'],
  ['$\\int_1^2 (2x + 1)\\,dx$', integral((x) => 2 * x + 1, 1, 2), '4'],
  ['$\\int_0^{\\pi/4} \\sec^2 x\\,dx$', integral((x) => 1 / cos(x) ** 2, 0, PI / 4), '1'],
  ['$\\int_{-1}^{1} |x|\\,dx$', 2 * integral((x) => x, 0, 1), '1'],
  ['$\\int_1^e \\log x\\,dx$', integral(Math.log, 1, E), '1'],
  ['$\\int_0^1 xe^x\\,dx$', integral((x) => x * E ** x, 0, 1), '1'],
  ['$\\int_0^{\\pi/2} \\sin^2 x\\,dx$', integral((x) => sin(x) ** 2, 0, PI / 2), '\\frac{\\pi}{4}'],
  ['$\\int_0^{\\pi/2} \\frac{\\sin x}{\\sin x + \\cos x}\\,dx$', integral((x) => sin(x) / (sin(x) + cos(x)), 0, PI / 2), '\\frac{\\pi}{4}'],
  ['$\\int_0^{\\pi} x\\sin x\\,dx$', integral((x) => x * sin(x), 0, PI), '\\pi'],
  // Application of integrals
  ['area under $y = 2x$', integral((x) => 2 * x, 0, 3), '9'],
  ['area under $y = x^2$', integral((x) => x * x, 0, 3), '9'],
  ['one arch of $y = \\sin x$', integral(sin, 0, PI), '2'],
  ['area under $y = 3x + 2$', integral((x) => 3 * x + 2, 0, 2), '10'],
  ['between $y = x$ and $y = x^2$', integral((x) => x - x * x, 0, 1), '\\frac{1}{6}'],
  ['enclosed by $y^2 = 4x$', 2 * integral((x) => 2 * sqrt(x), 0, 1, 200000), '\\frac{8}{3}'],
  ['$x^2 + y^2 = 4$ in the first quadrant', integral((x) => sqrt(4 - x * x), 0, 2, 200000), '\\pi'],
  ['between $y = x^2$ and $y = 2x$', integral((x) => 2 * x - x * x, 0, 2), '\\frac{4}{3}'],
  ['$\\frac{x^2}{9} + \\frac{y^2}{4} = 1$, by integration', 4 * integral((x) => (2 / 3) * sqrt(9 - x * x), 0, 3, 200000), '6\\pi'],
  ['vertices $(0, 0)$, $(4, 0)$ and $(2, 3)$, by integration', (4 * 3) / 2, '6'],
  // Differential equations
  ['Find the order of', 2, '2'],
  ['Find the degree of', 1, '1'],
  ['$\\frac{dy}{dx} = 2x$ and $y = 3$', 2 ** 2 + 3, '7'],
  ['$\\frac{dy}{dx} = y$ and $y = 1$', E, 'e'],
  ['$\\frac{dy}{dx} = 3y$', 2 * E ** (3 * Math.log(2)), '16'],
  ['$\\frac{dy}{dx} = xy$ and $y = 2$', 2 * E ** (2 / 2), '2e'],
  ['$\\frac{dy}{dx} + \\frac{y}{x} = 1$', (2 ** 2 / 2 + 0.5) / 2, '\\frac{5}{4}'],
  ['doubles in 10 years', 2 ** (30 / 10), '8'],
  ['Solve $\\frac{dy}{dx} = \\frac{x + y}{x}$', E * Math.log(E), 'e'],
  ['Solve $\\frac{dy}{dx} + 2y = 4$', 4 / 2, '2'],
  // Vectors
  ['magnitude of $3\\hat{i} - 4\\hat{j}$', hypot(3, 4), '5'],
  ['$(\\hat{i} + 2\\hat{j}) \\cdot (3\\hat{i} - \\hat{j})$', dot([1, 2], [3, -1]), '1'],
  ['$|\\vec{a} \\times \\vec{b}|$', 2 * 3 * sin(30 * deg), '3'],
  ['projection of $2\\hat{i} + \\hat{j}$', dot([2, 1], [3, 4]) / hypot(3, 4), '2'],
  ['$2\\hat{i} + \\hat{j} + \\hat{k}$ and $\\hat{i} - 3\\hat{j} + k\\hat{k}$', -(2 - 3), '1'],
  ['$A(1, 0, 0)$, $B(0, 1, 0)$ and $C(0, 0, 1)$', norm(cross([-1, 1, 0], [-1, 0, 1])) / 2, '\\frac{\\sqrt{3}}{2}'],
  ['angle between $\\hat{i} + \\hat{j}$ and $\\hat{j} + \\hat{k}$', acos(dot([1, 1, 0], [0, 1, 1]) / (norm([1, 1, 0]) * norm([0, 1, 1]))), '\\frac{\\pi}{3}'],
  ['are coplanar', -(det3([[1, 2, 3], [0, 1, 2], [1, 0, 0]])), '-1'],
  ['force $3\\hat{i} + 2\\hat{j} + \\hat{k}$', dot([3, 2, 1], [3 - 1, 2 - 1, 4 - 1]), '11'],
  ['$\\vec{a} = \\hat{i} + 2\\hat{j} + 3\\hat{k}$ and $\\vec{b} = 3\\hat{i} - 2\\hat{j} + \\hat{k}$', norm(cross([1, 2, 3], [3, -2, 1])), '8\\sqrt{3}'],
  // Three-dimensional geometry
  ['between $(1, 2, 3)$ and $(4, 6, 3)$', hypot(3, 4, 0), '5'],
  ['direction ratios 1, 2, 2', 1 / norm([1, 2, 2]), '\\frac{1}{3}'],
  ['origin from the plane $2x + 3y + 6z = 14$', 14 / norm([2, 3, 6]), '2'],
  ['between the planes $x + y = 3$ and $y + z = 5$', acos(dot([1, 1, 0], [0, 1, 1]) / 2), '\\frac{\\pi}{3}'],
  ['parallel planes $2x - y + 2z = 3$', 6 / norm([2, -1, 2]), '2'],
  ['$(1, 2, 3)$ from the plane $x + 2y + 2z = 2$', abs(1 + 4 + 6 - 2) / norm([1, 2, 2]), '3'],
  ['shortest distance between $\\vec{r} = \\lambda\\hat{i}$', abs(dot([0, 3, 4], cross([1, 0, 0], [0, 1, 0]))), '4'],
  ['$\\frac{x}{k} = \\frac{y}{1} = \\frac{z}{-1}$', -(2 * 1 + 3 * -1), '1'],
  ['$(2, 2, 2)$', (abs(2 + 2 + 2 - 1) / sqrt(3)) ** 2, '\\frac{25}{3}'],
  ['foot of the perpendicular from $(3, 4, 5)$', (abs(3 + 4 + 5 - 3) / sqrt(3)) ** 2, '27'],
  // Linear programming
  ['$(0, 0)$, $(4, 0)$ and $(0, 6)$', best(Math.max, ([x, y]) => 3 * x + 2 * y, [[0, 0], [4, 0], [0, 6]]), '12'],
  ['$(1, 1)$, $(3, 1)$ and $(1, 4)$', best(Math.min, ([x, y]) => 2 * x + y, [[1, 1], [3, 1], [1, 4]]), '3'],
  ['$(0, 0)$, $(5, 0)$, $(3, 2)$ and $(0, 4)$', best(Math.max, ([x, y]) => 2 * x + 3 * y, [[0, 0], [5, 0], [3, 2], [0, 4]]), '12'],
  ['Maximise $Z = 3x + 4y$ subject to $x + y \\le 5$', best(Math.max, ([x, y]) => 3 * x + 4 * y, [[0, 0], [5, 0], [0, 5]]), '20'],
  ['Minimise $Z = 2x + y$', best(Math.min, ([x, y]) => 2 * x + y, [[4, 0], [0, 4]]), '4'],
  ['Maximise $Z = x + y$', best(Math.max, ([x, y]) => x + y, [[0, 0], [4, 0], [2, 3], [0, 4]]), '5'],
  ['10 hours to revise', best(Math.max, ([x, y]) => 3 * x + 2 * y, [[2, 2], [8, 2], [2, 8]]), '28'],
  ['Minimise $Z = 5x + 3y$', best(Math.min, ([x, y]) => 5 * x + 3 * y, [[0, 8], [3, 2], [7, 0]]), '21'],
  ['tables and chairs', best(Math.max, ([x, y]) => 50 * x + 30 * y, [[0, 0], [50, 0], [20, 60], [0, 80]]), '2800'],
  ['A diet uses two foods', best(Math.min, ([x, y]) => 6 * x + 10 * y, [[0, 15], [4, 3], [10, 0]]), '54'],
  // Probability
  ['$P(B | A) = 0.4$', 0.5 * 0.4, '0.2'],
  ['$n = 10$ and $p = 0.3$', 10 * 0.3, '3'],
  ['both are aces', (4 / 52) * (3 / 51), '\\frac{1}{221}'],
  ['$X$ is the number of heads', 0 * 0.25 + 1 * 0.5 + 2 * 0.25, '1'],
  ['$P(A) = 0.6$, $P(B) = 0.5$', 0.6 + 0.5 - 0.6 * 0.5, '0.8'],
  ['Bag I has 3 red', (0.5 * 0.6) / (0.5 * 0.6 + 0.5 * 0.2), '\\frac{3}{4}'],
  ['Find the variance of $X$', 0.5 + 1 - 1, '\\frac{1}{2}'],
  ['tossed 4 times', C(4, 2) / 2 ** 4, '\\frac{3}{8}'],
  ['Factory A makes 60%', (0.4 * 0.03) / (0.6 * 0.02 + 0.4 * 0.03), '0.5'],
  ['$X$ is the number of sixes', 2 * (1 / 6), '\\frac{1}{3}'],
];

const XI: Check[] = [
  // Sets
  ['$n(A) = 10$, $n(B) = 15$', 10 + 15 - 5, '20'],
  ['How many subsets', 2 ** 4, '16'],
  ['How many proper subsets', 2 ** 3 - 1, '7'],
  ['$n((A \\cup B)\')$', 50 - 20 - 25, '5'],
  ['35 drink tea', 60 - (35 + 30 - 10), '5'],
  ['50 study Mathematics', 100 - (50 + 40 + 30 - 20 - 10 - 15 + 5), '20'],
  ['25 play cricket', 25 + 20 - 2 * 8, '29'],
  ['$n(A) = 3$ and $n(B) = 6$', 6 + (3 + 6), '15'],
  ['90 read $A$', 30 + 20 + 25 - 3 * 10, '45'],
  ['$n(A - B)$', 12 - 4, '8'],
  // Relations and functions
  ['$f(x) = 3x^2$', sqrt(27 / 3), '3'],
  ['set of 2 elements to a set of 3 elements', 3 ** 2, '9'],
  ['If $f(x) = x^2 + 1$, find $f(3)$', 3 ** 2 + 1, '10'],
  ['how many relations are there from $A$ to $B$', 2 ** (2 * 3), '64'],
  ['If $f(x) = 2x + 3$, find $x$', (11 - 3) / 2, '4'],
  ['$f(2) + f(-1)$', 2 ** 2 - 2 + ((-1) ** 2 + 1), '4'],
  ['how many functions are there from $A$ to $B$?', 2 ** 3, '8'],
  ['$(f + g)(2)$', 3 + 4 + 3 * 4, '19'],
  ['$f(0) + f(1) + f(2)$', 0 + (1 + 3) + (2 + 3), '9'],
  ['A taxi charges', 20 + 8 * 10 + 6 * 5, '130'],
  // Trigonometry
  ['$\\sin 30° + \\cos 60°$', sin(30 * deg) + cos(60 * deg), '1'],
  ['Write $150°$ in radians', 150 * deg, '\\frac{5\\pi}{6}'],
  ['subtends an angle of 0.5 radian', 10 * 0.5, '5'],
  ['$\\sin x = \\frac{3}{5}$', tan(asin(3 / 5)), '\\frac{3}{4}'],
  ['$\\cos^2 15° - \\sin^2 15°$', cos(15 * deg) ** 2 - sin(15 * deg) ** 2, '\\frac{\\sqrt{3}}{2}'],
  ['$\\sin x = \\frac{4}{5}$ with $x$ in the second quadrant', tan(PI - asin(4 / 5)), '-\\frac{4}{3}'],
  ['If $\\sin x = \\frac{1}{3}$, find $\\cos 2x$', cos(2 * asin(1 / 3)), '\\frac{7}{9}'],
  ['$\\tan 15°$', tan(15 * deg), '2 - \\sqrt{3}'],
  ['$\\sin 20° \\sin 40° \\sin 80°$', sin(20 * deg) * sin(40 * deg) * sin(80 * deg), '\\frac{\\sqrt{3}}{8}'],
  ['A wheel of radius 35 cm', (35 * 6 * (22 / 7) * 60) / 100, '396'],
  // Complex numbers
  ['modulus of $3 - 4i$', hypot(3, 4), '5'],
  ['modulus of $(1 + i)^2$', hypot(1, 1) ** 2, '2'],
  ['real part of $(2 + 3i)(1 - i)$', 2 * 1 - 3 * -1, '5'],
  ['real part of $\\frac{3 + 4i}{1 + 2i}$', (3 * 1 + 4 * 2) / 5, '\\frac{11}{5}'],
  ['$x + iy = \\frac{1 + i}{1 - i}$', 1, '1'],
  ['argument of $1 + \\sqrt{3}i$', Math.atan2(sqrt(3), 1), '\\frac{\\pi}{3}'],
  ['square root of $5 + 12i$', sqrt((hypot(5, 12) + 5) / 2), '3'],
  ['$|z - 1| = |z + 1|$', 0, '0'],
  ['Write $z = -1 + \\sqrt{3}i$', hypot(-1, sqrt(3)) ** 3 * cos(3 * Math.atan2(sqrt(3), -1)), '8'],
  ['Solve $z^2 = -3 + 4i$', sqrt((hypot(-3, 4) - 3) / 2), '1'],
  // Quadratics
  ['sum of the roots of $x^2 - 5x + 6 = 0$', 2 + 3, '5'],
  ['discriminant of $x^2 + x + 1 = 0$', 1 - 4, '-3'],
  ['$\\alpha^2 + \\beta^2$', 2 ** 2 + 3 ** 2, '13'],
  ['$x^2 + kx + 9 = 0$ has equal roots', 2 * sqrt(9), '6'],
  ['$\\frac{1}{\\alpha} + \\frac{1}{\\beta}$', 1 / 2 + 1 / 3, '\\frac{5}{6}'],
  ['Solve $x^2 + 2x + 5 = 0$', (-1) ** 2 + 2 ** 2, '5'],
  ['add up to 10', (10 + sqrt(100 - 84)) / 2, '7'],
  ['If 3 is a root of $x^2 - kx + 6 = 0$', (9 + 6) / 3, '5'],
  ['A train travels 300 km', (-10 + sqrt(100 + 12000)) / 2, '50'],
  ['area of 96 m²', (20 + sqrt(400 - 384)) / 2, '12'],
  // Permutations and combinations
  ['value of ${}^{6}C_2$', C(6, 2), '15'],
  ['5 different books', fact(5), '120'],
  ['letters of MATH', fact(4), '24'],
  ['committee of 3 be chosen from 7', C(7, 3), '35'],
  ['three-digit numbers with no repeated digit', P(5, 3), '60'],
  ['letters of BANANA', fact(6) / (fact(3) * fact(2)), '60'],
  ['3 men and 2 women', C(5, 3) * C(4, 2), '60'],
  ['two of them must sit together', 2 * fact(4), '48'],
  ['at least 2 women', C(4, 2) * C(6, 2) + C(4, 3) * C(6, 1) + C(4, 4), '115'],
  ['letters of EQUATION', fact(4) * fact(5), '2880'],
  // Binomial theorem
  ['coefficient of $x^2$ in $(1 + x)^5$', C(5, 2), '10'],
  ['$(a + b)^8$', 8 + 1, '9'],
  ['coefficient of $x^3$ in $(2x + 1)^4$', C(4, 3) * 2 ** 3, '32'],
  ['sum of the coefficients in $(1 + x)^6$', 2 ** 6, '64'],
  ['independent of $x$ in $\\left(x + \\frac{1}{x}\\right)^6$', C(6, 3), '20'],
  ['independent of $x$ in $\\left(x + \\frac{1}{x^2}\\right)^6$', C(6, 2), '15'],
  ['coefficient of $x^4$ in $(1 - 2x)^5$', C(5, 4) * (-2) ** 4, '80'],
  ['$(1.01)^5$', Math.round(1.01 ** 5 * 1000) / 1000, '1.051'],
  ['coefficients of $x^2$ and $x^3$ in $(1 + x)^n$', [3, 4, 5, 6, 7, 8].find((n) => C(n, 2) === C(n, 3))!, '5'],
  ['$(\\sqrt{2} + 1)^4 + (\\sqrt{2} - 1)^4$', (sqrt(2) + 1) ** 4 + (sqrt(2) - 1) ** 4, '34'],
  // Sequences and series
  ['10th term of the AP 2, 5, 8', 2 + 9 * 3, '29'],
  ['6th term of the GP 3, 6, 12', 3 * 2 ** 5, '96'],
  ['first 20 terms of the AP 1, 3, 5', Array.from({ length: 20 }, (_, i) => 1 + 2 * i).reduce((a, b) => a + b), '400'],
  ['geometric mean of 4 and 9', sqrt(36), '6'],
  ['sum to infinity', 1 / (1 - 1 / 2), '2'],
  ['3rd term of an AP is 7', 7 + 7 * ((19 - 7) / 4), '28'],
  ['2nd term of a GP is 6', 6 * 2 ** 6, '384'],
  ['saves ₹100', Array.from({ length: 12 }, (_, i) => 100 + 20 * i).reduce((a, b) => a + b), '2520'],
  ['$\\sum_{k = 1}^{10} k(k + 1)$', Array.from({ length: 10 }, (_, i) => (i + 1) * (i + 2)).reduce((a, b) => a + b), '440'],
  ['Three numbers in AP add up to 15', 5 + 3, '8'],
  // Straight lines
  ['through $(1, 2)$ and $(3, 8)$', (8 - 2) / (3 - 1), '3'],
  ['$(3, 4)$ from the line $3x + 4y = 0$', (3 * 3 + 4 * 4) / 5, '5'],
  ['$\\frac{x}{2} + \\frac{y}{3} = 1$', (2 * 3) / 2, '3'],
  ['$2x + 3y = 1$ and $kx - y = 5$', 3 / 2, '\\frac{3}{2}'],
  ['the line $y = x$ makes', atan(1), '\\frac{\\pi}{4}'],
  ['$3x + 4y = 5$ and $3x + 4y = 15$', 10 / hypot(3, 4), '2'],
  ['$x + y = 5$ and $x - y = 1$', ((5 + 1) / 2) * ((5 - 1) / 2), '6'],
  ['$(0, 0)$, $(6, 0)$ and $(0, 8)$', hypot(6, 8) / 2, '5'],
  ['through $(1, 2)$ perpendicular to $3x - 4y = 5$', (4 * 1 + 3 * 2) / hypot(4, 3), '2'],
  ['$A(0, 4)$, $B(-3, 0)$ and $C(3, 0)$', (2 * ((6 * 4) / 2)) / hypot(3, 4), '\\frac{24}{5}'],
  // Circles
  ['radius of $x^2 + y^2 = 49$', sqrt(49), '7'],
  ['radius of $x^2 + y^2 - 6x - 8y = 0$', hypot(3, 4), '5'],
  ['centre $(3, 4)$', hypot(3, 4), '5'],
  ['tangent from $(4, 3)$', sqrt(16 + 9 - 9), '4'],
  ['$x^2 + y^2 + 4x - 6y + c = 0$', 4 + 9 - 4, '9'],
  ['area of $x^2 + y^2 - 4x - 6y - 12 = 0$', PI * (4 + 9 + 12), '25\\pi'],
  ['$y = x + c$ touches', sqrt(8) * sqrt(2), '4'],
  ['$x^2 + y^2 - 6x - 8y + 16 = 0$', hypot(3, 4), '5'],
  ['through $(0, 0)$, $(2, 0)$ and $(0, 4)$', 1 ** 2 + 2 ** 2, '5'],
  ['tangent to $x^2 + y^2 = 25$ at $(3, 4)$', (0.5 * 25 * 25) / (3 * 4), '\\frac{625}{24}'],
  // Conic sections
  ['latus rectum of $y^2 = 12x$', 12, '12'],
  ['eccentricity of $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$', sqrt(1 - 9 / 25), '\\frac{4}{5}'],
  ['eccentricity of $\\frac{x^2}{9} - \\frac{y^2}{16} = 1$', sqrt(1 + 16 / 9), '\\frac{5}{3}'],
  ['foci of $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$', 2 * sqrt(25 - 9), '8'],
  ['A point on $y^2 = 12x$ has $y = 6$', 6 ** 2 / 12 + 3, '6'],
  ['semi-major axis of 5', 25 - (5 * (3 / 5)) ** 2, '16'],
  ['latus rectum of $\\frac{x^2}{9} - \\frac{y^2}{16} = 1$', (2 * 16) / 3, '\\frac{32}{3}'],
  ['focus of $y^2 = 8x$', 8, '8'],
  ['12 m wide and 3 m deep', 6 ** 2 / (4 * 3), '3'],
  ['half an ellipse', 100 * (1 - 10 ** 2 / 20 ** 2), '75'],
  // Three-dimensional geometry
  ['$(3, 4, 0)$ from the origin', hypot(3, 4), '5'],
  ['midpoint of $(1, 2, 3)$ and $(3, 4, 7)$', (3 + 7) / 2, '5'],
  ['between $(1, 2, 3)$ and $(4, 6, 15)$', hypot(3, 4, 12), '13'],
  ['ratio $1 : 2$', (1 * 4 + 2 * 1) / 3, '2'],
  ['$(3, 4, 12)$', hypot(3, 4), '5'],
  ['$(1, 2, 3)$, $(3, 0, 5)$ and $(5, 4, 1)$', (1 + 3 + 5) / 3 + (2 + 0 + 4) / 3 + (3 + 5 + 1) / 3, '8'],
  ['equidistant from $(1, 2, 3)$', (14 - 14) / 4, '0'],
  ['ratio $2 : 1$', (2 * 5 + 2) / 3 + (2 * 6 + 3) / 3 + (2 * 7 + 4) / 3, '15'],
  ['$A(0, 0, 0)$, $B(3, 0, 0)$', (3 * 4) / 2, '6'],
  ['A hall is 4 m long', hypot(4, 3, 12), '13'],
  // Limits and derivatives
  ['$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$', limit((x) => (x * x - 4) / (x - 2), 2), '4'],
  ['$\\lim_{x \\to 0} \\frac{\\sin 3x}{x}$', limit((x) => sin(3 * x) / x, 0), '3'],
  ['$\\lim_{x \\to 1} \\frac{x^3 - 1}{x - 1}$', limit((x) => (x ** 3 - 1) / (x - 1), 1), '3'],
  ['$\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2}$', limit((x) => (1 - cos(x)) / (x * x), 0, 1e-3), '\\frac{1}{2}'],
  ['$y = 3x^2 - 2x$', slope((x) => 3 * x * x - 2 * x, 1), '4'],
  ['derivative of $x^2$ at $x = 3$', slope((x) => x * x, 3), '6'],
  ['$\\lim_{x \\to \\infty} \\frac{2x^2 + 1}{x^2 + 3}$', (2 * 1e8 ** 2 + 1) / (1e8 ** 2 + 3), '2'],
  ['$f(x) = x\\sin x$', slope((x) => x * sin(x), PI / 2), '1'],
  ['$f(x) = kx + 1$ for $x < 2$', slope((x) => x * x - 1, 2), '4'],
  ['$h = 20t - 5t^2$', 20 * 2 - 5 * 2 ** 2, '20'],
  // Statistics
  ['Find the mean of 2, 4, 6, 8, 10', mean([2, 4, 6, 8, 10]), '6'],
  ['median of 3, 1, 7, 5, 9', [1, 3, 5, 7, 9][2], '5'],
  ['variance of 2, 4, 6, 8, 10', variance([2, 4, 6, 8, 10]), '8'],
  ['mean deviation about the mean', mean([2, 4, 6, 8, 10].map((x) => abs(x - 6))), '\\frac{12}{5}'],
  ['A sixth number, 18', (5 * 12 + 18) / 6, '13'],
  ['frequencies 2, 3, 5. Find the mean.', mean([1, 1, 2, 2, 2, 3, 3, 3, 3, 3]), '2.3'],
  ['frequencies 2, 3, 5. Find the variance.', variance([1, 1, 2, 2, 2, 3, 3, 3, 3, 3]), '0.61'],
  ['multiplied by 3', sqrt(3 ** 2 * 4), '6'],
  ['Two classes have 20 and 30 students', (20 * (16 + 60 ** 2) + 30 * (25 + 70 ** 2)) / 50 - 66 ** 2, '45.4'],
  ['40, 50, 60, 70, 80', variance([80, 100, 120, 140, 160]), '800'],
  // Probability
  ['thrown. Find the probability of an even number', 3 / 6, '\\frac{1}{2}'],
  ['it’s a king', 4 / 52, '\\frac{1}{13}'],
  ['the sum is 7', 6 / 36, '\\frac{1}{6}'],
  ['$P(A) = 0.5$, $P(B) = 0.4$', 0.5 + 0.4 - 0.2, '0.7'],
  ['at least one head', 3 / 4, '\\frac{3}{4}'],
  ['5 red and 3 black', C(5, 2) / C(8, 2), '\\frac{5}{14}'],
  ['multiple of 3 or 5', count(20, (k) => k % 3 === 0 || k % 5 === 0) / 20, '\\frac{9}{20}'],
  ['exactly two heads', C(3, 2) / 2 ** 3, '\\frac{3}{8}'],
  ['exactly 2 women', (C(4, 2) * C(6, 2)) / C(10, 4), '\\frac{3}{7}'],
  ['Three cards are drawn', C(4, 3) / C(52, 3), '\\frac{1}{5525}'],
];

/** Reads an answer as the marking point prints it. */
function valueOf(shown: string): number {
  const js = shown
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt($1)')
    .replace(/\\pi/g, 'Math.PI')
    .replace(/(^|[^a-zA-Z])e(?![a-zA-Z])/g, '$1Math.E')
    .replace(/(\d)(Math)/g, '$1*$2')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))');
  return new Function(`return ${js};`)() as number;
}

const pointsOf = (d: BankDef): string[] => ('points' in d ? d.points.map((p) => p.text) : []);
const handWritten = (defs: BankDef[]) => defs.filter((d) => d.subject === 'mathematics' && !d.origin && d.form === 'theory' && bankFormatOf(d) === 'numerical');

describe.each([['XII', XII], ['XI', XI]] as const)('Mathematics %s', (level, checks) => {
  it.each(checks)('%s', async (text, computed, shown) => {
    const { defs } = await loadBank('mathematics', level);
    const found = handWritten(defs).filter((d) => 'text' in d && d.text.includes(text));
    expect(found.length, `questions matching “${text}”`).toBe(1);
    const points = pointsOf(found[0]);
    const last = points[points.length - 1];
    const number = shown.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    expect(last, 'the answer is in the last marking point').toMatch(new RegExp(`(^|[^0-9.])${number}($|[^0-9.])`));
    expect(Math.abs(valueOf(shown) - computed), `${shown} against ${computed}`).toBeLessThan(1e-4);
  });

  it('has a check for every hand-written numerical', async () => {
    const { defs } = await loadBank('mathematics', level);
    const unchecked = handWritten(defs).filter((d) => !checks.some(([text]) => 'text' in d && d.text.includes(text)));
    expect(unchecked.map((d) => ('text' in d ? d.text.slice(0, 70) : ''))).toEqual([]);
  });
});

// A solver computes whatever a question feeds it, so a question wired to the wrong quantities still gives an answer. These work
// each one out from the physics, in the unit the question shows, and compare. Every written numerical file has to be covered.
const k = 8.99e9;
const eps0 = 8.85e-12;
const h = 6.63e-34;
const c = 3e8;
const q_e = 1.6e-19;
const PHYSICS_XII: [text: string, ...answers: number[]][] = [
  ['Two small charged spheres', (k * 3e-6 * 5e-6) / 0.3 ** 2],
  ['Two equal charges of 2 × 10⁻⁶ C repel', 100 * sqrt((k * 2e-6 ** 2) / 0.9)],
  ['electric field 20 cm from', (k * 8e-9) / 0.2 ** 2],
  ['Van de Graaff dome', (3.6e5 * 0.5 ** 2) / k],
  ['plastic comb', 3.2e-9 / q_e],
  ['dipole of moment 4 × 10⁻⁹', 4e-9 * 5e4 * sin(30 * deg)],
  ['dipole of moment 2 × 10⁻⁸', 6e-4 / 2e-8],
  ['very large flat sheet', 1.77e-6 / (2 * eps0)],
  ['plates 2 cm apart', 100 / 0.02],
  ['cell membrane', 0.07 / 8e-9],
  ['potential 10 cm from', (k * 2e-9) / 0.1],
  ['How far from a charge of 5 × 10⁻⁹', (100 * k * 5e-9) / 150],
  ['It takes 6 × 10⁻⁵ J', 6e-5 / 2e-6],
  ['potential energy of a charge of 4 × 10⁻⁶', 4e-6 * 500],
  ['potential energy of two charges', (k * 3e-6 * 6e-6) / 0.09],
  ['plates of area 200 cm²', (eps0 * 200e-4) / 1e-3],
  ['plates of area 100 cm², 0.5 mm apart', (5 * eps0 * 100e-4) / 0.5e-3],
  ['camera flash', 0.5 * 200e-6 * 300 ** 2],
  ['defibrillator must store', sqrt((2 * 200) / 50e-6)],
  ['Capacitors of 6 μF and 3 μF', 1 / (1 / 6e-6 + 1 / 3e-6)],
  ['4 μF capacitor at 100 V', 0.5 * ((4e-6 * 2e-6) / 6e-6) * 60 ** 2],
  ['plates of area 500 cm²', (eps0 * 500e-4) / 2e-3, 0.5 * ((eps0 * 500e-4) / 2e-3) * 60 ** 2, (4 * eps0 * 500e-4) / 2e-3],
  ['torch bulb', 15 * 0.2],
  ['copper wire 50 m long', (1.7e-8 * 50) / 2e-6],
  ['resistance of 4 Ω, a length of 2 m', (4 * 0.5e-6) / 2],
  ['platinum wire', 10 * (1 + 3.9e-3 * 100)],
  ['heating coil', (26 / 20 - 1) / 5e-3],
  ['230 V kettle', 230 * 8],
  ['60 W lamp', 60 / 230],
  ['heater runs on 230 V', 230 * 5 * 600],
  ['copper wire of cross-section 1 mm²', 2 / (8.5e28 * q_e * 1e-6)],
  ['cross-section 2 mm² carries 3 A', 3 / 2e-6],
  ['joined to a 2.5 Ω resistor', 1.5 / 3],
  ['car battery', 12 - 60 * 0.05],
  ['terminal voltage of 1.6 V', (2 - 1.6) / 0.8],
  ['if its terminals are shorted', 1.5 / 0.3],
  ['Six cells', (6 * 1.5) / (2 * 4 + 3 * 0.2)],
  ['Wheatstone bridge', (20 * 15) / 10],
  ['meter bridge balances at 40 cm', (30 * 60) / 40],
  ['potentiometer, a cell of emf 1.5 V', (1.5 * 80) / 60],
  ['Resistors of 6 Ω and 12 Ω', 1 / (1 / 6 + 1 / 12)],
  ['battery of emf 9 V', 1 / (1 / 6 + 1 / 3), 9 / (2 + 1), 9 - 3 * 1],
  ['50 cm metal rod', 0.3 * 0.5 * 4],
  ['wingspan of an aircraft', 0.4 / (4e-5 * 40)],
  ['2 H coil', 0.5 * 2 * 3 ** 2],
  ['0.5 H inductor', sqrt((2 * 4) / 0.5)],
  ['100 turns and area 200 cm²', 100 * 0.2 * 200e-4 * 50],
  ['generator coil of 200 turns', 100 / (200 * 0.1 * 0.05)],
  ['peak voltage of 325 V', 325 / sqrt(2)],
  ['rms value of 5 A', 5 * sqrt(2)],
  ['R = 30 Ω, a reactance', hypot(30, 80 - 40)],
  ['impedance of 13 Ω', sqrt(13 ** 2 - 5 ** 2) + 4],
  ['L = 10 mH and C = 100 μF', 1 / sqrt(10e-3 * 100e-6)],
  ['L = 2 mH and C = 500 pF', 1 / (2 * PI * sqrt(2e-3 * 500e-12))],
  ['must tune to 1 MHz', 1 / ((2 * PI * 1e6) ** 2 * 100e-6)],
  ['230 V and 5 A, with a phase angle', 230 * 5 * cos(60 * deg)],
  ['R = 40 Ω and an impedance of 50 Ω', acos(40 / 50) / deg],
  ['200 primary turns', (230 * 1000) / 200],
  ['phone charger', (5 * 2) / 230],
  ['resonates at 1000 rad/s', (1000 * 50e-3) / 10],
  ['R = 60 Ω, X_L = 100 Ω', hypot(60, 80), acos(60 / 100) / deg, 200 * 2 * (60 / 100)],
  ['30 cm in front of a concave mirror', 1 / (-1 / 10 + 1 / 30)],
  ['dentist', 1 / (1 / 30 - 1 / 10)],
  ['20 cm from a convex lens', 1 / (1 / 15 - 1 / 20)],
  ['real image 40 cm from it', 1 / (1 / 40 + 1 / 40)],
  ['radius of curvature of 40 cm', 40 / 2],
  ['angle of incidence of 45°', asin(sin(45 * deg) / 1.5) / deg],
  ['from glass of refractive index 1.5 into air', asin(1 / 1.5) / deg],
  ['optical fibre', asin(1.4 / 1.6) / deg],
  ['2 × 10⁸ m/s in a certain glass', c / 2e8],
  ['prism of angle 60° has a minimum deviation of 40°', sin(50 * deg) / sin(30 * deg)],
  ['thin prism of angle 5°', 0.5 * 5],
  ['double convex lens', 1 / (0.5 * (1 / 20 + 1 / 30))],
  ['focal lengths +20 cm and +30 cm', 1 / (1 / 20 + 1 / 30)],
  ['simple microscope', 1 + 25 / 5],
  ['objective of focal length 100 cm', 100 / 5],
  ['focal lengths 80 cm and 4 cm', 80 + 4],
  ['magnify 30 times', 30 * 2.5],
  ['slits are 0.2 mm apart', ((600e-9 * 1) / 0.2e-3) * 1000],
  ['slits are 0.5 mm apart', (1.8e-3 * 0.5e-3) / 1.5],
  ['Polarised light', 80 * cos(60 * deg) ** 2],
  ['refractive index 1.33', 600e-9 / 1.33],
  ['single slit', ((2 * 500e-9 * 2) / 4e-3) * 1000],
  ['energy of a photon of frequency 6', h * 6e14],
  ['momentum of a photon', h / 500e-9],
  ['momentum of 2.21 × 10⁻²⁷', h / 2.21e-27],
  ['work function of 3.2 × 10⁻¹⁹ J. Find its threshold frequency', 3.2e-19 / h],
  ['threshold wavelength', (h * c) / 4e-19],
  ['8 × 10¹⁴ Hz falls', h * 8e14 - 3e-19],
  ['1.5 × 10¹⁵ Hz falls', (h * 1.5e15 - 4.8e-19) / q_e],
  ['moves at 2 × 10⁶ m/s. Find its de Broglie', h / (9.1e-31 * 2e6)],
  ['electron microscope', h / sqrt(2 * 9.1e-31 * 1.6e-16)],
  ['frequency 7 × 10¹⁴ Hz', h * 7e14, 3.2e-19 / h, (h * 7e14 - 3.2e-19) / q_e],
  ['level n = 4', (4 * 3) / 2],
  ['10 spectral lines', 5],
  ['decay constant of 0.0693 per day', Math.LN2 / 0.0693],
  ['half-life of 6 hours', Math.LN2 / (6 * 3600)],
  ['decay constant of 0.02 per second', 1 / 0.02],
  ['80 g of a nuclide', 80 / 2 ** 3],
  ['40 mg of a tracer', 8 * Math.log2(40 / 5)],
  ['10¹⁰ nuclei', 1e10 * E ** -1],
  ['mass number 64', 1.2 * 64 ** (1 / 3)],
  ['radius of 3.6 fm', (3.6 / 1.2) ** 3],
];

const physicsFiles = import.meta.glob<{ default: BankDef[] }>('../../src/practice/bank/written/physics-xii-*-numericals.ts', { eager: true });

describe('Physics XII numericals, worked from the physics', () => {
  const defs = Object.values(physicsFiles).flatMap((m) => m.default);
  const textOf = (d: BankDef) => ('text' in d ? d.text : '');

  it.each(PHYSICS_XII)('%s', async (text, ...answers) => {
    const found = defs.filter((d) => textOf(d).includes(text));
    expect(found.length, `questions matching “${text}”`).toBe(1);
    const bank = await loadBank('physics', 'XII');
    const item = instantiate(found[0], bank, seededRng(1)) as NumericItem;
    expect(item.parts.length).toBe(answers.length);
    item.parts.forEach((part, i) => {
      expect(part.question.answers.length, `${text}: one answer for part ${i + 1}`).toBe(1);
      expect(abs(part.question.answers[0] / answers[i] - 1), `${text}, part ${i + 1}: ${part.question.answerText} against ${answers[i]}`).toBeLessThan(0.02);
    });
  });

  it('has a check for every numerical in those files', () => {
    expect(defs.filter((d) => !PHYSICS_XII.some(([text]) => textOf(d).includes(text))).map((d) => textOf(d).slice(0, 70))).toEqual([]);
  });
});
