// The solver: takes a registry entry, a chosen unknown and the known values, and
// produces worked steps in the order a student would write them.
import { evaluate, parseEquation, sub, substitute, sym, tidy, type Equation, type Expr } from './expr';
import { numericRoots, rearrange } from './rearrange';
import { numberTex, symbolTex, toTex, unitTex } from './tex';
import type { ResolvedEntry, ResolvedVar } from './types';
import { convertResult, formatNumber, parseInput, resultSigFigs } from './units';

export interface SolveInput {
  raw: string;
  unit: string;
}

export interface Step {
  label: string;
  /** LaTeX lines. */
  math: string[];
  note?: string;
}

export interface Root {
  /** Value in the calculation unit. */
  value: number;
  /** In the display unit. */
  shown: number;
  unit: string;
  text: string;
  tex: string;
  /** Why this root doesn't apply, if it doesn't. */
  rejected?: string;
}

export interface SolveOutcome {
  ok: boolean;
  steps: Step[];
  roots: Root[];
  /** Roots that were rejected as unphysical are in `roots` with `rejected` set. */
  message?: string;
  /** Problems with individual inputs, keyed by symbol. */
  inputProblems: Record<string, string>;
  method: 'explicit' | 'quadratic' | 'numeric' | null;
}

const emptyOutcome = (message: string, inputProblems: Record<string, string> = {}): SolveOutcome => ({ ok: false, steps: [], roots: [], message, inputProblems, method: null });

export function varTex(v: ResolvedVar): string {
  return v.tex ?? symbolTex(v.symbol);
}

export function entryTexOf(entry: ResolvedEntry): (name: string) => string {
  const map = new Map(entry.vars.map((v) => [v.symbol, varTex(v)]));
  return (name) => map.get(name) ?? symbolTex(name);
}

export function equationTex(entry: ResolvedEntry): string {
  const eq = parseEquation(entry.eq);
  const texOf = entryTexOf(entry);
  return `${toTex(eq.lhs, texOf)}=${toTex(eq.rhs, texOf)}`;
}

function checkRange(v: ResolvedVar, value: number): string | null {
  if (v.min !== undefined) {
    if (v.exclusiveMin ? value <= v.min : value < v.min) {
      if (v.min === 0) return v.exclusiveMin ? `${v.name} must be greater than 0` : `${v.name} cannot be negative`;
      return `${v.name} must be at least ${formatBound(v, v.min)}`;
    }
  }
  if (v.max !== undefined && value > v.max * (1 + 1e-12)) return `${v.name} cannot exceed ${formatBound(v, v.max)}`;
  if (v.integer && Math.abs(value - Math.round(value)) > 1e-9) return `${v.name} must be a whole number`;
  return null;
}

function formatBound(v: ResolvedVar, bound: number): string {
  if (v.show === 'deg') return `${Number(((bound * 180) / Math.PI).toFixed(2))}°`;
  return `${bound}${v.unit ? ` ${v.unit}` : ''}`;
}

/** A substituted value, printed with its unit: (5 m/s). */
function literal(v: ResolvedVar, value: number, display: { value: number; unit: string } | null): Expr {
  let tex: string;
  if (display) {
    tex = `${numberTex(display.value)}${display.unit === 'deg' ? '^{\\circ}' : `\\,${unitTex(display.unit)}`}`;
    return { k: 'lit', v: value, tex: `\\left(${tex}\\right)` };
  }
  tex = numberTex(value);
  if (v.unit) return { k: 'lit', v: value, tex: `\\left(${tex}\\,${unitTex(v.unit)}\\right)` };
  return { k: 'lit', v: value, tex: value < 0 ? `\\left(${tex}\\right)` : tex };
}

function eqLine(eq: Equation, texOf: (n: string) => string): string {
  return `${toTex(eq.lhs, texOf)}=${toTex(eq.rhs, texOf)}`;
}

function isClose(a: number, b: number): boolean {
  return Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b), 1e-300);
}

export interface ChosenUnits {
  /** Show the result in this unit, instead of the default. */
  resultUnit?: string;
  /** Show the value in full rather than to measured precision, as mathematics expects: 2048, not 2050. */
  exact?: boolean;
}

export function solve(entry: ResolvedEntry, unknown: string, inputs: Record<string, SolveInput>, options: ChosenUnits = {}): SolveOutcome {
  const target = entry.vars.find((v) => v.symbol === unknown);
  if (!target) return emptyOutcome(`${unknown} is not in this formula.`);

  const env: Record<string, number> = {};
  const lits: Record<string, Expr> = {};
  const inputProblems: Record<string, string> = {};
  const sigs: (number | null)[] = [];
  const conversions: string[] = [];

  for (const v of entry.vars) {
    if (v.symbol === unknown) continue;
    const input = inputs[v.symbol];
    const parsed = parseInput(input?.raw ?? '', input?.unit ?? v.unit, v.unit, v.alt, v.dim);
    if (!parsed.ok) {
      inputProblems[v.symbol] = parsed.problem ?? 'Enter a value.';
      continue;
    }
    const rangeProblem = checkRange(v, parsed.value);
    if (rangeProblem) {
      inputProblems[v.symbol] = rangeProblem.charAt(0).toUpperCase() + rangeProblem.slice(1) + '.';
      continue;
    }
    env[v.symbol] = parsed.value;
    if (!v.isConstant && v.value === undefined) sigs.push(parsed.sigFigs);
    const display = parsed.fromUnit === 'deg' ? { value: parsed.entered, unit: 'deg' } : null;
    lits[v.symbol] = literal(v, parsed.value, display);
    if (parsed.fromUnit && parsed.fromUnit !== 'deg') {
      conversions.push(`${varTex(v)}=${numberTex(parsed.entered)}\\,${unitTex(parsed.fromUnit)}=${numberTex(parsed.value)}\\,${unitTex(v.unit)}`);
    }
  }
  if (Object.keys(inputProblems).length) {
    return emptyOutcome('Fix the highlighted values first.', inputProblems);
  }

  const eq = parseEquation(entry.eq);
  const texOf = entryTexOf(entry);
  const steps: Step[] = [{ label: 'Formula', math: [eqLine(eq, texOf)] }];
  if (conversions.length) steps.push({ label: 'Convert to the units the formula uses', math: conversions });

  const sf = resultSigFigs(sigs);
  const plan = rearrange(eq, unknown, env);
  const x = varTex(target);
  const candidates: number[] = [];

  if (plan.kind === 'explicit') {
    const lines = plan.lines.slice(1);
    const last = plan.solutions[0];
    if (lines.length === 0 || !(lines[lines.length - 1].lhs.k === 'sym')) lines.push({ lhs: sym(unknown), rhs: last });
    if (plan.lines.length > 1 || plan.lines[0].lhs.k !== 'sym' || (plan.lines[0].lhs as { n: string }).n !== unknown) {
      const shownLines = lines.slice(-4).map((l) => eqLine({ lhs: l.lhs, rhs: tidy(l.rhs) }, texOf));
      if (plan.plusMinus) {
        shownLines[shownLines.length - 1] = `${x}=\\pm ${toTex(plan.solutions[0], texOf)}`;
      }
      steps.push({ label: `Rearrange for ${target.name}`, math: shownLines, note: plan.solutions.length > 1 && !plan.plusMinus ? 'This has more than one solution, so each is checked below.' : undefined });
    }
    const substituted = plan.solutions.map((s) => tidy(substitute(s, lits)));
    steps.push({ label: 'Substitute the values', math: substituted.slice(0, plan.plusMinus ? 1 : 2).map((s) => `${x}=${plan.plusMinus ? '\\pm ' : ''}${toTex(s)}`) });
    for (const s of plan.solutions) {
      try {
        candidates.push(evaluate(s, env));
      } catch {
        candidates.push(NaN);
      }
    }
  } else if (plan.kind === 'quadratic' && plan.quadratic) {
    const { a, b, c } = plan.quadratic;
    const av = evaluate(a, env);
    const bv = evaluate(b, env);
    const cv = evaluate(c, env);
    steps.push({
      label: `This is a quadratic in ${target.name}`,
      math: [`a\\,${x}^{2}+b\\,${x}+c=0`, `a=${toTex(a, texOf)},\\quad b=${toTex(b, texOf)},\\quad c=${toTex(c, texOf)}`],
    });
    const D = bv * bv - 4 * av * cv;
    steps.push({
      label: 'Substitute the values',
      math: [`a=${numberTex(av)},\\quad b=${numberTex(bv)},\\quad c=${numberTex(cv)}`, `b^{2}-4ac=${numberTex(D)}`],
    });
    if (D < 0) {
      return { ok: false, steps, roots: [], method: 'quadratic', inputProblems: {}, message: 'The discriminant is negative, so there is no real solution for these values.' };
    }
    const root = Math.sqrt(D);
    steps.push({ label: 'Use the quadratic formula', math: [`${x}=\\dfrac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}=\\dfrac{${numberTex(-bv)}\\pm${numberTex(root)}}{${numberTex(2 * av)}}`] });
    candidates.push((-bv + root) / (2 * av), (-bv - root) / (2 * av));
  } else {
    steps.push({ label: `Solve numerically for ${target.name}`, math: [eqLine(eq, texOf)], note: 'This cannot be rearranged into a simple form, so the value was found by a numeric search.' });
    const range: [number, number] | undefined = target.max !== undefined && target.min !== undefined ? [target.min, target.max] : undefined;
    candidates.push(...numericRoots(sub(eq.lhs, eq.rhs), unknown, env, range));
  }

  const roots = buildRoots(eq, target, candidates, env, sf, options.resultUnit, options.exact);
  const valid = roots.filter((r) => !r.rejected);
  const displayUnit = roots[0]?.unit ?? '';

  if (!roots.length) {
    return {
      ok: false,
      steps,
      roots,
      method: plan.kind,
      inputProblems: {},
      message: plan.kind === 'numeric' ? 'No real solution was found for these values.' : noSolutionMessage(entry, env, candidates),
    };
  }

  const resultLine = (r: Root) => `${x}=${r.tex}${unitPart(displayUnit)}`;
  if (valid.length) {
    steps.push({
      label: valid.length > 1 ? 'Answers' : 'Answer',
      math: valid.map(resultLine),
      note: options.exact ? undefined : `To ${sf} significant figures.`,
    });
  }
  for (const r of roots.filter((root) => root.rejected)) {
    steps.push({ label: 'Rejected', math: [resultLine(r)], note: r.rejected });
  }

  if (!valid.length) {
    return { ok: false, steps, roots, method: plan.kind, inputProblems: {}, message: 'The only solutions do not make physical sense for these values.' };
  }
  return { ok: true, steps, roots, method: plan.kind, inputProblems: {} };
}

function unitPart(unit: string): string {
  if (!unit) return '';
  if (unit === 'deg') return '^{\\circ}';
  return `\\,${unitTex(unit)}`;
}

function noSolutionMessage(entry: ResolvedEntry, env: Record<string, number>, candidates: number[]): string {
  // An infinite result means division by zero. NaN means no real value exists.
  if (candidates.some((v) => v === Infinity || v === -Infinity)) {
    const zero = entry.vars.filter((v) => env[v.symbol] === 0).map((v) => v.name);
    return zero.length ? `This divides by zero. Check ${zero.join(', ')}, which is 0 here.` : 'This divides by zero for these values.';
  }
  return 'These values have no real solution, for example a square root of a negative number or a sine above 1.';
}

function buildRoots(eq: Equation, target: ResolvedVar, candidates: number[], env: Record<string, number>, sf: number, resultUnit: string | undefined, exact = false): Root[] {
  const roots: Root[] = [];
  const residual = sub(eq.lhs, eq.rhs);
  for (const value of candidates) {
    if (!Number.isFinite(value)) continue;
    if (roots.some((r) => isClose(r.value, value))) continue;
    // Squaring or a trig inverse can introduce false solutions. Check in the original.
    const scope = { ...env, [target.symbol]: value };
    let error = Infinity;
    let scale = 1;
    try {
      error = Math.abs(evaluate(residual, scope));
      scale = Math.abs(evaluate(eq.lhs, scope)) + Math.abs(evaluate(eq.rhs, scope));
    } catch {
      continue;
    }
    if (!Number.isFinite(error) || error > 1e-6 * Math.max(scale, 1e-300)) continue;

    const unit = resultUnit ?? target.show ?? target.unit;
    const shown = convertResult(value, target.unit, unit);
    const whole = String(Number(shown.toPrecision(6)));
    const formatted = target.integer && Math.abs(value - Math.round(value)) < 1e-9 ? { text: String(Math.round(value)), tex: String(Math.round(value)) } : exact && Math.abs(shown) < 1e6 ? { text: whole, tex: whole } : formatNumber(shown, sf);
    const problem = checkRange(target, value);
    roots.push({ value, shown, unit, ...formatted, rejected: problem ? `${problem.charAt(0).toUpperCase()}${problem.slice(1)}.` : undefined });
  }
  return roots.sort((a, b) => Number(Boolean(a.rejected)) - Number(Boolean(b.rejected)));
}

/** The variable a formula most naturally solves for. */
export function defaultUnknown(entry: ResolvedEntry): string {
  if (entry.ask) return entry.ask;
  const eq = parseEquation(entry.eq);
  if (eq.lhs.k === 'sym') return eq.lhs.n;
  return entry.vars.find((v) => !v.isConstant)?.symbol ?? entry.vars[0].symbol;
}
