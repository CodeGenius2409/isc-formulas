// Task 4 of v6: feeling fresh in use. Within a paper, no two questions share a structure and a setting. Two papers running with
// the same settings share almost nothing, once the first has gone into the history. STRESS_REPORT=1 records the overlap measured,
// and overlap-allowed.json holds what it may not rise above, so the report can't get worse without a test saying so.
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
const ALLOWED = path.resolve(__dirname, 'overlap-allowed.json');
/** Room for chance, as new questions change which ones a seed picks. */
const MARGIN = 0.03;

const questionsOf = (p: Paper) => p.sections.flatMap((s) => [...s.questions, ...Object.values(s.alternatives ?? {})]);
const share = (a: string[], b: string[]) => {
  const other = new Set(b);
  return a.length ? a.filter((x) => other.has(x)).length / a.length : 0;
};
/**
 * What a question asks, with its numbers and formulas taken out. A structure is a question's blueprint or its own id, so two
 * hand-written questions asking the same thing of different functions count as different structures. This catches them.
 * A program to trace and a choice's options are part of what's asked: "Write the output of the following program." heads many
 * different questions, and so does "Which of these statements is correct?".
 */
const askOf = (q: ReturnType<typeof questionsOf>[number]) =>
  [q.item.text, 'code' in q.item ? q.item.code : '', 'options' in q.item ? q.item.options.map((o) => o.text).join(' ') : '']
    .join(' ')
    .replace(/\$[^$]*\$/g, ' ')
    .replace(/[−-]?\d[\d.,]*/g, ' ')
    .toLowerCase()
    .replace(/[^a-z ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
/** Too short to say what's being asked: "evaluate", "find the value of". */
const tellingAsks = (list: ReturnType<typeof questionsOf>) => list.map(askOf).filter((a) => a.split(' ').length >= 6);

interface Row {
  name: string;
  generated: number;
  questions: number;
  facts: number;
  structures: number;
  /** The same wording with numbers and formulas removed. */
  asks: number;
  /** Paper 5 of 5 running, against the four before it. */
  fifth: number;
  /** With no history at all, as when an earlier paper is forgotten: just two different seeds. */
  noHistory: number;
}

describe('mock papers', () => {
  const rows: Row[] = [];

  describe.each(CLASSES)('%s %s', (subject, level) => {
    it.each([0, 50, 100].map((generated) => ({ generated })))('at $generated% generated', async ({ generated }) => {
      const [bank, set, weights] = await Promise.all([loadBank(subject, level), loadBlueprints(subject, level), unitWeightsForTest(subject, level)]);
      const total: Omit<Row, 'name' | 'generated'> = { questions: 0, facts: 0, structures: 0, asks: 0, fifth: 0, noHistory: 0 };
      const RUNS = 3;
      for (let run = 1; run <= RUNS; run++) {
        const first = assemblePaper(subject, level, bank, weights, seededRng(run * 13), 0, { set, share: generated });
        const printed = questionsOf(first);
        const shapes = printed.map(structureKey);
        // The one-mark parts always include choice questions, whatever the slider says. Very short answers outnumber them in Computer Science's papers.
        const oneMark = first.sections[0].questions.filter((q) => q.item.marks === 1);
        const withChoices = oneMark.filter((q) => q.item.form === 'mcq').length;
        expect(withChoices, 'choice questions among the one-mark parts').toBeGreaterThanOrEqual(subject === 'computerscience' ? 1 : 3);
        // No two with the same structure and setting, wherever the supply allows that. A real paper has 30 to 40 places.
        // In Computer Science, a 10-mark blueprint chooses among several classes to design, which looks like one structure here.
        expect(new Set(shapes).size / shapes.length, 'structures repeated within a paper').toBeGreaterThanOrEqual(subject === 'computerscience' ? 0.7 : 0.9);

        const used = new Map<string, number>();
        const remember = (p: Paper, at: number) => {
          for (const q of questionsOf(p)) for (const k of historyKeys(q)) used.set(k, at);
        };
        remember(first, 1);
        const second = assemblePaper(subject, level, bank, weights, seededRng(run * 17 + 1), 1, { set, share: generated, fresh: usedFreshness(used) });
        const a = printed;
        const b = questionsOf(second);
        total.questions += share(b.map((q) => q.item.id), a.map((q) => q.item.id));
        total.facts += share(b.flatMap(factsOf), a.flatMap(factsOf));
        total.structures += share(b.map(structureKey), a.map(structureKey));
        total.asks += share(tellingAsks(b), tellingAsks(a));
        const stranger = assemblePaper(subject, level, bank, weights, seededRng(run * 29 + 2), 1, { set, share: generated });
        total.noHistory += share(questionsOf(stranger).map((q) => q.item.id), a.map((q) => q.item.id));
        // A student who sits five in a row: the fifth against the other four.
        const before = [...a.map((q) => q.item.id), ...b.map((q) => q.item.id)];
        remember(second, 2);
        let latest = second;
        for (let n = 3; n <= 5; n++) {
          latest = assemblePaper(subject, level, bank, weights, seededRng(run * 31 + n), n, { set, share: generated, fresh: usedFreshness(used) });
          if (n < 5) before.push(...questionsOf(latest).map((q) => q.item.id));
          remember(latest, n);
        }
        total.fifth += share(questionsOf(latest).map((q) => q.item.id), before);
      }
      const row: Row = { name: `${subject} ${level}`, generated, questions: total.questions / RUNS, facts: total.facts / RUNS, structures: total.structures / RUNS, asks: total.asks / RUNS, fifth: total.fifth / RUNS, noHistory: total.noHistory / RUNS };
      rows.push(row);
      // Two papers running share almost nothing. Long papers on small classes are the hardest case.
      expect(row.questions, 'identical questions').toBeLessThanOrEqual(0.1);
    }, 240_000);
  });

  it('records what was measured, and it has not got worse', () => {
    const key = (r: Row) => `${r.name} ${r.generated}%`;
    if (process.env.STRESS_REPORT) {
      fs.writeFileSync(path.resolve(__dirname, '../../reports/paper-overlap.json'), JSON.stringify(rows));
      fs.writeFileSync(ALLOWED, `${JSON.stringify(Object.fromEntries(rows.map((r) => [key(r), { questions: r.questions, structures: r.structures, asks: r.asks, fifth: r.fifth }])), null, 1)}\n`);
    } else if (fs.existsSync(ALLOWED)) {
      const allowed = JSON.parse(fs.readFileSync(ALLOWED, 'utf8')) as Record<string, { questions: number; structures: number; asks: number; fifth: number }>;
      for (const r of rows) {
        const was = allowed[key(r)];
        if (!was) continue;
        expect(r.questions, `${key(r)}: same questions`).toBeLessThanOrEqual(was.questions + MARGIN);
        expect(r.structures, `${key(r)}: same structures`).toBeLessThanOrEqual(was.structures + MARGIN);
        expect(r.asks, `${key(r)}: same asks`).toBeLessThanOrEqual(was.asks + MARGIN);
        expect(r.fifth, `${key(r)}: the fifth paper`).toBeLessThanOrEqual(was.fifth + MARGIN);
      }
    }
    expect(rows.length).toBeGreaterThan(0);
  });
});
