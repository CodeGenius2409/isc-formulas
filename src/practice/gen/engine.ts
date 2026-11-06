// Turns a blueprint and a seed into one question. The same pair always gives the same question, so a generated
// question or paper can be reopened from a link, a backup or the review schedule without being stored.
import type { Blueprint, Body } from '../../data/blueprints/types';
import { seededRng } from '../questions';
import type { BankItem, BankQuestion, GeneratedTag } from '../bank/types';
import { Gen, Retry } from './gen';

const MAX_TRIES = 200;

export const isGeneratedId = (id: string): boolean => id.startsWith('g-');

export function generatedId(blueprintId: string, seed: number): string {
  return `g-${blueprintId}-${seed}`;
}

/** Reads g-<blueprint>-<seed>. Null for anything else. */
export function parseGeneratedId(id: string): { blueprint: string; seed: number } | null {
  const match = /^g-(.+)-(\d+)$/.exec(id);
  return match ? { blueprint: match[1], seed: Number(match[2]) } : null;
}

/** Which subject and class a blueprint belongs to, so a lookup loads only that file. */
export function placeOfBlueprint(id: string): { subject: Blueprint['subject']; level: Blueprint['level'] } | null {
  const match = /^([pcmk])(1[12])-/.exec(id);
  if (!match) return null;
  const subjects = { p: 'physics', c: 'chemistry', m: 'mathematics', k: 'computerscience' } as const;
  return { subject: subjects[match[1] as keyof typeof subjects], level: match[2] === '12' ? 'XII' : 'XI' };
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** What a question must be before anyone sees it. Returns what is wrong, in words. */
export function problemsWith(bp: Blueprint, body: Body): string[] {
  const problems: string[] = [];
  if (!body.text?.trim()) problems.push('no question text');
  // LaTeX is full of braces, so only the words between $ signs are checked for a value left unfilled.
  if (/\{[A-Za-z]\w*\}/.test(body.text.replace(/\$[^$]*\$/g, ''))) problems.push(`an unfilled value in: ${body.text}`);
  if (/\bNaN\b|\bundefined\b|Infinity/.test(body.text)) problems.push(`a broken value in: ${body.text}`);
  switch (body.form) {
    case 'mcq': {
      const texts = body.options.map((o) => o.text);
      if (texts.length < 2) problems.push('too few options');
      if (new Set(texts).size !== texts.length) problems.push(`repeated options: ${texts.join(' | ')}`);
      if (!Number.isInteger(body.answer) || body.answer < 0 || body.answer >= texts.length) problems.push('no correct option');
      if (texts.some((t) => !t.trim())) problems.push('a blank option');
      break;
    }
    case 'theory': {
      const sum = body.points.reduce((s, p) => s + p.marks, 0);
      if (sum !== bp.marks) problems.push(`points add up to ${sum}, not ${bp.marks}`);
      if (body.points.some((p) => !p.text.trim() || p.marks <= 0)) problems.push('an empty marking point');
      break;
    }
    case 'numeric': {
      const sum = body.parts.reduce((s, p) => s + p.marks, 0);
      if (sum !== bp.marks) problems.push(`parts add up to ${sum}, not ${bp.marks}`);
      for (const part of body.parts) {
        for (const answer of part.question.answers) {
          if (!Number.isFinite(answer)) problems.push(`an answer that isn't finite for: ${part.ask}`);
          problems.push(...impossible(part.question.unknownName, answer, part.question.unit));
        }
      }
      break;
    }
    case 'output':
      if (!body.expected.trim()) problems.push('no output');
      if (!body.code.trim()) problems.push('no program');
      break;
  }
  return problems;
}

const ALWAYS_POSITIVE = /\b(mass|length|radius|resistance|resistivity|capacitance|inductance|wavelength|frequency|period|time|half-life|half life|area|volume|temperature|speed|impedance|reactance|molarity|molality|density)\b/i;
const LIGHT_SPEED = 3.0e8;

/** Values no sensible question has: a negative mass, a speed above c, a probability above one. */
export function impossible(name: string, value: number, unit: string): string[] {
  const out: string[] = [];
  if (ALWAYS_POSITIVE.test(name) && value <= 0) out.push(`${name} of ${value} ${unit} can't be negative or zero`);
  if (/\b(speed|velocity)\b/i.test(name) && unit === 'm/s' && Math.abs(value) > LIGHT_SPEED * 1.001) out.push(`${name} of ${value} m/s is faster than light`);
  if (/\bprobability\b/i.test(name) && (value < 0 || value > 1)) out.push(`a probability of ${value}`);
  if (/\befficiency\b/i.test(name) && unit === '' && (value < 0 || value > 1)) out.push(`an efficiency of ${value}`);
  return out;
}

export interface Names {
  unitName: string;
  topicName: string;
}

/** One question. Throws if a blueprint can't produce anything in many tries, which a test rules out. */
export function generateItem(bp: Blueprint, seed: number, names: Names): BankItem {
  const rng = seededRng((seed ^ hash(bp.id)) >>> 0);
  const g = new Gen(rng, bp.subject, bp.id);
  g.seed = seed;
  let last = '';
  for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
    try {
      const body = bp.make(g);
      const problems = problemsWith(bp, body);
      if (problems.length) {
        last = problems.join('; ');
        continue;
      }
      const marks = body.form === 'theory' || body.form === 'numeric' ? bp.marks : bp.marks;
      const generated: GeneratedTag = { blueprint: bp.id, seed, style: bp.style, format: bp.format, ...(bp.reviewed ? {} : { unreviewed: true as const }) };
      return {
        ...body,
        id: generatedId(bp.id, seed),
        subject: bp.subject,
        level: bp.level,
        unit: bp.unit,
        topic: bp.topic,
        marks,
        type: bp.type,
        difficulty: bp.difficulty,
        python: body.python ?? bp.python,
        ...names,
        generated,
      } as BankItem;
    } catch (err) {
      if (!(err instanceof Retry)) throw err;
      last = err.message;
    }
  }
  throw new Error(`${bp.id} with seed ${seed} gave nothing usable: ${last}`);
}

export function generatedQuestion(bp: Blueprint, seed: number, names: Names): BankQuestion {
  const item = generateItem(bp, seed, names);
  return { kind: 'bank', formulaId: item.id, item };
}
