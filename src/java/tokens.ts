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
