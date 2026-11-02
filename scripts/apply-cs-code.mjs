// Writes Computer Science the way it would be written in Java. Runs after apply-syllabus.mjs.
// An entry keeps its LaTeX only if it is notation the syllabus itself uses (see scripts/cs/lint.mjs).
// All others get a `body`, written by hand in scripts/cs/manual.mjs or converted here from \texttt.
import fs from 'node:fs';
import path from 'node:path';
import { JAVA_BESIDE, MANUAL, NOTATION_UNITS } from './cs/manual.mjs';
import { lintEntry } from './cs/lint.mjs';

const generated = path.resolve('src/data/generated');
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(generated, name), 'utf8'));
const writeJson = (name, value) => fs.writeFileSync(path.join(generated, name), JSON.stringify(value));

function closingBrace(s, open) {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === '\\') {
      i++;
      continue;
    }
    if (s[i] === '{') depth++;
    if (s[i] === '}' && --depth === 0) return i;
  }
  return -1;
}

const unescapeTex = (s) =>
  s
    .replace(/\\char"5E/g, '^')
    .replace(/\\textbackslash(\{\})?/g, '\\')
    .replace(/\\textasciitilde(\{\})?/g, '~')
    .replace(/\\textasciicircum(\{\})?/g, '^')
    .replace(/\\([_%#&${}])/g, '$1')
    .replace(/\\ /g, ' ');

/** Turns simple LaTeX into a body: \texttt becomes `code`, \text becomes words. */
function fromLatex(tex) {
  let s = tex
    .replace(/\\begin\{aligned\}|\\end\{aligned\}/g, '')
    .replace(/\\\\/g, '\n')
    .replace(/(^|[^\\])&/g, '$1');
  for (;;) {
    const m = /\\(texttt|mathtt|text|mathrm|textbf|mathbf)\{/.exec(s);
    if (!m) break;
    const open = m.index + m[0].length - 1;
    const close = closingBrace(s, open);
    if (close < 0) break;
    const inner = unescapeTex(s.slice(open + 1, close));
    s = s.slice(0, m.index) + (m[1] === 'texttt' || m[1] === 'mathtt' ? `\`${inner}\`` : inner) + s.slice(close + 1);
  }
  return s
    .replace(/\\(?:qquad|quad|[;,:! ])/g, ' ')
    .replace(/\\Rightarrow/g, '⇒')
    .replace(/\\rightarrow|\\to\b/g, '→')
    .replace(/\\leftarrow/g, '←')
    .replace(/\\geq?\b/g, '≥')
    .replace(/\\leq?\b/g, '≤')
    .replace(/\\neq?\b/g, '≠')
    .replace(/\\(?:ldots|dots)/g, '…')
    .replace(/\\equiv/g, '≡')
    .replace(/\\([_%#&${}])/g, '$1')
    .replace(/ +/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/`([^`\n]*)` *` *([^`\n]*)`/g, '`$1 $2`')
    .trim();
}

const OPERATOR = /[=+*/%<>!&|~]|\[|\]|\b[a-zA-Z0-9]-[a-zA-Z0-9]\b/;

/** True only for a run that can't be anything but code: a[i][j], e-1, i<j, s.length()-1. */
function isBareCode(run) {
  if (!OPERATOR.test(run)) return false;
  if (/^[=+*/%<>!&|~-]|[=+*/%<>!&|~-]$/.test(run)) return false;
  if ((run.match(/\(/g) ?? []).length !== (run.match(/\)/g) ?? []).length) return false;
  if ((run.match(/\[/g) ?? []).length !== (run.match(/\]/g) ?? []).length) return false;
  if (/'/.test(run) && !/'.'/.test(run)) return false;
  // A longer word joined by a symbol is prose ("data+behaviour"), unless it is a call or a field.
  return !/[A-Za-z]{3,}/.test(run.replace(/[A-Za-z_]\w*(?=[.([])|\.[A-Za-z_]\w*/g, ''));
}

/** Wraps code that was written outside \texttt. */
function wrapBareCode(line) {
  return line
    .split(/(`[^`]*`)/)
    .map((part) => (part.startsWith('`') ? part : part.replace(/[A-Za-z0-9_.'"()[\]+\-*/%=<>!&|~]+/g, (run) => (isBareCode(run) ? `\`${run}\`` : run))))
    .join('');
}

const DANGLING = /\b(?:a|an|the|of|to|or|and|in|into|with|for|on|by|from|is|are|until|using|that|its|at|as|than|not|only|each|every)$/i;

/** The old LaTeX broke long sentences to fit its width. Those breaks are gone from a sentence. */
function joinBrokenSentences(body) {
  const out = [];
  for (const line of body.split('\n')) {
    const previous = out[out.length - 1];
    if (previous !== undefined && !/[;:.{}]$/.test(previous) && (/^[a-z]/.test(line) || DANGLING.test(previous))) out[out.length - 1] = `${previous} ${line}`;
    else out.push(line);
  }
  return out.join('\n');
}

const tidyBody = (body) =>
  joinBrokenSentences(body)
    .split('\n')
    .map(wrapBareCode)
    .join('\n')
    .replace(/` ?= ?`/g, '` is `')
    .replace(/` ?= ?([^\s`,;]+)/g, '` is `$1`')
    .replace(/`([^`\n]*)`([+\-*/%<>]+)`([^`\n]*)`/g, '`$1$2$3`');

function convertEntry(entry, unitKey) {
  const manual = MANUAL[entry.id];
  if (manual) {
    if (manual.name) {
      entry.aka = [...(entry.aka ?? []), entry.name];
      entry.name = manual.name;
    }
    if (manual.latex) entry.latex = manual.latex;
    if (manual.body) entry.body = manual.body;
    if (manual.note !== undefined) {
      if (manual.note) entry.note = manual.note;
      else delete entry.note;
    }
  }
  if (!entry.body && (!NOTATION_UNITS.test(unitKey) || /\\texttt/.test(entry.latex))) entry.body = tidyBody(fromLatex(entry.latex));
  if (JAVA_BESIDE[entry.id]) entry.body = `$${entry.latex}$\n\`${JAVA_BESIDE[entry.id]}\``;
  // A shared entry keeps its LaTeX for the other subject's pages.
  if (entry.body && !entry.subjects) entry.latex = '';
  return lintEntry(entry, unitKey);
}

const problems = [];
const manifest = readJson('manifest.json');
const cs = manifest.subjects.find((s) => s.id === 'computerscience');
const shared = readJson('shared.json');
const sharedDone = new Set();
let bodies = 0;
let kept = 0;
for (const cls of cs.classes) {
  const chunk = readJson(cls.chunk);
  for (const unit of chunk.units) {
    const unitKey = `${cls.level} ${unit.number}`;
    for (const sub of unit.subtopics) {
      for (const item of sub.items) {
        const entry = item.ref ? shared[item.ref] : item;
        if (item.ref) {
          if (sharedDone.has(item.ref)) continue;
          sharedDone.add(item.ref);
        }
        problems.push(...convertEntry(entry, unitKey).map((p) => `${entry.id} (${unitKey}): ${p}`));
        if (entry.body) bodies++;
        else kept++;
      }
    }
  }
  writeJson(cls.chunk, chunk);
}
writeJson('shared.json', shared);
for (const id of Object.keys(MANUAL)) if (!(id in shared) && !problems.length) checkExists(id);

function checkExists(id) {
  const cls = /^cs-(xii|xi)-/.exec(id)?.[1]?.toUpperCase();
  if (!cls) return;
  const chunk = fs.readFileSync(path.join(generated, `computerscience-${cls}.json`), 'utf8');
  if (!chunk.includes(`"${id}"`)) console.log(`  (manual entry for ${id}, which is no longer in the book)`);
}

console.log(`Computer Science: ${bodies} written as code, ${kept} kept as the syllabus's own notation`);
if (problems.length) {
  console.error(`\n${problems.length} Computer Science entries still use maths markup:\n${problems.join('\n')}`);
  process.exit(1);
}
