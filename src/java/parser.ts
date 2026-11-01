// A recursive-descent parser for the ISC subset of Java. Anything outside the subset
// stops with a message naming the construct, rather than failing in a confusing way.
import type { ClassDecl, Expr, FieldDecl, MethodDecl, Param, Program, Stmt, TypeRef } from './ast';
import { JavaError } from './lexer';
import { ExpressionParser, PRIMITIVES, unsupported } from './parser-expr';

const MODIFIERS = new Set(['public', 'private', 'protected', 'static', 'final']);

class Parser extends ExpressionParser {
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

  protected skipModifiers(): { isStatic: boolean } {
    let isStatic = false;
    for (;;) {
      this.checkUnsupported();
      if (this.tok.type === 'keyword' && MODIFIERS.has(this.tok.text)) {
        if (this.tok.text === 'static') isStatic = true;
        this.pos++;
      } else return { isStatic };
    }
  }

  protected parseClass(): ClassDecl {
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

  protected parseMember(cls: ClassDecl): void {
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

  protected parseMethodRest(className: string, name: string, ret: TypeRef, isStatic: boolean, line: number): MethodDecl {
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

  protected parseBlockBody(): Stmt[] {
    this.expectOp('{');
    const body: Stmt[] = [];
    while (!this.isOp('}')) {
      if (this.tok.type === 'eof') throw new JavaError('A closing } is missing.', this.tok.line);
      body.push(this.parseStatement());
    }
    this.next();
    return body;
  }

  /** Decides whether the tokens ahead start a local variable declaration. */
  protected looksLikeDeclaration(): boolean {
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

  protected parseVarDecl(): Stmt {
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

  protected parseStatement(): Stmt {
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

  protected parseFor(): Stmt {
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

  protected parseSwitch(): Stmt {
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
}

export function parseJava(source: string): Program {
  return new Parser(source).parseProgram();
}
