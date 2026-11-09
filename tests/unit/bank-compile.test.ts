// Builds the bank's data files, one for each chapter: src/data/bank/<subject>-<level>-<unit>.json. Run when facts or blueprints change:
//   $env:BANK_COMPILE=1; npx vitest run tests/unit/bank-compile.test.ts
// Two layers go in. "facts": each reviewed fact, in its own words, as a fixed question. "compiled": instances frozen from
// blueprints that have been reviewed, for what facts can't give, such as numericals and programs. A frozen numerical keeps its
// values and its route through the solver, so its answer is still worked out by the solver, as with any bank numerical.
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import { FACT_BOOK } from '../../src/data/blueprints/dsl';
import type { Blueprint } from '../../src/data/blueprints/types';
import { loadSyllabus } from '../../src/data/syllabus';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { factDefs } from '../../src/practice/bank/from-facts';
import type { BankDef, Difficulty } from '../../src/practice/bank/types';
import { generateBody, NoQuestion } from '../../src/practice/gen/engine';

const OUT = path.resolve(__dirname, '../../src/data/bank');
const SUBJECTS: SubjectId[] = ['physics', 'chemistry', 'mathematics', 'computerscience'];
const LEVELS: ClassLevel[] = ['XI', 'XII'];
/** How many to freeze for each subtopic, format and difficulty, and from any one blueprint in it. */
const PER_CELL = Number(process.env.BANK_PER_CELL ?? 40);
const PER_BLUEPRINT = 8;

function hash(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (Math.imul(h, 33) ^ text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

const CODE: Record<SubjectId, string> = { physics: 'p', chemistry: 'c', mathematics: 'm', computerscience: 'k' };

/** One frozen instance, as a bank definition. Null if it needs facts, which the facts layer covers. */
function freeze(bp: Blueprint, seed: number): BankDef | null {
  const body = generateBody(bp, seed);
  if (body.facts?.length) return null;
  const { context, source, ...rest } = body as typeof body & { source?: { parts: unknown; values: Record<string, number> } };
  const unknown = body.form === 'numeric' ? body.parts.map((p) => p.question.unknown).join('+') : '';
  const prefix = `${CODE[bp.subject]}${bp.level === 'XII' ? '12' : '11'}`;
  // New wrong options on the same stem aren't a new question.
  const figure = JSON.stringify(body.diagram ?? '');
  const key = body.form === 'mcq' ? `${body.text}|${figure}` : body.form === 'output' ? `${body.text}${body.code}` : `${body.text}|${figure}|${body.form === 'numeric' ? body.parts.map((p) => p.ask).join('|') : ''}`;
  const tags = {
    id: `q-${prefix}-${bp.unit}${bp.topic}-c${hash(key)}`,
    subject: bp.subject,
    level: bp.level,
    unit: bp.unit,
    topic: bp.topic,
    marks: bp.marks,
    type: bp.type,
    difficulty: bp.difficulty,
    format: bp.format,
    style: bp.style,
    origin: 'compiled' as const,
    shape: `${bp.id}${unknown ? `|${unknown}` : ''}`,
    ...(context ? { context } : {}),
  };
  if (body.form === 'numeric') {
    const { parts: _built, form: _form, ...others } = rest as typeof body;
    // Worked by the solver when it's opened, as other bank numericals are. Anything worked out by hand in a blueprint stays as it was built.
    if (source) return { ...tags, ...others, form: 'numeric', text: body.text, vars: Object.fromEntries(Object.entries(source.values).map(([k, v]) => [k, [v]])), parts: source.parts } as unknown as BankDef;
    return { ...tags, ...others, form: 'numeric', text: body.text, vars: {}, parts: [], fixedParts: body.parts } as unknown as BankDef;
  }
  return { ...tags, ...rest } as unknown as BankDef;
}

describe.skipIf(!process.env.BANK_COMPILE)('compiling the bank', () => {
  it('writes each chapter', async () => {
    fs.rmSync(OUT, { recursive: true, force: true });
    fs.mkdirSync(OUT, { recursive: true });
    const lines: string[] = [];
    for (const subject of SUBJECTS) {
      const syllabus = await loadSyllabus(subject);
      for (const level of LEVELS) {
        const set = await loadBlueprints(subject, level);
        for (const unit of syllabus.classes.find((c) => c.level === level)?.units ?? []) {
          const defs: BankDef[] = [];
          const chapterKeys = new Set<string>();
          for (const topic of unit.topics) {
            const facts = FACT_BOOK.get(`${subject} ${level} ${unit.number}${topic.key}`);
            if (facts) defs.push(...factDefs(subject, level, unit.number, topic.key, facts));
            // Reviewed blueprints only, and flagged ones never.
            const pool = set.blueprints.filter((b) => b.unit === unit.number && b.topic === topic.key && b.reviewed && !b.flag);
            const cells = new Map<string, Blueprint[]>();
            for (const bp of pool) {
              const k = `${bp.format}|${bp.difficulty as Difficulty}`;
              cells.set(k, [...(cells.get(k) ?? []), bp]);
            }
            for (const list of cells.values()) {
              const seen = new Set<string>();
              // Round the blueprints, so that a cell is spread across its ways of asking.
              for (let round = 1; round <= PER_BLUEPRINT && seen.size < PER_CELL; round++) {
                for (const bp of list) {
                  if (seen.size >= PER_CELL) break;
                  let def: BankDef | null = null;
                  try {
                    def = freeze(bp, round * 104_729 + 17);
                  } catch (err) {
                    if (!(err instanceof NoQuestion)) throw err;
                  }
                  if (!def || seen.has(def.id) || chapterKeys.has(def.id)) continue;
                  seen.add(def.id);
                  chapterKeys.add(def.id);
                  defs.push(def);
                }
              }
            }
          }
          const file = path.join(OUT, `${subject}-${level.toLowerCase()}-${unit.number}.json`);
          fs.writeFileSync(file, JSON.stringify(defs));
          lines.push(`${path.basename(file)} ${defs.length}`);
        }
      }
    }
    fs.writeFileSync(path.join(process.env.TEMP ?? '.', 'bank-compile.txt'), lines.join('\n'));
  }, 1_800_000);
});
