// Compiled bank questions are frozen from blueprints and weren't read one by one, so they're marked as generated questions are.
// Hand-written and fact-based bank questions aren't. Picking still counts compiled questions as the bank's.
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BANK_NOTICE, BankNote, GENERATED_NOTICE, GeneratedMark, GeneratedNote } from '../../src/components/bank/GeneratedMark';
import { loadBlueprints } from '../../src/data/blueprints';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { bankQuestion, loadBank } from '../../src/practice/bank';
import { isMarkedGenerated } from '../../src/practice/bank/define';
import { assemblePaper, unitWeightsForTest } from '../../src/practice/bank/paper';
import type { BankItem } from '../../src/practice/bank/types';
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

  it('keeps a compiled question out of the generator’s tag, so a paper at 0% still uses no blueprints', async () => {
    const [bank, set, weights] = await Promise.all([loadBank('physics', 'XII'), loadBlueprints('physics', 'XII'), unitWeightsForTest('physics', 'XII')]);
    const paper = assemblePaper('physics', 'XII', bank, weights, seededRng(12345), 0, { set, share: 0 });
    const items = paper.sections.flatMap((s) => s.questions.map((q) => q.item));
    expect(items.filter((i) => i.generated)).toEqual([]);
    expect(items.some((i) => i.origin === 'compiled')).toBe(true);
  });
});
