import { memo } from 'react';
import { bodyExpr } from '../../data/expr';
import { tokenizeJava, tokenizePython } from '../../java/tokens';
import { JavaTokens } from '../JavaCode';
import { Math as MathTex } from '../Math';

/** A block of code, coloured as in the tracer. It wraps, because code cut off reads as wrong. */
export const CodeBlock = memo(function CodeBlock({ code, python }: { code: string; python?: boolean }) {
  return (
    <pre className="code-block">
      <code className="java-code">
        <JavaTokens tokens={(python ? tokenizePython : tokenizeJava)(code)} />
      </code>
    </pre>
  );
});

/** Words with `code` and $maths$, and blocks of code between ``` lines. */
export const RichText = memo(function RichText({ text, python, className }: { text: string; python?: boolean; className?: string }) {
  return (
    <div className={`rich-text ${className ?? ''}`}>
      {text.split(/```\n?/).map((part, i) => {
        if (i % 2) return <CodeBlock key={i} code={part.replace(/\n$/, '')} python={python} />;
        const words = part.trim();
        return words ? <MathTex key={i} latex={bodyExpr(words, python ? 'python' : 'java')} /> : null;
      })}
    </div>
  );
});
