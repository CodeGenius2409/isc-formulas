// Turns the library into questions: a bank question for each, and generated ones that ask it in the other ways.
import type { Blueprint, Format } from '../blueprints/types';
import type { Gen } from '../../practice/gen/gen';
import { bank, type Bank } from '../../practice/bank/define';
import type { BankType, Difficulty } from '../../practice/bank/types';
import type { ClassLevel, SubjectId } from '../types';
import { COMPUTER_SCIENCE, CHEMISTRY, MATHEMATICS } from './others';
import { PHYSICS } from './physics';
import { marksOf, type Derivation } from './types';

export const DERIVATIONS: Derivation[] = [...PHYSICS, ...CHEMISTRY, ...MATHEMATICS, ...COMPUTER_SCIENCE];

const CODE: Record<SubjectId, string> = { physics: 'p', chemistry: 'c', mathematics: 'm', computerscience: 'k' };

export const derivationFact = (d: Derivation): string => `dv:${d.subject}:${d.slug}`;
export const stepBlueprintId = (d: Derivation): string => `${CODE[d.subject]}${d.level === 'XII' ? '12' : '11'}-${d.unit}${d.topic}-dv-${d.slug}-step`;

/** The whole derivation, written out as a model answer. */
export function modelDerivation(d: Derivation, extra = ''): string {
  const lines = [`Starting from: ${d.from}.`, ...(d.assumptions.length ? [`Assumptions: ${d.assumptions.join(' ')}`] : []), ...d.steps.map(([text, , why], i) => `${i + 1}. ${text}${why ? ` (${why})` : ''}`), `Result: ${d.result}`];
  return `${lines.join('\n')}${extra}`;
}

const askDerive = (d: Derivation) => `Derive an expression for ${d.what}.`;
const asks: ((d: Derivation) => string)[] = [
  askDerive,
  (d) => `Starting from ${d.from}, show that ${d.showThat}.`,
  (d) => `Derive an expression for ${d.what}, stating the assumptions you make.`,
];

const pointsOf = (d: Derivation): [string, number][] => d.steps.map(([text, marks]) => [text, marks]);

/** Bank questions, one for each. These are what's asked at 0% generated. */
export function derivationDefs(subject: SubjectId, level: ClassLevel, b: Bank = bank(subject, level)) {
  return DERIVATIONS.filter((d) => d.subject === subject && d.level === level).map((d) =>
    b.theory('derivation', [d.unit, d.topic, marksOf(d), (d.difficulty ?? 2) as Difficulty], d.drawIt ? `Draw a labelled diagram, and derive an expression for ${d.what}.` : askDerive(d), pointsOf(d), { model: modelDerivation(d), facts: [derivationFact(d)], stepBlueprint: stepBlueprintId(d), diagram: d.drawIt ? undefined : d.figure, answerDiagram: d.drawIt ? d.figure : undefined }),
  );
}

interface Maker {
  custom: (key: string, place: [number, string, number, Difficulty], opts: { type: BankType; format: Format; style?: Blueprint['style'] }, make: (g: Gen) => Blueprint extends { make: (g: Gen) => infer B } ? B : never) => Blueprint;
}

const fill = (text: string, values: Record<string, number>) => text.replace(/\{([A-Z])\}/g, (_, name: string) => String(values[name]));

/** Generated ways of asking: in other words, with a step missing, with a mistake to find, and "hence calculate". */
export function derivationBlueprints(subject: SubjectId, level: ClassLevel, { custom }: Maker): Blueprint[] {
  const out: Blueprint[] = [];
  const opts = { type: 'derivation' as const, format: 'derivation' as const };
  for (const d of DERIVATIONS.filter((x) => x.subject === subject && x.level === level)) {
    const total = marksOf(d);
    const difficulty = (d.difficulty ?? 2) as Difficulty;
    const fact = derivationFact(d);
    const stepBlueprint = stepBlueprintId(d);
    out.push(
      custom(`dv-${d.slug}-ask`, [d.unit, d.topic, total, difficulty], opts, (g) =>
        g.theory(g.pick(asks)(d), pointsOf(d), { model: modelDerivation(d), facts: [fact], stepBlueprint, diagram: d.drawIt ? undefined : d.figure, answerDiagram: d.drawIt ? d.figure : undefined }),
      ),
    );
    // The seed picks the step, so that a missed step can be asked again on its own.
    if (d.steps.length >= 2) {
      out.push(
        custom(`dv-${d.slug}-step`, [d.unit, d.topic, 2, difficulty], opts, (g) => {
          const at = g.seed % d.steps.length;
          const shown = d.steps.map(([text], i) => `${i + 1}. ${i === at ? '______' : text}`).join('\n');
          return g.theory(`This is a derivation of ${d.what}. One step is missing. Write it.\n${shown}`, [[d.steps[at][0], 2]], { model: modelDerivation(d), facts: [fact] });
        }),
      );
    }
    if (d.error) {
      const [at, wrong, why] = d.error;
      out.push(
        custom(`dv-${d.slug}-error`, [d.unit, d.topic, 2, difficulty], opts, (g) => {
          const shown = d.steps.map(([text], i) => `${i + 1}. ${i === at ? wrong : text}`).join('\n');
          return g.theory(`This derivation of ${d.what} has one mistake. Find the step, and correct it.\n${shown}`, [[`Step ${at + 1} is wrong. ${why}`, 1], [`It should read: ${d.steps[at][0]}`, 1]], { model: modelDerivation(d), facts: [fact] });
        }),
      );
    }
    if (d.hence) {
      const { text, vars, value, unit } = d.hence;
      out.push(
        custom(`dv-${d.slug}-hence`, [d.unit, d.topic, total + 2, Math.min(3, difficulty + 1) as Difficulty], { ...opts, style: 'cbq-style' }, (g) => {
          const values: Record<string, number> = {};
          for (const [name, [from, to, step]] of Object.entries(vars)) values[name] = g.step(from, to, step);
          const answer = value(values);
          if (!Number.isFinite(answer)) g.retry('no usable answer');
          const shown = Number(answer.toPrecision(4));
          return g.theory(`Derive an expression for ${d.what}. Hence: ${fill(text, values)}`, [...pointsOf(d), [`Substituting the values gives ${shown}${unit ? ` ${unit}` : ''}.`, 2]], { model: modelDerivation(d, `\nHence: ${shown}${unit ? ` ${unit}` : ''}`), facts: [fact], stepBlueprint, diagram: d.drawIt ? undefined : d.figure, answerDiagram: d.drawIt ? d.figure : undefined });
        }),
      );
    }
  }
  return out;
}
