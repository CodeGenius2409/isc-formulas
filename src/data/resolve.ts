// Turns a raw chunk into numbered formulas. Separate from book.ts so that it has no
// bundler-specific imports, and scripts and tests can use it directly.
import type { Chunk, ChunkItem, Formula, FormulaEntry, SharedEntry } from './types';

/** "3. Laws of Motion" splits into { number: "3", title: "Laws of Motion" }. */
export function splitUnitName(name: string): { number: string; title: string } {
  const match = /^(\d+)\.\s*(.*)$/.exec(name);
  return match ? { number: match[1], title: match[2] } : { number: '', title: name };
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
