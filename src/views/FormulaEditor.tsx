import { lazy, Suspense, useCallback, useEffect, useId, useMemo, useState } from 'react';
import { PenLine, Plus, Trash2 } from 'lucide-react';
import { FormulaRow } from '../components/FormulaRow';
import { StructureDrawing } from '../components/custom/CustomStructure';
import { LazyLewis } from '../components/LazyLewis';
import { equationFromLatex, equationProblem } from '../custom/entry';
import { additions } from '../custom/merge';
import { parseStructure, SmilesProblem, type ParsedStructure } from '../custom/smiles';
import { customBackupStore, customStore, ensureCustomLoaded, findCustom, newCustomId, saveCustom, unsavedCount, type CustomFormula, type CustomVariable } from '../custom/store';
import { getClass, manifest, splitUnitName, unitTitle } from '../data/book';
import type { ClassLevel, Formula, SubjectId } from '../data/types';
import { ensureKatex, latexProblem, useKatexReady } from '../lib/katex';
import { navigate, useRoute } from '../lib/router';
import { useStore } from '../lib/store';
import { lastReadStore } from '../state/library';
import { toast } from '../state/toast';

const MathField = lazy(() => import('../components/custom/MathField'));

const NEW_SECTION = '__new__';

type StructureMode = 'none' | 'smiles' | 'reaction' | 'lewis';

/** Which figures to offer. Only those that have passed the structure check. */
function useLewisChoices(wanted: boolean) {
  const [choices, setChoices] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    if (!wanted || choices.length) return;
    void import('../data/lewis/figures').then(({ LEWIS }) => setChoices(Object.values(LEWIS).map((f) => ({ id: f.id, name: f.name })).sort((a, b) => a.name.localeCompare(b.name))));
  }, [wanted, choices.length]);
  return choices;
}

function SmilesField({ value, onChange, reaction, onResult }: { value: string; onChange: (v: string) => void; reaction: boolean; onResult: (ok: boolean) => void }) {
  const id = useId();
  const [parsed, setParsed] = useState<ParsedStructure | null>(null);
  const [problem, setProblem] = useState('');
  useEffect(() => {
    let live = true;
    const text = value.trim();
    if (!text) {
      setParsed(null);
      setProblem('');
      onResult(false);
      return undefined;
    }
    const timer = window.setTimeout(() => {
      parseStructure(text).then(
        (result) => {
          if (!live) return;
          if (reaction && !result.isReaction) {
            setParsed(null);
            setProblem('A reaction is written reactants>>products.');
            onResult(false);
          } else {
            setParsed(result);
            setProblem('');
            onResult(true);
          }
        },
        (err) => {
          if (!live) return;
          setParsed(null);
          setProblem(err instanceof SmilesProblem ? err.message : 'That can\'t be read as SMILES.');
          onResult(false);
        },
      );
    }, 200);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [value, reaction, onResult]);
  return (
    <div className="mt-2">
      <label className="lbl" htmlFor={id}>
        {reaction ? 'Reaction SMILES, as reactants>>products' : 'SMILES'}
      </label>
      <input id={id} className="field num" autoComplete="off" spellCheck={false} value={value} placeholder={reaction ? 'CCO>>CC=O' : 'CCO'} onChange={(e) => onChange(e.target.value)} />
      {problem && (
        <p className="var-warn mt-1" role="alert">
          {problem}
        </p>
      )}
      {parsed && (
        <div className="structures" data-testid="smiles-preview">
          <StructureDrawing parsed={parsed} scale={0.7} />
          <p className="mt-1 text-step--1 text-ink-2" role="status">
            Computed formula: <b className="num" data-testid="smiles-formula">{[...parsed.reactants, ...parsed.products].map((m) => m.formula).join(', ')}</b>. Check this is the compound you meant.
          </p>
        </div>
      )}
    </div>
  );
}

/** The editor: first the formula itself, and last where it goes. */
export default function FormulaEditor({ editId }: { editId: string | null }) {
  const route = useRoute();
  const custom = useStore(customStore);
  const last = useStore(lastReadStore);
  const existing = editId ? custom.formulas.find((f) => f.id === editId) : undefined;
  const q = route.query;
  const startSubject = (q.get('subject') as SubjectId | null) ?? last?.subject ?? 'physics';
  const startLevel = (q.get('level') as ClassLevel | null) ?? last?.classLevel ?? 'XI';

  const [step, setStep] = useState<1 | 2>(1);
  const [latex, setLatex] = useState('');
  const [visual, setVisual] = useState(true);
  const [mathFailed, setMathFailed] = useState(false);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [variables, setVariables] = useState<CustomVariable[]>([]);
  const [equation, setEquation] = useState('');
  const [mode, setMode] = useState<StructureMode>('none');
  const [smiles, setSmiles] = useState('');
  const [smilesOk, setSmilesOk] = useState(false);
  const [lewisId, setLewisId] = useState('');
  const [subject, setSubject] = useState<SubjectId>(startSubject);
  const [level, setLevel] = useState<ClassLevel>(startLevel);
  const [unit, setUnit] = useState(q.get('unit') ?? '');
  const [section, setSection] = useState(q.get('sub') ?? '');
  const [newSection, setNewSection] = useState('');
  const [problems, setProblems] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const labelId = useId();
  const katexReady = useKatexReady();
  const lewisChoices = useLewisChoices(mode === 'lewis');

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
      smiles: subject === 'chemistry' && (mode === 'smiles' || mode === 'reaction') && smilesOk ? smiles.trim() : undefined,
      lewis: subject === 'chemistry' && mode === 'lewis' && lewisId ? [lewisId] : undefined,
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
                  <Suspense fallback={<p className="field text-ink-3">Opening the maths editor</p>}>
                    <MathField value={latex} onChange={onLatexFromField} labelledBy={labelId} onUnavailable={() => setMathFailed(true)} />
                  </Suspense>
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

            {subject === 'chemistry' && (
              <section className="today-section" aria-labelledby="structure-h">
                <h2 id="structure-h">Structure</h2>
                <div className="mt-2">
                  <label className="lbl" htmlFor="custom-mode">
                    Add a structure
                  </label>
                  <select id="custom-mode" className="field" value={mode} onChange={(e) => setMode(e.target.value as StructureMode)}>
                    <option value="none">None</option>
                    <option value="smiles">A compound, from SMILES</option>
                    <option value="reaction">A reaction, from SMILES</option>
                    <option value="lewis">A checked structure with lone pairs</option>
                  </select>
                </div>
                {(mode === 'smiles' || mode === 'reaction') && <SmilesField value={smiles} onChange={setSmiles} reaction={mode === 'reaction'} onResult={onSmilesResult} />}
                {mode === 'lewis' && (
                  <div className="mt-2">
                    <label className="lbl" htmlFor="custom-lewis">
                      Structure
                    </label>
                    <select id="custom-lewis" className="field" value={lewisId} onChange={(e) => setLewisId(e.target.value)}>
                      <option value="">Choose</option>
                      {lewisChoices.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {lewisId && <LazyLewis ids={[lewisId]} />}
                  </div>
                )}
              </section>
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
              <button type="button" className="btn btn-quiet" onClick={() => window.history.back()}>
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
