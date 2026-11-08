// Mathematics, Class XI. Built backwards from clean answers, in exact arithmetic where it can be.
import { evalPoly, factorial, frac, nCr, polyTex, signed } from '../../practice/gen/exact';
import type { Step } from '../../solver/solve';
import { derivationBlueprints } from '../derivations';
import KNOWLEDGE from './knowledge/mathematics-xi';
import { blueprintsFor } from './dsl';
import type { Blueprint } from './types';

const { custom, facts, rest } = blueprintsFor('mathematics', 'XI', KNOWLEDGE);

const step = (label: string, ...math: string[]): Step => ({ label, math });
const $ = (tex: string) => `$${tex}$`;
/** i with its coefficient, so 1i reads as i. */
const iTerm = (n: number) => `${n === 1 ? '' : n}i`;
/** A point as a question prints it: (2, −3, 1). */
const point = (p: number[]) => `(${p.map((n) => String(n).replace('-', '−')).join(', ')})`;
/** A deviation in a sum of squares: 2, or (−1) in brackets. */
const dev = (d: number) => (d < 0 ? `(${d})` : String(d));

const TRIG: [string, string][] = [
  ['\\sin 30^\\circ', '\\dfrac12'], ['\\cos 60^\\circ', '\\dfrac12'], ['\\tan 45^\\circ', '1'], ['\\sin 90^\\circ', '1'], ['\\cos 0^\\circ', '1'], ['\\sin 45^\\circ', '\\dfrac{1}{\\sqrt2}'], ['\\cos 45^\\circ', '\\dfrac{1}{\\sqrt2}'], ['\\tan 60^\\circ', '\\sqrt3'], ['\\sin 60^\\circ', '\\dfrac{\\sqrt3}{2}'], ['\\cos 30^\\circ', '\\dfrac{\\sqrt3}{2}'], ['\\tan 30^\\circ', '\\dfrac{1}{\\sqrt3}'], ['\\sin 120^\\circ', '\\dfrac{\\sqrt3}{2}'], ['\\cos 120^\\circ', '-\\dfrac12'], ['\\tan 135^\\circ', '-1'], ['\\sin 210^\\circ', '-\\dfrac12'],
];
const TRIG_VALUES = [...new Set(TRIG.map((t) => t[1]))];

const blueprints: Blueprint[] = [
  // ---- Sets, relations and trigonometry
  custom('union-count', [1, 'a', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const both = g.int(5, 20);
    const a = both + g.int(5, 30);
    const b = both + g.int(5, 30);
    const [groupA, groupB, place] = g.pick([
      ['Physics', 'Chemistry', 'a class'],
      ['tea', 'coffee', 'an office'],
      ['cricket', 'football', 'a club'],
    ] as const);
    return { form: 'numeric', text: `In ${place}, ${a} people like ${groupA}, ${b} like ${groupB}, and ${both} like both. How many like at least one of them?`, parts: [g.answerPart('Number who like at least one', a + b - both, 2, [step('Use the formula for a union', `n(A\\cup B) = n(A) + n(B) - n(A\\cap B) = ${a} + ${b} - ${both} = ${a + b - both}`)])] };
  }),
  custom('subsets', [1, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const n = g.int(3, 6);
    return g.mcqNumber(`A set has ${n} elements. How many subsets does it have?`, 2 ** n, '', [
      { slip: 'used n²', value: n * n },
      { slip: 'forgot the empty set', value: 2 ** n - 1 },
      { slip: 'used 2n', value: 2 * n },
      { slip: 'counted the proper subsets only', value: 2 ** n - 2 },
    ], { digits: 4 });
  }),
  custom('function-value', [1, 'b', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const a = g.int(1, 4);
    const b = g.int(-5, 5);
    const c = g.int(-5, 5);
    const x = g.int(-3, 4);
    const f: [number, number][] = [[a, 2], [b, 1], [c, 0]];
    return g.mcqNumber(`If ${$(`f(x) = ${polyTex(f)}`)}, then ${$(`f(${x})`)} is:`, evalPoly(f, x), '', [
      { slip: 'forgot to square x', value: a * x + b * x + c },
      { slip: 'used a sign wrongly', value: evalPoly(f, -x) },
      { slip: 'left out the constant', value: a * x * x + b * x },
      { slip: 'left out the linear term', value: a * x * x + c },
    ], { digits: 4 });
  }),
  custom('domain', [1, 'b', 2, 2], { type: 'short', format: 'short' }, (g) => {
    const a = g.int(1, 9);
    const form = g.pick(['root', 'frac', 'rootneg'] as const);
    if (form === 'root') return g.theory(`Find the domain of ${$(`f(x) = \\sqrt{x - ${a}}`)}.`, [`The expression under the root must not be negative, so ${$(`x - ${a} \\ge 0`)}.`, `The domain is ${$(`[${a}, \\infty)`)}.`]);
    if (form === 'frac') return g.theory(`Find the domain of ${$(`f(x) = \\dfrac{1}{x - ${a}}`)}.`, ['The denominator must not be zero.', `The domain is all real numbers except ${a}.`]);
    return g.theory(`Find the domain of ${$(`f(x) = \\sqrt{${a * a} - x^2}`)}.`, [`The expression under the root must not be negative, so ${$(`x^2 \\le ${a * a}`)}.`, `The domain is ${$(`[-${a}, ${a}]`)}.`]);
  }),
  custom('trig-value', [1, 'c', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const [q, right] = g.pick(TRIG);
    return g.mcq(`The value of ${$(q)} is:`, $(right), g.sample(TRIG_VALUES.filter((v) => v !== right), 3).map($));
  }),
  custom('radian', [1, 'c', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const [deg, right, wrong] = g.pick([
      [30, '\\dfrac{\\pi}{6}', ['\\dfrac{\\pi}{3}', '\\dfrac{\\pi}{4}', '\\dfrac{2\\pi}{3}']],
      [45, '\\dfrac{\\pi}{4}', ['\\dfrac{\\pi}{6}', '\\dfrac{\\pi}{3}', '\\dfrac{\\pi}{2}']],
      [60, '\\dfrac{\\pi}{3}', ['\\dfrac{\\pi}{6}', '\\dfrac{\\pi}{4}', '\\dfrac{2\\pi}{3}']],
      [120, '\\dfrac{2\\pi}{3}', ['\\dfrac{\\pi}{3}', '\\dfrac{3\\pi}{4}', '\\dfrac{5\\pi}{6}']],
      [150, '\\dfrac{5\\pi}{6}', ['\\dfrac{2\\pi}{3}', '\\dfrac{3\\pi}{4}', '\\dfrac{\\pi}{6}']],
    ] as const);
    return g.mcq(`${deg}° in radians is:`, $(right), wrong.map($));
  }),
  custom('arc', [1, 'c', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const r = g.int(2, 20);
    const deg = g.pick([30, 45, 60, 90, 120]);
    return { form: 'numeric', text: `An arc of a circle of radius ${r} cm subtends an angle of ${deg}° at the centre. Find the length of the arc.`, parts: [g.answerPart('Length of the arc', (r * deg * Math.PI) / 180, 2, [step('Change the angle to radians and multiply', `l = r\\theta = ${r}\\cdot\\dfrac{${deg}\\pi}{180}`)], 'cm')] };
  }),
  custom('identity', [1, 'c', 3, 2], { type: 'proof', format: 'long' }, (g) => {
    const [q, a, b, c] = g.pick([
      ['\\dfrac{\\sin 2\\theta}{1 + \\cos 2\\theta} = \\tan\\theta', 'Use sin 2θ = 2 sin θ cos θ on top.', 'Use 1 + cos 2θ = 2 cos²θ below.', 'Cancelling 2 cos θ gives tan θ.'],
      ['\\sin^2\\theta + \\cos^2\\theta + \\tan^2\\theta = \\sec^2\\theta', 'Replace sin²θ + cos²θ by 1.', 'The left side becomes 1 + tan²θ.', 'That equals sec²θ.'],
      ['(\\sin\\theta + \\cos\\theta)^2 = 1 + \\sin 2\\theta', 'Expand to sin²θ + 2 sin θ cos θ + cos²θ.', 'sin²θ + cos²θ = 1.', '2 sin θ cos θ = sin 2θ, which gives the result.'],
      ['\\dfrac{1 - \\cos 2\\theta}{\\sin 2\\theta} = \\tan\\theta', 'Use 1 − cos 2θ = 2 sin²θ on top.', 'Use sin 2θ = 2 sin θ cos θ below.', 'Cancelling 2 sin θ gives tan θ.'],
    ] as const);
    return g.theory(`Prove that ${$(q)}.`, [a, b, c]);
  }),
  ...facts(1, 'a', {
    define: [
      ['a subset', 'A set all of whose elements are in another set.'],
      ['the power set of a set', 'The set of all its subsets.'],
      ['the complement of a set', 'The elements of the universal set that aren’t in the set.'],
    ],
    recall: [
      ['A ∩ A′ is:', 'the empty set', 'the universal set', 'A', 'A′'],
    ],
    truths: [
      ['Every set is a subset of itself.', 'No set is a subset of itself.'],
      ['A ∪ B = B ∪ A.', 'A ∪ B = A only when B is empty, and otherwise never.'],
      ['Two sets with the same number of elements needn’t be equal.', 'Two sets with the same number of elements are always equal.'],
    ],
    compare: [
      ['the union of two sets', 'the intersection of two sets', ['Elements in at least one of them.', 'Elements in all of them.'], ['Written with ∪.', 'Written with ∩.']],
    ],
    reason: [
      ['n(A ∪ B) subtracts n(A ∩ B).', 'Elements in both sets are counted twice when the two sets’ sizes are added.'],
    ],
  }),
  ...facts(1, 'b', {
    define: [
      ['a relation from A to B', 'A subset of the Cartesian product A × B.'],
      ['the domain of a function', 'The set of all input values for which it is defined.'],
      ['the range of a function', 'The set of all the values it actually takes.'],
    ],
    recall: [
      ['If n(A) = 3 and n(B) = 2, then n(A × B) is:', '6', '5', '8', '9'],
      ['The number of relations from A to B, with n(A) = 2 and n(B) = 2, is:', '16', '4', '8', '2'],
      ['The range of f(x) = x² on all real numbers is:', '[0, ∞)', 'all real numbers', '(0, ∞)', '(−∞, 0]'],
    ],
    truths: [
      ['Every function is a relation.', 'Every relation is a function.'],
      ['Two functions are equal only if they have the same domain and the same rule.', 'Two functions are equal whenever they have the same rule, whatever their domains.'],
      ['[x] = x exactly when x is an integer.', '[x] = x for every real number x.'],
    ],
    reason: [
      ['A circle isn’t the graph of a function of x.', 'Most values of x match two values of y.'],
    ],
  }),
  ...facts(1, 'c', {
    define: [
      ['a radian', 'The angle at the centre of a circle subtended by an arc equal in length to the radius.'],
      ['a periodic function', 'A function whose values repeat at regular intervals.'],
    ],
    recall: [
      ['The period of sin x is:', '2π', 'π', 'π/2', '4π'],
      ['The period of tan x is:', 'π', '2π', 'π/2', '4π'],
      ['sin²x + cos²x equals:', '1', '0', '2', 'sin 2x'],
      ['sin 2x equals:', '2 sin x cos x', 'sin²x − cos²x', '2 sin x', '1 − cos²x'],
      ['In the second quadrant, which is positive?', 'sin x', 'cos x', 'tan x', 'all of them'],
    ],
    truths: [
      ['cos(−x) = cos x.', 'cos(−x) = −cos x.'],
      ['sin(−x) = −sin x.', 'sin(−x) = sin x.'],
      ['tan x isn’t defined at π/2.', 'tan x equals zero at π/2.'],
    ],
    reason: [
      ['The sine of an angle can’t be more than 1.', 'In the unit circle, it’s the y-coordinate of a point on the circle.', 'That can’t be more than the radius.'],
    ],
  }),

  // ---- Algebra
  custom('complex-mod', [2, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const [a, b, r] = g.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25]]);
    const sa = g.sign();
    const sb = g.sign();
    return g.mcqNumber(`The modulus of ${$(`${sa * a} ${signed(sb * b)}i`)} is:`, r, '', [
      { slip: 'added the two parts', value: a + b },
      { slip: 'forgot the square root', value: a * a + b * b },
      { slip: 'subtracted the squares', value: Math.sqrt(Math.abs(a * a - b * b)) },
      { slip: 'took a part alone', value: b },
    ], { digits: 4 });
  }),
  custom('complex-product', [2, 'a', 2, 1], { type: 'short', format: 'short' }, (g) => {
    const [a, b, c, d] = [g.int(1, 6), g.int(1, 6), g.int(1, 6), g.int(1, 6)];
    return g.theory(`Express ${$(`(${a} + ${iTerm(b)})(${c} + ${iTerm(d)})`)} in the form ${$('x + iy')}.`, [[`Expand, using ${$('i^2 = -1')}.`, 1], [`The answer is ${$(a * c === b * d ? `${a * d + b * c}i` : `${a * c - b * d} ${signed(a * d + b * c)}i`)}.`, 1]]);
  }),
  custom('complex-divide', [2, 'a', 3, 2], { type: 'short', format: 'short' }, (g) => {
    const [a, b, c, d] = [g.int(1, 6), g.int(1, 6), g.int(1, 4), g.int(1, 4)];
    if (b * c === a * d) g.retry('the quotient is real');
    const denom = c * c + d * d;
    const im = frac(Math.abs(b * c - a * d), denom).tex();
    return g.theory(`Express ${$(`\\dfrac{${a} + ${iTerm(b)}}{${c} + ${iTerm(d)}}`)} in the form ${$('x + iy')}.`, [
      [`Multiply top and bottom by the conjugate, ${$(`${c} - ${iTerm(d)}`)}.`, 1],
      [`The denominator becomes ${denom}.`, 1],
      [`The answer is ${$(`${frac(a * c + b * d, denom).tex()} ${b * c > a * d ? '+' : '-'} ${im === '1' ? '' : im}i`)}.`, 1],
    ]);
  }),
  custom('quadratic-roots', [2, 'b', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const p = g.int(-6, 6);
    const q = g.int(-6, 6);
    if (p === q || !p || !q) g.retry();
    return { form: 'numeric', text: `The equation ${$(`${polyTex([[1, 2], [-(p + q), 1], [p * q, 0]])} = 0`)} has roots α and β. Find the sum and the product of the roots.`, parts: [g.answerPart('α + β', p + q, 1, [step('Use −b/a', `\\alpha + \\beta = ${p + q}`)]), g.answerPart('αβ', p * q, 1, [step('Use c/a', `\\alpha\\beta = ${p * q}`)])] };
  }),
  custom('discriminant', [2, 'b', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const a = g.int(1, 3);
    const b = g.int(-6, 6);
    const c = g.int(-4, 5);
    if (!b || !c) g.retry();
    const d = b * b - 4 * a * c;
    const right = d > 0 ? 'real and different' : d === 0 ? 'real and equal' : 'not real';
    return g.mcq(`The roots of ${$(`${polyTex([[a, 2], [b, 1], [c, 0]])} = 0`)} are:`, right, ['real and different', 'real and equal', 'not real', 'all zero'].filter((o) => o !== right), { why: `The discriminant is ${d < 0 ? `−${-d}` : d}.` });
  }),
  custom('nCr', [2, 'c', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const n = g.int(5, 12);
    const r = g.int(2, 4);
    const [what] = g.pick([[`A team of ${r} is chosen from ${n} players.`], [`A committee of ${r} is chosen from ${n} teachers.`], [`${r} books are chosen from a shelf of ${n}.`]] as const);
    return { form: 'numeric', text: `${what} How many selections are possible?`, parts: [g.answerPart('Number of selections', nCr(n, r), 2, [step('Order doesn’t matter, so use combinations', `\\binom{${n}}{${r}} = ${nCr(n, r)}`)])] };
  }),
  custom('nPr', [2, 'c', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const n = g.int(4, 7);
    const r = g.int(2, 3);
    const right = factorial(n) / factorial(n - r);
    return g.mcqNumber(`In how many ways can ${r} students from ${n} be placed in a line?`, right, '', [
      { slip: 'used combinations, ignoring order', value: nCr(n, r) },
      { slip: 'used n to the power r', value: n ** r },
      { slip: 'used n!', value: factorial(n) },
      { slip: 'used r!', value: factorial(r) },
    ], { digits: 6 });
  }),
  custom('arrangements-word', [2, 'c', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const [word, reps] = g.pick([['LEVEL', [2, 2]], ['BANANA', [3, 2]], ['MISSISSIPPI', [4, 4, 2]], ['SCHOOL', [2]], ['COMMITTEE', [2, 2, 2]], ['ROTOR', [2, 2]]] as [string, number[]][]);
    const total = factorial(word.length) / reps.reduce((p, r) => p * factorial(r), 1);
    return { form: 'numeric', text: `How many different arrangements can be made of the letters of the word ${word}?`, parts: [g.answerPart('Number of arrangements', total, 3, [step('Divide for each repeated letter', `\\dfrac{${word.length}!}{${reps.map((r) => `${r}!`).join('\\,')}} = ${total}`)])] };
  }),
  custom('binomial-term', [2, 'd', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const n = g.int(4, 8);
    const r = g.int(1, n - 1);
    const a = g.int(1, 3);
    const coefficient = nCr(n, r) * a ** r;
    return { form: 'numeric', text: `Find the coefficient of ${$(`x^{${r}}`)} in the expansion of ${$(`(1 + ${a === 1 ? '' : a}x)^{${n}}`)}.`, parts: [g.answerPart('The coefficient', coefficient, 3, [step('Use the general term', `T_{r+1} = \\binom{${n}}{${r}}(${a}x)^{${r}}`, `\\text{Coefficient} = ${nCr(n, r)}\\cdot${a ** r} = ${coefficient}`)])] };
  }),
  custom('middle-term', [2, 'd', 2, 2], { type: 'short', format: 'short' }, (g) => {
    const n = 2 * g.int(2, 4);
    const k = n / 2;
    return g.theory(`Write the middle term in the expansion of ${$(`(1 + x)^{${n}}`)}.`, [`There are ${n + 1} terms, so the middle is term number ${k + 1}.`, `It is ${$(`\\binom{${n}}{${k}}x^{${k}} = ${nCr(n, k)}x^{${k}}`)}.`]);
  }),
  custom('ap-term', [2, 'e', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const a = g.int(1, 9);
    const d = g.int(2, 7);
    const n = g.int(6, 20);
    return g.mcqNumber(`The ${n}th term of the arithmetic progression ${a}, ${a + d}, ${a + 2 * d}, … is:`, a + (n - 1) * d, '', [
      { slip: 'used n rather than n − 1', value: a + n * d },
      { slip: 'added n to a', value: a + n },
      { slip: 'forgot the first term', value: (n - 1) * d },
      { slip: 'multiplied a by n', value: a * n },
    ], { digits: 5 });
  }),
  custom('ap-sum', [2, 'e', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const a = g.int(1, 9);
    const d = g.int(1, 6);
    const n = g.int(8, 30);
    const s = (n * (2 * a + (n - 1) * d)) / 2;
    return { form: 'numeric', text: `Find the sum of the first ${n} terms of the arithmetic progression ${a}, ${a + d}, ${a + 2 * d}, …`, parts: [g.answerPart('The sum', s, 2, [step('Use the sum formula', `S_n = \\dfrac{n}{2}[2a + (n-1)d] = \\dfrac{${n}}{2}[${2 * a} + ${n - 1}\\cdot ${d}] = ${s}`)])] };
  }),
  custom('gp-sum', [2, 'e', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const a = g.int(1, 5);
    const r = g.pick([2, 3]);
    const n = g.int(4, 7);
    const s = (a * (r ** n - 1)) / (r - 1);
    return { form: 'numeric', text: `The first term of a geometric progression is ${a}, and its common ratio is ${r}.`, parts: [g.answerPart(`Term number ${n}`, a * r ** (n - 1), 1, [step('Use the general term', `a r^{n-1} = ${a}\\cdot ${r}^{${n - 1}} = ${a * r ** (n - 1)}`)]), g.answerPart(`Sum of the first ${n} terms`, s, 2, [step('Use the sum formula', `S_n = \\dfrac{a(r^n - 1)}{r - 1} = ${s}`)])] };
  }),
  custom('savings', [2, 'e', 3, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const start = 100 * g.int(1, 5);
    const rise = 50 * g.int(1, 4);
    const months = g.pick([6, 8, 10, 12]);
    const last = start + (months - 1) * rise;
    const total = (months * (start + last)) / 2;
    return { form: 'numeric', text: `A student saves ₹${start} in the first month, and ₹${rise} more each month than the month before.`, parts: [g.answerPart(`Saved in month ${months}, in rupees`, last, 1, [step('Use the nth term', `${start} + ${months - 1}\\cdot ${rise} = ${last}`)]), g.answerPart(`Total saved in ${months} months, in rupees`, total, 2, [step('Use the sum', `\\dfrac{${months}}{2}(${start} + ${last}) = ${total}`)])] };
  }),
  ...facts(2, 'a', {
    define: [
      ['the modulus of a complex number', 'Its distance from the origin on an Argand diagram, √(x² + y²).'],
      ['the conjugate of a complex number', 'The number with the same real part, and the opposite imaginary part.'],
    ],
    recall: [
      ['i² equals:', '−1', '1', 'i', '−i'],
      ['i³ equals:', '−i', 'i', '1', '−1'],
      ['A complex number multiplied by its conjugate is:', 'real', 'always zero', 'purely imaginary', 'always negative'],
    ],
    truths: [
      ['Two complex numbers are equal only if their real and imaginary parts are equal.', 'Two complex numbers are equal whenever their moduli are equal.'],
      ['The modulus of a product equals the product of the moduli.', 'The modulus of a product equals the sum of the moduli.'],
      ['The conjugate of a sum equals the sum of the conjugates.', 'The conjugate of a sum equals the difference of the conjugates.'],
    ],
    reason: [
      ['Complex numbers aren’t ordered like real numbers.', 'There’s no consistent way to say which is greater, one that still works with multiplication.'],
    ],
  }),
  ...facts(2, 'b', {
    recall: [
      ['If one root of x² − 5x + k = 0 is 2, then k is:', '6', '3', '10', '−6'],
      ['The roots of x² − 5x + 6 = 0 are:', '2 and 3', '−2 and −3', '1 and 6', '−1 and 6'],
      ['Roots are real and equal when the discriminant is:', '0', 'positive', 'negative', '1'],
    ],
    truths: [
      ['A quadratic with real coefficients has complex roots in conjugate pairs.', 'A quadratic with real coefficients can have just one complex root.'],
      ['A quadratic has exactly two roots, counted with repetition.', 'A quadratic can have five roots.'],
      ['If 1 is a root, then a + b + c = 0.', 'If 1 is a root, then a + b + c = 1.'],
      ['The roots of ax² + bx + c = 0 are (−b ± √(b² − 4ac))/(2a).', 'The roots of ax² + bx + c = 0 are (b ± √(b² − 4ac))/(2a).'],
    ],
    explain: [
      ['Write the quadratic equation with roots 3 and 5.', 'x² − (3 + 5)x + 3 × 5 = 0, which is x² − 8x + 15 = 0.'],
    ],
  }),
  ...facts(2, 'c', {
    define: [
      ['a permutation', 'An arrangement of objects, in which order matters.'],
      ['a combination', 'A selection of objects, in which order doesn’t matter.'],
      ['the fundamental principle of counting', 'If one event can happen in m ways and another in n ways, both can happen in mn ways.'],
      ['n factorial', 'n!, the product of all the whole numbers from 1 to n.'],
    ],
    recall: [
      ['The number of ways to arrange n different objects in a circle is:', '(n − 1)!', 'n!', 'n', '2n'],
    ],
    compare: [
      ['permutations', 'combinations', ['Order matters.', 'Order doesn’t matter.'], ['Example: arranging runners on a podium.', 'Example: choosing members of a team.']],
    ],
    truths: [
      ['The number of diagonals of a polygon with n sides is ⁿC₂ − n.', 'The number of diagonals of a polygon with n sides is ⁿC₂.'],
      ['ⁿC₀ equals 1.', 'ⁿC₀ equals 0.'],
      ['ⁿCᵣ + ⁿCᵣ₋₁ equals ⁿ⁺¹Cᵣ.', 'ⁿCᵣ + ⁿCᵣ₋₁ equals ⁿCᵣ₊₁.'],
      ['There are 504 three-digit numbers with different digits from 1 to 9.', 'There are 729 three-digit numbers with different digits from 1 to 9.'],
    ],
  }),
  ...facts(2, 'd', {
    recall: [
      ['The number of terms in (a + b)ⁿ is:', 'n + 1', 'n', 'n − 1', '2n'],
      ['The sum of the binomial coefficients in (1 + x)ⁿ is:', '2ⁿ', 'n', 'n²', '2n'],
      ['The general term of (a + b)ⁿ is:', 'ⁿCᵣ aⁿ⁻ʳ bʳ', 'ⁿCᵣ aʳ bⁿ', 'ⁿCᵣ aⁿ bʳ', 'aⁿ⁻ʳ bʳ'],
    ],
    truths: [
      ['Coefficients equally far from the two ends of an expansion are equal.', 'Coefficients equally far from the two ends of an expansion are never equal.'],
      ['(a + b)ⁿ with an even n has one middle term.', '(a + b)ⁿ with an even n has two middle terms.'],
      ['Pascal’s triangle gives the binomial coefficients.', 'Pascal’s triangle gives the prime numbers.'],
    ],
    long: [
      ['Using the binomial theorem, show that 1.01⁵ is about 1.051.', 'Write 1.01 as 1 + 0.01.', 'The expansion is 1 + 5(0.01) + 10(0.01)² + …', 'The sum of the first three terms is 1 + 0.05 + 0.001.', 'So it’s about 1.051, as later terms are tiny.'],
    ],
  }),
  ...facts(2, 'e', {
    define: [
      ['an arithmetic progression', 'A sequence in which each term differs from the one before by a fixed amount.'],
      ['a geometric progression', 'A sequence in which each term is a fixed multiple of the one before.'],
      ['the common ratio of a GP', 'The fixed number by which each term is multiplied to give the next.'],
      ['a series', 'The sum of the terms of a sequence.'],
    ],
    recall: [
      ['The sum of an infinite GP with |r| < 1 is:', 'a/(1 − r)', 'a/(1 + r)', 'a r', 'infinite'],
      ['The arithmetic mean of a and b is:', '(a + b)/2', '√(ab)', '2ab/(a + b)', 'ab'],
      ['The geometric mean of a and b is:', '√(ab)', '(a + b)/2', 'ab', 'a/b'],
    ],
    truths: [
      ['Inserting n arithmetic means between a and b gives an AP of n + 2 terms.', 'Inserting n arithmetic means between a and b gives an AP of n terms.'],
      ['The nth term of a GP is ar^(n−1).', 'The nth term of a GP is ar^n.'],
      ['An AP’s common difference can be negative.', 'An AP’s common difference can never be negative.'],
      ['The sum of n terms of an AP is n/2 times the sum of its first and last terms.', 'The sum of n terms of an AP is n times the sum of its first and last terms.'],
    ],
    compare: [
      ['an AP', 'a GP', ['A fixed difference.', 'A fixed ratio.'], ['Grows steadily.', 'Can grow very quickly.']],
    ],
    cases: [
      {
        scene: 'A bacteria culture doubles in number every hour, starting from 500. Meanwhile, a water tank is filled by adding a fixed 500 litres every hour.',
        parts: [
          ['Which one follows a geometric progression?', 'The bacteria, since their number multiplies by a fixed ratio.', 1],
          ['How many bacteria are there after 4 hours?', '500 × 2⁴ = 8000.', 1],
          ['How much water is in the tank after 4 hours, if it starts empty?', '2000 litres.', 1],
        ],
      },
    ],
  }),

  // ---- Coordinate geometry
  custom('slope', [3, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const [x1, y1, dx, dy] = [g.int(-4, 4), g.int(-4, 4), g.int(1, 6), g.int(1, 6)];
    const s = frac(dy, dx);
    const others = [frac(dx, dy), frac(-dy, dx), frac(dy + dx, dx), frac(dy, dx + 1)].filter((f) => f.text() !== s.text());
    return g.mcq(`The slope of the line through ${$(`(${x1}, ${y1})`)} and ${$(`(${x1 + dx}, ${y1 + dy})`)} is:`, $(s.tex()), [...new Set(others.map((f) => $(f.tex())))].slice(0, 3));
  }),
  custom('line-eq', [3, 'a', 2, 1], { type: 'short', format: 'short' }, (g) => {
    const m = g.int(-4, 4);
    const x = g.int(-3, 4);
    const y = g.int(-3, 4);
    if (!m) g.retry();
    return g.theory(`Find the equation of the line through ${$(`(${x}, ${y})`)} with a slope of ${$(String(m))}.`, [`Use ${$('y - y_1 = m(x - x_1)')}.`, `So ${$(`y = ${polyTex([[m, 1], [y - m * x, 0]])}`)}.`]);
  }),
  custom('point-line', [3, 'a', 2, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const [a, b, r] = g.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]);
    const c = g.int(1, 9);
    const px = g.int(1, 5);
    const py = g.int(1, 5);
    const top = Math.abs(a * px + b * py + c);
    return { form: 'numeric', text: `Find the perpendicular distance of the point (${px}, ${py}) from the line ${$(`${a}x + ${b}y + ${c} = 0`)}.`, parts: [g.answerPart('The distance', top / r, 2, [step('Use the distance formula', `\\dfrac{|${a}\\cdot${px} + ${b}\\cdot${py} + ${c}|}{\\sqrt{${a}^2 + ${b}^2}} = ${frac(top, r).tex()}`)], 'units', frac(top, r).text())] };
  }),
  custom('circle-centre', [3, 'b', 2, 1], { type: 'short', format: 'short' }, (g) => {
    const h = g.int(-5, 5);
    const k = g.int(-5, 5);
    const r = g.int(1, 7);
    const c = h * h + k * k - r * r;
    if (!h || !k) g.retry();
    return g.theory(`Find the centre and the radius of the circle ${$(`x^2 + y^2 ${signed(-2 * h)}x ${signed(-2 * k)}y ${signed(c)} = 0`)}.`, [`Completing the squares, the centre is ${$(`(${h}, ${k})`)}.`, `The radius is ${r}.`]);
  }),
  custom('parabola', [3, 'c', 2, 2], { type: 'short', format: 'short' }, (g) => {
    const a = g.int(1, 6);
    return g.theory(`For the parabola ${$(`y^2 = ${4 * a}x`)}, find its focus, and the length of its latus rectum.`, [`Comparing with ${$('y^2 = 4ax')}, ${$(`a = ${a}`)}, so the focus is (${a}, 0).`, `The latus rectum has length ${4 * a}.`]);
  }),
  custom('ellipse', [3, 'c', 3, 3], { type: 'short', format: 'short' }, (g) => {
    const [a, b, c] = g.pick([[5, 3, 4], [13, 5, 12], [5, 4, 3], [10, 6, 8], [10, 8, 6], [17, 8, 15]]);
    return g.theory(`For the ellipse ${$(`\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1`)}, find its eccentricity, its foci, and the length of its latus rectum.`, [
      [`${$(`e = \\sqrt{1 - \\dfrac{b^2}{a^2}} = ${frac(c, a).tex()}`)}.`, 1],
      [`The foci are (±${c}, 0).`, 1],
      [`The latus rectum has length ${$(`\\dfrac{2b^2}{a} = ${frac(2 * b * b, a).tex()}`)}.`, 1],
    ]);
  }),
  custom('distance-3d', [3, 'd', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const [dx, dy, dz, r] = g.pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9]]);
    const p = [g.int(-3, 3), g.int(-3, 3), g.int(-3, 3)];
    const q = [p[0] + dx, p[1] + dy, p[2] + dz];
    return { form: 'numeric', text: `Find the distance between the points ${point(p)} and ${point(q)}.`, parts: [g.answerPart('The distance', r, 2, [step('Use the distance formula', `\\sqrt{${dx}^2 + ${dy}^2 + ${dz}^2} = ${r}`)], 'units')] };
  }),
  custom('section-3d', [3, 'd', 2, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const m = g.int(1, 3);
    const n = g.int(1, 3);
    const a = [g.int(-3, 3), g.int(-3, 3), g.int(-3, 3)];
    const b = [g.int(-3, 3), g.int(-3, 3), g.int(-3, 3)];
    if (a[0] === b[0]) g.retry('the x-coordinate would not change');
    const x = frac(m * b[0] + n * a[0], m + n);
    return { form: 'numeric', text: `A point divides the line joining ${point(a)} and ${point(b)} internally, in the ratio ${m} : ${n}. Find its x-coordinate.`, parts: [g.answerPart('x-coordinate', x.value, 2, [step('Use the section formula', `x = \\dfrac{${m}(${b[0]}) + ${n}(${a[0]})}{${m + n}} = ${x.tex()}`)], '', x.text())] };
  }),
  ...facts(3, 'a', {
    define: [
      ['the slope of a line', 'The tangent of the angle it makes with the positive x-axis.'],
    ],
    recall: [
      ['Two lines are parallel if their slopes are:', 'equal', 'negative reciprocals', 'both zero', 'both one'],
    ],
    truths: [
      ['The intercept form of a line is x/a + y/b = 1.', 'The intercept form of a line is ax + by = 1.'],
      ['A horizontal line has a slope of zero.', 'A horizontal line has no defined slope.'],
      ['y = mx + c has a y-intercept of c.', 'y = mx + c has a y-intercept of m.'],
    ],
  }),
  ...facts(3, 'b', {
    define: [
      ['a circle', 'The set of all points at a fixed distance from a fixed point.'],
    ],
    recall: [
      ['The radius of x² + y² = 16 is:', '4', '16', '8', '2'],
      ['The centre of (x − 2)² + (y + 3)² = 25 is:', '(2, −3)', '(−2, 3)', '(2, 3)', '(−2, −3)'],
    ],
    truths: [
      ['The longest chord of a circle is a diameter.', 'The longest chord of a circle is a radius.'],
      ['A circle can be drawn through any three points not on one line.', 'A circle can be drawn through any four points.'],
      ['Every circle’s equation has equal coefficients of x² and y².', 'A circle’s equation has different coefficients of x² and y².'],
    ],
  }),
  ...facts(3, 'c', {
    define: [
      ['eccentricity of a conic', 'The ratio of a point’s distance from the focus to its distance from the directrix.'],
      ['the latus rectum', 'The chord of a conic through its focus, at right angles to its axis.'],
    ],
    recall: [
      ['The eccentricity of a parabola is:', '1', '0', 'greater than 1', 'less than 1'],
      ['The focus of y² = 4ax is:', '(a, 0)', '(0, a)', '(−a, 0)', '(0, 0)'],
    ],
    compare: [
      ['an ellipse', 'a hyperbola', ['Eccentricity less than 1.', 'Eccentricity greater than 1.'], ['A closed curve.', 'An open curve with two branches.']],
    ],
    truths: [
      ['A circle is an ellipse with an eccentricity of zero.', 'A circle is a hyperbola with an eccentricity of zero.'],
      ['The foci of an ellipse lie on its major axis.', 'The foci of an ellipse lie on its minor axis.'],
      ['The vertex of y² = 4ax is at the origin.', 'The vertex of y² = 4ax is at (a, 0).'],
    ],
    cases: [
      {
        scene: 'A satellite dish has a parabolic cross-section, 60 cm wide and 10 cm deep at its centre. The receiver must be placed at the focus so that all the incoming signals meet there.',
        parts: [
          ['Taking the vertex as the origin, write the form of the parabola’s equation.', 'y² = 4ax, with the axis along the dish’s centre line.', 1],
          ['Use the point (10, 30) to find a.', '900 = 40a, so a = 22.5.', 1],
          ['How far from the vertex should the receiver be?', '22.5 cm, at the focus.', 1],
        ],
      },
    ],
  }),
  ...facts(3, 'd', {
    recall: [
      ['The x-coordinate of any point on the yz-plane is:', '0', '1', 'any value', 'equal to y'],
      ['Three-dimensional space is divided by the coordinate planes into how many octants?', '8', '4', '6', '2'],
      ['The midpoint of (2, 4, 6) and (4, 8, 2) is:', '(3, 6, 4)', '(6, 12, 8)', '(1, 2, 2)', '(2, 4, 4)'],
    ],
    truths: [
      ['A point on the x-axis has y = 0 and z = 0.', 'A point on the x-axis has x = 0 and y = 0.'],
      ['The three coordinate axes are mutually perpendicular.', 'The three coordinate axes all lie in one plane.'],
      ['The section formula works for external division, with a sign change.', 'The section formula can’t be used for external division.'],
      ['The z-axis meets the xy-plane at the origin.', 'The z-axis lies in the xy-plane.'],
    ],
  }),

  // ---- Limits and derivatives
  custom('limit-factor', [4, 'a', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const a = g.int(1, 6);
    const b = g.int(-5, 5);
    if (b === -a) g.retry();
    return { form: 'numeric', text: `Evaluate ${$(`\\lim_{x\\to ${a}} \\dfrac{x^2 ${signed(b - a)}x ${signed(-a * b)}}{x - ${a}}`)}.`, parts: [g.answerPart('The limit', a + b, 2, [step('Factorise the top', `\\dfrac{(x - ${a})(x ${signed(b)})}{x - ${a}} = x ${signed(b)}`), step('Put in the value', `${a} ${signed(b)} = ${a + b}`)])] };
  }),
  custom('limit-special', [4, 'a', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const k = g.int(2, 7);
    const m = g.int(2, 7);
    if (k === m) g.retry();
    const right = frac(k, m);
    const wrongs = [frac(m, k), frac(1), frac(k * m), frac(0)].filter((f) => f.text() !== right.text());
    return g.mcq(`The value of ${$(`\\lim_{x\\to 0} \\dfrac{\\sin ${k}x}{${m}x}`)} is:`, $(right.tex()), wrongs.slice(0, 3).map((f) => $(f.tex())));
  }),
  custom('derivative-power', [4, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const n = g.int(2, 7);
    const a = g.int(2, 6);
    return g.mcq(`The derivative of ${$(`${a}x^{${n}}`)} is:`, $(`${a * n}x^{${n - 1}}`), [`${a}x^{${n - 1}}`, `${a * n}x^{${n}}`, `${a}x^{${n + 1}}`].map($));
  }),
  custom('first-principles', [4, 'a', 3, 2], { type: 'proof', format: 'long' }, (g) => {
    const a = g.int(1, 5);
    const b = g.int(1, 5);
    return g.theory(`Find the derivative of ${$(`f(x) = ${polyTex([[a, 2], [b, 1]])}`)} from first principles.`, [
      [`Write ${$('f\'(x) = \\lim_{h\\to 0}\\dfrac{f(x + h) - f(x)}{h}')}.`, 1],
      [`The numerator simplifies to ${$(`${2 * a}xh + ${a}h^2 + ${b}h`)}.`, 1],
      [`Dividing by h and letting h tend to zero gives ${$(`${2 * a}x ${signed(b)}`)}.`, 1],
    ]);
  }),
  custom('derivative-at', [4, 'a', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const f: [number, number][] = [[g.int(1, 4), 3], [g.int(-5, 5), 2], [g.int(-5, 5), 1]];
    const x = g.int(-2, 3);
    const value = 3 * f[0][0] * x * x + 2 * f[1][0] * x + f[2][0];
    return { form: 'numeric', text: `Find the derivative of ${$(`f(x) = ${polyTex(f)}`)} at ${$(`x = ${x}`)}.`, parts: [g.answerPart('Value of the derivative', value, 2, [step('Differentiate each term', `f'(x) = ${polyTex([[3 * f[0][0], 2], [2 * f[1][0], 1], [f[2][0], 0]])}`), step('Put in the value', `f'(${x}) = ${value}`)])] };
  }),
  ...facts(4, 'a', {
    define: [
      ['the limit of a function', 'The value the function approaches, as its variable approaches a given value.'],
      ['the derivative at a point', 'The limit of the rate of change of a function, as the interval shrinks to zero.'],
      ['the left-hand limit', 'The value a function approaches as x comes towards a point from below.'],
    ],
    recall: [
      ['The derivative of x² + 3x is:', '2x + 3', 'x² + 3', '2x', '2x + 3x'],
      ['The derivative of sin x is:', 'cos x', '−cos x', 'tan x', 'sin x'],
      ['The derivative of cos x is:', '−sin x', 'sin x', 'tan x', '−cos x'],
      ['The product rule says that (uv)′ is:', 'u′v + uv′', 'u′v′', 'u′v − uv′', 'uv′'],
    ],
    truths: [
      ['The derivative gives the slope of the tangent to a curve.', 'The derivative gives the area under a curve.'],
      ['The derivative of x² at x = 3 is 6.', 'The derivative of x² at x = 3 is 9.'],
      ['The left-hand and right-hand limits must agree for the limit to exist.', 'The left-hand and right-hand limits are always different.'],
      ['The quotient rule gives (u/v)′ = (u′v − uv′)/v².', 'The quotient rule gives (u/v)′ = (u′v + uv′)/v².'],
    ],
    reason: [
      ['The limit of (x² − 1)/(x − 1) as x tends to 1 exists, though the function isn’t defined at 1.', 'A limit looks at values near the point, not at the point.', 'Near 1, the function equals x + 1, which approaches 2.'],
    ],
  }),

  // ---- Statistics and probability
  custom('mean', [5, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const list = Array.from({ length: g.int(4, 6) }, () => g.int(2, 20));
    const s = list.reduce((a, b) => a + b, 0);
    if (s % list.length) g.retry();
    const sorted = [...list].sort((a, b) => a - b);
    return g.mcqNumber(`The mean of ${list.join(', ')} is:`, s / list.length, '', [
      { slip: 'forgot to divide', value: s },
      { slip: 'divided by one too few', value: s / (list.length - 1) },
      { slip: 'took the largest value', value: sorted[sorted.length - 1] },
      { slip: 'took the middle value in the list', value: sorted[Math.floor(sorted.length / 2)] },
    ], { digits: 4 });
  }),
  custom('variance', [5, 'a', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const m = g.int(4, 12);
    const devs = g.pick([[-2, 0, 2], [-3, 0, 3], [-1, 0, 1], [-4, -2, 0, 2, 4], [-3, -1, 1, 3], [-2, -1, 0, 1, 2]]);
    const list = devs.map((d) => m + d);
    const squares = devs.reduce((a, d) => a + d * d, 0);
    const variance = frac(squares, devs.length);
    return { form: 'numeric', text: `Find the mean and the variance of ${list.join(', ')}.`, parts: [g.answerPart('The mean', m, 1, [step('Add and divide', `\\bar x = \\dfrac{${list.join(' + ')}}{${list.length}} = ${m}`)]), g.answerPart('The variance', variance.value, 2, [step('Use the deviations from the mean', `\\sigma^2 = \\dfrac{\\sum(x - \\bar x)^2}{n} = \\dfrac{${devs.map((d) => `${dev(d)}^2`).join(' + ')}}{${devs.length}} = ${variance.tex()}`)], '', variance.text())] };
  }),
  custom('mean-dev', [5, 'a', 3, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const m = g.int(50, 80);
    const devs = g.pick([[-10, -5, 0, 5, 10], [-8, -4, 0, 4, 8], [-6, -2, 2, 6], [-9, -3, 3, 9]]);
    const list = devs.map((d) => m + d);
    const md = devs.reduce((a, d) => a + Math.abs(d), 0) / devs.length;
    return { form: 'numeric', text: `A student’s marks in ${list.length} tests were ${list.join(', ')}. Find the mean mark, and the mean deviation about the mean.`, parts: [g.answerPart('The mean mark', m, 1, [step('Add and divide', `\\bar x = \\dfrac{${list.join(' + ')}}{${list.length}} = ${m}`)]), g.answerPart('The mean deviation', md, 2, [step('Average the sizes of the deviations', `\\dfrac{\\sum|x - \\bar x|}{n} = \\dfrac{${devs.map(Math.abs).join(' + ')}}{${devs.length}} = ${md}`)])] };
  }),
  custom('coin-dice', [5, 'b', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const [q, right, wrong] = g.pick([
      ['A fair coin is tossed twice. The probability of two heads is:', frac(1, 4), [frac(1, 2), frac(3, 4), frac(1, 8)]],
      ['A fair die is thrown once. The probability of an even number is:', frac(1, 2), [frac(1, 3), frac(1, 6), frac(2, 3)]],
      ['A fair die is thrown once. The probability of a number above 4 is:', frac(1, 3), [frac(1, 2), frac(1, 6), frac(2, 3)]],
      ['A card is drawn from a pack of 52. The probability that it’s a king is:', frac(1, 13), [frac(1, 4), frac(1, 52), frac(4, 13)]],
      ['A card is drawn from a pack of 52. The probability that it’s a heart is:', frac(1, 4), [frac(1, 13), frac(1, 2), frac(1, 52)]],
    ] as const);
    return g.mcq(q, $(right.tex()), wrong.map((f) => $(f.tex())));
  }),
  custom('prob-union', [5, 'b', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const a = frac(g.int(2, 5), 10);
    const b = frac(g.int(2, 5), 10);
    const both = frac(g.int(1, 1), 10);
    const u = a.add(b).sub(both);
    return { form: 'numeric', text: `If ${$(`P(A) = ${a.tex()}`)}, ${$(`P(B) = ${b.tex()}`)} and ${$(`P(A\\cap B) = ${both.tex()}`)}, find ${$('P(A\\cup B)')}.`, parts: [g.answerPart('The probability', u.value, 2, [step('Use the addition rule', `P(A\\cup B) = P(A) + P(B) - P(A\\cap B) = ${u.tex()}`)], '', u.text())] };
  }),
  ...facts(5, 'a', {
    define: [
      ['variance', 'The mean of the squares of the deviations from the mean.'],
      ['standard deviation', 'The positive square root of the variance.'],
      ['mean deviation', 'The mean of the sizes of the deviations from a central value.'],
    ],
    recall: [
      ['The mode of 2, 3, 3, 5, 7 is:', '3', '2', '5', '4'],
      ['If every value is doubled, the variance:', 'becomes four times as large', 'doubles', 'stays the same', 'halves'],
      ['The median of 2, 5, 7, 9, 11 is:', '7', '5', '9', '6.8'],
    ],
    truths: [
      ['The sum of deviations from the mean is zero.', 'The sum of deviations from the mean is one.'],
      ['Standard deviation has the same units as the data.', 'Standard deviation has the square of the units of the data.'],
      ['Variance can’t be negative.', 'Variance is usually negative.'],
      ['If all the values are equal, the standard deviation is zero.', 'If all the values are equal, the standard deviation is one.'],
    ],
    reason: [
      ['Squares are used in variance.', 'Without them, positive and negative deviations would cancel out.'],
    ],
    compare: [
      ['the mean', 'the median', ['Affected a lot by extreme values.', 'Hardly affected by extreme values.'], ['Uses all the values.', 'Uses the middle value.']],
    ],
  }),
  ...facts(5, 'b', {
    define: [
      ['mutually exclusive events', 'Events that can’t happen at the same time.'],
      ['the sample space', 'The set of all possible outcomes of an experiment.'],
      ['exhaustive events', 'Events that together make up the whole sample space.'],
    ],
    recall: [
      ['The probability of an impossible event is:', '0', '1', '−1', '½'],
      ['The probability of a certain event is:', '1', '0', '½', '−1'],
      ['If P(A) = 0.3, then P(not A) is:', '0.7', '0.3', '1.3', '0'],
    ],
    truths: [
      ['Two events can be exhaustive without being mutually exclusive.', 'Exhaustive events are always mutually exclusive.'],
      ['Each of n equally likely outcomes has a probability of 1/n.', 'Each of n equally likely outcomes has a probability of n.'],
      ['The probabilities of all the outcomes add up to 1.', 'The probabilities of all the outcomes add up to 100.'],
    ],
  }),
  custom('one-one-proof', [1, 'b', 2, 2], { type: 'proof', format: 'short' }, (g) => {
    const a = g.int(2, 7);
    const b = g.int(1, 9);
    return g.theory(`Show that the function ${$(`f(x) = ${a}x ${signed(b)}`)} on the real numbers is one-one.`, [
      [`Suppose ${$('f(x_1) = f(x_2)')}. Then ${$(`${a}x_1 ${signed(b)} = ${a}x_2 ${signed(b)}`)}.`, 1],
      [`Subtracting ${b} and dividing by ${a} gives ${$('x_1 = x_2')}, so f is one-one.`, 1],
    ]);
  }),
  custom('sets-distributive-proof', [1, 'a', 3, 2], { type: 'proof', format: 'short' }, (g) => {
    const universe = [1, 2, 3, 4, 5, 6, 7, 8];
    const pick = () => g.sample(universe, g.int(3, 5)).sort((x, y) => x - y);
    const [A, B, C] = [pick(), pick(), pick()];
    const has = (list: number[], x: number) => list.includes(x);
    const left = universe.filter((x) => has(A, x) && (has(B, x) || has(C, x)));
    const AB = universe.filter((x) => has(A, x) && has(B, x));
    const AC = universe.filter((x) => has(A, x) && has(C, x));
    const right = universe.filter((x) => has(AB, x) || has(AC, x));
    if (left.join() !== right.join() || !left.length) g.retry('the two sides must be the same, and not empty');
    const show = (list: number[]) => `{${list.join(', ')}}`;
    return g.theory(`If A = ${show(A)}, B = ${show(B)} and C = ${show(C)}, verify that A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C).`, [
      [`B ∪ C = ${show(universe.filter((x) => has(B, x) || has(C, x)))}, so A ∩ (B ∪ C) = ${show(left)}.`, 1],
      [`A ∩ B = ${show(AB)} and A ∩ C = ${show(AC)}.`, 1],
      [`Their union is ${show(right)}, the same set.`, 1],
    ]);
  }),
  custom('ellipse-find', [3, 'c', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const [c, a] = g.pick([[3, 5], [4, 5], [5, 13], [12, 13], [6, 10], [8, 10]]);
    const b = Math.sqrt(a * a - c * c);
    return {
      form: 'numeric',
      text: `An ellipse has the equation ${$(`\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{${b * b}} = 1`)}.`,
      parts: [
        g.answerPart('Distance of each focus from the centre', c, 1, [step('Use $c^2 = a^2 - b^2$', `c^2 = ${a * a} - ${b * b} = ${c * c}`, `c = ${c}`)]),
        g.answerPart('Eccentricity', c / a, 1, [step('Use $e = c/a$', `e = \\dfrac{${c}}{${a}}`)]),
        g.answerPart('Length of the latus rectum', (2 * b * b) / a, 1, [step('Use $2b^2/a$', `\\dfrac{2 \\times ${b * b}}{${a}}`)]),
      ],
    };
  }),
  custom('parabola-find', [3, 'c', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const a = g.int(1, 8);
    return {
      form: 'numeric',
      text: `A parabola has the equation ${$(`y^2 = ${4 * a}x`)}.`,
      parts: [
        g.answerPart('x-coordinate of its focus', a, 1, [step('Compare with $y^2 = 4ax$', `4a = ${4 * a}`, `a = ${a}`)]),
        g.answerPart('Length of its latus rectum', 4 * a, 1, [step('It is $4a$', `4a = ${4 * a}`)]),
      ],
    };
  }),
  custom('circle-find', [3, 'b', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const h = g.int(-5, 5);
    const k = g.int(-5, 5);
    const r = g.int(2, 9);
    const c = h * h + k * k - r * r;
    return {
      form: 'numeric',
      text: `A circle has the equation ${$(`x^2 + y^2 ${signed(-2 * h)}x ${signed(-2 * k)}y ${signed(c)} = 0`)}.`,
      parts: [g.answerPart('Radius of the circle', r, 2, [step('Complete the squares', `(x ${signed(-h)})^2 + (y ${signed(-k)})^2 = ${h * h} + ${k * k} ${signed(-c)} = ${r * r}`, `r = ${r}`)])],
    };
  }),
  custom('complex-modulus-find', [2, 'a', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const [a, b] = g.pick([[3, 4], [5, 12], [8, 15], [6, 8], [7, 24]]);
    const [sa, sb] = [g.sign() * a, g.sign() * b];
    return {
      form: 'numeric',
      text: `Find the modulus of the complex number ${$(`z = ${sa} ${signed(sb)}i`)}.`,
      parts: [g.answerPart('Modulus', Math.hypot(a, b), 2, [step('Use $|z| = \\sqrt{a^2 + b^2}$', `|z| = \\sqrt{${a * a} + ${b * b}} = ${Math.hypot(a, b)}`)])],
    };
  }),
  // ---- Real-life and data-based questions.
  custom('cbq-savings', [2, 'e', 3, 1], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const first = g.pick([12, 15, 20, 24]);
    const rise = g.pick([2, 3, 4]);
    const months = g.pick([8, 10, 12, 15]);
    const last = first + (months - 1) * rise;
    const total = (months * (first + last)) / 2;
    return {
      form: 'numeric',
      text: `A hall has ${first} seats in its front row, and ${rise} more in each row behind it.`,
      parts: [
        g.answerPart(`Seats in row ${months}`, last, 1, [step('Use $a_n = a + (n - 1)d$', `${first} + ${months - 1} \\times ${rise} = ${last}`)]),
        g.answerPart(`Seats in the first ${months} rows`, total, 2, [step('Use $S_n = \\dfrac{n}{2}(a + l)$', `\\dfrac{${months}}{2}(${first} + ${last}) = ${total}`)]),
      ],
    };
  }),
  custom('cbq-password', [2, 'c', 3, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const letters = g.pick([2, 3]);
    const digits = g.pick([2, 3]);
    const noRepeat = 26 * 25 * (letters === 3 ? 24 : 1) * 10 * 9 * (digits === 3 ? 8 : 1);
    const repeat = 26 ** letters * 10 ** digits;
    return {
      form: 'numeric',
      text: `A locker code has ${letters} capital letters followed by ${digits} digits.`,
      parts: [
        g.answerPart('Number of codes if letters and digits may repeat', repeat, 1, [step('Multiply the choices', `26^{${letters}} \\times 10^{${digits}} = ${repeat}`)], '', String(repeat)),
        g.answerPart('Number of codes if nothing may repeat', noRepeat, 2, [step('Each choice removes one', `26 \\times 25${letters === 3 ? ' \\times 24' : ''} \\times 10 \\times 9${digits === 3 ? ' \\times 8' : ''} = ${noRepeat}`)], '', String(noRepeat)),
      ],
    };
  }),
  custom('cbq-marks-stats', [5, 'a', 3, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const mean = g.int(10, 20);
    const gaps = g.pick([[-4, -2, 0, 2, 4], [-3, -1, 0, 1, 3], [-6, -2, 0, 2, 6], [-4, -3, 0, 3, 4]]);
    const data = gaps.map((x) => mean + x);
    const variance = frac(gaps.reduce((sum, x) => sum + x * x, 0), 5);
    return {
      form: 'numeric',
      text: 'Five students score these marks in a test. The table gives the marks.',
      diagram: { kind: 'table', head: ['Student', 'A', 'B', 'C', 'D', 'E'], rows: [['Marks', ...data.map(String)]] },
      parts: [
        g.answerPart('Mean mark', mean, 1, [step('Add and divide', `\\dfrac{${data.join(' + ')}}{5} = ${mean}`)]),
        g.answerPart('Variance', variance.value, 2, [step('Average the squared deviations', `\\dfrac{${gaps.map((x) => `(${x})^2`).join(' + ')}}{5} = ${variance.tex()}`)]),
      ],
    };
  }),
  custom('cbq-taxi-line', [3, 'a', 3, 1], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const base = g.pick([20, 30, 40, 50]);
    const rate = g.pick([8, 10, 12, 15]);
    const km = g.int(3, 12);
    const far = km + g.int(2, 6);
    return {
      form: 'numeric',
      text: `A taxi’s fare in rupees follows a straight line against distance in km. A ride of ${km} km costs ₹${base + rate * km}, and one of ${far} km costs ₹${base + rate * far}.`,
      parts: [
        g.answerPart('Slope of the line, the fare per km', rate, 2, [step('Rise over run', `\\dfrac{${base + rate * far} - ${base + rate * km}}{${far} - ${km}} = ${rate}`)]),
        g.answerPart('The fixed charge, where the line meets the fare axis', base, 1, [step('Use one point', `${base + rate * km} - ${rate} \\times ${km} = ${base}`)]),
      ],
    };
  }),
  custom('cbq-sprinkler', [3, 'b', 3, 2], { type: 'short', format: 'cbq', style: 'cbq-style' }, (g) => {
    const h = g.int(1, 6);
    const k = g.int(1, 6);
    const r = g.int(2, 7);
    return g.theory(`A garden sprinkler at the point ${$(`(${h}, ${k})`)}, in metres, waters everything within ${r} m. (i) Write the equation of the edge of the watered circle. (ii) Is a flowerpot at ${$(`(${h + r}, ${k + 1})`)} watered?`, [
      [`(i) ${$(`(x - ${h})^2 + (y - ${k})^2 = ${r * r}`)}.`, 1],
      [`(ii) Its distance squared from the sprinkler is ${$(`${r * r} + 1 = ${r * r + 1}`)}.`, 1],
      [`This is more than ${r * r}, so the pot is just outside and isn’t watered.`, 1],
    ]);
  }),
  custom('cbq-ball-height', [2, 'b', 3, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const t = g.int(2, 6);
    const u = 5 * t;
    const peak = (u * u) / 20;
    return {
      form: 'numeric',
      text: `A ball is thrown up, and its height in metres after t seconds is ${$(`h = ${u}t - 5t^2`)}.`,
      parts: [
        g.answerPart('Time for which it is in the air, in seconds', t, 1, [step('Solve $h = 0$', `5t(${t} - t) = 0`)]),
        g.answerPart('Greatest height, in metres', peak, 2, [step('The vertex is half-way through the flight', `t = ${t / 2}`, `h = ${u} \\times ${t / 2} - 5 \\times ${t / 2}^2 = ${peak}`)]),
      ],
    };
  }),
  custom('cbq-tree-height', [1, 'c', 2, 1], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const [deg, tan, text] = g.pick<[number, number, string]>([[45, 1, '1'], [30, 1 / Math.sqrt(3), '\\dfrac{1}{\\sqrt3}'], [60, Math.sqrt(3), '\\sqrt3']]);
    const d = g.pick([10, 20, 30, 40]);
    return {
      form: 'numeric',
      text: `From a point ${d} m from the foot of a tree, on level ground, the angle up to its top is ${deg}°.`,
      parts: [g.answerPart('Height of the tree, in metres', d * tan, 2, [step('Use the tangent', `h = ${d} \\tan ${deg}^\\circ = ${d} \\times ${text}`)])],
    };
  }),
  custom('cbq-card-draw', [5, 'b', 2, 1], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const [what, count] = g.pick<[string, number]>([['a king', 4], ['a heart', 13], ['a red card', 26], ['a face card', 12], ['the ace of spades', 1]]);
    const p = frac(count, 52);
    return {
      form: 'numeric',
      text: `At a school fair, a player draws one card from a well-shuffled pack of 52, and wins by drawing ${what}.`,
      parts: [g.answerPart('The probability of winning', p.value, 2, [step('Favourable over total', p.d === 52 ? `\\dfrac{${count}}{52}` : `\\dfrac{${count}}{52} = ${p.tex()}`)], '', p.text())],
    };
  }),
  custom('cbq-limit-speed', [4, 'a', 2, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const a = g.int(1, 4);
    const b = g.int(1, 6);
    const t = g.int(1, 5);
    const v = 2 * a * t + b;
    return {
      form: 'numeric',
      text: `A car’s distance in metres after t seconds is ${$(`s = ${polyTex([[a, 2], [b, 1]], 't')}`)}.`,
      parts: [g.answerPart(`Its speed at t = ${t} s, in m/s, found by differentiating`, v, 2, [step('Differentiate', `\\dfrac{ds}{dt} = ${2 * a}t + ${b}`, `= ${v}`)])],
    };
  }),
  ...rest(),
  ...derivationBlueprints('mathematics', 'XI', { custom } as never),
];

export default blueprints;
