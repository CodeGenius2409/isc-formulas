// Works out what the variety engine can ask of each solver entry, by trying it: which unknowns solve cleanly, and whether
// the relation is a pure power law, which the factor, percentage, graph and error questions need. Writes a data file:
//   $env:WRITE_VARIETY_MAP=1; npx vitest run tests/unit/variety-map.test.ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getEntry, RAW_ENTRIES } from '../../src/solver/registry';
import { defaultUnknown, solve, type SolveInput } from '../../src/solver/solve';
import { plainNumber } from '../../src/solver/units';
import { niceValue, rawOf, seededRng } from '../../src/practice/questions';
import type { ResolvedEntry } from '../../src/solver/types';

const OUT = path.resolve(__dirname, '../../src/data/blueprints/variety/entry-map.json');
const WRITE = process.env.WRITE_VARIETY_MAP;

interface ClassFile {
  subject: string;
  classLevel: string;
  units: { number: number; subtopics: { topic: string; items: { id?: string; ref?: string; name?: string }[] }[] }[];
}

const FILES = ['physics-XI', 'physics-XII', 'chemistry-XI', 'chemistry-XII', 'mathematics-XI', 'mathematics-XII', 'computerscience-XI', 'computerscience-XII'];

function draw(entry: ResolvedEntry, skip: string, seed: number): Record<string, SolveInput> {
  const rng = seededRng(seed);
  const inputs: Record<string, SolveInput> = {};
  for (const v of entry.vars) {
    if (v.symbol === skip) continue;
    const value = v.value ?? (v.isConstant ? v.gen[0] : niceValue(v, rng));
    inputs[v.symbol] = rawOf(v, value);
  }
  return inputs;
}

function root(entry: ResolvedEntry, unknown: string, inputs: Record<string, SolveInput>): number | null {
  try {
    const outcome = solve(entry, unknown, inputs);
    if (!outcome.ok || outcome.method === 'numeric') return null;
    const good = outcome.roots.filter((r) => !r.rejected);
    if (good.length !== 1 || !Number.isFinite(good[0].value) || good[0].value === 0) return null;
    return good[0].value;
  } catch {
    return null;
  }
}

/** The power of each input in the natural unknown, when the relation is a pure power law. */
function powers(entry: ResolvedEntry, natural: string): Record<string, number> | null {
  const free = entry.vars.filter((v) => v.symbol !== natural && !v.isConstant && v.value === undefined);
  if (!free.length) return null;
  if (free.some((v) => v.integer || v.nominal)) return null;
  const out: Record<string, number> = {};
  for (const v of free) {
    let found: number | null = null;
    for (const seed of [11, 23, 47]) {
      const base = draw(entry, natural, seed);
      const z1 = root(entry, natural, base);
      if (z1 === null) return null;
      const doubled = { ...base, [v.symbol]: { ...base[v.symbol], raw: plainNumber(Number(base[v.symbol].raw) * 2) } };
      const z2 = root(entry, natural, doubled);
      if (z2 === null || z1 * z2 <= 0) return null;
      const n = Math.log2(z2 / z1);
      if (found !== null && Math.abs(found - n) > 1e-6) return null;
      found = n;
    }
    const rounded = Math.round((found as number) * 2) / 2;
    if (Math.abs(rounded - (found as number)) > 1e-6 || rounded === 0) return null;
    out[v.symbol] = rounded;
  }
  return out;
}

export function buildMap() {
  const byEntry = new Map(RAW_ENTRIES.map((e) => [e.id, e]));
  const topics: Record<string, string[]> = {};
  const shared = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../src/data/generated/shared.json'), 'utf8')) as Record<string, { name: string }>;
  const titles = new Map<string, string>();
  for (const name of FILES) {
    const file = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../src/data/generated/${name}.json`), 'utf8')) as ClassFile;
    for (const unit of file.units) {
      for (const sub of unit.subtopics) {
        for (const item of sub.items) {
          const id = item.id ?? item.ref;
          if (!id || !byEntry.has(id)) continue;
          titles.set(id, item.name ?? shared[id]?.name ?? '');
          const key = `${file.subject} ${file.classLevel} ${unit.number}${sub.topic}`;
          (topics[key] ??= []).includes(id) || topics[key].push(id);
        }
      }
    }
  }
  const entries: Record<string, { title: string; natural: string; unknowns: string[]; powers?: Record<string, number> }> = {};
  for (const id of new Set(Object.values(topics).flat())) {
    const entry = getEntry(id)!;
    const natural = defaultUnknown(entry);
    const free = entry.vars.filter((v) => !v.isConstant && v.value === undefined);
    const unknowns: string[] = [];
    for (const v of free) {
      let good = 0;
      for (let seed = 1; seed <= 20; seed++) {
        const forward = draw(entry, natural, seed * 13);
        const z = v.symbol === natural ? 1 : root(entry, natural, forward);
        if (z === null) continue;
        const inputs: Record<string, SolveInput> = v.symbol === natural ? forward : { ...forward, [natural]: { raw: plainNumber(Number(z.toPrecision(3))), unit: entry.vars.find((x) => x.symbol === natural)!.unit } };
        delete inputs[v.symbol];
        if (root(entry, v.symbol, inputs) !== null) good++;
      }
      if (good >= 12) unknowns.push(v.symbol);
    }
    if (!unknowns.length) continue;
    const power = powers(entry, natural);
    entries[id] = { title: titles.get(id) ?? '', natural, unknowns, ...(power ? { powers: power } : {}) };
  }
  const cleaned: Record<string, string[]> = {};
  for (const [key, list] of Object.entries(topics).sort()) {
    const usable = list.filter((id) => entries[id]);
    if (usable.length) cleaned[key] = usable;
  }
  return { topics: cleaned, entries };
}

const SKIP = path.resolve(__dirname, '../../src/data/blueprints/variety/skip.json');

describe('the variety map', () => {
  // A blueprint that can't reliably make a question from its entry is left out. Run with an empty skip.json in place.
  it.runIf(process.env.WRITE_VARIETY_SKIP)('finds what does not work', async () => {
    const { loadBlueprints } = await import('../../src/data/blueprints');
    const { generateItem } = await import('../../src/practice/gen/engine');
    const bad: string[] = [];
    for (const subject of ['physics', 'chemistry', 'computerscience'] as const) {
      for (const level of ['XI', 'XII'] as const) {
        const set = await loadBlueprints(subject, level);
        for (const bp of set.blueprints.filter((b) => b.family)) {
          try {
            for (let k = 1; k <= 60; k++) generateItem(bp, k * 7919, { unitName: '', topicName: '' });
          } catch (err) {
            if (!/gave nothing usable/.test((err as Error).message)) throw err;
            bad.push(bp.id);
          }
        }
      }
    }
    fs.writeFileSync(SKIP, `${JSON.stringify(bad.sort(), null, 0)}
`);
  }, 1_200_000);

  it.skipIf(!WRITE)('is written', () => {
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, `${JSON.stringify(buildMap(), null, 0)}\n`);
  }, 600_000);

  it('names only entries the registry has', () => {
    if (!fs.existsSync(OUT)) return;
    const map = JSON.parse(fs.readFileSync(OUT, 'utf8')) as ReturnType<typeof buildMap>;
    for (const id of Object.keys(map.entries)) expect(getEntry(id), id).toBeTruthy();
  });
});
