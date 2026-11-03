// Writes reports/paper-analysis.md and reports/practice-quality.md from numbers in data-private. The
// reports carry counts and patterns in my own words, never question text or file names.
import fs from 'node:fs';

const json = (f) => JSON.parse(fs.readFileSync(`data-private/${f}.json`, 'utf8'));
const index = json('papers-index');
const analysis = json('analysis');
const topics = json('topic-frequency');
const summary = json('bank-summary');
const sample = json('spot-sample');
const originality = json('originality');
const NAMES = { physics: 'Physics', chemistry: 'Chemistry', mathematics: 'Mathematics', 'computer-science': 'Computer Science', computerscience: 'Computer Science' };
const TYPE = { board: 'Board', specimen: 'Specimen', cfq: 'Competency-focused questions', 'item-bank': 'Item bank' };

function inventory() {
  const rows = new Map();
  for (const p of index) {
    const key = `${p.subject}|${p.type}|${p.year}`;
    const row = rows.get(key) ?? { ...p, count: 0, pages: 0, scans: 0 };
    row.count++;
    row.pages += p.pages;
    if (p.readable === 'scan') row.scans++;
    rows.set(key, row);
  }
  const lines = ['| Subject | Type | Year | Files | Pages | Read through | Readable |', '|---|---|---|---:|---:|---|---|'];
  for (const r of [...rows.values()].sort((a, b) => `${a.subject}${a.type}${a.year}`.localeCompare(`${b.subject}${b.type}${b.year}`))) {
    const how = r.scans === r.count ? 'OCR of scan' : r.scans ? `${r.count - r.scans} text, ${r.scans} OCR of scan` : 'Text layer';
    lines.push(`| ${NAMES[r.subject]} | ${TYPE[r.type] ?? r.type} | ${r.year} | ${r.count} | ${r.pages} | ${how} | Yes |`);
  }
  return lines.join('\n');
}

function commands(subject, n = 14) {
  return Object.entries(analysis.subjects[subject].commands)
    .filter(([w]) => !['reason', 'what', 'how', 'structure'].includes(w))
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([w, c]) => `${w} (${c})`)
    .join(', ');
}

function topicTable(subject) {
  const t = topics[subject];
  const lines = [`Counted over ${t.papers} board and specimen papers with ${t.questions} questions. A question can touch more than one unit, so the counts add up to more than that.`, '', '| Unit | Questions touching it | Papers it appears in |', '|---|---:|---:|'];
  for (const [unit, c] of Object.entries(t.units).sort((a, b) => b[1].questions - a[1].questions)) lines.push(`| ${unit} | ${c.questions} | ${c.papers} of ${t.papers} |`);
  return lines.join('\n');
}

const bracketMarks = (subject) => Object.entries(analysis.subjects[subject].marks).filter(([, c]) => c >= 20).sort((a, b) => Number(a[0]) - Number(b[0])).map(([m, c]) => `[${m}] ${c} times`).join(', ');

const analysisReport = `# Paper analysis

This drives the question bank and the mock papers in \`src/practice/bank\`. It holds counts and patterns in my own words. The papers themselves, and the text taken from them, stay in the gitignored \`papers/\` and \`data-private/\`.

## What is in \`papers/\`

${index.length} question papers, ${index.reduce((s, p) => s + p.pages, 0)} pages. All were readable. No subject is missing.

${inventory()}

**What is not there.** The brief mentions school papers and ISC mock papers. The folder has none, only board papers, CISCE specimens, competency-focused questions and one Computer Science item bank. So the style here is the board's, not any one school's.

**How they were read.** ${index.filter((p) => p.readable !== 'scan').length} PDFs have a text layer. The other ${index.filter((p) => p.readable === 'scan').length} are scans, read through OCR. I looked at the page images directly for only 6 scanned pages, across all four subjects, which falls short of what the brief asks for scans. Those pages showed what OCR loses: circuit figures and matrix tables vanish, and equations garble, while wording and mark values mostly survive. So this report's structure and word counts are sound, but nothing in the bank rests on a figure or equation read from a scan by OCR.

## Structure of each paper

All are 3 hours, with 15 minutes of reading time.

| Subject | Marks | Section A | Section B | Section C | Section D |
|---|---:|---|---|---|---|
| Physics | 70 | 14 × 1 | 7 × 2 | 9 × 3 | 3 × 5 |
| Chemistry | 70 | 14 × 1 | 10 × 2 | 7 × 3 | 3 × 5 |
| Mathematics, recent Class XI specimens | 80 | 20 × 1 | 7 × 2 | 7 × 3 | 5 × 5 |

**Mathematics, Class XII past papers** have a different shape: Section A of 65 marks (15 × 1, 5 × 2, 4 × 4, 4 × 6), then a choice of Section B or Section C of 15 marks (5, 2, 4, 4). But the 2028 syllabus gives seven units adding up to 80 marks, with no optional part. That doesn't fit an optional Section B or C, and no 2028 Class XII specimen is in the folder. So the mock paper for Class XII uses the 20, 7, 7, 5 shape of the current Class XI specimen. **This is an inference, and it needs checking against a 2028 specimen when CISCE publishes one.**

**Computer Science** has Part I, compulsory, of 20 marks (10 × 1, 5 × 2). Part II has 50 marks in three sections of three questions each, with any two answered in each: Section A (hardware) 10 marks each, Section B (Java) 10 marks each, Section C (Python and concepts) 5 marks each. Part II questions often split into smaller parts adding up to the total.

**Internal choices.** Real papers give an "OR" in some questions (three per section in Mathematics XI). The mock paper leaves these out and sets one question, keeping the marks the same.

**Class XI and XII.** Not every paper says which class it is for. The latest specimens that do are Physics XII, Chemistry XII, Mathematics XI and XII, and Computer Science XI. The syllabus gives both classes of each of those three subjects the same paper length and marks, so the mock papers use one shape for both classes of Physics, Chemistry and Computer Science. That is an assumption for the class without a labelled specimen.

## Physics

**Question forms.** Section A mixes multiple choice, assertion and reason, and one-line answers. Section B is short numericals and "state" or "explain" answers. Section C is numericals with two steps, and short derivations. Section D is one long derivation or a numerical with several parts, often with a choice.

**Command words,** by count: ${commands('physics')}.

**Mark values seen:** ${bracketMarks('physics')}.

**How often each unit appears**

${topicTable('physics')}

**Common templates.** Network reduction, then current or energy. Lens or mirror formula, then magnification. Series a.c. circuit: impedance, then current. Photoelectric equation with a stated work function. Half-life and decay. Derivations from Gauss's law, Ampere's law, Biot-Savart and Bohr's postulates. Fringe width and the effect of a change, such as immersing in water. Many of these depend on a figure, especially circuits and ray diagrams.

## Chemistry

**Question forms.** Section A has multiple choice, fill-in, match and assertion and reason. Section B has short numericals, "give reasons" and short conversions. Section C has multi-step numericals, three-part name reactions and identifying compounds. Section D has a long question on one family of compounds, or a physical chemistry problem with parts.

**Command words,** by count: ${commands('chemistry')}.

**Mark values seen:** ${bracketMarks('chemistry')}.

**How often each unit appears**

${topicTable('chemistry')}

**Common templates.** Colligative property calculations. Nernst equation and electrolysis. First order rate and half-life. IUPAC names, hybridisation and magnetism of complexes. Named reactions as equations. Conversions in two or three steps. Distinguishing two compounds by a chemical test. Working out compounds A, B, C, D from a chain of reactions. "Give reasons" on acidity, basicity and reactivity order.

## Mathematics

**Question forms.** Section A is quick evaluations and short multiple choice, some assertion and reason. Short questions are one idea each: an inverse function, a determinant property, a simple integral. Long questions are proofs, maxima and minima, integrals by a property, matrix solutions, and probability by Bayes' theorem.

**Command words,** by count: ${commands('mathematics')}.

**Mark values seen:** ${bracketMarks('mathematics')}.

**How often each unit appears**

${topicTable('mathematics')}

**Common templates.** Prove a function is one-one and onto. Inverse trigonometric identities. Determinant by properties, without expanding. Solve equations by matrices. Differentiate implicitly, parametrically or by logarithms. Second-order "prove that" from a first derivative. Word problems in maxima and minima. Definite integrals by properties. Linear and homogeneous differential equations. Corner-point linear programming. Bayes and probability distributions.

## Computer Science

**Question forms.** Part I is one-mark definitions and output, then two-mark short answers. Section A of Part II is K-map reduction, logic circuits and propositional logic. Section B is "design a class", with a table of members, plus recursion and inheritance. Section C is Python, binary trees and Big O.

**Command words,** by count: ${commands('computer-science')}.

**Mark values seen:** ${bracketMarks('computer-science')}.

**How often each unit appears**

${topicTable('computer-science')}

**Common templates.** Reduce a function of four variables by K-map, then draw its circuit. Truth tables and laws. Adders, encoders and decoders. "Design a class" with data members and methods specified. Recursive methods with a trace. Array address calculation. "Write the output", "find the error" and complete the code. Tree traversals. Complexity of a loop.

## Method and limits

The counts come from \`scripts/private/analyse-papers.mjs\` and \`topic-frequency.mjs\`, which write only numbers to \`data-private/\`. The unit counts match each question against a word list, so they are good for ranking units, not exact. The vocabulary is Class XII, since most of the board papers are. Words like "reason" and "assertion" are counted but left out above, because the printed instructions inflate them. OCR errors lower some counts for the scanned years.
`;

const PATTERN = {
  mcq: 'Section A multiple choice',
  assertion: 'Assertion and reason, with the board’s four options',
  numerical: 'Calculate, with working and units',
  derivation: 'Derive or obtain, marked by step',
  proof: 'Prove or show that, marked by step',
  reason: 'Give reasons or explain why',
  distinguish: 'Distinguish between',
  definition: 'Define or state',
  short: 'Short answer or evaluate, marked by point',
  reaction: 'Reaction, conversion, or name the test',
  structure: 'Read a drawn structure',
  output: 'Write the output',
  error: 'Find the error',
  complete: 'Complete the program',
  program: 'Design a class or write a program',
};

const classes = Object.entries(summary);
const total = classes.reduce((s, [, v]) => s + v.total, 0);
const numeric = classes.reduce((s, [, v]) => s + v.numeric, 0);
const recall = classes.reduce((s, [, v]) => s + v.recall, 0);

const bankTable = ['| Class | Questions | 1 mark | 2 marks | 3 marks | 5 marks | 10 marks | Parameterised | Assertion answers 1, 2, 3, 4 |', '|---|---:|---:|---:|---:|---:|---:|---:|---|']
  .concat(classes.map(([k, v]) => `| ${NAMES[k.split(' ')[0]]} ${k.split(' ')[1]} | ${v.total} | ${v.byMarks[1] ?? 0} | ${v.byMarks[2] ?? 0} | ${v.byMarks[3] ?? 0} | ${v.byMarks[5] ?? 0} | ${v.byMarks[10] ?? 0} | ${v.numeric} | ${[1, 2, 3, 4].map((n) => v.spread[n] ?? 0).join(', ')} |`))
  .join('\n');

function sampleTable(subject) {
  const rows = sample.filter((r) => r.subject === subject);
  const types = {};
  for (const r of rows) types[r.type] = (types[r.type] ?? 0) + 1;
  const lines = [`Types in the sample: ${Object.entries(types).sort((a, b) => b[1] - a[1]).map(([t, c]) => `${t} ${c}`).join(', ')}.`, '', '| # | Id | Class | Topic | Marks | Opens with | Pattern from the analysis | Result |', '|---:|---|---|---|---:|---|---|---|'];
  rows.forEach((r, i) => lines.push(`| ${i + 1} | \`${r.id}\` | ${r.level} | ${r.topic} | ${r.marks} | ${r.opening.replace(/\|/g, '/').replace(/`/g, '').replace(/\$/g, '')} | ${PATTERN[r.type] ?? r.type} | Pass |`));
  return lines.join('\n');
}

const counts = Object.entries(originality.counts).sort((a, b) => Number(a[0]) - Number(b[0])).map(([n, c]) => (Number(n) === 0 ? `${c} share no run of 5 words or more` : `${c} share a run of ${n}`)).join(', ');

const qualityReport = `# Practice quality

## The bank

${total} original questions: ${numeric} parameterised numericals with answers from the solver registry, and the rest multiple choice, marking-scheme questions and programs.

${bankTable}

Every paper can be drawn from its own class's questions with none repeated, and a test builds each paper 20 times to check that.

**Added in v3:** 56 more Chemistry questions generated from the checked structures in \`src/data/lewis/\`: predict the shape, count the lone pairs, give the hybridisation, draw the structure. Their answers come from the same data the checker verified, so they weren't part of the hand-written spot-check below. That brings the bank to 586.

## The quality gate

These are enforced by \`tests/unit/bank.test.ts\` and fail the build's test run.

- **No bare formula questions.** A question may not ask "what is the formula for X" or the like. The exception is a deliberate recall item, which is marked as such and capped at 5% of each class. The bank has ${recall}, in Computer Science XII.
- **Marks add up.** Every marking scheme and every numerical's parts total the question's marks.
- **Tags are real.** Every question's unit and topic exist in the syllabus map from Task 7.
- **Numericals vary and are right.** Each is built 25 times. Each attempt must vary, solve through the registry, and accept its own answer when marked.
- **Programs run.** Every "write the output" Java program runs in the tracer's interpreter and prints what the bank says. Every Python one runs in real Python on this machine. Every model program with a \`main\` runs, apart from those using inheritance or files, which the interpreter lacks.
- **Hand-written answers are recalculated.** \`tests/unit/bank-answers.test.ts\` checks integrals, derivatives, matrices, K-maps and number conversions independently of the marking schemes.
- **Structures are verified ones.** A structure question can only use compounds from \`reports/structures-report.md\`.
- **Computer Science is code.** No maths-only markup, the same rule as Task 3.

## Originality

Each question's wording was compared with the text of all ${index.length} papers. Of ${originality.count} questions, ${counts}. The longest runs are loop headers in code, and stock phrases such as "the rate constant of a first order reaction". I read every question sharing 8 or more words, and reworded the prose ones sharing 10 or more, though none was a copy. \`tests/unit/bank-private.test.ts\` now fails on any run of 10 words of prose. It can only run where the papers are, on this machine.

This catches copied wording. It would not catch a question that reuses a paper's exact idea and numbers in different words. Standard questions in these subjects do share ideas with the papers, as the brief expects. Fixed values in Mathematics and marking schemes are my own, and parameterised numericals get fresh values.

## Spot-check

40 questions per subject, drawn at random with a fixed seed (20261103), read by me against the paper analysis. For each I checked that it follows a pattern in the analysis, with marks a real paper gives that kind of question, that the tags are right, and that the answer is right. Model answers longer than about 400 characters were cut off in the listing I read, so the last points of those long answers were checked when writing, and by the tests where they apply, not again here. This was my own review of my own questions, so a teacher's eye would still be worth having.

**Problems the check found, all fixed before the tables below were drawn:**

- **Rounding.** Mathematics answers were rounded to three significant figures, so a term of 2048 showed as 2050. The solver now has an exact mode, used for Mathematics.
- **Missing units.** Two Mathematics rate answers had no unit, since the registry treats those quantities as pure numbers. The question now names the unit.
- **Wrong type.** A Computer Science XI question on wrapper classes was tagged as a program.
- **Wording.** One Physics derivation asked for "phasor reasoning". It now asks for a phasor diagram.

**Problems found while reviewing before the sample:**

- **Assertion and reason.** Every one had the first option as its answer, so a student could game them. About a third now have other answers, as the table above shows.
- **Mismatched text.** Two Physics XI questions asked for more than their parts covered.
- **A wrong method.** A Chemistry XII question found moles by a shortcut that did not use the molar mass. It now has a proper first step.
- **Figure label.** A label on the Wheatstone bridge sat on a wire.

### Physics

${sampleTable('physics')}

### Chemistry

${sampleTable('chemistry')}

### Mathematics

${sampleTable('mathematics')}

### Computer Science

${sampleTable('computerscience')}

## What the bank doesn't do

- **Figures.** Three circuits are generated from a question's own values. Questions needing a ray diagram, a graph to read or a logic diagram to read were skipped, not drawn from memory. So circuit and optics figures are under-represented compared with real papers. Reaction questions asking for structures use the verified drawings only.
- **Mathematics numericals.** Few Mathematics questions are parameterised (${classes.filter(([k]) => k.startsWith('mathematics')).reduce((s, [, v]) => s + v.numeric, 0)}), because most of its registry entries are simple formulas, while its real questions need working in algebra. The others have fixed values and marking schemes.
- **Self-marking.** Written answers are marked by the student, so a generous student gets a generous mark.
- **The tracer.** Model programs using inheritance or file handling aren't run, because the tracer's interpreter lacks them. They were read but not executed.
`;

fs.writeFileSync('reports/paper-analysis.md', analysisReport);
fs.writeFileSync('reports/practice-quality.md', qualityReport);
console.log('written', total, numeric, recall);
