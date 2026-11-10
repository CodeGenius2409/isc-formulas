// The balanced-supply table: for every subtopic and question type, how many questions were written by hand. Only writes the
// report when asked:
//   $env:TYPE_MATRIX='after'; npx vitest run tests/unit/type-matrix.test.ts
// The target is 5 hand-written questions of every fitting type in the 38 most-asked subtopics, the top quarter of 152 by how often
// the papers ask them, and 3 in every other. Fact-based and compiled questions don't count. Several questions on one fact count once.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadBank } from '../../src/practice/bank';
import { isCompiled } from '../../src/practice/bank/define';
import type { QuestionFormat } from '../../src/practice/bank/types';
import { distinctCount } from '../../src/practice/gen/mix';
import { bankFormatOf } from '../../src/practice/gen/teacher';
import { allTopics, mostAsked } from './lib/supply';
import { FILL_ORDER, fitsTopic, MIN_WRITTEN, MIN_WRITTEN_REST, WORK_ORDER } from './lib/type-fit';

const WHICH = process.env.TYPE_MATRIX;
const reports = path.resolve(__dirname, '../../reports');
const SUBJECT_NAME: Record<string, string> = { physics: 'Physics', chemistry: 'Chemistry', mathematics: 'Mathematics', computerscience: 'Computer Science' };
/** Where this target began: the matrix after Batch 11, when the most-asked subtopics were done. */
const START = path.join(reports, 'type-matrix-rest-start.json');

interface Cell {
  key: string;
  format: QuestionFormat;
  fits: boolean;
  /** In the most-asked quarter, where 5 must be hand-written. */
  top?: boolean;
  asked?: number;
  written: number;
  facts: number;
  /** Older reports also measured what the generator could add; it is no longer a target. */
  total?: number;
}

const isWritten = (d: { origin?: string }) => !d.origin || d.origin === 'written';

async function measure(): Promise<Cell[]> {
  const topics = await allTopics();
  const top = mostAsked(topics);
  const cells: Cell[] = [];
  for (const t of topics) {
    const bank = await loadBank(t.subject, t.level);
    const here = bank.defs.filter((d) => d.unit === t.unit && d.topic === t.topic);
    for (const format of WORK_ORDER) {
      const own = here.filter((d) => bankFormatOf(d) === format);
      cells.push({
        key: t.key,
        format,
        fits: fitsTopic(t.subject, `${t.level} ${t.unit}${t.topic}`, format),
        top: top.has(t.key),
        asked: t.asked,
        written: distinctCount(own.filter(isWritten)),
        facts: distinctCount(own.filter((d) => d.origin === 'facts')),
      });
    }
    expect(here.filter(isCompiled).every((d) => d.origin === 'compiled')).toBe(true);
  }
  return cells;
}

const needsWritten = (c: Pick<Cell, 'top'>) => (c.top ? MIN_WRITTEN : MIN_WRITTEN_REST);
const short = (c: Cell) => (c.fits ? Math.max(0, needsWritten(c) - c.written) : 0);
const met = (c: Cell) => short(c) === 0;
const sum = (list: Cell[], f: (c: Cell) => number) => list.reduce((s, c) => s + f(c), 0);
const n = (x: number) => x.toLocaleString('en-GB');

function report(cells: Cell[], start: Cell[] | null): string {
  const fitting = (list: Cell[]) => list.filter((c) => c.fits);
  const was = (c: Cell) => start?.find((x) => x.key === c.key && x.format === c.format);
  const out: string[] = [`# Subtopic × question type, ${WHICH}`, '', 'Written by `tests/unit/type-matrix.test.ts`. It counts the app’s own material, and holds no wording from any paper.', ''];
  out.push(
    `A cell meets the target with **${MIN_WRITTEN} questions written by hand** in the 38 most-asked subtopics, the top quarter by how often the papers ask them, marked ★, and **${MIN_WRITTEN_REST}** in every other subtopic. Fact-based and compiled questions don’t count, and several questions on one fact count once. Which types fit which subtopics is written down in \`tests/unit/lib/type-fit.ts\`. There is no longer a target for the number of questions bank and generator give together.`,
    '',
  );
  const all = fitting(cells);
  const rest = all.filter((c) => !c.top);
  const startShort = start ? sum(fitting(start).map((c) => ({ ...c, top: cells.find((x) => x.key === c.key)?.top })), short) : null;
  out.push(`Still to write: **${n(sum(all, short))}** hand-written questions, all in the ${new Set(rest.map((c) => c.key)).size} subtopics outside the most-asked.${startShort !== null ? ` At the start of this target, after Batch 11, it was **${n(startShort)}**.` : ''}`, '');
  out.push('## By type', '', `| Type | Cells that fit | ${start ? 'Met at start | ' : ''}Met | Written | Still to write |`, `|---|---:|${start ? '---:|' : ''}---:|---:|---:|`);
  for (const format of WORK_ORDER) {
    const list = all.filter((c) => c.format === format);
    const old = start ? list.map((c) => was(c) ?? c).map((c) => ({ ...c, top: cells.find((x) => x.key === c.key)?.top })) : [];
    out.push(`| ${format} | ${list.length} | ${start ? `${old.filter(met).length} | ` : ''}${list.filter(met).length} | ${n(sum(list, (c) => c.written))} | ${n(sum(list, short))} |`);
  }
  out.push(`| **All** | ${all.length} | ${start ? `${all.map((c) => was(c) ?? c).map((c) => ({ ...c, top: cells.find((x) => x.key === c.key)?.top })).filter(met).length} | ` : ''}${all.filter(met).length} | ${n(sum(all, (c) => c.written))} | ${n(sum(all, short))} |`, '');

  // The work list: subtopics outside the most-asked, most-asked first, with what each still needs in the order it is filled.
  const keys = [...new Set(rest.map((c) => c.key))].sort((a, b) => (cells.find((c) => c.key === b)!.asked ?? 0) - (cells.find((c) => c.key === a)!.asked ?? 0));
  out.push('## Work list', '', 'Subtopics outside the most-asked, in order of how often the papers ask them, with how many hand-written questions each type still needs, the emptiest kinds first.', '', `| Subtopic | Asked | ${FILL_ORDER.join(' | ')} | Left |`, `|---|---:|${FILL_ORDER.map(() => '---:').join('|')}|---:|`);
  for (const key of keys) {
    const row = FILL_ORDER.map((format) => {
      const c = cells.find((x) => x.key === key && x.format === format)!;
      return c.fits ? String(short(c) || '·') : '–';
    });
    const left = sum(cells.filter((c) => c.key === key), short);
    out.push(`| ${SUBJECT_NAME[key.split(' ')[0]]} ${key.split(' ').slice(1).join(' ')} | ${cells.find((c) => c.key === key)!.asked ?? 0} | ${row.join(' | ')} | ${left || 'done'} |`);
  }
  out.push('');

  for (const subject of Object.keys(SUBJECT_NAME)) {
    out.push(`## ${SUBJECT_NAME[subject]}`, '', `Each cell is the number written by hand${start ? ', with the count at the start of this target before the arrow where it has changed' : ''}. A dash is a type that doesn’t fit that subtopic.`, '', `| Subtopic | ${WORK_ORDER.join(' | ')} |`, `|---|${WORK_ORDER.map(() => '---:').join('|')}|`);
    for (const key of [...new Set(cells.filter((c) => c.key.startsWith(`${subject} `)).map((c) => c.key))]) {
      const row = WORK_ORDER.map((format) => {
        const c = cells.find((x) => x.key === key && x.format === format)!;
        if (!c.fits) return '–';
        const before = was(c);
        return before && before.written !== c.written ? `${before.written} → ${c.written}` : String(c.written);
      });
      out.push(`| ${key.replace(`${subject} `, '')}${cells.find((x) => x.key === key)?.top ? ' ★' : ''} | ${row.join(' | ')} |`);
    }
    out.push('');
  }
  return out.join('\n');
}

describe.skipIf(!WHICH)('type matrix', () => {
  it('measures every subtopic and type', async () => {
    const cells = await measure();
    fs.writeFileSync(path.join(reports, `type-matrix-${WHICH}.json`), JSON.stringify(cells));
    const start = WHICH !== 'rest-start' && fs.existsSync(START) ? (JSON.parse(fs.readFileSync(START, 'utf8')) as Cell[]) : null;
    fs.writeFileSync(path.join(reports, `type-matrix-${WHICH}.md`), report(cells, start));
    expect(cells.length).toBeGreaterThan(0);
  }, 600_000);
});
