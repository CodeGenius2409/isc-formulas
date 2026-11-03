// Loads a class's questions on first need, and turns a definition into one attempt at it. Numerical
// answers always come from the solver registry, so they can't drift from what the solver says.
import { loadSyllabus } from '../../data/syllabus';
import type { ClassLevel, SubjectId } from '../../data/types';
import { getEntry } from '../../solver/registry';
import { solve, varTex, type SolveInput, type Step } from '../../solver/solve';
import { unitLabel } from '../../solver/unit-label';
import { pickUnitChoices, seededRng, type Rng } from '../questions';
import { bankOfId } from './define';
import type { BankDef, BankItem, BankQuestion, NumericDef, NumericItem, NumericPart } from './types';

type BankFile = () => Promise<{ default: BankDef[] }>;
const loaders: Record<string, BankFile> = {
  'physics-xi': () => import('./questions/physics-xi'),
  'physics-xii': () => import('./questions/physics-xii'),
  'chemistry-xi': () => import('./questions/chemistry-xi'),
  'chemistry-xii': () => import('./questions/chemistry-xii'),
  'mathematics-xi': () => import('./questions/mathematics-xi'),
  'mathematics-xii': () => import('./questions/mathematics-xii'),
  'computerscience-xi': () => import('./questions/computerscience-xi'),
  'computerscience-xii': () => import('./questions/computerscience-xii'),
};
const cache = new Map<string, Promise<LoadedBank>>();

export interface LoadedBank {
  defs: BankDef[];
  /** Names from the syllabus map, by "unit" and "unit topic". */
  names: Map<string, string>;
}

export function loadBank(subject: SubjectId, level: ClassLevel): Promise<LoadedBank> {
  const key = `${subject}-${level.toLowerCase()}`;
  let loading = cache.get(key);
  if (!loading) {
    const loader = loaders[key];
    if (!loader) return Promise.resolve({ defs: [], names: new Map() });
    loading = Promise.all([loader(), loadSyllabus(subject)]).then(([module, syllabus]) => {
      const names = new Map<string, string>();
      for (const unit of syllabus.classes.find((c) => c.level === level)?.units ?? []) {
        names.set(String(unit.number), unit.name);
        for (const topic of unit.topics) names.set(`${unit.number} ${topic.key}`, topic.name);
      }
      return { defs: module.default, names };
    });
    cache.set(key, loading);
  }
  return loading;
}

/** Finds a definition by id. Null once a question has left the bank. */
export async function findBankDef(id: string): Promise<{ def: BankDef; bank: LoadedBank } | null> {
  const place = bankOfId(id);
  if (!place) return null;
  const bank = await loadBank(place.subject, place.level);
  const def = bank.defs.find((d) => d.id === id);
  return def ? { def, bank } : null;
}

function drawVars(def: NumericDef, rng: Rng): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [name, spec] of Object.entries(def.vars)) {
    if (spec.length === 3) {
      const steps = Math.round((spec[1] - spec[0]) / spec[2]);
      out[name] = Number((spec[0] + Math.floor(rng() * (steps + 1)) * spec[2]).toPrecision(10));
    } else {
      out[name] = spec[Math.floor(rng() * spec.length)];
    }
  }
  return out;
}

function fill(text: string, values: Record<string, number>): string {
  return text.replace(/\{([A-Za-z]\w*)\}/g, (whole, name: string) => (name in values ? String(values[name]) : whole));
}

function fillDeep<T>(spec: T, values: Record<string, number>): T {
  return JSON.parse(fill(JSON.stringify(spec), values)) as T;
}

/** One go at building the parts. Null when these values don't give a sensible answer. */
function buildParts(def: NumericDef, values: Record<string, number>, rng: Rng): NumericPart[] | null {
  const saved: Record<string, { raw: string; unit: string }> = {};
  const parts: NumericPart[] = [];
  for (const part of def.parts) {
    const entry = getEntry(part.use);
    if (!entry) return null;
    const inputs: Record<string, SolveInput> = {};
    for (const v of entry.vars) {
      if (v.symbol === part.find) continue;
      const spec = part.given[v.symbol];
      if (spec === undefined) {
        const fixed = v.value ?? (v.isConstant ? v.gen[0] : undefined);
        if (fixed === undefined) throw new Error(`${def.id}: ${part.use} needs ${v.symbol}`);
        inputs[v.symbol] = { raw: String(fixed), unit: v.unit };
        continue;
      }
      const [written, unit] = spec.split(' ');
      if (saved[written]) {
        inputs[v.symbol] = saved[written];
        continue;
      }
      // "-U" for a sign convention, "V*1e6" when the question writes the power of ten in words.
      const [, minus, name, factor] = /^(-?)([^*]+)(?:\*(.+))?$/.exec(written)!;
      const size = (name in values ? values[name] : Number(name)) * Number(factor ?? 1);
      if (!Number.isFinite(size)) throw new Error(`${def.id}: can't read "${spec}"`);
      inputs[v.symbol] = { raw: String(minus ? -size : size), unit: unit ?? v.unit };
    }
    const outcome = solve(entry, part.find, inputs, { resultUnit: part.unit, exact: def.subject === 'mathematics' });
    if (!outcome.ok) return null;
    const roots = outcome.roots.filter((r) => !r.rejected);
    if (!roots.length || roots.some((r) => !Number.isFinite(r.shown) || Math.abs(r.shown) < 1e-40)) return null;
    const target = entry.vars.find((v) => v.symbol === part.find)!;
    if (part.save) saved[part.save] = { raw: String(roots[0].value), unit: target.unit };
    const unit = roots[0].unit;
    const steps: Step[] = outcome.steps;
    parts.push({
      ask: fill(part.ask, values),
      marks: part.marks,
      question: {
        kind: 'numeric',
        formulaId: part.use,
        unknown: part.find,
        unknownName: target.name,
        unknownTex: varTex(target),
        givens: [],
        answers: roots.map((r) => r.shown),
        unit,
        unitChoices: pickUnitChoices(target, unit, rng),
        tolerance: 0.02,
        steps,
        answerText: roots.map((r) => `${r.text}${unit === 'deg' ? '°' : unit ? ` ${unitLabel(unit)}` : ''}`).join(' or '),
      },
    });
  }
  return parts;
}

function numericItem(def: NumericDef, names: Pick<NumericItem, 'unitName' | 'topicName'>, rng: Rng): NumericItem {
  const { vars: _vars, when: _when, parts: _parts, ...tags } = def;
  for (let attempt = 0; attempt < 60; attempt++) {
    const values = drawVars(def, rng);
    if (def.when && !def.when(values)) continue;
    const parts = buildParts(def, values, rng);
    if (parts) return { ...tags, ...names, text: fill(def.text, values), diagram: def.diagram && fillDeep(def.diagram, values), parts };
  }
  throw new Error(`No workable values for ${def.id}`);
}

export function instantiate(def: BankDef, bank: LoadedBank, rng: Rng): BankItem {
  const names = { unitName: bank.names.get(String(def.unit)) ?? '', topicName: bank.names.get(`${def.unit} ${def.topic}`) ?? '' };
  return def.form === 'numeric' ? numericItem(def, names, rng) : { ...def, ...names };
}

export function bankQuestion(def: BankDef, bank: LoadedBank, rng: Rng): BankQuestion {
  return { kind: 'bank', formulaId: def.id, item: instantiate(def, bank, rng) };
}

/** For review: a fresh attempt at a question already in the schedule. */
export async function questionForId(id: string, rng: Rng = seededRng(Math.floor(Math.random() * 2 ** 31))): Promise<BankQuestion | null> {
  const found = await findBankDef(id);
  return found ? bankQuestion(found.def, found.bank, rng) : null;
}
