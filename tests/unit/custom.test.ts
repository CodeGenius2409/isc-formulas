// Your own formulas, away from the browser: placement, the solver, backup files and search.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { canSolve, customEntry, equationFromLatex, equationProblem } from '../../src/custom/entry';
import { additions, mergeCustom, resolveCustom } from '../../src/custom/merge';
import { customStore, exportCustom, isCustomId, newCustomId, parseCustomBackup, planImport, problemWith, unsavedCount, type CustomFormula } from '../../src/custom/store';
import { loadPrintedUnits } from '../../src/data/book';
import type { Manifest } from '../../src/data/types';
import { toSearchDoc } from '../../src/search/doc';
import { buildIndex, runSearch } from '../../src/search/engine';
import { getEntry } from '../../src/solver/registry';
import { solve } from '../../src/solver/solve';

const gen = path.resolve(__dirname, '../../src/data/generated');
const manifest = JSON.parse(fs.readFileSync(path.join(gen, 'manifest.json'), 'utf8')) as Manifest;
const physicsXI = manifest.subjects.find((s) => s.id === 'physics')!.classes.find((c) => c.level === 'XI')!;
const kinematics = physicsXI.units[1];

const formula = (over: Partial<CustomFormula> = {}): CustomFormula => ({
  id: 'u-1',
  name: 'My relation',
  latex: 'v=u+at',
  subject: 'physics',
  level: 'XI',
  unit: '2',
  subtopic: kinematics.subtopics[0].name,
  createdAt: 1,
  updatedAt: 1,
  ...over,
});

describe('ids', () => {
  it('never clash with a built-in id or an alias', () => {
    const aliases = JSON.parse(fs.readFileSync(path.join(gen, 'idAliases.json'), 'utf8')) as Record<string, unknown>;
    expect(Object.keys(aliases).some(isCustomId)).toBe(false);
    expect(Object.values(aliases).some((v) => typeof v === 'string' && isCustomId(v))).toBe(false);
    for (const file of fs.readdirSync(path.join(gen)).filter((f) => /-X/.test(f))) {
      expect(fs.readFileSync(path.join(gen, file), 'utf8'), file).not.toMatch(/"id":"u-/);
    }
    const id = newCustomId();
    expect(id).toMatch(/^u-[\w-]{10,}$/);
    expect(newCustomId()).not.toBe(id);
  });
});

describe('placement in the book', () => {
  it('puts a formula after the printed ones in its own section, in its own chapter', async () => {
    const printed = await loadPrintedUnits('physics', 'XI');
    const merged = mergeCustom(printed, [formula()], 'physics', 'XI');
    const unit = merged[1];
    expect(unit.subtopics.map((s) => s.name)).toEqual(printed[1].subtopics.map((s) => s.name));
    const section = unit.subtopics[0];
    expect(section.formulas.length).toBe(printed[1].subtopics[0].formulas.length + 1);
    const last = section.formulas[section.formulas.length - 1];
    expect(last.id).toBe('u-1');
    expect(last.custom).toBe(1);
    expect(last.subject).toBe('physics');
    expect(last.unitIndex).toBe(1);
    expect(last.subtopicIndex).toBe(0);
    // The other chapters are the same objects, so nothing else re-renders.
    expect(merged[0]).toBe(printed[0]);
  });

  it('gives a new section a place after the chapter\'s own, and keeps it for later formulas', async () => {
    const printed = await loadPrintedUnits('physics', 'XI');
    const merged = mergeCustom(printed, [formula({ subtopic: 'My notes' }), formula({ id: 'u-2', subtopic: 'My notes', name: 'Second', createdAt: 2 })], 'physics', 'XI');
    const unit = merged[1];
    const mine = unit.subtopics[unit.subtopics.length - 1];
    expect(mine.name).toBe('My notes');
    expect(mine.custom).toBe(1);
    expect(mine.index).toBe(printed[1].subtopics.length);
    expect(mine.formulas.map((f) => f.id)).toEqual(['u-1', 'u-2']);
    const added = additions([formula({ subtopic: 'My notes' })], 'physics', 'XI').get(1)!;
    expect(added.total).toBe(1);
    expect(added.extraSections).toEqual([{ name: 'My notes', count: 1 }]);
  });

  it('leaves another class alone, and hands back the same list with nothing to add', async () => {
    const printed = await loadPrintedUnits('physics', 'XII');
    expect(mergeCustom(printed, [formula()], 'physics', 'XII')).toBe(printed);
    expect(mergeCustom(printed, [], 'physics', 'XII')).toBe(printed);
  });

  it('agrees with the list view on where each formula is', () => {
    const [a, b] = resolveCustom([formula(), formula({ id: 'u-2', subtopic: 'My notes' })]);
    expect(a.subtopic).toBe(kinematics.subtopics[0].name);
    expect(b.subtopicIndex).toBe(kinematics.subtopics.length);
    expect(b.unit).toBe(kinematics.name);
  });
});

describe('the solver', () => {
  const vars = [{ symbol: 'F', meaning: 'Force', unit: 'N' }, { symbol: 'm', meaning: 'Mass', unit: 'kg' }, { symbol: 'a', meaning: 'Acceleration', unit: 'm/s^2' }];

  it('leaves a formula without variables out', () => {
    customStore.set({ status: 'ready', formulas: [formula()] });
    expect(getEntry('u-1')).toBeNull();
    expect(canSolve(formula())).toBe(false);
    expect(canSolve(formula({ variables: vars }))).toBe(false);
  });

  it('solves one that has variables and an equation', () => {
    customStore.set({ status: 'ready', formulas: [formula({ equation: 'F = m*a', variables: vars })] });
    const entry = customEntry('u-1')!;
    expect(entry.vars.find((v) => v.symbol === 'F')!.dim).toBe('M L T^-2');
    const outcome = solve(getEntry('u-1')!, 'F', { m: { raw: '2', unit: 'kg' }, a: { raw: '3', unit: 'm/s^2' } });
    expect(outcome.ok).toBe(true);
    expect(outcome.roots[0].value).toBe(6);
    customStore.set({ status: 'ready', formulas: [] });
  });

  it('says what is wrong with an equation', () => {
    expect(equationProblem('F = m*a', [vars[0], vars[1]])).toContain('"a"');
    expect(equationProblem('F = m*a', vars)).toBeNull();
    expect(equationProblem('F =', vars)).not.toBeNull();
    expect(equationProblem('F = m*a', [...vars.slice(0, 2), { symbol: 'a', meaning: 'x', unit: 'furlongs' }])).toContain('furlongs');
  });

  it('guesses solver form from simple LaTeX, and declines the rest', () => {
    expect(equationFromLatex('F=ma')).toBe('F=ma');
    expect(equationFromLatex('v=\\frac{s}{t}')).toBe('v=((s)/(t))');
    expect(equationFromLatex('E=mc^{2}')).toBe('E=mc^(2)');
    expect(equationFromLatex('\\int x\\,dx')).toBeNull();
  });
});

describe('backup files', () => {
  it('round-trips', () => {
    customStore.set({ status: 'ready', formulas: [formula(), formula({ id: 'u-2', name: 'B', latex: 'x', variables: [{ symbol: 'x', meaning: 'y', unit: '' }], smiles: 'CCO', lewis: ['water'], note: 'n' })] });
    const parsed = parseCustomBackup(JSON.stringify(exportCustom()));
    expect(parsed.ok && parsed.formulas.length).toBe(2);
    expect(parsed.ok && parsed.skipped).toBe(0);
    customStore.set({ status: 'ready', formulas: [] });
  });

  it('refuses what isn\'t a formulas file, with a reason', () => {
    expect(parseCustomBackup('nope')).toEqual({ ok: false, error: 'That file is not valid JSON.' });
    expect(parseCustomBackup('{"app":"other"}').ok).toBe(false);
    expect(parseCustomBackup('null').ok).toBe(false);
    expect(parseCustomBackup('{"app":"isc-formula-book","kind":"custom-formulas","version":9,"formulas":[]}')).toEqual({ ok: false, error: 'This file is version 9, which this app cannot read.' });
    expect(parseCustomBackup('{"app":"isc-formula-book","kind":"custom-formulas","version":1}').ok).toBe(false);
  });

  it('skips bad records, keeping the good ones', () => {
    const bad: unknown[] = [
      formula({ id: 'p-xi-2-4' }),
      formula({ id: 'u-<img>' }),
      formula({ name: '' }),
      formula({ latex: 'x'.repeat(5000) }),
      { ...formula(), subject: 'history' },
      { ...formula(), level: 'XIII' },
      { ...formula(), variables: 'none' },
      { ...formula(), lewis: [{}] },
      { ...formula(), createdAt: 'yesterday' },
      null,
      7,
    ];
    for (const record of bad) expect(problemWith(record), JSON.stringify(record)?.slice(0, 80)).not.toBeNull();
    const parsed = parseCustomBackup(JSON.stringify({ app: 'isc-formula-book', kind: 'custom-formulas', version: 1, formulas: [formula(), ...bad] }));
    expect(parsed.ok && parsed.formulas.map((f) => f.id)).toEqual(['u-1']);
    expect(parsed.ok && parsed.skipped).toBe(bad.length);
  });

  it('handles duplicates: the newest edit wins, and the same content isn\'t added twice', () => {
    const mine = formula({ updatedAt: 5 });
    expect(planImport([formula({ updatedAt: 5 })], [mine])).toEqual({ add: [], replace: [], duplicates: 1 });
    expect(planImport([formula({ updatedAt: 1 })], [mine]).duplicates).toBe(1);
    const newer = formula({ updatedAt: 9, name: 'Renamed' });
    expect(planImport([newer], [mine]).replace).toEqual([newer]);
    expect(planImport([formula({ id: 'u-copy' })], [mine]).duplicates).toBe(1);
    const fresh = formula({ id: 'u-3', name: 'Other' });
    expect(planImport([fresh, fresh], [mine])).toEqual({ add: [fresh], replace: [], duplicates: 1 });
  });

  it('reminds only once a few have no backup', () => {
    expect(unsavedCount(2, 0)).toBe(0);
    expect(unsavedCount(3, 0)).toBe(3);
    expect(unsavedCount(5, 3)).toBe(0);
    expect(unsavedCount(9, 3)).toBe(6);
  });
});

describe('search', () => {
  it('finds your formula by name and by symbol, and the filter shows only yours', async () => {
    const printed = await loadPrintedUnits('physics', 'XI');
    const docs = printed[1].subtopics.flatMap((s) => s.formulas).map(toSearchDoc);
    const [mine] = resolveCustom([formula({ name: 'Zebra relation', latex: 'q=ch', variables: [{ symbol: 'wibble', meaning: 'Springiness', unit: '' }] })]);
    const index = buildIndex([...docs, toSearchDoc(mine)]);
    expect(runSearch(index, 'zebra', {}).hits[0].id).toBe('u-1');
    expect(runSearch(index, 'springiness', {}).hits[0].id).toBe('u-1');
    expect(runSearch(index, 'wibble', {}).hits[0].id).toBe('u-1');
    expect(runSearch(index, 'velocity', {}).hits.length).toBeGreaterThan(0);
    expect(runSearch(index, 'velocity', { custom: true }).hits.length).toBe(0);
    expect(runSearch(index, 'zebra', { custom: true }).hits.length).toBe(1);
  });
});
