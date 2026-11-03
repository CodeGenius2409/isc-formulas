// Reads what is typed into the plotter: ordinary functions in the way a student writes them, plus
// d/dx(...) and integrals. Errors say what is wrong, in words, for showing beside the box.
import { contains, evaluate, ExprError, parseExpr, substitute, symbolsIn, type Expr } from '../../solver/expr';
import { symbolTex, toTex } from '../../solver/tex';
import { derivative as numericDerivative } from './calculus';
import { cumulativeIntegral, definiteIntegral, type DefiniteResult } from './calculus';
import { antiderivative, differentiate } from './symbolic';

type Fn = (x: number) => number;

const FUNCTION_NAMES = 'asin|acos|atan|sinh|cosh|tanh|sin|cos|tan|cot|sec|csc|cosec|exp|ln|log10|log2|log|sqrt|cbrt|abs|floor|ceil|round|sign';

function matchingClose(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '(') depth++;
    else if (text[i] === ')' && --depth === 0) return i;
  }
  return -1;
}

/** |u| becomes abs(u). A bar opens where a value can start, and closes anywhere else. */
function barsToAbs(text: string): string {
  let out = '';
  let open = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== '|') {
      out += text[i];
      continue;
    }
    const before = out.trimEnd().at(-1);
    const opens = open === 0 || before === undefined || '+-*/^(,'.includes(before);
    if (opens) {
      out += 'abs(';
      open++;
    } else {
      out += ')';
      open--;
    }
  }
  if (open > 0) throw new ExprError('A | is missing: each |x| needs a bar on both sides.');
  return out;
}

/** Turns the way students write maths into what the parser reads. */
export function normalise(source: string): string {
  let text = source
    .replace(/[−–]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/θ|\btheta\b/g, 'x')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/(sin|cos|tan)⁻¹/g, 'a$1')
    .replace(/(sin|cos|tan)\^\(?-1\)?/g, 'a$1')
    .replace(/√\s*\(/g, 'sqrt(')
    .replace(/√\s*([\d.]*[a-z]*)/g, 'sqrt($1)')
    .replace(/^\s*(?:y|f\s*\(\s*x\s*\))\s*=/, '');
  text = barsToAbs(text);
  // sin^2(x) is (sin(x))^2, and sin^2 x is the same.
  text = text.replace(new RegExp(`\\b(${FUNCTION_NAMES})\\s+(\\d*\\.?\\d*(?:x|pi|e)\\b(?:\\^\\d+)?)`, 'g'), '$1($2)');
  for (let guard = 0; guard < 8; guard++) {
    const m = new RegExp(`\\b(${FUNCTION_NAMES})\\^(\\d+)\\s*(?=\\()`).exec(text);
    if (!m) break;
    const open = m.index + m[0].length;
    const close = matchingClose(text, open);
    if (close < 0) break;
    text = `${text.slice(0, m.index)}(${m[1]}${text.slice(open, close + 1)})^${m[2]}${text.slice(close + 1)}`;
  }
  // xsin(x) and x(x + 1) are products, not names.
  text = text.replace(new RegExp(`\\b(\\d*\\.?\\d*)x(?=(?:${FUNCTION_NAMES})\\s*\\()`, 'g'), '$1x*');
  text = text.replace(/\b(x|pi|e)\s*\(/g, '$1*(');
  return text.trim();
}

/** What is wrong, in words, before the parser gets to complain in its own. */
function explainProblem(text: string): string | null {
  let depth = 0;
  for (const ch of text) {
    if (ch === '(') depth++;
    if (ch === ')' && --depth < 0) return 'There is a ) with no ( before it.';
  }
  if (depth > 0) return depth === 1 ? 'A closing bracket ) is missing.' : `${depth} closing brackets ) are missing.`;
  const end = /([+\-*/^])\s*$/.exec(text);
  if (end) return `Something is missing after the ${end[1]} at the end.`;
  if (/^\s*[*/^]/.test(text)) return `Something is missing before the ${text.trim()[0]} at the start.`;
  const doubled = /([*/^+])\s*([*/^])/.exec(text);
  if (doubled) return `"${doubled[1]}${doubled[2]}" has two operators in a row.`;
  if (/\(\s*\)/.test(text)) return 'There is an empty pair of brackets.';
  if (/∞/.test(text)) return 'Use ∞ only as a limit of an integral.';
  if (/∫|d\/dx/.test(text)) return 'Write d/dx and ∫ at the start of the line, with nothing before them.';
  return null;
}

function friendly(message: string, shown: string): string {
  const position = /\(char (\d+)\)/.exec(message);
  if (/Unexpected end/i.test(message) || /Value expected/i.test(message)) return position ? `Something is missing near character ${position[1]} of "${shown}".` : `Something is missing in "${shown}".`;
  if (/Unexpected operator|Syntax error/i.test(message)) return position ? `This can't be read near character ${position[1]} of "${shown}".` : `"${shown}" can't be read.`;
  return `"${shown}" can't be read.`;
}

/** An expression in x, with earlier lines available as f1, f2 and so on. */
function readExpr(source: string, known: Record<string, Expr | null>, ownName: string): Expr {
  const shown = source.trim();
  if (!shown) throw new ExprError('There is nothing here to plot yet.');
  const text = normalise(shown).replace(/\b(f\d)\s*\(\s*x\s*\)/g, '$1').replace(/\bf\b(?!\d)/g, 'f1');
  const problem = explainProblem(text);
  if (problem) throw new ExprError(problem);
  let expr: Expr;
  try {
    expr = parseExpr(text);
  } catch (err) {
    const message = (err as Error).message;
    throw new ExprError(/function "/.test(message) ? message.replace('The function', 'I don\'t know the function').replace(' is not recognised', '') : friendly(message, shown));
  }
  const map: Record<string, Expr> = {};
  for (const name of symbolsIn(expr)) {
    if (name === 'x' || name === 'e') continue;
    if (/^f\d$/.test(name)) {
      if (name === ownName) throw new ExprError(`${name} can't use itself.`);
      const other = known[name];
      if (other === undefined) throw new ExprError(`${name} isn't written above this line.`);
      if (other === null) throw new ExprError(`${name} has no formula to use here.`);
      map[name] = other;
      continue;
    }
    throw new ExprError(`"${name}" has no value. Use only x here.`);
  }
  return Object.keys(map).length ? substitute(expr, map) : expr;
}

const toFn = (e: Expr): Fn => (x) => {
  try {
    return evaluate(e, { x });
  } catch {
    return NaN;
  }
};

function readLimit(source: string, which: string): { value: number; tex: string } {
  const text = source.trim();
  if (/^\+?(∞|inf|infinity)$/i.test(text)) return { value: Infinity, tex: '\\infty' };
  if (/^(-|−)(∞|inf|infinity)$/i.test(text)) return { value: -Infinity, tex: '-\\infty' };
  let expr: Expr;
  try {
    expr = parseExpr(normalise(text));
  } catch {
    throw new ExprError(`The ${which} limit "${text}" can't be read.`);
  }
  if (contains(expr, 'x')) throw new ExprError(`The ${which} limit has to be a number, not depend on x.`);
  const value = toFn(expr)(0);
  if (!Number.isFinite(value)) throw new ExprError(`The ${which} limit "${text}" isn't a number.`);
  return { value, tex: toTex(expr) };
}

export type GraphLine =
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'plain'; expr: Expr; fn: Fn; tex: string }
  | { kind: 'derivative'; expr: Expr | null; fn: Fn; tex: string; symbolic: boolean; of: string }
  | { kind: 'definite'; expr: Expr; fn: Fn; tex: string; a: number; b: number; result: DefiniteResult }
  | { kind: 'indefinite'; expr: Expr | null; fn: Fn; tex: string; symbolic: boolean; from: number };

function closesAtEnd(text: string, open: number): boolean {
  return matchingClose(text, open) === text.length - 1;
}

/** A sum needs brackets before dx, or the dx reads as belonging to its last term. */
function integrandTex(expr: Expr, texOf: (n: string) => string): string {
  const tex = toTex(expr, texOf);
  return expr.k === 'add' || expr.k === 'sub' ? `\\left(${tex}\\right)` : tex;
}

/** Takes off a trailing dx. */
const withoutDx = (text: string) => text.replace(/\s*\*?\s*d[xθ]\s*$/, '').trim();

function readDerivative(body: string, known: Record<string, Expr | null>, name: string, texOf: (n: string) => string): GraphLine {
  const inner = readExpr(body, known, name);
  const innerFn = toFn(inner);
  const derived = differentiate(inner);
  if (derived) {
    return { kind: 'derivative', expr: derived, fn: toFn(derived), symbolic: true, of: body, tex: `\\frac{d}{dx}\\left(${toTex(inner, texOf)}\\right)=${toTex(derived, texOf)}` };
  }
  return { kind: 'derivative', expr: null, fn: (x) => numericDerivative(innerFn, x), symbolic: false, of: body, tex: `\\frac{d}{dx}\\left(${toTex(inner, texOf)}\\right)` };
}

function readDefinite(body: string, lo: string, hi: string, known: Record<string, Expr | null>, name: string, texOf: (n: string) => string): GraphLine {
  const expr = readExpr(withoutDx(body), known, name);
  const a = readLimit(lo, 'lower');
  const b = readLimit(hi, 'upper');
  const f = toFn(expr);
  const result = definiteIntegral(f, a.value, b.value);
  return { kind: 'definite', expr, fn: f, a: a.value, b: b.value, result, tex: `\\int_{${a.tex}}^{${b.tex}}${integrandTex(expr, texOf)}\\,dx` };
}

function readIndefinite(body: string, known: Record<string, Expr | null>, name: string, texOf: (n: string) => string): GraphLine {
  const expr = readExpr(withoutDx(body), known, name);
  const anti = antiderivative(expr);
  if (anti) return { kind: 'indefinite', expr: anti, fn: toFn(anti), symbolic: true, from: 0, tex: `\\int ${integrandTex(expr, texOf)}\\,dx=${toTex(anti, texOf)}+C` };
  const f = toFn(expr);
  // Numeric curves start from 0, or the nearest place the integrand exists.
  const from = [0, 1, -1, 0.5, 2, -2, 5, -5].find((x) => Number.isFinite(f(x))) ?? 0;
  return { kind: 'indefinite', expr: null, fn: cumulativeIntegral(f, from), symbolic: false, from, tex: `\\int ${integrandTex(expr, texOf)}\\,dx` };
}

/** Reads one line. `known` holds the lines above it, by name. */
export function readLine(source: string, name: string, known: Record<string, Expr | null> = {}): GraphLine {
  const text = source.trim();
  if (!text) return { kind: 'empty' };
  const texOf = /θ|\btheta\b/.test(text) ? (n: string) => (n === 'x' ? '\\theta' : symbolTex(n)) : symbolTex;
  try {
    let m = /^d\s*\/\s*d[xθ]\s*(.*)$/s.exec(text);
    if (m) {
      const rest = m[1].trim();
      if (!rest) throw new ExprError('Write what to differentiate after d/dx, as in d/dx(x^2).');
      return readDerivative(rest.startsWith('(') && closesAtEnd(rest, 0) ? rest.slice(1, -1) : rest, known, name, texOf);
    }
    m = /^(?:the\s+)?(?:derivative|differentiate)(?:\s+of)?\s+(.+)$/is.exec(text);
    if (m) return readDerivative(m[1], known, name, texOf);
    m = /^(f\d?)\s*'\s*(?:\(\s*x\s*\))?$/.exec(text);
    if (m) return readDerivative(m[1], known, name, texOf);

    m = /^(?:∫|int\b|integral(?:\s+of)?|integrate)\s*(.*)$/is.exec(text);
    if (m) {
      const rest = m[1].trim();
      if (!rest) throw new ExprError('Write what to integrate after ∫, as in ∫ from 0 to π of sin(x).');
      const words = /^from\s+(.+?)\s+to\s+(.+?)\s+of\s+(.+)$/is.exec(rest);
      if (words) return readDefinite(words[3], words[1], words[2], known, name, texOf);
      if (/^from\b/i.test(rest)) throw new ExprError('Write the limits as ∫ from 0 to π of sin(x).');
      const bracket = /^\[\s*(.+?)\s*,\s*(.+?)\s*\]\s*(.+)$/s.exec(rest);
      if (bracket) return readDefinite(bracket[3], bracket[1], bracket[2], known, name, texOf);
      return readIndefinite(rest.startsWith('(') && closesAtEnd(rest, 0) ? rest.slice(1, -1) : rest, known, name, texOf);
    }

    const expr = readExpr(text, known, name);
    return { kind: 'plain', expr, fn: toFn(expr), tex: toTex(expr, texOf) };
  } catch (err) {
    return { kind: 'error', message: err instanceof ExprError ? err.message : 'That expression can\'t be read.' };
  }
}

/** Reads every line in order, so that later lines can use earlier ones. */
export function readLines(sources: string[]): GraphLine[] {
  const known: Record<string, Expr | null> = {};
  return sources.map((source, i) => {
    const name = `f${i + 1}`;
    const line = readLine(source, name, known);
    known[name] = line.kind === 'plain' || line.kind === 'derivative' || line.kind === 'indefinite' || line.kind === 'definite' ? line.expr : null;
    return line;
  });
}

