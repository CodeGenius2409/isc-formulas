// Stacks and queues were in papers up to 2025, and aren't in the 2028 syllabus. Nothing shipped may treat them as a topic.
// A call stack is another thing: it's how a program runs, and the tracer shows one.
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import type { ClassLevel } from '../../src/data/types';
import { SAMPLES } from '../../src/java/samples';
import { loadBank } from '../../src/practice/bank';
import { generateItem } from '../../src/practice/gen/engine';
import { SIMS } from '../../src/sims/registry';

const FINE = /call[- ]stack|stack overflow|stackoverflowerror|stack space|stack frame|review queue/gi;
const TOPIC = /\b(stacks?|queues?|enqueue|dequeue|deque|linked[- ]lists?|underflow)\b/i;
const hits = (text: string): string[] => {
  const match = TOPIC.exec(text.replace(FINE, ' '));
  return match ? [match[0]] : [];
};

const LEVELS: ClassLevel[] = ['XI', 'XII'];

describe('no stacks or queues in shipped Computer Science', () => {
  it('in the formula book', () => {
    for (const level of LEVELS) {
      const data = JSON.parse(fs.readFileSync(`src/data/generated/computerscience-${level}.json`, 'utf8')) as { units: { name: string; subtopics: { name: string; items: unknown[] }[] }[] };
      for (const unit of data.units) {
        for (const sub of unit.subtopics) {
          expect(hits(sub.name), sub.name).toEqual([]);
          for (const item of sub.items) expect(hits(JSON.stringify(item)), JSON.stringify(item).slice(0, 120)).toEqual([]);
        }
      }
    }
  });

  it('in the syllabus map', () => {
    expect(hits(fs.readFileSync('src/data/syllabus/computerscience.json', 'utf8'))).toEqual([]);
  });

  it('in the question bank', async () => {
    for (const level of LEVELS) {
      for (const def of (await loadBank('computerscience', level)).defs) expect(hits(JSON.stringify(def)), def.id).toEqual([]);
    }
  });

  it('in every blueprint, over many instances', async () => {
    for (const level of LEVELS) {
      const set = await loadBlueprints('computerscience', level);
      for (const bp of set.blueprints) {
        for (let seed = 0; seed < 60; seed++) expect(hits(JSON.stringify(generateItem(bp, seed, set.names(bp)))), bp.id).toEqual([]);
      }
    }
  });

  it('in the Java samples and the simulator list', () => {
    expect(hits(JSON.stringify(SAMPLES))).toEqual([]);
    for (const sim of SIMS.filter((s) => s.subject === 'computerscience')) expect(hits(`${sim.title} ${sim.desc}`), sim.id).toEqual([]);
  });

  it('and the removed entries are kept in the archive, with the reason', () => {
    const archive = JSON.parse(fs.readFileSync('archive/removed-formulas.json', 'utf8')) as { id: string; reason: string }[];
    const moved = archive.filter((e) => e.reason === 'Not in 2028 syllabus.').map((e) => e.id);
    expect(moved).toEqual(expect.arrayContaining(['cs-xii-2-1', 'cs-xii-2-2', 'cs-xii-3-14', 'cs-xii-3-15']));
  });
});
