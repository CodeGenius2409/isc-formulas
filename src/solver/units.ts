// Reading values typed by the student, converting units, and formatting results.
import { evaluate, ExprError, parseExpr } from './expr';
import { formatDim, parseDim, sameDim, type Dim } from './dims';
import { math } from './mathjs';

export interface ParsedInput {
  ok: boolean;
  /** Value in the variable's calculation unit. */
  value: number;
  /** Significant figures typed, when that makes sense. */
  sigFigs: number | null;
  /** The unit the student used, if different from the calculation unit. */
  fromUnit: string | null;
  /** The value as entered, for showing the conversion. */
  entered: number;
  /** Explains a problem with the unit or the number. */
  problem?: string;
}

/** mathjs unit dimensions: mass, length, time, current, temperature, luminous, amount, angle, bit. */
export function dimOfUnit(unit: string): Dim {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const u = math.unit(unit) as any;
  const d: number[] = u.dimensions;
  return [d[0], d[1], d[2], d[3], d[4], d[6], d[5]] as unknown as Dim;
}

export function countSigFigs(raw: string): number | null {
  const m = /^[+-]?(\d*\.?\d*)(?:[eE][+-]?\d+)?$/.exec(raw.trim());
  if (!m || !m[1] || m[1] === '.') return null;
  const digits = m[1].replace('.', '').replace(/^0+/, '');
  if (!digits) return 1;
  // "1200" is ambiguous, so trailing zeros count only after a decimal point.
  return m[1].includes('.') ? digits.length : digits.replace(/0+$/, '').length || 1;
}

function readNumber(raw: string): number | null {
  const direct = Number(raw);
  if (raw.trim() !== '' && Number.isFinite(direct)) return direct;
  try {
    const v = evaluate(parseExpr(raw), {});
    return Number.isFinite(v) ? v : null;
  } catch (err) {
    if (err instanceof ExprError) return null;
    throw err;
  }
}

function describeUnits(calcUnit: string, alt: string[]): string {
  return [calcUnit, ...alt].slice(0, 3).join(', ');
}

/**
 * Reads what was typed into a value box. It may be a number (with the unit chosen
 * in the list), a small sum such as 2*pi, or a value with its own unit such as "5 cm".
 */
export function parseInput(raw: string, chosenUnit: string, calcUnit: string, alt: string[], dim: string): ParsedInput {
  const text = raw.trim();
  const fail = (problem: string): ParsedInput => ({ ok: false, value: NaN, sigFigs: null, fromUnit: null, entered: NaN, problem });
  if (!text) return fail('Enter a value.');

  const expected = parseDim(dim);
  let entered: number | null = readNumber(text);
  let unit = chosenUnit;
  let sigFigs = countSigFigs(text);

  if (entered === null) {
    const m = /^(.*?[\d.)])\s*([A-Za-zμΩ°][\w/^*().-]*)$/.exec(text);
    if (!m) return fail(`Could not read "${text}" as a number. Try something like 2.5 or 3e8.`);
    entered = readNumber(m[1]);
    if (entered === null) return fail(`Could not read "${m[1]}" as a number.`);
    unit = m[2].replace(/°C/, 'degC').replace(/°/, 'deg').replace(/Ω/, 'ohm').replace(/μ/, 'u');
    sigFigs = countSigFigs(m[1]);
    let actual: Dim;
    try {
      actual = dimOfUnit(unit);
    } catch {
      return fail(`"${m[2]}" is not a unit I recognise.`);
    }
    if (!calcUnit) {
      return fail(`This quantity has no units, but you entered ${m[2]}, which measures ${formatDim(actual)}.`);
    }
    if (!sameDim(actual, expected)) {
      return fail(`${m[2]} measures ${formatDim(actual)}, but this needs ${formatDim(expected)}, such as ${describeUnits(calcUnit, alt)}.`);
    }
  }

  if (!calcUnit) return { ok: true, value: entered, sigFigs, fromUnit: null, entered };
  if (unit === calcUnit) return { ok: true, value: entered, sigFigs, fromUnit: null, entered };
  try {
    const value = math.unit(entered, unit).toNumber(calcUnit);
    return { ok: true, value, sigFigs, fromUnit: unit, entered };
  } catch {
    return fail(`Could not convert ${unit} to ${calcUnit}.`);
  }
}

export function convertResult(value: number, fromUnit: string, toUnit: string): number {
  if (!fromUnit || fromUnit === toUnit) return value;
  return math.unit(value, fromUnit).toNumber(toUnit);
}

export interface Formatted {
  text: string;
  tex: string;
}

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };

/** Formats to `sf` significant figures, in scientific notation when very large or small. */
export function formatNumber(value: number, sf: number): Formatted {
  if (value === 0) return { text: '0', tex: '0' };
  const abs = Math.abs(value);
  if (abs >= 1e5 || abs < 1e-3) {
    const [mantissa, exponent] = value.toExponential(Math.max(sf - 1, 0)).split('e');
    const exp = Number(exponent);
    return {
      text: `${mantissa} × 10${[...String(exp)].map((c) => SUP[c]).join('')}`,
      tex: `${mantissa}\\times10^{${exp}}`,
    };
  }
  const fixed = value.toPrecision(sf);
  const plain = fixed.includes('e') ? String(Number(fixed)) : fixed;
  return { text: plain, tex: plain };
}

/** The answer's significant figures: the fewest in the inputs, but kept useful. */
export function resultSigFigs(inputs: (number | null)[]): number {
  const known = inputs.filter((n): n is number => n !== null);
  const least = known.length ? Math.min(...known) : 3;
  return Math.min(Math.max(least, 3), 5);
}
