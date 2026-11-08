// Answers that the blueprint review found wrong, worked out here from the question's own numbers, so they can't drift back.
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { generateItem } from '../../src/practice/gen/engine';

const SEEDS = Array.from({ length: 40 }, (_, i) => (i + 1) * 7919);

/** Every instance of one blueprint, as the question text and the first answer of each part. */
async function instances(subject: SubjectId, level: ClassLevel, id: string) {
  const set = await loadBlueprints(subject, level);
  const bp = set.blueprints.find((b) => b.id === id);
  if (!bp) throw new Error(`no blueprint ${id}`);
  return SEEDS.map((seed) => {
    const item = generateItem(bp, seed, set.names(bp)) as unknown as { text: string; parts: { ask: string; question: { answers: number[]; unit: string } }[]; points?: { text: string }[] };
    return { text: item.text, parts: item.parts, points: item.points };
  });
}

const numbers = (text: string) => [...text.matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));

describe('answers the review corrected', () => {
  it('a gun recoils at mv/M, not the embedded-bullet mv/(m + M)', async () => {
    for (const { text, parts } of await instances('physics', 'XI', 'p11-3a-recoil')) {
      const [grams, gun, speed] = numbers(text);
      expect(parts[0].question.answers[0], text).toBeCloseTo((grams / 1000) * speed / gun, 6);
    }
  });

  it('a thin ring has a moment of inertia of MR², not a disc’s ½MR²', async () => {
    let rings = 0;
    for (const { text, parts } of await instances('physics', 'XI', 'p11-5c-inertia-ring')) {
      if (!text.includes('thin ring')) continue;
      rings++;
      const [mass, radius] = numbers(text);
      expect(parts[0].question.answers[0], text).toBeCloseTo(mass * (radius / 100) ** 2, 6);
    }
    expect(rings).toBeGreaterThan(0);
  });

  it('g at hundreds of kilometres up uses the exact formula', async () => {
    let heights = 0;
    for (const { text, parts } of await instances('physics', 'XI', 'p11-6a-g-height')) {
      if (!text.includes('height')) continue;
      heights++;
      const [h, radius] = numbers(text);
      expect(parts[0].question.answers[0], text).toBeCloseTo(9.8 * (radius / (radius + h)) ** 2, 6);
    }
    expect(heights).toBeGreaterThan(0);
  });

  it('water mixed in °C is answered in °C, between the two temperatures', async () => {
    for (const { text, parts } of await instances('physics', 'XI', 'p11-8a-calorimetry')) {
      const [a, t, b, u] = numbers(text);
      expect(parts[0].question.unit, text).toBe('degC');
      expect(parts[0].question.answers[0], text).toBeCloseTo((a * t + b * u) / (a + b), 6);
    }
  });

  it('an ideal gas’s pressure is answered in the pascals its working uses', async () => {
    for (const { text, parts } of await instances('physics', 'XI', 'p11-9a-gas-law')) {
      const [n, v, t] = numbers(text);
      expect(parts[0].question.unit, text).toBe('Pa');
      expect(parts[0].question.answers[0], text).toBeCloseTo((n * 8.314 * t) / (v / 1000), 3);
    }
  });

  it('trolleys that stick together lose the kinetic energy they should', async () => {
    for (const { text, parts } of await instances('physics', 'XI', 'p11-4b-collision')) {
      const [a, u, b] = numbers(text);
      expect(parts[1].ask).toBe('Kinetic energy lost');
      expect(parts[1].question.answers[0], text).toBeCloseTo((a * b * u * u) / (2 * (a + b)), 6);
    }
  });
});

describe('how the review wants questions written', () => {
  it('every MCQ has four options, except a gate’s output of 0 or 1', async () => {
    const classes: [SubjectId, ClassLevel][] = [['physics', 'XII'], ['physics', 'XI'], ['chemistry', 'XII'], ['chemistry', 'XI'], ['mathematics', 'XII'], ['mathematics', 'XI'], ['computerscience', 'XII'], ['computerscience', 'XI']];
    for (const [subject, level] of classes) {
      const set = await loadBlueprints(subject, level);
      for (const bp of set.blueprints) {
        if (bp.format !== 'mcq' || bp.id === 'k12-2a-gate-output') continue;
        for (let i = 1; i <= 5; i++) {
          const item = generateItem(bp, i * 7919, set.names(bp)) as unknown as { options?: unknown[] };
          if (item.options) expect(item.options.length, bp.id).toBe(4);
        }
      }
    }
  }, 120000);

  it('complex answers read as a teacher would write them', async () => {
    for (const id of ['m11-2a-complex-product', 'm11-2a-complex-divide']) {
      for (const { text, points } of await instances('mathematics', 'XI', id)) {
        const all = [text, ...points!.map((p) => p.text)].join(' ');
        expect(all, all).not.toMatch(/\+ -|[^\d]1i|\b0 \+/);
      }
    }
  });

  it('points in space have spaces and true minus signs', async () => {
    for (const { text } of await instances('mathematics', 'XI', 'm11-3d-distance-3d')) {
      expect(text, text).toMatch(/\(−?\d, −?\d, −?\d\)/);
      expect(text, text).not.toContain('-');
    }
  });

  it('a method name keeps its small letter in a “distinguish” answer', async () => {
    for (const { points } of await instances('computerscience', 'XII', 'k12-7b-compare2')) {
      expect(points!.map((p) => p.text).join(' ')).toMatch(/append\(\): .* extend\(\): /);
    }
  });
});
