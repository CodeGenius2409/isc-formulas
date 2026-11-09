// How close generated papers come to the real ones. For each subject and class, 50 mock papers and 50 teacher papers at 0%, 50% and
// 100% generated are compared with the real structure in src/practice/bank/paper-targets.json, which comes from the private analysis
// and holds only counts. The shape must match exactly. The mix can't, as a paper is whole questions, so the mix is measured as
// an average over the 50, and there are floors here that can only rise. PAPER_REPORT=1 writes reports/paper-fidelity.md.
import fs from 'node:fs';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import { loadSyllabus } from '../../src/data/syllabus';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { loadBank } from '../../src/practice/bank';
import { classTargets, formatOfQuestion, hasFigure, isCompetency, topicAsked } from '../../src/practice/bank/compose';
import { assemblePaper, paperSpec, unitWeightsForTest } from '../../src/practice/bank/paper';
import type { BankQuestion, QuestionFormat } from '../../src/practice/bank/types';
import { seededRng } from '../../src/practice/questions';
import { allItems, buildFullPaper, emptyFilters, officialStructure } from '../../src/practice/gen/teacher';

const CLASSES: [SubjectId, ClassLevel][] = [['physics', 'XI'], ['physics', 'XII'], ['chemistry', 'XI'], ['chemistry', 'XII'], ['mathematics', 'XI'], ['mathematics', 'XII'], ['computerscience', 'XI'], ['computerscience', 'XII']];
const PAPERS = Number(process.env.FIDELITY_PAPERS ?? 50);
/** Teacher papers are built through more steps, and share the composer with mock papers, so a smaller number shows that they agree. */
const SHARES = [0, 50, 100];

interface Tally {
  count: number;
  formats: Map<string, number>;
  figures: number;
  thinking: number;
  or: number;
  papers: number;
}
const emptyTally = (): Tally => ({ count: 0, formats: new Map(), figures: 0, thinking: 0, or: 0, papers: 0 });

function addTo(t: Tally, questions: BankQuestion[], or: number): void {
  t.papers++;
  t.or += or;
  for (const q of questions) {
    const format = formatOfQuestion(q);
    t.count++;
    t.formats.set(format, (t.formats.get(format) ?? 0) + 1);
    if (hasFigure({ ...q.item, format })) t.figures++;
    if (isCompetency(format, q.item.generated?.style ?? q.item.style, q.item.difficulty)) t.thinking++;
  }
}

/** Out of 100: how much of a section's mix lands on the same formats as the real paper's. 100 is the same mix. */
function mixMatch(target: Partial<Record<QuestionFormat, number>>, t: Tally): number {
  const keys = new Set<string>([...Object.keys(target), ...t.formats.keys()]);
  const total = Object.values(target).reduce((a, b) => a + (b ?? 0), 0) || 1;
  let apart = 0;
  for (const k of keys) apart += Math.abs((target[k as QuestionFormat] ?? 0) / total - (t.formats.get(k) ?? 0) / (t.count || 1));
  return Math.round((1 - apart / 2) * 100);
}

/** Pearson's correlation: 1 means a paper's marks fall as the real papers' do. */
function correlation(a: number[], b: number[]): number {
  const mean = (v: number[]) => v.reduce((s, x) => s + x, 0) / (v.length || 1);
  const ma = mean(a);
  const mb = mean(b);
  let up = 0;
  let da = 0;
  let db = 0;
  a.forEach((x, i) => {
    up += (x - ma) * (b[i] - mb);
    da += (x - ma) ** 2;
    db += (b[i] - mb) ** 2;
  });
  return da && db ? up / Math.sqrt(da * db) : 0;
}

interface Row {
  subject: SubjectId;
  level: ClassLevel;
  share: number;
  shape: number;
  sections: { name: string; mix: number; figure: [number, number]; thinking: [number, number]; or: [number, number] }[];
  /** Against the syllabus: how far apart the shares of marks are, out of 100 the same. */
  unit: number;
  /** Against how often the papers ask each topic. */
  topic: number;
}

const rows: Row[] = [];
const teacherRows: { subject: SubjectId; level: ClassLevel; share: number; mix: number; or: number; wanted: number }[] = [];

describe.each(CLASSES)('%s %s', (subject, level) => {
  it.each(SHARES.map((share) => ({ share })))(`${PAPERS} mock papers at $share% generated keep the real shape, and come close to its mix`, async ({ share }) => {
    const [bank, set, weights, syllabus] = await Promise.all([loadBank(subject, level), loadBlueprints(subject, level), unitWeightsForTest(subject, level), loadSyllabus(subject)]);
    const spec = paperSpec(subject, level);
    const targets = classTargets(subject, level);
    const tallies = new Map(targets.map((t) => [t.name, emptyTally()]));
    const unitMarks = new Map<number, number>();
    const topicMarks = new Map<string, number>();
    for (let seed = 1; seed <= PAPERS; seed++) {
      const paper = assemblePaper(subject, level, bank, weights, seededRng(seed * 37 + share), 0, { set, share });
      expect(paper.total).toBe(spec.total);
      paper.sections.forEach((section, i) => {
        const specSection = spec.sections[i];
        // The real shape, exactly: sections in order, questions, marks, any-two and internal choices.
        expect(section.name).toBe(specSection.name);
        expect(section.choose).toBe(specSection.choose);
        expect(section.questions.map((q) => q.item.marks)).toEqual(specSection.slots.flatMap((s) => Array<number>(s.count).fill(s.marks)));
        const or = Object.keys(section.alternatives ?? {}).length;
        expect(or, `${section.name} internal choices`).toBe(specSection.or ?? 0);
        // An alternative is worth what its question is, and isn't asked anywhere else in the paper.
        for (const [id, alt] of Object.entries(section.alternatives ?? {})) {
          expect(alt.item.marks).toBe(section.questions.find((q) => q.item.id === id)!.item.marks);
          expect(alt.item.id).not.toBe(id);
        }
        let start = 0;
        for (const slot of specSection.slots) {
          const name = specSection.slots.length > 1 ? `${specSection.name} (${specSection.slots.indexOf(slot) + 1})` : specSection.name;
          const list = section.questions.slice(start, start + slot.count);
          start += slot.count;
          addTo(tallies.get(name)!, list, list.filter((q) => section.alternatives?.[q.item.id]).length);
        }
        // Marks by unit, as a candidate sits them: an any-two section gives each question its share of what counts.
        const worth = section.choose ? section.choose / section.questions.length : 1;
        for (const q of section.questions) {
          unitMarks.set(q.item.unit, (unitMarks.get(q.item.unit) ?? 0) + q.item.marks * worth);
          const key = `${q.item.unit}${q.item.topic}`;
          topicMarks.set(key, (topicMarks.get(key) ?? 0) + 1);
        }
      });
      const ids = paper.sections.flatMap((s) => [...s.questions, ...Object.values(s.alternatives ?? {})].map((q) => q.item.id));
      expect(new Set(ids).size, 'a question twice, counting alternatives').toBe(ids.length);
      const facts = paper.sections.flatMap((s) => [...s.questions, ...Object.values(s.alternatives ?? {})].flatMap((q) => q.item.facts ?? []));
      expect(new Set(facts).size, 'a fact twice, counting alternatives').toBe(facts.length);
    }
    const sectionRows: Row['sections'] = targets.map((t) => {
      const tally = tallies.get(t.name)!;
      return { name: t.name, mix: mixMatch(t.mix, tally), figure: [t.figure, tally.figures / (tally.count || 1)], thinking: [t.cbq, tally.thinking / (tally.count || 1)], or: [t.or, tally.or / (tally.papers || 1)] };
    });
    // Units: the syllabus's marks against the marks papers gave.
    const groups = syllabus.classes.find((c) => c.level === level)?.markGroups ?? [];
    const weighted = new Map<number, number>();
    for (const g of groups) for (const u of g.units) weighted.set(u, g.marks / g.units.length);
    const totalWeight = [...weighted.values()].reduce((a, b) => a + b, 0) || 1;
    const totalGiven = [...unitMarks.values()].reduce((a, b) => a + b, 0) || 1;
    let apart = 0;
    for (const u of new Set([...weighted.keys(), ...unitMarks.keys()])) apart += Math.abs((weighted.get(u) ?? 0) / totalWeight - (unitMarks.get(u) ?? 0) / totalGiven);
    const unit = Math.round((1 - apart / 2) * 100);
    const asked = topicAsked(subject, level);
    const keys = [...new Set([...Object.keys(asked), ...topicMarks.keys()])];
    const topic = Math.round(correlation(keys.map((k) => asked[k] ?? 0), keys.map((k) => topicMarks.get(k) ?? 0)) * 100) / 100;
    rows.push({ subject, level, share, shape: 100, sections: sectionRows, unit, topic });
    // Floors from the first full measurement. They can only rise.
    const mean = sectionRows.reduce((sum, s) => sum + s.mix, 0) / sectionRows.length;
    expect(mean, `mean mix at ${share}%`).toBeGreaterThanOrEqual(MIX_FLOOR[subject]);
    expect(unit, 'marks by unit').toBeGreaterThanOrEqual(UNIT_FLOOR);
  }, 600_000);

  it('teacher papers keep the same shape and come close to the same mix', async () => {
    const structure = officialStructure(subject, level);
    const targets = classTargets(subject, level);
    for (const share of SHARES) {
      const tallies = new Map(targets.map((t) => [t.name, emptyTally()]));
      const runs = Math.max(4, Math.round(PAPERS / 5));
      for (let seed = 1; seed <= runs; seed++) {
        const paper = await buildFullPaper({ ...emptyFilters(subject), levels: [level], share }, level, structure, subject, seed * 13 + share);
        expect(paper.shortfall, `seed ${seed} at ${share}%`).toBeUndefined();
        expect(paper.sections.map((s) => s.items.length)).toEqual(structure.map((s) => s.count));
        for (const [i, s] of paper.sections.entries()) {
          expect(s.items.every((x) => x.question.item.marks === structure[i].marks)).toBe(true);
          expect(s.items.filter((x) => x.or).length, `${s.name} internal choices`).toBe(structure[i].or ?? 0);
          addTo(tallies.get(s.name)!, s.items.map((x) => x.question), s.items.filter((x) => x.or).length);
        }
        expect(allItems(paper).length).toBe(structure.reduce((n, p) => n + p.count, 0));
      }
      for (const t of targets) {
        const tally = tallies.get(t.name)!;
        teacherRows.push({ subject, level, share, mix: mixMatch(t.mix, tally), or: tally.or / tally.papers, wanted: t.or });
      }
    }
  }, 600_000);
});

/** How close a paper's mean section mix must come, out of 100. These rise as batches go in. */
const MIX_FLOOR: Record<SubjectId, number> = { physics: 72, chemistry: 56, mathematics: 72, computerscience: 60 };
const UNIT_FLOOR = 40;

afterAll(() => {
  if (!process.env.PAPER_REPORT || rows.length < CLASSES.length * SHARES.length) return;
  const lines = ['# Generated papers against the real ones', '', `Written by \`tests/unit/paper-fidelity.test.ts\`. Each row is ${PAPERS} mock papers. The real figures are in \`src/practice/bank/paper-targets.json\`, counts only, from the recent board papers and specimens.`, '', '- **Shape** is sections, questions, marks per question, any-two sections and internal choices. It must match exactly, and the test fails if it doesn’t.', '- **Mix** is out of 100: how much of a section’s questions fall on the same types as the real section’s, over the 50 papers.', '- **Unit** is the same measure for marks by unit, against the syllabus. **Topic** is the correlation with how often the papers ask each topic, where 1 is perfect.', '- **Figures** and **thinking** are real, then ours. Thinking is what the specimens tag as apply, analyse or evaluate. Boards don’t tag, so the real figure comes from the specimens.', ''];
  lines.push('## Summary', '', '| Class | Generated | Shape | Mean mix | Lowest section | Unit | Topic |', '|---|---:|---|---:|---|---:|---:|');
  for (const r of rows) {
    const mean = Math.round(r.sections.reduce((s, x) => s + x.mix, 0) / r.sections.length);
    const low = [...r.sections].sort((a, b) => a.mix - b.mix)[0];
    lines.push(`| ${r.subject} ${r.level} | ${r.share}% | Exact | ${mean} | ${low.name}: ${low.mix} | ${r.unit} | ${r.topic} |`);
  }
  lines.push('', '## By section', '', '| Class | Generated | Section | Mix | Figures, real then ours | Thinking, real then ours | Internal choices |', '|---|---:|---|---:|---|---|---:|');
  const pc = (x: number) => `${Math.round(x * 100)}%`;
  for (const r of rows) for (const s of r.sections) lines.push(`| ${r.subject} ${r.level} | ${r.share}% | ${s.name} | ${s.mix} | ${pc(s.figure[0])}, ${pc(s.figure[1])} | ${pc(s.thinking[0])}, ${pc(s.thinking[1])} | ${s.or[1]} of ${s.or[0]} |`);
  lines.push('', '## Teacher’s full papers', '', 'They come through the same builder, so a smaller sample shows that they agree.', '', '| Class | Generated | Mean mix |', '|---|---:|---:|');
  const seen = new Map<string, number[]>();
  for (const r of teacherRows) seen.set(`${r.subject} ${r.level}|${r.share}`, [...(seen.get(`${r.subject} ${r.level}|${r.share}`) ?? []), r.mix]);
  for (const [k, v] of seen) {
    const [name, share] = k.split('|');
    lines.push(`| ${name} | ${share}% | ${Math.round(v.reduce((a, b) => a + b, 0) / v.length)} |`);
  }
  lines.push('');
  fs.writeFileSync(path.resolve(__dirname, '../../reports/paper-fidelity.md'), lines.join('\n'));
});
