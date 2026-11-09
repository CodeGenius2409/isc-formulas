// The balanced-supply table: for every subtopic and question type, how many different questions there are, and how many were
// written by hand. Only writes the report when asked:
//   $env:TYPE_MATRIX='before'; npx vitest run tests/unit/type-matrix.test.ts
// "Total" is what a request can really use, with no fact asked twice, so several questions on one fact count once.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadBank } from '../../src/practice/bank';
import { isCompiled } from '../../src/practice/bank/define';
import type { QuestionFormat } from '../../src/practice/bank/types';
import { distinctCount } from '../../src/practice/gen/mix';
import { bankFormatOf, capacityOf, emptyFilters } from '../../src/practice/gen/teacher';
import { allTopics } from './lib/supply';
import { fitsTopic, MIN_TOTAL, MIN_WRITTEN, WORK_ORDER } from './lib/type-fit';

const WHICH = process.env.TYPE_MATRIX;
const reports = path.resolve(__dirname, '../../reports');
const SUBJECT_NAME: Record<string, string> = { physics: 'Physics', chemistry: 'Chemistry', mathematics: 'Mathematics', computerscience: 'Computer Science' };
/** Measured as well, though they aren't what's being worked on. */
const ALSO: QuestionFormat[] = ['mcq', 'numerical', 'very-short'];

interface Cell {
  key: string;
  format: QuestionFormat;
  fits: boolean;
  written: number;
  facts: number;
  total: number;
}

const isWritten = (d: { origin?: string }) => !d.origin || d.origin === 'written';

async function measure(): Promise<Cell[]> {
  const topics = await allTopics();
  const cells: Cell[] = [];
  for (const t of topics) {
    const bank = await loadBank(t.subject, t.level);
    const here = bank.defs.filter((d) => d.unit === t.unit && d.topic === t.topic);
    for (const format of [...WORK_ORDER, ...ALSO]) {
      const fits = WORK_ORDER.includes(format) ? fitsTopic(t.subject, `${t.level} ${t.unit}${t.topic}`, format) : true;
      const own = here.filter((d) => bankFormatOf(d) === format);
      const f = { ...emptyFilters(t.subject), levels: [t.level], topics: [`${t.level} ${t.unit} ${t.topic}`], formats: [format], share: 50 };
      const total = (await capacityOf(f, new Set(), 60)).exact;
      cells.push({ key: t.key, format, fits, written: distinctCount(own.filter(isWritten)), facts: distinctCount(own.filter((d) => d.origin === 'facts')), total: total });
    }
    expect(here.filter(isCompiled).every((d) => d.origin === 'compiled')).toBe(true);
  }
  return cells;
}

const met = (c: Cell) => c.total >= MIN_TOTAL && c.written >= MIN_WRITTEN;

function report(cells: Cell[], before: Cell[] | null): string {
  const fitting = (list: Cell[]) => list.filter((c) => c.fits && WORK_ORDER.includes(c.format));
  const out: string[] = [`# Subtopic × question type, ${WHICH}`, '', 'Written by `tests/unit/type-matrix.test.ts`. It counts the app’s own material, and holds no wording from any paper.', ''];
  out.push(`A cell meets the target at **${MIN_TOTAL} different questions**, bank and generated together with no fact asked twice, of which **${MIN_WRITTEN} written by hand**. Fact-based and compiled questions don’t count as hand-written. Which types fit which subtopics is written down in \`tests/unit/lib/type-fit.ts\`.`, '');
  out.push('## By type', '', `| Type | Cells that fit | ${before ? 'Met before | ' : ''}Met | Written, all cells | Empty |`, `|---|---:|${before ? '---:|' : ''}---:|---:|---:|`);
  for (const format of WORK_ORDER) {
    const list = fitting(cells).filter((c) => c.format === format);
    const old = before ? fitting(before).filter((c) => c.format === format) : [];
    out.push(`| ${format} | ${list.length} | ${before ? `${old.filter(met).length} | ` : ''}${list.filter(met).length} | ${list.reduce((s, c) => s + c.written, 0)} | ${list.filter((c) => c.total === 0).length} |`);
  }
  const all = fitting(cells);
  out.push(`| **All** | ${all.length} | ${before ? `${fitting(before).filter(met).length} | ` : ''}${all.filter(met).length} | ${all.reduce((s, c) => s + c.written, 0)} | ${all.filter((c) => c.total === 0).length} |`);
  const short = all.reduce((s, c) => s + Math.max(0, MIN_WRITTEN - c.written), 0);
  const totalShort = all.reduce((s, c) => s + Math.max(0, MIN_TOTAL - Math.max(c.total, c.written)), 0);
  out.push('', `Still to write for the target: **${short.toLocaleString('en-GB')}** hand-written questions, and in all **${totalShort.toLocaleString('en-GB')}** more different questions, which can be facts or blueprints. Each hand-written one counts towards both.`, '');
  for (const subject of Object.keys(SUBJECT_NAME)) {
    out.push(`## ${SUBJECT_NAME[subject]}`, '', 'Each cell is total, then hand-written. A dash is a type that doesn’t fit that subtopic.', '', `| Subtopic | ${WORK_ORDER.join(' | ')} | ${ALSO.join(' | ')} |`, `|---|${[...WORK_ORDER, ...ALSO].map(() => '---:').join('|')}|`);
    const keys = [...new Set(cells.filter((c) => c.key.startsWith(`${subject} `)).map((c) => c.key))];
    for (const key of keys) {
      const row = [...WORK_ORDER, ...ALSO].map((format) => {
        const c = cells.find((x) => x.key === key && x.format === format)!;
        if (!c.fits) return '–';
        const text = `${c.total}/${c.written}`;
        const was = before?.find((x) => x.key === key && x.format === format);
        return was && (was.total !== c.total || was.written !== c.written) ? `${was.total}/${was.written} → ${text}` : text;
      });
      out.push(`| ${key.replace(`${subject} `, '')} | ${row.join(' | ')} |`);
    }
    out.push('');
  }
  return out.join('\n');
}

describe.skipIf(!WHICH)('type matrix', () => {
  it('measures every subtopic and type', async () => {
    const cells = await measure();
    fs.writeFileSync(path.join(reports, `type-matrix-${WHICH}.json`), JSON.stringify(cells));
    const beforeFile = path.join(reports, 'type-matrix-before.json');
    const before = WHICH !== 'before' && fs.existsSync(beforeFile) ? (JSON.parse(fs.readFileSync(beforeFile, 'utf8')) as Cell[]) : null;
    fs.writeFileSync(path.join(reports, `type-matrix-${WHICH}.md`), report(cells, before));
    expect(cells.length).toBeGreaterThan(0);
  }, 1_800_000);
});
