import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkEquation, coherent, parseDim, type SymbolInfo } from '../../src/solver/dims';
import { parseEquation, symbolsIn } from '../../src/solver/expr';
import { allEntries, RAW_ENTRIES } from '../../src/solver/registry';
import { dimOfUnit } from '../../src/solver/units';
import { math } from '../../src/solver/mathjs';
import { sameDim } from '../../src/solver/dims';
import { defaultUnknown, equationTex } from '../../src/solver/solve';
import type { Chunk, Manifest } from '../../src/data/types';

const genDir = path.resolve(__dirname, '../../src/data/generated');
const manifest = JSON.parse(fs.readFileSync(path.join(genDir, 'manifest.json'), 'utf8')) as Manifest;
const shared = JSON.parse(fs.readFileSync(path.join(genDir, 'shared.json'), 'utf8')) as Record<string, unknown>;
const aliases = JSON.parse(fs.readFileSync(path.join(genDir, 'idAliases.json'), 'utf8')) as Record<string, string>;
const stored = new Set(Object.keys(shared));
for (const s of manifest.subjects) {
  for (const c of s.classes) {
    const chunk = JSON.parse(fs.readFileSync(path.join(genDir, c.chunk), 'utf8')) as Chunk;
    for (const u of chunk.units) for (const st of u.subtopics) for (const it of st.items) if ('id' in it) stored.add(it.id);
  }
}

const entries = allEntries();

function symbolsFor(entry: (typeof entries)[number]): Record<string, SymbolInfo> {
  return Object.fromEntries(entry.vars.map((v) => [v.symbol, { dim: parseDim(v.dim), factor: v.unit ? (math.unit(1, v.unit) as unknown as { value: number }).value : 1 }]));
}

describe('solver registry', () => {
  it('has at least 300 formulas', () => {
    expect(entries.length).toBeGreaterThanOrEqual(300);
  });

  it('covers Physics, Chemistry and Mathematics broadly', () => {
    const prefix = (p: string) => entries.filter((e) => e.id.startsWith(p)).length;
    expect(prefix('p-')).toBeGreaterThan(100);
    expect(prefix('c-')).toBeGreaterThan(50);
    expect(prefix('m-')).toBeGreaterThan(40);
    const topics = new Set(entries.map((e) => e.topic));
    for (const t of ['Kinematics', 'Dynamics', 'Work and energy', 'Gravitation', 'SHM and waves', 'Optics', 'Electrostatics', 'Current electricity', 'Magnetism', 'Modern physics', 'Gas laws', 'Stoichiometry', 'Concentration', 'Thermodynamics', 'Equilibrium', 'Kinetics', 'Electrochemistry', 'Algebra', 'Trigonometry', 'Calculus', 'Coordinate geometry', 'Vectors', 'Probability', 'Statistics']) {
      expect(topics.has(t), t).toBe(true);
    }
  });

  it('links every entry to a real, canonical formula id, once', () => {
    const seen = new Set<string>();
    for (const e of RAW_ENTRIES) {
      expect(aliases[e.id], `${e.id} is an alias of ${aliases[e.id]}; use the canonical id`).toBeUndefined();
      expect(stored.has(e.id), `${e.id} is not in the book`).toBe(true);
      expect(seen.has(e.id), `${e.id} appears twice`).toBe(false);
      seen.add(e.id);
    }
  });

  it('declares exactly the symbols its equation uses', () => {
    for (const entry of entries) {
      const eq = parseEquation(entry.eq);
      const used = new Set([...symbolsIn(eq.lhs), ...symbolsIn(eq.rhs)]);
      const declared = new Set(entry.vars.map((v) => v.symbol));
      expect([...used].sort(), `${entry.id} ${entry.eq}`).toEqual([...declared].sort());
    }
  });

  // The build-time dimension check: a wrong equation fails this test.
  it.each(entries.map((e) => [e.id, e] as const))('%s balances dimensionally', (_id, entry) => {
    const result = checkEquation(parseEquation(entry.eq), symbolsFor(entry));
    expect(result.ok, `${entry.eq}: ${result.message}`).toBe(true);
  });

  it('uses units whose factors agree, unless marked as a stated convention', () => {
    const bad: string[] = [];
    for (const entry of entries) {
      if (entry.convention) continue;
      if (!coherent(parseEquation(entry.eq), symbolsFor(entry))) bad.push(`${entry.id}: ${entry.eq}`);
    }
    expect(bad).toEqual([]);
  });

  it('declares units that match their dimensions', () => {
    for (const entry of entries) {
      for (const v of entry.vars) {
        if (!v.unit) continue;
        expect(sameDim(dimOfUnit(v.unit), parseDim(v.dim)), `${entry.id} ${v.symbol}: ${v.unit} vs ${v.dim}`).toBe(true);
        for (const alt of v.alt) expect(sameDim(dimOfUnit(alt), parseDim(v.dim)), `${entry.id} ${v.symbol} alt ${alt}`).toBe(true);
      }
    }
  });

  it('prints every equation as LaTeX and has a default unknown', () => {
    for (const entry of entries) {
      expect(equationTex(entry).length).toBeGreaterThan(2);
      expect(entry.vars.map((v) => v.symbol)).toContain(defaultUnknown(entry));
    }
  });
});
