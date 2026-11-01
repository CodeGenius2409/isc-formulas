// Converts legacy/script.js into per-subject, per-class JSON under
// src/data/generated, plus idAliases.json and the two dedupe reports.
// Run with: npm run data
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MERGE, REVIEW, DISTINCT_REASONS } from './dedupe-decisions.mjs';
import { loadLegacyFormulas, flatten, buildGroups, resolveEntry, resolvePlacements, unitStatus } from './lib/dedupe.mjs';
import { writeDedupeReport, writeReviewReport } from './lib/report.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'src/data/generated');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const legacy = loadLegacyFormulas(path.join(root, 'legacy/script.js'));
const rows = flatten(legacy);
const { groups, reason } = buildGroups(rows, { MERGE, REVIEW });

const aliases = {};
const entryOf = new Map();
const placementsOf = new Map();
const shared = {};
const groupOfRow = new Map();

for (const group of groups) {
  const entry = resolveEntry(group);
  const placements = resolvePlacements(group);
  entryOf.set(entry.id, entry);
  placementsOf.set(entry.id, placements);
  for (const m of group.members) {
    groupOfRow.set(m.id, entry.id);
    if (m.id !== entry.id) aliases[m.id] = entry.id;
  }
  if (placements.length > 1) {
    const subjects = [...new Set(placements.map((p) => p.subject))];
    shared[entry.id] = {
      ...entry,
      subjects,
      placements: placements.map(({ subject, classLevel, unit, subtopic }) => ({ subject, classLevel, unit, subtopic })),
    };
  }
}

const SUBJECT_ORDER = Object.keys(legacy);
const manifest = { generatedFrom: 'legacy/script.js', subjects: [], totals: {} };
const placedKeys = new Set();
const chunkSizes = {};

for (const subject of SUBJECT_ORDER) {
  const subj = legacy[subject];
  const subjectManifest = { id: subject, label: subj.label, code: subj.code, classes: [] };
  for (const classLevel of ['XI', 'XII']) {
    if (!subj[classLevel]) continue;
    const units = [];
    const unitManifest = [];
    let classCount = 0;
    for (const unitName of Object.keys(subj[classLevel])) {
      const subtopics = [];
      const subtopicManifest = [];
      let unitCount = 0;
      for (const subtopicName of Object.keys(subj[classLevel][unitName])) {
        const items = [];
        for (const f of subj[classLevel][unitName][subtopicName]) {
          const canonicalId = groupOfRow.get(f.id);
          const key = `${subject}|${classLevel}|${unitName}|${canonicalId}`;
          // A merged entry appears once per unit, at its first position there.
          if (placedKeys.has(key)) continue;
          placedKeys.add(key);
          items.push(shared[canonicalId] ? { ref: canonicalId } : entryOf.get(canonicalId));
        }
        if (!items.length) continue;
        subtopics.push({ name: subtopicName, items });
        subtopicManifest.push({ name: subtopicName, count: items.length });
        unitCount += items.length;
      }
      units.push({ name: unitName, subtopics });
      unitManifest.push({ name: unitName, status: unitStatus(unitName), count: unitCount, subtopics: subtopicManifest });
      classCount += unitCount;
    }
    const file = `${subject}-${classLevel}.json`;
    const json = JSON.stringify({ subject, classLevel, units });
    fs.writeFileSync(path.join(outDir, file), json);
    chunkSizes[file] = json.length;
    subjectManifest.classes.push({ level: classLevel, chunk: file, count: classCount, units: unitManifest });
  }
  manifest.subjects.push(subjectManifest);
}

const removed = rows.length - groups.length;
manifest.totals = { legacy: rows.length, removed, entries: groups.length, shared: Object.keys(shared).length };
fs.writeFileSync(path.join(outDir, 'shared.json'), JSON.stringify(shared));
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest));
fs.writeFileSync(path.join(outDir, 'idAliases.json'), JSON.stringify(aliases, null, 0));

const reportsDir = path.join(root, 'reports');
fs.mkdirSync(reportsDir, { recursive: true });
writeDedupeReport(path.join(reportsDir, 'dedupe-report.md'), { rows, groups, reason, shared, placementsOf, entryOf, aliases, reviewCount: REVIEW.length, distinctReasons: DISTINCT_REASONS, merge: MERGE });
writeReviewReport(path.join(reportsDir, 'dedupe-review.md'), { rows, review: REVIEW });

console.log(`Legacy formulas      ${rows.length}`);
console.log(`Removed as repeats   ${removed}`);
console.log(`Entries now stored   ${groups.length}`);
console.log(`Shown in >1 unit     ${Object.keys(shared).length}`);
console.log(`Left for your review ${REVIEW.length} groups`);
if (rows.length - removed !== groups.length || Object.keys(aliases).length !== removed) {
  console.error('Reconciliation failed');
  process.exit(1);
}
console.log('Chunks (bytes):', chunkSizes, 'shared', JSON.stringify(shared).length);
