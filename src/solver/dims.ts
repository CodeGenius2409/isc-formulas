// Dimensional analysis. Used at test time on every registry equation, and in the
// "check my equation" tool.
import { evaluate, type Equation, type Expr } from './expr';
import { toTex } from './tex';

/** Exponents of mass, length, time, current, temperature, amount, luminous intensity. */
export type Dim = readonly [number, number, number, number, number, number, number];

export const DIM_SYMBOLS = ['M', 'L', 'T', 'I', 'Θ', 'N', 'J'] as const;
const ASCII_SYMBOLS: Record<string, number> = { M: 0, L: 1, T: 2, I: 3, K: 4, Θ: 4, N: 5, J: 6 };

export const DIMENSIONLESS: Dim = [0, 0, 0, 0, 0, 0, 0];

/** Reads strings such as "M L T^-2". An empty string is dimensionless. */
export function parseDim(source: string): Dim {
  const out = [0, 0, 0, 0, 0, 0, 0];
  for (const token of source.trim().split(/\s+/).filter(Boolean)) {
    const match = /^([MLTIKΘNJ])(?:\^(-?[\d.]+))?$/.exec(token);
    if (!match) throw new Error(`Bad dimension token: ${token}`);
    out[ASCII_SYMBOLS[match[1]]] += match[2] ? Number(match[2]) : 1;
  }
  return out as unknown as Dim;
}

export const isDimensionless = (d: Dim) => d.every((x) => Math.abs(x) < 1e-9);
export const sameDim = (a: Dim, b: Dim) => a.every((x, i) => Math.abs(x - b[i]) < 1e-9);
const mulDim = (a: Dim, b: Dim): Dim => a.map((x, i) => x + b[i]) as unknown as Dim;
const divDim = (a: Dim, b: Dim): Dim => a.map((x, i) => x - b[i]) as unknown as Dim;
const powDim = (a: Dim, n: number): Dim => a.map((x) => x * n) as unknown as Dim;

const SUPERSCRIPT: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '.': '·', '/': '⁄' };

function superscript(n: number): string {
  if (Number.isInteger(n)) return [...String(n)].map((c) => SUPERSCRIPT[c]).join('');
  // Half powers are the only fractions that occur in practice.
  if (Number.isInteger(n * 2)) return `${[...String(n * 2)].map((c) => SUPERSCRIPT[c]).join('')}⁄²`;
  return [...n.toFixed(2)].map((c) => SUPERSCRIPT[c] ?? c).join('');
}

/** Formats a dimension the way textbooks do: [M L T⁻²], or [1] when dimensionless. */
export function formatDim(d: Dim): string {
  if (isDimensionless(d)) return '[1]';
  const parts = d.flatMap((n, i) => (Math.abs(n) < 1e-9 ? [] : [n === 1 ? DIM_SYMBOLS[i] : `${DIM_SYMBOLS[i]}${superscript(n)}`]));
  return `[${parts.join(' ')}]`;
}

export class DimError extends Error {
  constructor(
    message: string,
    /** Each side of the mismatch, for display. */
    readonly left?: { tex: string; dim: Dim },
    readonly right?: { tex: string; dim: Dim },
  ) {
    super(message);
  }
}

export interface DimValue {
  dim: Dim;
  /** Numeric factor to SI of the calculation units involved. See coherence check. */
  factor: number;
  /** True for a bare number or an expression of only numbers. */
  isLiteral: boolean;
}

export interface SymbolInfo {
  dim: Dim;
  factor?: number;
}

const DIMENSIONLESS_ARG = new Set(['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'cosec', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'exp', 'log', 'ln', 'log10', 'log2']);

const PURE: DimValue = { dim: DIMENSIONLESS, factor: 1, isLiteral: true };

function literalNumber(e: Expr): number | null {
  try {
    const v = evaluate(e, {});
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

/** Works out the dimension of an expression, or throws a DimError explaining why it has none. */
export function dimOf(e: Expr, symbols: Record<string, SymbolInfo>): DimValue {
  switch (e.k) {
    case 'num':
    case 'lit':
      return PURE;
    case 'sym': {
      if (e.n === 'pi') return PURE;
      const info = symbols[e.n];
      if (!info) {
        if (e.n === 'e') return PURE;
        throw new DimError(`No units were given for ${e.n}.`);
      }
      return { dim: info.dim, factor: info.factor ?? 1, isLiteral: false };
    }
    case 'neg':
      return dimOf(e.a, symbols);
    case 'add':
    case 'sub': {
      const a = dimOf(e.a, symbols);
      const b = dimOf(e.b, symbols);
      const aZero = a.isLiteral && literalNumber(e.a) === 0;
      const bZero = b.isLiteral && literalNumber(e.b) === 0;
      if (aZero) return b;
      if (bZero) return a;
      if (!sameDim(a.dim, b.dim)) {
        const verb = e.k === 'add' ? 'added' : 'subtracted';
        throw new DimError(`These terms are ${verb}, so they need the same dimensions: ${formatDim(a.dim)} and ${formatDim(b.dim)}.`, { tex: toTex(e.a), dim: a.dim }, { tex: toTex(e.b), dim: b.dim });
      }
      return { dim: a.dim, factor: a.factor, isLiteral: a.isLiteral && b.isLiteral };
    }
    case 'mul': {
      const a = dimOf(e.a, symbols);
      const b = dimOf(e.b, symbols);
      return { dim: mulDim(a.dim, b.dim), factor: a.factor * b.factor, isLiteral: a.isLiteral && b.isLiteral };
    }
    case 'div': {
      const a = dimOf(e.a, symbols);
      const b = dimOf(e.b, symbols);
      return { dim: divDim(a.dim, b.dim), factor: a.factor / b.factor, isLiteral: a.isLiteral && b.isLiteral };
    }
    case 'pow': {
      const a = dimOf(e.a, symbols);
      const b = dimOf(e.b, symbols);
      if (!isDimensionless(b.dim)) {
        throw new DimError(`An exponent must be dimensionless, but ${toTex(e.b)} has dimensions ${formatDim(b.dim)}.`);
      }
      if (isDimensionless(a.dim)) return { dim: DIMENSIONLESS, factor: 1, isLiteral: a.isLiteral && b.isLiteral };
      const n = literalNumber(e.b);
      if (n === null) {
        throw new DimError(`${toTex(e.a)} has dimensions ${formatDim(a.dim)}, so its power must be a fixed number, not ${toTex(e.b)}.`);
      }
      return { dim: powDim(a.dim, n), factor: a.factor ** n, isLiteral: false };
    }
    case 'fn': {
      if (DIMENSIONLESS_ARG.has(e.f)) {
        for (const arg of e.args) {
          const a = dimOf(arg, symbols);
          if (!isDimensionless(a.dim)) {
            throw new DimError(`The argument of ${e.f} must be dimensionless, but ${toTex(arg)} has dimensions ${formatDim(a.dim)}.`);
          }
        }
        return { ...PURE, isLiteral: false };
      }
      const a = dimOf(e.args[0], symbols);
      if (e.f === 'sqrt') return { dim: powDim(a.dim, 0.5), factor: a.factor ** 0.5, isLiteral: false };
      if (e.f === 'cbrt') return { dim: powDim(a.dim, 1 / 3), factor: a.factor ** (1 / 3), isLiteral: false };
      return { ...a, isLiteral: false };
    }
  }
}

export interface CheckResult {
  ok: boolean;
  left?: Dim;
  right?: Dim;
  message: string;
  /** Present when the failure is inside one side, not between the two sides. */
  termError?: DimError;
}

/** Checks both sides of an equation and explains any mismatch in words. */
export function checkEquation(eq: Equation, symbols: Record<string, SymbolInfo>): CheckResult {
  let left: DimValue;
  let right: DimValue;
  try {
    left = dimOf(eq.lhs, symbols);
    right = dimOf(eq.rhs, symbols);
  } catch (err) {
    if (err instanceof DimError) return { ok: false, message: err.message, termError: err };
    throw err;
  }
  // A bare 0 on one side matches anything, as in a + b = 0.
  const zero = (side: Expr, value: DimValue) => value.isLiteral && literalNumber(side) === 0;
  if (zero(eq.lhs, left) || zero(eq.rhs, right) || sameDim(left.dim, right.dim)) {
    return { ok: true, left: left.dim, right: right.dim, message: `Both sides are ${formatDim(zero(eq.lhs, left) ? right.dim : left.dim)}. The dimensions match.` };
  }
  const ratio = divDim(right.dim, left.dim);
  return {
    ok: false,
    left: left.dim,
    right: right.dim,
    message: `LHS is ${formatDim(left.dim)}, RHS is ${formatDim(right.dim)}. The right side differs from the left by a factor of ${formatDim(ratio)}.`,
  };
}

/** Unit-system check: true if both sides also agree when values are in the calculation units. */
export function coherent(eq: Equation, symbols: Record<string, SymbolInfo>): boolean {
  const left = dimOf(eq.lhs, symbols);
  const right = dimOf(eq.rhs, symbols);
  if ((left.isLiteral && literalNumber(eq.lhs) === 0) || (right.isLiteral && literalNumber(eq.rhs) === 0)) return true;
  const ratio = left.factor / right.factor;
  return Math.abs(ratio - 1) < 1e-6;
}
