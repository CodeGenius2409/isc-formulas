import aliases from './generated/idAliases.json';

const ALIASES = aliases as Record<string, string>;

/** Maps any old or current formula id to its canonical id. */
export function canonicalId(id: string): string {
  return ALIASES[id] ?? id;
}

/** Rewrites a list of ids to canonical ids, keeping order and removing repeats. */
export function migrateIds(ids: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    const canonical = canonicalId(id);
    if (!seen.has(canonical)) {
      seen.add(canonical);
      out.push(canonical);
    }
  }
  return out;
}
