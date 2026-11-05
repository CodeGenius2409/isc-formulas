import { Suspense, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { PenLine, Plus, Trash2 } from 'lucide-react';
import { FormulaRow } from '../components/FormulaRow';
import { StructureSection, type StructureMode } from '../components/custom/StructureSection';
import { RetryBoundary } from '../components/RetryBoundary';
import { equationFromLatex, equationProblem } from '../custom/entry';
import { additions } from '../custom/merge';
import { customBackupStore, customStore, ensureCustomLoaded, findCustom, newCustomId, saveCustom, unsavedCount, type CustomFormula, type CustomVariable } from '../custom/store';
import { getClass, manifest, splitUnitName, unitTitle } from '../data/book';
import type { ClassLevel, Formula, SubjectId } from '../data/types';
import { ensureKatex, latexProblem, useKatexReady } from '../lib/katex';
import { lazyRetry } from '../lib/retry-import';
import { navigate, useRoute } from '../lib/router';
import { useStore } from '../lib/store';
import { lastPlaceStore, lastReadStore } from '../state/library';
import { toast } from '../state/toast';

const MathField = lazyRetry(() => import('../components/custom/MathField'));

const NEW_SECTION = '__new__';

/** What was on the page when it went away. A reload, including one that picks up an update, brings it back. */
const DRAFT_KEY = 'isc-editor-draft';

interface Draft {
  where: string;
  latex: string;
  name: string;
  note: string;
  variables: CustomVariable[];
  equation: string;
  mode: StructureMode;
  smiles: string;
  lewisId: string;
  structureWanted: boolean;
  subject: SubjectId;
  level: ClassLevel;
  unit: string;
  section: string;
  newSection: string;
  step: 1 | 2;
}

function readDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Draft;
    return draft.where === window.location.hash ? draft : null;
  } catch {
    return null;
  }
}

function forgetDraft(): void {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Nothing was kept, then.
  }
}

function keepDraft(draft: Draft): void {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage is blocked, so a reload loses it, as it would anywhere.
  }
}

/** The editor: first the formula itself, and last where it goes. */
export default function FormulaEditor({ editId }: { editId: string | null }) {
  const route = useRoute();
  const custom = useStore(customStore);
  const last = useStore(lastReadStore);
  const existing = editId ? custom.formulas.find((f) => f.id === editId) : undefined;
  const q = route.query;
  const place = useStore(lastPlaceStore);
  const startSubject = (q.get('subject') as SubjectId | null) ?? place?.subject ?? last?.subject ?? 'physics';
  const startLevel = (q.get('level') as ClassLevel | null) ?? place?.level ?? last?.classLevel ?? 'XI';

  const [draft] = useState(readDraft);
  const [step, setStep] = useState<1 | 2>(draft?.step ?? 1);
  const [latex, setLatex] = useState(draft?.latex ?? '');
  const [visual, setVisual] = useState(true);
  const [mathFailed, setMathFailed] = useState(false);
  const [name, setName] = useState(draft?.name ?? '');
  const [note, setNote] = useState(draft?.note ?? '');
  const [variables, setVariables] = useState<CustomVariable[]>(draft?.variables ?? []);
  const [equation, setEquation] = useState(draft?.equation ?? '');
  const [mode, setMode] = useState<StructureMode>(draft?.mode ?? 'none');
  const [structureWanted, setStructureWanted] = useState(draft?.structureWanted ?? false);
  const [smiles, setSmiles] = useState(draft?.smiles ?? '');
  const [smilesOk, setSmilesOk] = useState(false);
  const [lewisId, setLewisId] = useState(draft?.lewisId ?? '');
  const [subject, setSubject] = useState<SubjectId>(draft?.subject ?? startSubject);
  const [level, setLevel] = useState<ClassLevel>(draft?.level ?? startLevel);
  const [unit, setUnit] = useState(draft?.unit ?? q.get('unit') ?? '');
  const [section, setSection] = useState(draft?.section ?? q.get('sub') ?? '');
  const [newSection, setNewSection] = useState(draft?.newSection ?? '');
  const [problems, setProblems] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(Boolean(draft));
  const labelId = useId();
  const katexReady = useKatexReady();

  // The section follows the address, not only the address it opened with. What's been typed stays.
  const askedSubject = q.get('subject') as SubjectId | null;
  const askedLevel = q.get('level') as ClassLevel | null;
  const askedUnit = q.get('unit');
  const askedSection = q.get('sub');
  const [asked, setAsked] = useState(`${askedSubject} ${askedLevel} ${askedUnit} ${askedSection}`);
  if (asked !== `${askedSubject} ${askedLevel} ${askedUnit} ${askedSection}`) {
    setAsked(`${askedSubject} ${askedLevel} ${askedUnit} ${askedSection}`);
    if (askedSubject) setSubject(askedSubject);
    if (askedLevel) setLevel(askedLevel);
    setUnit(askedUnit ?? '');
    setSection(askedSection ?? '');
  }

  // Chemistry always offers it. Anywhere else it's one press away, or already open if you've chosen one.
  const showStructure = subject === 'chemistry' || structureWanted || mode !== 'none';

  // Only once this is really on screen: a first render can be thrown away and run again.
  useEffect(forgetDraft, []);

  const discarded = useRef(false);
  useEffect(() => {
    const keep = () => {
      if (!discarded.current && (latex.trim() || name.trim() || note.trim() || smiles.trim() || variables.length)) {
        keepDraft({ where: window.location.hash, latex, name, note, variables, equation, mode, smiles, lewisId, structureWanted, subject, level, unit, section, newSection, step });
      }
    };
    window.addEventListener('pagehide', keep);
    return () => window.removeEventListener('pagehide', keep);
  });

  useEffect(() => {
    void ensureKatex();
    void ensureCustomLoaded();
  }, []);

  // An edit starts from what is saved, once that has been read.
  useEffect(() => {
    if (loaded || !existing) return;
    setLoaded(true);
    setLatex(existing.latex);
    setName(existing.name);
    setNote(existing.note ?? '');
    setVariables(existing.variables ?? []);
    setEquation(existing.equation ?? '');
    setSmiles(existing.smiles ?? '');
    setMode(existing.smiles ? (existing.smiles.includes('>>') ? 'reaction' : 'smiles') : existing.lewis?.length ? 'lewis' : 'none');
    setLewisId(existing.lewis?.[0] ?? '');
    setSubject(existing.subject);
    setLevel(existing.level);
    setUnit(existing.unit);
    setSection(existing.subtopic);
  }, [existing, loaded]);

  useEffect(() => {
    document.title = `${editId ? 'Edit' : 'Add'} a formula: ISC Formula Book`;
  }, [editId]);

  const units = getClass(subject, level)?.units ?? [];
  const unitNumber = unit || (units[0] ? splitUnitName(units[0].name).number : '');
  const unitIndex = units.findIndex((u) => splitUnitName(u.name).number === unitNumber);
  const chosenUnit = units[unitIndex];
  const extraSections = useMemo(() => additions(custom.formulas, subject, level).get(unitIndex)?.extraSections.map((s) => s.name) ?? [], [custom.formulas, subject, level, unitIndex]);
  const sectionNames = [...(chosenUnit?.subtopics.map((s) => s.name) ?? []), ...extraSections];
  const sectionChoice = section === NEW_SECTION || sectionNames.includes(section) ? section : (sectionNames[0] ?? NEW_SECTION);
  const finalSection = sectionChoice === NEW_SECTION ? newSection.trim() : sectionChoice;

  const texError = katexReady && latex.trim() ? latexProblem(latex) : null;
  const eqError = equation.trim() ? equationProblem(equation, variables.filter((v) => v.symbol.trim())) : null;
  const guess = useMemo(() => (variables.length && !equation.trim() ? equationFromLatex(latex) : null), [variables.length, equation, latex]);

  const onLatexFromField = useCallback((value: string) => setLatex(value), []);
  const onSmilesResult = useCallback((ok: boolean) => setSmilesOk(ok), []);

  const preview: Formula = {
    id: existing?.id ?? 'u-preview',
    name: name.trim() || 'Your formula',
    latex: latex.trim() || '\\square',
    note: note.trim() || undefined,
    custom: 1,
    subject,
    classLevel: level,
    unit: chosenUnit?.name ?? '',
    unitIndex: Math.max(unitIndex, 0),
    subtopic: finalSection,
    subtopicIndex: 0,
    number: '1.1.1',
  };

  const checkFirstStep = (): string[] => {
    const list: string[] = [];
    if (!latex.trim()) list.push('Write the formula first.');
    if (texError) list.push('The formula has an error to fix.');
    if (!name.trim()) list.push('Give it a name. The name is how you will find it.');
    if (eqError) list.push(`The equation for solving: ${eqError}`);
    if ((mode === 'smiles' || mode === 'reaction') && smiles.trim() && !smilesOk) list.push('The structure can\'t be read. Fix it, or set Structure to None.');
    return list;
  };

  const goNext = () => {
    const list = checkFirstStep();
    setProblems(list);
    if (!list.length) {
      setStep(2);
      document.getElementById('main')?.scrollTo({ top: 0 });
    }
  };

  const save = async () => {
    if (!finalSection) {
      setProblems(['Name the new section.']);
      return;
    }
    const now = Date.now();
    const vars = variables.filter((v) => v.symbol.trim() || v.meaning.trim());
    const record: CustomFormula = {
      id: existing?.id ?? newCustomId(),
      name: name.trim(),
      latex: latex.trim(),
      note: note.trim() || undefined,
      variables: vars.length ? vars : undefined,
      equation: equation.trim() || undefined,
      smiles: (mode === 'smiles' || mode === 'reaction') && smilesOk ? smiles.trim() : undefined,
      lewis: mode === 'lewis' && lewisId ? [lewisId] : undefined,
      subject,
      level,
      unit: unitNumber,
      subtopic: finalSection,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await saveCustom(record);
    const unsaved = unsavedCount(customStore.get().formulas.length, customBackupStore.get());
    toast(unsaved && !existing ? `Saved. You have ${unsaved} formulas with no backup yet.` : existing ? 'Changes saved' : 'Formula saved');
    navigate(`book/${subject}/${level}/${Math.max(unitIndex, 0)}`, { hl: record.id });
  };

  if (editId && custom.status !== 'loading' && !findCustom(editId)) {
    return (
      <div className="page-pad">
        <h1 className="text-step-3">That formula isn't here</h1>
        <p className="mt-2 text-ink-2">It may have been deleted. Only your own formulas can be edited.</p>
      </div>
    );
  }

  return (
    <div className="page" data-subject={subject}>
      <div className="page-pad max-w-[46rem]">
        <h1 className="text-step-3">{editId ? 'Edit your formula' : 'Add a formula'}</h1>
        <p className="mt-1 text-ink-2">Step {step} of 2: {step === 1 ? 'the formula' : 'where it goes'}</p>
        {custom.status === 'unavailable' && (
          <p className="notice" data-tone="bad" role="alert">
            This browser isn't allowing storage, perhaps because of private browsing. You can add formulas, but they will be gone when this page closes.
          </p>
        )}

        {step === 1 && (
          <>
            <div className="mt-3">
              <div className="flex items-end justify-between gap-2">
                <span className="lbl" id={labelId}>
                  Formula
                </span>
                {!mathFailed && (
                  <div className="seg" role="group" aria-label="How to write it">
                    <button type="button" aria-pressed={visual} onClick={() => setVisual(true)}>
                      Visual
                    </button>
                    <button type="button" aria-pressed={!visual} onClick={() => setVisual(false)}>
                      LaTeX
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-1">
                {visual && !mathFailed ? (
                  <RetryBoundary message="Couldn't load the visual editor. Try again, or use the LaTeX box above.">
                    <Suspense fallback={<p className="field text-ink-3">Opening the maths editor</p>}>
                      <MathField value={latex} onChange={onLatexFromField} labelledBy={labelId} onUnavailable={() => setMathFailed(true)} />
                    </Suspense>
                  </RetryBoundary>
                ) : (
                  <textarea className="field num" rows={3} aria-labelledby={labelId} autoComplete="off" spellCheck={false} value={latex} placeholder="F = ma" onChange={(e) => setLatex(e.target.value)} />
                )}
              </div>
              {texError && (
                <p className="var-warn mt-1" role="alert" data-testid="latex-error">
                  {texError}
                </p>
              )}
            </div>

            <div className="mt-3">
              <label className="lbl" htmlFor="custom-name">
                Name
              </label>
              <input id="custom-name" className="field" autoComplete="off" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mt-3">
              <label className="lbl" htmlFor="custom-note">
                Note <small>optional</small>
              </label>
              <input id="custom-note" className="field" autoComplete="off" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>

            <section className="today-section" aria-labelledby="preview-h">
              <h2 id="preview-h">How it will look</h2>
              <div className="ruled custom-preview mt-1" data-testid="custom-preview">
                <FormulaRow formula={preview} open={false} onToggle={noop} preview />
              </div>
            </section>

            <section className="today-section" aria-labelledby="vars-h">
              <h2 id="vars-h">Variables</h2>
              <p className="mt-1 text-ink-2">Optional. They let you find this by symbol. With an equation too, the solver can use it.</p>
              {variables.map((v, i) => (
                <div key={i} className="custom-variable">
                  <input className="field num" aria-label={`Symbol ${i + 1}`} placeholder="F" autoComplete="off" spellCheck={false} value={v.symbol} onChange={(e) => setVariables((list) => list.map((x, j) => (j === i ? { ...x, symbol: e.target.value } : x)))} />
                  <input className="field" aria-label={`Meaning of symbol ${i + 1}`} placeholder="Force" autoComplete="off" value={v.meaning} onChange={(e) => setVariables((list) => list.map((x, j) => (j === i ? { ...x, meaning: e.target.value } : x)))} />
                  <input className="field num" aria-label={`Unit of symbol ${i + 1}`} placeholder="N" autoComplete="off" spellCheck={false} value={v.unit} onChange={(e) => setVariables((list) => list.map((x, j) => (j === i ? { ...x, unit: e.target.value } : x)))} />
                  <button type="button" className="btn btn-quiet" aria-label={`Remove symbol ${i + 1}`} onClick={() => setVariables((list) => list.filter((_, j) => j !== i))}>
                    <Trash2 size={15} aria-hidden />
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-line mt-2" onClick={() => setVariables((list) => [...list, { symbol: '', meaning: '', unit: '' }])}>
                <Plus size={15} aria-hidden /> Add a variable
              </button>
              {variables.length > 0 && (
                <div className="mt-2">
                  <label className="lbl" htmlFor="custom-equation">
                    Equation for solving <small>optional, written like F = m*a</small>
                  </label>
                  <input id="custom-equation" className="field num" autoComplete="off" spellCheck={false} value={equation} onChange={(e) => setEquation(e.target.value)} />
                  {guess && (
                    <button type="button" className="btn btn-quiet mt-1" onClick={() => setEquation(guess)}>
                      Use {guess}
                    </button>
                  )}
                  {eqError && (
                    <p className="var-warn mt-1" role="alert">
                      {eqError}
                    </p>
                  )}
                </div>
              )}
            </section>

            {showStructure ? (
              <StructureSection mode={mode} onMode={setMode} smiles={smiles} onSmiles={setSmiles} onSmilesResult={onSmilesResult} lewisId={lewisId} onLewis={setLewisId} />
            ) : (
              <div className="today-section">
                <button type="button" className="btn btn-line" onClick={() => setStructureWanted(true)}>
                  <Plus size={15} aria-hidden /> Add a structure
                </button>
                <p className="mt-1 text-step--1 text-ink-2">Optional. A compound or reaction drawn beside the formula.</p>
              </div>
            )}

            {problems.length > 0 && (
              <ul className="notice" data-tone="bad" role="alert" style={{ display: 'block', listStyle: 'none' }}>
                {problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn btn-solid" onClick={goNext}>
                Next: where it goes
              </button>
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => {
                  discarded.current = true;
                  window.history.back();
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="lbl" htmlFor="custom-subject">
                  Subject
                </label>
                <select
                  id="custom-subject"
                  className="field"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value as SubjectId);
                    setUnit('');
                    setSection('');
                  }}
                >
                  {manifest.subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="lbl" htmlFor="custom-class">
                  Class
                </label>
                <select
                  id="custom-class"
                  className="field"
                  value={level}
                  onChange={(e) => {
                    setLevel(e.target.value as ClassLevel);
                    setUnit('');
                    setSection('');
                  }}
                >
                  <option value="XI">Class XI</option>
                  <option value="XII">Class XII</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="lbl" htmlFor="custom-unit">
                Chapter
              </label>
              <select
                id="custom-unit"
                className="field"
                value={unitNumber}
                onChange={(e) => {
                  setUnit(e.target.value);
                  setSection('');
                }}
              >
                {units.map((u) => {
                  const { number } = splitUnitName(u.name);
                  return (
                    <option key={u.name} value={number}>
                      {number}. {unitTitle(u.name)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mt-3">
              <label className="lbl" htmlFor="custom-section">
                Section
              </label>
              <select id="custom-section" className="field" value={sectionChoice} onChange={(e) => setSection(e.target.value)}>
                {sectionNames.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value={NEW_SECTION}>New section</option>
              </select>
            </div>
            {sectionChoice === NEW_SECTION && (
              <div className="mt-3">
                <label className="lbl" htmlFor="custom-new-section">
                  Name of the new section
                </label>
                <input id="custom-new-section" className="field" autoComplete="off" maxLength={120} value={newSection} onChange={(e) => setNewSection(e.target.value)} />
              </div>
            )}

            {problems.length > 0 && (
              <p className="notice" data-tone="bad" role="alert">
                {problems[0]}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn btn-solid" onClick={() => void save()}>
                <PenLine size={15} aria-hidden /> {editId ? 'Save changes' : 'Save formula'}
              </button>
              <button
                type="button"
                className="btn btn-line"
                onClick={() => {
                  setProblems([]);
                  setStep(1);
                }}
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const noop = () => undefined;
