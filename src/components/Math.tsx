import { memo } from 'react';
import { renderLatex, useKatexReady } from '../lib/katex';

interface Props {
  latex: string;
  className?: string;
}

/** Renders LaTeX. Until KaTeX has loaded, shows the source so the row isn't blank. */
export const Math = memo(function Math({ latex, className }: Props) {
  const ready = useKatexReady();
  if (!ready) return <span className={`math-pending ${className ?? ''}`}>{latex}</span>;
  return <span className={className} dangerouslySetInnerHTML={{ __html: renderLatex(latex) }} />;
});
