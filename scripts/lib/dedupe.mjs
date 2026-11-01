// Pure dedupe logic, shared by the migration script and its tests.
import fs from 'node:fs';
import vm from 'node:vm';
import { normalizeLatex, sideInsensitive } from './normalize-latex.mjs';

/** Evaluates the FORMULAS block of legacy/script.js and returns the object. */
export function loadLegacyFormulas(path) {
  const src = fs.readFileSync(path, 'utf8');
  const start = src.indexOf('const FORMULAS');
  const end = src.indexOf('STATE & HELPERS');
  if (start < 0 || end < 0) throw new Error('Could not find the FORMULAS block in legacy/script.js');
  const block = src.slice(start, src.lastIndexOf('/*', end)).replace('const FORMULAS', 'FORMULAS');
  const ctx = {};
  vm.runInNewContext(block, ctx);
  return ctx.FORMULAS;
}

/** Flattens the nested object into syllabus-ordered rows. */
export function flatten(formulas) {
  const rows = [];
  for (const [subject, subj] of Object.entries(formulas)) {
    for (const cls of ['XI', 'XII']) {
      if (!subj[cls]) continue;
      for (const [unit, subtopics] of Object.entries(subj[cls])) {
        for (const [subtopic, list] of Object.entries(subtopics)) {
          list.forEach((f) => rows.push({ ...f, subject, cls, unit, subtopic, order: rows.length }));
        }
      }
    }
  }
  return rows;
}

function pairKey(a, b) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/**
 * Groups rows into canonical entries.
 *  - Automatic: normalised LaTeX is equal, ignoring the order of `=` sides.
 *    A group containing a REVIEW pair is left alone.
 *  - Curated: every MERGE list, with its first id as the canonical entry.
 */
export function buildGroups(rows, { MERGE, REVIEW }) {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const parent = new Map(rows.map((r) => [r.id, r.id]));
  const find = (x) => {
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)));
      x = parent.get(x);
    }
    return x;
  };
  const union = (a, b) => parent.set(find(a), find(b));

  const blocked = new Set();
  for (const { ids } of REVIEW) {
    for (const a of ids) {
      if (!byId.has(a)) throw new Error(`REVIEW names an unknown id: ${a}`);
      for (const b of ids) if (a !== b) blocked.add(pairKey(a, b));
    }
  }

  const reason = new Map();
  const auto = new Map();
  for (const r of rows) {
    const key = sideInsensitive(normalizeLatex(r.latex));
    (auto.get(key) ?? auto.set(key, []).get(key)).push(r);
  }
  for (const group of auto.values()) {
    if (group.length < 2) continue;
    const hasBlock = group.some((a) => group.some((b) => a !== b && blocked.has(pairKey(a.id, b.id))));
    if (hasBlock) continue;
    const exact = new Set(group.map((r) => r.latex)).size === 1;
    for (const r of group.slice(1)) {
      union(r.id, group[0].id);
      reason.set(r.id, exact ? 'Identical LaTeX' : 'Same LaTeX after normalising spacing and notation');
    }
  }

  const preferred = new Map();
  for (const list of MERGE) {
    for (const id of list) if (!byId.has(id)) throw new Error(`MERGE names an unknown id: ${id}`);
    for (const id of list.slice(1)) {
      union(id, list[0]);
      if (!reason.has(id)) reason.set(id, 'Same meaning, inspected by hand');
    }
    preferred.set(list[0], true);
  }

  const buckets = new Map();
  for (const r of rows) {
    const root = find(r.id);
    (buckets.get(root) ?? buckets.set(root, []).get(root)).push(r);
  }

  const groups = [];
  for (const members of buckets.values()) {
    for (const a of members) {
      for (const b of members) {
        if (a !== b && blocked.has(pairKey(a.id, b.id))) {
          throw new Error(`Review pair ${a.id} / ${b.id} ended up merged. Fix dedupe-decisions.mjs.`);
        }
      }
    }
    const curated = members.find((m) => preferred.has(m.id));
    const canonical = curated ?? members[0];
    groups.push({ canonical, members, reason });
  }
  groups.sort((a, b) => a.members[0].order - b.members[0].order);
  return { groups, reason };
}

/** The longest note wins. A merged entry also keeps its old names as `aka`. */
export function resolveEntry(group) {
  const { canonical, members } = group;
  const note = members.map((m) => m.note ?? '').reduce((best, n) => (n.length > best.length ? n : best), '');
  const seen = new Set([canonical.name.trim().toLowerCase()]);
  const aka = [];
  for (const m of members) {
    const key = m.name.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      aka.push(m.name);
    }
  }
  const entry = { id: canonical.id, name: canonical.name, latex: canonical.latex };
  if (note) entry.note = note;
  if (aka.length) entry.aka = aka;
  return entry;
}

/**
 * Where a merged entry still shows. A repeat in a different unit stays visible
 * there, so each unit's tables stay complete. A repeat inside the same unit
 * collapses to its first position.
 */
export function resolvePlacements(group) {
  const seen = new Set();
  const placements = [];
  for (const m of group.members) {
    const key = `${m.subject}|${m.cls}|${m.unit}`;
    if (seen.has(key)) continue;
    seen.add(key);
    placements.push({ subject: m.subject, classLevel: m.cls, unit: m.unit, subtopic: m.subtopic, order: m.order });
  }
  return placements;
}

export function unitStatus(unit) {
  if (/not in 2028 syllabus/i.test(unit)) return 'not-in-syllabus';
  if (/supplementary/i.test(unit)) return 'supplementary';
  return 'syllabus';
}
