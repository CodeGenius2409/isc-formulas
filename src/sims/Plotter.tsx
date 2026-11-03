import { useCallback, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Maximize, Minus, Plus, Trash2 } from 'lucide-react';
import { Math as MathTex } from '../components/Math';
import { GraphCursor, type GraphCursorHandle } from './GraphCursor';
import { derivative, integrate, roots } from './lib/calculus';
import { readLines, type GraphLine } from './lib/graph-input';
import { CARET, SymbolKeypad } from './SymbolKeypad';
import { formatPoint, intersectionPoints, placeLabels, type Curve, type GraphPoint } from './lib/graph-analysis';
import { Canvas, drawPlot, makeViewport, token, type Marker, type PlotModel, type Series, type Viewport } from './lib/plot';
import { fmt, Legend, Slider, Toggle, ToolLayout } from './lib/ui';

const COLOURS = ['physics', 'accent', 'chemistry', 'mathematics', 'computerscience'];

interface FnRow {
  id: number;
  source: string;
}

interface Compiled {
  row: FnRow;
  line: GraphLine;
  fn: ((x: number) => number) | null;
  error?: string;
  color: string;
}

function compile(rows: FnRow[]): Compiled[] {
  const lines = readLines(rows.map((r) => r.source));
  return rows.map((row, i) => {
    const line = lines[i];
    const color = COLOURS[i % COLOURS.length];
    if (line.kind === 'empty') return { row, line, fn: null, color };
    if (line.kind === 'error') return { row, line, fn: null, color, error: line.message };
    return { row, line, fn: line.fn, color };
  });
}

/** Four decimal places, without a −0.0000. */
const area4 = (v: number) => (Math.abs(v) < 5e-5 ? '0.0000' : v.toFixed(4).replace('-', '−'));

/** What this line was understood as, set as maths, with a word on anything worth knowing. */
function LinePreview({ line, name }: { line: GraphLine; name: string }) {
  if (line.kind === 'empty' || line.kind === 'error') return null;
  return (
    <div className="plot-preview" data-testid={`preview-${name}`}>
      <div className="math-host">
        <MathTex latex={line.tex} />
      </div>
      {line.kind === 'derivative' && !line.symbolic && <p>No formula for this one, so this is a numeric curve.</p>}
      {line.kind === 'indefinite' && !line.symbolic && <p>Found numerically. The curve is drawn with F({line.from}) = 0, and any constant + C can be added.</p>}
      {line.kind === 'indefinite' && line.symbolic && <p>The curve drawn is the one with C = 0.</p>}
      {line.kind === 'definite' &&
        (line.result.value === null ? (
          <p role="status">This integral does not converge, so it has no value.</p>
        ) : (
          <p data-testid={`area-${name}`}>
            Value <b className="num">{area4(line.result.value)}</b>: <span className="num">{area4(line.result.above)}</span> above the axis, take away <span className="num">{area4(line.result.below)}</span> below it.
          </p>
        ))}
    </div>
  );
}

const DEFAULT_VIEW = { x: [-10, 10] as [number, number], y: [-6, 6] as [number, number] };

const CROSSINGS_KEY = 'isc-plot-intersections';

/** Remembered for the session. Storage can be blocked, and then it just starts on. */
function readCrossings(): boolean {
  try {
    return sessionStorage.getItem(CROSSINGS_KEY) !== 'off';
  } catch {
    return true;
  }
}

function saveCrossings(on: boolean): void {
  try {
    sessionStorage.setItem(CROSSINGS_KEY, on ? 'on' : 'off');
  } catch {
    // The choice just won't outlast this page.
  }
}

/**
 * Labels points on the graph, clear of other labels, dots and curves. The first ones placed get the best
 * spots, so the tangent's slope goes before the intersections. Labels with no room are left out, and the
 * graph says so: every point is still in the readouts, and pointing at it reads it.
 */
function drawPointLabels(ctx: CanvasRenderingContext2D, v: Viewport, points: { x: number; y: number; text: string }[], curves: Curve[]): void {
  ctx.save();
  ctx.font = "12px 'Atkinson Hyperlegible Mono Variable', ui-monospace, monospace";
  const shown = points.filter((p) => v.toPx(p.x) >= v.left && v.toPx(p.x) <= v.right && v.toPy(p.y) >= v.top && v.toPy(p.y) <= v.bottom);
  const texts = shown.map((p) => p.text);
  const requests = shown.map((p, i) => ({ px: v.toPx(p.x), py: v.toPy(p.y), width: ctx.measureText(texts[i]).width + 4, height: 16 }));
  const bounds = { x: v.left + 2, y: v.top + 2, w: v.right - v.left - 4, h: v.bottom - v.top - 4 };
  const hitsCurve = (box: { x: number; y: number; w: number; h: number }) => {
    let hits = 0;
    for (const curve of curves) {
      for (let px = box.x; px <= box.x + box.w; px += 4) {
        const py = v.toPy(curve.fn(v.fromPx(px)));
        if (py >= box.y && py <= box.y + box.h) hits++;
      }
    }
    return hits;
  };
  let placed = placeLabels(requests, bounds, hitsCurve);
  // The note about hidden labels needs a strip of its own at the top.
  if (placed.length < shown.length) placed = placeLabels(requests, { ...bounds, y: bounds.y + 18, h: bounds.h - 18 }, hitsCurve);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  for (const { box, index } of placed) {
    // A halo keeps a label readable if a curve has to run behind it.
    ctx.strokeStyle = token('paper');
    ctx.lineWidth = 3;
    ctx.strokeText(texts[index], box.x + 2, box.y + box.h / 2);
    ctx.fillStyle = token('ink');
    ctx.fillText(texts[index], box.x + 2, box.y + box.h / 2);
  }
  const hidden = shown.length - placed.length;
  if (hidden > 0) {
    const note = `${hidden} ${hidden === 1 ? 'label' : 'labels'} hidden: zoom in`;
    const width = ctx.measureText(note).width;
    ctx.fillStyle = token('paper');
    ctx.fillRect(v.right - width - 8, v.top + 2, width + 6, 16);
    ctx.fillStyle = token('ink-2');
    ctx.fillText(note, v.right - width - 5, v.top + 10);
  }
  ctx.restore();
}

export function Plotter() {
  const [rows, setRows] = useState<FnRow[]>([
    { id: 1, source: 'sin(x)' },
    { id: 2, source: 'x^2/4 - 1' },
  ]);
  const nextId = useRef(3);
  const [view, setView] = useState(DEFAULT_VIEW);
  const [showDerivative, setShowDerivative] = useState(false);
  const [showTangent, setShowTangent] = useState(true);
  const [x0, setX0] = useState(1);
  const [showArea, setShowArea] = useState(false);
  const [areaA, setAreaA] = useState(0);
  const [areaB, setAreaB] = useState(3);
  const [showCrossings, setShowCrossings] = useState(readCrossings);
  const size = useRef({ w: 800, h: 400 });
  const drag = useRef<{ pointer: number; x: number; y: number; view: typeof view } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; centre: { x: number; y: number }; view: typeof view } | null>(null);
  const cursor = useRef<GraphCursorHandle>(null);

  const compiled = useMemo(() => compile(rows), [rows]);
  const inputs = useRef(new Map<number, HTMLInputElement>());
  const lastInput = useRef<number | null>(null);
  const pendingCaret = useRef<{ id: number; start: number; end: number } | null>(null);

  // Puts the cursor where a keypad insert wants it, once the new text is in the box.
  useLayoutEffect(() => {
    const pending = pendingCaret.current;
    if (!pending) return;
    pendingCaret.current = null;
    const input = inputs.current.get(pending.id);
    if (!input) return;
    input.focus();
    input.setSelectionRange(pending.start, pending.end);
  });

  const insert = (template: string) => {
    const id = lastInput.current ?? rows[0].id;
    const input = inputs.current.get(id);
    const row = rows.find((r) => r.id === id);
    if (!input || !row) return;
    const start = input.selectionStart ?? row.source.length;
    const end = input.selectionEnd ?? row.source.length;
    const selected = row.source.slice(start, end);
    // Calculus keys take the whole line as their subject, since they only work at the start of a line.
    const wraps = /^(∫|d\/dx)/.test(template) && !selected && row.source.trim() && start === row.source.length;
    const before = wraps ? '' : row.source.slice(0, start);
    const after = wraps ? '' : row.source.slice(end);
    const inner = wraps ? row.source.trim() : selected;
    const at = template.indexOf(CARET);
    const text = at < 0 ? template : template.replace(CARET, inner);
    const caret = before.length + (at < 0 ? text.length : at + inner.length);
    pendingCaret.current = { id, start: caret, end: caret };
    setRows((list) => list.map((r) => (r.id === id ? { ...r, source: before + text + after } : r)));
  };
  const active = compiled.filter((c): c is Compiled & { fn: (x: number) => number } => c.fn !== null);
  const first = active[0];

  const curves: Curve[] = useMemo(() => compiled.flatMap((c, i) => (c.fn ? [{ name: `f${i + 1}`, fn: c.fn, color: c.color }] : [])), [compiled]);
  const crossings = useMemo(() => intersectionPoints(curves, view.x[0], view.x[1]), [curves, view.x]);
  const inView = crossings.filter((p) => p.y >= view.y[0] && p.y <= view.y[1]);

  const zeros = useMemo(() => (first ? roots(first.fn, view.x[0], view.x[1]) : []), [first, view.x]);

  const slope = first ? derivative(first.fn, x0) : NaN;
  const y0 = first ? first.fn(x0) : NaN;
  const area = first && showArea ? integrate(first.fn, Math.min(areaA, areaB), Math.max(areaA, areaB)) * (areaA <= areaB ? 1 : -1) : NaN;

  const series: Series[] = active.map((c) => ({ fn: c.fn, color: c.color }));
  if (first && showDerivative) series.push({ fn: (x) => derivative(first.fn, x), color: first.color, dash: true, width: 1.5 });
  if (first && showTangent && Number.isFinite(slope)) series.push({ fn: (x) => y0 + slope * (x - x0), color: 'ink-2', width: 1 });

  const markers: Marker[] = [];
  if (first && showTangent && Number.isFinite(y0)) markers.push({ x: x0, y: y0, color: 'ink' });
  if (showCrossings) inView.forEach((c) => markers.push({ x: c.x, y: c.y, color: 'accent' }));

  const model: PlotModel = {
    x: view.x,
    y: view.y,
    series,
    markers,
    signedAreas: compiled.flatMap((c) => (c.line.kind === 'definite' && c.line.result.value !== null && c.fn ? [{ fn: c.fn, a: Math.min(c.line.a, c.line.b), b: Math.max(c.line.a, c.line.b), color: c.color }] : [])),
    vlines: compiled.flatMap((c) => (c.line.kind === 'definite' ? [c.line.a, c.line.b].filter(Number.isFinite).map((x) => ({ x, color: c.color })) : [])),
    area: first && showArea ? { fn: first.fn, a: Math.min(areaA, areaB), b: Math.max(areaA, areaB), color: first.color } : undefined,
    xLabel: 'x',
    yLabel: 'y',
  };

  const zoom = useCallback((factor: number, cx?: number, cy?: number) => {
    setView((v) => {
      const mx = cx ?? (v.x[0] + v.x[1]) / 2;
      const my = cy ?? (v.y[0] + v.y[1]) / 2;
      return {
        x: [mx + (v.x[0] - mx) * factor, mx + (v.x[1] - mx) * factor],
        y: [my + (v.y[0] - my) * factor, my + (v.y[1] - my) * factor],
      };
    });
  }, []);

  const pan = useCallback((fx: number, fy: number) => {
    setView((v) => {
      const dx = (v.x[1] - v.x[0]) * fx;
      const dy = (v.y[1] - v.y[0]) * fy;
      return { x: [v.x[0] + dx, v.x[1] + dx], y: [v.y[0] + dy, v.y[1] + dy] };
    });
  }, []);

  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setView((v) => {
        const vp = makeViewport(v, rect.width, rect.height);
        const mx = vp.fromPx(e.clientX - rect.left);
        const my = vp.fromPy(e.clientY - rect.top);
        const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15;
        return {
          x: [mx + (v.x[0] - mx) * factor, mx + (v.x[1] - mx) * factor],
          y: [my + (v.y[0] - my) * factor, my + (v.y[1] - my) * factor],
        };
      });
    },
    [],
  );

  /** One finger reads the graph, and two move and zoom it, since a page can't tell a read from a pan. */
  const readAtPointer = (e: PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cursor.current?.point(e.clientX - rect.left, e.clientY - rect.top, e.pointerType === 'touch' ? 24 : 14);
  };

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), centre: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, view };
      drag.current = null;
      cursor.current?.clear();
    } else if (e.pointerType === 'touch') {
      readAtPointer(e);
    } else {
      drag.current = { pointer: e.pointerId, x: e.clientX, y: e.clientY, view };
      cursor.current?.clear();
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!pointers.current.has(e.pointerId)) {
      if (e.pointerType !== 'touch') readAtPointer(e);
      return;
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const rect = e.currentTarget.getBoundingClientRect();
    size.current = { w: rect.width, h: rect.height };
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const factor = pinch.current.dist / Math.max(Math.hypot(a.x - b.x, a.y - b.y), 1);
      const start = pinch.current.view;
      const startV = makeViewport(start, rect.width, rect.height);
      // The two fingers' midpoint carries the graph with it, and their spread zooms about that point.
      const mx = startV.fromPx(pinch.current.centre.x - rect.left);
      const my = startV.fromPy(pinch.current.centre.y - rect.top);
      const shiftX = (((a.x + b.x) / 2 - pinch.current.centre.x) / (startV.right - startV.left)) * (start.x[1] - start.x[0]) * factor;
      const shiftY = (((a.y + b.y) / 2 - pinch.current.centre.y) / (startV.bottom - startV.top)) * (start.y[1] - start.y[0]) * factor;
      setView({
        x: [mx + (start.x[0] - mx) * factor - shiftX, mx + (start.x[1] - mx) * factor - shiftX],
        y: [my + (start.y[0] - my) * factor + shiftY, my + (start.y[1] - my) * factor + shiftY],
      });
      return;
    }
    if (e.pointerType === 'touch') {
      readAtPointer(e);
      return;
    }
    if (!drag.current || drag.current.pointer !== e.pointerId) return;
    const { view: start } = drag.current;
    const vp = makeViewport(start, rect.width, rect.height);
    const dx = ((e.clientX - drag.current.x) / (vp.right - vp.left)) * (start.x[1] - start.x[0]);
    const dy = ((e.clientY - drag.current.y) / (vp.bottom - vp.top)) * (start.y[1] - start.y[0]);
    setView({ x: [start.x[0] - dx, start.x[1] - dx], y: [start.y[0] + dy, start.y[1] + dy] });
  };

  // Every way a pointer can end must clear its state, or the next drag starts wrong.
  const endPointer = (e: PointerEvent<HTMLCanvasElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (drag.current?.pointer === e.pointerId) drag.current = null;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const panning: Record<string, () => void> = {
      ArrowLeft: () => pan(-0.1, 0),
      ArrowRight: () => pan(0.1, 0),
      ArrowUp: () => pan(0, 0.1),
      ArrowDown: () => pan(0, -0.1),
    };
    const reading: Record<string, () => void> = {
      ArrowLeft: () => cursor.current?.step(-1),
      ArrowRight: () => cursor.current?.step(1),
      ArrowUp: () => cursor.current?.jump(1),
      ArrowDown: () => cursor.current?.jump(-1),
    };
    const moves: Record<string, () => void> = {
      ...(e.shiftKey ? panning : reading),
      Escape: () => cursor.current?.clear(),
      '+': () => zoom(1 / 1.2),
      '=': () => zoom(1 / 1.2),
      '-': () => zoom(1.2),
      '0': () => setView(DEFAULT_VIEW),
    };
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      move();
    }
  };

  const spanX = view.x[1] - view.x[0];

  return (
    <ToolLayout
      controls={
        <>
          <fieldset className="m-0 border-0 p-0">
            <legend className="lbl">Functions of x</legend>
            {compiled.map((c, i) => (
              <div key={c.row.id} className="mb-1">
                <div className="flex items-center gap-1">
                  <span aria-hidden className="num w-7 flex-none text-step--1" style={{ color: `var(--${c.color})` }}>
                    f{i + 1}
                  </span>
                  <input
                    ref={(el) => {
                      if (el) inputs.current.set(c.row.id, el);
                      else inputs.current.delete(c.row.id);
                    }}
                    onFocus={() => {
                      lastInput.current = c.row.id;
                    }}
                    className="field num"
                    aria-label={`Function ${i + 1}`}
                    autoComplete="off"
                    spellCheck={false}
                    value={c.row.source}
                    aria-invalid={Boolean(c.error)}
                    onChange={(e) => setRows((list) => list.map((r) => (r.id === c.row.id ? { ...r, source: e.target.value } : r)))}
                  />
                  <button type="button" className="btn btn-quiet flex-none" aria-label={`Remove function ${i + 1}`} disabled={rows.length === 1} onClick={() => setRows((list) => list.filter((r) => r.id !== c.row.id))}>
                    <Trash2 size={15} aria-hidden />
                  </button>
                </div>
                {c.error && (
                  <p className="var-warn mt-1" role="alert" data-testid={`error-f${i + 1}`}>
                    {c.error}
                  </p>
                )}
                <LinePreview line={c.line} name={`f${i + 1}`} />
              </div>
            ))}
            <button type="button" className="btn btn-line mt-1" disabled={rows.length >= 5} onClick={() => setRows((list) => [...list, { id: nextId.current++, source: '' }])}>
              <Plus size={15} aria-hidden /> Add a function
            </button>
          </fieldset>

          <SymbolKeypad onInsert={insert} />

          <Toggle label="Show f1's derivative" checked={showDerivative} onChange={setShowDerivative} />
          <Toggle label="Tangent to f1" checked={showTangent} onChange={setShowTangent} />
          {showTangent && <Slider label="Tangent at x" value={Math.min(Math.max(x0, view.x[0]), view.x[1])} min={view.x[0]} max={view.x[1]} step={spanX / 400} format={(v) => v.toFixed(2)} onChange={setX0} />}
          <Toggle label="Area under f1" checked={showArea} onChange={setShowArea} />
          {showArea && (
            <>
              <Slider label="From a" value={areaA} min={view.x[0]} max={view.x[1]} step={spanX / 400} format={(v) => v.toFixed(2)} onChange={setAreaA} />
              <Slider label="To b" value={areaB} min={view.x[0]} max={view.x[1]} step={spanX / 400} format={(v) => v.toFixed(2)} onChange={setAreaB} />
            </>
          )}
          <button
            type="button"
            className="btn btn-line w-full"
            aria-pressed={showCrossings}
            onClick={() => {
              saveCrossings(!showCrossings);
              setShowCrossings(!showCrossings);
            }}
          >
            {showCrossings ? 'Hide intersections' : 'Show intersections'}
          </button>

          <dl className="readouts" aria-live="polite">
            {first && showTangent && (
              <>
                <dt>f1({x0.toFixed(2)})</dt>
                <dd>{fmt(y0)}</dd>
                <dt>Slope there</dt>
                <dd>{fmt(slope)}</dd>
              </>
            )}
            {first && showArea && (
              <>
                <dt>Signed area</dt>
                <dd>{fmt(area)}</dd>
              </>
            )}
            {first && (
              <>
                <dt>Roots of f1 in view</dt>
                <dd>{zeros.length ? zeros.slice(0, 5).map((z) => fmt(z, 3)).join(', ') : 'none'}</dd>
              </>
            )}
            {showCrossings && active.length > 1 && (
              <>
                <dt>Intersections</dt>
                <dd data-testid="crossings">{inView.length ? inView.slice(0, 6).map((c) => formatPoint(c.x, c.y)).join(' ') + (inView.length > 6 ? ` and ${inView.length - 6} more` : '') : 'none in view'}</dd>
              </>
            )}
          </dl>
        </>
      }
    >
      <Canvas
        interactive
        height={420}
        label="Graph of the functions listed. Point at it to read coordinates. Drag to pan, scroll or pinch to zoom. With the keyboard, left and right arrows move along x and read each curve, up and down jump between intersections, roots and turning points, shift and an arrow pans, plus and minus zoom, and zero resets."
        draw={(ctx, w, h) => {
          const v = drawPlot(ctx, w, h, model);
          const labels = showCrossings ? inView.map((p: GraphPoint) => ({ x: p.x, y: p.y, text: formatPoint(p.x, p.y) })) : [];
          if (first && showTangent && Number.isFinite(y0)) labels.unshift({ x: x0, y: y0, text: `slope ${fmt(slope, 3)}` });
          drawPointLabels(ctx, v, labels, curves);
        }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onPointerLeave={(e) => {
          if (e.pointerType !== 'touch') cursor.current?.clear();
        }}
        onBlur={() => cursor.current?.clear()}
        onKeyDown={onKeyDown}
      >
        <GraphCursor ref={cursor} view={view} curves={curves} />
      </Canvas>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-line" aria-label="Zoom in" onClick={() => zoom(1 / 1.3)}>
          <Plus size={16} aria-hidden />
        </button>
        <button type="button" className="btn btn-line" aria-label="Zoom out" onClick={() => zoom(1.3)}>
          <Minus size={16} aria-hidden />
        </button>
        <button type="button" className="btn btn-line" onClick={() => setView(DEFAULT_VIEW)}>
          <Maximize size={15} aria-hidden /> Reset view
        </button>
        <span className="text-step--1 text-ink-2">Point at the graph to read it. On a touch screen, press and drag to read, and use two fingers to move or zoom. Otherwise drag to move, and scroll to zoom. With the keyboard, focus the graph and use the arrow keys.</span>
      </div>
      <Legend items={[...active.map((c) => ({ label: c.line.kind === 'indefinite' ? `${c.row.source} + C` : c.row.source, color: c.color })), ...(first && showDerivative ? [{ label: "f1'(x)", color: first.color, dash: true }] : [])]} />
      <p className="mt-2 text-step--1 text-ink-2">
        Write functions as <code>sin x</code>, <code>2x^2 + 3x</code>, <code>exp(-x)</code>, <code>|x|</code>, or <code>log(x)</code> and <code>ln(x)</code>, which are both natural logs here (use <code>log10(x)</code> for base 10). For calculus, write <code>d/dx(x^3 sin(x))</code>, <code>∫ from 0 to π of sin(x)</code>, or <code>∫ x^2</code>. Earlier lines can be used as <code>f1</code>, as in <code>derivative of f1</code>.
      </p>
    </ToolLayout>
  );
}
