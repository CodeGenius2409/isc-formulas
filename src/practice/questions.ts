// Question generation.
//   Tier 1 (solvable formulas): numeric problems with random values, marked with a
//     tolerance, with unit checking and a worked solution.
//   Tier 2 (every formula): multiple choice with distractors from the same topic,
//     and recall cards.
import { isBodyExpr } from '../data/expr';
import type { Compounds } from '../data/structures';
import type { EntryStructure, Formula } from '../data/types';
import { formatDim, parseDim, sameDim } from '../solver/dims';
import { getEntry } from '../solver/registry';
import { defaultUnknown, solve, varTex, type SolveInput, type Step } from '../solver/solve';
import type { ResolvedEntry, ResolvedVar } from '../solver/types';
import { convertResult, dimOfUnit, formatNumber, parseInput, plainNumber } from '../solver/units';
import { unitTex } from '../solver/tex';
import { unitLabel } from '../solver/unit-label';
import { answerSummary } from './bank/mark';
import type { BankQuestion } from './bank/types';

export type Rng = () => number;

/** A small seeded generator, so questions can be repeated and tested. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(list: readonly T[], rng: Rng): T => list[Math.floor(rng() * list.length)];

function shuffle<T>(list: readonly T[], rng: Rng): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface Given {
  symbol: string;
  name: string;
  raw: string;
  unit: string;
}

export interface NumericQuestion {
  kind: 'numeric';
  formulaId: string;
  unknown: string;
  unknownName: string;
  unknownTex: string;
  givens: Given[];
  /** Accepted answers, in `unit`. */
  answers: number[];
  unit: string;
  /** Units to choose from, some of them the wrong kind on purpose. */
  unitChoices: string[];
  /** Relative tolerance. 2% allows for rounding in intermediate steps. */
  tolerance: number;
  steps: Step[];
  answerText: string;
}

export type McqMode = 'which' | 'complete' | 'name' | 'structure';

export interface McqOption {
  latex?: string;
  /** Plain words. With a structure, its name: what the mistakes log records. */
  text?: string;
  /** A compound to draw, in place of words. */
  structure?: string;
  correct: boolean;
}

export interface McqQuestion {
  kind: 'mcq';
  formulaId: string;
  mode: McqMode;
  prompt: string;
  promptLatex?: string;
  /** A structure or reaction to read, drawn above the options. */
  promptStructure?: EntryStructure;
  options: McqOption[];
}

export interface RecallQuestion {
  kind: 'recall';
  formulaId: string;
  name: string;
  note?: string;
  latex: string;
}

export type Question = NumericQuestion | McqQuestion | RecallQuestion | BankQuestion;

const DEG = Math.PI / 180;

export function niceValue(v: ResolvedVar, rng: Rng): number {
  const [lo, hi] = v.gen;
  if (v.show === 'deg') {
    const low = Math.ceil(lo / DEG / 5);
    const high = Math.floor(hi / DEG / 5);
    return (low + Math.floor(rng() * (high - low + 1))) * 5 * DEG;
  }
  if (v.integer) return lo + Math.floor(rng() * (hi - lo + 1));
  // Ranges spanning several orders of magnitude are sampled evenly on a log scale.
  const raw = lo > 0 && hi / lo >= 50 ? Math.exp(Math.log(lo) + rng() * (Math.log(hi) - Math.log(lo))) : lo + rng() * (hi - lo);
  return Number(raw.toPrecision(2));
}

export function rawOf(v: ResolvedVar, value: number): { raw: string; unit: string } {
  if (v.show === 'deg') return { raw: String(Math.round(value / DEG)), unit: 'deg' };
  return { raw: plainNumber(value), unit: v.unit };
}

const WRONG_UNITS = ['m', 's', 'kg', 'N', 'J', 'W', 'Pa', 'A', 'V', 'mol', 'K', 'm/s', 'm/s^2', 'Hz', 'C'];

export function pickUnitChoices(v: ResolvedVar, unit: string, rng: Rng): string[] {
  if (!unit) return [];
  const right = new Set([unit, v.unit, ...v.alt]);
  const expected = parseDim(v.dim);
  const wrong = shuffle(WRONG_UNITS.filter((u) => !right.has(u) && !sameDim(dimOfUnit(u), expected)), rng).slice(0, 3);
  return shuffle([...right, ...wrong], rng);
}

/** Generates a numeric problem from a registry entry. Null if no good values turn up. */
export function numericQuestion(entry: ResolvedEntry, rng: Rng, chooseUnknown = true): NumericQuestion | null {
  const natural = defaultUnknown(entry);
  const candidates = entry.vars.filter((v) => !v.isConstant && v.value === undefined);
  for (let attempt = 0; attempt < 40; attempt++) {
    // Mostly ask for the formula's natural subject. Sometimes make the student rearrange.
    const unknownVar = chooseUnknown && rng() < 0.3 && candidates.length ? pick(candidates, rng) : (entry.vars.find((v) => v.symbol === natural) ?? entry.vars[0]);
    const inputs: Record<string, SolveInput> = {};
    const givens: Given[] = [];
    for (const v of entry.vars) {
      if (v === unknownVar) continue;
      const value = v.value ?? (v.isConstant ? v.gen[0] : niceValue(v, rng));
      const { raw, unit } = rawOf(v, value);
      inputs[v.symbol] = { raw, unit };
      if (!v.isConstant && v.value === undefined) givens.push({ symbol: varTex(v), name: v.name, raw, unit });
      else givens.push({ symbol: varTex(v), name: `${v.name} (take this value)`, raw, unit });
    }
    const outcome = solve(entry, unknownVar.symbol, inputs);
    if (!outcome.ok) continue;
    const valid = outcome.roots.filter((r) => !r.rejected);
    if (!valid.length || valid.some((r) => !Number.isFinite(r.shown) || Math.abs(r.value) > 1e40)) continue;
    // Avoid answers of exactly 0, which relative tolerance can't mark.
    if (valid.some((r) => Math.abs(r.shown) < 1e-40)) continue;
    const unit = valid[0].unit;
    return {
      kind: 'numeric',
      formulaId: entry.id,
      unknown: unknownVar.symbol,
      unknownName: unknownVar.name,
      unknownTex: varTex(unknownVar),
      givens,
      answers: valid.map((r) => r.shown),
      unit,
      unitChoices: pickUnitChoices(unknownVar, unit, rng),
      tolerance: 0.02,
      steps: outcome.steps,
      answerText: valid.map((r) => `${r.text}${unit === 'deg' ? '°' : unit ? ` ${unitLabel(unit)}` : ''}`).join(' or '),
    };
  }
  return null;
}

export interface NumericMark {
  correct: boolean;
  /** Why it was wrong, when the reason is useful. */
  reason?: string;
  shown: string;
}

function dimOfAnswerUnit(entry: ResolvedEntry | null, question: NumericQuestion): string {
  return entry?.vars.find((v) => v.symbol === question.unknown)?.dim ?? '';
}

const entry0 = (question: NumericQuestion) => getEntry(question.formulaId)?.vars.find((v) => v.symbol === question.unknown);

function markWithoutEntry(question: NumericQuestion, raw: string, chosenUnit: string, base: string, shown: string): NumericMark {
  const value = Number(raw.trim().replace(/[a-zA-Z°/²³Ωμ]+.*$/, '').trim());
  if (!Number.isFinite(value)) return { correct: false, reason: 'That doesn’t read as a number.', shown };
  let inBase = value;
  if (chosenUnit && chosenUnit !== base) {
    try {
      if (!sameDim(dimOfUnit(chosenUnit), dimOfUnit(base))) return { correct: false, reason: `${unitLabel(chosenUnit)} doesn’t measure the same thing as ${unitLabel(base)}.`, shown };
      inBase = convertResult(value, chosenUnit, base);
    } catch {
      return { correct: false, reason: `"${chosenUnit}" is not a unit I recognise.`, shown };
    }
  }
  const close = question.answers.some((answer) => Math.abs(inBase - answer) <= Math.abs(answer) * question.tolerance);
  return close ? { correct: true, shown } : { correct: false, shown };
}

/** Marks a typed answer: right number within tolerance, and a compatible unit. */
export function markNumeric(question: NumericQuestion, raw: string, chosenUnit: string): NumericMark {
  const entry = getEntry(question.formulaId);
  const target = entry?.vars.find((v) => v.symbol === question.unknown);
  const dim = dimOfAnswerUnit(entry, question);
  const shown = raw.trim() ? `${raw.trim()}${chosenUnit ? ` ${unitLabel(chosenUnit)}` : ''}` : '(no answer)';
  if (!raw.trim()) return { correct: false, reason: 'No answer was given.', shown };

  if (question.unit && !chosenUnit && !/[a-zA-Z°]/.test(raw)) {
    return { correct: false, reason: 'A unit is needed.', shown };
  }

  const base = question.unit === 'deg' ? 'deg' : question.unit;
  // An answer worked out by a blueprint has no solver entry to say what its unit measures, so the unit itself does.
  if (!entry0(question) && base) return markWithoutEntry(question, raw, chosenUnit, base, shown);
  // A unit of the wrong kind is its own mistake, so explain it before trying to convert.
  if (chosenUnit && base) {
    let actual;
    try {
      actual = dimOfUnit(chosenUnit);
    } catch {
      return { correct: false, reason: `"${chosenUnit}" is not a unit I recognise.`, shown };
    }
    if (!sameDim(actual, parseDim(dim))) {
      return { correct: false, reason: `${unitLabel(chosenUnit)} measures ${formatDim(actual)}, but the answer needs ${formatDim(parseDim(dim))}.`, shown };
    }
  }
  // Compare in the question's unit, whichever compatible unit the student used.
  const parsed = parseInput(raw, chosenUnit || base, base, target?.alt ?? [], dim);
  if (!parsed.ok) {
    return { correct: false, reason: parsed.problem, shown };
  }
  const close = question.answers.some((answer) => Math.abs(parsed.value - answer) <= Math.abs(answer) * question.tolerance);
  if (close) return { correct: true, shown };
  return { correct: false, shown };
}

/** The answer in the question's unit, for building test answers and hints. */
export function answerTex(question: NumericQuestion): string {
  return question.answers.map((a) => `${formatNumber(a, 3).tex}${question.unit === 'deg' ? '^{\\circ}' : question.unit ? `\\,${unitTex(question.unit)}` : ''}`).join('\\ \\text{or}\\ ');
}

/** Splits at the first `=` outside any brackets, for "complete the formula". */
export function splitAtEquals(latex: string): [string, string] | null {
  if (isBodyExpr(latex)) return null;
  let depth = 0;
  for (let i = 0; i < latex.length; i++) {
    const c = latex[i];
    if (c === '{' || c === '(' || c === '[') depth++;
    else if (c === '}' || c === ')' || c === ']') depth--;
    else if (c === '=' && depth === 0) {
      const lhs = latex.slice(0, i).trim();
      const rhs = latex.slice(i + 1).trim();
      if (lhs && rhs) return [lhs, rhs];
      return null;
    }
  }
  return null;
}

const compact = (s: string) => s.replace(/\s+|\\,|\\;|\\!|\\ /g, '');

/** Picks distinct wrong options from the pool. */
function distractors(values: { key: string; value: string }[], correct: string, count: number, rng: Rng): string[] {
  const seen = new Set([compact(correct)]);
  const out: string[] = [];
  for (const { value } of shuffle(values, rng)) {
    const key = compact(value);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
    if (out.length === count) break;
  }
  return out;
}

const hasTextOnly = (latex: string) => /^\\text\{[^}]*\}$/.test(latex.trim());

/**
 * A multiple-choice or recall question for any formula. The pool holds other formulas
 * from the same topic, widened as needed, so the distractors are plausible.
 */
export function conceptQuestion(formula: Formula, pool: Formula[], rng: Rng): Question {
  const everyone = pool.filter((f) => f.id !== formula.id);
  // An equation among word-only options gives itself away, so match the kind if possible.
  const isEquation = (latex: string) => splitAtEquals(latex) !== null;
  const alike = everyone.filter((f) => isEquation(f.latex) === isEquation(formula.latex));
  const others = alike.length >= 3 ? alike : everyone;
  const roll = rng();
  const split = splitAtEquals(formula.latex);

  if (roll < 0.8 && others.length) {
    if (roll < 0.3 && split && split[1].length >= 2 && !hasTextOnly(split[1])) {
      const rhsPool = others.flatMap((f) => {
        const s = splitAtEquals(f.latex);
        return s ? [{ key: f.id, value: s[1] }] : [];
      });
      const wrong = distractors(rhsPool, split[1], 3, rng);
      if (wrong.length >= 2) {
        return {
          kind: 'mcq',
          formulaId: formula.id,
          mode: 'complete',
          prompt: `Complete the formula: ${formula.name}`,
          promptLatex: `${split[0]}=\\ ?`,
          options: shuffle([{ latex: split[1], correct: true }, ...wrong.map((latex) => ({ latex, correct: false }))], rng),
        };
      }
    }
    if (roll < 0.55) {
      const wrong = distractors(others.map((f) => ({ key: f.id, value: f.latex })), formula.latex, 3, rng);
      if (wrong.length >= 2) {
        return {
          kind: 'mcq',
          formulaId: formula.id,
          mode: 'which',
          prompt: `Which formula gives: ${formula.name}?`,
          options: shuffle([{ latex: formula.latex, correct: true }, ...wrong.map((latex) => ({ latex, correct: false }))], rng),
        };
      }
    }
    const wrongNames = distractors(others.map((f) => ({ key: f.id, value: f.name })), formula.name, 3, rng);
    if (wrongNames.length >= 2) {
      return {
        kind: 'mcq',
        formulaId: formula.id,
        mode: 'name',
        prompt: 'What is this?',
        promptLatex: formula.latex,
        options: shuffle([{ text: formula.name, correct: true }, ...wrongNames.map((text) => ({ text, correct: false }))], rng),
      };
    }
  }
  return { kind: 'recall', formulaId: formula.id, name: formula.name, note: formula.note, latex: formula.latex };
}

function tokensOf(structure: EntryStructure): string[] {
  return structure.list ?? (structure.rows ?? []).flat().flatMap((token) => ('s' in token ? [token.s] : []));
}

/** Wrong options that look most like the right one: sharing a functional group, then the rest. */
function similarCompounds(key: string, compounds: Compounds, rng: Rng, avoid: Set<string> = new Set()): string[] {
  const groups = new Set(compounds[key].g);
  const others = shuffle(Object.keys(compounds), rng).filter((k) => k !== key && !avoid.has(k) && compounds[k].m !== compounds[key].m);
  const score = (k: string) => compounds[k].g.filter((g) => groups.has(g)).length;
  return [...others].sort((a, b) => score(b) - score(a));
}

/**
 * A question that reads a structure: name this compound, identify its functional group, or for a
 * reaction, draw the product. Null if this entry doesn't suit one.
 */
export function structureQuestion(formula: Formula, compounds: Compounds, rng: Rng): Question | null {
  const structure = formula.structure;
  if (!structure) return null;
  const keys = [...new Set(tokensOf(structure))].filter((k) => compounds[k]);
  if (!keys.length) return null;
  const roll = rng();

  // A reaction: everything up to the last arrow is the question, and its first structure the answer.
  const row = structure.rows?.[structure.rows.length - 1];
  const lastArrow = row ? row.map((t) => 'r' in t).lastIndexOf(true) : -1;
  if (row && lastArrow >= 0 && roll < 0.5) {
    const product = row.slice(lastArrow + 1).find((t): t is { s: string } => 's' in t)?.s;
    const known = new Set(row.slice(0, lastArrow).flatMap((t) => ('s' in t ? [t.s] : [])));
    if (product && compounds[product] && !known.has(product)) {
      const wrong = similarCompounds(product, compounds, rng, known).slice(0, 3);
      return {
        kind: 'mcq',
        formulaId: formula.id,
        mode: 'structure',
        prompt: 'Draw the product of this reaction on paper, then choose it.',
        promptStructure: { rows: [[...row.slice(0, lastArrow + 1), { t: '?' }]] },
        options: shuffle([product, ...wrong], rng).map((key) => ({ structure: key, text: compounds[key].n, correct: key === product })),
      };
    }
  }

  const key = pick(keys, rng);
  const compound = compounds[key];
  if (roll < 0.75 && compound.g.length) {
    const present = new Set(compound.g);
    const wrong = shuffle([...new Set(Object.values(compounds).flatMap((c) => c.g))], rng)
      .filter((g) => !present.has(g))
      .slice(0, 3);
    if (wrong.length === 3) {
      return {
        kind: 'mcq',
        formulaId: formula.id,
        mode: 'structure',
        prompt: 'Identify the functional group in this compound.',
        promptStructure: { list: [key], unnamed: 1 },
        options: shuffle([compound.g[0], ...wrong], rng).map((text) => ({ text, correct: text === compound.g[0] })),
      };
    }
  }
  const wrong = similarCompounds(key, compounds, rng).slice(0, 3);
  return {
    kind: 'mcq',
    formulaId: formula.id,
    mode: 'structure',
    prompt: 'Name this compound.',
    promptStructure: { list: [key], unnamed: 1 },
    options: shuffle([key, ...wrong], rng).map((k) => ({ text: compounds[k].n, correct: k === key })),
  };
}

/** Text of a question, for the mistakes log. */
export function questionSummary(question: Question): string {
  if (question.kind === 'numeric') return `Find ${question.unknownName}, given ${question.givens.map((g) => `${g.name.replace(' (take this value)', '')} = ${g.raw}${g.unit === 'deg' ? '°' : g.unit ? ` ${unitLabel(g.unit)}` : ''}`).join(', ')}`;
  if (question.kind === 'mcq') return question.prompt;
  if (question.kind === 'bank') return question.item.text;
  return `Recall: ${question.name}`;
}

export function correctSummary(question: Question): { text?: string; latex?: string } {
  if (question.kind === 'numeric') return { text: question.answerText };
  if (question.kind === 'recall') return { latex: question.latex };
  if (question.kind === 'bank') return { text: answerSummary(question.item) };
  const right = question.options.find((o) => o.correct)!;
  return right.latex ? { latex: right.latex } : { text: right.text };
}
