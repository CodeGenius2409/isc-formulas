export type SubjectId = 'physics' | 'chemistry' | 'mathematics' | 'computerscience';
export type ClassLevel = 'XI' | 'XII';
/** Every unit is in the 2028 syllabus. "practical" marks Paper II, which has no theory marks. */
export type UnitStatus = 'syllabus' | 'practical';

/** How much a formula matters, from the syllabus and the papers. Absent means core. */
export type FormulaTier = 'supporting';

/** A stored formula, as it appears in a chunk or in shared.json. */
export interface FormulaEntry {
  id: string;
  name: string;
  latex: string;
  /** Computer Science written as code: words, `code` and $notation$. Used in place of latex there. */
  body?: string;
  note?: string;
  /** Names of entries merged into this one, kept searchable. */
  aka?: string[];
  tier?: FormulaTier;
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
  /** Its topic within the unit, as keyed in src/data/syllabus. */
  topic: string;
  items: ChunkItem[];
}

export interface ChunkUnit {
  name: string;
  /** The unit's number in the official syllabus. */
  number: number;
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
  topic: string;
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
  /** The edition of the syllabus each subject is mapped to. */
  syllabus: Record<SubjectId, string>;
  subjects: ManifestSubject[];
  /** legacy − merged − archived = entries. */
  totals: { legacy: number; merged: number; archived: number; entries: number; shared: number };
}

export interface SyllabusTopic {
  key: string;
  name: string;
  wording: string;
}

export interface SyllabusUnit {
  number: number;
  name: string;
  practical?: boolean;
  topics: SyllabusTopic[];
}

export interface SyllabusMarkGroup {
  units: number[];
  marks: number;
  label?: string;
}

export interface SyllabusClass {
  level: ClassLevel;
  paper: string;
  markGroups: SyllabusMarkGroup[];
  units: SyllabusUnit[];
}

export interface Syllabus {
  subject: SubjectId;
  code: string;
  edition: string;
  classes: SyllabusClass[];
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
