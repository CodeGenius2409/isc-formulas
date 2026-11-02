// Extracts the text layer of every paper in papers/ to data-private/text/papers/, and
// reports which files have too little text to trust (scans). Nothing here is shipped:
// both the input and the output folders are gitignored.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';

const ROOT = 'papers';
const OUT = 'data-private/text/papers';

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const rows = [];
for (const file of walk(ROOT).sort()) {
  if (!file.endsWith('.pdf') || file.includes('syllabus')) continue;
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const [subject, type] = rel.split('/');
  const name = basename(file, '.pdf');
  const year = /(20\d\d)/.exec(name)?.[1] ?? '?';
  const target = join(OUT, subject, type, `${name.replace(/[^\w.-]+/g, '_')}.txt`);
  mkdirSync(dirname(target), { recursive: true });
  try {
    execFileSync('pdftotext', ['-enc', 'UTF-8', '-layout', file, target], { stdio: 'ignore' });
  } catch {
    rows.push({ subject, type, year, name, file: rel, pages: 0, chars: 0, perPage: 0, readable: 'failed' });
    continue;
  }
  const text = readFileSync(target, 'utf8');
  const pages = text.split('\f').length - 1 || 1;
  const chars = text.replace(/\s+/g, '').length;
  const perPage = Math.round(chars / pages);
  rows.push({ subject, type, year, name, file: rel, target: target.replace(/\\/g, '/'), pages, chars, perPage, readable: perPage > 400 ? 'text' : perPage > 80 ? 'partial' : 'scan' });
}
writeFileSync('data-private/papers-index.json', JSON.stringify(rows, null, 1));
for (const r of rows) console.log(`${r.subject.padEnd(16)} ${r.type.padEnd(9)} ${r.year} p${String(r.pages).padStart(3)} ${String(r.perPage).padStart(5)}/pg ${r.readable.padEnd(7)} ${r.name.slice(0, 62)}`);
console.log(rows.length, 'papers;', rows.filter((r) => r.readable !== 'text').length, 'need the page images read directly');
