// The parsed form of a program.

export interface TypeRef {
  name: string;
  dims: number;
}

export interface Program {
  classes: ClassDecl[];
}

export type Access = 'public' | 'protected' | 'package' | 'private';

export interface ClassDecl {
  name: string;
  line: number;
  /** The class it extends. An interface has none, and lists what it extends in `interfaces`. */
  superName?: string;
  interfaces: string[];
  isInterface?: boolean;
  isAbstract?: boolean;
  isFinal?: boolean;
  fields: FieldDecl[];
  methods: MethodDecl[];
  ctors: MethodDecl[];
}

export interface FieldDecl {
  name: string;
  type: TypeRef;
  isStatic: boolean;
  access: Access;
  init: Expr | null;
  line: number;
}

export interface Param {
  name: string;
  type: TypeRef;
}

export interface MethodDecl {
  name: string;
  className: string;
  ret: TypeRef;
  params: Param[];
  isStatic: boolean;
  access: Access;
  isAbstract?: boolean;
  isFinal?: boolean;
  body: Stmt[];
  line: number;
}

export type Stmt =
  | { k: 'block'; line: number; body: Stmt[] }
  | { k: 'var'; line: number; decls: { name: string; type: TypeRef; init: Expr | null }[] }
  | { k: 'expr'; line: number; expr: Expr }
  | { k: 'if'; line: number; cond: Expr; then: Stmt; else: Stmt | null }
  | { k: 'while'; line: number; cond: Expr; body: Stmt }
  | { k: 'do'; line: number; body: Stmt; cond: Expr; condLine: number }
  | { k: 'for'; line: number; init: Stmt[]; cond: Expr | null; update: Expr[]; body: Stmt }
  | { k: 'foreach'; line: number; type: TypeRef; name: string; iter: Expr; body: Stmt }
  | { k: 'switch'; line: number; value: Expr; cases: { line: number; labels: (Expr | 'default')[]; body: Stmt[] }[] }
  | { k: 'break'; line: number }
  | { k: 'continue'; line: number }
  | { k: 'return'; line: number; value: Expr | null }
  | { k: 'empty'; line: number };

export type Expr =
  | { k: 'lit'; line: number; t: 'int' | 'long' | 'double' | 'float' | 'char' | 'boolean' | 'String' | 'null'; v: number | bigint | boolean | string | null }
  | { k: 'name'; line: number; name: string }
  | { k: 'field'; line: number; target: Expr; name: string }
  | { k: 'index'; line: number; target: Expr; index: Expr }
  | { k: 'call'; line: number; target: Expr | null; name: string; args: Expr[] }
  | { k: 'new'; line: number; cls: string; args: Expr[] }
  | { k: 'newarray'; line: number; elem: string; sizes: Expr[]; extraDims: number; init: Expr | null }
  | { k: 'arraylit'; line: number; items: Expr[] }
  | { k: 'unary'; line: number; op: '-' | '+' | '!' | '~'; expr: Expr }
  | { k: 'incdec'; line: number; op: '++' | '--'; prefix: boolean; target: Expr }
  | { k: 'binary'; line: number; op: string; a: Expr; b: Expr }
  | { k: 'assign'; line: number; op: string; target: Expr; value: Expr }
  | { k: 'ternary'; line: number; cond: Expr; a: Expr; b: Expr }
  | { k: 'cast'; line: number; type: TypeRef; expr: Expr }
  | { k: 'this'; line: number }
  | { k: 'super'; line: number }
  /** super(...) or this(...), which only a constructor's first statement may be. */
  | { k: 'ctorcall'; line: number; kind: 'super' | 'this'; args: Expr[] }
  | { k: 'instanceof'; line: number; expr: Expr; type: TypeRef };
