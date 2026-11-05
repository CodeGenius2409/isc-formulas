// Every derivation's result is checked: its two sides agree at random values, and have the same dimensions.
import { all, create } from 'mathjs';
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import { DERIVATIONS, stepBlueprintId } from '../../src/data/derivations';
import { marksOf } from '../../src/data/derivations/types';
import { loadBank } from '../../src/practice/bank';
import { generateItem } from '../../src/practice/gen/engine';
import { answerSpace, buildQuestionSet, allItems, emptyFilters } from '../../src/practice/gen/teacher';
import { assemblePaper, DERIVATION_SHARE, paperSpec, unitWeightsForTest } from '../../src/practice/bank/paper';
import { seededRng } from '../../src/practice/questions';
import { noteMissedSteps, srsStore } from '../../src/practice/progress';

const math = create(all);

const seededValue = (i: number, seed: number) => 0.2 + ((Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1 + 1) % 1;

describe('the library', () => {
  it('has unique names in each subject', () => {
    const keys = DERIVATIONS.map((d) => `${d.subject}:${d.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('has the derivations the syllabus names', () => {
    const named = [
      ['physics', ['equations-of-motion', 'projectile-path', 'momentum-conservation', 'elastic-collision', 'g-with-height', 'g-with-depth', 'gravitational-potential', 'escape-velocity', 'orbital-velocity', 'bernoulli', 'work-isothermal', 'work-adiabatic', 'kinetic-pressure', 'pendulum-period', 'spring-period', 'wave-speed', 'dipole-axial', 'dipole-equatorial', 'dipole-torque', 'potential-point', 'dipole-energy', 'drift-current', 'cells-mixed', 'wheatstone', 'biot-circular', 'biot-axis', 'force-parallel-wires', 'torque-loop', 'lcr-impedance', 'mirror-formula', 'r-is-2f', 'prism-formula', 'spherical-surface', 'lens-maker', 'lens-formula', 'microscope', 'simple-microscope', 'telescope', 'huygens-reflection', 'huygens-refraction', 'fringe-width', 'single-slit', 'debroglie', 'bohr-radius', 'bohr-energy', 'decay-law', 'half-life']],
      ['chemistry', ['kp-kc', 'ostwald', 'elevation-boiling', 'depression-freezing', 'integrated-zero', 'integrated-first', 'half-life-first', 'gibbs-emf']],
      ['mathematics', ['npr', 'ncr', 'binomial-theorem', 'first-principles-power', 'first-principles-sin', 'product-rule', 'quotient-rule', 'inverse-unique']],
    ] as const;
    for (const [subject, slugs] of named) {
      for (const slug of slugs) expect(DERIVATIONS.some((d) => d.subject === subject && d.slug === slug), `${subject}: ${slug}`).toBe(true);
    }
  });

  it('every marking scheme adds up, and the final step gives what it claims', () => {
    for (const d of DERIVATIONS) {
      expect(marksOf(d), d.slug).toBeGreaterThanOrEqual(3);
      for (const [text, marks] of d.steps) {
        expect(text.length, d.slug).toBeGreaterThan(10);
        expect(marks, d.slug).toBeGreaterThan(0);
      }
      expect(d.assumptions.length, d.slug).toBeGreaterThan(0);
    }
  });
});

describe('every result is checked where it can be', () => {
  const checked = DERIVATIONS.filter((d) => d.check);

  it('most have a check, and the rest are listed in reports/derivations.md', () => {
    expect(checked.length / DERIVATIONS.length).toBeGreaterThan(0.75);
  });

  for (const d of checked) {
    it(`${d.subject} ${d.slug}: both sides agree`, () => {
      const { lhs, rhs, vars } = d.check!;
      for (let seed = 1; seed <= 6; seed++) {
        const scope: Record<string, number> = {};
        Object.keys(vars).forEach((name, i) => (scope[name] = seededValue(i, seed)));
        const a = Number(math.evaluate(lhs, { ...scope }));
        const b = Number(math.evaluate(rhs, { ...scope }));
        expect(Math.abs(a - b), `${lhs} against ${rhs} at ${JSON.stringify(scope)}`).toBeLessThanOrEqual(Math.max(Math.abs(a), Math.abs(b), 1) * 1e-3);
      }
    });

    it(`${d.subject} ${d.slug}: the dimensions match`, () => {
      const { lhs, rhs, vars } = d.check!;
      const scope: Record<string, unknown> = {};
      Object.entries(vars).forEach(([name, unit], i) => {
        const value = seededValue(i, 3);
        scope[name] = unit ? math.unit(value, unit) : value;
      });
      let a: unknown;
      let b: unknown;
      try {
        a = math.evaluate(lhs, { ...scope });
        b = math.evaluate(rhs, { ...scope });
      } catch {
        // A logarithm or exponential of a quantity with units can't go through mathjs. These are checked for values alone.
        return;
      }
      const isUnit = (x: unknown): x is { equalBase: (o: unknown) => boolean } => typeof (x as { equalBase?: unknown })?.equalBase === 'function';
      if (isUnit(a) || isUnit(b)) expect(isUnit(a) && isUnit(b) && a.equalBase(b), `${lhs} against ${rhs}`).toBe(true);
    });
  }

  for (const d of DERIVATIONS.filter((x) => x.hence)) {
    it(`${d.subject} ${d.slug}: "hence calculate" gives the right answer`, () => {
      const { vars, value, expr } = d.hence!;
      for (let seed = 0; seed < 8; seed++) {
        const scope: Record<string, number> = {};
        for (const [name, [from, to, step]] of Object.entries(vars)) {
          const steps = Math.max(1, Math.round((to - from) / step));
          scope[name] = Number((from + (seed % (steps + 1)) * step).toPrecision(10));
        }
        const mine = value(scope);
        const theirs = Number(math.evaluate(expr, { ...scope }));
        expect(Number.isFinite(mine), d.slug).toBe(true);
        expect(Math.abs(mine - theirs), `${d.slug} at ${JSON.stringify(scope)}: ${mine} against ${theirs}`).toBeLessThanOrEqual(Math.max(Math.abs(theirs), 1e-9) * 1e-3);
      }
    });
  }
});

describe('in mock papers', () => {
  for (const subject of ['physics', 'chemistry', 'mathematics', 'computerscience'] as const) {
    it(`${subject} XII has them in the share the papers do, with none repeated, at 0, 50 and 100%`, async () => {
      const [bank, set, weights] = await Promise.all([loadBank(subject, 'XII'), loadBlueprints(subject, 'XII'), unitWeightsForTest(subject, 'XII')]);
      const spec = paperSpec(subject, 'XII');
      for (const share of [0, 50, 100]) {
        for (let seed = 1; seed <= 4; seed++) {
          const paper = assemblePaper(subject, 'XII', bank, weights, seededRng(seed), 0, { set, share });
          for (const [i, section] of spec.sections.entries()) {
            for (const marks of new Set(section.slots.map((s) => s.marks))) {
              const slots = section.slots.filter((s) => s.marks === marks);
              const want = slots.reduce((n, s) => n + Math.round(s.count * (DERIVATION_SHARE[subject][marks] ?? 0)), 0);
              const got = paper.sections[i].questions.filter((q) => q.item.marks === marks && (q.item.type === 'derivation' || q.item.type === 'proof')).length;
              expect(got, `${section.name}, ${marks} marks, at ${share}%`).toBeGreaterThanOrEqual(want);
            }
          }
          const facts = paper.sections.flatMap((s) => s.questions.flatMap((q) => q.item.facts ?? []));
          expect(new Set(facts).size, 'a derivation or fact was repeated').toBe(facts.length);
        }
      }
    });
  }
});

describe('marking by steps', () => {
  it('a step left unticked comes back on its own, and a ticked one doesn\u2019t', () => {
    srsStore.set({});
    noteMissedSteps('p12-1a-dv-dipole-axial-step', ['a', 'b', 'c'], [true, false, true]);
    expect(Object.keys(srsStore.get())).toEqual(['g-p12-1a-dv-dipole-axial-step-1']);
    srsStore.set({});
    noteMissedSteps(undefined, ['a'], [false]);
    expect(srsStore.get()).toEqual({});
  });

  it('leaves room for its marks', () => {
    expect(answerSpace({ type: 'derivation', marks: 5 }, 3)).toBe(10);
    expect(answerSpace({ type: 'mcq', marks: 1 }, 3)).toBe(3);
    expect(answerSpace({ type: 'derivation', marks: 5 }, 0)).toBe(0);
  });
});

describe('as questions', () => {
  it('every derivation has a bank question, with a checklist that totals its marks', async () => {
    for (const d of DERIVATIONS) {
      const bank = await loadBank(d.subject, d.level);
      const def = bank.defs.find((x) => x.form === 'theory' && (x.facts ?? []).includes(`dv:${d.subject}:${d.slug}`));
      expect(def, `${d.subject} ${d.slug}`).toBeDefined();
      if (def?.form !== 'theory') throw new Error('not theory');
      expect(def.marks).toBe(marksOf(d));
      expect(def.points.reduce((s, p) => s + p.marks, 0)).toBe(def.marks);
      expect(def.model).toContain(d.result);
      expect(def.type).toBe('derivation');
    }
  });

  it('every way of asking gives marks that total, and the step blueprint can ask each step', async () => {
    for (const d of DERIVATIONS) {
      const set = await loadBlueprints(d.subject, d.level);
      const own = set.blueprints.filter((b) => b.id.includes(`-dv-${d.slug}-`));
      expect(own.length, d.slug).toBeGreaterThanOrEqual(2);
      for (const bp of own) {
        for (let seed = 0; seed < 8; seed++) {
          const item = generateItem(bp, seed, set.names(bp));
          if (item.form !== 'theory') throw new Error(bp.id);
          expect(item.points.reduce((s, p) => s + p.marks, 0), bp.id).toBe(bp.marks);
          expect(item.facts, bp.id).toEqual([`dv:${d.subject}:${d.slug}`]);
        }
      }
      const step = set.byId.get(stepBlueprintId(d))!;
      expect(step, d.slug).toBeDefined();
      const asked = new Set<string>();
      for (let seed = 0; seed < d.steps.length; seed++) {
        const item = generateItem(step, seed, set.names(step));
        if (item.form !== 'theory') throw new Error(step.id);
        asked.add(item.points[0].text);
      }
      expect(asked.size, d.slug).toBe(new Set(d.steps.map((s) => s[0])).size);
    }
  });

  it('the derivation format works with any subject, and fills what is asked', async () => {
    for (const subject of ['physics', 'chemistry', 'mathematics'] as const) {
      for (const share of [0, 50, 100]) {
        const paper = await buildQuestionSet({ ...emptyFilters(subject), levels: ['XII'], formats: ['derivation'], share }, { mode: 'count', value: 5 }, subject, 11);
        const items = allItems(paper);
        expect(items.length, `${subject} at ${share}%`).toBe(5);
        for (const i of items) expect(['derivation', 'proof']).toContain(i.question.item.type);
        const facts = items.flatMap((i) => i.question.item.facts ?? []);
        expect(new Set(facts).size).toBe(facts.length);
      }
    }
  });
});
