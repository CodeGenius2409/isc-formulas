// Programs run through both the interpreter and a real JDK by java-jdk.test.ts. There are
// no expected outputs here on purpose: the JDK is the answer key.

export interface JdkProgram {
  name: string;
  code: string;
  input?: string;
  /** The Java exception the program should end with, when it is meant to crash. */
  throws?: string;
}

let next = 0;

/** A program made of statements inside main. */
const body = (name: string, statements: string, extra: Partial<JdkProgram> = {}): JdkProgram => {
  next += 1;
  return { name, code: `class B${next} {\n  public static void main(String[] args) throws Exception {\n${statements}\n  }\n}`, ...extra };
};

/** Prints each expression on its own line. */
const prints = (name: string, ...exprs: string[]): JdkProgram => body(name, exprs.map((e) => `    System.out.println(${e});`).join('\n'));

export const PROGRAMS: JdkProgram[] = [
  // Printing numbers
  prints('doubles across magnitudes', '1.0', '100.0', '0.1 + 0.2', '1e7', '9999999.0', '1.0E7 - 1', '0.001', '9.99e-4', '1e-3', '1e21', '1e22', '123456789012.0', '100.0 / 3', '2.0 / 3', '1.5e300 * 1.5e300', 'Double.MAX_VALUE', 'Double.MIN_VALUE', '4.35 * 100', '1.1 + 2.2', '1e23', '2e-323', '1e-323', '1e100'),
  prints('floats', '1.1f', '3.3f', '1e10f', '1.0E-5f', '16777216f', '0.3f + 0.6f', '1.5f * 2', '1 / 3f', '(double) 0.1f', '(float) 0.1', '100f', 'Float.MAX_VALUE', '(float) 1e40', 'Float.MIN_VALUE', '(float) 1e-44', '1e-40f'),
  prints('special values', '1.0 / 0', '-1.0 / 0', '0.0 / 0', '0.0 == -0.0', '-0.0', '0.0 / 0 == 0.0 / 0', '0.0 / 0 != 0.0 / 0', '5.5 % 2', '-5.5 % 2', '5 % 2.5', '1e300 % 7'),
  prints('integer limits', 'Integer.MAX_VALUE + 1', 'Integer.MIN_VALUE - 1', 'Integer.MIN_VALUE / -1', 'Integer.MIN_VALUE % -1', '-7 / 2', '-7 % 2', '7 % -2', '46341 * 46341', '65536 * 65536', '2147483647 * 2', 'Long.MAX_VALUE + 1', '3000000000L * 4', '1000000 * 1000000', '1000000L * 1000000'),
  prints('casts', '(int) 3.99', '(int) -3.99', '(int) 1e19', '(int) -1e19', '(int) (0.0 / 0)', '(long) 1e19', '(long) -1e19', '(long) (0.0 / 0)', '(char) 65.7', '(int) \'z\'', '(short) 70000', '(byte) 200', '(byte) -129', '(int) 3000000000L', '(float) 1 / 3', '(double) 1 / 3', '(char) (\'a\' + 1)', '(int) 2.5f', '(long) -2.5', '(byte) 300.7'),
  prints('shifts and bits', '1 << 33', '1L << 33', '-1 >>> 1', '-1L >>> 1', '-8 >> 1', '-8 >>> 28', '5 & 3', '5 | 3', '5 ^ 3', '~5', '~-1', 'true & false', 'true | false', 'true ^ true', '1 << -1', '(byte) 1 << 9'),
  prints('chars in arithmetic', '\'a\' + 1', '\'a\' + \'b\'', '"" + \'a\' + 1', '\'a\' + 1 + ""', '1 + \'a\' + ""', '"" + 1 + 2', '1 + 2 + ""', '\'a\'', '(char) 97', '\'a\' < \'b\'', '\'a\' == 97', 'Character.getNumericValue(\'a\')', '(char) (\'A\' + 25)'),
  prints('concatenation of every type', '"" + 1.0f', '"" + 1L', '"" + (byte) 1', '"" + true', '"" + \'c\'', '"" + 1e10', '"" + null', '"a" + 1 + 2.5 + \'b\' + true', '1 + 2 + "x" + 1 + 2'),

  // The type of a conditional expression
  body('ternary promotes to the wider type', `    int i = 97;
    char c = 'b';
    long l = 5;
    System.out.println(true ? 1 : 2.0);
    System.out.println(false ? 1.5 : 2);
    System.out.println(true ? i : 2.0);
    System.out.println(true ? 'a' : 0);
    System.out.println(true ? 'a' : i);
    System.out.println(false ? i : 'a');
    System.out.println(true ? c : 98);
    System.out.println(true ? 1 : l);
    System.out.println(true ? 1 : 'a');
    System.out.println(true ? "s" : "t");
    System.out.println(i > 0 ? i : 0.5);
    double d = true ? 1 : 2;
    System.out.println(d);`),

  // String identity, which exam questions love
  body('string == and equals', `    String a = "hello";
    String b = "hello";
    String c = new String("hello");
    String d = c.intern();
    String e = "hel" + "lo";
    String part = "hel";
    String f = part + "lo";
    System.out.println(a == b);
    System.out.println(a == c);
    System.out.println(a == d);
    System.out.println(a == e);
    System.out.println(a == f);
    System.out.println(a.equals(c));
    System.out.println(a.equals(f));
    System.out.println(a != c);
    String none = null;
    System.out.println(none == null);
    System.out.println("x".equals(none));
    String s = "abc";
    System.out.println(s.substring(0) == s);
    System.out.println(s.substring(1) == "bc");
    System.out.println(s.trim() == s);
    System.out.println(s.toUpperCase() == s);
    System.out.println(s.toLowerCase() == s);
    System.out.println(s.concat("") == s);
    System.out.println(s.replace('z', 'y') == s);
    System.out.println(s.toString() == s);
    System.out.println(new String("abc").intern() == "abc");
    System.out.println(("a" + 1) == "a1");
    String[] pair = {"abc", "abc"};
    System.out.println(pair[0] == pair[1]);`),

  // Assignment
  body('compound assignment', `    int x = 10;
    x /= 3; System.out.println(x);
    x %= 2; System.out.println(x);
    x <<= 3; System.out.println(x);
    x >>= 1; System.out.println(x);
    x ^= 5; System.out.println(x);
    x |= 8; System.out.println(x);
    x &= 12; System.out.println(x);
    x *= 1.5; System.out.println(x);
    x += 2.7; System.out.println(x);
    x -= 0.5; System.out.println(x);
    double d = 5; d /= 2; System.out.println(d);
    char c = 'a'; c += 1; System.out.println(c);
    c++; System.out.println(c);
    c *= 1; System.out.println(c);
    long l = 5; l += 1.7; System.out.println(l);
    byte b = 10; b += 120; System.out.println(b);
    short s = 1; s++; System.out.println(s);
    String t = "a"; t += 1; t += 'b'; t += 2.5; System.out.println(t);
    boolean f = true; f &= false; System.out.println(f);
    f |= true; System.out.println(f);
    f ^= true; System.out.println(f);`),
  body('increment order', `    int i = 5;
    i = i++; System.out.println(i);
    int j = i++ + i++; System.out.println(j + " " + i);
    int k = ++i + i++; System.out.println(k + " " + i);
    i = 5; i += i++ + ++i; System.out.println(i);
    i = 5; i = i++ * 2 + --i; System.out.println(i);
    int[] a = new int[4];
    i = 0;
    a[i] = i = 2; System.out.println(a[0] + " " + a[2] + " " + i);
    i = 0;
    a[i++] = i; System.out.println(a[0] + " " + i);
    a[i++] += 10; System.out.println(a[1] + " " + i);
    int x, y, z;
    x = y = z = 7; System.out.println(x + y + z);
    int n = 0;
    boolean b = n++ > 0 && n++ > 0; System.out.println(b + " " + n);
    b = n++ > 0 || n++ > 0; System.out.println(b + " " + n);
    b = n++ > 100 & n++ > 100; System.out.println(b + " " + n);`),
  body('declarations and widening', `    byte b = 10; char c = 65; short s = 300; int i = c; long l = i; float f = l; double d = f;
    System.out.println(b + " " + c + " " + s + " " + i + " " + l + " " + f + " " + d);
    final int N = 5; final double RATE = 0.5;
    System.out.println(N * RATE);
    double half = 1 / 2; System.out.println(half);
    double ok = 1 / 2.0; System.out.println(ok);
    int sum = 7, n = 2;
    double avg = (double) sum / n; System.out.println(avg);
    double wrong = (double) (sum / n); System.out.println(wrong);
    int r = (int) Math.round(2.6); System.out.println(r);
    int p = (int) Math.pow(2, 10); System.out.println(p);
    long big = 1L << 40; System.out.println(big);
    float g = 3; System.out.println(g / 2);
    int[] arr[] = {{1}, {2, 3}}; System.out.println(arr[1][1]);
    int m[] = {1, 2}, q = 3; System.out.println(m[1] + q);`),

  // Control flow
  body('switch fallthrough and default in the middle', `    for (int x = 1; x <= 4; x++) {
      switch (x) {
        case 1: System.out.print("one ");
        default: System.out.print("def ");
        case 2: System.out.print("two "); break;
        case 3: System.out.print("three ");
      }
      System.out.println();
    }
    switch (5) { case 1: System.out.println("no"); }
    char g = 'B';
    switch (g) { case 'A': case 'B': System.out.println("top"); break; default: System.out.println("rest"); }
    String s = "b";
    switch (s) { case "a": System.out.println(1); break; case "b": System.out.println(2); break; }
    int total = 0;
    for (int i = 0; i < 3; i++) { switch (i) { case 1: continue; default: total += 10; } total += 1; }
    System.out.println(total);`),
  body('loops', `    for (int i = 0, j = 10; i < j; i += 3, j -= 2) System.out.print(i + ":" + j + " ");
    System.out.println();
    int n = 0;
    for (;;) { if (++n > 3) break; }
    System.out.println(n);
    int w = 0;
    while (true) { w++; if (w == 2) continue; if (w > 4) break; System.out.print(w); }
    System.out.println();
    int d = 10;
    do { System.out.print(d); d--; if (d == 8) continue; } while (d > 7);
    System.out.println();
    for (int i = 0; i < 3; i++) { for (int j = 0; j < 3; j++) { if (j == i) break; System.out.print(i * 10 + j + " "); } }
    System.out.println();
    int[][] t = {{1, 2}, {3}};
    for (int[] row : t) for (int v : row) System.out.print(v);
    System.out.println();
    for (char c : "abc".toCharArray()) System.out.print((char) (c + 1));
    System.out.println();`),

  // Library
  prints('Math', 'Math.abs(-3)', 'Math.abs(-2.5)', 'Math.abs(-3L)', 'Math.abs(Integer.MIN_VALUE)', 'Math.pow(2, 10)', 'Math.pow(2, 0.5)', 'Math.sqrt(16)', 'Math.sqrt(2)', 'Math.cbrt(27)', 'Math.max(2, 3)', 'Math.max(1, 2.5)', 'Math.max(1L, 2)', 'Math.min(2.5, 3)', 'Math.min(-0.0, 0.0)', 'Math.floor(2.7)', 'Math.floor(-1.5)', 'Math.ceil(2.1)', 'Math.ceil(-0.5)', 'Math.round(2.5)', 'Math.round(-2.5)', 'Math.round(2.4f)', 'Math.round(-0.5)', 'Math.round(1e18)', 'Math.round(1e19)', 'Math.round(-1e19)', 'Math.round(0.0 / 0)', 'Math.rint(2.5)', 'Math.rint(3.5)', 'Math.sin(0)', 'Math.cos(0)', 'Math.tan(0)', 'Math.log(Math.E)', 'Math.log10(1000)', 'Math.exp(0)', 'Math.toDegrees(Math.PI)', 'Math.toRadians(180)', 'Math.hypot(3, 4)', 'Math.atan2(1, 1)', 'Math.signum(-2.5)', 'Math.floorMod(-7, 3)', 'Math.PI', 'Math.E', 'Math.sqrt(-1)', 'Math.max(\'a\', 1)'),
  prints('String methods', '"Hello".length()', '"Hello".charAt(1)', '"Hello".charAt(1) + 1', '"Hello".substring(2)', '"Hello".substring(1, 3)', '"Hello".substring(0, 0).isEmpty()', '"Hello".indexOf(\'l\')', '"Hello".indexOf("l", 3)', '"Hello".indexOf(\'z\')', '"Hello".indexOf("")', '"Hello".lastIndexOf(\'l\')', '"Hello".lastIndexOf("l", 2)', '"Hello".toUpperCase()', '"Hello".toLowerCase()', '"  x ".trim()', '"abc".compareTo("abd")', '"abc".compareTo("ab")', '"apple".compareTo("Banana")', '"ABC".compareToIgnoreCase("abd")', '"ABC".equalsIgnoreCase("abc")', '"abc".concat("d")', '"a-b-c".replace(\'-\', \'+\')', '"aXbXc".replace("X", "__")', '"banana".replaceAll("[aeiou]", "*")', '"banana".replaceFirst("a", "o")', '"abc".contains("bc")', '"abc".startsWith("ab")', '"abc".startsWith("b", 1)', '"abc".endsWith("c")', '"".isEmpty()', '"hello".hashCode()', '"".hashCode()', 'String.valueOf(5)', 'String.valueOf(2.5)', 'String.valueOf(\'c\')', 'String.valueOf(true)', 'String.join("-", "a", "b")', '"abc".equals("abc")'),
  body('split', `    String[][] cases = {"a,b,,c,,".split(","), "  a b".split(" "), "a  b".split(" +"), "abc".split(""), "a1b2".split("[0-9]"), "".split(","), ",a".split(","), "a.b".split("\\\\."), "...".split("\\\\."), "none".split(","), "x y z".split(" ")};
    for (String[] parts : cases) {
      System.out.print(parts.length + ":");
      for (String p : parts) System.out.print("[" + p + "]");
      System.out.println();
    }`),
  body('StringBuffer and StringBuilder', `    StringBuffer sb = new StringBuffer("abc");
    sb.append("d").append(1).append('x').append(2.5).append(true);
    System.out.println(sb);
    System.out.println(sb.length());
    sb.reverse(); System.out.println(sb);
    sb.insert(0, "START"); System.out.println(sb);
    sb.deleteCharAt(0); System.out.println(sb);
    sb.setCharAt(0, 'Z'); System.out.println(sb.toString());
    sb.delete(0, 3); System.out.println(sb);
    sb.replace(0, 2, "__"); System.out.println(sb);
    System.out.println(sb.charAt(0));
    System.out.println(sb.indexOf("_"));
    System.out.println(sb.substring(1, 3));
    StringBuilder b = new StringBuilder();
    b.append(1).append(2);
    System.out.println(b);
    System.out.println("" + b + "!");
    String s = b.toString() + "?"; System.out.println(s);`),
  prints('Character', 'Character.isDigit(\'5\')', 'Character.isLetter(\'5\')', 'Character.isLetterOrDigit(\'_\')', 'Character.isUpperCase(\'A\')', 'Character.isLowerCase(\'A\')', 'Character.isWhitespace(\' \')', 'Character.toUpperCase(\'a\')', 'Character.toLowerCase(\'A\')', 'Character.toUpperCase(\'a\') + 1', 'Character.getNumericValue(\'7\')', 'Character.getNumericValue(\'-\')', 'Character.toString(\'q\')', 'Character.toUpperCase(\'1\')'),
  prints('Integer, Long, Double and Boolean', 'Integer.parseInt("42") + 1', 'Integer.parseInt("-12")', 'Integer.parseInt("101", 2)', 'Integer.parseInt("+5")', 'Integer.toString(255, 16)', 'Integer.toString(5) + 1', 'Integer.toBinaryString(10)', 'Integer.toBinaryString(-1)', 'Integer.toHexString(255)', 'Integer.toOctalString(8)', 'Integer.valueOf("7") + 1', 'Integer.MAX_VALUE', 'Integer.MIN_VALUE', 'Integer.compare(1, 2)', 'Integer.bitCount(7)', 'Integer.sum(1, 2)', 'Long.parseLong("9000000000")', 'Long.MAX_VALUE', 'Long.MIN_VALUE', 'Double.parseDouble("1e3")', 'Double.parseDouble("2.5") * 2', 'Double.toString(1.5)', 'Double.isNaN(0.0 / 0)', 'Boolean.parseBoolean("TRUE")', 'Boolean.parseBoolean("yes")'),
  body('printf and String.format', `    System.out.printf("%d|%5d|%-5d|%05d|%+d|%,d%n", 42, 42, 42, 42, 42, 1234567);
    System.out.printf("%x|%X|%o|%c|%s|%10s|%-10s|%b|%%%n", 255, 255, 8, 'y', "s", "right", "left", true);
    System.out.printf("%f|%.2f|%10.3f|%-10.1f|%e|%.2e|%,.2f%n", 3.14159, 3.14159, 3.14159, 3.14159, 31415.9, 31415.9, 1234567.891);
    System.out.printf("%.2f %.2f %.2f %.1f %.1f %.0f %.0f %.0f %.3f%n", 1.005, 2.675, 1.115, 0.25, 0.35, 0.5, 1.5, 2.5, 1.0005);
    System.out.println(String.format("%03d-%s", 7, "x"));
    System.out.printf("%s %s %s %s%n", 1, 2.5, 'c', true);
    System.out.printf("%d%n", 'a' + 0);
    System.out.printf("%5.1f%%%n", 12.345);
    System.out.printf("%.2f%n", 1e10);
    System.out.printf("%.3f%n", 0.0005);
    System.out.printf("%.2f%n", -0.005);`),
  body('Arrays', `    int[] a = {3, 1, 2};
    java.util.Arrays.sort(a);
    System.out.println(java.util.Arrays.toString(a));
    double[] d = {2.5, 1}; System.out.println(java.util.Arrays.toString(d));
    char[] c = {'b', 'a'}; java.util.Arrays.sort(c); System.out.println(java.util.Arrays.toString(c));
    System.out.println(c);
    System.out.println(new String(c));
    System.out.println(String.valueOf(c));
    boolean[] b = new boolean[2]; System.out.println(java.util.Arrays.toString(b));
    String[] s = {"pear", "Apple", "fig"}; java.util.Arrays.sort(s); System.out.println(java.util.Arrays.toString(s));
    String[] n = new String[2]; System.out.println(n[0] + java.util.Arrays.toString(n));
    int[][] m = {{1, 2}, {3}}; System.out.println(java.util.Arrays.deepToString(m));
    int[] e = new int[0]; System.out.println(e.length + java.util.Arrays.toString(e));
    long[] l = new long[1]; float[] f = new float[1]; byte[] y = new byte[1]; short[] h = new short[1]; char[] z = new char[1];
    System.out.println(l[0] + " " + f[0] + " " + y[0] + " " + h[0] + " " + (int) z[0]);
    int[] copy = java.util.Arrays.copyOf(a, 5); System.out.println(java.util.Arrays.toString(copy));
    int[] alias = a; alias[0] = 99; System.out.println(a[0]);
    int[] cl = a.clone(); cl[0] = 1; System.out.println(a[0]);
    java.util.Arrays.fill(copy, 7); System.out.println(copy[4]);
    int[][] j = new int[2][]; j[1] = new int[3]; System.out.println(j[0] == null); System.out.println(j[1].length);
    int[][][] cube = new int[2][3][4]; System.out.println(cube[1][2].length);`),

  // Input
  body('StringTokenizer', `    java.util.StringTokenizer st = new java.util.StringTokenizer("the  quick brown");
    System.out.println(st.countTokens());
    while (st.hasMoreTokens()) System.out.print(st.nextToken() + "|");
    System.out.println(st.countTokens());
    java.util.StringTokenizer csv = new java.util.StringTokenizer("a,b;;c", ",;");
    System.out.println(csv.nextToken() + csv.nextToken() + csv.nextToken() + csv.hasMoreTokens());
    java.util.StringTokenizer none = new java.util.StringTokenizer("   ");
    System.out.println(none.countTokens());`),
  body('Scanner reading mixed input', `    java.util.Scanner s = new java.util.Scanner(System.in);
    int a = s.nextInt();
    double b = s.nextDouble();
    String w = s.next();
    String rest = s.nextLine();
    String line = s.nextLine();
    long l = s.nextLong();
    boolean t = s.nextBoolean();
    System.out.println(a + "|" + b + "|" + w + "|" + rest + "|" + line + "|" + l + "|" + t);
    while (s.hasNextInt()) System.out.print(s.nextInt() + ",");
    System.out.println(s.hasNext());
    System.out.println(s.next());
    System.out.println(s.hasNext());`, { input: '4 2.5 word tail\nthe whole line\n9000000000 true\n1 2\n3 stop\n' }),
  body('BufferedReader', `    java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(System.in));
    int n = Integer.parseInt(br.readLine().trim());
    String s = br.readLine();
    System.out.println(n * 2);
    System.out.println(s);
    System.out.println(br.readLine());`, { input: ' 21 \nhi there\n' }),

  // Methods and classes
  {
    name: 'overloads choose the closest type',
    code: `class Over {
  static String f(double x) { return "double"; }
  static String f(long x) { return "long"; }
  static String f(int x) { return "int"; }
  static String g(double x) { return "double"; }
  static String g(long x) { return "long"; }
  static String h(int a, double b) { return "int,double"; }
  static String h(double a, double b) { return "double,double"; }
  static String s(String x) { return "String"; }
  static String s(Object x) { return "Object"; }
  public static void main(String[] args) {
    byte b = 1; short sh = 1; char c = 'c'; long l = 1; float fl = 1;
    System.out.println(f(1) + f(1L) + f(1.0) + f(b) + f(sh) + f(c) + f(fl) + f(l));
    System.out.println(g(1) + g(c) + g(1.5f));
    System.out.println(h(1, 2) + h(1.0, 2));
    System.out.println(s("x") + s(new int[1]));
  }
}`,
  },
  {
    name: 'objects print through toString',
    code: `class Pt {
  int x; int y;
  Pt(int x, int y) { this.x = x; this.y = y; }
  public String toString() { return "(" + x + "," + y + ")"; }
  boolean same(Pt o) { return x == o.x && y == o.y; }
}
class Plain { int v = 1; }
class Main1 {
  public static void main(String[] args) {
    Pt p = new Pt(1, 2);
    System.out.println(p);
    System.out.print(p);
    System.out.println();
    System.out.println("at " + p);
    System.out.println(p + " here");
    String s = "s"; s += p; System.out.println(s);
    System.out.println(String.valueOf(p));
    StringBuffer sb = new StringBuffer(); sb.append(p); System.out.println(sb);
    System.out.printf("%s%n", p);
    Pt[] all = {p, new Pt(3, 4), null};
    System.out.println(java.util.Arrays.toString(all));
    System.out.println(p.same(new Pt(1, 2)));
    System.out.println(p == new Pt(1, 2));
    System.out.println(p.equals(p));
    System.out.println(new Plain().v);
    Pt q = null;
    System.out.println("null: " + q);
    System.out.println(q);
  }
}`,
  },
  {
    name: 'classes, constructors and statics',
    code: `class Acct {
  static int count = 0;
  static final double RATE = 0.5;
  String name; double bal = 10; int[] hist = new int[2];
  Acct() { this.name = "none"; count++; }
  Acct(String name) { this.name = name; count++; }
  Acct(String name, double bal) { this.name = name; this.bal = bal; count++; }
  void add(double v) { bal += v; hist[0]++; }
  double interest() { return bal * RATE; }
  Acct self() { return this; }
  static int made() { return count; }
  void rename(String name) { name = name + "!"; this.name = name; }
}
class Bank {
  static int shared = 3;
  int shared2 = shared * 2;
  static void change(int n, int[] a, Acct b) { n = 99; a[0] = 99; b.bal = 99; b = null; }
  public static void main(String[] args) {
    Acct a = new Acct(); Acct b = new Acct("b"); Acct c = new Acct("c", 2);
    a.add(5); a.self().add(1);
    System.out.println(a.name + " " + a.bal + " " + a.hist[0] + " " + a.interest());
    System.out.println(b.name + " " + b.bal + " " + c.bal);
    System.out.println(Acct.count + " " + Acct.made() + " " + Acct.RATE);
    b.rename("z"); System.out.println(b.name);
    int n = 1; int[] arr = {1};
    change(n, arr, c);
    System.out.println(n + " " + arr[0] + " " + c.bal);
    System.out.println(new Bank().shared2);
    int shared = 7;
    System.out.println(shared + " " + Bank.shared);
    Acct d = c; d.bal = 5; System.out.println(c.bal + " " + (d == c));
  }
}`,
  },
  {
    name: 'recursion',
    code: `class Rec {
  static int fib(int n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); }
  static int ack(int m, int n) { return m == 0 ? n + 1 : n == 0 ? ack(m - 1, 1) : ack(m - 1, ack(m, n - 1)); }
  static String rev(String s) { return s.length() <= 1 ? s : rev(s.substring(1)) + s.charAt(0); }
  static int sumDigits(int n) { return n == 0 ? 0 : n % 10 + sumDigits(n / 10); }
  static boolean even(int n) { return n == 0 || odd(n - 1); }
  static boolean odd(int n) { return n != 0 && even(n - 1); }
  static void count(int n) { if (n == 0) return; System.out.print(n); count(n - 1); System.out.print(n); }
  static int power(int b, int e) { if (e == 0) return 1; int h = power(b, e / 2); return e % 2 == 0 ? h * h : h * h * b; }
  public static void main(String[] args) {
    System.out.println(fib(15) + " " + ack(2, 3) + " " + rev("recursion") + " " + sumDigits(9875));
    System.out.println(even(10) + " " + odd(7));
    count(3);
    System.out.println();
    System.out.println(power(3, 13));
  }
}`,
  },
  {
    name: 'a linked list and a stack',
    code: `class Node { int data; Node next; Node(int d) { data = d; } }
class Stack1 {
  int[] st = new int[3]; int top = -1;
  void push(int v) { if (top == st.length - 1) System.out.println("overflow"); else st[++top] = v; }
  int pop() { return top < 0 ? -999 : st[top--]; }
}
class Lists {
  public static void main(String[] args) {
    Node head = null;
    for (int i = 1; i <= 3; i++) { Node n = new Node(i * i); n.next = head; head = n; }
    for (Node p = head; p != null; p = p.next) System.out.print(p.data + " ");
    System.out.println();
    Stack1 s = new Stack1();
    s.push(1); s.push(2); s.push(3); s.push(4);
    System.out.println(s.pop() + " " + s.pop() + " " + s.pop() + " " + s.pop());
  }
}`,
  },

  // The kind of program ISC papers actually set
  {
    name: 'ISC: number programs',
    code: `class Nums {
  static boolean isPrime(int n) { if (n < 2) return false; for (int i = 2; i * i <= n; i++) if (n % i == 0) return false; return true; }
  static int digitSum(int n) { int s = 0; while (n > 0) { s += n % 10; n /= 10; } return s; }
  static boolean isPerfect(int n) { int s = 0; for (int i = 1; i < n; i++) if (n % i == 0) s += i; return s == n; }
  static boolean isDisarium(int n) { String t = "" + n; int s = 0; for (int i = 0; i < t.length(); i++) s += (int) Math.pow(t.charAt(i) - '0', i + 1); return s == n; }
  static boolean isKaprekar(int n) { long sq = (long) n * n; int digits = String.valueOf(n).length(); long p = (long) Math.pow(10, digits); return sq / p + sq % p == n; }
  static boolean isSmith(int n) { if (isPrime(n)) return false; int f = 0, t = n; for (int i = 2; t > 1; i++) while (t % i == 0) { f += digitSum(i); t /= i; } return f == digitSum(n); }
  static String toBase(int n, int b) { String d = "0123456789ABCDEF", r = ""; do { r = d.charAt(n % b) + r; n /= b; } while (n > 0); return r; }
  static int gcd(int a, int b) { while (b != 0) { int t = b; b = a % b; a = t; } return a; }
  public static void main(String[] args) {
    for (int n : new int[] {6, 28, 89, 135, 45, 297, 666, 121}) System.out.println(n + " " + isPerfect(n) + " " + isDisarium(n) + " " + isKaprekar(n) + " " + isSmith(n));
    System.out.println(toBase(255, 16) + " " + toBase(255, 2) + " " + gcd(1071, 462));
    double sum = 0; for (int i = 1; i <= 10; i++) sum += 1.0 / (i * i); System.out.println(sum);
    System.out.println(Math.sqrt(sum * 6));
    long f = 1; for (int i = 2; i <= 25; i++) f *= i; System.out.println(f);
  }
}`,
  },
  {
    name: 'ISC: string programs',
    code: `class Words {
  static boolean isVowel(char c) { return "AEIOUaeiou".indexOf(c) >= 0; }
  static String pigLatin(String w) { for (int i = 0; i < w.length(); i++) if (isVowel(w.charAt(i))) return w.substring(i) + w.substring(0, i) + "AY"; return w + "AY"; }
  static String sortLetters(String s) { char[] c = s.toCharArray(); for (int i = 0; i < c.length - 1; i++) for (int j = 0; j < c.length - 1 - i; j++) if (c[j] > c[j + 1]) { char t = c[j]; c[j] = c[j + 1]; c[j + 1] = t; } return new String(c); }
  public static void main(String[] args) {
    java.util.Scanner in = new java.util.Scanner(System.in);
    String line = in.nextLine().trim();
    java.util.StringTokenizer st = new java.util.StringTokenizer(line);
    String[] w = new String[st.countTokens()];
    for (int i = 0; i < w.length; i++) w[i] = st.nextToken();
    for (int i = 0; i < w.length - 1; i++) for (int j = i + 1; j < w.length; j++) if (w[i].compareToIgnoreCase(w[j]) > 0) { String t = w[i]; w[i] = w[j]; w[j] = t; }
    for (String x : w) System.out.print(x + " ");
    System.out.println();
    int[] freq = new int[26];
    for (char c : line.toUpperCase().toCharArray()) if (Character.isLetter(c)) freq[c - 'A']++;
    for (int i = 0; i < 26; i++) if (freq[i] > 1) System.out.print((char) ('A' + i) + "=" + freq[i] + " ");
    System.out.println();
    StringBuffer out = new StringBuffer();
    for (String x : w) out.append(Character.toUpperCase(x.charAt(0))).append(x.substring(1).toLowerCase()).append(' ');
    System.out.println(out.toString().trim());
    System.out.println(pigLatin("TROUBLE") + " " + pigLatin("xyz") + " " + sortLetters("banana"));
    String rev = ""; for (int i = line.length() - 1; i >= 0; i--) rev += line.charAt(i); System.out.println(rev);
    int cap = 0; for (int i = 0; i < line.length(); i++) if (Character.isUpperCase(line.charAt(i))) cap++; System.out.println(cap);
    System.out.printf("%-10s%5d%8.2f%n", w[0], w.length, (double) line.length() / w.length);
  }
}`,
    input: 'the Quick brown Fox jumps over a lazy Dog\n',
  },
  {
    name: 'ISC: arrays and matrices',
    code: `class Grid {
  static int bsearch(int[] a, int k, int lo, int hi) { if (lo > hi) return -1; int m = (lo + hi) / 2; return a[m] == k ? m : a[m] < k ? bsearch(a, k, m + 1, hi) : bsearch(a, k, lo, m - 1); }
  static int[][] multiply(int[][] a, int[][] b) { int[][] c = new int[a.length][b[0].length]; for (int i = 0; i < a.length; i++) for (int j = 0; j < b[0].length; j++) for (int k = 0; k < b.length; k++) c[i][j] += a[i][k] * b[k][j]; return c; }
  public static void main(String[] args) {
    int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    int boundary = 0, diag = 0;
    for (int i = 0; i < 3; i++) for (int j = 0; j < 3; j++) { if (i == 0 || j == 0 || i == 2 || j == 2) boundary += m[i][j]; if (i == j || i + j == 2) diag += m[i][j]; }
    System.out.println(boundary + " " + diag);
    int[][] p = multiply(m, m);
    for (int[] row : p) { for (int v : row) System.out.printf("%4d", v); System.out.println(); }
    int[] a = {64, 25, 12, 22, 11};
    for (int i = 1; i < a.length; i++) { int k = a[i], j = i - 1; while (j >= 0 && a[j] > k) { a[j + 1] = a[j]; j--; } a[j + 1] = k; }
    System.out.println(java.util.Arrays.toString(a) + " " + bsearch(a, 22, 0, 4) + " " + bsearch(a, 5, 0, 4));
    int max = Integer.MIN_VALUE, min = Integer.MAX_VALUE; double total = 0;
    for (int v : a) { max = Math.max(max, v); min = Math.min(min, v); total += v; }
    System.out.println(max + " " + min + " " + total / a.length);
    char[][] b = new char[2][2]; b[0][0] = 'x'; System.out.println((int) b[1][1] + "" + b[0][0]);
    String[] names = {"Asha", "Ravi"}; int[] marks = {90, 75};
    for (int i = 0; i < names.length; i++) System.out.println(names[i] + "\t" + marks[i] + (marks[i] >= 80 ? "\tA" : "\tB"));
  }
}`,
  },

  // Programs that crash: the output so far and the exception must match.
  body('crash: array index', '    int[] a = new int[2];\n    System.out.println("before");\n    a[2] = 1;\n    System.out.println("after");', { throws: 'ArrayIndexOutOfBoundsException' }),
  body('crash: negative index', '    int[] a = new int[2];\n    System.out.println(a[-1]);', { throws: 'ArrayIndexOutOfBoundsException' }),
  body('crash: divide by zero', '    int z = 0;\n    System.out.print("x");\n    System.out.println(1 / z);', { throws: 'ArithmeticException' }),
  body('crash: remainder by zero', '    long z = 0;\n    System.out.println(1L % z);', { throws: 'ArithmeticException' }),
  body('crash: null string', '    String s = null;\n    System.out.println(s.length());', { throws: 'NullPointerException' }),
  body('crash: null array', '    int[] a = null;\n    System.out.println(a.length);', { throws: 'NullPointerException' }),
  body('crash: charAt out of range', '    System.out.println("abc".charAt(3));', { throws: 'StringIndexOutOfBoundsException' }),
  body('crash: substring out of range', '    System.out.println("abc".substring(2, 9));', { throws: 'StringIndexOutOfBoundsException' }),
  body('crash: bad number', '    System.out.println(Integer.parseInt("12a"));', { throws: 'NumberFormatException' }),
  body('crash: number too big', '    System.out.println(Integer.parseInt("3000000000"));', { throws: 'NumberFormatException' }),
  body('crash: empty number', '    System.out.println(Double.parseDouble(""));', { throws: 'NumberFormatException' }),
  body('crash: negative array size', '    int n = -1;\n    int[] a = new int[n];', { throws: 'NegativeArraySizeException' }),
  body('crash: Scanner out of input', '    java.util.Scanner s = new java.util.Scanner(System.in);\n    System.out.println(s.nextInt());\n    System.out.println(s.nextInt());', { input: '5', throws: 'NoSuchElementException' }),
  body('crash: Scanner wrong type', '    java.util.Scanner s = new java.util.Scanner(System.in);\n    System.out.println(s.nextInt());', { input: 'abc', throws: 'InputMismatchException' }),
  body('crash: %d with a char', '    System.out.printf("%d", \'a\');', { throws: 'IllegalFormatConversionException' }),
  body('crash: %d with a double', '    System.out.printf("%d", 2.5);', { throws: 'IllegalFormatConversionException' }),
  body('crash: %f with an int', '    System.out.printf("%f", 2);', { throws: 'IllegalFormatConversionException' }),
  { name: 'crash: runaway recursion', code: 'class Deep {\n  static int f(int n) { return f(n + 1) + 1; }\n  public static void main(String[] a) { System.out.println(f(0)); }\n}', throws: 'StackOverflowError' },
];
