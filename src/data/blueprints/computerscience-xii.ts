// Computer Science, Class XII. Answers are computed: Java runs in the tracer, Boolean functions go through
// Quine–McCluskey, and trees are worked out by code.
import { classify, coverIsRight, groupNames, minimalCover, primeImplicants, sopText, termText, truthColumn, VARS } from '../../practice/gen/boolean';
import type { Gen } from '../../practice/gen/gen';
import { complete, designChecked, designClass, findError, inMain, outputOf, pyList, pySlice, SHORT_WORDS, withMethods } from './cs-common';
import { derivationBlueprints } from '../derivations';
import KNOWLEDGE from './knowledge/computerscience-xii';
import { blueprintsFor } from './dsl';
import type { Blueprint, Body, OutputBody, TheoryBody } from './types';

const { custom, facts, rest } = blueprintsFor('computerscience', 'XII', KNOWLEDGE);

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
    return g.theory(`Use a Karnaugh map to minimise F(${names}) = π(${zeros.join(', ')}), and show the groups you use.`, [
      [`A correct map with the zeros marked, and groups: ${groupNames(posCover)}.`, marksMap],
      [`F = ${pos}.`, marksTerm],
    ]);
  }
  return g.theory(`Use a Karnaugh map to minimise F(${names}) = Σ(${minterms.join(', ')}), and show the groups you use.`, [
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
    const [p, q, notP, notQ] = g.pick([
      ['it rains', 'the match is cancelled', 'it doesn’t rain', 'the match isn’t cancelled'],
      ['a number is even', 'it is divisible by 2', 'a number isn’t even', 'it isn’t divisible by 2'],
      ['the power fails', 'the alarm rings', 'the power doesn’t fail', 'the alarm doesn’t ring'],
      ['you pass the test', 'you get a certificate', 'you don’t pass the test', 'you don’t get a certificate'],
    ] as const);
    return g.theory(`Write the converse and the contrapositive of: "If ${p}, then ${q}."`, [`Converse: if ${q}, then ${p}.`, `Contrapositive: if ${notQ}, then ${notP}.`]);
  }),
  custom('kmap4', [1, 'b', 5, 3], { type: 'short', format: 'long' }, (g) => kmapQuestion(g, 4, 4, 1)),
  custom('kmap3', [1, 'b', 3, 2], { type: 'short', format: 'short' }, (g) => kmapQuestion(g, 3, 2, 1)),
  custom('word-problem', [1, 'b', 5, 3], { type: 'short', format: 'cbq', style: 'cbq-style' }, wordProblem),
  custom('minterm', [1, 'b', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const bits = [g.int(0, 1), g.int(0, 1), g.int(0, 1), g.int(0, 1)];
    const value = parseInt(bits.join(''), 2);
    const right = termText({ value, mask: 0, covers: [] }, 4);
    const flips = [1, 2, 4, 8].map((b) => termText({ value: value ^ b, mask: 0, covers: [] }, 4));
    return g.mcq(`Which minterm has the value 1 for the input A = ${bits[0]}, B = ${bits[1]}, C = ${bits[2]}, D = ${bits[3]}?`, right, g.sample(flips, 3));
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
      ['Give the Boolean expressions for the two outputs of a full adder.', 'Sum = A ⊕ B ⊕ C.', 'Carry = AB + BC + CA.'],
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
      ['Which part of memory keeps track of recursive calls?', 'The call stack', 'The heap', 'The array', 'The class file'],
      ['Which is generally true of recursion compared with a loop?', 'It uses more memory', 'It uses less memory', 'It can’t solve the same problems', 'It never ends'],
    ],
    reason: [
      ['Every recursive method needs a base case.', 'Without it, the calls never stop.', 'The call stack then overflows.'],
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
  custom('inherit-design', [6, 'a', 5, 3], { type: 'program', format: 'program' }, (g) => {
    const [base, derived, baseField, extra, formula] = g.pick([
      ['Employee', 'Manager', 'salary', 'bonus', 'salary + bonus'],
      ['Item', 'Discounted', 'price', 'discount', 'price - discount'],
      ['Account', 'Savings', 'balance', 'interest', 'balance + interest'],
    ] as const);
    const model = `class ${base} {\n  double ${baseField};\n  ${base}(double v) {\n    ${baseField} = v;\n  }\n  void show() {\n    System.out.println(${baseField});\n  }\n}\nclass ${derived} extends ${base} {\n  double ${extra};\n  ${derived}(double v, double e) {\n    super(v);\n    ${extra} = e;\n  }\n  double total() {\n    return ${formula};\n  }\n  void show() {\n    super.show();\n    System.out.println(total());\n  }\n}`;
    return designChecked(g, `A class ${base} has a data member ${baseField}, a parameterised constructor and a method show() that prints it. Using inheritance, specify a class ${derived} with a data member ${extra}, a parameterised constructor, a method total() that returns ${formula}, and a method show() that overrides the one in ${base}, also printing the total. Don’t write main().`, model, `class Test {\n  public static void main(String[] args) {\n    ${base} b = new ${derived}(${g.int(100, 900)}, ${g.int(10, 90)});\n    b.show();\n  }\n}`, [
      [`Uses extends ${base}, and declares ${extra}.`, 1],
      ['The constructor calls super(v) as its first statement.', 1],
      ['Initialises its own data member.', 1],
      [`total() returns ${formula}.`, 1],
      ['show() overrides the base method, calling super.show().', 1],
    ]);
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
      ['a method prototype', 'A method’s heading alone: its return type, name and parameter types, with no body.'],
    ],
    recall: [
      ['Which keyword does a class use for an interface?', 'implements', 'extends', 'interface', 'super'],
      ['The methods declared in an interface are, by default:', 'public and abstract', 'private and static', 'protected and final', 'private and abstract'],
      ['The fields of an interface are, by default:', 'public, static and final', 'private', 'protected and abstract', 'local to each method'],
      ['Which can a class do with interfaces?', 'Implement more than one', 'Implement just one', 'Extend none', 'Instantiate them directly'],
    ],
    reason: [
      ['A class can implement many interfaces, though it can extend only one class.', 'An interface brings no method bodies to inherit.', 'So two parents can’t clash over which body to use.'],
      ['An interface can’t be created with new.', 'Its methods have no bodies.', 'So an object of it would have nothing to run.'],
    ],
    compare: [
      ['the Java construct interface', 'the interface of a class', ['Declared with the keyword interface.', 'Not a keyword: the set of method prototypes a class offers.'], ['A class must use implements to take it on.', 'Every class has one, without any keyword.']],
      ['an interface', 'an abstract class', ['Has no constructors.', 'Can have constructors.'], ['A class can implement many.', 'A class can extend only one.']],
    ],
    truths: [
      ['An interface can’t be instantiated.', 'An interface can be instantiated with new.'],
      ['An abstract method has no body.', 'An abstract method must have a body.'],
      ['A class implementing an interface must define its methods, or be declared abstract.', 'A class implementing an interface can leave its methods without bodies and still be created with new.'],
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
    const h = g.int(3, 6);
    return g.mcqNumber(`The largest number of nodes in a binary tree with ${h} levels is:`, 2 ** h - 1, '', [
      { slip: 'used 2ⁿ', value: 2 ** h },
      { slip: 'used 2ⁿ⁻¹, which is just the last level', value: 2 ** (h - 1) },
      { slip: 'used n²', value: h * h },
      { slip: 'used 2n', value: 2 * h },
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
      ['a full binary tree', 'a complete binary tree', ['Every node has zero or two children.', 'All levels are filled, except perhaps the last, which fills from the left.'], ['Its last level may have gaps anywhere.', 'Its last level has no gaps before its rightmost node.']],
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
      ['(c) The call stack would overflow.', 1],
    ]);
  }),
  custom('complete-bubble', [4, 'a', 3, 2], { type: 'complete', format: 'short' }, (g) => {
    const values = g.sample([3, 5, 7, 9, 11, 13, 15, 17, 19], 5);
    const code = (one: string, two: string, three: string) => inMain(`int[] a = {${values.join(', ')}};\nint n = a.length;\nfor (int i = 0; i < ${one}; i++) {\n  for (int j = 0; j < n - i - 1; j++) {\n    if (a[j] > ${two}) {\n      int t = a[j];\n      a[j] = a[j + 1];\n      ${three} = t;\n    }\n  }\n}\nfor (int i = 0; i < n; i++) System.out.print(a[i] + " ");`);
    return complete(g, code('?1?', '?2?', '?3?'), code('n - 1', 'a[j + 1]', 'a[j + 1]'), [['?1? is n - 1, the number of passes.', 1], ['?2? is a[j + 1], the next element.', 1], ['?3? is a[j + 1], which completes the swap.', 1]], 'This program sorts an array in ascending order by bubble sort.');
  }),
  custom('complete-binary-search', [4, 'a', 3, 3], { type: 'complete', format: 'short' }, (g) => {
    const values = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
    const key = g.pick(values);
    const code = (one: string, two: string, three: string) => inMain(`int[] a = {${values.join(', ')}};\nint low = 0, high = a.length - 1, at = -1;\nwhile (low <= high) {\n  int mid = ${one};\n  if (a[mid] == ${key}) {\n    at = mid;\n    break;\n  } else if (a[mid] < ${key}) {\n    low = ${two};\n  } else {\n    high = ${three};\n  }\n}\nSystem.out.println(at);`);
    return complete(g, code('?1?', '?2?', '?3?'), code('(low + high) / 2', 'mid + 1', 'mid - 1'), [['?1? is (low + high) / 2, the middle position.', 1], ['?2? is mid + 1, as the key lies in the upper half.', 1], ['?3? is mid - 1, as the key lies in the lower half.', 1]], `This program finds ${key} in a sorted array by binary search, and prints its position.`);
  }),
  custom('design-sort', [4, 'a', 10, 3], { type: 'program', format: 'program' }, (g) => {
    const values = g.sample([4, 9, 2, 7, 11, 3, 8, 6, 15], 6);
    const code = `class Sorter {\n  int[] a;\n  Sorter(int[] x) {\n    a = x;\n  }\n  void sort() {\n    for (int i = 0; i < a.length - 1; i++) {\n      int small = i;\n      for (int j = i + 1; j < a.length; j++) {\n        if (a[j] < a[small]) small = j;\n      }\n      int t = a[i];\n      a[i] = a[small];\n      a[small] = t;\n    }\n  }\n  void show() {\n    for (int i = 0; i < a.length; i++) System.out.print(a[i] + " ");\n  }\n  public static void main(String[] args) {\n    int[] x = {${values.join(', ')}};\n    Sorter s = new Sorter(x);\n    s.sort();\n    s.show();\n  }\n}`;
    return designClass(g, 'Design a class Sorter that arranges an array of integers in ascending order by selection sort.\nData member: a[] (the array).\nMember functions:\nSorter(int[] x): a constructor that stores the array.\nvoid sort(): sorts the array by selection sort.\nvoid show(): prints the elements.\nSpecify the class, and define main() to create an object and use it.', code, [
      ['Declares the array and writes the constructor.', 2],
      ['Outer loop runs over each position.', 1],
      ['Inner loop finds the smallest remaining element.', 3],
      ['Swaps it into place.', 2],
      ['Writes show(), and main() to call the functions.', 2],
    ]);
  }),
  custom('design-transpose', [4, 'a', 10, 3], { type: 'program', format: 'program' }, (g) => {
    const [p, q, r, s] = g.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 4);
    const code = `class Transpose {\n  int[][] m;\n  Transpose(int[][] x) {\n    m = x;\n  }\n  int[][] flip() {\n    int[][] t = new int[m[0].length][m.length];\n    for (int i = 0; i < m.length; i++) {\n      for (int j = 0; j < m[0].length; j++) {\n        t[j][i] = m[i][j];\n      }\n    }\n    return t;\n  }\n  public static void main(String[] args) {\n    int[][] x = {{${p}, ${q}}, {${r}, ${s}}};\n    Transpose o = new Transpose(x);\n    int[][] t = o.flip();\n    System.out.println(t[0][1]);\n  }\n}`;
    return designClass(g, 'Design a class Transpose for the transpose of a matrix.\nData member: m[][] (the matrix).\nMember functions:\nTranspose(int[][] x): a constructor.\nint[][] flip(): returns the transpose of the matrix.\nSpecify the class, and define main() to create an object and use it.', code, [
      ['Declares the matrix and writes the constructor.', 2],
      ['Creates a new matrix with its rows and columns exchanged.', 2],
      ['Nested loops over rows and columns.', 3],
      ['Assigns t[j][i] = m[i][j] and returns t.', 2],
      ['Writes main() to call the function.', 1],
    ]);
  }),
  custom('design-tree-count', [8, 'a', 5, 3], { type: 'program', format: 'program' }, (g) => {
    const [a, b, c] = g.sample([5, 8, 12, 17, 21, 30, 44], 3);
    const code = `class Node {\n  int data;\n  Node left;\n  Node right;\n  Node(int d) {\n    data = d;\n    left = null;\n    right = null;\n  }\n  static int count(Node n) {\n    if (n == null) return 0;\n    return 1 + count(n.left) + count(n.right);\n  }\n  public static void main(String[] args) {\n    Node root = new Node(${a});\n    root.left = new Node(${b});\n    root.right = new Node(${c});\n    System.out.println(count(root));\n  }\n}`;
    return designClass(g, 'A class Node holds an integer and links to a left and a right child. Write the class, with a constructor, and a recursive function int count(Node n) that returns the number of nodes in the tree rooted at n.', code, [
      ['Declares data and the two links, and writes the constructor.', 2],
      ['The base case returns 0 for an empty tree.', 1],
      ['Adds 1 to the counts of the two subtrees.', 2],
    ]);
  }),
  custom('interface-write', [6, 'b', 4, 2], { type: 'program', format: 'program' }, (g) => {
    const [shape, field, area] = g.pick([['Square', 'side', 'side * side'], ['Circle', 'radius', '3.14 * radius * radius']]);
    const model = `interface Shape {\n  double area();\n}\nclass ${shape} implements Shape {\n  double ${field};\n  ${shape}(double v) {\n    ${field} = v;\n  }\n  public double area() {\n    return ${area};\n  }\n}`;
    return designChecked(g, `Write an interface Shape with a method area() that returns a double. Then write a class ${shape}, with a data member ${field} and a constructor, that implements it.`, model, `class Test {\n  public static void main(String[] args) {\n    Shape s = new ${shape}(${g.int(2, 9)});\n    System.out.println(s.area());\n  }\n}`, [
      ['Declares the interface with the method’s heading only.', 1],
      ['Uses the keyword implements in the class heading.', 1],
      ['Writes the data member and the constructor.', 1],
      ['Defines area() as public, with the right formula.', 1],
    ]);
  }),
  // ---- Real-life questions. Their answers are worked out by code here, or by the same algorithms as the rest.
  custom('cbq-knockout-tree', [8, 'a', 3, 2], { type: 'short', format: 'cbq', style: 'cbq-style' }, (g) => {
    const rounds = g.int(2, 5);
    const players = 2 ** rounds;
    return g.theory(`A knockout chess event for ${players} players is drawn as a binary tree. Each player is a leaf, and each match is an internal node, with the final at the root.\n(i) How many internal nodes does the tree have? (ii) What is its height, counting the number of levels? (iii) What does the path from a leaf to the root stand for?`, [
      [`(i) ${players - 1}, as each match knocks out one player.`, 1],
      [`(ii) ${rounds + 1}, as there are ${rounds} rounds above the level of the players.`, 1],
      ['(iii) That player’s matches, if they win every one up to the final.', 1],
    ]);
  }),
  custom('cbq-folder-tree', [8, 'a', 2, 2], { type: 'short', format: 'cbq', style: 'cbq-style' }, (g) => {
    const [root, left, right] = g.sample(['Music', 'Photos', 'School', 'Games', 'Notes', 'Trips'], 3);
    return g.theory(`A folder ${root} is stored as the root of a binary tree, with ${left} as its left child and ${right} as its right child. Neither child has children of its own.\n(i) Name the leaf nodes. (ii) Write the in-order traversal.`, [
      [`(i) ${left} and ${right}.`, 1],
      [`(ii) ${left}, ${root}, ${right}.`, 1],
    ]);
  }),
  custom('cbq-alarm-boolean', [1, 'b', 3, 2], { type: 'short', format: 'cbq', style: 'cbq-style' }, (g) => {
    const on = [[1, 1], [1, 0], [0, 1], [0, 0]].filter(() => g.chance(0.5));
    if (on.length < 1 || on.length > 3) g.retry('needs a real function');
    const minterms = on.map(([a, b]) => a * 2 + b);
    const cover = minimalCover(minterms, primeImplicants(minterms));
    const answer = sopText(cover, 2);
    return g.theory(`A car’s alarm sounds according to two inputs: A (door open) and B (window open), where 1 means open. It sounds in exactly these cases: ${on.map(([a, b]) => `A = ${a}, B = ${b}`).join('; ')}.\n(i) Write the minterms. (ii) Write the simplest SOP expression for the alarm.`, [
      [`(i) Minterms ${[...minterms].sort((x, y) => x - y).join(', ')}, reading AB as a binary number.`, 1],
      [`(ii) Alarm = ${answer}.`, 2],
    ]);
  }),
  custom('cbq-marks-array', [4, 'a', 3, 2], { type: 'output', format: 'cbq', style: 'cbq-style' }, (g) => {
    const marks = g.sample([34, 45, 52, 61, 68, 73, 80, 88, 92], 5);
    const pass = g.pick([50, 60, 70]);
    const code = inMain(`int[] marks = {${marks.join(', ')}};\nint count = 0, best = 0;\nfor (int i = 0; i < marks.length; i++) {\n  if (marks[i] >= ${pass}) count++;\n  if (marks[i] > best) best = marks[i];\n}\nSystem.out.println(count + " " + best);`);
    return outputOf(g, code, undefined, `A teacher’s program counts how many students reached ${pass}, and finds the top mark. Write what it prints.`);
  }),
  custom('cbq-recursion-steps', [5, 'a', 2, 2], { type: 'output', format: 'cbq', style: 'cbq-style' }, (g) => {
    const n = g.int(3, 6);
    const code = withMethods('static int stairs(int n) {\n  if (n <= 2) return n;\n  return stairs(n - 1) + stairs(n - 2);\n}', `System.out.println(stairs(${n}));`);
    return outputOf(g, code, undefined, `A person climbs stairs one or two steps at a time. This program counts the ways to climb ${n} steps. Write what it prints.`);
  }),
  // ---- Inheritance and interfaces. Every answer here comes from running the program in the tracer.
  custom('output-override', [6, 'a', 3, 2], { type: 'output', format: 'output' }, (g) => {
    const [base, kid, baseWord, kidWord] = g.pick([['Vehicle', 'Bus', 'moves', 'carries people'], ['Bird', 'Parrot', 'flies', 'talks'], ['Staff', 'Teacher', 'works', 'teaches'], ['Device', 'Phone', 'starts', 'rings']]);
    const code = `class ${base} {\n  String action() {\n    return "${baseWord}";\n  }\n  void show() {\n    System.out.println("It " + action());\n  }\n}\nclass ${kid} extends ${base} {\n  String action() {\n    return "${kidWord}";\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    ${base} a = new ${base}();\n    ${base} b = new ${kid}();\n    a.show();\n    b.show();\n  }\n}`;
    return outputOf(g, code, `b is declared as ${base}, but the object is a ${kid}. The runtime class decides which action() runs, even when it's called from inside ${base}.`);
  }),
  custom('output-ctor-chain', [6, 'a', 3, 2], { type: 'output', format: 'output' }, (g) => {
    const [a, b, c] = g.pick([['Grand', 'Parent', 'Child'], ['Base', 'Middle', 'Top'], ['Being', 'Animal', 'Dog']]);
    const n = g.int(2, 9);
    const code = `class ${a} {\n  ${a}() {\n    System.out.println("${a}");\n  }\n}\nclass ${b} extends ${a} {\n  ${b}(int x) {\n    System.out.println("${b} " + x);\n  }\n}\nclass ${c} extends ${b} {\n  ${c}() {\n    super(${n});\n    System.out.println("${c}");\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    new ${c}();\n  }\n}`;
    return outputOf(g, code, 'A constructor runs its parent\'s constructor first, so the topmost class prints first.');
  }),
  custom('output-super-method', [6, 'a', 2, 2], { type: 'output', format: 'output' }, (g) => {
    const [x, y] = [g.int(2, 9), g.int(2, 9)];
    const code = `class A {\n  int value() {\n    return ${x};\n  }\n}\nclass B extends A {\n  int value() {\n    return super.value() + ${y};\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    A obj = new B();\n    System.out.println(obj.value());\n  }\n}`;
    return outputOf(g, code, 'B\'s value() runs, and super.value() reaches the one in A.');
  }),
  custom('output-hidden-field', [6, 'a', 2, 3], { type: 'output', format: 'output' }, (g) => {
    const [x, y] = g.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 2);
    const code = `class P {\n  int v = ${x};\n  int get() {\n    return v;\n  }\n}\nclass Q extends P {\n  int v = ${y};\n  int get() {\n    return v;\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    P obj = new Q();\n    System.out.println(obj.v);\n    System.out.println(obj.get());\n  }\n}`;
    return outputOf(g, code, 'A field is chosen by the type as written, so obj.v is the one in P. A method is chosen by the runtime class, so get() is the one in Q.');
  }),
  custom('output-instanceof', [6, 'a', 3, 2], { type: 'output', format: 'output' }, (g) => {
    const [base, kid, other] = g.pick([['Shape', 'Circle', 'Square'], ['Fruit', 'Apple', 'Mango'], ['Pet', 'Cat', 'Fish']]);
    const code = `class ${base} {\n}\nclass ${kid} extends ${base} {\n}\nclass ${other} extends ${base} {\n}\nclass Test {\n  public static void main(String[] args) {\n    ${base} x = new ${kid}();\n    System.out.println(x instanceof ${base});\n    System.out.println(x instanceof ${kid});\n    System.out.println(x instanceof ${other});\n  }\n}`;
    return outputOf(g, code, `The object is a ${kid}, which is also a ${base}, and isn't a ${other}.`);
  }),
  custom('output-abstract', [6, 'a', 3, 2], { type: 'output', format: 'output' }, (g) => {
    const side = g.int(2, 9);
    const wide = g.int(2, 9);
    const code = `abstract class Shape {\n  abstract int area();\n  void print() {\n    System.out.println("Area = " + area());\n  }\n}\nclass Square extends Shape {\n  int s = ${side};\n  int area() {\n    return s * s;\n  }\n}\nclass Rect extends Shape {\n  int w = ${wide};\n  int area() {\n    return w * ${side};\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    Shape[] all = { new Square(), new Rect() };\n    for (int i = 0; i < all.length; i++) {\n      all[i].print();\n    }\n  }\n}`;
    return outputOf(g, code, 'An abstract method is called through the parent type, and each object runs its own version.');
  }),
  custom('output-tostring', [6, 'a', 2, 2], { type: 'output', format: 'output' }, (g) => {
    const [base, kid, field] = g.pick([['Book', 'Novel', 'title'], ['Player', 'Captain', 'name'], ['City', 'Capital', 'name']]);
    const word = g.pick(['Alpha', 'Delta', 'Omega', 'Sigma']);
    const code = `class ${base} {\n  protected String ${field} = "${word}";\n  public String toString() {\n    return ${field};\n  }\n}\nclass ${kid} extends ${base} {\n  public String toString() {\n    return "${kid}: " + super.toString();\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    ${base} a = new ${base}();\n    ${base} b = new ${kid}();\n    System.out.println(a);\n    System.out.println(b);\n  }\n}`;
    return outputOf(g, code, 'println calls the object\'s own toString().');
  }),
  custom('find-error-abstract-new', [6, 'a', 2, 2], { type: 'error', format: 'error' }, (g) => {
    const n = g.int(2, 9);
    const broken = `abstract class Shape {\n  abstract int sides();\n}\nclass Triangle extends Shape {\n  int sides() {\n    return 3;\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    Shape s = new Shape();\n    System.out.println(s.sides() + ${n});\n  }\n}`;
    return findError(g, broken, broken.replace('new Shape()', 'new Triangle()'), ['Shape is abstract, so it can\'t be created with new.', 'Correct it by creating a subclass object: Shape s = new Triangle();']);
  }),
  custom('find-error-private-parent', [6, 'a', 2, 2], { type: 'error', format: 'error' }, (g) => {
    const n = g.int(2, 9);
    const broken = `class Account {\n  private int balance = ${n};\n}\nclass Savings extends Account {\n  void show() {\n    System.out.println(balance);\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    new Savings().show();\n  }\n}`;
    return findError(g, broken, broken.replace('private int', 'protected int'), ['balance is private in Account, so Savings can\'t use it directly.', 'Correct it by declaring balance protected, or adding a public method in Account that returns it.']);
  }),
  custom('find-error-no-super', [6, 'a', 2, 3], { type: 'error', format: 'error' }, (g) => {
    const n = g.int(2, 9);
    const broken = `class Base {\n  int x;\n  Base(int v) {\n    x = v;\n  }\n}\nclass Derived extends Base {\n  Derived() {\n    System.out.println("made");\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    new Derived();\n  }\n}`;
    return findError(g, broken, broken.replace('Derived() {\n    System', `Derived() {\n    super(${n});\n    System`), ['Base has no constructor without arguments, so the implicit super() in Derived fails.', `Correct it by calling super with a value as the constructor's first statement, such as super(${n});`]);
  }),
  custom('find-error-cast-needed', [6, 'a', 2, 2], { type: 'error', format: 'error' }, (g) => {
    const n = g.int(2, 9);
    const broken = `class Base {\n}\nclass Derived extends Base {\n  int twice() {\n    return ${n} * 2;\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    Base b = new Derived();\n    System.out.println(b.twice());\n  }\n}`;
    return findError(g, broken, broken.replace('b.twice()', '((Derived) b).twice()'), ['b is declared as Base, which has no method twice().', 'Correct it with a cast: ((Derived) b).twice().']);
  }),
  custom('complete-inherit', [6, 'a', 3, 2], { type: 'complete', format: 'short' }, (g) => {
    const n = g.int(2, 9);
    const code = (one: string, two: string, three: string) => `class Base {\n  int x;\n  Base(int v) {\n    x = v;\n  }\n  int get() {\n    return x;\n  }\n}\nclass Twice ${one} Base {\n  Twice(int v) {\n    ${two}(v);\n  }\n  int get() {\n    return ${three}.get() * 2;\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    Base b = new Twice(${n});\n    System.out.println(b.get());\n  }\n}`;
    return complete(g, code('?1?', '?2?', '?3?'), code('extends', 'super', 'super'), [['?1? is extends, as Twice inherits from Base.', 1], ['?2? is super, calling the parent\'s constructor.', 1], ['?3? is super, reaching the parent\'s version of get().', 1]], 'Twice inherits from Base, and doubles what its parent\'s get() returns.');
  }),
  custom('design-abstract', [6, 'a', 5, 3], { type: 'program', format: 'program' }, (g) => {
    const [parent, child, extra] = g.pick([['Worker', 'Salaried', 'monthly'], ['Ticket', 'Student', 'fare'], ['Plan', 'Monthly', 'rate']]);
    const model = `abstract class ${parent} {\n  protected String name;\n  ${parent}(String n) {\n    name = n;\n  }\n  abstract double amount();\n  void show() {\n    System.out.println(name + " " + amount());\n  }\n}\nclass ${child} extends ${parent} {\n  private double ${extra};\n  ${child}(String n, double v) {\n    super(n);\n    ${extra} = v;\n  }\n  double amount() {\n    return ${extra} * 2;\n  }\n}`;
    return designChecked(g, `An abstract class ${parent} has a protected data member name, a constructor, an abstract method double amount(), and a method show() that prints the name and the amount. Using inheritance, specify a class ${child} with a private data member ${extra} and a constructor, in which amount() returns twice ${extra}. Don't write main().`, model, `class Test {\n  public static void main(String[] args) {\n    ${parent} p = new ${child}("Asha", ${g.int(10, 90)});\n    p.show();\n  }\n}`, [
      [`Declares ${parent} abstract, with the abstract method and no body.`, 1],
      ['Writes its constructor and show(), which calls amount().', 1],
      [`Uses extends ${parent}, and declares ${extra}.`, 1],
      ['The constructor calls super(n) as its first statement.', 1],
      ['Defines amount().', 1],
    ]);
  }),
  custom('output-interface', [6, 'b', 3, 2], { type: 'output', format: 'output' }, (g) => {
    const [iface, a, b, wa, wb] = g.pick([['Speaker', 'Dog', 'Cat', 'Woof', 'Meow'], ['Payable', 'Cash', 'Card', 'paid in cash', 'paid by card'], ['Mover', 'Car', 'Boat', 'drives', 'sails']]);
    const code = `interface ${iface} {\n  String act();\n}\nclass ${a} implements ${iface} {\n  public String act() {\n    return "${wa}";\n  }\n}\nclass ${b} implements ${iface} {\n  public String act() {\n    return "${wb}";\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    ${iface}[] all = { new ${b}(), new ${a}() };\n    for (int i = 0; i < all.length; i++) {\n      System.out.println(all[i].act());\n    }\n  }\n}`;
    return outputOf(g, code, 'The interface type can hold any class that implements it, and each object runs its own method.');
  }),
  custom('output-two-interfaces', [6, 'b', 3, 3], { type: 'output', format: 'output' }, (g) => {
    const [x, y] = [g.int(2, 9), g.int(2, 9)];
    const code = `interface Readable {\n  int LIMIT = ${x * 10};\n  int read();\n}\ninterface Writable {\n  void write(int v);\n}\nclass Store implements Readable, Writable {\n  private int data = ${x};\n  public int read() {\n    return data;\n  }\n  public void write(int v) {\n    data = data + v;\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    Store s = new Store();\n    Writable w = s;\n    w.write(${y});\n    Readable r = s;\n    System.out.println(r.read());\n    System.out.println(Readable.LIMIT);\n  }\n}`;
    return outputOf(g, code, 'One object is held through two interface types. A field in an interface is a constant.');
  }),
  custom('find-error-interface-public', [6, 'b', 2, 2], { type: 'error', format: 'error' }, (g) => {
    const n = g.int(2, 9);
    const broken = `interface Counter {\n  int count();\n}\nclass Fixed implements Counter {\n  int count() {\n    return ${n};\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    Counter c = new Fixed();\n    System.out.println(c.count());\n  }\n}`;
    return findError(g, broken, broken.replace('  int count() {', '  public int count() {'), ['A method in an interface is public, so an implementation can\'t be less visible.', 'Correct it by declaring count() public in Fixed.']);
  }),
  custom('find-error-interface-missing', [6, 'b', 2, 2], { type: 'error', format: 'error' }, (g) => {
    const n = g.int(2, 9);
    const broken = `interface Pair {\n  int first();\n  int second();\n}\nclass Both implements Pair {\n  public int first() {\n    return ${n};\n  }\n}\nclass Test {\n  public static void main(String[] args) {\n    Pair p = new Both();\n    System.out.println(p.first());\n  }\n}`;
    return findError(g, broken, broken.replace(`return ${n};\n  }\n}`, `return ${n};\n  }\n  public int second() {\n    return 0;\n  }\n}`), ['Both doesn\'t define second(), so it isn\'t a complete implementation of Pair.', 'Correct it by defining public int second(), or by declaring Both abstract.']);
  }),
  custom('design-interface', [6, 'b', 5, 3], { type: 'program', format: 'program' }, (g) => {
    const [iface, method, c1, c2, f1, f2] = g.pick([['Taxable', 'tax', 'Book', 'Phone', 'price * 0.05', 'price * 0.18'], ['Rated', 'score', 'Exam', 'Quiz', 'price * 2', 'price * 3'], ['Billable', 'charge', 'Call', 'Text', 'price * 2', 'price + 1']]);
    const model = `interface ${iface} {\n  double ${method}();\n}\nclass ${c1} implements ${iface} {\n  double price;\n  ${c1}(double p) {\n    price = p;\n  }\n  public double ${method}() {\n    return ${f1};\n  }\n}\nclass ${c2} implements ${iface} {\n  double price;\n  ${c2}(double p) {\n    price = p;\n  }\n  public double ${method}() {\n    return ${f2};\n  }\n}`;
    return designChecked(g, `Write an interface ${iface} with a method double ${method}(). Then write classes ${c1} and ${c2}, each with a data member price and a constructor, that implement it. In ${c1}, ${method}() returns ${f1}, and in ${c2}, it returns ${f2}. Don't write main().`, model, `class Test {\n  public static void main(String[] args) {\n    ${iface}[] all = { new ${c1}(100), new ${c2}(100) };\n    System.out.println(all[0].${method}() + all[1].${method}());\n  }\n}`, [
      ['Declares the interface, with the method\'s heading only.', 1],
      [`Uses implements ${iface} in both classes.`, 1],
      ['Writes the data member and constructor in both.', 1],
      [`Defines ${method}() as public in ${c1}.`, 1],
      [`Defines ${method}() as public in ${c2}.`, 1],
    ]);
  }),
  ...rest(),
  ...derivationBlueprints('computerscience', 'XII', { custom } as never),
];

export default blueprints;
