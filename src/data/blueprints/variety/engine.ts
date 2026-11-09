// Many genuinely different ways of asking from each numerical situation: every unknown, mixed units, a table, a graph, a
// factor or a percentage, a comparison, a mistake to find, an estimate, an error, a trend, and chains and case sets.
//
// The situations are the ones already reviewed: a numerical blueprint's own value ranges and units are drawn from, so the
// values stay realistic. Every answer comes from the solver registry, which also checks units and ranges.
// What each entry can do was found by trying it: see entry-map.json and tests/unit/variety-map.test.ts.
import type { BankType, Difficulty, NumericPartDef } from '../../../practice/bank/types';
import { getEntry } from '../../../solver/registry';
import type { ResolvedEntry, ResolvedVar } from '../../../solver/types';
import { unitLabel } from '../../../solver/unit-label';
import { convertResult } from '../../../solver/units';
import { tidy, type Gen } from '../../../practice/gen/gen';
import type { ClassLevel, SubjectId } from '../../types';
import { drawValues, NUM_SOURCES, type NumSource } from '../dsl';
import type { Blueprint, Body, Format, Style } from '../types';
import MAP from './entry-map.json';
import SKIP from './skip.json';
import { nameOf } from './names';

/** A kind of setting, its words, and which entries it suits: tested against the entry's quantities. None means any. */
export type Scene = readonly [tag: string, lead: string, suits?: RegExp];

interface EntryInfo {
  /** The formula's name in the book, which says what situation a question is about. */
  title: string;
  natural: string;
  unknowns: string[];
  powers?: Record<string, number>;
}

const ENTRIES = MAP.entries as Record<string, EntryInfo>;

/** Blueprints that turned out not to work for their entry, found by trying them: see tests/unit/variety-map.test.ts. */
const skipped = new Set<string>(SKIP as string[]);

const CODE: Record<SubjectId, string> = { physics: 'p', chemistry: 'c', mathematics: 'm', computerscience: 'k' };

interface Given {
  value: number;
  unit: string;
}
type Givens = Record<string, Given>;

const sig3 = (x: number) => Number(x.toPrecision(3));
/** A converted value worth printing: at most two figures, so that it reads like a measurement, not a conversion's leftovers. */
const reads = (x: number) => Math.abs(x) >= 0.01 && Math.abs(x) < 1e5 && Number(x.toPrecision(2)) === x;

/** A value as a person reads it, with a true minus sign and its unit. */
function shown(value: number, unit: string): string {
  const number = tidy(value, 3).replace(/^-/, '−');
  if (!unit) return number;
  return unit === 'deg' ? `${number}°` : `${number} ${unitLabel(unit)}`;
}

// A name that starts with a small letter on purpose, like pH, keeps it.
const capital = (s: string) => (/^[a-z][A-Z]|^rms\b/.test(s) ? s : s.charAt(0).toUpperCase() + s.slice(1));
const varOf = (entry: ResolvedEntry, symbol: string) => entry.vars.find((v) => v.symbol === symbol)!;
// A value the entry fixes itself, like 13.6 eV, is part of its formula, not something to state or ask for.
const freeVars = (entry: ResolvedEntry) => entry.vars.filter((v) => !v.isConstant && v.value === undefined);
const forSolve = (givens: Givens): Record<string, [number, string]> => Object.fromEntries(Object.entries(givens).map(([k, v]) => [k, [v.value, v.unit]]));

/** One situation: an entry, what it naturally finds, and how to draw believable values for everything else. */
interface Situation {
  entry: ResolvedEntry;
  find: string;
  unknowns: string[];
  powers: [string, number][];
  draw(g: Gen): Givens;
  name(symbol: string): string;
}

/** Reads a blueprint's given, such as "Q1 uC", "-U", "V*1e6 m" or "1.7e-8 ohm*m". Null for a value carried from another part. */
function readGiven(spec: string, values: Record<string, number>, v: ResolvedVar): Given | null {
  const [written, unit] = spec.split(' ');
  const match = /^(-?)([^*]+)(?:\*(.+))?$/.exec(written);
  if (!match) return null;
  const [, minus, name, factor] = match;
  const size = (name in values ? values[name] : Number(name)) * Number(factor ?? 1);
  if (!Number.isFinite(size)) return null;
  return { value: Number((minus ? -size : size).toPrecision(6)), unit: unit ?? v.unit };
}

function fromSources(entry: ResolvedEntry, find: string, sources: NumSource[], subject: SubjectId): Situation | null {
  const info = ENTRIES[entry.id];
  if (!info) return null;
  const free = freeVars(entry).filter((v) => v.symbol !== find);
  const usable = sources.filter((s) => free.every((v) => s.part.given[v.symbol] !== undefined));
  if (!usable.length) return null;
  const name = (symbol: string) => nameOf(entry.id, symbol, varOf(entry, symbol).name);
  void subject;
  return {
    entry,
    find,
    name,
    unknowns: info.unknowns.includes(find) ? info.unknowns : [find, ...info.unknowns],
    powers: find === info.natural && info.powers ? Object.entries(info.powers) : [],
    draw(g) {
      const source = g.pick(usable);
      const values = drawValues(g, source.vars);
      if (source.derive) Object.assign(values, source.derive(values));
      if (source.when && !source.when(values)) g.retry('values out of range');
      const out: Givens = {};
      for (const v of free) {
        const given = readGiven(source.part.given[v.symbol], values, v);
        if (!given) g.retry('a value carried from another part');
        out[v.symbol] = given!;
      }
      return out;
    },
  };
}

function situationOf(entry: ResolvedEntry): string {
  const title = ENTRIES[entry.id]?.title;
  return title ? `Situation: ${title.replace(/\.$/, '')}. ` : '';
}

/** Consistent values with `ask` left out. Asking for anything else states what the situation naturally finds, as a result. */
function scenario(g: Gen, s: Situation, ask: string): Givens {
  const base = s.draw(g);
  if (ask === s.find) return base;
  const z = g.solve(s.entry.id, s.find, forSolve(base));
  const out: Givens = { ...base, [s.find]: { value: sig3(z.value), unit: z.unit } };
  delete out[ask];
  return out;
}

function partFor(s: Situation, find: string, givens: Givens, marks: number, values: Record<string, number>, ask?: string, unit?: string, prefix = ''): NumericPartDef {
  return partOf(s.entry, s.name, find, givens, marks, values, ask, unit, prefix);
}

function partOf(entry: ResolvedEntry, name: (symbol: string) => string, find: string, givens: Givens, marks: number, values: Record<string, number>, ask?: string, unit?: string, prefix = ''): NumericPartDef {
  const given: Record<string, string> = {};
  for (const [symbol, g] of Object.entries(givens)) {
    const key = `v${prefix}_${symbol}`;
    values[key] = g.value;
    given[symbol] = g.unit ? `${key} ${g.unit}` : key;
  }
  return { ask: ask ?? capital(name(find)), use: entry.id, find, given, marks, ...(unit ? { unit } : {}) };
}

/** The constants a question relies on, so that nothing appears from nowhere. */
function takeLine(entry: ResolvedEntry): string {
  const list = entry.vars.filter((v) => v.isConstant && v.value !== undefined && v.value !== Math.PI);
  if (!list.length) return '';
  return ` Take ${list.map((v) => `${v.name} = ${shown(v.value!, v.unit)}`).join(' and ')}.`;
}

function listGivens(s: Situation, givens: Givens, style: number): string {
  const rows = Object.entries(givens).map(([symbol, g]) => [s.name(symbol), shown(g.value, g.unit)] as const);
  if (rows.length === 1) return `The ${rows[0][0]} is ${rows[0][1]}.`;
  if (style % 3 === 1) return `Given: ${rows.map(([a, b]) => `${a} = ${b}`).join(', ')}.`;
  if (style % 3 === 2) return `The values are: ${rows.map(([a, b]) => `${a}, ${b}`).join('; ')}.`;
  const last = rows.length - 1;
  const words = rows.map(([a, b], i) => `${i === 0 ? 'The' : 'the'} ${a} is ${b}`);
  return `${last > 0 ? `${words.slice(0, last).join(', ')} and ${words[last]}` : words[0]}.`;
}

const ASKS = ['Calculate the {t}.', 'Find the {t}.', 'Work out the {t}.', 'Determine the {t}.'];
const asking = (seed: number, target: string) => ASKS[Math.floor(seed / 3) % ASKS.length].replace('{t}', target);

const HOW: Record<number, string> = { 2: 'doubled', 3: 'tripled', 4: 'made four times as large', 0.5: 'halved', 0.25: 'reduced to a quarter' };
const CHANGES = [2, 3, 4, 0.5, 0.25];

function trendWords(n: number): string {
  if (n === 1) return 'in direct proportion to it';
  if (n === 2) return 'as the square of it';
  if (n === 3) return 'as the cube of it';
  if (n === 0.5) return 'as its square root';
  if (n === -1) return 'in inverse proportion to it';
  if (n === -2) return 'in inverse proportion to its square';
  if (n === -0.5) return 'in inverse proportion to its square root';
  if (n === -3) return 'in inverse proportion to its cube';
  return `as its power ${String(n).replace('-', '−')}`;
}

/** How one quantity depends on another, for an explanation. */
function relation(target: string, name: string, n: number): string {
  return `The ${target} varies ${trendWords(n).replace('it', `the ${name}`).replace('its', `the ${name}’s`)}`;
}

function curveWords(n: number): string {
  if (n === 1) return 'a straight line through the origin';
  if (n === 2) return 'a parabola through the origin, curving upwards';
  if (n === 3) return 'a curve through the origin, rising more steeply than a parabola';
  if (n === 0.5) return 'a curve through the origin, rising ever more slowly';
  if (n === -1) return 'a rectangular hyperbola';
  if (n === -2) return 'a curve falling more steeply than a rectangular hyperbola';
  if (n === -0.5) return 'a curve falling ever more slowly, flatter than a rectangular hyperbola';
  return 'a straight line that doesn’t pass through the origin';
}

const CURVES = [1, 2, 0.5, -1, -2, 3];

interface Spec {
  key: string;
  family: string;
  marks: number;
  difficulty: Difficulty;
  type: BankType;
  format: Format;
  style?: Style;
  /** Reads as a question about a real setting, so it takes a scene. */
  make(g: Gen, scene: Scene | null): Body;
}

function specsFor(s: Situation, subject: SubjectId, key: string): Spec[] {
  const out: Spec[] = [];
  const { entry, find, powers } = s;
  const target = s.name(find);
  // A quantity's name alone can be ambiguous: which body's moment of inertia, what order of reaction. So each question says.
  const situation = situationOf(entry);
  const lead = (scene: Scene | null) => `${scene ? `${scene[1]} ` : ''}${situation}`;
  const tag = (scene: Scene | null) => (scene ? { context: scene[0] } : {});
  const others = (v: ResolvedVar, now: string) => v.alt.filter((u) => u !== now && !/angstrom/.test(u) && !(v.show === 'deg')).concat(v.unit !== now && v.show !== 'deg' ? [v.unit] : []);
  const convertible = freeVars(entry).some((v) => v.symbol !== find && !v.integer && v.alt.length > 0 && v.show !== 'deg');

  // Every quantity in turn. Asking for anything but the usual one is a reverse problem.
  for (const symbol of s.unknowns) {
    const isNatural = symbol === find;
    out.push({
      key: `unknown-${key}-${symbol}`,
      family: isNatural ? 'direct' : 'reverse',
      marks: 2,
      difficulty: isNatural ? 1 : 2,
      type: 'numerical',
      format: 'numerical',
      make(g, scene) {
        const givens = scenario(g, s, symbol);
        const values: Record<string, number> = {};
        const part = partFor(s, symbol, givens, 2, values);
        return { ...g.numeric(`${lead(scene)}${listGivens(s, givens, g.seed)} ${asking(g.seed, s.name(symbol))}${takeLine(entry)}`, [part], values), ...tag(scene) };
      },
    });
  }

  // Given in other units, so converting is part of the question.
  if (convertible) {
    out.push({
      key: `units-${key}`,
      family: 'units',
      marks: 3,
      difficulty: 2,
      type: 'numerical',
      format: 'numerical',
      make(g, scene) {
        const givens = s.draw(g);
        const options = Object.keys(givens).filter((x) => others(varOf(entry, x), givens[x].unit).length);
        if (!options.length) g.retry('nothing to convert');
        let changed = 0;
        for (const x of g.shuffle(options).slice(0, 2)) {
          const v = varOf(entry, x);
          const alt = g.pick(others(v, givens[x].unit));
          const value = sig3(convertResult(givens[x].value, givens[x].unit, alt));
          // Nothing odd to read, such as 0.00007 km or 71.7 cal.
          if (reads(value)) {
            givens[x] = { value, unit: alt };
            changed++;
          }
        }
        if (!changed) g.retry('no conversion read sensibly');
        const results = varOf(entry, find).alt.filter((u) => !/eV|cal|angstrom/.test(u));
        const unit = results.length && g.chance(0.5) ? g.pick(results) : undefined;
        const values: Record<string, number> = {};
        const part = partFor(s, find, givens, 3, values, undefined, unit);
        const giveIn = unit ? ` Give your answer in ${unitLabel(unit)}.` : '';
        const body = g.numeric(`${lead(scene)}${listGivens(s, givens, g.seed)} ${asking(g.seed, target)}${giveIn}${takeLine(entry)}`, [part], values);
        // A size no one would report isn't a good question.
        const answer = Math.abs(body.parts[0].question.answers[0]);
        if (unit && (answer < 0.01 || answer >= 1e5)) g.retry('an awkward answer in that unit');
        return { ...body, ...tag(scene) };
      },
    });
  }

  // The data comes as a table to read.
  if (freeVars(entry).length >= 3) {
    out.push({
      key: `table-${key}`,
      family: 'table',
      marks: 2,
      difficulty: 2,
      type: 'numerical',
      format: 'data',
      style: 'cbq-style',
      make(g, scene) {
        const givens = s.draw(g);
        const values: Record<string, number> = {};
        const part = partFor(s, find, givens, 2, values);
        const rows = Object.entries(givens).map(([x, v]) => [capital(s.name(x)), shown(v.value, v.unit)]);
        const body = g.numeric(`${lead(scene)}The table gives the values. Use them to find the ${target}.${takeLine(entry)}`, [part], values);
        // By chance the answer can equal a value in the table, which would look like a misprint.
        if (Object.values(givens).some((v) => Math.abs(Math.abs(v.value) - Math.abs(body.parts[0].question.answers[0])) <= Math.abs(v.value) * 0.002)) g.retry('the answer is already in the table');
        return { ...body, diagram: { kind: 'table', head: ['Quantity', 'Value'], rows }, ...tag(scene) };
      },
    });
  }

  if (powers.length) {
    // A trend in words.
    out.push({
      key: `trend-${key}`,
      family: 'trend',
      marks: 1,
      difficulty: 1,
      type: 'mcq',
      format: 'mcq',
      make(g) {
        const [symbol, n] = g.pick(powers);
        const name = s.name(symbol);
        const wrong = g.sample([1, 2, -1, -2, 0.5, -0.5, 3].filter((x) => x !== n), 3).map(trendWords);
        const rest = powers.length > 1 ? ', with everything else kept the same' : '';
        return g.mcq(`${situation}As the ${name} changes${rest}, the ${target} varies:`, trendWords(n), wrong, { why: `${relation(target, name, n)}.` });
      },
    });

    // Which graph.
    out.push({
      key: `curve-${key}`,
      family: 'curve',
      marks: 1,
      difficulty: 2,
      type: 'mcq',
      format: 'data',
      style: 'cbq-style',
      make(g) {
        const [symbol, n] = g.pick(powers);
        const right = curveWords(n);
        const wrong = g.sample(CURVES.filter((x) => curveWords(x) !== right).map(curveWords), 3);
        const name = s.name(symbol);
        return g.mcq(`${situation}With everything else fixed, a graph of the ${target} (on the y-axis) against the ${name} (on the x-axis) is:`, right, wrong, { why: `${relation(target, name, n)}.` });
      },
    });

    // By what factor.
    if (powers.length >= 2) {
      const factorOf = (g: Gen) => {
        const [a, b] = g.sample(powers, 2);
        const fa = g.pick(CHANGES);
        const fb = g.pick(CHANGES.filter((x) => x !== fa));
        const answer = fa ** a[1] * fb ** b[1];
        if (answer === 1) g.retry('no change at all');
        return { a, b, fa, fb, answer };
      };
      const describeChange = ({ a, b, fa, fb }: ReturnType<typeof factorOf>) => `The ${s.name(a[0])} is ${HOW[fa]} and the ${s.name(b[0])} is ${HOW[fb]}${powers.length > 2 ? ', with everything else kept the same' : ''}.`;
      const explain = ({ a, b, fa, fb, answer }: ReturnType<typeof factorOf>) => `${relation(target, s.name(a[0]), a[1])}, and ${relation(target, s.name(b[0]), b[1]).replace(/^The /, 'the ')}, so the factor is $${fa}^{${a[1]}} \\times ${fb}^{${b[1]}}$ = ${tidy(answer, 3)}.`;
      out.push({
        key: `factor-${key}`,
        family: 'factor',
        marks: 1,
        difficulty: 2,
        type: 'mcq',
        format: 'mcq',
        make(g, scene) {
          const c = factorOf(g);
          const { a, b, fa, fb, answer } = c;
          return {
            ...g.mcqNumber(`${lead(scene)}${describeChange(c)} By what factor does the ${target} change?`, answer, '', [
              { slip: 'ignored the powers in the relation', value: fa * fb },
              { slip: 'turned the ratio upside down', value: 1 / answer },
              { slip: `changed only the ${s.name(a[0])}`, value: fa ** a[1] },
              { slip: `changed only the ${s.name(b[0])}`, value: fb ** b[1] },
            ], { working: explain(c) }),
            ...tag(scene),
          };
        },
      });
      out.push({
        key: `ratio-${key}`,
        family: 'ratio',
        marks: 2,
        difficulty: 2,
        type: 'numerical',
        format: 'numerical',
        make(g, scene) {
          const c = factorOf(g);
          const { a, b, fa, fb, answer } = c;
          const part = g.answerPart(`New ${target} ÷ old ${target}`, answer, 2, [{ label: 'Use how it depends on each', math: [`\\frac{\\text{new}}{\\text{old}} = ${fa}^{${a[1]}} \\times ${fb}^{${b[1]}} = ${tidy(answer, 3)}`] }]);
          return { form: 'numeric', text: `${lead(scene)}${describeChange(c)} Find the ratio of the new ${target} to the old one.`, parts: [part], ...tag(scene) };
        },
      });
    }

    // A percentage change, where the power makes it more than repeating the number in the question.
    const curved = powers.filter(([, n]) => Math.abs(n) !== 1 || n === -1);
    if (curved.length) out.push({
      key: `percent-${key}`,
      family: 'percent',
      marks: 2,
      difficulty: 2,
      type: 'numerical',
      format: 'numerical',
      make(g, scene) {
        const [symbol, n] = g.pick(curved);
        const p = g.pick([10, 20, 25, 50, 100]);
        const after = (1 + p / 100) ** n;
        const change = (after - 1) * 100;
        const words = `${tidy(change, 3).replace('-', '−')}%`;
        const part = g.answerPart('Percentage change (negative for a decrease)', change, 2, [{ label: 'Compare new with old', math: [`\\frac{\\text{new}}{\\text{old}} = ${tidy(1 + p / 100, 3)}^{${n}} = ${tidy(after, 4)}`, `\\text{change} = ${words.replace('%', '\\%')}`] }], '', words);
        const rest = powers.length > 1 ? ', with everything else kept the same' : '';
        return { form: 'numeric', text: `${lead(scene)}The ${s.name(symbol)} is increased by ${p}%${rest}. By what percentage does the ${target} change?`, parts: [part], ...tag(scene) };
      },
    });

    // Reading a gradient off a straight-line graph to get something else.
    const linear = powers.filter(([, n]) => n === 1);
    if (linear.length && powers.length >= 2 && subject !== 'mathematics') {
      out.push({
        key: `gradient-${key}`,
        family: 'gradient',
        marks: 3,
        difficulty: 3,
        type: 'numerical',
        format: 'data',
        style: 'cbq-style',
        make(g, scene) {
          const [xSymbol] = g.pick(linear);
          const choices = powers.filter(([x]) => x !== xSymbol && s.unknowns.includes(x));
          if (!choices.length) g.retry('nothing to find from the gradient');
          const [wanted] = g.pick(choices);
          const base = s.draw(g);
          const z = g.solve(entry.id, find, forSolve(base));
          const x = base[xSymbol];
          const givens: Givens = { ...base, [find]: { value: sig3(z.value), unit: z.unit } };
          delete givens[wanted];
          const values: Record<string, number> = {};
          const part = partFor(s, wanted, givens, 3, values);
          const xName = s.name(xSymbol);
          const fixed = Object.entries(givens).filter(([k]) => k !== xSymbol && k !== find);
          const fixedText = fixed.length ? ` The ${fixed.map(([k, v]) => `${s.name(k)} stays at ${shown(v.value, v.unit)}`).join(' and the ')}.` : '';
          const labelX = `${capital(xName)}${x.unit ? ` (${unitLabel(x.unit)})` : ''}`;
          const labelY = `${capital(target)}${z.unit ? ` (${unitLabel(z.unit)})` : ''}`;
          const point = `(${tidy(x.value, 3)}, ${tidy(sig3(z.value), 3)})`;
          const answerNear = (body: Body) => body.form === 'numeric' && [x.value, sig3(z.value)].some((n) => Math.abs(Math.abs(n) - Math.abs(body.parts[0].question.answers[0])) <= Math.abs(n) * 0.002);
          const made = g.numeric(`${lead(scene)}The graph shows the ${target} against the ${xName}: a straight line through the origin, passing through ${point}.${fixedText} Use its gradient to find the ${s.name(wanted)}.${takeLine(entry)}`, [part], values);
          // By chance the answer can equal a number on the graph, which would look like a misprint.
          if (answerNear(made)) g.retry('the answer is already on the graph');
          return {
            ...made,
            diagram: { kind: 'graph', x: labelX, y: labelY, lines: [{ points: [[0, 0], [x.value, sig3(z.value)]] }], ticksX: [[x.value, tidy(x.value, 3)]], ticksY: [[sig3(z.value), tidy(sig3(z.value), 3)]] },
            ...tag(scene),
          };
        },
      });
    }

    // Maximum percentage error, where the syllabus has it.
    if (subject === 'physics' && powers.length >= 2) {
      out.push({
        key: `error-${key}`,
        family: 'error',
        marks: 2,
        difficulty: 3,
        type: 'numerical',
        format: 'numerical',
        make(g, scene) {
          const chosen = g.sample(powers, Math.min(powers.length, 3));
          const errors = chosen.map(() => g.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]));
          const total = chosen.reduce((sum, [, n], i) => sum + Math.abs(n) * errors[i], 0);
          const parts = chosen.map(([x], i) => `${errors[i]}% in the ${s.name(x)}`);
          const part = g.answerPart(`Maximum percentage error in the ${target}`, total, 2, [{ label: 'Add each percentage error, times the size of its power', math: [`${chosen.map(([, n], i) => `${Math.abs(n)} \\times ${errors[i]}`).join(' + ')} = ${tidy(total, 3)}\\%`] }], '', `${tidy(total, 3)}%`);
          return { form: 'numeric', text: `${lead(scene)}The measurements have these errors: ${parts.join(', ')}. Find the maximum percentage error in the ${target} worked out from them${powers.length > chosen.length ? ', taking everything else as exact' : ''}.`, parts: [part], ...tag(scene) };
        },
      });
    }
  }

  // Which case gives the most.
  if (freeVars(entry).length >= 3) {
    const cases = (g: Gen) => {
      const list = [0, 1, 2].map(() => {
        const givens = s.draw(g);
        return { givens, z: g.solve(entry.id, find, forSolve(givens)) };
      });
      const sorted = [...list].map((c) => c.z.value).sort((a, b) => a - b);
      if (sorted[1] - sorted[0] < Math.abs(sorted[1]) * 0.08 || sorted[2] - sorted[1] < Math.abs(sorted[2]) * 0.08) g.retry('the cases are too close');
      if (sorted[0] <= 0) g.retry('a negative case is hard to rank');
      const symbols = Object.keys(list[0].givens);
      const head = ['Case', ...symbols.map((x) => capital(s.name(x)))];
      const rows = list.map((c, i) => ['ABC'[i], ...symbols.map((x) => shown(c.givens[x].value, c.givens[x].unit))]);
      return { list, head, rows };
    };
    out.push({
      key: `compare-${key}`,
      family: 'compare',
      marks: 1,
      difficulty: 2,
      type: 'mcq',
      format: 'data',
      style: 'cbq-style',
      make(g, scene) {
        const { list, head, rows } = cases(g);
        const largest = g.chance(0.5);
        const zs = list.map((c) => c.z.value);
        const best = zs.indexOf(largest ? Math.max(...zs) : Math.min(...zs));
        return {
          form: 'mcq',
          text: `${lead(scene)}The table gives three cases. Which has the ${largest ? 'largest' : 'smallest'} ${target}?${takeLine(entry)}`,
          options: [{ text: 'Case A' }, { text: 'Case B' }, { text: 'Case C' }, { text: 'All three are equal' }],
          answer: best,
          why: `The ${target} is ${list.map((c, i) => `${shown(c.z.value, c.z.unit)} in case ${'ABC'[i]}`).join(', ')}.`,
          diagram: { kind: 'table', head, rows },
          ...tag(scene),
        };
      },
    });
    out.push({
      key: `rank-${key}`,
      family: 'rank',
      marks: 2,
      difficulty: 3,
      type: 'short',
      format: 'order',
      style: 'cbq-style',
      make(g, scene) {
        const { list, head, rows } = cases(g);
        const order = list.map((c, i) => ({ i, v: c.z.value })).sort((a, b) => b.v - a.v).map((c) => 'ABC'[c.i]);
        return {
          ...g.theory(`${lead(scene)}Arrange the three cases in the table in decreasing order of their ${target}, showing how you decide.${takeLine(entry)}`, [[`The ${target} is ${list.map((c, i) => `${shown(c.z.value, c.z.unit)} in case ${'ABC'[i]}`).join(', ')}.`, 1], [`So the order is ${order.join(' > ')}.`, 1]]),
          diagram: { kind: 'table', head, rows },
          ...tag(scene),
        };
      },
    });
  }

  // A worked answer with one realistic mistake: a unit left unconverted.
  if (convertible) {
    out.push({
      key: `mistake-${key}`,
      family: 'mistake',
      marks: 2,
      difficulty: 2,
      type: 'short',
      format: 'mistake',
      make(g, scene) {
        const base = s.draw(g);
        const options = Object.keys(base).filter((x) => varOf(entry, x).alt.length && varOf(entry, x).show !== 'deg');
        if (!options.length) g.retry('nothing to convert');
        const x = g.pick(options);
        const v = varOf(entry, x);
        // Use a unit that isn't the one the formula works in, already given or chosen here.
        let inUnit = base[x];
        if (inUnit.unit === v.unit) {
          const alt = g.pick(v.alt.filter((u) => !/angstrom/.test(u)));
          inUnit = { value: sig3(convertResult(base[x].value, v.unit, alt)), unit: alt };
        }
        if (!reads(inUnit.value)) g.retry('an odd size to read');
        const givens: Givens = { ...base, [x]: inUnit };
        const right = g.solve(entry.id, find, forSolve(givens));
        const wrong = g.solve(entry.id, find, forSolve({ ...base, [x]: { value: inUnit.value, unit: v.unit } }));
        if (Math.abs(wrong.value - right.value) < Math.abs(right.value) * 0.05) g.retry('the slip barely shows');
        // A student would notice a negative size, and a slip no one could believe isn't realistic.
        if (wrong.value * right.value <= 0) g.retry('the slip changes the sign');
        return {
          ...g.theory(`${lead(scene)}${listGivens(s, givens, g.seed)}${takeLine(entry)}\nA student works out the ${target}, putting the numbers straight into the formula, and writes ${shown(wrong.value, wrong.unit)}. Find the mistake, and give the correct value.`, [[`The ${s.name(x)} was used in ${unitLabel(inUnit.unit)} without being converted to ${unitLabel(v.unit)}.`, 1], [`Correct value: ${shown(right.value, right.unit)}.`, 1]]),
          ...tag(scene),
        };
      },
    });
  }

  // Estimating, and writing an answer in standard form. Not for a log scale such as pH, or an angle.
  const isSize = !varOf(entry, find).nominal && varOf(entry, find).show !== 'deg' && varOf(entry, find).unit !== '';
  const worthEstimating = (value: number) => value > 0 && (value >= 1000 || value < 0.01);
  if (isSize) out.push({
    key: `estimate-${key}`,
    family: 'estimate',
    marks: 1,
    difficulty: 1,
    type: 'mcq',
    format: 'mcq',
    make(g, scene) {
      const givens = s.draw(g);
      const z = g.solve(entry.id, find, forSolve(givens));
      if (!worthEstimating(z.value)) g.retry('an everyday size has no need of an order of magnitude');
      const power = Math.floor(Math.log10(z.value));
      const unit = z.unit ? ` ${z.unit === 'deg' ? '°' : unitLabel(z.unit)}` : '';
      const asPower = (p: number) => `$10^{${p}}$${unit}`;
      return {
        ...g.mcq(`${lead(scene)}${listGivens(s, givens, g.seed)}${takeLine(entry)} The order of magnitude of the ${target} is closest to:`, asPower(power), [asPower(power + 1), asPower(power - 1), asPower(power + 2)], { why: `The ${target} works out at ${shown(z.value, z.unit)}, so its order of magnitude is $10^{${power}}$.` }),
        ...tag(scene),
      };
    },
  });
  if (isSize) out.push({
    key: `sigfig-${key}`,
    family: 'sigfig',
    marks: 1,
    difficulty: 2,
    type: 'mcq',
    format: 'mcq',
    make(g, scene) {
      const givens = s.draw(g);
      const z = g.solve(entry.id, find, forSolve(givens));
      if (!worthEstimating(z.value)) g.retry('an everyday size has no need of standard form');
      const power = Math.floor(Math.log10(z.value));
      const mantissa = z.value / 10 ** power;
      if (Math.abs(Number(mantissa.toFixed(2)) - Number(mantissa.toFixed(1))) < 0.001) g.retry('too round for a question on figures');
      const unit = z.unit ? ` ${z.unit === 'deg' ? '°' : unitLabel(z.unit)}` : '';
      const form = (m: string, p: number) => `$${m} \\times 10^{${p}}$${unit}`;
      const right = form(mantissa.toFixed(1), power);
      return {
        ...g.mcq(`${lead(scene)}${listGivens(s, givens, g.seed)}${takeLine(entry)} The ${target}, in standard form to two significant figures, is:`, right, [form(mantissa.toFixed(2), power), form(mantissa.toFixed(1), power + 1), form((mantissa * 10).toFixed(1), power + 1)], { why: `The ${target} is ${shown(z.value, z.unit)}. The others keep too many figures, or have the wrong power of ten.` }),
        ...tag(scene),
      };
    },
  });

  // A linked set: the value, then what happens if something changes, then a target to reach.
  const second = powers.find(([x]) => s.unknowns.includes(x));
  if (second) {
    out.push({
      key: `caseset-${key}`,
      family: 'caseset',
      marks: 5,
      difficulty: 3,
      type: 'numerical',
      format: 'cbq',
      style: 'cbq-style',
      make(g, scene) {
        const base = s.draw(g);
        const symbol = second[0];
        const name = s.name(symbol);
        const factor = g.pick([2, 3, 4]);
        const values: Record<string, number> = {};
        const part1 = partFor(s, find, base, 1, values, `(i) Find the ${target}.`, undefined, 'a');
        const changed: Givens = { ...base, [symbol]: { ...base[symbol], value: sig3(base[symbol].value * factor) } };
        const part2 = partFor(s, find, changed, 2, values, `(ii) The ${name} is now made ${factor} times as large, with nothing else changed. Find the new ${target}.`, undefined, 'b');
        const z = g.solve(entry.id, find, forSolve(base));
        const goal = sig3(z.value * 1.5);
        const toReach: Givens = { ...base, [find]: { value: goal, unit: z.unit } };
        delete toReach[symbol];
        const part3 = partFor(s, symbol, toReach, 2, values, `(iii) What ${name} would make the ${target} ${shown(goal, z.unit)}, with everything else as in (i)?`, undefined, 'c');
        return { ...g.numeric(`${lead(scene)}${listGivens(s, base, g.seed)}${takeLine(entry)}`, [part1, part2, part3], values), ...tag(scene) };
      },
    });
  }
  return out;
}

/** Two situations in a topic that hand one named quantity on, for a chained question. */
function chainsIn(list: Situation[]): [Situation, Situation, string][] {
  const out: [Situation, Situation, string][] = [];
  for (const a of list) {
    const from = varOf(a.entry, a.find);
    for (const b of list) {
      if (a.entry.id === b.entry.id) continue;
      // Ending on something part (a) was given only goes back to the start.
      if (freeVars(a.entry).some((v) => a.name(v.symbol) === b.name(b.find))) continue;
      const into = freeVars(b.entry).find((v) => v.symbol !== b.find && v.quantityKey === from.quantityKey && b.name(v.symbol) === a.name(from.symbol));
      // Time and angle are too general to link two steps sensibly.
      if (into && !/\b(time|angle)\b/.test(from.name)) out.push([a, b, into.symbol]);
    }
  }
  return out;
}

function chainSpec(a: Situation, b: Situation, into: string, marks: 3 | 5, key: string): Spec {
  const name = a.name(a.find);
  return {
    key: `chain${marks}-${key}`,
    family: 'chain',
    marks,
    difficulty: 3,
    type: 'numerical',
    format: 'numerical',
    make(g, scene) {
      const first = a.draw(g);
      const later = b.draw(g);
      delete later[into];
      const values: Record<string, number> = {};
      const partA = partFor(a, a.find, first, marks === 3 ? 1 : 2, values, `(a) Find the ${name}.`, undefined, 'a');
      partA.save = 'carried';
      const partB = partFor(b, b.find, later, marks === 3 ? 2 : 3, values, `(b) Using this ${name}, find the ${b.name(b.find)}.`, undefined, 'b');
      partB.given[into] = 'carried';
      const laterText = Object.keys(later).length ? ` For part (b), ${listGivens(b, later, g.seed).replace(/^./, (c) => c.toLowerCase())}` : '';
      const take = [takeLine(a.entry), takeLine(b.entry) === takeLine(a.entry) ? '' : takeLine(b.entry)].join('');
      const about = `${situationOf(a.entry)}${laterText ? '' : ''}`;
      const then = ENTRIES[b.entry.id]?.title ? ` Part (b) uses: ${ENTRIES[b.entry.id].title.replace(/\.$/, '')}.` : '';
      return { ...g.numeric(`${scene ? `${scene[1]} ` : ''}${about}${listGivens(a, first, g.seed)}${then}${laterText}${take}`, [partA, partB], values), ...(scene ? { context: scene[0] } : {}) };
    },
  };
}

const short = (id: string) => id.replace(/^[pcm]-x+i*-/, '');

/** Every variety blueprint for a class. A topic's scenes are filtered by what each entry is about. */
export function varietyBlueprints(subject: SubjectId, level: ClassLevel, scenesFor: (unit: number, topic: string) => readonly Scene[]): Blueprint[] {
  const prefix = `${CODE[subject]}${level === 'XII' ? '12' : '11'}`;
  const out: Blueprint[] = [];
  const sources = NUM_SOURCES.get(`${subject} ${level}`) ?? [];
  // Each topic a reviewed numerical is placed in, wherever the book files its formula.
  for (const place of new Set(sources.map((x) => `${x.unit}${x.topic}`))) {
    const match = /^(\d+)([a-z])$/.exec(place)!;
    const unit = Number(match[1]);
    const topic = match[2];
    const scenes = scenesFor(unit, topic);
    const situations: Situation[] = [];
    {
      const here = sources.filter((x) => x.unit === unit && x.topic === topic);
      const uses = new Map<string, NumSource[]>();
      for (const x of here) {
        const k = `${x.part.use}|${x.part.find}`;
        uses.set(k, [...(uses.get(k) ?? []), x]);
      }
      for (const [k, list] of uses) {
        const [id, find] = k.split('|');
        const entry = getEntry(id);
        if (!entry) continue;
        const situation = fromSources(entry, find, list, subject);
        if (situation) situations.push(situation);
      }
    }
    const specs: { spec: Spec; about: string }[] = [];
    for (const situation of situations) {
      const about = [...situation.entry.vars.map((v) => v.name), situation.entry.eq].join(' ');
      const k = `${short(situation.entry.id)}-${situation.find}`;
      for (const spec of specsFor(situation, subject, k)) specs.push({ spec, about });
    }
    for (const [a, b, into] of chainsIn(situations).slice(0, 12)) {
      const k = `${short(a.entry.id)}-${short(b.entry.id)}`;
      const about = [...a.entry.vars.map((v) => v.name), a.entry.eq].join(' ');
      specs.push({ spec: chainSpec(a, b, into, 3, k), about }, { spec: chainSpec(a, b, into, 5, k), about });
    }
    for (const { spec, about } of specs) {
      const id = `${prefix}-${unit}${topic}-v-${spec.key}`;
      if (skipped.has(id)) continue;
      const fitting = scenes.filter((scene) => !scene[2] || scene[2].test(about));
      out.push({
        id,
        subject,
        level,
        unit,
        topic,
        marks: spec.marks,
        type: spec.type,
        difficulty: spec.difficulty,
        format: spec.format,
        style: spec.style ?? 'paper-style',
        family: spec.family,
        make(g) {
          return spec.make(g, fitting.length ? fitting[g.seed % fitting.length] : null);
        },
      });
    }
  }
  return out;
}
