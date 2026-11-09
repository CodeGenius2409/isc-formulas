// The filter stress test of v6 Task 4: for every subtopic, fitting format and fitting difficulty, and for multi-subtopic and
// whole-chapter choices, at 0, 50 and 100% generated, can 10, 20 and 40 questions be filled from exact matches?
//
// Capacity is worked out for every combination on each run, and a sample is really built, so the count can't drift from what a
// request gets. STRESS_FULL=1 builds every one. STRESS_REPORT=1 writes reports/filter-stress.json for the supply report.
// Where a combination can't be filled, that's material still to write. The numbers in stress-allowed.json can only go down.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import { loadSyllabus } from '../../src/data/syllabus';
import type { SubjectId } from '../../src/data/types';
import { loadBank } from '../../src/practice/bank';
import type { Difficulty } from '../../src/practice/bank/types';
import { factsOf, questionKey } from '../../src/practice/gen/mix';
import { allItems, bankFormatOf, buildQuestionSet, capacityOf, emptyFilters, FORMATS, type Filters, type FormatChoice } from '../../src/practice/gen/teacher';

const SUBJECTS: SubjectId[] = ['physics', 'chemistry', 'mathematics', 'computerscience'];
const SHARES = [0, 50, 100];
const COUNTS = [10, 20, 40];
const FULL = Boolean(process.env.STRESS_FULL);
const ALLOWED = path.resolve(__dirname, 'stress-allowed.json');

/** A difficulty that makes no sense for a format isn't a combination at all: a hard one-line answer, an easy long answer. */
const FITS: Partial<Record<FormatChoice, Difficulty[]>> = {
  'very-short': [1, 2],
  long: [2, 3],
  derivation: [2, 3],
  distinguish: [1, 2],
  diagram: [1, 2, 3],
  complete: [1, 2],
  match: [2, 3],
  odd: [2],
  order: [2, 3],
  predict: [2, 3],
  convert: [1, 2, 3],
  program: [2, 3],
};

interface Row {
  subject: SubjectId;
  key: string;
  format: string;
  difficulty: number;
  capacity: Record<number, number>;
}

/** A format fits a subtopic when there's material for it there at all. Numericals aren't invented for a descriptive topic. */
async function combinations(subject: SubjectId) {
  const syllabus = await loadSyllabus(subject);
  const out: { filters: Filters; key: string; format: FormatChoice; difficulty: Difficulty }[] = [];
  for (const cls of syllabus.classes) {
    const [bank, set] = await Promise.all([loadBank(subject, cls.level), loadBlueprints(subject, cls.level)]);
    for (const unit of cls.units) {
      for (const topic of unit.topics) {
        const here = new Set<string>();
        for (const d of bank.defs) if (d.unit === unit.number && d.topic === topic.key) here.add(bankFormatOf(d));
        for (const b of set.blueprints) if (b.unit === unit.number && b.topic === topic.key) here.add(b.format);
        for (const { key: format, cs } of FORMATS) {
          if (cs && subject !== 'computerscience') continue;
          if (!here.has(format)) continue;
          for (const difficulty of FITS[format] ?? ([1, 2, 3] as Difficulty[])) {
            const place = `${cls.level} ${unit.number} ${topic.key}`;
            out.push({ key: `${cls.level} ${unit.number}${topic.key}`, format, difficulty, filters: { ...emptyFilters(subject), levels: [cls.level], topics: [place], formats: [format], difficulties: [difficulty] } });
          }
        }
      }
    }
  }
  return out;
}

async function realRequest(f: Filters, count: number, seed: number) {
  const paper = await buildQuestionSet(f, { mode: 'count', value: count }, f.subject, seed);
  const items = allItems(paper);
  const label = JSON.stringify({ topics: f.topics, formats: f.formats, difficulties: f.difficulties, share: f.share, count });
  expect(items.length, label).toBe(count);
  expect(new Set(items.map((i) => i.key)).size, label).toBe(count);
  expect(new Set(items.map((i) => questionKey(i.question))).size, label).toBe(count);
  const facts = items.flatMap((i) => factsOf(i.question));
  expect(new Set(facts).size, `a fact twice: ${label}`).toBe(facts.length);
  for (const i of items) {
    expect(i.related, `a related question in: ${label}`).toBeFalsy();
    const q = i.question.item;
    if (f.difficulties.length) expect(f.difficulties, label).toContain(q.difficulty);
    if (f.share === 0) expect(q.generated, label).toBeFalsy();
    if (f.share === 100) expect(q.generated, label).toBeTruthy();
  }
}

describe('every filter can be filled from exact matches', () => {
  const totals: Record<string, { combos: number; filled: Record<string, number> }> = {};
  const rows: Row[] = [];

  for (const subject of SUBJECTS) {
    it(`${subject}: subtopic, format and difficulty`, async () => {
      const combos = await combinations(subject);
      const tally = { combos: combos.length, filled: {} as Record<string, number> };
      let n = 0;
      for (const c of combos) {
        const capacity: Record<number, number> = {};
        for (const share of SHARES) {
          const f = { ...c.filters, share };
          const can = (await capacityOf(f, new Set(), 40)).exact;
          capacity[share] = can;
          for (const count of COUNTS) {
            if (can >= count) tally.filled[`${share}|${count}`] = (tally.filled[`${share}|${count}`] ?? 0) + 1;
            // What capacity promises, a real request has to deliver.
            if (can >= count && (FULL || n++ % 97 === 0)) await realRequest(f, count, count + share + 1);
          }
        }
        rows.push({ subject, key: c.key, format: c.format, difficulty: c.difficulty, capacity });
      }
      totals[subject] = tally;
    }, 1_800_000);

    it(`${subject}: several subtopics and whole chapters`, async () => {
      const syllabus = await loadSyllabus(subject);
      for (const cls of syllabus.classes) {
        for (const unit of cls.units) {
          const topics = unit.topics.map((t) => `${cls.level} ${unit.number} ${t.key}`);
          for (const share of SHARES) {
            for (const count of COUNTS) {
              const whole: Filters = { ...emptyFilters(subject), levels: [cls.level], units: [`${cls.level} ${unit.number}`], share };
              if ((await capacityOf(whole, new Set(), 40)).exact >= count) await realRequest(whole, count, count + share);
              if (topics.length > 1) {
                const several: Filters = { ...emptyFilters(subject), levels: [cls.level], topics: topics.slice(0, 2), share };
                if ((await capacityOf(several, new Set(), 40)).exact >= count) await realRequest(several, count, count + share + 3);
              }
            }
          }
        }
      }
    }, 1_800_000);
  }

  it('does no worse than it did', () => {
    if (Object.keys(totals).length < SUBJECTS.length) return;
    const shortfalls: Record<string, number> = {};
    for (const [subject, t] of Object.entries(totals)) {
      for (const share of SHARES) for (const count of COUNTS) shortfalls[`${subject} ${share}% ${count}`] = t.combos - (t.filled[`${share}|${count}`] ?? 0);
    }
    if (process.env.STRESS_REPORT) {
      fs.writeFileSync(path.resolve(__dirname, '../../reports/filter-stress.json'), JSON.stringify({ totals, rows }));
      fs.writeFileSync(ALLOWED, `${JSON.stringify(shortfalls, null, 1)}\n`);
      return;
    }
    const allowed = fs.existsSync(ALLOWED) ? (JSON.parse(fs.readFileSync(ALLOWED, 'utf8')) as Record<string, number>) : {};
    for (const [k, v] of Object.entries(shortfalls)) if (k in allowed) expect(v, k).toBeLessThanOrEqual(allowed[k]);
  });
});
