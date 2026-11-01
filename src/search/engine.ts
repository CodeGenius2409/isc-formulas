// Full-text search over every formula. Pure functions, so the same code runs in the
// worker and in tests.
import MiniSearch, { type Options, type SearchResult as MiniResult } from 'minisearch';
import type { ClassLevel, SubjectId } from '../data/types';
import { GREEK, type SearchDoc, type SearchFilters, type SearchHit } from './doc';

export { toSearchDoc } from './doc';
export type { SearchDoc, SearchFilters, SearchHit } from './doc';

const GREEK_RE = new RegExp(`[${Object.keys(GREEK).join('')}]`, 'g');

/** Lets "λ" find \lambda, and "lambda" find λ in a note. */
function normaliseTerm(term: string): string {
  return term.toLowerCase().replace(GREEK_RE, (c) => ` ${GREEK[c]} `).trim();
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
