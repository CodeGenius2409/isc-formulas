// A recursive-descent parser for the ISC subset of Java. Anything outside the subset
// stops with a message naming the construct, rather than failing in a confusing way.
import type { ClassDecl, Expr, FieldDecl, MethodDecl, Param, Program, Stmt, TypeRef } from './ast';
import { JavaError, tokenize, type Token } from './lexer';

const PRIMITIVES = new Set(['int', 'long', 'double', 'float', 'char', 'boolean', 'byte', 'short']);
const MODIFIERS = new Set(['public', 'private', 'protected', 'static', 'final']);

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

function unsupported(what: string, line: number): JavaError {
  const noun = what.split(/ such | without | \(/)[0];
  return new JavaError(`${what} ${noun.endsWith('s') ? 'are' : 'is'} not supported in this tracer.`, line);
}

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(source: string) {
    this.tokens = tokenize(source);
  }

  private get tok(): Token {
    return this.tokens[this.pos];
  }

  private peek(offset = 1): Token {
    return this.tokens[Math.min(this.pos + offset, this.tokens.length - 1)];
  }

  private next(): Token {
    return this.tokens[this.pos++];
  }

  private isOp(text: string): boolean {
    return this.tok.type === 'op' && this.tok.text === text;
  }

  private isKw(text: string): boolean {
    return this.tok.type === 'keyword' && this.tok.text === text;
  }

  private acceptOp(text: string): boolean {
    if (this.isOp(text)) {
      this.pos++;
      return true;
    }
    return false;
  }

  private acceptKw(text: string): boolean {
    if (this.isKw(text)) {
      this.pos++;
      return true;
    }
    return false;
  }

  private expectOp(text: string, context?: string): Token {
    if (this.isOp(text)) return this.next();
    this.checkUnsupported();
    throw new JavaError(`Expected "${text}"${context ? ` ${context}` : ''}, but found "${this.tok.text}".`, this.tokenLine());
  }

  /** A missing ; or ) belongs to the end of the previous line, where students look. */
  private tokenLine(): number {
    return this.pos > 0 && [';', ')', ']', '}'].includes(this.tok.text) === false ? this.tokens[this.pos - 1].line : this.tok.line;
  }

  private expectIdent(what: string): Token {
    if (this.tok.type === 'ident') return this.next();
    this.checkUnsupported();
    throw new JavaError(`Expected ${what}, but found "${this.tok.text}".`, this.tok.line);
  }

  private checkUnsupported(): void {
    const t = this.tok;
    if (t.type === 'keyword' && UNSUPPORTED_KEYWORDS[t.text]) throw unsupported(UNSUPPORTED_KEYWORDS[t.text], t.line);
    if (t.type === 'op' && t.text === '->') throw unsupported('Lambda expressions', t.line);
    if (t.type === 'op' && t.text === '::') throw unsupported('Method references', t.line);
    if (t.type === 'op' && t.text === '@') throw unsupported('Annotations', t.line);
  }

  parseProgram(): Program {
    const classes: ClassDecl[] = [];
    while (this.isKw('package') || this.isKw('import')) {
      while (!this.isOp(';') && this.tok.type !== 'eof') this.pos++;
      this.expectOp(';');
    }
    while (this.tok.type !== 'eof') {
      classes.push(this.parseClass());
    }
    if (!classes.length) throw new JavaError('A Java program needs at least one class.', 1);
    return { classes };
  }

  private skipModifiers(): { isStatic: boolean } {
    let isStatic = false;
    for (;;) {
      this.checkUnsupported();
      if (this.tok.type === 'keyword' && MODIFIERS.has(this.tok.text)) {
        if (this.tok.text === 'static') isStatic = true;
        this.pos++;
      } else return { isStatic };
    }
  }

  private parseClass(): ClassDecl {
    this.skipModifiers();
    if (!this.acceptKw('class')) {
      this.checkUnsupported();
      throw new JavaError(`Expected a class here, but found "${this.tok.text}".`, this.tok.line);
    }
    const nameTok = this.expectIdent('a class name');
    if (this.isOp('<')) throw unsupported('Generic classes', this.tok.line);
    this.checkUnsupported();
    this.expectOp('{', 'to start the class');
    const cls: ClassDecl = { name: nameTok.text, line: nameTok.line, fields: [], methods: [], ctors: [] };
    while (!this.isOp('}')) {
      if (this.tok.type === 'eof') throw new JavaError(`Class ${cls.name} is missing its closing }.`, this.tok.line);
      this.parseMember(cls);
    }
    this.next();
    return cls;
  }

  private parseMember(cls: ClassDecl): void {
    if (this.isOp('{')) throw unsupported('Initializer blocks', this.tok.line);
    if (this.isKw('static') && this.peek().text === '{') throw unsupported('Static initializer blocks', this.tok.line);
    const { isStatic } = this.skipModifiers();
    if (this.isKw('class')) throw unsupported('Nested classes', this.tok.line);
    const line = this.tok.line;

    // A constructor is the class name directly followed by "(".
    if (this.tok.type === 'ident' && this.tok.text === cls.name && this.peek().text === '(') {
      this.next();
      cls.ctors.push(this.parseMethodRest(cls.name, '<init>', { name: 'void', dims: 0 }, false, line));
      return;
    }
    const type = this.parseType(true);
    const nameTok = this.expectIdent('a name');
    if (this.isOp('(')) {
      cls.methods.push(this.parseMethodRest(cls.name, nameTok.text, type, isStatic, line));
      return;
    }
    // Fields, possibly several on one line.
    let name = nameTok.text;
    for (;;) {
      let dims = type.dims;
      while (this.acceptOp('[')) {
        this.expectOp(']');
        dims++;
      }
      const init = this.acceptOp('=') ? this.parseVarInit() : null;
      const field: FieldDecl = { name, type: { name: type.name, dims }, isStatic, init, line };
      cls.fields.push(field);
      if (!this.acceptOp(',')) break;
      name = this.expectIdent('a field name').text;
    }
    this.expectOp(';', 'after the field');
  }

  private parseMethodRest(className: string, name: string, ret: TypeRef, isStatic: boolean, line: number): MethodDecl {
    this.expectOp('(');
    const params: Param[] = [];
    if (!this.isOp(')')) {
      do {
        this.acceptKw('final');
        const type = this.parseType(false);
        if (this.isOp('...')) throw unsupported('Variable-length arguments (...)', this.tok.line);
        const p = this.expectIdent('a parameter name');
        let dims = type.dims;
        while (this.acceptOp('[')) {
          this.expectOp(']');
          dims++;
        }
        params.push({ name: p.text, type: { name: type.name, dims } });
      } while (this.acceptOp(','));
    }
    this.expectOp(')', 'after the parameters');
    // "throws IOException" changes nothing here, since exceptions cannot be caught.
    if (this.acceptKw('throws')) {
      do {
        this.expectIdent('an exception name');
      } while (this.acceptOp(','));
    }
    if (this.isOp(';')) throw unsupported('Methods without a body', this.tok.line);
    return { name, className, ret, params, isStatic, body: this.parseBlockBody(), line };
  }

  private parseBlockBody(): Stmt[] {
    this.expectOp('{');
    const body: Stmt[] = [];
    while (!this.isOp('}')) {
      if (this.tok.type === 'eof') throw new JavaError('A closing } is missing.', this.tok.line);
      body.push(this.parseStatement());
    }
    this.next();
    return body;
  }

  private parseType(allowVoid: boolean): TypeRef {
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

  /** Decides whether the tokens ahead start a local variable declaration. */
  private looksLikeDeclaration(): boolean {
    if (this.tok.type === 'keyword') return PRIMITIVES.has(this.tok.text) || this.tok.text === 'final';
    if (this.tok.type !== 'ident') return false;
    let i = 1;
    // Qualified names such as java.util.Scanner.
    while (this.peek(i).text === '.' && this.peek(i + 1).type === 'ident') i += 2;
    if (this.peek(i).text === '<' && this.peek(i + 1).type === 'ident' && (this.peek(i + 2).text === '>' || this.peek(i + 2).text === ',' || this.peek(i + 2).text === '<')) {
      throw unsupported(`Generic types such as ${this.tok.text}<...>`, this.tok.line);
    }
    while (this.peek(i).text === '[' && this.peek(i + 1).text === ']') i += 2;
    return this.peek(i).type === 'ident';
  }

  private parseVarDecl(): Stmt {
    const line = this.tok.line;
    this.acceptKw('final');
    const type = this.parseType(false);
    const decls: { name: string; type: TypeRef; init: Expr | null }[] = [];
    do {
      const nameTok = this.expectIdent('a variable name');
      let dims = type.dims;
      while (this.acceptOp('[')) {
        this.expectOp(']');
        dims++;
      }
      const init = this.acceptOp('=') ? this.parseVarInit() : null;
      decls.push({ name: nameTok.text, type: { name: type.name, dims }, init });
    } while (this.acceptOp(','));
    return { k: 'var', line, decls };
  }

  private parseVarInit(): Expr {
    return this.isOp('{') ? this.parseArrayLiteral() : this.parseExpr();
  }

  private parseArrayLiteral(): Expr {
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

  private parseStatement(): Stmt {
    const t = this.tok;
    const line = t.line;
    this.checkUnsupported();
    if (t.type === 'op' && t.text === '{') return { k: 'block', line, body: this.parseBlockBody() };
    if (t.type === 'op' && t.text === ';') {
      this.next();
      return { k: 'empty', line };
    }
    if (t.type === 'keyword') {
      switch (t.text) {
        case 'if': {
          this.next();
          this.expectOp('(', 'after if');
          const cond = this.parseExpr();
          this.expectOp(')', 'after the condition');
          const then = this.parseStatement();
          const elseStmt = this.acceptKw('else') ? this.parseStatement() : null;
          return { k: 'if', line, cond, then, else: elseStmt };
        }
        case 'while': {
          this.next();
          this.expectOp('(', 'after while');
          const cond = this.parseExpr();
          this.expectOp(')', 'after the condition');
          return { k: 'while', line, cond, body: this.parseStatement() };
        }
        case 'do': {
          this.next();
          const body = this.parseStatement();
          const condLine = this.tok.line;
          if (!this.acceptKw('while')) throw new JavaError('A do loop needs while (...) after its body.', this.tok.line);
          this.expectOp('(', 'after while');
          const cond = this.parseExpr();
          this.expectOp(')', 'after the condition');
          this.expectOp(';', 'after do...while');
          return { k: 'do', line, body, cond, condLine };
        }
        case 'for':
          return this.parseFor();
        case 'switch':
          return this.parseSwitch();
        case 'break':
          this.next();
          if (this.tok.type === 'ident') throw unsupported('Labelled break', line);
          this.expectOp(';', 'after break');
          return { k: 'break', line };
        case 'continue':
          this.next();
          if (this.tok.type === 'ident') throw unsupported('Labelled continue', line);
          this.expectOp(';', 'after continue');
          return { k: 'continue', line };
        case 'return': {
          this.next();
          const value = this.isOp(';') ? null : this.parseExpr();
          this.expectOp(';', 'after return');
          return { k: 'return', line, value };
        }
        case 'class':
          throw unsupported('Local classes', line);
        case 'else':
          throw new JavaError('This else has no matching if.', line);
      }
    }
    if (this.looksLikeDeclaration()) {
      const decl = this.parseVarDecl();
      this.expectOp(';', 'after the declaration');
      return decl;
    }
    if (t.type === 'ident' && this.peek().text === ':') throw unsupported('Statement labels', line);
    const expr = this.parseExpr();
    if (!['assign', 'incdec', 'call', 'new'].includes(expr.k)) throw new JavaError('This is not a statement. It calculates a value but does nothing with it.', line);
    this.expectOp(';', 'at the end of the statement');
    return { k: 'expr', line, expr };
  }

  private parseFor(): Stmt {
    const line = this.next().line;
    this.expectOp('(', 'after for');
    // for (int x : array)
    const save = this.pos;
    if (this.looksLikeDeclaration()) {
      this.acceptKw('final');
      const type = this.parseType(false);
      if (this.tok.type === 'ident' && this.peek().text === ':') {
        const name = this.next().text;
        this.next();
        const iter = this.parseExpr();
        this.expectOp(')', 'after the for-each');
        return { k: 'foreach', line, type, name, iter, body: this.parseStatement() };
      }
      this.pos = save;
    }
    const init: Stmt[] = [];
    if (!this.isOp(';')) {
      if (this.looksLikeDeclaration()) init.push(this.parseVarDecl());
      else {
        do {
          const expr = this.parseExpr();
          init.push({ k: 'expr', line, expr });
        } while (this.acceptOp(','));
      }
    }
    this.expectOp(';', 'in the for loop');
    const cond = this.isOp(';') ? null : this.parseExpr();
    this.expectOp(';', 'in the for loop');
    const update: Expr[] = [];
    if (!this.isOp(')')) {
      do {
        update.push(this.parseExpr());
      } while (this.acceptOp(','));
    }
    this.expectOp(')', 'to end the for header');
    return { k: 'for', line, init, cond, update, body: this.parseStatement() };
  }

  private parseSwitch(): Stmt {
    const line = this.next().line;
    this.expectOp('(', 'after switch');
    const value = this.parseExpr();
    this.expectOp(')', 'after the switch value');
    this.expectOp('{', 'to start the switch');
    const cases: { line: number; labels: (Expr | 'default')[]; body: Stmt[] }[] = [];
    while (!this.isOp('}')) {
      const caseLine = this.tok.line;
      const labels: (Expr | 'default')[] = [];
      while (this.isKw('case') || this.isKw('default')) {
        if (this.acceptKw('default')) labels.push('default');
        else {
          this.next();
          labels.push(this.parseTernary());
          while (this.acceptOp(',')) labels.push(this.parseTernary());
        }
        if (this.isOp('->')) throw unsupported('Arrow switch cases (->)', this.tok.line);
        this.expectOp(':', 'after case');
      }
      if (!labels.length) throw new JavaError(`Expected case or default, but found "${this.tok.text}".`, this.tok.line);
      const body: Stmt[] = [];
      while (!this.isKw('case') && !this.isKw('default') && !this.isOp('}')) {
        if (this.tok.type === 'eof') throw new JavaError('The switch is missing its closing }.', this.tok.line);
        body.push(this.parseStatement());
      }
      cases.push({ line: caseLine, labels, body });
    }
    this.next();
    return { k: 'switch', line, value, cases };
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

  private parseTernary(): Expr {
    const cond = this.parseBinary(0);
    if (!this.isOp('?')) return cond;
    const line = this.next().line;
    const a = this.parseExpr();
    this.expectOp(':', 'in the ?: expression');
    const b = this.parseTernary();
    return { k: 'ternary', line, cond, a, b };
  }

  private static LEVELS = [['||'], ['&&'], ['|'], ['^'], ['&'], ['==', '!='], ['<', '>', '<=', '>='], ['<<', '>>', '>>>'], ['+', '-'], ['*', '/', '%']];

  private parseBinary(level: number): Expr {
    if (level >= Parser.LEVELS.length) return this.parseUnary();
    let left = this.parseBinary(level + 1);
    while (this.tok.type === 'op' && Parser.LEVELS[level].includes(this.tok.text)) {
      const op = this.next();
      const right = this.parseBinary(level + 1);
      left = { k: 'binary', line: op.line, op: op.text, a: left, b: right };
    }
    if (this.isKw('instanceof')) throw unsupported('instanceof', this.tok.line);
    return left;
  }

  /** "(int) x" is a cast, while "(x) + 1" is not. Only a type followed by ) is one. */
  private isCast(): boolean {
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

  private parseUnary(): Expr {
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

  private parsePostfix(): Expr {
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

  private parseArgs(): Expr[] {
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

  private parsePrimary(): Expr {
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
  private lambdaAhead(): boolean {
    let depth = 0;
    for (let i = 0; this.peek(i).type !== 'eof'; i++) {
      const text = this.peek(i).text;
      if (text === '(') depth++;
      else if (text === ')' && --depth === 0) return this.peek(i + 1).text === '->';
    }
    return false;
  }

  private parseNew(): Expr {
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

export function parseJava(source: string): Program {
  return new Parser(source).parseProgram();
}
