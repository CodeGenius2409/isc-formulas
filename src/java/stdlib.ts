// The parts of the Java library used at ISC level.
import { arrayToString } from './stdlib-format';
import { asNumber, bool, chr, dbl, describeType, doubleToLong, formatDouble, int, isNumeric, NULL, runtimeError, str, toJavaString, VOID, type JValue } from './values';
export { formatPrintf } from './stdlib-format';

const NOT_SUPPORTED = (what: string, line: number) => runtimeError(`${what} is not supported in this tracer.`, line);

function argCount(name: string, args: JValue[], n: number | number[], line: number): void {
  const allowed = Array.isArray(n) ? n : [n];
  if (!allowed.includes(args.length)) throw runtimeError(`${name} takes ${allowed.join(' or ')} argument${allowed[0] === 1 ? '' : 's'}, but got ${args.length}.`, line);
}

const asStr = (v: JValue, line: number): string => {
  if (v.t === 'String') return v.v;
  if (v.t === 'null') throw runtimeError('java.lang.NullPointerException: this string is null.', line);
  throw runtimeError(`A String was expected here, but this is a ${describeType(v)}.`, line);
};

/** A char or an int, as a single UTF-16 code. */
const asCode = (v: JValue, line: number): number => {
  if (v.t === 'char' || v.t === 'int') return v.v;
  throw runtimeError(`A char was expected here, but this is a ${describeType(v)}.`, line);
};

/** Math.abs and friends keep the argument's type. */
function sameKind(v: JValue, n: number): JValue {
  if (v.t === 'long') return { t: 'long', v: BigInt(n) };
  if (v.t === 'double') return dbl(n);
  if (v.t === 'float') return { t: 'float', v: Math.fround(n) };
  return int(n);
}

function pickWider(a: JValue, b: JValue): 'double' | 'float' | 'long' | 'int' {
  if (a.t === 'double' || b.t === 'double') return 'double';
  if (a.t === 'float' || b.t === 'float') return 'float';
  if (a.t === 'long' || b.t === 'long') return 'long';
  return 'int';
}

function ofKind(kind: 'double' | 'float' | 'long' | 'int', n: number): JValue {
  if (kind === 'double') return dbl(n);
  if (kind === 'float') return { t: 'float', v: Math.fround(n) };
  if (kind === 'long') return { t: 'long', v: BigInt(n) };
  return int(n);
}

export function callMath(name: string, args: JValue[], line: number): JValue {
  const n = (i: number) => asNumber(args[i], line);
  const one = () => argCount(`Math.${name}`, args, 1, line);
  switch (name) {
    case 'abs':
      one();
      return args[0].t === 'long' ? { t: 'long', v: args[0].v < 0n ? -args[0].v : args[0].v } : sameKind(isNumeric(args[0]) && args[0].t === 'char' ? int(0) : args[0], Math.abs(n(0)));
    case 'max':
    case 'min': {
      argCount(`Math.${name}`, args, 2, line);
      const kind = pickWider(args[0], args[1]);
      if (kind === 'long') {
        const [x, y] = args.map((v) => (v.t === 'long' ? v.v : BigInt(asNumber(v, line))));
        return { t: 'long', v: (name === 'max') === x > y ? x : y };
      }
      return ofKind(kind, name === 'max' ? Math.max(n(0), n(1)) : Math.min(n(0), n(1)));
    }
    case 'pow':
      argCount('Math.pow', args, 2, line);
      return dbl(Math.pow(n(0), n(1)));
    case 'round':
      one();
      // Java rounds halves up, towards positive infinity, and so does Math.round.
      if (args[0].t === 'float') return int(Math.round(n(0)));
      return { t: 'long', v: doubleToLong(Math.round(n(0))) };
    case 'random':
      argCount('Math.random', args, 0, line);
      return dbl(Math.random());
    case 'hypot':
      argCount('Math.hypot', args, 2, line);
      return dbl(Math.hypot(n(0), n(1)));
    case 'atan2':
      argCount('Math.atan2', args, 2, line);
      return dbl(Math.atan2(n(0), n(1)));
    case 'floorMod':
      argCount('Math.floorMod', args, 2, line);
      return int(((n(0) % n(1)) + n(1)) % n(1));
    case 'toRadians':
      one();
      return dbl((n(0) * Math.PI) / 180);
    case 'toDegrees':
      one();
      return dbl((n(0) * 180) / Math.PI);
    case 'signum':
      one();
      return dbl(Math.sign(n(0)));
    case 'rint':
      one();
      {
        const x = n(0);
        const r = Math.round(x);
        return dbl(Math.abs(x % 1) === 0.5 && r % 2 !== 0 ? r - 1 : r);
      }
    case 'sqrt':
    case 'cbrt':
    case 'sin':
    case 'cos':
    case 'tan':
    case 'asin':
    case 'acos':
    case 'atan':
    case 'exp':
    case 'log':
    case 'log10':
    case 'floor':
    case 'ceil':
    case 'sinh':
    case 'cosh':
    case 'tanh':
      one();
      return dbl((Math[name as 'sqrt'] as (x: number) => number)(n(0)));
    default:
      throw NOT_SUPPORTED(`Math.${name}`, line);
  }
}

export function callCharacter(name: string, args: JValue[], line: number): JValue {
  argCount(`Character.${name}`, args, name === 'valueOf' ? 1 : [1], line);
  const code = asCode(args[0], line);
  const c = String.fromCharCode(code);
  switch (name) {
    case 'isDigit':
      return bool(/^\d$/.test(c));
    case 'isLetter':
      return bool(/^\p{L}$/u.test(c));
    case 'isLetterOrDigit':
      return bool(/^[\p{L}\d]$/u.test(c));
    case 'isUpperCase':
      return bool(/^\p{Lu}$/u.test(c));
    case 'isLowerCase':
      return bool(/^\p{Ll}$/u.test(c));
    case 'isWhitespace':
    case 'isSpaceChar':
      return bool(/^\s$/.test(c));
    case 'toUpperCase':
      return args[0].t === 'int' ? int(c.toUpperCase().charCodeAt(0)) : chr(c.toUpperCase().charCodeAt(0));
    case 'toLowerCase':
      return args[0].t === 'int' ? int(c.toLowerCase().charCodeAt(0)) : chr(c.toLowerCase().charCodeAt(0));
    case 'getNumericValue':
      return int(/^[0-9a-zA-Z]$/.test(c) ? parseInt(c, 36) : -1);
    case 'toString':
      return str(c);
    case 'valueOf':
      return chr(code);
    default:
      throw NOT_SUPPORTED(`Character.${name}`, line);
  }
}

function parseIntStrict(text: string, radix: number, line: number): number {
  const valid = radix === 10 ? /^[+-]?\d+$/ : radix === 2 ? /^[+-]?[01]+$/ : radix === 8 ? /^[+-]?[0-7]+$/ : /^[+-]?[0-9a-fA-F]+$/;
  if (!valid.test(text)) throw runtimeError(`java.lang.NumberFormatException: For input string: "${text}"`, line);
  const v = parseInt(text, radix);
  if (v > 2147483647 || v < -2147483648) throw runtimeError(`java.lang.NumberFormatException: For input string: "${text}" is out of range for an int.`, line);
  return v;
}

export function callInteger(name: string, args: JValue[], line: number): JValue {
  switch (name) {
    case 'parseInt':
    case 'valueOf':
      argCount(`Integer.${name}`, args, [1, 2], line);
      if (args[0].t === 'int') return args[0];
      return int(parseIntStrict(asStr(args[0], line), args[1] ? asNumber(args[1], line) : 10, line));
    case 'toString':
      argCount('Integer.toString', args, [1, 2], line);
      return str(args[1] ? asNumber(args[0], line).toString(asNumber(args[1], line)) : toJavaString(args[0]));
    case 'toBinaryString':
      return str((asNumber(args[0], line) >>> 0).toString(2));
    case 'toHexString':
      return str((asNumber(args[0], line) >>> 0).toString(16));
    case 'toOctalString':
      return str((asNumber(args[0], line) >>> 0).toString(8));
    case 'max':
      return int(Math.max(asNumber(args[0], line), asNumber(args[1], line)));
    case 'min':
      return int(Math.min(asNumber(args[0], line), asNumber(args[1], line)));
    case 'sum':
      return int(asNumber(args[0], line) + asNumber(args[1], line));
    case 'compare':
      return int(Math.sign(asNumber(args[0], line) - asNumber(args[1], line)));
    case 'bitCount': {
      let n = asNumber(args[0], line) >>> 0;
      let count = 0;
      while (n) {
        count += n & 1;
        n >>>= 1;
      }
      return int(count);
    }
    default:
      throw NOT_SUPPORTED(`Integer.${name}`, line);
  }
}

export function callLong(name: string, args: JValue[], line: number): JValue {
  if (name === 'parseLong' || name === 'valueOf') {
    const s = args[0].t === 'String' ? args[0].v : toJavaString(args[0]);
    if (!/^[+-]?\d+$/.test(s)) throw runtimeError(`java.lang.NumberFormatException: For input string: "${s}"`, line);
    return { t: 'long', v: BigInt.asIntN(64, BigInt(s)) };
  }
  if (name === 'toString') return str(toJavaString(args[0]));
  throw NOT_SUPPORTED(`Long.${name}`, line);
}

export function callDouble(name: string, args: JValue[], line: number, kind: 'Double' | 'Float' = 'Double'): JValue {
  switch (name) {
    case 'parseDouble':
    case 'parseFloat':
    case 'valueOf': {
      if (isNumeric(args[0])) return dbl(asNumber(args[0], line));
      const s = asStr(args[0], line).trim();
      const v = Number(s);
      if (s === '' || (Number.isNaN(v) && s !== 'NaN')) throw runtimeError(`java.lang.NumberFormatException: For input string: "${s}"`, line);
      return kind === 'Float' ? { t: 'float', v: Math.fround(v) } : dbl(v);
    }
    case 'toString':
      return str(toJavaString(args[0]));
    case 'isNaN':
      return bool(Number.isNaN(asNumber(args[0], line)));
    case 'isInfinite':
      return bool(Math.abs(asNumber(args[0], line)) === Infinity);
    case 'compare':
      return int(Math.sign(asNumber(args[0], line) - asNumber(args[1], line)));
    default:
      throw NOT_SUPPORTED(`${kind}.${name}`, line);
  }
}

export function callBoolean(name: string, args: JValue[], line: number): JValue {
  if (name === 'parseBoolean' || name === 'valueOf') return bool(toJavaString(args[0]).toLowerCase() === 'true');
  if (name === 'toString') return str(toJavaString(args[0]));
  throw NOT_SUPPORTED(`Boolean.${name}`, line);
}

export function staticField(cls: string, name: string): JValue | null {
  const table: Record<string, Record<string, JValue>> = {
    Math: { PI: dbl(Math.PI), E: dbl(Math.E) },
    Integer: { MAX_VALUE: int(2147483647), MIN_VALUE: int(-2147483648) },
    Long: { MAX_VALUE: { t: 'long', v: 9223372036854775807n }, MIN_VALUE: { t: 'long', v: -9223372036854775808n } },
    Double: { MAX_VALUE: dbl(Number.MAX_VALUE), MIN_VALUE: dbl(Number.MIN_VALUE), POSITIVE_INFINITY: dbl(Infinity), NEGATIVE_INFINITY: dbl(-Infinity), NaN: dbl(NaN) },
    Float: { MAX_VALUE: { t: 'float', v: 3.4028235e38 }, MIN_VALUE: { t: 'float', v: 1.4e-45 } },
    Character: { MAX_VALUE: chr(65535), MIN_VALUE: chr(0) },
    Short: { MAX_VALUE: { t: 'short', v: 32767 }, MIN_VALUE: { t: 'short', v: -32768 } },
    Byte: { MAX_VALUE: { t: 'byte', v: 127 }, MIN_VALUE: { t: 'byte', v: -128 } },
  };
  return table[cls]?.[name] ?? null;
}

const inBounds = (i: number, n: number, line: number, what = 'String index') => {
  if (i < 0 || i >= n) throw runtimeError(`java.lang.StringIndexOutOfBoundsException: ${what} ${i} is out of range for length ${n}.`, line);
};

/** String methods. `self` is the string the method is called on. */
export function callString(self: string, name: string, args: JValue[], line: number): JValue {
  const a = (i: number) => asNumber(args[i], line);
  const s = (i: number) => asStr(args[i], line);
  const piece = (v: JValue) => (v.t === 'char' ? String.fromCharCode(v.v) : v.t === 'int' ? String.fromCharCode(v.v) : asStr(v, line));
  switch (name) {
    case 'length':
      return int(self.length);
    case 'charAt':
      argCount('charAt', args, 1, line);
      inBounds(a(0), self.length, line);
      return chr(self.charCodeAt(a(0)));
    case 'substring': {
      argCount('substring', args, [1, 2], line);
      const from = a(0);
      const to = args[1] ? a(1) : self.length;
      if (from < 0 || to > self.length || from > to) throw runtimeError(`java.lang.StringIndexOutOfBoundsException: begin ${from}, end ${to}, length ${self.length}`, line);
      return str(self.slice(from, to));
    }
    case 'indexOf':
      argCount('indexOf', args, [1, 2], line);
      return int(self.indexOf(piece(args[0]), args[1] ? a(1) : 0));
    case 'lastIndexOf':
      argCount('lastIndexOf', args, [1, 2], line);
      return int(self.lastIndexOf(piece(args[0]), args[1] ? a(1) : Infinity));
    case 'toUpperCase':
      return str(self.toUpperCase());
    case 'toLowerCase':
      return str(self.toLowerCase());
    case 'trim':
    case 'strip':
      return str(self.trim());
    case 'equals':
      argCount('equals', args, 1, line);
      return bool(args[0].t === 'String' && args[0].v === self);
    case 'equalsIgnoreCase':
      argCount('equalsIgnoreCase', args, 1, line);
      return bool(args[0].t === 'String' && args[0].v.toLowerCase() === self.toLowerCase());
    case 'compareTo':
    case 'compareToIgnoreCase': {
      argCount(name, args, 1, line);
      const ignore = name === 'compareToIgnoreCase';
      const x = ignore ? self.toLowerCase() : self;
      const y = ignore ? s(0).toLowerCase() : s(0);
      for (let i = 0; i < Math.min(x.length, y.length); i++) {
        if (x[i] !== y[i]) return int(x.charCodeAt(i) - y.charCodeAt(i));
      }
      return int(x.length - y.length);
    }
    case 'concat':
      return str(self + s(0));
    case 'contains':
      return bool(self.includes(toJavaString(args[0])));
    case 'startsWith':
      return bool(self.startsWith(s(0), args[1] ? a(1) : 0));
    case 'endsWith':
      return bool(self.endsWith(s(0)));
    case 'isEmpty':
      return bool(self.length === 0);
    case 'isBlank':
      return bool(self.trim().length === 0);
    case 'replace':
      argCount('replace', args, 2, line);
      return str(self.split(piece(args[0])).join(piece(args[1])));
    case 'replaceAll':
      return str(self.replace(new RegExp(s(0), 'g'), s(1)));
    case 'replaceFirst':
      return str(self.replace(new RegExp(s(0)), s(1)));
    case 'split': {
      const parts = self.split(new RegExp(s(0)));
      // Java drops empty strings from the end of the result, unless nothing matched.
      if (parts.length > 1) while (parts.length && parts[parts.length - 1] === '') parts.pop();
      return { t: 'array', elem: { name: 'String', dims: 0 }, items: parts.map(str), id: nextId() };
    }
    case 'toCharArray':
      return { t: 'array', elem: { name: 'char', dims: 0 }, items: [...self].map((c) => chr(c.charCodeAt(0))), id: nextId() };
    case 'hashCode': {
      let h = 0;
      for (let i = 0; i < self.length; i++) h = (Math.imul(31, h) + self.charCodeAt(i)) | 0;
      return int(h);
    }
    case 'toString':
      return str(self);
    default:
      throw NOT_SUPPORTED(`String.${name}`, line);
  }
}

let idCounter = 0x1b6d3;
export function nextId(): number {
  idCounter += 0x97;
  return idCounter;
}
export function resetIds(): void {
  idCounter = 0x1b6d3;
}

/** StringBuffer and StringBuilder. */
export function callBuffer(self: Extract<JValue, { t: 'native' }>, name: string, args: JValue[], line: number): JValue {
  const text = self.state.text ?? '';
  const a = (i: number) => asNumber(args[i], line);
  const set = (t: string) => {
    self.state.text = t;
    return self;
  };
  switch (name) {
    case 'append':
      argCount('append', args, 1, line);
      return set(text + toJavaString(args[0]));
    case 'insert':
      argCount('insert', args, 2, line);
      if (a(0) < 0 || a(0) > text.length) throw runtimeError(`java.lang.StringIndexOutOfBoundsException: offset ${a(0)}, length ${text.length}`, line);
      return set(text.slice(0, a(0)) + toJavaString(args[1]) + text.slice(a(0)));
    case 'reverse':
      return set([...text].reverse().join(''));
    case 'deleteCharAt':
      inBounds(a(0), text.length, line, 'index');
      return set(text.slice(0, a(0)) + text.slice(a(0) + 1));
    case 'delete':
      return set(text.slice(0, a(0)) + text.slice(a(1)));
    case 'replace':
      return set(text.slice(0, a(0)) + toJavaString(args[2]) + text.slice(a(1)));
    case 'setCharAt':
      inBounds(a(0), text.length, line, 'index');
      set(text.slice(0, a(0)) + toJavaString(args[1]) + text.slice(a(0) + 1));
      return VOID;
    case 'setLength':
      set(text.slice(0, a(0)).padEnd(a(0), '\0'));
      return VOID;
    case 'toString':
      return str(text);
    case 'length':
    case 'charAt':
    case 'indexOf':
    case 'lastIndexOf':
    case 'substring':
      return callString(text, name, args, line);
    default:
      throw NOT_SUPPORTED(`${self.kind}.${name}`, line);
  }
}

/** Splits on any of the delimiter characters, and never returns an empty token. */
export function tokenize(text: string, delimiters = ' \t\n\r\f'): string[] {
  const tokens: string[] = [];
  let current = '';
  for (const c of text) {
    if (delimiters.includes(c)) {
      if (current) tokens.push(current);
      current = '';
    } else current += c;
  }
  if (current) tokens.push(current);
  return tokens;
}

export function callTokenizer(self: Extract<JValue, { t: 'native' }>, name: string, line: number): JValue {
  const tokens = self.state.tokens ?? [];
  const next = self.state.next ?? 0;
  switch (name) {
    case 'hasMoreTokens':
    case 'hasMoreElements':
      return bool(next < tokens.length);
    case 'countTokens':
      return int(tokens.length - next);
    case 'nextToken':
      if (next >= tokens.length) throw runtimeError('java.util.NoSuchElementException: there are no more tokens.', line);
      self.state.next = next + 1;
      return str(tokens[next]);
    default:
      throw NOT_SUPPORTED(`StringTokenizer.${name}`, line);
  }
}

function sortValues(items: JValue[], line: number): void {
  items.sort((x, y) => {
    if (x.t === 'long' && y.t === 'long') return x.v < y.v ? -1 : x.v > y.v ? 1 : 0;
    if (x.t === 'String' && y.t === 'String') return x.v < y.v ? -1 : x.v > y.v ? 1 : 0;
    return asNumber(x, line) - asNumber(y, line);
  });
}

export function callArrays(name: string, args: JValue[], line: number): JValue {
  const arr = args[0];
  if (arr.t === 'null') throw runtimeError('java.lang.NullPointerException: the array is null.', line);
  if (arr.t !== 'array') throw runtimeError(`Arrays.${name} needs an array, but this is a ${describeType(arr)}.`, line);
  switch (name) {
    case 'toString':
      return str(arrayToString(arr));
    case 'deepToString':
      return str(arrayToString(arr, true));
    case 'sort':
      if (args.length === 1) sortValues(arr.items, line);
      else {
        const part = arr.items.slice(asNumber(args[1], line), asNumber(args[2], line));
        sortValues(part, line);
        part.forEach((v, i) => {
          arr.items[asNumber(args[1], line) + i] = v;
        });
      }
      return VOID;
    case 'fill':
      arr.items.fill(args[1]);
      return VOID;
    case 'equals':
      return bool(args[1].t === 'array' && arrayToString(arr) === arrayToString(args[1]));
    case 'copyOf': {
      const n = asNumber(args[1], line);
      const items = arr.items.slice(0, n);
      while (items.length < n) items.push(arr.elem.name === 'String' || arr.elem.dims ? NULL : (arr.items[0] ? (arr.items[0].t === 'boolean' ? bool(false) : int(0)) : int(0)));
      return { ...arr, items, id: nextId() };
    }
    case 'copyOfRange':
      return { ...arr, items: arr.items.slice(asNumber(args[1], line), asNumber(args[2], line)), id: nextId() };
    default:
      throw NOT_SUPPORTED(`Arrays.${name}`, line);
  }
}

export function callStringStatic(name: string, args: JValue[], line: number, format: (fmt: string, values: JValue[], line: number) => string): JValue {
  switch (name) {
    case 'valueOf':
    case 'copyValueOf':
      if (args[0].t === 'array') return str(args[0].items.map(toJavaString).join(''));
      return str(toJavaString(args[0]));
    case 'format':
      return str(format(asStr(args[0], line), args.slice(1), line));
    case 'join':
      return str(args.slice(1).map(toJavaString).join(asStr(args[0], line)));
    default:
      throw NOT_SUPPORTED(`String.${name}`, line);
  }
}

export { formatDouble };
