// Task 0 of v6: measures the supply and writes it to reports/. Only runs when asked:
//   $env:SUPPLY_REPORT='before'; npx vitest run tests/unit/supply-report.test.ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'vitest';
import { allTopics, formatsFor, loadAll, measureTopic, mostAsked, SUBJECTS, type TopicSupply } from './lib/supply';

const WHICH = process.env.SUPPLY_REPORT;
const SUBJECT_NAME: Record<string, string> = { physics: 'Physics', chemistry: 'Chemistry', mathematics: 'Mathematics', computerscience: 'Computer Science' };
const sum = (list: TopicSupply[], f: (t: TopicSupply) => number) => list.reduce((s, t) => s + f(t), 0);
const avg = (values: number[]) => (values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : 0);
const median = (v: number[]) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)] ?? 0;

describe.skipIf(!WHICH)('supply report', () => {
  it('measures every subtopic', async () => {
    const started = Date.now();
    const [topics, all] = await Promise.all([allTopics(), loadAll()]);
    const rows = topics.map((ref) => measureTopic(ref, all));
    const top = mostAsked(topics);
    const reports = path.resolve(__dirname, '../../reports');
    fs.writeFileSync(path.join(reports, `supply-${WHICH}.json`), JSON.stringify({ made: new Date().toISOString().slice(0, 10), rows }));
    const lines: string[] = [`# Question supply, ${WHICH}`, '', "Written by `tests/unit/supply-report.test.ts`. It counts the app's own material, and holds no wording from any paper.", ''];
    lines.push(
      "- **Structures** are blueprint × unknown × format × setting. New numbers alone don't make a new structure.",
      '- **To structure repeat** is how many questions the real picker gives for that subtopic before a structure comes round again, averaged over 3 runs of up to 200.',
      '- **Distinct** is how many different questions that picker can give with no fact asked twice, up to 200.',
      '- **Variety** is 0 to 100 for how unlike consecutive questions are, in wording, structure and blueprint.',
      '',
    );
    lines.push('## By subject', '', '| Subject | Subtopics | Blueprints | Bank questions | Facts | Structures | Median to structure repeat | Median distinct | Mean variety |', '|---|---:|---:|---:|---:|---:|---:|---:|---:|');
    for (const s of [...SUBJECTS, null]) {
      const list = rows.filter((r) => !s || r.ref.subject === s);
      lines.push(`| ${s ? SUBJECT_NAME[s] : '**All**'} | ${list.length} | ${sum(list, (t) => t.blueprints)} | ${sum(list, (t) => t.bank)} | ${sum(list, (t) => t.facts)} | ${sum(list, (t) => t.structures)} | ${median(list.map((t) => t.toStructureRepeat))} | ${median(list.map((t) => t.toIdenticalRepeat))} | ${avg(list.flatMap((t) => (t.variety === null ? [] : [t.variety])))} |`);
    }
    // What the targets add up to.
    let cellsFitting = 0;
    let cellsUnderTen = 0;
    for (const r of rows) {
      const fitting = formatsFor(r.ref.subject).filter((f) => (r.blueprintFormats[f] ?? 0) + (r.bankByFormat[f] ?? 0) > 0);
      for (const f of fitting) {
        for (const d of [1, 2, 3]) {
          cellsFitting++;
          if ((r.bankCells[`${f}|${d}`] ?? 0) < 10) cellsUnderTen++;
        }
      }
    }
    const target = sum(rows, (r) => (top.has(r.ref.key) ? 80 : 40));
    lines.push(
      '',
      '## What the bank targets add up to',
      '',
      `- ${rows.length} subtopics, ${top.size} of them most asked. At 40 and 80 questions, the target is **${target.toLocaleString('en-GB')}** bank questions. There are ${sum(rows, (t) => t.bank)}.`,
      `- Counting a format as fitting a subtopic only where something already exists for it, there are **${cellsFitting.toLocaleString('en-GB')}** subtopic × format × difficulty combinations. **${cellsUnderTen.toLocaleString('en-GB')}** have fewer than 10 bank questions. Ten in each is **${(cellsFitting * 10).toLocaleString('en-GB')}** questions; forty, which the stress test asks for at 0%, is **${(cellsFitting * 40).toLocaleString('en-GB')}**.`,
    );
    for (const s of SUBJECTS) {
      lines.push('', `## ${SUBJECT_NAME[s]}`, '', '| Topic | Asked | Blueprints | Numerical | Bank | Facts | Structures | Contexts | To structure repeat | Smallest gap | Distinct | Variety |', '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
      for (const r of rows.filter((x) => x.ref.subject === s)) {
        lines.push(`| ${r.ref.level} ${r.ref.unit}${r.ref.topic} ${r.ref.name}${top.has(r.ref.key) ? ' (most asked)' : ''} | ${r.ref.asked} | ${r.blueprints} | ${r.numericBlueprints} | ${r.bank} | ${r.facts} | ${r.structures} | ${r.contexts} | ${r.toStructureRepeat} | ${r.smallestGap ?? '–'} | ${r.toIdenticalRepeat} | ${r.variety ?? '–'} |`);
      }
    }
    lines.push('', `Took ${Math.round((Date.now() - started) / 1000)} s.`, '');
    fs.writeFileSync(path.join(reports, `supply-${WHICH}.md`), lines.join('\n'));
  }, 1_800_000);
});
