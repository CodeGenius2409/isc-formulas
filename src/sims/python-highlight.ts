// Gives the Python editor's syntax tree the same classes as tokenizePython in src/java/tokens.ts, so code
// looks the same while it's edited and while it's traced. tests/unit/python-tokens.test.ts holds the two
// to the same result on every sample.
import { syntaxTree } from '@codemirror/language';
import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, ViewPlugin, type DecorationSet, type EditorView, type ViewUpdate } from '@codemirror/view';
import { tagHighlighter, tags as t } from '@lezer/highlight';
import type { Tree } from '@lezer/common';

export const pythonHighlighter = tagHighlighter([
  { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword, t.operatorKeyword, t.modifier], class: 'tok-keyword' },
  { tag: [t.string, t.special(t.string), t.escape], class: 'tok-string' },
  { tag: [t.number, t.bool, t.null], class: 'tok-number' },
  { tag: t.lineComment, class: 'tok-comment' },
  { tag: [t.arithmeticOperator, t.bitwiseOperator, t.compareOperator, t.definitionOperator, t.updateOperator], class: 'tok-op' },
]);

/** The same names as PY_TYPES in src/java/tokens.ts, which tests/unit/python-tokens.test.ts checks. A copy, so
 *  the editor's chunk doesn't pull the tokeniser out of the first screen's code. */
export const TYPE_NAMES = new Set('int float str bool list tuple dict set'.split(' '));

/** Where the built-in type names are, such as int in int(input()). The grammar sees only a name there. */
export function typeNameRanges(tree: Tree, text: (from: number, to: number) => string, from = 0, to = tree.length): [number, number][] {
  const found: [number, number][] = [];
  tree.iterate({
    from,
    to,
    enter(node) {
      if (node.name === 'VariableName' && TYPE_NAMES.has(text(node.from, node.to))) found.push([node.from, node.to]);
    },
  });
  return found;
}

const typeMark = Decoration.mark({ class: 'tok-type' });

function typeMarks(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const tree = syntaxTree(view.state);
  for (const { from, to } of view.visibleRanges) {
    for (const [a, b] of typeNameRanges(tree, (x, y) => view.state.sliceDoc(x, y), from, to)) builder.add(a, b, typeMark);
  }
  return builder.finish();
}

export const pythonTypeNames = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = typeMarks(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || syntaxTree(update.startState) !== syntaxTree(update.state)) this.decorations = typeMarks(update.view);
    }
  },
  { decorations: (plugin) => plugin.decorations },
);
