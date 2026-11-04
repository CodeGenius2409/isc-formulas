// Computer Science, Class XII. Answers are computed: Java runs in the tracer, Boolean functions go through
// Quine–McCluskey, and trees and stacks are worked out by code.
import { classify, coverIsRight, groupNames, minimalCover, primeImplicants, sopText, termText, truthColumn, VARS } from '../../practice/gen/boolean';
import type { Gen } from '../../practice/gen/gen';
import { complete, designClass, findError, inMain, outputOf, pyList, pySlice, SHORT_WORDS, withMethods } from './cs-common';
import { blueprintsFor } from './dsl';
import type { Blueprint, Body, OutputBody, TheoryBody } from './types';

const { custom, facts } = blueprintsFor('computerscience', 'XII');

const fence = (code: string) => `\`\`\`\n${code}\n\`\`\``;

// ---- Boolean algebra

function randomMinterms(g: Gen, size: number, low: number, high: number): number[] {
  const all = Array.from({ length: 2 ** size }, (_, i) => i);
  const out = g.sample(all, g.int(low, high)).sort((a, b) => a - b);
  return out;
}

function kmapQuestion(g: Gen, size: 3 | 4, marksMap: number, marksTerm: number): TheoryBody {
  const minterms = randomMinterms(g, size, size === 4 ? 6 : 3, size === 4 ? 11 : 5);
  const cover = minimalCover(minterms, primeImplicants(minterms));
  if (!coverIsRight(cover, minterms, size) || cover.length < 2) g.retry('not an interesting map');
  const names = VARS.slice(0, size).join(', ');
  const usePos = g.chance(0.3);
  if (usePos) {
    const zeros = Array.from({ length: 2 ** size }, (_, i) => i).filter((i) => !minterms.includes(i));
    const posCover = minimalCover(zeros, primeImplicants(zeros));
    const pos = posCover.map((p) => {
      let term = '';
      for (let i = 0; i < size; i++) {
        const bit = 1 << (size - 1 - i);
        if (p.mask & bit) continue;
        term += `${term ? ' + ' : ''}${p.value & bit ? `${VARS[i]}′` : VARS[i]}`;
      }
      return `(${term})`;
    }).join('');
    return g.theory(`Reduce the Boolean function F(${names}) = π(${zeros.join(', ')}) using a Karnaugh map, and show the groups you use.`, [
      [`A correct map with the zeros marked, and groups: ${groupNames(posCover)}.`, marksMap],
      [`F = ${pos}.`, marksTerm],
    ]);
  }
  return g.theory(`Reduce the Boolean function F(${names}) = Σ(${minterms.join(', ')}) using a Karnaugh map, and show the groups you use.`, [
    [`A correct map with the ones marked, and groups: ${groupNames(cover)}.`, marksMap],
    [`F = ${sopText(cover, size)}.`, marksTerm],
  ]);
}

/** A proposition as words and as a function, so its truth table is computed. */
const PROPOSITIONS: { text: string; f: (b: boolean[]) => boolean; size: number }[] = [
  { text: '(p ⇒ q) ∧ (q ⇒ p)', f: ([p, q]) => (!p || q) && (!q || p), size: 2 },
  { text: '(p ∧ q) ⇒ p', f: ([p, q]) => !(p && q) || p, size: 2 },
  { text: 'p ∧ ~p', f: ([p]) => p && !p, size: 2 },
  { text: 'p ∨ ~p', f: ([p]) => p || !p, size: 2 },
  { text: '(p ⇒ q) ∨ (q ⇒ p)', f: ([p, q]) => !p || q || !q || p, size: 2 },
  { text: '~(p ∨ q) ∧ p', f: ([p, q]) => !(p || q) && p, size: 2 },
  { text: '(p ∧ ~q) ⇒ (~p ∨ q)', f: ([p, q]) => !(p && !q) || !p || q, size: 2 },
  { text: '(p ⇒ q) ∧ p ∧ ~q', f: ([p, q]) => (!p || q) && p && !q, size: 2 },
  { text: '((p ⇒ q) ∧ (q ⇒ r)) ⇒ (p ⇒ r)', f: ([p, q, r]) => !((!p || q) && (!q || r)) || !p || r, size: 3 },
  { text: '(p ∨ q) ⇒ (p ∧ r)', f: ([p, q, r]) => !(p || q) || (p && r), size: 3 },
  { text: '(p ∧ q) ∨ (~p ∧ r)', f: ([p, q, r]) => (p && q) || (!p && r), size: 3 },
  { text: '(p ⇒ (q ∨ r)) ∨ ~p', f: ([p, q, r]) => !p || q || r || !p, size: 3 },
];

function propositionQuestion(g: Gen): { text: string; answer: string; kind: string } {
  const p = g.pick(PROPOSITIONS);
  const column = truthColumn(p.size, p.f);
  const kind = classify(column);
  return { text: p.text, kind, answer: `The final column reads ${column.map((b) => (b ? 1 : 0)).join(', ')}, top to bottom.` };
}

/** Word problems: conditions in everyday words, with the rule computed into a truth table. */
const SCENARIOS: { story: string; inputs: [string, string][]; output: string; rule: (b: boolean[]) => boolean }[] = [
  {
    story: 'A school sets the rules for who may join its robotics club. A student may join if the student has passed the aptitude test and has a teacher’s recommendation, or is already in the science club and has passed the test, or has won a robotics contest.',
    inputs: [['P', 'Passed the aptitude test'], ['R', 'Has a teacher’s recommendation'], ['S', 'Already in the science club'], ['W', 'Has won a robotics contest']],
    output: 'Eligible to join',
    rule: ([p, r, s, w]) => (p && r) || (s && p) || w,
  },
  {
    story: 'A bank approves a loan if the applicant has a steady job and a good credit score, or has a good credit score and offers a security, or has a guarantor with a steady job.',
    inputs: [['J', 'Has a steady job'], ['C', 'Has a good credit score'], ['S', 'Offers a security'], ['G', 'Has a guarantor']],
    output: 'Loan approved',
    rule: ([j, c, s, g2]) => (j && c) || (c && s) || (g2 && j),
  },
  {
    story: 'A sports academy admits a player who has passed the fitness test and either has played at state level or has a coach’s recommendation. A player who has won a national medal is admitted without any other requirement.',
    inputs: [['F', 'Passed the fitness test'], ['T', 'Played at state level'], ['C', 'Has a coach’s recommendation'], ['M', 'Won a national medal']],
    output: 'Admitted',
    rule: ([f, t, c, m]) => (f && (t || c)) || m,
  },
  {
    story: 'A library gives a student a laptop to borrow if the student has a valid card and no overdue books, or has a teacher’s note and a valid card, or is a member of staff.',
    inputs: [['V', 'Has a valid card'], ['N', 'Has no overdue books'], ['T', 'Has a teacher’s note'], ['M', 'Is a member of staff']],
    output: 'Laptop issued',
    rule: ([v, n, t, m]) => (v && n) || (t && v) || m,
  },
  {
    story: 'A smart irrigation system turns on the pump if the soil is dry and it isn’t raining, or if the tank is full and the soil is dry, or if an operator presses the manual switch.',
    inputs: [['D', 'The soil is dry'], ['R', 'It’s raining'], ['T', 'The tank is full'], ['M', 'The manual switch is pressed']],
    output: 'Pump on',
    rule: ([d, r, t, m]) => (d && !r) || (t && d) || m,
  },
];

function wordProblem(g: Gen): TheoryBody {
  const s = g.pick(SCENARIOS);
  const column = truthColumn(4, s.rule);
  const minterms = column.flatMap((on, i) => (on ? [i] : []));
  const names = s.inputs.map(([n]) => n);
  const cover = minimalCover(minterms, primeImplicants(minterms));
  if (!coverIsRight(cover, minterms, 4)) g.retry();
  const sop = sopText(cover, 4).replace(/[ABCD]/g, (c) => names[VARS.indexOf(c)]);
  return g.theory(`${s.story}\nThe inputs are:\n${s.inputs.map(([n, m]) => `${n}: ${m}`).join('\n')}\nThe output X means "${s.output}". In all cases, 1 means yes and 0 means no.\nDraw the truth table, and write the reduced SOP expression for X(${names.join(', ')}).`, [
    [`A truth table of 16 rows, with X = 1 in rows ${minterms.join(', ')}.`, 2],
    [`X = ${sop}.`, 3],
  ]);
}

// ---- Trees

interface Tree {
  label: string;
  left?: Tree;
  right?: Tree;
}

function insert(root: Tree | undefined, label: string): Tree {
  if (!root) return { label };
  if (label < root.label) root.left = insert(root.left, label);
  else root.right = insert(root.right, label);
  return root;
}

const inorder = (t?: Tree): string[] => (t ? [...inorder(t.left), t.label, ...inorder(t.right)] : []);
const preorder = (t?: Tree): string[] => (t ? [t.label, ...preorder(t.left), ...preorder(t.right)] : []);
const postorder = (t?: Tree): string[] => (t ? [...postorder(t.left), ...postorder(t.right), t.label] : []);
const height = (t?: Tree): number => (t ? 1 + Math.max(height(t.left), height(t.right)) : 0);
const leaves = (t?: Tree): string[] => (!t ? [] : !t.left && !t.right ? [t.label] : [...leaves(t.left), ...leaves(t.right)]);
const internal = (t?: Tree): string[] => (!t || (!t.left && !t.right) ? [] : [t.label, ...internal(t.left), ...internal(t.right)]);

function makeTree(g: Gen): Tree {
  const letters = g.sample('ABCDEFGHJKLMNPRSTUVW'.split(''), g.int(6, 8));
  let root: Tree | undefined;
  for (const l of letters) root = insert(root, l);
  if (height(root) > 4 || height(root) < 3) g.retry('too tall or too flat to draw neatly');
  return root!;
}

function treeNodes(root: Tree) {
  const nodes: { label: string; left?: number; right?: number }[] = [];
  const walk = (t: Tree): number => {
    const i = nodes.length;
    nodes.push({ label: t.label });
    if (t.left) nodes[i].left = walk(t.left);
    if (t.right) nodes[i].right = walk(t.right);
    return i;
  };
  walk(root);
  return nodes;
}

function levelOf(t: Tree | undefined, label: string, d = 0): number | null {
  if (!t) return null;
  if (t.label === label) return d;
  return levelOf(t.left, label, d + 1) ?? levelOf(t.right, label, d + 1);
}

// ---- Programs for "design a class"

const DESIGNS: ((g: Gen) => TheoryBody)[] = [
  (g) => {
    const n = g.int(2, 9);
    const start = g.int(10, 40);
    const code = `class Series {\n  int first;\n  int terms;\n  Series(int f, int t) {\n    first = f;\n    terms = t;\n  }\n  int sum() {\n    int s = 0;\n    int value = first;\n    for (int i = 0; i < terms; i++) {\n      s += value;\n      value += ${n};\n    }\n    return s;\n  }\n  void display() {\n    System.out.println("Sum = " + sum());\n  }\n  public static void main(String[] args) {\n    Series x = new Series(${start}, 5);\n    x.display();\n  }\n}`;
    return designClass(g, `Design a class Series that adds the terms of an arithmetic series with a common difference of ${n}.\nData members: first (the first term), terms (how many terms to add).\nMember functions:\nSeries(int f, int t): a parameterised constructor.\nint sum(): returns the sum of the series.\nvoid display(): prints the sum.\nSpecify the class, giving the details of the constructor and the functions. Define main() to create an object and call display().`, code, [
      ['Declares the data members correctly.', 1],
      ['Writes a parameterised constructor that stores both values.', 2],
      [`sum() uses a loop that adds each term and moves on by ${n}, and returns the total.`, 4],
      ['display() prints the sum, calling sum().', 1],
      ['main() creates an object with suitable values and calls display().', 2],
    ]);
  },
  (g) => {
    const word = g.pick(SHORT_WORDS);
    const code = `class WordCount {\n  String word;\n  int vowels;\n  WordCount(String w) {\n    word = w;\n    vowels = 0;\n  }\n  void count() {\n    for (int i = 0; i < word.length(); i++) {\n      char c = word.charAt(i);\n      if (c == 'A' || c == 'E' || c == 'I' || c == 'O' || c == 'U') {\n        vowels++;\n      }\n    }\n  }\n  void display() {\n    System.out.println(word + " has " + vowels + " vowels");\n  }\n  public static void main(String[] args) {\n    WordCount x = new WordCount("${word}");\n    x.count();\n    x.display();\n  }\n}`;
    return designClass(g, 'Design a class WordCount that counts the vowels in a word in upper case.\nData members: word (the word), vowels (the count).\nMember functions:\nWordCount(String w): a parameterised constructor that sets the count to zero.\nvoid count(): counts the vowels.\nvoid display(): prints the word and the count.\nSpecify the class, and define main() to create an object and use it.', code, [
      ['Declares the data members correctly.', 1],
      ['Constructor stores the word and sets the count to zero.', 2],
      ['count() loops over each character using charAt().', 2],
      ['Checks all five vowels, and adds one to the count.', 2],
      ['display() prints as asked.', 1],
      ['main() creates an object, and calls the functions in order.', 2],
    ]);
  },
  (g) => {
    const size = g.int(4, 7);
    const values = Array.from({ length: size }, () => g.int(1, 50));
    const code = `class ArrayStats {\n  int[] a;\n  ArrayStats(int[] x) {\n    a = x;\n  }\n  int largest() {\n    int big = a[0];\n    for (int i = 1; i < a.length; i++) {\n      if (a[i] > big) {\n        big = a[i];\n      }\n    }\n    return big;\n  }\n  double mean() {\n    int s = 0;\n    for (int i = 0; i < a.length; i++) {\n      s += a[i];\n    }\n    return (double) s / a.length;\n  }\n  public static void main(String[] args) {\n    int[] v = {${values.join(', ')}};\n    ArrayStats x = new ArrayStats(v);\n    System.out.println(x.largest());\n    System.out.println(x.mean());\n  }\n}`;
    return designClass(g, 'Design a class ArrayStats that works on an array of integers.\nData member: a[] (the array).\nMember functions:\nArrayStats(int[] x): a constructor that stores the array.\nint largest(): returns the largest element.\ndouble mean(): returns the mean of the elements.\nSpecify the class, and define main() to create an object and print both results.', code, [
      ['Declares the array and writes the constructor.', 2],
      ['largest() starts from the first element, and compares each of the others.', 3],
      ['mean() adds the elements in a loop.', 2],
      ['Divides as a double, so the fractional part is kept.', 1],
      ['main() creates an object, and prints both results.', 2],
    ]);
  },
  (g) => {
    const base = g.pick([2, 8]);
    const value = g.int(20, 200);
    const code = `class Convert {\n  int number;\n  Convert(int n) {\n    number = n;\n  }\n  int toBase(int n) {\n    if (n == 0) {\n      return 0;\n    }\n    return n % ${base} + 10 * toBase(n / ${base});\n  }\n  void show() {\n    System.out.println(number + " is " + toBase(number) + " in base ${base}");\n  }\n  public static void main(String[] args) {\n    Convert c = new Convert(${value});\n    c.show();\n  }\n}`;
    return designClass(g, `Design a class Convert that converts a positive integer to base ${base} using recursion.\nData member: number.\nMember functions:\nConvert(int n): a constructor.\nint toBase(int n): a recursive function that returns the digits of n in base ${base}, as an integer.\nvoid show(): prints the number and its converted form.\nSpecify the class, and define main() to use it.`, code, [
      ['Declares the data member and writes the constructor.', 2],
      ['toBase() has a correct base case.', 2],
      [`The recursive step uses n % ${base}, with a call on n / ${base}.`, 3],
      ['The digit is placed correctly, by multiplying the result of the call by 10.', 1],
      ['show() and main() work as asked.', 2],
    ]);
  },
  (g) => {
    const a = g.int(2, 9);
    const b = g.int(2, 9);
    const c = g.int(2, 9);
    const d = g.int(2, 9);
    const code = `class Fraction {\n  int num;\n  int den;\n  Fraction(int n, int d) {\n    num = n;\n    den = d;\n  }\n  Fraction add(Fraction f) {\n    Fraction r = new Fraction(num * f.den + f.num * den, den * f.den);\n    return r;\n  }\n  void show() {\n    System.out.println(num + "/" + den);\n  }\n  public static void main(String[] args) {\n    Fraction x = new Fraction(${a}, ${b});\n    Fraction y = new Fraction(${c}, ${d});\n    Fraction z = x.add(y);\n    z.show();\n  }\n}`;
    return designClass(g, 'Design a class Fraction to store a fraction.\nData members: num, den.\nMember functions:\nFraction(int n, int d): a parameterised constructor.\nFraction add(Fraction f): returns a new object holding the sum of the current fraction and f.\nvoid show(): prints the fraction as num/den.\nSpecify the class, and define main() to add two fractions.', code, [
      ['Declares the data members and writes the constructor.', 2],
      ['add() takes an object as its parameter.', 2],
      ['Works out the numerator and the denominator of the sum correctly.', 2],
      ['Creates and returns a new object.', 2],
      ['show() and main() work as asked.', 2],
    ]);
  },
  (g) => {
    const rows = g.int(2, 3);
    const cols = g.int(2, 3);
    const m = Array.from({ length: rows }, () => Array.from({ length: cols }, () => g.int(1, 9)));
    const code = `class Matrix {\n  int[][] m;\n  Matrix(int[][] x) {\n    m = x;\n  }\n  int rowSum(int r) {\n    int s = 0;\n    for (int c = 0; c < m[r].length; c++) {\n      s += m[r][c];\n    }\n    return s;\n  }\n  void show() {\n    for (int r = 0; r < m.length; r++) {\n      System.out.println(rowSum(r));\n    }\n  }\n  public static void main(String[] args) {\n    int[][] v = {${m.map((r) => `{${r.join(', ')}}`).join(', ')}};\n    Matrix x = new Matrix(v);\n    x.show();\n  }\n}`;
    return designClass(g, 'Design a class Matrix that works on a two-dimensional array of integers.\nData member: m[][].\nMember functions:\nMatrix(int[][] x): a constructor.\nint rowSum(int r): returns the sum of row r.\nvoid show(): prints the sum of each row, by calling rowSum().\nSpecify the class, and define main() to use it.', code, [
      ['Declares the array and writes the constructor.', 2],
      ['rowSum() loops across the columns of one row.', 3],
      ['Returns the sum correctly.', 1],
      ['show() loops down the rows, and calls rowSum() for each.', 2],
      ['main() creates an object, and calls show().', 2],
    ]);
  },
];

const OUTPUT_ARRAY = (g: Gen): OutputBody => {
  const n = g.int(4, 6);
  const a = Array.from({ length: n }, () => g.int(1, 9));
  const step = g.int(2, 3);
  return outputOf(g, inMain(`int[] a = {${a.join(', ')}};\nint s = 0;\nfor (int i = 0; i < a.length; i += ${step}) {\n  s += a[i];\n}\nSystem.out.println(s);`), `The loop visits every ${step === 2 ? 'second' : 'third'} element, starting from index 0.`);
};

const OUTPUT_STRING = (g: Gen): Body => {
  const word = g.pick(SHORT_WORDS);
  const i = g.int(1, 3);
  const j = g.int(i + 1, Math.min(word.length, i + 3));
  return outputOf(g, inMain(`String s = "${word}";\nSystem.out.println(s.substring(${i}, ${j}));\nSystem.out.println(s.charAt(${i}));\nSystem.out.println(s.length());\nSystem.out.println(s.indexOf('${word[i]}'));`), 'substring stops one short of its second index, and indexes start at 0.');
};

const OUTPUT_RECURSION = (g: Gen): OutputBody => {
  const n = g.int(3, 7);
  const form = g.int(0, 3);
  const methods = [
    'static int f(int n) {\n  if (n <= 1) {\n    return 1;\n  }\n  return n * f(n - 1);\n}',
    'static int f(int n) {\n  if (n == 0) {\n    return 0;\n  }\n  return n % 10 + f(n / 10);\n}',
    'static void f(int n) {\n  if (n > 0) {\n    System.out.print(n + " ");\n    f(n - 1);\n    System.out.print(n + " ");\n  }\n}',
    'static int f(int n) {\n  if (n <= 2) {\n    return 1;\n  }\n  return f(n - 1) + f(n - 2);\n}',
  ][form];
  const call = form === 2 ? `f(${n});\nSystem.out.println();` : `System.out.println(f(${form === 1 ? n * 37 : n}));`;
  return outputOf(g, withMethods(methods, call), 'Trace the calls down to the base case, then work back up.');
};

const OUTPUT_OBJECT = (g: Gen): Body => {
  const a = g.int(2, 9);
  const b = g.int(2, 9);
  const c = g.int(2, 5);
  return outputOf(g, `class Box {\n  int v;\n  Box(int x) {\n    v = x;\n  }\n  void grow(int by) {\n    v = v * by;\n  }\n  int add(Box other) {\n    return v + other.v;\n  }\n  public static void main(String[] args) {\n    Box p = new Box(${a});\n    Box q = new Box(${b});\n    Box r = p;\n    r.grow(${c});\n    System.out.println(p.v);\n    System.out.println(p.add(q));\n  }\n}`, 'r and p refer to the same object, so growing r changes p.');
};

const OUTPUT_MATRIX = (g: Gen): Body => {
  const m = [[g.int(1, 9), g.int(1, 9), g.int(1, 9)], [g.int(1, 9), g.int(1, 9), g.int(1, 9)], [g.int(1, 9), g.int(1, 9), g.int(1, 9)]];
  return outputOf(g, inMain(`int[][] m = {${m.map((r) => `{${r.join(', ')}}`).join(', ')}};\nint s = 0;\nfor (int i = 0; i < 3; i++) {\n  s += m[i][i];\n}\nSystem.out.println(s);\nSystem.out.println(m[0][2] + m[2][0]);`), 'm[i][i] runs down the main diagonal.');
};

function pythonOutput(g: Gen): Body {
  const word = g.pick(SHORT_WORDS).toLowerCase();
  const form = g.int(0, 3);
  const a = g.int(1, 3);
  const b = g.int(a + 1, 5);
  const lines: Record<number, [string, string]> = {
    0: [`s = "${word}"\nprint(s[${a}:${b}])\nprint(s[::-1])`, `${pySlice(word, a, b)}\n${pySlice(word, undefined, undefined, -1)}`],
    1: [`s = "${word}"\nprint(s[-${a}])\nprint(s[:${b}].upper())`, `${word[word.length - a]}\n${pySlice(word, undefined, b).toUpperCase()}`],
    2: [`s = "${word}"\nprint(len(s))\nprint(s[${a}:] + s[:${a}])`, `${word.length}\n${pySlice(word, a) + pySlice(word, undefined, a)}`],
    3: [`s = "${word}"\nprint(s.count("${word[a]}"))\nprint(s[${a}])`, `${[...word].filter((c) => c === word[a]).length}\n${word[a]}`],
  };
  const [code, expected] = lines[form];
  return { form: 'output', text: 'Write the output of the following Python code.', code, expected, python: 1, why: 'Slices stop one short of the second index, and negative indexes count from the end.' };
}

function pythonList(g: Gen): Body {
  const list = Array.from({ length: g.int(4, 6) }, () => g.int(1, 20));
  const x = g.int(21, 30);
  const after = [...list, x];
  const rev = [...after].reverse();
  return {
    form: 'output',
    text: 'Write the output of the following Python code.',
    code: `a = ${pyList(list)}\na.append(${x})\nprint(len(a))\nprint(a[1:3])\na.reverse()\nprint(a[0])\nprint(sum(a))`,
    expected: `${after.length}\n${pyList(after.slice(1, 3))}\n${rev[0]}\n${after.reduce((s, v) => s + v, 0)}`,
    python: 1,
    why: 'append adds to the end, and reverse changes the list in place.',
  };
}

function pythonTuple(g: Gen): Body {
  const t = Array.from({ length: g.int(4, 6) }, () => g.int(1, 9));
  const a = g.int(1, 2);
  return {
    form: 'output',
    text: 'Write the output of the following Python code.',
    code: `t = (${t.join(', ')})\nprint(t[${a}])\nprint(len(t))\nprint(max(t))\nprint(t.count(${t[0]}))`,
    expected: `${t[a]}\n${t.length}\n${Math.max(...t)}\n${t.filter((v) => v === t[0]).length}`,
    python: 1,
    why: 'A tuple can be indexed and counted like a list, but not changed.',
  };
}

const LOOPS: [string, string, string[], string][] = [
  ['for (int i = 0; i < n; i++) {\n  s = s + i;\n}', 'O(n)', ['O(1)', 'O(n²)', 'O(log n)'], 'A single loop that runs n times.'],
  ['for (int i = 0; i < n; i++) {\n  for (int j = 0; j < n; j++) {\n    s = s + j;\n  }\n}', 'O(n²)', ['O(n)', 'O(2n)', 'O(log n)'], 'Two nested loops, each running n times.'],
  ['int i = 1;\nwhile (i < n) {\n  i = i * 2;\n}', 'O(log n)', ['O(n)', 'O(n²)', 'O(1)'], 'i doubles each time, so it takes about log₂ n steps.'],
  ['for (int i = 0; i < 100; i++) {\n  s = s + i;\n}', 'O(1)', ['O(n)', 'O(100n)', 'O(log n)'], 'It runs a fixed number of times, whatever n is.'],
  ['for (int i = 0; i < n; i++) {\n  s = s + i;\n}\nfor (int j = 0; j < n; j++) {\n  s = s + j;\n}', 'O(n)', ['O(n²)', 'O(1)', 'O(log n)'], 'Two separate loops add up to 2n, and constants are dropped.'],
  ['for (int i = 0; i < n; i++) {\n  int j = 1;\n  while (j < n) {\n    j = j * 2;\n  }\n}', 'O(n log n)', ['O(n²)', 'O(n)', 'O(log n)'], 'A log n loop runs inside a loop of n.'],
];

const blueprints: Blueprint[] = [
  // ---- Unit 1: Boolean algebra and logic
  custom('prop-kind', [1, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const q = propositionQuestion(g);
    return g.mcq(`The proposition ${q.text} is a:`, q.kind, ['tautology', 'contradiction', 'contingency', 'an equivalence'].filter((k) => k !== q.kind).slice(0, 3), { why: q.answer });
  }),
  custom('prop-table', [1, 'a', 2, 2], { type: 'short', format: 'short' }, (g) => {
    const q = propositionQuestion(g);
    return g.theory(`Draw a truth table to verify whether ${q.text} is a tautology, a contradiction or a contingency.`, [[`A truth table with the correct columns. ${q.answer}`, 1], [`It is a ${q.kind}.`, 1]]);
  }),
  custom('contrapositive', [1, 'a', 2, 1], { type: 'short', format: 'short' }, (g) => {
    const [p, q] = g.pick([
      ['it rains', 'the match is cancelled'],
      ['a number is even', 'it is divisible by 2'],
      ['the power fails', 'the alarm rings'],
      ['you pass the test', 'you get a certificate'],
    ] as const);
    return g.theory(`Write the converse and the contrapositive of: "If ${p}, then ${q}."`, [`Converse: if ${q}, then ${p}.`, `Contrapositive: if it isn’t so that ${q}, then it isn’t so that ${p}.`]);
  }),
  custom('kmap4', [1, 'b', 5, 3], { type: 'short', format: 'long' }, (g) => kmapQuestion(g, 4, 4, 1)),
  custom('kmap3', [1, 'b', 3, 2], { type: 'short', format: 'short' }, (g) => kmapQuestion(g, 3, 2, 1)),
  custom('word-problem', [1, 'b', 5, 3], { type: 'short', format: 'cbq', style: 'cbq-style' }, wordProblem),
  custom('minterm', [1, 'b', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const bits = [g.int(0, 1), g.int(0, 1), g.int(0, 1), g.int(0, 1)];
    const value = parseInt(bits.join(''), 2);
    const right = termText({ value, mask: 0, covers: [] }, 4);
    const flips = [1, 2, 4, 8].map((b) => termText({ value: value ^ b, mask: 0, covers: [] }, 4));
    return g.mcq(`If A = ${bits[0]}, B = ${bits[1]}, C = ${bits[2]} and D = ${bits[3]}, the minterm is:`, right, g.sample(flips, 3));
  }),
  custom('simplify', [1, 'b', 2, 1], { type: 'short', format: 'short' }, (g) => {
    const [expr, steps, answer] = g.pick([
      ['A + AB', ['A(1 + B)', 'absorption, since 1 + B = 1'], 'A'],
      ['A(A + B)', ['AA + AB = A + AB', 'absorption'], 'A'],
      ['A + A′B', ['(A + A′)(A + B)', 'A + A′ = 1'], 'A + B'],
      ['AB + AB′', ['A(B + B′)', 'B + B′ = 1'], 'A'],
      ['(A + B)(A + B′)', ['A + BB′', 'BB′ = 0'], 'A'],
      ['AB + A′C + BC', ['the consensus theorem: BC is redundant', 'it’s covered by AB and A′C'], 'AB + A′C'],
      ['(A′ + B′)′', ['De Morgan’s law', 'A″ and B″ reduce to A and B'], 'AB'],
    ] as const);
    return g.theory(`Simplify using the laws of Boolean algebra: ${expr}`, [`Use ${steps[0]}, then ${steps[1]}.`, `The answer is ${answer}.`]);
  }),
  custom('dual-complement', [1, 'b', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const [expr, comp, wrong] = g.pick([
      ['A + BC', 'A′(B′ + C′)', ['A′ + B′C′', 'A(B + C)', 'A′B′C′']],
      ['AB + C', '(A′ + B′)C′', ['A′B′ + C′', 'A′ + B′ + C′', '(A + B)C']],
      ['(A + B)C', 'A′B′ + C′', ['(A′ + B′)C′', 'AB + C', 'A′ + B′ + C′']],
      ['A′B + C′', '(A + B′)C', ['AB′ + C', 'A + B′ + C', '(A′ + B)C′']],
    ] as const);
    return g.mcq(`The complement of ${expr} is:`, comp, [...wrong], { why: 'De Morgan’s laws swap AND and OR, and complement each variable.' });
  }),
  ...facts(1, 'a', {
    define: [
      ['a tautology', 'A proposition that is true for every combination of truth values of its variables.'],
      ['a contradiction', 'A proposition that is false for every combination of truth values of its variables.'],
      ['a contingency', 'A proposition that is true for some combinations and false for others.'],
    ],
    recall: [
      ['The contrapositive of p ⇒ q is:', '~q ⇒ ~p', 'q ⇒ p', '~p ⇒ ~q', 'p ⇒ ~q'],
      ['p ⇒ q is false only when:', 'p is true and q is false', 'p is false and q is true', 'both are true', 'both are false'],
      ['A conditional and its contrapositive are:', 'logically equivalent', 'always opposite', 'unrelated', 'both tautologies'],
      ['p ⇔ q is true when:', 'p and q have the same truth value', 'p is true and q is false', 'p is false and q is true', 'p and q differ'],
    ],
    truths: [
      ['A proposition’s converse isn’t always equivalent to it.', 'A proposition’s converse is always equivalent to it.'],
      ['~(p ∧ q) is equivalent to ~p ∨ ~q.', '~(p ∧ q) is equivalent to ~p ∧ ~q.'],
      ['A statement and its inverse aren’t always equivalent.', 'A statement and its inverse are always equivalent.'],
    ],
    reason: [
      ['A statement and its contrapositive always agree.', 'p ⇒ q is false only when p is true and q is false.', '~q ⇒ ~p is false in that same case, and no other.'],
    ],
  }),
  ...facts(1, 'b', {
    define: [
      ['a minterm', 'A product term containing all the variables of a function, each once, complemented or not.'],
      ['a maxterm', 'A sum term containing all the variables of a function, each once, complemented or not.'],
      ['canonical form', 'A form of a Boolean expression in which every term contains all the variables.'],
      ['a Karnaugh map', 'A grid of a function’s values in Gray-code order, so that adjacent squares differ by one variable.'],
    ],
    recall: [
      ['A quad in a 4-variable K-map removes:', 'two variables', 'one variable', 'three variables', 'no variables'],
      ['An octet in a 4-variable K-map removes:', 'three variables', 'two variables', 'one variable', 'four variables'],
      ['The dual of A + 0 = A is:', 'A · 1 = A', 'A + 1 = 1', 'A · 0 = 0', 'A + A = A'],
      ['A + A′ equals:', '1', '0', 'A', 'A′'],
      ['AA′ equals:', '0', '1', 'A', 'A′'],
      ['By De Morgan’s law, (A + B)′ equals:', 'A′B′', 'A′ + B′', 'AB', 'A + B'],
    ],
    truths: [
      ['The law of absorption says A + AB = A.', 'The law of absorption says A + AB = B.'],
      ['Adjacent squares in a K-map differ in exactly one variable.', 'Adjacent squares in a K-map differ in exactly two variables.'],
      ['Groups in a K-map can wrap around its edges.', 'Groups in a K-map can never wrap around its edges.'],
    ],
    reason: [
      ['Gray code is used to number the rows and columns of a K-map.', 'Neighbouring squares then differ in only one variable.', 'So grouping them removes that variable.'],
    ],
    compare: [
      ['SOP', 'POS', ['A sum of product terms.', 'A product of sum terms.'], ['Built from the rows where the output is 1.', 'Built from the rows where the output is 0.']],
    ],
    long: [
      ['State and verify De Morgan’s laws with a truth table.', 'First law: (A + B)′ = A′B′.', 'Second law: (AB)′ = A′ + B′.', 'A truth table for two variables, listing each side.', 'The columns match in every row, so each law holds.', ['Conclusion: complementing swaps AND with OR, and complements each variable.', 1]],
    ],
  }),

  // ---- Unit 2: Hardware
  custom('gate-output', [2, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const gates: [string, (a: number, b: number) => number][] = [['AND', (a, b) => a & b], ['OR', (a, b) => a | b], ['NAND', (a, b) => 1 - (a & b)], ['NOR', (a, b) => 1 - (a | b)], ['XOR', (a, b) => a ^ b], ['XNOR', (a, b) => 1 - (a ^ b)]];
    const [name, f] = g.pick(gates);
    const a = g.int(0, 1);
    const b = g.int(0, 1);
    const right = f(a, b);
    return g.mcq(`A ${name} gate has inputs ${a} and ${b}. Its output is:`, String(right), [String(1 - right)]);
  }),
  custom('gate-chain', [2, 'a', 2, 2], { type: 'short', format: 'short' }, (g) => {
    const [a, b, c] = [g.int(0, 1), g.int(0, 1), g.int(0, 1)];
    const x = 1 - (a & b);
    const out = x | c;
    return g.theory(`The output of a NAND gate with inputs A = ${a} and B = ${b} goes to an OR gate, with C = ${c} as its other input. Write the Boolean expression for the final output, and its value.`, ['F = (AB)′ + C.', `The NAND gives ${x}, so F = ${out}.`]);
  }),
  ...facts(2, 'a', {
    define: [
      ['a universal gate', 'A gate that can be used on its own to build any other gate. NAND and NOR are universal.'],
      ['a logic gate', 'An electronic circuit that gives one output from one or more inputs, following a logical rule.'],
    ],
    recall: [
      ['Which of these is a universal gate?', 'NAND', 'AND', 'OR', 'XOR'],
      ['A NOT gate can be made from a NAND gate by:', 'joining its two inputs together', 'leaving an input open', 'adding a resistor', 'adding an OR gate'],
      ['XOR gives 1 when its inputs:', 'are different', 'are the same', 'are both 1', 'are both 0'],
      ['How many NAND gates make an AND gate?', '2', '1', '3', '4'],
    ],
    truths: [
      ['NOR gives 1 only when all its inputs are 0.', 'NOR gives 1 only when all its inputs are 1.'],
      ['Two NOT gates in series give back the input.', 'Two NOT gates in series give the opposite of the input.'],
      ['An OR gate needs three NAND gates.', 'An OR gate needs one NAND gate.'],
    ],
    draw: [
      ['Draw the logic gate diagram for a 2-input AND gate using only NOR gates.', 'A NOR gate as a NOT on each input.', 'A third NOR gate joining the outputs of those two.'],
      ['Draw a 2-input OR gate using only NAND gates.', 'A NAND gate as a NOT on each input.', 'A third NAND gate joining the outputs of those two.'],
    ],
    reason: [
      ['NAND is called a universal gate.', 'NOT, AND and OR can all be made from NAND gates alone.', 'Any Boolean function can be built from those three.'],
    ],
  }),
  ...facts(2, 'b', {
    define: [
      ['a half adder', 'A circuit that adds two bits, with a sum and a carry as outputs.'],
      ['a full adder', 'A circuit that adds three bits, two inputs and a carry in, with a sum and a carry out.'],
      ['a decoder', 'A circuit that activates one of 2ⁿ outputs, from an n-bit input.'],
      ['an encoder', 'A circuit that turns one active input of 2ⁿ into its n-bit code.'],
      ['a multiplexer', 'A circuit that sends one of many inputs to a single output, chosen by select lines.'],
    ],
    recall: [
      ['The sum of a half adder is:', 'A XOR B', 'A AND B', 'A OR B', 'A NOR B'],
      ['The carry of a half adder is:', 'A AND B', 'A XOR B', 'A OR B', 'A NAND B'],
      ['A 3-to-8 decoder has how many output lines?', '8', '3', '16', '4'],
      ['A multiplexer with 8 inputs needs how many select lines?', '3', '8', '4', '2'],
      ['An octal to binary encoder has:', '8 inputs and 3 outputs', '3 inputs and 8 outputs', '8 inputs and 8 outputs', '3 inputs and 3 outputs'],
    ],
    truths: [
      ['A full adder can be built from two half adders and an OR gate.', 'A full adder can be built from one half adder alone.'],
      ['A decoder has more outputs than inputs.', 'A decoder has more inputs than outputs.'],
      ['A multiplexer has many inputs and one output.', 'A multiplexer has one input and many outputs.'],
    ],
    compare: [
      ['a half adder', 'a full adder', ['Adds two bits.', 'Adds three bits.'], ['Has no carry in.', 'Has a carry in.']],
      ['an encoder', 'a decoder', ['Many inputs to a few outputs.', 'A few inputs to many outputs.'], ['Turns an active line into a binary code.', 'Turns a binary code into an active line.']],
    ],
    draw: [
      ['Draw the logic gate diagram for a half adder, and write its expressions.', 'An XOR gate for the sum, S = A ⊕ B.', 'An AND gate for the carry, C = AB.'],
      ['Draw a full adder using two half adders.', 'The first half adder on A and B, whose sum goes to the second with Cin.', 'An OR gate joining the two carries, to give Cout.'],
    ],
    explain: [
      ['Write the expressions for the sum and carry of a full adder.', 'Sum = A ⊕ B ⊕ C.', 'Carry = AB + BC + CA.'],
    ],
  }),

  // ---- Unit 3: Methods and objects
  custom('design', [3, 'a', 10, 3], { type: 'program', format: 'program' }, (g) => g.pick(DESIGNS)(g)),
  custom('output-object', [3, 'a', 2, 2], { type: 'output', format: 'output' }, OUTPUT_OBJECT),
  custom('find-error-method', [3, 'a', 2, 2], { type: 'error', format: 'error' }, (g) => {
    const a = g.int(2, 9);
    const b = g.int(2, 9);
    return findError(g, `class Calc {\n  int add(int x, int y) {\n    int s = x + y;\n  }\n  public static void main(String[] args) {\n    Calc c = new Calc();\n    System.out.println(c.add(${a}, ${b}));\n  }\n}`, `class Calc {\n  int add(int x, int y) {\n    int s = x + y;\n    return s;\n  }\n  public static void main(String[] args) {\n    Calc c = new Calc();\n    System.out.println(c.add(${a}, ${b}));\n  }\n}`, ['add() is declared to return an int, but has no return statement.', 'Correct it by adding return s; as its last line.']);
  }),
  custom('find-error-static', [3, 'a', 2, 2], { type: 'error', format: 'error' }, (g) => {
    const a = g.int(2, 9);
    return findError(g, `class Box {\n  int v;\n  Box(int x) {\n    v = x;\n  }\n  public static void main(String[] args) {\n    Box b = new Box(${a});\n    System.out.println(b.w);\n  }\n}`, `class Box {\n  int v;\n  Box(int x) {\n    v = x;\n  }\n  public static void main(String[] args) {\n    Box b = new Box(${a});\n    System.out.println(b.v);\n  }\n}`, ['The class has no member w, which is what the print statement uses.', 'Correct it by printing b.v.']);
  }),
  custom('complete-method', [3, 'a', 3, 2], { type: 'complete', format: 'short' }, (g) => {
    const n = g.int(3, 6);
    const code = (one: string, two: string, three: string) => `class Sum {\n  int total(int n) {\n    int s = ${one};\n    for (int i = 1; i <= ${two}; i++) {\n      s = ${three};\n    }\n    return s;\n  }\n  public static void main(String[] args) {\n    Sum x = new Sum();\n    System.out.println(x.total(${n}));\n  }\n}`;
    return complete(g, code('?1?', '?2?', '?3?'), code('0', 'n', 's + i'), [['?1? is 0, so the sum starts from nothing.', 1], ['?2? is n, the last number to add.', 1], ['?3? is s + i, adding each number in turn.', 1]], `The method below adds the numbers from 1 to n.`);
  }),
  ...facts(3, 'a', {
    define: [
      ['a constructor', 'A special method with the class’s name and no return type, called when an object is created.'],
      ['method overloading', 'Having several methods of the same name, with different parameter lists.'],
      ['an instance variable', 'A variable that each object has its own copy of.'],
      ['a static member', 'A member that belongs to the class itself, shared by all its objects.'],
    ],
    recall: [
      ['A constructor has:', 'no return type', 'the return type void', 'the return type int', 'any return type'],
      ['Which keyword refers to the current object?', 'this', 'super', 'new', 'static'],
      ['A static method can directly use:', 'static members only', 'instance members only', 'any member', 'no members'],
      ['Objects passed as parameters in Java are:', 'passed as a copy of the reference', 'always cloned', 'never changed by the method', 'passed as a string'],
      ['Which is called automatically when an object is created?', 'The constructor', 'The main method', 'The finalizer', 'A static block only'],
    ],
    reason: [
      ['A method can change an object passed to it, but not an int passed to it.', 'Primitive parameters are copied.', 'A reference parameter refers to the same object as the caller’s.'],
      ['A static method can’t use this.', 'It belongs to the class, and may run with no object at all.'],
    ],
    compare: [
      ['pure functions', 'impure functions', ['Don’t change the state of any object.', 'Change the state of an object.'], ['Return a value based on their inputs.', 'May return nothing, working by side effect.']],
      ['a static variable', 'an instance variable', ['One copy, shared by all objects.', 'One copy for each object.'], ['Reached through the class name.', 'Reached through an object.']],
      ['actual parameters', 'formal parameters', ['Values in the method call.', 'Variables in the method’s definition.'], ['Exist in the caller.', 'Exist only inside the method.']],
    ],
    truths: [
      ['A class can have more than one constructor.', 'A class can have only one constructor.'],
      ['A default constructor is supplied if none is written.', 'A default constructor is supplied even if another constructor is written.'],
      ['Overloaded methods must differ in their parameter lists.', 'Overloaded methods must differ in their return types alone.'],
    ],
    cases: [
      {
        scene: 'A school writes a class Student to keep a student’s name and marks. A teacher creates two objects, and passes one object to a method that raises its marks by 5.',
        parts: [
          ['After the method call, does the original object’s mark change? Why?', 'Yes, because the method gets a reference to the same object.', 1],
          ['If the method’s parameter had been an int instead, would the caller’s value change?', 'No, as the int is copied.', 1],
          ['What’s the name for a method that changes an object’s data?', 'An impure function, or a mutator.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 4: Arrays and strings
  custom('output-array', [4, 'a', 2, 1], { type: 'output', format: 'output' }, OUTPUT_ARRAY),
  custom('output-matrix', [4, 'a', 2, 2], { type: 'output', format: 'output' }, OUTPUT_MATRIX),
  custom('address-1d', [4, 'a', 2, 1], { type: 'numerical', format: 'numerical' }, (g) => {
    const base = 100 * g.int(1, 30);
    const size = g.pick([2, 4, 8]);
    const i = g.int(3, 20);
    return { form: 'numeric', text: `An array A[ ] has a base address of ${base}, and each element takes ${size} bytes. Find the address of A[${i}], with indexes starting from 0.`, parts: [g.answerPart('Address of the element', base + i * size, 2, [{ label: 'Use the formula', math: [`\\text{Address} = B + i\\times W = ${base} + ${i}\\times${size} = ${base + i * size}`] }])] };
  }),
  custom('address-2d', [4, 'a', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const base = 100 * g.int(10, 60);
    const size = g.pick([2, 4, 8]);
    const rows = g.int(5, 20);
    const cols = g.int(5, 20);
    const lr = g.int(0, 1);
    const lc = g.int(0, 1);
    const i = g.int(lr + 1, rows - 1);
    const j = g.int(lc + 1, cols - 1);
    const major = g.pick(['row', 'column'] as const);
    const value = major === 'row' ? base + size * ((i - lr) * cols + (j - lc)) : base + size * ((j - lc) * rows + (i - lr));
    return {
      form: 'numeric',
      text: `A two-dimensional array A[${lr}…${lr + rows - 1}, ${lc}…${lc + cols - 1}] is stored in ${major}-major order. Each element takes ${size} bytes, and the base address is ${base}. Find the address of A[${i}, ${j}].`,
      parts: [g.answerPart('Address of the element', value, 3, [{ label: `Use the ${major}-major formula`, math: [major === 'row' ? `B + W[(i - L_r)N + (j - L_c)] = ${base} + ${size}[(${i} - ${lr})(${cols}) + (${j} - ${lc})] = ${value}` : `B + W[(j - L_c)M + (i - L_r)] = ${base} + ${size}[(${j} - ${lc})(${rows}) + (${i} - ${lr})] = ${value}`] }])],
    };
  }),
  custom('find-error-array', [4, 'a', 2, 2], { type: 'error', format: 'error' }, (g) => {
    const list = Array.from({ length: g.int(3, 5) }, () => g.int(1, 9));
    const body = (limit: string) => inMain(`int[] a = {${list.join(', ')}};\nfor (int i = 0; i ${limit}; i++) {\n  System.out.println(a[i]);\n}`);
    return findError(g, body('<= a.length'), body('< a.length'), ['The loop reaches index a.length, which is past the last element, and throws ArrayIndexOutOfBoundsException.', 'Correct it by using i < a.length.']);
  }),
  ...facts(4, 'a', {
    define: [
      ['row-major order', 'Storing a two-dimensional array in memory one row after another.'],
      ['column-major order', 'Storing a two-dimensional array in memory one column after another.'],
      ['an array', 'A collection of elements of one type, stored together and reached by an index.'],
    ],
    recall: [
      ['Array indexes in Java start from:', '0', '1', '−1', 'any chosen number'],
      ['The length of int[] a = new int[5] is given by:', 'a.length', 'a.length()', 'a.size()', 'length(a)'],
      ['Accessing a[a.length] throws:', 'ArrayIndexOutOfBoundsException', 'NullPointerException', 'ArithmeticException', 'ClassCastException'],
      ['In a 3 × 4 array, how many elements are there?', '12', '7', '3', '4'],
    ],
    truths: [
      ['A two-dimensional array in Java is an array of arrays.', 'A two-dimensional array in Java can’t have rows of different lengths.'],
      ['New int arrays start with every element at 0.', 'New int arrays start with every element unset, so reading one is an error.'],
      ['A row in a[][] can be reached with a[i].', 'A column in a[][] can be reached with a[i].'],
    ],
    reason: [
      ['Binary search needs a sorted array.', 'It discards half the list by comparing with the middle element.', 'That only works if the order is known.'],
    ],
    compare: [
      ['linear search', 'binary search', ['Works on an unsorted array.', 'Needs a sorted array.'], ['Checks elements one by one.', 'Halves the search range at each step.']],
      ['bubble sort', 'selection sort', ['Swaps adjacent elements.', 'Finds the smallest, and swaps it into place.'], ['Can stop early if no swaps happen.', 'Always makes the same number of comparisons.']],
    ],
  }),
  custom('output-string', [4, 'b', 2, 1], { type: 'output', format: 'output' }, OUTPUT_STRING),
  custom('output-string-loop', [4, 'b', 3, 2], { type: 'output', format: 'output' }, (g) => {
    const word = g.pick(SHORT_WORDS);
    return outputOf(g, inMain(`String s = "${word}";\nString t = "";\nfor (int i = s.length() - 1; i >= 0; i -= 2) {\n  t = t + s.charAt(i);\n}\nSystem.out.println(t);\nSystem.out.println(t.toLowerCase());`), 'The loop walks backwards, taking every second letter.');
  }),
  custom('palindrome-design', [4, 'b', 3, 2], { type: 'complete', format: 'short' }, (g) => {
    const word = g.pick(['LEVEL', 'RADAR', 'MADAM', 'ROTOR', 'COMPUTER', 'PROGRAM', 'NOON']);
    const code = (one: string, two: string, three: string) => withMethods(`static boolean isPal(String s) {\n  int i = 0;\n  int j = s.length() - 1;\n  while (i < j) {\n    if (s.charAt(i) != s.charAt(${one})) {\n      return ${two};\n    }\n    i++;\n    j = ${three};\n  }\n  return true;\n}`, `System.out.println(isPal("${word}"));`);
    return complete(g, code('?1?', '?2?', '?3?'), code('j', 'false', 'j - 1'), [['?1? is j, the letter at the other end.', 1], ['?2? is false, since one mismatch settles it.', 1], ['?3? is j - 1, moving in from the right.', 1]], 'This method checks whether a word reads the same both ways.');
  }),
  ...facts(4, 'b', {
    recall: [
      ['"HELLO".substring(1, 3) gives:', '"EL"', '"ELL"', '"HE"', '"LL"'],
      ['"HELLO".charAt(4) gives:', "'O'", "'L'", "'H'", 'an error'],
      ['"HELLO".indexOf(\'L\') gives:', '2', '3', '1', '-1'],
      ['Comparing the contents of two strings needs:', 'equals()', '==', 'compareSign()', '='],
      ['Strings in Java are:', 'immutable', 'changed in place by every method', 'primitive', 'arrays of int'],
    ],
    truths: [
      ['substring(a, b) stops before index b.', 'substring(a, b) includes the character at index b.'],
      ['length() is a method for strings, but length is a field for arrays.', 'length() is a method for arrays, but length is a field for strings.'],
      ['compareTo returns 0 for equal strings.', 'compareTo returns 1 for equal strings.'],
    ],
    reason: [
      ['Using == to compare strings can give surprising results.', 'It compares references, not the characters.'],
      ['toUpperCase() has to be assigned, to change a variable.', 'Strings can’t change, so it returns a new string.'],
    ],
    compare: [
      ['equals()', '==', ['Compares the characters of two strings.', 'Compares whether two references point at one object.'], ['Works as intended for contents.', 'Can be false for equal text.']],
    ],
  }),

  // ---- Unit 5: Recursion
  custom('output-recursion', [5, 'a', 2, 2], { type: 'output', format: 'output' }, OUTPUT_RECURSION),
  custom('recursion-trace', [5, 'a', 3, 3], { type: 'output', format: 'output' }, (g) => {
    const n = g.int(100, 999);
    return outputOf(g, withMethods('static void rev(int n) {\n  if (n > 0) {\n    System.out.print(n % 10);\n    rev(n / 10);\n  }\n}\nstatic int count(int n) {\n  if (n == 0) {\n    return 0;\n  }\n  return 1 + count(n / 10);\n}', `rev(${n});\nSystem.out.println();\nSystem.out.println(count(${n}));`), 'rev prints the last digit before making its call, so the number comes out reversed.');
  }),
  custom('recursion-complete', [5, 'a', 3, 2], { type: 'complete', format: 'short' }, (g) => {
    const n = g.int(3, 6);
    const code = (one: string, two: string, three: string) => withMethods(`static int power(int b, int e) {\n  if (e == ${one}) {\n    return ${two};\n  }\n  return b * power(b, ${three});\n}`, `System.out.println(power(2, ${n}));`);
    return complete(g, code('?1?', '?2?', '?3?'), code('0', '1', 'e - 1'), [['?1? is 0, the base case.', 1], ['?2? is 1, as any number to the power 0 is 1.', 1], ['?3? is e - 1, moving towards the base case.', 1]], 'This recursive method finds b to the power e.');
  }),
  ...facts(5, 'a', {
    define: [
      ['recursion', 'A method calling itself, with a simpler version of the problem each time.'],
      ['a base case', 'The condition in a recursive method that stops further calls.'],
    ],
    recall: [
      ['A recursive method with no base case will end with:', 'StackOverflowError', 'NullPointerException', 'correct output', 'an infinite while loop with no error'],
      ['Which structure keeps track of recursive calls?', 'The stack', 'The heap', 'A queue', 'A tree'],
      ['Which is generally true of recursion compared with a loop?', 'It uses more memory', 'It uses less memory', 'It can’t solve the same problems', 'It never ends'],
    ],
    reason: [
      ['Every recursive method needs a base case.', 'Without it, the calls never stop.', 'The stack then overflows.'],
    ],
    compare: [
      ['recursion', 'iteration', ['A method calls itself.', 'A loop repeats a block.'], ['Uses the call stack, so it costs more memory.', 'Uses a fixed amount of memory.']],
    ],
    truths: [
      ['Each recursive call gets its own copy of the local variables.', 'All recursive calls share one copy of the local variables.'],
      ['Statements after a recursive call run while the calls return.', 'Statements after a recursive call never run.'],
      ['Tail-recursive code does its call as its last action.', 'Tail-recursive code does its call as its first action.'],
    ],
  }),

  // ---- Unit 6: Inheritance
  custom('stack-ops', [6, 'b', 2, 1], { type: 'short', format: 'short' }, (g) => {
    const ops: string[] = [];
    const stack: number[] = [];
    const count = g.int(5, 8);
    for (let i = 0; i < count; i++) {
      if (stack.length && g.chance(0.35)) {
        stack.pop();
        ops.push('pop()');
      } else {
        const v = g.int(1, 9);
        stack.push(v);
        ops.push(`push(${v})`);
      }
    }
    if (!stack.length) g.retry();
    return g.theory(`A stack starts empty, and these are done in order: ${ops.join(', ')}. Write the contents of the stack, from bottom to top, and the element at the top.`, [`From bottom to top, it holds ${stack.join(', ')}.`, `The top element is ${stack[stack.length - 1]}.`]);
  }),
  custom('queue-ops', [6, 'b', 2, 1], { type: 'short', format: 'short' }, (g) => {
    const ops: string[] = [];
    const queue: number[] = [];
    const count = g.int(5, 8);
    for (let i = 0; i < count; i++) {
      if (queue.length && g.chance(0.35)) {
        queue.shift();
        ops.push('dequeue()');
      } else {
        const v = g.int(1, 9);
        queue.push(v);
        ops.push(`enqueue(${v})`);
      }
    }
    if (!queue.length) g.retry();
    return g.theory(`A queue starts empty, and these are done in order: ${ops.join(', ')}. Write the contents of the queue, from front to rear, and the element at the front.`, [`From front to rear, it holds ${queue.join(', ')}.`, `The front element is ${queue[0]}.`]);
  }),
  custom('inherit-design', [6, 'a', 5, 3], { type: 'program', format: 'program' }, (g) => {
    const [base, derived, baseField, extra, formula] = g.pick([
      ['Employee', 'Manager', 'salary', 'bonus', 'salary + bonus'],
      ['Item', 'Discounted', 'price', 'discount', 'price - discount'],
      ['Account', 'Savings', 'balance', 'interest', 'balance + interest'],
    ] as const);
    const model = `class ${base} {\n  double ${baseField};\n  ${base}(double v) {\n    ${baseField} = v;\n  }\n  void show() {\n    System.out.println(${baseField});\n  }\n}\nclass ${derived} extends ${base} {\n  double ${extra};\n  ${derived}(double v, double e) {\n    super(v);\n    ${extra} = e;\n  }\n  double total() {\n    return ${formula};\n  }\n  void show() {\n    super.show();\n    System.out.println(total());\n  }\n}`;
    return g.theory(`A class ${base} has a data member ${baseField}, a parameterised constructor and a method show() that prints it. Using inheritance, specify a class ${derived} with a data member ${extra}, a parameterised constructor, a method total() that returns ${formula}, and a method show() that overrides the one in ${base}, also printing the total. Don’t write main().`, [
      [`Uses extends ${base}, and declares ${extra}.`, 1],
      ['The constructor calls super(v) as its first statement.', 1],
      ['Initialises its own data member.', 1],
      [`total() returns ${formula}.`, 1],
      ['show() overrides the base method, calling super.show().', 1],
    ], { model: fence(model) });
  }),
  ...facts(6, 'a', {
    define: [
      ['inheritance', 'A class taking on the members of another class, using extends.'],
      ['method overriding', 'A derived class redefining a method of its base class, with the same signature.'],
      ['a superclass', 'The class another class inherits from.'],
    ],
    recall: [
      ['Which keyword is used to inherit from a class in Java?', 'extends', 'implements', 'inherits', 'super'],
      ['A call to super() must be:', 'the first statement in a constructor', 'the last statement in a constructor', 'in the main method', 'in a static method'],
      ['A private member of a base class is:', 'not directly accessible in a derived class', 'accessible everywhere', 'copied as public', 'static'],
      ['Java doesn’t allow a class to extend:', 'more than one class', 'an abstract class', 'a class with a constructor', 'Object'],
    ],
    reason: [
      ['A protected member is often used in a base class.', 'Derived classes can use it directly.', 'Other unrelated classes can’t.'],
    ],
    compare: [
      ['overloading', 'overriding', ['Same name, different parameters, in one class.', 'Same signature in a base and a derived class.'], ['Settled at compile time.', 'Settled at run time.']],
      ['private', 'protected', ['Visible only in the same class.', 'Visible in the same package and in derived classes.'], ['Not inherited for direct use.', 'Inherited for direct use.']],
    ],
    truths: [
      ['A derived class can add new members.', 'A derived class can’t add new members.'],
      ['Every class in Java inherits from Object.', 'Only abstract classes in Java inherit from Object.'],
      ['super can reach a method overridden in the derived class.', 'super can’t reach any method of the base class.'],
    ],
    cases: [
      {
        scene: 'A shop’s program has a class Item with a price. A new class FoodItem must also store an expiry date, and its method to print details has to show both.',
        parts: [
          ['How should FoodItem be related to Item?', 'It should extend Item, reusing its price.', 1],
          ['How does FoodItem’s constructor set the price?', 'By calling super with the price, as its first statement.', 1],
          ['What’s it called when FoodItem writes its own print method with the same signature?', 'Method overriding.', 1],
        ],
      },
    ],
  }),
  ...facts(6, 'b', {
    define: [
      ['an interface', 'A set of method signatures that a class promises to provide, using implements.'],
      ['a stack', 'A list in which items are added and removed at one end, last in, first out.'],
      ['a queue', 'A list in which items are added at the rear and removed from the front, first in, first out.'],
    ],
    recall: [
      ['Which keyword does a class use for an interface?', 'implements', 'extends', 'interface', 'super'],
      ['A stack works on the principle of:', 'last in, first out', 'first in, first out', 'random access', 'sorted access'],
      ['A queue works on the principle of:', 'first in, first out', 'last in, first out', 'random access', 'sorted access'],
      ['Popping from an empty stack is called:', 'underflow', 'overflow', 'recursion', 'wraparound'],
      ['Which can a class do with interfaces?', 'Implement more than one', 'Implement just one', 'Extend none', 'Instantiate them directly'],
    ],
    reason: [
      ['Stacks are used for method calls.', 'The most recent call has to finish first.', 'That is last in, first out.'],
      ['A circular queue is often preferred to a simple array queue.', 'A simple queue wastes space at the front as items leave.', 'A circular queue reuses that space.'],
    ],
    compare: [
      ['a stack', 'a queue', ['Last in, first out.', 'First in, first out.'], ['One end for both operations.', 'Different ends for the two operations.']],
      ['an interface', 'an abstract class', ['Has no constructors.', 'Can have constructors.'], ['A class can implement many.', 'A class can extend only one.']],
    ],
    truths: [
      ['An interface can’t be instantiated.', 'An interface can be instantiated with new.'],
      ['An abstract method has no body.', 'An abstract method must have a body.'],
      ['A dequeue allows insertion and deletion at both ends.', 'A dequeue allows insertion and deletion at one end only.'],
    ],
  }),

  // ---- Unit 7: Python
  custom('py-string', [7, 'a', 2, 1], { type: 'output', format: 'output', python: 1 }, pythonOutput),
  custom('py-list', [7, 'b', 2, 1], { type: 'output', format: 'output', python: 1 }, pythonList),
  custom('py-tuple', [7, 'c', 2, 1], { type: 'output', format: 'output', python: 1 }, pythonTuple),
  custom('py-5', [7, 'b', 5, 2], { type: 'output', format: 'output', python: 1 }, (g) => {
    const list = Array.from({ length: g.int(5, 7) }, () => g.int(1, 20));
    const evens = list.filter((v) => v % 2 === 0);
    const sq = list.map((v) => v * v);
    return {
      form: 'output',
      text: 'Write the output of the following Python code.',
      code: `a = ${pyList(list)}\nb = []\nfor x in a:\n    if x % 2 == 0:\n        b.append(x)\nprint(b)\nprint(len(b))\nc = [x * x for x in a]\nprint(c[0])\nprint(c[-1])\nprint(a[::2])`,
      expected: `${pyList(evens)}\n${evens.length}\n${sq[0]}\n${sq[sq.length - 1]}\n${pyList(pySlice(list, undefined, undefined, 2))}`,
      python: 1,
      why: 'The loop keeps the even numbers, the comprehension squares each element, and [::2] takes every second one.',
    };
  }),
  ...facts(7, 'a', {
    recall: [
      ['Strings in Python are:', 'immutable', 'changed in place by every method', 'always numbers', 'arrays of bytes only'],
      ['s[-1] gives:', 'the last character', 'the first character', 'an error', 'the whole string'],
      ['s[::-1] gives:', 'the string reversed', 'the first character', 'the last character', 'an error'],
      ['Which method changes a string to capitals?', 'upper()', 'capital()', 'toUpper()', 'big()'],
    ],
    truths: [
      ['s[a:b] stops before index b.', 's[a:b] includes the character at index b.'],
      ['A slice beyond the end of a string gives no error.', 'A slice beyond the end of a string always gives an error.'],
      ['Python blocks are marked by indentation.', 'Python blocks are marked by braces.'],
    ],
    reason: [
      ['s.upper() doesn’t change s.', 'Strings are immutable.', 'So it returns a new string, which must be stored to be kept.'],
    ],
  }),
  ...facts(7, 'b', {
    define: [
      ['a list comprehension', 'A short way of building a list from a loop in one expression.'],
    ],
    recall: [
      ['Which adds one item to the end of a list?', 'append()', 'add()', 'push()', 'insert_end()'],
      ['Lists in Python are:', 'mutable', 'immutable', 'fixed in size', 'always sorted'],
      ['len([1, 2, 3]) gives:', '3', '2', '6', 'an error'],
      ['Which removes and returns the last item of a list?', 'pop()', 'remove()', 'del()', 'cut()'],
    ],
    truths: [
      ['A list can hold items of different types.', 'A list can hold items of one type only.'],
      ['a.reverse() changes the list in place.', 'a.reverse() returns a new list, and leaves a unchanged.'],
      ['Assigning b = a makes both names refer to the one list.', 'Assigning b = a always makes a full copy of the list.'],
    ],
    compare: [
      ['append()', 'extend()', ['Adds its argument as one item.', 'Adds each item from a sequence.'], ['The list grows by one.', 'The list grows by the sequence’s length.']],
    ],
  }),
  ...facts(7, 'c', {
    recall: [
      ['Tuples in Python are:', 'immutable', 'mutable', 'always sorted', 'dictionaries'],
      ['Which one creates a tuple with one item?', '(5,)', '(5)', '[5]', '{5}'],
      ['t[0] = 1 on a tuple gives:', 'a TypeError', 'a new tuple', 'no effect, silently', 'a list'],
    ],
    truths: [
      ['A tuple can be used as a dictionary key.', 'A list can be used as a dictionary key.'],
      ['Tuples use round brackets.', 'Tuples use square brackets.'],
      ['A tuple can’t have items added to it after it’s made.', 'A tuple can have items added using append().'],
    ],
    compare: [
      ['a list', 'a tuple', ['Mutable.', 'Immutable.'], ['Written in square brackets.', 'Written in round brackets.']],
    ],
    reason: [
      ['Tuples are preferred for fixed data, such as coordinates.', 'They can’t be changed by accident.'],
    ],
  }),

  // ---- Unit 8: Binary trees
  custom('tree-traversal', [8, 'a', 3, 2], { type: 'short', format: 'short' }, (g) => {
    const root = makeTree(g);
    return g.theory('For the binary tree shown, write its in-order, pre-order and post-order traversals.', [`In-order: ${inorder(root).join(' ')}.`, `Pre-order: ${preorder(root).join(' ')}.`, `Post-order: ${postorder(root).join(' ')}.`], { diagram: { kind: 'tree', nodes: treeNodes(root) } });
  }),
  custom('tree-5', [8, 'a', 5, 3], { type: 'short', format: 'long' }, (g) => {
    const root = makeTree(g);
    const lf = leaves(root);
    const inner = internal(root);
    return g.theory('For the binary tree shown:\n(i) write its in-order traversal [1]\n(ii) write its pre-order traversal [1]\n(iii) name its leaf nodes [1]\n(iv) name its internal nodes [1]\n(v) state its height, counting the number of levels [1]', [
      [`(i) ${inorder(root).join(' ')}.`, 1],
      [`(ii) ${preorder(root).join(' ')}.`, 1],
      [`(iii) ${lf.join(', ')}.`, 1],
      [`(iv) ${inner.join(', ')}.`, 1],
      [`(v) ${height(root)}.`, 1],
    ], { diagram: { kind: 'tree', nodes: treeNodes(root) } });
  }),
  custom('tree-level', [8, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const root = makeTree(g);
    const label = g.pick(inorder(root));
    const level = levelOf(root, label) as number;
    return g.mcq(`In the binary tree shown, with the root at level 0, what is the level of node ${label}?`, String(level), [0, 1, 2, 3, 4].filter((v) => v !== level).slice(0, 3).map(String), { diagram: { kind: 'tree', nodes: treeNodes(root) } });
  }),
  custom('tree-max-nodes', [8, 'a', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const h = g.int(2, 6);
    return g.mcqNumber(`The largest number of nodes in a binary tree with ${h} levels is:`, 2 ** h - 1, '', [
      { slip: 'used 2ⁿ', value: 2 ** h },
      { slip: 'used 2ⁿ⁻¹, which is just the last level', value: 2 ** (h - 1) },
      { slip: 'used n²', value: h * h === 2 ** h - 1 ? h * h + 1 : h * h },
      { slip: 'used 2n', value: 2 * h === 2 ** h - 1 ? 2 * h + 1 : 2 * h },
    ], { digits: 5 });
  }),
  ...facts(8, 'a', {
    define: [
      ['a leaf node', 'A node with no children.'],
      ['the root of a binary tree', 'The single node at the top, which has no parent.'],
      ['a binary tree', 'A tree in which every node has at most two children.'],
      ['a subtree', 'A node of a tree, together with all that node’s descendants.'],
    ],
    recall: [
      ['In-order traversal visits:', 'left, root, right', 'root, left, right', 'left, right, root', 'right, root, left'],
      ['Pre-order traversal visits:', 'root, left, right', 'left, root, right', 'left, right, root', 'right, left, root'],
      ['Post-order traversal visits:', 'left, right, root', 'root, left, right', 'left, root, right', 'right, root, left'],
      ['In-order traversal of a binary search tree gives its values:', 'in sorted order', 'in reverse order only', 'in random order', 'in level order'],
    ],
    compare: [
      ['in-order traversal', 'pre-order traversal', ['Visits the root between its subtrees.', 'Visits the root before its subtrees.'], ['On a search tree, gives sorted values.', 'Is useful for copying a tree.']],
      ['a full binary tree', 'a complete binary tree', ['Every node has zero or two children.', 'All levels are filled, except perhaps the last, which fills from the left.']],
    ],
    truths: [
      ['A tree with n nodes has n − 1 edges.', 'A tree with n nodes has n edges.'],
      ['Every node except the root has exactly one parent.', 'Every node except the root has exactly two parents.'],
      ['A leaf has a degree of zero.', 'A leaf has a degree of two.'],
    ],
    reason: [
      ['A balanced search tree finds a value quickly.', 'Each comparison discards about half of the remaining nodes.'],
    ],
  }),

  // ---- Unit 9: Complexity
  custom('big-o', [9, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const [code, right, wrong, why] = g.pick(LOOPS);
    return g.mcq(`What is the time complexity of this code, in Big O notation?\n${fence(code)}`, right, wrong, { why });
  }),
  custom('big-o-explain', [9, 'a', 2, 2], { type: 'short', format: 'short' }, (g) => {
    const [code, right, , why] = g.pick(LOOPS);
    return g.theory(`State the worst-case complexity of this code in Big O notation, and explain your answer.\n${fence(code)}`, [`${right}.`, why]);
  }),
  custom('big-o-5', [9, 'a', 5, 3], { type: 'short', format: 'long' }, (g) => {
    const [a, b] = g.sample(LOOPS, 2);
    return g.theory(`(i) State the complexity of each code segment, with a reason. [4]\nSegment A:\n${fence(a[0])}\nSegment B:\n${fence(b[0])}\n(ii) What is meant by the worst case of an algorithm? [1]`, [
      [`Segment A is ${a[1]}.`, 1],
      [a[3], 1],
      [`Segment B is ${b[1]}.`, 1],
      [b[3], 1],
      ['It is the input of a given size that takes the most steps.', 1],
    ]);
  }),
  ...facts(9, 'a', {
    define: [
      ['Big O notation', 'A way of describing how an algorithm’s running time grows with the size of its input, for large inputs.'],
      ['the best case of an algorithm', 'The input of a given size that takes the fewest steps.'],
      ['the worst case of an algorithm', 'The input of a given size that takes the most steps.'],
    ],
    recall: [
      ['Which is the fastest for large n?', 'O(log n)', 'O(n)', 'O(n²)', 'O(2ⁿ)'],
      ['Binary search has a worst case of:', 'O(log n)', 'O(n)', 'O(n²)', 'O(1)'],
      ['Linear search has a worst case of:', 'O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
      ['Bubble sort has a worst case of:', 'O(n²)', 'O(n)', 'O(log n)', 'O(1)'],
      ['Reading an element of an array by its index is:', 'O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    ],
    reason: [
      ['Constant factors are dropped in Big O notation.', 'It describes growth for large inputs.', 'For large n, a constant factor matters far less than the rate of growth.'],
    ],
    compare: [
      ['O(n)', 'O(n²)', ['Doubling n doubles the time.', 'Doubling n makes the time four times as long.'], ['Typical of one loop.', 'Typical of two nested loops.']],
    ],
    truths: [
      ['O(2n) simplifies to O(n).', 'O(2n) simplifies to O(n²).'],
      ['Lower-order terms are dropped in Big O notation.', 'Only the lowest-order term is kept in Big O notation.'],
      ['An O(1) operation takes about the same time for any input size.', 'An O(1) operation takes one more step for each input.'],
    ],
  }),

  // ---- Long questions built from smaller ones, as Part II of the paper asks
  custom('section-a', [1, 'b', 10, 3], { type: 'short', format: 'long' }, (g) => {
    const map = kmapQuestion(g, 4, 3, 2);
    const prop = propositionQuestion(g);
    const a = g.int(0, 1);
    const b = g.int(0, 1);
    return g.theory(`(a) ${map.text} [5]\n(b) Draw a truth table to verify whether ${prop.text} is a tautology, a contradiction or a contingency. [3]\n(c) Find the output of a NAND gate with inputs ${a} and ${b}, then write the truth table of a NAND gate. [2]`, [
      ...map.points.map((p) => [`(a) ${p.text}`, p.marks] as [string, number]),
      [`(b) ${prop.answer}`, 2],
      [`(b) It is a ${prop.kind}.`, 1],
      [`(c) The output is ${1 - (a & b)}.`, 1],
      ['(c) 00 → 1, 01 → 1, 10 → 1, 11 → 0.', 1],
    ]);
  }),
  custom('section-a-word', [2, 'b', 10, 3], { type: 'short', format: 'cbq', style: 'cbq-style' }, (g) => {
    const word = wordProblem(g);
    return g.theory(`(a) ${word.text} [5]\n(b) Draw a full adder using two half adders. [3]\n(c) What’s the difference between a decoder and an encoder? [2]`, [
      ...word.points.map((p) => [`(a) ${p.text}`, p.marks] as [string, number]),
      ['(b) The first half adder works on A and B. Its sum goes to the second with Cin.', 2],
      ['(b) An OR gate joins the two carries, to give Cout.', 1],
      ['(c) An encoder has many inputs and a few outputs.', 1],
      ['(c) A decoder has a few inputs and many outputs.', 1],
    ]);
  }),
  custom('section-b', [5, 'a', 10, 3], { type: 'output', format: 'long' }, (g) => {
    const recursion = OUTPUT_RECURSION(g);
    const array = OUTPUT_ARRAY(g);
    return g.theory(`(a) Write the output of this program, and name the concept it uses.\n${fence(recursion.code)}\n[4]\n(b) Write the output of this program.\n${fence(array.code)}\n[3]\n(c) What’s a base case, and why does every recursive method need one? [3]`, [
      [`(a) The output is ${recursion.expected.replace(/\n/g, ' / ')}.`, 3],
      ['(a) Recursion.', 1],
      [`(b) The output is ${array.expected}.`, 3],
      ['(c) The condition that stops further calls.', 1],
      ['(c) Without one, calls never stop.', 1],
      ['(c) The stack would overflow.', 1],
    ]);
  }),
];

export default blueprints;
