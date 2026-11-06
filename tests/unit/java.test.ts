import { describe, expect, it } from 'vitest';
import { runProgram } from '../../src/java/trace';
import { SAMPLES } from '../../src/java/samples';

const wrap = (body: string) => `class T { public static void main(String[] args) { ${body} } }`;
const out = (body: string, input = '') => {
  const r = runProgram(wrap(body), input);
  if (r.error) throw new Error(`${r.error.kind} error line ${r.error.line}: ${r.error.message}`);
  return r.output;
};
const errorOf = (source: string, input = '') => runProgram(source, input).error;
const errorIn = (body: string) => errorOf(wrap(body));

describe('sample programs', () => {
  it('has at least 15 samples across the ISC topics', () => {
    expect(SAMPLES.length).toBeGreaterThanOrEqual(15);
    const topics = new Set(SAMPLES.map((s) => s.topic));
    for (const t of ['Series', 'Number programs', 'String handling', 'Arrays', 'Recursion', 'Classes and objects']) expect(topics.has(t), t).toBe(true);
    expect(SAMPLES.some((s) => /Bubble|Selection/.test(s.title))).toBe(true);
    expect(SAMPLES.some((s) => /search/i.test(s.title))).toBe(true);
  });

  it.each(SAMPLES.map((s) => [s.title, s] as const))('%s prints the expected output', (_title, sample) => {
    const r = runProgram(sample.code, sample.input ?? '');
    expect(r.error).toBeNull();
    expect(r.output).toBe(sample.expected);
    expect(r.steps.length).toBeGreaterThan(1);
  });
});

describe('Java arithmetic', () => {
  it('truncates integer division towards zero', () => {
    expect(out('System.out.println(7 / 2); System.out.println(-7 / 2);')).toBe('3\n-3\n');
  });

  it('keeps the sign of the dividend in %', () => {
    expect(out('System.out.println(7 % 3); System.out.println(-7 % 3); System.out.println(7 % -3);')).toBe('1\n-1\n1\n');
  });

  it('promotes to double when either side is a double', () => {
    expect(out('System.out.println(7 / 2.0); System.out.println(1 / 2 * 2.0);')).toBe('3.5\n0.0\n');
  });

  it('wraps int at 32 bits', () => {
    expect(out('int x = 2147483647; x = x + 1; System.out.println(x);')).toBe('-2147483648\n');
    expect(out('int x = 65536; System.out.println(x * x);')).toBe('0\n');
  });

  it('computes long exactly, beyond double precision', () => {
    expect(out('long x = 9007199254740993L; System.out.println(x + 2);')).toBe('9007199254740995\n');
    expect(out('long x = 9223372036854775807L; x = x + 1; System.out.println(x);')).toBe('-9223372036854775808\n');
  });

  it('treats char as a number in arithmetic', () => {
    expect(out("char c = 'A'; System.out.println(c + 1); System.out.println((char)(c + 1));")).toBe('66\nB\n');
    expect(out("char c = 'a'; c++; System.out.println(c);")).toBe('b\n');
    expect(out("System.out.println('a' + 'b'); System.out.println(\"\" + 'a' + 'b');")).toBe('195\nab\n');
  });

  it('evaluates string concatenation left to right', () => {
    expect(out('System.out.println(1 + 2 + "x" + 1 + 2);')).toBe('3x12\n');
  });

  it('prints doubles as Java does', () => {
    expect(out('System.out.println(1.0); System.out.println(100.0); System.out.println(0.1 + 0.2);')).toBe('1.0\n100.0\n0.30000000000000004\n');
    expect(out('System.out.println(1e10); System.out.println(1.5e-5); System.out.println(12345678.0);')).toBe('1.0E10\n1.5E-5\n1.2345678E7\n');
    expect(out('System.out.println(1.0 / 0); System.out.println(0.0 / 0);')).toBe('Infinity\nNaN\n');
  });

  it('prints floats with float precision', () => {
    expect(out('float f = 0.1f; System.out.println(f); System.out.println(1.5f * 2);')).toBe('0.1\n3.0\n');
  });

  it('casts as Java does', () => {
    expect(out('System.out.println((int) 3.9); System.out.println((int) -3.9); System.out.println((char) 65); System.out.println((int) \'A\');')).toBe('3\n-3\nA\n65\n');
    expect(out('System.out.println((byte) 200);')).toBe('-56\n');
  });

  it('compound assignment casts back to the variable type', () => {
    expect(out('int x = 5; x += 2.7; System.out.println(x);')).toBe('7\n');
    expect(out('byte b = 10; b += 120; System.out.println(b);')).toBe('-126\n');
  });

  it('handles prefix and postfix correctly', () => {
    expect(out('int i = 5; int a = i++; int b = ++i; System.out.println(a + " " + b + " " + i);')).toBe('5 7 7\n');
    expect(out('int i = 5; i = i++ + ++i; System.out.println(i);')).toBe('12\n');
  });

  it('short-circuits && and ||', () => {
    expect(out('int x = 0; boolean b = false && (++x > 0); boolean c = true || (++x > 0); System.out.println(x);')).toBe('0\n');
    expect(out('int a = 0; if (a != 0 && 10 / a > 1) System.out.println("no"); else System.out.println("safe");')).toBe('safe\n');
  });

  it('supports bit operations and the ternary', () => {
    expect(out('System.out.println(5 & 3); System.out.println(5 | 3); System.out.println(5 ^ 3); System.out.println(1 << 4); System.out.println(-8 >> 1); System.out.println(-8 >>> 28);')).toBe('1\n7\n6\n16\n-4\n15\n');
    expect(out('int a = 3; System.out.println(a > 2 ? "big" : "small");')).toBe('big\n');
  });
});

describe('control flow', () => {
  it('runs for, while and do-while', () => {
    expect(out('for (int i = 0; i < 3; i++) System.out.print(i); int j = 0; while (j < 2) { System.out.print(j); j++; } int k = 5; do { System.out.print(k); } while (k < 0);')).toBe('012015');
  });

  it('honours break and continue', () => {
    expect(out('for (int i = 0; i < 6; i++) { if (i == 1) continue; if (i == 4) break; System.out.print(i); }')).toBe('023');
  });

  it('falls through a switch until break', () => {
    const body = (n: number) => `int x = ${n}; switch (x) { case 1: System.out.print("one"); case 2: System.out.print("two"); break; case 3: System.out.print("three"); break; default: System.out.print("other"); }`;
    expect(out(body(1))).toBe('onetwo');
    expect(out(body(3))).toBe('three');
    expect(out(body(9))).toBe('other');
  });

  it('switches on strings and chars', () => {
    expect(out('String s = "b"; switch (s) { case "a": System.out.print(1); break; case "b": System.out.print(2); break; }')).toBe('2');
    expect(out("char c = 'y'; switch (c) { case 'y': System.out.print(1); break; default: System.out.print(0); }")).toBe('1');
  });

  it('scopes variables to their blocks', () => {
    expect(out('for (int i = 0; i < 1; i++) { int x = 1; } for (int i = 0; i < 1; i++) { int x = 2; System.out.print(x); }')).toBe('2');
    expect(errorIn('{ int x = 1; } System.out.print(x);')?.message).toMatch(/Cannot find the variable "x"/);
    expect(errorIn('int x = 1; int x = 2;')?.message).toMatch(/already defined/);
  });
});

describe('arrays', () => {
  it('defaults elements by type', () => {
    expect(out('int[] a = new int[2]; double[] d = new double[1]; boolean[] b = new boolean[1]; String[] s = new String[1]; System.out.println(a[1] + " " + d[0] + " " + b[0] + " " + s[0]);')).toBe('0 0.0 false null\n');
  });

  it('supports 2D arrays, jagged arrays and length', () => {
    expect(out('int[][] m = new int[2][3]; m[1][2] = 7; System.out.println(m.length + " " + m[0].length + " " + m[1][2]);')).toBe('2 3 7\n');
    expect(out('int[][] j = new int[2][]; j[0] = new int[1]; j[1] = new int[4]; System.out.println(j[1].length);')).toBe('4\n');
    expect(out('int a[] = {1, 2}, b = 3; System.out.println(a[1] + b);')).toBe('5\n');
  });

  it('shares an array between references', () => {
    expect(out('int[] a = {1}; int[] b = a; b[0] = 9; System.out.println(a[0]);')).toBe('9\n');
  });

  it('reports an out-of-bounds index, on the right line', () => {
    const e = errorOf('class T {\n  public static void main(String[] args) {\n    int[] a = new int[3];\n    a[3] = 1;\n  }\n}');
    expect(e?.message).toBe('java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3');
    expect(e?.line).toBe(4);
  });

  it('supports Arrays.sort and Arrays.toString', () => {
    expect(out('int[] a = {3, 1, 2}; java.util.Arrays.sort(a); System.out.println(java.util.Arrays.toString(a));')).toBe('[1, 2, 3]\n');
  });
});

describe('strings and library methods', () => {
  it('supports the common String methods', () => {
    const body = 'String s = "Hello World"; System.out.println(s.length()); System.out.println(s.charAt(4)); System.out.println(s.substring(6)); System.out.println(s.substring(0, 5)); System.out.println(s.indexOf(\'o\')); System.out.println(s.lastIndexOf("o")); System.out.println(s.toUpperCase()); System.out.println(s.replace(\'l\', \'L\')); System.out.println("  x ".trim()); System.out.println(s.contains("World")); System.out.println(s.startsWith("He")); System.out.println(s.endsWith("x"));';
    expect(out(body)).toBe('11\no\nWorld\nHello\n4\n7\nHELLO WORLD\nHeLLo WorLd\nx\ntrue\ntrue\nfalse\n');
  });

  it('compares strings', () => {
    expect(out('String a = "abc"; String b = "abd"; System.out.println(a.compareTo(b)); System.out.println(a.equals("abc")); System.out.println("ABC".equalsIgnoreCase(a));')).toBe('-1\ntrue\ntrue\n');
  });

  it('distinguishes == from equals for new strings', () => {
    expect(out('String a = new String("x"); String b = new String("x"); System.out.println(a == b); System.out.println(a.equals(b));')).toBe('false\ntrue\n');
  });

  it('supports StringBuffer', () => {
    expect(out('StringBuffer sb = new StringBuffer("abc"); sb.append("d").append(1); sb.reverse(); System.out.println(sb); System.out.println(sb.length()); sb.insert(0, "x"); sb.deleteCharAt(1); System.out.println(sb.toString());')).toBe('1dcba\n5\nxdcba\n');
  });

  it('supports Math', () => {
    expect(out('System.out.println(Math.abs(-3)); System.out.println(Math.pow(2, 10)); System.out.println(Math.sqrt(16)); System.out.println(Math.max(2, 3)); System.out.println(Math.min(2.5, 3)); System.out.println(Math.floor(2.7)); System.out.println(Math.ceil(2.1)); System.out.println(Math.round(2.5)); System.out.println(Math.round(-2.5));')).toBe('3\n1024.0\n4.0\n3\n2.5\n2.0\n3.0\n3\n-2\n');
    expect(out('System.out.println((int) Math.PI);')).toBe('3\n');
  });

  it('supports Character and Integer', () => {
    expect(out("System.out.println(Character.isDigit('5')); System.out.println(Character.isLetter('5')); System.out.println(Character.toUpperCase('a')); System.out.println(Character.getNumericValue('7')); System.out.println(Character.isWhitespace(' '));")).toBe('true\nfalse\nA\n7\ntrue\n');
    expect(out('System.out.println(Integer.parseInt("42") + 1); System.out.println(Integer.toBinaryString(10)); System.out.println(Integer.MAX_VALUE); System.out.println(Integer.toString(5) + 1);')).toBe('43\n1010\n2147483647\n51\n');
    expect(out('System.out.println(Double.parseDouble("2.5") * 2);')).toBe('5.0\n');
  });

  it('supports printf', () => {
    expect(out('System.out.printf("%d %5.2f %s %c%n", 5, 3.14159, "x", \'y\');')).toBe('5  3.14 x y\n');
    expect(out('System.out.printf("%05d|%-4d|%4s|", 42, 7, "ab");')).toBe('00042|7   |  ab|');
  });

  it('reports bad numbers as Java does', () => {
    expect(errorIn('Integer.parseInt("abc");')?.message).toMatch(/NumberFormatException.*"abc"/);
  });
});

describe('input', () => {
  it('reads with Scanner', () => {
    expect(out('java.util.Scanner s = new java.util.Scanner(System.in); int a = s.nextInt(); double b = s.nextDouble(); String w = s.next(); System.out.println(a + " " + b + " " + w);', '4 2.5\nhello')).toBe('4 2.5 hello\n');
  });

  it('handles nextLine after nextInt as Java does', () => {
    expect(out('java.util.Scanner s = new java.util.Scanner(System.in); int a = s.nextInt(); String rest = s.nextLine(); String line = s.nextLine(); System.out.println(a + "[" + rest + "][" + line + "]");', '5\nthe line')).toBe('5[][the line]\n');
  });

  it('reads with BufferedReader', () => {
    const src = 'import java.io.*;\nclass T { public static void main(String[] args) throws IOException { BufferedReader br = new BufferedReader(new InputStreamReader(System.in)); int n = Integer.parseInt(br.readLine()); String s = br.readLine(); System.out.println(n * 2); System.out.println(s); } }';
    expect(runProgram(src, '21\nhi').output).toBe('42\nhi\n');
  });

  it('explains when input runs out, and when it is the wrong type', () => {
    expect(errorIn('java.util.Scanner s = new java.util.Scanner(System.in); s.nextInt();')?.message).toMatch(/more input than the Input box holds/);
    expect(runProgram(wrap('java.util.Scanner s = new java.util.Scanner(System.in); s.nextInt();'), 'abc').error?.message).toMatch(/InputMismatchException/);
  });
});

describe('methods and classes', () => {
  it('passes primitives by value and arrays by reference', () => {
    const src = 'class T { static void f(int x, int[] a) { x = 99; a[0] = 99; } public static void main(String[] args) { int v = 1; int[] arr = {1}; f(v, arr); System.out.println(v + " " + arr[0]); } }';
    expect(runProgram(src).output).toBe('1 99\n');
  });

  it('chooses overloads by argument type', () => {
    const src = 'class T { static String f(int x) { return "int"; } static String f(double x) { return "double"; } static String f(String x) { return "String"; } static String f(int a, int b) { return "two"; } public static void main(String[] args) { System.out.println(f(1) + f(1.5) + f("s") + f(1, 2)); } }';
    expect(runProgram(src).output).toBe('intdoubleStringtwo\n');
  });

  it('widens arguments', () => {
    const src = 'class T { static double half(double x) { return x / 2; } public static void main(String[] args) { System.out.println(half(5)); } }';
    expect(runProgram(src).output).toBe('2.5\n');
  });

  it('recurses deeply and detects runaway recursion', () => {
    const ok = 'class T { static int s(int n) { return n == 0 ? 0 : n + s(n - 1); } public static void main(String[] args) { System.out.println(s(1000)); } }';
    expect(runProgram(ok).output).toBe('500500\n');
    const bad = 'class T { static int s(int n) { return s(n + 1); } public static void main(String[] args) { s(0); } }';
    expect(runProgram(bad).error?.message).toMatch(/StackOverflowError/);
  });

  it('keeps only the innermost calls when recursion goes deep', () => {
    const r = runProgram('class T { static int s(int n) { return n == 0 ? 0 : n + s(n - 1); } public static void main(String[] args) { s(200); } }');
    const deepest = r.steps.reduce((a, b) => (b.depth > a.depth ? b : a));
    expect(deepest.depth).toBe(202);
    expect(deepest.frames.length).toBeLessThanOrEqual(25);
    expect(deepest.frames[0].method).toMatch(/^main/);
    expect(deepest.frames[deepest.frames.length - 1].method).toBe('s(0)');
  });

  it('runs constructors, this, fields, and object references', () => {
    const src = `class P { int x = 1; int y; static int n = 0;
      P(int y) { this.y = y; n++; }
      P() { y = 5; n++; }
      int sum() { return x + y; }
      P same() { return this; } }
      class M { public static void main(String[] args) { P a = new P(2); P b = new P(); P c = a.same(); c.x = 10; System.out.println(a.sum() + " " + b.sum() + " " + P.n + " " + (a == c)); } }`;
    expect(runProgram(src).output).toBe('12 6 2 true\n');
  });

  it('prints an object by calling its toString', () => {
    const src = 'class P { public String toString() { return "P!"; } } class M { public static void main(String[] a) { P p = new P(); System.out.println(p.toString()); } }';
    expect(runProgram(src).output).toBe('P!\n');
  });

  it('builds a linked list, and can show objects that refer to each other', () => {
    const src = `class Node { int data; Node next; Node(int d) { data = d; next = null; } }
      class L { public static void main(String[] a) {
        Node head = null;
        for (int i = 1; i <= 3; i++) { Node n = new Node(i); n.next = head; head = n; }
        Node p = head; int sum = 0;
        while (p != null) { sum += p.data; p = p.next; }
        System.out.println(sum);
        Node x = new Node(1); Node y = new Node(2); x.next = y; y.next = x;
        System.out.println(x.next.next.data);
      } }`;
    const r = runProgram(src);
    expect(r.error).toBeNull();
    expect(r.output).toBe('6\n1\n');
  });

  it('reports a null reference', () => {
    expect(errorIn('String s = null; s.length();')?.message).toMatch(/NullPointerException/);
    const src = 'class P { int x; } class M { public static void main(String[] a) { P p = null; p.x = 1; } }';
    expect(runProgram(src).error?.message).toMatch(/NullPointerException/);
  });
});

describe('errors students actually make', () => {
  it('reports division by zero', () => {
    expect(errorIn('int a = 0; System.out.println(1 / a);')?.message).toBe('java.lang.ArithmeticException: / by zero');
  });

  it('stops an infinite loop with a helpful message', () => {
    const e = errorIn('int i = 0; while (i < 5) { System.out.print(""); }');
    expect(e?.message).toMatch(/infinite loop/);
  });

  it('reports lossy conversion as javac does', () => {
    expect(errorIn('int x = 3.5;')?.message).toMatch(/possible lossy conversion from double to int/);
    expect(errorIn('float f = 1.5;')?.message).toMatch(/lossy conversion from double to float/);
    expect(errorIn('long big = 5; int x = big;')?.message).toMatch(/lossy conversion from long to int/);
  });

  it('allows constants that fit into small types', () => {
    expect(out('byte b = 10; char c = 65; short s = 300; System.out.println(b + " " + c + " " + s);')).toBe('10 A 300\n');
    expect(errorIn('byte b = 200;')?.message).toMatch(/lossy conversion/);
  });

  it('reports incompatible types', () => {
    expect(errorIn('int x = "hello";')?.message).toMatch(/String cannot be converted to int/);
    expect(errorIn('String s = 5;')?.message).toMatch(/int cannot be converted to String/);
  });

  it('reports using a variable before giving it a value', () => {
    expect(errorIn('int x; System.out.println(x);')?.message).toMatch(/might not have been initialized/);
  });

  it('reports non-boolean conditions', () => {
    expect(errorIn('int x = 1; if (x) { }')?.message).toMatch(/must be true or false/);
  });

  it('reports a missing method, and wrong arguments', () => {
    expect(errorIn('foo();')?.message).toMatch(/no method called foo/);
    expect(errorOf('class T { static void f(int a) { } public static void main(String[] x) { f(); } }')?.message).toMatch(/f takes 1 argument, but was given 0/);
    expect(errorOf('class T { static void f(int a) { } public static void main(String[] x) { f("s"); } }')?.message).toMatch(/cannot take arguments of type \(String\)/);
  });

  it('reports calling an instance method from main', () => {
    expect(errorOf('class T { void f() { } public static void main(String[] x) { f(); } }')?.message).toMatch(/cannot be called from a static method/);
    expect(errorOf('class T { int v; public static void main(String[] x) { v = 1; } }')?.message).toMatch(/cannot be used from a static method/);
  });

  it('reports a method that forgets to return', () => {
    expect(errorOf('class T { static int f() { int a = 1; } public static void main(String[] x) { f(); } }')?.message).toMatch(/must return a int/);
  });

  it('points to the line of a syntax error', () => {
    const e = errorOf('class T {\n  public static void main(String[] args) {\n    int x = 5\n    System.out.println(x);\n  }\n}');
    expect(e?.kind).toBe('compile');
    expect(e?.message).toMatch(/Expected ";"/);
    expect(e?.line).toBe(3);
  });

  it('reports unclosed strings, comments and braces', () => {
    expect(errorIn('String s = "oops;')?.message).toMatch(/not closed/);
    expect(errorOf('class T { /* never closed')?.message).toMatch(/never closed/);
    expect(errorOf('class T { public static void main(String[] a) { ')?.message).toMatch(/closing \}/);
  });

  it('requires a main method', () => {
    expect(errorOf('class T { }')?.message).toMatch(/No main method/);
    expect(errorOf('')?.message).toMatch(/at least one class/);
  });
});

describe('unsupported syntax names the construct', () => {
  const cases: [string, string, RegExp][] = [
    ['try/catch', wrap('try { int x = 1; } catch (Exception e) { }'), /try\/catch is not supported/],
    ['throw', wrap('throw new RuntimeException();'), /throw is not supported/],
    ['generics', wrap('java.util.ArrayList<Integer> a = null;'), /Generic types.*not supported/],
    ['ArrayList', wrap('ArrayList<String> a = new ArrayList<String>();'), /Generic types.*not supported/],
    ['raw collections', wrap('Object a = new HashMap();'), /class HashMap is not supported/],
    ['a library interface', 'class T implements Runnable { public static void main(String[] a) { } }', /Library interfaces aren.t supported/],
    ['enums', 'enum E { A } class T { public static void main(String[] a) { } }', /Enums are not supported/],
    ['nested classes', 'class T { class In { } public static void main(String[] a) { } }', /Nested classes and interfaces are not supported/],
    ['lambda', wrap('Runnable r = () -> { };'), /Lambda expressions are not supported/],
    ['lambda with parameters', wrap('Object f = (a, b) -> a;'), /Lambda expressions are not supported/],
    ['arrow switch', wrap('int x = 1; switch (x) { case 1 -> System.out.print(1); }'), /Arrow switch cases.*not supported/],
    ['labelled break', wrap('for (;;) { break outer; }'), /Labelled break is not supported/],
    ['varargs', 'class T { static void f(int... a) { } public static void main(String[] a) { } }', /Variable-length arguments.*not supported/],
    ['unknown library method', wrap('Math.frobnicate(1);'), /Math\.frobnicate is not supported/],
    ['unknown string method', wrap('"a".frob();'), /String\.frob is not supported/],
    ['unknown class', wrap('Thread.sleep(5);'), /class Thread is not supported/],
  ];
  it.each(cases)('%s', (_name, source, pattern) => {
    const r = runProgram(source);
    expect(r.error, 'should report an error').not.toBeNull();
    expect(r.error!.message).toMatch(pattern);
  });

  it('never crashes silently on nonsense', () => {
    for (const junk of ['@@@', '}{', 'class', 'class {', 'class T { int }', 'class T { void f( }', '#include <stdio.h>', 'int main() { return 0; }', 'x = 1;', '"', "'", '/*']) {
      const r = runProgram(junk);
      expect(r.error, junk).not.toBeNull();
      expect(r.error!.message.length).toBeGreaterThan(5);
      expect(r.error!.message).not.toMatch(/inside the tracer/);
    }
  });
});

describe('stepping and the trace table', () => {
  const src = `class T {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 3; i++) {
            sum = sum + i;
        }
        System.out.println(sum);
    }
}`;

  it('records each step, with the current line', () => {
    const r = runProgram(src);
    const lines = r.steps.map((s) => s.line);
    expect(lines[0]).toBe(3);
    expect(lines).toContain(4);
    expect(lines.filter((l) => l === 5).length).toBe(3);
    expect(lines).toContain(7);
  });

  it('shows live variables at each step', () => {
    const r = runProgram(src);
    const atPrint = r.steps.find((s) => s.line === 7)!;
    const sum = atPrint.frames[0].vars.find((v) => v.name === 'sum')!;
    expect(sum.value).toBe('6');
    expect(sum.type).toBe('int');
    // i has gone out of scope once the loop ends.
    expect(atPrint.frames[0].vars.some((v) => v.name === 'i')).toBe(false);
  });

  it('shows the call stack during recursion', () => {
    const rec = 'class T {\n static int f(int n) {\n  if (n == 0) return 0;\n  return n + f(n - 1);\n }\n public static void main(String[] a) {\n  f(2);\n }\n}';
    const r = runProgram(rec);
    const deepest = Math.max(...r.steps.map((s) => s.frames.length));
    expect(deepest).toBe(4); // main, f(2), f(1), f(0)
    const step = r.steps.find((s) => s.frames.length === 4)!;
    expect(step.frames[3].method).toBe('f(0)');
    expect(step.frames[0].method).toMatch(/^main/);
  });

  it('builds a dry-run table for loops', () => {
    const r = runProgram(src);
    expect(r.columns).toEqual(expect.arrayContaining(['sum', 'i']));
    expect(r.columns).not.toContain('args');
    const seenSums = r.rows.map((row) => row.values.sum);
    expect(seenSums).toEqual(expect.arrayContaining(['1', '3', '6']));
    const conditions = r.rows.filter((row) => row.condition !== undefined).map((row) => row.condition);
    expect(conditions).toEqual(['true', 'true', 'true', 'false']);
  });

  it('records console output against the trace', () => {
    const loop = 'class T { public static void main(String[] a) { for (int i = 0; i < 2; i++) { System.out.print("x" + i); } } }';
    const r = runProgram(loop);
    const printed = r.rows.flatMap((row) => (row.output ? [row.output] : []));
    expect(printed.join('')).toBe('x0x1');
  });

  it('credits a loop with what a called method prints', () => {
    const r = runProgram('class T { static void p(int v) { System.out.print(v); } public static void main(String[] a) { for (int i = 0; i < 2; i++) { p(i); } } }');
    expect(r.rows.flatMap((row) => (row.output ? [row.output] : [])).join('')).toBe('01');
  });

  it('keeps the program state when it stops on an error', () => {
    const r = runProgram('class T {\n public static void main(String[] a) {\n  int x = 7;\n  System.out.println(x);\n  System.out.println(x / 0);\n }\n}');
    const last = r.steps[r.steps.length - 1];
    expect(r.error?.line).toBe(5);
    expect(last.line).toBe(5);
    expect(last.outputLength).toBe(2);
    expect(last.frames[0].vars.find((v) => v.name === 'x')?.value).toBe('7');
  });

  it('ties output to the step that printed it', () => {
    const r = runProgram('class T {\n public static void main(String[] a) {\n  System.out.print("a");\n  System.out.print("b");\n }\n}');
    expect(r.output).toBe('ab');
    expect(r.steps[r.steps.length - 1].outputLength).toBe(2);
  });

  it('stays quick on a long loop', () => {
    const start = performance.now();
    const r = runProgram('class T { public static void main(String[] a) { long s = 0; for (int i = 0; i < 40000; i++) { s += i; } System.out.println(s); } }');
    expect(r.output).toBe('799980000\n');
    expect(performance.now() - start).toBeLessThan(5000);
  });
});
