// The Python tracer. It looks and steps like the Java tracer, but the program runs in real Python, in a
// worker, and Python is downloaded the first time the tracer opens in a visit. Until then the samples can
// still be read.
import { Fragment, Suspense, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { CircleAlert, Info, Pencil, Play, RotateCcw, Square } from 'lucide-react';
import { lazyRetry } from '../lib/retry-import';
import { readJson, writeJson } from '../lib/storage';
import { useStore } from '../python/state';
import { tokenizePython } from '../java/tokens';
import { closePython, libraryLoadStore, loadPython, pythonLoadStore, retryPython, RunStopped, runPython, stopPython, WATCHDOG_MS, type LibraryState, type LoadState } from '../python/client';
import type { ChartTheme } from '../python/engine';
import { beyondNote, explainError, libraryNote, numpyNote } from '../python/explain';
import { keepPythonStore, megabytes, PYTHON_BYTES, pythonOfferedStore, pythonSaveStore } from '../python/offline';
import { PY_SAMPLES } from '../python/samples';
import { LIMITS, stopMessage, type ConsoleExtra, type PyFigure, type PyFrame, type PyRunResult, type PyStep, type PyVar, type PyView } from '../python/trace';
import { CodeView, DryRun, SPEEDS, SpeedPicker, StepControls, useFlashChanged } from './tracer-parts';
import './python-tracer.css';
import { LoadBar } from '../components/LoadBar';

// Most people only trace the samples, so the editor loads when someone chooses to edit.
const PythonEditor = lazyRetry(() => import('./PythonEditor'));

const OWN_KEY = 'isc-python-draft';
const OWN_ID = 'own';

const STARTER = `name = input("Your name: ")
print("Hello,", name)`;

interface Draft {
  code: string;
  input: string;
}

const TOPICS = [...new Set(PY_SAMPLES.map((s) => s.topic))];

/** The theme's colours, read when a program runs, so its charts are drawn in them: chalk on the blackboard. */
function chartTheme(): ChartTheme {
  const css = getComputedStyle(document.documentElement);
  const token = (name: string) => css.getPropertyValue(`--${name}`).trim();
  const board = document.documentElement.dataset.theme === 'board';
  return {
    ink: token('ink'),
    ink2: token('ink-2'),
    faint: token('rule-2'),
    paper: token('paper'),
    grid: token('plot-grid'),
    // On paper, Matplotlib's own colours, as a student sees them anywhere else; on the board, the coloured chalks.
    palette: board ? ['physics', 'accent', 'chemistry', 'bad', 'mathematics', 'computerscience'].map(token) : null,
  };
}

export function PythonTracer() {
  const [own, setOwn] = useState<Draft>(() => readJson<Draft>(OWN_KEY, { code: STARTER, input: 'Asha' }));
  const [programId, setProgramId] = useState(PY_SAMPLES[0].id);
  const sample = PY_SAMPLES.find((s) => s.id === programId);
  const code = sample ? sample.code : own.code;
  const input = sample ? (sample.input ?? '') : own.input;

  const load = useStore(pythonLoadStore);
  const libraries = useStore(libraryLoadStore);
  const ready = load.phase === 'ready';
  const [run, setRun] = useState<PyRunResult | null>(null);
  const [ranInput, setRanInput] = useState('');
  const [editing, setEditing] = useState(false);
  const [running, setRunning] = useState(false);
  const [stopNote, setStopNote] = useState<string | null>(null);
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState('normal');
  const [frameIndex, setFrameIndex] = useState(0);
  const autoTraced = useRef(false);
  const traceWhenReady = useRef(false);

  const steps = run?.steps ?? [];
  const last = Math.max(steps.length - 1, 0);
  const step: PyStep | undefined = steps[at];

  const trace = async (source: string, text: string) => {
    setRunning(true);
    setStopNote(null);
    setPlaying(false);
    try {
      const result = await runPython(source, text, chartTheme());
      setRun(result);
      setRanInput(text);
      setAt(0);
      setFrameIndex(0);
      setEditing(false);
    } catch (err) {
      if (err instanceof RunStopped) {
        setStopNote(err.message === 'time' ? `This program ran for over ${WATCHDOG_MS / 1000} seconds without finishing, so it was stopped. It may be an infinite loop.` : 'Stopped. Python is starting again, ready for the next run.');
      } else if (['offline', 'failed'].includes(libraryLoadStore.get().phase)) {
        // The library panel says what happened, with Retry.
      } else if (!(err instanceof Error && err.message === 'offline')) {
        setStopNote(`The tracer stopped unexpectedly: ${err instanceof Error ? err.message : String(err)} Press Trace to try again.`);
      }
    } finally {
      setRunning(false);
    }
  };

  // Python downloads when the tracer first opens, and the worker closes with it.
  useEffect(() => {
    void loadPython().catch(() => undefined);
    return () => closePython();
  }, []);

  // As the Java tracer does, the first sample is traced as soon as Python is ready. So is a program chosen
  // while Python was still downloading or starting again.
  useEffect(() => {
    if (ready && (traceWhenReady.current || (!autoTraced.current && !run && !editing))) {
      autoTraced.current = true;
      traceWhenReady.current = false;
      void trace(code, input);
    }
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Typing into a sample makes it the student's own copy, leaving the sample untouched. */
  const editDraft = (next: Partial<Draft>) => {
    const draft = { code, input, ...next };
    setOwn(draft);
    setProgramId(OWN_ID);
    writeJson(OWN_KEY, draft);
  };

  const choose = (id: string) => {
    setProgramId(id);
    // The last run belongs to the last program, so it goes, and its steps aren't drawn on this one.
    setRun(null);
    setEditing(false);
    setStopNote(null);
    const picked = PY_SAMPLES.find((s) => s.id === id);
    if (!ready) {
      traceWhenReady.current = true;
      return;
    }
    if (picked) void trace(picked.code, picked.input ?? '');
    else void trace(own.code, own.input);
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

  const showing = Boolean(run) && !editing;
  const atEnd = showing && at >= last;
  const failed = Boolean(run?.error) || Boolean(run?.stopped);
  const stoppedHere = atEnd && failed;
  const errorLine = stoppedHere ? (run?.error?.line ?? step?.line) : undefined;
  const syntax = run?.error?.kind === 'syntax';
  const currentLine = showing && (!atEnd || stoppedHere) ? (syntax ? run?.error?.line : step?.line) : undefined;
  const outputLength = run ? (atEnd ? run.output.length : (step?.outputLength ?? 0)) : 0;

  const status = running ? (libraries.phase === 'downloading' || libraries.phase === 'installing' ? `Getting ${libraries.label} ready.` : 'Tracing.') : !showing ? (ready ? 'Editing. Press Trace to run this program.' : loadingWords(load)) : !steps.length ? 'This program could not start.' : describeStep(run!, step!, at, steps.length, atEnd);

  const keep = useStore(keepPythonStore);
  const offered = useStore(pythonOfferedStore);

  return (
    <div className="tracer">
      <div className="tracer-bar">
        <div className="tracer-pick">
          <label className="lbl" htmlFor="python-program">
            Program
          </label>
          <select id="python-program" className="field" value={programId} disabled={running} onChange={(e) => choose(e.target.value)}>
            <option value={OWN_ID}>My program</option>
            {TOPICS.map((topic) => (
              <optgroup key={topic} label={topic}>
                {PY_SAMPLES.filter((s) => s.topic === topic).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="tracer-input">
          <label className="lbl" htmlFor="python-input">
            Input <small>what input() reads, one line each time</small>
          </label>
          <textarea id="python-input" className="field code-edit" rows={2} autoComplete="off" autoCapitalize="off" spellCheck={false} value={input} onChange={(e) => editDraft({ input: e.target.value })} />
        </div>
        <div className="tracer-go">
          {running ? (
            <button type="button" className="btn btn-solid" onClick={() => stopPython()}>
              <Square size={16} aria-hidden="true" />
              Stop
            </button>
          ) : (
            <button type="button" className="btn btn-solid" disabled={!ready} onClick={() => void trace(code, input)}>
              <Play size={16} aria-hidden="true" />
              {showing ? 'Trace again' : 'Trace'}
            </button>
          )}
          {showing && !running && (
            <button type="button" className="btn btn-line" onClick={() => setEditing(true)}>
              <Pencil size={16} aria-hidden="true" />
              Edit code
            </button>
          )}
        </div>
      </div>

      <LoadPanel load={load} />
      <LibraryPanel state={libraries} onRetry={() => void trace(code, input)} />
      {ready && !offered && !keep && <KeepOffer />}

      {showing && ranInput !== input && <p className="tool-hint">The input has changed. Press Trace again to use it.</p>}
      {stopNote && (
        <p className="notice" data-tone="bad" role="status">
          <CircleAlert size={16} aria-hidden="true" />
          <span>{stopNote}</span>
        </p>
      )}

      <div className="tracer-steps">
        {showing && steps.length > 0 && <StepControls at={at} last={last} playing={playing} goTo={goTo} setPlaying={setPlaying} />}
        <p className="tool-hint" role="status" aria-live={playing ? 'off' : 'polite'}>
          {status}
        </p>
      </div>

      <div className="tracer-grid">
        <section aria-labelledby="python-code-h" className="min-w-0">
          <h2 id="python-code-h" className="tool-h">
            Code
          </h2>
          {editing ? (
            <Suspense fallback={<pre className="code-pane">{code}</pre>}>
              <PythonEditor value={code} onChange={(next) => editDraft({ code: next })} onRun={() => ready && !running && void trace(code, input)} labelledBy="python-code-h" />
            </Suspense>
          ) : (
            <CodeView code={code} currentLine={currentLine} errorLine={errorLine ?? (syntax && showing ? run?.error?.line : undefined)} onKeyDown={onStepKeys} tokenize={tokenizePython} />
          )}
          {!showing && !editing && (
            <p className="tool-hint">
              <button type="button" className="btn btn-quiet -ml-2" onClick={() => setEditing(true)}>
                <Pencil size={16} aria-hidden="true" />
                Edit code
              </button>
            </p>
          )}

          {showing && steps.length > 0 && <SpeedPicker speed={speed} setSpeed={setSpeed} />}
          {showing && run && <Findings run={run} atEnd={atEnd} />}
        </section>

        <div className="tracer-state">
          <section aria-labelledby="python-stack-h">
            <h2 id="python-stack-h" className="tool-h">
              Call stack
            </h2>
            <CallStack step={showing ? step : undefined} selected={frameIndex} onSelect={setFrameIndex} />
          </section>
          <section aria-labelledby="python-vars-h">
            <h2 id="python-vars-h" className="tool-h">
              Variables
            </h2>
            <Variables step={showing ? step : undefined} previous={showing && at > 0 ? steps[at - 1] : undefined} frameIndex={frameIndex} />
          </section>
          <section aria-labelledby="python-out-h">
            <h2 id="python-out-h" className="tool-h">
              Console
            </h2>
            <pre className="console-pane" tabIndex={0} role="log" aria-labelledby="python-out-h" aria-live={playing ? 'off' : 'polite'}>
              {showing && run ? <ConsoleText output={run.output} extras={run.extras} figures={run.figures} upTo={outputLength} at={at} atEnd={atEnd} /> : ''}
            </pre>
          </section>
        </div>
      </div>

      {showing && run && (
        <DryRun
          id="python-dry-h"
          method="Function"
          rows={run.rows}
          columns={run.columns}
          count={atEnd ? run.rows.length : (step?.traceRows ?? 0)}
          empty={syntax ? 'Fix the error above to see a dry run.' : 'This program has no loops, so there is no table to fill in.'}
          note="For a for loop, True means there was another item to take."
        />
      )}
    </div>
  );
}

function loadingWords(load: LoadState): string {
  switch (load.phase) {
    case 'downloading':
      return 'Python is downloading.';
    case 'starting':
      return 'Python is starting.';
    case 'offline':
      return 'Python isn’t on this device, and there is no connection.';
    case 'failed':
      return 'Python couldn’t load.';
    default:
      return 'Getting Python ready.';
  }
}

function LoadPanel({ load }: { load: LoadState }) {
  if (load.phase === 'ready') return null;
  if (load.phase === 'offline') {
    return (
      <div className="notice" role="status">
        <Info size={16} aria-hidden="true" />
        <div>
          <p>You’re offline, and Python isn’t saved on this device, so the tracer can’t start yet. The samples below can still be read.</p>
          <p className="mt-1 text-ink-2">
            Connect and press Retry. To trace offline another time, turn on Keep Python for offline use in <a href="#/settings">Settings</a> while you’re online.
          </p>
          <button type="button" className="btn btn-line mt-2" onClick={() => void retryPython().catch(() => undefined)}>
            <RotateCcw size={16} aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>
    );
  }
  if (load.phase === 'failed') {
    return (
      <div className="notice" data-tone="bad" role="alert">
        <CircleAlert size={16} aria-hidden="true" />
        <div>
          <p>{load.message}</p>
          <button type="button" className="btn btn-line mt-2" onClick={() => void retryPython().catch(() => undefined)}>
            <RotateCcw size={16} aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>
    );
  }
  const downloading = load.phase === 'downloading';
  const share = downloading && load.total ? Math.round((load.loaded / load.total) * 100) : null;
  return (
    <div className="py-load" role="status" aria-live="polite">
      <p>
        {load.phase === 'starting' ? 'Starting Python.' : `Getting Python ready. It downloads once each visit, about ${megabytes(PYTHON_BYTES)} before compression.`}
        {share !== null ? ` ${share}%` : ''}
      </p>
      <LoadBar share={share} label={downloading ? 'Downloading Python' : 'Starting Python'} />
    </div>
  );
}

/** NumPy, pandas or Matplotlib loading before a program that imports them runs, or why they couldn't. */
function LibraryPanel({ state, onRetry }: { state: LibraryState; onRetry: () => void }) {
  if (state.phase === 'idle') return null;
  if (state.phase === 'offline') {
    return (
      <div className="notice" role="status">
        <Info size={16} aria-hidden="true" />
        <div>
          <p>This program uses {state.label}, which needs a connection the first time. You’re offline, and it isn’t saved on this device.</p>
          <p className="mt-1 text-ink-2">
            Connect and press Retry. To use it offline another time, turn on Also keep NumPy, pandas and Matplotlib in <a href="#/settings">Settings</a> while you’re online.
          </p>
          <button type="button" className="btn btn-line mt-2" onClick={onRetry}>
            <RotateCcw size={16} aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>
    );
  }
  if (state.phase === 'failed') {
    return (
      <div className="notice" data-tone="bad" role="alert">
        <CircleAlert size={16} aria-hidden="true" />
        <div>
          <p>
            {state.label} couldn’t load. {state.message}
          </p>
          <button type="button" className="btn btn-line mt-2" onClick={onRetry}>
            <RotateCcw size={16} aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>
    );
  }
  const share = state.phase === 'downloading' && state.total ? Math.round((state.loaded / state.total) * 100) : null;
  return (
    <div className="py-load" role="status" aria-live="polite">
      <p>
        {state.phase === 'installing'
          ? `Starting ${state.label}.`
          : state.total
            ? `Loading ${state.label}, about ${megabytes(state.total)}, the first time a program uses it this visit. ${share ?? 0}%`
            : `Loading ${state.label}.`}
      </p>
      <LoadBar share={share} label={state.phase === 'installing' ? `Starting ${state.label}` : `Loading ${state.label}`} />
    </div>
  );
}

function KeepOffer() {
  const save = useStore(pythonSaveStore);
  return (
    <div className="notice" role="region" aria-label="Keep Python for offline use">
      <Info size={16} aria-hidden="true" />
      <div>
        <p>Keep Python on this device, so the tracer works with no connection? It takes about {megabytes(PYTHON_BYTES)}. You can change this in Settings.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-line"
            onClick={() => {
              keepPythonStore.set(true);
              pythonOfferedStore.set(true);
            }}
          >
            Keep Python for offline use
          </button>
          <button type="button" className="btn btn-quiet" onClick={() => pythonOfferedStore.set(true)}>
            Not now
          </button>
        </div>
        {save.phase === 'failed' && <p className="mt-2">{save.message}</p>}
      </div>
    </div>
  );
}

function describeStep(run: PyRunResult, step: PyStep, at: number, total: number, atEnd: boolean): string {
  if (run.error?.kind === 'syntax') return `Python can’t run this program: line ${run.error.line} has an error.`;
  if (atEnd && step.event === 'end') return `Finished in ${run.totalSteps.toLocaleString('en-GB')} steps.`;
  if (atEnd && run.truncated && !run.error && !run.stopped) return `Finished in ${run.totalSteps.toLocaleString('en-GB')} steps.`;
  if (step.event === 'error') return `Stopped on line ${step.line}.`;
  if (step.event === 'stop') return `Stopped on line ${step.line}, as the program ran too long.`;
  const where = `Step ${at + 1} of ${total}.`;
  const top = step.frames[step.frames.length - 1];
  switch (step.event) {
    case 'call':
      return `${where} ${top?.fn}(${(top?.vars ?? []).map((v) => `${v.name}=${v.value}`).join(', ')}) is called, on line ${step.line}.`;
    case 'return':
      return `${where} ${top?.fn} returns ${step.detail ?? 'None'}, on line ${step.line}.`;
    case 'exception':
      return `${where} Line ${step.line} raises ${step.detail ?? 'an error'}.`;
    case 'unwind':
      return `${where} ${top?.fn} stops, and the error passes back to where it was called.`;
    default:
      return `${where} Line ${step.line} runs next.`;
  }
}

function Findings({ run, atEnd }: { run: PyRunResult; atEnd: boolean }) {
  const note = beyondNote(run.beyond);
  const libraries = libraryNote(run.libraries);
  const numpy = numpyNote(run.libraries);
  const plain = run.error ? explainError(run.error) : null;
  return (
    <>
      {libraries && (
        <p className="notice" data-testid="library-note">
          <Info size={16} aria-hidden="true" />
          <span>{libraries}</span>
        </p>
      )}
      {numpy && (
        <p className="notice" data-testid="numpy-int-note">
          <Info size={16} aria-hidden="true" />
          <span>{numpy}</span>
        </p>
      )}
      {note && (
        <p className="notice">
          <Info size={16} aria-hidden="true" />
          <span>{note}</span>
        </p>
      )}
      {run.error && (run.error.kind === 'syntax' || atEnd) && (
        <div className="notice" data-tone="bad">
          <CircleAlert size={16} aria-hidden="true" />
          <div>
            <p>
              <b>Line {run.error.line}.</b> <code className="py-error">{run.error.text}</code>
            </p>
            {plain && <p className="mt-1 py-plain">{plain}</p>}
          </div>
        </div>
      )}
      {run.stopped && atEnd && (
        <p className="notice" data-tone="bad">
          <CircleAlert size={16} aria-hidden="true" />
          <span>{stopMessage(run.stopped, LIMITS)}</span>
        </p>
      )}
      {run.truncated && atEnd && <p className="notice">Only the first {run.steps.length.toLocaleString('en-GB')} steps can be stepped through. The console shows everything the program printed.</p>}
      {run.droppedFigures > 0 && atEnd && (
        <p className="notice">
          The console shows the first {run.figures.length} charts. This program drew {run.droppedFigures} more.
        </p>
      )}
    </>
  );
}

function CallStack({ step, selected, onSelect }: { step?: PyStep; selected: number; onSelect: (i: number) => void }) {
  if (!step || !step.frames.length) return <p className="tool-empty">Nothing is running.</p>;
  // Innermost call first, as it would be drawn on paper.
  const frames = [...step.frames].reverse();
  const hidden = step.depth - step.frames.length;
  return (
    <ol className="call-stack">
      {frames.map((frame, i) => (
        <li key={`${i}-${frame.key}`}>
          {hidden > 0 && i === frames.length - 1 && <div className="call-skip">{hidden.toLocaleString('en-GB')} more calls</div>}
          <button type="button" aria-pressed={selected === i} onClick={() => onSelect(i)}>
            <code>{frame.fn}</code>
            <small>line {frame.line}</small>
          </button>
        </li>
      ))}
    </ol>
  );
}

const frameAt = (step: PyStep | undefined, index: number): PyFrame | undefined => (step ? step.frames[step.frames.length - 1 - index] : undefined);

/** What kind of thing two names share, in words. */
const SHARED_KINDS: Record<string, string> = { list: 'list', dict: 'dictionary', set: 'set', deque: 'deque', Counter: 'Counter', defaultdict: 'dictionary', OrderedDict: 'dictionary', ndarray: 'array', DataFrame: 'DataFrame', Series: 'Series' };
const sharedKind = (type: string) => SHARED_KINDS[type] ?? 'object';

function joinWords(words: string[]): string {
  return words.length < 2 ? (words[0] ?? '') : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
}

function sameNote(v: PyVar, step: PyStep, frameIndex: number): string | null {
  const notes: string[] = [];
  if (v.same?.length) {
    const names = v.same.map((p) => (p.frame === frameIndex ? p.path : `${p.path} in ${step.frames[p.frame]?.fn ?? ''}`));
    notes.push(`Same ${sharedKind(v.type)} as ${joinWords(names)}.`);
  }
  for (const group of v.inside ?? []) notes.push(`${joinWords(group)} are one list.`);
  if (v.shares?.length) {
    const names = v.shares.map((p) => (p.frame === frameIndex ? p.path : `${p.path} in ${step.frames[p.frame]?.fn ?? ''}`));
    notes.push(`Shares its data with ${joinWords(names)}, so changing one changes the other.`);
  }
  return notes.length ? notes.join(' ') : null;
}

const plural = (n: number, word: string) => `${n.toLocaleString('en-GB')} ${word}${n === 1 ? '' : 's'}`;

/** What a table holds, in words, as its caption. */
function viewCaption(view: PyView): string {
  if (view.kind === 'array') {
    const size = view.shape.length === 1 ? plural(view.shape[0], 'value') : `${view.shape.join(' × ')} array`;
    return `${size}, ${view.dtype}${view.slice ? `, showing ${view.slice}` : ''}`;
  }
  const shown = view.kind === 'frame' ? view.rows.length : view.values.length;
  const rows = view.kind === 'frame' ? `${plural(view.shape[0], 'row')} × ${plural(view.shape[1], 'column')}` : `${plural(view.shape[0], 'value')}, ${view.dtype}`;
  const name = view.kind === 'series' && view.name ? `${view.name}: ` : '';
  return `${name}${rows}${view.more > 0 ? `, the first ${shown} shown` : ''}`;
}

/** A NumPy array, DataFrame or Series in the variables table, as a small table of its first rows. */
function ValueTable({ view }: { view: PyView }) {
  const caption = viewCaption(view);
  if (view.kind === 'array') {
    const width = Math.max(...view.rows.map((r) => r?.length ?? 0));
    return (
      <table className="value-table" data-kind="array">
        <caption>{caption}</caption>
        <tbody>
          {view.rows.map((row, i) =>
            row ? (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ) : (
              <tr key={i} className="value-gap">
                <td colSpan={width}>⋮</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    );
  }
  if (view.kind === 'series') {
    return (
      <table className="value-table" data-kind="series">
        <caption>{caption}</caption>
        <tbody>
          {view.values.map((value, i) => (
            <tr key={i}>
              <th scope="row">{view.index[i]}</th>
              <td>{value}</td>
            </tr>
          ))}
          {view.more > 0 && (
            <tr className="value-gap">
              <td colSpan={2}>⋮ {plural(view.more, 'more value')}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
  return (
    <table className="value-table" data-kind="frame">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <td />
          {view.columns.map((column, i) => (
            <th key={i} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {view.rows.map((row, i) => (
          <tr key={i}>
            <th scope="row">{view.index[i]}</th>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
        {view.more > 0 && (
          <tr className="value-gap">
            <td colSpan={view.columns.length + 1}>⋮ {plural(view.more, 'more row')}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function VarTable({ frame, frameIndex, step, before, label }: { frame: PyFrame; frameIndex: number; step: PyStep; before?: PyFrame; label: string }) {
  const tableRef = useRef<HTMLDivElement>(null);
  useFlashChanged(tableRef, step);
  return (
    <div ref={tableRef} className="table-scroll" tabIndex={0} role="region" aria-label={label}>
      <table className="trace-table var-table py-vars">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {frame.vars.map((v) => {
            const note = sameNote(v, step, frameIndex);
            const was = before?.vars.find((b) => b.name === v.name);
            // A table's text is a summary, so its cells are compared too.
            const changed = Boolean(before) && (was?.value !== v.value || (Boolean(v.view) && JSON.stringify(was?.view) !== JSON.stringify(v.view)));
            return (
              <tr key={v.name}>
                <th scope="row">{v.name}</th>
                <td>{v.type}</td>
                <td data-changed={changed || undefined}>
                  {v.view ? (
                    <div className="value-scroll">
                      <ValueTable view={v.view} />
                    </div>
                  ) : (
                    v.value
                  )}
                  {note && <span className="var-same">{note}</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Variables({ step, previous, frameIndex }: { step?: PyStep; previous?: PyStep; frameIndex: number }) {
  const frame = frameAt(step, frameIndex);
  if (!step || !frame) return <p className="tool-empty">Variables appear here while the program runs.</p>;
  const index = step.frames.length - 1 - frameIndex;
  const before = previous?.frames.find((f) => f.key === frame.key);
  const program = step.frames[0];
  const showGlobals = index > 0 && program.vars.length > 0;
  return (
    <>
      {frame.vars.length ? (
        <VarTable frame={frame} frameIndex={index} step={step} before={before} label={frame.fn === '<module>' ? 'Table of variables' : `Table of ${frame.fn}’s variables`} />
      ) : (
        <p className="tool-empty">{frame.fn === '<module>' ? 'The program has no variables yet.' : `${frame.fn} has no variables yet.`}</p>
      )}
      {showGlobals && (
        <>
          <h3 className="var-sub">Global variables</h3>
          <VarTable frame={program} frameIndex={0} step={step} before={previous?.frames[0]} label="Table of global variables" />
        </>
      )}
    </>
  );
}

/** A chart as a picture: an SVG, crisp at any size, or a PNG for a very large one. */
function Chart({ figure }: { figure: PyFigure }) {
  const src = figure.mime === 'image/svg+xml' ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(figure.data)}` : `data:image/png;base64,${figure.data}`;
  return <img className="console-fig" src={src} alt={figure.alt} width={figure.width} height={figure.height} style={{ maxWidth: `${figure.width}px` }} />;
}

/** The console as a terminal shows it: the program's output, with what was typed after each prompt, and its charts. */
function ConsoleText({ output, extras, figures, upTo, at, atEnd }: { output: string; extras: ConsoleExtra[]; figures: PyFigure[]; upTo: number; at: number; atEnd: boolean }) {
  const parts: ReactNode[] = [];
  let from = 0;
  extras.forEach((extra, i) => {
    if (!atEnd && (extra.step > at || extra.at > upTo)) return;
    if (extra.at > from) parts.push(output.slice(from, extra.at));
    from = Math.max(from, extra.at);
    if (extra.kind === 'warn') {
      // A line of its own, even after output that hasn't ended its line.
      parts.push(
        <span key={i} className="console-warn" role="note" data-testid="overflow-warning">
          <span aria-hidden="true">⚠ </span>
          {extra.text}
        </span>,
      );
    } else if (extra.kind === 'fig') {
      const figure = figures[Number(extra.text)];
      if (figure) parts.push(<Chart key={i} figure={figure} />);
    } else if (extra.kind === 'in') parts.push(<span key={i} className="console-in">{`${extra.text}\n`}</span>);
    else if (extra.kind === 'eof') parts.push(<span key={i} className="console-err">{'(no more input)\n'}</span>);
    else parts.push(<span key={i} className="console-err">{extra.text}</span>);
  });
  parts.push(output.slice(from, upTo));
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  );
}
