// Task 4 of v6: feeling fresh in use. Within a paper, no two questions share a structure and a setting. Two papers running with
// the same settings share almost nothing, once the first has gone into the history. STRESS_REPORT=1 records the overlap measured.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { loadBank } from '../../src/practice/bank';
import { assemblePaper, unitWeightsForTest, type Paper } from '../../src/practice/bank/paper';
import { factsOf, historyKeys, structureKey, usedFreshness } from '../../src/practice/gen/mix';
import { seededRng } from '../../src/practice/questions';

const CLASSES: [SubjectId, ClassLevel][] = [['physics', 'XI'], ['physics', 'XII'], ['chemistry', 'XI'], ['chemistry', 'XII'], ['mathematics', 'XI'], ['mathematics', 'XII'], ['computerscience', 'XI'], ['computerscience', 'XII']];

const questionsOf = (p: Paper) => p.sections.flatMap((s) => s.questions);
const share = (a: string[], b: string[]) => {
  const other = new Set(b);
  return a.length ? a.filter((x) => other.has(x)).length / a.length : 0;
};

describe('mock papers', () => {
  const rows: { name: string; generated: number; questions: number; facts: number; structures: number }[] = [];

  describe.each(CLASSES)('%s %s', (subject, level) => {
    it.each([0, 50, 100])('at %i%% generated', async (generated) => {
      const [bank, set, weights] = await Promise.all([loadBank(subject, level), loadBlueprints(subject, level), unitWeightsForTest(subject, level)]);
      let questions = 0;
      let facts = 0;
      let structures = 0;
      const RUNS = 3;
      for (let run = 1; run <= RUNS; run++) {
        const first = assemblePaper(subject, level, bank, weights, seededRng(run * 13), 0, { set, share: generated });
        const shapes = questionsOf(first).map(structureKey);
        // The one-mark parts always include choice questions, whatever the slider says. Very short answers outnumber them in Computer Science's papers.
        const oneMark = first.sections[0].questions.filter((q) => q.item.marks === 1);
        const withChoices = oneMark.filter((q) => q.item.form === 'mcq').length;
        expect(withChoices, 'choice questions among the one-mark parts').toBeGreaterThanOrEqual(subject === 'computerscience' ? 1 : 3);
        // No two with the same structure and setting, wherever the supply allows that. A real paper has 30 to 40 places.
        // In Computer Science, a 10-mark blueprint chooses among several classes to design, which looks like one structure here.
        expect(new Set(shapes).size / shapes.length, 'structures repeated within a paper').toBeGreaterThanOrEqual(subject === 'computerscience' ? 0.7 : 0.9);

        const used = new Map<string, number>();
        for (const q of questionsOf(first)) for (const k of historyKeys(q)) used.set(k, 1);
        const second = assemblePaper(subject, level, bank, weights, seededRng(run * 17 + 1), 1, { set, share: generated, fresh: usedFreshness(used) });
        const a = questionsOf(first);
        const b = questionsOf(second);
        questions += share(b.map((q) => q.item.id), a.map((q) => q.item.id));
        facts += share(b.flatMap(factsOf), a.flatMap(factsOf));
        structures += share(b.map(structureKey), a.map(structureKey));
      }
      rows.push({ name: `${subject} ${level}`, generated, questions: questions / RUNS, facts: facts / RUNS, structures: structures / RUNS });
      // Two papers running share almost nothing. Long papers on small classes are the hardest case.
      expect(questions / RUNS, 'identical questions').toBeLessThanOrEqual(0.1);
    }, 240_000);
  });

  it('records what was measured', () => {
    if (process.env.STRESS_REPORT) fs.writeFileSync(path.resolve(__dirname, '../../reports/paper-overlap.json'), JSON.stringify(rows));
    expect(rows.length).toBeGreaterThan(0);
  });
});
