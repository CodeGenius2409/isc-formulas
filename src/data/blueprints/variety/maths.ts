// Mathematics: many different ways of asking in each topic, written by hand, since a formula with random numbers doesn't read
// like Mathematics. Each question is built backwards from a clean answer, in exact arithmetic, so that the working can be shown
// and the numbers are ones an examiner would choose.
import { frac, type Frac, nCr, factorial, det2, det3, matrixTex } from '../../../practice/gen/exact';
import type { Difficulty } from '../../../practice/bank/types';
import { tidy, type Gen } from '../../../practice/gen/gen';
import type { ClassLevel } from '../../types';
import type { Blueprint, Body } from '../types';

/** The question, its answer, the working, and how the answer reads if it isn't plain. */
type Made = [text: string, answer: number | Frac, working: string[], shown?: string];
type Row = [key: string, marks: number, difficulty: Difficulty, make: (g: Gen) => Made];

const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const pi = (n: number, d: number) => {
  const c = gcd(n, d);
  const a = n / c;
  const b = d / c;
  return `${a === 1 ? '' : a}π${b === 1 ? '' : `/${b}`}`;
};
const sq = (x: number) => x * x;
/** Corners in order round a region. A linear programme's region is always convex, so a set that isn't can't be asked. */
function isConvex(points: number[][]): boolean {
  return points.every((p, i) => {
    const q = points[(i + 1) % points.length];
    const r = points[(i + 2) % points.length];
    return (q[0] - p[0]) * (r[1] - q[1]) - (q[1] - p[1]) * (r[0] - q[0]) > 0;
  });
}

const TOPICS: Record<string, Row[]> = {
  'XI 1a': [
    ['union', 2, 1, (g) => { const a = g.int(20, 60), b = g.int(15, 50), c = g.int(4, Math.min(a, b) - 3); return [`In a survey, ${a} students read magazine A, ${b} read magazine B, and ${c} read both. How many read at least one?`, a + b - c, [`n(A \\cup B) = ${a} + ${b} - ${c} = ${a + b - c}`]]; }],
    ['both', 2, 2, (g) => { const a = g.int(20, 60), b = g.int(15, 50), c = g.int(4, Math.min(a, b) - 3); return [`Of ${a + b - c} members of a club, each plays chess or carrom. ${a} play chess and ${b} play carrom. How many play both?`, c, [`n(A \\cap B) = ${a} + ${b} - ${a + b - c} = ${c}`]]; }],
    ['only', 2, 1, (g) => { const a = g.int(20, 60), b = g.int(15, 50), c = g.int(4, Math.min(a, b) - 3); return [`If $n(A) = ${a}$, $n(B) = ${b}$ and $n(A \\cap B) = ${c}$, find $n(A - B)$.`, a - c, [`n(A - B) = ${a} - ${c} = ${a - c}`]]; }],
    ['neither', 3, 2, (g) => { const a = g.int(20, 60), b = g.int(15, 50), c = g.int(4, Math.min(a, b) - 3), r = g.int(3, 20), u = a + b - c + r; return [`A hostel has ${u} students. ${a} drink tea, ${b} drink coffee, and ${c} drink both. How many drink neither?`, r, [`n(A \\cup B) = ${a} + ${b} - ${c} = ${u - r}`, `\\text{Neither} = ${u} - ${u - r} = ${r}`]]; }],
    ['subsets', 1, 1, (g) => { const n = g.int(3, 8); return [`How many subsets does a set with ${n} elements have?`, 2 ** n, [`2^{${n}} = ${2 ** n}`]]; }],
    ['proper', 1, 1, (g) => { const n = g.int(3, 8); return [`How many proper subsets does a set with ${n} elements have?`, 2 ** n - 1, [`2^{${n}} - 1 = ${2 ** n - 1}`]]; }],
    ['from-subsets', 2, 2, (g) => { const n = g.int(4, 9); return [`A set has ${2 ** n} subsets. How many elements does it have?`, n, [`2^n = ${2 ** n} \\Rightarrow n = ${n}`]]; }],
    ['three', 3, 3, (g) => { const abc = g.int(2, 5), ab = abc + g.int(2, 6), bc = abc + g.int(2, 6), ca = abc + g.int(2, 6), a = ab + ca + g.int(5, 15), b = ab + bc + g.int(5, 15), c = bc + ca + g.int(5, 15), u = a + b + c - ab - bc - ca + abc; return [`Given $n(A) = ${a}$, $n(B) = ${b}$, $n(C) = ${c}$, $n(A \\cap B) = ${ab}$, $n(B \\cap C) = ${bc}$, $n(C \\cap A) = ${ca}$ and $n(A \\cap B \\cap C) = ${abc}$, find $n(A \\cup B \\cup C)$.`, u, [`${a} + ${b} + ${c} - ${ab} - ${bc} - ${ca} + ${abc} = ${u}`]]; }],
    ['exactly-one', 3, 3, (g) => { const a = g.int(20, 60), b = g.int(15, 50), c = g.int(4, Math.min(a, b) - 3); return [`In a class, ${a} students take art, ${b} take music, and ${c} take both. How many take exactly one of them?`, a + b - 2 * c, [`(${a} - ${c}) + (${b} - ${c}) = ${a + b - 2 * c}`]]; }],
  ],
  'XI 1c': [
    ['arc', 2, 1, (g) => { const r = g.pick([6, 9, 12, 18]), t = g.pick([30, 60, 90, 120]); return [`Find the length of an arc of a circle of radius ${r} cm that subtends ${t}° at the centre. Give your answer in terms of π.`, (r * t * Math.PI) / 180, [`s = r\\theta = ${r} \\times \\frac{${t}\\pi}{180}`], `${pi(r * t, 180)} cm`]; }],
    ['cos-from-sin', 1, 1, (g) => { const [a, b, c] = g.pick(TRIPLES); return [`If $\\sin A = \\frac{${a}}{${c}}$ and $A$ is acute, find $\\cos A$.`, frac(b, c), [`\\cos A = \\sqrt{1 - \\frac{${a * a}}{${c * c}}} = \\frac{${b}}{${c}}`]]; }],
    ['tan-from-cos', 2, 2, (g) => { const [a, b, c] = g.pick(TRIPLES); return [`If $\\cos A = -\\frac{${b}}{${c}}$ and $A$ lies in the second quadrant, find $\\tan A$.`, frac(-a, b), [`\\sin A = \\frac{${a}}{${c}} \\text{ (positive there)}`, `\\tan A = -\\frac{${a}}{${b}}`]]; }],
    ['sin2a', 2, 2, (g) => { const [a, b, c] = g.pick(TRIPLES); return [`If $\\sin A = \\frac{${a}}{${c}}$ with $A$ acute, find $\\sin 2A$.`, frac(2 * a * b, c * c), [`\\cos A = \\frac{${b}}{${c}}`, `\\sin 2A = 2 \\cdot \\frac{${a}}{${c}} \\cdot \\frac{${b}}{${c}}`]]; }],
    ['cos2a', 2, 2, (g) => { const [a, , c] = g.pick(TRIPLES); return [`If $\\sin A = \\frac{${a}}{${c}}$, find $\\cos 2A$.`, frac(c * c - 2 * a * a, c * c), [`\\cos 2A = 1 - 2\\sin^2 A = 1 - \\frac{${2 * a * a}}{${c * c}}`]]; }],
    ['tan-sum', 2, 2, (g) => { const p = g.pick([2, 3, 4]), q = g.pick([3, 5, 7].filter((x) => x !== p)); const t = frac(p + q, p * q - 1); return [`If $\\tan A = \\frac{1}{${p}}$ and $\\tan B = \\frac{1}{${q}}$, find $\\tan(A + B)$.`, t, [`\\tan(A+B) = \\frac{\\frac{1}{${p}} + \\frac{1}{${q}}}{1 - \\frac{1}{${p * q}}} = ${t.tex()}`]]; }],
    ['sin-sum', 3, 3, (g) => { const [a, b, c] = TRIPLES[0], [d, e, f] = TRIPLES[1]; void g; return [`If $\\sin A = \\frac{${a}}{${c}}$ and $\\cos B = \\frac{${e}}{${f}}$, with $A$ and $B$ acute, find $\\sin(A + B)$.`, frac(a * e + b * d, c * f), [`\\cos A = \\frac{${b}}{${c}},\\ \\sin B = \\frac{${d}}{${f}}`, `\\sin(A+B) = \\frac{${a}\\cdot${e} + ${b}\\cdot${d}}{${c * f}}`]]; }],
    ['area', 2, 1, (g) => { const a = g.pick([4, 6, 8, 10, 12]), b = g.pick([5, 6, 7, 9, 11]); return [`Two sides of a triangle are ${a} cm and ${b} cm, with an angle of 30° between them. Find its area.`, (a * b) / 4, [`\\frac{1}{2} \\times ${a} \\times ${b} \\times \\sin 30^\\circ`], `${tidy((a * b) / 4, 4)} cm²`]; }],
    ['cosine-rule', 3, 2, (g) => { const a = g.int(3, 9), b = g.int(4, 12); const c = Math.sqrt(a * a + b * b - a * b); return [`In a triangle, two sides are ${a} cm and ${b} cm, and the angle between them is 60°. Find the third side, to 2 decimal places.`, c, [`c^2 = ${a * a} + ${b * b} - 2(${a})(${b})\\cos 60^\\circ = ${a * a + b * b - a * b}`], `${c.toFixed(2)} cm`]; }],
  ],
  'XI 2a': [
    ['modulus', 1, 1, (g) => { const [a, b, c] = g.pick(TRIPLES); return [`Find the modulus of $${a} + ${b}i$.`, c, [`\\sqrt{${a * a} + ${b * b}} = ${c}`]]; }],
    ['conj-product', 2, 1, (g) => { const a = g.int(2, 9), b = g.int(2, 9); return [`Find $z\\bar{z}$ when $z = ${a} - ${b}i$.`, a * a + b * b, [`z\\bar{z} = ${a}^2 + ${b}^2`]]; }],
    ['real-product', 2, 2, (g) => { const a = g.int(1, 6), b = g.int(2, 6), c = g.int(1, 6), d = g.int(2, 6); if (a * c === b * d) g.retry(); return [`Find the real part of $(${a} + ${b}i)(${c} + ${d}i)$.`, a * c - b * d, [`${a}\\cdot${c} - ${b}\\cdot${d}`]]; }],
    ['imag-square', 2, 2, (g) => { const a = g.int(2, 7), b = g.int(2, 7); return [`Find the imaginary part of $(${a} + ${b}i)^2$.`, 2 * a * b, [`2 \\cdot ${a} \\cdot ${b}`]]; }],
    ['i-power', 1, 1, (g) => { const n = 4 * g.int(5, 40) + g.pick([0, 2]); return [`Evaluate $i^{${n}}$.`, n % 4 === 0 ? 1 : -1, [`${n} \\div 4 \\text{ leaves } ${n % 4}`]]; }],
    ['divide', 3, 3, (g) => { const a = g.int(1, 6), b = g.int(1, 6), c = g.int(1, 4), d = g.int(1, 4); if (a * c + b * d === 0) g.retry(); return [`Find the real part of $\\dfrac{${a} + ${b}i}{${c} + ${d}i}$.`, frac(a * c + b * d, c * c + d * d), [`\\text{Multiply above and below by } ${c} - ${d}i`, `\\text{Real part} = \\frac{${a * c + b * d}}{${c * c + d * d}}`]]; }],
    ['sum-roots', 2, 2, (g) => { const a = g.int(1, 5), b = g.int(1, 6); return [`The equation $x^2 - ${2 * a}x + ${a * a + b * b} = 0$ has complex roots. Find the imaginary part of the root with positive imaginary part.`, b, [`x = \\frac{${2 * a} \\pm \\sqrt{${4 * a * a} - ${4 * (a * a + b * b)}}}{2} = ${a} \\pm ${b}i`]]; }],
    ['mod-square', 2, 2, (g) => { const [a, b, c] = g.pick(TRIPLES); return [`Find $|z^2|$ when $z = ${a} + ${b}i$.`, c * c, [`|z^2| = |z|^2 = ${c}^2`]]; }],
    ['arg-axis', 1, 1, (g) => { const a = g.int(2, 9); return [`Find the argument of $${a} + ${a}i$, in degrees.`, 45, [`\\tan\\theta = 1`], '45°']; }],
    ['equal', 2, 2, (g) => { const a = g.int(1, 5), x = g.int(2, 9), y = a + g.int(1, 7); return [`If $(x + ${a}) + (y - ${a})i = ${x + a} + ${y - a}i$, find $x + y$.`, x + y, [`x = ${x},\\ y = ${y}`]]; }],
  ],
  'XI 2b': [
    ['sum', 1, 1, (g) => { const a = g.int(2, 9), b = g.int(1, 9), c = g.int(1, 9); return [`Find the sum of the roots of $${a}x^2 - ${b}x - ${c} = 0$.`, frac(b, a), [`\\alpha + \\beta = -\\frac{b}{a} = ${frac(b, a).tex()}`]]; }],
    ['product', 1, 1, (g) => { const a = g.int(2, 9), b = g.int(1, 9), c = g.int(1, 9); return [`Find the product of the roots of $${a}x^2 + ${b}x + ${c} = 0$.`, frac(c, a), [`\\alpha\\beta = \\frac{c}{a} = ${frac(c, a).tex()}`]]; }],
    ['equal-roots', 2, 2, (g) => { const r = g.int(2, 9); return [`Find the positive value of $k$ for which $x^2 + kx + ${r * r} = 0$ has equal roots.`, 2 * r, [`k^2 - 4(${r * r}) = 0`, `k = ${2 * r}`]]; }],
    ['discriminant', 1, 1, (g) => { const a = g.int(1, 5), b = g.int(2, 9), c = g.int(1, 5); return [`Find the discriminant of $${a === 1 ? '' : a}x^2 + ${b}x + ${c} = 0$.`, b * b - 4 * a * c || g.retry(), [`${b}^2 - 4(${a})(${c})`]]; }],
    ['squares', 3, 2, (g) => { const s = g.int(3, 9), p = g.int(1, 6); return [`If $\\alpha$ and $\\beta$ are the roots of $x^2 - ${s}x + ${p} = 0$, find $\\alpha^2 + \\beta^2$.`, s * s - 2 * p, [`(\\alpha+\\beta)^2 - 2\\alpha\\beta = ${s * s} - ${2 * p}`]]; }],
    ['reciprocals', 2, 2, (g) => { const s = g.int(3, 9), p = g.int(2, 7); return [`If $\\alpha$ and $\\beta$ are the roots of $x^2 - ${s}x + ${p} = 0$, find $\\dfrac{1}{\\alpha} + \\dfrac{1}{\\beta}$.`, frac(s, p), [`\\frac{\\alpha+\\beta}{\\alpha\\beta} = ${frac(s, p).tex()}`]]; }],
    ['larger-root', 2, 1, (g) => { const a = g.int(1, 6), b = a + g.int(1, 6); return [`Solve $x^2 - ${a + b}x + ${a * b} = 0$, and give the larger root.`, b, [`(x - ${a})(x - ${b}) = 0`]]; }],
    ['other-root', 2, 2, (g) => { const a = g.int(1, 6), b = a + g.int(1, 6); return [`One root of $x^2 - ${a + b}x + k = 0$ is ${a}. Find $k$.`, a * b, [`\\text{The other root is } ${b}`, `k = ${a} \\times ${b}`]]; }],
    ['difference', 3, 3, (g) => { const a = g.int(1, 6), d = g.int(1, 7), b = a + d; return [`Find the positive difference between the roots of $x^2 - ${a + b}x + ${a * b} = 0$, without solving it.`, d, [`(\\alpha-\\beta)^2 = (\\alpha+\\beta)^2 - 4\\alpha\\beta = ${sq(a + b)} - ${4 * a * b} = ${d * d}`]]; }],
  ],
  'XI 2c': [
    ['word', 2, 2, (g) => { const [w, n] = g.pick([['LEVEL', 30], ['BANANA', 60], ['COTTON', 180], ['MISSISSIPPI', 34650], ['APPLE', 60]] as [string, number][]); return [`How many different arrangements are there of the letters of the word ${w}?`, n, [`\\text{Divide by the factorial of each repeat count.}`], String(n)]; }],
    ['together', 3, 2, (g) => { const n = g.int(4, 7); const a = factorial(n - 1) * 2; return [`${n} friends sit in a row for a photo. In how many ways can they sit if two particular friends must sit together?`, a, [`\\text{Treat the pair as one: } ${n - 1}! \\times 2!`], String(a)]; }],
    ['apart', 3, 3, (g) => { const n = g.int(4, 7); const a = factorial(n) - factorial(n - 1) * 2; return [`${n} friends sit in a row. In how many ways can they sit if two particular friends must not sit together?`, a, [`${n}! - ${n - 1}! \\times 2!`], String(a)]; }],
    ['handshakes', 1, 1, (g) => { const n = g.int(6, 20); return [`At a meeting of ${n} people, each shakes hands once with every other. How many handshakes are there?`, nCr(n, 2), [`{}^{${n}}C_2`], String(nCr(n, 2))]; }],
    ['diagonals', 2, 2, (g) => { const n = g.int(5, 14); const a = (n * (n - 3)) / 2; return [`How many diagonals does a polygon with ${n} sides have?`, a, [`{}^{${n}}C_2 - ${n}`], String(a)]; }],
    ['digits', 2, 2, (g) => { const n = g.int(5, 8); const a = n * (n - 1) * (n - 2); return [`How many 3-digit numbers can be made from ${n} different non-zero digits, with no digit repeated?`, a, [`{}^{${n}}P_3 = ${n} \\times ${n - 1} \\times ${n - 2}`], String(a)]; }],
    ['find-n', 2, 2, (g) => { const n = g.int(5, 15); return [`If $^{n}P_2 = ${n * (n - 1)}$, find $n$.`, n, [`n(n-1) = ${n * (n - 1)}`]]; }],
    ['symmetry', 2, 2, (g) => { const a = g.int(2, 7), b = a + g.int(1, 5); return [`If $^{n}C_{${a}} = {}^{n}C_{${b}}$, find $n$.`, a + b, [`n = ${a} + ${b}`]]; }],
    ['at-least', 3, 3, (g) => { const m = g.int(4, 7), w = g.int(3, 5), k = g.int(3, 4); const a = nCr(m + w, k) - nCr(m, k); return [`A committee of ${k} is chosen from ${m} men and ${w} women. In how many ways can it include at least one woman?`, a, [`{}^{${m + w}}C_{${k}} - {}^{${m}}C_{${k}}`], String(a)]; }],
    ['committee', 3, 2, (g) => { const m = g.int(4, 8), w = g.int(3, 6); const a = nCr(m, 2) * nCr(w, 2); return [`A team of 2 men and 2 women is chosen from ${m} men and ${w} women. How many teams are possible?`, a, [`{}^{${m}}C_2 \\times {}^{${w}}C_2`], String(a)]; }],
  ],
  'XI 2d': [
    ['coefficient', 2, 1, (g) => { const n = g.int(5, 10), k = g.int(2, n - 2); return [`Find the coefficient of $x^{${k}}$ in the expansion of $(1 + x)^{${n}}$.`, nCr(n, k), [`{}^{${n}}C_{${k}}`], String(nCr(n, k))]; }],
    ['scaled', 3, 2, (g) => { const n = g.int(4, 7), k = g.int(2, 3), a = g.int(2, 3); return [`Find the coefficient of $x^{${k}}$ in the expansion of $(1 + ${a}x)^{${n}}$.`, nCr(n, k) * a ** k, [`{}^{${n}}C_{${k}} \\times ${a}^{${k}}`], String(nCr(n, k) * a ** k)]; }],
    ['middle', 2, 2, (g) => { const m = g.int(2, 5); return [`Find the coefficient of the middle term in the expansion of $(1 + x)^{${2 * m}}$.`, nCr(2 * m, m), [`\\text{The middle term is number } ${m + 1}`, `{}^{${2 * m}}C_{${m}}`], String(nCr(2 * m, m))]; }],
    ['sum-coeffs', 1, 1, (g) => { const n = g.int(4, 10); return [`Find the sum of all the coefficients in the expansion of $(1 + x)^{${n}}$.`, 2 ** n, [`\\text{Put } x = 1: 2^{${n}}`], String(2 ** n)]; }],
    ['sum-scaled', 2, 2, (g) => { const n = g.int(3, 6), a = g.int(2, 3); return [`Find the sum of the coefficients in the expansion of $(1 + ${a}x)^{${n}}$.`, (1 + a) ** n, [`\\text{Put } x = 1: ${1 + a}^{${n}}`], String((1 + a) ** n)]; }],
    ['terms', 1, 1, (g) => { const n = g.int(5, 20); return [`How many terms are there in the expansion of $(a + b)^{${n}}$?`, n + 1, [`n + 1`]]; }],
    ['constant', 3, 3, (g) => { const m = g.int(2, 5); return [`Find the term independent of $x$ in the expansion of $\\left(x + \\dfrac{1}{x}\\right)^{${2 * m}}$.`, nCr(2 * m, m), [`T_{r+1} = {}^{${2 * m}}C_r\\, x^{${2 * m} - 2r}`, `r = ${m}`], String(nCr(2 * m, m))]; }],
    ['nth-term', 3, 2, (g) => { const n = g.int(5, 8), r = g.int(2, 3), a = g.int(2, 3); return [`Find the numerical coefficient of the term number ${r + 1} in $(${a}x + 1)^{${n}}$, counting from the highest power of $x$.`, nCr(n, r) * a ** (n - r), [`{}^{${n}}C_{${r}} \\times ${a}^{${n - r}}`], String(nCr(n, r) * a ** (n - r))]; }],
    ['alternate', 2, 3, (g) => { const n = g.int(4, 9); return [`Find the sum of the coefficients of the odd powers of $x$ in $(1 + x)^{${n}}$.`, 2 ** (n - 1), [`\\text{Half of } 2^{${n}}`], String(2 ** (n - 1))]; }],
  ],
  'XI 2e': [
    ['find-d', 2, 1, (g) => { const a = g.int(2, 9), d = g.int(2, 7), n = g.int(6, 15); return [`The first term of an AP is ${a} and its term number ${n} is ${a + (n - 1) * d}. Find the common difference.`, d, [`${a} + ${n - 1}d = ${a + (n - 1) * d}`]]; }],
    ['find-n', 2, 2, (g) => { const a = g.int(2, 9), d = g.int(2, 7), n = g.int(8, 25); return [`Which term of the AP ${a}, ${a + d}, ${a + 2 * d}, … is ${a + (n - 1) * d}?`, n, [`${a} + (n-1)${d} = ${a + (n - 1) * d}`]]; }],
    ['savings', 3, 2, (g) => { const a = g.pick([100, 200, 500]), d = g.pick([50, 100]), n = g.int(10, 24); const s = (n * (2 * a + (n - 1) * d)) / 2; return [`A student saves ₹${a} in the first month and ₹${d} more each month after that. How much is saved in ${n} months?`, s, [`S_n = \\frac{${n}}{2}(2 \\cdot ${a} + ${n - 1} \\cdot ${d})`], `₹${s}`]; }],
    ['gp-term', 2, 1, (g) => { const a = g.int(2, 5), r = g.int(2, 3), n = g.int(4, 7); return [`Find term number ${n} of the GP ${a}, ${a * r}, ${a * r * r}, …`, a * r ** (n - 1), [`${a} \\times ${r}^{${n - 1}}`], String(a * r ** (n - 1))]; }],
    ['gp-sum', 3, 2, (g) => { const a = g.int(2, 5), r = g.int(2, 3), n = g.int(4, 7); const s = (a * (r ** n - 1)) / (r - 1); return [`Find the sum of the first ${n} terms of the GP ${a}, ${a * r}, ${a * r * r}, …`, s, [`\\frac{${a}(${r}^{${n}} - 1)}{${r - 1}}`], String(s)]; }],
    ['infinite', 2, 2, (g) => { const a = g.pick([4, 6, 8, 9, 12]), d = g.pick([2, 3, 4, 5]); return [`Find the sum to infinity of the GP with first term ${a} and common ratio $\\frac{1}{${d}}$.`, frac(a * d, d - 1), [`\\frac{${a}}{1 - \\frac{1}{${d}}}`]]; }],
    ['am', 1, 1, (g) => { const a = g.int(2, 20), b = a + 2 * g.int(1, 10); return [`Find the arithmetic mean of ${a} and ${b}.`, (a + b) / 2, [`\\frac{${a} + ${b}}{2}`]]; }],
    ['gm', 1, 1, (g) => { const r = g.int(2, 5), a = g.int(1, 4), b = a * r * r; return [`Find the positive geometric mean of ${a} and ${b}.`, a * r, [`\\sqrt{${a} \\times ${b}}`]]; }],
    ['sum-naturals', 2, 2, (g) => { const n = g.int(8, 25); const s = (n * (n + 1) * (2 * n + 1)) / 6; return [`Find $1^2 + 2^2 + 3^2 + \\dots + ${n}^2$.`, s, [`\\frac{n(n+1)(2n+1)}{6}`], String(s)]; }],
    ['sn-to-term', 3, 3, (g) => { const p = g.int(1, 4), q = g.int(1, 5), n = g.int(5, 12); return [`The sum of the first $n$ terms of a sequence is $${p === 1 ? '' : p}n^2 + ${q}n$. Find term number ${n}.`, p * (2 * n - 1) + q, [`a_n = S_n - S_{n-1} = ${p}(2n - 1) + ${q}`]]; }],
  ],
  'XI 3a': [
    ['slope', 1, 1, (g) => { const x = g.int(1, 5), y = g.int(1, 5), a = g.int(1, 5), b = g.int(1, 7); return [`Find the slope of the line through $(${x}, ${y})$ and $(${x + a}, ${y + b})$.`, frac(b, a), [`\\frac{${b}}{${a}}`]]; }],
    ['perpendicular', 1, 1, (g) => { const a = g.int(2, 7), b = g.int(1, 7); return [`A line has slope $${frac(a, b).tex()}$. Find the slope of a line perpendicular to it.`, frac(-b, a), [`m_1 m_2 = -1`]]; }],
    ['point-line', 3, 2, (g) => { const [a, b, c] = g.pick(TRIPLES), x = g.int(1, 4), y = g.int(1, 4), k = g.int(1, 4), d = a * x + b * y + -c * k; return [`Find the distance of the point $(${x}, ${y})$ from the line $${a}x + ${b}y - ${c * k} = 0$.`, frac(Math.abs(d), c), [`\\frac{|${a}(${x}) + ${b}(${y}) - ${c * k}|}{\\sqrt{${a}^2 + ${b}^2}}`]]; }],
    ['parallel', 3, 2, (g) => { const [a, b, c] = g.pick(TRIPLES), p = g.int(1, 9), q = p + g.int(1, 9); return [`Find the distance between the parallel lines $${a}x + ${b}y + ${p} = 0$ and $${a}x + ${b}y + ${q} = 0$.`, frac(q - p, c), [`\\frac{|${q} - ${p}|}{\\sqrt{${a}^2 + ${b}^2}}`]]; }],
    ['midpoint', 1, 1, (g) => { const x = g.int(1, 9), y = g.int(1, 9), a = 2 * g.int(1, 6); return [`Find the x-coordinate of the midpoint of $(${x}, ${y})$ and $(${x + a}, ${y + 2})$.`, x + a / 2, [`\\frac{${x} + ${x + a}}{2}`]]; }],
    ['section', 3, 3, (g) => { const m = g.int(1, 3), n = g.int(1, 3), x1 = g.int(1, 6), step = g.int(1, 4), x2 = x1 + (m + n) * step; return [`A point divides the join of $(${x1}, 1)$ and $(${x2}, 7)$ in the ratio ${m} : ${n}. Find its x-coordinate.`, x1 + m * step, [`\\frac{${m}(${x2}) + ${n}(${x1})}{${m + n}}`]]; }],
    ['y-at', 2, 1, (g) => { const m = g.int(2, 5), c = g.int(1, 9), x = g.int(2, 9); return [`A line has slope ${m} and y-intercept ${c}. Find $y$ on it when $x = ${x}$.`, m * x + c, [`y = ${m}(${x}) + ${c}`]]; }],
    ['x-intercept', 2, 2, (g) => { const a = g.int(2, 6), k = g.int(1, 9); return [`Find the x-intercept of the line $${a}x + 3y = ${a * k}$.`, k, [`\\text{Put } y = 0: x = ${k}`]]; }],
    ['triangle', 3, 3, (g) => { const b = 2 * g.int(1, 6), h = g.int(2, 9), x = g.int(0, 4), y = g.int(0, 4); return [`Find the area of the triangle with vertices $(${x}, ${y})$, $(${x + b}, ${y})$ and $(${x}, ${y + h})$.`, (b * h) / 2, [`\\frac{1}{2} \\times ${b} \\times ${h}`]]; }],
    ['angle', 2, 2, (g) => { const m = g.int(2, 4); return [`Find $\\tan\\theta$ for the acute angle $\\theta$ between lines of slope ${m} and ${m + 1}.`, frac(1, 1 + m * (m + 1)), [`\\left|\\frac{${m + 1} - ${m}}{1 + ${m}(${m + 1})}\\right|`]]; }],
  ],
  'XI 3b': [
    ['radius', 2, 1, (g) => { const h = g.int(1, 6), k = g.int(1, 6), r = g.int(2, 9); return [`Find the radius of the circle $x^2 + y^2 - ${2 * h}x - ${2 * k}y + ${h * h + k * k - r * r} = 0$.`.replace('+ -', '- '), r, [`r = \\sqrt{${h}^2 + ${k}^2 - (${h * h + k * k - r * r})}`]]; }],
    ['centre', 1, 1, (g) => { const h = g.int(1, 9), k = g.int(1, 9); return [`Find the x-coordinate of the centre of $x^2 + y^2 - ${2 * h}x + ${2 * k}y - 7 = 0$.`, h, [`-\\frac{-${2 * h}}{2}`]]; }],
    ['area', 2, 2, (g) => { const r = g.int(2, 9); return [`Find the area of the circle $x^2 + y^2 = ${r * r}$, in terms of π.`, Math.PI * r * r, [`\\pi r^2 = \\pi(${r})^2`], `${r * r}π`]; }],
    ['tangent', 3, 2, (g) => { const [a, b, c] = g.pick(TRIPLES); return [`Find the length of the tangent from $(${c}, 0)$ to the circle $x^2 + y^2 = ${a * a}$.`, b, [`\\sqrt{${c}^2 - ${a * a}} = ${b}`]]; }],
    ['diameter', 2, 2, (g) => { const [a, b, c] = g.pick(TRIPLES), x = g.int(1, 5), y = g.int(1, 5); return [`$(${x}, ${y})$ and $(${x + 2 * a}, ${y + 2 * b})$ are the ends of a diameter. Find the radius.`, c, [`\\frac{1}{2}\\sqrt{${2 * a}^2 + ${2 * b}^2}`]]; }],
    ['through', 2, 2, (g) => { const x = g.int(1, 6), y = g.int(1, 6); return [`The circle $x^2 + y^2 = k$ passes through $(${x}, ${y})$. Find $k$.`, x * x + y * y, [`k = ${x}^2 + ${y}^2`]]; }],
    ['origin', 3, 3, (g) => { const h = g.int(1, 6), k = g.int(1, 6); return [`A circle with centre $(${h}, ${k})$ passes through the origin. Its equation is $x^2 + y^2 - ${2 * h}x - ${2 * k}y + c = 0$. Find its radius squared.`, h * h + k * k, [`r^2 = ${h}^2 + ${k}^2`, `c = 0`]]; }],
    ['chord', 3, 3, (g) => { const [a, b, c] = g.pick(TRIPLES); return [`A chord of a circle of radius ${c} cm is ${a} cm from the centre. Find its length.`, 2 * b, [`2\\sqrt{${c}^2 - ${a}^2}`], `${2 * b} cm`]; }],
    ['centres', 2, 2, (g) => { const [a, b, c] = g.pick(TRIPLES); return [`Find the distance between the centres of $x^2 + y^2 = 4$ and $(x - ${a})^2 + (y - ${b})^2 = 9$.`, c, [`\\sqrt{${a}^2 + ${b}^2}`]]; }],
    ['point-distance', 2, 1, (g) => { const [a, b, c] = g.pick(TRIPLES), r = c - g.int(1, 2); return [`The circle $x^2 + y^2 = ${r * r}$ and the point $(${a}, ${b})$ are given. How far is the point from the circle?`, c - r, [`\\sqrt{${a}^2 + ${b}^2} - ${r} = ${c} - ${r}`]]; }],
  ],
  'XI 3c': [
    ['focus', 1, 1, (g) => { const a = g.int(1, 9); return [`Find the x-coordinate of the focus of the parabola $y^2 = ${4 * a}x$.`, a, [`4a = ${4 * a}`]]; }],
    ['latus', 1, 1, (g) => { const a = g.int(1, 9); return [`Find the length of the latus rectum of $y^2 = ${4 * a}x$.`, 4 * a, [`4a`]]; }],
    ['directrix', 2, 2, (g) => { const a = g.int(1, 9); return [`The directrix of $y^2 = ${4 * a}x$ is $x = k$. Find $k$.`, -a, [`x = -a`]]; }],
    ['ellipse-e', 2, 2, (g) => { const [b, c, a] = g.pick(TRIPLES); return [`Find the eccentricity of the ellipse $\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${c * c}} = 1$.`, frac(b, a), [`e = \\sqrt{1 - \\frac{${c * c}}{${a * a}}}`]]; }],
    ['ellipse-focus', 2, 2, (g) => { const [b, c, a] = g.pick(TRIPLES); return [`Find the distance between the foci of $\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${c * c}} = 1$.`, 2 * b, [`2ae = 2\\sqrt{${a * a} - ${c * c}}`]]; }],
    ['ellipse-latus', 3, 2, (g) => { const b = g.int(2, 6), a = b + g.int(1, 4); return [`Find the length of the latus rectum of $\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1$.`, frac(2 * b * b, a), [`\\frac{2b^2}{a}`]]; }],
    ['focal-sum', 1, 1, (g) => { const b = g.int(2, 6), a = b + g.int(1, 4); return [`A point moves on $\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1$. Find the sum of its distances from the foci.`, 2 * a, [`2a`]]; }],
    ['hyperbola-e', 2, 2, (g) => { const [a, b, c] = g.pick(TRIPLES); return [`Find the eccentricity of the hyperbola $\\dfrac{x^2}{${a * a}} - \\dfrac{y^2}{${b * b}} = 1$.`, frac(c, a), [`e = \\sqrt{1 + \\frac{${b * b}}{${a * a}}}`]]; }],
    ['hyperbola-diff', 1, 1, (g) => { const a = g.int(2, 9), b = g.int(2, 7); return [`A point moves on $\\dfrac{x^2}{${a * a}} - \\dfrac{y^2}{${b * b}} = 1$. Find the difference of its distances from the foci.`, 2 * a, [`2a`]]; }],
    ['point-on', 3, 3, (g) => { const a = g.int(1, 5), t = g.int(1, 4); return [`The point $(${a * t * t}, y)$ lies on $y^2 = ${4 * a}x$, with $y > 0$. Find its distance from the focus.`, a * t * t + a, [`\\text{Focal distance} = x + a = ${a * t * t} + ${a}`]]; }],
  ],
  'XI 3d': [
    ['distance', 2, 1, (g) => { const p = g.pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11]]), x = g.int(1, 5); return [`Find the distance between $(${x}, 1, 2)$ and $(${x + p[0]}, ${1 + p[1]}, ${2 + p[2]})$.`, p[3], [`\\sqrt{${p[0]}^2 + ${p[1]}^2 + ${p[2]}^2}`]]; }],
    ['midpoint', 1, 1, (g) => { const a = g.int(1, 9), d = 2 * g.int(1, 5); return [`Find the z-coordinate of the midpoint of $(1, 2, ${a})$ and $(3, 4, ${a + d})$.`, a + d / 2, [`\\frac{${a} + ${a + d}}{2}`]]; }],
    ['section', 3, 2, (g) => { const m = g.int(1, 3), n = g.int(1, 3), a = g.int(1, 5), s = g.int(1, 3); return [`A point divides the join of $(${a}, 0, 1)$ and $(${a + (m + n) * s}, 4, 5)$ internally in the ratio ${m} : ${n}. Find its x-coordinate.`, a + m * s, [`\\frac{${m}(${a + (m + n) * s}) + ${n}(${a})}{${m + n}}`]]; }],
    ['from-plane', 1, 1, (g) => { const x = g.int(1, 9), y = g.int(1, 9), z = g.int(1, 9); return [`How far is $(${x}, ${y}, ${z})$ from the xy-plane?`, z, [`\\text{Its z-coordinate}`]]; }],
    ['from-axis', 2, 2, (g) => { const [a, b, c] = g.pick(TRIPLES), x = g.int(1, 9); return [`How far is $(${x}, ${a}, ${b})$ from the x-axis?`, c, [`\\sqrt{${a}^2 + ${b}^2}`]]; }],
    ['centroid', 2, 2, (g) => { const a = g.int(1, 5), b = g.int(1, 5), c = g.int(1, 5) ; const s = a + b + c; if (s % 3) g.retry(); return [`Find the x-coordinate of the centroid of the triangle with vertices $(${a}, 0, 1)$, $(${b}, 2, 3)$ and $(${c}, 4, 2)$.`, s / 3, [`\\frac{${a} + ${b} + ${c}}{3}`]]; }],
    ['from-origin', 2, 1, (g) => { const p = g.pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9]]); return [`Find the distance of $(${p[0]}, ${p[1]}, ${p[2]})$ from the origin.`, p[3], [`\\sqrt{${p[0]}^2 + ${p[1]}^2 + ${p[2]}^2}`]]; }],
  ],
  'XI 4a': [
    ['factor-limit', 2, 1, (g) => { const a = g.int(2, 9); return [`Evaluate $\\lim_{x \\to ${a}} \\dfrac{x^2 - ${a * a}}{x - ${a}}$.`, 2 * a, [`\\lim (x + ${a}) = ${2 * a}`]]; }],
    ['sin-limit', 1, 1, (g) => { const k = g.int(2, 9); return [`Evaluate $\\lim_{x \\to 0} \\dfrac{\\sin ${k}x}{x}$.`, k, [`${k} \\cdot \\lim \\frac{\\sin ${k}x}{${k}x}`]]; }],
    ['sin-ratio', 2, 2, (g) => { const a = g.int(2, 9), b = g.int(2, 9); if (a === b) g.retry(); return [`Evaluate $\\lim_{x \\to 0} \\dfrac{\\sin ${a}x}{\\sin ${b}x}$.`, frac(a, b), [`\\frac{${a}}{${b}}`]]; }],
    ['tan-limit', 1, 1, (g) => { const k = g.int(2, 9); return [`Evaluate $\\lim_{x \\to 0} \\dfrac{\\tan ${k}x}{x}$.`, k, [`${k}`]]; }],
    ['power-limit', 2, 2, (g) => { const a = g.int(2, 4), n = g.int(3, 5); return [`Evaluate $\\lim_{x \\to ${a}} \\dfrac{x^{${n}} - ${a ** n}}{x - ${a}}$.`, n * a ** (n - 1), [`n a^{n-1} = ${n} \\times ${a}^{${n - 1}}`], String(n * a ** (n - 1))]; }],
    ['poly-derivative', 2, 1, (g) => { const a = g.int(2, 5), b = g.int(2, 9), x = g.int(1, 4); return [`Find the derivative of $${a}x^3 + ${b}x$ at $x = ${x}$.`, 3 * a * x * x + b, [`${3 * a}x^2 + ${b}`]]; }],
    ['first-principle', 3, 3, (g) => { const a = g.int(2, 6), x = g.int(1, 5); return [`Use the definition of the derivative to find the slope of $y = ${a}x^2$ at $x = ${x}$.`, 2 * a * x, [`\\lim_{h \\to 0}\\frac{${a}(${x} + h)^2 - ${a}(${x})^2}{h} = ${2 * a * x}`]]; }],
    ['product', 3, 2, (g) => { const x = g.int(1, 4), a = g.int(1, 5); return [`Find the derivative of $x^2(x + ${a})$ at $x = ${x}$.`, 3 * x * x + 2 * a * x, [`3x^2 + ${2 * a}x`]]; }],
    ['rational-limit', 2, 2, (g) => { const a = g.int(2, 7), b = g.int(2, 7); return [`Evaluate $\\lim_{x \\to \\infty} \\dfrac{${a}x^2 + 1}{${b}x^2 - 3}$.`, frac(a, b), [`\\text{Divide above and below by } x^2`]]; }],
    ['cos-limit', 2, 3, (g) => { const k = 2 * g.int(1, 4); return [`Evaluate $\\lim_{x \\to 0} \\dfrac{1 - \\cos ${k}x}{x^2}$.`, (k * k) / 2, [`\\frac{2\\sin^2 ${k / 2}x}{x^2} \\to 2 \\times ${k / 2}^2`]]; }],
  ],
  'XI 5a': [
    ['mean', 1, 1, (g) => { const n = g.int(4, 7), m = g.int(10, 40); const list = Array.from({ length: n - 1 }, () => m + g.int(-6, 6)); list.push(m * n - list.reduce((a, b) => a + b, 0)); return [`Find the mean of ${list.join(', ')}.`, m, [`\\frac{${list.reduce((a, b) => a + b, 0)}}{${n}}`]]; }],
    ['median', 1, 1, (g) => { const list = g.sample([3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23], 7); const sorted = [...list].sort((a, b) => a - b); return [`Find the median of ${list.join(', ')}.`, sorted[3], [`\\text{The fourth in order}`]]; }],
    ['variance', 3, 2, () => { return ['Find the variance of 2, 4, 6, 8, 10.', 8, ['\\bar{x} = 6', '\\frac{16 + 4 + 0 + 4 + 16}{5}']]; }],
    ['sd-scale', 2, 2, (g) => { const s = g.int(2, 9), k = g.int(2, 5); return [`A data set has standard deviation ${s}. Every value is multiplied by ${k}. Find the new standard deviation.`, s * k, [`${s} \\times ${k}`]]; }],
    ['sd-shift', 1, 2, (g) => { const s = g.int(2, 9), k = g.int(2, 15); return [`A data set has standard deviation ${s}. ${k} is added to every value. Find the new standard deviation.`, s, [`\\text{Adding a constant doesn't change the spread.}`]]; }],
    ['combined', 3, 3, (g) => { const a = g.int(10, 30), b = g.int(10, 30), m = g.int(40, 70), d = g.int(2, 9), n = (a * m + b * (m + d)) / (a + b); return [`A class of ${a} has a mean mark of ${m}, and a class of ${b} has a mean mark of ${m + d}. Find the mean of all of them together, to 2 decimal places.`, n, [`\\frac{${a}(${m}) + ${b}(${m + d})}{${a + b}}`], n.toFixed(2)]; }],
    ['missing', 2, 2, (g) => { const m = g.int(10, 30), a = m - g.int(1, 5), b = m + g.int(1, 5), c = m + g.int(1, 5); return [`The mean of ${a}, ${b}, ${c} and $x$ is ${m}. Find $x$.`, 4 * m - a - b - c, [`x = 4(${m}) - ${a + b + c}`]]; }],
    ['cv', 2, 2, (g) => { const m = g.pick([20, 25, 40, 50]), s = g.int(2, 9); return [`A data set has mean ${m} and standard deviation ${s}. Find its coefficient of variation.`, (s / m) * 100, [`\\frac{${s}}{${m}} \\times 100`], `${tidy((s / m) * 100, 3)}%`]; }],
    ['range', 1, 1, (g) => { const list = g.sample([12, 15, 18, 22, 27, 31, 36, 41, 45], 6); return [`Find the range of ${list.join(', ')}.`, Math.max(...list) - Math.min(...list), [`${Math.max(...list)} - ${Math.min(...list)}`]]; }],
    ['mean-shift', 1, 1, (g) => { const m = g.int(10, 40), k = g.int(2, 9); return [`A data set has mean ${m}. ${k} is added to every value, and then every value is doubled. Find the new mean.`, 2 * (m + k), [`2(${m} + ${k})`]]; }],
  ],
  'XI 5b': [
    ['two-dice', 2, 1, (g) => { const s = g.int(4, 10); const ways = 6 - Math.abs(7 - s); return [`Two fair dice are thrown. Find the probability of a total of ${s}.`, frac(ways, 36), [`\\frac{${ways}}{36}`]]; }],
    ['complement', 1, 1, (g) => { const n = g.int(2, 9); return [`The probability of rain tomorrow is $\\frac{${n}}{10}$. Find the probability of no rain.`, frac(10 - n, 10), [`1 - \\frac{${n}}{10}`]]; }],
    ['cards', 1, 1, (g) => { const [w, n] = g.pick([['a king', 4], ['a heart', 13], ['a red card', 26], ['a face card', 12]] as [string, number][]); return [`A card is drawn from a pack of 52. Find the probability that it is ${w}.`, frac(n, 52), [`\\frac{${n}}{52}`]]; }],
    ['addition', 2, 2, (g) => { const a = g.int(3, 6), b = g.int(2, 5), c = g.int(1, 2); return [`If $P(A) = \\frac{${a}}{10}$, $P(B) = \\frac{${b}}{10}$ and $P(A \\cap B) = \\frac{${c}}{10}$, find $P(A \\cup B)$.`, frac(a + b - c, 10), [`\\frac{${a} + ${b} - ${c}}{10}`]]; }],
    ['coins', 2, 2, (g) => { const n = g.int(2, 5); return [`${n} fair coins are tossed. Find the probability of at least one head.`, frac(2 ** n - 1, 2 ** n), [`1 - \\frac{1}{${2 ** n}}`]]; }],
    ['balls', 2, 2, (g) => { const r = g.int(2, 6), b = g.int(2, 6); return [`A bag holds ${r} red and ${b} blue balls. Two are drawn together. Find the probability that both are red.`, frac(nCr(r, 2), nCr(r + b, 2)), [`\\frac{{}^{${r}}C_2}{{}^{${r + b}}C_2}`]]; }],
    ['one-each', 3, 3, (g) => { const r = g.int(2, 6), b = g.int(2, 6); return [`A bag holds ${r} red and ${b} blue balls. Two are drawn together. Find the probability of one of each colour.`, frac(r * b, nCr(r + b, 2)), [`\\frac{${r} \\times ${b}}{{}^{${r + b}}C_2}`]]; }],
    ['leap', 3, 3, () => ['Find the probability that a leap year, chosen at random, has 53 Sundays.', frac(2, 7), ['52 \\text{ full weeks and 2 extra days}', '\\frac{2}{7}']]],
    ['exclusive', 1, 1, (g) => { const a = g.int(1, 4), b = g.int(1, 4); return [`$A$ and $B$ are mutually exclusive, with $P(A) = \\frac{${a}}{10}$ and $P(B) = \\frac{${b}}{10}$. Find $P(A \\cup B)$.`, frac(a + b, 10), [`\\text{Nothing to subtract}`]]; }],
    ['word', 2, 2, (g) => { const [w, v, n] = g.pick([['EQUATION', 5, 8], ['PROBABILITY', 4, 11], ['ALGEBRA', 3, 7]] as [string, number, number][]); return [`A letter is chosen at random from the word ${w}. Find the probability that it is a vowel.`, frac(v, n), [`\\frac{${v}}{${n}}`]]; }],
  ],
  'XII 1a': [
    ['relations', 1, 1, (g) => { const m = g.int(2, 4), n = g.int(2, 3); return [`How many relations are there from a set of ${m} elements to a set of ${n} elements?`, 2 ** (m * n), [`2^{${m}\\times${n}}`], String(2 ** (m * n))]; }],
    ['functions', 1, 1, (g) => { const m = g.int(2, 4), n = g.int(2, 5); return [`How many functions are there from a set of ${m} elements to a set of ${n} elements?`, n ** m, [`${n}^{${m}}`], String(n ** m)]; }],
    ['one-one', 2, 2, (g) => { const m = g.int(2, 4), n = m + g.int(0, 2); let a = 1; for (let i = 0; i < m; i++) a *= n - i; return [`How many one-one functions are there from a set of ${m} elements to a set of ${n} elements?`, a, [`{}^{${n}}P_{${m}}`], String(a)]; }],
    ['bijections', 1, 1, (g) => { const n = g.int(3, 6); return [`How many bijections are there on a set of ${n} elements?`, factorial(n), [`${n}!`], String(factorial(n))]; }],
    ['reflexive', 3, 3, (g) => { const n = g.int(2, 3); return [`How many reflexive relations are there on a set of ${n} elements?`, 2 ** (n * n - n), [`2^{n^2 - n}`], String(2 ** (n * n - n))]; }],
    ['symmetric', 3, 3, (g) => { const n = g.int(2, 4); return [`How many symmetric relations are there on a set of ${n} elements?`, 2 ** ((n * (n + 1)) / 2), [`2^{n(n+1)/2}`], String(2 ** ((n * (n + 1)) / 2))]; }],
    ['fog', 2, 1, (g) => { const a = g.int(2, 5), b = g.int(1, 6), x = g.int(1, 4); return [`If $f(x) = ${a}x + ${b}$ and $g(x) = x^2$, find $(f \\circ g)(${x})$.`, a * x * x + b, [`f(${x * x})`]]; }],
    ['gof', 2, 1, (g) => { const a = g.int(2, 5), b = g.int(1, 6), x = g.int(1, 3); return [`If $f(x) = ${a}x + ${b}$ and $g(x) = x^2$, find $(g \\circ f)(${x})$.`, (a * x + b) ** 2, [`g(${a * x + b})`]]; }],
    ['inverse-value', 2, 2, (g) => { const a = g.int(2, 7), b = g.int(1, 9), y = g.int(1, 6); return [`If $f(x) = ${a}x + ${b}$, find $f^{-1}(${a * y + b})$.`, y, [`${a}x + ${b} = ${a * y + b}`]]; }],
    ['classes', 2, 2, (g) => { const k = g.int(2, 5); return [`On the integers, $a\\,R\\,b$ when $a - b$ is divisible by ${k}. How many equivalence classes are there?`, k, [`\\text{One for each remainder on dividing by } ${k}`]]; }],
  ],
  'XII 1b': [
    ['sin-cos', 2, 2, (g) => { const [a, b, c] = g.pick(TRIPLES); return [`Evaluate $\\sin\\left(\\cos^{-1}\\frac{${a}}{${c}}\\right)$.`, frac(b, c), [`\\text{Right triangle with sides } ${a}, ${b}, ${c}`]]; }],
    ['cos-tan', 2, 2, (g) => { const [a, b, c] = g.pick(TRIPLES); return [`Evaluate $\\cos\\left(\\tan^{-1}\\frac{${a}}{${b}}\\right)$.`, frac(b, c), [`\\text{Hypotenuse } ${c}`]]; }],
    ['tan-sin', 2, 2, (g) => { const [a, b, c] = g.pick(TRIPLES); return [`Evaluate $\\tan\\left(\\sin^{-1}\\frac{${a}}{${c}}\\right)$.`, frac(a, b), [`\\text{Opposite } ${a},\\ \\text{adjacent } ${b}`]]; }],
    ['sin-2tan', 3, 3, (g) => { const k = g.int(2, 7); return [`Evaluate $\\sin\\left(2\\tan^{-1}\\frac{1}{${k}}\\right)$.`, frac(2 * k, k * k + 1), [`\\sin 2\\theta = \\frac{2\\tan\\theta}{1 + \\tan^2\\theta}`]]; }],
    ['cos-2tan', 3, 3, (g) => { const k = g.int(2, 7); return [`Evaluate $\\cos\\left(2\\tan^{-1}\\frac{1}{${k}}\\right)$.`, frac(k * k - 1, k * k + 1), [`\\cos 2\\theta = \\frac{1 - \\tan^2\\theta}{1 + \\tan^2\\theta}`]]; }],
    ['tan-sum', 3, 2, (g) => { const a = g.int(2, 5); const b = a + 1, c = a * b + 1; void c; return [`Evaluate $\\tan\\left(\\tan^{-1}\\frac{1}{${a}} + \\tan^{-1}\\frac{1}{${b}}\\right)$.`, frac(a + b, a * b - 1), [`\\frac{\\frac{1}{${a}} + \\frac{1}{${b}}}{1 - \\frac{1}{${a * b}}}`]]; }],
    ['outside-range', 2, 3, (g) => { const [n, d, an, ad] = g.pick([[2, 3, 1, 3], [3, 4, 1, 4], [5, 6, 1, 6]] as number[][]); return [`Find the value of $\\sin^{-1}\\left(\\sin\\frac{${n}\\pi}{${d}}\\right)$, in terms of π.`, (an * Math.PI) / ad, [`\\text{The principal range is } [-\\pi/2, \\pi/2]`], `π/${ad}`]; }],
    ['cos-range', 2, 3, (g) => { const [n, d, an, ad] = g.pick([[4, 3, 2, 3], [5, 3, 1, 3], [7, 6, 5, 6]] as number[][]); return [`Find the value of $\\cos^{-1}\\left(\\cos\\frac{${n}\\pi}{${d}}\\right)$, in terms of π.`, (an * Math.PI) / ad, [`\\text{The principal range is } [0, \\pi]`], pi(an, ad)]; }],
    ['complementary', 1, 1, (g) => { const [a, , c] = g.pick(TRIPLES); return [`Evaluate $\\sin^{-1}\\frac{${a}}{${c}} + \\cos^{-1}\\frac{${a}}{${c}}$, in terms of π.`, Math.PI / 2, [`\\sin^{-1}x + \\cos^{-1}x = \\frac{\\pi}{2}`], 'π/2']; }],
    ['solve', 3, 3, (g) => { const k = g.int(2, 6); return [`Solve $\\tan^{-1}(${k}x) = \\frac{\\pi}{4}$.`, frac(1, k), [`${k}x = 1`]]; }],
  ],
  'XII 2a': [
    ['product-entry', 2, 1, (g) => { const a = g.int(1, 5), b = g.int(1, 5), c = g.int(1, 5), d = g.int(1, 5); return [`Find the entry in the first row and first column of $${matrixTex([[a, b], [1, 2]])}${matrixTex([[c, 3], [d, 4]])}$.`, a * c + b * d, [`${a}(${c}) + ${b}(${d})`]]; }],
    ['trace', 1, 1, (g) => { const a = g.int(1, 9), b = g.int(1, 9), c = g.int(1, 9); return [`Find the sum of the leading diagonal of $${matrixTex([[a, 2, 3], [4, b, 6], [7, 8, c]])}$.`, a + b + c, [`${a} + ${b} + ${c}`]]; }],
    ['combine', 2, 1, (g) => { const a = g.int(1, 9), b = g.int(1, 9); return [`If $A = ${matrixTex([[a, 1], [2, 3]])}$ and $B = ${matrixTex([[b, 0], [1, 2]])}$, find the top left entry of $2A - 3B$.`, 2 * a - 3 * b || g.retry(), [`2(${a}) - 3(${b})`]]; }],
    ['square', 2, 2, (g) => { const a = g.int(1, 5), b = g.int(1, 5), c = g.int(1, 5); return [`If $A = ${matrixTex([[a, b], [c, 1]])}$, find the top left entry of $A^2$.`, a * a + b * c, [`${a}^2 + ${b}(${c})`]]; }],
    ['equal', 2, 2, (g) => { const x = g.int(1, 9), y = g.int(1, 9); return [`If $${matrixTex([['x + y', 2], [3, 'x - y']])} = ${matrixTex([[x + y, 2], [3, x - y]])}$, find $x$.`, x, [`2x = ${2 * x}`]]; }],
    ['orders', 2, 2, (g) => { const [n, k] = g.pick([[12, 6], [18, 6], [24, 8], [16, 5], [36, 9]]); return [`In how many ways can a matrix have exactly ${n} elements, counting different orders?`, k, [`\\text{The number of factors of } ${n}`]]; }],
    ['count', 1, 2, (g) => { const n = g.int(2, 3), v = 2; return [`How many ${n} × ${n} matrices have every entry 0 or 1?`, v ** (n * n), [`2^{${n * n}}`], String(v ** (n * n))]; }],
    ['symmetric', 2, 2, (g) => { const a = g.int(1, 9); return [`The matrix $${matrixTex([[1, 'x'], [a, 2]])}$ is symmetric. Find $x$.`, a, [`a_{12} = a_{21}`]]; }],
    ['skew', 2, 3, (g) => { const a = g.int(1, 9); return [`The matrix $${matrixTex([[0, 'x'], [a, 0]])}$ is skew-symmetric. Find $x$.`, -a, [`a_{12} = -a_{21}`]]; }],
    ['cost', 3, 2, (g) => { const a = g.int(2, 9), b = g.int(2, 9), p = g.pick([5, 10, 15]), q = g.pick([20, 30, 40]); return [`A shop sells ${a} pens and ${b} books. Pens cost ₹${p} and books ₹${q}. Write this as a product of two matrices, and find the total takings.`, a * p + b * q, [`${matrixTex([[a, b]])}${matrixTex([[p], [q]])}`], `₹${a * p + b * q}`]; }],
  ],
  'XII 2b': [
    ['cofactor', 2, 2, (g) => { const m = [[g.int(1, 5), g.int(1, 5)], [g.int(1, 5), g.int(1, 5)]]; return [`Find the cofactor of the entry ${m[0][1]} in the first row of $${matrixTex(m).replace(/bmatrix/g, 'vmatrix')}$.`, -m[1][0], [`(-1)^{1+2} \\times ${m[1][0]}`]]; }],
    ['minor', 2, 1, () => { const m = [[1, 2, 3], [4, 5, 6], [7, 8, 10]]; return [`Find the minor of the entry 1 in $${matrixTex(m).replace(/bmatrix/g, 'vmatrix')}$.`, 5 * 10 - 6 * 8, ['5(10) - 6(8)']]; }],
    ['scale', 1, 2, (g) => { const n = g.int(2, 3), k = g.int(2, 4), d = g.int(2, 6); return [`$A$ is a square matrix of order ${n}, with $|A| = ${d}$. Find $|${k}A|$.`, k ** n * d, [`${k}^{${n}} \\times ${d}`]]; }],
    ['adj', 2, 2, (g) => { const n = g.int(2, 3), d = g.int(2, 6); return [`$A$ is a square matrix of order ${n}, with $|A| = ${d}$. Find $|\\text{adj}\\, A|$.`, d ** (n - 1), [`|A|^{${n - 1}}`]]; }],
    ['singular', 2, 2, (g) => { const a = g.int(1, 6), b = g.int(1, 6), c = g.int(1, 6); return [`Find $x$ if $${matrixTex([['x', a * c], [b, c]])}$ is singular.`, a * b, [`${c}x - ${a * c}(${b}) = 0`]]; }],
    ['triangle', 3, 2, (g) => { const b = 2 * g.int(1, 5), h = g.int(2, 8); return [`Use a determinant to find the area of the triangle with vertices $(0, 0)$, $(${b}, 0)$ and $(0, ${h})$.`, (b * h) / 2, [`\\frac{1}{2}\\left|${det3([[0, 0, 1], [b, 0, 1], [0, h, 1]])}\\right|`]]; }],
    ['cramer', 3, 3, (g) => { const x = g.int(1, 6), y = g.int(1, 6), a = g.int(1, 4), b = g.int(1, 4), c = g.int(1, 4), d = g.int(1, 4); if (a * d === b * c) g.retry(); return [`Use Cramer’s rule to find $x$ when $${a}x + ${b}y = ${a * x + b * y}$ and $${c}x + ${d}y = ${c * x + d * y}$.`, x, [`D = ${det2([[a, b], [c, d]])}`, `x = \\frac{D_x}{D}`]]; }],
    ['inverse-entry', 3, 3, (g) => { const a = g.int(2, 5), d = g.int(2, 5), b = g.int(1, 3), c = g.int(1, 3); const D = a * d - b * c; if (!D) g.retry(); return [`Find the top left entry of the inverse of $${matrixTex([[a, b], [c, d]])}$.`, frac(d, D), [`\\frac{1}{${D}} \\times ${d}`]]; }],
    ['product-det', 2, 2, (g) => { const p = g.int(2, 6), q = g.int(2, 6); return [`$|A| = ${p}$ and $|B| = ${q}$ for two square matrices of the same order. Find $|AB|$.`, p * q, [`|A||B|`]]; }],
    ['inverse-det', 2, 3, (g) => { const p = g.int(2, 9); return [`$A$ is invertible, with $|A| = ${p}$. Find $|A^{-1}|$.`, frac(1, p), [`\\frac{1}{|A|}`]]; }],
  ],
  'XII 3a': [
    ['chain-sin', 2, 1, (g) => { const k = g.int(2, 7); return [`If $y = \\sin ${k}x$, find $\\dfrac{dy}{dx}$ at $x = 0$.`, k, [`${k}\\cos ${k}x`]]; }],
    ['exp', 2, 1, (g) => { const k = g.int(2, 7); return [`If $y = e^{${k}x}$, find $\\dfrac{dy}{dx}$ at $x = 0$.`, k, [`${k}e^{${k}x}`]]; }],
    ['log', 2, 2, (g) => { const a = g.int(1, 5), x = g.int(1, 5); return [`If $y = \\log(x^2 + ${a})$, find $\\dfrac{dy}{dx}$ at $x = ${x}$.`, frac(2 * x, x * x + a), [`\\frac{2x}{x^2 + ${a}}`]]; }],
    ['parametric', 3, 2, (g) => { const a = g.int(2, 6), t = g.int(1, 5); return [`If $x = ${a}t^2$ and $y = ${2 * a}t$, find $\\dfrac{dy}{dx}$ at $t = ${t}$.`, frac(1, t), [`\\frac{dy/dt}{dx/dt} = \\frac{${2 * a}}{${2 * a}t}`]]; }],
    ['implicit', 3, 3, (g) => { const [a, b, c] = g.pick(TRIPLES); return [`If $x^2 + y^2 = ${c * c}$, find $\\dfrac{dy}{dx}$ at $(${a}, ${b})$.`, frac(-a, b), [`2x + 2y\\frac{dy}{dx} = 0`]]; }],
    ['second', 2, 2, (g) => { const a = g.int(1, 4), x = g.int(1, 4); return [`If $y = ${a}x^4$, find $\\dfrac{d^2y}{dx^2}$ at $x = ${x}$.`, 12 * a * x * x, [`${12 * a}x^2`]]; }],
    ['continuity', 3, 2, (g) => { const a = g.int(2, 9); return [`The function $f(x) = \\dfrac{x^2 - ${a * a}}{x - ${a}}$ for $x \\ne ${a}$, with $f(${a}) = k$, is continuous at $x = ${a}$. Find $k$.`, 2 * a, [`k = \\lim_{x \\to ${a}}(x + ${a})`]]; }],
    ['continuity-sin', 3, 3, (g) => { const a = g.int(2, 9); return [`The function $f(x) = \\dfrac{\\sin ${a}x}{x}$ for $x \\ne 0$, with $f(0) = k$, is continuous at $x = 0$. Find $k$.`, a, [`k = \\lim_{x \\to 0}\\frac{\\sin ${a}x}{x}`]]; }],
    ['log-diff', 3, 3, () => ['If $y = x^x$, find $\\dfrac{dy}{dx}$ at $x = 1$.', 1, ['\\frac{dy}{dx} = x^x(1 + \\log x)']]],
    ['product-rule', 2, 2, (g) => { const a = g.int(2, 6); return [`If $y = x e^{${a}x}$, find $\\dfrac{dy}{dx}$ at $x = 0$.`, 1, [`e^{${a}x} + ${a}xe^{${a}x}`]]; }],
    ['quotient', 3, 3, (g) => { const a = g.int(1, 5), x = g.int(1, 4); return [`If $y = \\dfrac{x}{x + ${a}}$, find $\\dfrac{dy}{dx}$ at $x = ${x}$.`, frac(a, (x + a) ** 2), [`\\frac{${a}}{(x + ${a})^2}`]]; }],
  ],
  'XII 3b': [
    ['circle-rate', 3, 2, (g) => { const r = g.int(2, 9), k = g.int(2, 6); return [`The radius of a circular ripple grows at ${k} cm/s. Find how fast its area is growing when the radius is ${r} cm, in terms of π.`, 2 * Math.PI * r * k, [`\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}`], `${2 * r * k}π cm²/s`]; }],
    ['tangent-slope', 2, 1, (g) => { const a = g.int(1, 4), b = g.int(1, 6), x = g.int(1, 4); return [`Find the slope of the tangent to $y = ${a === 1 ? '' : a}x^2 + ${b}x$ at $x = ${x}$.`, 2 * a * x + b, [`${2 * a}x + ${b}`]]; }],
    ['normal-slope', 2, 2, (g) => { const a = g.int(1, 4), x = g.int(1, 4); return [`Find the slope of the normal to $y = ${a === 1 ? '' : a}x^2$ at $x = ${x}$.`, frac(-1, 2 * a * x), [`-\\frac{1}{${2 * a * x}}`]]; }],
    ['max-value', 2, 2, (g) => { const h = g.int(1, 6), k = g.int(1, 9); return [`Find the greatest value of $${2 * h}x - x^2 + ${k}$.`, h * h + k, [`\\text{At } x = ${h}`]]; }],
    ['rectangle', 3, 3, (g) => { const p = 4 * g.int(5, 20); return [`A rectangle has perimeter ${p} m. Find its greatest possible area.`, (p / 4) ** 2, [`\\text{A square of side } ${p / 4}`], `${(p / 4) ** 2} m²`]; }],
  ],
  'XII 3c': [
    ['poly', 2, 1, (g) => { const a = g.int(1, 4); return [`Evaluate $\\displaystyle\\int_0^{${a}} 3x^2\\,dx$.`, a ** 3, [`[x^3]_0^{${a}}`]]; }],
    ['symmetric', 3, 2, (g) => { const a = g.int(1, 4); return [`Evaluate $\\displaystyle\\int_{-${a}}^{${a}} x^2\\,dx$.`, frac(2 * a ** 3, 3), [`2\\int_0^{${a}} x^2\\,dx`]]; }],
    ['sin', 1, 1, () => [`Evaluate $\\displaystyle\\int_0^{\\pi/2} \\sin x\\,dx$.`, 1, ['[-\\cos x]_0^{\\pi/2}']]],
    ['exp-log', 2, 2, (g) => { const k = g.int(2, 9); return [`Evaluate $\\displaystyle\\int_0^{\\log ${k}} e^x\\,dx$.`, k - 1, [`[e^x]_0^{\\log ${k}}`]]; }],
    ['reciprocal', 2, 1, (g) => { const k = g.int(2, 6); return [`Evaluate $\\displaystyle\\int_1^{e^{${k}}} \\frac{dx}{x}$.`, k, [`[\\log x]_1^{e^{${k}}}`]]; }],
    ['substitute', 3, 2, (g) => { const k = g.int(2, 6); return [`Evaluate $\\displaystyle\\int_0^{\\sqrt{\\log ${k}}} 2x e^{x^2}\\,dx$.`, k - 1, [`u = x^2`, `[e^u]_0^{\\log ${k}}`]]; }],
    ['arctan', 2, 2, () => [`Evaluate $\\displaystyle\\int_0^1 \\frac{dx}{1 + x^2}$, in terms of π.`, Math.PI / 4, ['[\\tan^{-1} x]_0^1'], 'π/4']],
    ['cos-squared', 3, 3, () => [`Evaluate $\\displaystyle\\int_0^{\\pi/2} \\cos^2 x\\,dx$, in terms of π.`, Math.PI / 4, ['\\int_0^{\\pi/2}\\frac{1 + \\cos 2x}{2}\\,dx'], 'π/4']],
    ['parts', 3, 3, () => [`Evaluate $\\displaystyle\\int_0^1 x e^x\\,dx$.`, 1, ['[xe^x - e^x]_0^1']]],
    ['king', 3, 3, () => [`Use a property of definite integrals to evaluate $\\displaystyle\\int_0^{\\pi/2} \\frac{\\sin x}{\\sin x + \\cos x}\\,dx$, in terms of π.`, Math.PI / 4, ['2I = \\int_0^{\\pi/2} 1\\,dx'], 'π/4']],
  ],
  'XII 3d': [
    ['parabola', 2, 1, (g) => { const a = g.int(1, 6); return [`Find the area under $y = x^2$ from $x = 0$ to $x = ${a}$.`, frac(a ** 3, 3), [`\\int_0^{${a}} x^2\\,dx`]]; }],
    ['line-parabola', 3, 2, (g) => { const k = g.int(1, 4); return [`Find the area between $y = ${k === 1 ? '' : k}x$ and $y = x^2$.`, frac(k ** 3, 6), [`\\int_0^{${k}} (${k === 1 ? '' : k}x - x^2)\\,dx`]]; }],
    ['ellipse', 3, 2, (g) => { const a = g.int(2, 6), b = g.int(2, 5); return [`Find the area of the ellipse $\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1$, in terms of π.`, Math.PI * a * b, [`\\pi ab`], `${a * b}π`]; }],
    ['latus', 3, 3, (g) => { const a = g.int(1, 5); return [`Find the area enclosed by $y^2 = ${4 * a}x$ and its latus rectum.`, frac(8 * a * a, 3), [`2\\int_0^{${a}} \\sqrt{${4 * a}x}\\,dx`]]; }],
    ['sine', 2, 1, () => ['Find the area under one arch of $y = \\sin x$.', 2, ['\\int_0^\\pi \\sin x\\,dx']]],
    ['triangle', 2, 1, (g) => { const m = g.int(1, 5), a = g.int(2, 6); return [`Use integration to find the area under $y = ${m === 1 ? '' : m}x$ from $x = 0$ to $x = ${a}$.`, (m * a * a) / 2, [`\\int_0^{${a}} ${m}x\\,dx`]]; }],
    ['circle', 3, 2, (g) => { const r = g.int(2, 7); return [`Use integration to find the area of the part of $x^2 + y^2 = ${r * r}$ in the first quadrant, in terms of π.`, (Math.PI * r * r) / 4, [`\\int_0^{${r}} \\sqrt{${r * r} - x^2}\\,dx`], pi(r * r, 4)]; }],
    ['cubic', 2, 2, (g) => { const a = g.int(1, 3); return [`Find the area under $y = x^3$ from $x = 0$ to $x = ${2 * a}$.`, 4 * a ** 4, [`\\left[\\frac{x^4}{4}\\right]_0^{${2 * a}}`]]; }],
  ],
  'XII 3e': [
    ['growth', 3, 2, (g) => { const a = g.pick([100, 200, 500]), k = g.int(2, 3); return [`A culture grows so that $\\dfrac{dN}{dt}$ is proportional to $N$, and it starts with ${a} cells. After 1 hour there are ${a * k}. How many are there after 2 hours?`, a * k * k, [`N = ${a}e^{\\lambda t},\\ e^\\lambda = ${k}`], String(a * k * k)]; }],
    ['simple', 2, 1, (g) => { const c = g.int(1, 9), x = g.int(1, 5); return [`If $\\dfrac{dy}{dx} = 2x$ and $y = ${c}$ at $x = 0$, find $y$ at $x = ${x}$.`, x * x + c, [`y = x^2 + ${c}`]]; }],
    ['separable', 3, 2, (g) => { const k = g.int(1, 3); return [`If $\\dfrac{dy}{dx} = \\dfrac{x}{y}$ and $y = ${k + 1}$ at $x = ${k}$, find $y^2 - x^2$.`, (k + 1) ** 2 - k * k, [`y\\,dy = x\\,dx`, `y^2 - x^2 = c`]]; }],
    ['order', 1, 1, (g) => { const n = g.int(2, 4), d = g.int(2, 3); return [`State the order of $\\left(\\dfrac{d^{${n}}y}{dx^{${n}}}\\right)^{${d}} + y = 0$.`, n, [`\\text{The highest derivative}`]]; }],
    ['degree', 1, 2, (g) => { const n = g.int(2, 4), d = g.int(2, 3); return [`State the degree of $\\left(\\dfrac{d^{${n}}y}{dx^{${n}}}\\right)^{${d}} + y = 0$.`, d, [`\\text{The power of the highest derivative}`]]; }],
    ['if', 3, 3, (g) => { const a = g.int(2, 5), x = g.int(1, 3); return [`Find the integrating factor of $\\dfrac{dy}{dx} + \\dfrac{${a}}{x}y = x$, and give its value at $x = ${x}$.`, x ** a, [`e^{\\int \\frac{${a}}{x}dx} = x^{${a}}`], String(x ** a)]; }],
    ['linear', 3, 3, (g) => { const c = g.int(1, 6); return [`Solve $\\dfrac{dy}{dx} + y = 1$ with $y = ${c + 1}$ at $x = 0$. Find $(y - 1)e^x$.`, c, [`\\frac{d}{dx}(ye^x) = e^x`, `(y - 1)e^x = ${c}`]]; }],
    ['arbitrary', 1, 2, (g) => { const n = g.int(2, 4); return [`How many arbitrary constants does the general solution of a differential equation of order ${n} have?`, n, [`${n}`]]; }],
  ],
  'XII 4a': [
    ['perpendicular', 2, 2, (g) => { const a = g.int(1, 5), b = g.int(1, 5), k = g.int(1, 5); return [`Find $\\lambda$ if $${a * k}\\hat{i} + ${b * k}\\hat{j}$ and $${b}\\hat{i} - \\lambda\\hat{j}$ are perpendicular.`, a, [`${a * k}(${b}) - ${b * k}\\lambda = 0`]]; }],
    ['triangle-area', 3, 3, (g) => { const a = g.int(1, 6), b = g.int(1, 6); return [`Find the area of the triangle with adjacent sides $${2 * a}\\hat{i}$ and $${b}\\hat{j}$.`, a * b, [`\\frac{1}{2}|\\vec{a} \\times \\vec{b}|`]]; }],
    ['projection', 3, 2, (g) => { const [a, b, c] = g.pick(TRIPLES), x = g.int(1, 5), y = g.int(1, 5); return [`Find the projection of $${x}\\hat{i} + ${y}\\hat{j}$ on $${a}\\hat{i} + ${b}\\hat{j}$.`, frac(a * x + b * y, c), [`\\frac{${a * x + b * y}}{${c}}`]]; }],
    ['collinear', 2, 3, (g) => { const a = g.int(1, 5), k = g.int(2, 4), b = g.int(1, 5); return [`Find $\\mu$ if $${a}\\hat{i} + ${b}\\hat{j}$ and $${a * k}\\hat{i} + \\mu\\hat{j}$ are parallel.`, b * k, [`\\frac{${a * k}}{${a}} = \\frac{\\mu}{${b}}`]]; }],
  ],
  'XII 5a': [
    ['point-plane', 3, 2, (g) => { const [p, q, r, s] = g.pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9]]), k = g.int(2, 8), x = g.int(1, 3), y = g.int(1, 3), z = g.int(1, 3); const top = Math.abs(p * x + q * y + r * z - k * s); if (!top) g.retry(); return [`Find the distance of $(${x}, ${y}, ${z})$ from the plane $${p === 1 ? '' : p}x + ${q}y + ${r}z = ${k * s}$.`, frac(top, s), [`\\frac{|${p * x + q * y + r * z} - ${k * s}|}{${s}}`]]; }],
    ['parallel-planes', 3, 3, (g) => { const [p, q, r, s] = g.pick([[1, 2, 2, 3], [2, 3, 6, 7]]), a = g.int(1, 9), b = a + s * g.int(1, 3); return [`Find the distance between the planes $${p === 1 ? '' : p}x + ${q}y + ${r}z = ${a}$ and $${p === 1 ? '' : p}x + ${q}y + ${r}z = ${b}$.`, (b - a) / s, [`\\frac{|${b} - ${a}|}{${s}}`]]; }],
    ['intercept', 2, 1, (g) => { const a = g.int(2, 6), k = g.int(1, 5); return [`Find the x-intercept of the plane $${a}x + 3y - z = ${a * k}$.`, k, [`\\text{Put } y = z = 0`]]; }],
    ['dc', 2, 2, (g) => { const [p, q, r, s] = g.pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9]]); return [`A line has direction ratios ${p}, ${q}, ${r}. Find its direction cosine with the z-axis.`, frac(r, s), [`\\frac{${r}}{\\sqrt{${p * p} + ${q * q} + ${r * r}}}`]]; }],
    ['perp-lines', 2, 3, (g) => { const a = g.int(1, 4), b = g.int(1, 4), c = g.int(1, 4), d = g.int(1, 4); return [`Lines with direction ratios ${a}, ${b}, ${c} and ${d}, ${c}, $k$ are perpendicular. Find $k$.`, frac(-(a * d + b * c), c), [`${a}(${d}) + ${b}(${c}) + ${c}k = 0`]]; }],
    ['volume', 3, 3, (g) => { const a = g.int(2, 6), b = g.int(2, 6), c = g.int(2, 6); return [`Find the volume of the box with edges $${a}\\hat{i}$, $${b}\\hat{j}$ and $${c}\\hat{k}$, using the scalar triple product.`, a * b * c, [`[\\vec{a}\\ \\vec{b}\\ \\vec{c}] = ${a} \\times ${b} \\times ${c}`]]; }],
  ],
  'XII 6a': [
    ['corner', 2, 1, (g) => { const a = g.int(2, 9), b = g.int(2, 9), x = g.int(1, 9), y = g.int(1, 9); return [`Find the value of $Z = ${a}x + ${b}y$ at the corner $(${x}, ${y})$.`, a * x + b * y, [`${a}(${x}) + ${b}(${y})`]]; }],
    ['max-of', 3, 2, (g) => { const a = g.int(2, 6), b = g.int(2, 6), c = [[0, g.int(3, 8)], [g.int(2, 5), g.int(2, 6)], [g.int(5, 9), 0]]; if (!isConvex([[0, 0], c[2], c[1], c[0]])) g.retry('a corner that lies inside the region'); const v = c.map(([x, y]) => a * x + b * y); return [`The corners of a feasible region are ${c.map(([x, y]) => `$(${x}, ${y})$`).join(', ')} and $(0, 0)$. Find the greatest value of $Z = ${a}x + ${b}y$.`, Math.max(...v), [`\\text{Values: } ${v.join(', ')}`]]; }],
    ['min-of', 3, 2, (g) => { const a = g.int(2, 6), b = g.int(2, 6), c = [[1, g.int(4, 8)], [g.int(2, 4), g.int(2, 3)], [g.int(5, 9), 1]]; const v = c.map(([x, y]) => a * x + b * y); return [`The corners of a bounded feasible region are ${c.map(([x, y]) => `$(${x}, ${y})$`).join(', ')}. Find the least value of $Z = ${a}x + ${b}y$.`, Math.min(...v), [`\\text{Values: } ${v.join(', ')}`]]; }],
    ['intersect', 3, 3, (g) => { const x = g.int(1, 6), y = g.int(1, 6); return [`Two constraints are $x + y \\le ${x + y}$ and $x + 2y \\le ${x + 2 * y}$. Find the x-coordinate of the corner where their lines meet.`, x, [`y = ${y}`]]; }],
    ['profit', 3, 2, (g) => { const p = g.pick([20, 30, 40]), q = g.pick([25, 35, 50]), x = g.int(2, 9), y = g.int(2, 9); return [`A workshop makes $x$ chairs at ₹${p} profit each, and $y$ tables at ₹${q} each. The best corner is $(${x}, ${y})$. Find the profit there.`, p * x + q * y, [`${p}(${x}) + ${q}(${y})`], `₹${p * x + q * y}`]; }],
    ['intercept', 2, 1, (g) => { const a = g.int(2, 6), k = g.int(1, 9); return [`The constraint $${a}x + 3y \\le ${a * k}$ meets the x-axis at $(p, 0)$. Find $p$.`, k, [`${a}p = ${a * k}`]]; }],
    ['both-optimal', 3, 3, (g) => { const a = g.int(1, 5), s = g.int(4, 9); return [`$Z = ${a}x + ${a}y$ on the region $x + y \\le ${s}$, $x, y \\ge 0$. Find the greatest value, and note that it is reached along a whole edge.`, a * s, [`Z = ${a}(x + y) \\le ${a * s}`]]; }],
    ['check', 2, 2, (g) => { const s = g.int(5, 12), x = g.int(1, 4); return [`The region is $x + y \\le ${s}$, $x, y \\ge 0$. What is the greatest $y$ for a point with $x = ${x}$?`, s - x, [`y \\le ${s} - ${x}`]]; }],
  ],
  'XII 7a': [
    ['conditional', 2, 1, (g) => { const a = g.int(1, 3), b = a + g.int(1, 4); return [`If $P(A \\cap B) = \\frac{${a}}{10}$ and $P(B) = \\frac{${b}}{10}$, find $P(A | B)$.`, frac(a, b), [`\\frac{P(A \\cap B)}{P(B)}`]]; }],
    ['independent', 1, 1, (g) => { const a = g.int(1, 9), b = g.int(1, 9); return [`$A$ and $B$ are independent, with $P(A) = \\frac{${a}}{10}$ and $P(B) = \\frac{${b}}{10}$. Find $P(A \\cap B)$.`, frac(a * b, 100), [`\\frac{${a}}{10} \\times \\frac{${b}}{10}`]]; }],
    ['expectation', 3, 2, (g) => { const a = g.int(1, 4), b = g.int(5, 9), n = g.int(1, 3); return [`$X$ takes the value ${a} with probability $\\frac{${n}}{4}$, and ${b} otherwise. Find $E(X)$.`, frac(a * n + b * (4 - n), 4), [`\\frac{${n}(${a}) + ${4 - n}(${b})}{4}`]]; }],
  ],
};

const place = (key: string) => {
  const [level, spot] = key.split(' ');
  const m = /^(\d+)([a-z])$/.exec(spot)!;
  return { level: level as ClassLevel, unit: Number(m[1]), topic: m[2] };
};

export function mathsBlueprints(level: ClassLevel): Blueprint[] {
  const prefix = `m${level === 'XII' ? '12' : '11'}`;
  const out: Blueprint[] = [];
  for (const [key, rows] of Object.entries(TOPICS)) {
    const at = place(key);
    if (at.level !== level) continue;
    for (const [name, marks, difficulty, make] of rows) {
      out.push({
        id: `${prefix}-${at.unit}${at.topic}-v-${name}`,
        subject: 'mathematics',
        level,
        unit: at.unit,
        topic: at.topic,
        marks,
        type: 'numerical',
        difficulty,
        format: 'numerical',
        style: 'paper-style',
        family: `written-${name}`,
        make(g): Body {
          const [text, answer, working, shownAs] = make(g);
          const value = typeof answer === 'number' ? answer : answer.value;
          // Nothing can be marked against an answer of exactly zero, by a relative tolerance.
          if (value === 0) g.retry('an answer of zero');
          const words = shownAs ?? (typeof answer === 'number' ? tidy(answer, 4).replace(/^-/, '−') : answer.text());
          return {
            form: 'numeric',
            text,
            parts: [g.answerPart('Answer', value, marks, [{ label: 'Working', math: working }], '', words)],
          };
        },
      });
    }
  }
  return out;
}
