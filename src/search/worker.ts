/// <reference lib="webworker" />
// Builds and queries the search index off the main thread, so typing never stutters.
import type MiniSearch from 'minisearch';
import { buildIndex, runSearch, type SearchDoc, type SearchFilters, type SearchHit } from './engine';

export type WorkerRequest = { type: 'index'; docs: SearchDoc[] } | { type: 'search'; id: number; query: string; filters: SearchFilters; limit: number };

export type WorkerResponse = { type: 'ready' } | { type: 'results'; id: number; hits: SearchHit[]; total: number };

let index: MiniSearch<SearchDoc> | null = null;

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;
  if (message.type === 'index') {
    index = buildIndex(message.docs);
    self.postMessage({ type: 'ready' } satisfies WorkerResponse);
    return;
  }
  const { hits, total } = index ? runSearch(index, message.query, message.filters, message.limit) : { hits: [], total: 0 };
  self.postMessage({ type: 'results', id: message.id, hits, total } satisfies WorkerResponse);
};
