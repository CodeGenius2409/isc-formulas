// The "check my equation" tool: reads an equation, works out which symbols need
// units, and reports whether both sides have the same dimensions.
import { checkEquation, formatDim, type CheckResult, type Dim, type SymbolInfo } from './dims';
import { ExprError, parseEquation, symbolsIn } from './expr';
import { dimOfUnit } from './units';

/** Usual meanings of common symbols, to pre-fill the units. Students can change them. */
const USUAL_UNITS: Record<string, string> = {
  a: 'm/s^2', A: 'm^2', B: 'T', c: 'm/s', C: 'F', d: 'm', E: 'J', f: 'Hz', F: 'N', g: 'm/s^2', G: 'N*m^2/kg^2', h: 'm', H: 'm', I: 'A', k: 'N/m', K: 'J', l: 'm', L: 'm', m: 'kg', M: 'kg', n: 'mol', N: 'N', p: 'kg*m/s', P: 'Pa', q: 'C', Q: 'J', r: 'm', R: 'ohm', s: 'm', t: 's', T: 's', u: 'm/s', U: 'J', v: 'm/s', V: 'V', w: 'rad/s', W: 'J', x: 'm', y: 'm', z: 'm',
  rho: 'kg/m^3', omega: 'rad/s', alpha: 'rad/s^2', theta: 'rad', phi: 'rad', lambda: 'm', tau: 'N*m', mu: '', eta: '', sigma: '', pi: '',
};

export function suggestUnit(symbol: string): string {
  return USUAL_UNITS[symbol] ?? USUAL_UNITS[symbol.split('_')[0]] ?? '';
}

export interface ParsedCheck {
  error?: string;
  symbols: string[];
}

export function symbolsOfEquation(source: string): ParsedCheck {
  try {
    const eq = parseEquation(source);
    const names = new Set([...symbolsIn(eq.lhs), ...symbolsIn(eq.rhs)]);
    names.delete('e');
    return { symbols: [...names] };
  } catch (err) {
    if (err instanceof ExprError) return { error: err.message, symbols: [] };
    throw err;
  }
}

export interface FullCheck extends Partial<CheckResult> {
  /** Problems reading a unit, keyed by symbol. */
  unitProblems: Record<string, string>;
  dims: Record<string, string>;
}

export function checkUserEquation(source: string, units: Record<string, string>): FullCheck {
  const parsed = symbolsOfEquation(source);
  if (parsed.error) return { ok: false, message: parsed.error, unitProblems: {}, dims: {} };
  const unitProblems: Record<string, string> = {};
  const dims: Record<string, string> = {};
  const symbols: Record<string, SymbolInfo> = {};
  for (const name of parsed.symbols) {
    const unit = (units[name] ?? '').trim();
    let dim: Dim;
    try {
      dim = unit ? dimOfUnit(unit) : [0, 0, 0, 0, 0, 0, 0];
    } catch {
      unitProblems[name] = `"${unit}" is not a unit I recognise. Try something like m/s or kg*m^2.`;
      continue;
    }
    symbols[name] = { dim };
    dims[name] = formatDim(dim);
  }
  if (Object.keys(unitProblems).length) return { unitProblems, dims };
  return { ...checkEquation(parseEquation(source), symbols), unitProblems, dims };
}
