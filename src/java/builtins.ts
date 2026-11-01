// Calls to the Java library: System.out, and static methods such as Math.pow.
import { StopProgram, UNSET } from './runtime';
import { callArrays, callBoolean, callCharacter, callDouble, callInteger, callLong, callMath, callStringStatic, formatPrintf } from './stdlib';
import { asNumber, runtimeError, str, toJavaString, VOID, type JValue } from './values';

export function systemOut(name: string, args: JValue[], line: number, print: (text: string, line: number) => void): JValue {
  switch (name) {
    case 'println':
      if (args.length > 1) throw runtimeError('println takes one value. Join several with +.', line);
      print(`${args.length ? printable(args[0], line) : ''}\n`, line);
      return VOID;
    case 'print':
      if (args.length !== 1) throw runtimeError('print takes exactly one value. Join several with +.', line);
      print(printable(args[0], line), line);
      return VOID;
    case 'printf':
    case 'format':
      if (args[0]?.t !== 'String') throw runtimeError('printf needs a format string first.', line);
      print(formatPrintf(args[0].v, args.slice(1), line), line);
      return VOID;
    case 'flush':
      return VOID;
    default:
      throw runtimeError(`System.out.${name} is not supported in this tracer.`, line);
  }
}

/** println(char[]) prints the characters, not the array's address. */
function printable(v: JValue, line: number): string {
  if (v === UNSET) throw runtimeError('This variable might not have been initialized.', line);
  if (v.t === 'void') throw runtimeError('This method returns nothing, so there is nothing to print.', line);
  if (v.t === 'array' && v.elem.name === 'char' && v.elem.dims === 0) return v.items.map(toJavaString).join('');
  return toJavaString(v);
}

export function callBuiltin(cls: string, name: string, args: JValue[], line: number): JValue {
  switch (cls) {
    case 'Math':
      return callMath(name, args, line);
    case 'Character':
      return callCharacter(name, args, line);
    case 'Integer':
      return callInteger(name, args, line);
    case 'Long':
      return callLong(name, args, line);
    case 'Double':
      return callDouble(name, args, line);
    case 'Float':
      return callDouble(name, args, line, 'Float');
    case 'Boolean':
      return callBoolean(name, args, line);
    case 'String':
      return callStringStatic(name, args, line, formatPrintf);
    case 'Arrays':
      return callArrays(name, args, line);
    case 'System':
      if (name === 'exit') throw new StopProgram();
      if (name === 'currentTimeMillis') return { t: 'long', v: BigInt(Date.now()) };
      if (name === 'nanoTime') return { t: 'long', v: BigInt(Math.round(performance.now() * 1e6)) };
      if (name === 'lineSeparator') return str('\n');
      if (name === 'arraycopy') {
        const [src, sp, dst, dp, n] = args;
        if (src.t !== 'array' || dst.t !== 'array') throw runtimeError('System.arraycopy needs arrays.', line);
        const part = src.items.slice(asNumber(sp, line), asNumber(sp, line) + asNumber(n, line));
        part.forEach((v, i) => (dst.items[asNumber(dp, line) + i] = v));
        return VOID;
      }
      throw runtimeError(`System.${name} is not supported in this tracer.`, line);
  }
  if (/^[A-Z]/.test(cls)) throw runtimeError(`The class ${cls} is not supported in this tracer.`, line);
  throw runtimeError(`Cannot find the variable "${cls}".`, line);
}
