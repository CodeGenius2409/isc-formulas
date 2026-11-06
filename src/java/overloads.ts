// Choosing which overload of a method a call means.
import type { MethodDecl, TypeRef } from './ast';
import { describeType, isNumeric, isPrimitiveName, runtimeError, type JValue } from './values';

/** What overload choice needs to know about the program's classes. */
export interface OverloadContext {
  /** Steps up the hierarchy from one type to another, or -1 if it isn't above it. */
  distance: (sub: string, sup: string) => number;
  isClass: (name: string) => boolean;
  /** Each argument's type as written. Java chooses an overload by this, not by the runtime class. */
  argTypes?: (string | null)[];
}

/** How well an argument fits a parameter. Higher is better, and −1 means it does not. */
function argFit(arg: JValue, type: TypeRef, ctx?: OverloadContext, declared?: string | null): number {
  if (type.dims > 0) return arg.t === 'null' ? 1 : arg.t === 'array' ? 3 : -1;
  if (isPrimitiveName(type.name)) {
    if (type.name === 'boolean') return arg.t === 'boolean' ? 3 : -1;
    if (!isNumeric(arg)) return -1;
    if (arg.t === type.name) return 3;
    // Widening. A char sits level with a short, but neither widens to the other.
    if (type.name === 'char' || (arg.t === 'char' && type.name === 'short')) return -1;
    const order = ['byte', 'short', 'int', 'long', 'float', 'double'];
    const from = order.indexOf(arg.t === 'char' ? 'short' : arg.t);
    const to = order.indexOf(type.name);
    // The closer type wins, as javac picks the most specific overload.
    return to > from ? 2 - (to - from) * 0.1 : -1;
  }
  if (type.name === 'Object') return 0.5;
  if (arg.t === 'null') return 1;
  if (type.name === 'String') return arg.t === 'String' ? 3 : -1;
  if (arg.t === 'object') {
    const from = declared && (declared === 'Object' || ctx?.isClass(declared)) ? declared : arg.cls;
    if (from === type.name) return 3;
    const steps = ctx ? ctx.distance(from, type.name) : -1;
    // The nearer class wins, as javac picks the most specific overload.
    return steps < 0 ? -1 : Math.max(2.9 - steps * 0.1, 1.1);
  }
  if (arg.t === 'native') return arg.kind === type.name ? 3 : -1;
  return -1;
}

/** Picks an overload: right number of arguments, preferring exact types. */
export function bestOverload(candidates: MethodDecl[], args: JValue[], name: string, line: number, ctx?: OverloadContext): MethodDecl {
  const sameCount = candidates.filter((m) => m.params.length === args.length);
  if (!sameCount.length) {
    const counts = [...new Set(candidates.map((m) => m.params.length))].join(' or ');
    throw runtimeError(`${name} takes ${counts} argument${counts === '1' ? '' : 's'}, but was given ${args.length}.`, line);
  }
  let best: MethodDecl | null = null;
  let bestScore = -1;
  let fitting = 0;
  for (const m of sameCount) {
    let score = 0;
    for (let i = 0; i < args.length; i++) {
      const fit = argFit(args[i], m.params[i].type, ctx, ctx?.argTypes?.[i]);
      if (fit < 0) {
        score = -1;
        break;
      }
      score += fit;
    }
    if (score >= 0) fitting++;
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }
  if (!best) {
    throw runtimeError(`${name} cannot take arguments of type (${args.map(describeType).join(', ')}).`, line);
  }
  // Java decides by the type as written. If that can't be worked out here, the runtime class might give a different
  // answer from javac, so the tracer says so rather than guessing.
  if (fitting > 1 && ctx?.argTypes && args.some((a, i) => a.t === 'object' && !ctx.argTypes![i])) {
    throw runtimeError(`The tracer can't tell which ${name} this means, because it can't work out an argument's type as written. Store that argument in a variable first.`, line);
  }
  return best;
}
