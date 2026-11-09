// What the real papers look like, as counts only: the section shapes, the share of each kind of question, of figures and of
// competency-tagged questions, and how often each topic is asked. Reads the private analysis and writes
// src/practice/bank/paper-targets.json, which holds numbers and no wording, so it ships with the app and the test reads it.
//   node scripts/private/paper-structure.mjs
import fs from 'node:fs';

const { records } = JSON.parse(fs.readFileSync('data-private/question-analysis.json', 'utf8'));

/**
 * Which papers set the shape. Only recent ones of the current pattern: a shape from before 2025 would be out of date.
 * The two Mathematics specimens of the new pattern are one for each class: the 2026 one says Class XI, and the 2027 one, with no
 * class printed, is on calculus, vectors, linear programming and probability, so it is the Class XII paper.
 */
const SOURCES = {
  'physics XII': /^physics\/(board|specimen)\/202[5-7]\//,
  'chemistry XII': /^chemistry\/(board|specimen)\/202[5-7]\//,
  'mathematics XI': /^mathematics\/specimen\/2026\/2026-860-MATHEMATICS-SQP-AK-1$/,
  'mathematics XII': /^mathematics\/specimen\/2027\/2027-860-MATHEMATICS-SQP-AK-1$/,
  'computerscience XII': /^computer-science\/(board|specimen)\/202[5-7]\//,
};
/** The labelled specimens only cover one class of each. The syllabus gives both classes the same paper, so the other class uses them too. */
const SAME_AS = { 'physics XI': 'physics XII', 'chemistry XI': 'chemistry XII', 'computerscience XI': 'computerscience XII' };

const science = (b, c, or) => [
  { name: 'Section A', marks: 1, count: 14, or: 0, test: (x) => x.section === 'Section A' },
  { name: 'Section B', marks: 2, count: b, or, test: (x) => x.section === 'Section B' },
  { name: 'Section C', marks: 3, count: c, or, test: (x) => x.section === 'Section C' },
  { name: 'Section D', marks: 5, count: 3, or, test: (x) => x.section === 'Section D' },
];
const maths = [
  { name: 'Section A', marks: 1, count: 20, or: 0, test: (x) => x.section === 'Section A' },
  { name: 'Section B', marks: 2, count: 7, or: 3, test: (x) => x.section === 'Section B' },
  { name: 'Section C', marks: 3, count: 7, or: 3, test: (x) => x.section === 'Section C' },
  { name: 'Section D', marks: 5, count: 5, or: 3, test: (x) => x.section === 'Section D' },
];
// The analysis can't always see Computer Science's sections, but its questions always run in this order.
const cs = [
  { name: 'Part I (1)', marks: 1, count: 10, or: 0, test: (x) => x.q === 1 },
  { name: 'Part I (2)', marks: 2, count: 5, or: 0, test: (x) => x.q === 2 },
  { name: 'Part II, Section A', marks: 10, count: 3, or: 1, choose: 2, test: (x) => x.q >= 3 && x.q <= 5 },
  { name: 'Part II, Section B', marks: 10, count: 3, or: 0, choose: 2, test: (x) => x.q >= 6 && x.q <= 8 },
  { name: 'Part II, Section C', marks: 5, count: 3, or: 0, choose: 2, test: (x) => x.q >= 9 && x.q <= 11 },
];
const SHAPES = { 'physics XII': science(7, 9, 2), 'chemistry XII': science(10, 7, 2), 'mathematics XI': maths, 'mathematics XII': maths, 'computerscience XII': cs };

/** The analysis's kind of question, as the format the app files it under. */
function formatOf(x, marks) {
  switch (x.type) {
    case 'mcq':
    case 'assertion':
    case 'numerical':
    case 'reason':
    case 'distinguish':
    case 'match':
    case 'diagram':
    case 'program':
    case 'output':
    case 'derivation':
      return x.type;
    case 'proof':
      return 'derivation';
    case 'fill':
      return 'complete';
    case 'complete':
      return 'fill';
    case 'case':
      return 'cbq';
    case 'boolean':
      return 'convert';
    default:
      // Definitions, equations and short structures: a line at one mark, otherwise a short answer.
      return marks === 1 ? 'very-short' : 'short';
  }
}

const TOP = {};
const out = { made: 'scripts/private/paper-structure.mjs', classes: {} };
for (const [key, shape] of Object.entries(SHAPES)) {
  const [subject] = key.split(' ');
  const test = SOURCES[key];
  const here = records.filter((r) => test.test(r.source) && r.subject === subject && !r.alt);
  const papers = [...new Set(here.map((r) => r.source))];
  const sections = shape.map(({ test: inSection, ...rest }) => {
    const mix = {};
    let figure = 0;
    let cbq = 0;
    let used = 0;
    for (const paper of papers) {
      const parts = here.filter((r) => r.source === paper && inSection(r));
      if (!parts.length) continue;
      used++;
      // Section A's parts are the questions. In other sections a question's parts share its weight, so long ones don't count double.
      const isOneMark = rest.marks === 1;
      const groups = new Map();
      parts.forEach((p, i) => {
        const k = isOneMark ? i : p.q;
        groups.set(k, [...(groups.get(k) ?? []), p]);
      });
      const each = 1 / groups.size;
      for (const list of groups.values()) {
        for (const p of list) {
          const f = formatOf(p, rest.marks);
          mix[f] = (mix[f] ?? 0) + each / list.length;
        }
        if (list.some((p) => p.structure?.figure || p.type === 'diagram')) figure += each;
        if (list.some((p) => p.style === 'cbq')) cbq += each;
      }
    }
    const round = (v) => Math.round(v * 1000) / 1000;
    // A choice part inside a long question is that question's part, not a multiple choice question worth 5 marks.
    if (rest.marks > 1) {
      mix.short = (mix.short ?? 0) + (mix.mcq ?? 0) + (mix.assertion ?? 0);
      delete mix.mcq;
      delete mix.assertion;
    }
    // The analysis found a few words like "derive" in Computer Science, which has no derivations. See reports/derivations.md.
    if (subject === 'computerscience' && mix.derivation) {
      const to = rest.marks === 1 ? 'very-short' : 'short';
      mix[to] = (mix[to] ?? 0) + mix.derivation;
      delete mix.derivation;
    }
    // The paper's own instruction: in Section A, parts (i) to (xvii) are choices and (xviii) to (xx) are answered as instructed.
    // The analysis can't tell the last three from choices, as they're short calculations with no options in its text.
    if (subject === 'mathematics' && rest.marks === 1) {
      const taken = 3 / rest.count;
      mix.mcq -= taken;
      mix['very-short'] = taken;
    }
    // A question of five marks or more is a long answer to the app, whatever kinds of part it's made of, unless it's mainly a
    // numerical, a derivation or a program. Computer Science's ten-mark Boolean question is one too, as it runs to several parts.
    if (rest.marks >= 5) {
      for (const f of ['short', 'very-short', 'reason', 'distinguish', 'complete', 'match', 'cbq', 'fill', 'output', 'convert']) {
        if (mix[f]) mix.long = (mix.long ?? 0) + mix[f];
        delete mix[f];
      }
    }
    return {
      ...rest,
      mix: Object.fromEntries(Object.entries(mix).filter(([, v]) => v / used >= 0.015).sort((a, b) => b[1] - a[1]).map(([f, v]) => [f, round(v / used)])),
      figure: round(figure / used),
      // Boards print no competency tags, so the share comes from the papers that do.
      cbq: round(cbq / used),
      papers: used,
    };
  });
  // Tags are only printed on specimens, so that share is measured on them alone.
  const specimens = papers.filter((p) => p.includes('/specimen/'));
  sections.forEach((s, i) => {
    let tagged = 0;
    let used = 0;
    for (const paper of specimens) {
      const parts = here.filter((r) => r.source === paper && shape[i].test(r));
      if (!parts.length) continue;
      used++;
      const groups = new Map();
      parts.forEach((p, j) => groups.set(s.marks === 1 ? j : p.q, [...(groups.get(s.marks === 1 ? j : p.q) ?? []), p]));
      // The specimens tag almost every part with a level of thinking. "Competency" here means applying, analysing or evaluating, not recall.
      for (const list of groups.values()) if (list.some((p) => /\((Apply|Application|Analyse|Analyze|Analysis|Evaluate|Create)\)/i.test(p.text ?? '') || p.type === 'case')) tagged += 1 / groups.size;
    }
    s.cbq = used ? Math.round((tagged / used) * 1000) / 1000 : 0;
  });
  out.classes[key] = { papers: papers.length, sections };
}
for (const [key, from] of Object.entries(SAME_AS)) out.classes[key] = { ...out.classes[from], sameAs: from };

// How often each topic is asked, from the same analysis as reports/question-analysis.md.
for (const r of records) {
  if (r.unit == null || !r.topic || r.outOfSyllabus) continue;
  const key = `${r.subject} ${r.level}`;
  const topic = `${r.unit}${r.topic}`;
  TOP[key] ??= {};
  TOP[key][topic] = (TOP[key][topic] ?? 0) + 1;
}
out.topicAsked = TOP;
fs.writeFileSync('src/practice/bank/paper-targets.json', `${JSON.stringify(out, null, 1)}\n`);
for (const [key, c] of Object.entries(out.classes)) {
  console.log(`\n${key} (${c.papers} papers${c.sameAs ? `, as ${c.sameAs}` : ''})`);
  for (const s of c.sections) console.log(`  ${s.name}: ${s.count}x${s.marks} or${s.or} fig ${s.figure} cbq ${s.cbq} [${s.papers}] ${JSON.stringify(s.mix)}`);
}
