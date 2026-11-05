// Figures in mock papers and teachers' papers: which are shown, how they're numbered, and that none gives an answer away.
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import { describe as describeFigure } from '../../src/components/bank/BankDiagram';
import type { BankItem } from '../../src/practice/bank/types';
import { markFigures, needsFigure, withFigureNote } from '../../src/practice/gen/figures';
import { generateItem } from '../../src/practice/gen/engine';
import { allItems, buildFullPaper, buildQuestionSet, emptyFilters, makeSets } from '../../src/practice/gen/teacher';

const stub = (id: string, text: string, diagram?: BankItem['diagram']): BankItem => ({ id, text, diagram, form: 'theory', points: [], marks: 1 }) as unknown as BankItem;
const LENS = { kind: 'lens', lens: 'convex', f: 10, u: 30, fLabel: 'f', uLabel: '30 cm' } as const;

describe('figure numbers', () => {
  const items = [stub('a', 'Words only.'), stub('b', 'A lens of focal length 10 cm.', LENS), stub('c', 'No figure.'), stub('d', 'For the circuit shown, find the current.', { kind: 'wire', I: '1 A', r: '1 cm' })];

  it('run in order across the paper when switched on', () => {
    const marks = markFigures(items, true);
    expect([...marks.keys()]).toEqual(['b', 'd']);
    expect(marks.get('b')!.number).toBe(1);
    expect(marks.get('d')!.number).toBe(2);
  });

  it('when switched off, only a question that needs its figure keeps it, and that is marked', () => {
    const marks = markFigures(items, false);
    expect([...marks.keys()]).toEqual(['d']);
    expect(marks.get('d')).toEqual({ number: 1, kept: true });
  });

  it('the words point to the figure', () => {
    expect(withFigureNote('Find v.', { number: 3, kept: false })).toBe('Find v. (See Fig. 3.)');
    expect(withFigureNote('Find v.', undefined)).toBe('Find v.');
  });

  it('tables, trees and questions that point at a figure need it, and a figure that repeats the words does not', () => {
    expect(needsFigure(stub('x', 'Find the mean.', { kind: 'table', head: ['a'], rows: [['1']] }))).toBe(true);
    expect(needsFigure(stub('x', 'Traverse it.', { kind: 'tree', nodes: [{ label: 'A' }] }))).toBe(true);
    expect(needsFigure(stub('x', 'The graph gives the speed.', { kind: 'graph', x: 't', y: 'v', lines: [] }))).toBe(true);
    expect(needsFigure(stub('x', 'A lens of focal length 10 cm.', LENS))).toBe(false);
    expect(needsFigure(stub('x', 'Words only.'))).toBe(false);
  });
});

describe('teachers’ papers', () => {
  const filters = { ...emptyFilters('physics'), levels: ['XII' as const], units: ['XII 6'], formats: ['numerical' as const], share: 100 };

  it('Sets A, B and C each have figures from their own values', async () => {
    const paper = await buildQuestionSet(filters, { mode: 'count', value: 8 }, 'Physics', 12);
    const sets = await makeSets(paper, ['A', 'B', 'C'], 99);
    for (const set of sets) {
      for (const entry of allItems(set)) {
        const { item } = entry.question;
        if (!item.diagram || item.form !== 'numeric') continue;
        // The figure's labelled numbers are in this question's own words.
        for (const n of describeFigure(item.diagram).matchAll(/\d+(?:\.\d+)?/g)) expect(item.text + JSON.stringify(item.diagram)).toContain(n[0]);
        const uLabel = (item.diagram as { uLabel?: string }).uLabel;
        if (uLabel) expect(item.text).toContain(uLabel);
      }
    }
    const signature = (i: number) => allItems(sets[i]).map((e) => e.question.item.text).join('|');
    expect(signature(0)).not.toBe(signature(1));
    expect(signature(1)).not.toBe(signature(2));
  });

  it('a full paper numbers its figures from 1, with no gaps', async () => {
    const paper = await buildFullPaper({ ...emptyFilters('physics'), share: 100 }, 'XII', [{ name: 'A', count: 12, marks: 3, formats: [] }], 'Physics', 5);
    const marks = [...markFigures(allItems(paper).map((e) => e.question.item), true).values()].map((m) => m.number);
    expect(marks).toEqual(marks.map((_, i) => i + 1));
  });
});

describe('an answer figure is kept out of the question', () => {
  it('a completed ray diagram exists only as the answer', async () => {
    const set = await loadBlueprints('physics', 'XII');
    const bp = set.blueprints.find((b) => b.id === 'p12-6a-lens-image')!;
    for (let seed = 0; seed < 50; seed++) {
      const item = generateItem(bp, seed, set.names(bp));
      expect((item.diagram as { rays?: 1 }).rays).toBeUndefined();
      expect((item.answerDiagram as { rays?: 1 }).rays).toBe(1);
    }
  });

  it('every question asking you to draw has no question figure to give it away', async () => {
    for (const level of ['XI', 'XII'] as const) {
      const set = await loadBlueprints('physics', level);
      for (const bp of set.blueprints.filter((b) => b.format === 'diagram')) {
        if (bp.id.endsWith('stopping-graph')) continue;
        for (let seed = 0; seed < 20; seed++) {
          const item = generateItem(bp, seed, set.names(bp));
          if (/^(draw|sketch)\b/i.test(item.text)) expect(item.diagram, bp.id).toBeUndefined();
        }
      }
    }
  });
});
