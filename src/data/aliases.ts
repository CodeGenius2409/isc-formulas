import aliases from './generated/idAliases.json';

/** A merged id points at its canonical id. A removed one (now out of the syllabus) is null. */
const ALIASES = aliases as Record<string, string | null>;

/** Maps any old or current formula id to its canonical id. */
export function canonicalId(id: string): string {
  return ALIASES[id] ?? id;
}

/** True for an id whose formula has been taken out of the app. */
export function isRemovedId(id: string): boolean {
  return ALIASES[id] === null;
}

/** Rewrites a list of ids to canonical ids, keeping order and dropping repeats and removed ids. */
export function migrateIds(ids: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (isRemovedId(id)) continue;
    const canonical = canonicalId(id);
    if (!seen.has(canonical)) {
      seen.add(canonical);
      out.push(canonical);
    }
  }
  return out;
}
