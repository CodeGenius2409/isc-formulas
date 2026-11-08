// Prints expressions as LaTeX for the worked steps.
import type { Expr } from './expr';

const GREEK = new Set(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'varepsilon', 'zeta', 'eta', 'theta', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'varphi', 'chi', 'psi', 'omega', 'Gamma', 'Delta', 'Theta', 'Lambda', 'Sigma', 'Phi', 'Psi', 'Omega']);

function part(text: string): string {
  if (GREEK.has(text)) return `\\${text}`;
  return text.length > 1 && !/^\d+$/.test(text) ? `\\mathrm{${text}}` : text;
}

/** `m_1` prints as m₁, `theta` as θ, `DeltaT` as ΔT, `v_rms` with an upright subscript. */
export function symbolTex(name: string): string {
  const [base, ...rest] = name.split('_');
  let head: string;
  if (base.startsWith('Delta') && base.length > 5) head = `\\Delta ${part(base.slice(5))}`;
  else if (base.endsWith('prime')) head = `${part(base.slice(0, -5))}'`;
  else head = part(base);
  return rest.length ? `${head}_{${rest.map(part).join(',')}}` : head;
}

const PRECEDENCE = { add: 1, sub: 1, neg: 2, mul: 3, div: 3, pow: 5, fn: 6, num: 7, sym: 7, lit: 7 } as const;

const FN_TEX: Record<string, string> = {
  sin: '\\sin',
  cos: '\\cos',
  tan: '\\tan',
  cot: '\\cot',
  sec: '\\sec',
  csc: '\\operatorname{cosec}',
  cosec: '\\operatorname{cosec}',
  asin: '\\sin^{-1}',
  acos: '\\cos^{-1}',
  atan: '\\tan^{-1}',
  sinh: '\\sinh',
  cosh: '\\cosh',
  tanh: '\\tanh',
  log: '\\ln',
  ln: '\\ln',
  log10: '\\log_{10}',
  log2: '\\log_{2}',
};

function parens(tex: string): string {
  return `\\left(${tex}\\right)`;
}

export function numberTex(v: number): string {
  if (Number.isInteger(v) && Math.abs(v) < 1e7) return String(v);
  const abs = Math.abs(v);
  if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) {
    const [mantissa, exponent] = v.toExponential(4).split('e');
    return `${String(Number(mantissa))}\\times10^{${Number(exponent)}}`;
  }
  return String(Number(v.toPrecision(10)));
}

/** a − −b needs brackets: a − (−b). */
function noLeadingMinus(tex: string): string {
  return tex.startsWith('-') ? parens(tex) : tex;
}

function wrap(child: Expr, parent: number, texOf: (n: string) => string, strict = false): string {
  const tex = toTex(child, texOf);
  const p = child.k === 'num' && child.v < 0 ? PRECEDENCE.neg : PRECEDENCE[child.k];
  return p < parent || (strict && p === parent) ? parens(tex) : tex;
}

/** Does this factor need an explicit × to stay readable after another factor? */
function needsTimes(left: Expr, right: Expr): boolean {
  const leadsWithNumber = (e: Expr): boolean => {
    if (e.k === 'num' || e.k === 'neg') return true;
    if (e.k === 'lit') return false;
    if (e.k === 'mul' || e.k === 'pow') return leadsWithNumber(e.a);
    return false;
  };
  void left;
  return leadsWithNumber(right);
}

export function toTex(e: Expr, texOf: (n: string) => string = symbolTex): string {
  switch (e.k) {
    case 'num':
      return numberTex(e.v);
    case 'sym':
      return e.n === 'pi' ? '\\pi' : texOf(e.n);
    case 'lit':
      return e.tex;
    case 'neg':
      return `-${wrap(e.a, PRECEDENCE.neg, texOf)}`;
    case 'add':
      return `${wrap(e.a, 1, texOf)}+${noLeadingMinus(wrap(e.b, 1, texOf))}`;
    case 'sub':
      return `${wrap(e.a, 1, texOf)}-${noLeadingMinus(wrap(e.b, 1, texOf, true))}`;
    case 'mul': {
      const a = e.a.k === 'neg' ? `-${wrap(e.a.a, PRECEDENCE.mul, texOf)}` : wrap(e.a, PRECEDENCE.mul, texOf);
      const b = wrap(e.b, PRECEDENCE.mul, texOf);
      return needsTimes(e.a, e.b) ? `${a}\\times ${b}` : `${a}\\,${b}`;
    }
    case 'div':
      return `\\frac{${toTex(e.a, texOf)}}{${toTex(e.b, texOf)}}`;
    case 'pow': {
      let base = e.a.k === 'fn' && e.a.f !== 'sqrt' && e.a.f !== 'abs' ? parens(toTex(e.a, texOf)) : wrap(e.a, PRECEDENCE.pow, texOf, true);
      // A value such as 8×10⁻⁵, or a negative one, needs brackets before its own power.
      if (/\^|\\times|^-/.test(base) && !base.startsWith('\\left(')) base = parens(base);
      return `${base}^{${toTex(e.b, texOf)}}`;
    }
    case 'fn': {
      const args = e.args.map((x) => toTex(x, texOf));
      if (e.f === 'sqrt') return `\\sqrt{${args[0]}}`;
      if (e.f === 'cbrt') return `\\sqrt[3]{${args[0]}}`;
      if (e.f === 'abs') return `\\left|${args[0]}\\right|`;
      if (e.f === 'exp') return `e^{${args[0]}}`;
      if (FN_TEX[e.f]) {
        // A substituted value already carries its own brackets.
        const simple = e.args[0].k === 'sym' || e.args[0].k === 'num' || (e.args[0].k === 'lit' && e.args[0].tex.startsWith('\\left('));
        return simple ? `${FN_TEX[e.f]} ${args[0]}` : `${FN_TEX[e.f]}${parens(args[0])}`;
      }
      return `\\operatorname{${e.f}}${parens(args.join(','))}`;
    }
  }
}

/** Turns a unit such as `J/(mol*K)` or `m/s^2` into upright LaTeX. */
export function unitTex(unit: string): string {
  if (!unit) return '';
  const body = unit
    .replace(/\*/g, '\\,')
    .replace(/\^(-?\d+)/g, '^{$1}')
    .replace(/degC/g, '^{\\circ}C')
    .replace(/\bdeg\b/g, '^{\\circ}')
    .replace(/angstrom/g, '\\mathring{A}')
    .replace(/hour/g, 'h')
    .replace(/ohm/g, '\\Omega');
  return `\\mathrm{${body}}`;
}
