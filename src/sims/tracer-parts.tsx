// What the Java and Python tracers share: the code pane with its current line, the step buttons, the playing
// speed and the dry-run table. Each tracer keeps its own call stack and variables, as the languages differ.
import { useEffect, useMemo, useRef, type KeyboardEvent } from 'react';
import { Pause, Play, SkipBack, SkipForward, StepBack, StepForward } from 'lucide-react';
import { JavaTokens } from '../components/JavaCode';
import type { TraceRow } from '../java/trace';
import { tokenizeJava, type Token } from '../java/tokens';

export const SHOWN_ROWS = 200;

/** Tokens grouped by line, for a pane that draws one line at a time. Java's unless another tokeniser is given. */
export function tokenizeLines(code: string, tokenize: (code: string) => Token[] = tokenizeJava): Token[][] {
  const lines: Token[][] = [[]];
  for (const token of tokenize(code)) {
    token.text.split('\n').forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ text: part, kind: token.kind });
    });
  }
  return lines;
}

export const SPEEDS = [
  { id: 'slow', label: 'Slow', ms: 900 },
  { id: 'normal', label: 'Normal', ms: 400 },
  { id: 'fast', label: 'Fast', ms: 120 },
];

export function CodeView({ code, currentLine, errorLine, onKeyDown, tokenize }: { code: string; currentLine?: number; errorLine?: number; onKeyDown: (e: KeyboardEvent) => void; tokenize?: (code: string) => Token[] }) {
  const pane = useRef<HTMLDivElement>(null);
  const lines = useMemo(() => tokenizeLines(code, tokenize), [code, tokenize]);

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
      {lines.map((tokens, i) => (
        <div key={i} className="code-line" data-current={currentLine === i + 1 || undefined} data-error={errorLine === i + 1 || undefined}>
          <span>{i + 1}</span>
          <code>{tokens.length ? <JavaTokens tokens={tokens} /> : ' '}</code>
        </div>
      ))}
    </div>
  );
}

export function StepControls({ at, last, playing, goTo, setPlaying }: { at: number; last: number; playing: boolean; goTo: (i: number) => void; setPlaying: (p: boolean | ((p: boolean) => boolean)) => void }) {
  return (
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
  );
}

export function SpeedPicker({ speed, setSpeed }: { speed: string; setSpeed: (id: string) => void }) {
  return (
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
  );
}

interface DryRunProps {
  /** The id of the section's heading. */
  id: string;
  rows: TraceRow[];
  columns: string[];
  /** How many rows exist at the step being shown. */
  count: number;
  /** What to say when there is no table at all. */
  empty: string;
  /** Extra words after the explanation of what a row is. */
  note?: string;
  /** What the language calls a method: Java says method, Python says function. */
  method?: string;
}

export function DryRun({ id, rows: all, columns, count, empty, note, method = 'Method' }: DryRunProps) {
  const box = useRef<HTMLDivElement>(null);
  const rows: TraceRow[] = all.slice(Math.max(count - SHOWN_ROWS, 0), count);
  const multiMethod = new Set(all.map((r) => r.method)).size > 1;

  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [count]);

  return (
    <section aria-labelledby={id} className="tracer-dry">
      <h2 id={id} className="tool-h">
        Dry run
      </h2>
      {!columns.length ? (
        <p className="tool-empty">{empty}</p>
      ) : (
        <>
          <p className="tool-hint">
            One row each time a loop's condition is tested or a variable changes. Bold marks what changed.{note ? ` ${note}` : ''}
            {count > SHOWN_ROWS ? ` Showing the latest ${SHOWN_ROWS} of ${count.toLocaleString('en-GB')} rows.` : ''}
          </p>
          <div ref={box} className="table-scroll" tabIndex={0} role="region" aria-labelledby={id}>
            <table className="trace-table">
              <thead>
                <tr>
                  <th scope="col">Line</th>
                  {multiMethod && <th scope="col">{method}</th>}
                  {columns.map((c) => (
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
                    <td colSpan={columns.length + (multiMethod ? 4 : 3)} className="trace-wait">
                      Step into a loop to fill this in.
                    </td>
                  </tr>
                )}
                {rows.map((row, i) => (
                  <tr key={count - rows.length + i} data-current={i === rows.length - 1 || undefined}>
                    <td>{row.line}</td>
                    {multiMethod && <td>{row.method}</td>}
                    {columns.map((c) => (
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
