// Every blueprint, 1,000 times: each answer finite and sensible, each multiple choice with one right option and
// no repeats, the marks adding up, and the same seed giving the same question.
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import { dimOfUnit } from '../../src/solver/units';
import { sameDim, parseDim } from '../../src/solver/dims';
import { getEntry } from '../../src/solver/registry';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { generateItem } from '../../src/practice/gen/engine';
import type { BankItem } from '../../src/practice/bank/types';

const CLASSES: [SubjectId, ClassLevel][] = [
  ['physics', 'XII'],
  ['physics', 'XI'],
  ['chemistry', 'XII'],
  ['chemistry', 'XI'],
  ['mathematics', 'XII'],
  ['mathematics', 'XI'],
  ['computerscience', 'XII'],
  ['computerscience', 'XI'],
];

const INSTANCES = Number(process.env.BLUEPRINT_INSTANCES ?? 1000);

function checkItem(item: BankItem): string[] {
  const out: string[] = [];
  const text = JSON.stringify(item);
  if (/\bundefined\b|\bNaN\b|\bInfinity\b/.test(text.replace(/"(formulaId|unknown)":"[^"]*"/g, ''))) out.push(`broken value: ${text.slice(0, 300)}`);
  if (!item.generated) out.push('no generated tag');
  if (!item.id.startsWith('g-')) out.push(`id ${item.id}`);
  switch (item.form) {
    case 'mcq': {
      const seen = item.options.map((o) => o.text);
      if (new Set(seen).size !== seen.length) out.push(`repeated options ${seen.join(' | ')}`);
      if (item.answer < 0 || item.answer >= seen.length) out.push('no right option');
      if (seen.length < 2) out.push('too few options');
      break;
    }
    case 'numeric': {
      const sum = item.parts.reduce((s, p) => s + p.marks, 0);
      if (sum !== item.marks) out.push(`parts total ${sum}, marks ${item.marks}`);
      for (const part of item.parts) {
        const q = part.question;
        if (!q.answers.length) out.push(`no answer for ${part.ask}`);
        for (const a of q.answers) {
          if (!Number.isFinite(a)) out.push(`not finite: ${a}`);
          const size = Math.abs(a);
          if (size !== 0 && (size > 1e40 || size < 1e-40)) out.push(`out of range: ${a} for ${part.ask}`);
        }
        if (!q.steps.length) out.push(`no working for ${part.ask}`);
        // The answer's unit has to measure what the registry says this quantity is.
        const entry = getEntry(q.formulaId);
        const target = entry?.vars.find((v) => v.symbol === q.unknown);
        if (entry && target && q.unit && target.dim !== undefined) {
          try {
            if (!sameDim(dimOfUnit(q.unit), parseDim(target.dim))) out.push(`unit ${q.unit} doesn't measure ${target.name}`);
          } catch (err) {
            out.push(`unit ${q.unit}: ${(err as Error).message}`);
          }
        }
      }
      break;
    }
    case 'theory': {
      const sum = item.points.reduce((s, p) => s + p.marks, 0);
      if (sum !== item.marks) out.push(`points total ${sum}, marks ${item.marks}`);
      break;
    }
    case 'output':
      if (!item.expected.trim()) out.push('empty output');
      break;
  }
  return out;
}

for (const [subject, level] of CLASSES) {
  describe(`${subject} ${level}`, async () => {
    const set = await loadBlueprints(subject, level);

    it('has unique ids, and valid places', async () => {
      const ids = set.blueprints.map((b) => b.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const bp of set.blueprints) {
        const names = set.names(bp);
        expect(names.unitName, `${bp.id}: unit`).not.toBe('');
        expect(names.topicName, `${bp.id}: topic`).not.toBe('');
      }
    });

    for (const bp of set.blueprints) {
      it(bp.id, () => {
        const names = set.names(bp);
        const problems = new Set<string>();
        for (let seed = 0; seed < INSTANCES; seed++) {
          const item = generateItem(bp, seed, names);
          for (const p of checkItem(item)) problems.add(p);
          if (problems.size > 5) break;
        }
        expect([...problems]).toEqual([]);
        // The same seed always gives the same question.
        for (const seed of [0, 1, 17, 999]) {
          expect(JSON.stringify(generateItem(bp, seed, names))).toBe(JSON.stringify(generateItem(bp, seed, names)));
        }
      });
    }
  });
}
