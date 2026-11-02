// Prints formula names by subtopic for reading. Usage: print-names.mjs <subject> <level> [unitIndex]
// A leading * marks a name found in a recent paper, and + one found only in an older paper.
import { readFileSync } from 'node:fs';

const [subject, level, only] = process.argv.slice(2);
const entries = JSON.parse(readFileSync('data-private/all-entries.json', 'utf8'));
const evidence = JSON.parse(readFileSync('data-private/paper-evidence.json', 'utf8'));
let unit = '';
let sub = '';
let line = [];
const units = [...new Set(entries.filter((e) => e.subject === subject && e.level === level).map((e) => e.unit))];
const flush = () => {
  if (line.length) console.log(`${sub}: ${line.join(' | ')}`);
  line = [];
};
for (const e of entries) {
  if (e.subject !== subject || e.level !== level) continue;
  if (only !== undefined && units.indexOf(e.unit) !== Number(only)) continue;
  if (e.unit !== unit) {
    flush();
    unit = e.unit;
    console.log(`\n# ${unit}`);
  }
  if (e.subtopic !== sub) {
    flush();
    sub = e.subtopic;
  }
  const ev = evidence[e.id] ?? { recent: 0, older: 0 };
  line.push(`${ev.recent ? '*' : ev.older ? '+' : ''}${e.name.slice(0, 44)}`);
}
flush();
