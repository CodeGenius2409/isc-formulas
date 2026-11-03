// An independent check of hand-written answers in the bank: each is recalculated numerically here, away
// from the words of the marking scheme, so that a slip in a model answer fails a test.
import { det, evaluate, multiply, inv } from 'mathjs';
import { describe, expect, it } from 'vitest';

function integrate(f: (x: number) => number, a: number, b: number, n = 20000): number {
  // Simpson's rule, with the ends nudged inward for integrands that blow up at a limit.
  const lo = a + 1e-9;
  const hi = b - 1e-9;
  const h = (hi - lo) / n;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < n; i++) sum += f(lo + i * h) * (i % 2 ? 4 : 2);
  return (sum * h) / 3;
}
const slope = (f: (x: number) => number, x: number, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
const PI = Math.PI;

describe('Mathematics XII answers', () => {
  it('definite integrals', () => {
    expect(integrate((x) => Math.tan(x) ** 2, 0, PI / 4)).toBeCloseTo(1 - PI / 4, 5);
    expect(integrate((x) => x * Math.sin(x), 0, PI)).toBeCloseTo(PI, 5);
    expect(2 * integrate((x) => 2 * Math.sqrt(x), 0, 1)).toBeCloseTo(8 / 3, 3);
    expect(integrate((x) => Math.log(Math.sin(x)), 0, PI / 2, 200000)).toBeCloseTo((-PI / 2) * Math.log(2), 3);
    expect(integrate((x) => Math.sin(x) / (Math.sin(x) + Math.cos(x)), 0, PI / 2)).toBeCloseTo(PI / 4, 5);
    expect(integrate((x) => x - x * x, 0, 1)).toBeCloseTo(1 / 6, 5);
  });

  it('antiderivatives, by differentiating them back', () => {
    for (const x of [0.3, 1.1, 2.7]) {
      expect(slope((t) => (t - 1) * Math.exp(t), x)).toBeCloseTo(x * Math.exp(x), 4);
      expect(slope((t) => Math.log(Math.abs((t + 1) / (t + 2))), x)).toBeCloseTo(1 / ((x + 1) * (x + 2)), 4);
      expect(slope((t) => Math.atan(Math.sqrt(t)), x)).toBeCloseTo(1 / (2 * Math.sqrt(x) * (1 + x)), 4);
      expect(slope((t) => t ** t, x)).toBeCloseTo(x ** x * (1 + Math.log(x)), 3);
    }
  });

  it('inverse trigonometric results', () => {
    expect(Math.atan(1) + Math.acos(-0.5)).toBeCloseTo((11 * PI) / 12, 10);
    expect(2 * Math.atan(1 / 3) + Math.atan(1 / 7)).toBeCloseTo(PI / 4, 10);
    expect(Math.acos(Math.cos((5 * PI) / 3))).toBeCloseTo(PI / 3, 10);
  });

  it('matrices and determinants', () => {
    const a = [[1, 1, 1], [1, 2, 3], [1, 4, 9]];
    expect(det(a)).toBeCloseTo(2, 8);
    const x = multiply(inv(a), [6, 14, 36]) as number[];
    expect(x[0]).toBeCloseTo(1, 8);
    expect(x[1]).toBeCloseTo(2, 8);
    expect(x[2]).toBeCloseTo(3, 8);
    // The adjoint as written in the marking scheme.
    const adj = [[6, -5, 1], [-6, 8, -2], [2, -3, 1]];
    const product = multiply(a, adj) as number[][];
    expect(product).toEqual([[2, 0, 0], [0, 2, 0], [0, 0, 2]]);
    const b = [[1, 2], [3, 4]];
    const square = multiply(b, b) as number[][];
    expect(square).toEqual([[7, 10], [15, 22]]);
    expect(square[0][0] - 5 * b[0][0] - 2).toBe(0);
    expect(square[1][1] - 5 * b[1][1] - 2).toBe(0);
    const [p, q, r] = [2, 3, 7];
    expect(det([[1, 1, 1], [p, q, r], [p * p, q * q, r * r]])).toBeCloseTo((p - q) * (q - r) * (r - p), 8);
    expect(det([[1, p, q + r], [1, q, r + p], [1, r, p + q]])).toBeCloseTo(0, 8);
  });

  it('calculus results', () => {
    // (f o f)(x) = x
    const f = (x: number) => (4 * x + 3) / (6 * x - 4);
    for (const x of [1, 2.5, -3]) expect(f(f(x))).toBeCloseTo(x, 10);
    // Open box: the best cut, and the greatest volume, for a sheet of side 12.
    const volume = (x: number) => x * (12 - 2 * x) ** 2;
    expect(slope(volume, 2)).toBeCloseTo(0, 3);
    expect(volume(2)).toBeCloseTo((2 * 12 ** 3) / 27, 8);
    // x = a cos^3 t, y = a sin^3 t
    const t = 0.7;
    const dy = slope((s) => Math.sin(s) ** 3, t);
    const dx = slope((s) => Math.cos(s) ** 3, t);
    expect(dy / dx).toBeCloseTo(-Math.tan(t), 5);
  });

  it('differential equations, by substituting the solution back', () => {
    // y^2 - x^2 = C solves dy/dx = x/y
    const y1 = (x: number) => Math.sqrt(x * x + 3);
    expect(slope(y1, 1.5)).toBeCloseTo(1.5 / y1(1.5), 5);
    // y e^x = e^(2x)/2 + C solves dy/dx + y = e^x
    const y2 = (x: number) => (Math.exp(2 * x) / 2 + 3) / Math.exp(x);
    expect(slope(y2, 0.8) + y2(0.8)).toBeCloseTo(Math.exp(0.8), 5);
    // x^2 - y^2 = Cx solves dy/dx = (x^2 + y^2)/(2xy)
    const y3 = (x: number) => Math.sqrt(x * x - 2 * x);
    const x3 = 5;
    expect(slope(y3, x3)).toBeCloseTo((x3 * x3 + y3(x3) ** 2) / (2 * x3 * y3(x3)), 5);
  });

  it('vectors and three-dimensional geometry', () => {
    const cross = (u: number[], v: number[]) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const size = (u: number[]) => Math.hypot(...u);
    expect(cross([1, 1, 1], [1, -1, 0])).toEqual([1, 1, -2]);
    expect(cross([1, 2, 3], [3, 2, 1])).toEqual([-4, 8, -4]);
    expect(size(cross([1, 2, 3], [3, 2, 1])) / (size([1, 2, 3]) * size([3, 2, 1]))).toBeCloseTo((2 * Math.sqrt(6)) / 7, 10);
    const n = cross([2, -1, 1], [3, -5, 2]);
    expect(n).toEqual([3, -1, -7]);
    expect(Math.abs(1 * n[0] + 0 * n[1] - 1 * n[2]) / size(n)).toBeCloseTo(10 / Math.sqrt(59), 10);
    expect((1 * 2 + 2 * 2 + 2 * 1) / (3 * 3)).toBeCloseTo(8 / 9, 10);
  });

  it('linear programming and probability', () => {
    const profit = (x: number, y: number) => 5 * x + 4 * y;
    expect(Math.max(profit(0, 0), profit(4, 0), profit(2, 3), profit(0, 4))).toBe(22);
    expect(2 + 2 * 3).toBe(8);
    expect(3 * 2 + 2 * 3).toBe(12);
    expect((0.5 * 0.6) / (0.5 * 0.6 + 0.5 * 0.2)).toBeCloseTo(3 / 4, 10);
    expect(evaluate('combinations(3, 2) * 0.5^3')).toBeCloseTo(3 / 8, 10);
    expect((0 * 144 + 24 + 2) / 169).toBeCloseTo(2 / 13, 10);
  });
});

describe('Mathematics XI answers', () => {
  it('numbers, series and counting', () => {
    expect(evaluate('combinations(6, 3)')).toBe(20);
    expect(evaluate('permutations(6, 3)')).toBe(120);
    expect(evaluate('combinations(4, 2) * combinations(6, 2)')).toBe(90);
    expect(evaluate('combinations(52, 2)')).toBe(1326);
    expect(evaluate('combinations(4, 2)') / evaluate('combinations(52, 2)')).toBeCloseTo(1 / 221, 10);
    expect(25 + 20 - 10).toBe(35);
    expect(1 + 19 * 3).toBe(58);
    expect((20 / 2) * (1 + 58)).toBe(590);
    expect(5 ** 2 - 2 * 6).toBe(13);
    expect(evaluate('(1 + i) / (1 - i)').im).toBeCloseTo(1, 10);
    const root = evaluate('(3 + 2i)^2');
    expect(root.re).toBeCloseTo(5, 10);
    expect(root.im).toBeCloseTo(12, 10);
    expect(evaluate('i^10').re).toBeCloseTo(-1, 10);
  });

  it('trigonometry', () => {
    for (const t of [0.3, 1.2]) {
      expect(Math.cos(3 * t)).toBeCloseTo(4 * Math.cos(t) ** 3 - 3 * Math.cos(t), 10);
      expect(Math.sin(2 * t) / (1 + Math.cos(2 * t))).toBeCloseTo(Math.tan(t), 10);
    }
    const [a, b] = [0.7, 1.1];
    const c = PI - a - b;
    expect(Math.sin(a) + Math.sin(b) + Math.sin(c)).toBeCloseTo(4 * Math.cos(a / 2) * Math.cos(b / 2) * Math.cos(c / 2), 10);
  });

  it('coordinate geometry', () => {
    // x^2 + y^2 - 2x - 4y = 0 passes through the three points.
    for (const [x, y] of [[0, 0], [2, 0], [0, 4]]) expect(x * x + y * y - 2 * x - 4 * y).toBe(0);
    // The two circle answers.
    expect(4 + 9 - 12).toBe(1);
    expect(9 + 16).toBe(25);
    expect(Math.sqrt(1 - 9 / 25)).toBeCloseTo(4 / 5, 10);
    expect((2 * 9) / 5).toBeCloseTo(18 / 5, 10);
    // 2x - y - 1 = 0 through (2, 3), perpendicular to x + 2y = 5.
    expect(2 * 2 - 3 - 1).toBe(0);
    expect(2 * (-1 / 2)).toBe(-1);
  });

  it('statistics', () => {
    expect(((2 - 5) ** 2 + (4 - 5) ** 2 + (6 - 5) ** 2 + (8 - 5) ** 2) / 4).toBe(5);
    const data = [5, 10, 15, 20, 25];
    const mean = data.reduce((s, x) => s + x, 0) / 5;
    const variance = data.reduce((s, x) => s + (x - mean) ** 2, 0) / 5;
    expect(mean).toBe(15);
    expect(variance).toBe(50);
    expect((Math.sqrt(variance) / mean) * 100).toBeCloseTo(47.14, 1);
  });
});

describe('Chemistry answers', () => {
  it('empirical formula and Hess’s law', () => {
    expect(40.0 / 12 / (53.33 / 16)).toBeCloseTo(1, 2);
    expect(6.67 / (53.33 / 16)).toBeCloseTo(2, 2);
    expect(-393 - -283).toBe(-110);
  });

  it('the Nernst example', () => {
    expect(1.1 - (0.0591 / 2) * Math.log10(0.1 / 0.01)).toBeCloseTo(1.07, 2);
  });

  it('first order: 99.9% takes about ten half-lives', () => {
    expect((2.303 * Math.log10(1000)) / 0.693).toBeCloseTo(10, 0);
  });
});

describe('Computer Science answers', () => {
  it('Boolean reductions match their minterms', () => {
    const minterms = (f: (a: boolean, b: boolean, c: boolean, d: boolean) => boolean) => {
      const out: number[] = [];
      for (let n = 0; n < 16; n++) if (f(Boolean(n & 8), Boolean(n & 4), Boolean(n & 2), Boolean(n & 1))) out.push(n);
      return out;
    };
    expect(minterms((_a, b, _c, d) => (!b && !d) || (b && d))).toEqual([0, 2, 5, 7, 8, 10, 13, 15]);
    const zeros = [0, 1, 2, 3, 5, 7];
    const ones = Array.from({ length: 16 }, (_, n) => n).filter((n) => !zeros.includes(n));
    expect(minterms((a, b, _c, d) => (a || b) && (a || !d))).toEqual(ones);
    expect(minterms((a, b, _c, d) => a || (b && !d))).toEqual(ones);
    const sum = [1, 2, 4, 7];
    const carry = [3, 5, 6, 7];
    const three = (f: (a: boolean, b: boolean, c: boolean) => boolean) => minterms((a, b, c, d) => !a && f(b, c, d));
    expect(three((a, b, c) => Boolean(Number(a) ^ Number(b) ^ Number(c)))).toEqual(sum);
    expect(three((a, b, c) => (a && b) || (b && c) || (c && a))).toEqual(carry);
  });

  it('number conversions', () => {
    expect((156).toString(2)).toBe('10011100');
    expect((156).toString(8)).toBe('234');
    expect((156).toString(16).toUpperCase()).toBe('9C');
    expect((45).toString(2)).toBe('101101');
    expect((45).toString(8)).toBe('55');
    expect(parseInt('A3', 16)).toBe(163);
    expect(parseInt('2F', 16)).toBe(47);
    expect((0b10110 + 0b01101).toString(2)).toBe('100011');
    expect((0b10110 - 0b01001).toString(2).padStart(5, '0')).toBe('01101');
    expect(((256 - 25) & 255).toString(2)).toBe('11100111');
  });

  it('array addressing', () => {
    expect(1000 + (5 - -2) * 4).toBe(1028);
  });
});
