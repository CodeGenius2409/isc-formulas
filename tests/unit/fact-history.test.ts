// A fact stays away for the gap you've set, unless its review falls due, and a paper is never short for it.
import { beforeEach, describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import { assemblePaper, repeatNoteFor, unitWeightsForTest } from '../../src/practice/bank/paper';
import { loadBank } from '../../src/practice/bank';
import { cleanGap, DEFAULT_GAP_DAYS, factGapStore, historyFreshness, noteFactsAnswered, noteFactsShown, resetFactHistory, seenFactsStore } from '../../src/practice/fact-history';
import { defKeys, historyKeys, pickGenerated, usedFreshness } from '../../src/practice/gen/mix';
import { allItems, buildFullPaper, buildQuestionSet, emptyFilters, makeSets, officialStructure, recentPaperFreshness, savePaper, teacherHistoryStore } from '../../src/practice/gen/teacher';
import { mistakesStore, recordAnswer, srsStore, studentFreshness } from '../../src/practice/progress';
import { seededRng, type Question } from '../../src/practice/questions';
import { startReview, startUnit, sessionStore } from '../../src/practice/session';
import { QUALITY_WRONG, addDays, dayString } from '../../src/practice/srs';

const DAY = 86_400_000;
const never = () => false;

beforeEach(async () => {
  await resetFactHistory();
  factGapStore.set(DEFAULT_GAP_DAYS);
  srsStore.set({});
  mistakesStore.set([]);
  teacherHistoryStore.set([]);
});

describe('the gap', () => {
  it('holds a fact back for seven days, by default, and not a moment more', () => {
    const start = 1_000_000_000_000;
    noteFactsShown(['a'], start);
    expect(historyFreshness(never, start + 6.9 * DAY).resting(['a'])).toBe(true);
    expect(historyFreshness(never, start + 7 * DAY).resting(['a'])).toBe(false);
    expect(historyFreshness(never, start).resting(['b'])).toBe(false);
  });

  it('can be changed in days, and zero turns it off', () => {
    const start = 1_000_000_000_000;
    noteFactsShown(['a'], start);
    expect(historyFreshness(never, start + 2 * DAY, 3).resting(['a'])).toBe(true);
    expect(historyFreshness(never, start + 3 * DAY, 3).resting(['a'])).toBe(false);
    expect(historyFreshness(never, start, 0).resting(['a'])).toBe(false);
    expect(cleanGap(Number.NaN)).toBe(DEFAULT_GAP_DAYS);
    expect(cleanGap(-4)).toBe(0);
    expect(cleanGap(2.4)).toBe(2);
  });

  it('is forgotten by a reset', async () => {
    noteFactsShown(['a', 'b']);
    expect(Object.keys(seenFactsStore.get())).toHaveLength(2);
    await resetFactHistory();
    expect(seenFactsStore.get()).toEqual({});
    expect(historyFreshness(never).resting(['a'])).toBe(false);
  });

  it('lets a fact you got wrong through only when its review is due', () => {
    const start = 1_000_000_000_000;
    noteFactsShown(['a'], start);
    noteFactsAnswered(['a'], 'item-1', false);
    expect(historyFreshness(() => false, start + DAY).resting(['a'])).toBe(true);
    expect(historyFreshness((id) => id === 'item-1', start + DAY).resting(['a'])).toBe(false);
    noteFactsAnswered(['a'], 'item-1', true);
    expect(historyFreshness((id) => id === 'item-1', start + DAY).resting(['a'])).toBe(true);
  });

  it('says so briefly when the unseen ones have run out, and says nothing when they haven’t', () => {
    expect(repeatNoteFor(0, 7)).toBeUndefined();
    expect(repeatNoteFor(1, 7)).toContain('1 question comes');
    expect(repeatNoteFor(3, 7)).toContain('the last 7 days');
    expect(repeatNoteFor(3, 1)).toContain('the last day');
  });
});

/** Facts from questions in a session, or a paper. */
const keysOfSession = () => sessionStore.get()!.items.flatMap((i) => (i.question.kind === 'bank' ? historyKeys(i.question) : []));

describe('in simulated sessions', () => {
  it('shows nothing again within seven days while unseen facts remain', async () => {
    const shown = new Set<string>();
    for (let round = 0; round < 8; round++) {
      await startUnit('physics', 'XII', 2, undefined, { share: 100 });
      const keys = keysOfSession();
      expect(new Set(keys).size, 'repeated in a session').toBe(keys.length);
      const facts = keys.filter((k) => k.includes(':'));
      for (const k of facts) expect(shown.has(k), `${k} came back in round ${round}`).toBe(false);
      for (const k of facts) shown.add(k);
      noteFactsShown(keys);
    }
  }, 60_000);

  it('after the gap, the same facts may come back', async () => {
    const start = Date.now() - 10 * DAY;
    await startUnit('physics', 'XII', 2, undefined, { share: 100 });
    const keys = keysOfSession();
    noteFactsShown(keys, start);
    expect(studentFreshness().resting(keys)).toBe(false);
  });

  it('never gives fewer questions when the facts have run out, and says so', async () => {
    const set = await loadBlueprints('physics', 'XII');
    const pool = set.blueprints.filter((b) => b.unit === 3 && b.topic === 'b');
    const everything = pool.flatMap((bp) => Array.from({ length: 150 }, (_, k) => historyKeys(pickOne(set, bp, k)))).flat();
    const bank = await loadBank('physics', 'XII');
    noteFactsShown([...everything, ...bank.defs.filter((d) => d.unit === 3 && d.topic === 'b').flatMap(defKeys)], Date.now() - DAY);
    await startUnit('physics', 'XII', 3, undefined, { topic: 'b', share: 100 });
    const session = sessionStore.get()!;
    expect(session.items.length).toBe(10);
    expect(session.note).toContain('longest ago');
  }, 60_000);

  it('takes the least recently seen first when they have run out', async () => {
    const set = await loadBlueprints('physics', 'XII');
    const bp = set.blueprints.find((b) => b.id.endsWith('-define') && b.unit === 1)!;
    const seen = new Map<string, number>();
    const all: string[] = [];
    for (let k = 1; k <= 150; k++) {
      for (const key of historyKeys(pickOne(set, bp, k))) if (!seen.has(key)) {
        seen.set(key, 1000 + seen.size);
        all.push(key);
      }
    }
    const fresh = usedFreshness(seen);
    const [q] = pickGenerated(set, [bp], { count: 1, rng: seededRng(5), fresh });
    expect(historyKeys(q)).toEqual([all[0]]);
    expect(pickGenerated(set, [bp], { count: 1, rng: seededRng(5), fresh, freshOnly: true })).toEqual([]);
  });
});

import { generatedQuestion } from '../../src/practice/gen/engine';
import type { LoadedBlueprints } from '../../src/data/blueprints';
import type { Blueprint } from '../../src/data/blueprints/types';
const pickOne = (set: LoadedBlueprints, bp: Blueprint, k: number) => generatedQuestion(bp, k * 7919, set.names(bp));

describe('spaced repetition', () => {
  it('a wrong answer still comes back on schedule, even though its fact is resting', async () => {
    const set = await loadBlueprints('physics', 'XII');
    const bp = set.blueprints.find((b) => b.id.endsWith('-define') && b.unit === 1)!;
    const question = pickOne(set, bp, 3);
    noteFactsShown(historyKeys(question));
    recordAnswer({ question: question as Question, correct: false, quality: QUALITY_WRONG, asked: 'x', yourAnswer: 'y', correctAnswer: 'z', formula: { name: 'n', subject: 'physics', classLevel: 'XII', topic: 't' } });
    const item = srsStore.get()[question.formulaId];
    expect(item).toBeDefined();
    // Not due yet, so it rests.
    srsStore.set((all) => ({ ...all, [question.formulaId]: { ...item, due: addDays(dayString(new Date()), 2) } }));
    expect(studentFreshness().resting(historyKeys(question))).toBe(true);
    // Its day comes: it's no longer held back, and the review session asks it.
    srsStore.set((all) => ({ ...all, [question.formulaId]: { ...item, due: addDays(dayString(new Date()), -1) } }));
    expect(studentFreshness().resting(historyKeys(question))).toBe(false);
    const review = await startReview();
    expect(review?.items.map((i) => i.question.formulaId)).toContain(question.formulaId);
  });
});

describe('in a mock paper', () => {
  for (const subject of ['physics', 'chemistry', 'mathematics', 'computerscience'] as const) {
    it(`${subject}: no fact twice, and two papers in a row share none while there are others`, async () => {
      const [bank, set, weights] = await Promise.all([loadBank(subject, 'XII'), loadBlueprints(subject, 'XII'), unitWeightsForTest(subject, 'XII')]);
      const first = assemblePaper(subject, 'XII', bank, weights, seededRng(1), 0, { set, share: 100 });
      const factsOne = first.sections.flatMap((s) => s.questions.flatMap((q) => q.item.facts ?? []));
      expect(new Set(factsOne).size).toBe(factsOne.length);
      noteFactsShown(factsOne);
      const second = assemblePaper(subject, 'XII', bank, weights, seededRng(2), 0, { set, share: 100, fresh: studentFreshness() });
      const factsTwo = second.sections.flatMap((s) => s.questions.flatMap((q) => q.item.facts ?? []));
      expect(new Set(factsTwo).size).toBe(factsTwo.length);
      const again = factsTwo.filter((f) => factsOne.includes(f));
      expect(again.length, again.join('\n')).toBeLessThanOrEqual(Math.ceil(factsTwo.length * 0.1));
    }, 60_000);
  }

  it('is still whole when everything has been seen', async () => {
    const [bank, set, weights] = await Promise.all([loadBank('physics', 'XII'), loadBlueprints('physics', 'XII'), unitWeightsForTest('physics', 'XII')]);
    noteFactsShown(bank.defs.flatMap(defKeys), Date.now() - DAY);
    const plain = assemblePaper('physics', 'XII', bank, weights, seededRng(1), 0, { set, share: 0 });
    const paper = assemblePaper('physics', 'XII', bank, weights, seededRng(1), 0, { set, share: 0, fresh: studentFreshness() });
    expect(paper.sections.map((s) => s.questions.length)).toEqual(plain.sections.map((s) => s.questions.length));
  });
});

describe('for a teacher', () => {
  const physics = () => ({ ...emptyFilters('physics'), levels: ['XII' as const], units: ['XII 3'], share: 100 });

  it('avoids facts from saved papers, and still gives the count when they run out', async () => {
    const first = await buildQuestionSet(physics(), { mode: 'count', value: 12 }, 'Physics', 1);
    savePaper(first);
    const used = new Set(allItems(first).flatMap((i) => i.question.item.facts ?? []));
    const fresh = recentPaperFreshness();
    const next = await buildQuestionSet(physics(), { mode: 'count', value: 12 }, 'Physics', 2, new Set(), fresh);
    expect(allItems(next)).toHaveLength(12);
    expect(allItems(next).flatMap((i) => i.question.item.facts ?? []).filter((f) => used.has(f))).toEqual([]);
    expect(next.repeatNote).toBeUndefined();

    // A narrow choice with everything used: full count, and a note.
    const narrow = { ...physics(), units: [], topics: ['XII 3 b'], formats: ['mcq' as const] };
    const many = await buildQuestionSet(narrow, { mode: 'count', value: 6 }, 'Physics', 3);
    savePaper(many);
    const full = await buildQuestionSet(narrow, { mode: 'count', value: 6 }, 'Physics', 4, new Set(), usedFreshness(new Map(allItems(many).flatMap((i) => historyKeys(i.question)).map((k) => [k, 1]))));
    expect(allItems(full)).toHaveLength(6);
  }, 60_000);

  it('sets A, B and C use different facts where the material allows', async () => {
    const paper = await buildFullPaper({ ...emptyFilters('physics'), share: 100 }, 'XII', officialStructure('physics', 'XII'), 'Physics', 9);
    const [a, b, c] = await makeSets(paper, ['A', 'B', 'C'], 40);
    const factsIn = (p: typeof a) => allItems(p).flatMap((i) => i.question.item.facts ?? []);
    const [fa, fb, fc] = [factsIn(a), factsIn(b), factsIn(c)];
    expect(fa.length).toBeGreaterThan(5);
    expect(fb.filter((f) => fa.includes(f))).toEqual([]);
    expect(fc.filter((f) => fa.includes(f) || fb.includes(f))).toEqual([]);
    for (const set of [fa, fb, fc]) expect(new Set(set).size).toBe(set.length);
  }, 120_000);
});
