import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain JS helper, shared with the data step
import { atomsOfCondensed, cleanSpecies, readReactions } from '../../scripts/structures/reactions.mjs';
// @ts-expect-error plain JS helper, shared with the data step
import { COMPOUNDS, EXAMPLES } from '../../scripts/structures/compounds.mjs';
import { loadUnits } from '../../src/data/book';
import type { Compounds } from '../../src/data/structures';
import type { Chunk, FormulaEntry, SharedEntry } from '../../src/data/types';
import { seededRng, structureQuestion } from '../../src/practice/questions';

const gen = path.resolve(__dirname, '../../src/data/generated');
const read = <T,>(file: string): T => JSON.parse(fs.readFileSync(path.join(gen, file), 'utf8')) as T;
const compounds = read<Compounds>('structures.json');
const shared = read<Record<string, SharedEntry>>('shared.json');
const entries: FormulaEntry[] = (['XI', 'XII'] as const).flatMap((level) =>
  read<Chunk>(`chemistry-${level}.json`).units.flatMap((u) => u.subtopics.flatMap((s) => s.items.map((item) => ('ref' in item ? shared[item.ref] : item)))),
);
const drawn = entries.filter((e) => e.structure);

describe('the structures that ship', () => {
  it('cover the organic units', () => {
    expect(drawn.length).toBeGreaterThan(300);
    expect(Object.keys(compounds).length).toBeGreaterThan(200);
  });

  it('every entry points only at compounds that exist', () => {
    for (const entry of drawn) {
      const tokens = entry.structure!.list ?? entry.structure!.rows!.flat().flatMap((t) => ('s' in t ? [t.s] : []));
      expect(tokens.length, entry.id).toBeGreaterThan(0);
      for (const key of tokens) expect(compounds[key], `${entry.id}: ${key}`).toBeTruthy();
    }
  });

  it('labels every hetero atom, as a skeleton with no labels is a different compound', () => {
    for (const [key, c] of Object.entries(compounds)) {
      expect(c.l.length + c.f.length, key).toBeGreaterThan(0);
      const hetero = c.m.replace(/C(?![a-z])|H(?![a-z])|\d/g, '');
      if (hetero) expect(c.f.length, `${key} is ${c.m}`).toBeGreaterThan(0);
      expect(c.w).toBeGreaterThan(0);
      expect(c.h).toBeGreaterThan(0);
    }
  });

  it('draws in the colour of the page, with no colours of its own', () => {
    // Only the paths: a # in a SMILES is a triple bond.
    const raw = Object.values(compounds).map((c) => c.l + c.f).join('');
    expect(raw).not.toMatch(/#|stroke|fill/);
  });

  it('gives the right formula and mass for compounds worked out by hand', () => {
    const facts: [string, string, number][] = [
      ['ethanol', 'C2H6O', 46.07],
      ['benzene', 'C6H6', 78.11],
      ['acetic-acid', 'C2H4O2', 60.05],
      ['aniline', 'C6H7N', 93.13],
      ['chloroform', 'CHCl3', 119.38],
      ['phenol', 'C6H6O', 94.11],
      ['glycine', 'C2H5NO2', 75.07],
      ['urea', 'CH4N2O', 60.06],
      ['glucose', 'C6H12O6', 180.16],
    ];
    for (const [key, formula, mass] of facts) {
      expect(compounds[key].m, key).toBe(formula);
      expect(compounds[key].a, key).toBeCloseTo(mass, 1);
    }
  });

  it('names the functional groups it should', () => {
    const groups = (key: string) => compounds[key].g;
    expect(groups('ethanol')).toContain('Alcohol');
    expect(groups('phenol')).toContain('Phenol');
    expect(groups('phenol')).not.toContain('Alcohol');
    expect(groups('ethanal')).toContain('Aldehyde');
    expect(groups('propanone')).toContain('Ketone');
    expect(groups('propanone')).not.toContain('Aldehyde');
    expect(groups('acetic-acid')).toContain('Carboxylic acid');
    expect(groups('ethyl-acetate')).toContain('Ester');
    expect(groups('acetyl-chloride')).toContain('Acid chloride');
    expect(groups('aniline')).toContain('Primary amine');
    expect(groups('nitrobenzene')).toContain('Nitro group');
    expect(groups('acetonitrile')).toContain('Nitrile');
    expect(groups('diethyl-ether')).toContain('Ether');
    expect(groups('acetamide')).toContain('Amide');
    expect(groups('acetamide')).not.toContain('Primary amine');
    expect(groups('chlorobenzene')).toContain('Aryl halide');
    expect(groups('bromoethane')).toContain('Alkyl halide');
  });
});

describe('reading reactions from the data', () => {
  it('counts the atoms in a condensed formula', () => {
    expect(atomsOfCondensed('CH3CH(OH)CH3')).toEqual({ C: 3, H: 8, O: 1 });
    expect(atomsOfCondensed('(CH3)3C-Br')).toEqual({ C: 4, H: 9, Br: 1 });
    expect(atomsOfCondensed('2,4,6-(NO2)3C6H2OH')).toEqual({ N: 3, O: 7, C: 6, H: 3 });
    expect(atomsOfCondensed('C6H5N2^+Cl^-')).toEqual({ C: 6, H: 5, N: 2, Cl: 1 });
    expect(atomsOfCondensed('HC≡CH')).toEqual({ C: 2, H: 2 });
  });

  it('reads a coefficient, but not a locant', () => {
    expect(cleanSpecies('2 CH3CHO')).toEqual({ species: 'CH3CHO', count: 2 });
    expect(cleanSpecies('2,4-(NO2)2C6H3Cl').species).toBe('2,4-(NO2)2C6H3Cl');
    expect(cleanSpecies('CH3CHBrCH3 (major)').species).toBe('CH3CHBrCH3');
  });

  it('keeps what is written over the arrow, even with nested subscripts', () => {
    const [chain] = readReactions('CH_{3}COONa+NaOH\\xrightarrow{\\text{CaO},\\ \\Delta}CH_{4}+Na_{2}CO_{3}');
    expect(chain[0].species).toEqual(['CH3COONa', 'NaOH']);
    expect(chain[1].arrow).toContain('CaO');
    expect(chain[2].species).toEqual(['CH4', 'Na2CO3']);
    const [nested] = readReactions('C_{6}H_{6}+HNO_{3}\\xrightarrow{\\text{conc. }H_{2}SO_{4}}C_{6}H_{5}NO_{2}+H_{2}O');
    expect(nested[1].arrow).toBe('conc. H2SO4');
  });

  it('balances each worked example, where every species is written down', () => {
    const atomsOf = (raw: string) => {
      const { species, count } = cleanSpecies(raw);
      const form = COMPOUNDS.flatMap((c: [string, string, string | null, string, string[]]) => c[4]).find((f: string) => f === species) ?? species;
      const atoms = /[a-z]{4}|\[H\]|\(glucose\)/.test(form) ? null : atomsOfCondensed(form);
      return { atoms, count: count ?? 1 };
    };
    const total = (side: string[]) => {
      const sum: Record<string, number> = {};
      for (const raw of side) {
        const { atoms, count } = atomsOf(raw);
        if (!atoms) return null;
        for (const [k, v] of Object.entries(atoms)) sum[k] = (sum[k] ?? 0) + (v as number) * count;
      }
      return sum;
    };
    const sorted = (o: Record<string, number>) => JSON.stringify(Object.entries(o).sort());
    const complete = [
      'c-xii-7-19', 'c-xii-7-25', 'c-xii-7-31', 'c-xii-7-32', 'c-xii-7-33', 'c-xii-7-34', 'c-xii-7-13', 'c-xii-7-112', 'c-xii-7-113', 'c-xii-7-193', 'c-xii-8-14', 'c-xii-8-31', 'c-xii-8-39', 'c-xii-8-41',
      'c-xii-8-94', 'c-xii-8-120', 'c-xii-8-134', 'c-xii-8-137', 'c-xi-11-2', 'c-xi-11-5', 'c-xi-11-7', 'c-xii-7-22', 'c-xii-7-27', 'c-xii-7-36', 'c-xii-7-44', 'c-xii-7-45', 'c-xii-9-26', 'c-xii-9-34',
      'c-xii-9-39', 'c-xii-9-42', 'c-xii-9-44', 'c-xii-9-47', 'c-xii-9-60', 'c-xii-9-65', 'c-xii-9-69', 'c-xii-9-73', 'c-xii-9-74', 'c-xii-9-75', 'c-xii-9-82',
      'c-xii-9-88', 'c-xii-9-89', 'c-xii-9-91', 'c-xii-9-93', 'c-xii-9-94',
    ];
    const byId = new Map(EXAMPLES as [string, string][]);
    for (const id of complete) {
      const [chain] = readReactions(byId.get(id)!, true);
      const left = total(chain[0].species);
      const right = total(chain[chain.length - 1].species);
      expect(left, id).not.toBeNull();
      expect(sorted(left!), `${id}: ${byId.get(id)}`).toBe(sorted(right!));
    }
  });
});

describe('structure questions', () => {
  it('always have one right answer among distinct options', async () => {
    const units = await Promise.all((['XI', 'XII'] as const).map((level) => loadUnits('chemistry', level)));
    const formulas = units.flat().flatMap((u) => u.subtopics.flatMap((s) => s.formulas)).filter((f) => f.structure);
    const rng = seededRng(11);
    const prompts = new Set<string>();
    for (let i = 0; i < 1500; i++) {
      const formula = formulas[Math.floor(rng() * formulas.length)];
      const question = structureQuestion(formula, compounds, rng);
      if (!question || question.kind !== 'mcq') continue;
      prompts.add(question.prompt);
      expect(question.options.filter((o) => o.correct).length, formula.id).toBe(1);
      const shown = question.options.map((o) => o.structure ?? o.text);
      expect(new Set(shown).size, `${formula.id}: ${shown}`).toBe(shown.length);
      expect(question.options.length).toBeGreaterThanOrEqual(3);
      expect(question.promptStructure).toBeTruthy();
    }
    expect([...prompts].sort()).toEqual(['Draw the product of this reaction on paper, then choose it.', 'Identify the functional group in this compound.', 'Name this compound.']);
  });

  it('asks for the product without giving it away', async () => {
    const units = await loadUnits('chemistry', 'XII');
    const aldol = units.flatMap((u) => u.subtopics.flatMap((s) => s.formulas)).find((f) => f.id === 'c-xii-8-55')!;
    for (let seed = 0; seed < 40; seed++) {
      const question = structureQuestion(aldol, compounds, seededRng(seed));
      if (question?.kind === 'mcq' && question.prompt.startsWith('Draw')) {
        const prompt = JSON.stringify(question.promptStructure);
        expect(prompt).toContain('ethanal');
        expect(prompt).not.toContain('"aldol"');
        expect(question.options.find((o) => o.correct)?.structure).toBe('aldol');
        return;
      }
    }
    throw new Error('never asked for the product');
  });

  it('never names the compound it asks you to name', async () => {
    const units = await loadUnits('chemistry', 'XII');
    const formula = units.flatMap((u) => u.subtopics.flatMap((s) => s.formulas)).find((f) => f.structure?.list)!;
    for (let seed = 0; seed < 30; seed++) {
      const question = structureQuestion(formula, compounds, seededRng(seed));
      if (question?.kind === 'mcq' && question.prompt === 'Name this compound.') {
        expect(question.promptStructure?.unnamed).toBe(1);
        return;
      }
    }
  });
});
