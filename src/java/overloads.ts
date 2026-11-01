// Choosing which overload of a method a call means.
import type { MethodDecl, TypeRef } from './ast';
import { describeType, isNumeric, isPrimitiveName, runtimeError, type JValue } from './values';

/** How well an argument fits a parameter. Higher is better, and −1 means it does not. */
function argFit(arg: JValue, type: TypeRef): number {
  if (type.dims > 0) return arg.t === 'null' ? 1 : arg.t === 'array' ? 3 : -1;
  if (isPrimitiveName(type.name)) {
    if (type.name === 'boolean') return arg.t === 'boolean' ? 3 : -1;
    if (!isNumeric(arg)) return -1;
    if (arg.t === type.name) return 3;
    const order = ['byte', 'short', 'int', 'long', 'float', 'double'];
    const from = arg.t === 'char' ? order.indexOf('int') : order.indexOf(arg.t);
    const to = order.indexOf(type.name);
    if (type.name === 'char') return -1;
    return to > from ? 2 : -1;
  }
  if (type.name === 'Object') return 1;
  if (arg.t === 'null') return 1;
  if (type.name === 'String') return arg.t === 'String' ? 3 : -1;
  if (arg.t === 'object') return arg.cls === type.name ? 3 : -1;
  if (arg.t === 'native') return arg.kind === type.name ? 3 : -1;
  return -1;
}

/** Picks an overload: right number of arguments, preferring exact types. */
export function bestOverload(candidates: MethodDecl[], args: JValue[], name: string, line: number): MethodDecl {
  const sameCount = candidates.filter((m) => m.params.length === args.length);
  if (!sameCount.length) {
    const counts = [...new Set(candidates.map((m) => m.params.length))].join(' or ');
    throw runtimeError(`${name} takes ${counts} argument${counts === '1' ? '' : 's'}, but was given ${args.length}.`, line);
  }
  let best: MethodDecl | null = null;
  let bestScore = -1;
  for (const m of sameCount) {
    let score = 0;
    for (let i = 0; i < args.length; i++) {
      const fit = argFit(args[i], m.params[i].type);
      if (fit < 0) {
        score = -1;
        break;
      }
      score += fit;
    }
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }
  if (!best) {
    throw runtimeError(`${name} cannot take arguments of type (${args.map(describeType).join(', ')}).`, line);
  }
  return best;
}
