// Mathematics, Class XII. Each question is built backwards from a clean answer, in exact arithmetic where it can be.
import { det2, det3, evalPoly, frac, Frac, matrixTex, nCr, polyTex, signed, vecTex } from '../../practice/gen/exact';
import type { Gen } from '../../practice/gen/gen';
import type { Step } from '../../solver/solve';
import { derivationBlueprints } from '../derivations';
import KNOWLEDGE from './knowledge/mathematics-xii';
import { blueprintsFor } from './dsl';
import type { Blueprint, Body } from './types';

const { custom, facts, rest } = blueprintsFor('mathematics', 'XII', KNOWLEDGE);

const step = (label: string, ...math: string[]): Step => ({ label, math });

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** A plane's equation with its coefficients in lowest terms. */
function planeTex(a: number, b: number, c: number, d: number): string {
  const h = [a, b, c, d].reduce(gcd, 0) || 1;
  const term = (k: number, v: string) => `${k === 1 ? '' : k}${v}`;
  return `${term(a / h, 'x')} + ${term(b / h, 'y')} + ${term(c / h, 'z')} = ${d / h}`;
}
const $ = (tex: string) => `$${tex}$`;

/** A one-mark question on an exact value. The wrong options are realistic slips, kept distinct. */
/** One term of a polynomial in TeX, with no coefficient of 1 and nothing for 0. */
const term = (k: Frac, power: string) => (k.n === 0 ? '' : `${k.n === k.d ? '' : k.tex()}${power}`);

/** ax + by + cz, as a teacher would write it: no 0 terms and no coefficients of 1. All are positive here. */
const linear = (k: number[]) => k.map((c, i) => [c, 'xyz'[i]] as const).filter(([c]) => c).map(([c, v]) => `${c === 1 ? '' : c}${v}`).join(' + ');

function mcqFrac(g: Gen, text: string, right: Frac, slips: Frac[], why?: string): Body {
  const seen = new Set([right.text()]);
  const wrong: string[] = [];
  for (const s of slips) {
    if (!seen.has(s.text())) {
      seen.add(s.text());
      wrong.push($(s.tex()));
    }
    if (wrong.length === 3) break;
  }
  if (wrong.length < 3) g.retry('too few distinct slips');
  return g.mcq(text, $(right.tex()), wrong, { why });
}

const PRINCIPAL: { fn: string; arg: string; value: string; tex: string }[] = [
  { fn: '\\sin^{-1}', arg: '\\dfrac{1}{2}', value: 'pi6', tex: '\\dfrac{\\pi}{6}' },
  { fn: '\\sin^{-1}', arg: '-\\dfrac{1}{2}', value: '-pi6', tex: '-\\dfrac{\\pi}{6}' },
  { fn: '\\sin^{-1}', arg: '\\dfrac{\\sqrt3}{2}', value: 'pi3', tex: '\\dfrac{\\pi}{3}' },
  { fn: '\\sin^{-1}', arg: '1', value: 'pi2', tex: '\\dfrac{\\pi}{2}' },
  { fn: '\\cos^{-1}', arg: '\\dfrac{1}{2}', value: 'pi3', tex: '\\dfrac{\\pi}{3}' },
  { fn: '\\cos^{-1}', arg: '-\\dfrac{1}{2}', value: '2pi3', tex: '\\dfrac{2\\pi}{3}' },
  { fn: '\\cos^{-1}', arg: '-1', value: 'pi', tex: '\\pi' },
  { fn: '\\cos^{-1}', arg: '\\dfrac{\\sqrt3}{2}', value: 'pi6', tex: '\\dfrac{\\pi}{6}' },
  { fn: '\\tan^{-1}', arg: '1', value: 'pi4', tex: '\\dfrac{\\pi}{4}' },
  { fn: '\\tan^{-1}', arg: '-1', value: '-pi4', tex: '-\\dfrac{\\pi}{4}' },
  { fn: '\\tan^{-1}', arg: '\\sqrt3', value: 'pi3', tex: '\\dfrac{\\pi}{3}' },
  { fn: '\\tan^{-1}', arg: '\\dfrac{1}{\\sqrt3}', value: 'pi6', tex: '\\dfrac{\\pi}{6}' },
];
const ANGLES = ['\\dfrac{\\pi}{6}', '-\\dfrac{\\pi}{6}', '\\dfrac{\\pi}{3}', '\\dfrac{\\pi}{4}', '-\\dfrac{\\pi}{4}', '\\dfrac{2\\pi}{3}', '\\dfrac{5\\pi}{6}', '\\pi'];

const blueprints: Blueprint[] = [
  // ---- Relations and functions
  custom('compose', [1, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const a = g.int(2, 5);
    const b = g.int(1, 5);
    const c = g.int(1, 3);
    const x = g.int(1, 3);
    const f = (t: number) => a * t + b;
    const h = (t: number) => t * t + c;
    return g.mcqNumber(`If ${$(`f(x) = ${polyTex([[a, 1], [b, 0]])}`)} and ${$(`h(x) = ${polyTex([[1, 2], [c, 0]])}`)}, then ${$(`(f\\circ h)(${x})`)} is:`, f(h(x)), '', [
      { slip: 'worked out h∘f instead', value: h(f(x)) },
      { slip: 'multiplied f and h', value: f(x) * h(x) },
      { slip: 'added f and h', value: f(x) + h(x) },
      { slip: 'forgot the constant in h', value: f(x * x) },
    ], { digits: 4 });
  }),
  custom('inverse-linear', [1, 'a', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const a = g.int(2, 7);
    const b = g.int(1, 9);
    const y = a * g.int(1, 6) + b;
    return { form: 'numeric', text: `The function ${$(`f(x) = ${polyTex([[a, 1], [b, 0]])}`)} is invertible on the real numbers. Find ${$(`f^{-1}(${y})`)}.`, parts: [g.answerPart('Value of the inverse', (y - b) / a, 2, [step('Solve y = f(x) for x', `x = \\dfrac{y ${signed(-b)}}{${a}}`), step('Put in the value', `f^{-1}(${y}) = \\dfrac{${y} ${signed(-b)}}{${a}} = ${(y - b) / a}`)])] };
  }),
  custom('count-relations', [1, 'a', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const n = g.int(3, 4);
    const total = 2 ** (n * n);
    const reflexive = 2 ** (n * n - n);
    const ask = g.pick(['all', 'reflexive'] as const);
    return g.mcqNumber(`How many ${ask === 'all' ? '' : 'reflexive '}relations are there on a set with ${n} elements?`, ask === 'all' ? total : reflexive, '', [
      { slip: 'used 2ⁿ rather than 2 to the power n²', value: 2 ** n },
      { slip: 'used n² on its own', value: n * n },
      ask === 'all' ? { slip: 'left out the diagonal pairs', value: reflexive } : { slip: 'counted every relation, not only the reflexive ones', value: total },
      { slip: 'used 2 to the power 2n', value: 2 ** (2 * n) },
    ], { digits: 6 });
  }),
  custom('bijection-proof', [1, 'a', 3, 2], { type: 'proof', format: 'long' }, (g) => {
    const a = g.int(2, 6);
    const b = g.int(1, 8);
    return g.theory(`Show that the function ${$(`f:\\mathbb{R}\\to\\mathbb{R}`)} given by ${$(`f(x) = ${polyTex([[a, 1], [b, 0]])}`)} is one-one and onto, and write its inverse.`, [
      [`One-one: if ${$(`f(x_1) = f(x_2)`)}, then ${$(`${a}x_1 ${signed(b)} = ${a}x_2 ${signed(b)}`)}, so ${$('x_1 = x_2')}.`, 1],
      [`Onto: for any real y, ${$(`x = \\dfrac{y ${signed(-b)}}{${a}}`)} is real and has ${$('f(x) = y')}.`, 1],
      [`So f is a bijection, with ${$(`f^{-1}(y) = \\dfrac{y ${signed(-b)}}{${a}}`)}.`, 1],
    ]);
  }),
  custom('equivalence', [1, 'a', 3, 2], { type: 'proof', format: 'long' }, (g) => {
    const k = g.pick([2, 3, 4, 5]);
    return g.theory(`On the integers, a relation R is defined by a R b if ${$('a - b')} is divisible by ${k}. Show that R is an equivalence relation.`, [
      [`Reflexive: ${$('a - a = 0')} is divisible by ${k}.`, 1],
      [`Symmetric: if ${$(`a - b = ${k}m`)}, then ${$(`b - a = ${k}(-m)`)}, which is also divisible by ${k}.`, 1],
      [`Transitive: if ${$(`a - b = ${k}m`)} and ${$(`b - c = ${k}n`)}, then ${$(`a - c = ${k}(m + n)`)}. So R is an equivalence relation.`, 1],
    ]);
  }),
  custom('principal', [1, 'b', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const p = g.pick(PRINCIPAL);
    return g.mcq(`The principal value of ${$(`${p.fn}\\left(${p.arg}\\right)`)} is:`, $(p.tex), g.sample(ANGLES.filter((a) => a !== p.tex), 3).map($));
  }),
  custom('principal-sum', [1, 'b', 2, 2], { type: 'short', format: 'short' }, (g) => {
    const [a, b] = g.sample(PRINCIPAL, 2);
    const worth: Record<string, number> = { pi6: 1 / 6, '-pi6': -1 / 6, pi3: 1 / 3, pi2: 1 / 2, '2pi3': 2 / 3, pi: 1, pi4: 1 / 4, '-pi4': -1 / 4 };
    const total = frac(Math.round(worth[a.value] * 12), 12).add(frac(Math.round(worth[b.value] * 12), 12));
    const top = `${Math.abs(total.n) === 1 ? '' : Math.abs(total.n)}\\pi`;
    const tex = total.n === 0 ? '0' : `${total.n < 0 ? '-' : ''}${total.d === 1 ? top : `\\dfrac{${top}}{${total.d}}`}`;
    return g.theory(`Evaluate ${$(`${a.fn}\\left(${a.arg}\\right) + ${b.fn}\\left(${b.arg}\\right)`)}.`, [
      [`The principal values are ${$(a.tex)} and ${$(b.tex)}.`, 1],
      [`Their sum is ${$(tex)}.`, 1],
    ]);
  }),
  custom('tan-add', [1, 'b', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const [a, b] = g.pick([[1, 2], [1, 3], [2, 3], [1, 4], [1, 5], [2, 5], [3, 4], [1, 7]]);
    const c = frac(a, b);
    const d = frac(1, g.int(2, 5));
    const sum = c.add(d).div(frac(1).sub(c.mul(d)));
    if (c.mul(d).value >= 1) g.retry();
    return { form: 'numeric', text: `Find the value of ${$(`\\tan\\left(\\tan^{-1}${c.tex()} + \\tan^{-1}${d.tex()}\\right)`)}.`, parts: [g.answerPart('The value', sum.value, 3, [step('Use the addition formula', `\\tan^{-1}a + \\tan^{-1}b = \\tan^{-1}\\dfrac{a+b}{1-ab}`), step('Put in the values', `\\dfrac{${c.tex()} + ${d.tex()}}{1 - ${c.tex()}\\cdot ${d.tex()}} = ${sum.tex()}`)], '', sum.text())] };
  }),
  ...facts(1, 'a', {
    define: [
      ['an equivalence relation', 'A relation that is reflexive, symmetric and transitive.'],
      ['a one-one function', 'A function in which different elements of the domain have different images.'],
      ['an onto function', 'A function whose range equals its codomain.'],
    ],
    recall: [
      ['A function has an inverse if and only if it is:', 'both one-one and onto', 'one-one only', 'onto only', 'continuous'],
      ['The function f(x) = x² from the real numbers to the real numbers is:', 'neither one-one nor onto', 'one-one only', 'onto only', 'both one-one and onto'],
      ['The function f(x) = x³ from the real numbers to the real numbers is:', 'both one-one and onto', 'one-one only', 'onto only', 'neither one-one nor onto'],
      ['A relation in which (a, b) ∈ R implies (b, a) ∈ R is:', 'symmetric', 'reflexive', 'transitive', 'antisymmetric'],
    ],
    truths: [
      ['The composition of two bijections is a bijection.', 'The composition of two bijections is never a bijection.'],
      ['Every equivalence relation is reflexive.', 'Some equivalence relations aren’t reflexive.'],
      ['The identity relation on a set is an equivalence relation.', 'The identity relation on a set is not symmetric.'],
      ['The inverse of a bijection is itself a bijection.', 'The inverse of a bijection is never one-one.'],
    ],
    compare: [
      ['a one-one function', 'an onto function', ['No two elements of the domain share an image.', 'Every element of the codomain has at least one pre-image.'], ['Concerns the domain’s images being distinct.', 'Concerns the codomain being covered.']],
    ],
    reason: [
      ['The function f(x) = x² on the real numbers has no inverse.', 'It isn’t one-one, since f(2) = f(−2).', 'It also isn’t onto, since it never takes negative values.'],
    ],
    explain: [
      ['Give an example of a relation that is reflexive and transitive, but not symmetric.', 'The relation "is less than or equal to" on the real numbers.', 'For it, 2 ≤ 3 holds, but 3 ≤ 2 doesn’t.'],
    ],
  }),
  ...facts(1, 'b', {
    recall: [
      ['The range of the principal value of sin⁻¹x is:', '[−π/2, π/2]', '[0, π]', '(−π/2, π/2)', '[0, 2π]'],
      ['The range of the principal value of cos⁻¹x is:', '[0, π]', '[−π/2, π/2]', '(0, π)', '[−π, π]'],
      ['The range of the principal value of tan⁻¹x is:', '(−π/2, π/2)', '[0, π]', '[−π/2, π/2]', '(0, π)'],
      ['The value of sin⁻¹x + cos⁻¹x is:', 'π/2', 'π', '0', '2π'],
      ['The domain of cos⁻¹x is:', '[−1, 1]', 'all real numbers', '[0, 1]', '[0, π]'],
    ],
    truths: [
      ['sin⁻¹(−x) = −sin⁻¹x for x in [−1, 1].', 'sin⁻¹(−x) = sin⁻¹x for x in [−1, 1].'],
      ['cos⁻¹(−x) = π − cos⁻¹x for x in [−1, 1].', 'cos⁻¹(−x) = −cos⁻¹x for x in [−1, 1].'],
      ['tan⁻¹x + cot⁻¹x = π/2 for all real x.', 'tan⁻¹x + cot⁻¹x = π for all real x.'],
    ],
    reason: [
      ['sin⁻¹(sin 2π/3) isn’t equal to 2π/3.', 'Principal values of sin⁻¹ lie in [−π/2, π/2].', 'So the value is π/3, which has the same sine.'],
    ],
    long: [
      ['Prove that sin⁻¹x + cos⁻¹x = π/2 for x in [−1, 1].', 'Let sin⁻¹x = θ, so x = sin θ.', 'Then x = cos(π/2 − θ).', 'Since π/2 − θ lies in [0, π], cos⁻¹x = π/2 − θ, which gives the result.'],
    ],
  }),

  // ---- Matrices and determinants
  custom('matrix-product', [2, 'a', 2, 1], { type: 'short', format: 'short' }, (g) => {
    const A = [[g.int(-3, 4), g.int(0, 4)], [g.int(1, 4), g.int(-2, 3)]];
    const B = [[g.int(1, 4), g.int(-2, 3)], [g.int(-1, 3), g.int(1, 4)]];
    const C = [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]];
    return g.theory(`If ${$(`A = ${matrixTex(A)}`)} and ${$(`B = ${matrixTex(B)}`)}, find ${$('AB')}.`, [
      [`Multiply rows by columns: the top row gives ${$(`${C[0][0]}`)} and ${$(`${C[0][1]}`)}.`, 1],
      [`So ${$(`AB = ${matrixTex(C)}`)}.`, 1],
    ]);
  }),
  custom('matrix-order', [2, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const a = g.int(2, 5);
    const b = g.int(2, 5);
    const c = g.int(2, 5);
    if (a === c) g.retry();
    return g.mcq(`If A has order ${a} × ${b} and B has order ${b} × ${c}, the order of AB is:`, `${a} × ${c}`, [`${c} × ${a}`, `${b} × ${b}`, `${a} × ${b}`]);
  }),
  custom('sym-skew', [2, 'a', 3, 2], { type: 'proof', format: 'long' }, (g) => {
    const m = [[g.int(1, 5), 2 * g.int(1, 3)], [2 * g.int(1, 3), g.int(1, 5)]];
    const P = [[m[0][0], (m[0][1] + m[1][0]) / 2], [(m[0][1] + m[1][0]) / 2, m[1][1]]];
    const Q = [[0, (m[0][1] - m[1][0]) / 2], [(m[1][0] - m[0][1]) / 2, 0]];
    return g.theory(`Express ${$(`A = ${matrixTex(m)}`)} as the sum of a symmetric matrix and a skew-symmetric matrix.`, [
      [`Use ${$("P = \\tfrac12(A + A')")} and ${$("Q = \\tfrac12(A - A')")}.`, 1],
      [`${$(`P = ${matrixTex(P)}`)}, which is symmetric.`, 1],
      [`${$(`Q = ${matrixTex(Q)}`)}, which is skew-symmetric, and ${$('A = P + Q')}.`, 1],
    ]);
  }),
  custom('det2', [2, 'b', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const m = [[g.int(1, 7), g.int(1, 7)], [g.int(1, 7), g.int(1, 7)]];
    const d = det2(m);
    return g.mcqNumber(`The value of ${$(`\\begin{vmatrix}${m[0].join(' & ')} \\\\ ${m[1].join(' & ')}\\end{vmatrix}`)} is:`, d === 0 ? g.retry() : d, '', [
      { slip: 'added the two products instead of subtracting', value: m[0][0] * m[1][1] + m[0][1] * m[1][0] },
      { slip: 'subtracted the wrong way round', value: -d },
      { slip: 'multiplied along the rows', value: m[0][0] * m[0][1] - m[1][0] * m[1][1] },
      { slip: 'multiplied along the columns', value: m[0][0] * m[1][0] - m[0][1] * m[1][1] },
    ], { digits: 4 });
  }),
  custom('det3', [2, 'b', 2, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const m = [[g.int(1, 4), g.int(0, 3), g.int(1, 3)], [g.int(0, 3), g.int(1, 4), g.int(0, 2)], [g.int(1, 2), g.int(0, 3), g.int(1, 4)]];
    const d = det3(m);
    if (!d) g.retry();
    return { form: 'numeric', text: `Find the value of ${$(`\\begin{vmatrix}${m.map((r) => r.join(' & ')).join(' \\\\ ')}\\end{vmatrix}`)}.`, parts: [g.answerPart('Value of the determinant', d, 2, [step('Expand along the first row', `${m[0][0]}(${m[1][1]}\\cdot${m[2][2]} - ${m[1][2]}\\cdot${m[2][1]}) - ${m[0][1]}(${m[1][0]}\\cdot${m[2][2]} - ${m[1][2]}\\cdot${m[2][0]}) + ${m[0][2]}(${m[1][0]}\\cdot${m[2][1]} - ${m[1][1]}\\cdot${m[2][0]}) = ${d}`)])] };
  }),
  custom('det-scale', [2, 'b', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const n = g.int(2, 3);
    const k = g.int(2, 4);
    const d = g.int(2, 6);
    const form = g.pick(['scale', 'adj'] as const);
    const right = form === 'scale' ? k ** n * d : d ** (n - 1);
    return g.mcqNumber(form === 'scale' ? `A square matrix A of order ${n} has ${$(`|A| = ${d}`)}. Then ${$(`|${k}A|`)} is:` : `A square matrix A of order ${n} has ${$(`|A| = ${d}`)}. Then ${$('|\\text{adj } A|')} is:`, right, '', form === 'scale' ? [
      { slip: 'multiplied by k only once', value: k * d },
      { slip: 'used k² whatever the order', value: k * k * d },
      { slip: 'added k', value: k + d },
      { slip: 'raised |A| to the power n, not k', value: k * d ** n },
    ] : [
      { slip: 'used |A|ⁿ', value: d ** n },
      { slip: 'took it to equal |A|', value: d },
      { slip: 'used n|A|', value: n * d },
      { slip: 'used 1/|A|', value: 1 / d },
    ], { digits: 4 });
  }),
  custom('area-triangle', [2, 'b', 2, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const pts = [[g.int(0, 3), g.int(0, 3)], [g.int(4, 8), g.int(0, 3)], [g.int(1, 6), g.int(4, 9)]];
    const d = det3(pts.map((p) => [...p, 1]));
    if (!d) g.retry();
    return { form: 'numeric', text: `Using determinants, find the area of the triangle with vertices (${pts[0]}), (${pts[1]}) and (${pts[2]}).`, parts: [g.answerPart('Area of the triangle', Math.abs(d) / 2, 2, [step('Use half the determinant', `\\text{Area} = \\dfrac12\\left|\\begin{vmatrix}${pts.map((p) => `${p[0]} & ${p[1]} & 1`).join(' \\\\ ')}\\end{vmatrix}\\right| = \\dfrac12\\cdot ${Math.abs(d)} = ${Math.abs(d) / 2}`)], 'sq. units')] };
  }),
  custom('inverse-2', [2, 'b', 3, 2], { type: 'short', format: 'short' }, (g) => {
    const m = [[g.int(2, 6), g.int(1, 4)], [g.int(1, 4), g.int(1, 5)]];
    const d = det2(m);
    if (!d) g.retry();
    const inv = [[frac(m[1][1], d).tex(), frac(-m[0][1], d).tex()], [frac(-m[1][0], d).tex(), frac(m[0][0], d).tex()]];
    return g.theory(`Find the inverse of ${$(`A = ${matrixTex(m)}`)}.`, [
      [`${$(`|A| = ${d}`)}, which isn’t zero, so the inverse exists.`, 1],
      [`${$(`\\text{adj } A = ${matrixTex([[m[1][1], -m[0][1]], [-m[1][0], m[0][0]]])}`)}.`, 1],
      [`${$(`A^{-1} = ${matrixTex(inv)}`)}.`, 1],
    ]);
  }),
  custom('cramer', [2, 'b', 5, 3], { type: 'numerical', format: 'long' }, (g) => {
    const sol = [g.int(1, 4), g.int(-3, 4), g.int(1, 4)];
    const A = [[g.int(1, 3), g.int(1, 3), g.int(1, 3)], [g.int(1, 3), g.int(-2, 2), g.int(1, 3)], [g.int(-2, 3), g.int(1, 3), g.int(-1, 3)]];
    const d = det3(A);
    if (!d) g.retry();
    const b = A.map((r) => r[0] * sol[0] + r[1] * sol[1] + r[2] * sol[2]);
    const eq = (r: number[], c: number) => `${polyTex([[r[0], 1]], 'x')} ${r[1] < 0 ? '-' : '+'} ${polyTex([[Math.abs(r[1]), 1]], 'y')} ${r[2] < 0 ? '-' : '+'} ${polyTex([[Math.abs(r[2]), 1]], 'z')} = ${c}`;
    if (A.flat().includes(0)) g.retry();
    return {
      form: 'numeric',
      text: `Use the matrix method to solve:\n${$(eq(A[0], b[0]))}\n${$(eq(A[1], b[1]))}\n${$(eq(A[2], b[2]))}`,
      parts: [
        g.answerPart('Determinant of the coefficient matrix', d, 2, [step('Expand', `|A| = ${d}`)]),
        g.answerPart('Value of x', sol[0] || 0, 1, [step('Use X = A⁻¹B', `x = ${sol[0]}`)]),
        g.answerPart('Value of y', sol[1] || 0, 1, [step('Use X = A⁻¹B', `y = ${sol[1]}`)]),
        g.answerPart('Value of z', sol[2] || 0, 1, [step('Use X = A⁻¹B', `z = ${sol[2]}`)]),
      ],
    };
  }),
  ...facts(2, 'a', {
    define: [
      ['a symmetric matrix', 'A square matrix equal to its own transpose.'],
      ['a skew-symmetric matrix', 'A square matrix equal to the negative of its transpose.'],
    ],
    recall: [
      ['The diagonal elements of a skew-symmetric matrix are:', 'all zero', 'all one', 'equal to each other, whatever their value', 'always positive'],
      ['If A and B are matrices for which both products are defined, in general:', 'AB ≠ BA', 'AB = BA', 'AB = 0', 'AB = I'],
      ['The transpose of AB is:', "B′A′", "A′B′", 'AB', "(A′)²"],
      ['A matrix with one row is called:', 'a row matrix', 'a column matrix', 'a square matrix', 'a diagonal matrix'],
    ],
    truths: [
      ['Every square matrix can be written as the sum of a symmetric matrix and a skew-symmetric matrix.', 'Only symmetric matrices can be written as the sum of a symmetric matrix and a skew-symmetric matrix.'],
      ['Matrix addition is commutative.', 'Matrix addition is not commutative.'],
      ['If A is symmetric, then A² is symmetric.', 'If A is symmetric, then A² is skew-symmetric.'],
    ],
    reason: [
      ['AB can exist when BA doesn’t.', 'AB needs the columns of A to match the rows of B.', 'BA needs the columns of B to match the rows of A, a separate condition.'],
    ],
  }),
  ...facts(2, 'b', {
    define: [
      ['a singular matrix', 'A square matrix whose determinant is zero.'],
      ['the adjoint of a square matrix', 'The transpose of the matrix of its cofactors.'],
    ],
    recall: [
      ['If two rows of a determinant are identical, its value is:', '0', '1', 'doubled', 'negated'],
      ['Swapping two rows of a determinant:', 'changes its sign', 'leaves it unchanged', 'makes it zero', 'doubles it'],
      ['A(adj A) equals:', '|A|I', 'I', 'adj A', '|A|'],
      ['A system AX = B has a unique solution if:', '|A| ≠ 0', '|A| = 0', 'B = 0', 'A is symmetric'],
    ],
    truths: [
      ['|AB| = |A||B| for square matrices of the same order.', '|AB| = |A| + |B| for square matrices of the same order.'],
      ['|A′| = |A|.', '|A′| = −|A|.'],
      ['A matrix has an inverse only when its determinant isn’t zero.', 'Every square matrix has an inverse.'],
    ],
    reason: [
      ['A determinant with two proportional rows is zero.', 'Taking the common factor out leaves two identical rows.', 'Swapping those rows changes the sign but not the determinant, so it must be zero.'],
    ],
    explain: [
      ['What can you say about AX = B if |A| = 0 and (adj A)B ≠ 0?', 'The system has no solution, so it is inconsistent.'],
    ],
  }),

  // ---- Calculus: differentiation
  custom('diff-rule', [3, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const k = g.int(2, 6);
    const forms: [string, string, string[]][] = [
      [`\\sin(${k}x)`, `${k}\\cos(${k}x)`, [`\\cos(${k}x)`, `-${k}\\cos(${k}x)`, `\\dfrac{1}{${k}}\\cos(${k}x)`]],
      [`e^{${k}x}`, `${k}e^{${k}x}`, [`e^{${k}x}`, `${k}xe^{${k}x-1}`, `\\dfrac{1}{${k}}e^{${k}x}`]],
      [`\\log(${k}x)`, `\\dfrac{1}{x}`, [`\\dfrac{1}{${k}x}`, `\\dfrac{${k}}{x^2}`, `${k}\\log x`]],
      [`\\tan(x^{${k}})`, `${k}x^{${k - 1}}\\sec^2(x^{${k}})`, [`\\sec^2(x^{${k}})`, `${k}\\sec^2(x^{${k}})`, `x^{${k}}\\sec^2(x^{${k}})`]],
      [`x^{${k}}\\log x`, `${k}x^{${k - 1}}\\log x + x^{${k - 1}}`, [`${k}x^{${k - 1}}\\log x`, `x^{${k - 1}}`, `${k}x^{${k - 1}}\\cdot\\dfrac{1}{x}`]],
    ];
    const [y, right, wrong] = g.pick(forms);
    return g.mcq(`The derivative of ${$(y)} with respect to x is:`, $(right), wrong.map($), { why: 'Use the chain rule, or the product rule, and watch the derivative of the inside.' });
  }),
  custom('parametric', [3, 'a', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const a = g.int(1, 5);
    const t = g.int(1, 5);
    const dy = frac(1, t);
    return { form: 'numeric', text: `If ${$(`x = ${a}t^2`)} and ${$(`y = ${2 * a}t`)}, find ${$('\\dfrac{dy}{dx}')} at ${$(`t = ${t}`)}.`, parts: [g.answerPart('Value of dy/dx', dy.value, 2, [step('Differentiate each with respect to t', `\\dfrac{dx}{dt} = ${2 * a}t,\\quad \\dfrac{dy}{dt} = ${2 * a}`), step('Divide', `\\dfrac{dy}{dx} = \\dfrac{1}{t} = ${dy.tex()}`)], '', dy.text())] };
  }),
  custom('implicit', [3, 'a', 2, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const [x0, y0, r] = g.pick([[3, 4, 25], [4, 3, 25], [5, 12, 169], [12, 5, 169], [6, 8, 100], [8, 6, 100]]);
    const slope = frac(-x0, y0);
    return { form: 'numeric', text: `For the curve ${$(`x^2 + y^2 = ${r}`)}, find ${$('\\dfrac{dy}{dx}')} at the point (${x0}, ${y0}).`, parts: [g.answerPart('Value of dy/dx', slope.value, 2, [step('Differentiate implicitly', `2x + 2y\\dfrac{dy}{dx} = 0`), step('Rearrange', `\\dfrac{dy}{dx} = -\\dfrac{x}{y} = ${slope.tex()}`)], '', slope.text())] };
  }),
  custom('continuity-k', [3, 'a', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const a = g.int(1, 4);
    const b = g.int(1, 5);
    const at = g.int(1, 3);
    const left = a * at * at + b;
    const c = g.int(1, 3);
    return { form: 'numeric', text: `The function ${$(`f(x) = \\begin{cases}${polyTex([[a, 2], [b, 0]])}, & x \\le ${at} \\\\ ${c}x + k, & x > ${at}\\end{cases}`)} is continuous at ${$(`x = ${at}`)}. Find k.`, parts: [g.answerPart('Value of k', left - c * at, 3, [step('Left-hand limit and value', `f(${at}) = ${left}`), step('Right-hand limit', `\\lim_{x\\to ${at}^+} f(x) = ${c * at} + k`), step('Set them equal', `k = ${left} - ${c * at} = ${left - c * at}`)])] };
  }),
  custom('log-diff', [3, 'a', 3, 3], { type: 'proof', format: 'short' }, (g) => {
    const a = g.int(2, 4);
    return g.theory(`Differentiate ${$(`y = x^{${a}x}`)} with respect to x.`, [
      [`Take logs: ${$(`\\log y = ${a}x\\log x`)}.`, 1],
      [`Differentiate: ${$(`\\dfrac{1}{y}\\dfrac{dy}{dx} = ${a}\\log x + ${a}`)}.`, 1],
      [`So ${$(`\\dfrac{dy}{dx} = ${a}x^{${a}x}(1 + \\log x)`)}.`, 1],
    ]);
  }),
  custom('second-derivative', [3, 'a', 3, 2], { type: 'proof', format: 'short' }, (g) => {
    const k = g.int(2, 5);
    return g.theory(`If ${$(`y = \\sin ${k}x + \\cos ${k}x`)}, show that ${$(`\\dfrac{d^2y}{dx^2} + ${k * k}y = 0`)}.`, [
      [`${$(`\\dfrac{dy}{dx} = ${k}\\cos ${k}x - ${k}\\sin ${k}x`)}.`, 1],
      [`${$(`\\dfrac{d^2y}{dx^2} = -${k * k}\\sin ${k}x - ${k * k}\\cos ${k}x`)}.`, 1],
      [`That is ${$(`-${k * k}y`)}, which gives the result.`, 1],
    ]);
  }),
  ...facts(3, 'a', {
    recall: [
      ['Which statement is true?', 'Every differentiable function is continuous.', 'Every continuous function is differentiable.', 'No continuous function is differentiable.', 'Differentiability doesn’t imply anything about continuity.'],
      ['The function |x| at x = 0 is:', 'continuous, but not differentiable', 'differentiable, but not continuous', 'both continuous and differentiable', 'neither continuous nor differentiable'],
      ['The derivative of log x is:', '1/x', 'x', 'e^x', 'log x'],
      ['The derivative of tan⁻¹x is:', '1/(1 + x²)', '1/√(1 − x²)', '−1/(1 + x²)', 'sec²x'],
      ['The derivative of sin⁻¹x is:', '1/√(1 − x²)', '1/(1 + x²)', '−1/√(1 − x²)', 'cos x'],
    ],
    truths: [
      ['The derivative of a constant is zero.', 'The derivative of a constant is one.'],
      ['A polynomial is continuous everywhere.', 'A polynomial is discontinuous at its roots.'],
      ['A function differentiable at a point has a tangent there.', 'A function differentiable at a point can still have a sharp corner there.'],
    ],
    explain: [
    ],
    reason: [
      ['A function can be continuous at a point without being differentiable there.', 'Continuity only needs the graph to be unbroken there.', 'Differentiability needs a single tangent, which a sharp corner doesn’t have.'],
    ],
  }),
  custom('tangent-slope', [3, 'b', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const a = g.int(1, 4);
    const b = g.int(-4, 4);
    const x = g.int(1, 4);
    const c = g.int(1, 5);
    const slope = 2 * a * x + b;
    return g.mcqNumber(`The slope of the tangent to ${$(`y = ${polyTex([[a, 2], [b, 1], [c, 0]])}`)} at ${$(`x = ${x}`)} is:`, slope === 0 ? g.retry() : slope, '', [
      { slip: 'forgot to multiply by the power', value: a * x + b },
      { slip: 'worked out y instead of its slope', value: a * x * x + b * x + c },
      { slip: 'left out the linear term', value: 2 * a * x },
      { slip: 'found the slope of the normal', value: -1 / slope },
    ], { digits: 3 });
  }),
  custom('normal-eq', [3, 'b', 3, 2], { type: 'short', format: 'short' }, (g) => {
    const a = g.int(1, 3);
    const x = g.int(1, 3);
    const y = a * x * x;
    const m = 2 * a * x;
    return g.theory(`Find the equations of the tangent and the normal to ${$(`y = ${polyTex([[a, 2]])}`)} at the point (${x}, ${y}).`, [
      [`The slope of the tangent is ${$(`\\dfrac{dy}{dx} = ${m}`)}.`, 1],
      [`Tangent: ${$(`y - ${y} = ${m}(x - ${x})`)}.`, 1],
      [`Normal: ${$(`y - ${y} = ${frac(-1, m).tex()}(x - ${x})`)}.`, 1],
    ]);
  }),
  custom('rate-change', [3, 'b', 2, 1], { type: 'numerical', format: 'numerical', style: 'cbq-style' }, (g) => {
    const [shape, formula, ask, factor] = g.pick([
      ['A circular ripple spreads across a pond. Its radius grows at', 'A = \\pi r^2', 'area', (r: number, v: number) => 2 * Math.PI * r * v],
    ] as const);
    const v = g.int(1, 5);
    const r = g.int(2, 12);
    return { form: 'numeric', text: `${shape} ${v} cm/s. How fast is its ${ask} growing when the radius is ${r} cm? Give your answer in terms of π, then as a number.`, parts: [g.answerPart(`Rate of change of the ${ask}`, factor(r, v), 2, [step('Differentiate with respect to time', formula, `\\text{Rate} = ${(factor(r, v) / Math.PI).toFixed(0)}\\pi`)], ask === 'area' ? 'cm²/s' : 'cm³/s')] };
  }),
  custom('stationary', [3, 'b', 5, 3], { type: 'numerical', format: 'long' }, (g) => {
    const p = g.int(1, 3);
    const q = p + g.int(1, 4);
    const k = g.pick([1, 2, 3]);
    // f′(x) = 6k(x − p)(x − q), so f = 2kx³ − 3k(p + q)x² + 6kpqx + c.
    const c = g.int(1, 9);
    const f: [number, number][] = [[2 * k, 3], [-3 * k * (p + q), 2], [6 * k * p * q, 1], [c, 0]];
    return {
      form: 'numeric',
      text: `For ${$(`f(x) = ${polyTex(f)}`)}, find the stationary points, which of them is a local maximum, and the local maximum value.`,
      parts: [
        g.answerPart('x-coordinate of the local maximum', p, 2, [step('Differentiate and set to zero', `f'(x) = ${6 * k}(x - ${p})(x - ${q}) = 0`), step('Second derivative', `f''(${p}) < 0`, 'x = ' + p)]),
        g.answerPart('x-coordinate of the local minimum', q, 1, [step('Second derivative', `f''(${q}) > 0`)]),
        g.answerPart('Local maximum value', evalPoly(f, p), 2, [step('Put x back into f', `f(${p}) = ${evalPoly(f, p)}`)]),
      ],
    };
  }),
  custom('hill-van', [3, 'b', 5, 3], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const p = g.int(1, 2);
    const q = p + g.int(2, 3);
    // The lower turning point, h(q) = 3pq² − q³ + c, stays above the ground.
    const c = Math.max(0, q ** 3 - 3 * p * q * q) + g.int(2, 6);
    const f: [number, number][] = [[2, 3], [-3 * (p + q), 2], [6 * p * q, 1], [c, 0]];
    const [setting, unit] = g.pick([
      ['A cycling route over the hills follows the height profile', 'hundred metres'],
      ['A delivery drone rises and falls along a path given by', 'metres'],
      ['A roller coaster’s track near its first drop has height', 'metres'],
    ] as const);
    return {
      form: 'numeric',
      text: `${setting} ${$(`h(x) = ${polyTex(f)}`)}, ${$('x \\ge 0')}, with h in ${unit}, measured from the ground.`,
      parts: [
        g.answerPart('Height at the start, when x = 0', c, 1, [step('Put x = 0', `h(0) = ${c}`)]),
        g.answerPart('x at the first turning point', p, 1, [step('Set the derivative to zero', `h'(x) = 6(x - ${p})(x - ${q}) = 0`)]),
        g.answerPart('x at the second turning point', q, 1, [step('Set the derivative to zero', `h'(x) = 6(x - ${p})(x - ${q}) = 0`)]),
        g.answerPart('Difference in height between the two turning points', evalPoly(f, p) - evalPoly(f, q), 2, [step('Subtract the two heights', `h(${p}) - h(${q}) = ${evalPoly(f, p)} - (${evalPoly(f, q)}) = ${evalPoly(f, p) - evalPoly(f, q)}`)]),
      ],
    };
  }),
  custom('fence', [3, 'b', 3, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const p = 4 * g.int(5, 40);
    const side = p / 4;
    const [what] = g.pick([['A farmer fences a rectangular plot'], ['A school marks out a rectangular garden'], ['A city council rails off a rectangular park']] as const);
    return { form: 'numeric', text: `${what} using ${p} m of fencing. Find the dimensions that give the largest area.`, parts: [g.answerPart('Each side of the best rectangle', side, 2, [step('Write the area in terms of one side', `A(x) = x\\left(${p / 2} - x\\right)`), step('Set the derivative to zero', `A'(x) = ${p / 2} - 2x = 0`, `x = ${side}`)], 'm'), g.answerPart('The largest area', side * side, 1, [step('Multiply', `A = ${side}^2 = ${side * side}`)], 'm²')] };
  }),
  custom('box', [3, 'b', 5, 3], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const x = g.int(1, 5);
    const a = 6 * x;
    const v = (a - 2 * x) * (a - 2 * x) * x;
    return {
      form: 'numeric',
      text: `A square sheet of tin of side ${a} cm has an equal square cut from each corner, and the sides are folded up to make an open box.`,
      parts: [
        g.answerPart('Side of the square to cut out, for the largest volume', x, 3, [step('Write the volume', `V(x) = x(${a} - 2x)^2`), step('Set the derivative to zero', `V'(x) = (${a} - 2x)(${a} - 6x) = 0`), step('Discard the root that gives no box', `x = ${x}`)], 'cm'),
        g.answerPart('The largest volume', v, 2, [step('Put x back', `V = ${x}(${a - 2 * x})^2 = ${v}`)], 'cm³'),
      ],
    };
  }),
  ...facts(3, 'b', {
    define: [
      ['a stationary point', 'A point where the derivative of a function is zero.'],
      ['a point of inflection', 'A point at which the curve changes its direction of bending.'],
    ],
    recall: [
      ['If f′(x) > 0 on an interval, then f on that interval is:', 'increasing', 'decreasing', 'constant', 'zero'],
      ['If f′(c) = 0 and f″(c) > 0, then c is a point of:', 'local minimum', 'local maximum', 'inflection only', 'discontinuity'],
      ['The product of the slopes of a tangent and a normal at a point is:', '−1', '1', '0', 'never defined'],
      ['The largest value of a continuous function on a closed interval can occur:', 'at a critical point, or at an end point', 'only at a stationary point', 'only at an end point', 'nowhere'],
    ],
    truths: [
      ['If f′(x) < 0 on an interval, f is strictly decreasing there.', 'If f′(x) < 0 on an interval, f is strictly increasing there.'],
      ['At a local maximum, a differentiable function’s derivative is zero.', 'At a local maximum, a differentiable function’s derivative is positive.'],
      ['The function eˣ is increasing for all real x.', 'The function eˣ is decreasing for all real x.'],
    ],
    reason: [
      ['A stationary point need not be a maximum or a minimum.', 'The derivative might not change sign there.', 'For y = x³ at 0, the curve carries on rising through a point of inflection.'],
    ],
  }),

  // ---- Integrals
  custom('int-basic', [3, 'c', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const k = g.int(2, 6);
    const forms: [string, string, string[]][] = [
      [`\\int \\cos ${k}x\\,dx`, `\\dfrac{1}{${k}}\\sin ${k}x + C`, [`${k}\\sin ${k}x + C`, `\\sin ${k}x + C`, `-\\dfrac{1}{${k}}\\sin ${k}x + C`]],
      [`\\int e^{${k}x}\\,dx`, `\\dfrac{1}{${k}}e^{${k}x} + C`, [`${k}e^{${k}x} + C`, `e^{${k}x} + C`, `\\dfrac{e^{${k}x+1}}{${k}x+1} + C`]],
      [`\\int \\dfrac{dx}{${k}x}`, `\\dfrac{1}{${k}}\\log|x| + C`, [`${k}\\log|x| + C`, `\\log|${k}x|^2 + C`, `-\\dfrac{1}{${k}x^2} + C`]],
      [`\\int x^{${k}}\\,dx`, `\\dfrac{x^{${k + 1}}}{${k + 1}} + C`, [`${k}x^{${k - 1}} + C`, `\\dfrac{x^{${k}}}{${k}} + C`, `x^{${k + 1}} + C`]],
      [`\\int \\sec^2 ${k}x\\,dx`, `\\dfrac{1}{${k}}\\tan ${k}x + C`, [`${k}\\tan ${k}x + C`, `\\tan ${k}x + C`, `\\dfrac{1}{${k}}\\sec ${k}x + C`]],
    ];
    const [q, right, wrong] = g.pick(forms);
    return g.mcq(`${$(q)} is:`, $(right), wrong.map($));
  }),
  custom('definite-poly', [3, 'c', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const a = g.int(1, 3);
    const b = g.int(0, 4);
    const c = g.int(1, 3);
    const low = g.int(0, 1);
    const high = low + g.int(1, 3);
    const anti = (x: number) => frac(a, 3).mul(x ** 3).add(frac(b, 2).mul(x ** 2)).add(c * x);
    const ans = anti(high).sub(anti(low));
    return { form: 'numeric', text: `Evaluate ${$(`\\int_{${low}}^{${high}} (${polyTex([[a, 2], [b, 1], [c, 0]])})\\,dx`)}.`, parts: [g.answerPart('The value', ans.value, 2, [step('Find an antiderivative', `F(x) = ${[term(frac(a, 3), 'x^3'), term(frac(b, 2), 'x^2'), term(frac(c), 'x')].filter(Boolean).join(' + ')}`), step('Subtract at the limits', `F(${high}) - F(${low}) = ${ans.tex()}`)], '', ans.text())] };
  }),
  custom('definite-odd', [3, 'c', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const a = g.int(1, 4);
    const lim = g.int(1, 5);
    const k = g.pick([3, 5]);
    const f = `${polyTex([[a, k]])} \\cos x`;
    return mcqFrac(g, `The value of ${$(`\\int_{-${lim}}^{${lim}} ${f}\\,dx`)} is:`, frac(0), [frac(2 * lim), frac(lim), frac(2 * a), frac(a * lim), frac(1)], 'The integrand is odd, so the two sides of the interval cancel.');
  }),
  custom('king-property', [3, 'c', 3, 2], { type: 'proof', format: 'short' }, (g) => {
    const [num, den, lim, ans] = g.pick([
      ['\\sqrt{\\sin x}', '\\sqrt{\\sin x} + \\sqrt{\\cos x}', '\\dfrac{\\pi}{2}', '\\dfrac{\\pi}{4}'],
      ['\\sin^2 x', '\\sin^2 x + \\cos^2 x', '\\dfrac{\\pi}{2}', '\\dfrac{\\pi}{4}'],
      ['\\sqrt{\\tan x}', '\\sqrt{\\tan x} + \\sqrt{\\cot x}', '\\dfrac{\\pi}{2}', '\\dfrac{\\pi}{4}'],
      ['\\cos^3 x', '\\sin^3 x + \\cos^3 x', '\\dfrac{\\pi}{2}', '\\dfrac{\\pi}{4}'],
    ] as const);
    return g.theory(`Evaluate ${$(`I = \\int_0^{${lim}} \\dfrac{${num}}{${den}}\\,dx`)}.`, [
      [`Use ${$('\\int_0^a f(x)\\,dx = \\int_0^a f(a - x)\\,dx')} to write a second form of I.`, 1],
      ['Adding the two forms makes the integrand equal to 1.', 1],
      [`So ${$(`2I = ${lim}`)}, which gives ${$(`I = ${ans}`)}.`, 1],
    ]);
  }),
  custom('partial-fractions', [3, 'c', 3, 2], { type: 'short', format: 'short' }, (g) => {
    const a = g.int(1, 3);
    const b = a + g.int(1, 4);
    const diff = b - a;
    const factor = diff === 1 ? '' : `\\dfrac{1}{${diff}}`;
    return g.theory(`Evaluate ${$(`\\int \\dfrac{dx}{(x + ${a})(x + ${b})}`)}.`, [
      [`Write ${$(`\\dfrac{1}{(x+${a})(x+${b})} = ${factor}\\left(\\dfrac{1}{x+${a}} - \\dfrac{1}{x+${b}}\\right)`)}.`, 1],
      ['Integrate each term to give a logarithm.', 1],
      [`So the integral is ${$(`${factor}\\log\\left|\\dfrac{x+${a}}{x+${b}}\\right| + C`)}.`, 1],
    ]);
  }),
  custom('by-parts', [3, 'c', 3, 2], { type: 'short', format: 'short' }, (g) => {
    const k = g.int(2, 5);
    const [q, u, res] = g.pick([
      [`x e^{${k}x}`, 'x', `\\dfrac{x}{${k}}e^{${k}x} - \\dfrac{1}{${k * k}}e^{${k}x} + C`],
      [`x\\cos ${k}x`, 'x', `\\dfrac{x}{${k}}\\sin ${k}x + \\dfrac{1}{${k * k}}\\cos ${k}x + C`],
      [`x\\sin ${k}x`, 'x', `-\\dfrac{x}{${k}}\\cos ${k}x + \\dfrac{1}{${k * k}}\\sin ${k}x + C`],
    ] as const);
    return g.theory(`Evaluate ${$(`\\int ${q}\\,dx`)}.`, [
      [`Integrate by parts, taking ${$(`u = ${u}`)}.`, 1],
      ['Apply ∫u dv = uv − ∫v du.', 1],
      [`The result is ${$(res)}.`, 1],
    ]);
  }),
  ...facts(3, 'c', {
    recall: [
      ['The integral of 1/x is:', 'log|x| + C', '1/x² + C', 'x + C', 'eˣ + C'],
      ['If f is an odd function, then its integral from −a to a is:', '0', '2 times its integral from 0 to a', 'a', 'not defined'],
      ['If f is an even function, then its integral from −a to a is:', '2 times its integral from 0 to a', '0', 'its integral from 0 to a', 'a'],
      ['The integral of sec x tan x is:', 'sec x + C', 'tan x + C', 'sec²x + C', 'log|sec x| + C'],
    ],
    truths: [
      ['A definite integral gives a number.', 'A definite integral gives a function of the limits only by adding C.'],
      ['Reversing the limits of a definite integral changes its sign.', 'Reversing the limits of a definite integral leaves it unchanged.'],
      ['The integral of a sum is the sum of the integrals.', 'The integral of a product is the product of the integrals.'],
    ],
    explain: [
      ['State the fundamental theorem of calculus, second form.', 'If F′(x) = f(x), then the integral of f from a to b equals F(b) − F(a).'],
    ],
    long: [
      ['Prove the property that the integral of f(x) from 0 to a equals the integral of f(a − x) from 0 to a.', 'Put t = a − x, so dt = −dx.', 'When x = 0, t = a, and when x = a, t = 0.', 'The integral becomes the integral of −f(t) from a to 0, which is the integral of f(t) from 0 to a.'],
    ],
  }),
  custom('area-parabola', [3, 'd', 2, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const a = g.int(1, 3);
    const h = g.int(1, 4);
    const area = frac(a * h ** 3, 3);
    return { form: 'numeric', text: `Find the area bounded by ${$(`y = ${polyTex([[a, 2]])}`)}, the x-axis, and the lines ${$('x = 0')} and ${$(`x = ${h}`)}.`, parts: [g.answerPart('The area', area.value, 2, [step('Integrate', `\\int_0^{${h}} ${polyTex([[a, 2]])}\\,dx = \\left[${term(frac(a, 3), 'x^3')}\\right]_0^{${h}} = ${area.tex()}`)], 'sq. units', area.text())] };
  }),
  custom('area-line-parabola', [3, 'd', 5, 3], { type: 'numerical', format: 'long' }, (g) => {
    const k = g.int(1, 4);
    const area = frac(k ** 3, 6);
    const kx = k === 1 ? 'x' : `${k}x`;
    return {
      form: 'numeric',
      text: `A region is bounded by the parabola ${$('y = x^2')} and the line ${$(`y = ${kx}`)}.`,
      diagram: { kind: 'graph', x: 'x', y: 'y', lines: [{ label: 'y = x²', points: Array.from({ length: 21 }, (_, i) => { const t = (-0.2 + (i / 20) * (k + 0.4)); return [t, t * t] as [number, number]; }), smooth: 1 }, { label: `y = ${k === 1 ? '' : k}x`, points: [[-0.2, -0.2 * k], [k + 0.2, (k + 0.2) * k]] }] },
      parts: [
        g.answerPart('x-coordinate where the two curves meet, other than the origin', k, 2, [step('Set them equal', `x^2 = ${kx}`, `x = 0 \\text{ or } x = ${k}`)]),
        g.answerPart('Area of the region', area.value, 3, [step('Integrate the difference', `\\int_0^{${k}} (${kx} - x^2)\\,dx = ${area.tex()}`)], 'sq. units', area.text()),
      ],
    };
  }),
  ...facts(3, 'd', {
    recall: [
      ['The area under a curve from x = a to x = b is found by:', 'integrating y with respect to x from a to b', 'differentiating y', 'multiplying y and x', 'finding the mean of y'],
      ['The area under y = x³ from 0 to 2 is:', '4', '8', '2', '16'],
    ],
    truths: [
      ['The area between two curves is the integral of the upper one minus the lower one.', 'The area between two curves is the integral of the lower one minus the upper one.'],
      ['Integration gives a triangle’s area as half its base times its height.', 'Integration gives a triangle’s area as its base times its height.'],
      ['The area of a circle of radius r can be found by integration.', 'Integration can’t find the area of a circle.'],
    ],
    long: [
      ['Using integration, find the area of a circle of radius a.', 'From x² + y² = a², take y = √(a² − x²) for the upper half.', 'The area is four times the integral from 0 to a.', 'The integral from 0 to a is πa²/4.', 'So the total area is πa².'],
    ],
  }),
  custom('de-order', [3, 'e', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const order = g.int(1, 3);
    const degree = g.int(1, 3);
    const d = order === 1 ? '\\dfrac{dy}{dx}' : `\\dfrac{d^{${order}}y}{dx^{${order}}}`;
    const low = order === 1 ? 'y' : '\\dfrac{dy}{dx}';
    const lhs = degree === 1 ? d : `\\left(${d}\\right)^{${degree}}`;
    return g.mcq(`The order and degree of ${$(`${lhs} + ${low} = 0`)} are:`, `order ${order}, degree ${degree}`, [
      `order ${degree}, degree ${order}`,
      `order ${order + 1}, degree ${degree}`,
      `order ${order}, degree ${degree + 1}`,
      `order ${order + 1}, degree ${degree + 1}`,
    ].filter((o) => o !== `order ${order}, degree ${degree}`).slice(0, 3));
  }),
  custom('de-separable', [3, 'e', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const k = g.int(1, 3);
    const y0 = g.int(1, 5);
    const x1 = g.int(1, 2);
    return { form: 'numeric', text: `Solve ${$(`\\dfrac{dy}{dx} = ${k === 1 ? '' : k}y`)}, given ${$(`y = ${y0}`)} at ${$('x = 0')}, and find y at ${$(`x = ${x1}`)}, correct to two decimal places.`, parts: [g.answerPart('Value of y', y0 * Math.exp(k * x1), 3, [step('Separate the variables', `\\dfrac{dy}{y} = ${k}\\,dx`), step('Integrate', `\\log y = ${k === 1 ? '' : k}x + C`), step('Use the condition', `y = ${y0 === 1 ? '' : y0}e^{${k === 1 ? '' : k}x}`)])] };
  }),
  custom('de-linear', [3, 'e', 5, 3], { type: 'numerical', format: 'long' }, (g) => {
    const p = g.int(1, 3);
    const c = g.int(1, 3);
    // dy/dx + (p/x) y = c x^m, with integrating factor x^p and a chosen solution.
    const m = g.int(0, 2);
    const coef = frac(c, m + p + 1);
    const x1 = 1;
    const y1 = g.int(1, 3);
    const big = frac(y1).sub(coef);
    const x2 = 2;
    const y2 = coef.mul(x2 ** (m + 1)).add(big.div(x2 ** p));
    return {
      form: 'numeric',
      text: `Solve the linear differential equation ${$(`\\dfrac{dy}{dx} + \\dfrac{${p}}{x}y = ${c === 1 && m > 0 ? '' : c}${m === 0 ? '' : m === 1 ? 'x' : `x^{${m}}`}`)}, given ${$(`y = ${y1}`)} when ${$(`x = ${x1}`)}.`,
      parts: [
        g.answerPart(`The power of x in the integrating factor`, p, 2, [step('Find the integrating factor', `e^{\\int \\frac{${p}}{x}dx} = ${p === 1 ? 'x' : `x^{${p}}`}`)]),
        g.answerPart(`Value of y when x = ${x2}`, y2.value, 3, [step('Multiply through and integrate', `${p === 1 ? 'x' : `x^{${p}}`}y = ${coef.tex()}x^{${m + p + 1}} + C`), step('Use the given condition', `C = ${big.tex()}`), step('Find y at the new x', `y(${x2}) = ${y2.tex()}`)], '', y2.text()),
      ],
    };
  }),
  custom('population', [3, 'e', 3, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const n0 = g.pick([100, 200, 500, 1000]);
    const hours = g.pick([2, 3, 4]);
    const ask = hours * g.pick([2, 3]);
    const scene = g.pick(['A medicine in a patient’s blood', 'A pollutant in a lake that is being cleaned']);
    const left = n0 / 2 ** (ask / hours);
    return { form: 'numeric', text: `${scene} is removed at a rate proportional to the amount left. It starts at ${n0} mg and halves every ${hours} hours. How much is left after ${ask} hours?`, parts: [g.answerPart('Amount left, in mg', left, 3, [step('Set up and solve', `\\dfrac{dN}{dt} = -kN \\Rightarrow N = N_0 e^{-kt}`), step('Use the halving time', `N = ${n0}\\left(\\tfrac12\\right)^{t/${hours}}`), step('Put in the time', `N(${ask}) = ${left}`)])] };
  }),
  ...facts(3, 'e', {
    define: [
      ['the order of a differential equation', 'The order of the highest derivative in it.'],
      ['the degree of a differential equation', 'The power of the highest derivative, once the equation is polynomial in its derivatives.'],
      ['the general solution of a differential equation', 'A solution containing as many arbitrary constants as the order of the equation.'],
    ],
    recall: [
      ['The number of arbitrary constants in the general solution of a second-order differential equation is:', '2', '1', '3', '0'],
      ['The integrating factor of dy/dx + Py = Q is:', 'e^(∫P dx)', 'e^(∫Q dx)', '∫P dx', 'P e^x'],
      ['A homogeneous differential equation is solved by substituting:', 'y = vx', 'y = x + v', 'x = v²', 'y = v/x'],
    ],
    truths: [
      ['A particular solution has no arbitrary constants.', 'A particular solution must have an arbitrary constant.'],
      ['The degree of a differential equation may not be defined.', 'Every differential equation has a defined degree.'],
      ['Separating variables puts all the y terms with dy, and all the x terms with dx.', 'Separating variables puts all the y terms with dx, and all the x terms with dy.'],
    ],
    reason: [
      ['The degree of dy/dx + sin(dy/dx) = 0 is not defined.', 'The equation isn’t a polynomial in the derivative.'],
    ],
  }),

  // ---- Vectors
  custom('dot', [4, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const a = [g.int(1, 5), g.int(-3, 4), g.int(1, 4)];
    const b = [g.int(1, 4), g.int(1, 4), g.int(-3, 4)];
    const d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    return g.mcqNumber(`If ${$(`\\vec a = ${vecTex(a)}`)} and ${$(`\\vec b = ${vecTex(b)}`)}, then ${$('\\vec a\\cdot\\vec b')} is:`, d === 0 ? g.retry() : d, '', [
      { slip: 'added instead of multiplying', value: a[0] + b[0] + a[1] + b[1] + a[2] + b[2] },
      { slip: 'forgot a term', value: a[0] * b[0] + a[1] * b[1] },
      { slip: 'ignored a sign', value: Math.abs(a[0] * b[0]) + Math.abs(a[1] * b[1]) + Math.abs(a[2] * b[2]) },
      { slip: 'left out the first product', value: a[1] * b[1] + a[2] * b[2] },
    ], { digits: 4 });
  }),
  custom('magnitude', [4, 'a', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const [a, b, c, r] = g.pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [3, 4, 12, 13], [2, 2, 1, 3]]);
    return { form: 'numeric', text: `Find the magnitude of ${$(`\\vec a = ${vecTex([a, -b, c])}`)}, and the unit vector along it.`, parts: [g.answerPart('The magnitude', r, 1, [step('Use the square root of the sum of squares', `|\\vec a| = \\sqrt{${a}^2 + ${b}^2 + ${c}^2} = ${r}`)]), g.answerPart('The x-component of the unit vector', a / r, 1, [step('Divide by the magnitude', `\\hat a = \\dfrac{1}{${r}}(${vecTex([a, -b, c])})`)], '', frac(a, r).text())] };
  }),
  custom('perp-k', [4, 'a', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const a = [g.int(1, 4), g.int(1, 4), g.int(1, 3)];
    const k = g.int(-4, 4);
    if (!k) g.retry();
    const b0 = g.int(1, 4);
    const c = g.pick([1, 2]);
    const b1 = -(a[0] * b0 + a[1] * k * c) / a[2];
    if (!Number.isInteger(b1) || b1 === 0) g.retry();
    return { form: 'numeric', text: `The vectors ${$(`${vecTex(a)}`)} and ${$(`${b0 === 1 ? '' : b0}\\hat{i} + ${c === 1 ? '' : c}\\lambda\\hat{j} ${b1 < 0 ? '-' : '+'} ${Math.abs(b1) === 1 ? '' : Math.abs(b1)}\\hat{k}`)} are perpendicular. Find ${$('\\lambda')}.`, parts: [g.answerPart('Value of λ', k, 2, [step('Set the dot product to zero', `${a[0] * b0} + ${a[1] * c}\\lambda ${signed(a[2] * b1)} = 0`, `\\lambda = ${k}`)])] };
  }),
  custom('cross-area', [4, 'a', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const a = [g.int(1, 3), g.int(0, 3), g.int(0, 2)];
    const b = [g.int(0, 2), g.int(1, 3), g.int(0, 3)];
    const c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const size = Math.hypot(...c);
    if (!size) g.retry();
    return { form: 'numeric', text: `Find the area of the parallelogram with adjacent sides ${$(`\\vec a = ${vecTex(a)}`)} and ${$(`\\vec b = ${vecTex(b)}`)}.`, parts: [g.answerPart('Area of the parallelogram', size, 3, [step('Find the cross product', `\\vec a\\times\\vec b = ${vecTex(c)}`), step('Take its magnitude', `|\\vec a\\times\\vec b| = \\sqrt{${c[0] ** 2 + c[1] ** 2 + c[2] ** 2}}`)], 'sq. units')] };
  }),
  custom('projection', [4, 'a', 2, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const [x, y, z, r] = g.pick([[1, 2, 2, 3], [2, 3, 6, 7], [2, 1, 2, 3]]);
    const a = [g.int(1, 5), g.int(1, 5), g.int(1, 5)];
    const d = a[0] * x + a[1] * y + a[2] * z;
    const proj = frac(d, r);
    return { form: 'numeric', text: `Find the projection of ${$(`\\vec a = ${vecTex(a)}`)} on ${$(`\\vec b = ${vecTex([x, y, z])}`)}.`, parts: [g.answerPart('The projection', proj.value, 2, [step('Divide the dot product by the magnitude of b', `\\dfrac{\\vec a\\cdot\\vec b}{|\\vec b|} = \\dfrac{${d}}{${r}}`)], '', proj.text())] };
  }),
  custom('scalar-triple', [4, 'a', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const m = [[g.int(1, 3), g.int(0, 2), g.int(1, 3)], [g.int(0, 2), g.int(1, 3), g.int(1, 2)], [g.int(1, 2), g.int(1, 2), g.int(0, 3)]];
    const d = det3(m);
    if (!d) g.retry();
    return { form: 'numeric', text: `Find the volume of the parallelepiped with edges ${$(vecTex(m[0]))}, ${$(vecTex(m[1]))} and ${$(vecTex(m[2]))}.`, parts: [g.answerPart('The volume', Math.abs(d), 3, [step('Use the scalar triple product', `V = \\left|\\begin{vmatrix}${m.map((r) => r.join(' & ')).join(' \\\\ ')}\\end{vmatrix}\\right| = ${Math.abs(d)}`)], 'cubic units')] };
  }),
  ...facts(4, 'a', {
    define: [
      ['a unit vector', 'A vector whose magnitude is 1.'],
      ['the scalar product of two vectors', 'The product of their magnitudes and the cosine of the angle between them.'],
      ['collinear vectors', 'Vectors that are parallel to the same line.'],
    ],
    recall: [
      ['Two non-zero vectors are perpendicular if their:', 'dot product is zero', 'cross product is zero', 'magnitudes are equal', 'sum is zero'],
      ['Two non-zero vectors are parallel if their:', 'cross product is zero', 'dot product is zero', 'magnitudes are equal', 'difference is zero'],
      ['î × ĵ equals:', 'k̂', '−k̂', '1', '0'],
      ['î · î equals:', '1', '0', 'î', 'k̂'],
    ],
    truths: [
      ['The cross product is not commutative.', 'The cross product is commutative.'],
      ['The dot product is commutative.', 'The dot product is not commutative.'],
      ['Three coplanar vectors have a scalar triple product of zero.', 'Three coplanar vectors have a scalar triple product of one.'],
    ],
    reason: [
      ['If a · b = a · c with a non-zero, b need not equal c.', 'It only shows a is perpendicular to b − c.', 'b − c may be non-zero.'],
    ],
    compare: [
      ['the dot product', 'the cross product', ['Gives a scalar.', 'Gives a vector.'], ['Zero for perpendicular vectors.', 'Zero for parallel vectors.']],
    ],
  }),

  // ---- 3D
  custom('plane-distance', [5, 'a', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const [a, b, c, r] = g.pick([[1, 2, 2, 3], [2, 3, 6, 7], [2, 1, 2, 3], [1, 4, 8, 9], [4, 4, 7, 9]]);
    const p = [g.int(1, 5), g.int(-3, 4), g.int(1, 5)];
    const d = g.int(1, 9);
    const top = Math.abs(a * p[0] + b * p[1] + c * p[2] - d);
    const ans = frac(top, r);
    if (!top) g.retry();
    return { form: 'numeric', text: `How far is the point (${p}) from the plane ${$(`${a}x + ${b}y + ${c}z = ${d}`)}?`, parts: [g.answerPart('The distance', ans.value, 2, [step('Use the distance formula', `\\dfrac{|${a}(${p[0]}) + ${b}(${p[1]}) + ${c}(${p[2]}) - ${d}|}{\\sqrt{${a}^2 + ${b}^2 + ${c}^2}} = ${ans.tex()}`)], 'units', ans.text())] };
  }),
  custom('dir-cosines', [5, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const [a, b, c, r] = g.pick([[1, 2, 2, 3], [2, 3, 6, 7], [2, 1, 2, 3], [4, 4, 7, 9]]);
    return mcqFrac(g, `A line has direction ratios ${a}, ${b} and ${c}. The direction cosine with the x-axis is:`, frac(a, r), [frac(a, r * r), frac(a, a + b + c), frac(r, a), frac(a), frac(1, r)], 'Divide by the square root of the sum of squares.');
  }),
  custom('line-angle', [5, 'a', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const [a, b, c, r] = g.pick([[1, 2, 2, 3], [2, 3, 6, 7], [2, 1, 2, 3]]);
    const [x, y, z, s] = g.pick([[2, 2, 1, 3], [6, 3, 2, 7], [1, 2, 2, 3], [3, 6, 2, 7]]);
    const dot = a * x + b * y + c * z;
    const cos = frac(dot, r * s);
    return { form: 'numeric', text: `Two lines have direction ratios ${a}, ${b}, ${c} and ${x}, ${y}, ${z}. Find the cosine of the angle between them.`, parts: [g.answerPart('cos θ', cos.value, 3, [step('Use the formula', `\\cos\\theta = \\dfrac{|a_1a_2 + b_1b_2 + c_1c_2|}{\\sqrt{a_1^2+b_1^2+c_1^2}\\sqrt{a_2^2+b_2^2+c_2^2}}`, `= \\dfrac{${dot}}{${r}\\cdot${s}} = ${cos.tex()}`)], '', cos.text())] };
  }),
  custom('line-through', [5, 'a', 2, 1], { type: 'short', format: 'short' }, (g) => {
    const p = [g.int(0, 4), g.int(0, 4), g.int(0, 4)];
    const q = p.map((x) => x + g.int(1, 4));
    const d = q.map((x, i) => x - p[i]);
    return g.theory(`Find the Cartesian equation of the line through the points (${p}) and (${q}).`, [
      [`Its direction ratios are ${d.join(', ')}.`, 1],
      [`So ${$(`\\dfrac{x - ${p[0]}}{${d[0]}} = \\dfrac{y - ${p[1]}}{${d[1]}} = \\dfrac{z - ${p[2]}}{${d[2]}}`)}.`, 1],
    ]);
  }),
  custom('plane-through', [5, 'a', 5, 3], { type: 'numerical', format: 'long' }, (g) => {
    const [a, b, c] = [g.int(1, 3), g.int(1, 3), g.int(1, 3)];
    const d = a * g.int(1, 3) + b * g.int(1, 3) + c * g.int(1, 3);
    const pts: number[][] = [];
    for (let i = 0; i < 40 && pts.length < 3; i++) {
      const x = g.int(0, 5);
      const y = g.int(0, 5);
      const z = (d - a * x - b * y) / c;
      if (Number.isInteger(z) && !pts.some((p) => p[0] === x && p[1] === y)) pts.push([x, y, z]);
    }
    if (pts.length < 3) g.retry();
    const u = [pts[1][0] - pts[0][0], pts[1][1] - pts[0][1], pts[1][2] - pts[0][2]];
    const v = [pts[2][0] - pts[0][0], pts[2][1] - pts[0][1], pts[2][2] - pts[0][2]];
    const cross = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    if (!cross.some(Boolean)) g.retry();
    return g.theory(`Find the equation of the plane through (${pts[0]}), (${pts[1]}) and (${pts[2]}).`, [
      [`Two vectors in the plane are ${$(vecTex(u))} and ${$(vecTex(v))}.`, 1],
      [`Their cross product gives the normal: ${$(vecTex(cross))}.`, 2],
      [`Dividing out the common factor and using the first point, the plane is ${$(`${planeTex(a, b, c, d)}`)}.`, 2],
    ]);
  }),
  ...facts(5, 'a', {
    define: [
      ['direction cosines of a line', 'The cosines of the angles it makes with the positive coordinate axes.'],
      ['skew lines', 'Lines in space that are neither parallel nor intersecting.'],
    ],
    recall: [
      ['For direction cosines l, m and n, the value of l² + m² + n² is:', '1', '0', '3', '2'],
      ['The normal to the plane ax + by + cz = d has direction ratios:', 'a, b, c', 'x, y, z', 'd, d, d', '1, 1, 1'],
      ['Two lines are perpendicular if a₁a₂ + b₁b₂ + c₁c₂ is:', '0', '1', '−1', 'd'],
      ['The direction cosines of the x-axis are:', '1, 0, 0', '0, 1, 0', '0, 0, 1', '1, 1, 1'],
    ],
    truths: [
      ['Two parallel planes have proportional normal direction ratios.', 'Two parallel planes have perpendicular normal direction ratios.'],
      ['The shortest distance between two intersecting lines is zero.', 'The shortest distance between two intersecting lines is one.'],
      ['A plane in intercept form is x/a + y/b + z/c = 1.', 'A plane in intercept form is ax + by + cz = 0.'],
    ],
    explain: [
      ['Write the vector equation of a line through a point with position vector a, parallel to b.', 'r = a + λb, where λ is a scalar.'],
    ],
  }),

  // ---- Linear programming
  custom('corner-points', [6, 'a', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const p = g.int(2, 6);
    const q = g.int(2, 6);
    const A = 2 * g.int(2, 6);
    const B = 2 * g.int(2, 6);
    const corner = [g.int(1, A - 1), g.int(1, B - 1)];
    // The fourth corner must lie beyond the line joining (A, 0) and (0, B), or the region isn’t convex.
    if (corner[0] / A + corner[1] / B <= 1) g.retry('a region that isn’t convex');
    const corners = [[0, 0], [A, 0], corner, [0, B]];
    const values = corners.map(([x, y]) => p * x + q * y);
    const best = Math.max(...values);
    return { form: 'numeric', text: `The feasible region of a linear programming problem has corner points ${corners.map((c) => `(${c})`).join(', ')}. Find the maximum of ${$(`Z = ${p}x + ${q}y`)}.`, parts: [g.answerPart('Maximum value of Z', best, 3, [step('Evaluate Z at each corner', ...corners.map((c, i) => `Z(${c}) = ${values[i]}`)), step('Take the largest', `Z_{\\max} = ${best}`)])] };
  }),
  custom('lp-word', [6, 'a', 5, 3], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const [intro, a, b, room, work, profit, scale] = g.pick([
      ['A small workshop makes x tables and y chairs a week.', 'tables', 'chairs', (S: number) => `Each table or chair takes one unit of storage, and there are ${S} units.`, (L: number) => `A table takes 2 hours of labour and a chair takes 1, and there are ${L} hours.`, (P: string, Q: string) => `The profit is ₹${P} on a table and ₹${Q} on a chair.`, 100],
      ['A bakery makes x cakes and y loaves for a fair.', 'cakes', 'loaves', (S: number) => `Each cake or loaf needs one tray, and there are ${S} trays.`, (L: number) => `A cake takes 2 hours of oven time and a loaf takes 1, and there are ${L} hours.`, (P: string, Q: string) => `The profit is ₹${P} on a cake and ₹${Q} on a loaf.`, 10],
      ['A farmer plants x hectares of wheat and y hectares of maize.', 'hectares of wheat', 'hectares of maize', (S: number) => `There are ${S} hectares of land.`, (L: number) => `A hectare of wheat needs 2 days of labour and a hectare of maize needs 1, and there are ${L} days.`, (P: string, Q: string) => `The profit is ₹${P} on a hectare of wheat and ₹${Q} on a hectare of maize.`, 5000],
    ] as const);
    // x + y ≤ S, 2x + y ≤ L, x, y ≥ 0. Corners (0,0), (L/2,0), (L−S, 2S−L), (0,S).
    const S = g.int(6, 14);
    const L = S + g.int(2, S - 2);
    if (L % 2) g.retry();
    const P = g.int(2, 9);
    const Q = g.int(2, 9);
    const corners = [[0, 0], [L / 2, 0], [L - S, 2 * S - L], [0, S]];
    if (corners.some((c) => c.some((v) => v < 0))) g.retry();
    const values = corners.map(([x, y]) => P * x + Q * y);
    const best = Math.max(...values);
    const at = corners[values.indexOf(best)];
    if (values.filter((v) => v === best).length > 1) g.retry('a tie for the best corner');
    return {
      form: 'numeric',
      text: `${intro} ${room(S)} ${work(L)} ${profit((P * scale).toLocaleString('en-IN'), (Q * scale).toLocaleString('en-IN'))} How many of each give the most profit?`,
      parts: [
        g.answerPart(`Number of ${a}`, at[0], 2, [step('Write the constraints', 'x + y \\le ' + S, '2x + y \\le ' + L, 'x, y \\ge 0'), step('Find the corners', ...corners.map((c) => `(${c})`))]),
        g.answerPart(`Number of ${b}`, at[1], 1, [step(`Compare Z = ${P}x + ${Q}y, in units of ₹${scale}, at each corner`, ...corners.map((c, i) => `Z(${c}) = ${values[i]}`))]),
        g.answerPart('Largest profit, in rupees', best * scale, 2, [step('Multiply by the scale', `${best}\\times ${scale} = ${best * scale}`)]),
      ],
    };
  }),
  custom('lp-best-corner', [6, 'a', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const p = g.int(2, 6);
    const q = g.int(2, 6);
    const corners = [[g.int(1, 3), g.int(5, 8)], [g.int(4, 6), g.int(3, 4)], [g.int(7, 9), g.int(1, 2)], [g.int(0, 1), g.int(1, 2)]];
    // Every corner must turn the same way, going round, or one of them is inside the region.
    const turns = corners.map((c, i) => { const [b, a] = [corners[(i + 1) % 4], corners[(i + 2) % 4]]; return (b[0] - c[0]) * (a[1] - b[1]) - (b[1] - c[1]) * (a[0] - b[0]); });
    if (!turns.every((t) => t < 0)) g.retry('a region that isn’t convex');
    const values = corners.map(([x, y]) => p * x + q * y);
    const best = Math.max(...values);
    if (values.filter((v) => v === best).length > 1) g.retry('a tie for the best corner');
    const right = corners[values.indexOf(best)];
    return g.mcq(`A feasible region has corner points ${corners.map((c) => `(${c})`).join(', ')}. At which is ${$(`Z = ${p}x + ${q}y`)} largest?`, `(${right})`, corners.filter((c) => c !== right).map((c) => `(${c})`), { why: `Z takes the values ${values.join(', ')} at these corners, in order.` });
  }),
  ...facts(6, 'a', {
    define: [
      ['the objective function', 'The linear function that is to be maximised or minimised.'],
      ['the feasible region', 'The set of points satisfying all the constraints of the problem.'],
      ['a corner point', 'A point where the boundary lines of the feasible region meet.'],
    ],
    recall: [
      ['The optimal value of a linear programming problem occurs at:', 'a corner point of the feasible region', 'the centre of the region', 'a point outside the region', 'the origin always'],
      ['If the optimum occurs at two corners, it also occurs at:', 'every point on the line joining them', 'the origin', 'only those two', 'no other point'],
      ['Non-negativity constraints are:', 'x ≥ 0 and y ≥ 0', 'x ≤ 0 and y ≤ 0', 'x + y ≤ 0', 'x − y ≥ 0'],
    ],
    truths: [
      ['A bounded feasible region always has an optimal value.', 'A bounded feasible region may have no optimal value.'],
      ['In an unbounded region, an optimum might not exist.', 'In an unbounded region, an optimum always exists.'],
      ['Constraints in an LP problem are linear.', 'Constraints in an LP problem are quadratic.'],
    ],
    reason: [
      ['Checking every corner is enough to find the maximum of Z.', 'Z is linear, so it changes steadily along any edge.', 'So its largest value on an edge comes at an end of it.'],
    ],
    cases: [
      {
        scene: 'A dietitian plans a meal using foods X and Y. Each serving of X gives 2 units of protein and each serving of Y gives 1. At least 8 units are needed, and the plan must cost as little as possible.',
        parts: [
          ['Write the protein constraint, with x and y as servings.', '2x + y ≥ 8.', 1],
          ['What’s the objective?', 'To minimise the total cost.', 1],
          ['Why must x and y be at least zero?', 'A number of servings can’t be negative.', 1],
        ],
      },
    ],
  }),

  // ---- Probability
  custom('conditional', [7, 'a', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const pB = frac(g.int(3, 8), 10);
    const pAB = pB.mul(frac(g.int(1, 3), 4));
    const ans = pAB.div(pB);
    return { form: 'numeric', text: `If ${$(`P(B) = ${pB.tex()}`)} and ${$(`P(A\\cap B) = ${pAB.tex()}`)}, find ${$('P(A|B)')}.`, parts: [g.answerPart('The probability', ans.value, 2, [step('Use the definition', `P(A|B) = \\dfrac{P(A\\cap B)}{P(B)} = ${ans.tex()}`)], '', ans.text())] };
  }),
  custom('independent-mcq', [7, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const a = frac(g.int(1, 3), 4);
    const b = frac(g.int(1, 4), 5);
    const both = a.mul(b);
    return mcqFrac(g, `A and B are independent, with ${$(`P(A) = ${a.tex()}`)} and ${$(`P(B) = ${b.tex()}`)}. Then ${$('P(A\\cap B)')} is:`, both, [a.add(b), a.sub(b).value > 0 ? a.sub(b) : b.sub(a), a.add(b).sub(both), frac(0), a.div(b)]);
  }),
  custom('bayes', [7, 'a', 5, 3], { type: 'numerical', format: 'long' }, (g) => {
    const [a, b, c] = g.pick([[30, 30, 40], [50, 30, 20], [20, 30, 50], [25, 35, 40], [40, 40, 20]]);
    const fa = g.int(1, 4);
    const fb = g.int(1, 4);
    const fc = g.int(1, 4);
    const [source, item] = g.pick([
      ['Three machines, A, B and C', 'bolts'],
      ['Three factories, A, B and C', 'bulbs'],
      ['Three suppliers, A, B and C', 'phone screens'],
    ] as const);
    const total = frac(a * fa + b * fb + c * fc, 10000);
    const ans = frac(a * fa, a * fa + b * fb + c * fc);
    return {
      form: 'numeric',
      text: `${source} make ${a}%, ${b}% and ${c}% of a shop’s ${item}, of which ${fa}%, ${fb}% and ${fc}% are faulty. A ${item.replace(/s$/, '')} chosen at random is found to be faulty.`,
      parts: [
        g.answerPart('Probability that a random one is faulty', total.value, 2, [step('Use the theorem of total probability', `P(F) = \\dfrac{${a}}{100}\\cdot\\dfrac{${fa}}{100} + \\dfrac{${b}}{100}\\cdot\\dfrac{${fb}}{100} + \\dfrac{${c}}{100}\\cdot\\dfrac{${fc}}{100} = ${total.tex()}`)], '', total.text()),
        g.answerPart('Probability it came from A, given that it’s faulty', ans.value, 3, [step('Use Bayes’ theorem', `P(A|F) = \\dfrac{P(A)P(F|A)}{P(F)} = ${ans.tex()}`)], '', ans.text()),
      ],
    };
  }),
  custom('weather-plan', [7, 'a', 5, 3], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const today = g.pick([0.2, 0.3, 0.4, 0.5]);
    const rr = g.pick([0.6, 0.7, 0.8]);
    const dr = g.pick([0.2, 0.3, 0.4]);
    const [who, plan] = g.pick([
      ['A cricket coach', 'hold outdoor practice'],
      ['A wedding planner', 'set up the lawn'],
      ['A farmer', 'spray the crop'],
    ] as const);
    const rain = today * rr + (1 - today) * dr;
    return {
      form: 'numeric',
      text: `${who} wants to ${plan} tomorrow, but only if it’s dry. Today’s forecast gives rain a probability of ${today}. After a wet day, rain the next day has a probability of ${rr}. After a dry day, rain the next day has a probability of ${dr}.`,
      parts: [
        g.answerPart('Probability of rain tomorrow', rain, 2, [step('Use the theorem of total probability', `P = ${today}\\cdot${rr} + ${(1 - today).toFixed(1)}\\cdot${dr} = ${rain.toFixed(2)}`)]),
        g.answerPart('Probability that tomorrow is dry', 1 - rain, 1, [step('Take the complement', `1 - ${rain.toFixed(2)} = ${(1 - rain).toFixed(2)}`)]),
        g.answerPart('Probability it rained today, given that it rains tomorrow', (today * rr) / rain, 2, [step('Use Bayes’ theorem', `\\dfrac{${today}\\cdot${rr}}{${rain.toFixed(2)}} = ${((today * rr) / rain).toFixed(3)}`)]),
      ],
    };
  }),
  custom('binomial', [7, 'a', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const n = g.int(3, 6);
    const r = g.int(1, n - 1);
    const p = frac(1, g.pick([2, 3, 4, 5, 6]));
    const q = frac(1).sub(p);
    const ans = frac(nCr(n, r)).mul(new Frac(p.n ** r, p.d ** r)).mul(new Frac(q.n ** (n - r), q.d ** (n - r)));
    return { form: 'numeric', text: `A trial succeeds with probability ${$(p.tex())}. It is repeated ${n} times independently. Find the probability of exactly ${r} ${r === 1 ? 'success' : 'successes'}.`, parts: [g.answerPart('The probability', ans.value, 3, [step('Choose which trials succeed, and multiply, as the trials are independent', `P = \\binom{${n}}{${r}}\\left(${p.tex()}\\right)^{${r}}\\left(${q.tex()}\\right)^{${n - r}} = ${ans.tex()}`)], '', ans.text())] };
  }),
  custom('distribution-mean', [7, 'a', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const xs = [0, 1, 2, 3];
    const a = g.int(1, 3);
    const b = g.int(1, 4);
    const c = g.int(1, 3);
    const d = 10 - a - b - c;
    if (d <= 0) g.retry();
    const ps = [frac(a, 10), frac(b, 10), frac(c, 10), frac(d, 10)];
    const mean = ps.reduce((sum, p, i) => sum.add(p.mul(xs[i])), frac(0));
    return {
      form: 'numeric',
      text: 'A random variable X has this probability distribution. Find its mean.',
      diagram: { kind: 'table', head: ['X', ...xs.map(String)], rows: [['P(X)', ...ps.map((p) => p.text())]] },
      parts: [g.answerPart('Mean of X', mean.value, 3, [step('Multiply each value by its probability and add', `E(X) = \\sum x_ip_i = ${mean.tex()}`)], '', mean.text())],
    };
  }),
  custom('cards-dice', [7, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const sum = g.int(3, 11);
    const ways = 6 - Math.abs(7 - sum);
    return mcqFrac(g, `Two fair dice are thrown. The probability that the numbers add up to ${sum} is:`, frac(ways, 36), [frac(ways, 12), frac(sum, 36), frac(ways + 1, 36), frac(1, sum), frac(ways, 6)], 'Count the ordered pairs out of 36.');
  }),
  custom('bag', [7, 'a', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const red = g.int(2, 6);
    const blue = g.int(2, 6);
    const total = red + blue;
    const ans = frac(red * (red - 1), total * (total - 1));
    return { form: 'numeric', text: `A bag holds ${red} red and ${blue} blue marbles. Two are drawn one after the other, without being replaced. Find the probability that both are red.`, parts: [g.answerPart('The probability', ans.value, 2, [step('Multiply the two probabilities', `\\dfrac{${red}}{${total}}\\cdot\\dfrac{${red - 1}}{${total - 1}} = ${ans.tex()}`)], '', ans.text())] };
  }),
  ...facts(7, 'a', {
    define: [
      ['independent events', 'Events in which one happening doesn’t change the probability of the other.'],
      ['conditional probability', 'The probability of an event, given that another event has happened.'],
      ['a random variable', 'A real-valued function on the sample space of an experiment.'],
    ],
    recall: [
      ['If A and B are independent, then P(A|B) equals:', 'P(A)', 'P(B)', 'P(A)P(B)', '1'],
      ['The sum of probabilities in a probability distribution is:', '1', '0', 'n', 'the mean'],
      ['Mutually exclusive events with non-zero probabilities are:', 'not independent', 'always independent', 'certain', 'impossible'],
    ],
    truths: [
      ['P(A′) = 1 − P(A).', 'P(A′) = P(A) − 1.'],
      ['P(A ∪ B) = P(A) + P(B) − P(A ∩ B).', 'P(A ∪ B) = P(A) + P(B) + P(A ∩ B).'],
      ['If A and B are independent, then so are A and the complement of B.', 'If A and B are independent, then A and the complement of B never are.'],
    ],
    compare: [
      ['independent events', 'mutually exclusive events', ['One doesn’t affect the other’s probability.', 'They can’t both happen.'], ['P(A ∩ B) = P(A)P(B).', 'P(A ∩ B) = 0.']],
    ],
    explain: [
      ['State Bayes’ theorem for two events.', 'P(A|B) = P(B|A)P(A)/P(B).', 'It reverses a conditional probability, using the prior chance of A.'],
    ],
    reason: [
      ['A test can be highly accurate and yet most of its positive results can still be false.', 'If the condition is very rare, healthy people far outnumber those who have it.', 'So even a small false positive rate gives more false positives than true ones.'],
    ],
    cases: [
      {
        scene: 'A screening test for a rare condition is right 99% of the time. The condition affects 1 in 1000 people. A student asks what a positive result really means.',
        parts: [
          ['Which theorem finds the chance of having the condition given a positive result?', 'Bayes’ theorem.', 1],
          ['What’s the prior probability of having the condition?', '1/1000, which is 0.001.', 1],
          ['Why isn’t the chance of having the condition 99% after a positive result?', 'Because the condition is so rare, most positive results come from healthy people.', 1],
        ],
      },
    ],
  }),
  custom('increasing-proof', [3, 'b', 3, 2], { type: 'proof', format: 'short' }, (g) => {
    const a = g.int(1, 9);
    const b = g.int(1, 9);
    return g.theory(`Show that ${$(`f(x) = x^3 + ${a}x ${signed(-b)}`)} is strictly increasing on ${$('\\mathbb{R}')}.`, [
      [`${$(`f'(x) = 3x^2 + ${a}`)}.`, 1],
      [`As ${$('x^2 \\ge 0')} for every real x, ${$(`f'(x) \\ge ${a} > 0`)}.`, 1],
      [`So f is strictly increasing on ${$('\\mathbb{R}')}.`, 1],
    ]);
  }),
  custom('largest-rectangle-proof', [3, 'b', 4, 3], { type: 'proof', format: 'long' }, (g) => {
    const k = g.int(5, 20);
    return g.theory(`Show that, of all rectangles with a perimeter of ${4 * k} cm, the square has the largest area.`, [
      [`Let the sides be x and y. Then ${$(`2(x + y) = ${4 * k}`)}, so ${$(`y = ${2 * k} - x`)}.`, 1],
      [`The area is ${$(`A = x(${2 * k} - x) = ${2 * k}x - x^2`)}.`, 1],
      [`${$(`\\dfrac{dA}{dx} = ${2 * k} - 2x = 0`)} gives ${$(`x = ${k}`)}, and ${$('\\dfrac{d^2A}{dx^2} = -2 < 0')}, so this is a maximum.`, 1],
      [`Then ${$(`y = ${2 * k} - ${k} = ${k} = x`)}, so the rectangle is a square.`, 1],
    ]);
  }),
  custom('tangent-derivation', [3, 'b', 3, 2], { type: 'derivation', format: 'derivation' }, (g) => {
    const a = g.int(1, 4);
    const x0 = g.int(1, 4);
    const y0 = a * x0 * x0;
    return g.theory(`Find the equation of the tangent to the curve ${$(`y = ${a === 1 ? '' : a}x^2`)} at the point ${$(`(${x0}, ${y0})`)}, and deduce where it meets the x-axis.`, [
      [`${$(`\\dfrac{dy}{dx} = ${2 * a}x`)}, which is ${2 * a * x0} at ${$(`x = ${x0}`)}.`, 1],
      [`The tangent is ${$(`y - ${y0} = ${2 * a * x0}(x - ${x0})`)}.`, 1],
      [`Setting ${$('y = 0')} gives ${$(`x = ${x0} - \\dfrac{${y0}}{${2 * a * x0}}`)}, which is ${frac(x0, 2).text()}.`, 1],
    ]);
  }),
  custom('perpendicular-proof', [4, 'a', 2, 1], { type: 'proof', format: 'short' }, (g) => {
    const p = g.int(1, 6);
    const q = g.int(1, 6);
    const r = g.int(1, 6);
    const t = g.int(1, 3);
    const u = [t * q, -t * p, 0];
    const v = [p, q, r];
    const dot = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    if (dot !== 0) g.retry('the dot product must vanish');
    return g.theory(`Show that the vectors ${$(`\\vec a = ${vecTex(v)}`)} and ${$(`\\vec b = ${vecTex(u)}`)} are perpendicular.`, [
      [`${$('\\vec a \\cdot \\vec b')} ${$(`= (${p})(${u[0]}) + (${q})(${u[1]}) + (${r})(0) = 0`)}.`, 1],
      [`Neither vector is zero, so a zero dot product means they are at right angles.`, 1],
    ]);
  }),
  custom('collinear-proof', [4, 'a', 3, 2], { type: 'proof', format: 'short' }, (g) => {
    const start = [g.int(-3, 4), g.int(-3, 4), g.int(-3, 4)];
    const d = [g.int(1, 3), g.int(1, 3), g.int(1, 3)];
    const s = g.int(2, 4);
    const A = start;
    const B = start.map((x, i) => x + d[i]);
    const C = start.map((x, i) => x + s * d[i]);
    return g.theory(`Show that the points with position vectors ${$(vecTex(A))}, ${$(vecTex(B))} and ${$(vecTex(C))} are collinear.`, [
      [`${$(`\\vec{AB} = ${vecTex(d)}`)}.`, 1],
      [`${$(`\\vec{AC} = ${vecTex(d.map((x) => s * x))} = ${s}\\,\\vec{AB}`)}.`, 1],
      [`So AB and AC are parallel and share the point A, which makes the three points collinear.`, 1],
    ]);
  }),
  custom('det-zero-proof', [2, 'b', 3, 2], { type: 'proof', format: 'short' }, (g) => {
    const r1 = [g.int(1, 6), g.int(1, 6), g.int(1, 6)];
    const r2 = [g.int(1, 6), g.int(1, 6), g.int(1, 6)];
    const k = g.int(2, 3);
    const r3 = r1.map((x, i) => x + k * r2[i]);
    if (det3([r1, r2, r3]) !== 0) g.retry('the determinant must vanish');
    return g.theory(`Without expanding, show that ${$(`\\begin{vmatrix}${[r1, r2, r3].map((r) => r.join(' & ')).join(' \\\\ ')}\\end{vmatrix} = 0`)}.`, [
      [`Apply ${$(`R_3 \\to R_3 - R_1 - ${k}R_2`)}, which doesn't change the value.`, 1],
      [`Every entry of the new third row is 0.`, 1],
      [`A determinant with a row of zeros has the value 0.`, 1],
    ]);
  }),
  custom('vandermonde-proof', [2, 'b', 4, 3], { type: 'proof', format: 'long' }, (g) => {
    const [a, b, c] = g.pick([['a', 'b', 'c'], ['x', 'y', 'z'], ['p', 'q', 'r']]);
    return g.theory(`Using the properties of determinants, prove that ${$(`\\begin{vmatrix}1 & ${a} & ${a}^2 \\\\ 1 & ${b} & ${b}^2 \\\\ 1 & ${c} & ${c}^2\\end{vmatrix} = (${a} - ${b})(${b} - ${c})(${c} - ${a})`)}.`, [
      [`Apply ${$('R_1 \\to R_1 - R_2')} and ${$('R_2 \\to R_2 - R_3')}, so the first column becomes ${$('0, 0, 1')}.`, 1],
      [`Take out the common factors ${$(`(${a} - ${b})`)} and ${$(`(${b} - ${c})`)} from the first two rows.`, 1],
      [`Expanding along the first column leaves ${$(`(${a} - ${b})(${b} - ${c})\\begin{vmatrix}1 & ${a} + ${b} \\\\ 1 & ${b} + ${c}\\end{vmatrix}`)}.`, 1],
      [`This 2 by 2 determinant is ${$(`${b} + ${c} - ${a} - ${b} = ${c} - ${a}`)}, which gives the result.`, 1],
    ]);
  }),
  custom('de-solution-proof', [3, 'e', 2, 1], { type: 'proof', format: 'short' }, (g) => {
    const k = g.int(2, 5);
    const c = g.int(1, 9);
    return g.theory(`Show that ${$(`y = Ae^{${k}x} + ${c}`)}, where A is a constant, is a solution of ${$(`\\dfrac{dy}{dx} = ${k}(y - ${c})`)}.`, [
      [`Differentiating, ${$(`\\dfrac{dy}{dx} = ${k}Ae^{${k}x}`)}.`, 1],
      [`And ${$(`${k}(y - ${c}) = ${k}Ae^{${k}x}`)}, which is the same, so the equation holds.`, 1],
    ]);
  }),
  custom('independent-proof', [7, 'a', 3, 2], { type: 'proof', format: 'short' }, (g) => {
    const pa = frac(g.int(1, 4), 5);
    const pb = frac(g.int(1, 3), 4);
    const both = pa.mul(pb);
    const either = pa.add(pb).sub(both);
    return g.theory(`For two events, ${$(`P(A) = ${pa.tex()}`)}, ${$(`P(B) = ${pb.tex()}`)} and ${$(`P(A \\cap B) = ${both.tex()}`)}. Show that A and B are independent, and find ${$('P(A \\cup B)')}.`, [
      [`${$(`P(A)P(B) = ${pa.tex()} \\times ${pb.tex()} = ${both.tex()}`)}.`, 1],
      [`This equals ${$('P(A \\cap B)')}, so the events are independent.`, 1],
      [`${$(`P(A \\cup B) = ${pa.tex()} + ${pb.tex()} - ${both.tex()} = ${either.tex()}`)}.`, 1],
    ]);
  }),
  // ---- Real-life and data-based questions. Each is built backwards, so its numbers come out clean.
  custom('cbq-sales-matrix', [2, 'a', 3, 1], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const [a, b, c, d] = [g.int(10, 40), g.int(10, 40), g.int(10, 40), g.int(10, 40)];
    const [p, q] = [g.int(5, 20), g.int(5, 20)];
    const first = a * p + b * q;
    const second = c * p + d * q;
    return {
      form: 'numeric',
      text: `A stall sells pens and notebooks. On Monday it sells ${a} pens and ${b} notebooks, and on Tuesday ${c} pens and ${d} notebooks. A pen costs ₹${p} and a notebook ₹${q}. Write the sales as ${$(`S = ${matrixTex([[a, b], [c, d]])}`)} and the prices as ${$(`P = ${matrixTex([[p], [q]])}`)}.`,
      parts: [
        g.answerPart('Monday’s takings, from SP, in rupees', first, 1, [step('Multiply the first row by the prices', `${a} \\times ${p} + ${b} \\times ${q} = ${first}`)]),
        g.answerPart('Tuesday’s takings, in rupees', second, 1, [step('Multiply the second row by the prices', `${c} \\times ${p} + ${d} \\times ${q} = ${second}`)]),
        g.answerPart('Total for the two days, in rupees', first + second, 1, [step('Add them', `${first} + ${second} = ${first + second}`)]),
      ],
    };
  }),
  custom('cbq-open-box', [3, 'b', 4, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    // A rectangular sheet, so as not to repeat the square one. Each pair has a whole-number best cut.
    const [l, w, x] = g.pick([[16, 10, 2], [24, 9, 2], [45, 24, 5], [21, 16, 3], [30, 14, 3]] as const);
    const volume = x * (l - 2 * x) * (w - 2 * x);
    return {
      form: 'numeric',
      text: `A workshop makes an open box from a rectangular sheet of tin ${l} cm by ${w} cm, by cutting a square of side x cm from each corner and folding up the sides. It wants the largest possible volume.`,
      parts: [
        g.answerPart('The value of x, in cm, that gives the largest volume', x, 3, [step('Write the volume and differentiate', `V = x(${l} - 2x)(${w} - 2x)`, `\\dfrac{dV}{dx} = 12x^2 - ${4 * (l + w)}x + ${l * w} = 0`, `x = ${x}\\text{ (the other root is too large for a box)}`)]),
        g.answerPart('That largest volume, in cm³', volume, 1, [step('Substitute', `V = ${x} \\times ${l - 2 * x} \\times ${w - 2 * x} = ${volume}`)]),
      ],
    };
  }),
  custom('cbq-balloon', [3, 'b', 3, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const rate = g.pick([2, 3, 4, 5]);
    const r = g.pick([5, 10, 15]);
    const dv = 4 * r * r * rate;
    return {
      form: 'numeric',
      text: `A spherical balloon is being filled, and its radius grows at ${rate} cm/s. Take the volume as $V = \\dfrac{4}{3}\\pi r^3$, and give the answer as a multiple of π.`,
      parts: [g.answerPart(`The rate of growth of its volume when the radius is ${r} cm, as a multiple of π cm³/s`, dv, 3, [step('Differentiate with respect to time', `\\dfrac{dV}{dt} = 4\\pi r^2 \\dfrac{dr}{dt}`, `= 4\\pi \\times ${r * r} \\times ${rate} = ${dv}\\pi`)])],
    };
  }),
  custom('cbq-garden-area', [3, 'd', 3, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const k = g.int(1, 6);
    const whole = frac(4 * k ** 3, 3);
    return {
      form: 'numeric',
      text: `The edge of a flower bed follows the curve ${$(`y = ${2 * k}x - x^2`)}, in metres, and its other edge is the x-axis.`,
      parts: [
        g.answerPart('The width of the bed along the x-axis, in metres', 2 * k, 1, [step('Find where the curve meets the axis', `x(${2 * k} - x) = 0`)]),
        g.answerPart('Its area, in square metres', whole.value, 2, [step('Integrate between the two roots', `\\int_0^{${2 * k}} (${2 * k}x - x^2)\\,dx = ${whole.tex()}`)], '', whole.text()),
      ],
    };
  }),
  custom('cbq-bacteria-de', [3, 'e', 3, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const start = g.pick([100, 200, 500, 1000]);
    const hours = g.pick([2, 3, 4, 5]);
    const n = g.int(2, 4);
    const final = start * 2 ** n;
    return {
      form: 'numeric',
      text: `In a lab, a culture of ${start} bacteria grows at a rate proportional to its size, so ${$('\\dfrac{dP}{dt} = kP')}. It doubles every ${hours} hours.`,
      parts: [g.answerPart(`The number of bacteria after ${hours * n} hours`, final, 3, [step('Solve the equation', 'P = P_0 e^{kt}', `e^{${hours}k} = 2`, `P = ${start} \\times 2^{${n}} = ${final}`)])],
    };
  }),
  custom('cbq-work-force', [4, 'a', 2, 1], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const F = [g.int(1, 6), g.int(1, 6), g.int(1, 6)];
    const d = [g.int(1, 6), g.int(1, 6), g.int(1, 6)];
    const work = F[0] * d[0] + F[1] * d[1] + F[2] * d[2];
    return {
      form: 'numeric',
      text: `A crane pulls a load with a force ${$(`\\vec F = ${vecTex(F)}`)} kilonewtons, and moves it through ${$(`\\vec d = ${vecTex(d)}`)} metres.`,
      parts: [g.answerPart('The work done, in kilojoules', work, 2, [step('Take the dot product', `\\vec F \\cdot \\vec d = ${F[0]} \\times ${d[0]} + ${F[1]} \\times ${d[1]} + ${F[2]} \\times ${d[2]} = ${work}`)])],
    };
  }),
  custom('cbq-drone-plane', [5, 'a', 3, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const [a, b, c, s] = g.pick([[1, 2, 2, 3], [2, 1, 2, 3], [2, 2, 1, 3], [3, 4, 0, 5], [0, 3, 4, 5], [2, 3, 6, 7], [1, 4, 8, 9]]);
    const h = g.int(2, 6);
    const [x, y, z] = [g.int(1, 5), g.int(1, 5), g.int(1, 5)];
    const d = a * x + b * y + c * z - s * h;
    return {
      form: 'numeric',
      text: `A drone is at the point ${$(`(${x}, ${y}, ${z})`)}, in metres. A sloping roof lies in the plane ${$(`${linear([a, b, c])} = ${d}`)}.`,
      parts: [g.answerPart('The shortest distance from the drone to the plane of the roof, in metres', h, 3, [step('Use the distance formula', `\\dfrac{|${a} \\times ${x} + ${b} \\times ${y} + ${c} \\times ${z} - (${d})|}{\\sqrt{${a * a} + ${b * b} + ${c * c}}} = \\dfrac{${s * h}}{${s}} = ${h}`)])],
    };
  }),
  custom('cbq-diet-lp', [6, 'a', 4, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    // Built from the corner where the two limits cross, so every corner has whole numbers.
    const x0 = g.int(2, 6);
    const y0 = 2 * g.int(1, 4);
    const trays = x0 + y0;
    const hours = 2 * x0 + y0;
    const [p, q] = [g.int(2, 9), g.int(2, 9)];
    const corners: [number, number][] = [[0, 0], [hours / 2, 0], [x0, y0], [0, trays]];
    const values = corners.map(([x, y]) => p * x + q * y);
    const best = Math.max(...values);
    return {
      form: 'numeric',
      text: `A stall makes two snacks, A and B. It can make at most ${trays} trays a day, and has ${hours} hours of oven time. A tray of A takes 2 hours and earns ₹${p}. A tray of B takes 1 hour and earns ₹${q}. With x and y trays, maximise ${$(`Z = ${p}x + ${q}y`)} subject to ${$(`x + y \\le ${trays}`)}, ${$(`2x + y \\le ${hours}`)}, ${$('x \\ge 0')} and ${$('y \\ge 0')}.`,
      parts: [
        g.answerPart('The value of x at the corner where the two limits meet', x0, 2, [step('Subtract one limit from the other', `(2x + y) - (x + y) = ${hours} - ${trays}`, `x = ${x0}`)]),
        g.answerPart('The largest daily earning, in rupees', best, 2, [step('Test each corner of the region', ...corners.map(([x, y], i) => `\\text{At } (${x}, ${y}): Z = ${values[i]}`))]),
      ],
    };
  }),
  custom('cbq-factory-bayes', [7, 'a', 4, 3], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const a = g.pick([40, 50, 60, 70]);
    const b = 100 - a;
    const da = g.int(1, 4);
    const db = g.int(1, 4);
    const pa = frac(a * da, a * da + b * db);
    return {
      form: 'numeric',
      text: `Machine A makes ${a}% of a factory’s bolts, and machine B the rest. Of A’s bolts ${da}% are faulty, and of B’s ${db}%. A bolt picked at random is faulty.`,
      parts: [g.answerPart('The probability that machine A made it', pa.value, 4, [step('Use Bayes’ theorem', `\\dfrac{${a / 100} \\times ${da / 100}}{${a / 100} \\times ${da / 100} + ${b / 100} \\times ${db / 100}} = ${pa.tex()}`)], '', pa.text())],
    };
  }),
  custom('cbq-game-expected', [7, 'a', 3, 2], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const win = g.pick([10, 20, 30]);
    const lose = g.pick([2, 4, 6]);
    const value = frac(win - 5 * lose, 6);
    return {
      form: 'numeric',
      text: `At a fair, you roll a die. A six wins ₹${win}, and anything else loses ₹${lose}.`,
      parts: [g.answerPart('The expected gain in rupees for one roll', value.value, 3, [step('Multiply each result by its probability', `E = ${win} \\times \\dfrac16 - ${lose} \\times \\dfrac56 = ${value.tex()}`)], '', value.text())],
    };
  }),
  custom('cbq-ticket-function', [1, 'a', 2, 2], { type: 'short', format: 'cbq', style: 'cbq-style' }, (g) => {
    const seats = g.int(4, 8);
    const people = seats + g.int(1, 3);
    return g.theory(`A cinema gives each of ${people} people one of its ${seats} seats, with every seat taken. (i) Can this rule be a one-one function from people to seats? (ii) Can it be onto?`, [
      [`(i) No. There are more people than seats, so two people must share a seat.`, 1],
      [`(ii) Yes, as every seat can have someone in it.`, 1],
    ]);
  }),
  ...rest(),
  ...derivationBlueprints('mathematics', 'XII', { custom } as never),
];

export default blueprints;
