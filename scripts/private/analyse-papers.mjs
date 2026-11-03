// Counts things across the private papers: structure, marks, command words and topics. It writes
// numbers only to data-private/analysis.json. No question text leaves data-private.
import fs from 'node:fs';
import path from 'node:path';

const index = JSON.parse(fs.readFileSync('data-private/papers-index.json', 'utf8'));
const SUBJECTS = ['physics', 'chemistry', 'mathematics', 'computer-science'];
const COMMANDS = [
  'state', 'define', 'derive', 'prove', 'show that', 'calculate', 'find', 'evaluate', 'determine', 'explain', 'give reason', 'give reasons', 'why', 'distinguish between', 'differentiate between', 'difference between',
  'write the output', 'output of', 'find the error', 'correct the', 'complete the', 'write a program', 'design a class', 'define a class', 'draw', 'name', 'identify', 'how', 'what', 'write the', 'convert', 'simplify', 'solve', 'verify', 'obtain', 'sketch',
  'assertion', 'reason', 'match', 'fill in', 'choose the correct', 'multiple choice', 'balance', 'complete and balance', 'give the', 'iupac', 'structure', 'mechanism', 'differentiate', 'integrate', 'hence',
];

function textOf(paper) {
  const candidates = [paper.ocr && paper.ocrFile, paper.target, paper.text].filter(Boolean);
  for (const c of candidates) {
    if (fs.existsSync(c)) return fs.readFileSync(c, 'utf8');
  }
  return '';
}

function allFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? allFiles(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}
const textFiles = [...allFiles('data-private/text/papers'), ...(fs.existsSync('data-private/ocr') ? allFiles('data-private/ocr') : [])];
const byName = new Map(textFiles.map((f) => [path.basename(f).replace(/\.txt$/, ''), f]));

const out = { papers: [], subjects: {} };
for (const subject of SUBJECTS) out.subjects[subject] = { types: {}, years: {}, commands: {}, marks: {}, papersRead: 0, marksTotals: {}, sections: {}, qPerPaper: [] };

for (const paper of index) {
  const stem = path.basename(paper.target ?? '').replace(/\.txt$/, '');
  const candidates = [paper.ocr, paper.target, ...textFiles.filter((f) => path.basename(f).includes(stem) && stem)].filter(Boolean);
  const texts = candidates.filter((f) => typeof f === 'string' && fs.existsSync(f)).map((f) => fs.readFileSync(f, 'utf8'));
  const text = texts.sort((a, b) => b.length - a.length)[0] ?? '';
  const lower = text.toLowerCase();
  const s = out.subjects[paper.subject];
  const readable = text.trim().length > 400;
  out.papers.push({ subject: paper.subject, type: paper.type, year: paper.year, pages: paper.pages, scanned: Boolean(paper.ocr), readable });
  if (!s || !readable) continue;
  s.papersRead++;
  s.types[paper.type] = (s.types[paper.type] ?? 0) + 1;
  s.years[paper.year] = (s.years[paper.year] ?? 0) + 1;
  for (const word of COMMANDS) {
    const n = (lower.match(new RegExp(`\\b${word.replace(/ /g, '\\s+')}\\b`, 'g')) ?? []).length;
    if (n) s.commands[word] = (s.commands[word] ?? 0) + n;
  }
  for (const m of text.matchAll(/\[\s*(\d{1,2})\s*\]/g)) {
    const v = Number(m[1]);
    if (v >= 1 && v <= 15) s.marks[v] = (s.marks[v] ?? 0) + 1;
  }
  const total = /maximum\s+marks\s*[:\-]?\s*(\d{2,3})/i.exec(text)?.[1];
  if (total) s.marksTotals[total] = (s.marksTotals[total] ?? 0) + 1;
  for (const m of lower.matchAll(/\b(section\s+[a-d]|part\s+i{1,2})\b/g)) s.sections[m[1].replace(/\s+/g, ' ')] = (s.sections[m[1].replace(/\s+/g, ' ')] ?? 0) + 1;
  const q = new Set([...text.matchAll(/(?:^|\n)\s*(?:question\s+)?(\d{1,2})\s*[.)]?\s+/gi)].map((m) => Number(m[1])).filter((n) => n <= 40));
  s.qPerPaper.push(q.size);
}
fs.writeFileSync('data-private/analysis.json', JSON.stringify(out, null, 1));
for (const [name, s] of Object.entries(out.subjects)) {
  console.log(`\n== ${name}: ${s.papersRead} papers`, JSON.stringify(s.types), JSON.stringify(s.years));
  console.log('totals', JSON.stringify(s.marksTotals), 'marks', JSON.stringify(s.marks));
  console.log('sections', JSON.stringify(s.sections));
  console.log('commands', Object.entries(s.commands).sort((a, b) => b[1] - a[1]).slice(0, 24).map(([k, v]) => `${k}:${v}`).join(' '));
}
console.log('\nunreadable', out.papers.filter((p) => !p.readable).length);
