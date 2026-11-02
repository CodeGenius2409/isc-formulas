import { useEffect, useRef } from 'react';
import { closeBrackets, closeBracketsKeymap, insertBracket } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentLess, indentMore, simplifySelection, temporarilySetTabFocusMode } from '@codemirror/commands';
import { java } from '@codemirror/lang-java';
import { bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { EditorView, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers, type Command } from '@codemirror/view';
import { javaHighlighter } from './java-highlight';

const INDENT = '    ';

/** Tab puts in four spaces at the cursor, and with lines selected it moves them all in. */
const pressTab: Command = (view) => {
  if (view.state.selection.ranges.some((range) => !range.empty)) return indentMore(view);
  view.dispatch(view.state.update(view.state.replaceSelection(INDENT), { scrollIntoView: true, userEvent: 'input.type' }));
  return true;
};

/** Tab has to stay indenting, so Esc then Tab is the way out for someone on a keyboard. */
const pressEscape: Command = (view) => simplifySelection(view) || temporarilySetTabFocusMode(view);

/** A phone's keyboard has no Tab and buries the brackets, so these sit just above it. */
const TOUCH_KEYS: { label: string; aria: string; press: (view: EditorView) => void }[] = [
  { label: 'Tab', aria: 'Indent', press: (view) => void pressTab(view) },
  { label: '⇤', aria: 'Remove one indent', press: (view) => void indentLess(view) },
  ...['{', '}', '(', ')', ';', '"', '='].map((text) => ({
    label: text,
    aria: `Type ${text}`,
    press: (view: EditorView) => {
      const bracket = insertBracket(view.state, text);
      view.dispatch(bracket ?? view.state.update(view.state.replaceSelection(text), { scrollIntoView: true, userEvent: 'input.type' }));
    },
  })),
];

interface Props {
  value: string;
  onChange: (code: string) => void;
  onRun: () => void;
  labelledBy: string;
}

export default function CodeEditor({ value, onChange, onRun, labelledBy }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const latest = useRef({ onChange, onRun });
  latest.current = { onChange, onRun };

  useEffect(() => {
    const editor = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          history(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          java(),
          syntaxHighlighting(javaHighlighter),
          indentUnit.of(INDENT),
          EditorState.tabSize.of(INDENT.length),
          keymap.of([
            {
              key: 'Mod-Enter',
              run: () => {
                latest.current.onRun();
                return true;
              },
            },
            { key: 'Tab', run: pressTab, shift: indentLess },
            { key: 'Escape', run: pressEscape },
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) latest.current.onChange(update.state.doc.toString());
          }),
          EditorView.contentAttributes.of({
            'aria-labelledby': labelledBy,
            autocapitalize: 'off',
            autocorrect: 'off',
            spellcheck: 'false',
          }),
        ],
      }),
    });
    view.current = editor;
    editor.focus();
    return () => {
      view.current = null;
      editor.destroy();
    };
    // The editor keeps its own state, so it is built once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const editor = view.current;
    if (editor && editor.state.doc.toString() !== value) {
      editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } });
    }
  }, [value]);

  return (
    <>
      <div ref={host} className="code-editor" />
      <div className="code-keys" role="group" aria-label="Keys for typing code">
        {TOUCH_KEYS.map((key) => (
          <button
            key={key.label}
            type="button"
            className="btn btn-line"
            aria-label={key.aria}
            // Keeps the editor focused, so the on-screen keyboard stays up.
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => {
              if (view.current) key.press(view.current);
            }}
          >
            {key.label}
          </button>
        ))}
      </div>
      <p className="tool-hint code-keys-hint">Tab indents. Esc then Tab leaves the editor. Ctrl+Enter traces.</p>
    </>
  );
}
