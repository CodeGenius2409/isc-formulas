import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain JS helper, shared with the data step
import { bodySegments, lintEntry, lintTex, lintWords } from '../../scripts/cs/lint.mjs';
import { copyableExpr, isBodyExpr, parseBodyExpr } from '../../src/data/expr';
import { loadUnits } from '../../src/data/book';
import type { Chunk, Formula, FormulaEntry, SharedEntry } from '../../src/data/types';
import { SAMPLES } from '../../src/java/samples';
import { tokenizePython } from '../../src/java/tokens';
import { runProgram } from '../../src/java/trace';
import { conceptQuestion, seededRng } from '../../src/practice/questions';
import { toSearchDoc } from '../../src/search/doc';

const gen = path.resolve(__dirname, '../../src/data/generated');
const read = <T,>(file: string): T => JSON.parse(fs.readFileSync(path.join(gen, file), 'utf8')) as T;
const shared = read<Record<string, SharedEntry>>('shared.json');

interface Row {
  entry: FormulaEntry;
  unitKey: string;
}
const rows: Row[] = [];
for (const level of ['XI', 'XII'] as const) {
  const chunk = read<Chunk>(`computerscience-${level}.json`);
  for (const unit of chunk.units) {
    for (const sub of unit.subtopics) {
      for (const item of sub.items) {
        const entry = 'ref' in item ? shared[item.ref] : item;
        rows.push({ entry, unitKey: `${level} ${unit.number}` });
      }
    }
  }
}
const byId = new Map(rows.map((r) => [r.entry.id, r.entry]));

/** The pieces of code in an entry, in order. */
function codeOf(id: string): string[] {
  const body = byId.get(id)?.body;
  if (!body) throw new Error(`${id} has no body`);
  return bodySegments(body).flatMap((line: { kind: string; text: string }[]) => line.filter((s) => s.kind === 'code').map((s) => s.text));
}

/** Runs Java through the tracer's interpreter, which is tested against the JDK. */
function java(body: string, extras = ''): string {
  const result = runProgram(`class Node { Node left, right; }\nclass T {\n${extras}\npublic static void main(String[] args) {\n${body}\n}\n}`, '');
  if (result.error) throw new Error(`${result.error.message}\n${body}`);
  return result.output.trim();
}

describe('the rule for Computer Science', () => {
  it('lets no maths-only markup through in any entry', () => {
    const problems = rows.flatMap(({ entry, unitKey }) => lintEntry(entry, unitKey).map((p: string) => `${entry.id}: ${p}`));
    expect(problems).toEqual([]);
  });

  it('typesets every piece of notation it keeps', () => {
    for (const { entry } of rows) {
      const pieces = entry.body ? bodySegments(entry.body).flat().filter((s: { kind: string }) => s.kind === 'tex').map((s: { text: string }) => s.text) : [entry.latex];
      for (const tex of pieces) expect(() => katex.renderToString(tex, { throwOnError: true, strict: 'ignore' }), `${entry.id}: ${tex}`).not.toThrow();
    }
  });

  it('catches what it should', () => {
    expect(lintTex('\\frac{a}{b}', 'XII 1').length).toBeGreaterThan(0);
    expect(lintTex('\\sqrt{x}', 'XII 9').length).toBeGreaterThan(0);
    expect(lintTex('x^{2}', 'XII 1').length).toBeGreaterThan(0);
    expect(lintTex('A+B', 'XI 7').length).toBeGreaterThan(0);
    expect(lintWords('a^2 + b^2').length).toBeGreaterThan(0);
    expect(lintEntry({ id: 'x', name: 'x', latex: '', body: 'x = 3' }, 'XI 7').length).toBeGreaterThan(0);
    expect(lintEntry({ id: 'x', name: 'x', latex: '', body: '`a``b`' }, 'XI 7').length).toBeGreaterThan(0);
  });

  it('allows what the syllabus uses itself', () => {
    for (const tex of ['\\overline{A+B}=\\bar{A}\\cdot\\bar{B}', 'F=\\sum m(1,3,5)', 'A\\oplus B', '2^{n}\\text{ rows}']) expect(lintTex(tex, 'XII 1')).toEqual([]);
    for (const tex of ['O(n^{2})', 'O(\\log n)', 'O(\\sqrt{n})', 'O(2^{n})', 'T(n)=2T(n-1)+1\\Rightarrow O(2^{n})']) expect(lintTex(tex, 'XII 9')).toEqual([]);
    expect(lintWords('time O(2^n)')).toEqual([]);
  });

  it('writes the units outside Boolean and complexity notation entirely as code and words', () => {
    for (const { entry, unitKey } of rows) {
      if (!/^(?:XI 3|XII 1|XII 2|XII 9)\b/.test(unitKey)) expect(entry.body, entry.id).toBeTruthy();
    }
  });

  it('leaves no LaTeX behind on an entry that is only Computer Science', () => {
    for (const { entry } of rows) {
      if (entry.body && !('subjects' in entry)) expect(entry.latex, entry.id).toBe('');
    }
  });

  it('shows Java beside Boolean notation where it helps', () => {
    expect(byId.get('cs-xi-1-13')?.body).toContain('!(a || b) == (!a && !b)');
    expect(byId.get('cs-xi-1-13')?.body).toContain('\\overline{A+B}');
    expect(byId.get('cs-xii-1-1')?.body).toContain('y = a && b;');
  });

  it('warns about integer division and casts on the entries that turn on them', () => {
    const warned = (id: string) => byId.get(id)?.note ?? '';
    for (const id of ['cs-xi-7-24', 'cs-xi-8-65', 'cs-xi-8-67', 'cs-xi-10-10', 'cs-xi-8-80', 'cs-xi-7-49', 'cs-xi-9-24']) {
      expect(warned(id), id).toMatch(/integer division|with ints|with an int|cast|100\.0|1\.0/i);
    }
  });

  it('keeps tracer samples free of maths notation in their comments and titles', () => {
    for (const sample of SAMPLES) {
      const comments = sample.code.match(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g) ?? [];
      for (const text of [sample.title, ...comments]) expect(lintWords(text), `${sample.id}: ${text}`).toEqual([]);
    }
  });
});

describe('the Mathematics pages of a shared entry', () => {
  it('keep their LaTeX while Computer Science shows code', async () => {
    const entry = shared['m-xi-2-15b'];
    expect(entry.latex).toContain('\\frac');
    expect(entry.body).toBe('`n * (n + 1) / 2`');

    const find = async (subject: 'mathematics' | 'computerscience') => {
      const units = await loadUnits(subject, 'XI');
      return units.flatMap((u) => u.subtopics.flatMap((s) => s.formulas)).find((f) => f.id === 'm-xi-2-15b')!;
    };
    expect((await find('mathematics')).latex).toContain('\\frac');
    expect(parseBodyExpr((await find('computerscience')).latex)?.text).toBe('`n * (n + 1) / 2`');
  });
});

describe('every path that shows a formula', () => {
  async function allCs(): Promise<Formula[]> {
    const lists = await Promise.all((['XI', 'XII'] as const).map((level) => loadUnits('computerscience', level)));
    return lists.flat().flatMap((u) => u.subtopics.flatMap((s) => s.formulas));
  }

  it('carries code as code, and Python units as Python', async () => {
    const formulas = await allCs();
    expect(formulas.length).toBe(rows.length);
    expect(parseBodyExpr(formulas.find((f) => f.id === 'cs-xi-7-26')!.latex)?.lang).toBe('java');
    const python = formulas.find((f) => f.id === 'cs-xi-12-25')!;
    expect(parseBodyExpr(python.latex)?.lang).toBe('python');
    expect(tokenizePython('a // b').map((t) => t.kind)).not.toContain('comment');
    expect(tokenizePython('# note\nx = None').map((t) => t.kind)).toContain('comment');
  });

  it('never asks practice questions in maths markup', async () => {
    const formulas = await allCs();
    const rng = seededRng(7);
    let fromCode = 0;
    for (let i = 0; i < 1500; i++) {
      const formula = formulas[Math.floor(rng() * formulas.length)];
      const question = conceptQuestion(formula, formulas, rng);
      const shown = question.kind === 'mcq' ? [question.promptLatex ?? '', ...question.options.map((o) => o.latex ?? '')] : question.kind === 'recall' ? [question.latex] : [];
      for (const expr of shown.filter(Boolean)) {
        const body = parseBodyExpr(expr);
        if (body) {
          fromCode++;
          expect(body.text).not.toMatch(/\\[dt]?frac/);
        } else {
          expect(expr, `${formula.id} in ${formula.unit}`).not.toMatch(/\\[dt]?frac|\\texttt|\\begin\{cases\}/);
        }
      }
      // Code has no left and right side to split, so the question never cuts it in two.
      if (question.kind === 'mcq' && question.promptLatex && isBodyExpr(formula.latex)) expect(question.promptLatex).not.toMatch(/=\\ \?$/);
    }
    expect(fromCode).toBeGreaterThan(500);
  });

  it('finds code by what it says', async () => {
    const formulas = await allCs();
    const doc = toSearchDoc(formulas.find((f) => f.id === 'cs-xi-7-26')!);
    expect(doc.latexText).toContain('Math');
    expect(doc.latexText).toContain('pow');
    expect(doc.latexText).not.toContain('body');
  });

  it('copies code without its markers', () => {
    expect(copyableExpr('body:java:`x = 1;`\nthen `y`')).toBe('x = 1;\nthen y');
    expect(copyableExpr('\\frac{a}{b}')).toBe('\\frac{a}{b}');
  });
});

describe('the Java itself', () => {
  it('gives the right answer for each expression', () => {
    const value = (declare: string, expr: string) => java(`${declare}\nSystem.out.println(${expr});`);
    const one = (id: string, i = 0) => codeOf(id)[i].replace(/;$/, '');
    expect(value('int a = 7, b = 2;', one('cs-xi-7-49'))).toBe('4');
    expect(value('int a = 0, b = 10, s = 3;', codeOf('cs-xi-8-15')[1])).toBe('4');
    expect(value('int a = 0, b = 9, s = 3;', codeOf('cs-xi-8-15')[1])).toBe('3');
    expect(value('int a = 0, b = 9, s = 3;', codeOf('cs-xi-8-15')[3])).toBe('4');
    expect(value('int n = 38;', one('cs-xi-8-47'))).toBe('2');
    expect(value("char c = 'y'; int k = 3;", codeOf('cs-xi-10-91')[0])).toBe('b');
    expect(value("char c = 'b'; int k = 3;", codeOf('cs-xi-10-91')[1])).toBe('y');
    expect(value('int n = 76, k = 2;', one('cs-xi-8-40'))).toBe('true');
    expect(value('int n = 77, k = 2;', one('cs-xi-8-40'))).toBe('false');
    expect(value('int N = 100;', one('cs-xi-1-37').replace('n = ', ''))).toBe('7');
    expect(value('int N = 100;', one('cs-xi-1-38').replace('bits = ', ''))).toBe('7');
    expect(value('int n = 999;', one('cs-xi-8-31'))).toBe('3');
    expect(value('int x = 5, n = 2;', codeOf('cs-xi-7-53')[1])).toBe('20');
    expect(value('int x = -8, n = 1;', codeOf('cs-xi-7-54')[1])).toBe('-4');
    expect(value('int n = 7;', one('cs-xii-2-16'))).toBe('2');
    expect(value('int h = 2;', one('cs-xii-2-15'))).toBe('7');
    expect(value('int h = 2;', codeOf('cs-xii-2-20')[0])).toBe('7');
    expect(value('int n = 8;', one('cs-xii-2-21'))).toBe('3');
    expect(value('int y = 2024;', one('cs-xi-8-62'))).toBe('true');
    expect(value('int y = 1900;', one('cs-xi-8-62'))).toBe('false');
    expect(value('int a = 17, b = 5;', one('cs-xi-7-8'))).toBe('true');
    expect(value('int low = 3, high = 9;', one('cs-xi-10-26').replace('mid = ', ''))).toBe('6');
    expect(value('int n = 10;', one('m-xi-2-15b'))).toBe('55');
    expect(value('int n = 3;', one('m-xi-2-15c'))).toBe('14');
    expect(java(`double c = 100;\ndouble ${one('cs-xi-7-24')};\nSystem.out.println(f);`)).toBe('212.0');
    expect(java(`int p = 1000, r = 5, t = 2;\ndouble si, a;\n${codeOf('cs-xi-8-65').join('\n')}\nSystem.out.println(si);`)).toBe('100.0');
    expect(java(`int obtained = 45, total = 50, sum = 7, n = 2;\ndouble percent, average;\n${codeOf('cs-xi-8-67').join('\n')}\nSystem.out.println(percent);\nSystem.out.println(average);`)).toBe('90.0\n3.5');
  });

  it('gives the answer its note warns about, when written the wrong way', () => {
    expect(java('System.out.println(9 / 5 * 100 + 32);')).toBe('132');
    expect(java('int n = 7, sum = 7;\nSystem.out.println(sum / 2);')).toBe('3');
    expect(java('System.out.println((int) Math.random() * 50);')).toBe('0');
  });

  it('converts between bases by the methods given', () => {
    const toDecimal = java(`int value = 0;\nint[] bits = {1, 0, 1, 1};\nfor (int bit : bits) {\n${codeOf('cs-xi-1-1')[0]}\n}\nSystem.out.println(value);`);
    expect(toDecimal).toBe('11');
    const toBinary = java(`int n = 11;\nString bin = "";\nwhile (n > 0) {\n${codeOf('cs-xi-8-63')[0]}\n${codeOf('cs-xi-8-63')[1]}\n}\nSystem.out.println(bin);`);
    expect(toBinary).toBe('1011');
    const fraction = java(`double f = 0.625;\nint r = 2;\nint d;\nString out = "";\nwhile (f > 0) {\n${codeOf('cs-xi-1-25').slice(0, 3).join('\n')}\nout = out + d;\n}\nSystem.out.println(out);`);
    expect(fraction).toBe('101');
  });

  it('sums each series to the value it should reach', () => {
    const series = (id: string, setup: string, extra = '') => Number(java(`${setup}\nfor (int k = 1; k <= 25; k++) {\n${codeOf(id).filter((c) => /[=;]$|;$/.test(c)).slice(0, 2).join('\n')}\n}\nSystem.out.println(${extra});`));
    expect(series('cs-xi-8-74', 'double t = 1.0, e = 0;', 'e')).toBeCloseTo(Math.E, 6);
    expect(series('cs-xi-8-75', 'double x = 2, t = 1.0, sum = 1.0;', 'sum')).toBeCloseTo(Math.exp(2), 6);
    expect(series('cs-xi-8-76', 'double x = 1, t = x, sum = x;', 'sum')).toBeCloseTo(Math.sin(1), 6);
    expect(series('cs-xi-8-77', 'double x = 1, t = 1.0, sum = 1.0;', 'sum')).toBeCloseTo(Math.cos(1), 6);
  });

  it('finds a square root, a root of a quadratic and a solved pair the way each entry says', () => {
    expect(Number(java(`double n = 2, x = 1;\nfor (int i = 0; i < 10; i++) {\n${codeOf('cs-xi-9-26')[0]}\n}\nSystem.out.println(x);`))).toBeCloseTo(Math.SQRT2, 8);
    expect(java(`double a = 1, b = -5, c = 6;\n${codeOf('cs-xi-9-22')[0]}\nSystem.out.println(${codeOf('cs-xi-9-23')[0]});\nSystem.out.println(${codeOf('cs-xi-9-23')[1]});`)).toBe('3.0\n2.0');
    expect(java(`double a1 = 1, b1 = 1, c1 = 3, a2 = 1, b2 = -1, c2 = 1, x, y;\n${codeOf('cs-xi-9-28').join('\n')}\nSystem.out.println(x + " " + y);`)).toBe('2.0 1.0');
  });

  it('runs each recursive method as written', () => {
    const run = (id: string, call: string, extras = '') => {
      const code = codeOf(id);
      const method = code.filter((c) => /[{}]|^\s/.test(c)).join('\n');
      return java(`System.out.println(${call});`, `${extras}\nstatic ${method}`);
    };
    expect(run('cs-xii-5-7', 'f(5)')).toBe('120');
    expect(run('cs-xii-5-8', 'f(10)')).toBe('55');
    expect(run('cs-xii-5-9', 'gcd(48, 18)')).toBe('6');
    expect(run('cs-xii-5-10', 'pow(2, 10)')).toBe('1024.0');
    expect(run('cs-xii-5-11', 'pow(2, 10)')).toBe('1024.0');
    expect(run('cs-xii-5-11', 'pow(3, 5)')).toBe('243.0');
    expect(run('cs-xii-5-12', 'sd(472)')).toBe('13');
    expect(run('cs-xii-5-13', 'cnt(472)')).toBe('3');
    expect(run('cs-xii-5-14', 'rev(472, 0)')).toBe('274');
    expect(run('cs-xii-5-15', 's(10)')).toBe('55');
    expect(run('cs-xii-5-16', 'c(5, 2)')).toBe('10');
    expect(run('cs-xii-5-17', 'isPrime(97, 2)')).toBe('true');
    expect(run('cs-xii-5-17', 'isPrime(91, 2)')).toBe('false');
    expect(run('cs-xii-5-18', 'conv(10, 2)', 'static int digit(int d) { return d; }')).toBe('1010');
    expect(run('cs-xii-5-19', 'bs(new int[] {1, 3, 5, 7}, 5, 0, 3)')).toBe('2');
    expect(run('cs-xii-5-19', 'bs(new int[] {1, 3, 5, 7}, 4, 0, 3)')).toBe('-1');
    expect(run('cs-xii-5-20', 'rev("abc")')).toBe('cba');
    expect(run('cs-xii-5-21', 'pal("level")')).toBe('true');
    expect(run('cs-xii-5-21', 'pal("levels")')).toBe('false');
    expect(run('cs-xii-5-22', 'sum(new int[] {1, 2, 3}, 3)')).toBe('6');
    expect(run('cs-xii-5-24', 'moves(4)')).toBe('15');
    expect(run('cs-xii-2-10', 'h(new Node())')).toBe('0');
    expect(run('cs-xii-2-11', 'size(new Node())')).toBe('1');
  });
});
