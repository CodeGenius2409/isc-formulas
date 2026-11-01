// Working out an expression's type without running it. Java decides the type of a ?: from
// both branches, even though only one runs: `true ? 1 : 2.0` is the double 1.0, and
// `true ? 'a' : i` is the int 97 when i is an int variable.
import type { ClassDecl, Expr } from './ast';
import type { Slot } from './values';

export interface TypeScope {
  lookup: (name: string) => Slot | null;
  cls: ClassDecl | null;
  classes: Map<string, ClassDecl>;
}

const RANK: Record<string, number> = { byte: 1, short: 2, char: 2, int: 3, long: 4, float: 5, double: 6 };
const LIMITS: Record<string, [number, number]> = { byte: [-128, 127], short: [-32768, 32767], char: [0, 65535] };
const DOUBLE_MATH = new Set(['pow', 'sqrt', 'cbrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2', 'exp', 'log', 'log10', 'floor', 'ceil', 'rint', 'random', 'hypot', 'toRadians', 'toDegrees', 'signum', 'sinh', 'cosh', 'tanh']);
const STRING_INT_METHODS = new Set(['length', 'indexOf', 'lastIndexOf', 'compareTo', 'compareToIgnoreCase', 'hashCode']);
const LIBRARY_CONSTANTS: Record<string, string> = { Math: 'double', Double: 'double', Integer: 'int', Long: 'long', Float: 'float', Short: 'short', Byte: 'byte', Character: 'char' };

const isNumericType = (t: string | null): t is string => t !== null && t in RANK;

/** Binary numeric promotion: small types become int, and the wider type wins. */
function promote(a: string, b: string): string {
  const top = Math.max(RANK[a], RANK[b], RANK.int);
  return ['int', 'long', 'float', 'double'][top - RANK.int];
}

/** The value of an int constant, which may narrow to a smaller type in a ?:. */
function constantInt(e: Expr): number | null {
  if (e.k === 'lit' && e.t === 'int') return e.v as number;
  if (e.k === 'unary' && e.op === '-') {
    const inner = constantInt(e.expr);
    return inner === null ? null : -inner;
  }
  return null;
}

function combine(a: string, aConstant: number | null, b: string, bConstant: number | null): string | null {
  if (a === b) return a;
  if (!isNumericType(a) || !isNumericType(b)) return null;
  if ((a === 'byte' && b === 'short') || (a === 'short' && b === 'byte')) return 'short';
  const fits = (value: number | null, type: string) => value !== null && type in LIMITS && value >= LIMITS[type][0] && value <= LIMITS[type][1];
  if (b === 'int' && fits(bConstant, a)) return a;
  if (a === 'int' && fits(aConstant, b)) return b;
  return promote(a, b);
}

function methodType(cls: ClassDecl | undefined | null, name: string): string | null {
  const returns = new Set((cls?.methods ?? []).filter((m) => m.name === name).map((m) => (m.ret.dims ? null : m.ret.name)));
  return returns.size === 1 ? [...returns][0] : null;
}

function callType(e: Extract<Expr, { k: 'call' }>, scope: TypeScope): string | null {
  if (e.target === null) return methodType(scope.cls, e.name);
  if (e.target.k === 'name' && !scope.lookup(e.target.name)) {
    const library = e.target.name;
    if (scope.classes.has(library)) return methodType(scope.classes.get(library), e.name);
    const arg = (i: number) => (e.args[i] ? staticType(e.args[i], scope) : null);
    if (library === 'Math') {
      if (DOUBLE_MATH.has(e.name)) return 'double';
      if (e.name === 'round') return arg(0) === 'float' ? 'int' : 'long';
      if (e.name === 'abs') return isNumericType(arg(0)) ? promote(arg(0)!, 'int') : null;
      if (e.name === 'max' || e.name === 'min') return isNumericType(arg(0)) && isNumericType(arg(1)) ? promote(arg(0)!, arg(1)!) : null;
      return null;
    }
    if (library === 'Integer' && e.name === 'parseInt') return 'int';
    if (library === 'Double' && e.name === 'parseDouble') return 'double';
    if (library === 'Long' && e.name === 'parseLong') return 'long';
    if (library === 'Character') return e.name === 'getNumericValue' ? 'int' : e.name === 'toUpperCase' || e.name === 'toLowerCase' ? arg(0) : null;
    return null;
  }
  const target = staticType(e.target, scope);
  if (target === 'String') return e.name === 'charAt' ? 'char' : STRING_INT_METHODS.has(e.name) ? 'int' : null;
  return target ? methodType(scope.classes.get(target), e.name) : null;
}

/** The type of a primitive or String expression, or null when it can't be told. */
export function staticType(e: Expr, scope: TypeScope): string | null {
  switch (e.k) {
    case 'lit':
      return e.t === 'null' ? null : e.t;
    case 'name': {
      const slot = scope.lookup(e.name);
      return slot && !slot.type.dims ? slot.type.name : null;
    }
    case 'field': {
      if (e.name === 'length') return 'int';
      if (e.target.k === 'name' && !scope.lookup(e.target.name)) {
        const owner = scope.classes.get(e.target.name);
        if (!owner) return LIBRARY_CONSTANTS[e.target.name] ?? null;
        const field = owner.fields.find((f) => f.name === e.name);
        return field && !field.type.dims ? field.type.name : null;
      }
      const ownerName = e.target.k === 'this' ? scope.cls?.name : staticType(e.target, scope);
      const field = ownerName ? scope.classes.get(ownerName)?.fields.find((f) => f.name === e.name) : undefined;
      return field && !field.type.dims ? field.type.name : null;
    }
    case 'index': {
      let base: Expr = e;
      let depth = 0;
      while (base.k === 'index') {
        base = base.target;
        depth++;
      }
      const slot = base.k === 'name' ? scope.lookup(base.name) : null;
      return slot && slot.type.dims === depth ? slot.type.name : null;
    }
    case 'cast':
      return e.type.dims ? null : e.type.name;
    case 'unary': {
      if (e.op === '!') return 'boolean';
      const inner = staticType(e.expr, scope);
      return isNumericType(inner) ? promote(inner, 'int') : null;
    }
    case 'incdec':
    case 'assign':
      return staticType(e.target, scope);
    case 'binary': {
      if (['==', '!=', '<', '>', '<=', '>=', '&&', '||'].includes(e.op)) return 'boolean';
      const a = staticType(e.a, scope);
      const b = staticType(e.b, scope);
      if (e.op === '+' && (a === 'String' || b === 'String')) return 'String';
      if (a === 'boolean' && b === 'boolean') return 'boolean';
      if (!isNumericType(a) || !isNumericType(b)) return null;
      return ['<<', '>>', '>>>'].includes(e.op) ? promote(a, 'int') : promote(a, b);
    }
    case 'ternary': {
      const a = staticType(e.a, scope);
      const b = staticType(e.b, scope);
      return a && b ? combine(a, constantInt(e.a), b, constantInt(e.b)) : null;
    }
    case 'call':
      return callType(e, scope);
    default:
      return null;
  }
}

/** The type a ?: gives the branch that ran, or null if it should stay as it is. */
export function conditionalType(takenType: string, taken: Expr, other: Expr, scope: TypeScope): string | null {
  const otherType = staticType(other, scope);
  return otherType ? combine(takenType, constantInt(taken), otherType, constantInt(other)) : null;
}

/** True for what javac works out in advance, such as "hel" + "lo", which is then shared. */
export function isConstant(e: Expr): boolean {
  switch (e.k) {
    case 'lit':
      return e.t !== 'null';
    case 'binary':
      return isConstant(e.a) && isConstant(e.b);
    case 'unary':
      return isConstant(e.expr);
    case 'ternary':
      return isConstant(e.cond) && isConstant(e.a) && isConstant(e.b);
    default:
      return false;
  }
}
