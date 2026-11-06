import { describe, expect, it } from 'vitest';
import { questionKey } from '../../src/practice/gen/mix';
import { allItems, blueprintMatches, buildFullPaper, buildQuestionSet, deleteItem, emptyFilters, makeSets, moveItem, officialStructure, paperFromFile, paperToFile, regenerateItem, regenerateUnlocked, totalMarks, updateItem, type Filters } from '../../src/practice/gen/teacher';
import { loadBlueprints } from '../../src/data/blueprints';
import { describePlan, planShare } from '../../src/practice/gen/mix';

const filters = (change: Partial<Filters> = {}): Filters => ({ ...emptyFilters('physics'), levels: ['XII'], ...change });

const generatedShare = (items: { question: { item: { generated?: unknown } } }[]) => items.filter((i) => i.question.item.generated).length;

describe('filters', () => {
  it('combine, and an empty filter means all', async () => {
    const set = await loadBlueprints('physics', 'XII');
    const all = set.blueprints.filter((b) => blueprintMatches(b, filters()));
    expect(all.length).toBe(set.blueprints.length);
    const narrow = set.blueprints.filter((b) => blueprintMatches(b, filters({ formats: ['numerical'], marks: [3], units: ['XII 6'], styles: ['paper-style'] })));
    expect(narrow.length).toBeGreaterThan(0);
    for (const b of narrow) {
      expect(b.format).toBe('numerical');
      expect(b.marks).toBe(3);
      expect(b.unit).toBe(6);
      expect(b.style).toBe('paper-style');
    }
  });

  it('a chosen topic narrows its unit, and leaves other chosen units whole', async () => {
    const set = await loadBlueprints('physics', 'XII');
    const hits = set.blueprints.filter((b) => blueprintMatches(b, filters({ units: ['XII 6', 'XII 1'], topics: ['XII 6 c'] })));
    expect(hits.some((b) => b.unit === 1)).toBe(true);
    expect(hits.filter((b) => b.unit === 6).every((b) => b.topic === 'c')).toBe(true);
    expect(hits.every((b) => b.unit === 1 || b.unit === 6)).toBe(true);
  });

  it('every filter applies to what is actually drawn', async () => {
    const paper = await buildQuestionSet(filters({ formats: ['mcq'], marks: [1], difficulties: [1], share: 100 }), { mode: 'count', value: 8 }, 'Physics', 7);
    expect(allItems(paper).length).toBe(8);
    for (const { question: { item } } of allItems(paper)) {
      expect(item.marks).toBe(1);
      expect(item.form).toBe('mcq');
      expect(item.difficulty).toBe(1);
    }
  });
});

describe('the share', () => {
  it.each([0, 25, 50, 75, 100])('%i%% is respected within one question', async (share) => {
    const paper = await buildQuestionSet(filters({ share }), { mode: 'count', value: 20 }, 'Physics', 100 + share);
    expect(allItems(paper).length).toBe(20);
    expect(Math.abs(generatedShare(allItems(paper)) - (20 * share) / 100)).toBeLessThanOrEqual(1);
  });

  it('is described in words, and raised when the bank is too small', () => {
    const plan = planShare([{ marks: 2, count: 35, bankHas: 100 }], 35);
    expect(plan.generated).toBe(12);
    expect(describePlan(plan)).toBe('About 12 of 35 questions (24 of 70 marks) will be generated.');
    const raised = planShare([{ marks: 1, count: 10, bankHas: 4 }], 0);
    expect(raised.share).toBe(55);
    expect(raised.raised).toContain('at least 55%');
    expect(describePlan(planShare([{ marks: 1, count: 10, bankHas: 10 }], 0))).toBe('Every question will come from the bank.');
    expect(describePlan(planShare([{ marks: 1, count: 10, bankHas: 10 }], 100))).toBe('All 10 questions (10 marks) will be generated.');
  });
});

describe('question sets', () => {
  it('reach a target of marks exactly', async () => {
    for (const target of [10, 25, 40]) {
      const paper = await buildQuestionSet(filters(), { mode: 'marks', value: target }, 'Physics', target);
      expect(totalMarks(paper)).toBe(target);
      expect(paper.shortfall).toBeUndefined();
    }
  });

  it('say so when the choices can’t reach the number asked for', async () => {
    const paper = await buildQuestionSet(filters({ share: 0, units: ['XII 5'], marks: [5] }), { mode: 'count', value: 50 }, 'Physics', 1);
    expect(paper.shortfall).toMatch(/could be found/);
  });

  it('have no repeated question', async () => {
    const paper = await buildQuestionSet(filters({ share: 50 }), { mode: 'count', value: 40 }, 'Physics', 5);
    const keys = allItems(paper).map((i) => i.key);
    // "Which of these statements is correct?" can head two different questions, so the options count too.
    const texts = allItems(paper).map((i) => questionKey(i.question));
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(texts).size).toBe(texts.length);
  });

  it('leave out what they’re told to avoid', async () => {
    const first = await buildQuestionSet(filters({ share: 0 }), { mode: 'count', value: 12 }, 'Physics', 9);
    const avoid = new Set(allItems(first).map((i) => i.key));
    const second = await buildQuestionSet(filters({ share: 0 }), { mode: 'count', value: 12 }, 'Physics', 10, avoid);
    for (const i of allItems(second)) expect(avoid.has(i.key)).toBe(false);
  });

  it('the same seed builds the same set', async () => {
    const a = await buildQuestionSet(filters(), { mode: 'count', value: 10 }, 'Physics', 42);
    const b = await buildQuestionSet(filters(), { mode: 'count', value: 10 }, 'Physics', 42);
    expect(allItems(a).map((i) => i.key)).toEqual(allItems(b).map((i) => i.key));
  });
});

describe('full papers', () => {
  it.each([
    ['physics', 'XII', 70],
    ['chemistry', 'XII', 70],
    ['mathematics', 'XII', 80],
    ['computerscience', 'XII', 70],
    ['physics', 'XI', 70],
    ['chemistry', 'XI', 70],
    ['mathematics', 'XI', 80],
    ['computerscience', 'XI', 70],
  ] as const)('%s %s follows the official structure, at any share', async (subject, level, total) => {
    for (const share of [0, 50, 100]) {
      const paper = await buildFullPaper({ ...emptyFilters(subject), share }, level, officialStructure(subject, level), subject, share + 3);
      expect(paper.shortfall).toBeUndefined();
      expect(totalMarks(paper)).toBe(total);
    }
  });

  it('can follow a custom structure', async () => {
    const paper = await buildFullPaper(filters(), 'XII', [{ name: 'Part A', count: 4, marks: 2, formats: ['numerical'] }, { name: 'Part B', count: 3, marks: 5, formats: [], choose: 2 }], 'Physics', 3);
    expect(paper.sections.map((s) => s.items.length)).toEqual([4, 3]);
    expect(totalMarks(paper)).toBe(18);
    expect(paper.sections[1].note).toBe('Answer any 2.');
  });
});

describe('reviewing', () => {
  it('replaces one question and leaves the rest', async () => {
    const paper = await buildQuestionSet(filters({ share: 100 }), { mode: 'count', value: 6 }, 'Physics', 11);
    const target = allItems(paper)[2];
    const next = await regenerateItem(paper, target.key, 99);
    const items = allItems(next);
    expect(items[2].key).not.toBe(target.key);
    expect(items[2].question.item.marks).toBe(target.question.item.marks);
    expect(items.filter((_, i) => i !== 2).map((i) => i.key)).toEqual(allItems(paper).filter((_, i) => i !== 2).map((i) => i.key));
  });

  it('locked questions survive regeneration', async () => {
    let paper = await buildQuestionSet(filters({ share: 100 }), { mode: 'count', value: 6 }, 'Physics', 12);
    const keep = allItems(paper)[1];
    paper = updateItem(paper, keep.key, { locked: true });
    const one = await regenerateItem(paper, keep.key, 5);
    expect(allItems(one)[1].key).toBe(keep.key);
    const all = await regenerateUnlocked(paper, 77);
    expect(allItems(all)[1].key).toBe(keep.key);
    expect(allItems(all).filter((i) => i.key !== keep.key).some((i) => allItems(paper).some((p) => p.key === i.key))).toBe(false);
  });

  it('moves, deletes and keeps edited wording', async () => {
    const paper = await buildQuestionSet(filters(), { mode: 'count', value: 4 }, 'Physics', 13);
    const [a, b] = allItems(paper);
    const moved = moveItem(paper, a.key, 1);
    expect(allItems(moved)[0].key).toBe(b.key);
    expect(allItems(moved)[1].key).toBe(a.key);
    expect(allItems(moveItem(paper, a.key, -1))[0].key).toBe(a.key);
    expect(allItems(deleteItem(paper, a.key)).length).toBe(3);
    const edited = updateItem(paper, b.key, { editedText: 'My own wording' });
    expect(allItems(edited)[1].editedText).toBe('My own wording');
  });
});

describe('sets A, B and C', () => {
  it('differ, but have the same structure', async () => {
    const paper = await buildFullPaper({ ...emptyFilters('physics'), share: 100 }, 'XII', officialStructure('physics', 'XII'), 'Physics', 21);
    const [a, b, c] = await makeSets(paper, ['A', 'B', 'C'], 500);
    expect([a.setName, b.setName, c.setName]).toEqual(['A', 'B', 'C']);
    const shape = (p: typeof paper) => p.sections.map((s) => s.items.map((i) => i.question.item.marks));
    expect(shape(b)).toEqual(shape(a));
    expect(shape(c)).toEqual(shape(a));
    const keys = (p: typeof paper) => new Set(allItems(p).map((i) => i.key));
    expect([...keys(a)].filter((k) => keys(b).has(k)).length).toBe(0);
    expect([...keys(b)].filter((k) => keys(c).has(k)).length).toBe(0);
    expect(totalMarks(b)).toBe(totalMarks(a));
  });

  it('share any locked question', async () => {
    let paper = await buildQuestionSet(filters({ share: 100 }), { mode: 'count', value: 5 }, 'Physics', 22);
    const keep = allItems(paper)[0].key;
    paper = updateItem(paper, keep, { locked: true });
    const sets = await makeSets(paper, ['A', 'B'], 900);
    expect(allItems(sets[1])[0].key).toBe(keep);
    expect(allItems(sets[1])[1].key).not.toBe(allItems(sets[0])[1].key);
  });
});

describe('files', () => {
  it('a saved paper reopens exactly', async () => {
    const paper = await buildQuestionSet(filters(), { mode: 'count', value: 5 }, 'Physics', 31);
    const again = paperFromFile(paperToFile(paper));
    expect(again).toEqual(JSON.parse(JSON.stringify(paper)));
  });

  it('a file from elsewhere is refused in words', () => {
    expect(() => paperFromFile('{"hello":1}')).toThrow('not a paper from this app');
    expect(() => paperFromFile('not json')).toThrow();
  });
});
