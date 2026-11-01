// Talks to the search worker. The index builds lazily, the first time find opens. If
// workers are unavailable, the same engine runs on the main thread.
import type MiniSearch from 'minisearch';
import { loadAllFormulas } from '../data/book';
import type { Formula } from '../data/types';
import { buildIndex, runSearch, toSearchDoc, type SearchDoc, type SearchFilters, type SearchHit } from './engine';
import type { WorkerRequest, WorkerResponse } from './worker';

export interface SearchResults {
  hits: { formula: Formula; terms: string[] }[];
  total: number;
}

let formulas: Map<string, Formula> | null = null;
let worker: Worker | null = null;
let fallbackIndex: MiniSearch<SearchDoc> | null = null;
let ready: Promise<void> | null = null;
let nextId = 1;
const pending = new Map<number, (r: { hits: SearchHit[]; total: number }) => void>();

/** Starts indexing. Safe to call repeatedly. */
export function prepareSearch(): Promise<void> {
  ready ??= (async () => {
    const all = await loadAllFormulas();
    formulas = new Map(all.map((f) => [f.id, f]));
    const docs = all.map(toSearchDoc);
    try {
      worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    } catch {
      worker = null;
    }
    if (!worker) {
      fallbackIndex = buildIndex(docs);
      return;
    }
    const active = worker;
    await new Promise<void>((resolve) => {
      active.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const message = event.data;
        if (message.type === 'ready') resolve();
        else {
          pending.get(message.id)?.({ hits: message.hits, total: message.total });
          pending.delete(message.id);
        }
      };
      active.onerror = () => {
        // A worker that fails to start must not leave search broken.
        worker = null;
        fallbackIndex = buildIndex(docs);
        resolve();
      };
      active.postMessage({ type: 'index', docs } satisfies WorkerRequest);
    });
  })();
  return ready;
}

export async function search(query: string, filters: SearchFilters = {}, limit = 40): Promise<SearchResults> {
  await prepareSearch();
  let result: { hits: SearchHit[]; total: number };
  if (worker) {
    const active = worker;
    result = await new Promise((resolve) => {
      const id = nextId++;
      pending.set(id, resolve);
      active.postMessage({ type: 'search', id, query, filters, limit } satisfies WorkerRequest);
    });
  } else {
    result = fallbackIndex ? runSearch(fallbackIndex, query, filters, limit) : { hits: [], total: 0 };
  }
  return {
    total: result.total,
    hits: result.hits.flatMap((h) => {
      const formula = formulas?.get(h.id);
      return formula ? [{ formula, terms: h.terms }] : [];
    }),
  };
}

export function getFormula(id: string): Formula | undefined {
  return formulas?.get(id);
}
