// Runs after every build. The past papers and anything made from them must never ship or be committed.
// 1. Git tracks nothing in papers/ or data-private/, and both are ignored.
// 2. Nothing in dist/ is named after them or mentions them, and no PDF is bundled.
// 3. Where the papers are on this machine, no run of words from them appears in dist/. On a machine
//    without them, such as the one that deploys the site, that part is skipped and says so.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
/**
 * A run this long is a copied sentence. Shorter ones are not evidence: the book has its formula names,
 * and the tracer its loops, in the same words as the papers. tests/unit/bank-private.test.ts is stricter
 * about the question bank, at ten words.
 */
const RUN = 15;
/** Words that any paper and any instruction share. These aren't questions, so they don't count. */
const BOILERPLATE = /assertion|reason is|correct explanation|maximum marks|time allotted|reading time|instructions to candidates|question paper|multiple choice|static void main|new scanner/;

function fail(message) {
  console.error(`check-private: ${message}`);
  process.exitCode = 1;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

const git = (...args) => {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
};

const tracked = git('ls-files', 'papers', 'data-private');
if (tracked === null) console.log('check-private: not a git checkout, skipping the tracking check.');
else if (tracked.trim()) fail(`git tracks private files:\n${tracked}`);
for (const folder of ['papers/x', 'data-private/x']) {
  if (tracked !== null && git('check-ignore', folder) === null) fail(`${folder.split('/')[0]}/ is not gitignored.`);
}

const files = walk(DIST);
if (!files.length) fail('dist/ is empty. Run this after the build.');
for (const file of files) {
  if (/\.pdf$/i.test(file)) fail(`a PDF is in the build: ${file}`);
  if (/data-private|papers?[\\/]|specimen|marking.?scheme/i.test(path.relative(DIST, file))) fail(`a private name is in the build: ${file}`);
}
const shipped = files.filter((f) => /\.(js|css|html|json|webmanifest)$/.test(f));
const texts = shipped.map((f) => ({ file: f, text: fs.readFileSync(f, 'utf8') }));
for (const { file, text } of texts) {
  if (text.includes('data-private')) fail(`${file} mentions data-private.`);
}

const words = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
const paperFiles = [...walk('data-private/text/papers'), ...walk('data-private/ocr')].filter((f) => f.endsWith('.txt'));
if (!paperFiles.length) {
  console.log('check-private: the papers are not on this machine, skipping the copied-text check.');
} else {
  const runs = new Set();
  for (const file of paperFiles) {
    const list = words(fs.readFileSync(file, 'utf8'));
    for (let i = 0; i + RUN <= list.length; i++) runs.add(list.slice(i, i + RUN).join(' '));
  }
  // Only the question files could carry such text, but every shipped file is read so that nothing is assumed.
  const found = new Map();
  for (const { file, text } of texts) {
    const list = words(text);
    for (let i = 0; i + RUN <= list.length; i++) {
      const run = list.slice(i, i + RUN).join(' ');
      // A run of bare numbers or single letters is a table or a truth table's variables, and says nothing about where text came from.
      if (runs.has(run) && !BOILERPLATE.test(run) && !/^(?:(?:\d+|[a-z]) ?)+$/.test(run)) found.set(run, file);
    }
  }
  if (found.size) {
    for (const file of new Set(found.values())) console.error(`  ${[...found].filter(([, f]) => f === file).length} matching runs in ${path.basename(file)}`);
    fail(`${found.size} runs of ${RUN} words from the papers are in the build. Search the file for them.`);
  } else {
    console.log(`check-private: no run of ${RUN} words from ${paperFiles.length} private texts is in the ${shipped.length} shipped files.`);
  }
}
if (!process.exitCode) console.log('check-private: passed.');
