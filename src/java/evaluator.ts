// Evaluates expressions: names, arithmetic, calls, objects and arrays. Statements and
// the program's overall run are in interp.ts.
import type { ClassDecl, Expr, MethodDecl, Program, TypeRef } from './ast';
import { callBuiltin, systemOut } from './builtins';
import { ProgramInput } from './input';
import { JavaError } from './lexer';
import { ClassTable, OBJECT_METHODS } from './classes';
import { bestOverload, type OverloadContext } from './overloads';
import { MAX_ARRAY, MAX_OUTPUT, UNSET, type Frame, type Gen } from './runtime';
import { conditionalType, isConstant, staticType, type TypeScope } from './static-types';
import { callBuffer, callString, callTokenizer, nextId, staticField, tokenize } from './stdlib';
import { arithmetic, assignConvert, bitwise, bool, castTo, compare, dbl, defaultValue, describeType, int, isNumeric, isPrimitiveName, javaEquals, NULL, runtimeError, str, toJavaString, typeName, VOID, type JValue, type Slot } from './values';

/** These return the same object when nothing changed, which == can tell apart. */
const SAME_WHEN_UNCHANGED = new Set(['toString', 'trim', 'strip', 'substring', 'concat', 'replace', 'toUpperCase', 'toLowerCase']);

export abstract class Evaluator {
  protected classes = new Map<string, ClassDecl>();
  protected statics = new Map<string, Map<string, Slot>>();
  protected frames: Frame[] = [];
  protected table = new ClassTable(this.classes);
  protected input: ProgramInput;
  /** String literals with the same text are one object, so "a" == "a" is true. */
  private internedStrings = new Map<string, JValue>();
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

  protected interned(text: string): JValue {
    let value = this.internedStrings.get(text);
    if (!value) {
      value = str(text);
      this.internedStrings.set(text, value);
    }
    return value;
  }

  /** Java calls an object's toString wherever it needs text, and the object's own class decides which one. */
  protected *textOf(v: JValue, line: number): Gen<string> {
    const method = v.t === 'object' ? this.table.concrete(v.cls, 'toString') : undefined;
    return toJavaString(method ? yield* this.invoke(method, [], v as Extract<JValue, { t: 'object' }>, line) : v);
  }

  /** The same for values going to the library, which can't call back into the program. */
  protected *withText(args: JValue[], line: number, intoArrays = false): Gen<JValue[]> {
    const out: JValue[] = [];
    for (const v of args) {
      if (v.t === 'object') out.push(str(yield* this.textOf(v, line)));
      else if (intoArrays && v.t === 'array') out.push({ ...v, items: yield* this.withText(v.items, line, true) });
      else out.push(v);
    }
    return out;
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
    this.checkAssignable(e, type, frame);
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
    if (!frame.cls) return null;
    // A field is found from the class whose code is running, not the object's own class.
    const found = this.table.field(frame.cls, name);
    if (!found) return null;
    if (found.field.access === 'private' && found.owner !== frame.cls) throw runtimeError(`${name} has private access in ${found.owner.name}.`, frame.line);
    if (found.field.isStatic) return this.statics.get(found.owner.name)?.get(name) ?? null;
    return frame.self ? this.instanceSlot(frame.self, found.owner, name) : null;
  }

  /** A field of an object, as declared by one class. A subclass's field of the same name is a separate variable. */
  protected instanceSlot(obj: Extract<JValue, { t: 'object' }>, owner: ClassDecl, name: string): Slot | null {
    const slot = obj.fields.get(name);
    if (slot?.owner === owner.name) return slot;
    return obj.fields.get(`${owner.name}.${name}`) ?? slot ?? null;
  }

  protected typeScope(frame: Frame): TypeScope {
    return { lookup: (name) => this.lookup(name, frame), cls: frame.cls, classes: this.classes };
  }

  /** The class whose members an expression can reach: its type as written, as Java checks, or else its runtime class. */
  protected reachableFrom(target: Expr, obj: Extract<JValue, { t: 'object' }>, frame: Frame): { start: ClassDecl; declared: string | null } {
    if (target.k === 'super') {
      const parent = frame.cls ? this.table.superOf(frame.cls) : null;
      return { start: parent ?? this.classes.get(obj.cls)!, declared: parent?.name ?? 'Object' };
    }
    const declared = staticType(target, this.typeScope(frame));
    const cls = declared ? this.classes.get(declared) : undefined;
    return { start: cls && obj.types.has(cls.name) ? cls : this.classes.get(obj.cls)!, declared };
  }

  /** A field reached through an object, with the checks javac makes. */
  protected fieldThrough(target: Expr, obj: Extract<JValue, { t: 'object' }>, name: string, line: number, frame: Frame): Slot {
    const { start, declared } = this.reachableFrom(target, obj, frame);
    if (declared === 'Object') throw runtimeError(`The class Object has no variable "${name}".${this.table.field(this.classes.get(obj.cls)!, name) ? ` This object is really a ${obj.cls}, so cast it first.` : ''}`, line);
    const found = this.table.field(start, name);
    if (!found) {
      const hint = start.name !== obj.cls && this.table.field(this.classes.get(obj.cls)!, name) ? ` This object is really a ${obj.cls}, so cast it first: ((${obj.cls}) x).${name}.` : '';
      throw runtimeError(`Class ${start.name} has no variable "${name}".${hint}`, line);
    }
    if (found.field.access === 'private' && found.owner !== frame.cls) throw runtimeError(`${name} has private access in ${found.owner.name}.`, line);
    const slot = found.field.isStatic ? this.statics.get(found.owner.name)?.get(name) : this.instanceSlot(obj, found.owner, name);
    if (!slot) throw runtimeError(`Class ${start.name} has no variable "${name}".`, line);
    return slot;
  }

  /** A static field, which a subclass or an implementing class inherits. */
  protected staticThrough(clsName: string, name: string, line: number, frame: Frame): Slot {
    const cls = this.classes.get(clsName)!;
    const found = this.table.field(cls, name);
    const slot = found?.field.isStatic ? this.statics.get(found.owner.name)?.get(name) : undefined;
    if (!found || !slot) throw runtimeError(`Class ${clsName} has no static variable "${name}".`, line);
    if (found.field.access === 'private' && found.owner !== frame.cls) throw runtimeError(`${name} has private access in ${found.owner.name}.`, line);
    return slot;
  }

  /** Javac rejects assigning a general type to a specific one without a cast, even when the object would fit. */
  protected checkAssignable(e: Expr, type: TypeRef, frame: Frame): void {
    if (type.dims || !this.classes.has(type.name)) return;
    const from = staticType(e, this.typeScope(frame));
    if (from && from !== 'Object' && !this.classes.has(from)) return;
    if (from && !this.table.isSubtype(from, type.name)) {
      throw runtimeError(`Incompatible types: ${from} cannot be converted to ${type.name}. A variable's declared type decides this, so a cast is needed: (${type.name}).`, e.line);
    }
  }

  /** Javac rejects a cast or instanceof between two classes that can never be the same object. */
  protected checkRelated(e: Expr, type: TypeRef, frame: Frame, what: string): void {
    if (type.dims) return;
    const from = staticType(e, this.typeScope(frame));
    const a = from ? this.classes.get(from) : undefined;
    const b = this.classes.get(type.name);
    if (!a || !b || a.isInterface || b.isInterface) return;
    if (!this.table.isSubtype(a.name, b.name) && !this.table.isSubtype(b.name, a.name)) {
      throw runtimeError(`${a.name} and ${b.name} are unrelated classes, so ${what} is not allowed.`, e.line);
    }
  }

  protected overloadContext(argTypes?: (string | null)[]): OverloadContext {
    return { distance: (sub, sup) => this.table.distance(sub, sup), isClass: (name) => this.classes.has(name), argTypes };
  }

  /** Chooses an overload from what the type as written offers. A private method only counts inside its own class. */
  protected pick(start: ClassDecl, name: string, args: JValue[], argExprs: Expr[], frame: Frame, line: number, runtime?: string): MethodDecl {
    const visible = this.table.visible(start, name);
    const usable = visible.filter((m) => m.access !== 'private' || m.className === frame.cls?.name);
    if (!usable.length) {
      if (visible.length) throw runtimeError(`${name}() has private access in ${visible[0].className}.`, line);
      const hint = runtime && runtime !== start.name && this.table.visible(this.classes.get(runtime)!, name).length ? ` This object is really a ${runtime}, so cast it first: ((${runtime}) x).${name}(...).` : '';
      throw runtimeError(`Class ${start.name} has no method called ${name}.${hint}`, line);
    }
    const scope = this.typeScope(frame);
    return bestOverload(usable, args, name, line, this.overloadContext(argExprs.map((a) => staticType(a, scope))));
  }

  /** What every class gets from Object, when it hasn't written its own. */
  protected objectMethod(target: Extract<JValue, { t: 'object' }>, name: string, args: JValue[], line: number): JValue {
    switch (name) {
      case 'toString':
        return str(toJavaString(target));
      case 'equals':
        return bool(target === args[0]);
      case 'hashCode':
        return int(target.id);
      case 'getClass':
        return { t: 'native', kind: 'Class', id: nextId(), state: { text: target.cls } };
      default:
        throw runtimeError(`Class ${target.cls} has no method called ${name}.`, line);
    }
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
        const slot = this.staticThrough(target.target.name, target.name, target.line, frame);
        return { get: () => slot.value, set: (v) => (slot.value = v), type: slot.type };
      }
      const obj = yield* this.eval(target.target, frame);
      if (obj.t === 'null') throw runtimeError(`java.lang.NullPointerException: cannot set "${target.name}" on null.`, target.line);
      if (obj.t === 'object') {
        const slot = this.fieldThrough(target.target, obj, target.name, target.line, frame);
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
    const found = frame.cls ? this.table.field(frame.cls, name) : null;
    return Boolean(found && !found.field.isStatic);
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
        if (e.t === 'String') return this.interned(e.v as string);
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
      case 'super':
        if (!frame.self) throw runtimeError('"super" cannot be used in a static method.', e.line);
        return frame.self;
      case 'ctorcall':
        throw runtimeError(`${e.kind}(...) must be the first statement of a constructor.`, e.line);
      case 'instanceof': {
        const v = yield* this.eval(e.expr, frame);
        if (isNumeric(v) || v.t === 'boolean') throw runtimeError(`instanceof needs an object, but this is a ${describeType(v)}.`, e.line);
        this.checkRelated(e.expr, e.type, frame, 'this instanceof test');
        if (v.t === 'null') return bool(false);
        if (e.type.dims > 0) return bool(v.t === 'array' && typeName(v.elem) === typeName({ name: e.type.name, dims: e.type.dims - 1 }));
        if (e.type.name === 'Object') return bool(true);
        if (v.t === 'object') return bool(v.types.has(e.type.name));
        if (v.t === 'String') return bool(e.type.name === 'String');
        if (v.t === 'native') return bool(v.kind === e.type.name);
        return bool(false);
      }
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
        const taken = c ? e.a : e.b;
        const value = yield* this.eval(taken, frame);
        if (!isNumeric(value)) return value;
        const type = conditionalType(value.t, taken, c ? e.b : e.a, this.typeScope(frame));
        return type && type !== value.t ? castTo(value, { name: type, dims: 0 }, e.line) : value;
      }
      case 'cast':
        this.checkRelated(e.expr, e.type, frame, 'this cast');
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
    if (e.op === '+' && (a.t === 'String' || b.t === 'String')) {
      const text = (yield* this.textOf(a, e.line)) + (yield* this.textOf(b, e.line));
      return isConstant(e) ? this.interned(text) : str(text);
    }
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
      if (e.value.k !== 'arraylit') this.checkAssignable(e.value, lv.type, frame);
      const value = e.value.k === 'arraylit' ? yield* this.evalInit(e.value, lv.type, frame) : assignConvert(yield* this.eval(e.value, frame), lv.type, e.line);
      lv.set(value);
      return value;
    }
    const before = lv.get();
    if (before === UNSET) throw runtimeError('This variable might not have been initialized.', e.line);
    const right = yield* this.eval(e.value, frame);
    const op = e.op.slice(0, -1);
    const combined = op === '+' && (before.t === 'String' || right.t === 'String') ? str((yield* this.textOf(before, e.line)) + (yield* this.textOf(right, e.line))) : this.binary(op, before, right, e.line);
    // Compound assignment casts back to the variable's type, as Java does.
    const value = lv.type.dims === 0 && isPrimitiveName(lv.type.name) ? castTo(combined, lv.type, e.line) : assignConvert(combined, lv.type, e.line);
    lv.set(value);
    return value;
  }

  protected *evalField(e: Extract<Expr, { k: 'field' }>, frame: Frame): Gen<JValue> {
    if (e.target.k === 'name' && !this.lookup(e.target.name, frame)) {
      const clsName = e.target.name;
      if (this.statics.has(clsName)) return this.staticThrough(clsName, e.name, e.line, frame).value;
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
    if (obj.t === 'object') return this.fieldThrough(e.target, obj, e.name, e.line, frame).value;
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
      const args = yield* this.withText(yield* this.evalArgs(e.args, frame), e.line);
      return systemOut(e.name, args, e.line, (text, line) => this.print(text, line));
    }
    if (e.target === null) {
      const args = yield* this.evalArgs(e.args, frame);
      if (!frame.cls) throw runtimeError(`Cannot find the method ${e.name}.`, e.line);
      if (OBJECT_METHODS.has(e.name) && frame.self && !this.table.visible(frame.cls, e.name).length) return yield* this.callOn(frame.self, e.name, args, e.args, e.line, frame, null);
      const method = this.pick(frame.cls, e.name, args, e.args, frame, e.line);
      if (!method.isStatic && !frame.self) throw runtimeError(`The instance method ${e.name} cannot be called from a static method. Create an object first.`, e.line);
      const actual = frame.self ? this.table.dispatch(method, frame.self.cls) : method;
      return yield* this.invoke(actual, args, actual.isStatic ? null : frame.self, e.line);
    }
    // super.method(...) starts from the parent, and never dispatches back down.
    if (e.target.k === 'super') {
      const args = yield* this.evalArgs(e.args, frame);
      if (!frame.self || !frame.cls) throw runtimeError('"super" cannot be used in a static method.', e.line);
      const parent = this.table.superOf(frame.cls);
      if (OBJECT_METHODS.has(e.name) && (!parent || !this.table.visible(parent, e.name).length)) return this.objectMethod(frame.self, e.name, args, e.line);
      if (!parent) throw runtimeError(`${frame.cls.name} has no superclass with a method called ${e.name}.`, e.line);
      const method = this.pick(parent, e.name, args, e.args, frame, e.line);
      if (method.isAbstract) throw runtimeError(`${e.name}() is abstract in ${method.className}, so super cannot call it.`, e.line);
      return yield* this.invoke(method, args, method.isStatic ? null : frame.self, e.line);
    }
    // Class.method(...): a name that is not a variable.
    if (e.target.k === 'name' && !this.lookup(e.target.name, frame)) {
      const clsName = e.target.name;
      const args = yield* this.evalArgs(e.args, frame);
      const user = this.classes.get(clsName);
      if (user) {
        const method = this.pick(user, e.name, args, e.args, frame, e.line);
        if (!method.isStatic) throw runtimeError(`${e.name} is not static, so it must be called on an object of ${clsName}.`, e.line);
        return yield* this.invoke(method, args, null, e.line);
      }
      if (clsName === 'String' || (clsName === 'Arrays' && /toString$/i.test(e.name))) {
        return callBuiltin(clsName, e.name, yield* this.withText(args, e.line, clsName === 'Arrays'), e.line);
      }
      return callBuiltin(clsName, e.name, args, e.line);
    }
    const target = yield* this.eval(e.target, frame);
    const args = yield* this.evalArgs(e.args, frame);
    return yield* this.callOn(target, e.name, args, e.args, e.line, frame, e.target);
  }

  protected *callOn(target: JValue, name: string, args: JValue[], argExprs: Expr[], line: number, frame: Frame, targetExpr: Expr | null): Gen<JValue> {
    switch (target.t) {
      case 'null':
        throw runtimeError(`java.lang.NullPointerException: cannot call ${name}() on null.`, line);
      case 'String': {
        if (name === 'intern') return this.interned(target.v);
        const result = callString(target.v, name, args, line);
        return result.t === 'String' && result.v === target.v && SAME_WHEN_UNCHANGED.has(name) ? target : result;
      }
      case 'object': {
        const runtime = this.classes.get(target.cls)!;
        const { start, declared } = targetExpr ? this.reachableFrom(targetExpr, target, frame) : { start: runtime, declared: null };
        if (OBJECT_METHODS.has(name) && (declared === 'Object' || !this.table.visible(start, name).length)) {
          // Reached through a type that doesn't declare it, so Object's version is what's called, and it may be overridden.
          const own = this.table.visible(runtime, name).filter((m) => m.params.length === args.length);
          if (own.length) {
            const method = bestOverload(own, args, name, line, this.overloadContext());
            return yield* this.invoke(method, args, target, line);
          }
          return this.objectMethod(target, name, args, line);
        }
        if (declared === 'Object') throw runtimeError(`The class Object has no method called ${name}. This object is really a ${target.cls}, so cast it first: ((${target.cls}) x).${name}(...).`, line);
        const method = this.pick(start, name, args, argExprs, frame, line, target.cls);
        const actual = this.table.dispatch(method, target.cls);
        return yield* this.invoke(actual, args, actual.isStatic ? null : target, line);
      }
      case 'array':
        if (name === 'clone') return { ...target, items: [...target.items], id: nextId() };
        if (name === 'length') throw runtimeError('For an array, length is a variable: use length without brackets.', line);
        throw runtimeError(`Arrays have no method ${name}.`, line);
      case 'native':
        return this.callNative(target, name, yield* this.withText(args, line), line);
      default:
        throw runtimeError(`A ${describeType(target)} has no methods. It is a primitive value.`, line);
    }
  }

  protected callNative(target: Extract<JValue, { t: 'native' }>, name: string, args: JValue[], line: number): JValue {
    switch (target.kind) {
      case 'StringBuffer':
      case 'StringBuilder':
        return callBuffer(target, name, args, line);
      case 'Class':
        if (name === 'getName' || name === 'getSimpleName' || name === 'toString') return str(`${name === 'toString' ? 'class ' : ''}${target.state.text}`);
        throw runtimeError(`Class.${name} is not supported in this tracer. getName and getSimpleName are.`, line);
      case 'Scanner':
        return this.input.scanner(name, line);
      case 'StringTokenizer':
        return callTokenizer(target, name, line);
      case 'BufferedReader':
      case 'InputStreamReader':
        if (name === 'readLine') return this.input.readLine(line);
        if (name === 'close') return VOID;
        throw runtimeError(`${target.kind}.${name} is not supported in this tracer.`, line);
      default:
        throw runtimeError(`${target.kind}.${name} is not supported in this tracer.`, line);
    }
  }

  protected *evalNew(e: Extract<Expr, { k: 'new' }>, frame: Frame): Gen<JValue> {
    const args = yield* this.evalArgs(e.args, frame);
    const cls = this.classes.get(e.cls);
    if (cls?.isInterface) throw runtimeError(`${cls.name} is an interface, so it cannot be created with new. Create an object of a class that implements it.`, e.line);
    if (cls?.isAbstract) throw runtimeError(`${cls.name} is abstract, so it cannot be created with new. Create an object of a subclass.`, e.line);
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
        case 'StringTokenizer':
          if (args[0]?.t !== 'String') throw runtimeError('new StringTokenizer needs the text to split.', e.line);
          return { t: 'native', kind: e.cls, id: nextId(), state: { tokens: tokenize(args[0].v, args[1]?.t === 'String' ? args[1].v : undefined), next: 0 } };
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
    const obj: Extract<JValue, { t: 'object' }> = { t: 'object', cls: cls.name, types: this.table.supertypes(cls.name), fields: new Map(), id: nextId() };
    // Every field up the hierarchy, parents first. A hidden field stays, under its class's name.
    const lineage: ClassDecl[] = [];
    for (let c: ClassDecl | null = cls; c; c = this.table.superOf(c)) lineage.unshift(c);
    for (const c of lineage) {
      for (const f of c.fields) {
        if (f.isStatic) continue;
        const hidden = obj.fields.get(f.name);
        if (hidden) {
          obj.fields.delete(f.name);
          obj.fields.set(`${hidden.owner}.${f.name}`, hidden);
        }
        obj.fields.set(f.name, { type: f.type, value: defaultValue(f.type), owner: c.name });
      }
    }
    const ctor = this.constructorFor(cls, args, e.args, frame, e.line);
    if (ctor.access === 'private' && frame.cls !== cls) throw runtimeError(`The constructor of ${cls.name} is private.`, e.line);
    yield* this.invoke(ctor, args, obj, e.line);
    return obj;
  }

  /** The constructor a list of arguments means, or the one javac would supply. */
  protected constructorFor(cls: ClassDecl, args: JValue[], argExprs: Expr[], frame: Frame, line: number): MethodDecl {
    if (!cls.ctors.length) {
      if (args.length) throw runtimeError(`Class ${cls.name} has no constructor taking ${args.length} argument${args.length === 1 ? '' : 's'}.`, line);
      return this.table.defaultConstructor(cls);
    }
    const scope = this.typeScope(frame);
    return bestOverload(cls.ctors, args, `The constructor ${cls.name}`, line, this.overloadContext(argExprs.map((a) => staticType(a, scope))));
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
