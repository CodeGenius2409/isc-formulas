// Runtime values and Java's arithmetic rules: int wraps at 32 bits, / truncates for
// integers, char is a number in arithmetic, and doubles print the way Java prints them.
import type { TypeRef } from './ast';
import { JavaError } from './lexer';

export type NumericTag = 'byte' | 'short' | 'char' | 'int' | 'long' | 'float' | 'double';

export type JValue =
  | { t: 'byte' | 'short' | 'char' | 'int' | 'float' | 'double'; v: number }
  | { t: 'long'; v: bigint }
  | { t: 'boolean'; v: boolean }
  | { t: 'String'; v: string }
  | { t: 'null' }
  | { t: 'array'; elem: TypeRef; items: JValue[]; id: number }
  | { t: 'object'; cls: string; /** Every type it can be held in, from its runtime class upwards. */ types: Set<string>; fields: Map<string, Slot>; id: number }
  | { t: 'native'; kind: string; id: number; state: { text?: string; tokens?: string[]; next?: number } }
  | { t: 'void' };

/** A variable or field: its declared type, and its current value. */
export interface Slot {
  type: TypeRef;
  value: JValue;
  /** For a field: the class that declares it. A subclass can declare its own field of the same name. */
  owner?: string;
}

export const VOID: JValue = { t: 'void' };
export const NULL: JValue = { t: 'null' };

export const int = (v: number): JValue => ({ t: 'int', v: v | 0 });
export const dbl = (v: number): JValue => ({ t: 'double', v });
export const str = (v: string): JValue => ({ t: 'String', v });
export const bool = (v: boolean): JValue => ({ t: 'boolean', v });
export const chr = (v: number): JValue => ({ t: 'char', v: v & 0xffff });

export function runtimeError(message: string, line: number): JavaError {
  return new JavaError(message, line, 'runtime');
}

/** Exactly as Java's Double.toString: 1.0, 1.0E10, 1.0E-4. */
export function formatDouble(d: number): string {
  if (Number.isNaN(d)) return 'NaN';
  if (d === Infinity) return 'Infinity';
  if (d === -Infinity) return '-Infinity';
  if (d === 0) return Object.is(d, -0) ? '-0.0' : '0.0';
  const abs = Math.abs(d);
  if (abs >= 1e-3 && abs < 1e7) {
    const s = String(d);
    return s.includes('.') ? s : `${s}.0`;
  }
  let [mantissa, exponent] = d.toExponential().split('e');
  // Java always shows two digits, and picks the closest pair: 5e-324 is 4.9E-324.
  if (!mantissa.includes('.')) [mantissa, exponent] = d.toExponential(1).split('e');
  return `${mantissa}E${Number(exponent)}`;
}

export function formatFloat(f: number): string {
  if (!Number.isFinite(f) || f === 0) return formatDouble(f);
  for (let p = 2; p <= 9; p++) {
    const candidate = Number(f.toPrecision(p));
    if (Math.fround(candidate) === f) return formatDouble(candidate);
  }
  return formatDouble(f);
}

export function typeName(type: TypeRef): string {
  return type.name + '[]'.repeat(type.dims);
}

export function describeType(v: JValue): string {
  switch (v.t) {
    case 'array':
      return `${typeName(v.elem)}[]`;
    case 'object':
      return v.cls;
    case 'native':
      return v.kind;
    default:
      return v.t;
  }
}

/** What print shows for a value. */
export function toJavaString(v: JValue): string {
  switch (v.t) {
    case 'byte':
    case 'short':
    case 'int':
      return String(v.v);
    case 'long':
      return v.v.toString();
    case 'char':
      return String.fromCharCode(v.v);
    case 'double':
      return formatDouble(v.v);
    case 'float':
      return formatFloat(v.v);
    case 'boolean':
      return String(v.v);
    case 'String':
      return v.v;
    case 'null':
      return 'null';
    case 'array':
      return `[${v.elem.name === 'int' && v.elem.dims === 0 ? 'I' : v.elem.name === 'double' && v.elem.dims === 0 ? 'D' : 'L'}@${v.id.toString(16)}`;
    case 'object':
      return `${v.cls}@${v.id.toString(16)}`;
    case 'native':
      return v.kind === 'StringBuffer' || v.kind === 'StringBuilder' ? (v.state.text ?? '') : `${v.kind}@${v.id.toString(16)}`;
    case 'void':
      return '';
  }
}

/** Short form for the variables panel: arrays show their contents. */
export function displayValue(v: JValue, depth = 0): string {
  if (v.t === 'array') {
    if (depth > 2) return '[...]';
    const shown = v.items.slice(0, 40).map((x) => displayValue(x, depth + 1));
    return `[${shown.join(', ')}${v.items.length > 40 ? ', ...' : ''}]`;
  }
  if (v.t === 'String') return `"${v.v}"`;
  if (v.t === 'char') return `'${String.fromCharCode(v.v)}'`;
  if (v.t === 'object') {
    if (depth > 1) return `${v.cls}{...}`;
    return `${v.cls}{${[...v.fields].map(([k, s]) => `${k}=${displayValue(s.value, depth + 1)}`).join(', ')}}`;
  }
  return toJavaString(v);
}

export function isNumeric(v: JValue): v is Extract<JValue, { t: NumericTag }> {
  return v.t === 'int' || v.t === 'double' || v.t === 'char' || v.t === 'long' || v.t === 'float' || v.t === 'byte' || v.t === 'short';
}

export function asNumber(v: JValue, line: number): number {
  if (v.t === 'long') return Number(v.v);
  if (isNumeric(v)) return v.v as number;
  throw runtimeError(`A number was expected here, but this is a ${describeType(v)}.`, line);
}

const RANK: Record<NumericTag, number> = { byte: 1, short: 2, char: 2, int: 3, long: 4, float: 5, double: 6 };

/** Binary numeric promotion: small types become int, and the wider operand wins. */
function promoted(a: NumericTag, b: NumericTag): 'int' | 'long' | 'float' | 'double' {
  const top = Math.max(RANK[a], RANK[b]);
  return top >= 6 ? 'double' : top === 5 ? 'float' : top === 4 ? 'long' : 'int';
}

function toBig(v: JValue): bigint {
  return v.t === 'long' ? v.v : BigInt(Math.trunc((v as { v: number }).v));
}

function wrapLong(v: bigint): JValue {
  return { t: 'long', v: BigInt.asIntN(64, v) };
}

export function arithmetic(op: string, a: JValue, b: JValue, line: number): JValue {
  if (!isNumeric(a) || !isNumeric(b)) {
    throw runtimeError(`The operator ${op} cannot be used on ${describeType(a)} and ${describeType(b)}.`, line);
  }
  const kind = promoted(a.t, b.t);
  if (kind === 'long') {
    const x = toBig(a);
    const y = toBig(b);
    switch (op) {
      case '+':
        return wrapLong(x + y);
      case '-':
        return wrapLong(x - y);
      case '*':
        return wrapLong(x * y);
      case '/':
        if (y === 0n) throw runtimeError('java.lang.ArithmeticException: / by zero', line);
        return wrapLong(x / y);
      case '%':
        if (y === 0n) throw runtimeError('java.lang.ArithmeticException: / by zero', line);
        return wrapLong(x % y);
    }
  }
  const x = asNumber(a, line);
  const y = asNumber(b, line);
  if (kind === 'int') {
    switch (op) {
      case '+':
        return { t: 'int', v: (x + y) | 0 };
      case '-':
        return { t: 'int', v: (x - y) | 0 };
      case '*':
        return { t: 'int', v: Math.imul(x, y) };
      case '/':
        if (y === 0) throw runtimeError('java.lang.ArithmeticException: / by zero', line);
        return { t: 'int', v: Math.trunc(x / y) | 0 };
      case '%':
        if (y === 0) throw runtimeError('java.lang.ArithmeticException: / by zero', line);
        return { t: 'int', v: (x % y) | 0 };
    }
  }
  let r: number;
  switch (op) {
    case '+':
      r = x + y;
      break;
    case '-':
      r = x - y;
      break;
    case '*':
      r = x * y;
      break;
    case '/':
      r = x / y;
      break;
    case '%':
      r = x % y;
      break;
    default:
      throw runtimeError(`Unknown operator ${op}.`, line);
  }
  return kind === 'float' ? { t: 'float', v: Math.fround(r) } : { t: 'double', v: r };
}

export function bitwise(op: string, a: JValue, b: JValue, line: number): JValue {
  if (a.t === 'boolean' && b.t === 'boolean') {
    if (op === '&') return bool(a.v && b.v);
    if (op === '|') return bool(a.v || b.v);
    if (op === '^') return bool(a.v !== b.v);
  }
  if (!isNumeric(a) || !isNumeric(b) || a.t === 'double' || a.t === 'float' || b.t === 'double' || b.t === 'float') {
    throw runtimeError(`The operator ${op} needs integers, but found ${describeType(a)} and ${describeType(b)}.`, line);
  }
  if (a.t === 'long' || ((op === '&' || op === '|' || op === '^') && b.t === 'long')) {
    const x = toBig(a);
    const y = toBig(b);
    switch (op) {
      case '&':
        return wrapLong(x & y);
      case '|':
        return wrapLong(x | y);
      case '^':
        return wrapLong(x ^ y);
      case '<<':
        return wrapLong(x << (y & 63n));
      case '>>':
        return wrapLong(x >> (y & 63n));
      case '>>>':
        return wrapLong(BigInt.asUintN(64, x) >> (y & 63n));
    }
  }
  const x = (a as { v: number }).v;
  const y = Number(b.t === 'long' ? b.v : b.v);
  switch (op) {
    case '&':
      return int(x & y);
    case '|':
      return int(x | y);
    case '^':
      return int(x ^ y);
    case '<<':
      return int(x << y);
    case '>>':
      return int(x >> y);
    case '>>>':
      return int(x >>> y);
  }
  throw runtimeError(`Unknown operator ${op}.`, line);
}

export function compare(op: string, a: JValue, b: JValue, line: number): boolean {
  if (!isNumeric(a) || !isNumeric(b)) throw runtimeError(`The operator ${op} needs numbers, but found ${describeType(a)} and ${describeType(b)}.`, line);
  const big = a.t === 'long' && b.t === 'long';
  const x = big ? (a.v as bigint) : asNumber(a, line);
  const y = big ? (b.v as bigint) : asNumber(b, line);
  switch (op) {
    case '<':
      return x < y;
    case '>':
      return x > y;
    case '<=':
      return x <= y;
    default:
      return x >= y;
  }
}

export function javaEquals(a: JValue, b: JValue, line: number): boolean {
  if (isNumeric(a) && isNumeric(b)) {
    if (a.t === 'long' && b.t === 'long') return a.v === b.v;
    return asNumber(a, line) === asNumber(b, line);
  }
  if (a.t === 'boolean' && b.t === 'boolean') return a.v === b.v;
  if (a.t === 'null' || b.t === 'null') return a.t === b.t;
  if (a.t === 'String' && b.t === 'String') return a === b;
  if (isNumeric(a) || isNumeric(b) || a.t === 'boolean' || b.t === 'boolean') {
    throw runtimeError(`${describeType(a)} and ${describeType(b)} cannot be compared with ==.`, line);
  }
  return a === b;
}

/** An explicit cast, which may lose information. */
export function castTo(v: JValue, type: TypeRef, line: number): JValue {
  if (type.dims > 0 || !isPrimitiveName(type.name)) {
    if (v.t === 'null') return v;
    if (type.dims === 0 && v.t === 'object' && v.types.has(type.name)) return v;
    if (type.dims === 0 && v.t === 'String' && type.name === 'String') return v;
    if (type.dims > 0 && v.t === 'array') return v;
    if (type.name === 'Object') return v;
    throw runtimeError(`java.lang.ClassCastException: this object is really a ${describeType(v)}, so it cannot be cast to ${typeName(type)}.`, line);
  }
  if (type.name === 'boolean') {
    if (v.t === 'boolean') return v;
    throw runtimeError(`A ${describeType(v)} cannot be cast to boolean.`, line);
  }
  if (!isNumeric(v)) throw runtimeError(`A ${describeType(v)} cannot be cast to ${type.name}.`, line);
  const n = asNumber(v, line);
  const trunc = () => {
    if (Number.isNaN(n)) return 0;
    if (n >= 2147483647) return 2147483647;
    if (n <= -2147483648) return -2147483648;
    return Math.trunc(n);
  };
  switch (type.name) {
    case 'int':
      return v.t === 'long' ? { t: 'int', v: Number(BigInt.asIntN(32, v.v)) } : { t: 'int', v: trunc() };
    case 'byte':
      return { t: 'byte', v: (trunc() << 24) >> 24 };
    case 'short':
      return { t: 'short', v: (trunc() << 16) >> 16 };
    case 'char':
      return { t: 'char', v: trunc() & 0xffff };
    case 'long':
      if (v.t === 'long') return v;
      return { t: 'long', v: doubleToLong(n) };
    case 'float':
      return { t: 'float', v: Math.fround(n) };
    default:
      return { t: 'double', v: n };
  }
}

/** Java's conversion to long: NaN is 0, and values out of range stop at the limits. */
export function doubleToLong(n: number): bigint {
  if (Number.isNaN(n)) return 0n;
  if (n >= 9223372036854775807) return 9223372036854775807n;
  if (n <= -9223372036854775808) return -9223372036854775808n;
  return BigInt(Math.trunc(n));
}

export function isPrimitiveName(name: string): boolean {
  return ['int', 'long', 'double', 'float', 'char', 'boolean', 'byte', 'short'].includes(name);
}

const FITS: Record<string, [number, number]> = { byte: [-128, 127], short: [-32768, 32767], char: [0, 65535] };

/**
 * Assignment conversion, which javac checks at compile time. Widening is automatic. A
 * narrowing without a cast is the error students meet most, so it's reported in javac's words.
 */
export function assignConvert(v: JValue, type: TypeRef, line: number): JValue {
  if (type.dims > 0) {
    if (v.t === 'array' || v.t === 'null') return v;
    throw runtimeError(`Incompatible types: ${describeType(v)} cannot be converted to ${typeName(type)}.`, line);
  }
  if (isPrimitiveName(type.name)) {
    if (type.name === 'boolean') {
      if (v.t === 'boolean') return v;
      throw runtimeError(`Incompatible types: ${describeType(v)} cannot be converted to boolean.`, line);
    }
    if (!isNumeric(v)) throw runtimeError(`Incompatible types: ${describeType(v)} cannot be converted to ${type.name}.`, line);
    if (v.t === type.name) return v;
    const from = RANK[v.t];
    const to = RANK[type.name as NumericTag];
    const fit = FITS[type.name];
    // int constants may narrow to byte, short and char when the value fits.
    if (fit && (v.t === 'int' || v.t === 'char' || v.t === 'short' || v.t === 'byte') && (v.v as number) >= fit[0] && (v.v as number) <= fit[1]) {
      return castTo(v, type, line);
    }
    if (from > to || (type.name === 'char' && v.t !== 'char') || (v.t === 'char' && (type.name === 'short' || type.name === 'byte'))) {
      throw runtimeError(`Incompatible types: possible lossy conversion from ${v.t} to ${type.name}. Add a cast, like (${type.name}).`, line);
    }
    return castTo(v, type, line);
  }
  if (type.name === 'Object') return v;
  if (v.t === 'null') return v;
  if (type.name === 'String') {
    if (v.t === 'String') return v;
    throw runtimeError(`Incompatible types: ${describeType(v)} cannot be converted to String.`, line);
  }
  if (v.t === 'object' && v.types.has(type.name)) return v;
  if (v.t === 'native' && (v.kind === type.name || type.name === 'Reader' || type.name === 'InputStream')) return v;
  throw runtimeError(`Incompatible types: ${describeType(v)} cannot be converted to ${type.name}.`, line);
}

export function defaultValue(type: TypeRef): JValue {
  if (type.dims > 0) return NULL;
  switch (type.name) {
    case 'int':
      return { t: 'int', v: 0 };
    case 'byte':
      return { t: 'byte', v: 0 };
    case 'short':
      return { t: 'short', v: 0 };
    case 'char':
      return { t: 'char', v: 0 };
    case 'long':
      return { t: 'long', v: 0n };
    case 'float':
      return { t: 'float', v: 0 };
    case 'double':
      return { t: 'double', v: 0 };
    case 'boolean':
      return { t: 'boolean', v: false };
    default:
      return NULL;
  }
}
