// Every place that draws a formula takes one string. A Computer Science entry written as code travels
// in that same string, with this prefix, so rows, search, practice and saved mistakes all carry it.
export type BodyLang = 'java' | 'python';

const PREFIX = /^body:(java|python):/;

export function bodyExpr(body: string, lang: BodyLang): string {
  return `body:${lang}:${body}`;
}

export function parseBodyExpr(expr: string): { lang: BodyLang; text: string } | null {
  const match = PREFIX.exec(expr);
  return match ? { lang: match[1] as BodyLang, text: expr.slice(match[0].length) } : null;
}

export const isBodyExpr = (expr: string): boolean => PREFIX.test(expr);

/** What Copy puts on the clipboard: the LaTeX, or for code, the text with its markers taken off. */
export function copyableExpr(expr: string): string {
  const body = parseBodyExpr(expr);
  return body ? body.text.replace(/[`$]/g, '') : expr;
}
