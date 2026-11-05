// Step B's measure: for every analysed question, is there a blueprint of the same kind, in the same place in the syllabus?
// Reads two private files: data-private/question-analysis.json, and data-private/blueprint-tags.json, which
// `npm run blueprint-tags` writes. Writes data-private/blueprint-coverage.json, which holds counts and paper references.
import fs from 'node:fs';

const { records } = JSON.parse(fs.readFileSync('data-private/question-analysis.json', 'utf8'));
const blueprints = JSON.parse(fs.readFileSync('data-private/blueprint-tags.json', 'utf8'));

/** What counts as the same kind of question. */
const SAME_KIND = {
  mcq: (b) => b.format === 'mcq' && b.type !== 'assertion',
  assertion: (b) => b.type === 'assertion',
  // A "find" in Mathematics is the same kind of question whether it's marked by a number or by the working.
  numerical: (b) => b.type === 'numerical' || (b.subject === 'mathematics' && b.type === 'short'),
  // In Computer Science a short answer is often a worked result, like a traversal or a conversion.
  short: (b) => b.format === 'short' || b.format === 'very-short' || b.type === 'short' || (b.subject === 'computerscience' && (b.type === 'numerical' || b.type === 'output')),
  definition: (b) => b.type === 'definition',
  reason: (b) => b.type === 'reason',
  // Boolean algebra is a topic in itself: its truth tables, simplifications and maps have their own blueprints there.
  boolean: (b) => b.id.includes('bool') || b.id.includes('kmap') || b.id.includes('truth') || b.id.includes('sop') || b.id.includes('pos') || b.id.includes('gate') || b.id.includes('dual') || b.id.includes('demorgan') || b.id.includes('prime') || b.id.includes('canonical') || b.id.includes('minterm') || b.id.includes('maxterm') || b.id.includes('simplif') || b.id.includes('logic') || b.id.includes('adder') || b.id.includes('propos') || b.id.includes('contra') || b.id.includes('tautology'),
  reaction: (b) => b.type === 'reaction',
  program: (b) => b.type === 'program',
  proof: (b) => b.type === 'proof' || b.type === 'derivation',
  derivation: (b) => b.type === 'derivation' || b.type === 'proof',
  diagram: (b) => b.format === 'diagram' || Boolean(b.diagram),
  distinguish: (b) => b.type === 'distinguish',
  fill: (b) => b.type === 'fill' || b.format === 'very-short',
  structure: (b) => b.type === 'structure',
  output: (b) => b.type === 'output',
  complete: (b) => b.type === 'complete',
  match: (b) => b.type === 'match' || b.id.includes('-match'),
  case: (b) => b.format === 'cbq',
};

const key = (...parts) => parts.join('|');

const byTopic = new Map();
const byUnit = new Map();
const bySubject = new Map();
const push = (map, k, b) => map.set(k, [...(map.get(k) ?? []), b]);
for (const b of blueprints) {
  push(byTopic, key(b.subject, b.level, b.unit, b.topic), b);
  push(byUnit, key(b.subject, b.level, b.unit), b);
  push(bySubject, key(b.subject, b.level), b);
}

const empty = () => ({ total: 0, topic: 0, unit: 0, subject: 0, none: 0, untagged: 0, outOfSyllabus: 0 });
const totals = { all: empty(), subject: {}, type: {}, style: {}, source: {} };
const gaps = new Map();
const uncovered = new Map();

for (const r of records) {
  const same = SAME_KIND[r.type];
  const tallies = [totals.all, (totals.subject[r.subject] ??= empty()), (totals.type[r.type] ??= empty()), (totals.style[r.style] ??= empty()), (totals.source[r.paperType] ??= empty())];
  // On a topic the 2028 syllabus doesn't have: counted on its own, and left out of the coverage figures.
  if (r.outOfSyllabus) {
    for (const t of tallies) t.outOfSyllabus++;
    continue;
  }
  const inTopic = r.topic ? (byTopic.get(key(r.subject, r.level, r.unit, r.topic)) ?? []).filter(same) : [];
  const inUnit = r.unit ? (byUnit.get(key(r.subject, r.level, r.unit)) ?? []).filter(same) : [];
  const inSubject = (bySubject.get(key(r.subject, r.level)) ?? []).filter(same);
  const level = inTopic.length ? 'topic' : inUnit.length ? 'unit' : inSubject.length ? 'subject' : 'none';
  for (const t of tallies) {
    t.total++;
    t[level]++;
    if (!r.topic) t.untagged++;
  }
  if (level !== 'topic' && r.topic) {
    const k = key(r.subject, r.level, r.unit, r.topic, r.topicName, r.type);
    gaps.set(k, (gaps.get(k) ?? 0) + 1);
  }
  if (level === 'none') {
    const k = key(r.subject, r.level, r.type);
    uncovered.set(k, (uncovered.get(k) ?? 0) + 1);
  }
}

const list = (map) => [...map].sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ what: k.split('|'), n }));
const out = { totals, gaps: list(gaps), uncovered: list(uncovered), blueprints: blueprints.length };
fs.writeFileSync('data-private/blueprint-coverage.json', JSON.stringify(out, null, 1));

const pct = (t, k) => `${((100 * t[k]) / t.total).toFixed(1)}%`;
const line = (name, t) => `${name.padEnd(18)} ${String(t.total).padStart(5)}  topic ${pct(t, 'topic').padStart(6)}  unit ${pct(t, 'unit').padStart(6)}  subject ${pct(t, 'subject').padStart(6)}  none ${pct(t, 'none').padStart(6)}`;
console.log(line('all', totals.all));
for (const [group, values] of Object.entries(totals)) {
  if (group === 'all') continue;
  console.log(`-- ${group}`);
  for (const [name, t] of Object.entries(values)) console.log(line(name, t));
}
console.log(`-- ${gaps.size} gaps at topic level, ${uncovered.size} kinds with no blueprint at all`);
if (process.argv.includes('--list')) for (const g of out.gaps.slice(0, Number(process.argv[process.argv.indexOf('--list') + 1]) || 60)) console.log(g.n, g.what.join(' / '));
for (const g of out.uncovered) console.log('NONE', g.n, g.what.join(' / '));
