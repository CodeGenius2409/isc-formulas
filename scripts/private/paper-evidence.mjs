// For every formula, counts where its name appears in the subject's papers, split into
// recent papers (2023 on, close to the 2028 syllabus) and older ones. Writes
// data-private/paper-evidence.json. Only the counts ever leave the private folder.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const SUBJECT_DIR = { physics: 'physics', chemistry: 'chemistry', mathematics: 'mathematics', computerscience: 'computer-science' };

const index = JSON.parse(readFileSync('data-private/papers-index.json', 'utf8'));

// OCR every scan once.
for (const row of index) {
  if (row.readable === 'text') continue;
  const out = join('data-private/ocr', row.subject, row.type, `${row.name.replace(/[^\w.-]+/g, '_')}.txt`);
  row.ocr = out.replace(/\\/g, '/');
  if (existsSync(out)) continue;
  mkdirSync(dirname(out), { recursive: true });
  const run = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 'scripts/private/ocr-scans.ps1', join('papers', row.file), out], { encoding: 'utf8' });
  console.log(row.name.slice(0, 50), (run.stdout ?? '').trim().slice(0, 40), (run.stderr ?? '').slice(0, 120));
}
writeFileSync('data-private/papers-index.json', JSON.stringify(index, null, 1));

const normalise = (s) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9αβγδθλμπρσφωΔ]+/g, ' ').replace(/\s+/g, ' ').trim();

const texts = {};
for (const row of index) {
  const file = row.readable === 'text' ? row.target : row.ocr;
  if (!file || !existsSync(file)) continue;
  const bucket = (texts[row.subject] ??= { recent: [], older: [] });
  (Number(row.year) >= 2023 ? bucket.recent : bucket.older).push({ name: row.name, text: ` ${normalise(readFileSync(file, 'utf8'))} ` });
}

/** Removes brackets and qualifiers, so "Time of flight (projectile)" matches "time of flight". */
function phrases(name) {
  const base = name.replace(/\([^)]*\)/g, ' ').split(/[:;,–—]| - /)[0];
  const words = normalise(base).split(' ').filter(Boolean);
  if (!words.length) return [];
  const whole = words.join(' ');
  return whole.length >= 5 ? [whole] : [];
}

const out = {};
const entries = JSON.parse(readFileSync('data-private/all-entries.json', 'utf8'));
for (const e of entries) {
  const dir = SUBJECT_DIR[e.subject];
  const bucket = texts[dir];
  const list = phrases(e.name);
  let recent = 0;
  let older = 0;
  if (bucket && list.length) {
    for (const p of list) {
      const needle = ` ${p} `;
      for (const t of bucket.recent) if (t.text.includes(needle)) recent++;
      for (const t of bucket.older) if (t.text.includes(needle)) older++;
    }
  }
  out[e.id] = { recent, older };
}
writeFileSync('data-private/paper-evidence.json', JSON.stringify(out));
const vals = Object.values(out);
console.log('entries', vals.length, 'recent hits', vals.filter((v) => v.recent).length, 'older only', vals.filter((v) => !v.recent && v.older).length, 'no hit', vals.filter((v) => !v.recent && !v.older).length);
