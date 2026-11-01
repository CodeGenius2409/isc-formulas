// Evaluates expressions: names, arithmetic, calls, objects and arrays. Statements and
// the program's overall run are in interp.ts.
import type { ClassDecl, Expr, MethodDecl, Program, TypeRef } from './ast';
import { callBuiltin, systemOut } from './builtins';
import { ProgramInput } from './input';
import { JavaError } from './lexer';
import { bestOverload } from './overloads';
import { MAX_ARRAY, MAX_OUTPUT, UNSET, type Frame, type Gen } from './runtime';
import { callBuffer, callString, nextId, staticField } from './stdlib';
import { arithmetic, assignConvert, bitwise, bool, castTo, compare, dbl, defaultValue, describeType, int, isNumeric, isPrimitiveName, javaEquals, NULL, runtimeError, str, toJavaString, typeName, VOID, type JValue, type Slot } from './values';

export abstract class Evaluator {
  protected classes = new Map<string, ClassDecl>();
  protected statics = new Map<string, Map<string, Slot>>();
  protected frames: Frame[] = [];
  protected input: ProgramInput;
  output = '';

  constructor(
    protected program: Program,
    input: string,
  ) {
    this.input = new ProgramInput(input);
    for (const c of program.classes) {
      if (this.classes.has(c.name)) throw new JavaError(`There are two classes named ${c.name}.`, c.line);
      this.classes.set(c.name, c);
    }
  }

  /** Runs a method to completion. Statements live in the subclass. */
  protected abstract invoke(method: MethodDecl, args: JValue[], self: Frame['self'], line: number): Gen<JValue>;

  get frameList(): readonly Frame[] {
    return this.frames;
  }

  print(text: string, line: number): void {
    this.output += text;
    if (this.output.length > MAX_OUTPUT) throw runtimeError('This program printed too much, so it was stopped. It may be stuck in a loop.', line);
  }

  protected truth(v: JValue, line: number): boolean {
    if (v.t === 'boolean') return v.v;
    throw runtimeError(`A condition must be true or false, but this is a ${describeType(v)}.`, line);
  }

  /** An initializer may be a bare { ... } list, which takes its type from the variable. */
  protected *evalInit(e: Expr, type: TypeRef, frame: Frame): Gen<JValue> {
    if (e.k === 'arraylit') {
      if (type.dims === 0) throw runtimeError(`A { } list can only initialize an array, but this is a ${typeName(type)}.`, e.line);
      return yield* this.arrayFromList(e, { name: type.name, dims: type.dims - 1 }, frame);
    }
    return assignConvert(yield* this.eval(e, frame), type, e.line);
  }

  protected *arrayFromList(e: Extract<Expr, { k: 'arraylit' }>, elem: TypeRef, frame: Frame): Gen<JValue> {
    const items: JValue[] = [];
    for (const item of e.items) items.push(yield* this.evalInit(item, elem, frame));
    return { t: 'array', elem, items, id: nextId() };
  }

  protected lookup(name: string, frame: Frame): Slot | null {
    for (let i = frame.scopes.length - 1; i >= 0; i--) {
      const slot = frame.scopes[i].vars.get(name);
      if (slot) return slot;
    }
    const field = frame.self?.fields.get(name);
    if (field) return field;
    if (frame.cls) return this.statics.get(frame.cls.name)?.get(name) ?? null;
    return null;
  }

  protected *lvalue(target: Expr, frame: Frame): Gen<{ get: () => JValue; set: (v: JValue) => void; type: TypeRef }> {
    if (target.k === 'name') {
      const slot = this.lookup(target.name, frame);
      if (!slot) {
        if (this.isInstanceField(target.name, frame)) throw runtimeError(`The instance variable ${target.name} cannot be used from a static method.`, target.line);
        throw runtimeError(`Cannot find the variable "${target.name}". It may not be declared, or may be out of scope here.`, target.line);
      }
      return { get: () => slot.value, set: (v) => (slot.value = v), type: slot.type };
    }
    if (target.k === 'field') {
      if (target.target.k === 'name' && !this.lookup(target.target.name, frame) && this.statics.has(target.target.name)) {
        const slot = this.statics.get(target.target.name)!.get(target.name);
        if (!slot) throw runtimeError(`Class ${target.target.name} has no static variable "${target.name}".`, target.line);
        return { get: () => slot.value, set: (v) => (slot.value = v), type: slot.type };
      }
      const obj = yield* this.eval(target.target, frame);
      if (obj.t === 'null') throw runtimeError(`java.lang.NullPointerException: cannot set "${target.name}" on null.`, target.line);
      if (obj.t === 'object') {
        const slot = obj.fields.get(target.name) ?? this.statics.get(obj.cls)?.get(target.name);
        if (!slot) throw runtimeError(`Class ${obj.cls} has no variable "${target.name}".`, target.line);
        return { get: () => slot.value, set: (v) => (slot.value = v), type: slot.type };
      }
      if (obj.t === 'array' && target.name === 'length') throw runtimeError('An array\'s length cannot be changed.', target.line);
      throw runtimeError(`A ${describeType(obj)} has no variable "${target.name}".`, target.line);
    }
    if (target.k === 'index') {
      const arr = yield* this.eval(target.target, frame);
      const iv = yield* this.eval(target.index, frame);
      const i = this.checkIndex(arr, iv, target.line);
      const array = arr as Extract<JValue, { t: 'array' }>;
      return { get: () => array.items[i], set: (v) => (array.items[i] = v), type: array.elem };
    }
    throw runtimeError('The left side of an assignment must be a variable.', target.line);
  }

  protected isInstanceField(name: string, frame: Frame): boolean {
    return Boolean(frame.cls?.fields.some((f) => f.name === name && !f.isStatic));
  }

  protected checkIndex(arr: JValue, iv: JValue, line: number): number {
    if (arr.t === 'null') throw runtimeError('java.lang.NullPointerException: the array is null.', line);
    if (arr.t !== 'array') throw runtimeError(`Square brackets need an array, but this is a ${describeType(arr)}. For a String, use charAt.`, line);
    if (iv.t !== 'int' && iv.t !== 'char' && iv.t !== 'byte' && iv.t !== 'short') {
      throw runtimeError(`An array index must be an int, but this is a ${describeType(iv)}.`, line);
    }
    const i = iv.v;
    if (i < 0 || i >= arr.items.length) throw runtimeError(`java.lang.ArrayIndexOutOfBoundsException: Index ${i} out of bounds for length ${arr.items.length}`, line);
    return i;
  }

  protected *eval(e: Expr, frame: Frame): Gen<JValue> {
    switch (e.k) {
      case 'lit':
        if (e.t === 'null') return NULL;
        if (e.t === 'String') return { t: 'String', v: e.v as string };
        if (e.t === 'boolean') return bool(e.v as boolean);
        if (e.t === 'long') return { t: 'long', v: e.v as bigint };
        return { t: e.t, v: e.v as number };
      case 'name': {
        const slot = this.lookup(e.name, frame);
        if (slot) {
          if (slot.value === UNSET) throw runtimeError(`Variable ${e.name} might not have been initialized. Give it a value before using it.`, e.line);
          return slot.value;
        }
        if (this.isInstanceField(e.name, frame)) throw runtimeError(`The instance variable ${e.name} cannot be used from a static method.`, e.line);
        throw runtimeError(`Cannot find the variable "${e.name}". It may not be declared, or may be out of scope here.`, e.line);
      }
      case 'this':
        if (!frame.self) throw runtimeError('"this" cannot be used in a static method.', e.line);
        return frame.self;
      case 'field':
        return yield* this.evalField(e, frame);
      case 'index': {
        const arr = yield* this.eval(e.target, frame);
        const iv = yield* this.eval(e.index, frame);
        const i = this.checkIndex(arr, iv, e.line);
        return (arr as Extract<JValue, { t: 'array' }>).items[i];
      }
      case 'call':
        return yield* this.evalCall(e, frame);
      case 'new':
        return yield* this.evalNew(e, frame);
      case 'newarray':
        return yield* this.evalNewArray(e, frame);
      case 'arraylit':
        throw runtimeError('A { } list can only appear where an array variable is being initialized.', e.line);
      case 'unary': {
        const v = yield* this.eval(e.expr, frame);
        if (e.op === '!') return bool(!this.truth(v, e.line));
        if (!isNumeric(v)) throw runtimeError(`The operator ${e.op} needs a number, but this is a ${describeType(v)}.`, e.line);
        if (e.op === '+') return v.t === 'char' || v.t === 'byte' || v.t === 'short' ? int(v.v) : v;
        if (e.op === '~') {
          if (v.t === 'long') return { t: 'long', v: ~v.v };
          if (v.t === 'double' || v.t === 'float') throw runtimeError('The operator ~ needs an integer.', e.line);
          return int(~(v.v as number));
        }
        if (v.t === 'long') return { t: 'long', v: BigInt.asIntN(64, -v.v) };
        if (v.t === 'double') return dbl(-v.v);
        if (v.t === 'float') return { t: 'float', v: -v.v };
        return int(-(v.v as number));
      }
      case 'incdec': {
        const lv = yield* this.lvalue(e.target, frame);
        const before = lv.get();
        if (before === UNSET) throw runtimeError('This variable might not have been initialized.', e.line);
        if (!isNumeric(before)) throw runtimeError(`${e.op} needs a number, but this is a ${describeType(before)}.`, e.line);
        const after = castTo(arithmetic(e.op === '++' ? '+' : '-', before, int(1), e.line), lv.type, e.line);
        lv.set(after);
        return e.prefix ? after : before;
      }
      case 'binary':
        return yield* this.evalBinary(e, frame);
      case 'assign':
        return yield* this.evalAssign(e, frame);
      case 'ternary': {
        const c = this.truth(yield* this.eval(e.cond, frame), e.line);
        const a = yield* this.eval(c ? e.a : e.b, frame);
        return a;
      }
      case 'cast':
        return castTo(yield* this.eval(e.expr, frame), e.type, e.line);
    }
  }

  protected *evalBinary(e: Extract<Expr, { k: 'binary' }>, frame: Frame): Gen<JValue> {
    if (e.op === '&&') {
      if (!this.truth(yield* this.eval(e.a, frame), e.line)) return bool(false);
      return bool(this.truth(yield* this.eval(e.b, frame), e.line));
    }
    if (e.op === '||') {
      if (this.truth(yield* this.eval(e.a, frame), e.line)) return bool(true);
      return bool(this.truth(yield* this.eval(e.b, frame), e.line));
    }
    const a = yield* this.eval(e.a, frame);
    const b = yield* this.eval(e.b, frame);
    return this.binary(e.op, a, b, e.line);
  }

  protected binary(op: string, a: JValue, b: JValue, line: number): JValue {
    switch (op) {
      case '+':
        if (a.t === 'String' || b.t === 'String') return str(toJavaString(a) + toJavaString(b));
        return arithmetic(op, a, b, line);
      case '-':
      case '*':
      case '/':
      case '%':
        return arithmetic(op, a, b, line);
      case '==':
        return bool(javaEquals(a, b, line));
      case '!=':
        return bool(!javaEquals(a, b, line));
      case '<':
      case '>':
      case '<=':
      case '>=':
        return bool(compare(op, a, b, line));
      default:
        return bitwise(op, a, b, line);
    }
  }

  protected *evalAssign(e: Extract<Expr, { k: 'assign' }>, frame: Frame): Gen<JValue> {
    const lv = yield* this.lvalue(e.target, frame);
    if (e.op === '=') {
      const value = e.value.k === 'arraylit' ? yield* this.evalInit(e.value, lv.type, frame) : assignConvert(yield* this.eval(e.value, frame), lv.type, e.line);
      lv.set(value);
      return value;
    }
    const before = lv.get();
    if (before === UNSET) throw runtimeError('This variable might not have been initialized.', e.line);
    const right = yield* this.eval(e.value, frame);
    const op = e.op.slice(0, -1);
    const combined = this.binary(op, before, right, e.line);
    // Compound assignment casts back to the variable's type, as Java does.
    const value = lv.type.dims === 0 && isPrimitiveName(lv.type.name) ? castTo(combined, lv.type, e.line) : assignConvert(combined, lv.type, e.line);
    lv.set(value);
    return value;
  }

  protected *evalField(e: Extract<Expr, { k: 'field' }>, frame: Frame): Gen<JValue> {
    if (e.target.k === 'name' && !this.lookup(e.target.name, frame)) {
      const clsName = e.target.name;
      if (this.statics.has(clsName)) {
        const slot = this.statics.get(clsName)!.get(e.name);
        if (!slot) throw runtimeError(`Class ${clsName} has no static variable "${e.name}".`, e.line);
        return slot.value;
      }
      const builtin = staticField(clsName, e.name);
      if (builtin) return builtin;
      if (clsName === 'System' && (e.name === 'in' || e.name === 'out' || e.name === 'err')) {
        return { t: 'native', kind: `System.${e.name}`, id: 1, state: {} };
      }
      if (/^[A-Z]/.test(clsName)) throw runtimeError(`${clsName}.${e.name} is not supported in this tracer.`, e.line);
      throw runtimeError(`Cannot find the variable "${clsName}".`, e.target.line);
    }
    const obj = yield* this.eval(e.target, frame);
    if (obj.t === 'null') throw runtimeError(`java.lang.NullPointerException: cannot read "${e.name}" of null.`, e.line);
    if (obj.t === 'array') {
      if (e.name === 'length') return int(obj.items.length);
      throw runtimeError(`Arrays have no variable "${e.name}". Did you mean length?`, e.line);
    }
    if (obj.t === 'object') {
      const slot = obj.fields.get(e.name) ?? this.statics.get(obj.cls)?.get(e.name);
      if (!slot) throw runtimeError(`Class ${obj.cls} has no variable "${e.name}".`, e.line);
      return slot.value;
    }
    if (obj.t === 'String' && e.name === 'length') throw runtimeError('For a String, length is a method: use length().', e.line);
    throw runtimeError(`A ${describeType(obj)} has no variable "${e.name}".`, e.line);
  }

  protected *evalArgs(args: Expr[], frame: Frame): Gen<JValue[]> {
    const out: JValue[] = [];
    for (const a of args) out.push(yield* this.eval(a, frame));
    return out;
  }

  protected *evalCall(e: Extract<Expr, { k: 'call' }>, frame: Frame): Gen<JValue> {
    // System.out.println and friends
    if (e.target?.k === 'field' && e.target.target.k === 'name' && e.target.target.name === 'System' && (e.target.name === 'out' || e.target.name === 'err') && !this.lookup('System', frame)) {
      const args = yield* this.evalArgs(e.args, frame);
      return systemOut(e.name, args, e.line, (text, line) => this.print(text, line));
    }
    if (e.target === null) {
      const args = yield* this.evalArgs(e.args, frame);
      if (!frame.cls) throw runtimeError(`Cannot find the method ${e.name}.`, e.line);
      const method = this.resolve(frame.cls, e.name, args, e.line);
      if (!method.isStatic && !frame.self) throw runtimeError(`The instance method ${e.name} cannot be called from a static method. Create an object first.`, e.line);
      return yield* this.invoke(method, args, method.isStatic ? null : frame.self, e.line);
    }
    // Class.method(...): a name that is not a variable.
    if (e.target.k === 'name' && !this.lookup(e.target.name, frame)) {
      const clsName = e.target.name;
      const args = yield* this.evalArgs(e.args, frame);
      const user = this.classes.get(clsName);
      if (user) {
        const method = this.resolve(user, e.name, args, e.line);
        if (!method.isStatic) throw runtimeError(`${e.name} is not static, so it must be called on an object of ${clsName}.`, e.line);
        return yield* this.invoke(method, args, null, e.line);
      }
      return callBuiltin(clsName, e.name, args, e.line);
    }
    const target = yield* this.eval(e.target, frame);
    const args = yield* this.evalArgs(e.args, frame);
    return yield* this.callOn(target, e.name, args, e.line);
  }

  protected *callOn(target: JValue, name: string, args: JValue[], line: number): Gen<JValue> {
    switch (target.t) {
      case 'null':
        throw runtimeError(`java.lang.NullPointerException: cannot call ${name}() on null.`, line);
      case 'String':
        return callString(target.v, name, args, line);
      case 'object': {
        const cls = this.classes.get(target.cls)!;
        if (name === 'toString' && !cls.methods.some((m) => m.name === 'toString')) return str(toJavaString(target));
        if (name === 'equals' && !cls.methods.some((m) => m.name === 'equals')) return bool(target === args[0]);
        const method = this.resolve(cls, name, args, line);
        return yield* this.invoke(method, args, method.isStatic ? null : target, line);
      }
      case 'array':
        if (name === 'clone') return { ...target, items: [...target.items], id: nextId() };
        if (name === 'length') throw runtimeError('For an array, length is a variable: use length without brackets.', line);
        throw runtimeError(`Arrays have no method ${name}.`, line);
      case 'native':
        return this.callNative(target, name, args, line);
      default:
        throw runtimeError(`A ${describeType(target)} has no methods. It is a primitive value.`, line);
    }
  }

  protected callNative(target: Extract<JValue, { t: 'native' }>, name: string, args: JValue[], line: number): JValue {
    switch (target.kind) {
      case 'StringBuffer':
      case 'StringBuilder':
        return callBuffer(target, name, args, line);
      case 'Scanner':
        return this.input.scanner(name, line);
      case 'BufferedReader':
      case 'InputStreamReader':
        if (name === 'readLine') return this.input.readLine(line);
        if (name === 'close') return VOID;
        throw runtimeError(`${target.kind}.${name} is not supported in this tracer.`, line);
      default:
        throw runtimeError(`${target.kind}.${name} is not supported in this tracer.`, line);
    }
  }

  protected resolve(cls: ClassDecl, name: string, args: JValue[], line: number): MethodDecl {
    const named = cls.methods.filter((m) => m.name === name);
    if (!named.length) throw runtimeError(`Class ${cls.name} has no method called ${name}.`, line);
    return bestOverload(named, args, `${name}`, line);
  }

  protected *evalNew(e: Extract<Expr, { k: 'new' }>, frame: Frame): Gen<JValue> {
    const args = yield* this.evalArgs(e.args, frame);
    const cls = this.classes.get(e.cls);
    if (!cls) {
      switch (e.cls) {
        case 'Scanner':
        case 'InputStreamReader':
        case 'BufferedReader':
          return { t: 'native', kind: e.cls, id: nextId(), state: {} };
        case 'StringBuffer':
        case 'StringBuilder': {
          const init = args[0];
          return { t: 'native', kind: e.cls, id: nextId(), state: { text: init && init.t === 'String' ? init.v : '' } };
        }
        case 'String':
          if (!args.length) return str('');
          if (args[0].t === 'String') return { t: 'String', v: args[0].v };
          if (args[0].t === 'array') return str(args[0].items.map(toJavaString).join(''));
          throw runtimeError('This form of new String is not supported in this tracer.', e.line);
        case 'Integer':
        case 'Double':
          return args[0];
        default:
          throw runtimeError(`The class ${e.cls} is not supported in this tracer. ArrayList and other collections are outside the ISC subset here.`, e.line);
      }
    }
    const obj: Extract<JValue, { t: 'object' }> = { t: 'object', cls: cls.name, fields: new Map(), id: nextId() };
    for (const f of cls.fields) if (!f.isStatic) obj.fields.set(f.name, { type: f.type, value: defaultValue(f.type) });
    // Field initializers run first, then the constructor.
    const initFrame: Frame = { method: null, name: `new ${cls.name}`, cls, self: obj, scopes: [{ vars: new Map() }], line: e.line, loops: 0 };
    for (const f of cls.fields) {
      if (!f.isStatic && f.init) obj.fields.get(f.name)!.value = yield* this.evalInit(f.init, f.type, initFrame);
    }
    if (!cls.ctors.length) {
      if (args.length) throw runtimeError(`Class ${cls.name} has no constructor taking ${args.length} argument${args.length === 1 ? '' : 's'}.`, e.line);
      return obj;
    }
    const ctor = bestOverload(cls.ctors, args, `The constructor ${cls.name}`, e.line);
    yield* this.invoke(ctor, args, obj, e.line);
    return obj;
  }

  protected *evalNewArray(e: Extract<Expr, { k: 'newarray' }>, frame: Frame): Gen<JValue> {
    if (e.init) {
      if (e.init.k !== 'arraylit') throw runtimeError('Expected a { } list here.', e.line);
      return yield* this.arrayFromList(e.init, { name: e.elem, dims: e.extraDims - 1 + e.sizes.length }, frame);
    }
    const sizes: number[] = [];
    for (const s of e.sizes) {
      const v = yield* this.eval(s, frame);
      if (v.t !== 'int' && v.t !== 'char' && v.t !== 'byte' && v.t !== 'short') throw runtimeError(`An array size must be an int, but this is a ${describeType(v)}.`, e.line);
      if (v.v < 0) throw runtimeError(`java.lang.NegativeArraySizeException: ${v.v}`, e.line);
      sizes.push(v.v);
    }
    const build = (level: number): JValue => {
      const remaining = sizes.length - level - 1 + e.extraDims;
      const elem: TypeRef = { name: e.elem, dims: remaining };
      const n = sizes[level];
      if (n > MAX_ARRAY) throw runtimeError(`An array of ${n} elements is too large for this tracer.`, e.line);
      const items: JValue[] = [];
      for (let i = 0; i < n; i++) items.push(level + 1 < sizes.length ? build(level + 1) : defaultValue(elem));
      return { t: 'array', elem, items, id: nextId() };
    };
    return build(0);
  }
}
