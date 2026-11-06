// Every blueprint is marked reviewed or not, from its class's review file. Unreviewed ones stay in use, with a note,
// and "Only reviewed questions" keeps to the reviewed ones, saying so when it can't.
import { afterEach, describe, expect, it } from 'vitest';
import { applyReviews, loadBlueprints, type LoadedBlueprints } from '../../src/data/blueprints';
import type { Blueprint, Reviews } from '../../src/data/blueprints/types';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { generateItem } from '../../src/practice/gen/engine';
import { assemblePaper, paperReviewedOnlyStore, reviewNoteFor, unitWeightsForTest } from '../../src/practice/bank/paper';
import { loadBank } from '../../src/practice/bank';
import { seededRng } from '../../src/practice/questions';
import { allItems, blueprintMatches, buildQuestionSet, countAvailable, emptyFilters, teacherReviewedOnlyStore } from '../../src/practice/gen/teacher';

const CLASSES: [SubjectId, ClassLevel][] = [
  ['physics', 'XII'], ['physics', 'XI'], ['chemistry', 'XII'], ['chemistry', 'XI'],
  ['mathematics', 'XII'], ['mathematics', 'XI'], ['computerscience', 'XII'], ['computerscience', 'XI'],
];
const FILES = import.meta.glob<{ default: Reviews }>('../../src/data/blueprints/reviews/*.ts', { eager: true });

describe('the review files', () => {
  it('mark every blueprint reviewed or not, and name only blueprints that exist', async () => {
    const ids = new Set<string>();
    for (const [subject, level] of CLASSES) {
      const set = await loadBlueprints(subject, level);
      for (const bp of set.blueprints) {
        expect(typeof bp.reviewed, bp.id).toBe('boolean');
        if (bp.flag) expect(bp.reviewed, bp.id).toBe(false);
        ids.add(bp.id);
      }
    }
    const today = new Date().toISOString().slice(0, 10);
    for (const [file, { default: rows }] of Object.entries(FILES)) {
      for (const [id, [date, note, flag]] of Object.entries(rows)) {
        expect(ids.has(id), `${file}: ${id}`).toBe(true);
        expect(date, id).toMatch(/^2026-\d\d-\d\d$/);
        expect(date <= today, id).toBe(true);
        expect(note.trim().length, id).toBeGreaterThan(3);
        if (flag !== undefined) expect(flag.trim().length, id).toBeGreaterThan(3);
      }
    }
  });

  it('a flagged blueprint counts as not reviewed, and one with no row too', () => {
    const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }] as Blueprint[];
    applyReviews(list, { a: ['2026-11-06', 'Checked.'], b: ['2026-11-06', 'Read.', 'The answer depends on a convention.'] });
    expect(list.map((b) => b.reviewed)).toEqual([true, false, false]);
    expect(list[1].flag).toBe('The answer depends on a convention.');
    expect(list[0].review).toEqual({ date: '2026-11-06', note: 'Checked.' });
  });
});

describe('a generated question', () => {
  it('carries "not yet reviewed" only when its blueprint is unreviewed', async () => {
    const set = await loadBlueprints('physics', 'XII');
    const names = set.names(set.blueprints[0]);
    const bp = { ...set.blueprints[0] };
    bp.reviewed = false;
    expect(generateItem(bp, 5, names).generated?.unreviewed).toBe(true);
    bp.reviewed = true;
    expect(generateItem(bp, 5, names).generated?.unreviewed).toBeUndefined();
  });
});

describe('"Only reviewed questions"', () => {
  const saved = new Map<Blueprint, boolean | undefined>();
  const only = (set: LoadedBlueprints, keep: (bp: Blueprint, i: number) => boolean) =>
    set.blueprints.forEach((bp, i) => {
      if (!saved.has(bp)) saved.set(bp, bp.reviewed);
      bp.reviewed = keep(bp, i);
    });
  afterEach(() => {
    for (const [bp, was] of saved) bp.reviewed = was;
    saved.clear();
  });

  it('is off by default on both screens', () => {
    expect(paperReviewedOnlyStore.get()).toBe(false);
    expect(teacherReviewedOnlyStore.get()).toBe(false);
  });

  it('keeps a mock paper to reviewed blueprints while there are enough', async () => {
    const [bank, set, weights] = await Promise.all([loadBank('physics', 'XII'), loadBlueprints('physics', 'XII'), unitWeightsForTest('physics', 'XII')]);
    only(set, (_, i) => i % 3 !== 0);
    const paper = assemblePaper('physics', 'XII', bank, weights, seededRng(3), 0, { set, share: 100, reviewedOnly: true });
    const made = paper.sections.flatMap((s) => s.questions).filter((q) => q.item.generated);
    expect(made.length).toBeGreaterThan(5);
    expect(made.every((q) => set.byId.get(q.item.generated!.blueprint)!.reviewed)).toBe(true);
    expect(paper.reviewNote).toBeUndefined();
    // Without the option, unreviewed ones come too.
    const mixed = assemblePaper('physics', 'XII', bank, weights, seededRng(3), 0, { set, share: 100 });
    expect(mixed.sections.flatMap((s) => s.questions).some((q) => q.item.generated && !set.byId.get(q.item.generated.blueprint)!.reviewed)).toBe(true);
  });

  it('never leaves a mock paper short: unreviewed ones fill what nothing else can, with a note', async () => {
    const [bank, set, weights] = await Promise.all([loadBank('physics', 'XII'), loadBlueprints('physics', 'XII'), unitWeightsForTest('physics', 'XII')]);
    only(set, () => false);
    const plain = assemblePaper('physics', 'XII', bank, weights, seededRng(4), 0, { set, share: 100 });
    const paper = assemblePaper('physics', 'XII', bank, weights, seededRng(4), 0, { set, share: 100, reviewedOnly: true });
    const count = (p: typeof paper) => p.sections.reduce((n, s) => n + s.questions.length, 0);
    expect(count(paper)).toBe(count(plain));
    const filled = paper.sections.flatMap((s) => s.questions).filter((q) => q.item.generated).length;
    expect(paper.reviewNote).toBe(reviewNoteFor(filled));
    if (filled) expect(paper.reviewNote).toMatch(/not yet reviewed/);
  });

  it('narrows the teacher’s choices, and the counts say so before generating', async () => {
    const set = await loadBlueprints('chemistry', 'XII');
    only(set, (bp) => bp.unit === 1);
    const all = emptyFilters('chemistry');
    const f = { ...all, levels: ['XII' as const], reviewedOnly: true, share: 100 };
    expect(set.blueprints.filter((bp) => blueprintMatches(bp, f)).every((bp) => bp.unit === 1)).toBe(true);
    const wide = await countAvailable({ ...f, reviewedOnly: false });
    const narrow = await countAvailable(f);
    expect(narrow.blueprints).toBeLessThan(wide.blueprints);
    expect(narrow.blueprints).toBe(set.blueprints.filter((bp) => bp.unit === 1).length);
    const paper = await buildQuestionSet({ ...f, units: ['XII 1'] }, { mode: 'count', value: 6 }, 'Chemistry', 11);
    const made = allItems(paper).filter((i) => i.question.item.generated);
    expect(made.length).toBeGreaterThan(0);
    expect(made.every((i) => set.byId.get(i.question.item.generated!.blueprint)!.reviewed)).toBe(true);
  });
});
