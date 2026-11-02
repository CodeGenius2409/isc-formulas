import { tagHighlighter, tags as t } from '@lezer/highlight';

/** Gives the editor's syntax tree the same classes as the tokeniser in src/java/tokens.ts. */
export const javaHighlighter = tagHighlighter([
  { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword, t.modifier, t.operatorKeyword, t.self], class: 'tok-keyword' },
  { tag: t.standard(t.typeName), class: 'tok-type' },
  { tag: [t.string, t.character], class: 'tok-string' },
  { tag: [t.integer, t.float, t.bool, t.null], class: 'tok-number' },
  { tag: [t.lineComment, t.blockComment], class: 'tok-comment' },
  { tag: [t.arithmeticOperator, t.logicOperator, t.bitwiseOperator, t.compareOperator, t.definitionOperator, t.updateOperator], class: 'tok-op' },
]);
