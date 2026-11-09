// A topic's reviewed facts, written out as fixed bank questions. Nothing is invented here: each question is a fact's own
// words and marking points. They carry the same fact names as the generator, so a paper can't ask one twice either way.
import type { Facts } from '../../data/blueprints/dsl';
import type { ClassLevel, SubjectId } from '../../data/types';
import { ASSERTION_OPTIONS } from './define';
import type { BankDef, BankType, Difficulty, GeneratedTag, MarkPoint, QuestionFormat } from './types';

const CODE: Record<SubjectId, string> = { physics: 'p', chemistry: 'c', mathematics: 'm', computerscience: 'k' };

function hash(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (Math.imul(h, 33) ^ text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

const capital = (text: string) => (/^\w+\(\)/.test(text) ? text : text.charAt(0).toUpperCase() + text.slice(1));
const toPoints = (list: (string | [string, number])[]): MarkPoint[] => list.map((p) => (typeof p === 'string' ? { text: p, marks: 1 } : { text: p[0], marks: p[1] }));

/** A fixed order from a text, so that the same facts always give the same question. */
function ordered<T>(list: readonly T[], seed: string): T[] {
  const start = parseInt(hash(seed), 36);
  return list.map((value, i) => ({ value, at: (start * (i + 7)) % 1009 })).sort((a, b) => a.at - b.at).map((x) => x.value);
}

const ASKS_FOR_FORMULA = /\b(what is|write|state|give) (down )?the (formula|expression) (for|of)\b/i;

export function factDefs(subject: SubjectId, level: ClassLevel, unit: number, topic: string, f: Facts): BankDef[] {
  const prefix = `${CODE[subject]}${level === 'XII' ? '12' : '11'}`;
  const out: BankDef[] = [];
  const seen = new Set<string>();
  const fact = (text: string) => `${prefix}-${unit}${topic}:${text.slice(0, 80)}`;
  const tags = (key: string, marks: number, difficulty: Difficulty, type: BankType, format: QuestionFormat, facts: string[], style: GeneratedTag['style'] = 'paper-style') => {
    const id = `q-${prefix}-${unit}${topic}-f${hash(`${format}|${key}`)}`;
    return { id, subject, level, unit, topic, marks, difficulty, type, format, style, facts, origin: 'facts' as const };
  };
  const push = (def: BankDef) => {
    if (seen.has(def.id)) return;
    seen.add(def.id);
    out.push(def);
  };
  const theory = (key: string, marks: number, difficulty: Difficulty, type: BankType, format: QuestionFormat, facts: string[], text: string, points: (string | [string, number])[], extra: Partial<BankDef> = {}, style?: GeneratedTag['style']) =>
    push({ form: 'theory', ...tags(key, marks, difficulty, type, format, facts, style), text, points: toPoints(points), ...extra } as BankDef);

  for (const [term, ...meaning] of f.define ?? []) {
    theory(term, 1, 1, 'definition', 'very-short', [fact(term)], `Define ${term}.`, [meaning[0]]);
    if (meaning.length >= 2) theory(`${term}|2`, 2, 2, 'definition', 'short', [fact(term)], `State what is meant by ${term}, and add one further point about it.`, [meaning[0], meaning[1]]);
  }
  for (const [question, right, a, b, c] of f.recall ?? []) {
    if (ASKS_FOR_FORMULA.test(question)) continue;
    const options = ordered([right, a, b, c], question);
    push({ form: 'mcq', ...tags(question, 1, 1, 'mcq', 'mcq', [fact(question)]), text: question, options: options.map((text) => ({ text })), answer: options.indexOf(right) });
  }
  for (const [claim, ...because] of f.reason ?? []) {
    const marks = because.length;
    if (marks < 1 || marks > 5) continue;
    theory(claim, marks, marks === 1 ? 1 : marks === 2 ? 2 : 3, 'reason', 'reason', [fact(claim)], `Give a reason: ${claim}`, because);
  }
  for (const [a, b, ...rows] of f.compare ?? []) {
    const list = rows as [string, string][];
    if (list.length < 2) continue;
    for (const marks of list.length >= 3 ? [2, 3] : [2]) {
      theory(`${a}|${b}|${marks}`, marks, marks === 2 ? 1 : 2, 'distinguish', 'distinguish', [fact(`${a} | ${b}`)], `Distinguish between ${a} and ${b}${marks === 3 ? ', with three points' : ''}.`, list.slice(0, marks).map(([x, y]) => `${capital(a)}: ${x} ${capital(b)}: ${y}`));
    }
    const shown = [list[0], list[1]];
    theory(`${a}|${b}|table`, 2, 2, 'short', 'complete', [fact(`${a} | ${b}`)], 'Complete the table, by saying what belongs in place of each question mark.', [`Row 1: ${shown[0][1]}`, `Row 2: ${shown[1][0]}`], { diagram: { kind: 'table', head: [capital(a), capital(b)], rows: [[shown[0][0], '?'], ['?', shown[1][1]]] } });
  }
  const truths = f.truths ?? [];
  truths.forEach(([right, wrong], i) => {
    const others = ordered(truths.filter((_, j) => j !== i), right);
    if (others.length >= 3) {
      const asTrue = ordered([right, ...others.slice(0, 3).map((t) => t[1])], `${right}|t`);
      push({ form: 'mcq', ...tags(`${right}|true`, 1, 2, 'mcq', 'statement', [fact(right)]), text: 'Which one of the following statements is true?', options: asTrue.map((text) => ({ text })), answer: asTrue.indexOf(right), why: right });
      const asFalse = ordered([wrong, ...others.slice(0, 3).map((t) => t[0])], `${right}|f`);
      push({ form: 'mcq', ...tags(`${right}|false`, 1, 3, 'mcq', 'statement', [fact(right)]), text: 'Which one of the following statements is incorrect?', options: asFalse.map((text) => ({ text })), answer: asFalse.indexOf(wrong), why: `This one is false. In fact: ${right}` });
    }
    theory(`${right}|wrong`, 2, 2, 'short', 'mistake', [fact(right)], `A student writes: “${wrong}” Say what is wrong with this, and write the statement correctly.`, [[right, 2]]);
  });
  for (const [concept, statement, falseStatement, because, falseBecause, alsoTrue] of f.ar ?? []) {
    const add = (answer: number, assertion: string, reason: string, difficulty: Difficulty, why: string) =>
      push({ form: 'mcq', ...tags(`${assertion}|${reason}`, 1, difficulty, 'assertion', 'assertion', [fact(concept)], 'cbq-style'), text: `Assertion: ${assertion}\nReason: ${reason}`, options: ASSERTION_OPTIONS.map((text) => ({ text })), answer, why });
    add(0, statement, because, 2, 'Both are true, and the reason explains the assertion.');
    add(1, statement, alsoTrue, 3, `Both are true, but what explains the assertion is this: ${because}`);
    add(2, statement, falseBecause, 2, `The reason is false. In fact: ${because}`);
    add(3, falseStatement, because, 1, `The assertion is false. In fact: ${statement}`);
  }
  for (const [question, ...points] of f.explain ?? []) {
    const marks = points.length;
    // A fixed question should test more than a formula's wording, so these stay as the generator's rare recall items.
    if (!marks || ASKS_FOR_FORMULA.test(question)) continue;
    theory(question, marks, marks === 1 ? 1 : marks === 2 ? 2 : 3, 'short', marks === 1 ? 'very-short' : 'short', [fact(question)], question, points);
  }
  for (const [question, ...points] of f.long ?? []) {
    if (ASKS_FOR_FORMULA.test(question)) continue;
    const marks = points.reduce<number>((sum, p) => sum + (typeof p === 'string' ? 1 : p[1]), 0);
    theory(question, marks, marks >= 5 ? 3 : 2, 'derivation', marks >= 5 ? 'long' : 'derivation', [fact(question)], question, points as (string | [string, number])[], f.figures?.[question] ? { diagram: f.figures[question] } : {});
  }
  for (const [question, ...points] of f.draw ?? []) {
    const key = Object.keys(f.answerFigures ?? {}).find((start) => question.startsWith(start));
    theory(question, points.length, 2, 'short', 'diagram', [fact(question)], question, points, key ? { answerDiagram: f.answerFigures![key] } : {});
  }
  for (const c of f.cases ?? []) {
    const marks = c.parts.reduce((sum, p) => sum + p[2], 0);
    const roman = ['i', 'ii', 'iii', 'iv', 'v'];
    theory(c.scene, marks, 2, 'short', 'cbq', [fact(c.scene)], `${c.scene}\n${c.parts.map((p, i) => `(${roman[i]}) ${p[0]} [${p[2]}]`).join('\n')}`, c.parts.map((p, i): [string, number] => [`(${roman[i]}) ${p[1]}`, p[2]]), {}, 'cbq-style');
  }
  for (const [term, meaning] of f.define ?? []) {
    const key = term.toLowerCase().replace(/[^a-z ]/g, '').split(' ').filter((w) => w.length > 3);
    if (key.some((w) => meaning.toLowerCase().includes(w.slice(0, 5)))) continue;
    theory(`${term}|complete`, 1, 1, 'short', 'complete', [fact(term)], `Complete the statement. “${meaning}” This describes ______.`, [capital(term)]);
  }
  // Sets of four terms to match, each term in one set.
  const terms = ordered(f.define ?? [], `${unit}${topic}`);
  for (let i = 0; i + 4 <= terms.length; i += 4) {
    const pairs = terms.slice(i, i + 4);
    const order = ordered([0, 1, 2, 3], pairs.map((p) => p[0]).join());
    if (order.every((j, k) => j === k)) continue;
    const letters = 'abcd';
    const columnA = pairs.map(([term], k) => `(${k + 1}) ${term}`).join('\n');
    const columnB = order.map((j, k) => `(${letters[k]}) ${pairs[j][1]}`).join('\n');
    theory(pairs.map((p) => p[0]).join('|'), 4, 2, 'short', 'match', pairs.map(([term]) => fact(term)), `Match each item in Column A with its description in Column B.\nColumn A\n${columnA}\nColumn B\n${columnB}`, pairs.map(([term], k): [string, number] => [`(${k + 1}) ${term} goes with (${letters[order.indexOf(k)]}).`, 1]));
  }
  for (const [instruction, items, why] of f.order ?? []) {
    let mixed = ordered(items, instruction);
    if (mixed.every((x, i) => x === items[i])) mixed = [...items].reverse();
    theory(instruction, 2, 2, 'short', 'order', [fact(instruction)], `${instruction}: ${mixed.join(', ')}.`, [items.join(', '), why]);
  }
  for (const [items, odd, why] of f.odd ?? []) {
    theory(items.join('|'), 2, 2, 'short', 'odd', [fact(items.join(' '))], `Which is the odd one out? Give the reason.\n${ordered(items, odd).join(', ')}`, [`The odd one out is ${odd}.`, why]);
  }
  for (const [question, happens, why] of f.predict ?? []) {
    theory(question, 2, 2, 'short', 'predict', [fact(question)], `${question} Predict what happens, and explain why.`, [happens, why], {}, 'cbq-style');
  }
  return out;
}
