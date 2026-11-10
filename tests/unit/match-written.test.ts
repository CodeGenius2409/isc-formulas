// Hand-written "match the columns" questions: each item in Column B is different, so every match has one right answer.
import { describe, expect, it } from 'vitest';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { loadBank } from '../../src/practice/bank';

const CLASSES: [SubjectId, ClassLevel][] = [['physics', 'XI'], ['physics', 'XII'], ['chemistry', 'XI'], ['chemistry', 'XII'], ['mathematics', 'XI'], ['mathematics', 'XII'], ['computerscience', 'XI'], ['computerscience', 'XII']];

describe.each(CLASSES)('%s %s', (subject, level) => {
  it('has no match with the same answer twice', async () => {
    const bank = await loadBank(subject, level);
    const matches = bank.defs.filter((x) => x.format === 'match' && (!x.origin || x.origin === 'written'));
    // Physics XII has its own written matches, so an empty list there means the filter is wrong.
    if (subject === 'physics' && level === 'XII') expect(matches.length).toBeGreaterThan(40);
    for (const d of matches) {
      const [, columns = ''] = d.text.split('\nColumn A\n');
      const [a = '', b = ''] = columns.split('\nColumn B\n');
      const left = a.split('\n').map((l) => l.replace(/^\(\d+\) /, ''));
      const right = b.split('\n').map((l) => l.replace(/^\([a-z]\) /, ''));
      expect(right.length, d.text).toBe(left.length);
      expect(new Set(right).size, d.text).toBe(right.length);
      expect(new Set(left).size, d.text).toBe(left.length);
      expect(d.marks, d.text).toBe(left.length);
    }
  });
});
