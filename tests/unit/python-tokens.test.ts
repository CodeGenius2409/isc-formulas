// The Python tracer colours code twice: the editor through Python's grammar, and the read-only pane through
// a small tokeniser. They must agree, or code would change colour on pressing Trace.
import { highlightTree } from '@lezer/highlight';
import { parser } from '@lezer/python';
import { describe, expect, it } from 'vitest';
import { PY_TYPES, tokenizePython } from '../../src/java/tokens';
import { tokenizeLines } from '../../src/sims/tracer-parts';
import { PY_SAMPLES } from '../../src/python/samples';
import { pythonHighlighter, TYPE_NAMES, typeNameRanges } from '../../src/sims/python-highlight';
import { PY_PROGRAMS } from './python-programs';

/** The class each character gets in the editor: the grammar's colours, then the type names on top. */
function fromEditor(code: string): string[] {
  const classes = new Array<string>(code.length).fill('');
  const tree = parser.parse(code);
  highlightTree(tree, pythonHighlighter, (from, to, cls) => {
    for (let i = from; i < to; i++) classes[i] = cls;
  });
  for (const [from, to] of typeNameRanges(tree, (a, b) => code.slice(a, b))) for (let i = from; i < to; i++) classes[i] = 'tok-type';
  return classes;
}

function fromTokens(code: string): string[] {
  const classes: string[] = [];
  for (const token of tokenizePython(code)) for (let i = 0; i < token.text.length; i++) classes.push(token.kind === 'plain' ? '' : `tok-${token.kind}`);
  return classes;
}

/** Brackets, dots and commas are plain in both, and spaces have no colour to compare. */
const visible = (code: string, classes: string[]) => classes.map((c, i) => (/\s/.test(code[i]) ? '' : c));

describe('the Python tokeniser and the editor', () => {
  it('know the same built-in type names', () => {
    expect([...TYPE_NAMES]).toEqual([...PY_TYPES]);
  });

  it('join back into the same text, line by line', () => {
    for (const { code } of [...PY_SAMPLES, ...PY_PROGRAMS]) {
      expect(tokenizeLines(code, tokenizePython).map((line) => line.map((t) => t.text).join('')).join('\n')).toBe(code);
    }
  });

  it('colour every sample program alike', () => {
    for (const sample of PY_SAMPLES) {
      const editor = visible(sample.code, fromEditor(sample.code));
      const tokens = visible(sample.code, fromTokens(sample.code));
      const differ = editor.flatMap((c, i) => (c === tokens[i] ? [] : [`${i} ${JSON.stringify(sample.code.slice(Math.max(0, i - 8), i + 8))}: editor ${c || 'plain'}, pane ${tokens[i] || 'plain'}`]));
      expect(differ.slice(0, 5), sample.title).toEqual([]);
    }
  });
});
