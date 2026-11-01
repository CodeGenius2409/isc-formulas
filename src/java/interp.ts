// A step-through interpreter. Execution is written with generators so that it can
// pause before every statement, recording exactly what a dry run would show.
import type { ClassDecl, Expr, MethodDecl, Program, Stmt, TypeRef } from './ast';
import { JavaError } from './lexer';
import { parseJava } from './parser';
import { callArrays, callBoolean, callBuffer, callCharacter, callDouble, callInteger, callLong, callMath, callString, callStringStatic, formatPrintf, nextId, resetIds, staticField } from './stdlib';
import { arithmetic, asNumber, assignConvert, bitwise, bool, castTo, compare, defaultValue, describeType, displayValue, dbl, int, isNumeric, isPrimitiveName, javaEquals, NULL, runtimeError, str, toJavaString, typeName, VOID, type JValue, type Slot } from './values';

const MAX_STEPS = 500_000;
const MAX_RECORDED = 20_000;
const MAX_DEPTH = 5000;
/** The panel shows this many of the innermost calls, however deep the recursion goes. */
const MAX_SHOWN_FRAMES = 25;
const MAX_ARRAY = 2_000_000;
const MAX_OUTPUT = 200_000;

export interface VarView {
  name: string;
  type: string;
  value: string;
}

export interface FrameView {
  method: string;
  line: number;
  vars: VarView[];
}

export interface TraceStep {
  line: number;
  /** Innermost last. Very deep recursion keeps only main and the innermost calls. */
  frames: FrameView[];
  /** The real number of calls in progress. */
  depth: number;
  outputLength: number;
  /** How many trace-table rows existed at this step. */
  traceRows: number;
}

export interface TraceRow {
  line: number;
  method: string;
  values: Record<string, string>;
  changed: string[];
  condition?: string;
  output?: string;
}

export interface RunResult {
  steps: TraceStep[];
  output: string;
  error: { message: string; line: number; kind: 'compile' | 'runtime' } | null;
  rows: TraceRow[];
  columns: string[];
  /** True if the program ran longer than can be stepped through. */
  truncated: boolean;
  totalSteps: number;
}

type Signal = { type: 'break' } | { type: 'continue' } | { type: 'return'; value: JValue } | null;

interface Scope {
  vars: Map<string, Slot>;
}

interface Frame {
  method: MethodDecl | null;
  name: string;
  cls: ClassDecl | null;
  self: Extract<JValue, { t: 'object' }> | null;
  scopes: Scope[];
  line: number;
  /** Above 0 while inside a loop, which is when the trace table records. */
  loops: number;
}

/**
 * Control passes back to the driver at each of these: either a statement about to run,
 * or a method to enter. Method bodies run on the driver's own stack instead of inside
 * nested generators, so deep Java recursion cannot use up the JavaScript stack.
 */
type Pause = { line: number; condition?: string; enter?: undefined } | { enter: Gen<void>; line?: undefined; condition?: undefined };
type Gen<T> = Generator<Pause, T, void>;

class StopProgram extends Error {}

class Interpreter {
  private classes = new Map<string, ClassDecl>();
  private statics = new Map<string, Map<string, Slot>>();
  private frames: Frame[] = [];
  output = '';
  private inputTokens: { text: string; pos: number };

  constructor(
    private program: Program,
    input: string,
  ) {
    this.inputTokens = { text: input, pos: 0 };
    for (const c of program.classes) {
      if (this.classes.has(c.name)) throw new JavaError(`There are two classes named ${c.name}.`, c.line);
      this.classes.set(c.name, c);
    }
    this.checkDuplicates();
  }

  private checkDuplicates(): void {
    for (const c of this.program.classes) {
      const seen = new Set<string>();
      for (const m of [...c.methods, ...c.ctors]) {
        const key = `${m.name}(${m.params.map((p) => typeName(p.type)).join(',')})`;
        if (seen.has(key)) throw new JavaError(`${m.name === '<init>' ? c.name : m.name} is defined twice with the same parameters.`, m.line);
        seen.add(key);
      }
    }
  }

  get frameList(): readonly Frame[] {
    return this.frames;
  }

  print(text: string, line: number): void {
    this.output += text;
    if (this.output.length > MAX_OUTPUT) throw runtimeError('This program printed too much, so it was stopped. It may be stuck in a loop.', line);
  }

  /* Input, for Scanner and BufferedReader */

  private nextToken(line: number): string {
    const s = this.inputTokens;
    while (s.pos < s.text.length && /\s/.test(s.text[s.pos])) s.pos++;
    if (s.pos >= s.text.length) throw runtimeError('java.util.NoSuchElementException: the program asked for more input than the Input box holds. Add more values there.', line);
    const start = s.pos;
    while (s.pos < s.text.length && !/\s/.test(s.text[s.pos])) s.pos++;
    return s.text.slice(start, s.pos);
  }

  private hasToken(): boolean {
    return /\S/.test(this.inputTokens.text.slice(this.inputTokens.pos));
  }

  private nextLine(line: number): string {
    const s = this.inputTokens;
    if (s.pos > s.text.length || (s.pos === s.text.length && !s.text.endsWith('\n'))) {
      throw runtimeError('java.util.NoSuchElementException: the program asked for another line, but the Input box has run out.', line);
    }
    const end = s.text.indexOf('\n', s.pos);
    const out = end < 0 ? s.text.slice(s.pos) : s.text.slice(s.pos, end);
    s.pos = end < 0 ? s.text.length + 1 : end + 1;
    return out.replace(/\r$/, '');
  }

  /* Running */

  *run(): Gen<void> {
    for (const c of this.program.classes) {
      const table = new Map<string, Slot>();
      this.statics.set(c.name, table);
      for (const f of c.fields) if (f.isStatic) table.set(f.name, { type: f.type, value: defaultValue(f.type) });
    }
    const boot: Frame = { method: null, name: 'static setup', cls: null, self: null, scopes: [{ vars: new Map() }], line: 0, loops: 0 };
    for (const c of this.program.classes) {
      boot.cls = c;
      for (const f of c.fields) {
        if (f.isStatic && f.init) {
          this.frames = [boot];
          const value = yield* this.evalInit(f.init, f.type, boot);
          this.statics.get(c.name)!.get(f.name)!.value = value;
        }
      }
    }
    this.frames = [];
    const mainClass = this.program.classes.find((c) => c.methods.some((m) => m.name === 'main' && m.isStatic));
    if (!mainClass) throw new JavaError('No main method found. Add: public static void main(String[] args)', this.program.classes[0].line);
    const main = mainClass.methods.find((m) => m.name === 'main' && m.isStatic)!;
    const argv: JValue = { t: 'array', elem: { name: 'String', dims: 0 }, items: [], id: nextId() };
    yield* this.invoke(main, main.params.length ? [argv] : [], null, main.line);
  }

  private *invoke(method: MethodDecl, args: JValue[], self: Frame['self'], line: number): Gen<JValue> {
    let result: JValue = VOID;
    const run = this.runMethod.bind(this);
    const body = (function* (): Gen<void> {
      result = yield* run(method, args, self, line);
    })();
    yield { enter: body };
    return result;
  }

  private *runMethod(method: MethodDecl, args: JValue[], self: Frame['self'], line: number): Gen<JValue> {
    if (this.frames.length >= MAX_DEPTH) {
      throw runtimeError('java.lang.StackOverflowError: too many method calls. A recursive method may be missing its base case.', line);
    }
    const cls = this.classes.get(method.className)!;
    const frame: Frame = {
      method,
      name: `${method.name === '<init>' ? `new ${cls.name}` : method.name}(${args.map((a) => displayValue(a, 2)).join(', ')})`.slice(0, 80),
      cls,
      self,
      scopes: [{ vars: new Map() }],
      line: method.line,
      loops: 0,
    };
    method.params.forEach((p, i) => frame.scopes[0].vars.set(p.name, { type: p.type, value: assignConvert(args[i], p.type, line) }));
    this.frames.push(frame);
    const signal = yield* this.execBlock(method.body, frame, false);
    this.frames.pop();
    if (signal?.type === 'return') return signal.value;
    if (method.name !== '<init>' && method.ret.name !== 'void') {
      throw new JavaError(`Method ${method.name} must return a ${typeName(method.ret)}, but reached its end without one.`, method.line);
    }
    return VOID;
  }

  private *execBlock(body: Stmt[], frame: Frame, newScope = true): Gen<Signal> {
    if (newScope) frame.scopes.push({ vars: new Map() });
    try {
      for (const s of body) {
        const signal = yield* this.exec(s, frame);
        if (signal) return signal;
      }
      return null;
    } finally {
      if (newScope) frame.scopes.pop();
    }
  }

  private *pause(line: number, frame: Frame, condition?: string): Gen<void> {
    frame.line = line;
    yield { line, condition };
  }

  private truth(v: JValue, line: number): boolean {
    if (v.t === 'boolean') return v.v;
    throw runtimeError(`A condition must be true or false, but this is a ${describeType(v)}.`, line);
  }

  private *checkCondition(e: Expr, frame: Frame, line: number): Gen<boolean> {
    const v = yield* this.eval(e, frame);
    const result = this.truth(v, line);
    yield* this.pause(line, frame, String(result));
    return result;
  }

  private *exec(s: Stmt, frame: Frame): Gen<Signal> {
    switch (s.k) {
      case 'block':
        return yield* this.execBlock(s.body, frame);
      case 'empty':
        return null;
      case 'var':
        yield* this.pause(s.line, frame);
        for (const d of s.decls) {
          for (const scope of frame.scopes) {
            if (scope.vars.has(d.name)) throw runtimeError(`Variable ${d.name} is already defined in this method.`, s.line);
          }
          const scope = frame.scopes[frame.scopes.length - 1];
          // Declared but unassigned: reading it is reported, as javac would.
          const slot: Slot = { type: d.type, value: UNSET };
          scope.vars.set(d.name, slot);
          if (d.init) slot.value = yield* this.evalInit(d.init, d.type, frame);
        }
        return null;
      case 'expr':
        yield* this.pause(s.line, frame);
        yield* this.eval(s.expr, frame);
        return null;
      case 'if': {
        yield* this.pause(s.line, frame);
        const c = this.truth(yield* this.eval(s.cond, frame), s.line);
        if (c) return yield* this.execBody(s.then, frame);
        if (s.else) return yield* this.execBody(s.else, frame);
        return null;
      }
      case 'while': {
        frame.loops++;
        try {
          for (;;) {
            yield* this.pause(s.line, frame);
            if (!(yield* this.checkCondition(s.cond, frame, s.line))) return null;
            const signal = yield* this.execBody(s.body, frame);
            if (signal?.type === 'break') return null;
            if (signal?.type === 'return') return signal;
          }
        } finally {
          frame.loops--;
        }
      }
      case 'do': {
        frame.loops++;
        try {
          for (;;) {
            const signal = yield* this.execBody(s.body, frame);
            if (signal?.type === 'break') return null;
            if (signal?.type === 'return') return signal;
            yield* this.pause(s.condLine, frame);
            if (!(yield* this.checkCondition(s.cond, frame, s.condLine))) return null;
          }
        } finally {
          frame.loops--;
        }
      }
      case 'for': {
        frame.scopes.push({ vars: new Map() });
        frame.loops++;
        try {
          for (const init of s.init) yield* this.exec(init, frame);
          for (;;) {
            if (s.cond) {
              yield* this.pause(s.line, frame);
              if (!(yield* this.checkCondition(s.cond, frame, s.line))) return null;
            }
            const signal = yield* this.execBody(s.body, frame);
            if (signal?.type === 'break') return null;
            if (signal?.type === 'return') return signal;
            yield* this.pause(s.line, frame);
            for (const u of s.update) yield* this.eval(u, frame);
          }
        } finally {
          frame.loops--;
          frame.scopes.pop();
        }
      }
      case 'foreach': {
        yield* this.pause(s.line, frame);
        const iter = yield* this.eval(s.iter, frame);
        if (iter.t === 'null') throw runtimeError('java.lang.NullPointerException: the array is null.', s.line);
        if (iter.t !== 'array') throw runtimeError(`A for-each loop needs an array here, but this is a ${describeType(iter)}. Collections are not supported in this tracer.`, s.line);
        frame.scopes.push({ vars: new Map() });
        frame.loops++;
        const slot: Slot = { type: s.type, value: defaultValue(s.type) };
        frame.scopes[frame.scopes.length - 1].vars.set(s.name, slot);
        try {
          for (const item of iter.items) {
            slot.value = assignConvert(item, s.type, s.line);
            yield* this.pause(s.line, frame);
            const signal = yield* this.execBody(s.body, frame);
            if (signal?.type === 'break') return null;
            if (signal?.type === 'return') return signal;
          }
          return null;
        } finally {
          frame.loops--;
          frame.scopes.pop();
        }
      }
      case 'switch':
        return yield* this.execSwitch(s, frame);
      case 'break':
        yield* this.pause(s.line, frame);
        return { type: 'break' };
      case 'continue':
        yield* this.pause(s.line, frame);
        return { type: 'continue' };
      case 'return': {
        yield* this.pause(s.line, frame);
        if (!s.value) return { type: 'return', value: VOID };
        const value = yield* this.eval(s.value, frame);
        const ret = frame.method?.ret;
        if (ret?.name === 'void') throw runtimeError('A void method cannot return a value.', s.line);
        return { type: 'return', value: ret ? assignConvert(value, ret, s.line) : value };
      }
    }
  }

  /** A single statement body still gets its own scope. */
  private *execBody(s: Stmt, frame: Frame): Gen<Signal> {
    if (s.k === 'block') return yield* this.execBlock(s.body, frame);
    frame.scopes.push({ vars: new Map() });
    try {
      return yield* this.exec(s, frame);
    } finally {
      frame.scopes.pop();
    }
  }

  private *execSwitch(s: Extract<Stmt, { k: 'switch' }>, frame: Frame): Gen<Signal> {
    yield* this.pause(s.line, frame);
    const value = yield* this.eval(s.value, frame);
    if (!['int', 'char', 'byte', 'short', 'String'].includes(value.t)) throw runtimeError(`A switch works on int, char and String, but this is a ${describeType(value)}.`, s.line);
    let start = -1;
    for (let i = 0; i < s.cases.length && start < 0; i++) {
      for (const label of s.cases[i].labels) {
        if (label === 'default') continue;
        const v = yield* this.eval(label, frame);
        const same = value.t === 'String' ? v.t === 'String' && v.v === value.v : isNumeric(v) && asNumber(v, s.line) === asNumber(value, s.line);
        if (same) {
          start = i;
          break;
        }
      }
    }
    if (start < 0) start = s.cases.findIndex((c) => c.labels.includes('default'));
    if (start < 0) return null;
    frame.scopes.push({ vars: new Map() });
    try {
      // Execution falls through to later cases until a break, as in Java.
      for (let i = start; i < s.cases.length; i++) {
        for (const stmt of s.cases[i].body) {
          const signal = yield* this.exec(stmt, frame);
          if (signal?.type === 'break') return null;
          if (signal) return signal;
        }
      }
      return null;
    } finally {
      frame.scopes.pop();
    }
  }

  /** An initializer may be a bare { ... } list, which takes its type from the variable. */
  private *evalInit(e: Expr, type: TypeRef, frame: Frame): Gen<JValue> {
    if (e.k === 'arraylit') {
      if (type.dims === 0) throw runtimeError(`A { } list can only initialize an array, but this is a ${typeName(type)}.`, e.line);
      return yield* this.arrayFromList(e, { name: type.name, dims: type.dims - 1 }, frame);
    }
    return assignConvert(yield* this.eval(e, frame), type, e.line);
  }

  private *arrayFromList(e: Extract<Expr, { k: 'arraylit' }>, elem: TypeRef, frame: Frame): Gen<JValue> {
    const items: JValue[] = [];
    for (const item of e.items) items.push(yield* this.evalInit(item, elem, frame));
    return { t: 'array', elem, items, id: nextId() };
  }

  private lookup(name: string, frame: Frame): Slot | null {
    for (let i = frame.scopes.length - 1; i >= 0; i--) {
      const slot = frame.scopes[i].vars.get(name);
      if (slot) return slot;
    }
    const field = frame.self?.fields.get(name);
    if (field) return field;
    if (frame.cls) return this.statics.get(frame.cls.name)?.get(name) ?? null;
    return null;
  }

  private *lvalue(target: Expr, frame: Frame): Gen<{ get: () => JValue; set: (v: JValue) => void; type: TypeRef }> {
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

  private isInstanceField(name: string, frame: Frame): boolean {
    return Boolean(frame.cls?.fields.some((f) => f.name === name && !f.isStatic));
  }

  private checkIndex(arr: JValue, iv: JValue, line: number): number {
    if (arr.t === 'null') throw runtimeError('java.lang.NullPointerException: the array is null.', line);
    if (arr.t !== 'array') throw runtimeError(`Square brackets need an array, but this is a ${describeType(arr)}. For a String, use charAt.`, line);
    if (iv.t !== 'int' && iv.t !== 'char' && iv.t !== 'byte' && iv.t !== 'short') {
      throw runtimeError(`An array index must be an int, but this is a ${describeType(iv)}.`, line);
    }
    const i = iv.v;
    if (i < 0 || i >= arr.items.length) throw runtimeError(`java.lang.ArrayIndexOutOfBoundsException: Index ${i} out of bounds for length ${arr.items.length}`, line);
    return i;
  }

  private *eval(e: Expr, frame: Frame): Gen<JValue> {
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

  private *evalBinary(e: Extract<Expr, { k: 'binary' }>, frame: Frame): Gen<JValue> {
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

  private binary(op: string, a: JValue, b: JValue, line: number): JValue {
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

  private *evalAssign(e: Extract<Expr, { k: 'assign' }>, frame: Frame): Gen<JValue> {
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

  private *evalField(e: Extract<Expr, { k: 'field' }>, frame: Frame): Gen<JValue> {
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

  private *evalArgs(args: Expr[], frame: Frame): Gen<JValue[]> {
    const out: JValue[] = [];
    for (const a of args) out.push(yield* this.eval(a, frame));
    return out;
  }

  private *evalCall(e: Extract<Expr, { k: 'call' }>, frame: Frame): Gen<JValue> {
    // System.out.println and friends
    if (e.target?.k === 'field' && e.target.target.k === 'name' && e.target.target.name === 'System' && (e.target.name === 'out' || e.target.name === 'err') && !this.lookup('System', frame)) {
      const args = yield* this.evalArgs(e.args, frame);
      return this.systemOut(e.name, args, e.line);
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
      return this.callBuiltin(clsName, e.name, args, e.line);
    }
    const target = yield* this.eval(e.target, frame);
    const args = yield* this.evalArgs(e.args, frame);
    return yield* this.callOn(target, e.name, args, e.line);
  }

  private systemOut(name: string, args: JValue[], line: number): JValue {
    switch (name) {
      case 'println':
        if (args.length > 1) throw runtimeError('println takes one value. Join several with +.', line);
        this.print(`${args.length ? this.printable(args[0], line) : ''}\n`, line);
        return VOID;
      case 'print':
        if (args.length !== 1) throw runtimeError('print takes exactly one value. Join several with +.', line);
        this.print(this.printable(args[0], line), line);
        return VOID;
      case 'printf':
      case 'format':
        if (args[0]?.t !== 'String') throw runtimeError('printf needs a format string first.', line);
        this.print(formatPrintf(args[0].v, args.slice(1), line), line);
        return VOID;
      case 'flush':
        return VOID;
      default:
        throw runtimeError(`System.out.${name} is not supported in this tracer.`, line);
    }
  }

  /** println(char[]) prints the characters, not the array's address. */
  private printable(v: JValue, line: number): string {
    if (v === UNSET) throw runtimeError('This variable might not have been initialized.', line);
    if (v.t === 'void') throw runtimeError('This method returns nothing, so there is nothing to print.', line);
    if (v.t === 'array' && v.elem.name === 'char' && v.elem.dims === 0) return v.items.map(toJavaString).join('');
    return toJavaString(v);
  }

  private callBuiltin(cls: string, name: string, args: JValue[], line: number): JValue {
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

  private *callOn(target: JValue, name: string, args: JValue[], line: number): Gen<JValue> {
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

  private callNative(target: Extract<JValue, { t: 'native' }>, name: string, args: JValue[], line: number): JValue {
    switch (target.kind) {
      case 'StringBuffer':
      case 'StringBuilder':
        return callBuffer(target, name, args, line);
      case 'Scanner':
        return this.callScanner(name, line);
      case 'BufferedReader':
      case 'InputStreamReader':
        if (name === 'readLine') {
          if (this.inputTokens.pos > this.inputTokens.text.length || (this.inputTokens.pos === this.inputTokens.text.length && !this.inputTokens.text.endsWith('\n'))) return NULL;
          return str(this.nextLine(line));
        }
        if (name === 'close') return VOID;
        throw runtimeError(`${target.kind}.${name} is not supported in this tracer.`, line);
      default:
        throw runtimeError(`${target.kind}.${name} is not supported in this tracer.`, line);
    }
  }

  private callScanner(name: string, line: number): JValue {
    const parseWhole = (text: string, min: bigint, max: bigint) => {
      if (!/^[+-]?\d+$/.test(text) || BigInt(text) < min || BigInt(text) > max) throw runtimeError(`java.util.InputMismatchException: "${text}" in the Input box is not the whole number the program asked for.`, line);
      return text;
    };
    switch (name) {
      case 'next':
        return str(this.nextToken(line));
      case 'nextLine':
        return str(this.nextLine(line));
      case 'nextInt':
        return int(Number(parseWhole(this.nextToken(line), -2147483648n, 2147483647n)));
      case 'nextLong':
        return { t: 'long', v: BigInt(parseWhole(this.nextToken(line), -9223372036854775808n, 9223372036854775807n)) };
      case 'nextShort':
        return { t: 'short', v: Number(parseWhole(this.nextToken(line), -32768n, 32767n)) };
      case 'nextByte':
        return { t: 'byte', v: Number(parseWhole(this.nextToken(line), -128n, 127n)) };
      case 'nextDouble':
      case 'nextFloat': {
        const t = this.nextToken(line);
        const v = Number(t);
        if (Number.isNaN(v)) throw runtimeError(`java.util.InputMismatchException: "${t}" in the Input box is not the number the program asked for.`, line);
        return name === 'nextDouble' ? dbl(v) : { t: 'float', v: Math.fround(v) };
      }
      case 'nextBoolean': {
        const t = this.nextToken(line).toLowerCase();
        if (t !== 'true' && t !== 'false') throw runtimeError(`java.util.InputMismatchException: "${t}" is not true or false.`, line);
        return bool(t === 'true');
      }
      case 'hasNext':
        return bool(this.hasToken());
      case 'hasNextLine':
        return bool(this.inputTokens.pos < this.inputTokens.text.length);
      case 'hasNextInt': {
        const m = /^\s*([+-]?\d+)(\s|$)/.exec(this.inputTokens.text.slice(this.inputTokens.pos));
        return bool(Boolean(m));
      }
      case 'hasNextDouble': {
        const m = /^\s*(\S+)/.exec(this.inputTokens.text.slice(this.inputTokens.pos));
        return bool(Boolean(m) && !Number.isNaN(Number(m![1])));
      }
      case 'close':
        return VOID;
      default:
        throw runtimeError(`Scanner.${name} is not supported in this tracer.`, line);
    }
  }

  /** Picks an overload: right number of arguments, preferring exact types. */
  private resolve(cls: ClassDecl, name: string, args: JValue[], line: number): MethodDecl {
    const named = cls.methods.filter((m) => m.name === name);
    if (!named.length) throw runtimeError(`Class ${cls.name} has no method called ${name}.`, line);
    return this.bestOverload(named, args, `${name}`, line);
  }

  private bestOverload(candidates: MethodDecl[], args: JValue[], name: string, line: number): MethodDecl {
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

  private *evalNew(e: Extract<Expr, { k: 'new' }>, frame: Frame): Gen<JValue> {
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
    const ctor = this.bestOverload(cls.ctors, args, `The constructor ${cls.name}`, e.line);
    yield* this.invoke(ctor, args, obj, e.line);
    return obj;
  }

  private *evalNewArray(e: Extract<Expr, { k: 'newarray' }>, frame: Frame): Gen<JValue> {
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

/** Marks a declared variable with no value yet. */
const UNSET: JValue = { t: 'void' };

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

function snapshot(all: readonly Frame[]): FrameView[] {
  const frames = all.length > MAX_SHOWN_FRAMES ? [all[0], ...all.slice(all.length - MAX_SHOWN_FRAMES + 1)] : all;
  return frames.map((f) => {
    const vars: VarView[] = [];
    if (f.self) {
      for (const [name, slot] of f.self.fields) vars.push({ name: `this.${name}`, type: typeName(slot.type), value: displayValue(slot.value) });
    }
    for (const scope of f.scopes) {
      for (const [name, slot] of scope.vars) {
        vars.push({ name, type: typeName(slot.type), value: slot.value === UNSET ? '(no value yet)' : displayValue(slot.value) });
      }
    }
    return { method: f.name, line: f.line, vars };
  });
}

/** Parses and runs a whole program, recording every step for the tracer to play back. */
export function runProgram(source: string, input = ''): RunResult {
  resetIds();
  const steps: TraceStep[] = [];
  const rows: TraceRow[] = [];
  const columns: string[] = [];
  let truncated = false;
  let totalSteps = 0;
  let interpreter: Interpreter | null = null;

  const finish = (error: RunResult['error']): RunResult => ({ steps, output: interpreter?.output ?? '', error, rows, columns, truncated, totalSteps });

  // Each call compares against its own previous row, so a loop that calls a method
  // doesn't see every variable as changed when control comes back.
  const lastValues = new WeakMap<Frame, Record<string, string>>();
  let lastOutputLength = 0;
  let lastLine = 0;

  /** Adds a dry-run row when something in a loop changed. */
  const noteTrace = (frame: Frame, line: number, condition: string | undefined, interp: Interpreter) => {
    const values: Record<string, string> = {};
    for (const scope of frame.scopes) {
      for (const [name, slot] of scope.vars) {
        // main's own args never changes, and nobody writes it in a dry run.
        if (name === 'args' && frame.method?.name === 'main') continue;
        if (slot.value !== UNSET) values[name] = displayValue(slot.value);
      }
    }
    if (frame.self) for (const [name, slot] of frame.self.fields) values[`this.${name}`] = displayValue(slot.value);
    const previous = lastValues.get(frame) ?? {};
    const changed = Object.keys(values).filter((k) => values[k] !== previous[k]);
    const output = interp.output.slice(lastOutputLength);
    if (condition === undefined && !changed.length && !output) return;
    for (const k of Object.keys(values)) if (!columns.includes(k)) columns.push(k);
    rows.push({ line: condition !== undefined ? line : lastLine || line, method: frame.method?.name ?? '', values, changed, condition, output: output || undefined });
    lastValues.set(frame, values);
    lastOutputLength = interp.output.length;
  };

  try {
    const program = parseJava(source);
    interpreter = new Interpreter(program, input);
    const stack: Gen<void>[] = [interpreter.run()];
    while (stack.length) {
      const result = stack[stack.length - 1].next();
      if (result.done) {
        stack.pop();
        continue;
      }
      if (result.value.enter) {
        stack.push(result.value.enter);
        continue;
      }
      totalSteps++;
      if (totalSteps > MAX_STEPS) {
        throw runtimeError(`This program ran for over ${MAX_STEPS.toLocaleString('en-GB')} steps, so it was stopped. It may be an infinite loop. Check that the loop's condition can become false.`, result.value.line);
      }
      const frames = interpreter.frameList;
      const top = frames[frames.length - 1];
      if (rows.length >= MAX_RECORDED) truncated = true;
      else if (top && top.loops > 0) noteTrace(top, result.value.line, result.value.condition, interpreter);
      // Output from a method called inside a loop still belongs to the loop's next row.
      else if (!frames.some((f) => f.loops > 0)) lastOutputLength = interpreter.output.length;
      lastLine = result.value.line;
      if (result.value.condition !== undefined) continue;
      if (steps.length < MAX_RECORDED) {
        steps.push({ line: result.value.line, frames: snapshot(frames), depth: frames.length, outputLength: interpreter.output.length, traceRows: rows.length });
      } else {
        truncated = true;
      }
    }
    if (!truncated) steps.push({ line: lastLine, frames: [], depth: 0, outputLength: interpreter.output.length, traceRows: rows.length });
    return finish(null);
  } catch (err) {
    // The last step shows the state the program stopped in, including anything it printed.
    if (interpreter && !truncated) {
      const frames = interpreter.frameList;
      const line = err instanceof JavaError ? err.line : lastLine;
      steps.push({ line, frames: err instanceof StopProgram ? [] : snapshot(frames), depth: frames.length, outputLength: interpreter.output.length, traceRows: rows.length });
    }
    if (err instanceof StopProgram) return finish(null);
    if (err instanceof JavaError) return finish({ message: err.message, line: err.line, kind: err.kind });
    if (err instanceof RangeError && /call stack/i.test(err.message)) {
      return finish({ message: 'This line nests too deeply for the tracer to follow.', line: lastLine, kind: 'runtime' });
    }
    return finish({ message: `Something went wrong inside the tracer: ${(err as Error).message}`, line: lastLine, kind: 'runtime' });
  }
}
