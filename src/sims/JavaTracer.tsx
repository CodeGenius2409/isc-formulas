import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { CircleAlert, Pause, Pencil, Play, SkipBack, SkipForward, StepBack, StepForward } from 'lucide-react';
import { runProgram, type FrameView, type RunResult, type TraceRow, type TraceStep } from '../java/trace';
import { SAMPLES } from '../java/samples';
import { readJson, writeJson } from '../lib/storage';

const OWN_KEY = 'isc-java-draft';
const OWN_ID = 'own';
const SHOWN_ROWS = 200;
const SPEEDS = [
  { id: 'slow', label: 'Slow', ms: 900 },
  { id: 'normal', label: 'Normal', ms: 400 },
  { id: 'fast', label: 'Fast', ms: 120 },
];

const STARTER = `class MyProgram {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}`;

interface Draft {
  code: string;
  input: string;
}

const TOPICS = [...new Set(SAMPLES.map((s) => s.topic))];

export function JavaTracer() {
  const [own, setOwn] = useState<Draft>(() => readJson<Draft>(OWN_KEY, { code: STARTER, input: '' }));
  const [programId, setProgramId] = useState(SAMPLES[0].id);
  const sample = SAMPLES.find((s) => s.id === programId);
  const code = sample ? sample.code : own.code;
  const input = sample ? (sample.input ?? '') : own.input;

  const [run, setRun] = useState<RunResult | null>(() => runProgram(SAMPLES[0].code, SAMPLES[0].input ?? ''));
  const [ranInput, setRanInput] = useState(SAMPLES[0].input ?? '');
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState('normal');
  const [frameIndex, setFrameIndex] = useState(0);

  const steps = run?.steps ?? [];
  const last = Math.max(steps.length - 1, 0);
  const step: TraceStep | undefined = steps[at];

  const startRun = (source: string, text: string) => {
    setRun(runProgram(source, text));
    setRanInput(text);
    setAt(0);
    setFrameIndex(0);
    setPlaying(false);
  };

  /** Typing into a sample makes it the student's own copy, leaving the sample untouched. */
  const editDraft = (next: Partial<Draft>) => {
    const draft = { code, input, ...next };
    setOwn(draft);
    setProgramId(OWN_ID);
    writeJson(OWN_KEY, draft);
  };

  const choose = (id: string) => {
    setProgramId(id);
    const picked = SAMPLES.find((s) => s.id === id);
    if (picked) startRun(picked.code, picked.input ?? '');
    else startRun(own.code, own.input);
  };

  const goTo = (index: number) => {
    setAt(Math.min(Math.max(index, 0), last));
    setFrameIndex(0);
  };

  useEffect(() => {
    if (!playing) return undefined;
    if (at >= last) {
      setPlaying(false);
      return undefined;
    }
    const timer = window.setTimeout(() => goTo(at + 1), SPEEDS.find((s) => s.id === speed)?.ms ?? 400);
    return () => window.clearTimeout(timer);
  }, [playing, at, last, speed]); // eslint-disable-line react-hooks/exhaustive-deps

  const onStepKeys = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPlaying(false);
      goTo(at + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPlaying(false);
      goTo(at - 1);
    }
  };

  const atEnd = Boolean(run) && at >= last;
  const finished = atEnd && !run?.error;
  const stoppedHere = atEnd && run?.error;
  const errorLine = stoppedHere ? run?.error?.line : undefined;
  const currentLine = !atEnd || stoppedHere ? step?.line : undefined;
  const output = run ? (atEnd ? run.output : run.output.slice(0, step?.outputLength ?? 0)) : '';

  const status = !run
    ? 'Editing. Press Trace to run this program.'
    : !steps.length
      ? 'This program could not start.'
      : finished
        ? `Finished in ${(run.truncated ? run.totalSteps : last).toLocaleString('en-GB')} steps.`
        : stoppedHere
          ? `Stopped on line ${run.error?.line}.`
          : `Step ${at + 1} of ${steps.length}. Line ${step?.line} runs next.`;

  return (
    <div className="tracer">
      <div className="tracer-bar">
        <div className="tracer-pick">
          <label className="lbl" htmlFor="java-program">
            Program
          </label>
          <select id="java-program" className="field" value={programId} onChange={(e) => choose(e.target.value)}>
            <option value={OWN_ID}>My program</option>
            {TOPICS.map((topic) => (
              <optgroup key={topic} label={topic}>
                {SAMPLES.filter((s) => s.topic === topic).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="tracer-input">
          <label className="lbl" htmlFor="java-input">
            Input <small>what Scanner reads, split by spaces or new lines</small>
          </label>
          <textarea id="java-input" className="field code-edit" rows={1} autoComplete="off" autoCapitalize="off" spellCheck={false} value={input} onChange={(e) => editDraft({ input: e.target.value })} />
        </div>
        <div className="tracer-go">
          <button type="button" className="btn btn-solid" onClick={() => startRun(code, input)}>
            <Play size={16} aria-hidden="true" />
            {run ? 'Trace again' : 'Trace'}
          </button>
          {run && (
            <button type="button" className="btn btn-line" onClick={() => setRun(null)}>
              <Pencil size={16} aria-hidden="true" />
              Edit code
            </button>
          )}
        </div>
      </div>

      {run && ranInput !== input && <p className="tool-hint">The input has changed. Press Trace again to use it.</p>}

      <div className="tracer-steps">
        {run && steps.length > 0 && (
          <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Step through the program">
            <button type="button" className="btn btn-line" disabled={at === 0} onClick={() => goTo(0)} aria-label="Back to the start" title="Back to the start">
              <SkipBack size={16} aria-hidden="true" />
            </button>
            <button type="button" className="btn btn-line" disabled={at === 0} onClick={() => goTo(at - 1)} aria-label="Previous step" title="Previous step">
              <StepBack size={16} aria-hidden="true" />
            </button>
            <button type="button" className="btn btn-solid" disabled={at >= last} onClick={() => goTo(at + 1)}>
              <StepForward size={16} aria-hidden="true" />
              Step
            </button>
            <button type="button" className="btn btn-line" disabled={at >= last && !playing} onClick={() => setPlaying((p) => !p)} aria-pressed={playing} aria-label={playing ? 'Pause' : 'Play'} title={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            </button>
            <button
              type="button"
              className="btn btn-line"
              disabled={at >= last}
              onClick={() => {
                setPlaying(false);
                goTo(last);
              }}
              aria-label="Run to the end"
              title="Run to the end"
            >
              <SkipForward size={16} aria-hidden="true" />
            </button>
          </div>
        )}
        <p className="tool-hint" role="status" aria-live={playing ? 'off' : 'polite'}>
          {status}
        </p>
      </div>

      <div className="tracer-grid">
        <section aria-labelledby="java-code-h" className="min-w-0">
          <h2 id="java-code-h" className="tool-h">
            Code
          </h2>
          {run ? (
            <CodeView code={code} currentLine={currentLine ?? (run.error && !steps.length ? run.error.line : undefined)} errorLine={errorLine ?? (run.error && !steps.length ? run.error.line : undefined)} onKeyDown={onStepKeys} />
          ) : (
            <textarea aria-labelledby="java-code-h" className="code-edit" rows={Math.min(Math.max(code.split('\n').length + 1, 10), 24)} autoComplete="off" autoCapitalize="off" spellCheck={false} value={code} onChange={(e) => editDraft({ code: e.target.value })} />
          )}

          {run && steps.length > 0 && (
            <div className="tracer-speed">
              <span className="lbl" style={{ margin: 0 }}>
                Playing speed
              </span>
              <div className="seg" role="group" aria-label="Playing speed">
                {SPEEDS.map((s) => (
                  <button key={s.id} type="button" aria-pressed={speed === s.id} onClick={() => setSpeed(s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {run?.error && (!steps.length || atEnd) && (
            <p className="notice" data-tone="bad">
              <CircleAlert size={16} aria-hidden="true" />
              <span>
                <b>Line {run.error.line}.</b> {run.error.message}
              </span>
            </p>
          )}
          {run?.truncated && atEnd && <p className="notice">Only the first {steps.length.toLocaleString('en-GB')} steps can be stepped through. The console shows everything the program printed.</p>}
        </section>

        <div className="tracer-state">
          <section aria-labelledby="java-stack-h">
            <h2 id="java-stack-h" className="tool-h">
              Call stack
            </h2>
            <CallStack step={step} selected={frameIndex} onSelect={setFrameIndex} />
          </section>
          <section aria-labelledby="java-vars-h">
            <h2 id="java-vars-h" className="tool-h">
              Variables
            </h2>
            <Variables step={step} previous={at > 0 ? steps[at - 1] : undefined} frameIndex={frameIndex} />
          </section>
          <section aria-labelledby="java-out-h">
            <h2 id="java-out-h" className="tool-h">
              Console
            </h2>
            <pre className="console-pane" tabIndex={0} role="log" aria-labelledby="java-out-h" aria-live={playing ? 'off' : 'polite'}>
              {output}
            </pre>
          </section>
        </div>
      </div>

      {run && <DryRun run={run} step={step} atEnd={atEnd} />}
    </div>
  );
}

function CodeView({ code, currentLine, errorLine, onKeyDown }: { code: string; currentLine?: number; errorLine?: number; onKeyDown: (e: KeyboardEvent) => void }) {
  const pane = useRef<HTMLDivElement>(null);
  const lines = useMemo(() => code.split('\n'), [code]);

  // Keep the current line in view by scrolling the pane only, never the page.
  useEffect(() => {
    const box = pane.current;
    const row = box?.querySelector<HTMLElement>('[data-current="true"]');
    if (!box || !row) return;
    const top = row.offsetTop - box.offsetTop;
    if (top < box.scrollTop || top + row.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTop = Math.max(top - box.clientHeight / 3, 0);
    }
  }, [currentLine]);

  return (
    <div ref={pane} className="code-pane" tabIndex={0} role="region" aria-label="Program code. Left and right arrow keys step through it." onKeyDown={onKeyDown}>
      {lines.map((text, i) => (
        <div key={i} className="code-line" data-current={currentLine === i + 1 || undefined} data-error={errorLine === i + 1 || undefined}>
          <span>{i + 1}</span>
          <code>{text || ' '}</code>
        </div>
      ))}
    </div>
  );
}

function CallStack({ step, selected, onSelect }: { step?: TraceStep; selected: number; onSelect: (i: number) => void }) {
  if (!step || !step.frames.length) return <p className="tool-empty">No method is running.</p>;
  // Innermost call first, as it would be drawn on paper.
  const frames = [...step.frames].reverse();
  const hidden = step.depth - step.frames.length;
  return (
    <ol className="call-stack">
      {frames.map((frame, i) => (
        <li key={`${i}-${frame.method}`}>
          {hidden > 0 && i === frames.length - 1 && <div className="call-skip">{hidden.toLocaleString('en-GB')} more calls</div>}
          <button type="button" aria-pressed={selected === i} onClick={() => onSelect(i)}>
            <code>{frame.method}</code>
            <small>line {frame.line}</small>
          </button>
        </li>
      ))}
    </ol>
  );
}

function selectedFrame(step: TraceStep | undefined, index: number): FrameView | undefined {
  return step ? step.frames[step.frames.length - 1 - index] : undefined;
}

function Variables({ step, previous, frameIndex }: { step?: TraceStep; previous?: TraceStep; frameIndex: number }) {
  const frame = selectedFrame(step, frameIndex);
  if (!frame) return <p className="tool-empty">Variables appear here while a method runs.</p>;
  if (!frame.vars.length) return <p className="tool-empty">{frame.method} has no variables yet.</p>;
  const before = previous && previous.depth === step?.depth ? selectedFrame(previous, frameIndex) : undefined;
  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Table of variables">
      <table className="trace-table var-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {frame.vars.map((v) => (
            <tr key={v.name}>
              <th scope="row">{v.name}</th>
              <td>{v.type}</td>
              <td data-changed={Boolean(before) && before?.vars.find((b) => b.name === v.name)?.value !== v.value ? true : undefined}>{v.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DryRun({ run, step, atEnd }: { run: RunResult; step?: TraceStep; atEnd: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const count = atEnd ? run.rows.length : (step?.traceRows ?? 0);
  const rows: TraceRow[] = run.rows.slice(Math.max(count - SHOWN_ROWS, 0), count);
  const multiMethod = new Set(run.rows.map((r) => r.method)).size > 1;

  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [count]);

  return (
    <section aria-labelledby="java-dry-h" className="tracer-dry">
      <h2 id="java-dry-h" className="tool-h">
        Dry run
      </h2>
      {!run.columns.length ? (
        <p className="tool-empty">{run.error && !run.steps.length ? 'Fix the error above to see a dry run.' : 'This program has no loops, so there is no table to fill in.'}</p>
      ) : (
        <>
          <p className="tool-hint">One row each time a loop's condition is tested or a variable changes. Bold marks what changed.{count > SHOWN_ROWS ? ` Showing the latest ${SHOWN_ROWS} of ${count.toLocaleString('en-GB')} rows.` : ''}</p>
          <div ref={box} className="table-scroll" tabIndex={0} role="region" aria-labelledby="java-dry-h">
            <table className="trace-table">
              <thead>
                <tr>
                  <th scope="col">Line</th>
                  {multiMethod && <th scope="col">Method</th>}
                  {run.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                  <th scope="col">Condition</th>
                  <th scope="col">Output</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={run.columns.length + (multiMethod ? 4 : 3)} className="trace-wait">
                      Step into a loop to fill this in.
                    </td>
                  </tr>
                )}
                {rows.map((row, i) => (
                  <tr key={count - rows.length + i} data-current={i === rows.length - 1 || undefined}>
                    <td>{row.line}</td>
                    {multiMethod && <td>{row.method}</td>}
                    {run.columns.map((c) => (
                      <td key={c} data-changed={row.changed.includes(c) || undefined}>
                        {row.values[c] ?? ''}
                      </td>
                    ))}
                    <td>{row.condition ?? ''}</td>
                    <td className="trace-out">{row.output ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
