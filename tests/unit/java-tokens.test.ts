import fs from 'node:fs';
import path from 'node:path';
import { highlightTree } from '@lezer/highlight';
import { parser } from '@lezer/java';
import { describe, expect, it } from 'vitest';
import { SAMPLES } from '../../src/java/samples';
import { tokenizeJava, tokenizeLines } from '../../src/java/tokens';
import { javaHighlighter } from '../../src/sims/java-highlight';

/** The class each character gets from the real Java grammar, as the editor colours it. */
function fromGrammar(code: string): string[] {
  const classes = new Array<string>(code.length).fill('');
  highlightTree(parser.parse(code), javaHighlighter, (from, to, cls) => {
    for (let i = from; i < to; i++) classes[i] = cls;
  });
  return classes;
}

function fromTokens(code: string): string[] {
  const classes: string[] = [];
  for (const token of tokenizeJava(code)) {
    for (let i = 0; i < token.text.length; i++) classes.push(token.kind === 'plain' ? '' : `tok-${token.kind}`);
  }
  return classes;
}

describe('the Java tokeniser', () => {
  const samples = [
    'class A { int x = 3; /* block\n comment */ }',
    'String s = "a\\"b" + \'c\'; // end\ndouble d = 1.5e-3 + .5f + 0xFF + 10L;',
    'boolean b = x >= 2 && !done || y != null;',
    'x <<= 2; y >>>= 1; z++; q += r % 3;',
    '"unterminated',
    '/* unterminated',
    '',
  ];

  it('joins back into exactly the same text', () => {
    for (const code of [...samples, ...SAMPLES.map((s) => s.code)]) {
      expect(tokenizeJava(code).map((t) => t.text).join('')).toBe(code);
      expect(tokenizeLines(code).map((line) => line.map((t) => t.text).join('')).join('\n')).toBe(code);
    }
  });

  it('classifies each kind', () => {
    const kinds = Object.fromEntries(tokenizeJava('public int x = 3; // note\nString s = "a"; boolean b = true;').map((t) => [t.text, t.kind]));
    expect(kinds).toMatchObject({ public: 'keyword', int: 'type', '3': 'number', '// note': 'comment', '"a"': 'string', '=': 'op', true: 'number', boolean: 'type' });
  });

  it('carries a block comment across the lines it spans', () => {
    const lines = tokenizeLines('/* one\n   two */ int x;');
    expect(lines[0]).toEqual([{ text: '/* one', kind: 'comment' }]);
    expect(lines[1][0]).toEqual({ text: '   two */', kind: 'comment' });
    expect(lines[1].find((t) => t.text === 'int')?.kind).toBe('type');
  });

  it('colours every sample program exactly as the editor does', () => {
    for (const sample of SAMPLES) {
      const grammar = fromGrammar(sample.code);
      const tokens = fromTokens(sample.code);
      // The grammar calls a variable named `to` a keyword, as it is one in a module declaration.
      const contextual = new Set([...sample.code.matchAll(/\b(?:to|with|open)\b/g)].flatMap((m) => [...m[0]].map((_, k) => m.index + k)));
      const differences: string[] = [];
      for (let i = 0; i < sample.code.length; i++) {
        const ch = sample.code[i];
        // In `List<Integer>` the angle brackets aren't operators, which a tokeniser can't tell.
        if (grammar[i] !== tokens[i] && !/\s/.test(ch) && !'<>'.includes(ch) && !contextual.has(i)) differences.push(`${i}: ${JSON.stringify(sample.code.slice(i, i + 12))} grammar=${grammar[i]} tokens=${tokens[i]}`);
      }
      expect(differences, sample.id).toEqual([]);
    }
  });
});

describe('syntax colours', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../../src/styles/tokens.css'), 'utf8');
  const themes = new Map<string, Record<string, string>>();
  for (const m of css.matchAll(/(:root[^{]*)\{([^}]*)\}/g)) {
    const vars: Record<string, string> = {};
    for (const v of m[2].matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) vars[v[1]] = v[2];
    if (Object.keys(vars).length) themes.set(m[1].trim().replace(/\s+/g, ' '), vars);
  }
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a: string, b: string) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  const resolve = (selector: string): Record<string, string> => {
    const light = [...themes.entries()].find(([k]) => k.includes("data-theme='paper'") && !k.includes('contrast'))![1];
    const dark = themes.get(":root[data-theme='board']")!;
    return { ...(selector.includes('board') ? dark : light), ...themes.get(selector) };
  };

  it('finds all four themes', () => {
    expect(themes.size).toBe(4);
  });

  it('reads at 4.5:1 on the page, the active line and the current line, in every theme', () => {
    // These match .tok-* in base.css. A comment on the current line uses --ink-2, set there too.
    const colours = ['accent', 'warn', 'good', 'ink', 'ink-2'];
    for (const selector of themes.keys()) {
      const theme = resolve(selector);
      for (const colour of colours) {
        for (const surface of ['paper', 'paper-2', 'mark']) {
          expect(contrast(theme[colour], theme[surface]), `${selector} ${colour} on ${surface}`).toBeGreaterThanOrEqual(4.5);
        }
      }
      for (const surface of ['paper', 'paper-2']) {
        expect(contrast(theme['ink-3'], theme[surface]), `${selector} comment on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('keeps out the colours the design system reserves', () => {
    const base = fs.readFileSync(path.resolve(__dirname, '../../src/styles/base.css'), 'utf8');
    const rules = [...base.matchAll(/\.tok-[a-z]+[^{]*\{[^}]*\}/g)].map((m) => m[0]);
    expect(rules.length).toBeGreaterThanOrEqual(5);
    for (const rule of rules) expect(rule).not.toMatch(/--(physics|chemistry|mathematics|computerscience|subject|focus)\b/);
  });
});
