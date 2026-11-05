// Counts the facts in each topic against the syllabus and the papers. With WRITE_FACT_COUNTS=<file>, writes them out.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import { FACT_BOOK, type Facts } from '../../src/data/blueprints/dsl';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { loadSyllabus } from '../../src/data/syllabus';

const KEYS: (keyof Facts)[] = ['ar', 'define', 'recall', 'reason', 'compare', 'truths', 'explain', 'long', 'cases', 'draw'];
export const countFacts = (f: Facts | undefined) => (f ? KEYS.reduce((n, k) => n + ((f[k] as unknown[] | undefined)?.length ?? 0), 0) : 0);

it('writes the counts', async () => {
  const out = process.env.WRITE_FACT_COUNTS;
  if (!out) return;
  const rows: { key: string; name: string; facts: number; asked: number }[] = [];
  const analysis = existsSync('data-private/question-analysis.json') ? JSON.parse(readFileSync('data-private/question-analysis.json', 'utf8')).records as { subject: string; level: string; unit: number; topic: string; outOfSyllabus?: boolean }[] : [];
  for (const subject of ['physics', 'chemistry', 'mathematics', 'computerscience'] as SubjectId[]) {
    const syllabus = await loadSyllabus(subject);
    for (const level of ['XI', 'XII'] as ClassLevel[]) {
      await loadBlueprints(subject, level);
      const cls = syllabus.classes.find((c) => c.level === level)!;
      for (const unit of cls.units) {
        for (const topic of unit.topics) {
          const key = `${subject} ${level} ${unit.number}${topic.key}`;
          const asked = analysis.filter((r) => r.subject === subject && r.level === level && r.unit === Number(unit.number) && r.topic === topic.key && !r.outOfSyllabus).length;
          rows.push({ key, name: topic.name, facts: countFacts(FACT_BOOK.get(key)), asked });
        }
      }
    }
  }
  writeFileSync(out, JSON.stringify(rows, null, 1));
}, 300_000);
