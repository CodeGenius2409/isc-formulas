import fs from 'node:fs';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import type MiniSearch from 'minisearch';
import { resolveChunk } from '../../src/data/resolve';
import type { Chunk, Formula, Manifest, SharedEntry } from '../../src/data/types';
import { buildIndex, runSearch, toSearchDoc, type SearchDoc } from '../../src/search/engine';
import { matchQuantities, parseQuantityQuery } from '../../src/search/quantity';
import { allEntries } from '../../src/solver/registry';

const genDir = path.resolve(__dirname, '../../src/data/generated');
const read = <T,>(f: string) => JSON.parse(fs.readFileSync(path.join(genDir, f), 'utf8')) as T;

let index: MiniSearch<SearchDoc>;
let docCount = 0;
let buildMs = 0;

beforeAll(() => {
  const manifest = read<Manifest>('manifest.json');
  const shared = read<Record<string, SharedEntry>>('shared.json');
  const seen = new Set<string>();
  const formulas: Formula[] = [];
  for (const s of manifest.subjects) {
    for (const c of s.classes) {
      for (const u of resolveChunk(read<Chunk>(c.chunk), shared)) {
        for (const st of u.subtopics) {
          for (const f of st.formulas) {
            if (!seen.has(f.id)) {
              seen.add(f.id);
              formulas.push(f);
            }
          }
        }
      }
    }
  }
  docCount = formulas.length;
  const start = performance.now();
  index = buildIndex(formulas.map(toSearchDoc));
  buildMs = performance.now() - start;
});

const topIds = (q: string, n = 5, filters = {}) => runSearch(index, q, filters, n).hits.map((h) => h.id);

describe('text search', () => {
  it('indexes every formula once', () => {
    expect(docCount).toBe(read<Manifest>('manifest.json').totals.entries);
  });

  it('finds by name', () => {
    expect(topIds('Ohm’s law')).toContain('p-xii-2-1');
    expect(topIds('escape velocity')[0]).toBe('p-xi-6-4');
    expect(topIds('Nernst equation')[0]).toBe('c-xii-3-1');
  });

  it('tolerates typos', () => {
    expect(topIds('projectle')).not.toEqual([]);
    expect(topIds('Nernts equation')).toContain('c-xii-3-1');
    expect(topIds('escpae velocity')).toContain('p-xi-6-4');
  });

  it('finds by topic, symbols, LaTeX and note text', () => {
    expect(topIds('Kinematics projectile', 30).length).toBeGreaterThan(0);
    expect(topIds('λ', 50).length).toBeGreaterThan(0);
    expect(topIds('lambda', 50).length).toBeGreaterThan(0);
    expect(topIds('frac sqrt', 5).length).toBeGreaterThan(0);
    expect(topIds('semi-major axis', 10).length).toBeGreaterThan(0);
  });

  it('finds an entry by a name merged into it', () => {
    expect(topIds('Gravitational constant', 8)).toContain('p-xi-1-176');
  });

  it('filters by subject and class', () => {
    const physics = runSearch(index, 'energy', { subject: 'physics' }, 50).hits;
    expect(physics.length).toBeGreaterThan(0);
    expect(physics.every((h) => h.id.startsWith('p-') || h.id.startsWith('c-') || h.id.startsWith('m-'))).toBe(true);
    const xii = topIds('energy', 20, { level: 'XII' });
    expect(xii.length).toBeGreaterThan(0);
  });

  it('keeps a shared entry findable under each subject it belongs to', () => {
    expect(topIds("Planck's constant", 5, { subject: 'chemistry' })).toContain('p-xi-1-179');
    expect(topIds("Planck's constant", 5, { subject: 'physics' })).toContain('p-xi-1-179');
  });

  it('returns nothing for an empty query', () => {
    expect(runSearch(index, '   ').hits).toEqual([]);
  });

  it('stays fast with every formula indexed', () => {
    const start = performance.now();
    for (const q of ['energy', 'velocity', 'integral', 'projectile', 'mole', 'array']) runSearch(index, q, {}, 40);
    const each = (performance.now() - start) / 6;
    console.log(`Index of ${docCount} built in ${buildMs.toFixed(0)} ms, search averages ${each.toFixed(1)} ms`);
    expect(buildMs).toBeLessThan(5000);
    expect(each).toBeLessThan(100);
  });
});

describe('quantity query parsing', () => {
  const cases: [string, string[], string[]][] = [
    ['I have v, u, t want s', ['v', 'u', 't'], ['s']],
    ['have v u t want s', ['v', 'u', 't'], ['s']],
    ['given v u t find s', ['v', 'u', 't'], ['s']],
    ['find s from v u t', ['v', 'u', 't'], ['s']],
    ['find s given v, u and t', ['v', 'u', 't'], ['s']],
    ['want s have v u t', ['v', 'u', 't'], ['s']],
    ['s from v u t', ['v', 'u', 't'], ['s']],
    ['I know mass, acceleration and want force', ['mass', 'acceleration'], ['force']],
  ];
  it.each(cases)('reads "%s"', (query, have, want) => {
    expect(parseQuantityQuery(query)).toEqual({ have, want });
  });

  it('leaves ordinary searches alone', () => {
    expect(parseQuantityQuery('escape velocity')).toBeNull();
    expect(parseQuantityQuery('find the area')).toBeNull();
    expect(parseQuantityQuery('Ohm’s law')).toBeNull();
    expect(parseQuantityQuery('have a look')).toBeNull();
  });
});

describe('have/want ranking', () => {
  const entries = allEntries();
  const rank = (q: string) => matchQuantities(parseQuantityQuery(q)!, entries);

  it('ranks the exact match first for v, u, t → s', () => {
    const results = rank('I have v, u, t want s');
    expect(results[0].entry.id).toBe('p-xi-2-50');
    expect(results[0].tier).toBe(0);
    expect(results[0].missing).toEqual([]);
  });

  it('ranks formulas needing an extra below exact ones, and names what is missing', () => {
    const results = rank('I have v, u, t want s');
    const needsA = results.find((r) => r.entry.id === 'p-xi-2-5')!;
    expect(needsA).toBeTruthy();
    expect(needsA.tier).toBe(2);
    expect(needsA.missing.map((m) => m.symbol)).toEqual(['a']);
    expect(results.indexOf(needsA)).toBeGreaterThan(0);
    for (let i = 1; i < results.length; i++) expect(results[i].tier).toBeGreaterThanOrEqual(results[i - 1].tier);
  });

  it('works when the unknown must be rearranged', () => {
    const results = rank('have v u a find t');
    const first = results.find((r) => r.tier === 0)!;
    expect(first.entry.id).toBe('p-xi-2-4');
    expect(first.unknown).toBe('t');
  });

  it('counts constants as already known', () => {
    const results = rank('have u theta want R_h');
    const range = results.find((r) => r.entry.id === 'p-xi-2-10')!;
    expect(range.tier).toBe(0);
    expect(range.missing).toEqual([]);
  });

  it('marks left-over quantities', () => {
    const results = rank('have v u a t want s');
    const match = results.find((r) => r.entry.id === 'p-xi-2-50')!;
    expect(match.tier).toBe(1);
    expect(match.unused).toEqual(['a']);
  });

  it('understands symbols written as v0, λ and Greek names', () => {
    expect(rank('have f λ want v')[0].entry.id).toBe('p-xi-10-8');
    expect(rank('have f lambda want v')[0].entry.id).toBe('p-xi-10-8');
    expect(rank('have omega0 alpha t want omega').some((r) => r.entry.id === 'p-xi-5-102' && r.tier === 0)).toBe(true);
  });

  it('matches quantity names as well as symbols', () => {
    const results = rank('have mass, speed want kinetic energy');
    expect(results.some((r) => r.entry.id === 'p-xi-4-2' && r.tier === 0)).toBe(true);
  });

  it('returns nothing for quantities that do not exist', () => {
    expect(rank('have blorp want zorp')).toEqual([]);
  });
});
