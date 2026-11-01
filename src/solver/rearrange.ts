// Symbolic rearrangement. Handles any variable as the unknown:
//   1. one occurrence: undo the operations around it, one at a time
//   2. several occurrences: collect a polynomial and use the linear or quadratic formula
//   3. otherwise: report that a numeric search is needed
import { add, contains, div, evaluate, fn, mul, neg, num, pow, sub, sym, tidy, type Equation, type Expr } from './expr';

export interface RearrangeResult {
  kind: 'explicit' | 'quadratic' | 'numeric';
  /** Intermediate equations to show, ending with the rearranged form. */
  lines: Equation[];
  /** Candidate solutions (`explicit`). More than one where a root or trig inverse branches. */
  solutions: Expr[];
  /** Coefficients of a·x² + b·x + c = 0 (`quadratic`). */
  quadratic?: { a: Expr; b: Expr; c: Expr };
  /** Shown with ± when two solutions are one value and its negative. */
  plusMinus?: boolean;
  /** Expression that is zero at a solution (`numeric`). */
  residual: Expr;
}

function occurrences(e: Expr, name: string): number {
  switch (e.k) {
    case 'num':
    case 'lit':
      return 0;
    case 'sym':
      return e.n === name ? 1 : 0;
    case 'neg':
      return occurrences(e.a, name);
    case 'fn':
      return e.args.reduce((n, x) => n + occurrences(x, name), 0);
    default:
      return occurrences(e.a, name) + occurrences(e.b, name);
  }
}

const literalValue = (e: Expr): number | null => {
  try {
    return evaluate(e, {});
  } catch {
    return null;
  }
};

/** Peels one operation off `l`, returning the next equations (more than one on a branch). */
function step(l: Expr, r: Expr, x: string): { l: Expr; r: Expr; pm?: boolean }[] | null {
  switch (l.k) {
    case 'neg':
      return [{ l: l.a, r: neg(r) }];
    case 'add':
      return contains(l.a, x) ? [{ l: l.a, r: sub(r, l.b) }] : [{ l: l.b, r: sub(r, l.a) }];
    case 'sub':
      return contains(l.a, x) ? [{ l: l.a, r: add(r, l.b) }] : [{ l: l.b, r: sub(l.a, r) }];
    case 'mul':
      return contains(l.a, x) ? [{ l: l.a, r: div(r, l.b) }] : [{ l: l.b, r: div(r, l.a) }];
    case 'div':
      return contains(l.a, x) ? [{ l: l.a, r: mul(r, l.b) }] : [{ l: l.b, r: div(l.a, r) }];
    case 'pow': {
      if (contains(l.a, x)) {
        const n = literalValue(l.b);
        if (n !== null && Number.isInteger(n) && n % 2 === 0 && n > 0) {
          const root = n === 2 ? fn('sqrt', r) : pow(r, div(num(1), num(n)));
          return [{ l: l.a, r: root, pm: true }, { l: l.a, r: neg(root), pm: true }];
        }
        if (n !== null && n > 0 && n < 1 && Number.isInteger(1 / n)) return [{ l: l.a, r: pow(r, num(1 / n)) }];
        return [{ l: l.a, r: pow(r, div(num(1), l.b)) }];
      }
      return [{ l: l.b, r: div(fn('log', r), fn('log', l.a)) }];
    }
    case 'fn': {
      const a = l.args[0];
      switch (l.f) {
        case 'sqrt':
          return [{ l: a, r: pow(r, num(2)) }];
        case 'cbrt':
          return [{ l: a, r: pow(r, num(3)) }];
        case 'exp':
          return [{ l: a, r: fn('log', r) }];
        case 'log':
          return l.args.length === 1 ? [{ l: a, r: fn('exp', r) }] : null;
        case 'log10':
          return [{ l: a, r: pow(num(10), r) }];
        case 'log2':
          return [{ l: a, r: pow(num(2), r) }];
        case 'abs':
          return [{ l: a, r, pm: true }, { l: a, r: neg(r), pm: true }];
        case 'sin':
          return [{ l: a, r: fn('asin', r) }, { l: a, r: sub(sym('pi'), fn('asin', r)) }];
        case 'cos':
          return [{ l: a, r: fn('acos', r) }, { l: a, r: neg(fn('acos', r)) }];
        case 'tan':
          return [{ l: a, r: fn('atan', r) }, { l: a, r: add(fn('atan', r), sym('pi')) }];
        case 'asin':
          return [{ l: a, r: fn('sin', r) }];
        case 'acos':
          return [{ l: a, r: fn('cos', r) }];
        case 'atan':
          return [{ l: a, r: fn('tan', r) }];
        default:
          return null;
      }
    }
    default:
      return null;
  }
}

function isolate(lhs: Expr, rhs: Expr, x: string): { lines: Equation[]; solutions: Expr[]; plusMinus: boolean } | null {
  const lines: Equation[] = [{ lhs, rhs }];
  const solutions: Expr[] = [];
  let plusMinus = false;

  const walk = (l: Expr, r: Expr, record: boolean): boolean => {
    if (l.k === 'sym' && l.n === x) {
      solutions.push(tidy(r));
      return true;
    }
    const next = step(l, r, x);
    if (!next) return false;
    next.forEach((branch, i) => {
      if (branch.pm) plusMinus = true;
      if (record && i === 0) lines.push({ lhs: branch.l, rhs: tidy(branch.r) });
    });
    return next.every((branch, i) => walk(branch.l, branch.r, record && i === 0));
  };

  return walk(lhs, rhs, true) ? { lines, solutions, plusMinus } : null;
}

type Poly = Expr[];

const MAX_DEGREE = 4;

function polyAdd(a: Poly, b: Poly, sign: 1 | -1): Poly {
  const out: Poly = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const left = a[i] ?? num(0);
    const right = b[i] ?? num(0);
    out[i] = sign === 1 ? add(left, right) : sub(left, right);
  }
  return out;
}

function polyMul(a: Poly, b: Poly): Poly | null {
  if (a.length + b.length - 2 > MAX_DEGREE) return null;
  const out: Poly = [];
  a.forEach((ca, i) => {
    b.forEach((cb, j) => {
      const term = mul(ca, cb);
      out[i + j] = out[i + j] ? add(out[i + j], term) : term;
    });
  });
  return out;
}

/** Coefficients of `e` as a polynomial in x, or null if it is not one. */
function polynomial(e: Expr, x: string): Poly | null {
  if (!contains(e, x)) return [e];
  switch (e.k) {
    case 'sym':
      return [num(0), num(1)];
    case 'neg': {
      const p = polynomial(e.a, x);
      return p && p.map((c) => neg(c));
    }
    case 'add':
    case 'sub': {
      const a = polynomial(e.a, x);
      const b = polynomial(e.b, x);
      return a && b && polyAdd(a, b, e.k === 'add' ? 1 : -1);
    }
    case 'mul': {
      const a = polynomial(e.a, x);
      const b = polynomial(e.b, x);
      return a && b && polyMul(a, b);
    }
    case 'div': {
      if (contains(e.b, x)) return null;
      const a = polynomial(e.a, x);
      return a && a.map((c) => div(c, e.b));
    }
    case 'pow': {
      const n = literalValue(e.b);
      if (n === null || !Number.isInteger(n) || n < 0 || n > MAX_DEGREE) return null;
      let result: Poly | null = [num(1)];
      const base = polynomial(e.a, x);
      if (!base) return null;
      for (let i = 0; i < n && result; i++) result = polyMul(result, base);
      return result;
    }
    default:
      return null;
  }
}

/** Writes `e` as numerator/denominator polynomials, clearing fractions containing x. */
function rational(e: Expr, x: string): { n: Poly; d: Poly } | null {
  if (!contains(e, x)) return { n: [e], d: [num(1)] };
  switch (e.k) {
    case 'neg': {
      const a = rational(e.a, x);
      return a && { n: a.n.map((c) => neg(c)), d: a.d };
    }
    case 'add':
    case 'sub': {
      const a = rational(e.a, x);
      const b = rational(e.b, x);
      if (!a || !b) return null;
      const left = polyMul(a.n, b.d);
      const right = polyMul(b.n, a.d);
      const d = polyMul(a.d, b.d);
      return left && right && d && { n: polyAdd(left, right, e.k === 'add' ? 1 : -1), d };
    }
    case 'mul': {
      const a = rational(e.a, x);
      const b = rational(e.b, x);
      if (!a || !b) return null;
      const n = polyMul(a.n, b.n);
      const d = polyMul(a.d, b.d);
      return n && d && { n, d };
    }
    case 'div': {
      const a = rational(e.a, x);
      const b = rational(e.b, x);
      if (!a || !b) return null;
      const n = polyMul(a.n, b.d);
      const d = polyMul(a.d, b.n);
      return n && d && { n, d };
    }
    default: {
      const p = polynomial(e, x);
      return p && { n: p, d: [num(1)] };
    }
  }
}

function collect(lhs: Expr, rhs: Expr, x: string): Poly | null {
  const direct = polynomial(sub(lhs, rhs), x);
  if (direct) return direct;
  const l = rational(lhs, x);
  const r = rational(rhs, x);
  if (!l || !r) return null;
  const left = polyMul(l.n, r.d);
  const right = polyMul(r.n, l.d);
  return left && right && polyAdd(left, right, -1);
}

function degreeOf(poly: Poly, env: Record<string, number> | null): number {
  if (!env) return poly.length - 1;
  for (let i = poly.length - 1; i > 0; i--) {
    try {
      if (Math.abs(evaluate(poly[i], env)) > 1e-300) return i;
    } catch {
      return i;
    }
  }
  return 0;
}

/**
 * Rearranges an equation for `x`. `env`, when given, holds the known values. It
 * only decides whether a term vanishes: a "quadratic" whose x² term turns out to be
 * zero (a = 0 in s = ut + ½at²) is really linear.
 */
export function rearrange(eq: Equation, x: string, env: Record<string, number> | null = null): RearrangeResult {
  const residual = sub(eq.lhs, eq.rhs);
  const inLeft = occurrences(eq.lhs, x);
  const inRight = occurrences(eq.rhs, x);

  if (inLeft + inRight === 1) {
    const [l, r] = inLeft ? [eq.lhs, eq.rhs] : [eq.rhs, eq.lhs];
    const result = isolate(l, r, x);
    if (result) return { kind: 'explicit', lines: result.lines, solutions: result.solutions, plusMinus: result.plusMinus, residual };
  }

  const poly = collect(eq.lhs, eq.rhs, x);
  if (poly) {
    const degree = degreeOf(poly, env);
    const c0 = tidy(poly[0] ?? num(0));
    const c1 = tidy(poly[1] ?? num(0));
    if (degree <= 1) {
      const solution = tidy(div(neg(c0), c1));
      return { kind: 'explicit', lines: [eq, { lhs: sym(x), rhs: solution }], solutions: [solution], residual };
    }
    if (degree === 2) {
      const a = tidy(poly[2]);
      // Prefer a positive leading term: ½a·t² + u·t − s = 0, not −½a·t² − u·t + s = 0.
      const quadratic = a.k === 'neg' ? { a: a.a, b: tidy(neg(c1)), c: tidy(neg(c0)) } : { a, b: c1, c: c0 };
      return { kind: 'quadratic', lines: [eq], solutions: [], quadratic, residual };
    }
  }

  return { kind: 'numeric', lines: [eq], solutions: [], residual };
}

/** Finds real roots of `residual = 0` by scanning for sign changes across many scales. */
export function numericRoots(residual: Expr, x: string, env: Record<string, number>, range?: [number, number]): number[] {
  const f = (v: number) => {
    try {
      return evaluate(residual, { ...env, [x]: v });
    } catch {
      return NaN;
    }
  };
  const points: number[] = [];
  if (range) {
    const steps = 4000;
    for (let i = 0; i <= steps; i++) points.push(range[0] + ((range[1] - range[0]) * i) / steps);
  } else {
    for (let exp = -36; exp <= 36; exp += 0.02) {
      const v = 10 ** exp;
      points.push(v, -v);
    }
    points.sort((a, b) => a - b);
  }
  const roots: number[] = [];
  for (let i = 1; i < points.length; i++) {
    let lo = points[i - 1];
    let hi = points[i];
    let fLo = f(lo);
    const fHi = f(hi);
    if (!Number.isFinite(fLo) || !Number.isFinite(fHi)) continue;
    if (fLo === 0) {
      roots.push(lo);
      continue;
    }
    if (fLo * fHi > 0) continue;
    for (let j = 0; j < 200; j++) {
      const mid = (lo + hi) / 2;
      const fMid = f(mid);
      if (fLo * fMid <= 0) hi = mid;
      else {
        lo = mid;
        fLo = fMid;
      }
    }
    const root = (lo + hi) / 2;
    // A sign change across a pole is not a root.
    const scale = Math.max(Math.abs(fLo), Math.abs(fHi), 1e-300);
    if (Math.abs(f(root)) <= scale && Number.isFinite(f(root))) roots.push(root);
  }
  return roots.filter((r, i) => i === 0 || Math.abs(r - roots[i - 1]) > 1e-9 * Math.max(Math.abs(r), 1e-30));
}
