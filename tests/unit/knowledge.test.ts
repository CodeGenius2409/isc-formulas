// The knowledge base: every topic has its share of facts, every row can become a question, and every link leads somewhere.
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import { FACT_BOOK, type Facts } from '../../src/data/blueprints/dsl';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { ASSERTION_OPTIONS } from '../../src/practice/bank/define';
import { generateItem } from '../../src/practice/gen/engine';

interface Row {
  key: string;
  name: string;
  facts: number;
  asked: number;
}

const BEFORE = JSON.parse(readFileSync('reports/fact-counts-before.json', 'utf8')) as Row[];
const SUBJECTS: SubjectId[] = ['physics', 'chemistry', 'mathematics', 'computerscience'];
const LEVELS: ClassLevel[] = ['XI', 'XII'];

const FACT_KEYS: (keyof Facts)[] = ['ar', 'define', 'recall', 'reason', 'compare', 'truths', 'explain', 'long', 'cases', 'draw'];
const countFacts = (f: Facts | undefined) => (f ? FACT_KEYS.reduce((n, k) => n + ((f[k] as unknown[] | undefined)?.length ?? 0), 0) : 0);

/** The most-asked topics of a subject need three times what they had, and at least 40. All others need at least 15. */
export function targetFor(row: Row, rows: Row[]): number {
  const subject = row.key.split(' ')[0];
  const top = rows.filter((r) => r.key.startsWith(`${subject} `)).sort((a, b) => b.asked - a.asked).slice(0, 20);
  return top.includes(row) ? Math.max(40, row.facts * 3) : 15;
}

beforeAll(async () => {
  for (const s of SUBJECTS) for (const l of LEVELS) await loadBlueprints(s, l);
});

describe('how many facts', () => {
  it('every syllabus topic has the facts it needs', () => {
    const short = BEFORE.filter((r) => countFacts(FACT_BOOK.get(r.key)) < targetFor(r, BEFORE)).map((r) => `${r.key}: ${countFacts(FACT_BOOK.get(r.key))} of ${targetFor(r, BEFORE)}`);
    expect(short).toEqual([]);
  });
});

describe('every row', () => {
  it('is sound as data', () => {
    const problems: string[] = [];
    for (const [key, f] of FACT_BOOK) {
      const say = (text: string) => problems.push(`${key}: ${text}`);
      const firsts = new Map<string, Set<string>>();
      const once = (kind: string, text: string) => {
        const seen = firsts.get(kind) ?? new Set<string>();
        if (seen.has(text)) say(`${kind} twice: ${text}`);
        seen.add(text);
        firsts.set(kind, seen);
      };
      for (const r of f.recall ?? []) {
        once('recall', r[0]);
        if (r.length !== 5) say(`recall needs 5 parts: ${r[0]}`);
        if (new Set(r.slice(1)).size !== 4) say(`recall has a repeated option: ${r[0]}`);
      }
      for (const r of f.truths ?? []) {
        once('truths', r[0]);
        if (r[0] === r[1]) say(`truth equals its wrong version: ${r[0]}`);
      }
      // Fewer than three leave nothing to build a "which is correct" question with.
      if (f.truths?.length && f.truths.length < 3) say(`only ${f.truths.length} truths`);
      for (const r of f.define ?? []) {
        once('define', r[0]);
        if (r.length < 2 || r.length > 3) say(`define needs 1 or 2 meanings: ${r[0]}`);
      }
      for (const kind of ['reason', 'explain', 'draw'] as const) {
        for (const r of f[kind] ?? []) {
          once(kind, r[0]);
          // Anything else has no blueprint to go to, and would be left out silently.
          if (r.length < 2 || r.length > 4) say(`${kind} needs 1 to 3 points: ${r[0]}`);
        }
      }
      for (const r of f.compare ?? []) {
        once('compare', `${r[0]}|${r[1]}`);
        if (r.length < 4) say(`compare needs at least 2 rows: ${r[0]}`);
      }
      for (const r of f.ar ?? []) once('ar', r[0]);
      const text = JSON.stringify([f.ar, f.define, f.recall, f.reason, f.compare, f.truths, f.explain]);
      for (const bad of [/\bundefined\b/, /\bNaN\b/, /\bTODO\b/, /\[object/]) if (bad.test(text)) say(`contains ${bad}`);
    }
    expect(problems).toEqual([]);
  });
});

describe('links between facts', () => {
  const truth = (f: Facts, start: string) => (f.truths ?? []).filter((t) => t[0].startsWith(start));

  it('each names exactly one fact, in its own topic', () => {
    const problems: string[] = [];
    for (const [key, f] of FACT_BOOK) {
      for (const [relation, a, b] of f.links ?? []) {
        if (relation === 'contrast') {
          for (const term of [a, b]) if (!(f.define ?? []).some((d) => d[0] === term)) problems.push(`${key}: no term "${term}"`);
        } else {
          for (const start of [a, b]) {
            const found = truth(f, start).length;
            if (found !== 1) problems.push(`${key}: "${start}" names ${found} truths`);
          }
        }
        if (a === b) problems.push(`${key}: a link from "${a}" to itself`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('there are links in every most-asked topic', () => {
    const missing = BEFORE.filter((r) => targetFor(r, BEFORE) > 15 && !(FACT_BOOK.get(r.key)?.links?.length)).map((r) => r.key);
    expect(missing).toEqual([]);
  });

  for (const subject of SUBJECTS) {
    for (const level of LEVELS) {
      it(`${subject} ${level}: a linked assertion and reason has the right answer`, async () => {
        const set = await loadBlueprints(subject, level);
        for (const bp of set.blueprints.filter((b) => b.id.endsWith('-assertion-linked'))) {
          const f = FACT_BOOK.get(`${subject} ${level} ${bp.unit}${bp.topic}`)!;
          const links = (f.links ?? []).filter((l) => l[0] !== 'contrast');
          for (let seed = 0; seed < 200; seed++) {
            const item = generateItem(bp, seed, set.names(bp));
            if (item.form !== 'mcq') throw new Error(bp.id);
            expect(item.options.map((o) => o.text)).toEqual(ASSERTION_OPTIONS);
            const [, a, r] = /^Assertion: ([\s\S]*)\nReason: ([\s\S]*)$/.exec(item.text)!;
            const row = (f.truths ?? []).find((t) => t[0] === a || t[1] === a)!;
            const other = (f.truths ?? []).find((t) => t[0] === r || t[1] === r)!;
            expect(row && other, item.text).toBeTruthy();
            const link = links.find((l) => row[0].startsWith(l[1]) && other[0].startsWith(l[2]))!;
            expect(link, item.text).toBeDefined();
            const aTrue = a === row[0];
            const rTrue = r === other[0];
            expect(aTrue || rTrue).toBe(true);
            const right = !aTrue ? 3 : !rTrue ? 2 : link[0] === 'cause' ? 0 : 1;
            expect(item.answer, item.text).toBe(right);
          }
        }
      });
    }
  }
});
