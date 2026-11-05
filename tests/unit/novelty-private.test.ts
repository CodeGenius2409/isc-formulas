// Step D's novelty check. It generates a large sample from every blueprint and looks for anything too close to a paper.
// It needs the private papers, so it only runs on a machine that has them, and only when asked:
//   NOVELTY_SAMPLES=300 npx vitest run tests/unit/novelty-private.test.ts
// What it finds goes to data-private/novelty.json. Counts from there go into reports/question-quality.md.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { ASSERTION_OPTIONS } from '../../src/practice/bank/define';
import type { BankItem } from '../../src/practice/bank/types';
import { generateItem } from '../../src/practice/gen/engine';

const ROOT = path.resolve(__dirname, '../../data-private');
const SAMPLES = Number(process.env.NOVELTY_SAMPLES ?? 0);

/** Ten words in a row is a copied phrase. The same limit as the check on the question bank. */
const RUN = 10;
/** Five words, to compare one generated question with one paper question. */
const SHINGLE = 5;
/** Too close: at least this share of a question's five-word runs comes from one paper question. */
const TOO_CLOSE = 0.6;
/** Too short to judge: a sentence like this is written the same way by anyone. */
const MIN_WORDS = 12;

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

const words = (text: string) => text.toLowerCase().replace(/\$[^$]*\$/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
const withoutCode = (text: string) => text.replace(/```[\s\S]*?```/g, ' | ');

function wordingOf(item: BankItem): string[] {
  const own = withoutCode(item.text).split('|');
  if (item.form === 'mcq') return [...own, ...item.options.map((o) => o.text).filter((t) => !ASSERTION_OPTIONS.includes(t))];
  if (item.form === 'numeric') return [...own, ...item.parts.map((p) => p.ask)];
  return own;
}

const papers = [...walk(path.join(ROOT, 'text/papers')), ...walk(path.join(ROOT, 'ocr'))].filter((f) => f.endsWith('.txt'));

describe.skipIf(!papers.length || !SAMPLES)('novelty against the private papers', () => {
  it('generates nothing too close to a paper', async () => {
    const runs = new Set<string>();
    for (const file of papers) {
      const list = words(fs.readFileSync(file, 'utf8'));
      for (let i = 0; i + RUN <= list.length; i++) runs.add(list.slice(i, i + RUN).join(' '));
    }
    const { records } = JSON.parse(fs.readFileSync(path.join(ROOT, 'question-analysis.json'), 'utf8')) as { records: { text: string; context?: string; source: string; q: number; sub: string }[] };
    const shingles = new Map<string, number[]>();
    records.forEach((r, index) => {
      const list = words(`${r.context ?? ''} ${r.text}`);
      for (let i = 0; i + SHINGLE <= list.length; i++) {
        const key = list.slice(i, i + SHINGLE).join(' ');
        const had = shingles.get(key);
        if (had) {
          if (had[had.length - 1] !== index) had.push(index);
        } else shingles.set(key, [index]);
      }
    });

    const flagged = new Map<string, { blueprint: string; why: string; text: string; source: string; score: number }>();
    const worst = new Map<string, number>();
    const scores: number[] = [];
    let longestRun = 0;
    let instances = 0;
    for (const subject of ['physics', 'chemistry', 'mathematics', 'computerscience'] as SubjectId[]) {
      for (const level of ['XI', 'XII'] as ClassLevel[]) {
        const set = await loadBlueprints(subject, level);
        const names = (bp: (typeof set.blueprints)[number]) => set.names(bp);
        for (const bp of set.blueprints) {
          const seen = new Set<string>();
          for (let seed = 1; seed <= SAMPLES; seed++) {
            const item = generateItem(bp, seed * 7919, names(bp));
            instances++;
            for (const text of wordingOf(item)) {
              if (seen.has(text)) continue;
              seen.add(text);
              const list = words(text);
              // The longest run of words that a paper also has.
              for (let i = 0; i + RUN <= list.length; i++) {
                const run = list.slice(i, i + RUN);
                if (!runs.has(run.join(' '))) continue;
                // Single letters and numbers, like the terms of a Boolean function, say nothing about where text came from.
                if (run.every((w) => w.length === 1 || /^\d+$/.test(w))) continue;
                let end = i + RUN;
                while (end < list.length && runs.has(list.slice(end - RUN + 1, end + 1).join(' '))) end++;
                longestRun = Math.max(longestRun, end - i);
                flagged.set(`${bp.id}|run`, { blueprint: bp.id, why: `${end - i} words in a row are in a paper`, text: list.slice(i, end).join(' '), source: '', score: end - i });
                break;
              }
              if (list.length < MIN_WORDS) continue;
              // The share of this question found in any one paper question.
              const hits = new Map<number, number>();
              const total = list.length - SHINGLE + 1;
              for (let i = 0; i < total; i++) {
                for (const r of shingles.get(list.slice(i, i + SHINGLE).join(' ')) ?? []) hits.set(r, (hits.get(r) ?? 0) + 1);
              }
              let best = 0;
              let bestAt = -1;
              for (const [r, n] of hits) {
                if (n > best) {
                  best = n;
                  bestAt = r;
                }
              }
              const share = best / total;
              scores.push(share);
              if (share > (worst.get(bp.id) ?? 0)) worst.set(bp.id, share);
              if (share >= TOO_CLOSE) flagged.set(`${bp.id}|share`, { blueprint: bp.id, why: `${Math.round(share * 100)}% of its five-word runs are in one paper question`, text: list.join(' ').slice(0, 300), source: `${records[bestAt].source} Q${records[bestAt].q}${records[bestAt].sub ?? ''}`, score: share });
            }
          }
        }
      }
    }
    const bands = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 1.01].map((low, i, all) => (i === all.length - 1 ? null : { from: low, to: all[i + 1], texts: scores.filter((s) => s >= low && s < all[i + 1]).length })).filter(Boolean);
    const result = {
      made: new Date().toISOString(),
      samplesPerBlueprint: SAMPLES,
      instances,
      texts: scores.length,
      longestRun,
      bands,
      closest: [...worst].sort((a, b) => b[1] - a[1]).slice(0, 20),
      flagged: [...flagged.values()].sort((a, b) => b.score - a.score),
    };
    fs.writeFileSync(path.join(ROOT, 'novelty.json'), JSON.stringify(result, null, 1));
    expect(result.flagged.map((f) => `${f.blueprint}: ${f.why}`)).toEqual([]);
  }, 3_600_000);
});
