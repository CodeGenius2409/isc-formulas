// A step-through interpreter. Execution is written with generators so that it can
// pause before every statement, recording exactly what a dry run would show. This file
// handles statements and the run as a whole. evaluator.ts handles expressions.
import type { ClassDecl, Expr, MethodDecl, Program, Stmt } from './ast';
import { Evaluator } from './evaluator';
import { JavaError } from './lexer';
import { MAX_DEPTH, UNSET, type Frame, type Gen, type Signal } from './runtime';
import { nextId } from './stdlib';
import { asNumber, assignConvert, defaultValue, describeType, displayValue, isNumeric, runtimeError, typeName, VOID, type JValue, type Slot } from './values';

export class Interpreter extends Evaluator {
  constructor(program: Program, input: string) {
    super(program, input);
    this.checkDuplicates();
    this.table.check(program.classes);
  }

  protected checkDuplicates(): void {
    for (const c of this.program.classes) {
      const seen = new Set<string>();
      for (const m of [...c.methods, ...c.ctors]) {
        const key = `${m.name}(${m.params.map((p) => typeName(p.type)).join(',')})`;
        if (seen.has(key)) throw new JavaError(`${m.name === '<init>' ? c.name : m.name} is defined twice with the same parameters.`, m.line);
        seen.add(key);
      }
    }
  }

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

  protected *invoke(method: MethodDecl, args: JValue[], self: Frame['self'], line: number): Gen<JValue> {
    let result: JValue = VOID;
    const run = this.runMethod.bind(this);
    const body = (function* (): Gen<void> {
      result = yield* run(method, args, self, line);
    })();
    yield { enter: body };
    return result;
  }

  protected *runMethod(method: MethodDecl, args: JValue[], self: Frame['self'], line: number): Gen<JValue> {
    if (this.frames.length >= MAX_DEPTH) {
      throw runtimeError('java.lang.StackOverflowError: too many method calls. A recursive method may be missing its base case.', line);
    }
    const cls = this.classes.get(method.className)!;
    const frame: Frame = {
      method,
      name: this.frameName(method, cls, args, self),
      cls,
      self,
      scopes: [{ vars: new Map() }],
      line: method.line,
      loops: 0,
    };
    method.params.forEach((p, i) => frame.scopes[0].vars.set(p.name, { type: p.type, value: assignConvert(args[i], p.type, line) }));
    this.frames.push(frame);
    const skip = method.name === '<init>' ? yield* this.constructorStart(method, cls, frame, line) : 0;
    const signal = yield* this.execBlock(skip ? method.body.slice(skip) : method.body, frame, false);
    this.frames.pop();
    if (signal?.type === 'return') return signal.value;
    if (method.name !== '<init>' && method.ret.name !== 'void') {
      throw new JavaError(`Method ${method.name} must return a ${typeName(method.ret)}, but reached its end without one.`, method.line);
    }
    return VOID;
  }

  /** Which class's code is running, and on what. With one class in the program, the name alone says it. */
  protected frameName(method: MethodDecl, cls: ClassDecl, args: JValue[], self: Frame['self']): string {
    const list = args.map((a) => displayValue(a, 2)).join(', ');
    if (method.name === '<init>') return (self && self.cls !== cls.name ? `${cls.name}(${list}), making a ${self.cls}` : `new ${cls.name}(${list})`).slice(0, 80);
    if (this.program.classes.length < 2) return `${method.name}(${list})`.slice(0, 80);
    return `${cls.name}.${method.name}(${list})${self && self.cls !== cls.name ? ` on a ${self.cls}` : ''}`.slice(0, 80);
  }

  /**
   * What a constructor does before its own body, in Java's order: this(...), or else super(...) followed by
   * this class's field initializers. Returns how many statements of the body that used up.
   */
  protected *constructorStart(method: MethodDecl, cls: ClassDecl, frame: Frame, line: number): Gen<number> {
    const self = frame.self!;
    const first = method.body[0];
    const call = first?.k === 'expr' && first.expr.k === 'ctorcall' ? first.expr : null;
    if (call) yield* this.pause(first.line, frame);
    const args = call ? yield* this.evalArgs(call.args, frame) : [];
    if (call?.kind === 'this') {
      const other = this.constructorFor(cls, args, call.args, frame, call.line);
      if (other === method) throw new JavaError(`This constructor of ${cls.name} calls itself.`, call.line);
      yield* this.invoke(other, args, self, call.line);
      return 1;
    }
    const parent = this.table.superOf(cls);
    if (parent) yield* this.invoke(this.constructorFor(parent, args, call?.args ?? [], frame, call?.line ?? line), args, self, call?.line ?? line);
    else if (args.length) throw runtimeError(`${cls.name} extends nothing, and Object's constructor takes no arguments.`, call!.line);
    const init: Frame = { method: null, name: frame.name, cls, self, scopes: [{ vars: new Map() }], line: frame.line, loops: 0 };
    for (const f of cls.fields) {
      if (!f.isStatic && f.init) this.instanceSlot(self, cls, f.name)!.value = yield* this.evalInit(f.init, f.type, init);
    }
    return call ? 1 : 0;
  }

  protected *execBlock(body: Stmt[], frame: Frame, newScope = true): Gen<Signal> {
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

  protected *pause(line: number, frame: Frame, condition?: string): Gen<void> {
    frame.line = line;
    yield { line, condition };
  }

  protected *checkCondition(e: Expr, frame: Frame, line: number): Gen<boolean> {
    const v = yield* this.eval(e, frame);
    const result = this.truth(v, line);
    yield* this.pause(line, frame, String(result));
    return result;
  }

  protected *exec(s: Stmt, frame: Frame): Gen<Signal> {
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
        const ret = frame.method?.ret;
        if (ret) this.checkAssignable(s.value, ret, frame);
        const value = yield* this.eval(s.value, frame);
        if (ret?.name === 'void') throw runtimeError('A void method cannot return a value.', s.line);
        return { type: 'return', value: ret ? assignConvert(value, ret, s.line) : value };
      }
    }
  }

  /** A single statement body still gets its own scope. */
  protected *execBody(s: Stmt, frame: Frame): Gen<Signal> {
    if (s.k === 'block') return yield* this.execBlock(s.body, frame);
    frame.scopes.push({ vars: new Map() });
    try {
      return yield* this.exec(s, frame);
    } finally {
      frame.scopes.pop();
    }
  }

  protected *execSwitch(s: Extract<Stmt, { k: 'switch' }>, frame: Frame): Gen<Signal> {
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
}
