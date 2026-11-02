// The rule for Computer Science: code is written as Java, and maths markup is allowed only where
// the syllabus uses that notation itself. Used by the data step and by tests/unit/cs-notation.test.ts.

/** Takes out O(...), including anything nested inside it. */
function withoutBigO(tex) {
  let out = '';
  for (let i = 0; i < tex.length; i++) {
    if (/^(?:O|\\Theta|\\Omega)\(/.test(tex.slice(i))) {
      let depth = 0;
      let j = tex.indexOf('(', i);
      for (; j < tex.length; j++) {
        if (tex[j] === '(') depth++;
        if (tex[j] === ')' && --depth === 0) break;
      }
      i = j;
      out += ' ';
    } else out += tex[i];
  }
  return out;
}

const ALWAYS_BANNED = [
  [/\\[dt]?frac\b/, 'a fraction'],
  [/\\sqrt\b/, 'a root'],
  [/\\lfloor|\\lceil/, 'floor or ceiling brackets'],
  [/\\begin\{(?:cases|vmatrix|pmatrix)\}/, 'a cases or matrix block'],
  [/\\texttt|\\mathtt/, 'code inside LaTeX'],
  [/\\underbrace|\\xrightarrow/, 'a layout macro'],
  [/\\sum_|\\prod_/, 'a sum with limits'],
  [/\\log\b|\\ln\b|\\gcd\b/, 'a logarithm or gcd'],
];

/** What may appear as LaTeX. Returns what is wrong with this piece, if anything. */
export function lintTex(tex, unitKey) {
  const out = [];
  const rest = withoutBigO(tex);
  for (const [pattern, what] of ALWAYS_BANNED) if (pattern.test(rest)) out.push(`${what}: ${tex}`);
  const notationUnit = /^(?:XI 3|XII 1|XII 2|XII 9)\b/.test(unitKey);
  if (!notationUnit) {
    out.push(`LaTeX outside Boolean or complexity notation: ${tex}`);
    return out;
  }
  // Counting truth-table rows and K-map cells: 2^{n} is the syllabus's own way to write it.
  const noRows = rest.replace(/2\^\{2\^\{n\}\}|2\^\{[nk](?:-k)?\}/g, ' ');
  if (/\^/.test(noRows) && !/^XII 9\b/.test(unitKey)) out.push(`a superscript: ${tex}`);
  return out;
}

/** Plain text in a name or note: no LaTeX commands, and no ^ used as a power. */
export function lintWords(text) {
  const out = [];
  if (/\\[a-zA-Z]+/.test(text)) out.push(`a LaTeX command: ${text}`);
  // ^ means XOR in Java, so outside O(...) it is only allowed where the text says it is XOR.
  const rest = withoutBigO(text);
  if (/[A-Za-z0-9)]\^[A-Za-z0-9(-]/.test(rest) && !/XOR/.test(text)) out.push(`^ as a power: ${text}`);
  return out;
}

/** Splits a body into its parts: words, `code` and $notation$. */
export function bodySegments(body) {
  return body.split('\n').map((line) =>
    line
      .split(/(`[^`]*`|\$[^$]*\$)/)
      .filter(Boolean)
      .map((part) => {
        if (part.startsWith('`')) return { kind: 'code', text: part.slice(1, -1) };
        if (part.startsWith('$')) return { kind: 'tex', text: part.slice(1, -1) };
        return { kind: 'text', text: part };
      }),
  );
}

export function lintEntry(entry, unitKey) {
  const out = [...lintWords(entry.name), ...(entry.note ? lintWords(entry.note) : [])];
  if (entry.body) {
    const ticks = (entry.body.match(/`/g) ?? []).length;
    if (ticks % 2) out.push(`an unclosed backtick: ${entry.body}`);
    if (/``/.test(entry.body)) out.push(`two pieces of code run together: ${entry.body}`);
    for (const line of bodySegments(entry.body)) {
      for (const seg of line) {
        if (seg.kind === 'tex') out.push(...lintTex(seg.text, unitKey));
        if (seg.kind === 'text') {
          out.push(...lintWords(seg.text));
          if (/[\\{}_^]/.test(seg.text)) out.push(`markup in the words: ${seg.text}`);
          // Java can't say a = b in words: code goes in code, and a sentence says "is".
          if (/[^=!<>]=[^=]/.test(seg.text)) out.push(`an = outside code: ${seg.text}`);
        }
      }
    }
  } else {
    out.push(...lintTex(entry.latex, unitKey));
  }
  return out;
}
