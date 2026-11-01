// Full-text search over every formula. Pure functions, so the same code runs in the
// worker and in tests.
import MiniSearch, { type Options, type SearchResult as MiniResult } from 'minisearch';
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
}

export interface SearchFilters {
  subject?: SubjectId | null;
  level?: ClassLevel | null;
}

export interface SearchHit {
  id: string;
  score: number;
  terms: string[];
}

const GREEK: Record<string, string> = { α: 'alpha', β: 'beta', γ: 'gamma', δ: 'delta', Δ: 'delta', ε: 'epsilon', θ: 'theta', κ: 'kappa', λ: 'lambda', μ: 'mu', ν: 'nu', π: 'pi', ρ: 'rho', σ: 'sigma', Σ: 'sigma', τ: 'tau', φ: 'phi', χ: 'chi', ψ: 'psi', ω: 'omega', Ω: 'omega' };

const GREEK_RE = new RegExp(`[${Object.keys(GREEK).join('')}]`, 'g');

/** Lets "λ" find \lambda, and "lambda" find λ in a note. */
function normaliseTerm(term: string): string {
  return term.toLowerCase().replace(GREEK_RE, (c) => ` ${GREEK[c]} `).trim();
}

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

export function toSearchDoc(f: Formula): SearchDoc {
  const placements = f.shared?.placements ?? [];
  return {
    id: f.id,
    name: f.name,
    aka: (f.aka ?? []).join(' '),
    topic: `${f.unit.replace(/^\d+\.\s*/, '')} ${f.subtopic}`,
    symbols: symbolWords(f.latex),
    latexText: latexWords(f.latex),
    note: f.note ?? '',
    subject: f.subject,
    classLevel: f.classLevel,
    alsoSubjects: [...new Set(placements.map((p) => p.subject))],
    alsoClasses: [...new Set(placements.map((p) => p.classLevel))],
  };
}

const OPTIONS: Options<SearchDoc> = {
  idField: 'id',
  fields: ['name', 'aka', 'topic', 'symbols', 'latexText', 'note'],
  storeFields: ['name', 'subject', 'classLevel', 'alsoSubjects', 'alsoClasses'],
  processTerm: (term) => normaliseTerm(term) || null,
  searchOptions: {
    boost: { name: 5, aka: 4, symbols: 1.5, topic: 1.5, latexText: 1, note: 1 },
    prefix: (term) => term.length > 1,
    fuzzy: (term) => (term.length > 3 ? 0.25 : false),
  },
};

export function buildIndex(docs: SearchDoc[]): MiniSearch<SearchDoc> {
  const index = new MiniSearch<SearchDoc>(OPTIONS);
  index.addAll(docs);
  return index;
}

function matchesFilters(hit: MiniResult, filters: SearchFilters): boolean {
  if (filters.subject && hit.subject !== filters.subject && !(hit.alsoSubjects as SubjectId[]).includes(filters.subject)) return false;
  if (filters.level && hit.classLevel !== filters.level && !(hit.alsoClasses as ClassLevel[]).includes(filters.level)) return false;
  return true;
}

/** Search with every word first. If that finds nothing, any word will do. */
export function runSearch(index: MiniSearch<SearchDoc>, query: string, filters: SearchFilters = {}, limit = 50): { hits: SearchHit[]; total: number } {
  const q = query.trim();
  if (!q) return { hits: [], total: 0 };
  const filter = (hit: MiniResult) => matchesFilters(hit, filters);
  let results = index.search(q, { combineWith: 'AND', filter });
  if (!results.length) results = index.search(q, { combineWith: 'OR', filter });

  const lower = q.toLowerCase();
  const ranked = results
    .map((r) => {
      const name = String(r.name).toLowerCase();
      // Names that really match the query go first, whatever the text scores say.
      const exact = name === lower ? 1000 : name.startsWith(lower) ? 200 : name.includes(lower) ? 60 : 0;
      // A name made up almost entirely of matched words beats a longer one that merely
      // contains them, even when the query was mistyped.
      const words = name.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
      const covered = words.filter((w) => r.terms.includes(normaliseTerm(w))).length;
      const coverage = words.length ? (covered / words.length) * 50 : 0;
      return { id: String(r.id), score: r.score + exact + coverage, terms: r.terms };
    })
    .sort((a, b) => b.score - a.score);
  return { hits: ranked.slice(0, limit), total: ranked.length };
}
