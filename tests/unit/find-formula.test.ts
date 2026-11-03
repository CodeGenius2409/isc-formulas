// Every formula can be found by its id, even one whose id no longer says where it lives.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { findFormula } from '../../src/data/book';
import type { Chunk, SharedEntry } from '../../src/data/types';

const gen = path.resolve(__dirname, '../../src/data/generated');
const read = <T,>(file: string): T => JSON.parse(fs.readFileSync(path.join(gen, file), 'utf8')) as T;

describe('findFormula', () => {
  it('finds every formula in the book', async () => {
    const ids = new Set(Object.keys(read<Record<string, SharedEntry>>('shared.json')));
    for (const subject of ['physics', 'chemistry', 'mathematics', 'computerscience']) {
      for (const level of ['XI', 'XII']) {
        for (const unit of read<Chunk>(`${subject}-${level}.json`).units) {
          for (const sub of unit.subtopics) {
            for (const item of sub.items) ids.add('ref' in item ? item.ref : item.id);
          }
        }
      }
    }
    expect(ids.size).toBe(7828);
    const missing: string[] = [];
    for (const id of ids) if (!(await findFormula(id))) missing.push(id);
    expect(missing).toEqual([]);
  }, 120_000);

  it('still answers null for an id that is not in the book', async () => {
    expect(await findFormula('p-xi-8-999999')).toBeNull();
  });
});
