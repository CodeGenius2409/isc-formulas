import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveChunk } from '../../src/data/resolve';
import type { Chunk, Formula, Manifest, SharedEntry } from '../../src/data/types';
import { allEntries, getEntry } from '../../src/solver/registry';
import { addDays, isDue, newItem, reviewOrder, schedule, type Quality, type SrsItem } from '../../src/practice/srs';
import { conceptQuestion, markNumeric, numericQuestion, questionSummary, seededRng, splitAtEquals, type NumericQuestion } from '../../src/practice/questions';

const TODAY = '2026-11-01';

describe('SM-2 scheduling', () => {
  const start = () => newItem('x', TODAY);

  it('first correct answer: 1 day, second: 6 days, third: 6 × EF', () => {
    let item = schedule(start(), 4, TODAY);
    expect(item.interval).toBe(1);
    expect(item.due).toBe('2026-11-02');
    expect(item.ef).toBeCloseTo(2.5);

    item = schedule(item, 4, '2026-11-02');
    expect(item.interval).toBe(6);
    expect(item.due).toBe('2026-11-08');

    item = schedule(item, 4, '2026-11-08');
    expect(item.interval).toBe(15); // round(6 × 2.5)
    expect(item.due).toBe('2026-11-23');
  });

  it('applies the published ease-factor formula', () => {
    // EF' = EF + 0.1 − (5−q)(0.08 + (5−q)·0.02)
    const expected: [Quality, number][] = [[5, 2.6], [4, 2.5], [3, 2.36], [2, 2.18], [1, 1.96], [0, 1.7]];
    for (const [q, ef] of expected) expect(schedule(start(), q, TODAY).ef).toBeCloseTo(ef, 5);
  });

  it('never lets the ease factor fall below 1.3', () => {
    let item: SrsItem = start();
    for (let i = 0; i < 10; i++) item = schedule(item, 0, TODAY);
    expect(item.ef).toBe(1.3);
  });

  it('brings a missed item back the same day and resets its run', () => {
    let item = schedule(schedule(start(), 5, TODAY), 5, '2026-11-02');
    expect(item.repetitions).toBe(2);
    item = schedule(item, 1, '2026-11-08');
    expect(item.repetitions).toBe(0);
    expect(item.interval).toBe(0);
    expect(item.due).toBe('2026-11-08');
    expect(item.lapses).toBe(1);
    expect(isDue(item, '2026-11-08')).toBe(true);
  });

  it('a missed item returns sooner than a known one', () => {
    const known = schedule(start(), 4, TODAY);
    const missed = schedule(start(), 1, TODAY);
    expect(missed.due < known.due).toBe(true);
  });

  it('grows intervals with each success', () => {
    let item = start();
    let day = TODAY;
    const intervals: number[] = [];
    for (let i = 0; i < 5; i++) {
      item = schedule(item, 5, day);
      intervals.push(item.interval);
      day = item.due;
    }
    for (let i = 1; i < intervals.length; i++) expect(intervals[i]).toBeGreaterThan(intervals[i - 1]);
  });

  it('orders reviews most overdue first, then hardest', () => {
    const items: SrsItem[] = [
      { ...start(), id: 'later', due: '2026-12-01' },
      { ...start(), id: 'b', due: '2026-10-30', ef: 2.5 },
      { ...start(), id: 'a', due: '2026-10-30', ef: 1.4 },
      { ...start(), id: 'old', due: '2026-10-01' },
    ];
    expect(reviewOrder(items, TODAY).map((i) => i.id)).toEqual(['old', 'a', 'b']);
  });

  it('handles month and year ends', () => {
    expect(addDays('2026-12-30', 5)).toBe('2027-01-04');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
  });
});

describe('numeric questions (tier 1)', () => {
  it('generates a sound question for every registry formula', () => {
    const failures: string[] = [];
    for (const entry of allEntries()) {
      const rng = seededRng(entry.id.length * 7919);
      let question: NumericQuestion | null = null;
      for (let i = 0; i < 5 && !question; i++) question = numericQuestion(entry, rng);
      if (!question) {
        failures.push(`${entry.id}: no valid question (${entry.eq})`);
        continue;
      }
      // Its own answer must mark as correct, and a value far away as wrong.
      const answer = question.answers[0];
      if (!markNumeric(question, String(answer), question.unit).correct) failures.push(`${entry.id}: own answer rejected`);
      const farAway = answer * 1.5 + (answer === 0 ? 1 : 0);
      if (question.answers.length === 1 && markNumeric(question, String(farAway), question.unit).correct) failures.push(`${entry.id}: wrong answer accepted`);
      if (question.steps.length < 2) failures.push(`${entry.id}: no worked solution`);
    }
    expect(failures).toEqual([]);
  });

  const q = (): NumericQuestion => numericQuestion(getEntry('p-xi-4-4')!, seededRng(3), false)!;

  it('marks within tolerance', () => {
    const question = q();
    const a = question.answers[0];
    expect(markNumeric(question, String(a * 1.015), 'J').correct).toBe(true);
    expect(markNumeric(question, String(a * 0.985), 'J').correct).toBe(true);
    expect(markNumeric(question, String(a * 1.05), 'J').correct).toBe(false);
  });

  it('accepts a compatible unit, converted', () => {
    const question = q();
    expect(markNumeric(question, String(question.answers[0] / 1000), 'kJ').correct).toBe(true);
  });

  it('rejects a right number with the wrong kind of unit, and says why', () => {
    const question = q();
    const mark = markNumeric(question, String(question.answers[0]), 'kg');
    expect(mark.correct).toBe(false);
    expect(mark.reason).toMatch(/kg measures \[M\]/);
  });

  it('requires a unit, and an answer', () => {
    const question = q();
    expect(markNumeric(question, String(question.answers[0]), '').reason).toMatch(/unit is needed/);
    expect(markNumeric(question, '', 'J').reason).toMatch(/No answer/);
  });

  it('offers both right and wrong units', () => {
    const question = q();
    expect(question.unitChoices).toContain('J');
    expect(question.unitChoices.length).toBeGreaterThan(2);
  });

  it('is repeatable from a seed', () => {
    const a = numericQuestion(getEntry('p-xi-2-4')!, seededRng(42));
    const b = numericQuestion(getEntry('p-xi-2-4')!, seededRng(42));
    expect(a).toEqual(b);
  });

  it('describes itself in words for the mistakes log', () => {
    expect(questionSummary(q())).toMatch(/^Find potential energy, given mass = /);
  });
});

describe('concept questions (tier 2)', () => {
  const genDir = path.resolve(__dirname, '../../src/data/generated');
  const read = <T,>(f: string) => JSON.parse(fs.readFileSync(path.join(genDir, f), 'utf8')) as T;
  const manifest = read<Manifest>('manifest.json');
  const shared = read<Record<string, SharedEntry>>('shared.json');

  const all: { formula: Formula; pool: Formula[] }[] = [];
  const seen = new Set<string>();
  for (const s of manifest.subjects) {
    for (const c of s.classes) {
      for (const u of resolveChunk(read<Chunk>(c.chunk), shared)) {
        const unitPool = u.subtopics.flatMap((st) => st.formulas);
        for (const st of u.subtopics) {
          for (const f of st.formulas) {
            if (seen.has(f.id)) continue;
            seen.add(f.id);
            all.push({ formula: f, pool: st.formulas.length >= 6 ? st.formulas : unitPool });
          }
        }
      }
    }
  }

  it('covers every formula in the book', () => {
    expect(all.length).toBe(manifest.totals.entries);
    const kinds: Record<string, number> = {};
    const problems: string[] = [];
    all.forEach(({ formula, pool }, i) => {
      const question = conceptQuestion(formula, pool, seededRng(i));
      kinds[question.kind === 'mcq' ? question.mode : question.kind] = (kinds[question.kind === 'mcq' ? question.mode : question.kind] ?? 0) + 1;
      expect(question.formulaId).toBe(formula.id);
      if (question.kind === 'mcq') {
        const right = question.options.filter((o) => o.correct);
        if (right.length !== 1) problems.push(`${formula.id}: ${right.length} correct options`);
        if (question.options.length < 3) problems.push(`${formula.id}: only ${question.options.length} options`);
        const labels = question.options.map((o) => o.latex ?? o.text);
        if (new Set(labels).size !== labels.length) problems.push(`${formula.id}: repeated option`);
      }
    });
    expect(problems).toEqual([]);
    expect(kinds.which).toBeGreaterThan(500);
    expect(kinds.complete).toBeGreaterThan(500);
    expect(kinds.name).toBeGreaterThan(500);
    expect(kinds.recall).toBeGreaterThan(100);
  });

  it('draws distractors from the same topic', () => {
    const target = all.find((a) => a.formula.id === 'p-xi-2-4')!;
    const formulaLatex = new Set(target.pool.map((f) => f.latex));
    for (let seed = 0; seed < 30; seed++) {
      const question = conceptQuestion(target.formula, target.pool, seededRng(seed));
      if (question.kind === 'mcq' && question.mode === 'which') {
        for (const o of question.options) expect(formulaLatex.has(o.latex!)).toBe(true);
      }
    }
  });

  it('falls back to a recall card when there is nothing to choose between', () => {
    const lone = all[0].formula;
    expect(conceptQuestion(lone, [lone], seededRng(1)).kind).toBe('recall');
  });

  it('splits at the first top-level equals sign', () => {
    expect(splitAtEquals('v=u+at')).toEqual(['v', 'u+at']);
    expect(splitAtEquals('\\frac{a=b}{c}=d')).toEqual(['\\frac{a=b}{c}', 'd']);
    expect(splitAtEquals('no equals')).toBeNull();
    expect(splitAtEquals('=x')).toBeNull();
  });
});

describe('mistakes, progress and backup', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.resetModules();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => storage.get(k) ?? null,
      setItem: (k: string, v: string) => void storage.set(k, v),
      removeItem: (k: string) => void storage.delete(k),
    });
  });

  const load = async () => import('../../src/practice/progress');
  const record = (over: Partial<Parameters<Awaited<ReturnType<typeof load>>['recordAnswer']>[0]> = {}) => ({
    question: { kind: 'recall', formulaId: 'p-xi-2-4', name: 'x', latex: 'x' } as const,
    correct: false,
    quality: 1 as const,
    asked: 'What is x?',
    yourAnswer: '5',
    correctAnswer: '6',
    formula: { name: 'x', subject: 'physics', classLevel: 'XI', topic: 'Kinematics' },
    ...over,
  });

  it('logs a wrong answer with everything you asked for', async () => {
    const { recordAnswer, mistakesStore } = await load();
    recordAnswer(record());
    const m = mistakesStore.get()[0];
    expect(m).toMatchObject({ asked: 'What is x?', yourAnswer: '5', correctAnswer: '6', formulaName: 'x', topic: 'Kinematics', resolved: false });
    expect(m.date).toBeTruthy();
  });

  it('does not log a right answer, but schedules it', async () => {
    const { recordAnswer, mistakesStore, srsStore } = await load();
    recordAnswer(record({ correct: true, quality: 4 }));
    expect(mistakesStore.get()).toEqual([]);
    expect(srsStore.get()['p-xi-2-4'].repetitions).toBe(1);
  });

  it('clears a mistake when it is retried correctly', async () => {
    const { recordAnswer, mistakesStore } = await load();
    recordAnswer(record());
    const id = mistakesStore.get()[0].id;
    recordAnswer(record({ correct: true, quality: 4, mistakeId: id }));
    expect(mistakesStore.get()[0].resolved).toBe(true);
    expect(mistakesStore.get().length).toBe(1);
  });

  it('keeps a mistake open when the retry is wrong, without logging it twice', async () => {
    const { recordAnswer, mistakesStore } = await load();
    recordAnswer(record());
    const id = mistakesStore.get()[0].id;
    recordAnswer(record({ mistakeId: id }));
    expect(mistakesStore.get().length).toBe(1);
    expect(mistakesStore.get()[0].resolved).toBe(false);
  });

  it('round-trips through an exported backup', async () => {
    const first = await load();
    first.recordAnswer(record());
    const text = JSON.stringify(first.exportBackup());

    storage.clear();
    vi.resetModules();
    const second = await load();
    expect(second.mistakesStore.get()).toEqual([]);
    const parsed = second.parseBackup(text);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) second.importBackup(parsed.backup);
    expect(second.mistakesStore.get().length).toBe(1);
    expect(second.srsStore.get()['p-xi-2-4']).toBeTruthy();
    expect(second.statsStore.get().answered).toBe(1);
  });

  it('merges without losing newer progress', async () => {
    const { parseBackup, importBackup, srsStore, exportBackup } = await load();
    srsStore.set({ a: { ...newItem('a', TODAY), lastReviewed: '2026-11-05', interval: 9 } });
    const backup = exportBackup();
    backup.srs = { a: { ...newItem('a', TODAY), lastReviewed: '2026-10-01', interval: 1 }, b: { ...newItem('b', TODAY), lastReviewed: '2026-10-01' } };
    const parsed = parseBackup(JSON.stringify(backup));
    if (parsed.ok) importBackup(parsed.backup);
    expect(srsStore.get().a.interval).toBe(9);
    expect(srsStore.get().b).toBeTruthy();
  });

  it('migrates old ids in an imported backup', async () => {
    const { parseBackup, importBackup, exportBackup, srsStore } = await load();
    const backup = exportBackup();
    backup.srs = { 'p-xii-8-35': { ...newItem('p-xii-8-35', TODAY), lastReviewed: '2026-10-01' } };
    backup.favourites = ['p-xii-8-35'];
    const parsed = parseBackup(JSON.stringify(backup));
    if (parsed.ok) importBackup(parsed.backup);
    expect(srsStore.get()['p-xi-1-176']).toBeTruthy();
  });

  it('refuses bad files with a clear message', async () => {
    const { parseBackup } = await load();
    expect(parseBackup('not json')).toMatchObject({ ok: false, error: expect.stringMatching(/not valid JSON/) });
    expect(parseBackup('{"a":1}')).toMatchObject({ ok: false, error: expect.stringMatching(/not a backup/) });
    expect(parseBackup('{"app":"isc-formula-book","version":99}')).toMatchObject({ ok: false, error: expect.stringMatching(/version 99/) });
    expect(parseBackup('{"app":"isc-formula-book","version":1}')).toMatchObject({ ok: false, error: expect.stringMatching(/incomplete/) });
  });

  it('survives storage that throws', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    });
    const { recordAnswer, mistakesStore } = await load();
    expect(() => recordAnswer(record())).not.toThrow();
    expect(mistakesStore.get().length).toBe(1);
  });
});
