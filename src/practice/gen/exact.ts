// Exact arithmetic for Mathematics, so an answer of 7/12 stays 7/12 rather than a rounded decimal.

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

export class Frac {
  readonly n: number;
  readonly d: number;

  constructor(n: number, d = 1) {
    if (d === 0) throw new Error('Division by zero in Frac');
    const g = gcd(n, d);
    const sign = d < 0 ? -1 : 1;
    this.n = (sign * n) / g;
    this.d = (sign * d) / g;
  }

  add(o: Frac | number): Frac {
    const f = toFrac(o);
    return new Frac(this.n * f.d + f.n * this.d, this.d * f.d);
  }

  sub(o: Frac | number): Frac {
    const f = toFrac(o);
    return new Frac(this.n * f.d - f.n * this.d, this.d * f.d);
  }

  mul(o: Frac | number): Frac {
    const f = toFrac(o);
    return new Frac(this.n * f.n, this.d * f.d);
  }

  div(o: Frac | number): Frac {
    const f = toFrac(o);
    return new Frac(this.n * f.d, this.d * f.n);
  }

  get value(): number {
    return this.n / this.d;
  }

  get isWhole(): boolean {
    return this.d === 1;
  }

  /** As LaTeX, for use between $ signs. */
  tex(): string {
    if (this.d === 1) return String(this.n);
    return `${this.n < 0 ? '-' : ''}\\dfrac{${Math.abs(this.n)}}{${this.d}}`;
  }

  /** As plain text, which is also what someone would type. */
  text(): string {
    return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`;
  }
}

export const toFrac = (x: Frac | number): Frac => (x instanceof Frac ? x : new Frac(x));
export const frac = (n: number, d = 1): Frac => new Frac(n, d);

/** `ax^p + bx^q + c`, leaving out zero terms and tidying signs and ones. Terms are [coefficient, power]. */
export function polyTex(terms: [number, number][], variable = 'x'): string {
  let out = '';
  for (const [c, p] of terms) {
    if (c === 0) continue;
    const size = Math.abs(c);
    const body = p === 0 ? String(size) : `${size === 1 ? '' : size}${variable}${p === 1 ? '' : `^{${p}}`}`;
    out += out ? (c < 0 ? ` - ${body}` : ` + ${body}`) : c < 0 ? `-${body}` : body;
  }
  return out || '0';
}

/** A signed term, written to follow something: "+ 3" or "- 3". */
export const signed = (x: number): string => (x < 0 ? `- ${Math.abs(x)}` : `+ ${x}`);

export function evalPoly(terms: [number, number][], x: number): number {
  return terms.reduce((sum, [c, p]) => sum + c * x ** p, 0);
}

export const nCr = (n: number, r: number): number => {
  if (r < 0 || r > n) return 0;
  let out = 1;
  for (let i = 1; i <= r; i++) out = (out * (n - r + i)) / i;
  return Math.round(out);
};

export const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

export function det2(m: number[][]): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

export function det3(m: number[][]): number {
  return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
}

export const matrixTex = (m: (number | string)[][]): string => `\\begin{bmatrix}${m.map((row) => row.join(' & ')).join(' \\\\ ')}\\end{bmatrix}`;

export const vecTex = (v: number[]): string => {
  const names = ['\\hat{i}', '\\hat{j}', '\\hat{k}'];
  let out = '';
  v.forEach((c, i) => {
    if (c === 0) return;
    const size = Math.abs(c);
    const body = `${size === 1 ? '' : size}${names[i]}`;
    out += out ? (c < 0 ? ` - ${body}` : ` + ${body}`) : c < 0 ? `-${body}` : body;
  });
  return out || '\\vec{0}';
};
