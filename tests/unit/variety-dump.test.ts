// For reading: samples from each family of the variety engine, written to a file outside the repository.
//   $env:VARIETY_DUMP='<file>'; $env:VARIETY_TOPICS='physics XII 3a'; npx vitest run tests/unit/variety-dump.test.ts
import fs from 'node:fs';
import { it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { generateItem } from '../../src/practice/gen/engine';
import type { BankItem } from '../../src/practice/bank/types';

function show(item: BankItem): string {
  const lines = [`[${item.id}] ${item.marks}m d${item.difficulty} ${item.generated?.format} ctx=${item.generated?.context ?? '-'}`, item.text];
  if (item.diagram) lines.push(`FIG ${JSON.stringify(item.diagram).slice(0, 240)}`);
  if (item.form === 'mcq') lines.push(...item.options.map((o, i) => `${i === item.answer ? '*' : ' '} ${o.text}`), `why: ${item.why ?? ''}`);
  if (item.form === 'theory') lines.push(...item.points.map((p) => `- (${p.marks}) ${p.text}`));
  if (item.form === 'numeric') lines.push(...item.parts.map((p) => `> (${p.marks}) ${p.ask} = ${p.question.answerText}`));
  if (item.form === 'output') lines.push(item.code, `=> ${item.expected}`);
  return lines.join('\n');
}

const OUT = process.env.VARIETY_DUMP;
it.runIf(OUT)('dumps samples', async () => {
  const wanted = (process.env.VARIETY_TOPICS ?? '').split(',').map((s) => s.trim());
  const per = Number(process.env.VARIETY_PER ?? 1);
  const only = process.env.VARIETY_FAMILY;
  const out: string[] = [];
  for (const want of wanted) {
    const [subject, level, place] = want.split(' ');
    const set = await loadBlueprints(subject as SubjectId, level as ClassLevel);
    const pool = set.blueprints.filter((b) => b.family && `${b.unit}${b.topic}` === place && (!only || b.family === only));
    const byFamily = new Map<string, typeof pool>();
    for (const b of pool) byFamily.set(b.family!, [...(byFamily.get(b.family!) ?? []), b]);
    out.push(`=== ${want}: ${pool.length} blueprints`);
    for (const [family, list] of byFamily) {
      out.push(`--- ${family} (${list.length})`);
      for (let i = 0; i < per; i++) out.push(show(generateItem(list[(i * 7) % list.length], (i + 1) * 104729, set.names(list[0]))));
    }
  }
  fs.writeFileSync(OUT!, out.join('\n'));
}, 120_000);
