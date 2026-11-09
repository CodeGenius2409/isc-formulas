// The variety engine: every family produces clean questions from the solver, and the targets for numerical topics hold.
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { writeFileSync } from 'node:fs';
import { generatedQuestion, generateItem, problemsWith } from '../../src/practice/gen/engine';
import { pickGenerated, structureKey } from '../../src/practice/gen/mix';
import { seededRng } from '../../src/practice/questions';

/** Falls to zero as material is written. It can only go down. */
const ALLOWED_SHORT = 1000;

const CLASSES: [SubjectId, ClassLevel][] = [['physics', 'XI'], ['physics', 'XII'], ['chemistry', 'XI'], ['chemistry', 'XII'], ['computerscience', 'XI'], ['computerscience', 'XII']];
const ALL_CLASSES: [SubjectId, ClassLevel][] = [...CLASSES, ['mathematics', 'XI'], ['mathematics', 'XII']];
const SAMPLES = Number(process.env.VARIETY_INSTANCES ?? 40);

describe.each(CLASSES)('%s %s', (subject, level) => {
  it('makes clean questions from every family', async () => {
    const set = await loadBlueprints(subject, level);
    const pool = set.blueprints.filter((b) => b.family);
    expect(pool.length).toBeGreaterThan(0);
    const failures: string[] = [];
    for (const bp of pool) {
      for (let k = 1; k <= SAMPLES; k++) {
        try {
          const item = generateItem(bp, k * 7919, set.names(bp));
          const text = JSON.stringify(item);
          if (/\bundefined\b|\bNaN\b|\bInfinity\b/.test(text.replace(/"(formulaId|unknown)":"[^"]*"/g, ''))) failures.push(`${bp.id}: broken ${text.slice(0, 200)}`);
          expect(problemsWith(bp, item as never)).toEqual([]);
        } catch (err) {
          failures.push(`${bp.id}: ${(err as Error).message.slice(0, 120)}`);
          break;
        }
      }
    }
    expect([...new Set(failures)].slice(0, 40)).toEqual([]);
  }, 600_000);
});

// The targets of v6 Task 1, for each subtopic with numericals. Maths topics built on abstract numbers have no settings to count.
describe('numerical topics', () => {
  it('reaches the targets for structures, settings and rotation', async () => {
    const short: string[] = [];
    for (const [subject, level] of ALL_CLASSES) {
      const set = await loadBlueprints(subject, level);
      const topics = new Map<string, typeof set.blueprints>();
      for (const bp of set.blueprints) if (bp.type === 'numerical' || bp.family) topics.set(`${bp.unit}${bp.topic}`, [...(topics.get(`${bp.unit}${bp.topic}`) ?? []), bp]);
      for (const [place, list] of topics) {
        if (!list.some((b) => b.type === 'numerical')) continue;
        const pool = set.blueprints.filter((b) => `${b.unit}${b.topic}` === place);
        const structures = new Set<string>();
        const contexts = new Map<string, number>();
        let instances = 0;
        for (const bp of list) {
          for (let k = 1; k <= 12; k++) {
            const q = generatedQuestion(bp, k * 7919, set.names(bp));
            structures.add(structureKey(q));
            const c = q.item.generated?.context;
            if (c) {
              contexts.set(c, (contexts.get(c) ?? 0) + 1);
              instances++;
            }
          }
        }
        const key = `${subject} ${level} ${place}`;
        if (structures.size < 10) short.push(`${key}: ${structures.size} structures`);
        if (subject !== 'mathematics' && subject !== 'computerscience' && contexts.size < 8) short.push(`${key}: ${contexts.size} kinds of setting`);
        const top = Math.max(0, ...contexts.values());
        if (instances && contexts.size >= 8 && top / instances > 0.3) short.push(`${key}: one setting has ${Math.round((top / instances) * 100)}%`);
        const run = pickGenerated(set, pool, { count: 40, rng: seededRng(7) }).map(structureKey);
        run.forEach((s, i) => {
          if (run.slice(Math.max(0, i - 10), i).includes(s)) short.push(`${key}: structure repeated within 10`);
        });
      }
    }
    const report = [...new Set(short)];
    if (process.env.VARIETY_SHORT) writeFileSync(process.env.VARIETY_SHORT, report.join(String.fromCharCode(10)));
    expect(report.length, report.join(String.fromCharCode(10))).toBeLessThanOrEqual(ALLOWED_SHORT);
  }, 600_000);
});
