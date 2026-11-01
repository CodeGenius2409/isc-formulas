// A small expression tree. Parsing comes from mathjs; everything after that
// (rearranging, evaluating, printing, dimension checks) works on this form.
import { math } from './mathjs';

export type BinaryKind = 'add' | 'sub' | 'mul' | 'div' | 'pow';

export type Expr =
  | { k: 'num'; v: number }
  | { k: 'sym'; n: string }
  /** A substituted value: prints as `tex` and evaluates to `v`. */
  | { k: 'lit'; v: number; tex: string }
  | { k: BinaryKind; a: Expr; b: Expr }
  | { k: 'neg'; a: Expr }
  | { k: 'fn'; f: string; args: Expr[] };

export interface Equation {
  lhs: Expr;
  rhs: Expr;
}

export const num = (v: number): Expr => ({ k: 'num', v });
export const sym = (n: string): Expr => ({ k: 'sym', n });
export const add = (a: Expr, b: Expr): Expr => ({ k: 'add', a, b });
export const sub = (a: Expr, b: Expr): Expr => ({ k: 'sub', a, b });
export const mul = (a: Expr, b: Expr): Expr => ({ k: 'mul', a, b });
export const div = (a: Expr, b: Expr): Expr => ({ k: 'div', a, b });
export const pow = (a: Expr, b: Expr): Expr => ({ k: 'pow', a, b });
export const neg = (a: Expr): Expr => ({ k: 'neg', a });
export const fn = (f: string, ...args: Expr[]): Expr => ({ k: 'fn', f, args });

const OPERATORS: Record<string, BinaryKind> = { add: 'add', subtract: 'sub', multiply: 'mul', divide: 'div', pow: 'pow' };

/** Functions the evaluator understands. `log` is natural, as in mathjs. */
const FUNCTIONS: Record<string, (...x: number[]) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  cot: (x) => 1 / Math.tan(x),
  sec: (x) => 1 / Math.cos(x),
  csc: (x) => 1 / Math.sin(x),
  cosec: (x) => 1 / Math.sin(x),
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  atan2: Math.atan2,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  exp: Math.exp,
  log: (x, base) => (base === undefined ? Math.log(x) : Math.log(x) / Math.log(base)),
  ln: Math.log,
  log10: Math.log10,
  log2: Math.log2,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  sign: Math.sign,
  min: Math.min,
  max: Math.max,
  pow: Math.pow,
};

export const KNOWN_FUNCTIONS = Object.keys(FUNCTIONS);

export class ExprError extends Error {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromNode(node: any): Expr {
  switch (node.type) {
    case 'ConstantNode':
      return num(Number(node.value));
    case 'SymbolNode':
      return sym(node.name);
    case 'ParenthesisNode':
      return fromNode(node.content);
    case 'OperatorNode': {
      if (node.fn === 'unaryMinus') return neg(fromNode(node.args[0]));
      if (node.fn === 'unaryPlus') return fromNode(node.args[0]);
      const kind = OPERATORS[node.fn];
      if (!kind || node.args.length !== 2) throw new ExprError(`The operator "${node.op}" is not supported here.`);
      return { k: kind, a: fromNode(node.args[0]), b: fromNode(node.args[1]) };
    }
    case 'FunctionNode': {
      const name = node.fn?.name ?? String(node.fn);
      if (!FUNCTIONS[name]) throw new ExprError(`The function "${name}" is not recognised.`);
      const f = name === 'ln' ? 'log' : name;
      return fn(f, ...node.args.map(fromNode));
    }
    default:
      throw new ExprError(`"${node.toString?.() ?? node.type}" is not supported here.`);
  }
}

export function parseExpr(source: string): Expr {
  let node: unknown;
  try {
    node = math.parse(source.replace(/\^\^/g, '^'));
  } catch (err) {
    throw new ExprError(`Could not read "${source}". ${(err as Error).message}`);
  }
  return fromNode(node);
}

export function parseEquation(source: string): Equation {
  const parts = source.split('=');
  if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
    throw new ExprError('Write it as one equation with a single "=", for example v = u + a*t.');
  }
  return { lhs: parseExpr(parts[0]), rhs: parseExpr(parts[1]) };
}

export function evaluate(e: Expr, env: Record<string, number>): number {
  switch (e.k) {
    case 'num':
    case 'lit':
      return e.v;
    case 'sym':
      if (e.n in env) return env[e.n];
      if (e.n === 'pi') return Math.PI;
      if (e.n === 'e') return Math.E;
      throw new ExprError(`No value for ${e.n}.`);
    case 'add':
      return evaluate(e.a, env) + evaluate(e.b, env);
    case 'sub':
      return evaluate(e.a, env) - evaluate(e.b, env);
    case 'mul':
      return evaluate(e.a, env) * evaluate(e.b, env);
    case 'div':
      return evaluate(e.a, env) / evaluate(e.b, env);
    case 'pow':
      return Math.pow(evaluate(e.a, env), evaluate(e.b, env));
    case 'neg':
      return -evaluate(e.a, env);
    case 'fn':
      return FUNCTIONS[e.f](...e.args.map((x) => evaluate(x, env)));
  }
}

export function contains(e: Expr, name: string): boolean {
  switch (e.k) {
    case 'num':
    case 'lit':
      return false;
    case 'sym':
      return e.n === name;
    case 'neg':
      return contains(e.a, name);
    case 'fn':
      return e.args.some((x) => contains(x, name));
    default:
      return contains(e.a, name) || contains(e.b, name);
  }
}

/** Replaces symbols using `map`. Symbols missing from the map stay as they are. */
export function substitute(e: Expr, map: Record<string, Expr>): Expr {
  switch (e.k) {
    case 'num':
    case 'lit':
      return e;
    case 'sym':
      return map[e.n] ?? e;
    case 'neg':
      return neg(substitute(e.a, map));
    case 'fn':
      return fn(e.f, ...e.args.map((x) => substitute(x, map)));
    default:
      return { k: e.k, a: substitute(e.a, map), b: substitute(e.b, map) };
  }
}

export function symbolsIn(e: Expr, out: Set<string> = new Set()): Set<string> {
  switch (e.k) {
    case 'num':
    case 'lit':
      break;
    case 'sym':
      if (e.n !== 'pi') out.add(e.n);
      break;
    case 'neg':
      symbolsIn(e.a, out);
      break;
    case 'fn':
      e.args.forEach((x) => symbolsIn(x, out));
      break;
    default:
      symbolsIn(e.a, out);
      symbolsIn(e.b, out);
  }
  return out;
}

const isNum = (e: Expr, v: number) => e.k === 'num' && e.v === v;

/** Light tidying, so rearranged forms read the way a student would write them. */
export function tidy(e: Expr): Expr {
  switch (e.k) {
    case 'num':
    case 'sym':
    case 'lit':
      return e;
    case 'neg': {
      const a = tidy(e.a);
      if (a.k === 'neg') return a.a;
      if (a.k === 'num') return num(-a.v);
      return neg(a);
    }
    case 'fn':
      return fn(e.f, ...e.args.map(tidy));
    default: {
      const a = tidy(e.a);
      const b = tidy(e.b);
      if (a.k === 'num' && b.k === 'num') {
        const v = evaluate({ k: e.k, a, b }, {});
        // Keep exact fractions such as 1/2 instead of collapsing them to decimals.
        if (e.k !== 'div' && Number.isFinite(v)) return num(v);
      }
      if (e.k === 'add') {
        if (isNum(a, 0)) return b;
        if (isNum(b, 0)) return a;
        if (b.k === 'neg') return sub(a, b.a);
      }
      if (e.k === 'sub') {
        if (isNum(b, 0)) return a;
        if (isNum(a, 0)) return tidy(neg(b));
        if (b.k === 'neg') return add(a, b.a);
      }
      if (e.k === 'mul') {
        if (isNum(a, 1)) return b;
        if (isNum(b, 1)) return a;
        if (isNum(a, 0) || isNum(b, 0)) return num(0);
        if (a.k === 'neg') return tidy(neg(mul(a.a, b)));
        if (b.k === 'neg') return tidy(neg(mul(a, b.a)));
      }
      if (e.k === 'div') {
        if (isNum(b, 1)) return a;
        if (isNum(a, 0)) return num(0);
        // (1/2)·x style denominators: a/(b/c) reads better as a·c/b
        if (b.k === 'div') return tidy(div(mul(a, b.b), b.a));
        if (a.k === 'div') return tidy(div(a.a, mul(a.b, b)));
      }
      if (e.k === 'pow') {
        if (isNum(b, 1)) return a;
        if (isNum(b, 0)) return num(1);
        if (b.k === 'div' && isNum(b.a, 1) && isNum(b.b, 2)) return fn('sqrt', a);
        if (isNum(b, 0.5)) return fn('sqrt', a);
      }
      return { k: e.k, a, b };
    }
  }
}
