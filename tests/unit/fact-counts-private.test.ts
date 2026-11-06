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
  // With a report path too, the before and after table goes into it, between its markers.
  const report = process.env.WRITE_FACT_REPORT;
  if (!report) return;
  const before = JSON.parse(readFileSync('reports/fact-counts-before.json', 'utf8')) as typeof rows;
  const table: string[] = [];
  let totalBefore = 0;
  let totalAfter = 0;
  for (const subject of ['physics', 'chemistry', 'mathematics', 'computerscience']) {
    const mine = before.filter((r) => r.key.startsWith(`${subject} `));
    const top = new Set([...mine].sort((a, b) => b.asked - a.asked).slice(0, 20).map((r) => r.key));
    table.push('', `### ${{ physics: 'Physics', chemistry: 'Chemistry', mathematics: 'Mathematics', computerscience: 'Computer Science' }[subject]}`, '', '| Topic | Parts asked in the papers | Facts before | Facts after | Needed |', '|---|---:|---:|---:|---:|');
    for (const r of mine) {
      const now = rows.find((x) => x.key === r.key)!;
      const need = top.has(r.key) ? Math.max(40, r.facts * 3) : 15;
      totalBefore += r.facts;
      totalAfter += now.facts;
      table.push(`| ${r.key.split(' ').slice(1).join(' ')} ${r.name}${top.has(r.key) ? ' (most asked)' : ''} | ${r.asked} | ${r.facts} | ${now.facts} | ${need} |`);
    }
  }
  const section = ['<!-- fact-counts -->', '## The knowledge base, before and after Task 6', '', `Facts are the rows a topic’s questions are made from: definitions, recall questions, true and false statements, reasons, comparisons, explanations, long answers, cases, diagrams and assertion–reason concepts. In all: ${totalBefore.toLocaleString('en-GB')} before and ${totalAfter.toLocaleString('en-GB')} after. The 20 most-asked topics in each subject needed at least three times their facts, and at least 40; every other syllabus topic needed at least 15. Links between facts, for assertion–reason and “distinguish between” pairs, aren’t counted here.`, ...table, '<!-- /fact-counts -->'].join('\n');
  const text = readFileSync(report, 'utf8');
  const start = text.indexOf('<!-- fact-counts -->');
  const end = text.indexOf('<!-- /fact-counts -->');
  writeFileSync(report, start >= 0 ? text.slice(0, start) + section + text.slice(end + '<!-- /fact-counts -->'.length) : `${text.trimEnd()}\n\n${section}\n`);
}, 300_000);
