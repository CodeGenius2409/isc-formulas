// LaTeX normalisation used by the dedupe pass. Everything here only affects
// comparison keys: the stored LaTeX of each formula is never rewritten.

/** Drops spacing and presentation macros so equal formulas compare equal. */
export function normalizeLatex(src) {
  let s = String(src);
  s = s.replace(/\\(?:left|right|big|Big|bigg|Bigg|displaystyle|textstyle|limits)\b/g, '');
  s = s.replace(/\\(?:quad|qquad|,|;|:|!|\s)/g, ' ');
  s = s.replace(/\\(?:dfrac|tfrac)\b/g, '\\frac');
  s = s.replace(/\\(?:mathrm|textrm|mathit|textit|mathbf|textbf|operatorname|texttt)\b/g, '\\text');
  s = s.replace(/\\varepsilon\b/g, '\\epsilon').replace(/\\varphi\b/g, '\\phi').replace(/\\vartheta\b/g, '\\theta');
  s = s.replace(/\\ell\b/g, 'l');
  s = s.replace(/\\(?:rightarrow|longrightarrow|to)\b/g, '\\to');
  s = s.replace(/\\mid\b/g, '|').replace(/\\cdots\b|\\ldots\b|\\dots\b/g, '...');
  s = s.replace(/\\csc\b/g, '\\text{cosec}');
  s = s.replace(/\\ne\b/g, '\\neq').replace(/\\le\b/g, '\\leq').replace(/\\ge\b/g, '\\geq');
  // \cdot and \times only mean the same thing for numbers. On vectors one is the
  // dot product and the other the cross product, so they must stay distinct.
  if (!/\\(?:vec|hat|overrightarrow)\b/.test(s)) s = s.replace(/\\(?:cdot|times)\b/g, '*');
  s = s.replace(/\s+/g, '');
  // ^{2} -> ^2, _{x} -> _x. Run twice so nested single-token groups collapse.
  for (let i = 0; i < 2; i++) s = s.replace(/([_^])\{(\\?[A-Za-z0-9]+)\}/g, '$1$2');
  s = s.replace(/\\frac(\d)(\d)/g, '\\frac{$1}{$2}');
  s = s.replace(/\\frac\{([^{}]+)\}([A-Za-z0-9])/g, '\\frac{$1}{$2}');
  s = s.replace(/\\frac([A-Za-z0-9])\{/g, '\\frac{$1}{');
  s = s.replace(/\\text\{([^{}]*)\}/g, (_, t) => t.replace(/\s+/g, ''));
  return s.replace(/[,;.]+$/, '');
}

/** Splits on top-level `=` and sorts the sides, so a=b and b=a share a key. */
export function sideInsensitive(norm) {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const ch of norm) {
    if (ch === '{' || ch === '(' || ch === '[') depth++;
    if (ch === '}' || ch === ')' || ch === ']') depth--;
    if (ch === '=' && depth === 0) {
      parts.push(cur);
      cur = '';
    } else cur += ch;
  }
  parts.push(cur);
  return parts.sort().join('=');
}

const GREEK = new Set(
  ['alpha', 'beta', 'gamma', 'delta', 'theta', 'lambda', 'mu', 'nu', 'rho', 'sigma', 'tau', 'phi', 'omega', 'Delta', 'epsilon', 'kappa', 'eta'].map((g) => `\\${g}`),
);

/** Renames variables by first appearance, so A^2+B^2 and a^2+b^2 share a key. */
export function skeleton(norm) {
  const map = new Map();
  return norm.replace(/\\[A-Za-z]+|[A-Za-z]/g, (tok) => {
    if (tok.startsWith('\\') && !GREEK.has(tok)) return tok;
    const key = tok.toLowerCase();
    if (!map.has(key)) map.set(key, `#${map.size}`);
    return map.get(key);
  });
}

const STOP = new Set(['of', 'the', 'a', 'an', 'in', 'on', 'for', 'and', 'to', 'from', 'by', 'at', 'with', 'is', 'as', 'or', 'its', 'two', 'law', 'formula', 'form', 'relation', 'equation', 'rule', 'theorem']);

export function nameTokens(name) {
  return new Set(
    String(name)
      .toLowerCase()
      .replace(/[’']s\b/g, '')
      .replace(/[^a-z0-9αβγδθλμνρστφω⁻¹²³ⁿ]+/g, ' ')
      .split(/\s+/)
      .filter((t) => t && !STOP.has(t))
      .map((t) => t.replace(/(?<=[a-z]{3})(s|es)$/, '')),
  );
}

export function jaccard(a, b) {
  if (!a.size && !b.size) return 1;
  let hit = 0;
  for (const t of a) if (b.has(t)) hit++;
  return hit / (a.size + b.size - hit);
}
