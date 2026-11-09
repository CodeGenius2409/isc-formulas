// A request for a number of questions gives exactly that number, all different, or it's refused before generating.
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import { loadSyllabus } from '../../src/data/syllabus';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { loadBank } from '../../src/practice/bank';
import { assemblePaper, paperSpec, unitWeightsForTest } from '../../src/practice/bank/paper';
import { factsOf, questionKey } from '../../src/practice/gen/mix';
import { allItems, buildQuestionSet, capacityOf, emptyFilters, FORMATS, type Filters } from '../../src/practice/gen/teacher';
import { seededRng } from '../../src/practice/questions';

const SUBJECTS: SubjectId[] = ['physics', 'chemistry', 'mathematics', 'computerscience'];
const LEVELS: ClassLevel[] = ['XI', 'XII'];

async function check(f: Filters, count: number, seed: number): Promise<'made' | 'refused'> {
  const can = await capacityOf(f, new Set(), Math.max(count, 60));
  if (can.withRelated < count) return 'refused';
  const paper = await buildQuestionSet(f, { mode: 'count', value: count }, f.subject, seed);
  const items = allItems(paper);
  const label = JSON.stringify({ ...f, count });
  expect(items.length, label).toBe(count);
  expect(paper.shortfall, label).toBeUndefined();
  expect(new Set(items.map((i) => i.key)).size, label).toBe(count);
  expect(new Set(items.map((i) => questionKey(i.question))).size, label).toBe(count);
  const facts = items.flatMap((i) => factsOf(i.question));
  expect(new Set(facts).size, `a fact was asked twice: ${label}`).toBe(facts.length);
  // At 0% nothing is generated, and at 100% everything is.
  if (f.share === 0) expect(items.every((i) => !i.question.item.generated), label).toBe(true);
  if (f.share === 100) expect(items.every((i) => i.question.item.generated), label).toBe(true);
  // Anything outside the chosen subtopics says so.
  for (const i of items) {
    const key = `${i.question.item.level} ${i.question.item.unit} ${i.question.item.topic}`;
    if (f.topics.length && !f.topics.includes(key)) expect(i.related, label).toBe(true);
  }
  if (f.formats.length) for (const i of items) expect(i.question.item.generated ? f.formats : f.formats).toBeDefined();
  return 'made';
}

describe('a set always has the number asked for', () => {
  for (const subject of SUBJECTS) {
    it(`${subject}: each subtopic, each format, at 0, 50 and 100%`, async () => {
      const syllabus = await loadSyllabus(subject);
      for (const cls of syllabus.classes) {
        for (const unit of cls.units) {
          for (const topic of unit.topics.filter((t) => t.key !== 'p')) {
            const key = `${cls.level} ${unit.number} ${topic.key}`;
            for (const share of [0, 50, 100]) {
              for (const format of [null, ...FORMATS.filter((x) => !x.cs || subject === 'computerscience').map((x) => x.key)]) {
                const f: Filters = { ...emptyFilters(subject), levels: [cls.level], topics: [key], formats: format ? [format] : [], share };
                // filter-stress.test.ts covers each format at each difficulty, so one count is enough here.
                for (const count of format ? [10] : [5, 10, 20, 30]) {
                  await check(f, count, count + share);
                }
              }
            }
          }
        }
      }
    }, 400_000);

    it(`${subject}: several subtopics, each difficulty, and whole subjects`, async () => {
      const syllabus = await loadSyllabus(subject);
      for (const cls of syllabus.classes) {
        const unit = cls.units[0];
        const topics = unit.topics.filter((t) => t.key !== 'p').map((t) => `${cls.level} ${unit.number} ${t.key}`);
        for (const share of [0, 50, 100]) {
          for (const difficulties of [[], [1], [2], [3]] as (1 | 2 | 3)[][]) {
            for (const count of [5, 10, 20, 30]) {
              await check({ ...emptyFilters(subject), levels: [cls.level], topics, difficulties, share }, count, count * 3);
            }
          }
        }
        // With nothing narrowed, any request up to 30 must work, at any share above zero.
        for (const count of [5, 10, 20, 30]) expect(await check({ ...emptyFilters(subject), levels: [cls.level], share: 100 }, count, count)).toBe('made');
      }
    }, 200_000);
  }
});

describe('a mock paper is always whole', () => {
  for (const subject of SUBJECTS) {
    for (const level of LEVELS) {
      it(`${subject} ${level}, at 0, 50 and 100%, over several seeds`, async () => {
        const [bank, set, weights] = await Promise.all([loadBank(subject, level), loadBlueprints(subject, level), unitWeightsForTest(subject, level)]);
        const spec = paperSpec(subject, level);
        for (const share of [0, 50, 100]) {
          for (let seed = 1; seed <= 4; seed++) {
            const paper = assemblePaper(subject, level, bank, weights, seededRng(seed), 0, { set, share });
            for (const [i, section] of spec.sections.entries()) {
              expect(paper.sections[i].questions.length, `${section.name} at ${share}%`).toBe(section.slots.reduce((n, s) => n + s.count, 0));
            }
            const items = paper.sections.flatMap((s) => s.questions);
            expect(new Set(items.map((q) => q.item.id)).size).toBe(items.length);
            const facts = items.flatMap(factsOf);
            expect(new Set(facts).size, 'a fact was asked twice').toBe(facts.length);
          }
        }
      });
    }
  }
});
