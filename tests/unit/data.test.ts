import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain JS helper, shared with the migration script
import { flatten, loadLegacyFormulas } from '../../scripts/lib/dedupe.mjs';
// @ts-expect-error plain JS helper, shared with the migration script
import { REVIEW } from '../../scripts/dedupe-decisions.mjs';
// @ts-expect-error plain JS helper, shared with the data step
import { MANUAL } from '../../scripts/cs/manual.mjs';
import { canonicalId, isRemovedId, migrateIds } from '../../src/data/aliases';
import type { Chunk, ChunkItem, Manifest, SharedEntry, Syllabus } from '../../src/data/types';

const root = path.resolve(__dirname, '../..');
const genDir = path.join(root, 'src/data/generated');
const readJson = <T,>(file: string): T => JSON.parse(fs.readFileSync(path.join(genDir, file), 'utf8')) as T;

const rows: { id: string; name: string; latex: string; subject: string; cls: string; unit: string }[] = flatten(loadLegacyFormulas(path.join(root, 'legacy/script.js')));
const manifest = readJson<Manifest>('manifest.json');
const shared = readJson<Record<string, SharedEntry>>('shared.json');
const aliases = readJson<Record<string, string | null>>('idAliases.json');
const chunks = manifest.subjects.flatMap((s) => s.classes.map((c) => readJson<Chunk>(c.chunk)));

const stored = new Map<string, { latex: string; body?: string; name: string; aka?: string[] }>(Object.entries(shared));
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

  it('old count minus merged minus archived equals new count', () => {
    const { merged, archived } = manifest.totals;
    expect(stored.size).toBe(rows.length - merged - archived);
    expect(manifest.totals).toMatchObject({ legacy: rows.length, entries: stored.size });
    expect(Object.keys(aliases).length).toBe(rows.filter((r) => !stored.has(r.id)).length);
    expect(inlineCount + Object.keys(shared).length).toBe(stored.size);
  });

  it('stores nothing twice', () => {
    const ids = new Set(stored.keys());
    expect(ids.size).toBe(stored.size);
    for (const id of Object.keys(aliases)) expect(ids.has(id)).toBe(false);
  });

  it('resolves every old id to a stored entry, unless it was taken out', () => {
    for (const r of rows) {
      if (isRemovedId(r.id)) expect(stored.has(r.id), r.id).toBe(false);
      else expect(stored.has(canonicalId(r.id)), r.id).toBe(true);
    }
  });

  it('accounts for every merge: an alias is either live or removed, never dangling', () => {
    for (const [id, target] of Object.entries(aliases)) {
      if (target === null) expect(stored.has(id), id).toBe(false);
      else expect(stored.has(target), `${id} -> ${target}`).toBe(true);
    }
  });

  it('lists every live entry under a unit', () => {
    const listed = new Set([...unitIds.values()].flatMap((ids) => [...ids]));
    for (const id of stored.keys()) expect(listed.has(id), id).toBe(true);
  });

  it('never rewrites LaTeX: every stored formula matches its legacy source', () => {
    const legacy = new Map(rows.map((r) => [r.id, r]));
    for (const [id, entry] of stored) {
      // Computer Science is rewritten as Java on purpose. See tests/unit/cs-notation.test.ts.
      if (id.startsWith('cs-') && (entry.body || MANUAL[id]?.latex)) continue;
      expect(entry.latex, id).toBe(legacy.get(id)!.latex);
    }
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

describe('the 2028 syllabus', () => {
  const archive: { id: string; verdict: string; reason: string }[] = JSON.parse(fs.readFileSync(path.join(root, 'archive/removed-formulas.json'), 'utf8'));
  const classification: Record<string, { verdict: string; topics?: string[] }> = JSON.parse(fs.readFileSync(path.join(root, 'archive/classification.json'), 'utf8'));
  const syllabusOf = (subject: string) => JSON.parse(fs.readFileSync(path.join(root, `src/data/syllabus/${subject}.json`), 'utf8')) as Syllabus;

  it('balances: old count − merged − archived = new count', () => {
    const { legacy, merged, archived, entries } = manifest.totals;
    expect(legacy).toBe(8736);
    expect(legacy - merged - archived).toBe(entries);
    expect(stored.size).toBe(entries);
    expect(archive.length).toBe(archived);
  });

  it('classifies every entry from the old app, once', () => {
    expect(Object.keys(classification).length).toBe(manifest.totals.entries + manifest.totals.archived);
    for (const v of Object.values(classification)) expect(['core', 'supporting', 'review', 'out', 'not-needed']).toContain(v.verdict);
  });

  it('ships nothing that was archived, and gives a reason for each', () => {
    for (const e of archive) {
      expect(stored.has(e.id), e.id).toBe(false);
      expect(e.reason.length).toBeGreaterThan(10);
      expect(['out', 'not-needed']).toContain(e.verdict);
    }
  });

  it('removes the units that are not in the syllabus', () => {
    const names = manifest.subjects.flatMap((s) => s.classes.flatMap((c) => c.units.map((u) => u.name)));
    for (const gone of [/Databases/, /Networking/, /States of Matter/, /Solid State/, /Surface Chemistry/, /Polymers/, /s-Block/]) {
      expect(names.some((n) => gone.test(n)), String(gone)).toBe(false);
    }
  });

  it('uses the official unit names and numbers, and every section links to a real topic', () => {
    for (const subject of manifest.subjects) {
      const syllabus = syllabusOf(subject.id);
      expect(syllabus.edition).toMatch(/Examination Year 2028/);
      for (const cls of subject.classes) {
        const official = syllabus.classes.find((c) => c.level === cls.level)!;
        for (const unit of cls.units) {
          const [, number, title] = /^(\d+)\. (.*)$/.exec(unit.name)!;
          const match = official.units.find((u) => u.number === Number(number))!;
          expect(match?.name, unit.name).toBe(title);
          for (const sub of unit.subtopics) expect(match.topics.some((t) => t.key === sub.topic), `${unit.name}: ${sub.name}`).toBe(true);
        }
      }
    }
  });

  it('sums each syllabus to its paper total', () => {
    const expected: Record<string, number> = { physics: 70, chemistry: 70, mathematics: 80, computerscience: 70 };
    for (const [subject, total] of Object.entries(expected)) {
      for (const cls of syllabusOf(subject).classes) {
        expect(cls.markGroups.reduce((n, g) => n + g.marks, 0), `${subject} ${cls.level}`).toBe(total);
      }
    }
  });

  it('maps every removed id so favourites and progress can migrate', () => {
    for (const e of archive) expect(aliases[e.id], e.id).toBeNull();
    expect(migrateIds([archive[0].id, 'p-xi-2-1'])).toEqual(['p-xi-2-1']);
    expect(isRemovedId(archive[0].id)).toBe(true);
  });

  it('keeps the uncertain items in the app, for the student to decide', () => {
    const uncertain = Object.entries(classification).filter(([, v]) => v.verdict === 'review');
    expect(uncertain.length).toBeGreaterThan(0);
    for (const [id] of uncertain) expect(stored.has(id), id).toBe(true);
    const review = fs.readFileSync(path.join(root, 'reports/syllabus-review.md'), 'utf8');
    for (const [id] of uncertain) expect(review, id).toContain(id);
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
