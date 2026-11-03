// The question bank: every question is tagged to the syllabus, its marks add up, every numerical is
// computed by the solver, every program runs and prints what the bank says, and a paper can be built.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ClassLevel, EntryStructure, Syllabus, SubjectId } from '../../src/data/types';
import { runProgram } from '../../src/java/trace';
import { bankOfId, isBankId } from '../../src/practice/bank/define';
import { instantiate, loadBank, type LoadedBank } from '../../src/practice/bank';
import { isPassing, markPart, normaliseOutput, qualityOf, scoreOf } from '../../src/practice/bank/mark';
import { assemblePaper, paperResult, paperSpec } from '../../src/practice/bank/paper';
import type { BankDef, NumericItem } from '../../src/practice/bank/types';
import { seededRng } from '../../src/practice/questions';

const SUBJECTS: SubjectId[] = ['physics', 'chemistry', 'mathematics', 'computerscience'];
const LEVELS: ClassLevel[] = ['XI', 'XII'];
const CLASSES = SUBJECTS.flatMap((subject) => LEVELS.map((level) => ({ subject, level, name: `${subject} ${level}` })));

const compounds = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../src/data/generated/structures.json'), 'utf8'));
const compoundKeys = new Set(Object.keys(compounds.compounds ?? compounds));
const syllabusOf = (subject: SubjectId): Syllabus => JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../src/data/syllabus/${subject}.json`), 'utf8'));

function structureKeys(structure?: EntryStructure): string[] {
  if (!structure) return [];
  return [...(structure.list ?? []), ...(structure.rows ?? []).flat().flatMap((t) => ('s' in t ? [t.s] : []))];
}

const banks = new Map<string, LoadedBank>();
async function bankFor(subject: SubjectId, level: ClassLevel): Promise<LoadedBank> {
  const key = `${subject}${level}`;
  if (!banks.has(key)) banks.set(key, await loadBank(subject, level));
  return banks.get(key)!;
}

describe.each(CLASSES)('$name', ({ subject, level }) => {
  let defs: BankDef[];
  beforeEach(async () => {
    defs = (await bankFor(subject, level)).defs;
  });

  it('has unique ids that lead back to this bank', () => {
    expect(defs.length).toBeGreaterThan(30);
    expect(new Set(defs.map((d) => d.id)).size).toBe(defs.length);
    for (const d of defs) {
      expect(isBankId(d.id)).toBe(true);
      expect(bankOfId(d.id)).toEqual({ subject, level });
    }
  });

  it('tags every question with a real unit and topic from the syllabus map', () => {
    const units = syllabusOf(subject).classes.find((c) => c.level === level)!.units;
    for (const d of defs) {
      const unit = units.find((u) => u.number === d.unit);
      expect(unit, `${d.id}: unit ${d.unit}`).toBeTruthy();
      expect(unit!.topics.map((t) => t.key), `${d.id}: topic ${d.topic}`).toContain(d.topic);
      expect([1, 2, 3], d.id).toContain(d.difficulty);
      expect(d.marks, d.id).toBeGreaterThan(0);
    }
  });

  it('has marking points that add up to the marks for the question', () => {
    for (const d of defs) {
      if (d.form === 'theory') expect(d.points.reduce((sum, p) => sum + p.marks, 0), d.id).toBe(d.marks);
      if (d.form === 'numeric') expect(d.parts.reduce((sum, p) => sum + p.marks, 0), d.id).toBe(d.marks);
    }
  });

  it('has multiple choice questions with distinct options and a valid answer', () => {
    for (const d of defs) {
      if (d.form !== 'mcq') continue;
      expect(d.options.length, d.id).toBeGreaterThanOrEqual(2);
      expect(new Set(d.options.map((o) => o.text)).size, d.id).toBe(d.options.length);
      expect(d.options[d.answer], d.id).toBeTruthy();
    }
  });

  it('draws only compounds that have verified structures', () => {
    for (const d of defs) {
      const keys = [...structureKeys(d.structure), ...(d.form === 'mcq' ? d.options.flatMap((o) => (o.structure ? [o.structure] : [])) : [])];
      for (const key of keys) expect(compoundKeys.has(key), `${d.id}: ${key}`).toBe(true);
    }
  });

  it('computes every numerical through the solver, with fresh values, for many attempts', async () => {
    const bank = await bankFor(subject, level);
    for (const d of defs) {
      if (d.form !== 'numeric') continue;
      const texts = new Set<string>();
      for (let seed = 1; seed <= 25; seed++) {
        const item = instantiate(d, bank, seededRng(seed)) as NumericItem;
        texts.add(item.text + JSON.stringify(item.diagram ?? ''));
        expect(item.text, d.id).not.toMatch(/\{[A-Za-z]\w*\}/);
        item.parts.forEach((part, i) => {
          expect(part.ask, d.id).not.toMatch(/\{[A-Za-z]\w*\}/);
          expect(Number.isFinite(part.question.answers[0]), d.id).toBe(true);
          expect(part.question.steps.length, d.id).toBeGreaterThan(0);
          const parts = item.parts.map(() => ({ value: '', unit: '' }));
          parts[i] = { value: String(part.question.answers[0]), unit: part.question.unit };
          expect(markPart(item, i, { parts }).correct, `${d.id} part ${i + 1}: ${part.question.answers[0]} ${part.question.unit}`).toBe(true);
        });
      }
      expect(texts.size, `${d.id} should vary`).toBeGreaterThan(1);
    }
  });

  it('can build a paper with exactly the real structure, many times over', async () => {
    const bank = await bankFor(subject, level);
    const spec = paperSpec(subject, level);
    for (let seed = 1; seed <= 20; seed++) {
      const paper = assemblePaper(subject, level, bank, new Map(), seededRng(seed), 0);
      const ids = paper.sections.flatMap((s) => s.questions.map((q) => q.item.id));
      expect(new Set(ids).size).toBe(ids.length);
      paper.sections.forEach((section, i) => {
        const wanted = spec.sections[i].slots.flatMap((slot) => Array<number>(slot.count).fill(slot.marks));
        expect(section.questions.map((q) => q.item.marks)).toEqual(wanted);
        const units = spec.sections[i].units;
        if (units) for (const q of section.questions) expect(units).toContain(q.item.unit);
      });
      // Nothing answered means nothing scored, and the "any two" sections count only two.
      const result = paperResult(paper);
      expect(result.got).toBe(0);
      expect(result.total).toBe(spec.total);
      expect(result.topics.reduce((sum, t) => sum + t.outOf, 0)).toBe(spec.total);
    }
  });

  // The quality gate from the brief: not "what is the formula for X", except a small share of recall.
  it('passes the quality gate', () => {
    const recall = defs.filter((d) => d.recall || d.type === 'recall');
    expect(recall.length / defs.length).toBeLessThanOrEqual(0.05);
    const asksForFormula = /\b(what is|write|state|give) (down )?the (formula|expression) (for|of)\b/i;
    for (const d of defs) {
      if (recall.includes(d)) continue;
      expect('text' in d ? d.text : '', d.id).not.toMatch(asksForFormula);
    }
    const types = new Set(defs.map((d) => d.type));
    expect(types.size).toBeGreaterThanOrEqual(5);
  });

  it('writes Computer Science as code, with no maths-only markup', () => {
    if (subject !== 'computerscience') return;
    for (const d of defs) {
      const text = JSON.stringify(d);
      expect(text, d.id).not.toMatch(/\\\\frac|\\\\sqrt|\^\{/);
    }
  });
});

describe('Computer Science programs', () => {
  const allOutputs = async () => {
    const out: BankDef[] = [];
    for (const level of LEVELS) out.push(...(await bankFor('computerscience', level)).defs);
    return out;
  };

  it('prints exactly what "write the output" questions say, in the tracer’s interpreter', async () => {
    let checked = 0;
    for (const d of await allOutputs()) {
      if (d.form !== 'output' || d.python) continue;
      const run = runProgram(d.code);
      expect(run.error, `${d.id}: ${run.error}`).toBeFalsy();
      expect(normaliseOutput(run.output), d.id).toBe(normaliseOutput(d.expected));
      checked++;
    }
    expect(checked).toBeGreaterThan(5);
  });

  it('prints exactly what the Python questions say, when Python is on this machine', async () => {
    const version = spawnSync('python', ['-I', '--version']);
    if (version.status !== 0) return;
    for (const d of await allOutputs()) {
      if (d.form !== 'output' || !d.python) continue;
      const run = spawnSync('python', ['-I', '-c', d.code], { encoding: 'utf8' });
      expect(run.status, `${d.id}: ${run.stderr}`).toBe(0);
      expect(normaliseOutput(run.stdout), d.id).toBe(normaliseOutput(d.expected));
    }
  });

  it('has model programs that run, where the interpreter covers the feature', async () => {
    let checked = 0;
    for (const d of await allOutputs()) {
      if (d.form !== 'theory' || !d.model || d.python || !/static void main/.test(d.model) || /\bextends\b|\binterface\b|\bimplements\b|\bFileReader\b|\bthrows\b/.test(d.model)) continue;
      const code = /```\n?([\s\S]*?)```/.exec(d.model)?.[1] ?? d.model;
      const run = runProgram(code, ['5', '3', '1', '2', '3', '4', '5', '6', '7', '8', '9'].join(' '));
      expect(run.error, `${d.id}: ${run.error}`).toBeFalsy();
      checked++;
    }
    expect(checked).toBeGreaterThan(3);
  });
});

describe('marking', () => {
  const tags = { id: 'q-p12-1a-x', subject: 'physics', level: 'XII', unit: 1, topic: 'a', difficulty: 1, unitName: 'U', topicName: 'T' } as const;

  it('marks multiple choice by the option chosen', () => {
    const item = { ...tags, form: 'mcq', type: 'mcq', marks: 1, text: 't', options: [{ text: 'a' }, { text: 'b' }], answer: 1 } as const;
    expect(scoreOf({ ...item, options: [...item.options] }, { choice: 1 })).toBe(1);
    expect(scoreOf({ ...item, options: [...item.options] }, { choice: 0 })).toBe(0);
    expect(scoreOf({ ...item, options: [...item.options] }, undefined)).toBe(0);
  });

  it('adds up the ticked points of a written answer', () => {
    const item = { ...tags, form: 'theory', type: 'reason', marks: 3, text: 't', points: [{ text: 'a', marks: 1 }, { text: 'b', marks: 2 }] } as const;
    const mutable = { ...item, points: [...item.points] };
    expect(scoreOf(mutable, { ticks: [true, false] })).toBe(1);
    expect(scoreOf(mutable, { ticks: [true, true] })).toBe(3);
    expect(isPassing(mutable, 1)).toBe(false);
    expect(isPassing(mutable, 2)).toBe(true);
    expect(qualityOf(mutable, 3)).toBe(5);
    expect(qualityOf(mutable, 0)).toBeLessThan(3);
  });

  it('ignores spacing and line endings in program output, but not the content', () => {
    expect(normaliseOutput(' 1  2\r\n3 \n')).toBe('1 2\n3');
    expect(normaliseOutput('1 2 3')).not.toBe(normaliseOutput('1 2 4'));
  });
});

describe('with saved progress', () => {
  beforeEach(() => {
    const saved = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => void saved.set(key, value),
      removeItem: (key: string) => void saved.delete(key),
    });
    vi.resetModules();
  });

  it('records a bank question against its own id, in the schedule and the mistakes list, and in a backup', async () => {
    const progress = await import('../../src/practice/progress');
    const session = await import('../../src/practice/session');
    const bank = await bankFor('physics', 'XII');
    const def = bank.defs.find((d) => d.form === 'mcq')!;
    const question = { kind: 'bank' as const, formulaId: def.id, item: instantiate(def, bank, seededRng(1)) };
    progress.recordAnswer({ question, correct: false, quality: 1, asked: 'x', yourAnswer: 'y', correctAnswer: 'z', formula: { name: 'n', subject: 'physics', classLevel: 'XII', topic: 't' } });
    expect(progress.srsStore.get()[def.id].lapses).toBe(1);
    expect(progress.mistakesStore.get()[0].formulaId).toBe(def.id);

    // Retrying asks the same question, and review asks it afresh.
    const retry = session.startMistakes();
    expect(retry?.items[0].question).toEqual(question);
    const review = await session.startReview();
    expect(review?.items[0].question.formulaId).toBe(def.id);

    // Through a backup and back, nothing is lost.
    const text = JSON.stringify(progress.exportBackup());
    const parsed = progress.parseBackup(text);
    expect(parsed.ok).toBe(true);
    progress.srsStore.set({});
    progress.mistakesStore.set([]);
    if (parsed.ok) progress.importBackup(parsed.backup);
    expect(progress.srsStore.get()[def.id]).toBeTruthy();
    expect(progress.mistakesStore.get()[0].question).toEqual(question);
  });

  it('forgets a scheduled question that has left the bank, without touching anything else', async () => {
    const progress = await import('../../src/practice/progress');
    const session = await import('../../src/practice/session');
    const { newItem } = await import('../../src/practice/srs');
    const day = progress.today();
    progress.srsStore.set({ 'q-p12-1a-gone': newItem('q-p12-1a-gone', day), 'p-xi-2-7': newItem('p-xi-2-7', day) });
    await session.startReview();
    expect(Object.keys(progress.srsStore.get())).toEqual(['p-xi-2-7']);
  });
});
