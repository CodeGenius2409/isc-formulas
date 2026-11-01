// Tokens, types and expressions. Statements and classes are in parser.ts.
import type { Expr, TypeRef } from './ast';
import { JavaError, tokenize, type Token } from './lexer';

export const PRIMITIVES = new Set(['int', 'long', 'double', 'float', 'char', 'boolean', 'byte', 'short']);

/** Names the constructs this tracer leaves out, so the message can say so plainly. */
const UNSUPPORTED_KEYWORDS: Record<string, string> = {
  try: 'try/catch',
  catch: 'try/catch',
  finally: 'try/finally',
  throw: 'throw',
  interface: 'Interfaces',
  enum: 'Enums',
  abstract: 'Abstract classes',
  extends: 'Inheritance (extends)',
  implements: 'Implementing an interface',
  super: 'super',
  instanceof: 'instanceof',
  synchronized: 'synchronized',
  assert: 'assert',
  native: 'Native methods',
  transient: 'transient',
  volatile: 'volatile',
  goto: 'goto',
  const: 'const',
  strictfp: 'strictfp',
};

export function unsupported(what: string, line: number): JavaError {
  const noun = what.split(/ such | without | \(/)[0];
  return new JavaError(`${what} ${noun.endsWith('s') ? 'are' : 'is'} not supported in this tracer.`, line);
}

export abstract class ExpressionParser {
  protected tokens: Token[];
  protected pos = 0;

  constructor(source: string) {
    this.tokens = tokenize(source);
  }

  protected get tok(): Token {
    return this.tokens[this.pos];
  }

  protected peek(offset = 1): Token {
    return this.tokens[Math.min(this.pos + offset, this.tokens.length - 1)];
  }

  protected next(): Token {
    return this.tokens[this.pos++];
  }

  protected isOp(text: string): boolean {
    return this.tok.type === 'op' && this.tok.text === text;
  }

  protected isKw(text: string): boolean {
    return this.tok.type === 'keyword' && this.tok.text === text;
  }

  protected acceptOp(text: string): boolean {
    if (this.isOp(text)) {
      this.pos++;
      return true;
    }
    return false;
  }

  protected acceptKw(text: string): boolean {
    if (this.isKw(text)) {
      this.pos++;
      return true;
    }
    return false;
  }

  protected expectOp(text: string, context?: string): Token {
    if (this.isOp(text)) return this.next();
    this.checkUnsupported();
    throw new JavaError(`Expected "${text}"${context ? ` ${context}` : ''}, but found "${this.tok.text}".`, this.tokenLine());
  }

  /** A missing ; or ) belongs to the end of the previous line, where students look. */
  protected tokenLine(): number {
    return this.pos > 0 && [';', ')', ']', '}'].includes(this.tok.text) === false ? this.tokens[this.pos - 1].line : this.tok.line;
  }

  protected expectIdent(what: string): Token {
    if (this.tok.type === 'ident') return this.next();
    this.checkUnsupported();
    throw new JavaError(`Expected ${what}, but found "${this.tok.text}".`, this.tok.line);
  }

  protected checkUnsupported(): void {
    const t = this.tok;
    if (t.type === 'keyword' && UNSUPPORTED_KEYWORDS[t.text]) throw unsupported(UNSUPPORTED_KEYWORDS[t.text], t.line);
    if (t.type === 'op' && t.text === '->') throw unsupported('Lambda expressions', t.line);
    if (t.type === 'op' && t.text === '::') throw unsupported('Method references', t.line);
    if (t.type === 'op' && t.text === '@') throw unsupported('Annotations', t.line);
  }

  protected parseType(allowVoid: boolean): TypeRef {
    let name: string;
    if (this.tok.type === 'keyword' && (PRIMITIVES.has(this.tok.text) || (allowVoid && this.tok.text === 'void'))) {
      name = this.next().text;
    } else if (this.tok.type === 'ident') {
      name = this.next().text;
      if (this.isOp('<')) throw unsupported(`Generic types such as ${name}<...>`, this.tok.line);
      while (this.isOp('.') && this.peek().type === 'ident') {
        this.next();
        name = this.next().text;
      }
    } else {
      this.checkUnsupported();
      throw new JavaError(`Expected a type, but found "${this.tok.text}".`, this.tok.line);
    }
    let dims = 0;
    while (this.isOp('[') && this.peek().text === ']') {
      this.pos += 2;
      dims++;
    }
    return { name, dims };
  }

  protected parseVarInit(): Expr {
    return this.isOp('{') ? this.parseArrayLiteral() : this.parseExpr();
  }

  protected parseArrayLiteral(): Expr {
    const line = this.tok.line;
    this.expectOp('{');
    const items: Expr[] = [];
    while (!this.isOp('}')) {
      items.push(this.parseVarInit());
      if (!this.acceptOp(',')) break;
    }
    this.expectOp('}', 'to end the array');
    return { k: 'arraylit', line, items };
  }

  parseExpr(): Expr {
    const left = this.parseTernary();
    const t = this.tok;
    if (t.type === 'op' && ['=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '>>>='].includes(t.text)) {
      if (!['name', 'field', 'index'].includes(left.k)) throw new JavaError('The left side of an assignment must be a variable.', t.line);
      this.next();
      const value = this.isOp('{') ? this.parseArrayLiteral() : this.parseExpr();
      return { k: 'assign', line: t.line, op: t.text, target: left, value };
    }
    if (t.type === 'op' && t.text === '->') throw unsupported('Lambda expressions', t.line);
    return left;
  }

  protected parseTernary(): Expr {
    const cond = this.parseBinary(0);
    if (!this.isOp('?')) return cond;
    const line = this.next().line;
    const a = this.parseExpr();
    this.expectOp(':', 'in the ?: expression');
    const b = this.parseTernary();
    return { k: 'ternary', line, cond, a, b };
  }

  protected static LEVELS = [['||'], ['&&'], ['|'], ['^'], ['&'], ['==', '!='], ['<', '>', '<=', '>='], ['<<', '>>', '>>>'], ['+', '-'], ['*', '/', '%']];

  protected parseBinary(level: number): Expr {
    if (level >= ExpressionParser.LEVELS.length) return this.parseUnary();
    let left = this.parseBinary(level + 1);
    while (this.tok.type === 'op' && ExpressionParser.LEVELS[level].includes(this.tok.text)) {
      const op = this.next();
      const right = this.parseBinary(level + 1);
      left = { k: 'binary', line: op.line, op: op.text, a: left, b: right };
    }
    if (this.isKw('instanceof')) throw unsupported('instanceof', this.tok.line);
    return left;
  }

  /** "(int) x" is a cast, while "(x) + 1" is not. Only a type followed by ) is one. */
  protected isCast(): boolean {
    if (!this.isOp('(')) return false;
    const after = this.peek();
    if (after.type === 'keyword' && PRIMITIVES.has(after.text)) {
      let i = 2;
      while (this.peek(i).text === '[' && this.peek(i + 1).text === ']') i += 2;
      return this.peek(i).text === ')';
    }
    if (after.type === 'ident') {
      let i = 2;
      while (this.peek(i).text === '[' && this.peek(i + 1).text === ']') i += 2;
      if (this.peek(i).text !== ')') return false;
      const then = this.peek(i + 1);
      return then.type === 'ident' || then.type === 'string' || then.type === 'char' || then.type === 'int' || then.type === 'double' || (then.type === 'keyword' && ['this', 'new', 'true', 'false', 'null'].includes(then.text)) || then.text === '(' || then.text === '!' || then.text === '~';
    }
    return false;
  }

  protected parseUnary(): Expr {
    const t = this.tok;
    if (t.type === 'op') {
      if (t.text === '-' || t.text === '+' || t.text === '!' || t.text === '~') {
        this.next();
        const expr = this.parseUnary();
        return { k: 'unary', line: t.line, op: t.text, expr };
      }
      if (t.text === '++' || t.text === '--') {
        this.next();
        const target = this.parseUnary();
        return { k: 'incdec', line: t.line, op: t.text, prefix: true, target };
      }
    }
    if (this.isCast()) {
      this.next();
      const type = this.parseType(false);
      this.expectOp(')');
      return { k: 'cast', line: t.line, type, expr: this.parseUnary() };
    }
    return this.parsePostfix();
  }

  protected parsePostfix(): Expr {
    let e = this.parsePrimary();
    for (;;) {
      const t = this.tok;
      if (t.type !== 'op') {
        if (t.type === 'keyword' && t.text === 'instanceof') throw unsupported('instanceof', t.line);
        return e;
      }
      if (t.text === '.') {
        this.next();
        if (this.isKw('new')) throw unsupported('Inner class creation', this.tok.line);
        if (this.isKw('class')) throw unsupported('Class literals', this.tok.line);
        if (this.isKw('this')) throw unsupported('Qualified "this"', this.tok.line);
        const name = this.expectIdent('a field or method name');
        if (this.isOp('(')) e = { k: 'call', line: name.line, target: e, name: name.text, args: this.parseArgs() };
        else e = { k: 'field', line: name.line, target: e, name: name.text };
      } else if (t.text === '[') {
        this.next();
        const index = this.parseExpr();
        this.expectOp(']', 'after the array index');
        e = { k: 'index', line: t.line, target: e, index };
      } else if (t.text === '++' || t.text === '--') {
        this.next();
        e = { k: 'incdec', line: t.line, op: t.text, prefix: false, target: e };
      } else if (t.text === '::') {
        throw unsupported('Method references', t.line);
      } else {
        return e;
      }
    }
  }

  protected parseArgs(): Expr[] {
    this.expectOp('(');
    const args: Expr[] = [];
    if (!this.isOp(')')) {
      do {
        args.push(this.parseExpr());
      } while (this.acceptOp(','));
    }
    this.expectOp(')', 'after the arguments');
    return args;
  }

  protected parsePrimary(): Expr {
    const t = this.tok;
    const line = t.line;
    switch (t.type) {
      case 'int':
        this.next();
        return { k: 'lit', line, t: 'int', v: t.value as number };
      case 'long':
        this.next();
        return { k: 'lit', line, t: 'long', v: t.value as bigint };
      case 'double':
        this.next();
        return { k: 'lit', line, t: 'double', v: t.value as number };
      case 'float':
        this.next();
        return { k: 'lit', line, t: 'float', v: t.value as number };
      case 'char':
        this.next();
        return { k: 'lit', line, t: 'char', v: t.value as number };
      case 'string':
        this.next();
        return { k: 'lit', line, t: 'String', v: t.value as string };
      case 'ident': {
        this.next();
        // java.util.Arrays.sort(a) means the same as Arrays.sort(a).
        if ((t.text === 'java' || t.text === 'javax') && this.isOp('.')) {
          while (this.isOp('.') && this.peek().type === 'ident') {
            this.next();
            const part = this.next();
            if (/^[A-Z]/.test(part.text)) return { k: 'name', line, name: part.text };
          }
          throw new JavaError(`Expected a class name after ${t.text}.`, line);
        }
        if (this.isOp('(')) return { k: 'call', line, target: null, name: t.text, args: this.parseArgs() };
        return { k: 'name', line, name: t.text };
      }
      case 'keyword':
        if (t.text === 'true' || t.text === 'false') {
          this.next();
          return { k: 'lit', line, t: 'boolean', v: t.text === 'true' };
        }
        if (t.text === 'null') {
          this.next();
          return { k: 'lit', line, t: 'null', v: null };
        }
        if (t.text === 'this') {
          this.next();
          if (this.isOp('(')) throw unsupported('Constructor chaining with this(...)', line);
          return { k: 'this', line };
        }
        if (t.text === 'new') return this.parseNew();
        this.checkUnsupported();
        break;
      case 'op':
        if (t.text === '(') {
          if (this.lambdaAhead()) throw unsupported('Lambda expressions', line);
          this.next();
          const e = this.parseExpr();
          this.expectOp(')', 'to close the bracket');
          return e;
        }
        this.checkUnsupported();
        break;
    }
    throw new JavaError(`Expected a value, but found "${t.text}".`, line);
  }

  /** True if the bracket starting here is the parameter list of a lambda. */
  protected lambdaAhead(): boolean {
    let depth = 0;
    for (let i = 0; this.peek(i).type !== 'eof'; i++) {
      const text = this.peek(i).text;
      if (text === '(') depth++;
      else if (text === ')' && --depth === 0) return this.peek(i + 1).text === '->';
    }
    return false;
  }

  protected parseNew(): Expr {
    const line = this.next().line;
    let name: string;
    if (this.tok.type === 'keyword' && PRIMITIVES.has(this.tok.text)) name = this.next().text;
    else {
      name = this.expectIdent('a class name').text;
      while (this.isOp('.') && this.peek().type === 'ident') {
        this.next();
        name = this.next().text;
      }
    }
    if (this.isOp('<')) throw unsupported(`Generic types such as ${name}<...>`, this.tok.line);
    if (this.isOp('[')) {
      const sizes: Expr[] = [];
      let extraDims = 0;
      while (this.isOp('[')) {
        this.next();
        if (this.isOp(']')) {
          this.next();
          extraDims++;
        } else {
          if (extraDims) throw new JavaError('Array sizes must come before empty brackets.', this.tok.line);
          sizes.push(this.parseExpr());
          this.expectOp(']', 'after the array size');
        }
      }
      const init = this.isOp('{') ? this.parseArrayLiteral() : null;
      if (!sizes.length && !init) throw new JavaError('A new array needs a size or a list of values.', line);
      return { k: 'newarray', line, elem: name, sizes, extraDims, init };
    }
    if (!this.isOp('(')) throw new JavaError(`Expected ( or [ after new ${name}.`, this.tok.line);
    const args = this.parseArgs();
    if (this.isOp('{')) throw unsupported('Anonymous classes', this.tok.line);
    return { k: 'new', line, cls: name, args };
  }
}
