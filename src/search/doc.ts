// What the index holds for each formula. Kept apart from engine.ts so the main thread
// can prepare documents without loading MiniSearch, which only the worker needs.
import { parseBodyExpr } from '../data/expr';
import type { ClassLevel, Formula, SubjectId } from '../data/types';

export interface SearchDoc {
  id: string;
  name: string;
  aka: string;
  topic: string;
  symbols: string;
  latexText: string;
  note: string;
  subject: SubjectId;
  classLevel: ClassLevel;
  /** Other subjects and classes this entry appears in, so filters still find it. */
  alsoSubjects: SubjectId[];
  alsoClasses: ClassLevel[];
  /** Yours, not printed in the book. */
  custom: boolean;
}

export interface SearchFilters {
  subject?: SubjectId | null;
  level?: ClassLevel | null;
  /** Only your own formulas. */
  custom?: boolean;
}

export interface SearchHit {
  id: string;
  score: number;
  terms: string[];
}

export const GREEK: Record<string, string> = { α: 'alpha', β: 'beta', γ: 'gamma', δ: 'delta', Δ: 'delta', ε: 'epsilon', θ: 'theta', κ: 'kappa', λ: 'lambda', μ: 'mu', ν: 'nu', π: 'pi', ρ: 'rho', σ: 'sigma', Σ: 'sigma', τ: 'tau', φ: 'phi', χ: 'chi', ψ: 'psi', ω: 'omega', Ω: 'omega' };


/** Plain words from LaTeX, keeping macro names: \frac{v}{t} becomes "frac v t". */
function latexWords(latex: string): string {
  return latex
    .replace(/\\(?:left|right|quad|qquad|text|mathrm|operatorname|,|;|!|\s)/g, ' ')
    .replace(/[\\{}^_&()[\]=+\-*/|,.:;<>!'"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The symbols a formula uses: single letters and Greek names. */
function symbolWords(latex: string): string {
  const stripped = latex.replace(/\\text\{[^}]*\}/g, ' ').replace(/\\mathrm\{[^}]*\}/g, ' ');
  const out = new Set<string>();
  for (const match of stripped.matchAll(/\\([A-Za-z]+)|([A-Za-z])/g)) {
    if (match[2]) out.add(match[2]);
    else if (Object.values(GREEK).includes(match[1].toLowerCase()) || match[1] === 'varepsilon') out.add(match[1].replace('var', ''));
  }
  return [...out].join(' ');
}

/** A variable in code is a whole word, so its letters aren't all symbols. */
function codeSymbols(body: string): string {
  return [...new Set(body.match(/\b[A-Za-z]\b/g) ?? [])].join(' ');
}

export function toSearchDoc(f: Formula): SearchDoc {
  const placements = f.shared?.placements ?? [];
  const body = parseBodyExpr(f.latex);
  return {
    id: f.id,
    name: f.name,
    aka: (f.aka ?? []).join(' '),
    topic: `${f.unit.replace(/^\d+\.\s*/, '')} ${f.subtopic}`,
    symbols: [body ? codeSymbols(body.text) : symbolWords(f.latex), ...(f.variables ?? []).map((v) => v.symbol)].join(' '),
    latexText: latexWords(body ? body.text.replace(/[`$]/g, ' ') : f.latex),
    note: [f.note ?? '', ...(f.variables ?? []).map((v) => v.meaning)].join(' ').trim(),
    subject: f.subject,
    classLevel: f.classLevel,
    alsoSubjects: [...new Set(placements.map((p) => p.subject))],
    alsoClasses: [...new Set(placements.map((p) => p.classLevel))],
    custom: Boolean(f.custom),
  };
}
