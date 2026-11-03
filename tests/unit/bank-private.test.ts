// The shipped questions must be original. Where the private papers are on this machine, this looks for
// runs of words from them in the bank. Without them, as on the machine that deploys, it has nothing to do.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadBank } from '../../src/practice/bank';
import { ASSERTION_OPTIONS } from '../../src/practice/bank/define';
import type { BankDef } from '../../src/practice/bank/types';
import type { ClassLevel, SubjectId } from '../../src/data/types';

/**
 * Ten words in a row, in the wording of a question. Shorter runs turn up by themselves, since a subject
 * has its stock phrases ("the rate constant of a first order reaction"). Code is left out: a loop header
 * is written the same way by everyone.
 */
const RUN = 10;
const ROOT = path.resolve(__dirname, '../../data-private');

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}
const words = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);

const withoutCode = (text: string) => text.replace(/```[\s\S]*?```/g, ' | ');

function wordingOf(def: BankDef): string[] {
  if (def.form === 'mcq') return [def.text, ...def.options.map((o) => o.text).filter((t) => !ASSERTION_OPTIONS.includes(t))];
  return withoutCode(def.text).split('|');
}

const papers = [...walk(path.join(ROOT, 'text/papers')), ...walk(path.join(ROOT, 'ocr'))].filter((f) => f.endsWith('.txt'));

describe.skipIf(!papers.length)('originality against the private papers', () => {
  it('shares no run of ten words with any paper', async () => {
    const runs = new Set<string>();
    for (const file of papers) {
      const list = words(fs.readFileSync(file, 'utf8'));
      for (let i = 0; i + RUN <= list.length; i++) runs.add(list.slice(i, i + RUN).join(' '));
    }
    const close: string[] = [];
    for (const subject of ['physics', 'chemistry', 'mathematics', 'computerscience'] as SubjectId[]) {
      for (const level of ['XI', 'XII'] as ClassLevel[]) {
        for (const def of (await loadBank(subject, level)).defs) {
          for (const text of wordingOf(def)) {
            const list = words(text);
            for (let i = 0; i + RUN <= list.length; i++) {
              if (runs.has(list.slice(i, i + RUN).join(' '))) {
                close.push(`${def.id}: ${list.slice(i, i + RUN).join(' ')}`);
                break;
              }
            }
          }
        }
      }
    }
    expect(close).toEqual([]);
  }, 180_000);
});
