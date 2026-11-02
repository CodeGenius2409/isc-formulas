import { memo } from 'react';
import { parseBodyExpr, type BodyLang } from '../data/expr';
import { tokenizeJava, tokenizePython } from '../java/tokens';
import { renderLatex, useKatexReady } from '../lib/katex';
import { JavaTokens } from './JavaCode';

interface Props {
  latex: string;
  className?: string;
}

/** Renders LaTeX. Until KaTeX has loaded, shows the source so the row isn't blank. */
export const Math = memo(function Math({ latex, className }: Props) {
  const ready = useKatexReady();
  const body = parseBodyExpr(latex);
  if (body) return <BodyExpr lang={body.lang} text={body.text} ready={ready} className={className} />;
  if (!ready) return <span className={`math-pending ${className ?? ''}`}>{latex}</span>;
  return <span className={className} dangerouslySetInnerHTML={{ __html: renderLatex(latex) }} />;
});

/** A Computer Science entry: words, `code`, and $notation$ the syllabus uses itself. */
function BodyExpr({ lang, text, ready, className }: { lang: BodyLang; text: string; ready: boolean; className?: string }) {
  const tokenize = lang === 'python' ? tokenizePython : tokenizeJava;
  return (
    <span className={`body-expr ${className ?? ''}`}>
      {text.split('\n').map((line, i) => (
        <span key={i} className="body-line">
          {line
            .split(/(`[^`]*`|\$[^$]*\$)/)
            .filter(Boolean)
            .map((part, j) => {
              if (part.startsWith('`')) {
                return (
                  <code key={j} className="java-code">
                    <JavaTokens tokens={tokenize(part.slice(1, -1))} />
                  </code>
                );
              }
              if (part.startsWith('$')) {
                const tex = part.slice(1, -1);
                return ready ? <span key={j} dangerouslySetInnerHTML={{ __html: renderLatex(tex) }} /> : <span key={j} className="math-pending">{tex}</span>;
              }
              return part;
            })}
        </span>
      ))}
    </span>
  );
}
