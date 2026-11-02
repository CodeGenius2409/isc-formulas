// Counts which papers mention each term. Usage: pgrep.mjs <subjectDir> term1 term2 ...
// Shows hits by year, so a topic dropped years ago looks different from a current one.
import { existsSync, readFileSync } from 'node:fs';

const [subject, ...terms] = process.argv.slice(2);
const index = JSON.parse(readFileSync('data-private/papers-index.json', 'utf8')).filter((r) => r.subject === subject);
const docs = index.flatMap((r) => {
  const file = r.readable === 'text' ? r.target : r.ocr;
  return file && existsSync(file) ? [{ year: Number(r.year), type: r.type, name: r.name, text: readFileSync(file, 'utf8').toLowerCase().replace(/\s+/g, ' ') }] : [];
});
console.log(`${subject}: ${docs.length} papers. Columns: term, recent papers (2023+), older papers, years`);
for (const term of terms) {
  const re = new RegExp(term.toLowerCase());
  const hits = docs.filter((d) => re.test(d.text));
  const recent = hits.filter((d) => d.year >= 2023);
  const years = [...new Set(hits.map((d) => d.year))].sort().join(',');
  console.log(`${term.padEnd(34)} ${String(recent.length).padStart(3)} ${String(hits.length - recent.length).padStart(3)}  ${years}`);
}
