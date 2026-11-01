// printf-style formatting, and printing arrays.
import { asNumber, displayValue, runtimeError, toJavaString, type JValue } from './values';

export function arrayToString(arr: Extract<JValue, { t: 'array' }>, deep = false): string {
  return `[${arr.items.map((v) => (deep && v.t === 'array' ? arrayToString(v, true) : v.t === 'String' ? v.v : toJavaString(v))).join(', ')}]`;
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
        if (arg.t === 'double' || arg.t === 'float' || arg.t === 'String' || arg.t === 'boolean') throw runtimeError(`java.util.IllegalFormatConversionException: %d cannot format a ${arg.t}.`, line);
        out = groups(toJavaString(arg.t === 'char' ? { t: 'int', v: arg.v } : arg));
        if (flags.includes('+') && !out.startsWith('-')) out = `+${out}`;
        break;
      case 'f': {
        if (arg.t !== 'double' && arg.t !== 'float') throw runtimeError(`java.util.IllegalFormatConversionException: %f cannot format a ${arg.t}.`, line);
        const fixed = asNumber(arg, line).toFixed(precision ? Number(precision) : 6);
        const [whole, frac] = fixed.split('.');
        out = groups(whole) + (frac ? `.${frac}` : '');
        if (flags.includes('+') && !out.startsWith('-')) out = `+${out}`;
        break;
      }
      case 'e':
      case 'E': {
        const [m, e] = asNumber(arg, line).toExponential(precision ? Number(precision) : 6).split('e');
        const exp = Number(e);
        out = `${m}e${exp < 0 ? '-' : '+'}${String(Math.abs(exp)).padStart(2, '0')}`;
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
