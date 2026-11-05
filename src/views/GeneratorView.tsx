import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { ArrowDown, ArrowUp, Dices, Download, FileText, FileUp, GripVertical, Lock, LockOpen, PenLine, Plus, Printer, RefreshCw, Save, Trash2, Wand2 } from 'lucide-react';
import { BankPrompt } from '../components/bank/BankParts';
import { GeneratedMark, GENERATED_NOTICE, PAPER_NOTICE, ReportProblem } from '../components/bank/GeneratedMark';
import { RichText } from '../components/bank/RichText';
import { ShareSlider } from '../components/bank/ShareSlider';
import { getSubject, manifest } from '../data/book';
import { loadSyllabus } from '../data/syllabus';
import type { ClassLevel, Syllabus, SubjectId } from '../data/types';
import { useAsync } from '../lib/hooks';
import { useStore } from '../lib/store';
import type { BankItem, Difficulty } from '../practice/bank/types';
import { answerLines, saveBlob, STUDENT_FOOTER } from '../practice/gen/docx';
import { describePlan, generatedCount, planShare, teacherShareStore } from '../practice/gen/mix';
import { allItems, arranged, bankForSections, buildFullPaper, buildQuestionSet, countAvailable, deleteItem, deletePaper, emptyFilters, FORMATS, makeSets, moveItem, moveItemTo, officialStructure, paperFromFile, paperToFile, presetsStore, regenerateItem, regenerateUnlocked, savePaper, savePreset, teacherHistoryStore, totalMarks, updateItem, usedInHistory, type CustomSection, type Filters, type FormatChoice, type PaperItem, type TeacherPaper } from '../practice/gen/teacher';

const freshSeed = () => Math.floor(Math.random() * 2 ** 31);

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Check({ label, checked, onChange, testId }: { label: string; checked: boolean; onChange: () => void; testId?: string }) {
  return (
    <label className="gen-check" data-testid={testId}>
      <input type="checkbox" checked={checked} onChange={onChange} /> {label}
    </label>
  );
}

function Field({ label, value, onChange, type = 'text', id, min }: { label: string; value: string; onChange: (v: string) => void; type?: string; id: string; min?: number }) {
  return (
    <div>
      <label className="lbl" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="field" type={type} min={min} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/** The whole syllabus, by class, as tick boxes. Leaving them all empty means every chapter. */
function ChapterPicker({ syllabus, filters, onChange }: { syllabus: Syllabus; filters: Filters; onChange: (f: Filters) => void }) {
  const levels: ClassLevel[] = filters.levels.length ? filters.levels : ['XI', 'XII'];
  return (
    <details className="gen-chapters" data-testid="chapter-picker">
      <summary>Chapters and subtopics {filters.units.length + filters.topics.length > 0 ? `(${filters.units.length + filters.topics.length} chosen)` : '(all)'}</summary>
      {levels.map((level) => (
        <div key={level} className="mt-2">
          <p className="font-semibold">Class {level}</p>
          {syllabus.classes
            .find((c) => c.level === level)
            ?.units.filter((u) => !/^Paper II/.test(u.name))
            .map((unit) => {
              const unitKey = `${level} ${unit.number}`;
              return (
                <div key={unitKey} className="gen-unit">
                  <Check label={`${unit.number}. ${unit.name}`} checked={filters.units.includes(unitKey)} onChange={() => onChange({ ...filters, units: toggle(filters.units, unitKey) })} />
                  {filters.units.includes(unitKey) && unit.topics.length > 1 && (
                    <div className="gen-topics">
                      {unit.topics
                        .filter((t) => t.key !== 'p')
                        .map((topic) => {
                          const topicKey = `${unitKey} ${topic.key}`;
                          return <Check key={topicKey} label={topic.name} checked={filters.topics.includes(topicKey)} onChange={() => onChange({ ...filters, topics: toggle(filters.topics, topicKey) })} />;
                        })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ))}
    </details>
  );
}

function CustomStructureEditor({ parts, onChange }: { parts: CustomSection[]; onChange: (parts: CustomSection[]) => void }) {
  const change = (i: number, next: Partial<CustomSection>) => onChange(parts.map((p, j) => (j === i ? { ...p, ...next } : p)));
  return (
    <div className="mt-2" data-testid="custom-structure">
      {parts.map((part, i) => (
        <div key={i} className="gen-section-row">
          <Field id={`part-name-${i}`} label="Section name" value={part.name} onChange={(v) => change(i, { name: v })} />
          <Field id={`part-count-${i}`} label="Questions" type="number" min={1} value={String(part.count)} onChange={(v) => change(i, { count: Math.max(1, Number(v) || 1) })} />
          <Field id={`part-marks-${i}`} label="Marks each" type="number" min={1} value={String(part.marks)} onChange={(v) => change(i, { marks: Math.max(1, Number(v) || 1) })} />
          <Field id={`part-choose-${i}`} label="Attempt any (blank for all)" type="number" min={1} value={part.choose ? String(part.choose) : ''} onChange={(v) => change(i, { choose: Number(v) || undefined })} />
          <div>
            <label className="lbl" htmlFor={`part-format-${i}`}>
              Format
            </label>
            <select id={`part-format-${i}`} className="field" value={part.formats[0] ?? ''} onChange={(e) => change(i, { formats: e.target.value ? [e.target.value as FormatChoice] : [] })}>
              <option value="">Any</option>
              {FORMATS.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn btn-quiet" aria-label={`Remove ${part.name}`} onClick={() => onChange(parts.filter((_, j) => j !== i))}>
            <Trash2 size={15} aria-hidden />
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-line mt-2" onClick={() => onChange([...parts, { name: `Section ${String.fromCharCode(65 + parts.length)}`, count: 5, marks: 2, formats: [] }])}>
        <Plus size={15} aria-hidden /> Add a section
      </button>
    </div>
  );
}

const withEdit = (entry: PaperItem): BankItem => (entry.editedText !== undefined ? { ...entry.question.item, text: entry.editedText } : entry.question.item);

function ReviewItem({ entry, number, canMove, onChange, onMove, onDrop, onRegenerate, busy }: { entry: PaperItem; number: number; canMove: [boolean, boolean]; onChange: (change: Partial<PaperItem> | null) => void; onMove: (by: number) => void; onDrop: (from: string) => void; onRegenerate: () => void; busy: boolean }) {
  const [editing, setEditing] = useState(false);
  const [over, setOver] = useState(false);
  const item = withEdit(entry);
  return (
    <li
      className="gen-review"
      data-generated={item.generated ? true : undefined}
      data-locked={entry.locked || undefined}
      data-over={over || undefined}
      data-testid="review-item"
      onDragOver={(e: DragEvent) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e: DragEvent) => {
        e.preventDefault();
        setOver(false);
        const from = e.dataTransfer.getData('text/plain');
        if (from) onDrop(from);
      }}
    >
      <div className="gen-review-head">
        <span
          className="gen-grip no-print"
          draggable
          aria-hidden
          onDragStart={(e: DragEvent) => {
            e.dataTransfer.setData('text/plain', entry.key);
            e.dataTransfer.effectAllowed = 'move';
          }}
        >
          <GripVertical size={16} />
        </span>
        <span className="font-semibold">Question {number}</span>
        <GeneratedMark item={item} />
        <span className="bank-marks">[{item.marks}]</span>
      </div>
      {editing ? (
        <div className="mt-1">
          <label className="lbl" htmlFor={`edit-${entry.key}`}>
            Wording of this question
          </label>
          <textarea id={`edit-${entry.key}`} className="field" rows={4} value={entry.editedText ?? item.text} onChange={(e) => onChange({ editedText: e.target.value })} />
          <button type="button" className="btn btn-line mt-1" onClick={() => setEditing(false)}>
            Done
          </button>
        </div>
      ) : (
        <BankPrompt item={item} />
      )}
      {!editing && item.form === 'mcq' && (
        <ol className="gen-options">
          {item.options.map((o, i) => (
            <li key={i}>
              <RichText text={o.text} className="rich-inline" />
            </li>
          ))}
        </ol>
      )}
      {!editing && item.form === 'numeric' && item.parts.length > 1 && (
        <ol className="gen-options">
          {item.parts.map((p, i) => (
            <li key={i}>
              {p.ask} [{p.marks}]
            </li>
          ))}
        </ol>
      )}
      <div className="gen-actions no-print">
        <button type="button" className="btn btn-quiet" disabled={entry.locked || busy} onClick={onRegenerate}>
          <RefreshCw size={14} aria-hidden /> Regenerate
        </button>
        <button type="button" className="btn btn-quiet" aria-pressed={Boolean(entry.locked)} onClick={() => onChange({ locked: !entry.locked })}>
          {entry.locked ? <Lock size={14} aria-hidden /> : <LockOpen size={14} aria-hidden />} {entry.locked ? 'Locked' : 'Lock'}
        </button>
        <button type="button" className="btn btn-quiet" disabled={!canMove[0]} aria-label={`Move question ${number} up`} onClick={() => onMove(-1)}>
          <ArrowUp size={14} aria-hidden />
        </button>
        <button type="button" className="btn btn-quiet" disabled={!canMove[1]} aria-label={`Move question ${number} down`} onClick={() => onMove(1)}>
          <ArrowDown size={14} aria-hidden />
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => setEditing((e) => !e)}>
          <PenLine size={14} aria-hidden /> Edit wording
        </button>
        <button type="button" className="btn btn-quiet" aria-label={`Delete question ${number}`} onClick={() => onChange(null)}>
          <Trash2 size={14} aria-hidden />
        </button>
        <ReportProblem item={item} />
      </div>
    </li>
  );
}

/** What goes to the printer. The screen doesn't show it, and print shows nothing else. */
function PrintSheet({ paper, kind }: { paper: TeacherPaper; kind: 'paper' | 'key' }) {
  const shown = useMemo(() => arranged(paper), [paper]);
  const { header, options } = shown;
  const anyGenerated = allItems(shown).some((i) => i.question.item.generated);
  let number = 0;
  return (
    <div className="gen-print" style={{ fontSize: `${options.fontSize}pt` }} data-testid="print-sheet" data-kind={kind}>
      <header className="gen-print-head">
        {header.school && <p className="font-semibold">{header.school}</p>}
        <h1>
          {header.exam}
          {shown.setName ? `, Set ${shown.setName}` : ''}
          {kind === 'key' ? ': answer key and marking scheme' : ''}
        </h1>
        <p>{[header.classSection && `Class: ${header.classSection}`, header.date && `Date: ${header.date}`, header.time && `Time allowed: ${header.time}`, header.maxMarks && `Maximum marks: ${header.maxMarks}`].filter(Boolean).join('   ·   ')}</p>
      </header>
      {kind === 'paper' && header.instructions && (
        <ul className="gen-instructions">
          {header.instructions.split('\n').filter(Boolean).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      {anyGenerated && <p className="gen-legend gen-print-legend">{kind === 'key' ? `${GENERATED_NOTICE} Check the answers before use.` : `Questions with a die mark are generated. ${PAPER_NOTICE}`}</p>}
      {shown.sections.map((section) => (
        <section key={section.name} className="gen-print-section">
          {shown.sections.length > 1 && <h2>{section.name}</h2>}
          {kind === 'paper' && section.note && <p className="gen-note-line">{section.note}</p>}
          {section.items.map((entry) => {
            number += 1;
            const item = withEdit(entry);
            if (kind === 'key') {
              return (
                <div key={entry.key} className="gen-print-q" data-generated={item.generated ? true : undefined}>
                  <p className="font-semibold">
                    Question {number} <GeneratedMark item={item} /> [{item.marks}]
                  </p>
                  <ul className="gen-key-lines">
                    {answerLines(item).map((line, i) => (
                      <li key={i}>
                        <RichText text={line} className="rich-inline" />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <div key={entry.key} className="gen-print-q" data-generated={item.generated ? true : undefined} data-testid="print-question">
                <p className="gen-print-num">
                  <span className="font-semibold">{number}.</span> <GeneratedMark item={item} />
                  {options.showMarks && <span className="bank-marks">[{item.marks}]</span>}
                </p>
                {options.diagrams ? <BankPrompt item={item} /> : <BankPrompt item={{ ...item, diagram: undefined }} />}
                {item.form === 'mcq' && (
                  <ol className="gen-options">
                    {item.options.map((o, i) => (
                      <li key={i}>
                        <RichText text={o.text} className="rich-inline" />
                      </li>
                    ))}
                  </ol>
                )}
                {item.form === 'numeric' && item.parts.length > 1 && (
                  <ol className="gen-options">
                    {item.parts.map((p, i) => (
                      <li key={i}>
                        {p.ask} [{p.marks}]
                      </li>
                    ))}
                  </ol>
                )}
                {Array.from({ length: options.answerLines }, (_, i) => (
                  <div key={i} className="gen-answer-line" />
                ))}
              </div>
            );
          })}
        </section>
      ))}
      {anyGenerated && kind === 'paper' && <footer className="gen-print-footer">{STUDENT_FOOTER}</footer>}
    </div>
  );
}

function Review({ paper, onChange, onClose, sets, onSets }: { paper: TeacherPaper; onChange: (p: TeacherPaper) => void; onClose: () => void; sets: TeacherPaper[]; onSets: (s: TeacherPaper[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [printKind, setPrintKind] = useState<'paper' | 'key'>('paper');
  const [saved, setSaved] = useState('');
  const set = (field: keyof TeacherPaper['header'], value: string) => onChange({ ...paper, header: { ...paper.header, [field]: value } });
  const setOption = (change: Partial<TeacherPaper['options']>) => onChange({ ...paper, options: { ...paper.options, ...change } });
  const anyGenerated = allItems(paper).some((i) => i.question.item.generated);

  const print = (kind: 'paper' | 'key') => {
    setPrintKind(kind);
    window.setTimeout(() => window.print(), 50);
  };

  const word = async (kind: 'paper' | 'key') => {
    setBusy(true);
    try {
      const { buildDocx } = await import('../practice/gen/docx');
      const blob = await buildDocx(arranged(paper), kind);
      saveBlob(blob, `${paper.header.exam.replace(/[^\w]+/g, '-')}${paper.setName ? `-Set-${paper.setName}` : ''}${kind === 'key' ? '-answer-key' : ''}.docx`);
    } finally {
      setBusy(false);
    }
  };

  const exportFile = () => saveBlob(new Blob([paperToFile(paper)], { type: 'application/json' }), `${paper.header.exam.replace(/[^\w]+/g, '-')}.paper.json`);

  let number = 0;
  return (
    <>
      <div className="no-print" data-testid="generator-review">
        <button type="button" className="btn btn-quiet" onClick={onClose}>
          ← Change the choices
        </button>
        <h1 className="mt-2 text-step-3">
          Review: {paper.title}
        </h1>
        <p className="mt-1 text-ink-2" data-testid="review-summary">
          {allItems(paper).length} questions, {totalMarks(paper)} marks. Seed {paper.seed}.
        </p>
        {paper.shortfall && (
          <p className="notice" data-tone="bad" role="alert" data-testid="shortfall">
            {paper.shortfall}
          </p>
        )}
        {anyGenerated && (
          <p className="gen-legend" data-testid="review-notice">
            <Dices size={14} aria-hidden className="inline" /> {GENERATED_NOTICE}
          </p>
        )}

        {sets.length > 1 && (
          <div className="seg mt-3" role="group" aria-label="Sets">
            {sets.map((s) => (
              <button key={s.id} type="button" aria-pressed={s.id === paper.id} onClick={() => onChange(s)}>
                Set {s.setName}
              </button>
            ))}
          </div>
        )}

        <section className="today-section" aria-labelledby="header-h">
          <h2 id="header-h">Paper header</h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Field id="head-school" label="School name" value={paper.header.school} onChange={(v) => set('school', v)} />
            <Field id="head-exam" label="Exam title" value={paper.header.exam} onChange={(v) => set('exam', v)} />
            <Field id="head-class" label="Class or section" value={paper.header.classSection} onChange={(v) => set('classSection', v)} />
            <Field id="head-date" label="Date" value={paper.header.date} onChange={(v) => set('date', v)} />
            <Field id="head-time" label="Time allowed" value={paper.header.time} onChange={(v) => set('time', v)} />
            <Field id="head-marks" label="Maximum marks" value={paper.header.maxMarks} onChange={(v) => set('maxMarks', v)} />
          </div>
          <div className="mt-2">
            <label className="lbl" htmlFor="head-instructions">
              General instructions
            </label>
            <textarea id="head-instructions" className="field" rows={4} value={paper.header.instructions} onChange={(e) => set('instructions', e.target.value)} />
          </div>
        </section>

        <section className="today-section" aria-labelledby="options-h">
          <h2 id="options-h">Options</h2>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <Check label="Shuffle questions" checked={paper.options.shuffleQuestions} onChange={() => setOption({ shuffleQuestions: !paper.options.shuffleQuestions })} />
            <Check label="Shuffle MCQ options" checked={paper.options.shuffleOptions} onChange={() => setOption({ shuffleOptions: !paper.options.shuffleOptions })} />
            <Check label="Include diagrams" checked={paper.options.diagrams} onChange={() => setOption({ diagrams: !paper.options.diagrams })} />
            <Check label="Show marks" checked={paper.options.showMarks} onChange={() => setOption({ showMarks: !paper.options.showMarks })} />
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Field id="opt-lines" label="Lines for answers, per question" type="number" min={0} value={String(paper.options.answerLines)} onChange={(v) => setOption({ answerLines: Math.max(0, Math.min(30, Number(v) || 0)) })} />
            <Field id="opt-font" label="Font size for printing (pt)" type="number" min={8} value={String(paper.options.fontSize)} onChange={(v) => setOption({ fontSize: Math.max(8, Math.min(18, Number(v) || 12)) })} />
          </div>
        </section>

        <section className="today-section" aria-labelledby="questions-h">
          <h2 id="questions-h">Questions</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-line"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                onChange(await regenerateUnlocked(paper, freshSeed()));
                setBusy(false);
              }}
            >
              <RefreshCw size={15} aria-hidden /> Regenerate all unlocked
            </button>
            <button
              type="button"
              className="btn btn-line"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                const made = await makeSets(paper, ['A', 'B', 'C'], freshSeed());
                onSets(made);
                onChange(made[0]);
                setBusy(false);
              }}
            >
              <Dices size={15} aria-hidden /> Make Sets A, B and C
            </button>
          </div>
          {paper.sections.map((section) => (
            <div key={section.name} className="mt-3">
              {paper.sections.length > 1 && <h3 className="font-semibold">{section.name}</h3>}
              {section.note && <p className="text-ink-2">{section.note}</p>}
              <ol className="m-0 list-none p-0">
                {section.items.map((entry, i) => {
                  number += 1;
                  return (
                    <ReviewItem
                      key={entry.key}
                      entry={entry}
                      number={number}
                      busy={busy}
                      canMove={[i > 0, i < section.items.length - 1]}
                      onChange={(change) => onChange(change === null ? deleteItem(paper, entry.key) : updateItem(paper, entry.key, change))}
                      onMove={(by) => onChange(moveItem(paper, entry.key, by))}
                      onDrop={(from) => onChange(moveItemTo(paper, from, entry.key))}
                      onRegenerate={async () => {
                        setBusy(true);
                        onChange(await regenerateItem(paper, entry.key, freshSeed()));
                        setBusy(false);
                      }}
                    />
                  );
                })}
              </ol>
            </div>
          ))}
        </section>

        <section className="today-section" aria-labelledby="export-h">
          <h2 id="export-h">Print, save and share</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" className="btn btn-solid" onClick={() => print('paper')}>
              <Printer size={15} aria-hidden /> Print the paper
            </button>
            <button type="button" className="btn btn-line" onClick={() => print('key')}>
              <Printer size={15} aria-hidden /> Print the answer key
            </button>
            <button type="button" className="btn btn-line" disabled={busy} onClick={() => void word('paper')}>
              <FileText size={15} aria-hidden /> Word: the paper
            </button>
            <button type="button" className="btn btn-line" disabled={busy} onClick={() => void word('key')}>
              <FileText size={15} aria-hidden /> Word: the answer key
            </button>
            <button
              type="button"
              className="btn btn-line"
              onClick={() => {
                savePaper(paper);
                setSaved('Saved on this device.');
              }}
            >
              <Save size={15} aria-hidden /> Save
            </button>
            <button type="button" className="btn btn-line" onClick={exportFile}>
              <Download size={15} aria-hidden /> Export as a file
            </button>
          </div>
          {saved && (
            <p className="mt-1 text-ink-2" role="status">
              {saved}
            </p>
          )}
          <p className="mt-2 text-step--1 text-ink-2">To save as a PDF, choose "Save as PDF" as the printer.</p>
        </section>
      </div>
      <PrintSheet paper={paper} kind={printKind} />
    </>
  );
}

export default function GeneratorView() {
  const presets = useStore(presetsStore);
  const history = useStore(teacherHistoryStore);
  const share = useStore(teacherShareStore);
  const [filters, setFilters] = useState<Filters>(() => emptyFilters());
  const [mode, setMode] = useState<'set' | 'paper'>('set');
  const [countMode, setCountMode] = useState<'count' | 'marks'>('count');
  const [amount, setAmount] = useState('10');
  const [paperLevel, setPaperLevel] = useState<ClassLevel>('XII');
  const [structureKind, setStructureKind] = useState<'official' | 'custom'>('official');
  const [custom, setCustom] = useState<CustomSection[]>([{ name: 'Section A', count: 10, marks: 1, formats: [] }, { name: 'Section B', count: 5, marks: 3, formats: [] }]);
  const [avoid, setAvoid] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [paper, setPaper] = useState<TeacherPaper | null>(null);
  const [sets, setSets] = useState<TeacherPaper[]>([]);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const effective = useMemo(() => ({ ...filters, share }), [filters, share]);
  const syllabus = useAsync(() => loadSyllabus(filters.subject), filters.subject);
  const label = getSubject(filters.subject).label;
  const isCs = filters.subject === 'computerscience';

  useEffect(() => {
    document.title = 'Generate questions: ISC Formula Book';
  }, []);

  const available = useAsync(() => countAvailable(effective, avoid ? usedInHistory() : new Set()), JSON.stringify([effective.subject, effective.levels, effective.units, effective.topics, effective.formats, effective.styles, effective.difficulties, effective.marks, avoid]));

  const structure = useMemo(() => (mode === 'paper' ? (structureKind === 'official' ? officialStructure(filters.subject, paperLevel) : custom) : []), [mode, structureKind, filters.subject, paperLevel, custom]);
  const sectionBank = useAsync(() => bankForSections(effective, paperLevel, structure, avoid ? usedInHistory() : new Set()), JSON.stringify([effective.subject, effective.units, effective.topics, effective.formats, effective.styles, effective.difficulties, paperLevel, structure, avoid]));
  const plan = useMemo(() => {
    if (available.status !== 'ready') return null;
    if (mode === 'paper') {
      if (sectionBank.status !== 'ready') return null;
      return planShare(structure.map((s, i) => ({ marks: s.marks, count: s.count, bankHas: sectionBank.value[i] ?? 0, worth: s.choose ? (s.marks * s.choose) / s.count : undefined })), share);
    }
    const count = Math.max(1, Number(amount) || 1);
    if (countMode === 'marks') {
      const typical = 2;
      const questions = Math.max(1, Math.round(count / typical));
      return { ...planShare([{ marks: typical, count: questions, bankHas: available.value.bank }], share), marks: count, generatedMarks: Math.round((generatedCount(questions, share) * count) / questions) };
    }
    return planShare([{ marks: 2, count, bankHas: available.value.bank }], share);
  }, [available, sectionBank, mode, structure, share, amount, countMode]);

  const generate = async () => {
    setBusy(true);
    setProblem('');
    setSets([]);
    try {
      const seed = freshSeed();
      const skip = avoid ? usedInHistory() : new Set<string>();
      const made = mode === 'set' ? await buildQuestionSet(effective, { mode: countMode, value: Math.max(1, Number(amount) || 1) }, label, seed, skip) : await buildFullPaper(effective, paperLevel, structure, label, seed, skip);
      if (!allItems(made).length) setProblem('Nothing matches these choices. Try fewer filters.');
      else setPaper(made);
    } catch (err) {
      setProblem(err instanceof Error ? err.message : 'The questions could not be generated.');
    }
    setBusy(false);
    document.getElementById('main')?.scrollTo({ top: 0 });
  };

  const importFile = async (file: File) => {
    try {
      setPaper(paperFromFile(await file.text()));
      setProblem('');
    } catch (err) {
      setProblem(err instanceof Error ? err.message : 'That file could not be read.');
    }
  };

  if (paper) {
    return (
      <div className="page" data-subject={paper.filters.subject}>
        <div className="page-pad max-w-[56rem]">
          <Review paper={paper} sets={sets} onSets={setSets} onClose={() => setPaper(null)} onChange={(p) => {
            setPaper(p);
            setSets((list) => list.map((s) => (s.id === p.id ? p : s)));
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className="page" data-subject={filters.subject}>
      <div className="page-pad max-w-[56rem]">
        <h1 className="text-step-3">Generate questions</h1>
        <p className="mt-2 max-w-[65ch] text-ink-2">Make a worksheet or a whole paper, offline. Every filter is optional, and leaving one empty means all. Generated questions are marked, and aren’t official ISC questions, so please check them before use.</p>

        <div className="seg mt-3" role="group" aria-label="What to make">
          <button type="button" aria-pressed={mode === 'set'} onClick={() => setMode('set')}>
            Question set
          </button>
          <button type="button" aria-pressed={mode === 'paper'} onClick={() => setMode('paper')}>
            Full paper
          </button>
        </div>

        <section className="today-section" aria-labelledby="what-h">
          <h2 id="what-h">What to include</h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div>
              <label className="lbl" htmlFor="gen-subject">
                Subject
              </label>
              <select id="gen-subject" className="field" value={filters.subject} onChange={(e) => setFilters(emptyFilters(e.target.value as SubjectId))}>
                {manifest.subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            {mode === 'paper' ? (
              <div>
                <label className="lbl" htmlFor="gen-level">
                  Class
                </label>
                <select id="gen-level" className="field" value={paperLevel} onChange={(e) => setPaperLevel(e.target.value as ClassLevel)}>
                  <option value="XI">Class XI</option>
                  <option value="XII">Class XII</option>
                </select>
              </div>
            ) : (
              <fieldset className="gen-group">
                <legend className="lbl">Class</legend>
                <Check label="Class XI" checked={filters.levels.includes('XI')} onChange={() => setFilters({ ...filters, levels: toggle(filters.levels, 'XI') })} />
                <Check label="Class XII" checked={filters.levels.includes('XII')} onChange={() => setFilters({ ...filters, levels: toggle(filters.levels, 'XII') })} />
              </fieldset>
            )}
          </div>
          {syllabus.status === 'ready' && <ChapterPicker syllabus={syllabus.value} filters={mode === 'paper' ? { ...filters, levels: [paperLevel] } : filters} onChange={(f) => setFilters({ ...f, levels: filters.levels })} />}
          <fieldset className="gen-group mt-2">
            <legend className="lbl">Format</legend>
            <div className="gen-checks">
              {FORMATS.filter((f) => !f.cs || isCs).map((f) => (
                <Check key={f.key} label={f.label} checked={filters.formats.includes(f.key)} onChange={() => setFilters({ ...filters, formats: toggle(filters.formats, f.key) })} />
              ))}
            </div>
          </fieldset>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <fieldset className="gen-group">
              <legend className="lbl">Style</legend>
              <Check label="Paper-style" checked={filters.styles.includes('paper-style')} onChange={() => setFilters({ ...filters, styles: toggle(filters.styles, 'paper-style') })} />
              <Check label="CBQ-style" checked={filters.styles.includes('cbq-style')} onChange={() => setFilters({ ...filters, styles: toggle(filters.styles, 'cbq-style') })} />
            </fieldset>
            <fieldset className="gen-group">
              <legend className="lbl">Difficulty</legend>
              {([[1, 'Easy'], [2, 'Medium'], [3, 'Hard']] as [Difficulty, string][]).map(([d, name]) => (
                <Check key={d} label={name} checked={filters.difficulties.includes(d)} onChange={() => setFilters({ ...filters, difficulties: toggle(filters.difficulties, d) })} />
              ))}
            </fieldset>
            <fieldset className="gen-group">
              <legend className="lbl">Marks per question</legend>
              <div className="gen-checks">
                {[1, 2, 3, 5, 10].map((m) => (
                  <Check key={m} label={String(m)} checked={filters.marks.includes(m)} onChange={() => setFilters({ ...filters, marks: toggle(filters.marks, m) })} />
                ))}
              </div>
            </fieldset>
          </div>
        </section>

        {mode === 'set' ? (
          <section className="today-section" aria-labelledby="size-h">
            <h2 id="size-h">How much</h2>
            <div className="seg mt-2" role="group" aria-label="Measure by">
              <button type="button" aria-pressed={countMode === 'count'} onClick={() => setCountMode('count')}>
                Number of questions
              </button>
              <button type="button" aria-pressed={countMode === 'marks'} onClick={() => setCountMode('marks')}>
                Total marks
              </button>
            </div>
            <div className="mt-2 max-w-[12rem]">
              <Field id="gen-amount" label={countMode === 'count' ? 'Questions' : 'Marks'} type="number" min={1} value={amount} onChange={setAmount} />
            </div>
          </section>
        ) : (
          <section className="today-section" aria-labelledby="structure-paper-h">
            <h2 id="structure-paper-h">Structure</h2>
            <div className="seg mt-2" role="group" aria-label="Structure of the paper">
              <button type="button" aria-pressed={structureKind === 'official'} onClick={() => setStructureKind('official')}>
                Official ISC
              </button>
              <button type="button" aria-pressed={structureKind === 'custom'} onClick={() => setStructureKind('custom')}>
                Build my own
              </button>
            </div>
            {structureKind === 'official' ? (
              <ul className="m-0 mt-2 list-none p-0" data-testid="official-structure">
                {structure.map((s) => (
                  <li key={s.name} className="border-b border-rule py-1">
                    <span className="font-semibold">{s.name}.</span> {s.count} × {s.marks} {s.marks === 1 ? 'mark' : 'marks'}
                    {s.choose ? `, attempt any ${s.choose}` : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <CustomStructureEditor parts={custom} onChange={setCustom} />
            )}
          </section>
        )}

        <section className="today-section" aria-labelledby="source-h">
          <h2 id="source-h">Source</h2>
          {plan && <ShareSlider value={share} onChange={(v) => teacherShareStore.set(v)} message={describePlan(plan)} warning={plan.raised} />}
          {available.status === 'ready' && (
            <p className="mt-1 text-step--1 text-ink-2" data-testid="available">
              For these choices, the bank has {available.value.bank} questions, and there are {available.value.blueprints} blueprints that can make new ones.
            </p>
          )}
          <label className="switch-row mt-1">
            <input type="checkbox" checked={avoid} onChange={(e) => setAvoid(e.target.checked)} /> Don’t reuse questions from papers I’ve saved
          </label>
        </section>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-solid" disabled={busy} onClick={() => void generate()}>
            <Wand2 size={15} aria-hidden /> {busy ? 'Generating' : mode === 'set' ? 'Generate the questions' : 'Generate the paper'}
          </button>
          <button type="button" className="btn btn-line" onClick={() => fileRef.current?.click()}>
            <FileUp size={15} aria-hidden /> Open a paper file
          </button>
          <input ref={fileRef} data-testid="paper-file" className="sr-only" type="file" accept=".json,application/json" tabIndex={-1} aria-hidden onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void importFile(file);
            e.target.value = '';
          }} />
        </div>
        {problem && (
          <p className="notice" data-tone="bad" role="alert">
            {problem}
          </p>
        )}

        <section className="today-section" aria-labelledby="presets-h">
          <h2 id="presets-h">Presets</h2>
          <div className="mt-2 flex flex-wrap items-end gap-2">
            <div className="min-w-[14rem]">
              <Field id="preset-name" label="Name for these choices" value={presetName} onChange={setPresetName} />
            </div>
            <button
              type="button"
              className="btn btn-line"
              disabled={!presetName.trim()}
              onClick={() => {
                savePreset(presetName.trim(), effective);
                setPresetName('');
              }}
            >
              Save preset
            </button>
          </div>
          {presets.length > 0 && (
            <ul className="m-0 mt-2 list-none p-0">
              {presets.map((p) => (
                <li key={p.name} className="border-b border-rule py-1">
                  <button type="button" className="btn btn-quiet" onClick={() => {
                    setFilters(p.filters);
                    teacherShareStore.set(p.filters.share);
                  }}>
                    Use {p.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {history.length > 0 && (
          <section className="today-section" aria-labelledby="saved-h">
            <h2 id="saved-h">Saved papers</h2>
            <ul className="m-0 mt-2 list-none p-0">
              {history.map((p) => (
                <li key={p.id} className="gen-saved">
                  <span>
                    {p.title}: {allItems(p).length} questions, {totalMarks(p)} marks
                  </span>
                  <span className="flex gap-1">
                    <button type="button" className="btn btn-quiet" onClick={() => setPaper(p)}>
                      Open
                    </button>
                    <button type="button" className="btn btn-quiet" aria-label={`Delete ${p.title}`} onClick={() => deletePaper(p.id)}>
                      <Trash2 size={14} aria-hidden />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
