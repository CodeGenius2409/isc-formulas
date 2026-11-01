// printf-style formatting, and printing arrays.
import { asNumber, displayValue, runtimeError, toJavaString, type JValue } from './values';

export function arrayToString(arr: Extract<JValue, { t: 'array' }>, deep = false): string {
  return `[${arr.items.map((v) => (deep && v.t === 'array' ? arrayToString(v, true) : v.t === 'String' ? v.v : toJavaString(v))).join(', ')}]`;
}

/** The shortest decimal digits of a number, and where the point falls among them. */
function decimalDigits(value: number): { digits: string; point: number } {
  const [mantissa, exponent] = Math.abs(value).toExponential().split('e');
  return { digits: mantissa.replace('.', ''), point: Number(exponent) + 1 };
}

/**
 * Keeps the first digits, rounding half up. Java rounds a double's shortest decimal form.
 * JavaScript's toFixed rounds its exact binary value, so 1.005 would give 1.00 instead of 1.01.
 */
function roundDigits(digits: string, keep: number): string {
  if (keep < 0) return '0';
  const up = (digits[keep] ?? '0') >= '5';
  return (BigInt(digits.slice(0, keep).padEnd(keep, '0') || '0') + (up ? 1n : 0n)).toString();
}

function toFixedJava(value: number, places: number): string {
  const { digits, point } = decimalDigits(value);
  const text = roundDigits(digits, point + places).padStart(places + 1, '0');
  const whole = text.slice(0, text.length - places);
  const sign = value < 0 || Object.is(value, -0) ? '-' : '';
  return `${sign}${whole}${places ? `.${text.slice(-places)}` : ''}`;
}

function toExponentialJava(value: number, places: number): string {
  const { digits, point } = decimalDigits(value);
  let rounded = roundDigits(digits, places + 1);
  let exponent = value === 0 ? 0 : point - 1;
  if (rounded.length > places + 1) {
    exponent += 1;
    rounded = rounded.slice(0, places + 1);
  }
  rounded = rounded.padEnd(places + 1, '0');
  const sign = value < 0 ? '-' : '';
  return `${sign}${rounded[0]}${places ? `.${rounded.slice(1)}` : ''}e${exponent < 0 ? '-' : '+'}${String(Math.abs(exponent)).padStart(2, '0')}`;
}

function pad(text: string, width: number, left: boolean, zero: boolean): string {
  if (text.length >= width) return text;
  if (left) return text.padEnd(width);
  if (zero) {
    const sign = /^[+-]/.test(text) ? text[0] : '';
    return sign + text.slice(sign.length).padStart(width - sign.length, '0');
  }
  return text.padStart(width);
}

/** Supports %d %s %f %e %c %b %x %o %% %n, with flags - 0 + , and width and precision. */
export function formatPrintf(format: string, args: JValue[], line: number): string {
  let index = 0;
  return format.replace(/%([-0+, ]*)(\d+)?(?:\.(\d+))?([a-zA-Z%])/g, (_, flags: string, width: string | undefined, precision: string | undefined, conv: string) => {
    if (conv === '%') return '%';
    if (conv === 'n') return '\n';
    if (index >= args.length) throw runtimeError(`java.util.MissingFormatArgumentException: Format specifier '%${conv}' has no value.`, line);
    const arg = args[index++];
    const left = flags.includes('-');
    const zero = flags.includes('0');
    const w = width ? Number(width) : 0;
    let out: string;
    const groups = (s: string) => (flags.includes(',') ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s);
    switch (conv) {
      case 'd':
        if (arg.t === 'double' || arg.t === 'float' || arg.t === 'String' || arg.t === 'boolean' || arg.t === 'char') throw runtimeError(`java.util.IllegalFormatConversionException: %d cannot format a ${arg.t}.`, line);
        out = groups(toJavaString(arg));
        if (flags.includes('+') && !out.startsWith('-')) out = `+${out}`;
        break;
      case 'f': {
        if (arg.t !== 'double' && arg.t !== 'float') throw runtimeError(`java.util.IllegalFormatConversionException: %f cannot format a ${arg.t}.`, line);
        const number = asNumber(arg, line);
        if (!Number.isFinite(number)) {
          out = toJavaString(arg);
          break;
        }
        const [whole, frac] = toFixedJava(number, precision ? Number(precision) : 6).split('.');
        out = groups(whole) + (frac ? `.${frac}` : '');
        if (flags.includes('+') && !out.startsWith('-')) out = `+${out}`;
        break;
      }
      case 'e':
      case 'E': {
        out = toExponentialJava(asNumber(arg, line), precision ? Number(precision) : 6);
        if (conv === 'E') out = out.toUpperCase();
        break;
      }
      case 's':
      case 'S':
        out = toJavaString(arg);
        if (precision) out = out.slice(0, Number(precision));
        if (conv === 'S') out = out.toUpperCase();
        break;
      case 'c':
        out = arg.t === 'int' ? String.fromCharCode(arg.v) : toJavaString(arg);
        break;
      case 'b':
        out = arg.t === 'null' ? 'false' : arg.t === 'boolean' ? String(arg.v) : 'true';
        break;
      case 'x':
        out = (asNumber(arg, line) >>> 0).toString(16);
        break;
      case 'X':
        out = (asNumber(arg, line) >>> 0).toString(16).toUpperCase();
        break;
      case 'o':
        out = (asNumber(arg, line) >>> 0).toString(8);
        break;
      default:
        throw runtimeError(`The format %${conv} is not supported in this tracer.`, line);
    }
    return pad(out, w, left, zero);
  });
}

export { displayValue };
