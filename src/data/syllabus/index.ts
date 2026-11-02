// The official syllabus map. Each subject's file loads only when someone opens it.
import type { ClassLevel, SubjectId, Syllabus, SyllabusUnit } from '../types';

const loaders = import.meta.glob<{ default: unknown }>('./*.json');

export function loadSyllabus(subject: SubjectId): Promise<Syllabus> {
  const loader = loaders[`./${subject}.json`];
  if (!loader) return Promise.reject(new Error(`No syllabus for ${subject}`));
  return loader().then((m) => m.default as Syllabus);
}

export function syllabusUnit(syllabus: Syllabus, level: ClassLevel, number: number): SyllabusUnit | undefined {
  return syllabus.classes.find((c) => c.level === level)?.units.find((u) => u.number === number);
}
