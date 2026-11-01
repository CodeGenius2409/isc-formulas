import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain JS helper, shared with the migration script
import { flatten, loadLegacyFormulas } from '../../scripts/lib/dedupe.mjs';
// @ts-expect-error plain JS helper, shared with the migration script
import { REVIEW } from '../../scripts/dedupe-decisions.mjs';
import { canonicalId, migrateIds } from '../../src/data/aliases';
import type { Chunk, ChunkItem, Manifest, SharedEntry } from '../../src/data/types';

const root = path.resolve(__dirname, '../..');
const genDir = path.join(root, 'src/data/generated');
const readJson = <T,>(file: string): T => JSON.parse(fs.readFileSync(path.join(genDir, file), 'utf8')) as T;

const rows: { id: string; name: string; latex: string; subject: string; cls: string; unit: string }[] = flatten(loadLegacyFormulas(path.join(root, 'legacy/script.js')));
const manifest = readJson<Manifest>('manifest.json');
const shared = readJson<Record<string, SharedEntry>>('shared.json');
const aliases = readJson<Record<string, string>>('idAliases.json');
const chunks = manifest.subjects.flatMap((s) => s.classes.map((c) => readJson<Chunk>(c.chunk)));

const stored = new Map<string, { latex: string; name: string; aka?: string[] }>(Object.entries(shared));
const unitIds = new Map<string, Set<string>>();
const addTo = (key: string, id: string) => (unitIds.get(key) ?? unitIds.set(key, new Set()).get(key)!).add(id);
let inlineCount = 0;
for (const chunk of chunks) {
  for (const unit of chunk.units) {
    for (const sub of unit.subtopics) {
      for (const item of sub.items as ChunkItem[]) {
        if ('ref' in item) {
          addTo(`${chunk.subject}|${chunk.classLevel}|${unit.name}`, item.ref);
        } else {
          expect(stored.has(item.id)).toBe(false);
          stored.set(item.id, item);
          inlineCount++;
          addTo(`${chunk.subject}|${chunk.classLevel}|${unit.name}`, item.id);
        }
      }
    }
  }
}

describe('dedupe reconciliation', () => {
  it('reads the legacy totals you measured', () => {
    expect(rows.length).toBe(8736);
    const by = (s: string) => rows.filter((r) => r.subject === s).length;
    expect([by('physics'), by('chemistry'), by('mathematics'), by('computerscience')]).toEqual([2530, 2586, 2754, 866]);
  });

  it('old count minus removed duplicates equals new count', () => {
    const removed = Object.keys(aliases).length;
    expect(stored.size).toBe(rows.length - removed);
    expect(manifest.totals).toMatchObject({ legacy: rows.length, removed, entries: stored.size });
    expect(inlineCount + Object.keys(shared).length).toBe(stored.size);
  });

  it('stores nothing twice', () => {
    const ids = new Set(stored.keys());
    expect(ids.size).toBe(stored.size);
    for (const id of Object.keys(aliases)) expect(ids.has(id)).toBe(false);
  });

  it('resolves every old id to a stored entry', () => {
    for (const r of rows) expect(stored.has(canonicalId(r.id)), r.id).toBe(true);
  });

  it('keeps every old entry reachable from the unit it was in', () => {
    for (const r of rows) {
      const ids = unitIds.get(`${r.subject}|${r.cls}|${r.unit}`);
      expect(ids?.has(canonicalId(r.id)), `${r.id} missing from ${r.unit}`).toBe(true);
    }
  });

  it('never rewrites LaTeX: every stored formula matches its legacy source', () => {
    const legacy = new Map(rows.map((r) => [r.id, r]));
    for (const [id, entry] of stored) expect(entry.latex, id).toBe(legacy.get(id)!.latex);
  });

  it('keeps the old names of merged entries searchable', () => {
    const merged = rows.find((r) => r.id === 'p-xii-8-35')!;
    const canonical = stored.get(canonicalId(merged.id))!;
    expect([canonical.name, ...(canonical.aka ?? [])]).toContain(merged.name);
  });

  it('merges your named examples into one entry each', () => {
    expect(canonicalId('p-xii-8-35')).toBe(canonicalId('p-xi-1-176'));
    expect(new Set(['p-xi-1-183', 'p-xii-8-9', 'c-xi-2-15'].map(canonicalId)).size).toBe(1);
    const planck = shared[canonicalId('p-xi-1-179')];
    expect(planck.subjects).toEqual(['physics', 'chemistry']);
    expect(planck.placements.length).toBe(2);
  });

  it('leaves every review group unmerged', () => {
    for (const { ids } of REVIEW as { ids: string[] }[]) {
      expect(new Set(ids.map(canonicalId)).size, ids.join()).toBe(ids.length);
    }
  });

  it('keeps look-alikes with different meanings apart', () => {
    expect(canonicalId('m-xii-4-63')).not.toBe(canonicalId('m-xii-4-95'));
    expect(canonicalId('p-xi-4-6')).not.toBe(canonicalId('p-xii-2-4'));
  });
});

describe('favourites migration', () => {
  it('maps old ids to canonical ids and removes the repeats that creates', () => {
    expect(migrateIds(['p-xii-8-35', 'p-xi-1-176', 'p-xi-4-2'])).toEqual([canonicalId('p-xi-1-176'), 'p-xi-4-2']);
  });
  it('leaves unknown ids alone so nothing is lost', () => {
    expect(migrateIds(['not-a-real-id'])).toEqual(['not-a-real-id']);
  });
});

describe('syllabus labels', () => {
  it('flags the units outside the 2028 syllabus', () => {
    const units = manifest.subjects.flatMap((s) => s.classes.flatMap((c) => c.units));
    expect(units.filter((u) => u.status === 'not-in-syllabus').length).toBe(2);
    expect(units.filter((u) => u.status === 'supplementary').length).toBe(1);
  });
});

describe('content', () => {
  it('every stored formula renders in KaTeX', () => {
    const failures: string[] = [];
    for (const [id, entry] of stored) {
      try {
        katex.renderToString(entry.latex, { throwOnError: true, strict: 'ignore' });
      } catch (err) {
        failures.push(`${id}: ${(err as Error).message.slice(0, 120)}`);
      }
    }
    expect(failures).toEqual([]);
  });
});
