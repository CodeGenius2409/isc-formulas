import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { AlertTriangle, ArrowLeft, CircleCheck, Info } from 'lucide-react';
import { canonicalId } from '../../data/aliases';
import { findFormula } from '../../data/book';
import { useAsync } from '../../lib/hooks';
import { stepsReveal } from '../../lib/motion';
import { openWork } from '../../lib/router';
import { getEntry } from '../../solver/registry';
import { defaultUnknown, equationTex, solve, varTex, type SolveInput, type SolveOutcome } from '../../solver/solve';
import type { ResolvedEntry, ResolvedVar } from '../../solver/types';
import { Math as MathTex } from '../Math';
import { FormulaPicker } from './FormulaPicker';

function unitOptions(v: ResolvedVar): string[] {
  const list = v.show && v.show !== v.unit ? [v.show, v.unit, ...v.alt] : [v.unit, ...v.alt];
  return [...new Set(list)].filter(Boolean);
}

function displayUnit(unit: string): string {
  return unit.replace(/\^2/g, '²').replace(/\^3/g, '³').replace(/\^-1/g, '⁻¹').replace(/\*/g, '·').replace('degC', '°C').replace('deg', '°').replace('ohm', 'Ω').replace('hour', 'h').replace(/^u/, 'μ');
}

function initialInputs(entry: ResolvedEntry): Record<string, SolveInput> {
  return Object.fromEntries(entry.vars.map((v) => [v.symbol, { raw: v.value !== undefined ? String(v.value) : '', unit: v.show && v.show !== v.unit ? v.show : v.unit }]));
}

export default function SolvePane({ formulaId }: { formulaId: string | null }) {
  if (!formulaId) return <FormulaPicker />;
  const id = canonicalId(formulaId);
  const entry = getEntry(id);
  if (!entry) return <NotSolvable id={id} />;
  return <Solver key={id} entry={entry} />;
}

function NotSolvable({ id }: { id: string }) {
  const state = useAsync(() => findFormula(id), id);
  const f = state.status === 'ready' ? state.value : null;
  return (
    <div>
      {f && (
        <>
          <h2 className="work-title">{f.name}</h2>
          <div className="math-host mt-1">
            <MathTex latex={f.latex} />
          </div>
        </>
      )}
      <div className="notice" role="status">
        <Info size={18} aria-hidden />
        <p>This one can't be solved numerically. It is a definition, a rule or a reaction, not a calculation with values to fill in. You can still practise it.</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="btn btn-solid" onClick={() => openWork('practice', id)}>
          Practise this formula
        </button>
        <button type="button" className="btn btn-line" onClick={() => { window.location.hash = window.location.hash.replace(/([?&])wf=[^&]*/, '$1').replace(/[?&]$/, ''); }}>
          Find a formula to solve
        </button>
      </div>
      <div className="mt-4">
        <FormulaPicker />
      </div>
    </div>
  );
}

function Solver({ entry }: { entry: ResolvedEntry }) {
  const state = useAsync(() => findFormula(entry.id), entry.id);
  const formula = state.status === 'ready' ? state.value : null;
  const [unknown, setUnknown] = useState(() => defaultUnknown(entry));
  const [inputs, setInputs] = useState(() => initialInputs(entry));
  const [outcome, setOutcome] = useState<SolveOutcome | null>(null);
  const stepsRef = useRef<HTMLOListElement>(null);
  const eqTex = useMemo(() => equationTex(entry), [entry]);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.getElementById('work-panel')?.scrollTo({ top: 0 });
  }, [entry.id]);

  useLayoutEffect(() => {
    if (outcome && stepsRef.current) {
      stepsReveal([...stepsRef.current.children]);
      stepsRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [outcome]);

  const setInput = (symbol: string, patch: Partial<SolveInput>) => {
    setInputs((cur) => ({ ...cur, [symbol]: { ...cur[symbol], ...patch } }));
    setOutcome(null);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setOutcome(solve(entry, unknown, inputs));
  };

  const problems = outcome?.inputProblems ?? {};
  const target = entry.vars.find((v) => v.symbol === unknown)!;
  const firstEmpty = entry.vars.find((v) => v.symbol !== unknown)?.symbol;

  return (
    <form onSubmit={onSubmit} noValidate>
      <button type="button" className="btn btn-quiet -ml-2 mb-1" onClick={() => { window.location.hash = window.location.hash.replace(/([?&])wf=[^&]*/, '$1').replace(/[?&]$/, ''); }}>
        <ArrowLeft size={16} aria-hidden /> All formulas
      </button>
      <h2 className="work-title">{formula?.name ?? 'Formula'}</h2>
      <div className="math-host mt-1">
        <MathTex latex={eqTex} />
      </div>

      <fieldset className="mt-3 border-0 p-0 m-0">
        <legend className="lbl mb-1">
          Find <small>press a symbol to choose what to solve for</small>
        </legend>
        <div>
          {entry.vars.map((v) => {
            const isUnknown = v.symbol === unknown;
            const options = unitOptions(v);
            const fieldId = `val-${v.symbol}`;
            return (
              <div key={v.symbol} className="var-row" data-unknown={isUnknown}>
                <button
                  type="button"
                  className="var-sym"
                  aria-pressed={isUnknown}
                  aria-label={`Solve for ${v.name}`}
                  onClick={() => {
                    setUnknown(v.symbol);
                    setOutcome(null);
                  }}
                >
                  <MathTex latex={varTex(v)} />
                </button>
                {isUnknown ? (
                  <span className="font-semibold text-ink-2" style={{ gridColumn: '2 / -1' }}>
                    This is what you are finding
                  </span>
                ) : (
                  <>
                    <input
                      id={fieldId}
                      ref={v.symbol === firstEmpty ? firstField : undefined}
                      className="field num"
                      inputMode="text"
                      autoComplete="off"
                      spellCheck={false}
                      value={inputs[v.symbol].raw}
                      aria-label={v.name}
                      aria-invalid={Boolean(problems[v.symbol])}
                      aria-describedby={problems[v.symbol] ? `${fieldId}-err` : undefined}
                      onChange={(e) => setInput(v.symbol, { raw: e.target.value })}
                    />
                    {options.length > 1 ? (
                      <select className="field" aria-label={`Unit of ${v.name}`} value={inputs[v.symbol].unit} onChange={(e) => setInput(v.symbol, { unit: e.target.value })}>
                        {options.map((u) => (
                          <option key={u} value={u}>
                            {displayUnit(u)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="num text-step--1 text-ink-2 pl-1">{options[0] ? displayUnit(options[0]) : 'no unit'}</span>
                    )}
                  </>
                )}
                <span className="var-name">{v.name}{v.isConstant ? ' (constant)' : ''}</span>
                {problems[v.symbol] && (
                  <span className="var-warn" id={`${fieldId}-err`} role="alert">
                    <AlertTriangle size={14} aria-hidden className="mt-[2px] flex-none" />
                    {problems[v.symbol]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-3">
        <button type="submit" className="btn btn-solid w-full">
          Find {target.name}
        </button>
      </div>

      {outcome?.message && !outcome.steps.length && !Object.keys(outcome.inputProblems).length && (
        <div className="notice" data-tone="bad" role="alert">
          <AlertTriangle size={18} aria-hidden />
          <p>{outcome.message}</p>
        </div>
      )}

      {outcome && outcome.steps.length > 0 && (
        <>
          <ol className="steps list-none p-0" ref={stepsRef} aria-label="Worked solution" tabIndex={-1}>
            {outcome.steps.map((step, i) => (
              <li className="step" key={`${step.label}${i}`}>
                <div className="step-num">{i + 1}</div>
                <div className="step-body">
                  <div className="step-label">{step.label}</div>
                  {step.math.map((line) => (
                    <div className="step-math math-host" key={line}>
                      <MathTex latex={line} />
                    </div>
                  ))}
                  {step.note && <div className="step-note">{step.note}</div>}
                </div>
              </li>
            ))}
          </ol>
          {outcome.ok ? (
            <div className="notice" data-tone="good" role="status">
              <CircleCheck size={18} aria-hidden />
              <p>
                {target.name}: {outcome.roots.filter((r) => !r.rejected).map((r) => `${r.text}${r.unit === 'deg' ? '°' : r.unit ? ` ${displayUnit(r.unit)}` : ''}`).join(' or ')}
              </p>
            </div>
          ) : (
            outcome.message && (
              <div className="notice" data-tone="bad" role="alert">
                <AlertTriangle size={18} aria-hidden />
                <p>{outcome.message}</p>
              </div>
            )
          )}
          {outcome.ok && (
            <button type="button" className="btn btn-line mt-2" onClick={() => openWork('practice', entry.id)}>
              Practise this formula
            </button>
          )}
        </>
      )}
    </form>
  );
}
