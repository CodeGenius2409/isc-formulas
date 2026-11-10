// Fills a paper's sections so that it reads like the real one: each section's mix of question types, its share of figures and of
// competency questions, the syllabus's marks for each unit, how often the papers ask each topic, and its internal choices.
// Mock papers and the teacher's full papers both come through here. The numbers are in paper-targets.json, from
// scripts/private/paper-structure.mjs, and tests/unit/paper-fidelity.test.ts measures how close 50 papers come to them.
import type { LoadedBlueprints } from '../../data/blueprints';
import type { Blueprint } from '../../data/blueprints/types';
import type { ClassLevel, SubjectId } from '../../data/types';
import { tryQuestion } from '../gen/engine';
import { bankFormatOf, defKeys, factsOf, historyKeys, pickGenerated, questionKey, type Freshness } from '../gen/mix';
import type { Rng } from '../questions';
import { isCompiled } from './define';
import { bankQuestion, type LoadedBank } from './index';
import targets from './paper-targets.json';
import type { BankDef, BankQuestion, QuestionFormat } from './types';

export interface SectionTarget {
  name: string;
  marks: number;
  count: number;
  /** How many of its questions have an "OR" alternative. */
  or: number;
  choose?: number;
  /** The share of each format, out of 1. */
  mix: Partial<Record<QuestionFormat, number>>;
  /** The share of questions with a figure to read or to draw. */
  figure: number;
  /** The share that apply, analyse or evaluate, rather than recall. */
  cbq: number;
  papers: number;
}

interface TargetFile {
  classes: Record<string, { papers: number; sameAs?: string; sections: SectionTarget[] }>;
  topicAsked: Record<string, Record<string, number>>;
}
const TARGETS = targets as unknown as TargetFile;

export const classTargets = (subject: SubjectId, level: ClassLevel): SectionTarget[] => TARGETS.classes[`${subject} ${level}`]?.sections ?? [];

/** The real paper's section of this name and mark value. "Part I" has two, told apart by their marks. */
export const sectionTarget = (subject: SubjectId, level: ClassLevel, name: string, marks: number): SectionTarget | undefined =>
  classTargets(subject, level).find((t) => t.marks === marks && (t.name === name || t.name.startsWith(`${name.replace(/ \(\d\)$/, '')} (`)));

/** How many parts of the papers ask each topic, by "3a". */
export const topicAsked = (subject: SubjectId, level: ClassLevel): Record<string, number> => TARGETS.topicAsked[`${subject} ${level}`] ?? {};

/** A question with a figure to read, or one to draw and be marked against. */
export const hasFigure = (d: { diagram?: unknown; answerDiagram?: unknown; format?: QuestionFormat; generated?: { format?: QuestionFormat } }): boolean => Boolean(d.diagram || d.answerDiagram || d.format === 'diagram' || d.generated?.format === 'diagram');

const THINKING: Partial<Record<QuestionFormat, 1>> = { numerical: 1, assertion: 1, cbq: 1, data: 1, predict: 1, mistake: 1, odd: 1, order: 1, statement: 1, output: 1, change: 1, trace: 1, error: 1, program: 1, convert: 1, fill: 1, distinguish: 1 };

/** Applies, analyses or evaluates, as the specimens tag their questions, rather than recalling. */
export const isCompetency = (format: QuestionFormat, style: string | undefined, difficulty: number): boolean => style === 'cbq-style' || Boolean(THINKING[format]) || difficulty === 3;

const isDerivationType = (type: string) => type === 'derivation' || type === 'proof';
export const blueprintFormat = (b: Blueprint): QuestionFormat => (isDerivationType(b.type) ? 'derivation' : b.format);

/** What stands in for a format with nothing left at this mark value, nearest first. */
const NEAR: Partial<Record<QuestionFormat, QuestionFormat[]>> = {
  'very-short': ['complete', 'reason', 'mcq'],
  complete: ['very-short', 'mcq'],
  reason: ['short', 'very-short', 'predict'],
  short: ['reason', 'long', 'distinguish', 'numerical'],
  long: ['short', 'derivation', 'cbq'],
  distinguish: ['short', 'reason'],
  diagram: ['short', 'long', 'data'],
  derivation: ['long', 'short'],
  numerical: ['short', 'data', 'long'],
  match: ['complete', 'short'],
  cbq: ['long', 'short'],
  assertion: ['mcq', 'statement'],
  mcq: ['statement', 'assertion', 'very-short'],
  program: ['fill', 'short', 'output'],
  output: ['trace', 'change', 'short'],
  fill: ['error', 'short', 'output'],
  convert: ['short', 'long'],
};

function shuffled<T>(list: readonly T[], rng: Rng): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * The formats for a section, as whole questions. Each gets its whole share, and the places left over are drawn in proportion to
 * what's left of each. A rare format turns up in some papers and not others, so its share over many papers comes out right.
 */
export function planFormats(mix: Partial<Record<QuestionFormat, number>>, count: number, rng: Rng): QuestionFormat[] {
  const entries = Object.entries(mix) as [QuestionFormat, number][];
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
  const out: QuestionFormat[] = [];
  const rest: [QuestionFormat, number][] = [];
  for (const [format, share] of entries) {
    const exact = (share / total) * count;
    const whole = Math.floor(exact + 1e-9);
    for (let i = 0; i < whole; i++) out.push(format);
    if (exact - whole > 1e-9) rest.push([format, exact - whole]);
  }
  while (out.length < count && rest.length) {
    let at = rng() * rest.reduce((s, [, v]) => s + v, 0);
    let i = 0;
    while (i < rest.length - 1 && (at -= rest[i][1]) > 0) i++;
    out.push(rest[i][0]);
    rest.splice(i, 1);
  }
  return shuffled(out, rng);
}

export interface PaperComposer {
  subject: SubjectId;
  level: ClassLevel;
  set?: LoadedBlueprints;
  weights: Map<number, number>;
  share: number;
  rng: Rng;
  fresh?: Freshness;
  reviewedOnly?: boolean;
  used: Set<string>;
  usedBlueprints: Set<string>;
  seenText: Set<string>;
  seenFacts: Set<string>;
  seenStructures: Set<string>;
  shapes: Set<string>;
  /** Marks given to each unit, across the whole paper. */
  unitMarks: Map<number, number>;
  topicTaken: Map<string, number>;
  asked: Record<string, number>;
  /** How many were filled by a blueprint not yet reviewed, as nothing else was left. */
  unreviewedFill: number;
  /** How many places took another format, as the one wanted had nothing left. */
  substituted: number;
  /** Places filled so far, and how many of them were generated, so the slider holds over the whole paper and not per section. */
  placed: number;
  madeSoFar: number;
  /** How many places the whole paper has, when known, so each place can be decided against what the paper still needs. */
  places?: number;
  /** How many of them should be generated, as the slider's message said; otherwise the share of the places, rounded. */
  madeTarget?: number;
}

export function createComposer(options: Pick<PaperComposer, 'subject' | 'level' | 'set' | 'weights' | 'share' | 'rng' | 'fresh' | 'reviewedOnly' | 'places' | 'madeTarget'>): PaperComposer {
  return { ...options, used: new Set(), usedBlueprints: new Set(), seenText: new Set(), seenFacts: new Set(), seenStructures: new Set(), shapes: new Set(), unitMarks: new Map(), topicTaken: new Map(), asked: topicAsked(options.subject, options.level), unreviewedFill: 0, substituted: 0, placed: 0, madeSoFar: 0 };
}

export interface SlotRequest {
  /** The fixed questions these filters allow. */
  defs: BankDef[];
  blueprints: Blueprint[];
  /** For the names of units and topics. */
  bank: LoadedBank;
  marks: number;
  count: number;
  /** The formats to aim for. Without one, whatever there is, as in a custom section. */
  mix?: Partial<Record<QuestionFormat, number>>;
  figure?: number;
  cbq?: number;
  or?: number;
  /** Keep each format together, as Section A of Chemistry and Mathematics does. */
  grouped?: QuestionFormat[];
}

export interface SlotResult {
  questions: BankQuestion[];
  /** By the id of the question each one is an alternative to. */
  alternatives: Record<string, BankQuestion>;
  short: number;
}

/** A blueprint's figure is only known from a question it makes, so it's looked at once. */
const blueprintFigure = new Map<string, boolean>();
function bpHasFigure(c: PaperComposer, b: Blueprint): boolean {
  let known = blueprintFigure.get(b.id);
  if (known === undefined) {
    const q = c.set ? tryQuestion(b, 7919, c.set.names(b)) : null;
    known = Boolean(q && hasFigure({ ...q.item, format: b.format }));
    blueprintFigure.set(b.id, known);
  }
  return known;
}

function topicKey(x: { unit: number; topic: string }) {
  return `${x.unit}${x.topic}`;
}

/** The unit furthest behind its marks. A little chance decides ties, so that papers don't all start alike. */
function chooseUnit<T extends { unit: number }>(c: PaperComposer, list: T[], marks: number): number {
  let best = list[0].unit;
  let bestGap = -Infinity;
  for (const unit of new Set(list.map((x) => x.unit))) {
    const gap = ((c.weights.get(unit) ?? 1) / ((c.unitMarks.get(unit) ?? 0) + marks)) * (1 + c.rng() * 0.15);
    if (gap > bestGap) {
      bestGap = gap;
      best = unit;
    }
  }
  return best;
}

/** A topic in the unit, in proportion to how often the papers ask it, and one not asked in this paper while there is one. */
function chooseTopic<T extends { unit: number; topic: string }>(c: PaperComposer, list: T[]): string {
  const topics = [...new Set(list.map(topicKey))];
  if (topics.length === 1) return topics[0];
  const weight = (t: string) => ((c.asked[t] ?? 0) + 3) / ((c.topicTaken.get(t) ?? 0) + 1) ** 2;
  let at = c.rng() * topics.reduce((s, t) => s + weight(t), 0);
  for (const t of topics) {
    at -= weight(t);
    if (at <= 0) return t;
  }
  return topics[topics.length - 1];
}

const preferring = <T,>(list: T[], want: boolean | null, test: (x: T) => boolean): T[] => {
  if (want === null) return list;
  const kept = list.filter((x) => test(x) === want);
  return kept.length ? kept : list;
};

interface Wish {
  marks: number;
  format: QuestionFormat | null;
  figure: boolean | null;
  thinking: boolean | null;
  resting: boolean;
  /** An alternative stays in the question's unit when it can. */
  unit?: number;
}

function note(c: PaperComposer, q: BankQuestion, marks: number, counted: boolean): void {
  c.seenText.add(questionKey(q));
  for (const f of factsOf(q)) c.seenFacts.add(f);
  if (!counted) return;
  const { unit } = q.item;
  c.unitMarks.set(unit, (c.unitMarks.get(unit) ?? 0) + marks);
  const key = topicKey(q.item);
  c.topicTaken.set(key, (c.topicTaken.get(key) ?? 0) + 1);
}

function pickFixed(c: PaperComposer, req: SlotRequest, wish: Wish, compiled: boolean, counted: boolean): BankQuestion | null {
  let open = req.defs.filter((d) => d.marks === wish.marks && isCompiled(d) === compiled && !c.used.has(d.id) && (wish.format === null || bankFormatOf(d) === wish.format) && !(d.facts ?? []).some((f) => c.seenFacts.has(f)) && !(d.shape && c.shapes.has(`${d.shape}|${d.context ?? ''}`)));
  if (c.fresh) {
    const { fresh } = c;
    open = wish.resting ? open.filter((d) => fresh.resting(defKeys(d))).sort((a, b) => fresh.lastSeen(defKeys(a)) - fresh.lastSeen(defKeys(b))) : open.filter((d) => !fresh.resting(defKeys(d)));
  } else if (wish.resting) {
    return null;
  }
  for (let tries = 0; open.length && tries < 40; tries++) {
    let choices = open;
    if (wish.resting) {
      // The ones seen longest ago come back first.
      choices = open.slice(0, 8);
    } else {
      const inUnit = wish.unit !== undefined ? open.filter((d) => d.unit === wish.unit) : [];
      const unit = inUnit.length ? wish.unit : chooseUnit(c, open, wish.marks);
      choices = open.filter((d) => d.unit === unit);
      const topic = chooseTopic(c, choices);
      choices = choices.filter((d) => topicKey(d) === topic);
    }
    choices = preferring(choices, wish.figure, (d) => hasFigure({ ...d, format: bankFormatOf(d) }));
    choices = preferring(choices, wish.thinking, (d) => isCompetency(bankFormatOf(d), d.style, d.difficulty));
    // Hand-written ones first, most of the time. A paper shouldn't lean on what was made from facts.
    const written = choices.filter((d) => !d.origin || d.origin === 'written');
    if (written.length && c.rng() < 0.7) choices = written;
    const def = choices[Math.floor(c.rng() * choices.length)];
    const q = bankQuestion(def, req.bank, c.rng);
    c.used.add(def.id);
    open = open.filter((d) => d !== def);
    if (c.seenText.has(questionKey(q))) continue;
    if (def.shape) c.shapes.add(`${def.shape}|${def.context ?? ''}`);
    note(c, q, wish.marks, counted);
    return q;
  }
  return null;
}

function pickMade(c: PaperComposer, req: SlotRequest, wish: Wish, reviewed: boolean, counted: boolean, strictOnly: boolean): BankQuestion | null {
  if (!c.set) return null;
  let open = req.blueprints.filter((b) => b.marks === wish.marks && (wish.format === null || blueprintFormat(b) === wish.format) && (!reviewed || !c.reviewedOnly || b.reviewed === true));
  for (let tries = 0; open.length && tries < 6; tries++) {
    const inUnit = wish.unit !== undefined ? open.filter((b) => b.unit === wish.unit) : [];
    const unit = inUnit.length ? wish.unit! : chooseUnit(c, open, wish.marks);
    const here = open.filter((b) => b.unit === unit);
    const topic = chooseTopic(c, here);
    let pool = here.filter((b) => topicKey(b) === topic);
    pool = preferring(pool, wish.thinking, (b) => isCompetency(blueprintFormat(b), b.style, b.difficulty));
    pool = preferring(pool, wish.figure, (b) => bpHasFigure(c, b));
    const [q] = pickGenerated(c.set, pool, { count: 1, rng: c.rng, used: c.usedBlueprints, seenText: c.seenText, seenFacts: c.seenFacts, seenStructures: c.seenStructures, fresh: c.fresh, freshOnly: !wish.resting, strictOnly });
    if (q && (!c.fresh || wish.resting || !c.fresh.resting(historyKeys(q)))) {
      note(c, q, wish.marks, counted);
      return q;
    }
    open = open.filter((b) => topicKey(b) !== topic);
  }
  return null;
}

/** One place: the side and format wanted, then the same format on the other side, then what's nearest, and never short while anything is left. */
function pickPlace(c: PaperComposer, req: SlotRequest, format: QuestionFormat | null, wantMade: boolean, wish: Omit<Wish, 'format' | 'resting' | 'marks'>, counted = true): BankQuestion | null {
  const onSide = (side: 'made' | 'fixed', f: QuestionFormat | null, resting: boolean, strict: boolean): BankQuestion | null => {
    const w: Wish = { ...wish, marks: req.marks, format: f, resting };
    if (side === 'fixed') return pickFixed(c, req, w, false, counted);
    if (c.share <= 0) return null;
    return pickMade(c, req, w, true, counted, strict) ?? pickFixed(c, req, w, true, counted);
  };
  const sides: ('made' | 'fixed')[] = wantMade ? ['made', 'fixed'] : ['fixed', 'made'];
  const formats: (QuestionFormat | null)[] = format ? [format, ...(NEAR[format] ?? []), null] : [null];
  // A structure not in the paper yet comes before the right format, and the right format before a repeated structure of it only
  // when nothing else is left. So a pass that won't repeat one goes first, over every format.
  for (const strict of [true, false]) {
    for (const resting of [false, true]) {
      if (resting && !c.fresh) break;
      for (const side of c.share >= 100 ? (['made', 'fixed'] as const) : (['first'] as const)) {
        for (const f of formats) {
          for (const s of side === 'first' ? sides : [side]) {
            const q = onSide(s, f, resting, strict);
            if (q) {
              if (f !== format && format) c.substituted++;
              return q;
            }
          }
        }
      }
    }
  }
  // Only when nothing reviewed is left does an unreviewed one fill a gap, and the paper says so.
  if (c.reviewedOnly && c.share > 0) {
    const q = pickMade(c, req, { ...wish, marks: req.marks, format: null, resting: Boolean(c.fresh) }, false, counted, false);
    if (q) {
      c.unreviewedFill++;
      return q;
    }
  }
  return null;
}

/** Fills one run of questions of the same marks, with their internal choices. */
export function composeSlot(c: PaperComposer, req: SlotRequest): SlotResult {
  const plan: (QuestionFormat | null)[] = req.mix ? planFormats(req.mix, req.count, c.rng) : [];
  while (plan.length < req.count) plan.push(null);
  // The slider, as whole questions over the whole paper: this run takes what brings the paper's running total to the share, so
  // halves don't pile up section by section, and a run that couldn't find a generated question is made up for in the next.
  const share = Math.max(0, Math.min(100, c.share)) / 100;
  const wanted = Math.max(0, Math.min(req.count, Math.round(share * (c.placed + req.count)) - c.madeSoFar));
  const made = new Set(shuffled(plan.map((_, i) => i), c.rng).slice(0, wanted));
  // With the paper's size known, each place is drawn against what's still needed, so a place that wanted a generated question and
  // found none is made up for later, and the paper ends on the share.
  const wantsMade = (i: number): boolean => {
    if (c.places === undefined) return made.has(i);
    const need = (c.madeTarget ?? Math.round(share * c.places)) - c.madeSoFar;
    const left = c.places - c.placed;
    return need > 0 && (need >= left || c.rng() < need / left);
  };
  const questions: BankQuestion[] = [];
  let figures = 0;
  let thinking = 0;
  const behind = (share: number | undefined, have: number, at: number): boolean | null => {
    if (share === undefined) return null;
    const gap = share * (at + 1) - have;
    return gap > 0.5 ? true : gap < -0.5 ? false : null;
  };
  plan.forEach((format, i) => {
    const q = pickPlace(c, req, format, wantsMade(i), { figure: behind(req.figure, figures, i), thinking: behind(req.cbq, thinking, i) });
    if (!q) return;
    questions.push(q);
    c.placed++;
    if (q.item.generated || isCompiled(q.item)) c.madeSoFar++;
    if (hasFigure(q.item)) figures++;
    if (isCompetency(q.item.generated?.format ?? q.item.format ?? (q.item.type as QuestionFormat), q.item.generated?.style ?? q.item.style, q.item.difficulty)) thinking++;
  });
  let out = shuffled(questions, c.rng);
  if (req.grouped) {
    const rank = (q: BankQuestion) => {
      const at = req.grouped!.indexOf(q.item.generated?.format ?? q.item.format ?? bankFormatOf(q.item as unknown as BankDef));
      return at < 0 ? req.grouped!.length : at;
    };
    out = out.map((q, i) => ({ q, i })).sort((a, b) => rank(a.q) - rank(b.q) || a.i - b.i).map((x) => x.q);
  }
  const alternatives: Record<string, BankQuestion> = {};
  for (const q of shuffled(out, c.rng)) {
    if (Object.keys(alternatives).length >= (req.or ?? 0)) break;
    const format = q.item.generated?.format ?? q.item.format ?? bankFormatOf(q.item as unknown as BankDef);
    const alt = pickPlace(c, req, format, Boolean(q.item.generated) || isCompiled(q.item), { figure: null, thinking: null, unit: q.item.unit }, false);
    if (alt) alternatives[q.item.id] = alt;
  }
  return { questions: out, alternatives, short: req.count - out.length };
}

/** What a section's picks came to, for a test to compare with the target. */
export function formatOfQuestion(q: BankQuestion): QuestionFormat {
  return q.item.generated ? (isDerivationType(q.item.type) ? 'derivation' : q.item.generated.format) : (q.item.format ?? bankFormatOf(q.item as unknown as BankDef));
}
