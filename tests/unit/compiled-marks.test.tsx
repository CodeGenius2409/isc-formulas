// Compiled bank questions are frozen from blueprints and weren't read one by one, so they're marked as generated questions are,
// and the slider counts them as generated. Hand-written and fact-based bank questions are the bank's side.
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BANK_NOTICE, BankNote, GENERATED_NOTICE, GeneratedMark, GeneratedNote } from '../../src/components/bank/GeneratedMark';
import { loadBlueprints } from '../../src/data/blueprints';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { bankQuestion, loadBank } from '../../src/practice/bank';
import { isMarkedGenerated } from '../../src/practice/bank/define';
import { assemblePaper, paperSlots, unitWeightsForTest } from '../../src/practice/bank/paper';
import type { BankDef, BankItem } from '../../src/practice/bank/types';
import { distinctCount, planShare } from '../../src/practice/gen/mix';
import { allItems, buildFullPaper, buildQuestionSet, capacityOf, emptyFilters, officialStructure } from '../../src/practice/gen/teacher';
import { generatedQuestion } from '../../src/practice/gen/engine';
import { seededRng } from '../../src/practice/questions';

const CLASSES: [SubjectId, ClassLevel][] = [['physics', 'XI'], ['physics', 'XII'], ['chemistry', 'XI'], ['chemistry', 'XII'], ['mathematics', 'XI'], ['mathematics', 'XII'], ['computerscience', 'XI'], ['computerscience', 'XII']];

const shown = (item: BankItem) => ({
  mark: renderToStaticMarkup(<GeneratedMark item={item} />),
  note: renderToStaticMarkup(<GeneratedNote item={item} />),
  bankNote: renderToStaticMarkup(<BankNote item={item} />),
});

describe.each(CLASSES)('%s %s', (subject, level) => {
  it('marks every compiled question, and no hand-written or fact-based one, once built', async () => {
    const bank = await loadBank(subject, level);
    const rng = seededRng(1);
    const seen = { compiled: 0, facts: 0, written: 0 };
    for (const def of bank.defs) {
      const origin = def.origin ?? 'written';
      // Every definition's own tag, and a built attempt at a sample of them, since a numerical is rebuilt from its parts.
      expect(isMarkedGenerated(def), def.id).toBe(origin === 'compiled');
      if (seen[origin]++ < 40) {
        const { item } = bankQuestion(def, bank, rng);
        expect(item.origin ?? 'written', def.id).toBe(origin);
        expect(isMarkedGenerated(item), def.id).toBe(origin === 'compiled');
      }
    }
    expect(seen.compiled).toBeGreaterThan(0);
    expect(seen.written).toBeGreaterThan(0);
  });

  it('shows a compiled question with the label and the note, and the others with the calm note', async () => {
    const bank = await loadBank(subject, level);
    const rng = seededRng(2);
    const compiled = bank.defs.find((d) => d.origin === 'compiled')!;
    const c = shown(bankQuestion(compiled, bank, rng).item);
    expect(c.mark).toContain('Generated');
    expect(c.mark).toContain('may contain mistakes');
    expect(c.note).toContain(GENERATED_NOTICE);
    expect(c.bankNote).toBe('');
    for (const def of [bank.defs.find((d) => d.origin === 'facts'), bank.defs.find((d) => !d.origin || d.origin === 'written')]) {
      if (!def) continue;
      const other = shown(bankQuestion(def, bank, rng).item);
      expect(other.mark, def.id).toBe('');
      expect(other.note, def.id).toBe('');
      expect(other.bankNote, def.id).toContain(BANK_NOTICE);
    }
  });
});

describe('what stays as it was', () => {
  it('still marks a question generated from a blueprint', async () => {
    const set = await loadBlueprints('physics', 'XII');
    const bp = set.blueprints[0];
    expect(isMarkedGenerated(generatedQuestion(bp, 7919, set.names(bp)).item)).toBe(true);
  });

  it('does not give a compiled question the tag of one made just now, which swapping and repeat tracking read', async () => {
    const bank = await loadBank('physics', 'XII');
    const { item } = bankQuestion(bank.defs.find((d) => d.origin === 'compiled')!, bank, seededRng(1));
    expect(item.generated).toBeUndefined();
  });
});

describe('the slider counts compiled questions as generated', () => {
  it.each(CLASSES)('%s %s: a mock paper at 0%% has none, and says it can fill itself', async (subject, level) => {
    const [bank, set, weights] = await Promise.all([loadBank(subject, level), loadBlueprints(subject, level), unitWeightsForTest(subject, level)]);
    expect(planShare(paperSlots(subject, level, bank), 0).raised).toBeUndefined();
    for (let seed = 1; seed <= 6; seed++) {
      const items = assemblePaper(subject, level, bank, weights, seededRng(seed), 0, { set, share: 0 }).sections.flatMap((s) => s.questions.map((q) => q.item));
      expect(items.filter(isMarkedGenerated).map((i) => i.id)).toEqual([]);
    }
  });

  it.each(CLASSES)('%s %s: a mock paper at 50%% and 100%% has about that share marked', async (subject, level) => {
    const [bank, set, weights] = await Promise.all([loadBank(subject, level), loadBlueprints(subject, level), unitWeightsForTest(subject, level)]);
    for (const share of [50, 100]) {
      const items = assemblePaper(subject, level, bank, weights, seededRng(11), 0, { set, share }).sections.flatMap((s) => s.questions.map((q) => q.item));
      expect(Math.abs(items.filter(isMarkedGenerated).length / items.length - share / 100), `${share}%`).toBeLessThanOrEqual(0.15);
    }
  });

  it('a paper at 0% that can’t be filled refuses, in words, rather than using generated questions', async () => {
    const [bank, set, weights] = await Promise.all([loadBank('physics', 'XII'), loadBlueprints('physics', 'XII'), unitWeightsForTest('physics', 'XII')]);
    const thin = { ...bank, defs: bank.defs.filter((d) => d.marks !== 5 || d.origin === 'compiled') };
    expect(() => assemblePaper('physics', 'XII', thin, weights, seededRng(1), 0)).toThrow(/Raise the slider/);
    // With a slider to raise, the plan says how far, before anything is built.
    const plan = planShare(paperSlots('physics', 'XII', thin), 0);
    expect(plan.raised).toMatch(/at least \d+%.*Raise the slider/);
    const raised = assemblePaper('physics', 'XII', thin, weights, seededRng(1), 0, { set, share: 0 });
    expect(raised.generatedShare).toBe(plan.share);
  });

  it('counts a fact once when asking whether 0% can fill a paper', () => {
    const def = (id: string, facts: string[]) => ({ id, facts }) as unknown as BankDef;
    expect(distinctCount([def('a', ['x']), def('b', ['x']), def('c', ['y']), def('d', ['x', 'y']), def('e', [])])).toBe(3);
  });

  it('a question set at 0% uses only the bank’s side, and capacity promises only that', async () => {
    const f = { ...emptyFilters('mathematics'), levels: ['XII' as const], topics: ['XII 3 c'], formats: ['numerical' as const], share: 0 };
    const zero = (await capacityOf(f, new Set(), 60)).exact;
    const half = (await capacityOf({ ...f, share: 50 }, new Set(), 60)).exact;
    expect(half).toBeGreaterThan(zero);
    if (zero) {
      const paper = await buildQuestionSet(f, { mode: 'count', value: zero }, 'Mathematics', 3);
      expect(allItems(paper).filter((i) => isMarkedGenerated(i.question.item))).toEqual([]);
    }
  });

  it('a teacher paper at 0% doesn’t top itself up with generated questions', async () => {
    const paper = await buildFullPaper({ ...emptyFilters('physics'), levels: ['XII'], share: 0 }, 'XII', officialStructure('physics', 'XII'), 'Physics', 5);
    expect(allItems(paper).filter((i) => isMarkedGenerated(i.question.item))).toEqual([]);
    expect(paper.shortfall).toBeUndefined();
  });
});
