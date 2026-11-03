// Makes one of your formulas solvable, once you have given it variables and an equation.
import { DIM_SYMBOLS, type Dim } from '../solver/dims';
import { ExprError, parseEquation, symbolsIn } from '../solver/expr';
import type { ResolvedEntry } from '../solver/types';
import { dimOfUnit } from '../solver/units';
import { findCustom, type CustomFormula, type CustomVariable } from './store';

function dimText(dim: Dim): string {
  return dim.flatMap((power, i) => (Math.abs(power) < 1e-9 ? [] : [power === 1 ? DIM_SYMBOLS[i] : `${DIM_SYMBOLS[i]}^${power}`])).join(' ');
}

/** What is wrong with an equation and its variables, or null if the solver can use them. */
export function equationProblem(equation: string, variables: CustomVariable[]): string | null {
  let symbols: Set<string>;
  try {
    const parsed = parseEquation(equation);
    symbols = new Set([...symbolsIn(parsed.lhs), ...symbolsIn(parsed.rhs)]);
  } catch (err) {
    return err instanceof ExprError ? err.message : 'That equation can\'t be read.';
  }
  const named = new Set(variables.map((v) => v.symbol.trim()));
  const missing = [...symbols].filter((s) => s !== 'e' && !named.has(s));
  if (missing.length) return `Add ${missing.map((m) => `"${m}"`).join(' and ')} to the variables below.`;
  for (const v of variables) {
    if (!v.unit.trim()) continue;
    try {
      dimOfUnit(v.unit.trim());
    } catch {
      return `"${v.unit}" is not a unit I recognise. Try m/s^2, or leave it blank for a pure number.`;
    }
  }
  return null;
}

export function canSolve(f: Pick<CustomFormula, 'equation' | 'variables'>): boolean {
  return Boolean(f.equation?.trim() && f.variables?.length && equationProblem(f.equation, f.variables) === null);
}

/** Your formula as a solver entry. Null until it has what the solver needs. */
export function customEntry(id: string): ResolvedEntry | null {
  const f = findCustom(id);
  if (!f || !canSolve(f)) return null;
  return {
    id: f.id,
    eq: f.equation!,
    topic: 'Your formulas',
    vars: f.variables!.map((v) => {
      const unit = v.unit.trim();
      return { symbol: v.symbol.trim(), name: v.meaning || v.symbol.trim(), quantityKey: 'custom', dim: unit ? dimText(dimOfUnit(unit)) : '', unit, alt: [], gen: [1, 10] as [number, number], isConstant: false };
    }),
  };
}

const COMMANDS: [RegExp, string][] = [
  [/\\left|\\right|\\,|\\;|\\!|\\ /g, ''],
  [/\\cdot|\\times/g, '*'],
  [/\\pi\b/g, 'pi'],
  [/\\(sin|cos|tan|ln|log|exp)\b/g, '$1'],
];

/** A first guess at solver form from the LaTeX, for you to check. Null when it isn't simple enough. */
export function equationFromLatex(latex: string): string | null {
  let text = latex;
  for (const [pattern, to] of COMMANDS) text = text.replace(pattern, to);
  for (let i = 0; i < 6; i++) {
    const before = text;
    text = text.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))').replace(/\\sqrt\{([^{}]*)\}/g, 'sqrt($1)').replace(/\^\{([^{}]*)\}/g, '^($1)').replace(/_\{([^{}]*)\}/g, '_$1');
    if (text === before) break;
  }
  if (/[\\{}]/.test(text) || (text.match(/=/g) ?? []).length !== 1) return null;
  return text.trim();
}
