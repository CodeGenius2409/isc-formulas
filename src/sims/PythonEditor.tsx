// The Python tracer's editor: the shared editor with Python's grammar. A new line after a colon is indented,
// else, elif and except move back to line up with their if or try as they're typed, and Backspace in the
// indent removes a whole level.
import { python } from '@codemirror/lang-python';
import { syntaxHighlighting } from '@codemirror/language';
import { EditorCore, type EditorProps } from './EditorCore';
import { pythonHighlighter, pythonTypeNames } from './python-highlight';

const LANGUAGE = [python(), syntaxHighlighting(pythonHighlighter), pythonTypeNames];
const SYMBOLS = [':', '(', ')', '[', ']', '"', '=', '#'];

export default function PythonEditor(props: EditorProps) {
  return <EditorCore {...props} language={LANGUAGE} symbols={SYMBOLS} hint="Tab indents and Shift+Tab takes an indent away. Esc then Tab leaves the editor. Ctrl+Enter traces." />;
}
