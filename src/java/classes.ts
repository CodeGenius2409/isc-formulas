// The relations between a program's classes: who extends and implements what, which method a call means,
// and what javac would refuse before the program ever ran.
import type { ClassDecl, FieldDecl, MethodDecl, TypeRef } from './ast';
import { JavaError } from './lexer';
import { typeName } from './values';

/** Methods every class gets from java.lang.Object, and the tracer provides itself. */
export const OBJECT_METHODS = new Set(['toString', 'equals', 'hashCode', 'getClass']);

const ACCESS_RANK = { private: 0, package: 1, protected: 2, public: 3 } as const;

const signature = (m: MethodDecl): string => `${m.name}(${m.params.map((p) => typeName(p.type)).join(',')})`;
const shown = (m: MethodDecl): string => `${m.name}(${m.params.map((p) => typeName(p.type)).join(', ')})`;

export class ClassTable {
  private implicit = new Map<string, MethodDecl>();
  private chains = new Map<string, ClassDecl[]>();

  constructor(private classes: Map<string, ClassDecl>) {}

  get(name: string): ClassDecl | undefined {
    return this.classes.get(name);
  }

  superOf(cls: ClassDecl): ClassDecl | null {
    return cls.superName ? (this.classes.get(cls.superName) ?? null) : null;
  }

  /** The class, then its superclasses from nearest to furthest, then every interface they take on. */
  chain(cls: ClassDecl): ClassDecl[] {
    const known = this.chains.get(cls.name);
    if (known) return known;
    const out: ClassDecl[] = [];
    const seen = new Set<string>();
    const add = (c: ClassDecl | undefined | null) => {
      if (c && !seen.has(c.name)) {
        seen.add(c.name);
        out.push(c);
      }
    };
    for (let c: ClassDecl | null = cls; c; c = this.superOf(c)) add(c);
    for (let i = 0; i < out.length; i++) for (const name of out[i].interfaces) add(this.classes.get(name));
    this.chains.set(cls.name, out);
    return out;
  }

  /** Every type a value of this class can be held in. */
  supertypes(name: string): Set<string> {
    const cls = this.classes.get(name);
    return new Set([...(cls ? this.chain(cls).map((c) => c.name) : [name]), 'Object']);
  }

  isSubtype(sub: string, sup: string): boolean {
    return sub === sup || sup === 'Object' || this.supertypes(sub).has(sup);
  }

  /** How many steps up the hierarchy `sup` is from `sub`, or -1 if it isn't there. */
  distance(sub: string, sup: string): number {
    if (sub === sup) return 0;
    let steps = 1;
    let level = [sub];
    while (level.length) {
      const next: string[] = [];
      for (const name of level) {
        const cls = this.classes.get(name);
        if (!cls) continue;
        for (const parent of [...(cls.superName ? [cls.superName] : []), ...cls.interfaces]) {
          if (parent === sup) return steps;
          next.push(parent);
        }
      }
      level = next;
      steps++;
    }
    return sup === 'Object' ? steps : -1;
  }

  /** The methods of this name that a type offers, with anything overridden taken out. */
  visible(cls: ClassDecl, name: string): MethodDecl[] {
    const out = new Map<string, MethodDecl>();
    for (const c of this.chain(cls)) {
      for (const m of c.methods) {
        if (m.name === name && !out.has(signature(m))) out.set(signature(m), m);
      }
    }
    return [...out.values()];
  }

  /** Dynamic dispatch: the runtime class decides which body runs. Static and private methods aren't overridden. */
  dispatch(method: MethodDecl, runtime: string): MethodDecl {
    if (method.isStatic || method.access === 'private') return method;
    const cls = this.classes.get(runtime);
    if (!cls) return method;
    const wanted = signature(method);
    for (const c of this.chain(cls)) {
      const found = c.methods.find((m) => signature(m) === wanted && !m.isAbstract && !m.isStatic);
      if (found) return found;
    }
    return method;
  }

  /** A no-argument method that the class has or inherits, as toString is found. */
  concrete(runtime: string, name: string): MethodDecl | undefined {
    const cls = this.classes.get(runtime);
    if (!cls) return undefined;
    for (const c of this.chain(cls)) {
      const found = c.methods.find((m) => m.name === name && !m.params.length && !m.isAbstract);
      if (found) return found;
    }
    return undefined;
  }

  /** The nearest declaration of a field, walking up from a class. */
  field(cls: ClassDecl, name: string): { field: FieldDecl; owner: ClassDecl } | null {
    for (const owner of this.chain(cls)) {
      const field = owner.fields.find((f) => f.name === name);
      if (field) return { field, owner };
    }
    return null;
  }

  /** The constructor javac supplies for a class that doesn't write one. */
  defaultConstructor(cls: ClassDecl): MethodDecl {
    let ctor = this.implicit.get(cls.name);
    if (!ctor) {
      ctor = { name: '<init>', className: cls.name, ret: { name: 'void', dims: 0 }, params: [], isStatic: false, access: 'public', body: [], line: cls.line };
      this.implicit.set(cls.name, ctor);
    }
    return ctor;
  }

  /** What javac refuses, so that a wrong program isn't quietly run. */
  check(all: ClassDecl[]): void {
    const seen = new Set<string>();
    for (const c of all) {
      if (seen.has(c.name)) throw new JavaError(`The class ${c.name} is defined twice.`, c.line);
      seen.add(c.name);
    }
    for (const c of all) this.checkParents(c);
    for (const c of all) this.checkCycle(c);
    for (const c of all) {
      this.checkAbstract(c);
      this.checkOverrides(c);
      this.checkConstructors(c);
    }
  }

  private checkParents(c: ClassDecl): void {
    if (c.superName) {
      const parent = this.classes.get(c.superName);
      if (!parent) throw new JavaError(`${c.name} extends ${c.superName}, which isn't in this program. Extending a library class isn't supported in this tracer.`, c.line);
      if (parent.isInterface) throw new JavaError(`${c.superName} is an interface, so ${c.name} must use implements, not extends.`, c.line);
      if (parent.isFinal) throw new JavaError(`${c.name} cannot extend ${c.superName}, because ${c.superName} is final.`, c.line);
    }
    for (const name of c.interfaces) {
      const parent = this.classes.get(name);
      if (!parent) throw new JavaError(`${c.name} ${c.isInterface ? 'extends' : 'implements'} ${name}, which isn't in this program. Library interfaces aren't supported in this tracer.`, c.line);
      if (!parent.isInterface) throw new JavaError(`${name} is a class, so ${c.name} must use extends, not ${c.isInterface ? 'extends on an interface' : 'implements'}.`, c.line);
    }
  }

  private checkCycle(c: ClassDecl): void {
    const walk = (at: ClassDecl, path: string[]): void => {
      if (path.includes(at.name)) throw new JavaError(`${at.name} cannot inherit from itself.`, c.line);
      const next = [...path, at.name];
      for (const name of [...(at.superName ? [at.superName] : []), ...at.interfaces]) {
        const parent = this.classes.get(name);
        if (parent) walk(parent, next);
      }
    };
    walk(c, []);
  }

  private checkAbstract(c: ClassDecl): void {
    for (const m of c.methods) {
      if (m.isAbstract && !c.isAbstract && !c.isInterface) throw new JavaError(`${c.name} has the abstract method ${shown(m)}, so the class must be declared abstract.`, m.line);
    }
    if (c.isAbstract || c.isInterface) return;
    for (const parent of this.chain(c)) {
      for (const m of parent.methods) {
        if (m.isAbstract && this.dispatch(m, c.name).isAbstract) {
          throw new JavaError(`${c.name} must define ${shown(m)} from ${parent.name}, or be declared abstract.`, c.line);
        }
      }
    }
  }

  private checkOverrides(c: ClassDecl): void {
    const parents = this.chain(c).slice(1);
    for (const m of c.methods) {
      for (const parent of parents) {
        const o = parent.methods.find((x) => signature(x) === signature(m));
        if (!o || o.access === 'private') continue;
        if (o.isFinal) throw new JavaError(`${shown(m)} cannot override the final method in ${parent.name}.`, m.line);
        if (o.isStatic !== m.isStatic) throw new JavaError(`${shown(m)} in ${c.name} and in ${parent.name} must both be static, or both not.`, m.line);
        if (ACCESS_RANK[m.access] < ACCESS_RANK[o.access]) {
          throw new JavaError(`${shown(m)} in ${c.name} cannot be less visible than in ${parent.name}, where it is ${o.access === 'package' ? 'package-private' : o.access}.${parent.isInterface ? ' A method from an interface must be declared public.' : ''}`, m.line);
        }
        if (!this.returnFits(m.ret, o.ret)) throw new JavaError(`${shown(m)} in ${c.name} must return ${typeName(o.ret)}, as it does in ${parent.name}.`, m.line);
      }
    }
  }

  private returnFits(mine: TypeRef, theirs: TypeRef): boolean {
    if (typeName(mine) === typeName(theirs)) return true;
    // A class can return a more specific class than the method it overrides.
    return !mine.dims && !theirs.dims && this.classes.has(mine.name) && this.isSubtype(mine.name, theirs.name);
  }

  private checkConstructors(c: ClassDecl): void {
    const parent = this.superOf(c);
    if (!parent || !parent.ctors.length || parent.ctors.some((m) => !m.params.length)) return;
    const expected = parent.ctors.map(shownCtor).join(' or ');
    const calls = (m: MethodDecl) => m.body[0]?.k === 'expr' && m.body[0].expr.k === 'ctorcall';
    if (!c.ctors.length) throw new JavaError(`${c.name} needs a constructor that calls super(...), since ${parent.name} has no constructor without arguments. It has ${expected}.`, c.line);
    for (const m of c.ctors) {
      if (!calls(m)) throw new JavaError(`This constructor must call super(...) first, since ${parent.name} has no constructor without arguments. It has ${expected}.`, m.line);
    }
  }
}

const shownCtor = (m: MethodDecl): string => `${m.className}(${m.params.map((p) => typeName(p.type)).join(', ')})`;
