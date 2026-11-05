// Writes every blueprint's tags for scripts/private/blueprint-coverage.mjs and the reports. Only when asked:
//   WRITE_BLUEPRINT_TAGS=1 npx vitest run tests/unit/blueprint-tags-private.test.ts
import { writeFileSync } from 'node:fs';
import { describe, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import { generateItem } from '../../src/practice/gen/engine';

describe.skipIf(!process.env.WRITE_BLUEPRINT_TAGS)('blueprint tags', () => {
  it('writes them', async () => {
    const out: unknown[] = [];
    for (const subject of ['physics', 'chemistry', 'mathematics', 'computerscience'] as const) {
      for (const level of ['XI', 'XII'] as const) {
        const set = await loadBlueprints(subject, level);
        for (const bp of set.blueprints) {
          const kinds = new Set<string>();
          const sims = new Set<string>();
          for (let seed = 0; seed < 12; seed++) {
            const item = generateItem(bp, seed, set.names(bp));
            if (item.diagram) kinds.add(item.diagram.kind);
            if (item.simulator) sims.add(item.simulator.id);
          }
          const item = generateItem(bp, 3, set.names(bp));
          const names = set.names(bp);
          out.push({ id: bp.id, subject, level, unit: bp.unit, topic: bp.topic, unitName: names.unitName, topicName: names.topicName, marks: bp.marks, type: bp.type, format: bp.format, style: bp.style, difficulty: bp.difficulty, form: item.form, diagram: kinds.size ? [...kinds].join(', ') : undefined, sim: sims.size ? [...sims].join(', ') : undefined, sample: item.text.replace(/\s+/g, ' ').slice(0, 70) });
        }
      }
    }
    writeFileSync('data-private/blueprint-tags.json', JSON.stringify(out));
  }, 120_000);
});
