// Every structure with lone pairs passes the automated check, and the report records it.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkMolecule, formalCharge } from '../../src/data/lewis/check';
import { LEWIS } from '../../src/data/lewis/figures';
import type { LewisMolecule } from '../../src/data/lewis/types';
import { loadBank } from '../../src/practice/bank';

const molecules: LewisMolecule[] = Object.values(LEWIS).flatMap((f) => f.forms);
const REPORT = path.resolve(__dirname, '../../reports/structures-report.md');
const START = '<!-- lewis-check-start -->';
const END = '<!-- lewis-check-end -->';

function reportSection(): string {
  const rows = molecules.map((m) => {
    const results = checkMolecule(m);
    const pick = (name: string) => results.find((r) => r.name === name);
    const electrons = /^(\d+)/.exec(pick('valence electrons')!.detail)?.[1];
    return `| ${m.id} | ${m.name} | \`${m.formula}\` | ${electrons} | ${pick('charges sum')!.pass ? `${m.charge}` : 'FAIL'} | ${m.exceptions ? Object.values(m.exceptions).join(', ') : 'octet'} | ${m.shape ?? '-'} | ${m.hyb ?? '-'} | ${results.every((r) => r.pass) ? 'Pass' : 'FAIL'} |`;
  });
  const failed = molecules.filter((m) => checkMolecule(m).some((r) => !r.pass));
  return [
    START,
    '## Structures with lone pairs',
    '',
    'These are drawn from JSON descriptions in `src/data/lewis/figures.ts`, by `components/Lewis.tsx`, because skeletal renderers do not draw lone pairs well. `tests/unit/lewis.test.ts` runs `src/data/lewis/check.ts` on every one, and fails if any check fails. This table is written by that test.',
    '',
    `**${molecules.length} structures in ${Object.keys(LEWIS).length} figures. ${failed.length} failed.**`,
    '',
    'Each is checked for: the atoms drawn against the formula; total valence electrons against the formula and overall charge; each atom\'s formal charge against the charge shown, and their sum against the overall charge; octets, allowing only marked exceptions (electron-deficient only for Be, B, Al and carbocation carbon, expanded only for period 3 and below, and odd-electron species); the stated shape against the count of electron domains; the hybridisation against the domains; and, where a shape lies in the page, the angles actually drawn.',
    '',
    '**What the check cannot verify.** It confirms a structure is self-consistent, not that it is the one the book would print. So these choices are mine, from standard teaching, and worth a teacher\'s look:',
    '',
    '- **Expanded octets for S in SO₂ and SO₄²⁻.** They are drawn with S=O double bonds, as ISC textbooks commonly do. Some books draw dative bonds instead.',
    '- **Complex geometry.** VSEPR does not predict the shape of a complex. The check confirms that coordination number and hybridisation agree, but that [Ni(CN)₄]²⁻ is square planar and [NiCl₄]²⁻ tetrahedral, and which complexes are low spin, come from the standard results and not from a calculation.',
    '- **Carbon free radicals** are drawn planar, sp², with the odd electron in a p orbital, so it is not counted as a domain there. In NO₂, the odd electron is counted as one.',
    '- **R groups and labelled groups** such as CH₃ count their own electrons from a table, and their insides are not drawn.',
    '- **Bond angles** other than linear, 120° and 90° are not measured, since shape diagrams show them in perspective.',
    '',
    '**Left out on purpose.** The syllabus map has no p-block unit, so oxoacids of phosphorus and sulphur, interhalogens as a topic, and xenon compounds are not drawn. ClF₃, BrF₅ and the iodine ions appear only as VSEPR examples of their shapes, since the book\'s VSEPR entries name them. XeF₂ and XeF₄ are named in those entries but are not drawn.',
    '',
    '| Id | Name | Formula | Valence electrons | Overall charge | Octets | Shape | Hybridisation | Result |',
    '|---|---|---|---:|---:|---|---|---|---|',
    ...rows,
    END,
  ].join('\n');
}

describe('structures with lone pairs', () => {
  it.each(molecules.map((m) => [m.id, m] as const))('%s passes every check', (_id, m) => {
    const failures = checkMolecule(m).filter((r) => !r.pass);
    expect(failures.map((f) => `${f.name}: ${f.detail}`)).toEqual([]);
  });

  it('catches a wrong structure', () => {
    const water = LEWIS.water.forms[0];
    const failing = (m: LewisMolecule) => checkMolecule(m).filter((r) => !r.pass).map((r) => r.name);
    expect(failing({ ...water, atoms: water.atoms.map((a, i) => (i === 0 ? { ...a, lp: 1 } : a)) })).toEqual(expect.arrayContaining(['valence electrons', 'octets', 'hybridisation']));
    expect(failing({ ...water, formula: 'H3O' })).toContain('atoms');
    expect(failing({ ...water, shape: 'linear' })).toContain('shape');
    expect(failing({ ...water, hyb: 'sp2' })).toContain('hybridisation');
    expect(failing({ ...water, charge: 1 })).toContain('charges sum');
    // An octet exception only counts on an element that can have it.
    const co2 = LEWIS.co2.forms[0];
    expect(failing({ ...co2, exceptions: { 0: 'expanded' } })).toContain('octets');
    // A formal charge left off the drawing.
    const ammonium = LEWIS.ammonium.forms[0];
    expect(failing({ ...ammonium, atoms: ammonium.atoms.map((a) => ({ ...a, charge: 0 })) })).toContain('formal charges');
  });

  it('works out the formal charges the book states', () => {
    const ammonium = LEWIS.ammonium.forms[0];
    expect(formalCharge(ammonium, 0)).toBe(1);
    const ozone = LEWIS.ozone.forms[0];
    expect([0, 1, 2].map((i) => formalCharge(ozone, i))).toEqual([1, 0, -1]);
    expect(formalCharge(LEWIS.hydroxide.forms[0], 0)).toBe(-1);
  });

  it('counts electrons as the book does', () => {
    const count = (id: string) => /^(\d+)/.exec(checkMolecule(LEWIS[id].forms[0]).find((r) => r.name === 'valence electrons')!.detail)![1];
    expect(count('water')).toBe('8');
    expect(count('co2')).toBe('16');
    expect(count('no')).toBe('11');
    expect(count('carbonate')).toBe('24');
  });

  it('gives every resonance form of a species the same atoms and charge', () => {
    for (const figure of Object.values(LEWIS).filter((f) => f.resonance)) {
      expect(figure.forms.length).toBeGreaterThan(1);
      for (const form of figure.forms) {
        expect(form.formula).toBe(figure.forms[0].formula);
        expect(form.charge).toBe(figure.forms[0].charge);
      }
    }
  });

  it('every figure a book entry names exists, and each entry\'s lone pairs are drawn from data', () => {
    const gen = path.resolve(__dirname, '../../src/data/generated');
    let found = 0;
    const walk = (node: unknown): void => {
      if (Array.isArray(node)) node.forEach(walk);
      else if (node && typeof node === 'object') {
        const entry = node as { id?: string; lewis?: string[] };
        if (entry.lewis) {
          found++;
          for (const id of entry.lewis) expect(LEWIS[id], `${entry.id}: ${id}`).toBeTruthy();
        }
        Object.values(node).forEach(walk);
      }
    };
    for (const file of ['chemistry-XI.json', 'chemistry-XII.json', 'shared.json']) walk(JSON.parse(fs.readFileSync(path.join(gen, file), 'utf8')));
    expect(found).toBeGreaterThan(50);
  });

  it('practice questions use real figures, and their answers match the checked data', async () => {
    let shapes = 0;
    for (const level of ['XI', 'XII'] as const) {
      for (const def of (await loadBank('chemistry', level)).defs) {
        for (const id of def.answerLewis ?? []) expect(LEWIS[id], def.id).toBeTruthy();
        if (def.form === 'mcq' && def.answerLewis && def.text.includes('what is the shape')) {
          expect(def.options[def.answer].text, def.id).toBe(LEWIS[def.answerLewis[0]].forms[0].shape);
          expect(new Set(def.options.map((o) => o.text)).size).toBe(def.options.length);
          shapes++;
        }
      }
    }
    expect(shapes).toBeGreaterThan(10);
  });

  it('has an up-to-date report', () => {
    const section = reportSection();
    const text = fs.readFileSync(REPORT, 'utf8').replace(/\r\n/g, '\n');
    const at = text.indexOf(START);
    if (process.env.WRITE_REPORT) {
      const rest = at < 0 ? `${text.trimEnd()}\n\n` : `${text.slice(0, at)}`;
      fs.writeFileSync(REPORT, `${rest}${section}\n`);
      return;
    }
    expect(text.slice(at, text.indexOf(END) + END.length)).toBe(section);
  });
});
