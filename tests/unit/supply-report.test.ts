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

/** The comparison with the start of v6, the bank by layer, and the stress test. */
function afterSections(rows: TopicSupply[], top: Set<string>): string[] {
  const reports = path.resolve(__dirname, '../../reports');
  const before = JSON.parse(fs.readFileSync(path.join(reports, 'supply-before.json'), 'utf8')) as { rows: TopicSupply[] };
  const out: string[] = ['## Before and after', '', '| Measure | Before | After |', '|---|---:|---:|'];
  const row = (name: string, f: (t: TopicSupply) => number, how: 'sum' | 'median' = 'sum') => {
    const take = (list: TopicSupply[]) => (how === 'sum' ? sum(list, f) : median(list.map(f)));
    out.push(`| ${name} | ${take(before.rows).toLocaleString('en-GB')} | ${take(rows).toLocaleString('en-GB')} |`);
  };
  row('Blueprints', (t) => t.blueprints);
  row('Distinct structures', (t) => t.structures);
  row('Facts', (t) => t.facts);
  row('Bank questions, all layers', (t) => t.bank);
  row('Median questions before a structure repeats', (t) => t.toStructureRepeat, 'median');
  row('Median distinct questions per subtopic, capped at 200', (t) => t.toIdenticalRepeat, 'median');
  out.push(`| Mean variety score | ${avg(before.rows.flatMap((t) => (t.variety === null ? [] : [t.variety])))} | ${avg(rows.flatMap((t) => (t.variety === null ? [] : [t.variety])))} |`);

  // The bank, by where each question came from.
  const origins: Record<string, Record<string, number>> = {};
  for (const r of rows) {
    const o = (origins[SUBJECT_NAME[r.ref.subject]] ??= { written: 0, facts: 0, compiled: 0 });
    for (const [k, v] of Object.entries(r.bankOrigin ?? {})) o[k] = (o[k] ?? 0) + v;
  }
  out.push('', '## The bank, by where each question came from', '', 'Only "Written" is finished questions written by hand as bank questions. "Facts" is reviewed facts asked as fixed questions, which are the same knowledge the generator uses. "Compiled" is frozen from reviewed blueprints, with machine-checked answers, and the slider counts it as generated: 0% uses only the first two.', '', '| Subject | Written | Facts | Compiled | Total |', '|---|---:|---:|---:|---:|');
  let w = 0, fa = 0, c = 0;
  for (const [name, o] of Object.entries(origins)) {
    out.push(`| ${name} | ${o.written.toLocaleString('en-GB')} | ${o.facts.toLocaleString('en-GB')} | ${o.compiled.toLocaleString('en-GB')} | ${(o.written + o.facts + o.compiled).toLocaleString('en-GB')} |`);
    w += o.written; fa += o.facts; c += o.compiled;
  }
  out.push(`| **All** | ${w.toLocaleString('en-GB')} | ${fa.toLocaleString('en-GB')} | ${c.toLocaleString('en-GB')} | ${(w + fa + c).toLocaleString('en-GB')} |`);

  // What a 0% numerical can use, and where that's thinnest.
  out.push('', '## Numericals at 0%', '', 'Numericals are the format 0% loses most by leaving compiled questions out, as most of the bank\'s were compiled.', '', '| Class | Numericals 0% can use | Compiled, for above 0% | Subtopics with fewer than 10 at 0% |', '|---|---:|---:|---:|');
  const numericByClass = new Map<string, { zero: number; compiled: number; thin: number; topics: number }>();
  for (const r of rows) {
    const name = `${SUBJECT_NAME[r.ref.subject]} ${r.ref.level}`;
    const row = numericByClass.get(name) ?? { zero: 0, compiled: 0, thin: 0, topics: 0 };
    const zero = r.numericsAtZero ?? 0;
    const all = r.bankByFormat.numerical ?? 0;
    row.zero += zero;
    row.compiled += all - zero;
    if (all > 0 || r.numericBlueprints > 0) {
      row.topics++;
      if (zero < 10) row.thin++;
    }
    numericByClass.set(name, row);
  }
  for (const [name, n] of numericByClass) out.push(`| ${name} | ${n.zero.toLocaleString('en-GB')} | ${n.compiled.toLocaleString('en-GB')} | ${n.thin} of ${n.topics} |`);

  // Against the targets.
  const need = (r: TopicSupply) => (top.has(r.ref.key) ? 80 : 40);
  const underAll = rows.filter((r) => r.bank < need(r));
  const underWritten = rows.filter((r) => (r.bankOrigin?.written ?? 0) < need(r));
  const underZero = rows.filter((r) => (r.bankOrigin?.written ?? 0) + (r.bankOrigin?.facts ?? 0) < need(r));
  out.push('', '## Against the 40 and 80 target', '', `- Counting all three layers, ${rows.length - underAll.length} of ${rows.length} subtopics reach it.`, `- Counting hand-written and fact-based questions, all that 0% can use, ${rows.length - underZero.length} of ${rows.length} reach it.`, `- Counting only hand-written questions, ${rows.length - underWritten.length} of ${rows.length} reach it.`);
  if (underAll.length) out.push(`- Below it with all layers: ${underAll.map((r) => `${SUBJECT_NAME[r.ref.subject]} ${r.ref.level} ${r.ref.unit}${r.ref.topic} (${r.bank} of ${need(r)})`).join('; ')}.`);

  // The stress test.
  const stress = JSON.parse(fs.readFileSync(path.join(reports, 'filter-stress.json'), 'utf8')) as { totals: Record<string, { combos: number; filled: Record<string, number> }>; rows: { subject: string; key: string; format: string; difficulty: number; capacity: Record<string, number> }[] };
  out.push('', '## Filter stress test', '', 'For each subtopic, fitting format and fitting difficulty, how many combinations can fill a request entirely from exact matches, with no fact asked twice. Generated from `tests/unit/filter-stress.test.ts`.', '', '| Subject | Combinations | 0%: 10 | 0%: 20 | 0%: 40 | 50%: 10 | 50%: 20 | 50%: 40 | 100%: 10 | 100%: 20 | 100%: 40 |', '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
  for (const [s, t] of Object.entries(stress.totals)) {
    const cells = [0, 50, 100].flatMap((share) => [10, 20, 40].map((n) => t.filled[`${share}|${n}`] ?? 0));
    out.push(`| ${SUBJECT_NAME[s]} | ${t.combos.toLocaleString('en-GB')} | ${cells.join(' | ')} |`);
  }
  const byFormat = new Map<string, [number, number, number]>();
  for (const r of stress.rows) {
    const x = byFormat.get(r.format) ?? [0, 0, 0];
    x[0]++;
    if (r.capacity[0] >= 10) x[1]++;
    if (r.capacity[50] >= 10) x[2]++;
    byFormat.set(r.format, x);
  }
  out.push('', '### By format', '', '| Format | Combinations | Fill 10 at 0% | Fill 10 at 50% |', '|---|---:|---:|---:|');
  for (const [f, [n, a, b]] of [...byFormat].sort((p, q) => q[1][0] - p[1][0])) out.push(`| ${f} | ${n} | ${a} | ${b} |`);

  // Mock papers.
  const overlap = path.join(reports, 'paper-overlap.json');
  if (fs.existsSync(overlap)) {
    const list = JSON.parse(fs.readFileSync(overlap, 'utf8')) as { name: string; generated: number; questions: number; facts: number; structures: number }[];
    out.push('', '## Two mock papers running', '', 'With the same settings and the first paper in the history, what the second shares with the first, averaged over 3 runs.', '', '| Paper | Generated | Same questions | Same facts | Same structures |', '|---|---:|---:|---:|---:|');
    const pc = (x: number) => `${(x * 100).toFixed(1)}%`;
    for (const r of list) out.push(`| ${r.name} | ${r.generated}% | ${pc(r.questions)} | ${pc(r.facts)} | ${pc(r.structures)} |`);
  }
  out.push('');
  return out;
}

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
    if (WHICH === 'after') lines.splice(lines.findIndex((l) => l.startsWith('## Physics')), 0, ...afterSections(rows, top));
    lines.push('', `Took ${Math.round((Date.now() - started) / 1000)} s.`, '');
    fs.writeFileSync(path.join(reports, `supply-${WHICH}.md`), lines.join('\n'));
    if (WHICH === 'after') {
      const table = ['| Subtopic | Target | Written | Facts | Compiled | Total | Easy | Medium | Hard | Largest formats | Reviewed |', '|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|'];
      for (const r of rows) {
        const o = r.bankOrigin ?? {};
        const formats = Object.entries(r.bankByFormat).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([f, n]) => `${f} ${n}`).join(', ');
        table.push(`| ${SUBJECT_NAME[r.ref.subject]} ${r.ref.level} ${r.ref.unit}${r.ref.topic} | ${top.has(r.ref.key) ? 80 : 40} | ${o.written ?? 0} | ${o.facts ?? 0} | ${o.compiled ?? 0} | ${r.bank} | ${r.bankByDifficulty[1] ?? 0} | ${r.bankByDifficulty[2] ?? 0} | ${r.bankByDifficulty[3] ?? 0} | ${formats} | Yes, by layer |`);
      }
      const file = path.join(reports, 'question-quality.md');
      const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
      fs.writeFileSync(file, text.replace(/<!-- bank-progress -->[\s\S]*<!-- \/bank-progress -->/, `<!-- bank-progress -->\n${table.join('\n')}\n<!-- /bank-progress -->`));
    }
  }, 1_800_000);
});
