// Access to the formula data. Each subject and class is its own lazily loaded
// chunk, so opening Physics XI never pays for Mathematics XII.
import manifestJson from './generated/manifest.json';
import { canonicalId } from './aliases';
import type { Chunk, ChunkItem, ClassLevel, Formula, FormulaEntry, Manifest, ManifestClass, ManifestSubject, SharedEntry, SubjectId } from './types';

export const manifest = manifestJson as Manifest;

export const SUBJECT_IDS: SubjectId[] = manifest.subjects.map((s) => s.id);

export function getSubject(id: SubjectId): ManifestSubject {
  return manifest.subjects.find((s) => s.id === id) ?? manifest.subjects[0];
}

export function getClass(subject: SubjectId, level: ClassLevel): ManifestClass | undefined {
  return getSubject(subject).classes.find((c) => c.level === level);
}

/** "3. Laws of Motion" splits into { number: "3", title: "Laws of Motion" }. */
export function splitUnitName(name: string): { number: string; title: string } {
  const match = /^(\d+)\.\s*(.*)$/.exec(name);
  return match ? { number: match[1], title: match[2] } : { number: '', title: name };
}

/** Drops the syllabus remark from a title. The status label says it instead. */
export function unitTitle(name: string): string {
  return splitUnitName(name).title.replace(/\s*\((?:not in 2028 syllabus|supplementary)\)\s*$/i, '');
}

const chunkLoaders = import.meta.glob<{ default: Chunk }>(['./generated/*-XI.json', './generated/*-XII.json']);
const chunkCache = new Map<string, Promise<Chunk>>();
let sharedPromise: Promise<Record<string, SharedEntry>> | null = null;

export function loadShared(): Promise<Record<string, SharedEntry>> {
  sharedPromise ??= import('./generated/shared.json').then((m) => m.default as unknown as Record<string, SharedEntry>);
  return sharedPromise;
}

export function loadChunk(subject: SubjectId, level: ClassLevel): Promise<Chunk> {
  const key = `${subject}-${level}`;
  const cached = chunkCache.get(key);
  if (cached) return cached;
  const loader = chunkLoaders[`./generated/${key}.json`];
  if (!loader) return Promise.reject(new Error(`No data for ${key}`));
  const promise = loader().then((m) => m.default);
  chunkCache.set(key, promise);
  promise.catch(() => chunkCache.delete(key));
  return promise;
}

function resolveItem(item: ChunkItem, shared: Record<string, SharedEntry>): { entry: FormulaEntry; shared?: SharedEntry } {
  if ('ref' in item) return { entry: shared[item.ref], shared: shared[item.ref] };
  return { entry: item };
}

export interface ResolvedSubtopic {
  name: string;
  index: number;
  formulas: Formula[];
}

export interface ResolvedUnit {
  name: string;
  index: number;
  number: string;
  subtopics: ResolvedSubtopic[];
}

/** Numbers every formula by unit, sub-topic and position, e.g. "2.3.14". */
export function resolveChunk(chunk: Chunk, shared: Record<string, SharedEntry>): ResolvedUnit[] {
  return chunk.units.map((unit, unitIndex) => {
    const unitNumber = splitUnitName(unit.name).number || String(unitIndex + 1);
    return {
      name: unit.name,
      index: unitIndex,
      number: unitNumber,
      subtopics: unit.subtopics.map((sub, subtopicIndex) => ({
        name: sub.name,
        index: subtopicIndex,
        formulas: sub.items.map((item, itemIndex) => {
          const { entry, shared: sharedEntry } = resolveItem(item, shared);
          return {
            ...entry,
            subject: chunk.subject,
            classLevel: chunk.classLevel,
            unit: unit.name,
            unitIndex,
            subtopic: sub.name,
            subtopicIndex,
            number: `${unitNumber}.${subtopicIndex + 1}.${itemIndex + 1}`,
            shared: sharedEntry,
          };
        }),
      })),
    };
  });
}

const resolvedCache = new Map<string, Promise<ResolvedUnit[]>>();

export function loadUnits(subject: SubjectId, level: ClassLevel): Promise<ResolvedUnit[]> {
  const key = `${subject}-${level}`;
  const cached = resolvedCache.get(key);
  if (cached) return cached;
  const promise = Promise.all([loadChunk(subject, level), loadShared()]).then(([chunk, shared]) => resolveChunk(chunk, shared));
  resolvedCache.set(key, promise);
  promise.catch(() => resolvedCache.delete(key));
  return promise;
}

const PREFIX: Record<string, SubjectId> = { p: 'physics', c: 'chemistry', m: 'mathematics', cs: 'computerscience' };

/** Works out which chunk holds an id, from its "p-xi-1-3" shape. */
export function locateId(id: string): { subject: SubjectId; level: ClassLevel } | null {
  const match = /^(cs|p|c|m)-(xi|xii)-/.exec(id);
  if (!match) return null;
  return { subject: PREFIX[match[1]], level: match[2] === 'xi' ? 'XI' : 'XII' };
}

export async function findFormula(rawId: string): Promise<Formula | null> {
  const id = canonicalId(rawId);
  const shared = await loadShared();
  const sharedEntry = shared[id];
  const location = sharedEntry
    ? { subject: sharedEntry.placements[0].subject, level: sharedEntry.placements[0].classLevel }
    : locateId(id);
  if (!location) return null;
  const units = await loadUnits(location.subject, location.level);
  for (const unit of units) {
    for (const sub of unit.subtopics) {
      const hit = sub.formulas.find((f) => f.id === id);
      if (hit) return hit;
    }
  }
  return null;
}

/** Every formula in the book, once each. Used by search and practice. */
export async function loadAllFormulas(): Promise<Formula[]> {
  const seen = new Set<string>();
  const out: Formula[] = [];
  for (const subject of manifest.subjects) {
    for (const cls of subject.classes) {
      const units = await loadUnits(subject.id, cls.level);
      for (const unit of units) {
        for (const sub of unit.subtopics) {
          for (const f of sub.formulas) {
            if (!seen.has(f.id)) {
              seen.add(f.id);
              out.push(f);
            }
          }
        }
      }
    }
  }
  return out;
}
