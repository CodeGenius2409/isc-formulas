// Turns Java source text into tokens.

export class JavaError extends Error {
  constructor(
    message: string,
    readonly line: number,
    /** "compile" errors stop the program before it runs. */
    readonly kind: 'compile' | 'runtime' = 'compile',
  ) {
    super(message);
  }
}

export type TokenType = 'ident' | 'keyword' | 'int' | 'long' | 'double' | 'float' | 'char' | 'string' | 'op' | 'eof';

export interface Token {
  type: TokenType;
  text: string;
  /** Parsed value of a literal. */
  value?: number | bigint | string;
  line: number;
}

const KEYWORDS = new Set([
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while', 'true', 'false', 'null',
]);

const OPERATORS = ['>>>=', '<<=', '>>=', '>>>', '...', '->', '++', '--', '&&', '||', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<', '>>', '::', '+', '-', '*', '/', '%', '=', '<', '>', '!', '~', '?', ':', ';', ',', '.', '(', ')', '[', ']', '{', '}', '&', '|', '^', '@'];

const ESCAPES: Record<string, string> = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', '0': '\0', '"': '"', "'": "'", '\\': '\\' };

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  const n = source.length;

  const readEscape = (): string => {
    // source[i] is the character after the backslash.
    const c = source[i++];
    if (c === 'u') {
      const hex = source.slice(i, i + 4);
      i += 4;
      return String.fromCharCode(parseInt(hex, 16));
    }
    const out = ESCAPES[c];
    if (out === undefined) throw new JavaError(`"\\${c}" is not a valid escape sequence.`, line);
    return out;
  };

  while (i < n) {
    const c = source[i];
    if (c === '\n') {
      line++;
      i++;
      continue;
    }
    if (c === ' ' || c === '\t' || c === '\r') {
      i++;
      continue;
    }
    if (c === '/' && source[i + 1] === '/') {
      while (i < n && source[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && source[i + 1] === '*') {
      const start = line;
      i += 2;
      while (i < n && !(source[i] === '*' && source[i + 1] === '/')) {
        if (source[i] === '\n') line++;
        i++;
      }
      if (i >= n) throw new JavaError('This comment is never closed. Add */ to end it.', start);
      i += 2;
      continue;
    }
    if (c === '"') {
      if (source.startsWith('"""', i)) throw new JavaError('Text blocks (""") are not supported here. Use an ordinary string.', line);
      i++;
      let text = '';
      while (i < n && source[i] !== '"') {
        if (source[i] === '\n') throw new JavaError('This string is not closed on its line. Add the closing ".', line);
        if (source[i] === '\\') {
          i++;
          text += readEscape();
        } else text += source[i++];
      }
      if (i >= n) throw new JavaError('This string is not closed. Add the closing ".', line);
      i++;
      tokens.push({ type: 'string', text, value: text, line });
      continue;
    }
    if (c === "'") {
      i++;
      let ch: string;
      if (source[i] === '\\') {
        i++;
        ch = readEscape();
      } else ch = source[i++];
      if (source[i] !== "'") throw new JavaError("A char holds one character, in single quotes, like 'a'. For text, use double quotes.", line);
      i++;
      tokens.push({ type: 'char', text: ch, value: ch.charCodeAt(0), line });
      continue;
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(source[i + 1] ?? ''))) {
      let j = i;
      if (c === '0' && /[xX]/.test(source[i + 1] ?? '')) {
        j += 2;
        while (/[0-9a-fA-F_]/.test(source[j] ?? '')) j++;
      } else if (c === '0' && /[bB]/.test(source[i + 1] ?? '')) {
        j += 2;
        while (/[01_]/.test(source[j] ?? '')) j++;
      } else {
        while (/[0-9_]/.test(source[j] ?? '')) j++;
        if (source[j] === '.' && /[0-9]/.test(source[j + 1] ?? '')) {
          j++;
          while (/[0-9_]/.test(source[j] ?? '')) j++;
        } else if (source[j] === '.' && !/[A-Za-z_]/.test(source[j + 1] ?? '')) {
          j++;
        }
        if (/[eE]/.test(source[j] ?? '')) {
          j++;
          if (/[+-]/.test(source[j] ?? '')) j++;
          while (/[0-9]/.test(source[j] ?? '')) j++;
        }
      }
      const raw = source.slice(i, j).replace(/_/g, '');
      const suffix = source[j] ?? '';
      const isDecimalForm = /[.eE]/.test(raw) && !/^0[xX]/.test(raw);
      if (/[lL]/.test(suffix)) {
        tokens.push({ type: 'long', text: raw, value: BigInt(raw), line });
        j++;
      } else if (/[fF]/.test(suffix) && !/^0[xX]/.test(raw)) {
        tokens.push({ type: 'float', text: raw, value: Math.fround(Number(raw)), line });
        j++;
      } else if (/[dD]/.test(suffix) && !/^0[xX]/.test(raw)) {
        tokens.push({ type: 'double', text: raw, value: Number(raw), line });
        j++;
      } else if (isDecimalForm) {
        tokens.push({ type: 'double', text: raw, value: Number(raw), line });
      } else {
        const v = Number(raw);
        if (v > 2147483648 && !/^0[xXbB]/.test(raw)) throw new JavaError(`${raw} is too large for an int. Add L to make it a long: ${raw}L.`, line);
        tokens.push({ type: 'int', text: raw, // 2147483648 only fits once a minus sign applies to it.
          value: raw === '2147483648' ? v : v | 0, line });
      }
      i = j;
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i + 1;
      while (/[A-Za-z0-9_$]/.test(source[j] ?? '')) j++;
      const text = source.slice(i, j);
      tokens.push({ type: KEYWORDS.has(text) ? 'keyword' : 'ident', text, line });
      i = j;
      continue;
    }
    const op = OPERATORS.find((o) => source.startsWith(o, i));
    if (!op) throw new JavaError(`The character "${c}" is not valid in Java here.`, line);
    tokens.push({ type: 'op', text: op, line });
    i += op.length;
  }
  tokens.push({ type: 'eof', text: 'end of file', line });
  return tokens;
}
