// An assertion and a reason may only be paired if they're about one concept, and the stated answer must be right.
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import type { ArNode } from '../../src/data/blueprints/dsl';
import KNOWLEDGE_CHEM_XI from '../../src/data/blueprints/knowledge/chemistry-xi';
import KNOWLEDGE_CHEM_XII from '../../src/data/blueprints/knowledge/chemistry-xii';
import KNOWLEDGE_CS_XI from '../../src/data/blueprints/knowledge/computerscience-xi';
import KNOWLEDGE_CS_XII from '../../src/data/blueprints/knowledge/computerscience-xii';
import KNOWLEDGE_MATHS_XI from '../../src/data/blueprints/knowledge/mathematics-xi';
import KNOWLEDGE_MATHS_XII from '../../src/data/blueprints/knowledge/mathematics-xii';
import KNOWLEDGE_PHYS_XI from '../../src/data/blueprints/knowledge/physics-xi';
import KNOWLEDGE_PHYS_XII from '../../src/data/blueprints/knowledge/physics-xii';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { ASSERTION_OPTIONS } from '../../src/practice/bank/define';
import { generateItem } from '../../src/practice/gen/engine';

const SETS: [SubjectId, ClassLevel, Record<string, { ar?: ArNode[] }>][] = [
  ['physics', 'XI', KNOWLEDGE_PHYS_XI],
  ['physics', 'XII', KNOWLEDGE_PHYS_XII],
  ['chemistry', 'XI', KNOWLEDGE_CHEM_XI],
  ['chemistry', 'XII', KNOWLEDGE_CHEM_XII],
  ['mathematics', 'XI', KNOWLEDGE_MATHS_XI],
  ['mathematics', 'XII', KNOWLEDGE_MATHS_XII],
  ['computerscience', 'XI', KNOWLEDGE_CS_XI],
  ['computerscience', 'XII', KNOWLEDGE_CS_XII],
];

const INSTANCES = Number(process.env.BLUEPRINT_INSTANCES ?? 1000);

describe('every node is sound as data', () => {
  for (const [subject, level, topics] of SETS) {
    it(`${subject} ${level}`, () => {
      for (const [topic, facts] of Object.entries(topics)) {
        for (const node of facts.ar ?? []) {
          expect(new Set(node).size, `${topic}: repeated text in ${node[0]}`).toBe(node.length);
          for (const text of node) expect(text.trim().length, `${topic}: ${node[0]}`).toBeGreaterThanOrEqual(3);
        }
      }
    });
  }
});

for (const [subject, level, topics] of SETS) {
  describe(`${subject} ${level}`, async () => {
    const set = await loadBlueprints(subject, level);
    const assertions = set.blueprints.filter((b) => b.type === 'assertion');
    const nodes = new Map(Object.values(topics).flatMap((t) => (t.ar ?? []).map((n): [string, ArNode] => [n[0], n])));

    it('has a concept for each one, and enough of them across the class', () => {
      expect(assertions.length).toBeGreaterThan(3);
    });

    it(`${INSTANCES} questions for each blueprint: one concept, and the right answer`, () => {
      const outcomes = new Set<number>();
      for (const bp of assertions) {
        for (let seed = 0; seed < INSTANCES; seed++) {
          const item = generateItem(bp, seed, set.names(bp));
          if (item.form !== 'mcq') throw new Error(bp.id);
          expect(item.options.map((o) => o.text)).toEqual(ASSERTION_OPTIONS);
          const node = nodes.get(item.concept ?? '');
          expect(node, `${bp.id}: no concept "${item.concept}"`).toBeDefined();
          const [, statement, falseStatement, because, falseBecause, alsoTrue] = node!;
          const [, a, r] = /^Assertion: ([\s\S]*)\nReason: ([\s\S]*)$/.exec(item.text)!;
          // Both come from the same node, so the pair is about one concept.
          expect([statement, falseStatement]).toContain(a);
          expect([because, falseBecause, alsoTrue]).toContain(r);
          // The stated answer follows from which statements are true.
          const aTrue = a === statement;
          const rTrue = r !== falseBecause;
          const explains = r === because;
          const right = aTrue && rTrue && explains ? 0 : aTrue && rTrue ? 1 : aTrue ? 2 : 3;
          // A false assertion with a false reason would be a fifth outcome, which the options don't have.
          expect(aTrue || rTrue).toBe(true);
          expect(item.answer, `${bp.id}: ${item.text}`).toBe(right);
          outcomes.add(right);
        }
      }
      expect([...outcomes].sort()).toEqual([0, 1, 2, 3]);
    });
  });
}
