// The Java tracer's editor: the shared editor with Java's grammar and colours.
import { java } from '@codemirror/lang-java';
import { syntaxHighlighting } from '@codemirror/language';
import { EditorCore, type EditorProps } from './EditorCore';
import { javaHighlighter } from './java-highlight';

const LANGUAGE = [java(), syntaxHighlighting(javaHighlighter)];
const SYMBOLS = ['{', '}', '(', ')', ';', '"', '='];

export default function CodeEditor(props: EditorProps) {
  return <EditorCore {...props} language={LANGUAGE} symbols={SYMBOLS} hint="Tab indents. Esc then Tab leaves the editor. Ctrl+Enter traces." />;
}
