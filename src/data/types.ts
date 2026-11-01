export type SubjectId = 'physics' | 'chemistry' | 'mathematics' | 'computerscience';
export type ClassLevel = 'XI' | 'XII';
export type UnitStatus = 'syllabus' | 'supplementary' | 'not-in-syllabus';

/** A stored formula, as it appears in a chunk or in shared.json. */
export interface FormulaEntry {
  id: string;
  name: string;
  latex: string;
  note?: string;
  /** Names of entries merged into this one, kept searchable. */
  aka?: string[];
}

export interface Placement {
  subject: SubjectId;
  classLevel: ClassLevel;
  unit: string;
  subtopic: string;
}

/** An entry shown in more than one unit. Stored once, in shared.json. */
export interface SharedEntry extends FormulaEntry {
  subjects: SubjectId[];
  placements: Placement[];
}

export type ChunkItem = FormulaEntry | { ref: string };

export interface ChunkSubtopic {
  name: string;
  items: ChunkItem[];
}

export interface ChunkUnit {
  name: string;
  subtopics: ChunkSubtopic[];
}

export interface Chunk {
  subject: SubjectId;
  classLevel: ClassLevel;
  units: ChunkUnit[];
}

export interface ManifestSubtopic {
  name: string;
  count: number;
}

export interface ManifestUnit {
  name: string;
  status: UnitStatus;
  count: number;
  subtopics: ManifestSubtopic[];
}

export interface ManifestClass {
  level: ClassLevel;
  chunk: string;
  count: number;
  units: ManifestUnit[];
}

export interface ManifestSubject {
  id: SubjectId;
  label: string;
  code: string;
  classes: ManifestClass[];
}

export interface Manifest {
  generatedFrom: string;
  subjects: ManifestSubject[];
  totals: { legacy: number; removed: number; entries: number; shared: number };
}

/** A formula resolved for display, at a specific place in the book. */
export interface Formula extends FormulaEntry {
  subject: SubjectId;
  classLevel: ClassLevel;
  unit: string;
  unitIndex: number;
  subtopic: string;
  subtopicIndex: number;
  /** Section number as printed in the book, e.g. "2.3.14". */
  number: string;
  /** Present when this entry is also shown elsewhere. */
  shared?: SharedEntry;
}
