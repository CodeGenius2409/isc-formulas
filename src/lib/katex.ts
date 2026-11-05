// KaTeX loads on first use, and each rendered formula is cached so scrolling back
// through a long list never re-renders it.
import { useSyncExternalStore } from 'react';
import { retryImport } from './retry-import';

type Katex = typeof import('katex').default;

let katex: Katex | null = null;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

const CACHE_LIMIT = 4000;
const cache = new Map<string, string>();

export function ensureKatex(): Promise<void> {
  loading ??= retryImport(() => Promise.all([import('katex'), import('katex/dist/katex.min.css')])).then(([mod]) => {
    katex = mod.default;
    listeners.forEach((l) => l());
  });
  loading.catch(() => {
    loading = null;
  });
  return loading;
}

export function useKatexReady(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      void ensureKatex();
      return () => listeners.delete(l);
    },
    () => katex !== null,
  );
}

/** What is wrong with some LaTeX, in KaTeX's words, or null if it renders. */
export function latexProblem(latex: string): string | null {
  if (!katex) return null;
  try {
    katex.renderToString(latex, { throwOnError: true, strict: 'ignore' });
    return null;
  } catch (err) {
    return (err as Error).message.replace(/^KaTeX parse error: /, '').replace(/ at position \d+:.*$/s, '').trim();
  }
}

/** `\displaystyle` in inline mode gives full-size maths that can still wrap. */
export function renderLatex(latex: string): string {
  if (!katex) return '';
  const hit = cache.get(latex);
  if (hit !== undefined) return hit;
  let html: string;
  try {
    html = katex.renderToString(`\\displaystyle ${latex}`, { throwOnError: false, strict: 'ignore', output: 'htmlAndMathml' });
  } catch {
    html = `<code>${latex.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string)}</code>`;
  }
  if (cache.size >= CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(latex, html);
  return html;
}
