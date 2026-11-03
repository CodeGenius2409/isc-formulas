// Calculus on the solver's expression trees. These cover what ISC asks for and stay small, so the plotter
// doesn't carry a computer algebra system. Anything they can't do falls back to a numeric curve, and every
// antiderivative is checked numerically against its integrand before it is believed.
import { add, contains, div, evaluate, fn, mul, neg, num, pow, sub, sym, tidy, type Expr } from '../../solver/expr';
import { derivative as numericDerivative } from './calculus';

const X = 'x';
const has = (e: Expr) => contains(e, X);
const ONE = num(1);
const TWO = num(2);

/** Tidies, and gathers number factors: 2·(3·x) becomes 6·x, and x·2 becomes 2·x. */
export function clean(e: Expr): Expr {
  const walk = (node: Expr): Expr => {
    switch (node.k) {
      case 'num':
      case 'sym':
      case 'lit':
        return node;
      case 'neg':
        return neg(walk(node.a));
      case 'fn':
        return fn(node.f, ...node.args.map(walk));
      default: {
        const a = walk(node.a);
        const b = walk(node.b);
        if (node.k === 'mul') {
          if (b.k === 'num' && a.k !== 'num') return walk(mul(b, a));
          if (a.k === 'num' && b.k === 'mul' && b.a.k === 'num') return mul(num(a.v * b.a.v), b.b);
          if (a.k === 'mul' && a.a.k === 'num' && b.k === 'num') return mul(num(a.a.v * b.v), a.b);
          if (a.k === 'mul' && a.a.k === 'num') return mul(a.a, mul(a.b, b));
        }
        return { k: node.k, a, b };
      }
    }
  };
  let current = e;
  for (let i = 0; i < 6; i++) {
    const next = tidy(walk(current));
    if (JSON.stringify(next) === JSON.stringify(current)) break;
    current = next;
  }
  return current;
}

export class NoSymbolicForm extends Error {}

function chainOf(e: Expr): Expr {
  if (e.k !== 'fn') throw new NoSymbolicForm();
  const u = e.args[0];
  const du = diff(u);
  const outer = (inner: Expr) => mul(inner, du);
  switch (e.f) {
    case 'sin':
      return outer(fn('cos', u));
    case 'cos':
      return outer(neg(fn('sin', u)));
    case 'tan':
      return outer(pow(fn('sec', u), TWO));
    case 'cot':
      return outer(neg(pow(fn('csc', u), TWO)));
    case 'sec':
      return outer(mul(fn('sec', u), fn('tan', u)));
    case 'csc':
    case 'cosec':
      return outer(neg(mul(fn('csc', u), fn('cot', u))));
    case 'asin':
      return outer(div(ONE, fn('sqrt', sub(ONE, pow(u, TWO)))));
    case 'acos':
      return outer(neg(div(ONE, fn('sqrt', sub(ONE, pow(u, TWO))))));
    case 'atan':
      return outer(div(ONE, add(ONE, pow(u, TWO))));
    case 'sinh':
      return outer(fn('cosh', u));
    case 'cosh':
      return outer(fn('sinh', u));
    case 'tanh':
      return outer(div(ONE, pow(fn('cosh', u), TWO)));
    case 'exp':
      return outer(fn('exp', u));
    case 'log':
      if (e.args.length > 1) {
        if (has(e.args[1])) throw new NoSymbolicForm();
        return outer(div(ONE, mul(u, fn('log', e.args[1]))));
      }
      return outer(div(ONE, u));
    case 'log10':
      return outer(div(ONE, mul(u, fn('log', num(10)))));
    case 'log2':
      return outer(div(ONE, mul(u, fn('log', TWO))));
    case 'sqrt':
      return outer(div(ONE, mul(TWO, fn('sqrt', u))));
    case 'cbrt':
      return outer(div(ONE, mul(num(3), pow(fn('cbrt', u), TWO))));
    case 'abs':
      return outer(div(u, fn('abs', u)));
    default:
      throw new NoSymbolicForm();
  }
}

function diff(e: Expr): Expr {
  if (!has(e)) return num(0);
  switch (e.k) {
    case 'sym':
      return ONE;
    case 'neg':
      return neg(diff(e.a));
    case 'add':
      return add(diff(e.a), diff(e.b));
    case 'sub':
      return sub(diff(e.a), diff(e.b));
    case 'mul':
      return add(mul(diff(e.a), e.b), mul(e.a, diff(e.b)));
    case 'div':
      return !has(e.b) ? div(diff(e.a), e.b) : div(sub(mul(diff(e.a), e.b), mul(e.a, diff(e.b))), pow(e.b, TWO));
    case 'pow':
      if (!has(e.b)) return mul(mul(e.b, pow(e.a, clean(sub(e.b, ONE)))), diff(e.a));
      if (!has(e.a)) return mul(mul(e, fn('log', e.a)), diff(e.b));
      return mul(e, add(mul(diff(e.b), fn('log', e.a)), div(mul(e.b, diff(e.a)), e.a)));
    case 'fn':
      return chainOf(e);
    default:
      return num(0);
  }
}

/** The derivative with respect to x. Null for what has no formula here, such as floor(x). */
export function differentiate(e: Expr): Expr | null {
  try {
    return clean(diff(e));
  } catch {
    return null;
  }
}

/** a in ax + b, if u is linear in x. */
function slopeIfLinear(u: Expr): Expr | null {
  const d = differentiate(u);
  return d && !has(d) ? d : null;
}

const LN = (u: Expr) => fn('log', fn('abs', u));

/** The antiderivative of a standard form in u, where u is x or linear in x. */
function standard(e: Expr): { of: Expr; result: Expr } | null {
  if (e.k === 'fn' && e.args.length === 1) {
    const u = e.args[0];
    switch (e.f) {
      case 'sin':
        return { of: u, result: neg(fn('cos', u)) };
      case 'cos':
        return { of: u, result: fn('sin', u) };
      case 'tan':
        return { of: u, result: neg(LN(fn('cos', u))) };
      case 'cot':
        return { of: u, result: LN(fn('sin', u)) };
      case 'sec':
        return { of: u, result: LN(add(fn('sec', u), fn('tan', u))) };
      case 'csc':
      case 'cosec':
        return { of: u, result: LN(sub(fn('csc', u), fn('cot', u))) };
      case 'exp':
        return { of: u, result: fn('exp', u) };
      case 'sinh':
        return { of: u, result: fn('cosh', u) };
      case 'cosh':
        return { of: u, result: fn('sinh', u) };
      case 'log':
        return { of: u, result: sub(mul(u, fn('log', u)), u) };
      case 'sqrt':
        return { of: u, result: mul(div(TWO, num(3)), pow(u, div(num(3), TWO))) };
      default:
        return null;
    }
  }
  if (e.k === 'pow') {
    if (!has(e.b)) {
      if (e.b.k === 'num' && e.b.v === -1) return { of: e.a, result: LN(e.a) };
      if (e.a.k === 'fn' && e.b.k === 'num' && e.b.v === 2) {
        if (e.a.f === 'sec') return { of: e.a.args[0], result: fn('tan', e.a.args[0]) };
        if (e.a.f === 'csc' || e.a.f === 'cosec') return { of: e.a.args[0], result: neg(fn('cot', e.a.args[0])) };
      }
      const next = clean(add(e.b, ONE));
      return { of: e.a, result: div(pow(e.a, next), next) };
    }
    if (!has(e.a)) return { of: e.b, result: div(e, fn('log', e.a)) };
  }
  if (e.k === 'sym') return { of: e, result: div(pow(e, TWO), TWO) };
  return null;
}

/** A polynomial-like factor, which gets simpler each time it is differentiated. */
function isPolynomial(e: Expr): boolean {
  switch (e.k) {
    case 'num':
    case 'lit':
    case 'sym':
      return true;
    case 'neg':
      return isPolynomial(e.a);
    case 'add':
    case 'sub':
    case 'mul':
      return isPolynomial(e.a) && isPolynomial(e.b);
    case 'pow':
      return isPolynomial(e.a) && e.b.k === 'num' && e.b.v >= 0 && Number.isInteger(e.b.v);
    default:
      return false;
  }
}

function integ(e: Expr, depth: number): Expr {
  if (depth > 8) throw new NoSymbolicForm();
  if (!has(e)) return mul(e, sym(X));
  switch (e.k) {
    case 'neg':
      return neg(integ(e.a, depth + 1));
    case 'add':
      return add(integ(e.a, depth + 1), integ(e.b, depth + 1));
    case 'sub':
      return sub(integ(e.a, depth + 1), integ(e.b, depth + 1));
    case 'mul': {
      if (!has(e.a)) return mul(e.a, integ(e.b, depth + 1));
      if (!has(e.b)) return mul(e.b, integ(e.a, depth + 1));
      // By parts, differentiating the polynomial.
      const [u, dv] = isPolynomial(e.a) ? [e.a, e.b] : isPolynomial(e.b) ? [e.b, e.a] : [null, null];
      if (u && dv) {
        const v = integ(dv, depth + 1);
        return sub(mul(u, v), integ(clean(mul(differentiate(u)!, v)), depth + 1));
      }
      throw new NoSymbolicForm();
    }
    case 'div': {
      if (!has(e.b)) return div(integ(e.a, depth + 1), e.b);
      if (!has(e.a)) {
        // c/(1 + x²) and c/√(1 − x²) are standard forms.
        const b = clean(e.b);
        const isOnePlusSquare = b.k === 'add' && b.a.k === 'num' && b.a.v === 1 && b.b.k === 'pow' && b.b.a.k === 'sym' && b.b.b.k === 'num' && b.b.b.v === 2;
        if (isOnePlusSquare) return mul(e.a, fn('atan', sym(X)));
        const isRootOfOneMinusSquare = b.k === 'fn' && b.f === 'sqrt' && b.args[0].k === 'sub' && b.args[0].a.k === 'num' && b.args[0].a.v === 1 && b.args[0].b.k === 'pow' && b.args[0].b.a.k === 'sym' && b.args[0].b.b.k === 'num' && b.args[0].b.b.v === 2;
        if (isRootOfOneMinusSquare) return mul(e.a, fn('asin', sym(X)));
        return mul(e.a, integ(pow(e.b, num(-1)), depth + 1));
      }
      throw new NoSymbolicForm();
    }
    default: {
      // Flatten (u^n)^-1, which the case above can produce.
      if (e.k === 'pow' && e.b.k === 'num' && e.a.k === 'pow' && e.a.b.k === 'num') return integ(pow(e.a.a, num(e.a.b.v * e.b.v)), depth + 1);
      const form = standard(e);
      if (!form) throw new NoSymbolicForm();
      const slope = slopeIfLinear(form.of);
      if (!slope) throw new NoSymbolicForm();
      return div(form.result, slope);
    }
  }
}

/** True if F′ matches f at points where both exist. A wrong rule can't reach the screen past this. */
export function matchesIntegrand(F: Expr, f: Expr): boolean {
  const at = (e: Expr, x: number) => {
    try {
      return evaluate(e, { x });
    } catch {
      return NaN;
    }
  };
  let checked = 0;
  for (const x of [-3.3, -1.7, -0.6, -0.21, 0.13, 0.47, 0.83, 1.3, 2.1, 3.7]) {
    const want = at(f, x);
    const got = numericDerivative((v) => at(F, v), x);
    if (!Number.isFinite(want) || !Number.isFinite(got) || Math.abs(want) > 1e6) continue;
    checked++;
    if (Math.abs(want - got) > 1e-4 * Math.max(1, Math.abs(want))) return false;
  }
  return checked >= 2;
}

/** An antiderivative, leaving off the constant. Null when it needs a numeric curve instead. */
export function antiderivative(e: Expr): Expr | null {
  try {
    const result = clean(integ(clean(e), 0));
    return matchesIntegrand(result, e) ? result : null;
  } catch {
    return null;
  }
}
