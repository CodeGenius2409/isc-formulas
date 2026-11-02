// Second half of `npm run data`. Takes the deduplicated data from migrate-data.mjs, maps every
// entry to the 2028 syllabus, classifies it, restructures the book to the official units, and
// moves what isn't needed to archive/removed-formulas.json. Writes the reports as well.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as physics from './syllabus/physics.mjs';
import * as chemistry from './syllabus/chemistry.mjs';
import * as mathematics from './syllabus/mathematics.mjs';
import * as computerscience from './syllabus/computerscience.mjs';
import { writeSyllabusReport, writeSyllabusReview } from './syllabus/reports.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const genDir = path.join(root, 'src/data/generated');
const syllabusDir = path.join(root, 'src/data/syllabus');
const readGen = (file) => JSON.parse(fs.readFileSync(path.join(genDir, file), 'utf8'));
const writeGen = (file, value) => fs.writeFileSync(path.join(genDir, file), JSON.stringify(value));

const PLANS = { physics, chemistry, mathematics, computerscience };
const manifest = readGen('manifest.json');
const shared = readGen('shared.json');
const aliases = readGen('idAliases.json');
const syllabus = Object.fromEntries(Object.keys(PLANS).map((s) => [s, JSON.parse(fs.readFileSync(path.join(syllabusDir, `${s}.json`), 'utf8'))]));

/* Evidence from the papers. The papers stay private, so only yes-or-no flags are committed. */
const FLAGS = path.join(root, 'scripts/syllabus/paper-flags.json');
const PRIVATE = path.join(root, 'data-private/paper-evidence.json');
let flags;
if (fs.existsSync(PRIVATE)) {
  const counts = JSON.parse(fs.readFileSync(PRIVATE, 'utf8'));
  flags = Object.fromEntries(Object.entries(counts).filter(([, c]) => c.recent || c.older).map(([id, c]) => [id, c.recent ? 'r' : 'o']));
  fs.writeFileSync(FLAGS, JSON.stringify(flags));
} else {
  flags = JSON.parse(fs.readFileSync(FLAGS, 'utf8'));
}

/* Formulas the solver can already calculate count as core. */
const registryDir = path.join(root, 'src/solver/registry');
const solvable = new Set();
for (const file of fs.readdirSync(registryDir)) {
  for (const m of fs.readFileSync(path.join(registryDir, file), 'utf8').matchAll(/['"`]((?:cs|p|c|m)-(?:xi|xii)-[\w-]+)['"`]/g)) solvable.add(m[1]);
}

const unitNumber = (name) => Number(/^(\d+)\./.exec(name)?.[1] ?? 0);

/** The first list in each old unit was the app's original hand-picked set of main formulas. */
const firstSubs = new Set();
for (const subj of manifest.subjects) {
  for (const cls of subj.classes) {
    for (const unit of cls.units) if (unit.subtopics[0]) firstSubs.add(`${subj.id}|${cls.level}|${unitNumber(unit.name)}|${unit.subtopics[0].name}`);
  }
}

function matches(rule, level, legacyUnit, sub, name) {
  if (rule.level && rule.level !== level) return false;
  if (rule.unit !== undefined && rule.unit !== legacyUnit) return false;
  if (rule.sub !== undefined && !(rule.sub instanceof RegExp ? rule.sub.test(sub) : rule.sub === sub)) return false;
  if (rule.name && !rule.name.test(name)) return false;
  return true;
}

/** Decides one placement of one entry. */
function classify(subject, level, legacyUnit, sub, entry) {
  const plan = PLANS[subject];
  const rule = plan.rules.find((r) => matches(r, level, legacyUnit, sub, entry.name));
  const seen = flags[entry.id];
  if (rule) {
    if (rule.force) return { verdict: rule.verdict, reason: rule.reason, ref: rule.ref };
    if (rule.verdict === 'out' && seen) {
      const when = seen === 'r' ? 'in papers from 2023 onward' : 'only in papers before 2023';
      return { verdict: 'review', reason: `${rule.reason} But its name appears ${when}. Remove it, or keep it?`, ref: rule.ref };
    }
    // A paper outranks a judgement that something is not worth keeping.
    if (rule.verdict === 'not-needed' && seen) return { verdict: 'core' };
    if (rule.verdict !== 'core' && rule.verdict !== 'supporting') return { verdict: rule.verdict, reason: rule.reason, ref: rule.ref };
    return { verdict: rule.verdict };
  }
  if (seen || solvable.has(entry.id) || firstSubs.has(`${subject}|${level}|${legacyUnit}|${sub}`)) return { verdict: 'core' };
  if (plan.supportingSubs.has(sub)) return { verdict: 'supporting' };
  // Chemistry's and Computer Science's lists follow what the syllabus names one by one.
  // Physics and Maths have long tails of results derived from a few central formulas.
  return { verdict: subject === 'chemistry' || subject === 'computerscience' ? 'core' : 'supporting' };
}

function target(subject, level, legacyUnit, sub) {
  const m = PLANS[subject].map[level]?.[legacyUnit];
  if (!m) throw new Error(`No mapping for ${subject} ${level} unit ${legacyUnit}`);
  const o = m.sub[sub];
  if (Array.isArray(o)) return { unit: o[0], topic: o[1] };
  return { unit: m.unit, topic: o ?? m.topic };
}

const removedPlacements = new Map(); // id -> rows
const keptPlacements = new Map(); // id -> rows
const reviewItems = new Map(); // id -> { entry, reason, ... }
const tiers = new Map(); // id -> best tier
const topicsOf = new Map();
const before = {};
const out = {};

const topicId = (subject, level, unit, key) => `${subject[0]}.${level}.${unit}.${key}`;

for (const subj of manifest.subjects) {
  out[subj.id] = {};
  before[subj.id] = new Set();
  for (const cls of subj.classes) {
    const chunk = readGen(cls.chunk);
    const buckets = new Map();
    for (const u of syllabus[subj.id].classes.find((c) => c.level === cls.level).units) buckets.set(u.number, { def: u, subs: new Map() });

    for (const unit of chunk.units) {
      const legacyUnit = unitNumber(unit.name);
      for (const sub of unit.subtopics) {
        const t = target(subj.id, cls.level, legacyUnit, sub.name);
        const bucket = buckets.get(t.unit);
        if (!bucket) throw new Error(`${subj.id} ${cls.level}: official unit ${t.unit} does not exist`);
        if (!bucket.def.topics.some((x) => x.key === t.topic)) throw new Error(`${subj.id} ${cls.level} ${t.unit}: no topic ${t.topic}, for "${sub.name}"`);
        for (const item of sub.items) {
          const entry = item.ref ? shared[item.ref] : item;
          before[subj.id].add(entry.id);
          const result = classify(subj.id, cls.level, legacyUnit, sub.name, entry);
          const row = { subject: subj.id, classLevel: cls.level, unit: unit.name, subtopic: sub.name, officialUnit: t.unit, topic: t.topic };
          if (result.verdict === 'out' || result.verdict === 'not-needed') {
            (removedPlacements.get(entry.id) ?? removedPlacements.set(entry.id, []).get(entry.id)).push({ ...row, ...result, entry });
            continue;
          }
          (keptPlacements.get(entry.id) ?? keptPlacements.set(entry.id, []).get(entry.id)).push(row);
          if (result.verdict === 'review') reviewItems.set(entry.id, { entry, ...row, reason: result.reason, ref: result.ref });
          const tier = result.verdict === 'core' ? 'core' : 'supporting';
          if (tier === 'core' || !tiers.has(entry.id)) tiers.set(entry.id, tier);
          const tid = topicId(subj.id, cls.level, t.unit, t.topic);
          (topicsOf.get(entry.id) ?? topicsOf.set(entry.id, new Set()).get(entry.id)).add(tid);
          const key = `${t.topic}|${sub.name}`;
          const dest = bucket.subs.get(key) ?? bucket.subs.set(key, { name: sub.name, topic: t.topic, items: [], seen: new Set() }).get(key);
          if (!dest.seen.has(entry.id)) {
            dest.seen.add(entry.id);
            dest.items.push(item);
          }
        }
      }
    }
    out[subj.id][cls.level] = buckets;
  }
}

/* Whole-entry outcome: an entry survives if any of its placements does. */
const archived = [];
for (const [id, rows] of removedPlacements) {
  if (keptPlacements.has(id)) continue;
  const first = rows[0];
  archived.push({
    id,
    name: first.entry.name,
    latex: first.entry.latex,
    note: first.entry.note,
    aka: first.entry.aka,
    subject: first.subject,
    classLevel: first.classLevel,
    unit: first.unit,
    subtopic: first.subtopic,
    verdict: first.verdict,
    reason: first.reason,
    syllabusReference: first.ref ?? null,
  });
}
archived.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));

/* Rewrite shared entries. One left with a single placement goes back into its chunk. */
const unitLabel = (number, name) => `${number}. ${name}`;
const newShared = {};
const officialName = (subject, level, number) => unitLabel(number, syllabus[subject].classes.find((c) => c.level === level).units.find((u) => u.number === number).name);
const inlined = new Set();
for (const [id, entry] of Object.entries(shared)) {
  const rows = keptPlacements.get(id);
  if (!rows) continue;
  const placements = [];
  const seen = new Set();
  for (const r of rows) {
    const unit = officialName(r.subject, r.classLevel, r.officialUnit);
    const key = `${r.subject}|${r.classLevel}|${unit}`;
    if (seen.has(key)) continue;
    seen.add(key);
    placements.push({ subject: r.subject, classLevel: r.classLevel, unit, subtopic: r.subtopic });
  }
  if (placements.length > 1) newShared[id] = { ...entry, subjects: [...new Set(placements.map((p) => p.subject))], placements };
  else inlined.add(id);
}

/* Write the chunks and the manifest. */
const newManifest = { generatedFrom: manifest.generatedFrom, syllabus: Object.fromEntries(Object.entries(syllabus).map(([k, v]) => [k, v.edition])), subjects: [], totals: {} };
const prune = (entry) => {
  const copy = { ...entry };
  delete copy.subjects;
  delete copy.placements;
  return copy;
};
for (const subj of manifest.subjects) {
  const sm = { id: subj.id, label: subj.label, code: subj.code, classes: [] };
  for (const cls of subj.classes) {
    const units = [];
    const unitManifest = [];
    let classCount = 0;
    for (const [number, bucket] of [...out[subj.id][cls.level]].sort((a, b) => a[0] - b[0])) {
      const order = new Map(bucket.def.topics.map((t, i) => [t.key, i]));
      const subs = [...bucket.subs.values()].sort((a, b) => order.get(a.topic) - order.get(b.topic));
      const subtopics = [];
      const subManifest = [];
      let unitCount = 0;
      for (const s of subs) {
        if (!s.items.length) continue;
        const items = s.items.map((item) => {
          const id = item.ref ?? item.id;
          const stored = inlined.has(id) ? prune(shared[id]) : item;
          if ('ref' in stored) return stored;
          return tiers.get(id) === 'supporting' ? { ...stored, tier: 'supporting' } : stored;
        });
        subtopics.push({ name: s.name, topic: s.topic, items });
        subManifest.push({ name: s.name, count: items.length, topic: s.topic });
        unitCount += items.length;
      }
      // A unit with no formulas (such as CS "Trends in computing") stays in the syllabus map only.
      if (!subtopics.length) continue;
      const name = unitLabel(number, bucket.def.name);
      units.push({ name, number, subtopics });
      unitManifest.push({ name, status: bucket.def.practical ? 'practical' : 'syllabus', count: unitCount, subtopics: subManifest });
      classCount += unitCount;
    }
    writeGen(cls.chunk, { subject: subj.id, classLevel: cls.level, units });
    sm.classes.push({ level: cls.level, chunk: cls.chunk, count: classCount, units: unitManifest });
  }
  newManifest.subjects.push(sm);
}

/* Aliases: a removed id maps to null, and anything merged into it follows. */
const removedIds = new Set(archived.map((e) => e.id));
const newAliases = {};
for (const [from, to] of Object.entries(aliases)) newAliases[from] = removedIds.has(to) ? null : to;
for (const id of removedIds) newAliases[id] = null;

const kept = keptPlacements.size;
const legacy = manifest.totals.legacy;
const merged = manifest.totals.removed;
newManifest.totals = { legacy, merged, archived: archived.length, entries: kept, shared: Object.keys(newShared).length };

writeGen('shared.json', newShared);
writeGen('manifest.json', newManifest);
writeGen('idAliases.json', newAliases);

fs.mkdirSync(path.join(root, 'archive'), { recursive: true });
fs.writeFileSync(path.join(root, 'archive/removed-formulas.json'), `${JSON.stringify(archived, null, 1)}\n`);
const classification = {};
for (const [id] of keptPlacements) classification[id] = { verdict: reviewItems.has(id) ? 'review' : tiers.get(id), topics: [...topicsOf.get(id)] };
for (const e of archived) classification[e.id] = { verdict: e.verdict };
fs.writeFileSync(path.join(root, 'archive/classification.json'), `${JSON.stringify(classification)}\n`);

const reports = path.join(root, 'reports');
writeSyllabusReport(path.join(reports, 'syllabus-report.md'), { before, archived, classification, manifest: newManifest, reviewItems });
writeSyllabusReview(path.join(reports, 'syllabus-review.md'), { reviewItems });

const counts = {};
for (const c of Object.values(classification)) counts[c.verdict] = (counts[c.verdict] ?? 0) + 1;
console.log('Classification', counts);
console.log(`Reconciliation: ${legacy} legacy - ${merged} merged - ${archived.length} archived = ${kept}`);
if (legacy - merged - archived.length !== kept) {
  console.error('Reconciliation failed');
  process.exit(1);
}
