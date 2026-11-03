// All registry entries, with quantities and constants resolved. Adding a formula
// means adding a line to one of the data files. tests/unit/registry.test.ts then
// checks that its id exists and that its dimensions balance.
import { customEntry } from '../../custom/entry';
import { customStore, isCustomId } from '../../custom/store';
import type { ResolvedEntry, ResolvedVar, SolverEntry, VarOptions, VarSpec } from '../types';
import { CHEMISTRY } from './chemistry';
import { MATHEMATICS } from './mathematics';
import { MECHANICS } from './physics-mechanics';
import { PHYSICS_OTHER } from './physics-other';
import { CONSTANTS, QUANTITIES } from './quantities';

export const RAW_ENTRIES: SolverEntry[] = [...MECHANICS, ...PHYSICS_OTHER, ...CHEMISTRY, ...MATHEMATICS];

function resolveVar(symbol: string, spec: VarSpec): ResolvedVar {
  if (typeof spec === 'string' && spec.startsWith('c:')) {
    const c = CONSTANTS[spec.slice(2)];
    if (!c) throw new Error(`Unknown constant ${spec}`);
    return { symbol, name: c.name, quantityKey: spec, dim: c.dim, unit: c.unit, alt: [], tex: c.tex, gen: [c.value, c.value], value: c.value, isConstant: true };
  }
  const [name, key, options]: [string, string, VarOptions] = typeof spec === 'string' ? (() => {
    // The last bar separates them, since a name can contain one, as in P(A | B).
    const bar = spec.lastIndexOf('|');
    return [spec.slice(0, bar), spec.slice(bar + 1), {}] as [string, string, VarOptions];
  })() : spec;
  const q = QUANTITIES[key];
  if (!q) throw new Error(`Unknown quantity "${key}" for ${symbol}`);
  return {
    symbol,
    name,
    quantityKey: key,
    dim: q.dim,
    unit: q.unit,
    alt: q.alt ?? [],
    show: options.show ?? q.show,
    tex: options.tex,
    gen: options.gen ?? q.gen ?? [1, 10],
    min: 'min' in options ? options.min : q.min,
    max: 'max' in options ? options.max : q.max,
    exclusiveMin: options.exclusiveMin ?? q.exclusiveMin,
    integer: options.integer ?? q.integer,
    nominal: q.nominal,
    value: options.value,
    isConstant: false,
  };
}

export function resolveEntry(raw: SolverEntry): ResolvedEntry {
  return {
    id: raw.id,
    eq: raw.eq,
    topic: raw.topic,
    ask: raw.ask,
    convention: raw.convention,
    vars: Object.entries(raw.vars).map(([symbol, spec]) => resolveVar(symbol, spec)),
  };
}

const byId = new Map(RAW_ENTRIES.map((e) => [e.id, e]));
const resolved = new Map<string, ResolvedEntry>();

export function getEntry(id: string): ResolvedEntry | null {
  if (isCustomId(id)) return customEntry(id);
  const cached = resolved.get(id);
  if (cached) return cached;
  const raw = byId.get(id);
  if (!raw) return null;
  const entry = resolveEntry(raw);
  resolved.set(id, entry);
  return entry;
}

export function allEntries(): ResolvedEntry[] {
  const mine = customStore.get().formulas.flatMap((f) => {
    const entry = customEntry(f.id);
    return entry ? [entry] : [];
  });
  return [...RAW_ENTRIES.map((e) => getEntry(e.id)!), ...mine];
}
