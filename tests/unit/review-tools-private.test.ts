// Tools for the blueprint review, which do nothing unless asked.
// REVIEW_LIST=<file> writes every blueprint, in the order the review takes them: most-asked topics first.
// REVIEW_DUMP=<file> with REVIEW_IDS=<a,b,...> writes each blueprint's facts and sample instances, to be read.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import { FACT_BOOK } from '../../src/data/blueprints/dsl';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { generateItem } from '../../src/practice/gen/engine';
import type { BankItem } from '../../src/practice/bank/types';

const CLASSES: [SubjectId, ClassLevel][] = [
  ['physics', 'XII'], ['physics', 'XI'], ['chemistry', 'XII'], ['chemistry', 'XI'],
  ['mathematics', 'XII'], ['mathematics', 'XI'], ['computerscience', 'XII'], ['computerscience', 'XI'],
];

async function everything() {
  const out = [];
  for (const [subject, level] of CLASSES) {
    const set = await loadBlueprints(subject, level);
    for (const bp of set.blueprints) out.push({ bp, names: set.names(bp) });
  }
  return out;
}

function asked() {
  const counts = new Map<string, number>();
  if (!existsSync('data-private/question-analysis.json')) return counts;
  const records = JSON.parse(readFileSync('data-private/question-analysis.json', 'utf8')).records as { subject: string; level: string; unit: number; topic: string; outOfSyllabus?: boolean }[];
  for (const r of records) if (!r.outOfSyllabus) counts.set(`${r.subject} ${r.level} ${r.unit}${r.topic}`, (counts.get(`${r.subject} ${r.level} ${r.unit}${r.topic}`) ?? 0) + 1);
  return counts;
}

/** One instance, as plain text a reader can check. */
export function render(item: BankItem): string {
  const lines = [`Q [${item.marks}] ${item.text}`];
  if ('code' in item && item.code) lines.push(`CODE:\n${item.code}`);
  switch (item.form) {
    case 'mcq':
      item.options.forEach((o, i) => lines.push(`  ${i === item.answer ? '*' : ' '}${'abcd'[i]}) ${o.text}`));
      if (item.why) lines.push(`  WHY: ${item.why}`);
      break;
    case 'theory':
      for (const p of item.points) lines.push(`  - [${p.marks}] ${p.text}`);
      if (item.model) lines.push(`  MODEL: ${item.model}`);
      break;
    case 'numeric':
      for (const p of item.parts) lines.push(`  (${p.marks}) ${p.ask} => ${p.question.answers.join(', ')} ${p.question.unit ?? ''} | ${p.question.steps.map((s) => (typeof s === 'string' ? s : JSON.stringify(s))).join(' ; ')}`);
      break;
    case 'output':
      lines.push(`  EXPECTED: ${item.expected}`);
      if (item.why) lines.push(`  WHY: ${item.why}`);
      break;
    default:
      lines.push(JSON.stringify(item).slice(0, 600));
  }
  return lines.join('\n');
}

it('lists the blueprints in review order', async () => {
  const out = process.env.REVIEW_LIST;
  if (!out) return;
  const counts = asked();
  const rows = (await everything()).map(({ bp }) => {
    const topic = `${bp.subject} ${bp.level} ${bp.unit}${bp.topic}`;
    return { id: bp.id, topic, asked: counts.get(topic) ?? 0, reviewed: bp.reviewed, flagged: bp.flag ?? null };
  });
  rows.sort((a, b) => b.asked - a.asked || a.topic.localeCompare(b.topic) || a.id.localeCompare(b.id));
  writeFileSync(out, JSON.stringify(rows, null, 0).replace(/\},\{/g, '},\n{'));
}, 300_000);

it('dumps blueprints to read', async () => {
  const out = process.env.REVIEW_DUMP;
  if (!out) return;
  const ids = new Set((process.env.REVIEW_IDS ?? readFileSync(process.env.REVIEW_IDS_FILE!, 'utf8')).split(/[\s,]+/).filter(Boolean));
  const samples = Number(process.env.REVIEW_SAMPLES ?? 3);
  const all = (await everything()).filter(({ bp }) => ids.has(bp.id));
  const text: string[] = [];
  const topicsDone = new Set<string>();
  for (const { bp, names } of all) {
    const topic = `${bp.subject} ${bp.level} ${bp.unit}${bp.topic}`;
    if (process.env.REVIEW_FACTS && !topicsDone.has(topic)) {
      topicsDone.add(topic);
      const f = FACT_BOOK.get(topic);
      if (f) text.push(`\n######## FACTS ${topic} ${names.topicName}\n${JSON.stringify({ ...f, figures: f.figures && Object.keys(f.figures), answerFigures: f.answerFigures && Object.keys(f.answerFigures) }, null, 0).replace(/\],\[/g, '],\n[').replace(/"([a-z]+)":\[\[/g, '\n## $1\n[[')}`);
    }
    text.push(`\n==== ${bp.id} | ${bp.type} ${bp.format} ${bp.marks}m d${bp.difficulty} | ${names.topicName}`);
    const seen = new Set<string>();
    for (let seed = 1; seen.size < samples && seed < samples * 20; seed++) {
      try {
        const r = render(generateItem(bp, seed * 7919, names));
        if (seen.has(r)) continue;
        seen.add(r);
        text.push(r);
      } catch (err) {
        text.push(`ERROR ${(err as Error).message}`);
        break;
      }
    }
  }
  writeFileSync(out, text.join('\n'));
}, 300_000);
