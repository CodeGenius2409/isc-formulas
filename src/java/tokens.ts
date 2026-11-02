// A small Java tokeniser for code that is only read: the tracer's code pane and Computer Science
// entries. It adds no weight to those pages, while the editor loads CodeMirror only when it opens.
// tests/unit/java-tokens.test.ts holds the two to the same result on every sample.

export type TokenKind = 'keyword' | 'type' | 'string' | 'number' | 'comment' | 'op' | 'plain';

export interface Token {
  text: string;
  kind: TokenKind;
}

const KEYWORDS = new Set(
  (
    'abstract assert break case catch class continue default do else enum extends final finally for if implements import ' +
    'instanceof interface native new package private protected public return static strictfp super switch synchronized this ' +
    'throw throws transient try var void volatile while'
  ).split(' '),
);
const PRIMITIVES = new Set('boolean byte char double float int long short'.split(' '));
const LITERALS = new Set(['true', 'false', 'null']);

const PATTERN = new RegExp(
  [
    /(?<comment>\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))/,
    /(?<string>"""[\s\S]*?(?:"""|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)/,
    /(?<number>\b0[xX][\da-fA-F_]+[lL]?\b|\b0[bB][01_]+[lL]?\b|(?:\b\d[\d_]*\.?[\d_]*|\.\d[\d_]*)(?:[eE][+-]?\d+)?[fFdDlL]?\b)/,
    /(?<word>[A-Za-z_$][\w$]*)/,
    /(?<op>\+\+|--|<<=|>>>=|>>=|>>>|<<|>>|<=|>=|==|!=|&&|\|\||[-+*/%&|^]=|[-+*/%&|^!~<>=?])/,
  ]
    .map((r) => r.source)
    .join('|'),
  'g',
);

/** Splits Java source into tokens that join back into exactly the same text. */
export function tokenizeJava(code: string): Token[] {
  const tokens: Token[] = [];
  let at = 0;
  const plain = (end: number) => {
    if (end > at) tokens.push({ text: code.slice(at, end), kind: 'plain' });
  };
  for (const match of code.matchAll(PATTERN)) {
    const text = match[0];
    if (!text) continue;
    plain(match.index);
    const { comment, string, number, word } = match.groups ?? {};
    let kind: TokenKind = 'op';
    if (comment) kind = 'comment';
    else if (string) kind = 'string';
    else if (number) kind = 'number';
    else if (word) kind = KEYWORDS.has(word) ? 'keyword' : PRIMITIVES.has(word) ? 'type' : LITERALS.has(word) ? 'number' : 'plain';
    tokens.push({ text, kind });
    at = match.index + text.length;
  }
  plain(code.length);
  return tokens;
}

const PY_KEYWORDS = new Set(
  (
    'and as assert break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise ' +
    'return try while with yield'
  ).split(' '),
);
const PY_TYPES = new Set('int float str bool list tuple dict set'.split(' '));
const PY_LITERALS = new Set(['True', 'False', 'None']);
const PY_PATTERN = new RegExp(
  [
    /(?<comment>#[^\n]*)/,
    /(?<string>"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)/,
    /(?<number>\b0[xXoObB][\da-fA-F_]+\b|(?:\b\d[\d_]*\.?[\d_]*|\.\d[\d_]*)(?:[eE][+-]?\d+)?\b)/,
    /(?<word>[A-Za-z_][\w]*)/,
    /(?<op>\*\*=|\/\/=|\*\*|\/\/|<<|>>|<=|>=|==|!=|[-+*/%&|^]=|[-+*/%&|^~<>=])/,
  ]
    .map((r) => r.source)
    .join('|'),
  'g',
);

/** The same for Python, whose units in the syllabus are written in Python, not Java. */
export function tokenizePython(code: string): Token[] {
  const tokens: Token[] = [];
  let at = 0;
  for (const match of code.matchAll(PY_PATTERN)) {
    const text = match[0];
    if (!text) continue;
    if (match.index > at) tokens.push({ text: code.slice(at, match.index), kind: 'plain' });
    const { comment, string, number, word } = match.groups ?? {};
    let kind: TokenKind = 'op';
    if (comment) kind = 'comment';
    else if (string) kind = 'string';
    else if (number) kind = 'number';
    else if (word) kind = PY_KEYWORDS.has(word) ? 'keyword' : PY_TYPES.has(word) ? 'type' : PY_LITERALS.has(word) ? 'number' : 'plain';
    tokens.push({ text, kind });
    at = match.index + text.length;
  }
  if (code.length > at) tokens.push({ text: code.slice(at), kind: 'plain' });
  return tokens;
}

/** The same tokens grouped by line, for a pane that draws one line at a time. */
export function tokenizeLines(code: string): Token[][] {
  const lines: Token[][] = [[]];
  for (const token of tokenizeJava(code)) {
    token.text.split('\n').forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ text: part, kind: token.kind });
    });
  }
  return lines;
}
