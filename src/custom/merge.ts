// Puts your formulas into the book: in their chapter and section, after the printed ones, with sections of
// your own after the chapter's. Plain data in, plain data out, so that placement can be tested.
import manifestJson from '../data/generated/manifest.json';
import { splitUnitName, type ResolvedUnit } from '../data/resolve';
import type { ClassLevel, Formula, Manifest, ManifestUnit, SubjectId } from '../data/types';
import type { CustomFormula } from './store';

const manifest = manifestJson as Manifest;

function unitsOf(subject: SubjectId, level: ClassLevel): ManifestUnit[] {
  return manifest.subjects.find((s) => s.id === subject)?.classes.find((c) => c.level === level)?.units ?? [];
}

/** Where a formula lands. A chapter that has since gone from the book falls back to the first. */
function unitIndexOf(units: ManifestUnit[], unit: string): number {
  const index = units.findIndex((u) => splitUnitName(u.name).number === unit);
  return index < 0 ? 0 : index;
}

export interface UnitAdditions {
  /** Your formulas in this chapter. */
  total: number;
  /** Your formulas in each of the chapter's own sections, by name. */
  inSection: Map<string, number>;
  /** Your own sections, in the order they were first used, with how many are in each. */
  extraSections: { name: string; count: number }[];
}

/** What your formulas add to each chapter of a class, for the contents and the chapter heading. */
export function additions(formulas: CustomFormula[], subject: SubjectId, level: ClassLevel): Map<number, UnitAdditions> {
  const units = unitsOf(subject, level);
  const out = new Map<number, UnitAdditions>();
  for (const f of formulas) {
    if (f.subject !== subject || f.level !== level) continue;
    const index = unitIndexOf(units, f.unit);
    const entry: UnitAdditions = out.get(index) ?? { total: 0, inSection: new Map(), extraSections: [] };
    entry.total++;
    if (units[index]?.subtopics.some((s) => s.name === f.subtopic)) {
      entry.inSection.set(f.subtopic, (entry.inSection.get(f.subtopic) ?? 0) + 1);
    } else {
      const extra = entry.extraSections.find((s) => s.name === f.subtopic);
      if (extra) extra.count++;
      else entry.extraSections.push({ name: f.subtopic, count: 1 });
    }
    out.set(index, entry);
  }
  return out;
}

/** A formula as the rest of the app sees it. */
function toFormula(f: CustomFormula, unit: ManifestUnit, unitIndex: number, subtopicIndex: number, position: number): Formula {
  const number = splitUnitName(unit.name).number || String(unitIndex + 1);
  return {
    id: f.id,
    name: f.name,
    latex: f.latex,
    note: f.note,
    lewis: f.lewis,
    custom: 1,
    variables: f.variables,
    smiles: f.smiles,
    subject: f.subject,
    classLevel: f.level,
    unit: unit.name,
    unitIndex,
    subtopic: f.subtopic,
    subtopicIndex,
    number: `${number}.${subtopicIndex + 1}.${position}`,
  };
}

/** Every one of your formulas, with its place in the book worked out. */
export function resolveCustom(formulas: CustomFormula[]): Formula[] {
  const seenInSection = new Map<string, number>();
  const extras = new Map<string, Map<number, UnitAdditions>>();
  return formulas.map((f) => {
    const units = unitsOf(f.subject, f.level);
    const unitIndex = unitIndexOf(units, f.unit);
    const unit = units[unitIndex] ?? { name: `1. ${f.unit}`, count: 0, status: 'syllabus', subtopics: [] };
    const classKey = `${f.subject}-${f.level}`;
    if (!extras.has(classKey)) extras.set(classKey, additions(formulas, f.subject, f.level));
    const own = unit.subtopics.findIndex((s) => s.name === f.subtopic);
    const extra = extras.get(classKey)!.get(unitIndex)?.extraSections.findIndex((s) => s.name === f.subtopic) ?? -1;
    const subtopicIndex = own >= 0 ? own : unit.subtopics.length + Math.max(extra, 0);
    const key = `${classKey}-${unitIndex}-${subtopicIndex}`;
    const printed = own >= 0 ? unit.subtopics[own].count : 0;
    const position = (seenInSection.get(key) ?? printed) + 1;
    seenInSection.set(key, position);
    return toFormula(f, unit, unitIndex, subtopicIndex, position);
  });
}

/** The units of a class with your formulas added. Without any, it hands back the same list. */
export function mergeCustom(units: ResolvedUnit[], formulas: CustomFormula[], subject: SubjectId, level: ClassLevel): ResolvedUnit[] {
  const mine = formulas.filter((f) => f.subject === subject && f.level === level);
  if (!mine.length) return units;
  const resolved = resolveCustom(mine);
  return units.map((unit) => {
    const here = resolved.filter((f) => f.unitIndex === unit.index);
    if (!here.length) return unit;
    const subtopics = unit.subtopics.map((s) => ({ ...s, formulas: [...s.formulas] }));
    for (const f of here) {
      let section = subtopics.find((s) => s.index === f.subtopicIndex);
      if (!section) {
        section = { name: f.subtopic, index: f.subtopicIndex, formulas: [], custom: 1 };
        subtopics.push(section);
      }
      section.formulas.push(f);
    }
    return { ...unit, subtopics: subtopics.sort((a, b) => a.index - b.index) };
  });
}
